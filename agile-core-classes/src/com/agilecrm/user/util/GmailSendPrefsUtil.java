package com.agilecrm.user.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.GmailSendPrefs;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>GmailSendPrefsUtil</code> is the utility class for
 * {@link GmailSendPrefs}. It fetches GmailSendPrefs with respect to agileuser
 * and it's own id. It handles some of the REST calls of
 * {@link GmailSendPrefsAPI}.
 * 
 * @author ravitheja.
 * 
 */
public class GmailSendPrefsUtil {
	
	/**
	 * GmailSendPrefs Dao.
	 */
	private static ObjectifyGenericDao<GmailSendPrefs> dao = new ObjectifyGenericDao<GmailSendPrefs>(
			GmailSendPrefs.class);

	/**
	 * Returns GmailSendPrefs with respect to agileuser and GmailSendPrefs Type.
	 * 
	 * @param user
	 *            - AgileUser object.
	 * @param type
	 *            - GmailSendPrefs Type.
	 * @return GmailSendPrefs.
	 */
	public static List<GmailSendPrefs> getPrefsList(AgileUser user) {
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		return ofy.query(GmailSendPrefs.class).ancestor(agileUserKey).list();
	}

	/**
	 * Returns GmailSendPrefs with respect to agileuser and GmailSendPrefs Type.
	 * 
	 * @param user
	 *            - AgileUser object.
	 * @param type
	 *            - GmailSendPrefs Type.
	 * @return GmailSendPrefs.
	 */
	public static GmailSendPrefs getPrefs(AgileUser user, String fromEmail) {
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		return ofy.query(GmailSendPrefs.class).ancestor(agileUserKey).filter("email", fromEmail).get();
	}

	/**
	 * Returns list of GmailSendPrefs with respect to AgileUser.
	 * 
	 * @param user
	 *            - AgileUser object.
	 * @return list of GmailSendPrefs associated with AgileUser.
	 */
	public static List<GmailSendPrefs> getPrefs(AgileUser user) {
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		return ofy.query(GmailSendPrefs.class).ancestor(agileUserKey).list();
	}

	/**
	 * Returns GmailSendPrefs with respect to it's own id, otherwise null for
	 * exception.
	 * 
	 * @param id
	 *            - GmailSendPrefs Id.
	 * @return GmailSendPrefs.
	 */
	public static GmailSendPrefs getPrefs(Long id, Key<AgileUser> user) {
		try {
			return dao.get(new Key<GmailSendPrefs>(user, GmailSendPrefs.class, id));
		} catch(EntityNotFoundException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Checks if email already authenticated to the user, if exists, deletes the old record 
	 * and saves a new record with the prefs.
	 * 
	 * @param gmailPrefs
	 */
	public static void save(GmailSendPrefs gmailPrefs) {
		List<GmailSendPrefs> prefsList = getPrefsList(AgileUser.getCurrentAgileUser());
		for(GmailSendPrefs gmailSendPrefs : prefsList) {
			if(gmailSendPrefs.email.equals(gmailPrefs.email))
				gmailSendPrefs.delete();
		}
		gmailPrefs.save();
	}

}