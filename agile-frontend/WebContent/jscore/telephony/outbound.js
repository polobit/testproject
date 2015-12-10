/**
 * Makes a call (SIP INVITE). Outgoing call.
 * 
 * @param phoneNumber
 * @returns {Boolean}
 */
function makeCall(phoneNumber)
{
	// Check Stack is available, Session is empty and phone number is available.
	if (Sip_Stack && !Sip_Session_Call && !tsk_string_is_null_or_empty(phoneNumber))
	{
		// create call session
		Sip_Session_Call = Sip_Stack.newSession('call-audio', Config_Call);

		// make call
		if (Sip_Session_Call.call(phoneNumber) != 0)
		{
			// If failed.
			Sip_Session_Call = null;
			showCallNotyPopup("failed", "error", "Failed to make call.", false);

			return false;
		}
		return true;
	}
	else if (Sip_Stack != null && Sip_Session_Call != null)
	{
		//showNotyPopUp('information', "You are already in call.", "top", 5000);
		alert("Already on call.");
		return false;
	}
	else if (!Sip_Stack)
	{
		showNotyPopUp('information', "You are not register with SIP server, Please refresh the page.", "top", 5000);
		return false;
	}
}

/**
 * terminates the call (SIP BYE or CANCEL)
 */
function hangupCall()
{
	// Call session not null.
	if (Sip_Session_Call != null)
	{
		// stop ringtone.
		stopRingTone();
		
		//console.log("Terminating the call...");
		
		// Hangup call
		Sip_Session_Call.hangup({ events_listener : { events : '*', listener : sipSessionEventsListener } });
	}

	// Close notification.
	if (Notify_Call)
	{
		Notify_Call.cancel();
		Notify_Call = null;
	}
}
