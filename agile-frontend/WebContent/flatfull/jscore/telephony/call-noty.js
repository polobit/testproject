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
			{ addClass : 'btn btn-sm btn-primary answer', text : 'Answer' }, { addClass : 'btn btn-danger ignore', text : 'Ignore' }
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
				{ addClass : 'btn btn-sm btn-default noty_twilio_mute', text : '<i class="icon-microphone"></i>' },
				{ addClass : 'btn btn-sm btn-default noty_twilio_unmute', text : '<i class="icon-microphone-off"></i>' },
				{ addClass : 'btn btn-sm btn-default noty_twilio_dialpad', text : '<i class="icon-th"></i>' }, 
				{ addClass : 'btn btn-sm btn-danger noty_twilio_hangup', text : 'Hangup' }
		] });
		
		if(TWILIO_DIRECTION == "outbound-dial") {

			accessUrlUsingAjax("core/api/voicemails", function(resp){

					var responseJson = resp;
					getTemplate("twilioio-voicemail",responseJson, undefined, function(template_ui){
						if(!template_ui)
							  return;
							
						$('.noty_buttons').prepend($(template_ui));

						// Add dialpad template in twilio content
						$('.noty_buttons').prepend(getTemplate("twilioio-dialpad"));

					}, null);
			});
		
		} else {

			// Add dialpad template in twilio content
			getTemplate("twilioio-dialpad", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('.noty_buttons').prepend($(template_ui));	
			}, null);
		}
		
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
			{ addClass : 'btn btn-default btn-sm noty_twilio_cancel', text : 'Cancel' }
		] });

		return;
	}

	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomLeft", buttons : [
		{ addClass : 'btn btn-default btn-sm hangup', text : 'Cancel' }
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

// added by prakash for bria call notification
function showBriaCallNoty(message){
	
			if(globalCall.lastReceived == message.state){
				console.log("duplicate message recived");
				return;
			}

					
					globalCall.lastReceived =  message.state;
		_getMessageBria(message, function(data) {
			
			var messageHtml = data;
			
			
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
					LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
					{

				
				if (Bria_Call_Noty != undefined)
					Bria_Call_Noty.close();
				
				if(message.state == "ringing"){

					Bria_Call_Noty = noty({ text : messageHtml, type : "confirm", layout : "bottomLeft", buttons : [
			{ addClass : 'btn btn-primary noty_bria_answer', text : 'Answer'}, 
			{ addClass : 'btn btn-danger noty_bria_ignore', text : 'Ignore'}] });
					
					if (notification_prefs.notification_sound != 'no_sound')
						play_sound(notification_prefs.notification_sound);
					
				}else if(message.state == "connected"){
					
					Bria_Call_Noty = noty({ text : messageHtml, type : "success", layout : "bottomLeft", buttons : [
		    { addClass : 'btn btn-sm btn-default noty_bria_mute', text : '<i class="fa fa-microphone"></i>' },
		    { addClass : 'btn btn-sm btn-default noty_bria_unmute none', text : '<i class="fa fa-microphone-slash"></i>' },
		    { addClass : 'btn btn-sm btn-default noty_bria_dialpad', text : '<i class="icon-th text-base" style="vertical-align: middle;"></i>' }, 
					{ addClass : 'btn btn-sm btn-danger noty_bria_hangup', text : 'Hangup'}
								] });
					
					var dialpad = $(getTemplate("briaDialpad"));
					//$('.noty_buttons').prepend(dialpad);
					$('#noty_bottomLeft_layout_container').prepend(dialpad);
					
					
				}else if(message.state == "missedCall"){
					
					Bria_Call_Noty = noty({ text : messageHtml, type : "information", layout : "bottomLeft"});
				
					if (notification_prefs.notification_sound != 'no_sound')
						play_sound(notification_prefs.notification_sound);
				}else if(message.state == "connecting"){
					
					Bria_Call_Noty = noty({ text : messageHtml, type : "success", layout : "bottomLeft", buttons : [
		           { addClass : 'btn btn-danger btn-sm noty_bria_cancel', text : 'Cancel'}
					] });
					
					if (notification_prefs.notification_sound != 'no_sound')
						play_sound(notification_prefs.notification_sound);
				
				}else if(message.state == "failed"){
					
					Bria_Call_Noty = noty({ text : messageHtml, type : "error", layout : "bottomLeft"});
					
				}else if(message.state == "ended"){
					
					
				}
				
					});
		
		
		});


}


//added by prakash for skype call notification
function showSkypeCallNoty(message){

		_getMessageSkype(message, function(data) {
			
			var messageHtml = data;
			
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
					LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
					{

				
				if (Skype_Call_Noty != undefined)
					Skype_Call_Noty.close();
				
				if(message.state == "ringing"){

					Skype_Call_Noty = noty({ text : messageHtml, type : "confirm", layout : "bottomLeft", buttons : [
			{ addClass : 'btn btn-primary noty_skype_answer', text : 'Answer'}, 
			{ addClass : 'btn btn-danger noty_skype_ignore', text : 'Ignore'}] });
					
					if (notification_prefs.notification_sound != 'no_sound')
						play_sound(notification_prefs.notification_sound);
					
				}else if(message.state == "connected"){
					
					Skype_Call_Noty = noty({ text : messageHtml, type : "success", layout : "bottomLeft", buttons : [
		    { addClass : 'btn btn-sm btn-default noty_skype_mute', text : '<i class="fa fa-microphone"></i>' },
		    { addClass : 'btn btn-sm btn-default noty_skype_unmute none', text : '<i class="fa fa-microphone-slash"></i>' },
		    { addClass : 'btn btn-sm btn-default noty_skype_dialpad', text : '<i class="icon-th text-base" style="vertical-align: middle;"></i>' }, 
			{ addClass : 'btn btn-sm btn-danger noty_skype_hangup', text : 'Hangup'}
								] });
					
					var dialpad = $(getTemplate("skypeDialpad"));
					$('#noty_bottomLeft_layout_container').prepend(dialpad);
					
					
				}else if(message.state == "missedCall"){
					
					Skype_Call_Noty = noty({ text : messageHtml, type : "information", layout : "bottomLeft", timeout : 3000});
				
					if (notification_prefs.notification_sound != 'no_sound')
						play_sound(notification_prefs.notification_sound);
				}else if(message.state == "connecting"){
								
					Skype_Call_Noty = noty({ text : messageHtml, type : "success", layout : "bottomLeft", buttons : [
		           { addClass : 'btn btn-danger btn-sm noty_skype_cancel', text : 'Cancel'}
					] });
					
					if (notification_prefs.notification_sound != 'no_sound')
						play_sound(notification_prefs.notification_sound);
				
				}else if(message.state == "refused"){	
					
					Skype_Call_Noty = noty({ text : messageHtml, type : "information", layout : "bottomLeft", timeout : 3000});
			
					
				}else if(message.state == "failed"){
					
					Skype_Call_Noty = noty({ text : messageHtml, type : "error", layout : "bottomLeft", timeout : 3000});
					
				}else if(message.state == "ended"){
					

					
				}
				
					});
		
		
		});



}