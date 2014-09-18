package com.agilecrm;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
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
    public static final String DISASSOCIATE_GADGET = "disassociate_gadget";

    public static final String OPENSOCIAL_OWNER_ID = "opensocial_owner_id";

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
	// Get Gadget Id
	String ownerId = req.getParameter(OPENSOCIAL_OWNER_ID);

	// Setup Authentication Key
	DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
	System.out.println("domain user : " + domainUser);
	if (domainUser == null)
	{
	    resp.getWriter()
		    .println(
			    "Sorry, you do not have any account. Please contact your Agile CRM administrator to get a User account or <a href='https://my.agilecrm.com/register'>click here</a>.");
	    return false;
	}

	// Save the gadget_id
	domainUser.gadget_id = ownerId;
	domainUser.save();

	resp.getWriter()
		.println(
			"<img src='https://www.agilecrm.com/img/logo-black.png'><p>You have successfully associated your gadget with your Agile CRM account. Please close this popup to start using gadget.</p>");
	return false;
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

	JSONObject result = new JSONObject();

	String oauthURL = "https://" + req.getServerName() + "/oauth?return_url=";

	String returnURL = "gmail?command=save&" + OPENSOCIAL_OWNER_ID + "=" + ownerId;
	result.put("popup", oauthURL + URLEncoder.encode(returnURL));

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

	// Gets user based on email address
	DomainUser user = DomainUserUtil.getCurrentDomainUser();

	// If user is null, check if the client has sent this request. It sends
	// open_social_id
	if (user == null)
	{
	    String ownerId = req.getParameter("opensocial_owner_id");
	    user = DomainUserUtil.getDomainUserFromGadgetId(ownerId);
	}

	if (user == null)
	{
	    resp.getWriter().println("You are not currently logged in to perform this operation");
	    return;
	}

	// If user exists then gadget id is removed from it and saved
	System.out.println("user : " + user);
	// Removes gadget id associated with the account and saves it
	user.gadget_id = null;
	user.save();

	System.out.println(user);

	// Returns disassociated true after disassociation of gadget id (It
	// returns true even if user does not exist, considering user is already
	// deleted)
	JSONObject result = new JSONObject();
	result.put("deleted", true);
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

	    // Add this in session manager
	    try
	    {
		SessionManager.set((HttpServletRequest) req);
	    }
	    catch (Exception e)
	    {
	    }

	    String command = req.getParameter("command");
	    System.out.println("Command " + command);

	    // If Validate
	    if (command.equalsIgnoreCase("validate"))
	    {
		if (!validate(req, resp))
		    generateOneTimeSessionKey(req, resp);
		return;
	    }

	    // If Delete
	    if (command.equalsIgnoreCase("delete"))
	    {
		disassociateGadget(req, resp);
		return;
	    }

	    // If Popup or after openid auth (one time session key will be sent)
	    if (command.equalsIgnoreCase("save"))
	    {
		save(req, resp);
		return;
	    }

	    System.out.println("Command not found");

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