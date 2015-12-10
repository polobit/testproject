/**
 * On i_new_call event of sip stack, New session is created and noty displyed.
 */
function newIncomingCall(e)
{
	// Session for call is already created.
	if (Sip_Session_Call != null)
	{
		//showNotyPopUp('information', "You are already in call.", "top", 5000);
		//alert("Already on call.");
		var newCall = e.newSession;
		newCall.setConfiguration(Config_Call);
		console.log(e);
		console.log(newCall);
		 
		showMissedNotyPopUp("warning", '<b>Missed call : </b><br>' + (newCall.getRemoteFriendlyName() || 'unknown')+' '+ removeBracesFromNumber(newCall.getRemoteUri()), "bottomRight");
		
		// do not accept the incoming call if we're already 'in call'
		e.newSession.hangup(); // comment this line for multi-line support
	}
	else
	{
		// Create new session for call.
		Sip_Session_Call = e.newSession;

		// start listening for events and set properties.
		Sip_Session_Call.setConfiguration(Config_Call);

		// Assign display name and number for noty.
		var sRemoteName = (Sip_Session_Call.getRemoteFriendlyName() || 'unknown');
		User_Name = sRemoteName;
		User_Number = removeBracesFromNumber(Sip_Session_Call.getRemoteUri());

		// Show noty
		showIncomingCall();
	}
}

// show details in noty popup for incoming call.
function showIncomingCall()
{
	// return if call under notification prefs is disabled
	if(notification_prefs && notification_prefs["call"] === false)
		return;
	
	showCallNotyPopup("incoming", "confirm", SIP_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Incoming call </b>'+ User_Number + '<br><a href="#'+Contact_Link+'" style="color: inherit;">' + User_Name +  '</a><br></span><div class="clearfix"></div>', false);

	// Incoming call sound play.
	startRingTone("ringtone");

	// notification display permission already asked when we registered	
	show_desktop_notification("../img/plugins/sipIcon.png", "Incoming Call :", User_Name + " " + User_Number, undefined, "SipCall");
	
	// Find contact for incoming call and update display.
	findContact();
}
