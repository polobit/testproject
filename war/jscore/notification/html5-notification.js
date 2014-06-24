$(function() {
	
	// Request for html5 notification permission.
	request_notification_permission();

});

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

	head.js(LIB_PATH +'lib/desktop-notify-min.js',function(){
		
		var notification = notify.createNotification(title, {
			   body : message,
			   icon : imageURL,
			   tag : tag,
			   onClickCallback : function() {
					
				   window.focus();
					
				   // Open respective block
					Backbone.history.navigate(link, {
						trigger : true
					});

					notification.close();
				 }
			  });
		
		setTimeout(function() {
			notification.close();
		}, '30000');
		
		// Show when tab is inactive
		if (!window.closed)
		{	
			if (notification_prefs.notification_sound != 'no_sound')
				play_sound(notification_prefs.notification_sound);
			
		}
	});
}

/**
 * request_notification_permission request the notification request in case of
 * "0" permissions to allow or denied the notifications.
 * 
 * @method request_notification_permission
 */
function request_notification_permission() {
	
	head.js(LIB_PATH +'lib/desktop-notify-min.js',function(){
		
		if (notify.permissionLevel() == notify.PERMISSION_DEFAULT) {

			$('#set-desktop-notification').live('click', function() {
				notify.requestPermission(function() {
					if(notify.permissionLevel() == notify.PERMISSION_GRANTED)
					{	
						$('#set-desktop-notification').css('display', 'none');
					    $('#desktop-notification-content')
							.html(
									"<i>Desktop Notifications are now enabled. <a href=\"#\" id=\"disable-notification\" style=\"text-decoration:underline;\">Disable</a></i>");
					}
					else
					{
						$('#set-desktop-notification').css('display', 'none');
			            $('#desktop-notification-content').html(
							"<i>Desktop Notifications are now disabled. <a href=\"#\" id=\"enable-notification\" style=\"text-decoration:underline;\">Enable</a></i>")
	                 }	
				});
			});

		}
		
	});

}
