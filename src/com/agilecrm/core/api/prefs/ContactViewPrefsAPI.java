package com.agilecrm.core.api.prefs;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.ContactViewPrefs;
import com.agilecrm.user.util.ContactViewPrefsUtil;

/**
 * <code>ContactViewPrefsAPI</code> includes REST calls to interact with
 * {@link ContactViewPrefsAPI} class. It handles fetch and update operations of ContactViewPrefsAPI.
 * It fetches ContactViewPrefsAPI of current agile user. It updates ContactViewPrefsAPI by
 * initializing current ContactViewPrefsAPI with updated.
 * 
 */
@Path("/api/contact-view-prefs")
public class ContactViewPrefsAPI
{
    /**
     * Gets ContactViewPrefs of current agile user.
     * 
     * @return ContactViewPrefs of current agile user.
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactViewPrefs getCurrentUserPrefs()
    {
	try
	{
	    return ContactViewPrefsUtil.getCurrentUserContactViewPrefs();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Updates ContactViewPrefs.
     * 
     * @param prefs
     *            - ContactViewPrefs object to be updated.
     * @return updated ContactViewPrefs.
     */
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public ContactViewPrefs saveUserPrefs(ContactViewPrefs prefs)
    {
	try
	{
	    // Get UserPrefs of user who is logged in
		ContactViewPrefs viewPrefs = ContactViewPrefsUtil.getCurrentUserContactViewPrefs();

		viewPrefs.fields_set = prefs.fields_set;
		viewPrefs.save();
	    return viewPrefs;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}