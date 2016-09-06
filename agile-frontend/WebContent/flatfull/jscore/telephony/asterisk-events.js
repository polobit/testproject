/**
 * This page contains all the click or other events related to Bria calling
 * 
 *@author Prakash 
 */
 var Asterisk_Call_Noty;
 var asterisk_widget;
 //callDirection : Incoming, Outgoing
 //callStatus :Ideal, Incoming,Missed,  Connecting,Connected,  Ended,Failed

 var displayName="";
 
$(function()
{
	
	/*$('body').on('click', '.Asterisk_call', function(e)
	{
	  	e.preventDefault();
		var command = "startCall";
		var number =  $(this).closest(".contact-make-call").attr("phone");
		var callId = "";
		
		
		try{
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
				if (!asterisk_widget){
					console.log("widget is not ready");
					return;
				}

				if(typeof(asterisk_widget.prefs) == "string"){
					asterisk_widget.prefs = eval("(" + asterisk_widget.prefs + ")");
				}	

				
				var manager_details = {};
				manager_details["id"] = asterisk_widget.prefs.manager_id;
				manager_details["password"] = asterisk_widget.prefs.manager_password;
				manager_details["hostname"] = asterisk_widget.prefs.asterisk_hostname;
				var asterisk_details = {};
				asterisk_details["channel"] = asterisk_widget.prefs.asterisk_call_channel;
				asterisk_details["context"] = asterisk_widget.prefs.asterisk_call_context;
				asterisk_details["extension"] = asterisk_widget.prefs.asterisk_call_extension;
				asterisk_details["callerId"] = asterisk_widget.prefs.asterisk_call_callerId
				//asterisk_details["variables"] = asterisk_widget.prefs.asterisk_call_variables;
				asterisk_details["timeout"] = asterisk_widget.prefs.asterisk_call_timeout;
				asterisk_details["priority"] = asterisk_widget.prefs.asterisk_call_priority;
				var asterisk_details_long = {};
				asterisk_details_long["variables"] = asterisk_widget.prefs.asterisk_call_variables;



		}catch(e){
		}


		globalCall.callStatus = "dialing";
		globalCall.calledFrom = "asterisk";
		sendMessageToAsteriskClient(command,number,callId,manager_details,asterisk_details,asterisk_details_long);
		setTimerToCheckDialing("Asterisk");
		globalCall.callDirection = "Outgoing";
		try{
			var contactDetailsObj = agile_crm_get_contact();
			globalCall.contactedId = contactDetailsObj.id;
		}catch (e) {
		}
	});
	*/
// }


/*//answer the callT
	$('body').on('click', '.noty_asterisk_answer', function(e)
		{
			e.preventDefault();
			var command = "answerCall";
			var number =  $("#asteriskCallId").text();
			var callId = $("#asteriskCallId").attr("value");
			
			sendMessageToAsteriskClient(command,number,callId);
	  });*/
	  


/*//hang up the call	
	$('body').on('click', '.noty_asterisk_hangup', function(e)
		{
		
		e.preventDefault();
		var command = "endCall";
		var number =  $("#asteriskCallId").text();
		var callId =  $("#asteriskCallId").attr("value");
		
		sendMessageToAsteriskClient(command,number,callId);

	});*/


/*//cancel the outgoing call	
	$('body').on('click', '.noty_asterisk_cancel, .noty_asterisk_ignore', function(e)
	{
		
		e.preventDefault();
		var command = "cancelCall";
		var number =  $("#asteriskCallId").text();
		var callId =  $("#asteriskCallId").attr("value");
		
		sendMessageToAsteriskClient(command,number,callId);
	});*/

	 $("body").on("click", ".asterisk-advance-settings", function(b) {
        b.preventDefault();
      
        $(".asterisk-advance-settings-hide").toggle();
        $(".asterisk-advance-settings-show").toggle();
        $("#asterisk-div-setting").toggle();
   });

/*
$('body').on('click', '.asterisk_get_logs', function(e)
	{
		
		e.preventDefault();
		var command = "getLogs";
		var number =  "";
		var callId =  "";
		
		sendMessageToAsteriskClient(command,number,callId);
	});*/

//mute the current call	
/*	$('body').on('click', '.noty_bria_mute', function(e)
	{
		
		e.preventDefault();
		var command = "mute";
		var number =  "";
		var callId =  $("#briaCallId").attr("value");
		
		$('.noty_buttons').find('.noty_bria_mute').toggle();
		$('.noty_buttons').find('.noty_bria_unmute').toggle();
		
		sendMessageToBriaClient(command,number,callId);
	});*/

//unmute the call	
/*	$('body').on('click', '.noty_bria_unmute', function(e)
	{
		
		e.preventDefault();
		var command = "unMute";
		var number =  "";
		var callId =  $("#briaCallId").attr("value");
		
		$('.noty_buttons').find('.noty_bria_unmute').toggle();
		$('.noty_buttons').find('.noty_bria_mute').toggle();
		sendMessageToBriaClient(command,number,callId);
	});*/


	
//show dialpad	 ---note implemented
/*	$('body').on('click', '.noty_bria_dialpad', function(e)
	{
	e.preventDefault();
	e.stopPropagation();
	$('#briaDialpad_btns').toggle();
	});*/


//this is to close the dialpad when clicked anywhere in screen
/*	$(document).on('click', function(e){
		if($('#briaDialpad_btns').length !=0){
			$('#briaDialpad_btns').hide();
		}
		
		
	});	*/
	
// this is used to prevent dialpad from closing 	
/*	$('body').on('click', '#briaDialpad_btns', function(e)	{
		e.stopPropagation();
	});*/
	
	

//	This function is to hide the information shown to the client when the user is not running bria client
	$('#callInfoModal').on('click', '#callModal_info_ok', function(e)	{
		e.preventDefault();
		$('#callInfoModal').modal('hide');
	});
	
	
// this function is to hide the already on call alert 	
	$('#callInfoModal').on('click', '#callModal_status_ok', function(e)	{
		e.preventDefault();
		$('#callInfoModal').modal('hide');
	});
	
	

	
});

//function for sending DTMF
/*function briaSendDTMF(digit)
{
	if(digit){
			play_sound("dtmf");
			var command = "sendDTMF";
			var number =  digit;
			var callId =  "";
			sendMessageToBriaClient(command,number,callId);
			return;
	}
}*/

/*// This function sends the command to local jar running in client side to make the call
//{paramerters} -- command to execute, number to call and call id of the ingoing call if any
function sendMessageToAsteriskClient(command, number, callid, manager, asterisk, long_details){
	var domain = CURRENT_DOMAIN_USER['domain'];
	var id = CURRENT_DOMAIN_USER['id'];
	
	if(command == "startCall"){
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
				LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
				{
			var msg = '<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Dialing<img src="/img/ajax-loader-cursor.gif" width="15px" height="5px"  style="margin-left:8px;margin-right:-3px;"></img> &nbsp;&nbsp;&nbsp;  </b>'+'<span id="asteriskCallId" class="text-xs" >' + number +'</span>'+'<br><br></span><div class="clearfix"></div>';
					Asterisk_Call_Noty = noty({ text : msg, type : "confirm", layout : "bottomLeft",
						callback: {
							onCloseClick: function() {
								sendMessageToAsteriskClient("endCurrentCall",number,"");
							},
						},
					});
				});
	}
	var image = new Image();
	image.onload = function(png) {
		console.log("Asterisk sucess");
		window.focus();
	};
	image.onerror= function(png) {
		console.log("Asterisk failure");
		if (Asterisk_Call_Noty != undefined)
			Asterisk_Call_Noty.close();

		resetglobalCallVariables();
		$('#callInfoModal').html(getTemplate("callInfoModal"));
		$('#callInfoModal').modal('show');
		$('#callModal_title').append("Asterisk");
		
	};
	
	if(command == "startCall"){
		image.src = "http://localhost:44444/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type=Asterisk;mName="+manager.id+";mPass="+manager.password+";ip=" +manager.hostname+";channel="+asterisk.channel+";context="+asterisk.context+";exten="+asterisk.extension+";callerId="+asterisk.callerId+";timeout="+long_details.timeout+";priority="+long_details.priority+";variables="+long_details.variables+"?";	
		
	}else{
		image.src = "http://localhost:44444/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type=Asterisk?";	
	}
	
}*/


/*
 * this wil create a dynamic message to show in noty - as per the current phhone status
 */
function _getMessageAsterisk(message, callback){
	var state = message.state;
	var number = message.number;
	var callId = message.callId;
	var displayName = message.displayName;
	var message="";

	try{
		var inValid = /^\s/;
		var k = inValid.test(number);
		if(k){
			number = "+" + number.trimLeft()
		}
	}catch(e){
	}
	console.log("state--" + state + " number --" + number + "   asteriskCallId" + callId + "  displayName" + displayName);
	
	if (state == "ringing"){
			globalCall.callDirection = "Incoming";
			globalCall.callStatus = "Ringing";
			globalCall.calledFrom = "Asterisk";
			globalCall.callId = callId;
			globalCall.callNumber = number;
			globalCallForActivity.justCalledId = callId;
				
	}else if(state == "connected"){
		if(!globalCall.callDirection){
			globalCall.callDirection = "Outgoing";

		} 
			globalCall.callStatus = "Connected";
			globalCall.callId = callId;
			globalCall.callNumber = number;
			globalCallForActivity.justCalledId = callId;
	
	}else if(state == "missed"){

		globalCall.callDirection = "Incoming";
		globalCall.callStatus = "Missed";
		globalCall.callId = callId;
		globalCall.callNumber = number;
		globalCallForActivity.justCalledId = callId;
		
	}else if(state == "connecting"){

		globalCall.callDirection = "Outgoing";
		globalCall.callStatus = "Connecting";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		globalCallForActivity.justCalledId = callId;
		
	}else if(state == "failed"){

		globalCall.callStatus = "Failed";
		globalCallForActivity.justCalledId = callId;
		globalCallForActivity.duration = 0;

		var call = { "direction" : globalCallForActivity.callDirection, "phone" : globalCallForActivity.callNumber,
				"status" : globalCallForActivity.callStatus, "duration" : globalCallForActivity.duration };
		saveCallNoteTelephony();
		saveCallActivityTelephony(call);

	}else if(state == "ended"){
		if(globalCall.lastReceived)	{
			if(globalCall.lastReceived == "lastCallDetail"){
				return;	
			}
		}
		if(globalCall.callStatus && globalCall.callStatus == "Connected"){
			globalCall.callStatus = "Answered"; //change form completed
		}else if(globalCall.callStatus && globalCall.callStatus == "Ringing"){
			globalCall.callStatus = "Missed";
		}
		if(!globalCall.callNumber){
			globalCall.callNumber = number;
		}
		replicateglobalCallVariable();
		resetglobalCallVariables();	
		globalCall.lastReceived = "ended";	
		
		//this is called to save the call activity of the user after the call
		if(!callId)
			callId = "";
/*				var action = {"command":  "getLastCallDetail", "number": number, "callId": callId};
		sendActionToClient(action);*/
		//sendMessageToBriaClient("getLastCallDetail",number,callId);
		
	}
	
}


function checkVariableFormat(str){
	//look got a=b or a=b|c=d
    var patt = /(^(\w+[=]\w+)$)|^((\w+=\w+)([|]\w+=\w+)*)$/;
    var result = patt.test(str);
    console.log(result);
}




