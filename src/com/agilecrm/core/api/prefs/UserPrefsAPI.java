package com.agilecrm.core.api.prefs;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;

import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.MD5Util;

/**
 * <code>UserPrefsAPI</code> includes REST calls to interact with
 * {@link UserPrefs} class. It handles fetch and update operations of UserPrefs.
 * It fetches UserPrefs of current agile user. It updates UserPrefs by
 * initializing current UserPrefs with updated.
 * 
 */
@Path("/api/user-prefs")
public class UserPrefsAPI
{
    /**
     * Gets UserPrefs of current agile user.
     * 
     * @return UserPrefs of current agile user.
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public UserPrefs getCurrentUserPrefs()
    {
	try
	{
	    return UserPrefsUtil.getCurrentUserPrefs();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Updates UserPrefs.
     * 
     * @param prefs
     *            - UserPrefs object to be updated.
     * @return updated UserPrefs.
     */
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public UserPrefs saveUserPrefs(UserPrefs prefs)
    {
	try
	{
	    // Get UserPrefs of user who is logged in
	    UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();

	    userPrefs.name = prefs.name;
	    userPrefs.pic = prefs.pic;
	    userPrefs.signature = prefs.signature;
	    userPrefs.template = prefs.template;
	    userPrefs.width = prefs.width;
	    userPrefs.task_reminder = prefs.task_reminder;
	    userPrefs.timezone = prefs.timezone;
	    userPrefs.currency = prefs.currency;
	    userPrefs.keyboard_shotcuts = prefs.keyboard_shotcuts;

	    userPrefs.save();
	    return userPrefs;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * To change current domain user password
     * @throws Exception 
     */
    @Path("/changePassword")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void changePasswordOfCurrentDomainUser(@FormParam("current_pswd") String currentPassword, @FormParam("new_pswd") String newPassword) throws Exception
    {
	DomainUser currentDomainUser = DomainUserUtil.getCurrentDomainUser();
	if (StringUtils.equals(MD5Util.getMD5HashedPassword(currentPassword), currentDomainUser.getHashedString()))
	{
	    try
	    {
		currentDomainUser.password = newPassword;
		currentDomainUser.save();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();	
		System.out.println(e.getMessage());
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	    }
	}
	else
	    throw new Exception("Current Password not matched");
    }
    
    
    //used to changes password from admin panel
    @Path("admin/changePassword/{id}")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void changePasswordOfCurrentDomainUserFromAdminPanel(@PathParam("id") String id, @FormParam("new_pswd") String newPassword) throws Exception
    {
    	long idofuseremail=Long.parseLong(id);
    DomainUser currentDomainUser = DomainUserUtil.getDomainUser(idofuseremail);

        try
        {
    	currentDomainUser.password = newPassword;
    	currentDomainUser.save();
        }
        catch (Exception e)
        {
    	e.printStackTrace();	
    	System.out.println(e.getMessage());
    	throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
        }


    }
}