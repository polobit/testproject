package com.agilecrm.widgets.util;

import java.util.List;

import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.CustomWidget;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>CustomWidgets</code> class provides static functions to fetch custom
 * widgets saved in agile account
 */
public class CustomWidgets {

	/**
	 * Fetches all custom widgets for current {@link AgileUser}
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getCustomWidgetsForCurrentUser() {
		Objectify ofy = ObjectifyService.begin();

		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
				AgileUser.getCurrentAgileUser().id);

		// Fetches list of custom widgets related to AgileUser key
		return ofy.query(Widget.class).ancestor(userKey)
				.filter("widget_type", WidgetType.CUSTOM).list();
	}

	/**
	 * Fetch all custom widgets in admin account
	 */
	public static List<? extends Widget> getAllCustomWidgets() {
		return CustomWidget.dao.fetchAll();
	}

	/**
	 * Fetch all custom widgets in admin account
	 */
	public static List<? extends Widget> getUserCustomWidgets() {
		return CustomWidget.getCurrentWidgets();
	}

	/**
	 * Fetches custom widget by its name
	 * 
	 * @param name
	 *            {@link String}. Name of the widget
	 * @return {@link CustomWidget}
	 */
	public static CustomWidget getCustomWidget(String name) {
		return CustomWidget.dao.getByProperty("name", name);
	}

	public static void deleteCurrentUserWidget(String name) {
		CustomWidget.deleteCustomWidget(name);
	}

	/**
	 * Returns number of custom widgets present in db querying on the given
	 * property name and its value
	 * 
	 * @param propertyName
	 *            {@link String} name of the {@link CustomWidget} property
	 * @param propertyValue
	 *            {@link Object} value of the {@link CustomWidget} property
	 * @return
	 */
	public static int getCount(String propertyName, Object propertyValue) {
		return CustomWidget.dao.getCountByProperty(propertyName, propertyValue);
	}
}
