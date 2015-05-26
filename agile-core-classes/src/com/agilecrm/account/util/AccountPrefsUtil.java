package com.agilecrm.account.util;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>AccountPrefsUtil</code> is the utility class for {@link AccountPrefs}.
 * It fetches AccountPrefs if exists, otherwise returns default AccountPrefs
 * setting company name 'My company'.
 * 
 * @author Manohar
 * 
 */
public class AccountPrefsUtil
{
	/**
	 * AccountPrefs Dao.
	 */
	private static ObjectifyGenericDao<AccountPrefs> dao = new ObjectifyGenericDao<AccountPrefs>(AccountPrefs.class);

	/**
	 * Returns AccountPrefs if exists, otherwise returns default accountprefs.
	 * 
	 * @return AccountPrefs.
	 */
	public static AccountPrefs getAccountPrefs()
	{
		Objectify ofy = ObjectifyService.begin();
		AccountPrefs prefs = ofy.query(AccountPrefs.class).get();

		if (prefs == null)
		{
			return getDefaultPrefs();
		}

		return prefs;
	}

	/**
	 * Returns Default AccountPrefs.
	 * 
	 * @return Default AccountPrefs.
	 */
	private static AccountPrefs getDefaultPrefs()
	{
		AccountPrefs prefs = new AccountPrefs("My company");

		dao.put(prefs);
		return prefs;
	}

	/**
	 * Returns account prefs timezone.
	 * 
	 * @return String
	 */
	public static String getTimeZone()
	{
		AccountPrefs prefs = getAccountPrefs();

		if (prefs == null)
			return "UTC";

		return prefs.timezone;
	}
}
