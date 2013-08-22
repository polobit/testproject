package com.agilecrm.widgets.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;

/**
 * <code>DefaultWidgets</code> class provides static function to fetch available
 * widgets for current user and get default widgets provided by Agile
 */
public class DefaultWidgets
{

	/**
	 * Fetches all default widgets. Checks whether widgets are added already, if
	 * widget is not added then is_added field in Widget is set false, so that
	 * add button can be shown or delete button can be shown if already added
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getAvailableWidgets()
	{
		// Fetch all default widgets
		List<Widget> availableWidgets = getDefaultWidgets();

		// Populate Widgets if they have already been added
		for (Widget widget : availableWidgets)
		{
			/*
			 * Fetch widget by its name. If it is null, is_added field in widget
			 * is made false to specify that widget is not added
			 */
			if (WidgetUtil.getWidget(widget.name) == null)
				widget.is_added = false;
		}

		// Returns list of widgets
		return availableWidgets;
	}

	/**
	 * Creates default widgets provided by Agile. Default widgets are LinkedIn,
	 * Twitter, Rapleaf, ClickDesk, Zendesk and so on.
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	private static List<Widget> getDefaultWidgets()
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

		return widgets;

	}
}
