package com.agilecrm.scribe.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONException;
import org.json.JSONObject;
import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.LinkedInApi;
import org.scribe.builder.api.TwitterApi;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import com.agilecrm.Globals;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.scribe.ScribeServlet;
import com.agilecrm.scribe.api.StripeApi;
import com.agilecrm.scribe.login.util.OAuthLoginUtil;
import com.agilecrm.social.FacebookUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.DefaultWidgets;
import com.agilecrm.widgets.util.WidgetUtil;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.GoogleServiceUtil;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;

//import org.codehaus.jackson.map.ObjectMapper;

/**
 * <code>ScribeUtil</code> class contains methods to be used by
 * {@link ScribeServlet} to get the appropriate service required for OAuth1 and
 * OAuth2 and to save tokens after authentication
 * 
 * @author Tejaswi
 * @since August 2013
 */
public class ScribeUtil
{

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
    public static OAuthService getService(HttpServletRequest req, HttpServletResponse resp, String serviceType)
    {
	/*
	 * Get callback url, to which the tokens are returned after
	 * authentication
	 */
	String callback = req.getRequestURL().toString();
	System.out.println("getService callback: " + callback);

	OAuthService service = null;

	// If service type LinkedIn, creates a Service, specific to LinkedIn
	if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_LINKED_IN))
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_LINKED_IN, LinkedInApi.class, callback,
		    Globals.LINKED_IN_API_KEY, Globals.LINKED_IN_SECRET_KEY, null);

	// If service type Twitter, creates a Service, specific to Twitter
	else if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_TWITTER))
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_TWITTER, TwitterApi.SSL.class, callback,
		    Globals.TWITTER_API_KEY, Globals.TWITTER_SECRET_KEY, null);

	// If service type Stripe, creates a Service, specific to Stripe
	else if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_STRIPE))
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_STRIPE, StripeApi.class, callback,
		    Globals.STRIPE_CLIENT_ID, Globals.STRIPE_API_KEY, ScribeServlet.STRIPE_SCOPE);

	// If service type Google, creates a Service, specific to Google
	else if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE))
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_GOOGLE,
		    com.agilecrm.scribe.api.GoogleApi.class, callback, Globals.GOOGLE_CLIENT_ID,
		    Globals.GOOGLE_SECRET_KEY, ScribeServlet.GOOGLE_CONTACTS_SCOPE);

	// If service type Google, creates a Service, specific to Google
	else if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE_CALENDAR))
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_GOOGLE_CALENDAR,
		    com.agilecrm.scribe.api.GoogleApi.class, callback, Globals.GOOGLE_CALENDAR_CLIENT_ID,
		    Globals.GOOGLE_CALENDAR_SECRET_KEY, ScribeServlet.GOOGLE_CALENDAR_SCOPE);

	else if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_OAUTH_LOGIN))
	    service = OAuthLoginUtil.getLoginService(req, resp, serviceType);

	// Creates a Service, specific to Gmail
	else if (serviceType.equals(ScribeServlet.SERVICE_TYPE_GOOGLE_DRIVE))
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_GOOGLE_DRIVE,
		    com.agilecrm.scribe.api.GoogleApi.class, callback, Globals.GOOGLE_CLIENT_ID,
		    Globals.GOOGLE_CLIENT_ID, ScribeServlet.GOOGLE_DRIVE_SCOPE);

	// Create a Service specific to xero
	else if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_XERO))
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_XERO, com.agilecrm.scribe.api.XeroApi.class,
		    callback, Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID, null);

	// Create a Service specific to facebook
	else if (serviceType.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_FACEBOOK))
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_FACEBOOK,
		    com.agilecrm.scribe.api.FacebookApi.class, callback, Globals.FACEBOOK_APP_ID,
		    Globals.FACEBOOK_APP_SECRET, null);

	// Creates a Service, specific to Gmail
	else
	    service = getSpecificService(req, ScribeServlet.SERVICE_TYPE_GMAIL,
		    com.agilecrm.scribe.api.GoogleApi.class, callback, Globals.GOOGLE_CLIENT_ID,
		    Globals.GOOGLE_CLIENT_ID, ScribeServlet.GMAIL_SCOPE);

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
    public static OAuthService getSpecificService(HttpServletRequest req, String serviceType,
	    Class<? extends Api> apiClass, String callback, String apiKey, String apiSecret, String scope)
    {

	// Gets session and sets attribute "oauth.service" to service type
	req.getSession().setAttribute("oauth.service", serviceType);

	// scope="read_friendlists,read_stream";

	// if scope is null return service without scope
	if (scope == null)
	    // Creates a Service, by configuring API key, Secret key
	    return new ServiceBuilder().provider(apiClass).callback(callback).apiKey(apiKey).apiSecret(apiSecret)
		    .build();
	else
	    return new ServiceBuilder().provider(apiClass).callback(callback).apiKey(apiKey).apiSecret(apiSecret)
		    .scope(scope).build();

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
    public static void saveTokens(HttpServletRequest req, HttpServletResponse resp, OAuthService service,
	    String serviceName, Token accessToken, String code) throws IOException
    {
	// We use Scribe for OAuth2 Authentication as well
	if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_OAUTH_LOGIN))
	{
	    System.out.println("OAUTH2 AUTHENTICATED ");
	    OAuthLoginUtil.login(req, resp, code, service);
	    return;
	}

	// Get Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();
	if (agileUser == null)
	{
	    System.out.println("Cannot find Agile User");
	    return;
	}

	/*
	 * If service name is Twitter or LinkedIn, widget is fetched by
	 * plugin_id in session and widget is updated with new token key and
	 * secret key
	 */
	if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_TWITTER)
		|| serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_LINKED_IN))
	    saveLinkedInOrTwitterPrefs(req, accessToken);

	// If Service type is Gmail, save preferences in social prefs
	else if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GMAIL))
	    saveGmailPrefs(code, service, agileUser);

	/*
	 * if service type is stripe, we post the code and get the access token
	 * and widget is updated with new access token and refresh token
	 */
	else if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_STRIPE))
	    saveStripePrefs(req, code);

	/*
	 * if service type is google, we post the code and get the access token
	 * and ContactPrefs object is saved with new access token and refresh
	 * token
	 */
	else if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE))
	{
	    saveGooglePrefs(code, null);
	}
	else if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE_CALENDAR))
	{
	    saveGoogleCalenderPrefs(code, null);
	}
	else if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_GOOGLE_DRIVE))
	{
	    String returnURL = (String) req.getSession().getAttribute("return_url");
	    // Appends code in return url
	    returnURL = returnURL + "&code=" + code;
	    req.getSession().setAttribute("return_url", returnURL);
	}
	else if (serviceName.equalsIgnoreCase(ScribeServlet.SERVICE_TYPE_FACEBOOK))
	    saveFacebookPrefs(req, code, service);

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
    public static void saveLinkedInOrTwitterPrefs(HttpServletRequest req, Token accessToken)
    {
	System.out.println("Saving LinkedIn or Twitter Prefs");

	Map<String, String> properties = new HashMap<String, String>();
	properties.put("token", accessToken.getToken());
	properties.put("secret", accessToken.getSecret());
	properties.put("time", String.valueOf(System.currentTimeMillis()));

	// Gets widget name from the session
	String serviceType = (String) req.getSession().getAttribute("service_type");

	System.out.println("serviceName " + serviceType);
	// update widget with tokens
	saveWidgetPrefsByName(serviceType, properties);
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
    public static void saveGmailPrefs(String code, OAuthService service, AgileUser agileUser) throws IOException
    {
	System.out.println("Saving Gmail Prefs");

	HashMap<String, Object> tokenMap = GoogleServiceUtil.exchangeAuthTokenForAccessToken(code,
		ScribeServlet.GMAIL_SCOPE);

	System.out.println(tokenMap);
	/*
	 * Signed get request is made to retrieve access token and secret
	 */
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, "https://www.googleapis.com/oauth2/v1/userinfo?alt=json");
	Token token = new Token(((String) tokenMap.get("access_token")), "dummy");
	System.out.println(token);
	System.out.println(service);
	service.signRequest(token, oAuthRequest);
	System.out.println(service.getAuthorizationUrl(token));
	Response response = oAuthRequest.send();

	System.out.println(response.getBody());

	HashMap<String, String> properties = new ObjectMapper().readValue(response.getBody(),
		new TypeReference<HashMap<String, String>>()
		{
		});

	System.out.println(properties);
	// save GMail prefs in db
	SocialPrefs gmailPrefs = new SocialPrefs(agileUser, SocialPrefs.Type.GMAIL,
		((String) tokenMap.get("access_token")), "v2", properties);
	gmailPrefs.refresh_token = ((String) tokenMap.get("refresh_token"));
	gmailPrefs.expires_at = System.currentTimeMillis()
		+ (Long.parseLong((String.valueOf(tokenMap.get("expires_in")))) - 120) * 1000;
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
    public static void saveStripePrefs(HttpServletRequest req, String code) throws IOException
    {
	System.out.println("In stripe save");

	/*
	 * Make a post request and retrieve tokens
	 */
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST, String.format(
		"https://connect.stripe.com/oauth/token?code=%s&grant_type=%s", code, "authorization_code"));

	oAuthRequest.addHeader("Authorization", "Bearer " + Globals.STRIPE_API_KEY);

	Response response = oAuthRequest.send();
	HashMap<String, String> properties = new ObjectMapper().readValue(response.getBody(),
		new TypeReference<HashMap<String, String>>()
		{
		});

	// Gets widget name from the session
	String serviceType = (String) req.getSession().getAttribute("service_type");

	System.out.println("serviceName " + serviceType);

	// update widget with tokens
	saveWidgetPrefsByName(serviceType, properties);

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
    public static void saveGooglePrefs(String code, JSONObject object) throws IOException
    {
	System.out.println("In google save token");

	// Creates HashMap from response JSON string
	HashMap<String, Object> properties = GoogleServiceUtil.exchangeAuthTokenForAccessToken(code, "");

	System.out.println(properties.toString());

	// if post gives error, notifies user about it
	if (properties.isEmpty() || properties.containsKey("error"))
	{
	    BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, "Authentication failed");
	    return;
	}

	// after getting access token save prefs in db
	ContactPrefs contactPrefs = new ContactPrefs(Type.GOOGLE, ((String) properties.get("access_token")), null,
		(Long.parseLong((String.valueOf(properties.get("expires_in"))))),
		((String) properties.get("refresh_token")));

	contactPrefs.setPrefs(object);
	System.out.println(contactPrefs.duration);
	System.out.println(contactPrefs.sync_type);
	contactPrefs.setExpiryTime(contactPrefs.expires);
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
    public static void saveGoogleCalenderPrefs(String code, JSONObject object) throws IOException
    {
	// Exchanges access token/refresh token with extracted Authorization
	// code
	HashMap<String, Object> result = GoogleServiceUtil.exchangeAuthTokenForAccessToken(code,
		ScribeServlet.GOOGLE_CALENDAR_SCOPE);
	System.out.println(result);
	String refresh_token = String.valueOf(result.get("refresh_token"));
	String access_token = String.valueOf(result.get("access_token"));

	GoogleCalenderPrefs pref = new GoogleCalenderPrefs(refresh_token, access_token);
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
    public static void saveWidgetPrefs(String widgetId, Map<String, String> properties)
    {
	Widget widget = WidgetUtil.getWidget(Long.parseLong(widgetId));

	// If widget is null returns, since no widget exists with id.
	if (widget == null)
	{
	    System.out.println("Widget not found with " + widgetId);
	    return;
	}
	System.out.println("Response from Plugin:" + properties.toString());
	saveWidgetPrefs(widget, properties);

    }

    public static void saveWidgetPrefsByName(String widgetName, Map<String, String> properties)
    {
	Widget widget = DefaultWidgets.getDefaultWidgetByName(widgetName);
	// If widget is null returns, since no widget exists with id.
	if (widget == null)
	{
	    System.out.println("Widget is null");
	    return;
	}
	System.out.println("Response from Plugin:" + properties.toString());
	saveWidgetPrefs(widget, properties);
    }

    public static void saveWidgetPrefs(Widget widget, Map<String, String> properties)
    {

	System.out.println("Response from Plugin:" + properties.toString());

	/*
	 * If widget exists with id given, access token and secret are added to
	 * prefs in widget
	 */
	Iterator<Entry<String, String>> it = properties.entrySet().iterator();
	while (it.hasNext())
	{
	    Map.Entry<String, String> pairs = it.next();
	    System.out.println(pairs.getKey() + " = " + pairs.getValue());
	    widget.addProperty(pairs.getKey(), pairs.getValue());
	    it.remove(); // avoids a ConcurrentModificationException
	}

	// Saves widget
	widget.save();
    }

    public static String getGoogileDrivePrefs(String code)
    {
	HashMap<String, Object> result = GoogleServiceUtil.exchangeAuthTokenForAccessToken(code,
		ScribeServlet.GOOGLE_DRIVE_SCOPE);
	String token = String.valueOf(result.get("access_token"));
	return token;
    }

    /**
     * If service type is xero, we make a post request with the code and get the
     * access token and saved into xero widgets
     * 
     * @param {@link HttpServletRequest}
     * @param data
     *            {@link String} code retrieved after OAuth
     * @throws IOException
     */
    public static void saveXeroPrefs(HttpServletRequest req, String data) throws IOException
    {
	System.out.println("In Xero save");

	/*
	 * Make a post request and retrieve tokens
	 */
	HashMap<String, String> properties = new ObjectMapper().readValue(data,
			new TypeReference<HashMap<String, String>>()
			{
			});
	/*try
	{
	   String res = SignpostUtil.accessURLWithOauth(Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID,
		    accessToken.getToken(), accessToken.getSecret(), "https://api.xero.com/api.xro/2.0/users", "GET",
		    "", "XERO");
	    JSONObject xeroProfile = new JSONObject(res);
	    JSONObject js = (JSONObject) xeroProfile.getJSONArray("Users").get(0);
	    properties.put("xeroId",js.getString("UserID"));
	    properties.put("xeroemail",js.getString("EmailAddress"));
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}*/
	// Gets widget name from the session
	String serviceType = ScribeServlet.SERVICE_TYPE_XERO;
			//(String) req.getSession().getAttribute("service_type");

	System.out.println("serviceName " + serviceType);

	// update widget with tokens

	saveWidgetPrefsByName(serviceType, properties);

    }
    
    
    
    
    /**
     * If service type is xero, we make a post request with the code and get the
     * access token, when it expires .and replace old token with new token
     * 
     * @param {@link HttpServletRequest}
     * @param code
     *            {@link String} code retrieved after OAuth
     * @throws IOException
     */
    public static void editXeroPrefs(HttpServletRequest req, String data) throws IOException
    {
	System.out.println("In Xero save");

	/*
	 * Make a post request and retrieve tokens
	 */
	HashMap<String, String> properties = new ObjectMapper().readValue(data,
			new TypeReference<HashMap<String, String>>()
			{
			});
	// Gets widget name from the session
	String serviceType = ScribeServlet.SERVICE_TYPE_XERO;
			//(String) req.getSession().getAttribute("service_type");

	System.out.println("serviceName " + serviceType);

	// update widget with tokens

	Widget widget = WidgetUtil.getWidget(Long.parseLong(properties.get("widget_id")));
	// If widget is null returns, since no widget exists with id.
	if (widget == null)
	{
	    System.out.println("Widget is null");
	    return;
	}
	System.out.println("Response from Plugin:" + properties.toString());
	properties.remove("widget_id");
	saveWidgetPrefs(widget, properties);

    }

    
    
    
    /**
     * save facebook prefs data contain accesstoken tokensecret etc
     * @param req
     * @param code
     * @param service
     * @throws IOException
     */
    public static void saveFacebookPrefs(HttpServletRequest req, String code, OAuthService service) throws IOException
    {
	System.out.println("In Facebook save");

	Verifier verifier = new Verifier(code);
	Token accessToken = service.getAccessToken(null, verifier);

	Map<String, String> properties = new HashMap<String, String>();
	properties.put("token", accessToken.getToken());
	properties.put("verifier", verifier.getValue());
	properties.put("code", code);
	properties.put("time", String.valueOf(System.currentTimeMillis()));
	
	
	// Gets widget name from the session
	String serviceType = (String) req.getSession().getAttribute("service_type");

	System.out.println("serviceName " + serviceType);

	System.out.println(properties);

	// update widget with tokens
	saveWidgetPrefsByName(serviceType, properties);

    }
}
