package com.thirdparty.google.calendar.util;

import java.io.IOException;

import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;

public class GooglecalendarPrefsUtil
{
    public static GoogleCalenderPrefs getCalendarPref(Long id)
    {
	return getCalendarPref(new Key<GoogleCalenderPrefs>(GoogleCalenderPrefs.class, id));
    }

    public static GoogleCalenderPrefs getCalendarPref(Key<GoogleCalenderPrefs> prefsKey)
    {
	try
	{
	    return GoogleCalenderPrefs.dao.get(prefsKey);
	}
	catch (EntityNotFoundException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fethes calendar preferences for based on current domain user key
     * 
     * @return
     */
    public static GoogleCalenderPrefs getCalendarPref()
    {
	GoogleCalenderPrefs prefs = GoogleCalenderPrefs.dao.getByProperty("domainUserKey", new Key<DomainUser>(
		DomainUser.class, SessionManager.get().getDomainId()));

	return prefs;

    }

    /**
     * Fetches current user calendar prefs and updates new access token and
     * returns new object
     * 
     * @return
     */

    public static GoogleCalenderPrefs getPrefsAndRefreshToken()
    {
	// Current user calendar prefs
	GoogleCalenderPrefs prefs = getCalendarPref();
	System.out.println(prefs);
	if (prefs == null)
	    return prefs;

	try
	{
	    // Refreshes access token
	    prefs.refreshToken();
	    return prefs;
	}
	catch (IOException e)
	{

	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}

    }
}
