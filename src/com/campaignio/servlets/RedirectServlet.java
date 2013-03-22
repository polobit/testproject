package com.campaignio.servlets;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Iterator;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.URLShortener;
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

	// Gets URLShortener object based on key i.e., URLShortener id
	URLShortener urlShortener = URLShortenerUtil.getURLShortener(url);

	if (urlShortener == null)
	{
	    resp.getWriter().println("Invalid URL");
	    return;
	}

	String domain = urlShortener.namespace;
	String subscriberId = urlShortener.subscriber_id;

	Contact contact = null;

	String oldNamespace = NamespaceManager.get();

	try
	{
	    NamespaceManager.set(domain);

	    System.out.println("Namespace set before CampaignStats: "
		    + NamespaceManager.get());

	    // Increment emails clicked
	    CampaignStatsUtil.incrementEmailsClicked(urlShortener.campaign_id);
	    contact = ContactUtil.getContact(Long.parseLong(subscriberId));

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
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

	try
	{
	    NamespaceManager.set(domain);

	    JSONObject contactJSON = WorkflowUtil.getSubscriberJSON(contact);

	    // Iterate through JSON and construct all params
	    Iterator<String> itr = contactJSON.keys();

	    while (itr.hasNext())
	    {
		// Get Property Name & Value
		String propertyName = itr.next();
		String value = contactJSON.getString(propertyName);

		params += ("&" + propertyName.trim() + "=" + URLEncoder
			.encode(value.trim()));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	System.out.println("Forwarding it to " + longURL + " " + params);

	resp.sendRedirect(longURL + params);

	try
	{
	    // Interrupt clicked in DeferredTask
	    EmailClickDeferredTask emailClickDeferredTask = new EmailClickDeferredTask(
		    urlShortener.tracker_id);
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.add(TaskOptions.Builder.withPayload(emailClickDeferredTask));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}