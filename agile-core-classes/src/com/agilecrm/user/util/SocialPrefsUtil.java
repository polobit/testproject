package com.agilecrm.user.util;

import java.util.List;

import com.agilecrm.core.api.prefs.SocialPrefsAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>SocialPrefsUtil</code> is the utility class for {@link SocialPrefs}. It
 * fetches SocialPrefs with respect to agileuser and it's own id. It handles
 * some of the REST calls of {@link SocialPrefsAPI}.
 * 
 * @author Manohar.
 * 
 */
public class SocialPrefsUtil
{
    /**
     * SocialPrefs Dao.
     */
    private static ObjectifyGenericDao<SocialPrefs> dao = new ObjectifyGenericDao<SocialPrefs>(SocialPrefs.class);

    /**
     * Returns SocialPrefs with respect to agileuser and SocialPrefs Type.
     * 
     * @param user
     *            - AgileUser object.
     * @param type
     *            - SocialPrefs Type.
     * @return SocialPrefs.
     */
    public static List<SocialPrefs> getPrefsList(AgileUser user, Type type)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

	return ofy.query(SocialPrefs.class).ancestor(agileUserKey).filter("type", type).list();
    }

    /**
     * Returns SocialPrefs with respect to agileuser and SocialPrefs Type.
     * 
     * @param user
     *            - AgileUser object.
     * @param type
     *            - SocialPrefs Type.
     * @return SocialPrefs.
     */
    public static SocialPrefs getPrefs(AgileUser user, Type type)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

	return ofy.query(SocialPrefs.class).ancestor(agileUserKey).filter("type", type).get();
    }

    /**
     * Returns SocialPrefs with respect to agileuser and SocialPrefs Type.
     * 
     * @param user
     *            - AgileUser object.
     * @param type
     *            - SocialPrefs Type.
     * @return SocialPrefs.
     */
    public static SocialPrefs getPrefs(AgileUser user, Type type, String fromEmail)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

	return ofy.query(SocialPrefs.class).ancestor(agileUserKey).filter("type", type).filter("email", fromEmail)
	        .get();
    }

    /**
     * Returns list of SocialPrefs with respect to AgileUser.
     * 
     * @param user
     *            - AgileUser object.
     * @return list of SocialPrefs associated with AgileUser.
     */
    public static List<SocialPrefs> getPrefs(AgileUser user)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

	return ofy.query(SocialPrefs.class).ancestor(agileUserKey).list();
    }

    /**
     * Returns SocialPrefs with respect to it's own id, otherwise null for
     * exception.
     * 
     * @param id
     *            - SocialPrefs Id.
     * @return SocialPrefs.
     */
    public static SocialPrefs getPrefs(Long id, Key<AgileUser> user)
    {
	try
	{
	    return dao.get(new Key<SocialPrefs>(user, SocialPrefs.class, id));
	}
	catch (EntityNotFoundException e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}
