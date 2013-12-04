package com.campaignio.servlets;

import java.io.IOException;
import java.net.URL;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
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
	    addLogAndShowNotification(subscriberId, campaignId);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	// Redirect to image.
	res.sendRedirect("/img/1X1.png");

	// Interrupt Campaign cron tasks.
	if (!StringUtils.isBlank(campaignId) && !StringUtils.isBlank(subscriberId))
	    interruptCronTasksOfOpened(campaignId, subscriberId);
    }

    /**
     * Adds log and show notification of Email Opened.
     * 
     * @param subscriberId
     *            - Contact Id.
     * @param campaignId
     *            - Campaign Id.
     */
    private void addLogAndShowNotification(String subscriberId, String campaignId)
    {
	// Campaign Emails
	if (!StringUtils.isEmpty(campaignId) && !StringUtils.isEmpty(subscriberId))
	{
	    Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(campaignId));

	    if (workflow != null)
	    {
		// Adds log
		addEmailOpenedLog(campaignId, subscriberId, workflow.name);

		// Shows notification for campaign-emails
		showEmailOpenedNotification(ContactUtil.getContact(Long.parseLong(subscriberId)), workflow.name, null);
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
	    EmailOpenDeferredTask emailOpenDeferredTask = new EmailOpenDeferredTask(campaignId, subscriberId, customData.toString());
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.add(TaskOptions.Builder.withPayload(emailOpenDeferredTask));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}