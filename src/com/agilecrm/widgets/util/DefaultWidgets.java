package com.agilecrm.widgets.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;

/**
 * <code>DefaultWidgets</code> class provides static function to fetch available
 * widgets for current user and get default widgets provided by Agile
 */
public class DefaultWidgets
{

	/**
	 * Creates default widgets provided by Agile. Default widgets are LinkedIn,
	 * Twitter, Rapleaf, ClickDesk, Zendesk and so on.
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getAvailableDefaultWidgets()
	{
		List<Widget> widgets = new ArrayList<Widget>();

		/*
		 * Adds each widget details to list, which specifies URL to load the
		 * widget and images, logo's, description to be show in widgets panel
		 */
		widgets.add(new Widget(
				"Linkedin",
				" LinkedIn helps build professional relationships with contacts and helps keep tabs about their business interests.",
				"/widgets/linkedin.js", "/img/plugins/linkedin.png", "/widgets/linkedin-logo-small.png", null,
				WidgetType.SOCIAL));
		widgets.add(new Widget("Twitter",
				" Twitter offers a great way of engaging with contacts in real time based on what they tweet.",
				"/widgets/twitter.js", "/img/plugins/twitter.jpg", "/widgets/twitter-logo-small.png", null,
				WidgetType.SOCIAL));
		widgets.add(new Widget("Rapleaf",
				" Rapleaf makes it incredibly easy for you to personalize content for your customers.",
				"/widgets/rapleaf.js", "/img/plugins/rapleaf.jpeg", "/widgets/rapleaf-logo-small.png", null,
				WidgetType.SOCIAL));
		widgets.add(new Widget("ClickDesk",
				"Convert chat sessions with potential customers into contacts in Agile along with the conversation.",
				"/widgets/clickdesk.js", "/img/plugins/clickdesk-logo.png", "/widgets/clickdesk-logo-small.png", null,
				WidgetType.SUPPORT));
		widgets.add(new Widget(
				"Zendesk",
				"Zendesk streamlines communication within a ticket that has organized workflow towards resolution of the customer issue.",
				"/widgets/zendesk.js", "/img/plugins/zendesk_logo.png", "/widgets/zendesk-logo-small.png", null,
				WidgetType.SUPPORT));
		widgets.add(new Widget("Twilio",
				" Stay connected to your users with Twilio phone numbers in 40 countries all over the globe.",
				"/widgets/twilio.js", "/img/plugins/twilio-logo.png", "/widgets/twilio-small-logo.png", null,
				WidgetType.CALL));
		widgets.add(new Widget(
				"FreshBooks",
				"FreshBooks enables the ability to create and manage invoices, estimates, expenses, and projects all in one place.",
				"/widgets/freshbooks.js", "/img/plugins/freshbooks-logo.png", "/widgets/freshbooks-small-logo.png",
				null, WidgetType.BILLING));
		widgets.add(new Widget("Stripe",
				"Stripe enables individuals and businesses to accept payments over the internet.",
				"/widgets/stripe.js", "/img/plugins/Stripe.png", "/widgets/stripe-small-logo.png", null,
				WidgetType.BILLING));

		System.out.println("Default widgets ");
		System.out.println(widgets);

		return widgets;
	}

	/**
	 * Adds is_added field to current added widgets by the current user as true,
	 * if it is false and saves it in database
	 * 
	 * <p>
	 * This is done to solve the issue with with already added widgets with the
	 * new changes to done to add custom widgets
	 * </p>
	 * 
	 * @param currentWidgets
	 *            Current added widgets by current {@link AgileUser}
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> saveIsAddedStatus(List<Widget> currentWidgets)
	{
		if (currentWidgets == null)
			return new ArrayList<Widget>();

		/*
		 * From all widgets added by current user, if name of default widget
		 * equals with the current added widget, remove the default widget from
		 * all widgets and add the current widget to list, this gives the added
		 * status of widget to show in add widget page
		 */
		for (Widget currentWidget : currentWidgets)
		{
			// Current widgets are skipped since is_added status is saved
			if (WidgetType.CUSTOM.equals(currentWidget.widget_type))
				continue;

			/*
			 * If is_added is false for the added widget, set it as true and
			 * save in database
			 */
			if (!currentWidget.is_added)
			{
				currentWidget.is_added = true;
				currentWidget.save();
			}

		}

		System.out.println("In save default added widgets");
		System.out.println(currentWidgets);
		return currentWidgets;
	}

	/**
	 * Checks if all default widgets provided by Agile are added by current
	 * user, If not added, adds the remaining default widgets to the list and
	 * returns all available widgets
	 * 
	 * @param currentWidgets
	 *            All widgets (custom and default) added by current
	 *            {@link AgileUser}
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> checkAndAddDefaultWidgets(List<Widget> currentWidgets)
	{
		List<Widget> allWidgets = new ArrayList<Widget>();

		if (currentWidgets == null)
			return allWidgets;

		// Creates and fetches all default widgets (not from database)
		List<Widget> defaultWidgets = getAvailableDefaultWidgets();

		// add default widgets to all widgets
		allWidgets.addAll(defaultWidgets);

		/*
		 * From all widgets added by current user, if name of default widget
		 * equals with the current widget, remove the default widget from list
		 * and add the current widget to list, this gives the added status of
		 * widget to show in add widget page
		 */
		for (Widget currentWidget : currentWidgets)
		{
			// If it is custom widget, add it at the last
			if (WidgetType.CUSTOM.equals(currentWidget.widget_type))
			{
				allWidgets.add(currentWidget);
				continue;
			}

			// check in default widgets and update it with the object in db
			for (int i = 0; i < defaultWidgets.size(); i++)
			{
				if (currentWidget.name.equals(defaultWidgets.get(i).name))
				{
					allWidgets.remove(i);
					allWidgets.add(i, currentWidget);
					break;
				}
			}
		}

		return allWidgets;
	}
}
