/**
 * HTML5 notification for telephony only.
 */
function notifyMe()
{
	// Get system notification object.
	var Notification = window.Notification || window.mozNotification || window.webkitNotification;

	console.log(Notification.permission);

	// Let's check if the browser supports notifications
	if (!("Notification" in window))
	{
		alert("This browser does not support desktop notification");
	}

	// Let's check if the user is okay to get some notification
	else if (Notification.permission == "granted")
	{
		// If it's okay let's create a notification
		Notifi_Call = new Notification("Incoming Call :", { body : User_Name + "   " + User_Number, tag : "SipCall", icon : '/img/plugins/sipIcon.png' });
	}

	// Otherwise, we need to ask the user for permission
	// Note, Chrome does not implement the permission static property
	// So we have to check for NOT 'denied' instead of 'default'
	else if (Notification.permission != 'denied')
	{
		Notification.requestPermission(function(permission)
		{

			// Whatever the user answers, we make sure we store the information
			if (!('permission' in Notification))
			{
				Notification.permission = permission;
			}

			// If the user is okay, let's create a notification
			if (permission == "granted")
			{
				Notifi_Call = new Notification("Incoming Call :",
						{ body : User_Name + "   " + User_Number, tag : "SipCall", icon : '/img/plugins/sipIcon.png' });
			}
		});
	}

	// At last, if the user already denied any notification, and you
	// want to be respectful there is no need to bother him any more.
}

/**
 * Telephony noty functions.
 */

/**
 * Show noty popup at bottom right.
 * 
 * @param state :
 *            Event happen with SIP
 * @param type :
 *            noty type like error, default, information, warning, etc.
 * @param message :
 *            text to display eg. callee details, etc.
 * @param duration :
 *            false or sec.
 */
function showCallNotyPopup(state, type, message, duration)
{
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
			LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
			{
				if (state == "incoming") // confirm
					incomingCallNoty(message);
				else if (state == "connected") // success
					connectedCallNoty(message);
				else if (state == "outgoing") // confirm
					outgoingCallNoty(message);
				else
					showCallNoty(type, message, duration); // as per
				// requirement
			});
}

/**
 * Default noty without buttons.
 * 
 * @param type
 * @param message
 * @param duration
 */
function showCallNoty(type, message, duration)
{
	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : type, layout : "bottomRight", timeout : duration,
	// delay for closing event. Set false for sticky notifications
	});
}

/**
 * Incoming call noty with buttons : Answer and Ignore
 * 
 * @param message
 */
function incomingCallNoty(message)
{
	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomRight", buttons : [
			{ addClass : 'btn btn-primary answer', text : 'Answer' }, { addClass : 'btn btn-danger ignore', text : 'Ignore' }
	] });
}

/**
 * Connected noty displayed, After received call from callee or user with
 * Dialpad and Hangup buttons.
 * 
 * @param message
 */
function connectedCallNoty(message)
{
	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "success", layout : "bottomRight", buttons : [
			{ addClass : 'btn btn-primary dialpad', text : 'Dialpad' }, { addClass : 'btn btn-danger hangup', text : 'Hangup' }
	] });
}

/**
 * On Outgoing call, noty with cancel button shows.
 * 
 * @param message
 */
function outgoingCallNoty(message)
{
	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomRight", buttons : [
		{ addClass : 'btn btn-danger hangup', text : 'Cancel' }
	] });
}
