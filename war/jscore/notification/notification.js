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
$(function() {

	// Request for notification permission.
	request_notification_permission();

	// Play notification sound when clicked on play icon.
	$('#notification-sound-play').live(
			'click',
			function(e) {
				e.preventDefault();
				var sound = $('#notificationsForm #notification_sound').find(
						":selected").val();

				if (sound == 'no_sound')
					return;

				playRecvSound(sound);
			});

	setTimeout(downloadAndRegisterForNotifications, 2000);
	// fetchContactAndNotify('manohar@invox.com');

});

/**
 * Fetches notification preferences for current user
 */
function downloadAndRegisterForNotifications() {
	// Download Notification Prefs
	var notification_model = Backbone.Model.extend({
		url : 'core/api/notifications'
	});

	var model = new notification_model();
	model.fetch({
		success : function(data) {

			// Notification Preferences with respect to current agile user
			notification_prefs = data.toJSON();
			console.log(notification_prefs);
			// console.log(notification_prefs.prefs.currentDomainUserName);
			// Register for notifications
			registerForNotifications(notification_prefs)
		}
	});
}

/**
 * Registers notifications with obtained notification preferences
 */
function registerForNotifications(prefs) {
	// Check if at least one key is not present. In backend, we do not store if
	// the value is default
	if (!prefs.contact_any_browsing || !prefs.contact_assigned_browsing
			|| !prefs.contact_assigned_starred_browsing) {

	}

	// Gets domain
	getDomainFromCurrentUser();
}

/**
 * Gets domain from current user using backbone model.
 */
function getDomainFromCurrentUser() {
	var domain_user = Backbone.Model.extend({
		url : 'core/api/current-user'
	});
	var user = new domain_user();
	user.fetch({
		success : function(data) {
			var domain = data.get('domain');
			subscribeToPubNub(domain);
		}
	});
}

/**
 * Subscribes to Pubnub
 */
function subscribeToPubNub(domain) {
	// Put http or https
	// var protocol = document.location.protocol;
	var protocol = 'https';
	head
			.js(
					protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js',
					function() {
						// CREATE A PUBNUB OBJECT
						var pubnub = PUBNUB
								.init({
									'publish_key' : 'pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274',
									'subscribe_key' : 'sub-c-118f8482-92c3-11e2-9b69-12313f022c90',
									ssl : true,
									origin : 'pubsub.pubnub.com'
								});
						pubnub.ready();
						pubnub.subscribe({
							channel : domain,
							callback : function(message) {
								// console.log(unescape(message.replace('/\+/g',
								// " ")));
								// console.log(message);
								_setupNotification(message);
							}
						});
					});
}

/**
 * Sets notification message
 * 
 * @param object
 *            object data such as contact
 */
function _setupNotification(object) {

	// Inorder to avoid navigating to the contact or deal deleted
	// when clicking on notification.
	if (object.notification == 'CONTACT_DELETED'
			|| object.notification == 'DEAL_CLOSED')
		object.id = "";

	var html = getTemplate('notify-html', object);

	if (object.notification == 'CLICKED_LINK'
			|| object.notification == 'OPENED_EMAIL') {
		// Shows notification for email opened and clicked
		notificationForClickedAndOpened(object, html);
		return;
	}

	if (object.notification == 'IS_BROWSING') {
		notificationForBrowsing(object);
		return;
	}

	// Verify whether current_user key exists. It doesn't exists when tag added
	// through
	// campaign, or notification for email-clicked etc. since session doesn't
	// exist.
	if ('current_user_name' in object) {
		if (notification_prefs.prefs.currentDomainUserName == object.current_user_name)
			return;
	}

	/**
	 * Checks notification preferences and compare with notification type. If it
	 * is set true then show notification. For e.g. If Deal created is true then
	 * notification when 'deal is created' is shown.
	 */
	$.each(notification_prefs, function(key, value) {

		if (key == object.notification.toLowerCase()) {
			if (notification_prefs[key])
			{
			 
			   // Replace CONTACT with COMPANY for contact-type COMPANY
			   if((object.notification == "CONTACT_ADDED" || object.notification == "CONTACT_DELETED") && object.type == "COMPANY")
			   { 
				   var company = object.notification.replace('CONTACT', 'COMPANY');
				   object.notification = company;
			   }
			   
		      showNoty('information', html, 'bottomRight', object.notification);
			}
		}

	});

	/*
	 * console.log(parse_data); for(var i=0;i<parse_data.contacts.length;i++) { //
	 * var email = getPropertyValue(parse_data.contacts[i].properties, "email");
	 * console.log(parse_data.contacts[i]); var html =
	 * getTemplate('notify-html',parse_data.contacts[i]); notify('success1',
	 * html, 'bottom-right', true); } //fetchContactAndNotify(email);
	 */

}

/**
 * Sets email clicked and email opened notifications for any contact,assigned
 * contact and assigned & starred contact.
 * 
 * @param contact -
 *            Contact object that is obtained.
 * @param html -
 *            notification template.
 */
function notificationForClickedAndOpened(contact, html) {

	// Current user who logged_in
	var current_user = notification_prefs.prefs.currentDomainUserName;

	// User who created contact
	var contact_created_by = contact.owner_name;

	// console.log(contact.owner_name);

	// Clicked Link
	if (contact.notification == "CLICKED_LINK") {
		if (notification_prefs.link_clicked == 'ANY_CONTACT') {
			showNoty('information', html, 'bottomRight', "CLICKED_LINK");
			return;
		}

		// Checks for starred contact
		if (notification_prefs.link_clicked == 'CONTACT_ASSIGNED_AND_STARRED'
				&& contact.star_value > 0) {
			if (current_user == contact_created_by) {
				showNoty('information', html, 'bottomRight', "CLICKED_LINK");
				return;
			}
		}

		// Notification for assigned and starred contacts
		if (notification_prefs.link_clicked == 'CONTACT_ASSIGNED') {

			// Show notifications for contacts of same user
			if (current_user == contact_created_by) {
				showNoty('information', html, 'bottomRight', "CLICKED_LINK");
				return;
			}
		}

	}

	// Opened Email
	if (notification_prefs.email_opened == 'ANY_CONTACT') {
		showNoty('information', html, 'bottomRight', "EMAIL_OPENED");
		return;
	}

	if (notification_prefs.email_opened == 'CONTACT_ASSIGNED_AND_STARRED'
			&& contact.star_value > 0) {
		if (current_user == contact_created_by) {
			showNoty('information', html, 'bottomRight',"EMAIL_OPENED");
			return;
		}
	}

	// Notification for assigned and starred contacts
	if (notification_prefs.email_opened == 'CONTACT_ASSIGNED') {
		// Show notifications for contacts of same user
		if (current_user == contact_created_by) {
			showNoty('information', html, 'bottomRight',"EMAIL_OPENED");
			return;
		}
	}
}

/**
 * Fetches contact from given email.
 * 
 * @param email -
 *            email-id of a contact
 */
function fetchContactAndNotify(email) {

	// Get Contact by email address
	var contact_model = Backbone.Model.extend({
		url : function() {
			return '/core/api/contacts/search/email/'
					+ encodeURIComponent(email);
		}
	});

	var model = new contact_model();
	model.fetch({
		success : function(data) {
			// console.log(data);
			// console.log(data.toJSON());

			var id = data.id;
			if (!id)
				return;

			// Notification for browsing
			notificationForBrowsing(data.toJSON());
		}
	});

}

/**
 * Sets browsing notifications for any contact,assigned contact and assigned &
 * starred contact.
 * 
 * @param contact -
 *            Contact object that obtained with respect to email
 */
function notificationForBrowsing(contact) {

	// Current user who logged_in
	var current_user = notification_prefs.prefs.currentDomainUserName;

	// User who created contacts
	var contact_created_by = contact.owner_name;

	var html = getTemplate('notify-html', contact);

	// console.log(contact.owner_name);

	if (notification_prefs.browsing == 'ANY_CONTACT') {
		showNoty('information', html, 'bottomRight', "BROWSING");
		return;
	}

	if (notification_prefs.browsing == 'CONTACT_ASSIGNED_AND_STARRED'
			&& contact.star_value > 0) {
		if (current_user == contact_created_by) {
			showNoty('information', html, 'bottomRight', "BROWSING");
			return;
		}
	}

	if (notification_prefs.browsing == 'CONTACT_ASSIGNED') {

		// Show notifications for contacts of same user
		if (current_user == contact_created_by) {
			showNoty('information', html, 'bottomRight', "BROWSING");
			return;
		}
	}
}

/*******************************************************************************
 * Checks browser notifications
 ******************************************************************************/
function checkBrowserNotifications(el) {
	
	// Verify desktop notification settings.
	// Check if browser support
	if (!window.webkitNotifications) {
		$('#set-desktop-notification').css('display', 'none');
	}

	// Allowed
	if (window.webkitNotifications
			&& window.webkitNotifications.checkPermission() == 0) {
		$('#set-desktop-notification').css('display', 'none');
		$('#desktop-notification-content')
				.html(
						"<i>Desktop Notifications are Enabled in browser settings. <a href=\"#\" id=\"disable-notification\" style=\"text-decoration:underline;\">Disable it.</a></i>");
	}

	// Denied
	if (window.webkitNotifications
			&& window.webkitNotifications.checkPermission() == 2) {
		$('#set-desktop-notification').css('display', 'none');
		$('#desktop-notification-content')
				.html(
						"<i>Desktop Notifications are Disabled in browser settings. <a href=\"#\" id=\"enable-notification\" style=\"text-decoration:underline;\">Enable it.</a></i>")
	}

	$('#enable-notification', el).die().live('click', function(e) {
		e.preventDefault();
		$('#notification-enable-help-modal').modal("show");
	});

	$('#disable-notification', el).die().live('click', function(e) {
		e.preventDefault();
		$('#notification-disable-help-modal').modal("show");
	});
}

function showSwitchChanges(el)
{
	$('#notification-switch', el).die().live(
			'switch-change',
			function() {
				var status = $('#notification-switch')
						.bootstrapSwitch('status');
				
				// if ON - status is true
				if (status) {
					$(el).find('input[type=checkbox]').not(
							'#control_notifications,#notification_sound').removeAttr('disabled');
					$(el).find('select').not('#control_notifications')
							.removeAttr('disabled');
				} else {
					$(el).find('input[type=checkbox]').not(
							'#control_notifications').attr('disabled',
							'disabled');
					$(el).find('select').not('#control_notifications, #notification_sound').attr(
							'disabled', 'disabled');
				}

			});
}

/**
 * Creates bootstrap pop-up notification.
 * 
 * @param type -
 *            success type of notification
 * @param message -
 *            html template for notification
 * @param position -
 *            position of pop-up in a web-page
 * @param closable -
 *            pop-up is closable
 */
function notify(type, message, position, closable) {
	head.js(LIB_PATH + 'lib/bootstrap-notifications-min.js', function() {
		$('.' + position).notify({
			type : type,
			message : {
				html : message
			},
			closable : closable,
			fadeOut : {
				enabled : true,
				delay : 10000000
			},
			transition : 'fade'
		}).show();
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
 *            notification type - TAG CREATED, TAG DELETED etc.
 */
function showNoty(type, message, position,notification_type) {

	// Don't show notifications when disabled by user
	if (!notification_prefs.control_notifications)
		return;

	// Check for html5 notification permission.
	if (window.webkitNotifications
			&& window.webkitNotifications.checkPermission() == 0) {
		show_desktop_notification(getImageUrl(message),
				getNotificationType(notification_type), getTextMessage(message),
				getId(message));
		return;
	}

	// Download the lib
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
			+ 'lib/noty/layouts/bottomRight.js', LIB_PATH
			+ 'lib/noty/layouts/bottom.js', LIB_PATH
			+ 'lib/noty/themes/default.js', function() {

		var n = noty({
			text : message,
			layout : position,
			type : type,
			timeout : 30000
		});

		// Play sounds for only user notifications
		if (n.options.type == 'information') {
			if (notification_prefs.notification_sound != 'no_sound')
				playRecvSound(notification_prefs.notification_sound);
		}

		// Set the handler for click
		$('.noty_bar').die().live('click', function() {

			// // warning type is used for upgrade. So when cliked on it
			// navigate to subscribe.
			// if(n.options.type == "warning")
			// {
			// // Send to upgrade page
			// Backbone.history.navigate('subscribe', {
			// trigger : true
			// });
			// }

			// information type is used for user notification. When clicked
			// navigate to link.
			if (n.options.type == "information") {
				var link = $(this).find("a").attr("href");
				Backbone.history.navigate(link, {
					trigger : true
				});
			}

		});
	});
}

/**
 * Returns required text from notification template as html5 doesn't allow html.
 * 
 * @param {String}
 *            message - notification template.
 */
function getTextMessage(message) {
	var name;
	var type = $(message).find('#notification-type').text();

	if ($(message).find('#notification-contact-id').text() != "") {
		name = $(message).find('#notification-contact-id').text();
		return name + " " + type;
	}

	name = $(message).find('#notification-deal-id').text();
	return name + " " + type;
}

/**
 * Returns converted notification-type. E.g., TAG_ADDED to Tag Added
 ***/
function getNotificationType(notification_type)
{
	if(notification_type == "CONTACT_ADDED" || notification_type == "TAG_ADDED" || notification_type == "DEAL_CREATED")
		return "New " + ucfirst(notification_type.split('_')[0]);
		
	return ucfirst(notification_type.split('_')[0]) + " " + ucfirst(notification_type.split('_')[1]);
}

/**
 * Returns required contact-id or deal-id from notification template. This
 * allows to return to respective page when clicked on notification.
 * 
 * @param {String}
 *            message - notification template.
 */
function getId(message) {
	if ($(message).find('#notification-contact-id').text() != "") {
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
function getImageUrl(message) {
	if ($(message).find('#notification-contact-id').text() != "")
		return $('span:first', message).attr('id');

	return '/img/deal.png';
}