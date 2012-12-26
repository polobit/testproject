package com.agilecrm.user.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class UserPrefsUtil
{

    private static ObjectifyGenericDao<UserPrefs> dao = new ObjectifyGenericDao<UserPrefs>(
	    UserPrefs.class);

    public static UserPrefs getCurrentUserPrefs()
    {
	// Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();

	// Get Prefs
	return getUserPrefs(agileUser);
    }

    public static UserPrefs getUserPrefs(AgileUser agileUser)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		agileUser.id);

	UserPrefs userPrefs = ofy.query(UserPrefs.class).ancestor(userKey)
		.get();
	if (userPrefs == null)
	    return getDefaultPrefs(agileUser);

	return userPrefs;
    }

    private static UserPrefs getDefaultPrefs(AgileUser agileUser)
    {
	UserPrefs userPrefs = new UserPrefs(agileUser.id, null, null,
		"default", "", "- Powered by AgileCRM", true);
	userPrefs.save();
	return userPrefs;
    }

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

    public static List<UserPrefs> getAllUserPrefs()
    {
	return dao.fetchAll();
    }

}
