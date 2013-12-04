package com.campaignio.servlets;

import java.io.IOException;
import java.net.URL;
import java.util.List;

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
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.servlets.deferred.EmailTrackingDeferredTask;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

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
	// Contact Id
	String subscriberId = request.getParameter("s");

	// CampaignId
	String campaignId = request.getParameter("c");

	// TrackerId for contact emails
	String trackerId = request.getParameter("t");

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
	    addLogAndShowNotification(subscriberId, campaignId, trackerId);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	// Redirect to image.
	res.sendRedirect("/img/1X1.png");

	// Interrupt Campaign cron tasks.
	if (!StringUtils.isBlank(campaignId) && !StringUtils.isBlank(subscriberId))
	    interruptCronTasksOfOpened(trackerId);
    }

    /**
     * Adds log and show notification of Email Opened.
     * 
     * @param subscriberId
     *            - Contact Id.
     * @param campaignId
     *            - Campaign Id.
     */
    private void addLogAndShowNotification(String subscriberId, String campaignId, String trackerId)
    {
	// Campaign Emails
	if (!(StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId)))
	{
	    Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(campaignId));

	    if (workflow != null)
	    {
		// Adds log
		addEmailOpenedLog(campaignId, subscriberId, workflow.name);

		// Shows notification for campaign-emails
		showEmailOpenedNotification(ContactUtil.getContact(Long.parseLong(subscriberId)), workflow.name, null);
	    }

	    return;

	}

	// Personal Emails
	if (!StringUtils.isEmpty(trackerId))
	{
	    List<ContactEmail> contactEmails = ContactEmailUtil.getContactEmailsBasedOnTrackerId(Long.parseLong(trackerId));

	    for (ContactEmail contactEmail : contactEmails)
	    {
		contactEmail.is_email_opened = true;
		contactEmail.email_opened_at = System.currentTimeMillis() / 1000;
		contactEmail.save();

		// Shows notification for simple emails.
		showEmailOpenedNotification(ContactUtil.getContact(contactEmail.contact_id), null, contactEmail.subject);
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
	LogUtil.addLogToSQL(campaignId, subscriberId, "Email Opened of campaign " + workflowName, LogType.EMAIL_OPENED.toString());
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
			new JSONObject().put("custom_value", new JSONObject().put("email_opened", "workflow").put("workflow_name", workflowName)));
		return;
	    }

	    NotificationPrefsUtil.executeNotification(Type.OPENED_EMAIL, contact,
		    new JSONObject().put("custom_value", new JSONObject().put("email_opened", "personal").put("email_subject", emailSubject)));

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
    private void interruptCronTasksOfOpened(String openTrackingId)
    {
	// Interrupt opened in DeferredTask
	EmailTrackingDeferredTask emailTrackingDeferredTask = new EmailTrackingDeferredTask(null, null, openTrackingId);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(emailTrackingDeferredTask));
    }
}