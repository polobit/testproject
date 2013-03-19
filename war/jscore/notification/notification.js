/**
 * notification.js is a script file to show notifications.'socket.io.js' is used
 * to emit data received from server. Notification preferences are fetched for
 * current user.Some jquery plugins are used to show pop-up messages.
 * 
 * @module Notifications
 */
var notification_prefs;
var socket;

/**
 * Sets timeout for registering notifications.Waits for 2secs after page loads
 * and calls downloadAndRegisterForNotifications function
 */
$(function() {
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
		// Register for sockets

	}

	// Register for sockets
	registerForSockets();
}

/**
 * Gets API Key and sets up socket using socket.io
 */
function registerForSockets() {

	// Put http or https
	// var protocol = document.location.protocol;
	var protocol = 'https';
	head.js(protocol + '://stats.agilecrm.com:90/socket.io/socket.io.js',
			function() {

				// Get API Key
				var api_key_model = Backbone.Model.extend({
					url : 'core/api/api-key'
				});

				var model = new api_key_model();
				model.fetch({
					success : function(data) {

						var api_key = data.get('api_key');

						// Set up sockets with the obtained api key
						_setupSockets(api_key);

					}
				});

			});
}

/**
 * Sets sockets with the obtained api key by using socket.io.js
 * 
 * @param api_key
 *            API Key.Socket is connected using the api key.
 */
function _setupSockets(api_key) {
	console.log("Connecting " + api_key);

	var agile = api_key;
	socket = io.connect('https://stats.agilecrm.com:90');

	socket.on('connect', function() {
		console.log('socket connected');
		socket.emit('subscribe', {
			agile_id : agile
		});
	});

	socket.on('browsing', function(data) {
		console.log('browsing');
		console.log(data);

		// Get his email address
		// var email = 'manohar@invox.com';
		fetchContactAndNotify(data.email);
	});

	socket.on('notification', function(data) {

		console.log('notification');
		console.log(data);

		var parse_data = JSON.parse(data);

		// Obtained parse_data is in stringifyJSON, so parsing again.
		var object = JSON.parse(parse_data.object);

		/**
		 * Storing notification type into object json inorder to show type in
		 * notification object. 'type' key is changed to 'notification', to
		 * avoid 'type' in contact.
		 * 
		 */
		object.notification = parse_data.type;
		console.log("object ", object);

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
		/**
		 * Checks notification preferences and compare with notification type.
		 * If it is set true then show notification. For e.g. If Deal created is
		 * true then notification when 'deal is created' is shown.
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
		 * var email = getPropertyValue(parse_data.contacts[i].properties,
		 * "email"); console.log(parse_data.contacts[i]); var html =
		 * getTemplate('notify-html',parse_data.contacts[i]); notify('success1',
		 * html, 'bottom-right', true); } //fetchContactAndNotify(email);
		 */

	});
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
	var contact_created_by = contact.domainUser.name;

	// console.log(contact.domainUser.name);

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
	var contact_created_by = contact.domainUser.name;

	// Another template is taken for browsing as the fields required are
	// different.
	var html = getTemplate('browsing-notification-html', contact);

	// console.log(contact.domainUser.name);

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
 * Disconnects socket established
 */
function _cancelSockets() {
	socket.disconnect();
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
	head.js('lib/bootstrap-notifications-min.js', function() {
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
 * Runs jquery noty plugin for notification pop-ups
 * 
 * @param type -
 *            notification type
 * @param message -
 *            html content for notification
 * @param position -
 *            position of pop-up within the webpage
 */
function showNoty(type, message, position) {
	// Download the lib
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js',
			'lib/noty/layouts/bottomRight.js', LIB_PATH
					+ 'lib/noty/themes/default.js', function() {
				noty({
					text : message,
					layout : position,
					type : type,
					timeout : 5000
				});
			});
}