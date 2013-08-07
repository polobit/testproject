package com.agilecrm;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.GoogleApi;
import org.scribe.builder.api.LinkedInApi;
import org.scribe.builder.api.TwitterApi;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import com.agilecrm.contact.imports.ContactPrefs;
import com.agilecrm.contact.imports.ContactPrefs.Type;
import com.agilecrm.contact.imports.util.ContactsImportUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.scribe.api.StripeApi;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>ScribeServlet</code> is used to create and configure a client to
 * connect to Linked, Twitter, Gmail, Facebook etc, scribe.jar provides methods
 * to configure a connection, as follows
 * 
 * <pre>
 * OAuthService service = new ServiceBuilder().provider(LinkedInApi.class)
 * 	.apiKey(YOUR_API_KEY).apiSecret(YOUR_API_SECRET).build();
 * </pre>
 * <p>
 * providing the api keys and secret key given by the provider, scribe connects
 * to Linkedin, Twitter. Token can be accessed from the the request parameters
 * "oauth.service" and oauth.request_token
 * </p>
 * 
 */
@SuppressWarnings("serial")
public class ScribeServlet extends HttpServlet
{
    public static final String SERVICE_TYPE_LINKED_IN = "linkedin";
    public static final String SERVICE_TYPE_TWITTER = "twitter";
    public static final String SERVICE_TYPE_GMAIL = "gmail";
    public static final String SERVICE_TYPE_GOOGLE = "google";
    public static final String SERVICE_TYPE_STRIPE = "stripe";
    public static final String SERVICE_TYPE_FRESHBOOKS = "freshbooks";
    public static final String STRIPE_SCOPE = "read_only";
    public static final String GOOGLE_CONTACTS_SCOPE = "https://www.google.com/m8/feeds/";
    public static final String GMAIL_SCOPE = "https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

    /**
     * Process the post request to servlet request, request can be sent either
     * from application client or from service provider (After connecting to
     * provider and returned). If request parameters have "oauth_token" and
     * "oauth_verifier" then request is from provider with token keys which are
     * saved in widget.
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
	    throws ServletException, IOException
    {
	doGet(req, resp);
    }

    /**
     * Process the get request to servlet request, request can be sent either
     * from application client or from service provider (After connecting to
     * provider and returned). If request parameters have "oauth_token" and
     * "oauth_verifier" then request is from provider with token keys which are
     * saved in widget.
     */
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {
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
		|| (oAuthToken != null && oAuthVerifier != null))
	{
	    saveToken(req, resp);
	    return;
	}

	/*
	 * If the request is from imports we get this parameter, This happens
	 * when we have the user google tokens with us, there is no need of
	 * authenticating him again
	 */
	String serviceType = req.getParameter("service_type");

	// If service type is not null, we have Contact preferences
	if (serviceType != null)
	{
	    // Initializes backends to import contacts
	    ContactsImportUtil.initializeImport(serviceType);
	    return;
	}

	/*
	 * If request is from application the setup, request is sent based on
	 * service type
	 */
	setupOAuth(req, resp);
	return;

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
	    throws IOException
    {

	// Get service name from request
	String serviceName = req.getParameter("service");

	System.out.println("in set up of scribe " + serviceName);

	// On oauth cancel
	if (serviceName == null)
	{
	    String return_url = (String) req.getSession().getAttribute(
		    "return_url");

	    System.out.println("return url in oauth cancel " + return_url);
	    // Redirect URL
	    resp.sendRedirect(return_url);
	    return;
	}

	// Build the scribe service, based on service name
	OAuthService service = getService(req, resp, serviceName);

	String url;
	Token token = null;

	// oauth 2.0
	if (serviceName.equalsIgnoreCase(SERVICE_TYPE_STRIPE)
		|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE))
	{
	    // After building service, redirects to authorization page
	    url = service.getAuthorizationUrl(null);

	    System.out.println("redirect url " + url);
	}
	// oauth 1.0
	else
	{
	    token = service.getRequestToken();

	    // After building service, redirects to authorization page
	    url = service.getAuthorizationUrl(token);
	    System.out.println("redirect url " + url);
	}

	/*
	 * Save Token,Return URL and Plugin-Id in session as we need them after
	 * it returns back
	 */
	req.getSession().setAttribute("oauth.request_token", token);

	String returnURL = req.getParameter("return_url");
	if (returnURL != null)
	    req.getSession().setAttribute("return_url", returnURL);

	String pluginId = req.getParameter("plugin_id");
	if (pluginId != null)
	    req.getSession().setAttribute("plugin_id", pluginId);

	System.out.println("in setup of scribe response " + resp);

	// Redirect URL
	resp.sendRedirect(url);
    }

    // Get Service
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
     *            (linkedin/Twitter/Google/Facebook..)
     * @return {@link OAuthRequest}
     */
    public static OAuthService getService(HttpServletRequest req,
	    HttpServletResponse resp, String serviceType)
    {
	/*
	 * Get callback url, to which the tokens are returned after
	 * authentication
	 */
	String callback = req.getRequestURL().toString();
	System.out.println("getService callback: " + callback);

	OAuthService service = null;

	// If service type LinkedIn, creates a Service, specific to LinkedIn
	if (serviceType.equalsIgnoreCase(SERVICE_TYPE_LINKED_IN))
	    service = getSpecificService(req, SERVICE_TYPE_LINKED_IN,
		    LinkedInApi.class, callback, Globals.LINKED_IN_API_KEY,
		    Globals.LINKED_IN_SECRET_KEY, null);

	// If service type Twitter, creates a Service, specific to Twitter
	else if (serviceType.equalsIgnoreCase(SERVICE_TYPE_TWITTER))
	    service = getSpecificService(req, SERVICE_TYPE_TWITTER,
		    TwitterApi.class, callback, Globals.TWITTER_API_KEY,
		    Globals.TWITTER_SECRET_KEY, null);

	// If service type Stripe, creates a Service, specific to Stripe
	else if (serviceType.equalsIgnoreCase(SERVICE_TYPE_STRIPE))
	    service = getSpecificService(req, SERVICE_TYPE_STRIPE,
		    StripeApi.class, callback, Globals.STRIPE_CLIENT_ID,
		    Globals.STRIPE_API_KEY, STRIPE_SCOPE);

	// If service type Google, creates a Service, specific to Google
	else if (serviceType.equalsIgnoreCase(SERVICE_TYPE_GOOGLE))
	    service = getSpecificService(req, SERVICE_TYPE_GOOGLE,
		    com.agilecrm.scribe.api.GoogleApi.class, callback,
		    Globals.GOOGLE_CLIENT_ID, Globals.GOOGLE_SECRET_KEY,
		    GOOGLE_CONTACTS_SCOPE);

	// Creates a Service, specific to Gmail
	else
	    service = getSpecificService(req, SERVICE_TYPE_GMAIL,
		    GoogleApi.class, callback, Globals.GMAIL_API_KEY,
		    Globals.GMAIL_SECRET_KEY, GMAIL_SCOPE);

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
	    String apiKey, String apiSecret, String scope)
    {

	// Gets session and sets attribute "oauth.service" to service type
	req.getSession().setAttribute("oauth.service", serviceType);

	// if scope is null return service without scope
	if (scope == null)
	    // Creates a Service, by configuring API key, Secret key
	    return new ServiceBuilder().provider(apiClass).callback(callback)
		    .apiKey(apiKey).apiSecret(apiSecret).build();

	// if scope is needed in the service
	return new ServiceBuilder().provider(apiClass).callback(callback)
		.apiKey(apiKey).apiSecret(apiSecret).scope(scope).build();
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
	    HttpServletResponse resp) throws IOException
    {

	// Retrieve Token and Service Name from session
	String serviceName = (String) req.getSession().getAttribute(
		"oauth.service");

	String code = null;
	Token requestToken = null;
	Token accessToken = null;
	OAuthService service = null;

	// OAuth 2.0 requires code parameter
	if (serviceName.equalsIgnoreCase("Stripe")
		|| serviceName.equalsIgnoreCase("google"))
	    code = req.getParameter("code");

	// OAuth 1.0 requires token and verifier
	else
	{
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
	    service = getService(req, resp, serviceName);

	    // Builds a verifier
	    Verifier verifier = new Verifier(oAuthVerifier);

	    Token token = new Token(oAuthToken, requestToken.getSecret());

	    accessToken = service.getAccessToken(token, verifier);

	    System.out.println("Token " + accessToken.getToken());
	    System.out.println("Secret " + accessToken.getSecret());
	}

	// Get Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();
	if (agileUser == null)
	{
	    System.out.println("Cannot find Agile User");
	    return;
	}

	System.out.println("service name in save token " + serviceName);

	/*
	 * If service name is Twitter or LinkedIn, widget is fetched by
	 * plugin_id in session and widget is updated with new token key and
	 * secret key
	 */
	if (serviceName.equalsIgnoreCase(SERVICE_TYPE_TWITTER)
		|| serviceName.equalsIgnoreCase(SERVICE_TYPE_LINKED_IN))
	    saveLinkedInOrTwitterPrefs(req, accessToken);

	// If Service type is Gmail, save preferences in social prefs
	else if (serviceName.equalsIgnoreCase(SERVICE_TYPE_GMAIL))
	    saveGmailPrefs(accessToken, service, agileUser);

	/*
	 * if service type is stripe, we post the code and get the access token
	 * and widget is updated with new access token and refresh token
	 */
	else if (serviceName.equalsIgnoreCase(SERVICE_TYPE_STRIPE))
	    saveStripePrefs(req, code);

	/*
	 * if service type is google, we post the code and get the access token
	 * and ContactPrefs object is saved with new access token and refresh
	 * token
	 */
	else if (serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE))
	    saveGooglePrefs(code);

	// return URL is retrieved from session
	String returnURL = (String) req.getSession().getAttribute("return_url");
	System.out.println("return url " + returnURL);

	// If return URL is null, redirect to dashboard
	if (returnURL == null)
	    resp.sendRedirect("/");
	else
	    resp.sendRedirect(returnURL);
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
    public static void saveLinkedInOrTwitterPrefs(HttpServletRequest req,
	    Token accessToken)
    {
	System.out.println("Saving LinkedIn or Twitter Prefs");

	// Gets widget Id from the session
	String widgetId = (String) req.getSession().getAttribute("plugin_id");

	Map<String, String> properties = new HashMap<String, String>();
	properties.put("token", accessToken.getToken());
	properties.put("secret", accessToken.getSecret());
	properties.put("time", String.valueOf(System.currentTimeMillis()));

	// update widget with tokens
	saveWidgetPrefs(widgetId, properties);
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
    public static void saveGmailPrefs(Token accessToken, OAuthService service,
	    AgileUser agileUser) throws IOException
    {
	System.out.println("Saving Gmail Prefs");

	/*
	 * Signed get request is made to retrieve access token and secret
	 */
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET,
		"https://www.googleapis.com/oauth2/v1/userinfo?alt=json");
	service.signRequest(accessToken, oAuthRequest);
	Response response = oAuthRequest.send();

	System.out.println(response.getBody());

	HashMap<String, String> properties = new ObjectMapper().readValue(
		response.getBody(),
		new TypeReference<HashMap<String, String>>()
		{
		});

	// save GMail prefs in db
	SocialPrefs gmailPrefs = new SocialPrefs(agileUser,
		SocialPrefs.Type.GMAIL, accessToken.getToken(),
		accessToken.getSecret(), properties);
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
    public static void saveStripePrefs(HttpServletRequest req, String code)
	    throws IOException
    {
	System.out.println("In stripe save");

	/*
	 * Make a post request and retrieve tokens
	 */
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST, String.format(
		"https://connect.stripe.com/oauth/token?code=%s&grant_type=%s",
		code, "authorization_code"));

	oAuthRequest.addHeader("Authorization", "Bearer "
		+ Globals.STRIPE_API_KEY);

	Response response = oAuthRequest.send();
	HashMap<String, String> properties = new ObjectMapper().readValue(
		response.getBody(),
		new TypeReference<HashMap<String, String>>()
		{
		});

	// Gets widget Id from the session
	String widgetId = (String) req.getSession().getAttribute("plugin_id");

	// save prefs in widget
	saveWidgetPrefs(widgetId, properties);
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
    public static void saveGooglePrefs(String code) throws IOException
    {
	System.out.println("In google save token");

	/*
	 * Make a post request and retrieve tokens
	 */
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST,
		"https://accounts.google.com/o/oauth2/token");

	oAuthRequest.addBodyParameter("client_id", Globals.GOOGLE_CLIENT_ID);
	oAuthRequest.addBodyParameter("client_secret",
		Globals.GOOGLE_SECRET_KEY);
	oAuthRequest.addBodyParameter("scope", "");
	oAuthRequest
		.addBodyParameter(
			"redirect_uri",
			"https://null-dot-sandbox-dot-agile-crm-cloud.appspot.com/backend/googleservlet");
	oAuthRequest.addBodyParameter("code", code);
	oAuthRequest.addBodyParameter("grant_type", "authorization_code");

	Response response = oAuthRequest.send();

	// Creates HashMap from response JSON string
	HashMap<String, Object> properties = new ObjectMapper().readValue(
		response.getBody(),
		new TypeReference<HashMap<String, Object>>()
		{
		});

	System.out.println(properties.toString());

	// if post gives error, notifies user about it
	if (properties.containsKey("error"))
	    BulkActionNotifications.publishconfirmation(
		    BulkAction.CONTACTS_IMPORT_MESSAGE,
		    "Authentication failed. Please import again");
	else
	{
	    // after getting access token save prefs in db
	    ContactPrefs contactPrefs = new ContactPrefs(Type.GOOGLE,
		    ((String) properties.get("access_token")), null,
		    (Long.parseLong((String.valueOf(properties
			    .get("expires_in"))))),
		    ((String) properties.get("refresh_token")));
	    contactPrefs.save();

	    // initialize backend to save contacts
	    ContactsImportUtil.initilaizeImportBackend(contactPrefs);
	}
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
	    Map<String, String> properties)
    {
	Widget widget = WidgetUtil.getWidget(Long.parseLong(widgetId));

	// If widget is null returns, since no widget exists with id.
	if (widget == null)
	{
	    System.out.println("Widget not found with " + widgetId);
	    return;
	}
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

}
