package com.campaignio.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.util.CampaignStatsUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>EmailOpenServlet</code> is the servlet that track emails opened. The
 * 1X1 gif image is used for tracking emails opened. The image src sends
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
    public void doPost(HttpServletRequest req, HttpServletResponse res)
	    throws IOException
    {
	doGet(req, res);
    }

    public void doGet(HttpServletRequest request, HttpServletResponse res)
	    throws IOException
    {
	String subscriberId = request.getParameter("s");
	String namespace = request.getParameter("n");
	String campaignId = request.getParameter("c");
	String apiKey = request.getParameter("a");

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(namespace);
	try
	{
	    CampaignStatsUtil.incrementEmailsOpened(campaignId);

	    Contact contact = ContactUtil.getContact(Long
		    .parseLong(subscriberId));

	    // APIKey apiKey = APIKey.getAPIKeyRelatedToDomain(namespace);
	    NotificationPrefsUtil.executeNotification(Type.OPENED_EMAIL,
		    contact, apiKey);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	LogUtil.addLogFromID(campaignId, subscriberId, "Email Opened");

	res.sendRedirect("/img/worker.gif");
    }
}
