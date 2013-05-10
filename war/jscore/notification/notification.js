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
 * Check notifications of browser and disable checked property if browser
 * doesn't support notifications or notification denied.
 */
function checkAndDisableBrowserNotifications(el) {

	if ((window.webkitNotifications && window.webkitNotifications
			.checkPermission() == 2)
			|| !window.webkitNotifications) {
		$("#desktop_notify", el).attr('disabled', 'disabled');
	}

}

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
			// console.log(domain);
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
	}

	if (object.notification == 'BROWSING')
		notificationForBrowsing(object);

	/**
	 * Checks notification preferences and compare with notification type. If it
	 * is set true then show notification. For e.g. If Deal created is true then
	 * notification when 'deal is created' is shown.
	 */
	$.each(notification_prefs, function(key, value) {

		if (key == object.notification.toLowerCase()) {

			if (notification_prefs[key])
				// notify('information', html,
				// 'bottom-right',true);
				showNoty('information', html, 'bottomRight');
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
	var contact_created_by = contact.owner.name;

	// console.log(contact.owner.name);

	// Checks for starred contact
	if (contact.star_value == 0) {
		notification_prefs.contact_assigned_starred_clicked_link = false;
		notification_prefs.contact_assigned_starred_opened_email = false;
	}

	// Clicked Link
	if (notification_prefs.contact_clicked_link) {
		// console.log(contact.type);

		// If any contact, set others false
		notification_prefs.contact_assigned_clicked_link = false;
		notification_prefs.contact_assigned_starred_clicked_link = false;

		if (contact.notification == "CLICKED_LINK")
			showNoty('information', html, 'bottomRight');
	}

	// Notification for assigned and starred contacts
	if (notification_prefs.contact_assigned_clicked_link
			|| notification_prefs.contact_assigned_starred_clicked_link) {

		// Show notifications for contacts of same user
		if (current_user == contact_created_by
				&& contact.notification == "CLICKED_LINK")
			showNoty('information', html, 'bottomRight');
	}

	// Opened Email
	if (notification_prefs.contact_opened_email) {

		// If any contact, set others false
		notification_prefs.contact_assigned_opened_email = false;
		notification_prefs.contact_assigned_starred_opened_email = false;

		if (contact.notification == "OPENED_EMAIL")
			showNoty('information', html, 'bottomRight');
	}

	// Notification for assigned and starred contacts
	if (notification_prefs.contact_assigned_opened_email
			|| notification_prefs.contact_assigned_starred_opened_email) {

		// Show notifications for contacts of same user
		if (current_user == contact_created_by
				&& contact.notification == "OPENED_EMAIL")
			showNoty('information', html, 'bottomRight');
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

	// User who created contact
	var contact_created_by = contact.owner.name;

	var html = getTemplate('notify-html', contact);

	// console.log(contact.owner.name);

	// Checks for starred contact
	if (contact.star_value == 0)
		notification_prefs.contact_assigned_starred_browsing = false;

	// Notification for any contact
	if (notification_prefs.contact_browsing) {

		// If any contact, set others false
		notification_prefs.contact_assigned_browsing = false;
		notification_prefs.contact_assigned_starred_browsing = false;

		// Show picture, name, title, company
		// JSON.stringify(data.toJSON())
		// notify('success1', html, 'bottom-right', true);
		showNoty('information', html, 'bottomRight');
	}

	// Notification for assigned and starred contacts
	if (notification_prefs.contact_assigned_browsing
			|| notification_prefs.contact_assigned_starred_browsing) {

		// Show notifications for contacts of same user
		if (current_user == contact_created_by)
			// notify('success1', html, 'bottom-right', true);
			showNoty('information', html, 'bottomRight');
	}

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
function showNoty(type, message, position) {

	// Check for html5 notification permission.
	if (notification_prefs.desktop_notify
			&& window.webkitNotifications.checkPermission() == 0) {
		show_desktop_notification(getImageUrl(message),
				getNotificationType(message), getTextMessage(message),
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
 * Returns notification type from notification template.
 * 
 * @param {String}
 *            message - notification template.
 */
function getNotificationType(message) {
	return $(message).find('#notification-type').text().toUpperCase();
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