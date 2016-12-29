package com.agilecrm.widgets.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.social.TwilioUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.WidgetType;

import edu.emory.mathcs.backport.java.util.Arrays;

/**
 * <code>DefaultWidgets</code> class provides static function to fetch available
 * widgets for current user and get default widgets provided by Agile
 */
public class DefaultWidgets {

	/**
	 * Creates configurable default widgets provided by Agile. Adds each widget
	 * details to list, which specifies URL to load the widget and images,
	 * logo's, description to be show in widgets panel.
	 * 
	 * @return {@link List} of {@link Widget}s
	 */
	public static List<Widget> getAvailableDefaultWidgets() {
		List<Widget> widgets = new ArrayList<Widget>();

		/**
		 * Call widgets Order
		 */
		widgets.add(new Widget("CallScript", "Call Script",
			"View context based call scripts based on preset rules for calls with your customers.",
			"/widgets/callscript.js", "/widgets/call-script-logo-small.png",
			"/widgets/call-script-logo-small.png", null, WidgetType.CALL));
		widgets.add(new Widget(
			"Twilio",
			"Twilio Call Log",
			" This widget is now deprecated and a new improved Twilio widget is available.",
			"/widgets/twilio.js", "/img/plugins/twilio.png",
			"/widgets/twilio-small-logo.png", null, WidgetType.CALL));
		widgets.add(new Widget(
			"TwilioIO",
			"Twilio",
			"Make and receive calls, and send and receive text messages with your customers using Twilio account.",
			"/widgets/twilioio.js", "/img/plugins/twilio.png",
			"/widgets/twilio-small-logo.png", null, WidgetType.CALL));
		widgets.add(new Widget(
			"Bria",
			"Bria",
			"Make and receive calls with your customers using Bria account.",
			"/widgets/bria.js", "/img/plugins/bria-call.png",
			"/img/plugins/bria-call.png", null, WidgetType.CALL));
		widgets.add(new Widget(
			"Skype",
			"Skype",
			"Make and receive calls with your customers using Skype account.",
			"/widgets/skype.js", "/img/plugins/skype-call.png",
			"/img/plugins/skype-call.png", null, WidgetType.CALL));
		widgets.add(new Widget(
			"Sip",
			"Sip",
			"Make and receive calls with your customers using SIP account.",
			"/widgets/sip.js", "/widgets/sip-logo-small.png",
			"/widgets/sip-logo-small.png", null, WidgetType.CALL));
		widgets.add(new Widget(
			"Ozonetel",
			"Ozonetel",
			"Make and receive calls, and send and receive text messages with your customers using Twilio account.",
			"/widgets/ozonetel.js", "/widgets/ozonetel.png",
			"/widgets/ozonetel_fullsize.png", null, WidgetType.CALL));
		widgets.add(new Widget(
			 "Knowlarity",
			 "Knowlarity",
			 "Know your customers Klout score, a measure of customers influence on social networks. Klout score is fetched based on Twitter profile.",
			 "/widgets/knowlarity.js", "widgets/knowlarity-lg-logo.png",
			 "widgets/knowlarity-md-logo.png", null, WidgetType.CALL));
	
		/**
		 * Social widgets Order
		 */
		widgets.add(new Widget(
			"Facebook",
			"Facebook",
			"Engage your customers effectively through Facebook integration based on their Facebook activity.",
			"/widgets/facebook.js", "/widgets/facebook.png",
			"/widgets/Fb24x24icon.png", null, WidgetType.SOCIAL));
		widgets.add(new Widget(
			"Twitter",
			"Twitter",
			"Engage your customers effectively through Twitter integration based on their Twitter activity.",
			"/widgets/twitter.js", "/img/plugins/twitter.png",
			"/widgets/twitter-logo-small.png", null, WidgetType.SOCIAL));
		widgets.add(new Widget(
			"GooglePlus",
			"Google+",
			"Engage your customers effectively through Google Plus  integration based on their Google Plus activity.",
			"/widgets/googleplus.js", "/widgets/gplus.png",
			"/widgets/gplusicon.png", null, WidgetType.SOCIAL));
		widgets.add(new Widget(
			"FullContact",
			"FullContact",
			"Stay updated on customers profile through FullContact integration with information like name, photo, company, address and websites.",
			"/widgets/fullcontact.js", "/img/plugins/fullcontact-lg-logo.png",
			"/img/plugins/fullcontact-sm-logo.png", null,WidgetType.SOCIAL));
		widgets.add(new Widget(
			 "Klout",
			 "Klout",
			 "Know your customers Klout score, a measure of customers influence on social networks. Klout score is fetched based on Twitter profile.",
			 "/widgets/klout.js", "widgets/klout-lg-logo.png",
			 "widgets/klout-md-logo.png", null, WidgetType.SOCIAL));
		widgets.add(new Widget(
			"Rapleaf",
			"TowerData",
			"Leverage towerdata to personalize content for your customers based on their interests.",
			"/widgets/rapleaf.js", "/img/plugins/towerdata.png",
			"/widgets/towerdata-logo-small.png", null, WidgetType.SOCIAL));
		/**
		 * Support widgets Order
		 */
		widgets.add(new Widget(
			"ClickDesk",
			"ClickDesk",
			"Convert chat sessions to contacts, and manage chat and ticket history of your customers.",
			"/widgets/clickdesk.js", "/img/plugins/clickdesk-logo.png",
			"/widgets/clickdesk-logo-small.png", null, WidgetType.SUPPORT));
		widgets.add(new Widget(
			"Zendesk",
			"Zendesk",
			"Resolve issues, create tickets, and manage ticket history of your customers.",
			"/widgets/zendesk.js", "/img/plugins/zendesk_logo.png",
			"/widgets/zendesk-logo-small.png", null, WidgetType.SUPPORT));
		widgets.add(new Widget(
			"HelpScout",
			"Help Scout",
			"Resolve issues, create conversations, and manage conversation history of your customers.",
			"/widgets/helpscout.js", "/img/plugins/helpscout-logo.png",
			"/widgets/helpscout-logo-small.png", null, WidgetType.SUPPORT));
		widgets.add(new Widget(
			"Uservoice",
			"UserVoice",
			"Sync and manage feedback from your customers to provide improved customer experience.",
			"/widgets/uservoice.js", "/widgets/Uservoice_lg_logo.png",
			"/widgets/UserVoice_md_logo.png", null, WidgetType.SUPPORT));
		/**
		 * Billing widgets Order
		 */
		widgets.add(new Widget(
			"FreshBooks",
			"FreshBooks",
			"Create invoices, track payments, and manage invoice history of your customers.",
			"/widgets/freshbooks.js", "/img/plugins/freshbooks-logo.png",
			"/widgets/freshbooks-small-logo.png", null, WidgetType.BILLING));
		widgets.add(new Widget(
			"Stripe",
			"Stripe",
			"View subscription details, check payment history, get stripe events and create campaigns for your customers.",
			"/widgets/stripe.js", "/img/plugins/Stripe.png",
			"/widgets/stripe-small-logo.png", null, WidgetType.BILLING));
		widgets.add(new Widget(
			"Braintree",
			"Braintree",
			"View transaction details, and track recurring bills of your customers.",
			"/widgets/braintree.js", "/img/plugins/braintree-lg-logo.png",
			"/widgets/braintree-sm-logo.png", null, WidgetType.BILLING));
		widgets.add(new Widget(
			"PayPal",
			"PayPal",
			"View and track PayPal invoices of your customers using your PayPal account.",
			"/widgets/paypal.js", "/img/plugins/paypal_logo_png.png",
			"/widgets/paypal_icon.png", null, WidgetType.BILLING));
		widgets.add(new Widget(
			"Xero",
			"Xero",
			"Manage invoices, track payments and see invoice history of your customers.",
			"/widgets/xero.js", "/widgets/xero.png",
			"/widgets/xero24x24.png", null, WidgetType.BILLING));
		widgets.add(new Widget(
			"QuickBooks",
			"QuickBooks",
			"Create invoices, track and receive payments, and see invoice history of your customers.",
			"/widgets/quickBooks.js", "/widgets/intuit-quickbooks.png",
			"/widgets/quickbooks_small.jpg", null, WidgetType.BILLING));
		/**
		 * Ecommerce widgets Order
		 */
		widgets.add(new Widget(
			"Shopify",
			"Shopify",
			"Provide online and offline engagement, get shopify events, and create campaigns for your customers.",
			"/widgets/shopify.js", "/widgets/shopify.png",
			"/widgets/shopifysm.png", null, WidgetType.ECOMMERCE));
		/**
		 * Custom Widget
		 */
		widgets.add(new Widget(
			"Custom",
			"Custom",
			"Develop custom widget in javascript or any backend server language for your customers.",
			"/widgets/custom.js", "widgets/custom_widget.png",
			"widgets/custom_widget.png", null, WidgetType.CUSTOM));
		/*
		 * widgets.add(new Widget( "Linkedin",
		 * " LinkedIn helps build professional relationships with contacts and helps keep tabs about their business interests."
		 * , "/widgets/linkedin.js", "/img/plugins/linkedin.png",
		 * "/widgets/linkedin-logo-small.png", null, WidgetType.SOCIAL));
		 */

		System.out.println("Default widgets ");
		System.out.println(widgets);

		return widgets;
	}

	/**
	 * Returns the widget type based on the widget name.
	 * 
	 * @param widgetName
	 *            Name of the {@link Widget}
	 * @return {@link WidgetType}
	 */
	public static WidgetType getWidgetType(String widgetName) {
		if (Arrays.asList(new String[] { "Linkedin", "Twitter", "Rapleaf" })
				.contains(widgetName)) {
			return WidgetType.SOCIAL;
		} else if (Arrays.asList(new String[] { "ClickDesk", "Zendesk" })
				.contains(widgetName)) {
			return WidgetType.SUPPORT;
		} else if (Arrays.asList(
				new String[] { "Twilio", "Sip", "TwilioIO", "CallScript",
						"Bria", "Skype", "Ozonetel"}).contains(widgetName)) {
			return WidgetType.CALL;
		} else if (Arrays.asList(new String[] { "FreshBooks", "Stripe" })
				.contains(widgetName)) {
			return WidgetType.BILLING;
		}
		return null;
	}

	/**
	 * Sets the widget type based on the widget object.
	 * 
	 * @param widgets
	 *            {@link Widget}
	 * @return {@link Widget}
	 */
	public static Widget checkAndFixWidgetType(Widget widget) {
		System.out.println("In default widget type check " + widget);
		try{
			if (widget.widget_type == null) {
				WidgetType widgetType = getWidgetType(widget.name);
				if (widgetType != null) {
					widget.widget_type = widgetType;
				}
			}
			if(StringUtils.equals(widget.name,"TwilioIO") && StringUtils.equals(widget.getProperty("twilio_twimlet_url"),"None")){
				String numberSid = "None";
				String twil_num_sid = widget.getProperty("twilio_number_sid");
				if(StringUtils.isNotBlank(twil_num_sid)){
					numberSid = widget.getProperty("twilio_number_sid");
				}
				Long domainuserid = AgileUser.getCurrentAgileUser().domain_user_id;
				String appsid = TwilioUtil.createAppSidTwilioIO(widget.getProperty("twilio_acc_sid"), widget.getProperty("twilio_auth_token"), numberSid, widget.getProperty("twilio_record"), "http://twimlets.com/voicemail?Email="+DomainUserUtil.getDomainUser(domainuserid).email);
				System.out.println("appsid == "+appsid);
				widget.addProperty("twilio_app_sid", appsid);
				widget.addProperty("twilio_twimlet_url", "http://twimlets.com/voicemail?Email="+DomainUserUtil.getDomainUser(domainuserid).email);
				widget.save(widget);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return widget;
	}

	/**
	 * 
	 * Get the configurable widget based on the widget name.
	 * 
	 * @param widgetName
	 * @return {@link Widget}
	 */
	public static Widget getDefaultWidgetByName(String widgetName) {
		List<Widget> widgets = getAvailableDefaultWidgets();

		for (Widget widget : widgets) {
			System.out.println(widget.name);
			System.out.println(widgetName);

			if (widget.name.equalsIgnoreCase(widgetName)) {
				return widget;
			}
		}
		return null;
	}
}