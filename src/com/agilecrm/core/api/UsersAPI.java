package com.agilecrm.core.api;

import java.util.List;

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

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.AccountDeleteUtil;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.webrules.WebRule;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.JsonObject;

/**
 * <code>UsersAPI</code> includes REST calls to interact with {@link DomainUser}
 * class to initiate User CRUD operations
 * <p>
 * It is called from client side to create, update, fetch and delete the users.
 * It also interacts with {@link DomainUserUtil} class to fetch the data of
 * DomainUser class from database.
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/users")
public class UsersAPI
{

    /**
     * Gets list of users of a domain
     * 
     * @return list of domain users
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<DomainUser> getUsers()
    {
	try
	{
		
		
	    String domain = NamespaceManager.get();
	    // Gets the users and update the password to the masked one
	    List<DomainUser> users = DomainUserUtil.getUsers(domain);
	    return users;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    @Path("/admin/domain/{domainname}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<DomainUser> getDomainUserDetails(@PathParam("domainname") String domainname)
    {
	try
	{
	    String domain = domainname;
	    if(domain.contains("@")){
	    	String email=domain;
	    	DomainUser domainUser =DomainUserUtil.getDomainUserFromEmail(email);
	    	if(domainUser!=null){
	    	String userDomain=domainUser.domain;
	    	 List<DomainUser> domainUsers = DomainUserUtil.getUsers(userDomain);
	 	    return domainUsers;
	    	}
	    }
	    // Gets the users and update the password to the masked one
	    List<DomainUser> users = DomainUserUtil.getUsers(domain);
	    return users;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
    
    
    
    
    // Send Current User Info
    @Path("current-user")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser getCurrentUser()
    {
	try
	{
	    // Fetches current domain user based on user info set in thread
	    DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
	    System.out.println(domainUser);
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Saves new users into database, if any exception is raised throws
     * webApplication exception.
     * 
     * @param domainUser
     *            user to be saved into database
     * @return saved user
     */
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser createDomainUser(DomainUser domainUser)
    {
    	
	try
	{
	    domainUser.save();
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}
    }
    
    /**
     * Saves new users into database with particular domain name, if any exception is raised throws
     * webApplication exception.
     * 
     * @param domainUser
     *            user to be saved into database
     * @return saved user
     */
    @POST @Path("/adminpanel/addNewUser/{domainname}")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser createDomainUserWithDomainname(DomainUser domainUser,@PathParam("domainname") String domainname)
    {
    	System.out.println("adding new user from admin  panel");
    	String oldnamespace=NamespaceManager.get();
	try
	{
		NamespaceManager.set(domainname);
	    domainUser.save();
	    NamespaceManager.set(oldnamespace);
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}
    }

    @GET
    @Path("count")
    @Produces(MediaType.TEXT_PLAIN)
    public String domainUserCount()
    {
	return String.valueOf(DomainUserUtil.count());
    }

    @GET
    @Path("adminpanel/count/{domainname}")
    @Produces(MediaType.TEXT_PLAIN)
    public String particularDomainUserCount(@PathParam("domainname") String domainname)
    {
    	String oldnamespace=NamespaceManager.get();
    	NamespaceManager.set(domainname);
    	String count=String.valueOf(DomainUserUtil.count());
    	NamespaceManager.set(oldnamespace);
	return count;
    }
    
    
    
    /**
     * Updates the existing user
     * 
     * @param domainUser
     *            user to be updated
     * @return updated user
     */
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser updateDomainUser(DomainUser domainUser)
    {
	try
	{
	    if (domainUser.id == null)
	    {
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Invalid User").build());
	    }

	    domainUser.save();
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}
    }

    /**
     * Deletes a user from database, by validating users count and ownership of
     * the user to be deleted. If the user is fit to delete, deletes its related
     * entities also.
     * 
     * @param domainUser
     *            user to be deleted
     */
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteDomainUser(DomainUser domainUser)
    {
	try
	{
	    int count = DomainUserUtil.count();

	    // Throws exception, if only one account exists
	    if (count == 1)
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Can�t delete all users").build());

	    // Throws exception, if user is owner
	    if (domainUser.is_account_owner)
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Master account can�t be deleted").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}

	AccountDeleteUtil.deleteRelatedEntities(domainUser.id);

	domainUser.delete();
    }

    /**
     * Deletes each user individually by iterating the json array of user ids
     * 
     * @param model_ids
     *            array of user ids as String
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteContacts(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray usersJSONArray = new JSONArray(model_ids);

	for (int i = 0; i < usersJSONArray.length(); i++)
	{
	    DomainUser domainuser = DomainUserUtil.getDomainUser(Long.parseLong(usersJSONArray.getString(i)));

	    deleteDomainUser(domainuser);
	}
    }

    /**
     * Gets list of all domain users irrespective of domain for the users of
     * domain "admin".
     * 
     * @return DomainUsers list
     */
    @Path("/admin/domain-users")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<DomainUser> getAllDomainUsers(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {
	String domain = NamespaceManager.get();

	/*if (StringUtils.isEmpty(domain) || !domain.equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Sorry you don't have privileges to access this page.")
		    .build());
	}*/

	if (count != null)
	{
	    System.out.println("Fetching page by page");
	    return DomainUserUtil.getAllDomainUsers(Integer.parseInt(count), cursor);
	}

	return DomainUserUtil.getAllUsers();
    }

    
  

    
    
    
    
    /**
     * Delete domain users of particular namespace
     */
    @Path("/admin/delete/{namespace}")
    @DELETE
    public void deleteDomainUser(@PathParam("namespace") String namespace)
    {
    	System.out.println("delete request for deletion of account from admin panel "+namespace);
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain) || !domain.equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Sorry you don't have privileges to access this page.")
		    .build());
	}

	try
	{
	    AccountDeleteUtil.deleteNamespace(namespace);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}
    }

    // Get Stats for particular name-space
    @Path("/admin/namespace-stats/{namespace}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getNamespaceStats(@PathParam("namespace") String namespace)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain) || !domain.equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Sorry you don't have privileges to access this page.")
		    .build());
	}

	NamespaceManager.set(namespace);
	try
	{
	    return NamespaceUtil.getNamespaceStats().toString();
	}
	finally
	{
	    NamespaceManager.set(domain);
	}
    }

    // Get Agile Users
    @Path("agileusers")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public List<AgileUser> getAgileUsers()
    {
	return AgileUser.getUsers();
    }
    
    
    @Path("/admin/domain/adminpanel/{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteDomainUserFromAdminPanel(@PathParam("id") String id)
    {
    	System.out.println("delete request for domain user deletion from admin panel"+id);
    	DomainUser domainUser;
	try
	{
		long domainuserid=Long.parseLong(id);
		
		 domainUser=DomainUserUtil.getDomainUser(domainuserid);
	    int count = DomainUserUtil.count();

	    // Throws exception, if only one account exists
	    if (count == 1)
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Can�t delete all users").build());

	    // Throws exception, if user is owner
	    if (domainUser.is_account_owner)
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Master account can�t be deleted").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}

	AccountDeleteUtil.deleteRelatedEntities(domainUser.id);

	domainUser.delete();
    }
    
    @Path("/adminpanel/domainstatscount/{domainname}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public String getAccountStats(@PathParam ("domainname") String domainname) {
    	String oldnamespace=NamespaceManager.get();
    	NamespaceManager.set(domainname);
    	
    	JSONObject json = new JSONObject();
    	 
    	 int webrulecount=WebRuleUtil.getCount();
    	 int contactcount=ContactUtil.getCount();
    	 int dealscount=OpportunityUtil.getCount();
    	 int docs=DocumentUtil.getCount();
    	 int eventcount=EventUtil.getCount();
    	 int compaigncount=WorkflowUtil.getCount();
    	 int triggerscount=TriggerUtil.getCount();
    	
    	try {
			json.put("webrule_count",webrulecount);
			json.put("contact_count",contactcount);
	    	json.put("deals_count",dealscount);
	    	json.put("docs_count",docs);
	    	json.put("events_count",eventcount);
	    	json.put("compaign_count",compaigncount);
	    	json.put("triggers_count",triggerscount);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	System.out.println("status account "+json);
    	NamespaceManager.set(oldnamespace);
    	return json.toString();
    }
    
    
}