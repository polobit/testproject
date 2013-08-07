package com.agilecrm.widgets.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.widgetType;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>WidgetUtil</code> class provides static function to perform operations
 * on widgets, such as fetching widgets for current user, returning default
 * widgets, Fetches widget based on id/name
 * 
 */
public class WidgetUtil
{
    // Dao
    private static ObjectifyGenericDao<Widget> dao = new ObjectifyGenericDao<Widget>(
	    Widget.class);

    /**
     * Fetches all widgets for current AgileUser
     * 
     * @return
     */
    public static List<Widget> getWidgetsForCurrentUser()
    {

	Objectify ofy = ObjectifyService.begin();

	// Creates Current AgileUser key
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);

	System.out.println(ofy.query(Widget.class).ancestor(userKey).list());
	// Fetches list of widgets related to AgileUser key
	return ofy.query(Widget.class).ancestor(userKey).list();
    }

    /**
     * Gets Widget by id, queries widget on id with an user key
     * 
     * @param id
     *            {@link Long}, widget id
     * @return {@link Widget}
     */
    public static Widget getWidget(Long id)
    {
	try
	{
	    // Creates current AgileUser key
	    Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		    AgileUser.getCurrentAgileUser().id);

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
	    Objectify ofy = ObjectifyService.begin();

	    // Gets the Current AgileUser key to query on widgets
	    Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		    AgileUser.getCurrentAgileUser().id);

	    // Queries on widget name, with current AgileUser Key
	    return ofy.query(Widget.class).ancestor(userKey)
		    .filter("name", name).get();
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
     * @param id
     *            {@link Long} agile user id
     * @return {@link Widget}
     */
    public static Widget getWidget(String name, Long id)
    {
	try
	{
	    Objectify ofy = ObjectifyService.begin();

	    // Gets the Current AgileUser key to query on widgets
	    Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, id);

	    // Queries on widget name, with current AgileUser Key
	    return ofy.query(Widget.class).ancestor(userKey)
		    .filter("name", name).get();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetches all default widgets. Checks whether widgets are added already, if
     * widget is not added then is_added field in Widget is set false, so add
     * can be shown, delete button can be shown if already added
     * 
     * @return {@link List} of {@link Widget}
     */
    public static List<Widget> getAvailableWidgets()
    {
	// Gets all default widgets
	List<Widget> availableWidgets = getDefaultWidgets();

	// Populate Widgets if they have already been added
	for (Widget widget : availableWidgets)
	{
	    // Check if it is already added
	    Widget currentWidget = getWidget(widget.name);

	    // If widget is not added then set is_added false
	    if (currentWidget == null)
		widget.is_added = false;
	}

	// Returns list of widgets
	return availableWidgets;
    }

    /**
     * Creates default widgets and adds to list of widgets, default widgets are
     * Linkedin, Twitter, Rapleaf.
     * 
     * @return {@link List} of {@link Widget}
     */
    private static List<Widget> getDefaultWidgets()
    {

	List<Widget> widgets = new ArrayList<Widget>();

	/*
	 * Adds widget details to list, which specifies url to load the widget
	 * and images, logos, description to be show in widgets pannel
	 */
	widgets.add(new Widget(
		"Linkedin",
		" LinkedIn helps build professional relationships with contacts and helps keep tabs about their business interests.",
		"/widgets/linkedin.js", "/img/plugins/linkedin.png",
		"/widgets/linkedin-logo-small.png", null, widgetType.SOCIAL));
	widgets.add(new Widget(
		"Twitter",
		" Twitter offers a great way of engaging with contacts in real time based on what they tweet.",
		"/widgets/twitter.js", "/img/plugins/twitter.jpg",
		"/widgets/twitter-logo-small.png", null, widgetType.SOCIAL));
	widgets.add(new Widget(
		"Rapleaf",
		" Rapleaf makes it incredibly easy for you to personalize content for your customers.",
		"/widgets/rapleaf.js", "/img/plugins/rapleaf.jpeg",
		"/widgets/rapleaf-logo-small.png", null, widgetType.SOCIAL));
	widgets.add(new Widget(
		"ClickDesk",
		"Convert chat sessions with potential customers into contacts in Agile along with the conversation.",
		"/widgets/clickdesk.js", "/img/plugins/clickdesk-logo.png",
		"/widgets/clickdesk-logo-small.png", null, widgetType.SUPPORT));
	widgets.add(new Widget(
		"Zendesk",
		"Zendesk streamlines communication within a ticket that has organized workflow towards resolution of the customer issue.",
		"/widgets/zendesk.js", "/img/plugins/zendesk_logo.png",
		"/widgets/zendesk-logo-small.png", null, widgetType.SUPPORT));
	widgets.add(new Widget(
		"Twilio",
		" Stay connected to your users with Twilio phone numbers in 40 countries all over the globe.",
		"/widgets/twilio.js", "/img/plugins/twilio-logo.png",
		"/widgets/twilio-small-logo.png", null, widgetType.CALL));
	widgets.add(new Widget(
		"FreshBooks",
		"FreshBooks enables the ability to create and manage invoices, estimates, expenses, and projects all in one place.",
		"/widgets/freshbooks.js", "/img/plugins/freshbooks-logo.png",
		"/widgets/freshbooks-small-logo.png", null, widgetType.BILLING));
	widgets.add(new Widget(
		"Stripe",
		"Stripe enables individuals and businesses to accept payments over the internet.",
		"/widgets/stripe.js", "/img/plugins/Stripe.png",
		"/widgets/stripe-small-logo.png", null, widgetType.BILLING));

	return widgets;

    }
}
