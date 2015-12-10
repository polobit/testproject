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
	// return if call under notification prefs is disabled
	if (state === "incoming" || state === "missedCall")
	{
		if (notification_prefs && notification_prefs["call"] === false)
			return;
	}

	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
			LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
			{
				if (state == "incoming") // confirm
					incomingCallNoty(message, type);
				else if (state == "connected") // success
					connectedCallNoty(message, type);
				else if (state == "outgoing") // confirm
					outgoingCallNoty(message, type);
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
	CALL = noty({ text : message, type : type, layout : "bottomLeft", timeout : duration,
	// delay for closing event. Set false for sticky notifications
	});
}

/**
 * Incoming call noty with buttons : Answer and Ignore
 * 
 * @param message
 */
function incomingCallNoty(message, type)
{
	if (type == "Twilio")
	{
		// Close noty
		if (Twilio_Call_Noty != undefined)
			Twilio_Call_Noty.close();

		// Set properties
		Twilio_Call_Noty = noty({ text : message, type : "confirm", layout : "bottomLeft", buttons : [
				{ addClass : 'btn btn-primary noty_twilio_answer', text : 'Answer' }, { addClass : 'btn btn-danger noty_twilio_ignore', text : 'Ignore' }
		] });

		return;
	}

	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomLeft", buttons : [
			{ addClass : 'btn btn-primary answer', text : 'Answer' }, { addClass : 'btn btn-danger ignore', text : 'Ignore' }
	] });
}

/**
 * Connected noty displayed, After received call from callee or user with
 * Dialpad and Hangup buttons.
 * 
 * @param message
 */
function connectedCallNoty(message, type)
{
	if (type == "Twilio")
	{
		// Close noty
		if (Twilio_Call_Noty != undefined)
			Twilio_Call_Noty.close();

		// Set properties
		Twilio_Call_Noty = noty({ text : message, type : "success", layout : "bottomLeft", buttons : [
				{ addClass : 'btn noty_twilio_mute', text : '<i class="icon-microphone"></i>' },{ addClass : 'btn noty_twilio_unmute', text : '<i class="icon-microphone-off"></i>' },
				{ addClass : 'btn noty_twilio_dialpad', text : '<i class="icon-th"></i>' }, { addClass : 'btn btn-danger noty_twilio_hangup', text : 'Hangup' }
		] });
		
		if(TWILIO_DIRECTION == "outbound-dial") {
		var responseJson = $.parseJSON(
		        $.ajax({
		        	url: "core/api/voicemails",
		            async: false,
		            dataType: 'json'
		        }).responseText
		    );
		
//		console.log("json resp : ");
//		console.log(responseJson);
//		console.log(JSON.stringify(responseJson));
		
		var voicemailHTML = $(getTemplate("twilioio-voicemail",responseJson), {});
		$('.noty_buttons').prepend(voicemailHTML);
		}
		
		// Add dialpad template in twilio content
		var dialpad = $(getTemplate("twilioio-dialpad"), {});
		$('.noty_buttons').prepend(dialpad);

		return;
	}

	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "success", layout : "bottomLeft", buttons : [
			{ addClass : 'btn dialpad noty_sip_dialpad', text : '<i class="icon-th"></i>' }, { addClass : 'btn btn-danger hangup', text : 'Hangup' }
	] });
}

/**
 * On Outgoing call, noty with cancel button shows.
 * 
 * @param message
 */
function outgoingCallNoty(message, type)
{
	if (type == "Twilio")
	{
		// Close noty
		if (Twilio_Call_Noty != undefined)
			Twilio_Call_Noty.close();

		// Set properties
		Twilio_Call_Noty = noty({ text : message, type : "confirm", layout : "bottomLeft", buttons : [
			{ addClass : 'btn btn-danger noty_twilio_cancel', text : 'Cancel' }
		] });

		return;
	}

	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomLeft", buttons : [
		{ addClass : 'btn btn-danger hangup', text : 'Cancel' }
	] });
}

function voiceMailDropAction() { 
//	alert("clicked");
	$( "div.noty_bar" ).parent().css( "overflow", "visible" );
}

function showMissedNotyPopUp(type, message,position,notyTimeout)
{
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH
			+ 'lib/noty/themes/default.js', function(){
	var n = noty({
		text : message,
		layout : position,
		type : type,
		animation : {
			open : {
				height : 'toggle'
			},
			close : {
				height : 'toggle'
			},
			easing : 'swing',
			speed : 500
			// opening & closing animation speed
		},
		timeout : notyTimeout == undefined ? notyTimeout : (notyTimeout == "none" ? undefined : 20000), // delay for closing event. Set false for sticky
						// notifications
				
	});
			});		
}