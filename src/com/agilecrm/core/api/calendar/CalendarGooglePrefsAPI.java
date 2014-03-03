package com.agilecrm.core.api.calendar;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.google.calendar.util.GooglecalendarPrefsUtil;

@Path("/api/calendar-prefs")
public class CalendarGooglePrefsAPI
{

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
    public void deleteContactPrefs()
    {
	System.out.println("delete");
	GoogleCalenderPrefs prefs = GooglecalendarPrefsUtil.getCalendarPref();
	if (prefs != null)
	    prefs.delete();
    }
}
