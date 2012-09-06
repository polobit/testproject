package com.agilecrm.core.api.prefs;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;

@Path("/api/social-prefs")
public class SocialPrefsAPI
{

    // Social Prefs
    @Path("{type}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public SocialPrefs getSocialPrefs(@PathParam("type") String type)
    {
	try
	{
	    Type socialPrefsTypeEnum = Type.valueOf(type);
	    if (socialPrefsTypeEnum == null)
		return null;

	    return SocialPrefs.getPrefs(AgileUser.getCurrentAgileUser(),
		    socialPrefsTypeEnum);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    // Social Prefs
    @Path("{type}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteSocialPrefs(@PathParam("type") String type)
    {
	try
	{
	    Type socialPrefsTypeEnum = Type.valueOf(type);
	    if (socialPrefsTypeEnum == null)
		return;

	    SocialPrefs prefs = SocialPrefs.getPrefs(
		    AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);
	    prefs.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

}