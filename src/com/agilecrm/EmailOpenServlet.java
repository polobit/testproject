package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.campaignio.CampaignStats;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.util.CampaignStatsUtil;

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

    @SuppressWarnings("unused")
    public void doGet(HttpServletRequest request, HttpServletResponse res)
	    throws IOException
    {
	// URL url = new URL(request.getRequestURL().toString());
	String subscriberId = request.getParameter("subscriber_id");
	String namespace = request.getParameter("namespace");
	String campaignId = request.getParameter("campaign_id");

	CampaignStats stats = CampaignStatsUtil
		.getCampaignStatsByCampaignId(Long.parseLong(campaignId));
	stats.emailsOpened++;
	stats.save();

	LogUtil.addLogFromID(campaignId, subscriberId, "Email Opened");

	res.sendRedirect("/img/worker.gif");
    }
}
