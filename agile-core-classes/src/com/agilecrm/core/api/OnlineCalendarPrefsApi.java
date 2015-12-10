package com.agilecrm.core.api;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.OnlineCalendarPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.OnlineCalendarUtil;

@Path("/api/scheduleprefs")
public class OnlineCalendarPrefsApi
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
	public OnlineCalendarPrefs updateDomainUserSchedulingPrefs(OnlineCalendarPrefs prefs)
	{

		try
		{

			prefs.save();
			return prefs;

		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

	}

	/**
	 * get current user online calendar prefs
	 * 
	 * @return
	 */

	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public OnlineCalendarPrefs getCurrentUserCalendarPrefs()
	{
		try
		{
			// Fetches current domain user based on user info set in thread
			DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

			return OnlineCalendarUtil.getCalendarPrefs(domainUser.id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	@Path("/updateId")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public OnlineCalendarPrefs saveScheduleId(@QueryParam("scheduleid") String scheduleid,
			@QueryParam("domainId") Long userid)
	{
		try
		{
			// Fetches current domain user based on user info set in thread
			DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
			if (domainUser == null)
				domainUser = DomainUserUtil.getDomainUser(userid);

			OnlineCalendarPrefs prefs = OnlineCalendarUtil.getCalendarPrefs(domainUser.id);
			prefs.schedule_id = scheduleid;
			prefs.save();
			return prefs;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
}
