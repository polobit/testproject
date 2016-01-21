package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.util.VersioningUtil;

/**
 * <code>CampaignShareServlet</code> fetches the workflow id , sender domain and
 * sets them along with a flag in a session and then redirects the user to enter
 * domain page for validation of domain.
 * 
 */
public class CampaignShareServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public static final String CAMP_ID = "campId";
	public static final String SENDER_DOMAIN = "senderDomain";
	public static final String IS_SHARE_CAMPAIGN = "isShareCampaign";

	public void service(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String campaign_Id = req.getParameter("campaignId");

		req.getSession().setAttribute(CAMP_ID, campaign_Id);
		req.getSession().setAttribute(
				SENDER_DOMAIN,
				NamespaceUtil.getNamespaceFromURL(req.getRequestURL()
						.toString()));
		System.out.println("CAMP_ID" + campaign_Id);
		System.out.println("SENDER_DOMAIN"
				+ NamespaceUtil.getNamespaceFromURL(req.getRequestURL()
						.toString()));
		// To make LoginServlet know about Share servlet
		req.getSession().setAttribute(IS_SHARE_CAMPAIGN, true);

		// Redirect to enter domain
		resp.sendRedirect(VersioningUtil.getHostURLByApp("my")
				+ "enter-domain?to=login");

	}
}
