package com.campaignio.servlets;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.servlets.deferred.EmailOpenDeferredTask;
import com.campaignio.tasklets.agile.SendEmail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

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

	System.out.println("subject...." + subject);

	// Fetches domain name from url. E.g. From admin.agilecrm.com, returns
	// admin
	URL url = new URL(request.getRequestURL().toString());
	String namespace = NamespaceUtil.getNamespaceFromURL(url);

	if (StringUtils.isEmpty(namespace))
	    return;

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(namespace);

	try
	{
	    if (!StringUtils.isBlank(emailId))
	    {
		chromeExtensionShowNotification(emailId, fromEmailId, subject, trackerId);
	    }
	    else
		addLogAndShowNotification(trackerId, campaignId);

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	// Interrupt Campaign cron tasks.
	if (!StringUtils.isBlank(campaignId) && !StringUtils.isBlank(trackerId))
	    interruptCronTasksOfOpened(campaignId, trackerId);
    }

    /**
     * Adds log and show notification of Email Opened.
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
    private void chromeExtensionShowNotification(String toEmailId, String fromEmailId, String subject, String trackerId)
    {
	try
	{
	    if (!StringUtils.isBlank(trackerId))
	    {
		Contact contact = ContactUtil.searchContactByEmail(toEmailId);
		if (contact == null)
		{
		    // If there is no contact with the toEmail, create a contact
		    // with that email.
		    DomainUser owner = DomainUserUtil.getDomainUserFromEmail(fromEmailId);
		    ContactField email = new ContactField(Contact.EMAIL, toEmailId, "SYSTEM");
		    ContactField name = new ContactField(Contact.FIRST_NAME, toEmailId.substring(0,
			    toEmailId.indexOf("@")), "SYSTEM");
		    List<ContactField> properties = new ArrayList<ContactField>();
		    properties.add(email);
		    properties.add(name);
		    contact = new Contact();
		    contact.properties = properties;
		    contact.setContactOwner(new Key<DomainUser>(DomainUser.class, owner.id));
		    contact.save();
		}

		List<ContactEmail> contactEmails = ContactEmailUtil.getContactEmailsBasedOnTrackerId(Long
			.parseLong(trackerId));
		// If there is a Contact Email with the tracker Id, send the
		// notification. If not, save the contact email.
		if (contactEmails.size() > 0)
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
    private void addLogAndShowNotification(String trackerId, String campaignId)
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
    private void addEmailOpenedLog(String campaignId, String subscriberId, String workflowName)
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
    private void interruptCronTasksOfOpened(String campaignId, String subscriberId)
    {
	try
	{
	    // set email_open true
	    JSONObject customData = new JSONObject();
	    customData.put(SendEmail.EMAIL_OPEN, true);

	    // Interrupt opened in DeferredTask
	    EmailOpenDeferredTask emailOpenDeferredTask = new EmailOpenDeferredTask(campaignId, subscriberId,
		    customData.toString());
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.addAsync(TaskOptions.Builder.withPayload(emailOpenDeferredTask));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}