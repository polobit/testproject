package com.agilecrm.widgets.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;

import edu.emory.mathcs.backport.java.util.Arrays;

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

		/*
		 * widgets.add(new Widget( "Linkedin",
		 * " LinkedIn helps build professional relationships with contacts and helps keep tabs about their business interests."
		 * , "/widgets/linkedin.js", "/img/plugins/linkedin.png",
		 * "/widgets/linkedin-logo-small.png", null, WidgetType.SOCIAL));
		 */

		widgets.add(new Widget("Twitter",
				" Twitter offers a great way of engaging with contacts in real time based on what they tweet.",
				"/widgets/twitter.js", "/img/plugins/twitter.png", "/widgets/twitter-logo-small.png", null,
				WidgetType.SOCIAL));
		widgets.add(new Widget("Rapleaf",
				" Rapleaf makes it incredibly easy for you to personalize content for your customers.",
				"/widgets/rapleaf.js", "/img/plugins/rapleaf.png", "/widgets/rapleaf-logo-small.png", null,
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
		widgets.add(new Widget("Twilio", " See the Twilio call history for contact.", "/widgets/twilio.js",
				"/img/plugins/twilio.png", "/widgets/twilio-small-logo.png", null, WidgetType.CALL));
		widgets.add(new Widget(
				"FreshBooks",
				"FreshBooks enables the ability to create and manage invoices, estimates, expenses, and projects all in one place.",
				"/widgets/freshbooks.js", "/img/plugins/freshbooks-logo.png", "/widgets/freshbooks-small-logo.png",
				null, WidgetType.BILLING));
		widgets.add(new Widget("Stripe",
				"Stripe enables individuals and businesses to accept payments over the internet.",
				"/widgets/stripe.js", "/img/plugins/Stripe.png", "/widgets/stripe-small-logo.png", null,
				WidgetType.BILLING));
		widgets.add(new Widget("Sip", "Make and receive calls from your contacts using any SIP account.",
				"/widgets/sip.js", "/widgets/sip-logo-small.png", "/widgets/sip-logo-small.png", null, WidgetType.CALL));
		widgets.add(new Widget(
				"HelpScout",
				"Help Scout is a help desk for teams that insist on a delightful customer experience without exposing to ticket numbers, portals or robotic emails.",
				"/widgets/helpscout.js", "/img/plugins/helpscout-logo.png", "/widgets/helpscout-logo-small.png", null,
				WidgetType.SUPPORT));
		widgets.add(new Widget(
				"Xero",
				"Xero is an online accounting software for small business - Explore invoicing, reconciliation anytime, anywhere.",
				"/widgets/xero.js", "/widgets/xero.png", "/widgets/xero24x24.png", null, WidgetType.BILLING));
		widgets.add(new Widget(
				"QuickBooks",
				"Run your whole business better with QuickBooks wherever you are. Automate your invoicing, billing and reporting and simplify your business for life!",
				"/widgets/quickBooks.js", "/widgets/intuit-quickbooks.png", "/widgets/quickbooks_small.jpg", null,
				WidgetType.BILLING));
		widgets.add(new Widget(
				"Facebook",
				"Facebook is a social utility that connects people with friends and others who work, study and live around them",
				"/widgets/facebook.js", "/widgets/facebook.png", "/widgets/Fb24x24icon.png", null, WidgetType.SOCIAL));
		widgets.add(new Widget("Shopify",
				"Shopify is a powerful ecommerce solution that includes everything you need to create an online store",
				"/widgets/shopify.js", "/widgets/shopify.png", "/widgets/shopifysm.png", null, WidgetType.ECOMMERCE));
		widgets.add(new Widget("TwilioIO", "Make and receive calls from your contacts using your Twilio account.",
				"/widgets/twilioio.js", "/img/plugins/twilio.png", "/widgets/twilio-small-logo.png", null,
				WidgetType.CALL));
		widgets.add(new Widget(
				"GooglePlus",
				"Keep tabs on your customers' activity on Google+ and engage with them better.",
				"/widgets/googleplus.js", "/widgets/gplus.png", "/widgets/gplusicon.png", null, WidgetType.SOCIAL));

		System.out.println("Default widgets ");
		System.out.println(widgets);

		return widgets;
	}

	/**
	 * Fetches {@link WidgetType} of {@link Widget} based on name of the widget
	 * 
	 * @param widgetName
	 *            Name of the {@link Widget}
	 * @return {@link WidgetType}
	 */
	public static WidgetType getWidgetType(String widgetName)
	{
		if (Arrays.asList(new String[] { "Linkedin", "Twitter", "Rapleaf" }).contains(widgetName))
			return WidgetType.SOCIAL;

		if (Arrays.asList(new String[] { "ClickDesk", "Zendesk" }).contains(widgetName))
			return WidgetType.SUPPORT;

		if (Arrays.asList(new String[] { "Twilio", "Sip", "TwilioIO" }).contains(widgetName))
			return WidgetType.CALL;

		if (Arrays.asList(new String[] { "FreshBooks", "Stripe" }).contains(widgetName))
			return WidgetType.BILLING;

		return null;
	}

	/**
	 * Checks if {@link Widget} has {@link WidgetType}, if it is null, fetches
	 * and sets the {@link WidgetType} based on the name of {@link Widget}
	 * 
	 * @param widgets
	 *            {@link Widget}
	 * @return {@link Widget}
	 */
	public static Widget checkAndFixWidgetType(Widget widget)
	{
		System.out.println("In default widget type check " + widget);
		if (widget.widget_type == null)
		{
			WidgetType widgetType = getWidgetType(widget.name);
			if (widgetType != null)
				widget.widget_type = widgetType;
		}
		return widget;
	}

	public static Widget getDefaultWidgetByName(String widgetName)
	{
		List<Widget> widgets = getAvailableDefaultWidgets();

		for (Widget widget : widgets)
		{
			System.out.println(widget.name);
			System.out.println(widgetName);

			if (widget.name.equalsIgnoreCase(widgetName))
				return widget;
		}
		return null;
	}
}