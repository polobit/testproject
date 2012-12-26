package com.agilecrm;

import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Collections;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.session.OpenIdServlet;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;

@SuppressWarnings("serial")
public class GMailGadgetServlet extends HttpServlet
{
    public static final String SESSION_KEY_NAME = "one_time_session_key";
    public static final String SESSION_GADGET_NAME = "gadget_key";

    public boolean validate(HttpServletRequest req, HttpServletResponse resp)
	    throws Exception
    {
	// Get OpenSocial ID
	String ownerId = req.getParameter("opensocial_owner_id");
	System.out.println("Owner Id " + ownerId);

	// Get Domain User with this Social Id
	DomainUser domainUser = DomainUserUtil
		.getDomainUserFromGadgetId(ownerId);
	if (domainUser == null)
	    return false;

	NamespaceManager.set(domainUser.domain);

	// Get API Key
	String apiKey = APIKey.getAPIKey().api_key;

	System.out.println("Api Key " + apiKey + " for " + domainUser);

	JSONObject result = new JSONObject();
	result.put("user_exists", true);
	result.put("api_key", apiKey);
	result.put("domain", domainUser.domain);

	System.out.println("Result " + result.toString());

	// Setup API Key
	resp.getWriter().println(result.toString());

	return false;
    }

    public boolean save(HttpServletRequest req, HttpServletResponse resp)
	    throws Exception
    {
	// Get Current User
	UserInfo user = (UserInfo) req.getSession().getAttribute(
		SessionManager.AUTH_SESSION_COOKIE_NAME);
	resp.getWriter().println("Saving user " + user);

	// Get Gadget Id
	String oneTimeSessionKey = req.getParameter(SESSION_KEY_NAME);
	resp.getWriter().println("One time session " + oneTimeSessionKey);

	// Get Cache Id
	String ownerId = (String) Util.getCache(oneTimeSessionKey);
	if (ownerId == null)
	{
	    resp.getWriter()
		    .println(
			    "We are unable to find any related session. Either you have waited too long to associate your new gadget. Please refresh your GMail and try again.");
	    return false;
	}

	// Remove from Cache
	Util.deleteCache(oneTimeSessionKey);

	resp.getWriter().println("Owner Id " + ownerId);

	// Setup Authentication Key
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(user
		.getEmail());
	if (domainUser == null)
	{
	    resp.getWriter().println(
		    "We are unable to find any account with this userid");
	    return false;
	}

	resp.getWriter().println("Domain User " + domainUser);

	// Save the gadget_id
	domainUser.gadget_id = ownerId;
	domainUser.save();

	resp.getWriter().println("You can close the browser");

	return false;
    }

    // Set Up
    public void setup(HttpServletRequest req, HttpServletResponse resp)
	    throws Exception
    {
	// Get One Time Key
	String oneTimeSessionKey = req.getParameter(SESSION_KEY_NAME);

	// Check in cache and add to session id
	if (Util.getCache(oneTimeSessionKey) == null)
	{
	    resp.getWriter()
		    .println(
			    "We are unable to find any related session. Either you have waited too long to associate your new gadget. Please refresh your GMail and try again.");
	    return;
	}

	// Return back to this URL
	req.getSession().setAttribute(
		OpenIdServlet.RETURN_PATH_SESSION_PARAM_NAME,
		"/gmail?" + SESSION_KEY_NAME + "=" + oneTimeSessionKey
			+ "&openid=done&hd=" + req.getParameter("hd"));

	resp.sendRedirect("/openid" + "?hd=" + req.getParameter("hd"));
    }

    // Generate One Time session which will be used before openid authentication
    public void generateOneTimeSessionKey(HttpServletRequest req,
	    HttpServletResponse resp) throws Exception
    {
	// Get OpenSocial ID
	String ownerId = req.getParameter("opensocial_owner_id");
	System.out.println("Owner Id " + ownerId);

	// Generate One-time session
	SecureRandom random = new SecureRandom();
	String oneTimeSessionKey = new BigInteger(130, random).toString(32);

	// Store in Cache so that when the popup is authenticated - we will
	// get this value
	// Basicaly - the popup does the openid authentcation and then maps
	// this opensocialid using this one-time-session
	Util.setCache(oneTimeSessionKey, ownerId);

	JSONObject result = new JSONObject();
	result.put("user_exists", false);
	result.put("popup", "https://googleapps.agilecrm.com/gmail?"
		+ SESSION_KEY_NAME + "=" + oneTimeSessionKey);

	System.out.println("Result " + result.toString());

	resp.getWriter().println(result.toString());
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {

	// First client sends social_id, we check in DomainUser Db
	// If not present, we generate session key, store it in memcache and
	// pass this as a param back
	// The client opens a popup with this param key and forwards it to
	// openid
	// The openid returns to this servlet with the original session key
	// Opensocialid and the user are then saved
	try
	{
	    System.out.println(req);
	    for (Object param : Collections.list(req.getParameterNames()))
	    {
		System.out.println(param);
		System.out.println(req.getParameter((String) param));
	    }

	    // If Popup or after openid auth (one time session key will be sent)
	    if (req.getParameter(SESSION_KEY_NAME) != null)
	    {

		// Is it after openid
		if (req.getParameter("openid") != null)
		{
		    save(req, resp);
		}
		else
		{
		    // Setup OpenId Authentication
		    setup(req, resp);
		}

		return;
	    }

	    // See if there is a domain user with this open_social_id, other
	    // setup
	    if (!validate(req, resp))
		generateOneTimeSessionKey(req, resp);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }
}
