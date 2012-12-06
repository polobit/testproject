package com.agilecrm.core.api;

import java.net.URLEncoder;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.ContactView;
import com.agilecrm.core.DomainUser;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.DBUtil;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;

@Path("/api")
public class API
{

    // This method is called if TEXT_PLAIN is request
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String sayPlainTextHello()
    {
	return "Invalid Path";
    }

    // Send Current User Info
    @Path("current-user")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser getCurrentUser()
    {
	try
	{
	    DomainUser domainUser = DomainUser.getDomainCurrentUser();
	    System.out.println(domainUser);
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Logs

    // User Prefs -

    // Register
    @Path("domain-availability/{domain}")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Map<String, String> register(@PathParam("email") String domain)
    {

	// Get Users for this domain to see if it is free
	List<DomainUser> usersList = DomainUser.getUsers(domain);

	if (!usersList.isEmpty())
	{
	    Hashtable<String, String> result = new Hashtable<String, String>();
	    result.put("error", "domain does not exist");
	    return result;
	}

	Hashtable<String, String> result = new Hashtable<String, String>();
	result.put("success", "domain available");

	// Set the session variable to register
	return result;
    }

    @Path("send-email")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void createEmail(@QueryParam("from") String fromEmail, @QueryParam("to") String to,
	    @QueryParam("subject") String subject, @QueryParam("body") String body)
    {
	try
	{
	    Util.sendMail(fromEmail, fromEmail, to, subject, fromEmail, body, null);
	}
	catch (Exception e)
	{

	    e.printStackTrace();
	}
    }

    // API Key
    // This method is called if TEXT_PLAIN is request
    @Path("api-key")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public APIKey getAPIKey()
    {
	return APIKey.getAPIKey();
    }

    // Get List of Contact Views Author: Yaswanth 08-10-2012
    @Path("contact-view")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<ContactView> getContactViews()
    {
	return ContactView.getContactViewList();

    }

    // Contact view Save Author: Yaswanth 08-10-2012
    @Path("contact-view")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactView createContactView(ContactView contact_view)
    {
	contact_view.save();
	return contact_view;

    }

    // Contact view Save Author: Yaswanth 08-10-2012
    @Path("contact-view")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactView updateContactView(ContactView contact_view)
    {
	System.out.println("updateing view");
	contact_view.save();
	return contact_view;

    }

    // Get Contact View by id Author: Yaswanth 09-02-2012
    @Path("contact-view/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ContactView getContactView(@PathParam("id") Long id)
    {
	return ContactView.getContactView(id);

    }

    // Bulk delete Contact Views by id Author: Yaswanth 11-08-2012
    @Path("contact-view/delete/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteBulkContactViews(@FormParam("model_ids") String model_ids)
	    throws JSONException
    {
	JSONArray ContactViewsJSONArray = new JSONArray(model_ids);
	ContactView.dao.deleteBulkByIds(ContactViewsJSONArray);
    }

    // Contact view Save Author: Yaswanth 08-10-2012
    @Path("stats")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON })
    public String getStats(@QueryParam("e") String searchEmail)
    {

	// Get API Key
	APIKey api = APIKey.getAPIKey();
	String apiKey = api.api_key;

	// Hit Stats Server
	String url = "https://stats.agilecrm.com:90/get?email=" + searchEmail + "&agile_id="
		+ apiKey;

	return Util.accessURL(url);
    }

    // Contact view Save Author: Yaswanth 08-10-2012
    @Path("email")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON })
    public String getEmails(@QueryParam("e") String searchEmail, @QueryParam("c") String count,
	    @QueryParam("o") String offset)
    {

	String url = null;

	// Get Imap Prefs
	IMAPEmailPrefs imapPrefs = IMAPEmailPrefs.getIMAPPrefs(AgileUser.getCurrentAgileUser());
	if (imapPrefs != null)
	{
	    String userName = imapPrefs.user_name;
	    String host = imapPrefs.server_name;
	    String password = imapPrefs.password;
	    String port = "993";

	    // URL Encode Params
	    userName = URLEncoder.encode(userName);
	    host = URLEncoder.encode(host);
	    password = URLEncoder.encode(password);
	    port = URLEncoder.encode(port);

	    url = "http://stats.agilecrm.com:8080/AgileCRMEmail/imap?user_name=" + userName
		    + "&search_email=" + searchEmail + "&host=" + host + "&port=" + port
		    + "&offset=" + offset + "&count=" + count + "&command=imap_email&password="
		    + password;
	}
	else
	{
	    // Get Gmail Social Prefs
	    Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	    SocialPrefs gmailPrefs = SocialPrefs.getPrefs(AgileUser.getCurrentAgileUser(),
		    socialPrefsTypeEnum);

	    if (gmailPrefs != null)
	    {

		String userName = gmailPrefs.email;
		String host = "imap.gmail.com";
		String port = "993";
		String consumerKey = "anonymous";
		String consumerSecret = "anonymous";

		String oauth_key = gmailPrefs.token;
		String oauth_secret = gmailPrefs.secret;

		// URL Encode Params
		userName = URLEncoder.encode(userName);
		host = URLEncoder.encode(host);
		port = URLEncoder.encode(port);
		consumerKey = URLEncoder.encode(consumerKey);
		consumerSecret = URLEncoder.encode(consumerSecret);
		oauth_key = URLEncoder.encode(oauth_key);
		oauth_secret = URLEncoder.encode(oauth_secret);

		url = "http://stats.agilecrm.com:8080/AgileCRMEmail/imap?command=oauth_email&user_name="
			+ userName
			+ "&search_email="
			+ searchEmail
			+ "&host="
			+ host
			+ "&port="
			+ port
			+ "&offset="
			+ offset
			+ "&count="
			+ count
			+ "&consumer_key="
			+ consumerKey
			+ "&consumer_secret="
			+ consumerSecret
			+ "&oauth_key="
			+ oauth_key + "&oauth_secret=" + oauth_secret;
	    }
	}

	String jsonResult = "";
	if (url != null)
	    jsonResult = Util.accessURL(url);

	if (url == null || jsonResult == null)
	{
	    // If url is null throw exception to configure email prefs
	    if (url == null)
		throw new WebApplicationException(
			Response.status(Response.Status.BAD_REQUEST)
				.entity("You have not yet configured your email. Please click <a href='#email'>here</a> to get started.")
				.build());
	    else
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			.entity("No Emails.").build());

	}

	return jsonResult;

    }

    // Get Agile Users
    @Path("agileusers")
    @GET
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON })
    public List<AgileUser> getAgileUsers()
    {

	return AgileUser.getUsers();
    }

    // Get All Users
    @Path("deal-owners")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<UserPrefs> getAllUserPrefs()
    {
	return UserPrefs.getAllUserPrefs();
    }

    // Get Stats
    @Path("stats2")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public JSONObject getStats()
    {
	return Util.getNamespaceCount();
    }

    // Get Stats
    @Path("namespace-stats")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getNamespaceStats()
    {
	return Util.getNamespaceStats().toString();
    }

    /**
     * Delete subscription object of the domain and deletes related customer
     */
    @Path("delete/account")
    @DELETE
    public void deleteAccount()
    {
	try
	{
	    DBUtil.deleteNamespace(NamespaceManager.get());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
    }
}