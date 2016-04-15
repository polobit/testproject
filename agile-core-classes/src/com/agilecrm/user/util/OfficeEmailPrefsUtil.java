package com.agilecrm.user.util;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.contact.email.util.ContactOfficeUtil;
import com.agilecrm.core.api.prefs.OfficePrefsAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.OfficeEmailPrefs;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>OfficeEmailPrefsUtil</code> is the utility class for OfficeEmailPrefs.
 * It fetches OfficeEmailPrefs with respect to AgileUser and OfficeEmailPrefs
 * id.It handles some of the REST calls of {@link OfficePrefsAPI}.
 * 
 * @author Manohar
 * 
 */
public class OfficeEmailPrefsUtil
{
    /**
     * OfficeEmailPrefs Dao
     */
    private static ObjectifyGenericDao<OfficeEmailPrefs> dao = new ObjectifyGenericDao<OfficeEmailPrefs>(
	    OfficeEmailPrefs.class);

    /**
     * Returns All OfficePrefs with respect to agileuser.
     * 
     * @param user
     *            - AgileUser object.
     * @return OfficePrefs of respective agileuser.
     */
    public static List<OfficeEmailPrefs> getOfficePrefsList(AgileUser user)
    {
	System.out.println("Retrieving Userid " + user.id);

	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

	System.out.println("Count " + ofy.query(OfficeEmailPrefs.class).ancestor(agileUserKey).count());
	return ofy.query(OfficeEmailPrefs.class).ancestor(agileUserKey).list();
    }

    /**
     * Returns OfficePrefs with respect to agileuser.
     * 
     * @param user
     *            - AgileUser object.
     * @return OfficePrefs of respective agileuser.
     */
    public static OfficeEmailPrefs getOfficePrefs(AgileUser user, String fromEmail)
    {
	System.out.println("Retrieving Userid " + user.id);

	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

	System.out.println("Count " + ofy.query(OfficeEmailPrefs.class).ancestor(agileUserKey).count());
	OfficeEmailPrefs officePrefs = ofy.query(OfficeEmailPrefs.class).filter("user_name", fromEmail).get();
	return officePrefs;
    }

    /**
     * Returns OfficeEmailPrefs with respect to id and agileuser, otherwise null
     * for exception.
     * 
     * @param id
     *            - OfficeEmailPrefs Id.
     * @param user
     *            - AgileUser object.
     * @return OfficeEmailPrefs.
     */
    public static OfficeEmailPrefs getOfficeEmailPrefs(Long id, Key<AgileUser> user)
    {
	try
	{
	    return dao.get(new Key<OfficeEmailPrefs>(user, OfficeEmailPrefs.class, id));
	}
	catch (EntityNotFoundException e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Throws exception if the prefs are invalid.
     * 
     * @param id
     *            - OfficeEmailPrefs prefs
     */
    public static void checkOfficePrefs(OfficeEmailPrefs prefs) throws Exception
    {
	String url = ContactOfficeUtil.getOfficeURLForPrefs(prefs, "info@agilecrm.com", "0", "1");

	// Access URL
	String jsonResult = HTTPUtil.accessURL(url);

	// Convert to json.
	JSONObject emails = new JSONObject(jsonResult);

	// Throw Exception if there is any error
	if (emails.has("errormssg"))
	    throw new Exception("Error saving: " + emails.getString("errormssg"));

    }

}