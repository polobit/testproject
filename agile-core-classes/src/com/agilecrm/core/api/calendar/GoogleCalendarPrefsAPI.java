package com.agilecrm.core.api.calendar;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.google.calendar.GoogleCalenderPrefs.CALENDAR_TYPE;
import com.thirdparty.google.calendar.util.GooglecalendarPrefsUtil;

@Path("/api/calendar-prefs")
public class GoogleCalendarPrefsAPI
{

    /**
     * Returns calendar prefs with out access token. It is used for showing
     * settings in prefs page.
     * 
     * @return
     */
    @Path("/list")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<GoogleCalenderPrefs> getCalendarPrefsList()
    {
	return GooglecalendarPrefsUtil.getCalendarPrefList();
    }

    /**
     * Returns calendar prefs with out access token. It is used for showing
     * settings in prefs page.
     * 
     * @return
     */
    @Path("/type/{type}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public GoogleCalenderPrefs getCalendarPrefsBasedOnType(@PathParam("type") CALENDAR_TYPE calendar_type)
    {
	return GooglecalendarPrefsUtil.getCalendarPrefsByType(calendar_type);
    }

    /**
     * Returns calendar prefs with out access token. It is used for showing
     * settings in prefs page.
     * 
     * @return
     */
    @Path("/type/{type}")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void saveCalendarPrefsBasedOnType(@PathParam("type") CALENDAR_TYPE calendar_type, GoogleCalenderPrefs prefs)
    {
	prefs.calendar_type = calendar_type;
	prefs.save();
    }

    /**
     * Returns calendar prefs with out access token. It is used for showing
     * settings in prefs page.
     * 
     * @return
     */
    @Path("/type/{type}")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void updateCalendarPrefsBasedOnType(@PathParam("type") CALENDAR_TYPE calendar_type, GoogleCalenderPrefs prefs)
    {
	prefs.calendar_type = calendar_type;
	GooglecalendarPrefsUtil.updatePrefs(prefs);
    }

    /**
     * Returns calendar prefs with out access token. It is used for showing
     * settings in prefs page.
     * 
     * @return
     */
    @Path("/type/{type}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteCalendarPrefsBasedOnType(@PathParam("type") CALENDAR_TYPE calendar_type)
    {
	GooglecalendarPrefsUtil.deletePrefs(calendar_type);
    }

    /**
     * Returns calendar prefs with out access token. It is used for showing
     * settings in prefs page.
     * 
     * @return
     */
    @Path("/get")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public GoogleCalenderPrefs getCalendarPrefs()
    {
	return GooglecalendarPrefsUtil.getCalendarPref();
    }

    /**
     * Fetches current user calendar prefs and updated access token using
     * refresh token.
     * 
     * @return
     */
    @Path("/refresh-token")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public GoogleCalenderPrefs getCurrentUserCalendarPrefs()
    {
	return GooglecalendarPrefsUtil.getPrefsAndRefreshToken();
    }

    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteContactPrefs(@QueryParam("type") CALENDAR_TYPE calendar_type)
    {
	System.out.println("delete");
	GoogleCalenderPrefs prefs = GooglecalendarPrefsUtil.getCalendarPrefsByType(calendar_type);
	if (prefs != null)
	    prefs.delete();
    }
}
