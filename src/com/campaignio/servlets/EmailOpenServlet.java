package com.campaignio.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.util.CampaignStatsUtil;
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

	if (StringUtils.isEmpty(campaignId)
		|| StringUtils.isEmpty(subscriberId)
		|| StringUtils.isEmpty(namespace))
	    return;

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(namespace);

	try
	{
	    // Increment Emails opened count and add log.
	    CampaignStatsUtil.incrementEmailsOpened(campaignId);
	    Workflow workflow = WorkflowUtil.getWorkflow(Long
		    .parseLong(campaignId));

	    Contact contact = ContactUtil.getContact(Long
		    .parseLong(subscriberId));
	    NotificationPrefsUtil.executeNotification(Type.OPENED_EMAIL,
		    contact);

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	// Redirect to image.
	res.sendRedirect("/img/1X1.png");
    }
}
