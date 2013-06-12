/**
 * Create the Notification if permissions allowed in the browser.
 * 
 * @method show_desktop_notification
 * 
 * @param {String}
 *            imageURL - image url to show image in popup.
 * @param {String}
 *            title - Notification type.
 * @param {String}
 *            message - Notification message.
 */
function show_desktop_notification(imageURL, title, message, link) {

	if (window.webkitNotifications
			&& window.webkitNotifications.checkPermission() == 0) {
		var notification = window.webkitNotifications.createNotification(
				imageURL, title, message);

		notification.onclick = function(x) {
			window.focus();
			// Open respective block
			Backbone.history.navigate(link, {
				trigger : true
			});

			// open_user_panel(sessionId);
			this.cancel();
		};
		setTimeout(function() {
			notification.cancel();
		}, '30000');
		// Show when tab is inactive
		if (!window.closed)
		{	
			if (notification_prefs.notification_sound != 'no_sound')
				playRecvSound(notification_prefs.notification_sound);
			
			notification.show();
		}

	}
}

/**
 * request_notification_permission request the notification request in case of
 * "0" permissions to allow or denied the notifications.
 * 
 * @method request_notification_permission
 */
function request_notification_permission() {
	if (window.webkitNotifications
			&& window.webkitNotifications.checkPermission() != 0) {

		$('#set-desktop-notification').live('click', function() {
			window.webkitNotifications.requestPermission(function() {
			});
		});

	}
}
