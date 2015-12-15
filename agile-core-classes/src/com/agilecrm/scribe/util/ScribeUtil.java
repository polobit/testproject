/**
 * @auther jitendra
 * @since 2014
 */
package com.agilecrm.scribe.util;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;
import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.LinkedInApi;
import org.scribe.builder.api.TwitterApi;
import org.scribe.model.OAuthConstants;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import com.agilecrm.Globals;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.scribe.ScribeServlet;
import com.agilecrm.scribe.api.FacebookApi;
import com.agilecrm.scribe.api.StripeApi;
import com.agilecrm.scribe.api.XeroApi;
import com.agilecrm.scribe.login.util.OAuthLoginUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.DefaultWidgets;
import com.agilecrm.widgets.util.WidgetUtil;
import com.stripe.model.Account;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.GoogleServiceUtil;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.google.utl.ContactPrefsUtil;
import com.thirdparty.shopify.ShopifyAccessURLBuilder;

//import org.codehaus.jackson.map.ObjectMapper;

/**
 * <code>ScribeUtil</code> class contains methods to be used by
 * {@link ScribeServlet} to get the appropriate service required for OAuth1 and
 * OAuth2 and to save tokens after authentication
 * 
 * @author Tejaswi
 * @since August 2013
 */
public class ScribeUtil {

	/**
	 * Builds service using serviceBuilder based on type of service specified,
	 * which can be accessed to get Token
	 * 
	 * @param req
	 *            {@link HttpServletRequest}
	 * @param resp
	 *            {@link HttpServletResponse}
	 * @param serviceType
	 *            {@link String} Service type
	 *            (LinkedIn/Twitter/Google/Facebook..)
	 * @return {@link OAuthRequest}
	 */
	public static OAuthService getService(HttpServletRequest req,
			HttpServletResponse resp, String serviceType) {
		/*
		 * Get callback url, to which the tokens are returned after
		 * authentication
		 */
		String callback = req.getRequestURL().toString();
		System.out.println("getService callback: " + callback);

		OAuthService service = null;

		// If service type LinkedIn, creates a Service, specific to LinkedIn
		if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_LINKED_IN))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_LINKED_IN, LinkedInApi.class,
					callback, Globals.LINKED_IN_API_KEY,
					Globals.LINKED_IN_SECRET_KEY, null);

		// If service type Twitter, creates a Service, specific to Twitter
		else if (serviceType
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_TWITTER))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_TWITTER, TwitterApi.SSL.class,
					callback, Globals.TWITTER_API_KEY,
					Globals.TWITTER_SECRET_KEY, null);

		// If service type Stripe, creates a Service, specific to Stripe
		else if (serviceType
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_STRIPE))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_STRIPE, StripeApi.class,
					callback, Globals.STRIPE_CLIENT_ID, Globals.STRIPE_API_KEY,
					ScribeServlet.STRIPE_SCOPE);

		// If service type Google, creates a Service, specific to Google
		else if (serviceType
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_GOOGLE,
					com.agilecrm.scribe.api.GoogleApi.class, callback,
					Globals.GOOGLE_CLIENT_ID, Globals.GOOGLE_SECRET_KEY,
					ScribeServlet.GOOGLE_CONTACTS_SCOPE);

		// If service type Google, creates a Service, specific to Google
		else if (serviceType
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE_CALENDAR))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_GOOGLE_CALENDAR,
					com.agilecrm.scribe.api.GoogleApi.class, callback,
					Globals.GOOGLE_CALENDAR_CLIENT_ID,
					Globals.GOOGLE_CALENDAR_SECRET_KEY,
					ScribeServlet.GOOGLE_CALENDAR_SCOPE);

		// If service type Google Plus, creates a Service, specific to Google
		// Plus
		else if (serviceType
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE_PLUS))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_GOOGLE_PLUS,
					com.agilecrm.scribe.api.GoogleApi.class, callback,
					Globals.GOOGLE_CLIENT_ID, Globals.GOOGLE_SECRET_KEY,
					ScribeServlet.GOOGLE_PLUS_OAUTH2_SCOPE);

		else if (serviceType
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_OAUTH_LOGIN))
			service = OAuthLoginUtil.getLoginService(req, resp, serviceType);

		// Creates a Service, specific to Gmail
		else if (serviceType.equals(ScribeServlet.SERVICE_TYPE_GOOGLE_DRIVE))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_GOOGLE_DRIVE,
					com.agilecrm.scribe.api.GoogleApi.class, callback,
					Globals.GOOGLE_CLIENT_ID, Globals.GOOGLE_CLIENT_ID,
					ScribeServlet.GOOGLE_DRIVE_SCOPE);

		// Create a Service specific to facebook
		else if (serviceType
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_FACEBOOK))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_FACEBOOK,
					com.agilecrm.scribe.api.FacebookApi.class, callback,
					Globals.FACEBOOK_APP_ID, Globals.FACEBOOK_APP_SECRET, null);

		/**
		 * create service for stripe import
		 */
		else if (serviceType
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_STRIPE_IMPORT))
			service = getSpecificService(req,
					ScribeServlet.SERVICE_TYPE_STRIPE_IMPORT,
					com.agilecrm.scribe.api.StripeApi.class, callback,
					Globals.DEV_STRIPE_CLIENT_ID, Globals.DEV_STRIPE_API_KEY,
					"read_only");

		/**
		 * create service for xero
		 */
		else if (serviceType.equalsIgnoreCase(ScribeServlet.XERO_SERVICE))
			service = getSpecificService(req, ScribeServlet.XERO_SERVICE,
					XeroApi.class, callback, Globals.XERO_API_KEY,
					Globals.XERO_CLIENT_ID, null);

		// Creates a Service, specific to Gmail
		else
			service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_GMAIL,
					com.agilecrm.scribe.api.GoogleApi.class, callback,
					Globals.GOOGLE_CLIENT_ID, Globals.GOOGLE_CLIENT_ID,
					ScribeServlet.GMAIL_SCOPE);

		return service;
	}

	/**
	 * Based on the service type, builds an {@link OAuthService} with the given
	 * parameters
	 * 
	 * @param req
	 *            {@link HttpServletRequest} to store the name in session
	 * @param serviceType
	 *            {@link String} type of service to be built
	 * @param apiClass
	 *            {@link Class} extending {@link Api} class to be provided to
	 *            build a service based on service type
	 * @param callback
	 *            callback URL to which the tokens are returned after
	 *            authentication
	 * @param apiKey
	 *            API key or client Id of the application
	 * @param apiSecret
	 *            Secret key or client secret of the application
	 * @param scope
	 *            {@link String} scope to be appended to request if required
	 * @return configured {@link OAuthService}
	 */
	public static OAuthService getSpecificService(HttpServletRequest req,
			String serviceType, Class<? extends Api> apiClass, String callback,
			String apiKey, String apiSecret, String scope) {

		// Gets session and sets attribute "oauth.service" to service type
		req.getSession().setAttribute("oauth.service", serviceType);

		// scope="read_friendlists,read_stream";

		// if scope is null return service without scope
		if (scope == null)
			// Creates a Service, by configuring API key, Secret key
			return new ServiceBuilder().provider(apiClass).callback(callback)
					.apiKey(apiKey).apiSecret(apiSecret).build();
		else
			return new ServiceBuilder().provider(apiClass).callback(callback)
					.apiKey(apiKey).apiSecret(apiSecret).scope(scope).build();

		// if scope is needed in the service

	}

	/**
	 * Based on service type, the tokens returned from OAuth are saved
	 * appropriately
	 * 
	 * @param req
	 *            {@link HttpServletRequest} to send request for access token in
	 *            case of OAuth2
	 * @param service
	 *            {@link OAuthService}
	 * @param agileUser
	 *            {@link AgileUser} tokens are saved specific to this user
	 * @param serviceName
	 *            {@link String} Service type
	 *            (LinkedIn/Twitter/Google/Facebook..)
	 * @param accessToken
	 *            {@link Token} required for OAuth1 to retrieve access and
	 *            secret token
	 * @param code
	 *            {@link String} code required for OAuth2 to retrieve access and
	 *            refresh token
	 * @throws IOException
	 */
	public static Long saveTokens(HttpServletRequest req,
			HttpServletResponse resp, OAuthService service, String serviceName,
			Token accessToken, String code) throws IOException, Exception {

		Long widgetID = null;

		String isForAll = String.valueOf(req.getSession().getAttribute(
				"isForAll"));

		// We use Scribe for OAuth2 Authentication as well
		if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_OAUTH_LOGIN)) {
			System.out.println("OAUTH2 AUTHENTICATED ");
			OAuthLoginUtil.login(req, resp, code, service);
			return widgetID;
		}

		// Get Agile User
		AgileUser agileUser = AgileUser.getCurrentAgileUser();
		if (agileUser == null) {
			System.out.println("Cannot find Agile User");
			return widgetID;
		}
		/*
		 * 
		 * If service name is Twitter or LinkedIn, widget is fetched by
		 * plugin_id in session and widget is updated with new token key and
		 * secret key
		 */
		if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_TWITTER)
				|| serviceName
						.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_LINKED_IN)) {
			widgetID = saveLinkedInOrTwitterPrefs(req, accessToken, isForAll);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GMAIL)) {
			// If Service type is Gmail, save preferences in social prefs
			saveGmailPrefs(code, service, agileUser, isForAll);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE_PLUS)) {
			// widget gmail.
			widgetID = saveGooglePlusPrefs(req, code, isForAll);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_STRIPE)) {
			/*
			 * if service type is stripe, we post the code and get the access
			 * token and widget is updated with new access token and refresh
			 * token
			 */
			widgetID = saveStripePrefs(req, code, isForAll);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE)) {
			/*
			 * if service type is google, we post the code and get the access
			 * token and ContactPrefs object is saved with new access token and
			 * refresh token
			 */
			saveGooglePrefs(code, null, isForAll);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE_CALENDAR)) {
			saveGoogleCalenderPrefs(code, null, isForAll);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE_DRIVE)) {
			String returnURL = (String) req.getSession().getAttribute(
					"return_url");
			// Appends code in return url
			returnURL = returnURL + "&code=" + code;
			req.getSession().setAttribute("return_url", returnURL);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_STRIPE_IMPORT)) {
			saveStripeImportPref(req, accessToken, isForAll);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_FACEBOOK)) {
			widgetID = saveFacebookPrefs(req, code, service, isForAll);
		} else if (serviceName
				.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_SHOPIFY)) {
			saveShopifyPrefs(req, code, isForAll);
		} else if (serviceName.equalsIgnoreCase(ScribeServlet.XERO_SERVICE)) {
			saveXeroPrefs(req, accessToken, isForAll);
		}

		return widgetID;
		// Setting isForAll as false.
		// req.getSession().setAttribute("isForAll", false);
	}

	/**
	 * Save shopify prefs.
	 * 
	 * @param req
	 *            the req
	 * @param code
	 *            the code
	 */
	private static void saveShopifyPrefs(HttpServletRequest req, String code,
			String isForAll) throws Exception {
		String shopDomain = req.getParameter("shop");
		String accessURl = new ShopifyAccessURLBuilder(shopDomain).code(code)
				.clientKey(Globals.SHOPIFY_API_KEY)
				.scretKey(Globals.SHOPIFY_SECRET_KEY).buildAccessUrl();
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST, accessURl);
		Response response = oAuthRequest.send();

		HashMap<String, String> properties = new ObjectMapper().readValue(
				response.getBody(),
				new TypeReference<HashMap<String, String>>() {

				});
		ContactPrefs shopifyPrefs = new ContactPrefs();
		shopifyPrefs.token = properties.get("access_token").toString();
		shopifyPrefs.type = Type.SHOPIFY;
		shopifyPrefs.othersParams = shopDomain;
		shopifyPrefs.save();

	}

	/**
	 * If service is StripeImport
	 * 
	 * @param req
	 *            {@link HttpServletRequest}
	 * @param accessToken
	 *            {@link String} access token after OAuth
	 */
	public static void saveStripeImportPref(HttpServletRequest req,
			Token accessToken, String isForAll) throws Exception {

		String code = req.getParameter("code");
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST, String.format(
				"https://connect.stripe.com/oauth/token?code=%s&grant_type=%s",
				code, "authorization_code"));

		oAuthRequest.addHeader("Authorization", "Bearer "
				+ Globals.DEV_STRIPE_API_KEY);

		Response response = oAuthRequest.send();

		HashMap<String, String> properties = new ObjectMapper().readValue(
				response.getBody(),
				new TypeReference<HashMap<String, String>>() {
				});

		ContactPrefs prefs = new ContactPrefs();
		if (properties.containsKey("refresh_token")) {

			prefs.refreshToken = properties.get("refresh_token");
			prefs.apiKey = properties.get("access_token");
			prefs.type = Type.STRIPE;
			prefs.othersParams = "first";
			prefs.save();
		}
		// retrieve User Account information from stripe
		Account account = Account.retrieve(prefs.apiKey);
		prefs.userName = account.getEmail();

		if (properties.containsKey("refresh_token")) {

			prefs.refreshToken = properties.get("refresh_token");
			prefs.apiKey = properties.get("access_token");
			prefs.type = Type.STRIPE;
			prefs.othersParams = "first";
		}

		prefs.save();

	}

	/**
	 * If service name is Twitter or LinkedIn, widget is fetched by plugin_id in
	 * session and widget is updated with new token key and secret key
	 * 
	 * @param req
	 *            {@link HttpServletRequest}
	 * @param accessToken
	 *            {@link String} access token after OAuth
	 */
	public static Long saveLinkedInOrTwitterPrefs(HttpServletRequest req,
			Token accessToken, String isForAll) throws Exception {
		System.out.println("Saving LinkedIn or Twitter Prefs");

		Map<String, String> properties = new HashMap<String, String>();
		properties.put("token", accessToken.getToken());
		properties.put("secret", accessToken.getSecret());
		properties.put("time", String.valueOf(System.currentTimeMillis()));
		properties.put("isForAll", isForAll);

		// Gets widget name from the session
		String serviceType = (String) req.getSession().getAttribute(
				"service_type");

		System.out.println("serviceName " + serviceType);
		// update widget with tokens
		return saveWidgetPrefsByName(serviceType, properties);
	}

	/**
	 * If Service type is GMail, SocialPrefs object is created in database with
	 * the tokens
	 * 
	 * @param accessToken
	 *            {@link String} access token after OAuth
	 * @param service
	 *            configured {@link OAuthService}
	 * @param agileUser
	 *            current {@link AgileUser}
	 * @throws IOException
	 */
	public static void saveGmailPrefs(String code, OAuthService service,
			AgileUser agileUser, String isForAll) throws IOException {
		System.out.println("Saving Gmail Prefs");

		HashMap<String, Object> tokenMap = GoogleServiceUtil
				.exchangeAuthTokenForAccessToken(code,
						ScribeServlet.GMAIL_SCOPE);

		System.out.println(tokenMap);
		/*
		 * Signed get request is made to retrieve access token and secret
		 */
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET,
				"https://www.googleapis.com/oauth2/v1/userinfo?alt=json");
		Token token = new Token(((String) tokenMap.get("access_token")),
				"dummy");
		System.out.println(token);
		System.out.println(service);
		service.signRequest(token, oAuthRequest);
		System.out.println(service.getAuthorizationUrl(token));
		Response response = oAuthRequest.send();

		System.out.println(response.getBody());

		HashMap<String, String> properties = new ObjectMapper().readValue(
				response.getBody(),
				new TypeReference<HashMap<String, String>>() {
				});

		System.out.println(properties);
		// save GMail prefs in db
		SocialPrefs gmailPrefs = new SocialPrefs(agileUser,
				SocialPrefs.Type.GMAIL,
				((String) tokenMap.get("access_token")), "v2", properties);
		gmailPrefs.refresh_token = ((String) tokenMap.get("refresh_token"));
		gmailPrefs.expires_at = System.currentTimeMillis()
				+ (Long.parseLong((String.valueOf(tokenMap.get("expires_in")))) - 120)
				* 1000;
		gmailPrefs.save();
	}

	/**
	 * If service type is stripe, we make a post request with the code and get
	 * the access token,widget is fetched by plugin_id in session and is updated
	 * with new access token and refresh token
	 * 
	 * @param {@link HttpServletRequest}
	 * @param code
	 *            {@link String} code retrieved after OAuth
	 * @throws IOException
	 */
	public static Long saveStripePrefs(HttpServletRequest req, String code,
			String isForAll) throws IOException {
		System.out.println("In stripe save");
		Long widgetID = null;
		/*
		 * Make a post request and retrieve tokens
		 */
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST, String.format(
				"https://connect.stripe.com/oauth/token?code=%s&grant_type=%s",
				code, "authorization_code"));

		oAuthRequest.addHeader("Authorization", "Bearer "
				+ Globals.STRIPE_API_KEY);
		try {
			Response response = oAuthRequest.send();
			HashMap<String, String> properties = new ObjectMapper().readValue(
					response.getBody(),
					new TypeReference<HashMap<String, String>>() {
					});

			// Gets widget name from the session
			String serviceType = (String) req.getSession().getAttribute(
					"service_type");

			System.out.println("serviceName " + serviceType);

			properties.put("isForAll", isForAll);
			// update widget with tokens
			widgetID = saveWidgetPrefsByName(serviceType, properties);
		} catch (Exception e) {
			System.out.println(e);
		}
		return widgetID;
	}

	/**
	 * If service type is google, we make a post request with the code and get
	 * the access token and ContactPrefs object is saved in database with new
	 * access token and refresh token
	 * 
	 * @param code
	 *            {@link String} code retrieved after OAuth
	 * @throws IOException
	 */
	public static void saveGooglePrefs(String code, JSONObject object,
			String isForAll) throws IOException {
		System.out.println("In google save token");

		// Creates HashMap from response JSON string
		HashMap<String, Object> properties = GoogleServiceUtil
				.exchangeAuthTokenForAccessToken(code, "");

		System.out.println(properties.toString());

		// if post gives error, notifies user about it
		if (properties.isEmpty() || properties.containsKey("error")) {
			BulkActionNotifications
					.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE,
							"Authentication failed");
			return;
		}

		// after getting access token save prefs in db
		ContactPrefs contactPrefs = new ContactPrefs();
		contactPrefs.type = Type.GOOGLE;
		contactPrefs.token = properties.get("access_token").toString();
		contactPrefs.setPrefs(object);
		contactPrefs.setExpiryTime(Long.valueOf(properties.get("expires_in")
				.toString()));
		contactPrefs.refreshToken = properties.get("refresh_token").toString();
		if (ContactPrefsUtil.findPrefsByType(Type.GOOGLE))
			contactPrefs.save();

		// initialize backend to save contacts
		// ContactsImportUtil.initilaizeGoogleSyncBackend(contactPrefs.id);
	}

	/**
	 * Using Authorization code fetching from Oauth request, request is set to
	 * exchange refresh token with auth code.
	 * 
	 * @param code
	 * @param object
	 * @throws IOException
	 */
	public static void saveGoogleCalenderPrefs(String code, JSONObject object,
			String isForAll) throws IOException {
		// Exchanges access token/refresh token with extracted Authorization
		// code
		HashMap<String, Object> result = GoogleServiceUtil
				.exchangeAuthTokenForAccessToken(code,
						ScribeServlet.GOOGLE_CALENDAR_SCOPE);
		System.out.println(result);
		String refresh_token = String.valueOf(result.get("refresh_token"));
		String access_token = String.valueOf(result.get("access_token"));

		GoogleCalenderPrefs pref = new GoogleCalenderPrefs(refresh_token,
				access_token);
		// Sets expiry time and saves prefs
		pref.setExpiryTime(Integer.valueOf(result.get("expires_in").toString()));
		pref.save();
	}

	/**
	 * Saves the preferences of widgets into widget by widget id with the key
	 * value pairs in map
	 * 
	 * @param widgetId
	 *            {@link String} id of the widget
	 * @param properties
	 *            {@link Map} which contains widget prefs as key-value pairs
	 */
	public static void saveWidgetPrefs(String widgetId,
			Map<String, String> properties) {
		Widget widget = WidgetUtil.getWidget(Long.parseLong(widgetId));

		// If widget is null returns, since no widget exists with id.
		if (widget == null) {
			System.out.println("Widget not found with " + widgetId);
			return;
		}
		System.out.println("Response from Plugin:" + properties.toString());
		saveWidgetPrefs(widget, properties);

	}

	public static Long saveWidgetPrefsByName(String widgetName,
			Map<String, String> properties) throws Exception {
		Long widgetID = null;
		Widget widget = DefaultWidgets.getDefaultWidgetByName(widgetName);
		// If widget is null returns, since no widget exists with id.
		if (widget != null) {
			System.out.println("Response from Plugin:" + properties.toString());
			widgetID = saveWidgetPrefs(widget, properties);
		}
		return widgetID;
	}

	public static Long saveWidgetPrefs(Widget widget,
			Map<String, String> properties) {
		Long WidgetID = null;

		System.out.println("Response from Plugin:" + properties.toString());

		/*
		 * If widget exists with id given, access token and secret are added to
		 * prefs in widget
		 */
		Iterator<Entry<String, String>> it = properties.entrySet().iterator();
		widget.isForAll = Boolean.valueOf(properties.get("isForAll"));
		while (it.hasNext()) {
			Map.Entry<String, String> pairs = it.next();
			System.out.println(pairs.getKey() + " = " + pairs.getValue());
			widget.addProperty(pairs.getKey(), pairs.getValue());
			it.remove(); // avoids a ConcurrentModificationException
		}

		// Saves widget
		widget.save();
		System.out.println(widget.id);
		System.out.println("Widget Id");
		if (widget != null && widget.id > 0) {
			WidgetID = widget.id;
		}
		return WidgetID;
	}

	public static String getGoogileDrivePrefs(String code) {
		HashMap<String, Object> result = GoogleServiceUtil
				.exchangeAuthTokenForAccessToken(code,
						ScribeServlet.GOOGLE_DRIVE_SCOPE);
		String token = String.valueOf(result.get("access_token"));
		return token;
	}

	/**
	 * save facebook prefs data contain accesstoken tokensecret etc
	 * 
	 * @param req
	 * @param code
	 * @param service
	 * @throws IOException
	 */
	public static Long saveFacebookPrefs(HttpServletRequest req, String code,
			OAuthService service, String isForAll) throws IOException,
			Exception {
		System.out.println("In Facebook save");

		Verifier verifier = new Verifier(code);

		/*
		 * Signed get request is made to retrieve access token and secret
		 */
		OAuthRequest request = new OAuthRequest(Verb.GET,
				"https://graph.facebook.com/oauth/access_token");
		request.addQuerystringParameter(OAuthConstants.CLIENT_ID,
				Globals.FACEBOOK_APP_ID);
		request.addQuerystringParameter(OAuthConstants.CLIENT_SECRET,
				Globals.FACEBOOK_APP_SECRET);
		request.addQuerystringParameter(OAuthConstants.CODE,
				verifier.getValue());
		request.addQuerystringParameter(OAuthConstants.REDIRECT_URI,
				FacebookApi.getRedirectURL());
		Response response = request.send();

		String responseString = response.getBody();
		String accessToken = null;

		System.out.println(responseString);

		// get accesstoken from responsebody string
		String ts[] = responseString.split("&");
		for (int i = 0; i < ts.length; i++) {
			if (ts[i].contains("access_token=")) {
				accessToken = ts[i].substring(ts[i].lastIndexOf("=") + 1);
				break;
			}
		}

		Map<String, String> properties = new HashMap<String, String>();
		properties.put("token", accessToken);
		properties.put("verifier", verifier.getValue());
		properties.put("code", code);
		properties.put("time", String.valueOf(System.currentTimeMillis()));
		properties.put("isForAll", isForAll);

		// Gets widget name from the session
		String serviceType = (String) req.getSession().getAttribute(
				"service_type");

		System.out.println("serviceName " + serviceType);

		System.out.println(properties);

		// update widget with tokens
		return saveWidgetPrefsByName(serviceType, properties);

	}

	public static void saveQuickBookPrefs(Map<String, String> map) {
		ContactPrefs contactPrefs = new ContactPrefs();
		contactPrefs.token = map.get("token");
		contactPrefs.secret = map.get("secret");
		contactPrefs.othersParams = map.get("company");
		contactPrefs.type = Type.QUICKBOOK;
		contactPrefs.save();
		String companyInfoQuery = "SELECT * FROM CompanyInfo";
		String url = String.format(
				"https://quickbooks.api.intuit.com/v3/company/"
						+ map.get("company") + "/query?query=%s",
				URLEncoder.encode(companyInfoQuery));
		try {
			String result = SignpostUtil.accessURLWithOauth(
					Globals.QUICKBOOKS_CONSUMER_KEY,
					Globals.QUICKBOOKS_CONSUMER_SECRET, map.get("token"),
					map.get("secret"), url, "GET", "", "quickbooks");

			JSONObject response = new JSONObject(result);
			JSONObject queryResponse = (JSONObject) response
					.get("QueryResponse");
			if (queryResponse != null) {
				if (queryResponse.has("CompanyInfo")) {
					JSONArray listCompany = (JSONArray) queryResponse
							.get("CompanyInfo");
					JSONObject company = (JSONObject) listCompany.get(0);
					Object comp = company.get("CompanyName");
					if (comp != null) {
						String companyName = comp.toString().split("'")[0];
						contactPrefs.userName = companyName;
					}
				}
			}
		} catch (Exception e) {

			e.printStackTrace();
		}
		contactPrefs.save();

	}

	/**
	 * save Xero ContactSyncPrefs
	 * 
	 * @param req
	 * @param accessToken
	 */

	private static void saveXeroPrefs(HttpServletRequest req,
			Token accessToken, String isForAll) {
		ContactPrefs prefs = new ContactPrefs();
		prefs.token = accessToken.getToken();
		prefs.secret = accessToken.getSecret();
		prefs.type = Type.XERO;
		prefs.save();
		try {
			String result = SignpostUtil.accessURLWithOauth(
					Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID, prefs.token,
					prefs.secret, "https://api.xero.com/api.xro/2.0/users",
					"GET", "", "xero");
			JSONObject response = new JSONObject(result);
			if (response.has("Users")) {
				JSONArray users = (JSONArray) response.get("Users");
				JSONObject user = (JSONObject) users.get(0);
				if (user.has("EmailAddress")) {
					prefs.userName = user.getString("EmailAddress");
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		prefs.save();
	}

	public static Long saveGooglePlusPrefs(HttpServletRequest req, String code,
			String isForAll) throws Exception {
		System.out.println("Saving GPlus Prefs");

		// Exchanges access token/refresh token with extracted Authorization
		// code
		HashMap<String, Object> result = GoogleServiceUtil
				.exchangeAuthTokenForAccessToken(code,
						ScribeServlet.GOOGLE_PLUS_OAUTH2_SCOPE);

		System.out.println(result);

		String refresh_token = String.valueOf(result.get("refresh_token"));
		String access_token = String.valueOf(result.get("access_token"));
		String expires_in = String.valueOf(result.get("expires_in"));

		Map<String, String> properties = new HashMap<String, String>();
		properties.put("code_token", code);
		properties.put("access_token", access_token);
		properties.put("refresh_token", refresh_token);
		properties.put("expires_in", expires_in);
		properties.put("time", String.valueOf(System.currentTimeMillis()));
		properties.put("isForAll", isForAll);

		// Gets widget name from the session
		String serviceType = (String) req.getSession().getAttribute(
				"service_type");

		System.out.println("serviceName " + serviceType);
		// update widget with tokens
		return saveWidgetPrefsByName(serviceType, properties);
	}

	public static void updateGooglePlusPrefs(String widgetId, String code,
			String refreshToken) throws Exception {
		System.out.println("Update GPlus Prefs");

		String response = GoogleServiceUtil.refreshTokenInGoogle(refreshToken);

		// Creates HashMap from response JSON string
		HashMap<String, Object> result = new ObjectMapper().readValue(response,
				new TypeReference<HashMap<String, Object>>() {
				});
		System.out.println(result.toString());

		String access_token = String.valueOf(result.get("access_token"));
		String expires_in = String.valueOf(result.get("expires_in"));

		Map<String, String> properties = new HashMap<String, String>();
		properties.put("code_token", code);
		properties.put("access_token", access_token);
		properties.put("refresh_token", refreshToken);
		properties.put("expires_in", expires_in);
		properties.put("time", String.valueOf(System.currentTimeMillis()));
		saveWidgetPrefs(widgetId, properties);

		// update widget with tokens
		// saveWidgetPrefsByName(serviceType, properties);
	}

	public static boolean isWindowPopUpOpened(String serviceName,
			String returnURL, HttpServletRequest req, HttpServletResponse resp) {

		// Get session param
		boolean openedService = false;
		Object obj = req.getSession().getAttribute("window_opened_service");
		if (obj != null)
			openedService = (boolean) obj;
		if (!openedService)
			return false;

		// Delete return url Attribute
		req.getSession().removeAttribute("window_opened_service");

		String[] syncPrefServices = new String[] { "google", "stripe_import",
				"shopify", "google_calendar", "quickbook-import" };
		if (StringUtils.isBlank(returnURL))
			returnURL = "/";

		if (Arrays.asList(syncPrefServices).contains(serviceName)) {
			try {
				resp.getWriter().print(
						"<script>parent.window.opener.executeDataSyncReturnCallback('"
								+ returnURL + "','" + serviceName
								+ "'); window.close();</script>");
			} catch (Exception e) {
			}

			return true;
		}

		return false;
	}

	public static boolean closeOpendWindow(String returnUrl,
			HttpServletRequest req, HttpServletResponse resp) {

		boolean openedService = false;
		Object obj = req.getSession().getAttribute("window_opened_service");
		if (obj != null)
			openedService = (boolean) obj;
		if (!openedService)
			return false;

		// Delete return url Attribute
		req.getSession().removeAttribute("window_opened_service");
		try {
			resp.setContentType("text/html");
			resp.getWriter().print(
					"<script type='text/javascript'> window.close();</script>");
			return true;
		} catch (Exception e) {

		}
		return false;

	}

}
