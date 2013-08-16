/**
 * notification.js is a script file to show notifications.pubnub is used to emit
 * data received from server. Notification preferences are fetched for current
 * user.Noty jquery plugin are used to show pop-up messages.
 * 
 * @module Notifications
 */
var notification_prefs;

/**
 * Sets timeout for registering notifications.Waits for 2secs after page loads
 * and calls downloadAndRegisterForNotifications function
 */
$(function()
{

	// wait for 2secs
	setTimeout(downloadAndRegisterForNotifications, 2000);

});

/**
 * Fetches notification preferences for current user
 */
function downloadAndRegisterForNotifications()
{

	// Download Notification Prefs
	var notification_model = Backbone.Model.extend({ url : 'core/api/notifications' });

	var model = new notification_model();
	model.fetch({ success : function(data)
	{

		// Notification Preferences with respect to current agile user
		notification_prefs = data.toJSON();
		console.log(notification_prefs);

		// Gets domain
		getDomainFromCurrentUser();
	} });
}

/**
 * Gets domain from current user using backbone model.
 */
function getDomainFromCurrentUser()
{
	var domain_user = Backbone.Model.extend({ url : 'core/api/users/current-user' });
	var user = new domain_user();
	user.fetch({ success : function(data)
	{
		var domain = data.get('domain');
		subscribeToPubNub(domain, function(message)
		{

			_setupNotification(message);
		});
	} });
}

/**
 * Subscribes to Pubnub.
 * 
 * @param domain -
 *            Domain name.
 */
function subscribeToPubNub(domain)
{
	// Put http or https
	// var protocol = document.location.protocol;
	var protocol = 'https';
	head.js(protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js', function()
	{
		// CREATE A PUBNUB OBJECT
		var pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274',
			'subscribe_key' : 'sub-c-118f8482-92c3-11e2-9b69-12313f022c90', ssl : true, origin : 'pubsub.pubnub.com' });
		pubnub.ready();
		pubnub.subscribe({ channel : domain, callback : function(message)
		{

			// shows notification for bulk actions
			if (message.type == "BULK_ACTIONS")
			{
				bulkActivitiesNoty('information', message);
				return;
			}

			// sets notification for notification preferences.
			_setupNotification(message);
		} });
	});
}

/**
 * Sets notification message
 * 
 * @param object
 *            object data such as contact
 */
function _setupNotification(object)
{

	// Inorder to avoid navigating to the contact or deal deleted
	// when clicking on notification.
	if (object.notification == 'CONTACT_DELETED' || object.notification == 'DEAL_CLOSED')
		object.id = "";

	// gets notification template.
	var html = getTemplate('notify-html', object);

	// Shows notification for link clicked, email opened and browsing.
	notification_for_email_and_browsing(object, html);

	// Verify whether current_user key exists. It doesn't exists when tag added
	// through campaign, or notification for email-clicked etc. since session
	// doesn't exist.
	if ('current_user_name' in object)
	{
		if (notification_prefs.prefs.currentDomainUserName == object.current_user_name)
			return;
	}

	// notification for tags, contact and deal actions.
	notification_for_contact_and_deal(object, html);
}

/**
 * Set up notification for link clicked, email opened and browsing.
 * 
 * @param object -
 *            contact object.
 * @param html -
 *            notification template
 * 
 */
function notification_for_email_and_browsing(object, html)
{

	if (object.notification == 'CLICKED_LINK' || object.notification == 'OPENED_EMAIL' || object.notification == 'IS_BROWSING')
	{
		var option = get_option(object.notification);

		notification_based_on_type_of_contact(option, object, html, object.notification);
		return;
	}
}

/**
 * Checks notification preferences and compare with notification type. If it is
 * set true then show notification. For e.g. If Deal created is true then
 * notification when 'deal is created' is shown.
 * 
 * @param object -
 *            contact or deal object.
 * 
 * @param html -
 *            notification template.
 */
function notification_for_contact_and_deal(object, html)
{
	$.each(notification_prefs, function(key, value)
	{

		if (key == object.notification.toLowerCase())
		{
			if (notification_prefs[key])
			{

				// Replace CONTACT with COMPANY for contact-type COMPANY
				if ((object.notification == "CONTACT_ADDED" || object.notification == "CONTACT_DELETED") && object.type == "COMPANY")
				{
					var company = object.notification.replace('CONTACT', 'COMPANY');
					object.notification = company;
				}

				showNoty('information', html, 'bottomRight', object.notification);
			}
		}

	});
}

/**
 * Verifies whether contact owner is same as notification prefs owner. It is
 * used for 'CONTACT_ASSIGNED' option.
 * 
 * @param contact -
 *            contact object.
 */
function is_assigned(contact)
{

	// Current user who logged_in
	var current_user = notification_prefs.prefs.currentDomainUserName;

	// User who created contact
	var contact_created_by = contact.owner_name;

	// checks for assigned contact
	if (current_user == contact_created_by)
		return true;

	return false;
}

/**
 * Verifies whether contact is assigned and starred (having star value).
 * 
 * @param contact -
 *            contact object.
 */
function is_assigned_and_starred(contact)
{

	// checks assigned and starred
	if (is_assigned(contact) && contact.star_value > 0)
		return true;

	return false;
}

/**
 * Returns notification_prefs value based on notification type for link clicked,
 * email_opened and browsing.
 * 
 * @param notification_type -
 *            CLICKED_LINK or OPENED_EMAIL or IS_BROWSING
 */
function get_option(notification_type)
{
	switch (notification_type) {
	case 'CLICKED_LINK':
		return notification_prefs.link_clicked;
	case 'OPENED_EMAIL':
		return notification_prefs.email_opened;
	case 'IS_BROWSING':
		return notification_prefs.browsing;
	}
}

/**
 * Shows notification for link clicked, email opened and browsing. It verifies
 * for option selected and shows notification accordingly.
 * 
 * @param option -
 *            ANY_CONTACT, CONTACT_ASSIGNED or CONTACT_ASSIGNED_AND_STARRED.
 * @param contact -
 *            contact object
 * @param message -
 *            notification html template.
 * @param notification_type -
 *            CLICKED_LINK or OPENED_EMAIL or IS_BROWSING
 */
function notification_based_on_type_of_contact(option, contact, message, notification_type)
{
	switch (option) {
	case 'CONTACT_ASSIGNED':
		if (is_assigned(contact))
			showNoty("information", message, "bottomRight", notification_type);
		break;
	case 'CONTACT_ASSIGNED_AND_STARRED':
		if (is_assigned_and_starred(contact))
			showNoty("information", message, "bottomRight", notification_type);
		break;
	case 'ANY_CONTACT':
		showNoty("information", message, "bottomRight", notification_type);
		break;
	}

}

/**
 * Checks html5 notifications browser settings. If desktop notifications are
 * enabled, shows enabled message and similarly for disabled.
 * 
 * @param el -
 *            backbone el element.
 */
function check_browser_notification_settings(el)
{

	// Verify desktop notification settings.
	// Check if browser support
	if (!window.webkitNotifications)
	{
		$('#set-desktop-notification').css('display', 'none');
	}

	// Allowed
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0)
	{
		$('#set-desktop-notification').css('display', 'none');
		$('#desktop-notification-content')
				.html(
						"<i>Desktop Notifications are now enabled. <a href=\"#\" id=\"disable-notification\" style=\"text-decoration:underline;\">Disable</a></i>");
	}

	// Denied
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 2)
	{
		$('#set-desktop-notification').css('display', 'none');
		$('#desktop-notification-content')
				.html(
						"<i>Desktop Notifications are now disabled. <a href=\"#\" id=\"enable-notification\" style=\"text-decoration:underline;\">Enable</a></i>")
	}

	// notification enable help
	$('#enable-notification', el).die().live('click', function(e)
	{
		e.preventDefault();
		$('#notification-enable-help-modal').modal("show");
	});

	// notification disable help
	$('#disable-notification', el).die().live('click', function(e)
	{
		e.preventDefault();
		$('#notification-disable-help-modal').modal("show");
	});
}

/**
 * Shows bootstrap switch changes accordingly. It disables all the options when
 * off and enables when on.
 * 
 * @param el-
 *            backbone el element
 * 
 */
function showSwitchChanges(el)
{
	$('#notification-switch', el).die().live('switch-change', function()
	{
		var status = $('#notification-switch').bootstrapSwitch('status');

		// if ON - status is true
		if (status)
		{
			$(el).find('input[type=checkbox]').not('#control_notifications,#notification_sound').removeAttr('disabled');
			$(el).find('select').not('#control_notifications').removeAttr('disabled');
		}
		else
		{
			$(el).find('input[type=checkbox]').not('#control_notifications').attr('disabled', 'disabled');
			$(el).find('select').not('#control_notifications, #notification_sound').attr('disabled', 'disabled');
		}

	});
}

/**
 * Runs jquery noty plugin for notification pop-ups when desktop permission is
 * not given.
 * 
 * @param type -
 *            noty types like information, warning etc.
 * @param message -
 *            html content for notification
 * @param position -
 *            position of pop-up within the webpage.
 * @param notification_type -
 *            notification type - TAG_CREATED, TAG_DELETED etc.
 */
function showNoty(type, message, position, notification_type)
{

	// Don't show notifications when disabled by user
	if (!notification_prefs.control_notifications)
		return;

	// Check for html5 notification permission.
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0)
	{
		show_desktop_notification(getImageUrl(message), getNotificationType(notification_type), getTextMessage(message), getId(message), getId(message).split(
				'/')[1] + '-' + notification_type);
		return;
	}

	// Download the lib
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js', LIB_PATH + 'lib/noty/layouts/bottom.js',
			LIB_PATH + 'lib/noty/themes/default.js', function()
			{

				var n = noty({ text : message, layout : position, type : type, timeout : 30000 });

				// Play sounds for only user notifications
				if (n.options.type == 'information')
				{
					if (notification_prefs.notification_sound != 'no_sound')
						play_sound(notification_prefs.notification_sound);
				}

				// Set the handler for click
				$('.noty_bar').die().live('click', function()
				{

					// // warning type is used for upgrade. So when cliked on it
					// navigate to subscribe.
					// if(n.options.type == "warning")
					// {
					// // Send to upgrade page
					// Backbone.history.navigate('subscribe', {
					// trigger : true
					// });
					// }

					// information type is used for user notification. When
					// clicked
					// navigate to link.
					if (n.options.type == "information")
					{
						var link = $(this).find("a").attr("href");
						Backbone.history.navigate(link, { trigger : true });
					}

				});
			});
}

/** HTML5 Desktop Notification utility methods. Depends on notification template.*/
/**
 * Returns required text from notification template as html5 doesn't allow html.
 * 
 * @param {String}
 *            message - notification template.
 */
function getTextMessage(message)
{
	var name;
	var type = $(message).find('#notification-type').text();

	if ($(message).find('#notification-contact-id').text() != "")
	{
		name = $(message).find('#notification-contact-id').text();
		return name + " " + type;
	}

	name = $(message).find('#notification-deal-id').text();
	return name + " " + type;
}

/**
 * Returns converted notification-type. E.g., TAG_ADDED to New Tag
 */
function getNotificationType(notification_type)
{
	if (notification_type == "CONTACT_ADDED" || notification_type == "COMPANY_ADDED" || notification_type == "TAG_ADDED" || notification_type == "DEAL_CREATED")
		return "New " + ucfirst(notification_type.split('_')[0]);

	if (notification_type == "IS_BROWSING")
		return ucfirst(notification_type.split('_')[1]);
	return ucfirst(notification_type.split('_')[0]) + " " + ucfirst(notification_type.split('_')[1]);
}

/**
 * Returns required contact-id or deal-id from notification template. This
 * allows to return to respective page when clicked on notification.
 * 
 * @param {String}
 *            message - notification template.
 */
function getId(message)
{
	if ($(message).find('#notification-contact-id').text() != "")
	{
		return $(message).find('#notification-contact-id').attr('href');
	}

	return $(message).find('#notification-deal-id').attr('href');
}

/**
 * Returns image url from notification template to display image.
 * 
 * @param {String}
 *            message - notification template.
 */
function getImageUrl(message)
{
	if ($(message).find('#notification-contact-id').text() != "")
		return $('span:first', message).attr('id');

	return '/img/deal.png';
}
/** End of HTML5 Desktop Notification utility methods*/

/**
 * Plays notification sounds on clicking on play button.
 */
function notification_play_button()
{
	// Play notification sound when clicked on play icon.
	$('#notification-sound-play').live('click', function(e)
	{
		e.preventDefault();

		var sound = $('#notificationsForm #notification_sound').find(":selected").val();

		// silent
		if (sound == 'no_sound')
			return;

		// plays sound
		play_sound(sound);
	});

}
