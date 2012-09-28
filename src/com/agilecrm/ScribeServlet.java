package com.agilecrm;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import com.agilecrm.widgets.Widget;

@SuppressWarnings("serial")
public class ScribeServlet extends HttpServlet
{
    public static String SERVICE_TYPE_LINKED_IN = "linkedin";
    public static String SERVICE_TYPE_TWITTER = "twitter";
    public static String SERVICE_TYPE_GMAIL = "gmail";

    // Get Service
    public static OAuthService getService(HttpServletRequest req,
	    HttpServletResponse resp, String serviceType)
    {
	String callback = req.getRequestURL().toString();

	System.out.println(callback);
	OAuthService service = null;
	if (serviceType == null
		|| serviceType.equalsIgnoreCase(SERVICE_TYPE_LINKED_IN))
	{
	    service = new ServiceBuilder().provider(LinkedInApi.class)
		    .callback(callback).apiKey(Globals.LINKED_IN_API_KEY)
		    .apiSecret(Globals.LINKED_IN_SECRET_KEY).build();
	    req.getSession().setAttribute("oauth.service",
		    SERVICE_TYPE_LINKED_IN);
	}
	else if (serviceType.equalsIgnoreCase(SERVICE_TYPE_TWITTER))

	{
	    service = new ServiceBuilder().provider(TwitterApi.class)
		    .callback(callback).apiKey(Globals.TWITTER_API_KEY)
		    .apiSecret(Globals.TWITTER_SECRET_KEY).build();
	    req.getSession()
		    .setAttribute("oauth.service", SERVICE_TYPE_TWITTER);
	}
	else
	{
	    service = new ServiceBuilder()
		    .provider(GoogleApi.class)
		    .callback(callback)
		    .apiKey(Globals.GMAIL_API_KEY)
		    .apiSecret(Globals.GMAIL_SECRET_KEY)
		    .scope("https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile")
		    .build();

	    req.getSession().setAttribute("oauth.service", SERVICE_TYPE_GMAIL);

	}

	return service;
    }

    // Save Token after it returns back
    public static void saveToken(HttpServletRequest req,
	    HttpServletResponse resp) throws IOException
    {

	String oAuthToken = req.getParameter("oauth_token");
	String oAuthVerifier = req.getParameter("oauth_verifier");

	// Retrieve Token and Service Name from session
	String serviceName = (String) req.getSession().getAttribute(
		"oauth.service");
	Token requestToken = (Token) req.getSession().getAttribute(
		"oauth.request_token");

	// Get Service
	OAuthService service = getService(req, resp, serviceName);

	Verifier verifier = new Verifier(oAuthVerifier);

	if (requestToken != null)
	{
	    Token token = new Token(oAuthToken, requestToken.getSecret());
	    Token accessToken = service.getAccessToken(token, verifier);

	    System.out.println("Token " + accessToken.getToken());
	    System.out.println("Secret " + accessToken.getSecret());

	    // Get Agile User
	    AgileUser agileUser = AgileUser.getCurrentAgileUser();
	    if (agileUser == null)
	    {
		System.out.println("Cannot find Agile User");
		return;
	    }

	    String serviceNameInSession = (String) req.getSession()
		    .getAttribute("oauth.service");

	    if (serviceNameInSession.equalsIgnoreCase(SERVICE_TYPE_TWITTER)
		    || serviceNameInSession
			    .equalsIgnoreCase(SERVICE_TYPE_LINKED_IN))
	    {

		System.out.println("Saving Twitter Prefs");

		String widgetId = (String) req.getSession().getAttribute(
			"plugin_id");

		System.out.println(widgetId);

		// Get Widget
		Widget widget = Widget.getWidget(Long.parseLong(widgetId));
		if (widget == null)
		{
		    System.out.println("Widget not found with " + widgetId);
		    return;
		}

		// Save token, tokenSecret
		widget.addProperty("token", accessToken.getToken());
		widget.addProperty("secret", accessToken.getSecret());

		widget.save();

	    }
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

	}

	String returnURL = (String) req.getSession().getAttribute("return_url");

	// Get Back URL and send
	if (returnURL == null)
	    resp.sendRedirect("/home#" + serviceName);
	else
	    resp.sendRedirect(returnURL);
    }

    // Set up OAuth
    public void setupOAuth(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {

	// Get service based on the params
	String serviceName = req.getParameter("service");
	OAuthService service = getService(req, resp, serviceName);

	Token requestToken = service.getRequestToken();

	// Save Token and Service as we need them after it returns back
	req.getSession().setAttribute("oauth.request_token", requestToken);

	// Save Return URL and Plugin-Id
	String returnURL = req.getParameter("return_url");
	if (returnURL != null)
	    req.getSession().setAttribute("return_url", returnURL);

	String pluginId = req.getParameter("plugin_id");
	if (pluginId != null)
	    req.getSession().setAttribute("plugin_id", pluginId);

	// Redirect URL
	String url = service.getAuthorizationUrl(requestToken);
	resp.sendRedirect(url);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {

	// Check if it is first time or returning from oauth authentication
	// If token and verifier is present, we just store or redirect to the
	// authorization page
	String oAuthToken = req.getParameter("oauth_token");
	String oAuthVerifier = req.getParameter("oauth_verifier");

	if (oAuthToken != null && oAuthVerifier != null)
	{
	    saveToken(req, resp);
	    return;
	}

	setupOAuth(req, resp);
	return;

    }
}
