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
public class OAuthServlet extends HttpServlet
{
	public static final String SERVICE_TYPE_QUICKBOOKS = "quickbooks";

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		try
		{
			String serviceType = req.getParameter("service");

			String verifier = req.getParameter("oauth_verifier");
			String org = req.getParameter("org");
			System.out.println("verifier: " + verifier);

			if (verifier != null)
			{
				getAccessToken(req, resp, verifier, org);
			}
			else
			{
				req.getSession().setAttribute("referer", req.getHeader("referer"));
			}
			if (serviceType != null)
			{
				setupOAuth(req, resp, serviceType);
			}

		}
		catch (Exception e)
		{
			ExceptionUtils.getMessage(e);
			e.printStackTrace();
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		doGet(req, resp);
	}

	private void getAccessToken(HttpServletRequest req, HttpServletResponse resp, String verifier, String org)
			throws Exception
	{
		String companyID = req.getParameter("realmId");

		DefaultOAuthConsumer consumer = (DefaultOAuthConsumer) req.getSession().getAttribute("consumer");
		DefaultOAuthProvider provider = (DefaultOAuthProvider) req.getSession().getAttribute("provider");

		provider.retrieveAccessToken(consumer, verifier.trim());

		System.out.println("Fetched Access token: " + consumer.getToken());
		System.out.println("Token secret: " + consumer.getTokenSecret());

		String serviceType = (String) req.getSession().getAttribute("service");

		HttpSession session = req.getSession();
		UserInfo userInfo = (UserInfo) session.getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

		// Set in thread local
		if (userInfo != null)
		{
			SessionManager.set(userInfo);
		}

		String userId = (userInfo == null) ? null : userInfo.getEmail();

		Map<String, String> properties = new HashMap<String, String>();
		properties.put("token", consumer.getToken());
		properties.put("secret", consumer.getTokenSecret());
		properties.put("company", companyID);
		properties.put("time", String.valueOf(System.currentTimeMillis()));
		if (SERVICE_TYPE_QUICKBOOKS.equalsIgnoreCase(serviceType))
		{
			ScribeUtil.saveWidgetPrefsByName("quickbooks", properties);
		}
		else if (serviceType.equalsIgnoreCase("quickbook-import"))
		{
			ScribeUtil.saveQuickBookPrefs(properties);
			String redirectURL = (String) req.getSession().getAttribute("referer");
			resp.sendRedirect(redirectURL + "#sync/quickbook");
			return;
		}
		resp.sendRedirect(getRedirectURI(req) + "/#add-widget");
		// resp.getWriter().println("<script>window.opener.force_plugins_route(); window.close();</script>");

	}

	private void setupOAuth(HttpServletRequest req, HttpServletResponse resp, String serviceType) throws Exception
	{
		OAuthConsumer consumer = getOAuthConsumer(serviceType);
		OAuthProvider provider = getOAuthProvider(serviceType);

		System.out.println("Prepared consumer & provider......");

		req.getSession().setAttribute("consumer", consumer);
		req.getSession().setAttribute("provider", provider);
		req.getSession().setAttribute("service", serviceType);

		System.out.println("Saved in session.............");

		String authUrl = "";
		try
		{
			authUrl = provider.retrieveRequestToken(consumer, getRedirectURI(req));
		}
		catch (Exception e)
		{
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

		resp.sendRedirect(authUrl + "&oauth_callback=" + getRedirectURI(req) + "/OAuthServlet");
	}

	public OAuthProvider getOAuthProvider(String serviceType)
	{
		if (StringUtils.equalsIgnoreCase(serviceType, "xero"))
			return new DefaultOAuthProvider("https://api.xero.com/oauth/RequestToken",
					"https://api.xero.com/oauth/AccessToken", "https://api.xero.com/oauth/Authorize");

		return new DefaultOAuthProvider("https://oauth.intuit.com/oauth/v1/get_request_token",
				"https://oauth.intuit.com/oauth/v1/get_access_token", "https://appcenter.intuit.com/Connect/Begin");
	}

	public OAuthConsumer getOAuthConsumer(String serviceType)
	{
		// if (StringUtils.equalsIgnoreCase(serviceType, "quickbooks"))
		return new DefaultOAuthConsumer(Globals.QUICKBOOKS_CONSUMER_KEY, Globals.QUICKBOOKS_CONSUMER_SECRET);

		// return new DefaultOAuthConsumer("qyprdHZrAT1Ud51gPM4xN32ipsGxmq",
		// "5YoQSFM8t3l0a38gTLWSW3ZNpeJROuuVn7Vzd62f");
	}

	public String getRedirectURI(HttpServletRequest request)
	{
		String actualPath = request.getRequestURL().toString();
		actualPath = actualPath.replace("http://", "").replace("https://", "");
		actualPath = request.getScheme() + "://" + actualPath.substring(0, actualPath.indexOf("/"));

		return actualPath;
	}

}