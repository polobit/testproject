/**
 * notification.js is a script file to show notifications.pubnub is used to emit
 * data received from server. Notification preferences are fetched for current
 * user.Noty jquery plugin are used to show pop-up messages.
 * 
 * @module Notifications
 */
var notification_prefs;

/**
 * Fetches notification preferences for current user
 */
function downloadAndRegisterForNotifications()
{

	// As of now I know that this function is calling only once after loggin. so Updating due task count in this function;
	var due_task_count=getDueTasksCount();
	$('#due_tasks_count').html(due_task_count);
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
		var domain = CURRENT_DOMAIN_USER['domain'];
		subscribeToPubNub(domain, function(message)
		{

			_setupNotification(message);
		});
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
	load_urls_on_ajax_stop(protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js', function()
	{
		// CREATE A PUBNUB OBJECT
		var pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274',
			'subscribe_key' : 'sub-c-118f8482-92c3-11e2-9b69-12313f022c90', ssl : true, origin : 'pubsub.pubnub.com' });
		pubnub.ready();
		pubnub.subscribe({ channel : domain, callback : function(message)
		{
			console.log(message);
			if(message.type  == "LOGIN_INSTANCE")
			{
				check_login_instance(message);
				return;
			}
			
			// shows notification for bulk actions
			if (message.type == "BULK_ACTIONS")
			{
				bulkActivitiesNoty('information', message);
				return;
			}
			
			if (message.type == "EVENT_REMINDER")
			{
				var html = getTemplate("event-notification", message);
				showNoty('information', html, "bottomRight", "EVENT_REMINDER");
				return;
			}
			
			
			// shows call notification
			if(message.type == "CALL"){
				var html = getTemplate('call-notification', message);
				showNoty('information', html, 'bottomRight', "CALL");
				return;
			}

			if(message.type == "UNKNOWN_CALL"){
				var html = getTemplate("unknown-call-notification", message);
				showNoty('information', html, "bottomRight", "UNKNOWN_CALL");
				return;
			}
			
			if(message.notification == "CAMPAIGN_NOTIFY")
			{
			   var custom_json = JSON.parse(message["custom_value"]);

			   if(custom_json.owner_id == "ALL")
				   showNoty('information', getTemplate('campaign-notify',message), 'bottomRight',"CAMPAIGN_NOTIFY");
			   
			   if(custom_json.owner_id == CURRENT_DOMAIN_USER['id'])
				   showNoty('information', getTemplate('campaign-notify', message), 'bottomRight',"CAMPAIGN_NOTIFY");
				   
			   return;
			}

			// sets notification for notification preferences.
			_setupNotification(message);
		},
		connect : function()
		{
			console.log("connected");
			publishLoginEvent(pubnub);
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
function _setupNotification(object)
{

	// Inorder to avoid navigating to the contact
	if (object.notification == 'CONTACT_DELETED')
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
	if (notify && !notify.isSupported)
	{
		$('#set-desktop-notification').css('display', 'none');
	}

	// Allowed
	if (notify && notify.isSupported && notify.permissionLevel() == notify.PERMISSION_GRANTED)
	{
		$('#set-desktop-notification').css('display', 'none');
		$('#desktop-notification-content')
				.html(
						"<i>Desktop Notifications are now enabled. <a href=\"#\" id=\"disable-notification\" style=\"text-decoration:underline;\">Disable</a></i>");
	}

	// Denied
	if (notify && notify.isSupported && notify.permissionLevel() == notify.PERMISSION_DENIED)
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
function showNoty(type, message, position, notification_type, onCloseCallback)
{
	// Don't show notifications when disabled by user. Neglect campaign ones
	if(notification_type != "EVENT_REMINDER" ){
	
	if (notification_type != "CAMPAIGN_NOTIFY"&& !notification_prefs.control_notifications)
		return;
	}

	// Check for html5 notification permission.
	if (notify && notify.isSupported && notify.permissionLevel() == notify.PERMISSION_GRANTED)
	{
		if(notification_type=="CALL"){
			show_desktop_notification($('span:eq(0)', message).attr('id'), $(message).find('#calling-contact-id').text(),
									  $(message).find('#call-notification-text').text(), $(message).find('#calling-contact-id').attr('href'),
									  $(message).find('#calling-contact-id').attr('href').split('/')[1] + '-' + "CALL");
			return;
		}
		if(notification_type=="UNKNOWN_CALL"){
			show_desktop_notification($('span:eq(0)', message).attr('id'), $(message).find("#unknown-contact-name").text(),$(message).find("#unknown-call-notification-text").text(),
										$(message).find("#unknown-contact-name").attr('href'),
										$(message).find("#unknown-contact-name").attr('href').split('/')[2]+'-'+"UNKNOWN_CALL");
			return;
		}
		if(notification_type=="CAMPAIGN_NOTIFY"){
			show_desktop_notification($('span:eq(0)', message).attr('id'), $(message).find('#campaign-contact-id').text(),
									  $(message).find('#campaign-notify-text').text(), $(message).find('#campaign-contact-id').attr('href'),
									  $(message).find('#campaign-contact-id').attr('href').split('/')[1] + '-' + "CAMPAIGN_NOTIFY");
			return;
		}
		
		
		show_desktop_notification(getImageUrl(message,notification_type), getNotificationType(notification_type), getTextMessage(message), getId(message), getId(message).split(
				'/')[1] + '-' + notification_type);
		return;
	}

	// Download the lib
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js', LIB_PATH + 'lib/noty/layouts/bottom.js',
			LIB_PATH + 'lib/noty/themes/default.js', function()
			{

			var n = noty({ text : message, layout : position, type : type, timeout : 30000, 
			
				closeCallback : 
					(onCloseCallback && typeof onCloseCallback == 'function') ? onCloseCallback : undefined,
				callback : {
					// If on close callback is defined, callback is called after noty is closed. Small hack; because noty close callback in lib is badly implemented 
					// and one callback gets called on other noty action
					onClose : function(){
						console.log(this);
						if(this.options.closeCallback && typeof this.options.closeCallback == 'function')
							{
								this.options.closeCallback ();
							}
					}
				}
			});
				
				console.log(n);

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
	
	if ($(message).find('#noty_text').text() != "")
	{
		name = $(message).find('#noty_text').text();
		return name;
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
	if(($(message).find('#noty_text').text() != "")){
		return $(message).find('#noty_text').text();
	}
	
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
 *            
 * @param {String}
 *            notification_type - notification-type like COMPANY_ADDED, DEAL_ADDED etc.
 */
function getImageUrl(message, notification_type)
{
	if(notification_type == "EVENT_REMINDER"){
		
		return '/img/eventreminder.png';
	}
	
	if ($(message).find('#notification-contact-id').text() != "")
		{
		
		// if contact is company fetch company url
		if(notification_type === 'COMPANY_ADDED' || notification_type === 'COMPANY_DELETED')
			return $('span:eq(1)', message).attr('id');
		
		return $('span:eq(0)', message).attr('id');
		}

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