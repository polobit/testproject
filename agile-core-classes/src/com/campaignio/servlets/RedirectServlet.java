package com.campaignio.servlets;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.EmailLinksConversion;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.agilecrm.workflows.triggers.util.EmailTrackingTriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.CampaignLogsSQLUtil;
import com.campaignio.servlets.util.TrackClickUtil;
import com.campaignio.urlshortener.URLShortener;
import com.campaignio.urlshortener.URLShortener.ShortenURLType;
import com.campaignio.urlshortener.util.URLShortenerUtil;
import com.google.appengine.api.NamespaceManager;

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

	// Get params
	String subscriberId = req.getParameter("s");
	String campaignId = req.getParameter("c");
	String originalURL = req.getParameter("u");
	String push = req.getParameter("p");
	String personalEmailTrackerId = req.getParameter("t");

	// To get namespace
	String url = req.getRequestURL().toString();
	String host = new URL(url).getHost().toString();

	String domain = null;

	// When requested from shorten url, get domain from URLShortener
	if (StringUtils.equals(NamespaceUtil.getNamespaceFromURL(host), "click"))
	    domain = URLShortenerUtil.getDomainFromShortURL(url);
	else
	    domain = NamespaceUtil.getNamespaceFromURL(host);

	// If Domain not found, return. This could be if the URL is tampered or
	// using contactspot URLs
	if (StringUtils.isBlank(domain))
	    return;

	// Shorten urls uses tracker-id
	String trackerId = null;

	URLShortener urlShortener = null;

	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(domain);

	    // When requested from shorten url, get values from URLShortener
	    if (StringUtils.equals(NamespaceUtil.getNamespaceFromURL(host), "click"))
	    {
		// Get URLShortener object based on key i.e., URLShortener id
		urlShortener = URLShortenerUtil.getURLShortener(url);

		if (urlShortener == null)
		{
		    resp.getWriter().println("Invalid URL");
		    return;
		}

		subscriberId = urlShortener.subscriber_id;
		campaignId = urlShortener.campaign_id;
		originalURL = urlShortener.long_url;
		trackerId = urlShortener.tracker_id;
		push = urlShortener.getPushParameter();
	    }

	    // Remove spaces, \n and \r
	    String normalisedLongURL = TrackClickUtil.normaliseLongURL(originalURL);

	    // When personal email is sent to contact that doesn't exist
	    if (StringUtils.isBlank(subscriberId))
	    {
		resp.sendRedirect(normalisedLongURL);
		return;
	    }

	    // Add CD Params - IMPORTANT: agile js-api is dependent on these
	    /*// params
    	String params = "?fwd=cd";
	    if (originalURL.contains("?"))
		params = "&fwd=cd";
	    */
	    
	    String params= "fwd=cd";

	    // Get Contact
	    Contact contact = ContactUtil.getContact(Long.parseLong(subscriberId));

	    if (contact == null)
	    {
		resp.sendRedirect(normalisedLongURL);
		return;
	    }

	    System.out.println("Push parameter is ............" + push);

	    // Redirect url with push data
	    if (StringUtils.isNotBlank(push) && (push.equals(EmailLinksConversion.AGILE_EMAIL_PUSH) || push.equals(EmailLinksConversion.AGILE_EMAIL_PUSH_EMAIL_ONLY)))
	    {
		// Append Contact properties to params
		params += TrackClickUtil.appendContactPropertiesToParams(contact, push);
		
		//Append url fragment(Prashannjeet)
		
			normalisedLongURL=appendURI(normalisedLongURL, params).toString();
		
			System.out.println("Forwarding it to " + normalisedLongURL);
			
			resp.sendRedirect(normalisedLongURL);
		
	    }
	    else
	    {
		resp.sendRedirect(normalisedLongURL);
	    }

	    // For personal emails campaign-id is blank
	    if (StringUtils.isBlank(campaignId) && contact != null)
	    {
	    	
	    	// Save link clicked time
	    	if(StringUtils.isNotBlank(personalEmailTrackerId))
	    	{
	    		List<ContactEmail> contactEmails = ContactEmailUtil.getContactEmailsBasedOnTrackerId(Long
	    			    .parseLong(personalEmailTrackerId));

    		    for (ContactEmail contactEmail : contactEmails)
    		    {
    		    	contactEmail.is_email_opened = true;
    		    	
    		    	// If images blocked, set email_opened_at too
    		    	if(contactEmail.email_opened_at == 0l)
    		    		contactEmail.email_opened_at = System.currentTimeMillis() / 1000;
    		    	
	    			contactEmail.email_link_clicked_at = System.currentTimeMillis() / 1000;
	    			contactEmail.save();
    		    }
	    	}
	    	
			TrackClickUtil.showEmailClickedNotification(contact, null, originalURL);
	
			// Link clicked trigger
			EmailTrackingTriggerUtil.executeTrigger(subscriberId, null, originalURL, Type.EMAIL_LINK_CLICKED);
	
			return;
	    }

	    // Get Workflow to add to log (campaign name) and show notification
	    Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(campaignId));
	    if (workflow != null)
	    {
		
		    // Add log
		    if(urlShortener != null)
		    {
		    	if(urlShortener.getURLShortenerType().equals(ShortenURLType.SMS))
		    	{
			    	CampaignLogsSQLUtil.addToCampaignLogs(domain, campaignId, workflow.name, subscriberId, "SMS link clicked " + originalURL + " of campaign " + workflow.name,
			    	        LogType.SMS_LINK_CLICKED.toString());
			    	
					// Interrupt cron tasks of clicked.
				    TrackClickUtil.interruptCronTasksOfClicked(trackerId, campaignId, subscriberId, ShortenURLType.SMS);
					
		    	}
		    	
		    	if(urlShortener.getURLShortenerType().equals(ShortenURLType.TWEET))
		    	{
		    		CampaignLogsSQLUtil.addToCampaignLogs(domain, campaignId, workflow.name, subscriberId, "Tweet link clicked " + originalURL + " of campaign " + workflow.name,
			    	        LogType.TWEET_LINK_CLICKED.toString());
			    	
					// Interrupt cron tasks of clicked.
				    TrackClickUtil.interruptCronTasksOfClicked(trackerId, campaignId, subscriberId, ShortenURLType.TWEET);
					
		    	}
		    	
		    	// Show notification
				TrackClickUtil.showEmailClickedNotification(contact, workflow.name, originalURL);
				
				return;
		    	
		    }

		    TrackClickUtil.addEmailClickedLog(campaignId, subscriberId, originalURL, workflow.name);
			
	
			// Show notification
			TrackClickUtil.showEmailClickedNotification(contact, workflow.name, originalURL);
	    }

	    // Interrupt cron tasks of clicked.
	    TrackClickUtil.interruptCronTasksOfClicked(trackerId, campaignId, subscriberId, ShortenURLType.EMAIL);

	    // Link clicked trigger
    	EmailTrackingTriggerUtil.executeTrigger(subscriberId, campaignId, originalURL, Type.EMAIL_LINK_CLICKED);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occurred while redirecting urls... " + e.getMessage());
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
    
    //Append URI Fragment with #(Hash sign)
    
    public URI appendURI(String uri, String appendQuery) throws URISyntaxException {
        URI oldUri = new URI(uri);
        String newQuery = oldUri.getQuery();
        
        if (newQuery == null) 
            newQuery = appendQuery;
        else 
            newQuery += "&" + appendQuery;  
        
        URI newUri = new URI(oldUri.getScheme(), oldUri.getAuthority(), oldUri.getPath(), newQuery, oldUri.getFragment());
        return newUri;
    }
}