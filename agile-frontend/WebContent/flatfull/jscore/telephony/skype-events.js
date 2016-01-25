 
var Skype_Call_Noty;
$(function()
{
	
	
// this function is used to make call frn skype
	$('body').on('click', '.Skype_call', function(e)
			{
			  	e.preventDefault();
				var command = "startCall";
				var number = $(this).closest(".contact-make-call-div").children().first().attr("phone");
				var callId = "";
				
				if(checkForActiveCall()){
					$('#skypeInfoModal').html(getTemplate("skypeCallStatusModal"));
					$('#skypeInfoModal').modal('show');
					return;
				}
				
				try{
					 $('#skypeCallId').parents("ul").last().remove();
						resetglobalCallVariables();
						resetglobalCallForActivityVariables();
				}catch(e){
				}
				
				globalCall.callStatus = "dialing";
				sendMessageToSkypeClient(command,number,callId);
				globalCall.calledFrom = "skype";
				setTimerToCheckDialing("skype");
				try{
					var contactDetailsObj = agile_crm_get_contact();
					globalCall.contactedId = contactDetailsObj.id;
				}catch (e) {
				}
			});
	
//	This function is to hide the information shown to the client when the user is not running skype client
	$('#skypeInfoModal').on('click', '#skype_info_ok', function(e)	{
		e.preventDefault();
		$('#skypeInfoModal').modal('hide');
	});
	
// this function is to hide the already on call alert 	
	$('#skypeInfoModal').on('click', '#skype_status_ok', function(e)	{
		e.preventDefault();
		$('#skypeInfoModal').modal('hide');
	});
	

//answer the callT
		$('body').on('click', '.noty_skype_answer', function(e)
			{
				e.preventDefault();
				var command = "answerCall";
				var number =  $("#skypeCallId").text();
				var callId = $("#skypeCallId").attr("value");
				
				sendMessageToSkypeClient(command,number,callId);
		  });
		  
//ignore the incoming call
		$('body').on('click', '.noty_skype_ignore', function(e)
			{
				e.preventDefault();
				var command = "ignoreCall";
				var number =  $("#skypeCallId").text();
				var callId =  $("#skypeCallId").attr("value");
				
				sendMessageToSkypeClient(command,number,callId);

		});
		
		

//cancel the outgoing call	
			$('body').on('click', '.noty_skype_cancel', function(e)
			{
				e.preventDefault();
				var command = "cancelCall";
				var number =  $("#skypeCallId").text();
				var callId =  $("#skypeCallId").attr("value");
				
				sendMessageToSkypeClient(command,number,callId);
			});
			
			
//hang up the call	
			$('body').on('click', '.noty_skype_hangup', function(e)
				{
				
				e.preventDefault();
				var command = "endCall";
				var number =   $("#skypeCallId").text();
				var callId =  $("#skypeCallId").attr("value");
				
				sendMessageToSkypeClient(command,number,callId);
			});
			
		
			
//show dialpad	 ---note implemented
			$('body').on('click', '.noty_skype_dialpad', function(e)
			{
			e.preventDefault();
			e.stopPropagation();
			$('#skypeDialpad_btns').toggle();
			});
});
 
//mute the current call	
/*	$('body').on('click', '.noty_skype_mute', function(e)
	{
		
		e.preventDefault();
		var command = "mute";
		var number =  $("#skypeCallId").text();
		var callId =  $("#skypeCallId").attr("value");
		
		$('.noty_buttons').find('.noty_skype_mute').toggle();
		$('.noty_buttons').find('.noty_skype_unmute').toggle();
		
		sendMessageToSkypeClient(command,number,callId);
	});*/
	
//unmute the call	
/*	$('body').on('click', '.noty_skype_unmute', function(e)
	{
		
		e.preventDefault();
		var command = "unMute";
		var number =  $("#skypeCallId").text();
		var callId =  $("#skypeCallId").attr("value");
		
		$('.noty_buttons').find('.noty_skype_unmute').toggle();
		$('.noty_buttons').find('.noty_skype_mute').toggle();
		sendMessageToSkypeClient(command,number,callId);
	});*/


//function for sending DTMF
function skypeSendDTMF(digit)
{
	if(digit){
			play_sound("dtmf");
			var command = "sendDTMF";
			var number =  digit;
			var callId =  $("#skypeCallId").attr("value");
			sendMessageToSkypeClient(command,number,callId);
			return;
	}
}

function sendMessageToSkypeClient(command, number, callid){
	var domain = CURRENT_DOMAIN_USER['domain'];
	var id = CURRENT_DOMAIN_USER['id'];
	console.log("sending message :" + "command " + command + "number" + number + "callid" + callid);
	var image = new Image();
	image.onload = function(png) {
/*		if(command == "startCall"){
			location.href="callto:"+number;
		}*/
		console.log("skype sucess");
		window.focus();
	};
	image.onerror= function(png) {
		console.log("Skype failure");
		if (Skype_Call_Noty != undefined)
			Skype_Call_Noty.close();
		window.focus();
		resetglobalCallVariables();
		if(command == "getLogs"){
			var message ={};
			message["data"] = "";
			handleLogsForSkype(message);
			showCallNotyMessage("Executable file is not running");
			return;
		}
		$('#skypeInfoModal').html(getTemplate("skypeInfoModal"));
		$('#skypeInfoModal').modal('show');
	};
	
	image.src = "http://localhost:33333/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type=Skype?";
	
	if(command == "startCall"){
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
				LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
				{
			var msg = '<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Dialing<img src="/img/ajax-loader-cursor.gif" width="15px" height="5px"  style="margin-left:8px;margin-right:-3px;"></img> &nbsp;&nbsp;&nbsp;  </b>'+'<span id="skypeCallId" class="text-xs">' + number +'</span>'+'<br><br></span><div class="clearfix"></div>';
					Skype_Call_Noty = noty({ text : msg, type : "confirm", layout : "bottomLeft", 
						callback: {
							onCloseClick: function() {
								sendMessageToSkypeClient("endCurrentCall",number,"");
							},
						},
				    });
				});
	}
}

function _getMessageSkype(message, callback){
	var state = message.state;
	var number = message.number;
	var callId = message.callId;
	var displayName = message.displayName;
	var message="";
	globalCallForActivity.justCalledId = callId;
	
	try{
		var inValid = /^\s/;
		var k = inValid.test(number);
		if(k){
			number = "+" + number.trimLeft()
		}
	}catch(e){
	}

	console.log("state--" + state + " number --" + number + "   skypeCallId" + callId + "  displayName" + displayName);
	
	if (state == "ringing"){
				
		
		getContactImage(number,"Incoming",function(contact_Image){
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Incoming Call &nbsp;&nbsp;&nbsp;  </b>'+'<span id="skypeCallId" class="text-xs" value ='+callId+ '>' + number +'</span>'+'<br><br></span><div class="clearfix"></div>';
			if(callback)
				callback(message);
			
			globalCall.callDirection = "Incoming";
			globalCall.callStatus = "Ringing";
			
			globalCall.callId = callId;
			globalCall.callNumber = number;
		});
				
	}else if(state == "connected"){
		getContactImage(number,globalCall.callDirection,function(contact_Image){
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>On Call &nbsp;&nbsp;&nbsp; </b>'+'<span id="skypeCallId" class="text-xs" value ='+callId+ '>' + number + '</span>'+'<br><br></span><div class="clearfix"></div>';
			if(callback)
				callback(message);
			
			globalCall.callStatus = "Connected";
		});
		
	
	}else if(state == "connecting"){
		
		getContactImage(number,"Outgoing",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Calling... &nbsp;&nbsp;&nbsp; </b>'+'<span id="skypeCallId" class="text-xs" value ='+callId+ '>' + number + '</span>' +'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		});
		
		globalCall.callDirection = "Outgoing";
		globalCall.callStatus = "Connecting";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		
	}else if(state == "failed"){
		getContactImage(number,"Outgoing",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Call Failed &nbsp;&nbsp;&nbsp; </b>'+'<span id="skypeCallId" class="text-xs" value ='+callId+ '>' + number + '</span>'+'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		});
		
		if(globalCallForActivity.requestedLogs){
			return;
		}	
		globalCall.callStatus = "Failed";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		replicateglobalCallVariable();
		resetglobalCallVariables();		
		
		//this is called to save the call activity of the user after the call
		if(!callId){
			consolee.log("call id not present...");
			resetglobalCallForActivityVariables();
			globalCallForActivity.requestedLogs = false;
			return;
		}
		
		sendMessageToSkypeClient("getLastCallDetail",globalCallForActivity.callNumber,globalCallForActivity.callId);
	
	}else if(state == "busy"){
		getContactImage(number,"Outgoing",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Call Busy &nbsp;&nbsp;&nbsp; </b>'+'<span id="skypeCallId" class="text-xs" value ='+callId+ '>' + number + '</span>'+'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		});
		
		if(globalCallForActivity.requestedLogs){
			return;
		}	
		globalCall.callStatus = "Busy";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		replicateglobalCallVariable();
		resetglobalCallVariables();		
		
		//this is called to save the call activity of the user after the call
		if(!callId){
			consolee.log("call id not present...");
			resetglobalCallForActivityVariables();
			globalCallForActivity.requestedLogs = false;
			return;
		}
		sendMessageToSkypeClient("getLastCallDetail",globalCallForActivity.callNumber,globalCallForActivity.callId);
	}else if(state == "refused" || state == "missed"){
			callback("");
			globalCall.callStatus = "Missed";
			globalCall.callId = callId;
			globalCall.callNumber = number;
			replicateglobalCallVariable();
			resetglobalCallVariables();	
			
			//this is called to save the call activity of the user after the call
			if(!callId){
				consolee.log("call id not present...");
			resetglobalCallForActivityVariables();
			globalCallForActivity.requestedLogs = false;
				return;
			}
			sendMessageToSkypeClient("getLastCallDetail",globalCallForActivity.callNumber,globalCallForActivity.callId);
			return;
			
	}else if(state == "ended"){
		callback("");
		
		if(globalCall.callStatus && globalCall.callStatus == "Connected"){
			globalCall.callStatus = "Answered"; //change form completed
		}else if(globalCall.callStatus && globalCall.callStatus == "Connecting"){
			globalCall.callStatus = "Busy";
		}else if(globalCall.callStatus == "Failed" || globalCall.callStatus == "REFUSED" || globalCall.callStatus == "Ringing" || globalCall.callStatus == "Missed"){
			return;
		}
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		replicateglobalCallVariable();
		resetglobalCallVariables();		
		
		//this is called to save the call activity of the user after the call
		if(!callId){
			consolee.log("call id not present...")
			return;
		}
		globalCallForActivity.requestedLogs = true;
		sendMessageToSkypeClient("getLastCallDetail",globalCallForActivity.callNumber,globalCallForActivity.callId);
		
	}
	
}


function saveCallActivitySkype(call){
	
	
	if(	globalCallForActivity.justCalledId == globalCallForActivity.justSavedCalledIDForActivity){
		return;
	}
	globalCallForActivity.justSavedCalledIDForActivity = globalCallForActivity.justCalledId;
	
	if(call.direction == "Outgoing" || call.direction == "outgoing"){
		var callerObjectId = globalCall.contactedId;
		if(!callerObjectId){
			return;
		}
		$.post( "/core/api/widgets/skype/savecallactivityById",{
			id:callerObjectId,
			direction: call.direction, 
			phone: call.phone, 
			status : call.status,
			duration : call.duration 
			});
	}else{
		$.post( "/core/api/widgets/skype/savecallactivity",{
			direction: call.direction, 
			phone: call.phone, 
			status : call.status,
			duration : call.duration
			});
	}
}

function saveCallNoteSkype(){
	
	
	if(	globalCallForActivity.justCalledId == globalCallForActivity.justSavedCalledIDForNote){
		return;
	}
	globalCallForActivity.justSavedCalledIDForNote = globalCallForActivity.justCalledId;
	
	if(!globalCallForActivity.callDirection || !globalCallForActivity.callStatus  || !globalCallForActivity.callNumber){
		return;
	}
	
	var callStatus = globalCallForActivity.callStatus;
	var direction = globalCallForActivity.callDirection;
	var number = globalCallForActivity.callNumber;
	var callId = globalCallForActivity.callId;
	var duration = globalCallForActivity.duration;
	var contact;
	var id;
	var desc;
	resetglobalCallForActivityVariables();
	
	var noteSub = direction + " Call - " + callStatus;

	if(direction == "Incoming"){
	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    	if(!responseJson){
	    		return showNewContactModal(number);
	    	}
	    	id = responseJson.id;
	    	contact = responseJson;
	    	contact_name = getContactName(contact);
	    	if(callStatus == "Answered"){
				var el = $('#noteForm');
			 	$('.tags',el).html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ id +'">'+contact_name+'</li>');
			 	$("#noteForm #subject").val(noteSub);
					$("#noteForm #description").val("Call duration - "+ twilioSecondsToFriendly(duration));
					$("#noteForm").find("#description").focus();
				$('#noteModal').modal('show');
				agile_type_ahead("note_related_to", el, contacts_typeahead);
	    	}else{
				var note = {"subject" : noteSub, "message" : "", "contactid" : id};
				autosaveNoteByUser(note);
	    	}
	    });
	    
	}else{
		
		var cntId = globalCall.contactedId;
		if(cntId){
				if( callStatus == "Answered"){
					accessUrlUsingAjax("core/api/contacts/"+cntId, function(resp){
						var json = resp;
						if(json == null) {
							return;
						}


						contact_name = getContactName(json);

					var el = $('#noteForm');
				 	$('.tags',el).html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ cntId +'">'+contact_name+'</li>');
				 	$("#noteForm #subject").val(noteSub);
				 	$("#noteForm #description").val("Call duration - "+ twilioSecondsToFriendly(duration));
						$("#noteForm").find("#description").focus();
					$('#noteModal').modal('show');
					agile_type_ahead("note_related_to", el, contacts_typeahead);
					});
				}else{
					var note = {"subject" : noteSub, "message" : "", "contactid" : cntId};
					autosaveNoteByUser(note);
				}
		}
	}
}




function getLogsForSkype(num){
	
	if(window.location.hash.indexOf("contact/") == -1)
	  {
		return;
	  }
	
	var logNumber;
	var parameter = {};
	
	parameter['error_message'] = "There is no phone number or skype id associated with this contact. <a href='#contact-edit' class='text-info' style='color:#23b7e5'>Add phone number or skype id</a>";
	//var contact = agile_crm_get_contact();
	//parameter['num'] = getPhoneWithSkypeInArray(contact.properties);
	parameter['num'] = agile_crm_get_contact_properties_list("phone");
	if($("#skype-logs-panel").length > 0){
			$("#skype_logs_load").show();
		}else{
			getTemplate('skype-logs', parameter, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#Skype').html($(template_ui));	

				if(parameter['num'].length == 0){
					$("#skype_no_phone").html(parameter.error_message);
				}
				
				$("body").on("change", '#skype_contact_number', function(e)
						{
							$("#skype_logs_load").show();
							getLogsForSkype($("#skype_contact_number").val());
						});
				
			}, "#Skype");
		}
	
	
	if(num){
		logNumber = num;
		//$("#skype_contact_number option[value='"+num+"']").attr('selected', 'selected');
	}else{
		$('#skype_contact_number option:eq(0)').attr('selected', 'selected');
		logNumber = $("#skype_contact_number option:selected").val();
	}
	
		if(parameter['num'].length > 0){
			if(!logNumber){
				logNumber = parameter['num'][0].value;
			}
			var command = "getLogs";
			var number =  logNumber;
			var callId = "";
			sendMessageToSkypeClient(command,number,callId);
		}
}

function handleLogsForSkype(message){
	$("#skype_logs_load").hide();
	
	getTemplate('skype-logs-fetch', message.data , undefined, function(template_ui){
		if(!template_ui)
			  return;
	   	var skype_logs_template = $(template_ui);
		$('#skype-logs-panel').html(skype_logs_template);

			// Load jquery time ago function to show time ago in logs
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago", skype_logs_template).timeago();
			});

	}, "#skype-logs-panel");
}

