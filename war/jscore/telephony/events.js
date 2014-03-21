/* SIP event listeners */

/**
 * Callback function for SIP Stack or Events Listener for sip stack
 */
function sipStackEventsListener(e /* SIPml.Stack.Event */)
{	
	console.log(e.type);
	console.log(e.description);

	tsk_utils_log_info('==agile stack event = ' + e.type);

	switch (e.type) {
	case 'started':
	{
		// Register on sip.
		sipLogin();
		break;
	}
	case 'failed_to_start':
	{
		showCallNotyPopup("disconnected", 'error', "SIP: There was an error registering your account. Please modify and try again.", false);
	}
	case 'failed_to_stop':
	case 'stopping':
	case 'stopped':
	{
		// Empty all data.
		Sip_Start = false;
		Sip_Stack = null;
		Sip_Register_Session = null;
		Sip_Session_Call = null;
		User_Name = null;
		User_Number = null;
		User_Img = null;

		// Stop sound.		
		stopRingTone();

		break;
	}
	case 'i_new_call':
	{
		// Incoming call.
		newIncomingCall(e);
		break;
	}
	case 'starting':
	{		
		break;
	}
	case 'm_permission_requested':
	{
		break;
	}
	case 'm_permission_accepted':
	{
		break;
	}
	case 'm_permission_refused':
	{
		// Stop sound.		
		stopRingTone();

		// Display
		showCallNotyPopup("mediaDeny", 'warning', "SIP: Media stream permission denied.", false);

		// SIP hangup call.
		hangupCall();
		break;
	}
	default:
	{
		console.log("In sipStack event Listner. " + e.type);
		break;
	}
	}
};

/**
 * Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
 */
function sipSessionEventsListener(e /* SIPml.Session.Event */)
{	
	console.log(e.type);
	console.log(e.description);

	tsk_utils_log_info('==agile session event = ' + e.type);

	switch (e.type) {
	case 'connecting':
	{
		break;
	}
	case 'sent_request':
	{
		break;
	}
	case 'connected':
	{
		if (e.session == Sip_Register_Session)
		{
			// Play sound on sip register.
			play_sound();

			// Display.
			showCallNotyPopup("register", 'information', "SIP: You are now registered to make and receive calls successfully.", 5000);

			// call action and telephone icon, Make visible.
			$(".contact-make-call").show();
			$(".make-call").show();

			// enable notifications if not already done
			if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0)
			{
				window.webkitNotifications.requestPermission();
			}
		}
		else if (e.session == Sip_Session_Call)
		{
			// Call received.
			stopRingTone();

			// Display.
			showCallNotyPopup("connected", "success", "<b>On call : </b><br>" + User_Name + "   " + User_Number + "<br>", false);

			// Close html5 notification.
			if (Notify_Call)
			{
				Notify_Call.cancel();
				Notify_Call = null;
			}
		}
		break;
	} // 'connecting' | 'connected'
	case 'terminating':
	case 'terminated':
	{
		if (e.session == Sip_Register_Session)
		{
			// Session terminated.
			Sip_Start = false;
			Sip_Session_Call = null;
			Sip_Register_Session = null;
			User_Name = null;
			User_Number = null;
			User_Img = null;

			if (Sip_Updated == true && e.description == "Disconnecting...")
			{
				Sip_Updated = false;
				showCallNotyPopup("disconnected", 'warning', "SIP : Terminated for modifications. Registering again...", 5000);
			}
			else if (No_Internet == true && e.description == "Disconnecting...")
			{
				No_Internet = false;
				showCallNotyPopup("disconnected", 'error', "SIP : Terminated because no internet connectivity.", 5000);
			}
			else
				showCallNotyPopup("disconnected", 'error', "SIP : Terminated because " + e.description, 5000);
		}
		else if (e.session == Sip_Session_Call)
		{
			// call terminated.
			stopRingTone();

			// Show state of call.
			if (e.description == "Request Cancelled")
				showCallNotyPopup("missedCall", "error", "<b>Missed call : </b><br>" + User_Name + "   " + User_Number + "<br>", false);
			else if (e.description == "PSTN calls are forbidden")
				showCallNotyPopup("forbidden", "error", "SIP: PSTN calls are forbidden.", false);
			else if (e.description == "Not acceptable here")
				showCallNotyPopup("noresponce", "error", "SIP: Not acceptable here.", false);
			else if (e.description == "Media stream permission denied")
				showCallNotyPopup("permissiondenied", "error", "SIP: Media stream permission denied.");
			else if (e.description == "Call terminated")
				showCallNotyPopup("hangup", "information", "<b>Call ended with : <b><br>" + User_Name + "   " + User_Number + "<br>", false);
			else if (e.description == "Decline")
				showCallNotyPopup("decline", "error", "Call Decline.", false);
			else if (e.description == "Request Timeout")
				showCallNotyPopup("requestTimeout", "error", "SIP: Request Timeout.", false);
			else if (e.description == "Hackers Forbidden")
				showCallNotyPopup("hackersForbidden", "error", "SIP: Hackers Forbidden.", false);
			else if (e.description == "User not found")
				showCallNotyPopup("userNotFound", "error", "SIP: User not found.", false);
			

			// Call terminated.
			Sip_Session_Call = null;
			User_Name = null;
			User_Number = null;
			User_Img = null;

			// Close html5 notification.
			if (Notify_Call)
			{
				Notify_Call.cancel();
				Notify_Call = null;
			}
		}
		break;
	} // 'terminating' | 'terminated'
	case 'i_ao_request':
	{
		if (e.session == Sip_Session_Call)
		{
			var iSipResponseCode = e.getSipResponseCode();
			if (iSipResponseCode == 180 || iSipResponseCode == 183)
			{
				// On outgoing call.
				startRingTone("ringbacktone");
				console.log("Remote ringing....");
			}
		}

		break;
	}
	case 'media_added':
	{
		break;
	}
	case 'media_removed':
	{
		break;
	}
	case 'i_request':
	{
		break;
	}
	case 'o_request':
	{
		break;
	}
	case 'cancelled_request':
	{
		break;
	}
	case 'sent_request':
	{
		break;
	}
	case 'transport_error':
	{
		break;
	}
	case 'global_error':
	{
		break;
	}
	case 'message_error':
	{
		break;
	}
	case 'webrtc_error':
	{
		break;
	}

	case 'm_early_media':
	{
		// Call refused.
		stopRingTone();
		break;
	}
	case 'm_stream_audio_local_added':
	{
		break;
	}
	case 'm_stream_audio_local_removed':
	{
		break;
	}
	case 'm_stream_audio_remote_added':
	{
		break;
	}
	case 'm_stream_audio_remote_removed':
	{
		break;
	}
	case 'i_info':
	{
		break;
	}
	default:
	{
		console.log("Sip Session event Listner. " + e.type);
		break;
	}
	}
}
