package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.AccountDeleteUtil;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.util.ReferenceUtil;
import com.google.appengine.api.NamespaceManager;

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
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    @GET
    @Path("count")
    @Produces(MediaType.TEXT_PLAIN)
    public String domainUserCount()
    {
	return String.valueOf(DomainUserUtil.count());
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
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Invalid User")
			.build());
	    }

	    domainUser.save();
	    return domainUser;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
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
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			.entity("Can’t delete all users").build());

	    // Throws exception, if user is owner
	    if (domainUser.is_account_owner)
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			.entity("Master account can’t be deleted").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
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

    // Get Stats for particular name-space
    @Path("/admin/namespace-stats/{namespace}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getNamespaceStats(@PathParam("namespace") String namespace)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain) || !domain.equals("admin"))
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry you don't have privileges to access this page.").build());
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
	List<AgileUser> agileUser = AgileUser.getUsers();
	List<AgileUser> agileWithDomain = new ArrayList<AgileUser>();

	for (AgileUser auser : agileUser)
	{
	    if (auser.getDomainUser() == null)
		continue;
	    agileWithDomain.add(auser);
	}

	// Now sort by name.
	Collections.sort(agileWithDomain, new Comparator<AgileUser>()
	{
	    public int compare(AgileUser one, AgileUser other)
	    {
	    	try {
				
	    		if(one.getDomainUser().name == null || other.getDomainUser().name == null)
		    		  return 0;
		    	
			return one.getDomainUser().name.toLowerCase().compareTo(other.getDomainUser().name.toLowerCase());
			
			} catch (Exception e) {
			}
	    	
	    	 return 0;
	    	
	    }
	});
	return agileWithDomain;
    }

    // Get all refered people based on reference code
    @Path("/getreferedbyme")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<DomainUser> getAllReferedPeople(@QueryParam("reference_domain") String referencedomain)
    {
	return ReferenceUtil.getAllReferrals(referencedomain);
    }

    /**
     * method used to update scheduleid for current domain user
     */
    @Path("/updatescheduleid")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public DomainUser updateScheduleid(@QueryParam("scheduleid") String scheduleid)
    {
	DomainUser user = DomainUserUtil.getCurrentDomainUser();

	// local http://localhost:8888
	// beta-sandbox
	// "https://"+domainUser.domain+"-dot-sandbox-dot-agilecrmbeta.appspot.com"
	// version "https://"+domainUser.domain+".agilecrm.com"
	// live "https://" + domainUser.domain + ".agilecrm.com";

	user.schedule_id = scheduleid;
	user.calendar_url = user.getCalendarURL();
	try
	{
	    user.save();

	    System.out.println(user);
	    System.out.println("updates user ===============================");
	    return user;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    // Send Current User Info
    @Path("current-owner")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser getCurrentOwner()
    {
	try
	{
	    String domain = NamespaceManager.get();
	    // Fetches current domain user based on user info set in thread
	    if (StringUtils.isNotEmpty(domain))
	    {
		DomainUser domainUser = DomainUserUtil.getDomainOwner(domain);
		return domainUser;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	return null;
    }

    /**
     * When all forms are updated with html code, then we update
     * is_forms_updated to true
     */

    @Path("/formsupdated")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public DomainUser setFormUpdatedToTrue()
    {
	DomainUser user = DomainUserUtil.getCurrentDomainUser();
	user.is_forms_updated = true;
	try
	{
	    user.save();
	    return user;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

}