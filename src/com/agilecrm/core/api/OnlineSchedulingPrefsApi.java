package com.agilecrm.core.api;

import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

@Path("/api/scheduleprefs")
public class OnlineSchedulingPrefsApi
{

    /**
     * Updates the existing user
     * 
     * @param user
     * 
     * @return updated user
     */
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser updateDomainUserSchedulingPrefs(DomainUser user)
    {

	try
	{
	    if (user.id != null)
	    {
		DomainUser domainuser = DomainUserUtil.getDomainUser(user.id);
		JSONArray array = new JSONArray(user.businesshours_prefs);

		domainuser.meeting_types = user.meeting_types;
		domainuser.meeting_durations = user.meeting_durations;
		domainuser.business_hours = array.toString();
		domainuser.timezone = user.timezone;
		domainuser.save();
		return domainuser;

	    }
	    else
	    {
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Invalid User")
		        .build());
	    }

	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

}
