package com.agilecrm.widgets.util;

import java.util.Iterator;
import java.util.List;

import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class CustomWidgets
{

	/**
	 * Fetches all custom widgets for current {@link AgileUser}
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getCustomWidgetsForCurrentUser()
	{
		Objectify ofy = ObjectifyService.begin();

		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);

		// Fetches list of custom widgets related to AgileUser key
		return ofy.query(Widget.class).ancestor(userKey).filter("widget_type", WidgetType.CUSTOM).list();
	}

	/**
	 * Skips the custom widgets which are not added by current user from all
	 * widgets for the current user
	 * 
	 * @param currentWidgets
	 *            Current added widgets by current {@link AgileUser}
	 * @return
	 */
	public static List<Widget> skipNotAddedCustomWidgets(List<Widget> currentWidgets)
	{
		Iterator<Widget> iterator = currentWidgets.iterator();

		/*
		 * From all widgets added by current user, check for custom widget and
		 * remove the custom widget from list if it is not added
		 */
		while (iterator.hasNext())
		{
			Widget currentWidget = iterator.next();
			if (currentWidget.widget_type.equals(WidgetType.CUSTOM))
			{
				// If is_added is false, remove it from list
				if (!currentWidget.is_added)
					iterator.remove();
			}
		}

		return currentWidgets;
	}
}
