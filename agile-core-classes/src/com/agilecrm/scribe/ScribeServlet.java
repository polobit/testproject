package com.agilecrm.scribe;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.scribe.model.Token;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import com.agilecrm.scribe.util.ScribeUtil;

/**
 * <code>ScribeServlet</code> is used to create and configure a client to
 * connect to Linked, Twitter, Gmail, Facebook etc, scribe.jar provides methods
 * to configure a connection, as follows
 * 
 * <pre>
 * OAuthService service = new ServiceBuilder().provider(LinkedInApi.class)
 * 		.apiKey(YOUR_API_KEY).apiSecret(YOUR_API_SECRET).build();
 * </pre>
 * <p>
 * providing the api keys and secret key given by the provider, scribe connects
 * to Linkedin, Twitter. Token can be accessed from the the request parameters
 * "oauth.service" and oauth.request_token
 * </p>
 * 
 */
@SuppressWarnings("serial")
public class ScribeServlet extends HttpServlet {
	public static final String SERVICE_TYPE_PAYPAL_IN = "Paypal";

	public static final String SERVICE_TYPE_LINKED_IN = "linkedin";
	public static final String SERVICE_TYPE_TWITTER = "twitter";
	public static final String SERVICE_TYPE_GMAIL = "gmail";
	public static final String SERVICE_TYPE_GOOGLE = "google";
	public static final String SERVICE_TYPE_GOOGLE_CALENDAR = "google_calendar";

	public static final String SERVICE_TYPE_GOOGLE_PLUS = "googleplus";

	public static final String SERVICE_TYPE_STRIPE = "stripe";
	public static final String SERVICE_TYPE_FRESHBOOKS = "freshbooks";
	public static final String SERVICE_TYPE_GOOGLE_DRIVE = "google_drive";
	public static final String SERVICE_TYPE_FACEBOOK = "facebook";
	public static final String SERVICE_TYPE_STRIPE_IMPORT = "stripe_import";
	public static final String SERVICE_TYPE_SHOPIFY = "shopify_import";
	public static final String SERVICE_TYPE_ZOHO = "zoho_import";

	// Scopes
	public static final String STRIPE_SCOPE = "read_write";
	public static final String GOOGLE_CONTACTS_SCOPE = "https://www.google.com/m8/feeds/";
	public static final String GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";
	public static final String GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";
	public static final String GMAIL_SCOPE = "https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
	public static final String GOOGLE_OAUTH2_SCOPE = "email profile";
	private static final String ZOHO_AUTH_URL = "https://accounts.zoho.com/apiauthtoken/nb/create?SCOPE=ZohoCRM/crmapi&EMAIL_ID=%s&PASSWORD=%s";

	public static final String GOOGLE_PLUS_OAUTH2_SCOPE = "profile https://www.googleapis.com/auth/plus.login";

	// OAuth login
	public static final String SERVICE_TYPE_OAUTH_LOGIN = "oauth_login";
	public static final String SHOPIFY_SERVICE = "shopify";
	public static final String XERO_SERVICE = "xero";

	/**
	 * Process the post request to servlet request, request can be sent either
	 * from application client or from service provider (After connecting to
	 * provider and returned). If request parameters have "oauth_token" and
	 * "oauth_verifier" then request is from provider with token keys which are
	 * saved in widget.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		// this parameter is used to redirect to a
		String reqType = req.getParameter("reqType");
		// use to refresh google plus token
		if (reqType != null && reqType.equalsIgnoreCase("googleplusrefresh")) {
			System.out.println("In googleplusrefresh");

			String widgetId = req.getParameter("widgetId");
			String refreshToken = req.getParameter("refreshToken");
			String code = req.getParameter("code_token");

			try {
				ScribeUtil.updateGooglePlusPrefs(widgetId, code, refreshToken);
				return;
			} catch (Exception e) {
				// e.printStackTrace();
				return;
			}

		}

		doGet(req, resp);
	}

	/**
	 * Process the get request to servlet request, request can be sent either
	 * from application client or from service provider (After connecting to
	 * provider and returned). If request parameters have "oauth_token" and
	 * "oauth_verifier" then request is from provider with token keys which are
	 * saved in widget.
	 * 
	 * @return
	 */
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		/*
		 * OAuth1.0 - Check if it is first time or returning from OAuth1.0
		 * authentication.If token and verifier is present, we just store or
		 * redirect to the authorization page
		 */
		String oAuthToken = req.getParameter("oauth_token");
		String oAuthVerifier = req.getParameter("oauth_verifier");

		/*
		 * OAuth2.0 - Check if it is first time or returning from OAuth2.0
		 * authentication.If code is present, we just store or redirect to the
		 * authorization page
		 */
		String code = req.getParameter("code");

		System.out.println("oAuthToken " + oAuthToken);
		System.out.println("oAuthVerifier " + oAuthVerifier);
		System.out.println("code " + code);

		/*
		 * If aAuthToken and oAuthVerifier or code is not null i.e., request is
		 * from service provider, tokens are saved
		 * 
		 * sometimes code is given as string "null"
		 */
		if ((code != null && !("null".equals(code)))
				|| (oAuthToken != null && oAuthVerifier != null)) {
			saveToken(req, resp);
			return;
		} else {
			String window_opened_service = req.getParameter("window_opened");
			if (StringUtils.isNotBlank(window_opened_service)) {
				req.getSession().setAttribute("window_opened_service", true);
			}

		}

		resp.getWriter().print("Please wait...");
		/*
		 * If the request is from imports we get this parameter, This happens
		 * when we have the user google tokens with us, there is no need of
		 * authenticating him again
		 */
		String serviceType = req.getParameter("service_type");

		if (serviceType != null
				&& serviceType.equalsIgnoreCase(SHOPIFY_SERVICE)) {
			String shop = req.getParameter("shop");
			String callback = req.getParameter("url");
			req.getSession().setAttribute("url", callback);

			String isForAll = (String) req.getParameter("isForAll");
			System.out.println(callback + "is for all " + isForAll);
			if (isForAll != null) {
				System.out.println("isFor All " + isForAll);
				req.getSession().setAttribute("isForAll", isForAll);
			}

			if (shop.contains(".myshopify.com")) {
				shop = shop.split("\\.")[0];
			}
			String domain = req.getParameter("domain");
			resp.sendRedirect("http://shopify4j.appspot.com/shopify?shop="
					+ shop + "&domain=" + domain);
			return;
		}

		/*
		 * If request is from application the setup, request is sent based on
		 * service type
		 */
		setupOAuth(req, resp);

	}

	// Set up OAuth
	/**
	 * Reads service from the request, based on which it connects to respective
	 * Service providers. Calls getService method calls which connects with
	 * service providers and get Oauth tokens,
	 * 
	 * @param req
	 *            {@link HttpServletRequest}
	 * @param resp
	 *            {@link HttpServletResponse}
	 * @throws IOException
	 */
	public void setupOAuth(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {

		// handle facebook popup windows
		if ("facebook".equalsIgnoreCase(req.getParameter("act"))) {
			PrintWriter out = resp.getWriter();
			resp.setContentType("text/html");
			out.println("<script type=\"text/javascript\">");
			out.println("this.close()");
			out.println("</script>");
			return;
		}

		// To Know that add widget for all.
		boolean isForAll = Boolean.parseBoolean(req.getParameter("isForAll"));

		// Get service name from request
		String serviceName = req.getParameter("service");
		String linkType = req.getParameter("linkType");

		// OAuth needn't send any service type
		if (serviceName == null && req.getRequestURI().contains("oauth"))
			serviceName = SERVICE_TYPE_OAUTH_LOGIN;

		if (serviceName != null)
			req.getSession().setAttribute("service_type", serviceName);

		if (linkType != null)
			req.getSession().setAttribute("linkType", linkType);

		System.out.println("in set up of scribe " + serviceName);

		// On OAuth cancel
		if (serviceName == null) {
			String return_url = (String) req.getSession().getAttribute(
					"return_url");

			System.out.println("return url in oauth cancel " + return_url);

			if (ScribeUtil.closeOpendWindow(return_url, req, resp)) {
				return;
			}
			// Redirect URL
			resp.sendRedirect(return_url);
			return;
		}

		OAuthService service = ScribeUtil.getService(req, resp, serviceName);
		String url = null;
		Token token = null;

		// OAuth 2.0
		if (serviceName.equalsIgnoreCase(SERVICE_TYPE_STRIPE)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE_CALENDAR)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GMAIL)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_OAUTH_LOGIN)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE_DRIVE)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_FACEBOOK)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_STRIPE_IMPORT)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE_PLUS)) {
			// After building service, redirects to authorization page
			url = service.getAuthorizationUrl(null);

			String query = req.getParameter("query");

			if (query != null) {
				req.getSession().setAttribute("query", query);
			}

			System.out.println("In setup of scribe response: " + resp);
			req.getSession().setAttribute("isForAll", isForAll);

			System.out.println("Redirect URL OAuth2: " + url);
		} else if (serviceName.equalsIgnoreCase(SERVICE_TYPE_ZOHO)) {
			System.out.println("wait");
		} else {
			// OAuth 1.0
			try {
				token = service.getRequestToken();

				// After building service, redirects to authorization page
				url = service.getAuthorizationUrl(token);
				System.out.println("Redirect URL OAuth1: " + url);

				/*
				 * Save Token,Return URL and Plugin-Id in session as we need
				 * them after it returns back
				 */
				req.getSession().setAttribute("oauth.request_token", token);

				String returnURL = req.getParameter("return_url");
				if (returnURL != null)
					req.getSession().setAttribute("return_url", returnURL);

				String pluginId = req.getParameter("plugin_id");
				if (pluginId != null)
					req.getSession().setAttribute("plugin_id", pluginId);

				System.out.println("In setup of scribe response: " + resp);
				req.getSession().setAttribute("isForAll", isForAll);

				System.out.println("In setup of scribe response: " + resp);

				System.out.println(url);

			} catch (Exception e) {
				// TODO: handle exception
				System.out.println(e.getMessage());
				if (linkType.equalsIgnoreCase("widget")) {
					req.getSession().setAttribute("widgetMsgType", "error");
					req.getSession().setAttribute(
							"widgetMsg",
							"Error occured while doing authentication : "
									+ e.getMessage());
					url = "/#add-widget";
				} else {
					req.getSession().setAttribute("widgetMsgType", "error");
					req.getSession().setAttribute(
							"widgetMsg",
							"Error occured while doing authentication : "
									+ e.getMessage());
					url = "/#sync";
				}
			}
		}

		req.getSession().setAttribute("oauth.request_token", token);

		String returnURL = req.getParameter("return_url");
		if (returnURL != null)
			req.getSession().setAttribute("return_url", returnURL);
		// Redirect URL
		resp.sendRedirect(url);
	}

	/**
	 * Saves token in widget. Tokens are fetched are set as request attributes,
	 * request attributes are read and tokens are saved in the widget, according
	 * to plugin_id in request attribute.
	 * 
	 * @param req
	 *            {@link HttpServletRequest}
	 * @param resp
	 *            {@link HttpServletResponse}
	 * @throws IOException
	 */
	public static void saveToken(HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		Long widgetID = null;
		String linkType = (String) req.getSession().getAttribute("linkType");

		// Retrieve Token and Service Name from session
		String serviceName = (String) req.getSession().getAttribute(
				"oauth.service");

		if (serviceName == null)
			serviceName = (String) req.getSession()
					.getAttribute("service_type");
		System.out.println("service name " + serviceName);
		String code = null;
		Token requestToken = null;
		Token accessToken = null;
		OAuthService service = null;

		// OAuth 2.0 requires code parameter
		if (serviceName.equalsIgnoreCase(SERVICE_TYPE_STRIPE)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE_CALENDAR)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GMAIL)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_OAUTH_LOGIN)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE_DRIVE)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_FACEBOOK)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_STRIPE_IMPORT)
				|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE_PLUS)) {

			code = req.getParameter("code");

			// OAuth 1.0 requires token and verifier
		} else {
			/*
			 * If request token in not null, new token is created using
			 * oAuthToken, which gets the access token from the provider
			 */
			requestToken = (Token) req.getSession().getAttribute(
					"oauth.request_token");

			if (requestToken == null)
				return;

			// Token and verifier are read from request parameters
			String oAuthToken = req.getParameter("oauth_token");
			String oAuthVerifier = req.getParameter("oauth_verifier");

			// Get Service to retrive access token
			service = ScribeUtil.getService(req, resp, serviceName);

			// Builds a verifier
			Verifier verifier = new Verifier(oAuthVerifier);

			Token token = new Token(oAuthToken, requestToken.getSecret());

			accessToken = service.getAccessToken(token, verifier);

			System.out.println("Token " + accessToken.getToken());
			System.out.println("Secret " + accessToken.getSecret());
		}

		// Get Service to retrive access token
		service = ScribeUtil.getService(req, resp, serviceName);

		System.out.println("service name in save token " + serviceName);

		// return URL is retrieved from session
		String returnURL = null;

		// If return URL is null, redirect to dashboard
		System.out.println(returnURL);
		returnURL = (String) req.getSession().getAttribute("return_url");

		String widgetName = (Character.toUpperCase(serviceName.charAt(0)) + serviceName
				.substring(1));
		String statusMSG = "Error occurred while saving " + widgetName
				+ " widget";
		String resultType = "error";

		try {

			widgetID = ScribeUtil.saveTokens(req, resp, service, serviceName,
					accessToken, code);

			if (ScribeUtil.isWindowPopUpOpened(serviceName, returnURL, req,
					resp)) {
				return;
			}

			if (widgetID != null) {

				// return URL is retrieved from session
				returnURL = (String) req.getSession()
						.getAttribute("return_url") + "/" + widgetID;
				resultType = "success";
				statusMSG = widgetName + " widget saved successfully.";
				System.out.println("return url " + returnURL);
			}

			if (serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE_DRIVE)) {
				returnURL = (String) req.getSession()
						.getAttribute("return_url");
			}

		} catch (Exception e) {
			statusMSG += " : " + e.getMessage();
			returnURL = "/#add-widget";
			if (ScribeUtil.closeOpendWindow(returnURL, req, resp)) {
				return;
			}

		}

		if (linkType != null && linkType.equalsIgnoreCase("widget")) {
			req.getSession().setAttribute("widgetMsgType", resultType);
			req.getSession().setAttribute("widgetMsg", statusMSG);
		}

		if (returnURL != null) {
			resp.sendRedirect(returnURL);
		}

		// Delete return url Attribute
		req.getSession().removeAttribute("return_url");

		// Delete linkType Attribute
		req.getSession().removeAttribute("linkType");

	}

}