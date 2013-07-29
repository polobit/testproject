package com.agilecrm;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.scribe.builder.ServiceBuilder;
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
import com.agilecrm.contact.imports.util.ContactsImporter;
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
	// Gets callback url
	String callback = req.getRequestURL().toString();

	System.out.println("getService:" + callback);
	OAuthService service = null;

	// If service is null or service type is LinkedIn service is built
	if (serviceType == null
		|| serviceType.equalsIgnoreCase(SERVICE_TYPE_LINKED_IN))
	{
	    // Creates a Service, by specifying API key, Secret key
	    service = new ServiceBuilder().provider(LinkedInApi.class)
		    .callback(callback).apiKey(Globals.LINKED_IN_API_KEY)
		    .apiSecret(Globals.LINKED_IN_SECRET_KEY).build();

	    // Gets session and sets attribute "oauth.service" to LinkedIn type
	    // as specified by Scribe
	    req.getSession().setAttribute("oauth.service",
		    SERVICE_TYPE_LINKED_IN);
	}

	// else if (serviceType.equalsIgnoreCase(SERVICE_TYPE_FRESHBOOKS))
	//
	// {
	// // Creates a Service, by specifying API key, Secret key
	// service = new ServiceBuilder().provider(FreshBooksApi.class)
	// .callback(callback).apiKey(Globals.FRESHBOOKS_API_KEY)
	// .apiSecret(Globals.FRESHBOOKS_SECRET_KEY).build();
	//
	// // Gets session and sets attribute "oauth.service" to Twitter type
	// // as specified by Scribe
	// req.getSession().setAttribute("oauth.service",
	// SERVICE_TYPE_FRESHBOOKS);
	// }

	// If service is null or service type is Twitter service is built
	else if (serviceType.equalsIgnoreCase(SERVICE_TYPE_TWITTER))
	{
	    // Creates a Service, by specifying API key, Secret key
	    service = new ServiceBuilder().provider(TwitterApi.class)
		    .callback(callback).apiKey(Globals.TWITTER_API_KEY)
		    .apiSecret(Globals.TWITTER_SECRET_KEY).build();

	    // Gets session and sets attribute "oauth.service" to Twitter type
	    // as specified by Scribe
	    req.getSession()
		    .setAttribute("oauth.service", SERVICE_TYPE_TWITTER);
	}

	else if (serviceType.equalsIgnoreCase(SERVICE_TYPE_STRIPE))

	{
	    // Creates a Service, by specifying API key, Secret key
	    service = new ServiceBuilder().provider(StripeApi.class)
		    .callback(callback).apiKey(Globals.STRIPE_CLIENT_ID)
		    .apiSecret(Globals.STRIPE_API_KEY).scope("read_only")
		    .build();

	    // Gets session and sets attribute "oauth.service" to Twitter type
	    // as specified by Scribe
	    req.getSession().setAttribute("oauth.service", SERVICE_TYPE_STRIPE);
	}

	else if (serviceType.equalsIgnoreCase(SERVICE_TYPE_GOOGLE))

	{
	    // Creates a Service, by specifying API key, Secret key
	    service = new ServiceBuilder()
		    .provider(com.agilecrm.GoogleApi.class).callback(callback)
		    .apiKey(Globals.GOOGLE_CLIENT_ID)
		    .apiSecret(Globals.GOOGLE_SECRET_KEY)
		    .scope("https://www.google.com/m8/feeds/").build();

	    // Gets session and sets attribute "oauth.service" to Twitter type
	    // as specified by Scribe
	    req.getSession().setAttribute("oauth.service", SERVICE_TYPE_GOOGLE);
	}

	else
	{
	    // Creates a Service, by specifying API key, Secret key
	    service = new ServiceBuilder()
		    .provider(GoogleApi.class)
		    .callback(callback)
		    .apiKey(Globals.GMAIL_API_KEY)
		    .apiSecret(Globals.GMAIL_SECRET_KEY)
		    .scope("https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile")
		    .build();

	    // Gets session and sets attribute "oauth.service" to Gmail type
	    // as specified by Scribe
	    req.getSession().setAttribute("oauth.service", SERVICE_TYPE_GMAIL);

	}

	return service;
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

	// Retrieves Token and Service Name from session
	String serviceName = (String) req.getSession().getAttribute(
		"oauth.service");

	String code = null;
	Token requestToken = null;
	Token accessToken = null;
	OAuthService service = null;

	if (serviceName.equalsIgnoreCase("Stripe")
		|| serviceName.equalsIgnoreCase("google"))
	{
	    code = req.getParameter("code");
	    System.out.println(code);
	}
	else
	{
	    requestToken = (Token) req.getSession().getAttribute(
		    "oauth.request_token");

	    if (requestToken == null)
		return;

	    // Token and verifier are read from request parameters
	    String oAuthToken = req.getParameter("oauth_token");
	    String oAuthVerifier = req.getParameter("oauth_verifier");
	    // Gets Service
	    service = getService(req, resp, serviceName);

	    // Builds a verifier
	    Verifier verifier = new Verifier(oAuthVerifier);

	    // if request token in not null, new token is created using
	    // oAuthToken,
	    // which gets the token from the provider

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

	// Gets service name from session
	String serviceNameInSession = (String) req.getSession().getAttribute(
		"oauth.service");

	// If service name is Twitter or LinkedIn, widget is fetched by
	// plugin_id in session and widget is updated with new token key and
	// secret key
	if (serviceNameInSession.equalsIgnoreCase(SERVICE_TYPE_TWITTER)
		|| serviceNameInSession
			.equalsIgnoreCase(SERVICE_TYPE_LINKED_IN))
	{
	    // Gets widget Id from the session
	    String widgetId = (String) req.getSession().getAttribute(
		    "plugin_id");

	    System.out.println(widgetId);

	    Map<String, String> properties = new HashMap<String, String>();
	    properties.put("token", accessToken.getToken());
	    properties.put("secret", accessToken.getSecret());
	    properties.put("time", String.valueOf(System.currentTimeMillis()));

	    saveWidgetPrefs(widgetId, properties);
	}

	// If Service type is Gmail
	else if (serviceNameInSession.equalsIgnoreCase(SERVICE_TYPE_GMAIL))
	{

	    System.out.println("Saving Gmail Prefs");

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

	    SocialPrefs gmailPrefs = new SocialPrefs(agileUser,
		    SocialPrefs.Type.GMAIL, accessToken.getToken(),
		    accessToken.getSecret(), properties);
	    gmailPrefs.save();
	}

	else if (serviceNameInSession.equalsIgnoreCase(SERVICE_TYPE_STRIPE))
	{
	    System.out.println("In stripe save");

	    OAuthRequest oAuthRequest = new OAuthRequest(
		    Verb.POST,
		    String.format(
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
	    String widgetId = (String) req.getSession().getAttribute(
		    "plugin_id");

	    System.out.println(widgetId);

	    saveWidgetPrefs(widgetId, properties);
	}

	else if (serviceNameInSession.equalsIgnoreCase(SERVICE_TYPE_GOOGLE))
	{
	    System.out.println("In google save token");

	    OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST,
		    "https://accounts.google.com/o/oauth2/token");

	    oAuthRequest
		    .addBodyParameter("client_id", Globals.GOOGLE_CLIENT_ID);
	    oAuthRequest.addBodyParameter("client_secret",
		    Globals.GOOGLE_SECRET_KEY);
	    oAuthRequest.addBodyParameter("scope", "");
	    oAuthRequest.addBodyParameter("redirect_uri",
		    "http://localhost:8888/backend/googleservlet");
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

	    if (properties.containsKey("error"))
		System.out.println(properties.get("error"));
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
		ContactsImporter.initilaizeImportBackend(contactPrefs);

	    }

	}
	String returnURL = (String) req.getSession().getAttribute("return_url");
	System.out.println("return url" + returnURL);

	// Get Back URL and send
	if (returnURL == null)
	    resp.sendRedirect("/home#" + serviceName);
	else
	    resp.sendRedirect(returnURL);
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

	// Get service based on the params
	String serviceName = req.getParameter("service");
	OAuthService service = getService(req, resp, serviceName);

	String url;
	Token token = null;

	// On oauth cancel
	if (serviceName == null)
	{
	    String return_url = (String) req.getSession().getAttribute(
		    "return_url");

	    // Redirect URL
	    resp.sendRedirect(return_url);
	    return;
	}
	if (serviceName.equalsIgnoreCase(SERVICE_TYPE_STRIPE)
		|| serviceName.equalsIgnoreCase(SERVICE_TYPE_GOOGLE))
	{
	    url = service.getAuthorizationUrl(null);

	    System.out.println("redirect url" + url);
	}
	// else if (serviceName.equalsIgnoreCase(SERVICE_TYPE_FRESHBOOKS))
	// {
	//
	// // token = service.getRequestToken();
	// // System.out.println(token);
	// OAuthRequest oAuthRequest = new OAuthRequest(Verb.POST,
	// FreshBooksApi.REQUEST_TOKEN_URL);
	// Response res = oAuthRequest.send();
	// System.out.println(res.getBody());
	// url = "";
	// System.out.println("freshboooks redirect url" + url);
	//
	// }
	else
	{
	    token = service.getRequestToken();

	    url = service.getAuthorizationUrl(token);
	    System.out.println("redirect url" + url);
	}

	// Save Token and Service as we need them after it returns back
	req.getSession().setAttribute("oauth.request_token", token);

	// Save Return URL and Plugin-Id
	String returnURL = req.getParameter("return_url");
	if (returnURL != null)
	    req.getSession().setAttribute("return_url", returnURL);

	String pluginId = req.getParameter("plugin_id");
	if (pluginId != null)
	    req.getSession().setAttribute("plugin_id", pluginId);

	// Redirect URL
	resp.sendRedirect(url);
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

	// Check if it is first time or returning from oauth authentication
	// If token and verifier is present, we just store or redirect to the
	// authorization page
	String oAuthToken = req.getParameter("oauth_token");
	String oAuthVerifier = req.getParameter("oauth_verifier");

	System.out.println(oAuthToken);
	System.out.println(oAuthVerifier);

	String code = req.getParameter("code");

	/*
	 * If aAuthToken and oAuthVerifier is not null i.e., request is from
	 * service provider, tokens are saved
	 */
	if (code != null || (oAuthToken != null && oAuthVerifier != null))
	{
	    saveToken(req, resp);
	    return;
	}

	// If request is from application the setup, request is sent based in
	// service type
	setupOAuth(req, resp);
	return;

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

	// If widget exists with id given, access token and secret are
	// added to prefs in widget
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
