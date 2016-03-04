package com.agilecrm.oauth;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.OAuthProvider;
import oauth.signpost.basic.DefaultOAuthConsumer;
import oauth.signpost.basic.DefaultOAuthProvider;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.Globals;
import com.agilecrm.scribe.util.ScribeUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;

@SuppressWarnings("serial")
public class OAuthServlet extends HttpServlet {
	public static final String SERVICE_TYPE_QUICKBOOKS = "quickbooks";

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		try {
			String serviceType = req.getParameter("service");
			String isForAll = req.getParameter("isForAll");
			System.out.println(req.getParameter("isForAll"));
			if (isForAll != null) {
				req.getSession().setAttribute("isForAll", isForAll);
			}

			String linkType = req.getParameter("linkType");
			if (linkType != null) {
				req.getSession().setAttribute("linkType", linkType);
			}

			String verifier = req.getParameter("oauth_verifier");
			String org = req.getParameter("org");
			System.out.println("verifier: " + verifier);

			if (verifier != null) {
				getAccessToken(req, resp, verifier, org);
			} else {
				String window_opened_service=req.getParameter("window_opened");
				if(StringUtils.isNotBlank(window_opened_service)){
					req.getSession().setAttribute("window_opened_service", true);
				}
				req.getSession().setAttribute("referer",
						req.getHeader("referer"));
			}
			
			if (serviceType != null) {
				setupOAuth(req, resp, serviceType,linkType);
			}

		} catch (Exception e) {
			ExceptionUtils.getMessage(e);
			e.printStackTrace();
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doGet(req, resp);
	}

	private void getAccessToken(HttpServletRequest req,
			HttpServletResponse resp, String verifier, String org)
			throws Exception {
		Long widgetID = null;

		String companyID = req.getParameter("realmId");

		DefaultOAuthConsumer consumer = (DefaultOAuthConsumer) req.getSession()
				.getAttribute("consumer");
		DefaultOAuthProvider provider = (DefaultOAuthProvider) req.getSession()
				.getAttribute("provider");

		provider.retrieveAccessToken(consumer, verifier.trim());

		System.out.println("Fetched Access token: " + consumer.getToken());
		System.out.println("Token secret: " + consumer.getTokenSecret());

		String serviceType = (String) req.getSession().getAttribute("service");

		HttpSession session = req.getSession();
		UserInfo userInfo = (UserInfo) session
				.getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

		// Set in thread local
		if (userInfo != null) {
			SessionManager.set(userInfo);
		}

		String userId = (userInfo == null) ? null : userInfo.getEmail();
		String isForAll = req.getSession().getAttribute("isForAll")!=null?(String)req.getSession().getAttribute("isForAll"):null;
		String linkType = (String) req.getSession().getAttribute("linkType");

		Map<String, String> properties = new HashMap<String, String>();
		properties.put("token", consumer.getToken());
		properties.put("secret", consumer.getTokenSecret());
		properties.put("company", companyID);
		properties.put("time", String.valueOf(System.currentTimeMillis()));
		properties.put("isForAll", isForAll);
		String returnURL = null;
		String resultType = "success";
		String statusMSG = "QuickBooks Widget saved successfully";

		if (SERVICE_TYPE_QUICKBOOKS.equalsIgnoreCase(serviceType)) {

			try {
				widgetID = ScribeUtil.saveWidgetPrefsByName("quickbooks",
						properties);
				if (widgetID != null) {
					returnURL = "/#QuickBooks/" + widgetID;
				} else {
					returnURL = getRedirectURI(req) + "/#add-widget";
					resultType = "error";
					statusMSG = "QuickBooks widgets not saved";
				}
			} catch (Exception e) {
				resultType = "error";
				statusMSG = "Error Occured while saving QuickBooks : "
						+ e.getMessage();
			}

		} else if (serviceType.equalsIgnoreCase("quickbook-import")) {
			ScribeUtil.saveQuickBookPrefs(properties);
			String redirectURL = (String) req.getSession().getAttribute("referer");
			
			if(ScribeUtil.isWindowPopUpOpened(serviceType, redirectURL+"#sync/quickbook", req, resp))
				return;
			
			returnURL = redirectURL + "#sync/quickbook";
		}

		req.getSession().setAttribute("widgetMsgType", resultType);
		req.getSession().setAttribute("widgetMsg", statusMSG);
		resp.sendRedirect(returnURL);
		// resp.getWriter().println("<script>window.opener.force_plugins_route(); window.close();</script>");

	}

	private void setupOAuth(HttpServletRequest req, HttpServletResponse resp,
			String serviceType,String linkType) throws Exception {
		OAuthConsumer consumer = getOAuthConsumer(serviceType,linkType);
		OAuthProvider provider = getOAuthProvider(serviceType);
	
		System.out.println("Prepared consumer & provider......"+req);
		
		req.getSession().setAttribute("consumer", consumer);
		req.getSession().setAttribute("provider", provider);
		req.getSession().setAttribute("service", serviceType);

		System.out.println("Saved in session.............");

		String authUrl = "";
		try {
			authUrl = provider.retrieveRequestToken(consumer,
					getRedirectURI(req));
		} catch (Exception e) {
			throw new ServletException(e.getMessage());
		}

		// System.out.println("Access token: " + consumer.getToken());
		// System.out.println("Token secret: " + consumer.getTokenSecret());

		// System.out.println("authUrl: " + authUrl);

		// Save Return URL
		String returnURL = getRedirectURI(req).replace("oauth", "#plugins");

		// System.out.println("Return URL is " + returnURL);

		if (returnURL != null)
			req.getSession().setAttribute("return_url", returnURL);
		resp.getWriter().print("please wail ...");

		resp.sendRedirect(authUrl + "&oauth_callback=" + getRedirectURI(req) + "/OAuthServlet");
		resp.getWriter().print("please wail ...");
	}

	public OAuthProvider getOAuthProvider(String serviceType) {
		if (StringUtils.equalsIgnoreCase(serviceType, "xero"))
			return new DefaultOAuthProvider(
					"https://api.xero.com/oauth/RequestToken",
					"https://api.xero.com/oauth/AccessToken",
					"https://api.xero.com/oauth/Authorize");

		return new DefaultOAuthProvider(
				"https://oauth.intuit.com/oauth/v1/get_request_token",
				"https://oauth.intuit.com/oauth/v1/get_access_token",
				"https://appcenter.intuit.com/Connect/Begin");
	}

	public OAuthConsumer getOAuthConsumer(String serviceType, String linkType) {
		OAuthConsumer oauth_conusumer = null;
		/*if (linkType != null && linkType.equals("widget")) {
			oauth_conusumer = new DefaultOAuthConsumer(Globals.QUICKBOOKS_WIDGET_CONSUMER_KEY,
					Globals.QUICKBOOKS_WIDGET_CONSUMER_SECRET);*/
		//} else {
			oauth_conusumer = new DefaultOAuthConsumer(Globals.QUICKBOOKS_CONSUMER_KEY,
					Globals.QUICKBOOKS_CONSUMER_SECRET);
		//}
		return oauth_conusumer;
	}

	public String getRedirectURI(HttpServletRequest request) {
		String actualPath = request.getRequestURL().toString();
		actualPath = actualPath.replace("http://", "").replace("https://", "");
		actualPath = request.getScheme() + "://"
				+ actualPath.substring(0, actualPath.indexOf("/"));

		return actualPath;
	}

}
