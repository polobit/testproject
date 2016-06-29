package com.thirdparty.mailgun.webhook;

import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
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
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;
import com.thirdparty.sendgrid.webhook.SendGridInboundWebhook;

/**
 * <code>MailgunWebhook</code> is the webhook servlet to handle hard bounce,
 * soft bounce and spam
 * 
 * @author Prashannjeet
 * 
 */
@SuppressWarnings("serial")
public class MailgunWebhook extends HttpServlet
{
	
    public static final String EVENT = "event";
    public static final String HARD_BOUNCE = "bounced";
    public static final String SOFT_BOUNCE = "dropped";
    public static final String SPAM = "complained";

    public static final String MSG = "message-headers";
    public static final String EMAIL = "recipient";
    public static final String SUBACCOUNT = "subaccount";
    public static final String SUBJECT = "Subject";

    public static final String METADATA = "metadata";
    public static final String METADATA_CAMPAIGN_ID = "campaign_id";
    
    public static final String ERROR_CODE = "code";
    
    public static final String REASON = "reason";
    
    public static final String REASON_OLD = "old";
    
    public static final String REASON_HARDFAIL = "hardfail";

    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	  try
	  {
		  JSONObject webhooksJSON = SendGridInboundWebhook.getJSONFromMIME(req);
		  
		  System.out.println("Webhooks Data : "+webhooksJSON.toString());
		  
		  String event = webhooksJSON.getString(EVENT);
		  System.out.println("Mailgun Webhooks Event : "+event);
		  
		  if(event.equals(HARD_BOUNCE))
		  {
			  String code = webhooksJSON.getString(ERROR_CODE);
			  if(!StringUtils.startsWith(code, "5"));
			  	  return; 	  
		  }
		  else if(event.equals(SOFT_BOUNCE))
		  {
			  String reason = webhooksJSON.getString(REASON);
			  
			  if(reason.equals(REASON_OLD))
				  event = SOFT_BOUNCE;
			  else if(reason.equals(REASON_HARDFAIL))
				  event = HARD_BOUNCE;
			  else return;
		  }
		  
		 
	     
	     String email=webhooksJSON.getString(EMAIL);
	     System.out.println(email);
	     
	     String subject=getMailgunWebhookMailSubject(webhooksJSON);
	     System.out.println(subject);
	     
	     JSONObject metadataJSON=new JSONObject(webhooksJSON.getString(METADATA));
	     
        System.out.println("Mailgun Webhooks Parameters Event : "+event+", Email : "+email+", subject : "+subject+", Metadata : "+metadataJSON.toString() );
	   
        if (StringUtils.isBlank(event))
		return;
	    
		System.out.println("Mailgun webhook event is " + event);

		// Set to contact if event is HardBounce or SoftBounce
		if (StringUtils.equalsIgnoreCase(event, HARD_BOUNCE)
		        || StringUtils.equalsIgnoreCase(event, SOFT_BOUNCE)
		        || StringUtils.equalsIgnoreCase(event, SPAM))
		
		    setBounceStatusToContact(metadataJSON, subject, event, email);
	 }
	catch (Exception e)
	 {
	    System.err.println("Exception occured in Mailgun Webhook post..." + e.getMessage());
	    e.printStackTrace();
	 }
   }

    /**
     * Sets bounce state for a contact within namespace
     * @param event2 
     * @param msgJSON 
     * 
     * @param eventJSON
     *            webhook event
     */
    private void setBounceStatusToContact(JSONObject metadataJSON, String subject, String event, String email)
    {
	String oldNamespace = NamespaceManager.get();

	try
	{
	    
	    // If no subaccount or email, return
	    if (!metadataJSON.has(SUBACCOUNT) || !metadataJSON.has(METADATA_CAMPAIGN_ID))
		return;

	    // Return if empty namespace
	    if (StringUtils.isBlank(metadataJSON.getString(SUBACCOUNT)))
		return;

	    NamespaceManager.set(metadataJSON.getString(SUBACCOUNT));

	     // By default SOFT_BOUNCE
	    EmailBounceType type = EmailBounceType.SOFT_BOUNCE;

	    if (HARD_BOUNCE.equals(event))
		   type = EmailBounceType.HARD_BOUNCE;

	    if (SPAM.equals(event))
		    type = EmailBounceType.SPAM;

	    // Set status to Agile Contact
	    setContactEmailBounceStatus(email, subject, type, metadataJSON);
	    
	    // If spam, verify reputation
	    if(type.equals(EmailBounceType.SPAM))
		MandrillSubAccounts.checkReputation(metadataJSON.getString(SUBACCOUNT));

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while setting Mailgun email bounce status..." + e.getMessage());
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
    
    /**
     * This method is used to fetch the email subject from mailgun
     * webhook data
     * 
     * @param dataJSON
     * @return string -subject
     */
    private String getMailgunWebhookMailSubject(JSONObject webhooksJSON){
    	String subject=null;
    	try
    	{
			JSONArray subjectJSON=new JSONArray(webhooksJSON.getString(MSG));
			
			for(int index=0; index<subjectJSON.length() ; index++)
			{
				if(subjectJSON.getJSONArray(index).getString(0).equalsIgnoreCase(SUBJECT))
				      subject=subjectJSON.getJSONArray(index).getString(1);	
			}
		} 
    	catch (JSONException e) {
    		System.out.println("Exception occured while getting subject form Mailgun Webhooks JSON..."+e.getMessage());
    		return null;
		}
    return subject;
    	
    }

}
