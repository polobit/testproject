package com.agilecrm;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
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

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.util.Base64Encoder;
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
    public static String SERVICE_TYPE_LINKED_IN = "linkedin";
    public static String SERVICE_TYPE_TWITTER = "twitter";
    public static String SERVICE_TYPE_GMAIL = "gmail";
    public static String SERVICE_TYPE_STRIPE = "stripe";

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

	System.out.println("getSErvice:" + callback);
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
		    .apiSecret(Globals.SENDGRID_API_KEY).scope("read_write")
		    .build();

	    // Gets session and sets attribute "oauth.service" to Twitter type
	    // as specified by Scribe
	    req.getSession().setAttribute("oauth.service", SERVICE_TYPE_STRIPE);
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
	AgileUser agileUser = null;
	OAuthService service = null;

	if (serviceName.equalsIgnoreCase("Stripe"))
	{
	    code = req.getParameter("code");
	}
	else
	{
	    requestToken = (Token) req.getSession().getAttribute(
		    "oauth.request_token");

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

	    // Get Agile User
	    agileUser = AgileUser.getCurrentAgileUser();
	    if (agileUser == null)
	    {
		System.out.println("Cannot find Agile User");
		return;
	    }
	}

	// Gets service name from session
	String serviceNameInSession = (String) req.getSession().getAttribute(
		"oauth.service");

	// If service name is Twitter of LinkedIn, widget is fetched by
	// plugin_id in session and widget is updated with new token key and
	// secret key
	if (serviceNameInSession.equalsIgnoreCase(SERVICE_TYPE_TWITTER)
		|| serviceNameInSession
			.equalsIgnoreCase(SERVICE_TYPE_LINKED_IN))
	{

	    System.out.println("Saving Twitter Prefs");

	    // Gets widget Id from the session
	    String widgetId = (String) req.getSession().getAttribute(
		    "plugin_id");

	    System.out.println(widgetId);

	    // Gets widget based on the plugin_id from session
	    Widget widget = WidgetUtil.getWidget(Long.parseLong(widgetId));

	    // If widget is null returns, since no widget exists with id.
	    if (widget == null)
	    {
		System.out.println("Widget not found with " + widgetId);
		return;
	    }

	    // If widget exists with id given, access token and secret are
	    // added to prefs in widget
	    widget.addProperty("token", accessToken.getToken());
	    widget.addProperty("secret", accessToken.getSecret());

	    // Saves widget
	    widget.save();

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

	    Map<String, String> properties = new HashMap<String, String>();

	    try
	    {
		JSONObject responseJSON = new JSONObject(response.getBody());

		Iterator<String> nameItr = responseJSON.keys();
		while (nameItr.hasNext())
		{
		    String name = nameItr.next();
		    properties.put(name, responseJSON.getString(name));
		}
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	    SocialPrefs gmailPrefs = new SocialPrefs(agileUser,
		    SocialPrefs.Type.GMAIL, accessToken.getToken(),
		    accessToken.getSecret(), properties);
	    gmailPrefs.save();
	}

	else if (serviceNameInSession.equalsIgnoreCase(SERVICE_TYPE_STRIPE))
	{
	    System.out.println("In save token");
	    Base64Encoder enc = new Base64Encoder();
	    OAuthRequest oAuthRequest = new OAuthRequest(
		    Verb.POST,
		    String.format(
			    "https://connect.stripe.com/oauth/token?code=%s&grant_type=%s",
			    code, "authorization_code"));
	    oAuthRequest.addHeader("Authorization", "Bearer "
		    + Globals.STRIPE_API_KEY);
	    Map<String, String> properties = new HashMap<String, String>();
	    try
	    {
		Response response = oAuthRequest.send();
		System.out.println("Stripe response " + response);
		JSONObject responseJSON = new JSONObject(response.getBody());

		Iterator<String> nameItr = responseJSON.keys();
		System.out.println("map:" + properties.toString());
		while (nameItr.hasNext())
		{
		    String name = nameItr.next();
		    properties.put(name, responseJSON.getString(name));
		    System.out.println(name + ":"
			    + responseJSON.getString(name));
		}

	    }
	    catch (JSONException e)
	    {
		System.out.println(e.getMessage());
	    }

	    // Gets widget Id from the session
	    String widgetId = (String) req.getSession().getAttribute(
		    "plugin_id");

	    System.out.println(widgetId);

	    // Gets widget based on the plugin_id from session
	    Widget widget = WidgetUtil.getWidget(Long.parseLong(widgetId));

	    // If widget is null returns, since no widget exists with id.
	    if (widget == null)
	    {
		System.out.println("Widget not found with " + widgetId);
		return;
	    }

	    // If widget exists with id given, access token and secret are
	    // added to prefs in widget
	    widget.addProperty("token", properties.get("access_token"));

	    // Saves widget
	    widget.save();
	}

	String returnURL = (String) req.getSession().getAttribute("return_url");

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
	if (serviceName.equalsIgnoreCase("Stripe"))
	{
	    url = service.getAuthorizationUrl(null);
	    System.out.println("Stripe redirect url" + url);
	}
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

	String token = req.getParameter("access_token");
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
}
