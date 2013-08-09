package com.agilecrm.account.util;

import com.agilecrm.account.NavSetting;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * NavSettingUtil to deal with {@link NavSetting} object.Just get and set (from
 * datastore) methods.
 * 
 * @author Chandan
 * 
 */
public class NavSettingUtil
{
	/**
	 * Get NavSetting from Datastore. If no NavSetting object in Datastore, set
	 * default and return that.
	 * 
	 * @return - the object from Datastore
	 */
	public static NavSetting getNavSetting()
	{
		Objectify ofy = ObjectifyService.begin();
		NavSetting navSetting = ofy.query(NavSetting.class).get();

		// if not found in Datastore, return default
		if (navSetting == null || navSetting.id == null)
		{
			navSetting = new NavSetting();
			navSetting.setDefault();
		}

		return navSetting;
	}

	/**
	 * Save the object in param in Datastore
	 * 
	 * @param navSetting
	 *            - the object to save
	 * @return - the saved object
	 */
	public static NavSetting saveNavSetting(NavSetting navSetting)
	{
		navSetting.save();

		// Check is save in datastore was successful
		if (navSetting.id != null)
			return navSetting;

		return null;
	}
}
