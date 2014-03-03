package com.agilecrm.account.util;

import com.agilecrm.account.MenuSetting;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * MenuSettingUtil to deal with {@link MenuSetting} object.Just get and set (from
 * datastore) methods.
 * 
 * @author Chandan
 * 
 */
public class MenuSettingUtil
{
	/**
	 * Get MenuSetting from Datastore. If no MenuSetting object in Datastore, set
	 * default and return that.
	 * 
	 * @return - the object from Datastore
	 */
	public static MenuSetting getMenuSetting()
	{
		Objectify ofy = ObjectifyService.begin();
		MenuSetting menuSetting = ofy.query(MenuSetting.class).get();

		// if not found in Datastore, return default
		if (menuSetting == null || menuSetting.id == null)
		{
		    menuSetting = new MenuSetting();
		    menuSetting.setDefault();
		}

		return menuSetting;
	}

	/**
	 * Save the object in param in Datastore
	 * 
	 * @param menuSetting
	 *            - the object to save
	 * @return - the saved object
	 */
	public static MenuSetting saveMenuSetting(MenuSetting menuSetting)
	{
	    menuSetting.save();

		// Check is save in datastore was successful
		if (menuSetting.id != null)
			return menuSetting;

		return null;
	}
}
