package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.ProfileStatus;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.DBUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

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
	    DomainUser domainUser = DomainUserUtil.getDomainCurrentUser();
	    System.out.println(domainUser);
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Logs User Prefs - Register
    @Path("domain-availability/{domain}")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Map<String, String> register(@PathParam("email") String domain)
    {
	// Get Users for this domain to see if it is free
	List<com.agilecrm.user.DomainUser> usersList = DomainUserUtil
		.getUsers(domain);

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

    // API Key
    // This method is called if TEXT_PLAIN is request
    @Path("api-key")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public APIKey getAPIKey()
    {
	return APIKey.getAPIKey();
    }

    // Get Agile Users
    @Path("agileusers")
    @GET
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
	return UserPrefsUtil.getAllUserPrefs();
    }

    // Get Stats
    @Path("stats2")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public JSONObject getStats()
    {
	return NamespaceUtil.getNamespaceCount();
    }

    // Get Stats
    @Path("namespace-stats")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getNamespaceStats()
    {
	return NamespaceUtil.getNamespaceStats().toString();
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
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @Path("/timeline/contact")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @GET
    public String timlineContacts() throws JSONException
    {
	List<Contact> contacts = ContactUtil.getAllContacts(10, null);
	JSONArray array = new JSONArray();

	JSONObject mainJSON = new JSONObject();
	JSONObject object1 = new JSONObject();

	JSONObject object3 = new JSONObject();

	// object1.put("headline", "Account ");
	object1.put("type", "default");
	object1.put("text", "contact");
	object1.put("title", "contact");
	object1.put("startDate", "1990, 07, 03");
	for (Contact contact : contacts)
	{

	    JSONObject object2 = new JSONObject();

	    String startDate = SearchUtil.getDateWithoutTimeComponent(
		    contact.created_time * 1000, "yyyy,mm,dd");

	    object2.put("startDate", startDate);

	    // object2.put("endDate",
	    // dateformat.format(new Date(contact.created_time * 1000)));

	    // object2.put("endDate", "2012,1,27");
	    object2.put("headline", contact.getContactFieldValue("first_name")
		    + " " + contact.getContactFieldValue("last_name"));
	    object2.put("description", contact.getContactFieldValue("email"));
	    object3.put("media", contact.getContactFieldValue("image"));
	    object3.put("credit", "");
	    object3.put("caption", "");

	    object2.put("asset", object3);

	    array.put(object2);
	}

	object1.put("date", array);

	mainJSON.put("timeline", object1);

	return mainJSON.toString();
    }

    @Path("/timeline/tasks")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @GET
    public String timlineTasks() throws JSONException
    {
	Objectify ofy = ObjectifyService.begin();
	QueryResultIterator<Task> taskIterator = ofy.query(Task.class)
		.filter("created_time < ", new Date().getTime()).limit(10)
		.fetch().iterator();

	List<Task> tasksList = new ArrayList<Task>();
	while (taskIterator.hasNext())
	{
	    tasksList.add(taskIterator.next());
	}

	List<Contact> contacts = ContactUtil.getAllContacts(10, null);
	JSONArray array = new JSONArray();

	JSONObject mainJSON = new JSONObject();
	JSONObject object1 = new JSONObject();

	JSONObject object3 = new JSONObject();

	// object1.put("headline", "Account ");
	object1.put("type", "default");
	object1.put("text", "Task");
	object1.put("title", "Task");
	object1.put("startDate", "1990, 07, 03");
	for (Task task : tasksList)
	{
	    JSONObject object2 = new JSONObject();

	    String startDate = SearchUtil.getDateWithoutTimeComponent(
		    task.created_time * 1000, "yyyy,mm,dd");

	    object2.put("startDate", startDate);

	    // object2.put("endDate",
	    // dateformat.format(new Date(contact.created_time * 1000)));

	    // object2.put("endDate", "2012,1,27");
	    object2.put("headline", task.subject);
	    object2.put("description", "Type : " + task.type + ", priority : "
		    + task.priority_type);

	    object2.put("asset", object3);

	    array.put(object2);
	}

	object1.put("date", array);

	mainJSON.put("timeline", object1);

	return mainJSON.toString();
    }

    @Path("profile-status")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getProfilesStatus()
    {
	try
	{
	    return ProfileStatus.getUserProfileStatus().getStats();
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}
    }
}
