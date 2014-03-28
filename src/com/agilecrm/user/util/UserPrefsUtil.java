package com.agilecrm.user.util;

import java.util.List;

import com.agilecrm.core.api.prefs.UserPrefsAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>UserPrefsUtil</code> is the utility class for UserPrefs. It handles
 * some of the REST calls of {@link UserPrefsAPI}. It fetches UserPrefs with
 * respect to id and current agile user. It sets default UserPrefs with respect
 * to agile id.
 * 
 */
public class UserPrefsUtil
{
    /**
     * UserPrefs Dao.
     */
    private static ObjectifyGenericDao<UserPrefs> dao = new ObjectifyGenericDao<UserPrefs>(UserPrefs.class);

    /**
     * Returns UserPrefs with respect to current agile-user.
     * 
     * @return UserPrefs of current user.
     */
    public static UserPrefs getCurrentUserPrefs()
    {
	// Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();

	// Get Prefs
	return getUserPrefs(agileUser);
    }

    /**
     * Returns UserPrefs with respect to given AgileUser if exists, otherwise
     * returns default UserPrefs.
     * 
     * @param agileUser
     *            - AgileUser object.
     * @return UserPrefs of given agile-user.
     */
    public static UserPrefs getUserPrefs(AgileUser agileUser)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileUser.id);

	UserPrefs userPrefs = ofy.query(UserPrefs.class).ancestor(userKey).get();
	if (userPrefs == null)
	    return getDefaultPrefs(agileUser);

	return userPrefs;
    }

    /**
     * Returns default UserPrefs.
     * 
     * @param agileUser
     *            - AgileUser Object.
     * @return default UserPrefs.
     */
    private static UserPrefs getDefaultPrefs(AgileUser agileUser)
    {
	UserPrefs userPrefs = new UserPrefs(agileUser.id, null, null, "pink", "", EmailUtil.getPoweredByAgileLink("email-signature", "Sent using"), true, false);
	userPrefs.save();
	return userPrefs;
    }

    /**
     * Returns UserPrefs with respect to Id if exists, otherwise returns null.
     * 
     * @param id
     *            - UserPrefs Id.
     * @return UserPrefs with respect to given id.
     */
    public static UserPrefs getUserPrefs(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Returns list of all UserPrefs.
     * 
     * @return all UserPrefs that are saved.
     */
    public static List<UserPrefs> getAllUserPrefs()
    {
	return dao.fetchAll();
    }
}
