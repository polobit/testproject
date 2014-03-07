package com.campaignio.servlets;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Iterator;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.servlets.deferred.EmailClickDeferredTask;
import com.campaignio.tasklets.agile.SendEmail;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.urlshortener.URLShortener;
import com.campaignio.urlshortener.util.URLShortenerUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>RedirectServlet</code> is the servlet that redirects short url to
 * original url. Appends contact json values as parameters to original url. Sets
 * a deferred task inorder to wakeup the cron tasks that matches with the
 * tracking Id.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class RedirectServlet extends HttpServlet
{
    /**
     * Tracks email link clicks of campaign. Shows notification that email link
     * clicked. Interrupts clicked tasklet. Adds log to sql that email link
     * clicked.
     * 
     * @param req
     *            - HttpServlet Request
     * @param resp
     *            - HttpServlet Response
     **/
    public void service(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	resp.setContentType("text/plain");

	// Get Domain using Rot13 from URL
	String url = req.getRequestURL().toString();
	String domain = URLShortenerUtil.getDomainFromShortURL(url);

	// If Domain not found, return. This could be if the URL is tampered or
	// using contactspot URLs
	if (StringUtils.isBlank(domain))
	    return;

	System.out.println("Domain from short url is " + domain);

	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(domain);

	    // Get URLShortener object based on key i.e., URLShortener id
	    URLShortener urlShortener = URLShortenerUtil.getURLShortener(url);
	    if (urlShortener == null)
	    {
		resp.getWriter().println("Invalid URL");
		return;
	    }

	    // Remove spaces, \n and \r
	    String normalisedLongURL = normaliseLongURL(urlShortener.long_url);

	    // Add CD Params
	    String params = "?fwd=cd";
	    if (urlShortener.long_url.contains("?"))
		params = "&fwd=cd";

	    // Get Contact
	    String subscriberId = urlShortener.subscriber_id;
	    Contact contact = ContactUtil.getContact(Long.parseLong(subscriberId));

	    if (contact == null)
	    {
		resp.sendRedirect(normalisedLongURL);
		return;
	    }

	    // Append Contact properties to params
	    params += appendContactPropertiesToParams(contact);

	    System.out.println("Forwarding it to " + normalisedLongURL + " " + params);

	    resp.sendRedirect(normalisedLongURL + params);

	    // Get Workflow to add to log (campaign name) and show notification
	    Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(urlShortener.campaign_id));
	    if (workflow != null)
	    {
		// Add log
		addEmailClickedLog(urlShortener.campaign_id, subscriberId, urlShortener.long_url, workflow.name);

		// Show notification
		showEmailClickedNotification(contact, workflow.name, urlShortener.long_url);
	    }

	    // Interrupt cron tasks of clicked.
	    interruptCronTasksOfClicked(urlShortener.tracker_id, normalisedLongURL, urlShortener.campaign_id, subscriberId);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Adds email clicked log to SQL.
     * 
     * @param campaignId
     *            - Campaign Id
     * @param subscriberId
     *            - Contact Id
     * @param longURL
     *            - Original url
     * @param workflowName
     *            - Workflow Name.
     */
    private void addEmailClickedLog(String campaignId, String subscriberId, String longURL, String workflowName)
    {
	LogUtil.addLogToSQL(campaignId, subscriberId, "Email link clicked " + longURL + " of campaign " + workflowName, LogType.EMAIL_CLICKED.toString());
    }

    /**
     * Shows email clicked notification to the contact.
     * 
     * @param contact
     *            - Contact Object.
     * @param workflowName
     *            - Workflow Name.
     * @param longURL
     *            - Original URL.
     */
    private void showEmailClickedNotification(Contact contact, String workflowName, String longURL)
    {
	try
	{
	    NotificationPrefsUtil.executeNotification(Type.CLICKED_LINK, contact,
		    new JSONObject().put("custom_value", new JSONObject().put("workflow_name", workflowName).put("url_clicked", longURL)));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Removes spaces and new line characters from longURL.
     * 
     * @param url
     *            - Original url that is stored in URLShortener.
     * @return String.
     */
    private String normaliseLongURL(String url)
    {
	String longURL = url;

	// If URL has spaces or erroneous chars - we chop them
	if (longURL.contains(" "))
	{
	    System.out.println("Trimming " + longURL);
	    longURL = longURL.substring(0, longURL.indexOf(" "));
	}

	if (longURL.contains("\r"))
	{
	    System.out.println("Trimming " + longURL);
	    longURL = longURL.substring(0, longURL.indexOf("\r"));
	}
	if (longURL.contains("\n"))
	{
	    System.out.println("Trimming " + longURL);
	    longURL = longURL.substring(0, longURL.indexOf("\n"));
	}

	return longURL;
    }

    /**
     * Appends contact-properties as params to the url before redirecting to
     * original url.
     * 
     * @param contact
     *            - Contact Object.
     * @return String
     */
    @SuppressWarnings("unchecked")
    private String appendContactPropertiesToParams(Contact contact)
    {
	String params = "";

	JSONObject contactJSON = AgileTaskletUtil.getSubscriberJSON(contact);

	// if null returned due to exception, return empty
	if (contactJSON == null)
	    return params;

	// Iterate through JSON and construct all params
	Iterator<String> itr = contactJSON.keys();

	while (itr.hasNext())
	{
	    // Get Property Name & Value
	    String propertyName = itr.next();
	    String value = "";
	    try
	    {
		value = contactJSON.getString(propertyName);
		params += ("&" + propertyName.trim() + "=" + URLEncoder.encode(value.trim(), "UTF-8"));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	return params;
    }

    /**
     * Interrupts crons that are saved by Clicked Node of Campaigns.
     * 
     * @param trackerId
     *            - Tracking Id saved in URLShortener. It identifies related
     *            cron object.
     * @param longURL
     *            - Original url to show as custom-data in clicked log.
     */
    private void interruptCronTasksOfClicked(String clickTrackingId, String longURL, String campaignId, String subscriberId)
    {

	try
	{
	    JSONObject interruptedData = new JSONObject();
	    interruptedData.put(SendEmail.EMAIL_CLICK, true);
	    interruptedData.put(SendEmail.EMAIL_OPEN, true);

	    // Interrupt clicked in DeferredTask
	    EmailClickDeferredTask emailClickDeferredTask = new EmailClickDeferredTask(clickTrackingId, campaignId, subscriberId, interruptedData.toString());
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.addAsync(TaskOptions.Builder.withPayload(emailClickDeferredTask));
	}
	catch (Exception e)
	{
	    System.out.println("Got Exception in RedirectServlet " + e.getMessage());
	    e.printStackTrace();
	}
    }
}