package com.agilecrm.user.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.email.util.ContactImapUtil;
import com.agilecrm.core.api.prefs.IMAPAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>IMAPEmailPrefsUtil</code> is the utility class for IMAPEmailPrefs. It
 * fetches IMAPPrefs with respect to AgileUser and IMAPEmailPrefs id.It handles
 * some of the REST calls of {@link IMAPAPI}.
 * 
 * @author Manohar
 * 
 */
public class IMAPEmailPrefsUtil
{
    /**
     * IMAPEmailPrefs Dao
     */
    private static ObjectifyGenericDao<IMAPEmailPrefs> dao = new ObjectifyGenericDao<IMAPEmailPrefs>(
	    IMAPEmailPrefs.class);

    /**
     * Returns IMAPPrefs with respect to agileuser.
     * 
     * @param user
     *            - AgileUser object.
     * @return IMAPPrefs of respective agileuser.
     */
    public static List<IMAPEmailPrefs> getIMAPPrefsList(AgileUser user)
    {
	System.out.println("Retrieving Userid " + user.id);

	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

	System.out.println("Count " + ofy.query(IMAPEmailPrefs.class).ancestor(agileUserKey).count());
	return ofy.query(IMAPEmailPrefs.class).ancestor(agileUserKey).list();
    }

    /**
     * Returns IMAPEmailPrefs with respect to id and agileuser, otherwise null
     * for exception.
     * 
     * @param id
     *            - IMAPEmailPrefs Id.
     * @param user
     *            - AgileUser object.
     * @return IMAPEmailPrefs.
     */
    public static IMAPEmailPrefs getIMAPEmailPrefs(Long id, Key<AgileUser> user)
    {
	try
	{
	    return dao.get(new Key<IMAPEmailPrefs>(user, IMAPEmailPrefs.class, id));
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
     *            - IMAPEmailPrefs prefs
     */
    public static void checkImapPrefs(IMAPEmailPrefs prefs) throws Exception
    {
	String url = ContactImapUtil.getIMAPURLForPrefs(prefs, "mails", "info@agilecrm.com", "0", "1");

	// Access URL
	String jsonResult = HTTPUtil.accessURL(url);

	// Convert to json.
	JSONObject emails = new JSONObject(jsonResult);

	// Throw Exception if there is any error
	if (emails.has("errormssg"))
	    throw new Exception("Error saving: " + emails.getString("errormssg"));
    }

    /**
     * Gets default folders from IMAP server, if user doesn't mention any
     * specific folders, we use these folder to fetch mails
     * 
     * @return
     * @throws Exception
     */
    public static List<String> getDefaultIMAPFolders(IMAPEmailPrefs imapPrefs) throws Exception
    {
	List<String> defaultFolders = new ArrayList<String>();
	String imapURL = ContactImapUtil.getIMAPURLForFetchingDefaultFolders(imapPrefs);
	if (StringUtils.isNotBlank(imapURL))
	{
	    // Gets default IMAP server folders
	    JSONArray defaultFoldersArray = ContactImapUtil.getIMAPFoldersFromServer(imapURL);
	    if (defaultFoldersArray != null && defaultFoldersArray.length() > 0)
	    {
		for (int i = 0; i < defaultFoldersArray.length(); i++)
		{
		    String folder = defaultFoldersArray.getString(i);
		    defaultFolders.add(folder);
		}
	    }
	}
	return defaultFolders;
    }
}