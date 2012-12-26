package com.agilecrm.core.api.prefs;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;

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
     * @return UserPrefs of current agile user
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

	    userPrefs.save();
	    return userPrefs;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}