package com.campaignio.servlets;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.EmailTrackingTriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.analytics.servlets.AnalyticsServlet;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.agile.SendEmail;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>EmailOpenServlet</code> is the servlet that track emails opened. The
 * 1X1 png image is used for tracking emails opened. The image src sends
 * request, with subscriber-id, namespace and campaign-id as query parameters.
 * The email opened count is incremented with respect to campaign id. Finally it
 * redirects to image.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class EmailOpenServlet extends HttpServlet
{
    /**
     * Tracks email opens for both campaign emails and contact emails. For
     * campaign-emails, subscriber-id and campaign-id are obtained as parameters
     * whereas for contact emails tracker id is obtained as parameter.
     * 
     * @param request
     *            - HttpServletRequest
     * @param response
     *            - HttpServletResponse
     **/
    public void service(HttpServletRequest request, HttpServletResponse res) throws IOException
    {

	// Redirect to image.
	res.sendRedirect("/img/1X1.png");

	// Contact Id (for campaigns) or tracker Id (for personal emails)
	String trackerId = request.getParameter("s");

	// CampaignId
	String campaignId = request.getParameter("c");

	// Contact emailId
	String emailId = request.getParameter("e");

	// Sender Email Id used in case of chrome extension notifications.
	String fromEmailId = request.getParameter("fr");

	// Contact subject
	String subject = request.getParameter("d");
	
	//Get client IP address
	String clientIPAddress=AnalyticsServlet.getClientIP(request);

	System.out.println("subject...." + subject);
	// Fetches domain name from url. E.g. From admin.agilecrm.com, returns
	// admin
	URL url = new URL(request.getRequestURL().toString());
	String namespace = NamespaceUtil.getNamespaceFromURL(url);
	
	//code for IP filter on emails open
	  System.out.println("Client IP is : "+ clientIPAddress);
	  if(AnalyticsServlet.isBlockedIp(clientIPAddress, namespace))
	  {
		  System.out.println("Testing email open IP filter..");
		  return;
	  }
	

	if (StringUtils.isEmpty(namespace))
	    return;

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(namespace);

	boolean isAgileUser = checkIfUserIsAgileUser(request, namespace);

	try
	{
	    if (!isAgileUser)
	    {
		if (!StringUtils.isBlank(emailId))
		{
		    chromeExtensionShowNotification(emailId, fromEmailId, subject, trackerId, false);
		}
		else
		{
		    // Shows notification, adds log & Trigger campaign
		    executePostEmailOpenActions(trackerId, campaignId);
		}
	    }
	    else
	    {
		// Shows notification, adds log & Trigger campaign
		chromeExtensionShowNotification(emailId, fromEmailId, subject, trackerId, true);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while triggering email open..." + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	if (!isAgileUser)
	{
	    // Interrupt Campaign cron tasks.
	    if (!StringUtils.isBlank(campaignId) && !StringUtils.isBlank(trackerId))
		interruptCronTasksOfOpened(campaignId, trackerId, namespace);
	}
    }

    /**
     * Adds log and show notification of Email OpConversations
     * 
     * ened.
     * 
     * @param toEmailId
     *            - to address of Email.
     * @param fromEmailId
     *            - from address of Email.
     * @param subject
     *            - subject of the email.
     * @param trackerId
     *            - Contact Id or Tracker Id
     */
    private void chromeExtensionShowNotification(String toEmailId, String fromEmailId, String subject,
	    String trackerId, boolean isAgileUser)
    {
	try
	{
	    if (!StringUtils.isBlank(trackerId))
	    {
		Contact contact = ContactUtil.searchContactByEmail(toEmailId);
		if (contact == null)
		{
		    return;
		}

		List<ContactEmail> contactEmails = ContactEmailUtil.getContactEmailsBasedOnTrackerId(Long
			.parseLong(trackerId));
		// If there is a Contact Email with the tracker Id, send the
		// notification. If not, save the contact email.
		if (contactEmails.size() > 0)
		{
		    if (!isAgileUser)
		    {
			for (ContactEmail contactEmail : contactEmails)
			{
			    contactEmail.is_email_opened = true;
			    contactEmail.email_opened_at = System.currentTimeMillis() / 1000;
			    contactEmail.save();
			}
			// Need the sent time and opened time in the payload, to
			// show in the Chrome Extensions.
			JSONObject mailInfo = new JSONObject().put("email_subject", subject);
			mailInfo.put("time_sent", trackerId);
			mailInfo.put("time_opened", System.currentTimeMillis() / 1000);
			// Shows notification for simple emails.
			NotificationPrefsUtil.executeNotification(Type.OPENED_EMAIL, contact,
			        new JSONObject().put("custom_value", mailInfo));
		    }
		}
		else
		{
		    // Track URL calls first time when Email sent through Gmail,
		    // at that time save the Email and do not send the
		    // Notifications
		    ContactEmail contactEmail = new ContactEmail(contact.id, fromEmailId, toEmailId, subject, "");
		    contactEmail.trackerId = Long.parseLong(trackerId);
		    contactEmail.from_name = DomainUserUtil.getDomainUserFromEmail(fromEmailId).name;
		    contactEmail.save();
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Adds log and show notification of Email Opened.
     * 
     * @param trackerId
     *            - Contact Id or Tracker Id
     * @param campaignId
     *            - Campaign Id.
     */
    private void executePostEmailOpenActions(String trackerId, String campaignId)
    {

	// Personal Emails
	if (!StringUtils.isBlank(trackerId) && StringUtils.isBlank(campaignId))
	{
	    List<ContactEmail> contactEmails = ContactEmailUtil.getContactEmailsBasedOnTrackerId(Long
		    .parseLong(trackerId));

	    for (ContactEmail contactEmail : contactEmails)
	    {
		contactEmail.is_email_opened = true;
		contactEmail.email_opened_at = System.currentTimeMillis() / 1000;
		contactEmail.save();

		// Shows notification for simple emails.
		showEmailOpenedNotification(ContactUtil.getContact(contactEmail.contact_id), null, contactEmail.subject);

		// Trigger Email Open for personal emails
		EmailTrackingTriggerUtil.executeTrigger(contactEmail.contact_id.toString(), null, null,
			Trigger.Type.EMAIL_OPENED);
	    }
	}

	// Campaign Emails
	if (!StringUtils.isBlank(campaignId) && !StringUtils.isBlank(trackerId))
	{
	    Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(campaignId));

	    if (workflow != null)
	    {
		// Adds log
		addEmailOpenedLog(campaignId, trackerId, workflow.name);

		// Shows notification for campaign-emails
		showEmailOpenedNotification(ContactUtil.getContact(Long.parseLong(trackerId)), workflow.name, null);

		// Trigger Email Open for campaign emails
		EmailTrackingTriggerUtil.executeTrigger(trackerId, campaignId, null, Trigger.Type.EMAIL_OPENED);
	    }
	}
    }

    /**
     * Adds EmailOpened log to SQL.
     * 
     * @param campaignId
     *            - CampaignId.
     * @param subscriberId
     *            - SubscriberId
     * @param workflowName
     *            - Workflow Name of campaign with campaignId.
     */
    public static void addEmailOpenedLog(String campaignId, String subscriberId, String workflowName)
    {
	LogUtil.addLogToSQL(campaignId, subscriberId, "Email Opened of campaign " + workflowName,
		LogType.EMAIL_OPENED.toString());
    }

    /**
     * Shows EmailOpened Notification with contact and workflow name.
     * 
     * @param contact
     *            - Contact object.
     * @param workflowName
     *            - Workflow Name of campaign email.
     * @param emailSubject
     *            - Email subject for contact email
     */
    private void showEmailOpenedNotification(Contact contact, String workflowName, String emailSubject)
    {
	try
	{
	    if (!StringUtils.isEmpty(workflowName))
	    {
		NotificationPrefsUtil.executeNotification(Type.OPENED_EMAIL, contact,
			new JSONObject().put("custom_value", new JSONObject().put("workflow_name", workflowName)));
		return;
	    }
	    NotificationPrefsUtil.executeNotification(Type.OPENED_EMAIL, contact,
		    new JSONObject().put("custom_value", new JSONObject().put("email_subject", emailSubject)));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Interrupts email opened in Cron
     * 
     * @param openTrackingId
     *            - Send Email open tracking id.
     */
    private void interruptCronTasksOfOpened(String campaignId, String subscriberId, String namespace)
    {
    	boolean lock = false;
    	String cacheKey = "eop_"+campaignId+"_" + subscriberId;
    	
		try
		{
			lock = CacheUtil.acquireLock(cacheKey, 500);
			
			if(!lock)
				return;

			// set email_open true
		    JSONObject customData = new JSONObject();
		    customData.put(SendEmail.EMAIL_OPEN, true);
	
		    // Interrupt Opened node
		    CronUtil.interrupt(campaignId, subscriberId, null, new JSONObject(customData));
			
		}
		catch (Exception e)
		{
			System.err.println("Exception occured while interrupting crons of opened - " + e.getMessage());
		    e.printStackTrace();
		}
		finally
		{
			if(lock)
				CacheUtil.deleteCacheWithinNamespace(cacheKey);
			
			// Deletes temporary fields saved. Need to be removed later
			CacheUtil.deleteCacheWithinNamespace(namespace +"_"+campaignId+"_" + subscriberId);
		}
    }

    /**
     * Checks if Email opened user is Agile User or not. If user is Agile User
     * then it checks for is this User is a contact of another Agile User
     * 
     * @param servletRequest
     * @param nameSpace
     * @return
     */
    private boolean checkIfUserIsAgileUser(HttpServletRequest servletRequest, String nameSpace)
    {
	try
	{
	    Cookie[] cookies = servletRequest.getCookies();
	    if (cookies != null)
	    {
		for (Cookie cookie : cookies)
		{
		    if (cookie.getName().equalsIgnoreCase("_agile_login_domain"))
		    {
			String cookieValue = cookie.getValue();
			if (StringUtils.isNotBlank(cookieValue))
			{
			    cookieValue = cookieValue.trim();
			    if (cookieValue.equalsIgnoreCase(nameSpace))
				return true;
			}
		    }
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return false;
	}
	return false;
    }
}
