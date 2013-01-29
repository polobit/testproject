package com.campaignio.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.campaignio.logger.util.LogUtil;
import com.campaignio.util.CampaignStatsUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>EmailOpenServlet</code> is the servlet that track emails opened. It
 * increments the email opened count with respect to campaign id. Once saved it
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

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(namespace);
	try
	{
	    CampaignStatsUtil.incrementEmailsOpened(campaignId);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	LogUtil.addLogFromID(campaignId, subscriberId, "Email Opened");

	res.sendRedirect("/img/worker.gif");
    }
}
