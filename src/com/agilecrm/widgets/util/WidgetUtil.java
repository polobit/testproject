package com.agilecrm.widgets.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.IntegrationType;
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
     * Fetches all available widgets (custom and default) in agile account.
     * 
     * @return {@link List} of {@link Widget}s
     */
    public static List<Widget> getAvailableWidgets()
    {
	List<Widget> allWidgets = new ArrayList<Widget>();

	// Fetch all custom widgets and add it to list
	allWidgets.addAll(CustomWidgets.getAllCustomWidgets());

	/*
	 * Creates and fetches all default widgets (not from database) add
	 * default widgets to all widgets
	 */
	allWidgets.addAll(DefaultWidgets.getAvailableDefaultWidgets());

	setIsAddedStatus(allWidgets);
	System.out.println("In get available widgets");
	System.out.println(allWidgets);

	return allWidgets;
    }

    /**
     * Iterates through all the widgets. If widget is present in database,
     * returns its is_added status as added
     * 
     * @param widgets
     *            {@link List} of {@link Widget}
     * @return {@link List} of {@link Widget}
     */
    public static List<Widget> setIsAddedStatus(List<Widget> widgets)
    {
	List<Widget> currentWidgets = getAddedWidgetsForCurrentUser();

	for (Widget widget : widgets)
	    for (Widget currentWidget : currentWidgets)
		if (currentWidget.name.equals(widget.name))
		{
		    widget.is_added = true;
		    widget.id = currentWidget.id;
		    widget.prefs = currentWidget.prefs;
		}

	return widgets;
    }

    /**
     * Fetches all {@link Widget}s for current {@link AgileUser}
     * 
     * <p>
     * Default widgets - which are added and Custom widgets - which are added
     * </p>
     * 
     * @return {@link List} of {@link Widget}s
     */
    public static List<Widget> getAddedWidgetsForCurrentUser()
    {
	Objectify ofy = ObjectifyService.begin();

	// Creates Current AgileUser key
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);

	/*
	 * Fetches list of widgets related to AgileUser key and adds is_added
	 * field as true to default widgets if not present
	 */
	return ofy.query(Widget.class).ancestor(userKey).filter("integration_type", null).list();
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
     * Returns widget by name and widget type
     * 
     * @param name
     *            - widget name
     * @param widgetType
     *            - widget type
     * @return
     */
    public static Widget getWidgetByNameAndType(String name, IntegrationType inegrationType)
    {
	Map<String, Object> conditionsMap = new HashMap<String, Object>();

	conditionsMap.put("name", name);
	conditionsMap.put("integration_type", inegrationType);

	return dao.getByProperty(conditionsMap);
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
	    System.out.println("In get widget bu name ");
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

    /**
     * Removes widget for the Agile users, based on {@link Widget} name
     * 
     * @param name
     *            name of the {@link Widget}
     */
    public static void removeWidgetForAllUsers(String name)
    {
	dao.deleteKeys(dao.listKeysByProperty("name", name));
    }

    /**
     * Checks if widget name is alreday in added widgets
     * 
     * @param name
     * @return
     */
    public static boolean checkIfWidgetNameExists(String name)
    {
	if (name == null)
	    return false;

	for (Widget defaultWidget : DefaultWidgets.getAvailableDefaultWidgets())
	    if (defaultWidget.name.equals(name))
		return true;

	if (CustomWidgets.getCount("name", name) != 0)
	    return true;

	return false;
    }
}
