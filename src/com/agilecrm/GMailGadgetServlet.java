package com.agilecrm;

import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>GMailGadgetServlet</code> handles Gadget requests in Google Apps Mail.
 * If the user is already associated with the gadget social id, it sends the API
 * key and domain name so that the Client can use the AgileCRM Javascript API.
 * 
 * If there is no association, the user is sent an unique key which is used in
 * the popup.
 */
@SuppressWarnings("serial")
public class GMailGadgetServlet extends HttpServlet
{
    public static final String SESSION_KEY_NAME = "one_time_session_key";
    public static final String SESSION_GADGET_NAME = "gadget_key";
    public static final String DISASSOCIATE_GADGET = "disassociate_gadget";
    public static final String EMAIL = "email";

    /**
     * Validates the request to see if the user is present based on the
     * opensocial owner id. If present, returns API key to the gadget which will
     * then start using Javascript API
     * 
     * @param req
     * @param resp
     * @throws Exception
     */
    public boolean validate(HttpServletRequest req, HttpServletResponse resp) throws Exception
    {
	// Get OpenSocial ID
	String ownerId = req.getParameter("opensocial_owner_id");

	// Get Domain User with this Social Id
	DomainUser domainUser = DomainUserUtil.getDomainUserFromGadgetId(ownerId);
	System.out.println("owner id : + " + ownerId);
	System.out.println("domain user : " + domainUser);

	if (domainUser == null)
	{
	    return false;
	}

	NamespaceManager.set(domainUser.domain);

	UserInfo userInfo = new UserInfo("agilecrm.com", domainUser.email, domainUser.name);

	SessionManager.set(userInfo);

	// Get API Key
	String apiKey = APIKey.getAPIKey().api_key;

	// Send API Key and domain for the gadget to start using Javascript API
	JSONObject result = new JSONObject();
	result.put("user_exists", true);
	result.put("api_key", apiKey);
	result.put("domain", domainUser.domain);
	result.put("email", domainUser.email);

	// Setup API Key
	System.out.println(result.toString());
	resp.getWriter().println(result.toString());

	return true;
    }

    /**
     * Saves the current user with the relevant open social id. During the
     * setup, a one time session key is generated saving the open social id.
     * 
     * While saving, we retrieve the open social id from the one time session
     * and associates that with the logged in user
     * 
     * @param req
     * @param resp
     * @throws Exception
     */
    public boolean save(HttpServletRequest req, HttpServletResponse resp) throws Exception
    {
	// Get Current User
	UserInfo user = (UserInfo) req.getSession().getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

	// Get Gadget Id
	String oneTimeSessionKey = req.getParameter(SESSION_KEY_NAME);

	// Get Cache Id
	String ownerId = (String) CacheUtil.getCache(oneTimeSessionKey);
	if (ownerId == null)
	{
	    resp.getWriter()
		    .println(
			    "We are unable to find any related session. Either you have waited too long to associate your new gadget. Please close this popup and try again.");
	    return false;
	}

	// Remove from Cache
	CacheUtil.deleteCache(oneTimeSessionKey);

	// Setup Authentication Key
	DomainUser domainUser = DomainUserUtil.getDomainUserByEmailFromCurrentAccount(user.getEmail());
	System.out.println("domain user : " + domainUser);
	if (domainUser == null)
	{
	    resp.getWriter().println(
		    "Sorry, you do not have access to " + NamespaceManager.get()
			    + ".agilecrm.com. Please contact your Agile CRM administrator to get a User account.");
	    return false;
	}
	resp.getWriter().println("Saving user " + user.getEmail());

	// Save the gadget_id
	domainUser.gadget_id = ownerId;
	domainUser.save();

	resp.getWriter().println("You have successfully associated your gadget with your AgileCRM account. Please close this popup to start using gadget.");

	return false;
    }

    /**
     * Google recommends that we keep open social id secret. Agile generates a
     * one time session key and sends this to oauth authentication
     * 
     * @param req
     * @param resp
     * @throws Exception
     */
    public void setup(HttpServletRequest req, HttpServletResponse resp) throws Exception
    {
	// Get One Time Key
	String oneTimeSessionKey = req.getParameter(SESSION_KEY_NAME);

	// Check in cache and add to session id
	if (CacheUtil.getCache(oneTimeSessionKey) == null)
	{
	    resp.getWriter()
		    .println(
			    "We are unable to find any related session. Either you have waited too long to associate your new gadget. Please close this popup and try again.");
	    return;
	}

	String domain = req.getParameter("domain");

	// Check if the domain actually exists for the user
	int numDomainUsers = DomainUserUtil.count();
	if (numDomainUsers == 0)
	{
	    // Send domain exists as false to the client so that it can show
	    // register message
	    resp.getWriter().println(
		    "Domain <b>" + domain + "</b> does not exist. You can register a new one &nbsp;<a href=\"https://"
			    + "my.agilecrm.com/choose-domain\">here</a>.");

	    return;
	}

	// Return back to this URL with param set to done
	req.getSession().setAttribute(LoginServlet.RETURN_PATH_SESSION_PARAM_NAME,
		"/gmail?" + SESSION_KEY_NAME + "=" + oneTimeSessionKey + "&openid=done&hd=" + req.getParameter("hd"));

	resp.sendRedirect("/openid" + "?hd=" + req.getParameter("hd") + "&domain=" + req.getParameter("domain"));
    }

    /**
     * Agile generates a one time session key after storing the open social
     * owner id. If the user wants to associate the gadget with Agile user, it
     * sends back the session key.
     * 
     * @param req
     * @param resp
     * @throws Exception
     */
    public void generateOneTimeSessionKey(HttpServletRequest req, HttpServletResponse resp) throws Exception
    {
	// Get OpenSocial ID
	String ownerId = req.getParameter("opensocial_owner_id");

	// Generate One-time session
	SecureRandom random = new SecureRandom();
	String oneTimeSessionKey = new BigInteger(130, random).toString(32);

	// Store in Cache so that when the popup is authenticated - we will
	// get this value
	// Basicaly - the popup does the openid authentcation and then maps
	// this opensocialid using this one-time-session
	CacheUtil.setCacheForNumberOfDays(oneTimeSessionKey, ownerId, 7);

	JSONObject result = new JSONObject();
	result.put("user_exists", false);
	result.put("popup", "https://googleapps.agilecrm.com/gmail?" + SESSION_KEY_NAME + "=" + oneTimeSessionKey);
	result.put("expires_at", new DateUtil().addDays(6).getTime().getTime());

	resp.getWriter().println(result.toString());
    }

    /**
     * Dis-associates gadget of a particular user based on user email
     * 
     * @param req
     * @param resp
     */
    public void disassociateGadget(HttpServletRequest req, HttpServletResponse resp) throws Exception
    {
	// Reads email address of the user
	String ownerId = req.getParameter("opensocial_owner_id");
	if (StringUtils.isEmpty(ownerId))
	    return;

	// Gets user based on email address
	DomainUser user = DomainUserUtil.getDomainUserFromGadgetId(ownerId);

	// If user exists then gadget id is removed from it and saved
	if (user != null)
	{
	    System.out.println("user : " + user);
	    // Removes gadget id associated with the account and saves it
	    user.gadget_id = null;
	    user.save();
	}

	System.out.println(user);

	// Returns disassociated true after disassociation of gadget id (It
	// returns true even if user does not exist, considering user is already
	// deleted)
	JSONObject result = new JSONObject();
	result.put("DISASSOCIATED", true);
	resp.getWriter().println(result.toString());
    }

    /**
     * 
     * 1) First client sends social_id, we check in DomainUser Db to see if the
     * user exists 2) If not present, we generate session key, store it in
     * memcache and pass this as a param back. 3) When the user wants to
     * associate it, the client opens a popup with this param key and forwards
     * it to openid 4) The openid returns to this servlet with the original
     * session key 5) Opensocialid and the user are then saved
     * 
     * @param req
     * @param resp
     * @throws Exception
     */
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	try
	{
	    /*
	     * System.out.println("doGET = Params"); for (Object param :
	     * Collections.list(req.getParameterNames()))
	     * System.out.println("/t/t"+param+" --> "+req.getParameter((String)
	     * param));
	     */

	    // If Popup or after openid auth (one time session key will be sent)
	    if (req.getParameter(SESSION_KEY_NAME) != null)
	    {
		// Is it after openid
		if (req.getParameter("openid") != null)
		    save(req, resp);
		else
		    setup(req, resp); // Setup OpenId Authentication

		return;
	    }

	    if (req.getParameter(DISASSOCIATE_GADGET) != null)
	    {
		disassociateGadget(req, resp);
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

    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	doGet(req, resp);
    }
}