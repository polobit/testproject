/**
 * Create the Notification if permissions allowed in the browser.
 * 
 * @method show_desktop_notification
 * @param {String}
 *            sessionId
 * @param {String}
 *            imageURl
 * @param {String}
 *            title
 * @param {String}
 *            message
 */
function show_desktop_notification(imageURL,title, message,link) {
	
	if (window.webkitNotifications) {
		if (window.webkitNotifications.checkPermission() == 0) { 
			
			// 0 is
			// PERMISSION_ALLOWED
			// function defined
			
			var notification = window.webkitNotifications.createNotification(
					imageURL, title.replace(/_/g, " "), message);
			
			notification.onclick = function(x) {
				window.focus();
				// Open respective block
				Backbone.history.navigate(link,{
					trigger:true
					});

				// open_user_panel(sessionId);
				this.cancel();
			};
			setTimeout(function() {
				notification.cancel();
			}, '30000');
			// Show when tab is inactive
			if (!window.closed)
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
// 0 is PERMISSION_ALLOWED
function request_notification_permission() {
	if (window.webkitNotifications) {
		if (window.webkitNotifications.checkPermission() != 0) {		
         
			$('body').live('click', function() {		
				window.webkitNotifications.requestPermission(function(){});
			});
			
		}

	}
}

