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
 * @param {String}
 *            link - link to navigate when clicked on popup.
 * @param {String}
 *            tag - to set tag property of Notification. Here tag is contact-id + notification-type
 */
function show_desktop_notification(imageURL, title, message, link, tag) {

		var notification = new Notification(title, {
		    body : message,
		    tag :  tag,
		    icon : imageURL
		});

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
				if(window.webkitNotifications.checkPermission() == 0)
				{	
					$('#set-desktop-notification').css('display', 'none');
				    $('#desktop-notification-content')
						.html(
								"<i>Desktop Notifications are Enabled in browser settings. <a href=\"#\" id=\"disable-notification\" style=\"text-decoration:underline;\">Disable it.</a></i>");
				}
				else
				{
					$('#set-desktop-notification').css('display', 'none');
		            $('#desktop-notification-content').html(
						"<i>Desktop Notifications are Disabled in browser settings. <a href=\"#\" id=\"enable-notification\" style=\"text-decoration:underline;\">Enable it.</a></i>")
                 }	
			});
		});

	}
}
