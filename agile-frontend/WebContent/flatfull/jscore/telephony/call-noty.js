
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

function showTaskNotyMessage(message,type,position,timeout){
 head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
   LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
  {
  if(!timeout){
   noty({ text : message, type : type, layout : position});
   return;
  }
   noty({ text : message, type : type, layout : position, timeout : timeout});
  
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
				{ addClass : 'btn btn-primary noty_twilio_answer', text : '{{agile_lng_translate "calls" "answer"}}' }, { addClass : 'btn btn-danger noty_twilio_ignore', text : '{{agile_lng_translate "contacts-view" "ignore"}}' }
		] });

		return;
	}

	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomLeft", buttons : [
			{ addClass : 'btn btn-sm btn-primary answer', text : 'Answer' }, { addClass : 'btn btn-danger ignore', text : '{{agile_lng_translate "contacts-view" "ignore"}}' }
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
				{ addClass : 'btn btn-sm btn-danger noty_twilio_hangup', text : '{{agile_lng_translate "calls" "hangup"}}' }
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
			{ addClass : 'btn dialpad noty_sip_dialpad', text : '<i class="icon-th"></i>' }, { addClass : 'btn btn-danger hangup', text : '{{agile_lng_translate "calls" "hangup"}}' }
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
			{ addClass : 'btn btn-default btn-sm noty_twilio_cancel', text : '{{agile_lng_translate "contacts-view" "cancel"}}' }
		] });

		return;
	}

	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomLeft", buttons : [
		{ addClass : 'btn btn-default btn-sm hangup', text : '{{agile_lng_translate "contacts-view" "cancel"}}' }
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


function ShowWidgetCallNoty(message){
	var state = message.state;
	var number = message.number;
	var callId = message.callId;
	var displayName = message.displayName;
	var widgetype = (message.callType).toLowerCase();

	

	
	console.log("calling call noty");
	
if(message.state == "connected"){
	
	var btns = [];
	if(widgetype !=  "skype" && widgetype !=  "asterisk"){
		btns.push({"id":"", "class":"btn btn-sm btn-default p-8 noty_"+widgetype+"_mute icon-microphone","title":""});
		btns.push({"id":"", "class":"btn btn-sm btn-default p-8 noty_"+widgetype+"_unmute icon-microphone-off none","title":""});
	}
	btns.push({"id":"", "class":"btn btn-sm btn-default noty_"+widgetype+"_dialpad icon-th","title":""});
	btns.push({"id":"", "class":"btn btn-sm btn-danger noty_"+widgetype+"_hangup","title":'{{agile_lng_translate "calls" "hangup"}}'});
	var json = {"callId": callId};
	showDraggableNoty(widgetype, globalCall.contactedContact, "connected", globalCall.callNumber, btns,json);
	
}else if(message.state == "ringing"){
	
	searchForContactImg(number, function(currentContact){
		if(!currentContact){
			globalCall.contactedContact = {};
			globalCall.contactedId = "";
		}else{
			globalCall.contactedContact = currentContact;
			globalCall.contactedId = currentContact.id;
		}

		var btns= [];
		if(widgetype !=  "asterisk"){
			btns = [{"id":"", "class":"btn btn-primary noty_"+widgetype+"_answer","title":"Answer"},{"id":"","class":"btn btn-danger noty_"+widgetype+"_ignore","title":'{{agile_lng_translate "contacts-view" "ignore"}}'}];
		}
		
		var json = {"callId": callId};
		showDraggableNoty(widgetype, globalCall.contactedContact, "incoming", globalCall.callNumber, btns,json);
	});
}else if(message.state == "missed"){
	var btns = [];
	showDraggableNoty(widgetype, globalCall.contactedContact , "missedCall", globalCall.callNumber, btns);
	
}else if(message.state == "connecting"){
	
	var btns= [];
		if(widgetype !=  "asterisk"){
			btns = [{"id":"", "class":"btn btn-default btn-sm noty_"+widgetype+"_cancel","title":'{{agile_lng_translate "contacts-view" "cancel"}}'}];
		}
	var json = {"callId": callId};
	showDraggableNoty(widgetype, globalCall.contactedContact , "outgoing", globalCall.callNumber, btns, json);
	
}else if(message.state == "failed"){
	
	var btns = [];
	showDraggableNoty(widgetype, globalCall.contactedContact , "failed", globalCall.callNumber, btns);
	
}else if(message.state == "busy"){
	
	var btns = [];
	showDraggableNoty(widgetype, globalCall.contactedContact , "busy", globalCall.callNumber, btns);
	
}else if(message.state == "ended" ||message.state == "refused" || message.state == "missed"){
	closeCallNoty(true);
}
	
	
}


// added by prakash for bria call notification
function showBriaCallNoty(message){
	

	
	var state = message.state;
	var number = message.number;
	var callId = message.callId;
	var displayName = message.displayName;
	
		if(!globalCall.lastReceived){
		}else{
			if(globalCall.lastReceived == message.state){
				console.log("duplicate message recived");
				return;
			}
		}
		globalCall.lastReceived =  message.state;

		if(message.state == "ringing"){
				if(checkForActiveCall()){
					sendCommandToClient("busy","Bria");
					return;
				}
		}else if(!globalCall.contactedContact){
				console.log("contact or id not found to make popup..");
				return;
		}
		if(globalCall.callDirection && globalCall.callDirection == "Incoming"){
			if(!globalCallForActivity.answeredByTab){
				closeCallNoty(true);
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
				return;
			}
		}

		_getMessageBria(message);
		ShowWidgetCallNoty(message);
		return;
			
			// write new noty code here ...

}


//added by prakash for skype call notification
function showSkypeCallNoty(message){

		if(message.state == "ringing"){
			if(checkForActiveCall()){
				sendCommandToClient("busy","Skype");
				return;
			}
		}else if(!globalCall.contactedContact){
			console.log("contact or id not found to make popup..");
			return;
		}
		
		if(globalCall.callDirection && globalCall.callDirection == "Incoming"){
			if(!globalCallForActivity.answeredByTab){
				closeCallNoty(true);
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
				return;
			}
		}
		_getMessageSkype(message);
		ShowWidgetCallNoty(message);
		return;
		
}


	
			
// added by prakash for asterisk call notification
function showAsteriskCallNoty(message){

	var state = message.state;
	var number = message.number;
	var callId = message.callId;
	var displayName = message.displayName;
	
		if(!globalCall.lastReceived){
		}else{
			if(globalCall.lastReceived == message.state){
				if(globalCall.callId == callId){
					console.log("duplicate message recived");
					return;
				}
			}
		}
		globalCall.lastReceived =  message.state;

		if(message.state == "ringing"){
				if(checkForActiveCall()){
					sendCommandToClient("busy","Bria");
					return;
				}
		}else if(!globalCall.contactedContact){
			 accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    		if(!responseJson){
	    			globalCall.contactedContact = {};
	    			globalCall.contactedId = "";
	    		}else{
	    			globalCall.contactedContact = responseJson;
	    			globalCall.contactedId = responseJson.id;
	    		}
	    		
	    		_getMessageAsterisk(message);
				ShowWidgetCallNoty(message);
					return;

			});	
				console.log("contact or id not found to make popup..");
				return;
		
		}

		_getMessageAsterisk(message);
		ShowWidgetCallNoty(message);
		return;


}



function showCallNotyMessage(message,type,position,timeout){
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
			LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
		{
			noty({ text : message, type : "error", layout : "bottomRight", timeout : 3000});
		});
}


function showDraggableNoty(widgetName, contact, status, number, btns, json){
	var w = widgetName;
	//var c = contact;
	var c = {};
	$.extend(c,contact);
	var s = status;
	var n = number;
	var arr = btns;
	if(!c){
		c = {};
	}
	if(json){
		c['callId'] = json.callId;
	}
	var txt = makeDraggableMessage(s);
	c['phone'] = n;
	var msg = {};
	msg['buttons'] = arr;
	c.msg = msg;
	showDraggablePopup(c);
	$("#noty_text_msg").html(txt);
	if(s == "connected"){
		if(widgetName == "Twilioio"){
			makeDraggableVoicemail();
			makeDraggableDialpad("twilioio-dialpad",{},$('.noty_buttons'));
		}else if(widgetName == "bria" || widgetName == "skype" || widgetName == "asterisk"){
			makeDraggableDialpad("bria-widgetdialpad",{},$('.noty_buttons'));
		}
		if(containsOption(default_call_option.callOption, "name", "CallScript") != -1 && !jQuery.isEmptyObject(contact)){
			$("#draggable_noty #call-noty-l2").find(".internal-col").prepend("<div id='' class='noty_call_callScript btn btn-sm btn-default p-xs'>CS</div>");
			$(".noty_call_callScript","#draggable_noty").data("contact",contact);
		}
		
	}else if(s == "dialing"){
		$("#draggable_noty .draggable_noty_notes").html("");
		
	}else if(s == "connecting" || s == "outgoing" || s == "ringing" || s == "incoming"){
		$("#draggable_noty .draggable_noty_notes").html($(getTemplate("call-noty-notes")));	
		if(containsOption(default_call_option.callOption, "name", "CallScript") != -1 && !jQuery.isEmptyObject(contact)){
			$("#draggable_noty #call-noty-l2").find(".internal-col").prepend("<div id='' class='noty_call_callScript btn btn-sm btn-default p-xs'>CS</div>");
			$(".noty_call_callScript","#draggable_noty").data("contact",contact);
		}
	}
	
	if(s == "missedCall" || s == "missed" || s == "busy" || s == "failed"){
		$("#draggable_noty").show().delay(5000).hide(1);
	}
}


function showDraggablePopup(param){
	
	var position = _agile_get_prefs("dragableNotyPosition");
	var flag = false;
	var y = $(window).height()-200;
	//var x = ($(window).width())-520;
	var x = 200;
	if(position){
		var a = position.split("-");
		x = a[0]*1;
		y = a[1]*1;
	}
	var popup = $(getTemplate("call-noty",param));
	$("#draggable_noty .draggable_noty_info").html(popup);
	$("#draggable_noty").css({'left':x,'top': y});
	$("#draggable_noty").show();
	$("#draggable_noty").draggableTouch();
	

	$("#draggable_noty").bind("dragstart", function(e, pos) {
	 flag = true;
		//you can do anything related to move
    }).bind("dragend", function(e, pos) {
    	if(flag){
    		flag = false;
            var position = _agile_get_prefs("dragableNotyPosition");
  		  var maxWidth = ($(window).width())-190;
  		  var maxHeight = $(window).height()-100;
  		  var popup_position_top = $(this).css('top').split("px")[0];
  		  var popup_position_left = $(this).css('left').split("px")[0];
  		  if(popup_position_left < 50 || popup_position_left > maxWidth || popup_position_top < 50 || popup_position_top > maxHeight){
  				//var y = $(window).height()-300;
  				var y = $(window).height()-200;
  				//var x = ($(window).width())-520;;
  				var x = 200;
  				if(position){
  					var a = position.split("-");
  					x = a[0]*1;
  					y = a[1]*1;
  				}
  				
  			  if( popup_position_top > maxHeight){
  				$("#draggable_noty").animate({ top: y, left:x }, 500);
  			  }
  			  return;
  		  }else{
  			  _agile_set_prefs("dragableNotyPosition", popup_position_left+"-"+popup_position_top);
  		  }
    	}
    });
	
}

function makeDraggableMessage(status){
	
	if(status == "connecting" || status == "outgoing" ){
		return "Calling";
	}else if(status == "ringing" || status == "incoming"){
		return "Incoming call";
	}else if(status == "connected"){
		return "On call";
	}else if(status == "missedCall" || status == "missed"){
		return "Missed call";
	}else if(status == "failed"){
		return "Call Failed";
	}else if(status == "busy"){
		return "Call Busy";
	}else if(status == "dialing"){
		return "Dialing <img src='/img/ajax-loader-cursor.gif' width='15px' height='5px'  style='margin-left:8px;margin-right:-3px;'></img>";
	}else{
		return "";
	}
}

function makeDraggableDialpad(templateName, param, ele){
	
	// Add dialpad template in twilio content
	getTemplate(templateName, param, undefined, function(template_ui){
		if(!template_ui)
			  return;
		ele.prepend($(template_ui));	
	}, null);
	
}

function makeDraggableVoicemail(widgetName){
	
	accessUrlUsingAjax("core/api/voicemails", function(resp){

			$('#call-noty-l1').html($(getTemplate("twilioio-voicemail",resp)));

	});
	
}



