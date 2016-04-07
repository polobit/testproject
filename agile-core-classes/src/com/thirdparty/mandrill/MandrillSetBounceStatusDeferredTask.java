package com.thirdparty.mandrill;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.EmailBounceTriggerUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

@SuppressWarnings("serial")
public class MandrillSetBounceStatusDeferredTask implements DeferredTask {
	
	public static final String EVENT = "event";
    public static final String HARD_BOUNCE = "hard_bounce";
    public static final String SOFT_BOUNCE = "soft_bounce";
    public static final String SPAM = "spam";

    public static final String MSG = "msg";
    public static final String EMAIL = "email";
    public static final String SUBACCOUNT = "subaccount";
    public static final String SUBJECT = "subject";
    public static final String METADATA = "metadata";
    public static final String METADATA_CAMPAIGN_ID = "campaign_id";
    
	/**
	 * Event JSON.
	 */
	String eventJSON;

	public MandrillSetBounceStatusDeferredTask(String eventJSON){
		//try {
			this.eventJSON = eventJSON;
		/*} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
	}

	@Override
	public void run() {
		// TODO Auto-generated method stub
		String oldNamespace = NamespaceManager.get();
		JSONObject metadata = null;
		String subject = null;
		JSONObject jsonObject = new JSONObject();
		try {
			jsonObject = new JSONObject(eventJSON);
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		try
		{
		    if (!jsonObject.has(MSG))
			return;

		    JSONObject msgJSON = jsonObject.getJSONObject(MSG);

		    // If no subaccount or email, return
		    if (!msgJSON.has(SUBACCOUNT) || !msgJSON.has(EMAIL))
			return;

		    // Return if empty namespace
		    if (StringUtils.isBlank(msgJSON.getString(SUBACCOUNT)))
			return;

		    NamespaceManager.set(msgJSON.getString(SUBACCOUNT));

		    // Get mandrill metadata
		    if (msgJSON.has(METADATA))
			metadata = msgJSON.getJSONObject(METADATA);

		    // Get email subject
		    if (msgJSON.has(SUBJECT))
			subject = msgJSON.getString(SUBJECT);

		    // By default SOFT_BOUNCE
		    EmailBounceType type = EmailBounceType.SOFT_BOUNCE;

		    if (HARD_BOUNCE.equals(jsonObject.getString(EVENT)))
			type = EmailBounceType.HARD_BOUNCE;

		    if (SPAM.equals(jsonObject.getString(EVENT)))
			type = EmailBounceType.SPAM;

		    // Set status to Agile Contact
		    setContactEmailBounceStatus(msgJSON.getString(EMAIL), subject, type, metadata);
		    
		    // If spam, verify reputation
		    if(type.equals(EmailBounceType.SPAM))
			MandrillSubAccounts.checkReputation(msgJSON.getString(SUBACCOUNT));

		}
		catch (Exception e)
		{
		    System.err.println("Exception occured while setting email bounce status..." + e.getMessage());
		    e.printStackTrace();
		}
		finally
		{
		    NamespaceManager.set(oldNamespace);
		}
		
	}
	
	/**
     * Set bounce status to contact having obtained email
     * 
     * @param email
     *            - bounced email-id
     * @param emailBounceType
     *            - Hard Bounce or SoftBounce
     */
    private void setContactEmailBounceStatus(String email, String emailSubject, EmailBounceType emailBounceType,
	    JSONObject metadata)
    {
	String campaignId = null;

	try
	{

	    if (metadata != null && metadata.has(METADATA_CAMPAIGN_ID))
		campaignId = metadata.getString(METADATA_CAMPAIGN_ID);

	    boolean isNew = true;

	    Contact contact = ContactUtil.searchContactByEmail(email);

	    if (contact == null)
	    {
		System.err.println("Contact didn't exist having email " + email);
		return;
	    }

	    // Set log
	    setCampaignLog(campaignId, contact.id.toString(), email, emailSubject, emailBounceType);

	    List<EmailBounceStatus> emailBounceList = contact.emailBounceStatus;

	    for (EmailBounceStatus emailBounceStatus : emailBounceList)
	    {
		if (email.equals(emailBounceStatus.email))
		{
		    emailBounceStatus.emailBounceType = emailBounceType;
		    emailBounceStatus.time = System.currentTimeMillis() / 1000;

		    if (campaignId != null)
			emailBounceStatus.campaign_id = campaignId;

		    isNew = false;
		    break;
		}
	    }

	    if (isNew)
	    {
		EmailBounceStatus emailBounceStatus = new EmailBounceStatus(email, emailBounceType);

		if (campaignId != null)
		    emailBounceStatus.campaign_id = campaignId;

		contact.emailBounceStatus.add(emailBounceStatus);
	    }

	    contact.updated_time = System.currentTimeMillis()/1000;
	    contact.update();

		// Execute trigger
	    executeTriggerForBounce(contact, emailBounceType);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while saving contact..." + e.getMessage());
	    e.printStackTrace();
	}
    }
    
    /**
     * Sets bounce log
     * 
     * @param campaignId
     *            - campaign-id
     * @param subscriberId
     *            - contact id
     * @param email
     *            - contact email bounced
     * @param emailSubject
     *            - email subject
     * @param emailBounceType
     *            - Hard or Soft
     */
    public static void setCampaignLog(String campaignId, String subscriberId, String email, String emailSubject,
	    EmailBounceType emailBounceType)
    {

	// if campaign-id empty
	if (StringUtils.isBlank(campaignId))
	    return;

	try
	{
	    String logType = LogType.EMAIL_HARD_BOUNCED.toString();
	    String message = "There was a hard bounce on email \'" + email + "\' <br><br> Email subject: "
		    + emailSubject;

	    if (emailBounceType.equals(EmailBounceType.SOFT_BOUNCE))
	    {
		message = "There was a soft bounce on email \'" + email + "\' <br><br> Email subject: " + emailSubject;
		logType = LogType.EMAIL_SOFT_BOUNCED.toString();
	    }

	    if (emailBounceType.equals(EmailBounceType.SPAM))
	    {
		message = "There was a spam complaint from email \'" + email + "\' <br><br> Email subject: "
		        + emailSubject;
		logType = LogType.EMAIL_SPAM.toString();
	    }

	    LogUtil.addLogToSQL(campaignId, subscriberId, message, logType);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while setting bounce log..." + e.getMessage());
	}
    }

    /**
     * Executes trigger for email bounce
     * 
     * @param contact
     *            - Bounced email contact
     * @param emailBounceType
     *            - Soft or Hard bounce
     */
    public static void executeTriggerForBounce(Contact contact, EmailBounceType emailBounceType)
    {
	// Trigger for Soft Bounce
	if (emailBounceType.equals(EmailBounceType.SOFT_BOUNCE))
	    EmailBounceTriggerUtil.executeTriggerForBounce(contact, Trigger.Type.SOFT_BOUNCE);

	// Trigger for Hard Bounce
	if (emailBounceType.equals(EmailBounceType.HARD_BOUNCE))
	    EmailBounceTriggerUtil.executeTriggerForBounce(contact, Trigger.Type.HARD_BOUNCE);
	
	// Trigger for SPAM
	if (emailBounceType.equals(EmailBounceType.SPAM))
	    EmailBounceTriggerUtil.executeTriggerForBounce(contact, Trigger.Type.SPAM_REPORT);

    }
}
