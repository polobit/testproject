// New session call for incoming call.
function newCall(e)
{	
	if (Sip_Session_Call != null)
	{
		showNotyPopUp('information', "You are already in call.", "top", 5000);

		// do not accept the incoming call if we're already 'in call'
		e.newSession.hangup(); // comment this line for multi-line support
	}
	else
	{
		Sip_Session_Call = e.newSession;

		// start listening for events
		Sip_Session_Call.setConfiguration(Config_Call);

		var sRemoteName = (Sip_Session_Call.getRemoteFriendlyName() || 'unknown');
		User_Name = sRemoteName;
		User_Number = Sip_Session_Call.getRemoteUri();

		// Show noty
		showIncomingCall();
	}
}

// show details in noty popup for incoming call.
function showIncomingCall()
{
	showCallNotyPopup("incoming", "confirm", '<i class="icon icon-phone"></i><b>Incoming call :</b><br> ' + User_Name + "   " + User_Number + "<br>", false);

	startRingTone();

	// if (window.webkitNotifications &&
	// window.webkitNotifications.checkPermission() == 0)
	// show_desktop_notification(imageURL, title, message, link, tag);
	// show_desktop_notification("/img/plugins/sipIcon.png", "Incoming Call :",
	// User_Name+" "+User_Number, undefined, "SipCall");

	// permission already asked when we registered
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0)
	{
		if (Notifi_Call)
		{
			Notifi_Call.cancel();
		}
		Notifi_Call = window.webkitNotifications.createNotification('/img/plugins/sipIcon.png', 'Incoming call :', User_Name + "   " + User_Number);
		Notifi_Call.onclose = function()
		{
			Notifi_Call = null;
		};
		Notifi_Call.show();
	}

	// notifyMe();

	// Find contact for incoming call and update display.
	findContact();
}
