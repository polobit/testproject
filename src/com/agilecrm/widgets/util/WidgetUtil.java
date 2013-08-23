package com.agilecrm.widgets.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>WidgetUtil</code> class provides static function to perform operations
 * on widgets, such as fetching widgets for current user and based on id/name
 */
public class WidgetUtil
{
	// Dao
	private static ObjectifyGenericDao<Widget> dao = new ObjectifyGenericDao<Widget>(Widget.class);

	/**
	 * Fetches all {@link Widget}s for current {@link AgileUser}
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getWidgetsForCurrentUser()
	{

		Objectify ofy = ObjectifyService.begin();

		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);

		System.out.println(ofy.query(Widget.class).ancestor(userKey).list());
		// Fetches list of widgets related to AgileUser key
		return ofy.query(Widget.class).ancestor(userKey).list();
	}

	/**
	 * Gets {@link Widget} by its id, queries widget on id with user key
	 * 
	 * @param id
	 *            {@link Long}, widget id
	 * @return {@link Widget}
	 */
	public static Widget getWidget(Long id)
	{
		try
		{
			// Retrieves current AgileUser key
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);

			// Gets Widget key based on id and AgileUser Key
			Key<Widget> widgetKey = new Key<Widget>(userKey, Widget.class, id);

			// Returns widget based on widget key created.
			return dao.get(widgetKey);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Fetches widget by its name and current {@link AgileUser} key
	 * 
	 * @param name
	 *            {@link String}. Name of the widget
	 * @return {@link Widget}
	 */
	public static Widget getWidget(String name)
	{
		try
		{
			// Queries on widget name, with current AgileUser Key
			return getWidget(name, AgileUser.getCurrentAgileUser().id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Fetches widget by its name and current {@link AgileUser} key
	 * 
	 * @param name
	 *            {@link String}. Name of the widget
	 * @param agileUserId
	 *            {@link Long} agile user id
	 * @return {@link Widget}
	 */
	public static Widget getWidget(String name, Long agileUserId)
	{
		try
		{
			Objectify ofy = ObjectifyService.begin();

			// Gets the Current AgileUser key to query on widgets
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileUserId);

			// Queries on widget name, with current AgileUser Key
			return ofy.query(Widget.class).ancestor(userKey).filter("name", name).get();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

}
