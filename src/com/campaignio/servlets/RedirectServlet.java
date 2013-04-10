package com.campaignio.servlets;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Iterator;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.URLShortener;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.servlets.deferred.EmailClickDeferredTask;
import com.campaignio.util.CampaignStatsUtil;
import com.campaignio.util.URLShortenerUtil;
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
    public void doPost(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {
	doGet(request, response);
    }

    @SuppressWarnings({ "unchecked", "deprecation" })
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {
	resp.setContentType("text/plain");

	String url = req.getRequestURL().toString();
	// System.out.println(url);

	String domain = URLShortenerUtil.getDomainFromShortURL(url);

	if (StringUtils.isEmpty(domain))
	    return;

	System.out.println("Domain from short url: " + domain);

	String oldNamespace = NamespaceManager.get();

	try
	{
	    NamespaceManager.set(domain);

	    // Gets URLShortener object based on key i.e., URLShortener id
	    URLShortener urlShortener = URLShortenerUtil.getURLShortener(url);

	    if (urlShortener == null)
	    {
		resp.getWriter().println("Invalid URL");
		return;
	    }

	    String subscriberId = urlShortener.subscriber_id;

	    Contact contact = null;

	    System.out.println("Namespace set before CampaignStats: "
		    + NamespaceManager.get());

	    // Increment emails clicked
	    CampaignStatsUtil.incrementEmailsClicked(urlShortener.campaign_id);
	    contact = ContactUtil.getContact(Long.parseLong(subscriberId));

	    NotificationPrefsUtil.executeNotification(Type.CLICKED_LINK,
		    contact);

	    Workflow workflow = WorkflowUtil.getWorkflow(Long
		    .parseLong(urlShortener.campaign_id));

	    if (workflow != null)
	    {
		LogUtil.addLogToSQL(urlShortener.campaign_id, subscriberId,
			"Email link: " + urlShortener.long_url
				+ " of campaign - " + workflow.name
				+ " clicked.", "Email Clicked");
	    }

	    // System.out.println(urlShortener);
	    String longURL = urlShortener.long_url;

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

	    String params = "?fwd=cd";

	    if (urlShortener.long_url.contains("?"))
		params = "&fwd=cd";

	    if (contact == null)
	    {
		resp.sendRedirect(longURL);
		return;
	    }

	    JSONObject contactJSON = WorkflowUtil.getSubscriberJSON(contact);

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
		}
		catch (JSONException e)
		{

		    e.printStackTrace();
		}

		params += ("&" + propertyName.trim() + "=" + URLEncoder
			.encode(value.trim()));
	    }

	    System.out.println("Forwarding it to " + longURL + " " + params);

	    resp.sendRedirect(longURL + params);

	    try
	    {
		// Insert long url as custom value.
		JSONObject urlJSON = new JSONObject();
		urlJSON.put("long_url", longURL);

		// Interrupt clicked in DeferredTask
		EmailClickDeferredTask emailClickDeferredTask = new EmailClickDeferredTask(
			urlShortener.tracker_id, urlJSON.toString());
		Queue queue = QueueFactory.getDefaultQueue();
		queue.add(TaskOptions.Builder
			.withPayload(emailClickDeferredTask));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }
}