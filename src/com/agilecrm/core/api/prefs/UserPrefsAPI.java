package com.agilecrm.core.api.prefs;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.UserPrefs;

@Path("/api/user-prefs")
public class UserPrefsAPI
{

    // User Setting
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public UserPrefs getSettings()
    {
	try
	{

	    return UserPrefs.getCurrentUserPrefs();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // User Setting
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public UserPrefs saveUserPrefs(UserPrefs prefs)
    {
	try
	{
	    // Get UserId of person who is logged in
	    UserPrefs userPrefs = UserPrefs.getCurrentUserPrefs();
	    userPrefs.name = prefs.name;
	    userPrefs.image = prefs.image;
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