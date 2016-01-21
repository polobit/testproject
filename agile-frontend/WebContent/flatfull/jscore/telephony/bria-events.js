/**
 * This page contains all the click or other events related to Bria calling
 * 
 *@author Prakash 
 */
 var Bria_Call_Noty;
 //callDirection : Incoming, Outgoing
 //callStatus :Ideal, Incoming,Missed,  Connecting,Connected,  Ended,Failed

 var displayName="";
 
$(function()
{
	
	$('body').on('click', '.contact-make-bria-call, .Bria_call', function(e)
	{
	  	e.preventDefault();
		var command = "startCall";
		var number =  $(this).closest(".contact-make-call").attr("phone");
		var callId = "";
		
		if(checkForActiveCall()){
			$('#briaInfoModal').html(getTemplate("briaCallStatusModal"));
			$('#briaInfoModal').modal('show');
			return;
		}
		
		try{
			 $('#skypeCallId').parents("ul").last().remove();
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
		}catch(e){
		}
		
		globalCall.callStatus = "dialing";
		sendMessageToBriaClient(command,number,callId);
		globalCall.calledFrom = "bria";
		setTimerToCheckDialing("bria");
		try{
			var contactDetailsObj = agile_crm_get_contact();
			globalCall.contactedId = contactDetailsObj.id;
		}catch (e) {
		}
	});
	
// }


//answer the callT
	$('body').on('click', '.noty_bria_answer', function(e)
		{
			e.preventDefault();
			var command = "answerCall";
			var number =  $("#briaCallId").text();
			var callId = $("#briaCallId").attr("value");
			
			sendMessageToBriaClient(command,number,callId);
	  });
	  
//ignore the incoming call
	$('body').on('click', '.noty_bria_ignore', function(e)
		{
			e.preventDefault();
			var command = "ignoreCall";
			var number =  $("#briaCallId").text();
			var callId =  $("#briaCallId").attr("value");
			
			sendMessageToBriaClient(command,number,callId);

	});


//hang up the call	
	$('body').on('click', '.noty_bria_hangup', function(e)
		{
		
		e.preventDefault();
		var command = "endCall";
		var number =  $("#briaCallId").text();
		var callId =  $("#briaCallId").attr("value");
		
		sendMessageToBriaClient(command,number,callId);

	});


//cancel the outgoing call	
	$('body').on('click', '.noty_bria_cancel', function(e)
	{
		
		e.preventDefault();
		var command = "cancelCall";
		var number =  $("#briaCallId").text();
		var callId =  $("#briaCallId").attr("value");
		
		sendMessageToBriaClient(command,number,callId);
	});

	
//mute the current call	
	$('body').on('click', '.noty_bria_mute', function(e)
	{
		
		e.preventDefault();
		var command = "mute";
		var number =  "";
		var callId =  $("#briaCallId").attr("value");
		
		$('.noty_buttons').find('.noty_bria_mute').toggle();
		$('.noty_buttons').find('.noty_bria_unmute').toggle();
		
		sendMessageToBriaClient(command,number,callId);
	});

//unmute the call	
	$('body').on('click', '.noty_bria_unmute', function(e)
	{
		
		e.preventDefault();
		var command = "unMute";
		var number =  "";
		var callId =  $("#briaCallId").attr("value");
		
		$('.noty_buttons').find('.noty_bria_unmute').toggle();
		$('.noty_buttons').find('.noty_bria_mute').toggle();
		sendMessageToBriaClient(command,number,callId);
	});


	
//show dialpad	 ---note implemented
	$('body').on('click', '.noty_bria_dialpad', function(e)
	{
	e.preventDefault();
	e.stopPropagation();
	$('#briaDialpad_btns').toggle();
	});


//this is to close the dialpad when clicked anywhere in screen
	$(document).on('click', function(e){
		if($('#briaDialpad_btns').length !=0){
			$('#briaDialpad_btns').hide();
		}
		
		
	});	
	
// this is used to prevent dialpad from closing 	
	$('body').on('click', '#briaDialpad_btns', function(e)	{
		e.stopPropagation();
	});
	
	

//	This function is to hide the information shown to the client when the user is not running bria client
	$('#briaInfoModal').on('click', '#bria_info_ok', function(e)	{
		e.preventDefault();
		$('#briaInfoModal').modal('hide');
	});
	
	
// this function is to hide the already on call alert 	
	$('#briaInfoModal').on('click', '#bria_status_ok', function(e)	{
		e.preventDefault();
		$('#briaInfoModal').modal('hide');
	});
	
	

	
});

//function for sending DTMF
function briaSendDTMF(digit)
{
	if(digit){
			play_sound("dtmf");
			var command = "sendDTMF";
			var number =  digit;
			var callId =  "";
			sendMessageToBriaClient(command,number,callId);
			return;
	}
}

// This function sends the command to local jar running in client side to make the call
//{paramerters} -- command to execute, number to call and call id of the ingoing call if any
function sendMessageToBriaClient(command, number, callid){
	var domain = CURRENT_DOMAIN_USER['domain'];
	var id = CURRENT_DOMAIN_USER['id'];
	
	if(command == "startCall"){
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
				LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
				{
			var msg = '<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Dialing<img src="/img/ajax-loader-cursor.gif" width="15px" height="5px"  style="margin-left:8px;margin-right:-3px;"></img> &nbsp;&nbsp;&nbsp;  </b>'+'<span id="briaCallId" class="text-xs" >' + number +'</span>'+'<br><br></span><div class="clearfix"></div>';
					Bria_Call_Noty = noty({ text : msg, type : "confirm", layout : "bottomLeft",
						callback: {
							onCloseClick: function() {
								sendMessageToBriaClient("endCurrentCall",number,"");
							},
						},
					});
				});
	}
	var image = new Image();
	image.onload = function(png) {
		console.log("bria sucess");
		window.focus();
	};
	image.onerror= function(png) {
		console.log("bria failure");
		if (Bria_Call_Noty != undefined)
			Bria_Call_Noty.close();
		window.focus();
		resetglobalCallVariables();
		if(command == "getLogs"){
			var message ={};
			message["data"] = "";
			handleLogsForBria(message);
			showCallNotyMessage("Executable file is not running");
			return;
		}
		$('#briaInfoModal').html(getTemplate("briaInfoModal"));
		$('#briaInfoModal').modal('show');
	};
	
	image.src = "http://localhost:33333/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type=Bria?";
}

/*
 * this wil create a dynamic message to show in noty - as per the current phhone status
 */
function _getMessageBria(message, callback){
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
	console.log("state--" + state + " number --" + number + "   briaCallId" + callId + "  displayName" + displayName);
	
	if (state == "ringing"){
		getContactImage(number,"Incoming",function(contact_Image){
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Incoming Call &nbsp;&nbsp;&nbsp;  </b>'+'<span id="briaCallId" class="text-xs" value ='+callId+ '>' + number +'</span>'+'<br><br></span><div class="clearfix"></div>';
			if(callback)
				callback(message);
			
			globalCall.callDirection = "Incoming";
			globalCall.callStatus = "Ringing";
			
			globalCall.callId = callId;
			globalCall.callNumber = number;
			globalCallForActivity.justCalledId = callId;
		});
				
	}else if(state == "connected"){
		getContactImage(number,globalCall.callDirection,function(contact_Image){
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>On Call &nbsp;&nbsp;&nbsp; </b>'+'<span id="briaCallId" class="text-xs" value ='+callId+ '>' + number + '</span>'+'<br><br></span><div class="clearfix"></div>';
			if(callback)
				callback(message);
			globalCall.callStatus = "Connected";
		});
		
	
	}else if(state == "missed"){
		//To_Number = number;
		getContactImage(number,"Incoming",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Missed Call &nbsp;&nbsp;&nbsp;  </b>'+ '<span id="briaCallId" class="text-xs" value ='+callId+ '>' + number + '</span>' +'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		
		globalCall.callDirection = "Incoming";
		globalCall.callStatus = "Missed";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		globalCallForActivity.justCalledId = callId;
		});
		
	}else if(state == "connecting"){
		//var contactDetailsObj = agile_crm_get_contact();
		//displayName = getContactName(contactDetailsObj);
		
		getContactImage(number,"Outgoing",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Calling... &nbsp;&nbsp;&nbsp; </b>'+'<span id="briaCallId" class="text-xs" value ='+callId+ '>' + number + '</span>' +'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		});
		
		globalCall.callDirection = "Outgoing";
		globalCall.callStatus = "Connecting";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		globalCallForActivity.justCalledId = callId;
		
	}else if(state == "failed"){
		getContactImage(number,"Outgoing",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Call Failed &nbsp;&nbsp;&nbsp; </b>'+'<span id="briaCallId" class="text-xs" value ='+callId+ '>' + number + '</span>'+'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		});
		
		globalCall.callStatus = "Failed";
		globalCallForActivity.justCalledId = callId;

	
	}else if(state == "ended"){
		callback("");
		if(globalCall.callStatus && globalCall.callStatus == "Connected"){
			globalCall.callStatus = "Answered"; //change form completed
		}else if(globalCall.callStatus && globalCall.callStatus == "Connecting"){
			globalCall.callStatus = "Busy";
		}else if(globalCall.callStatus && globalCall.callStatus == "Ringing"){
			globalCall.callStatus = "Missed";
		}
		
		replicateglobalCallVariable();
		resetglobalCallVariables();		
		
		//this is called to save the call activity of the user after the call
		if(!callId)
			callId = "";
		sendMessageToBriaClient("getLastCallDetail",number,callId);
		
	}
	
}

/*
 * This will show the note to the user after the call is completed sucessfully
 */
function saveCallNoteBria(){
	
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
	var desc;
	resetglobalCallForActivityVariables();
	
	var noteSub = direction + " Call - " + callStatus;

	if(direction == "Incoming"){
	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    	if(!responseJson){
	    		return showNewContactModal(number);
	    	}
	    	contact = responseJson;
	    	contact_name = getContactName(contact);
	    	if(callStatus == "Answered"){
				var el = $('#noteForm');
			 	$('.tags',el).html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ contact.id +'">'+contact_name+'</li>');
			 	$("#noteForm #subject").val(noteSub);
					$("#noteForm #description").val("Call duration - "+ twilioSecondsToFriendly(duration));
					$("#noteForm").find("#description").focus();
				$('#noteModal').modal('show');
				agile_type_ahead("note_related_to", el, contacts_typeahead);
	    	}else{
				var note = {"subject" : noteSub, "message" : "", "contactid" : contact.id};
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

/*
 * This will save the note for the call
 */
function autosaveNoteByUser(note){
	$.post( "/core/api/widgets/twilio/autosavenote", {
		subject: note.subject,
		message: note.message,
		contactid: note.contactid
		});
}

/*
 * This will save the activity for call 
 */
function saveCallActivityBria(call){
	
	if(	globalCallForActivity.justCalledId == globalCallForActivity.justSavedCalledIDForActivity){
		return;
	}
	globalCallForActivity.justSavedCalledIDForActivity = globalCallForActivity.justCalledId;

	if(call.direction == "Outgoing" || call.direction == "outgoing"){
		var callerObjectId = globalCall.contactedId;
		if(!callerObjectId){
			return;
		}
		$.post( "/core/api/widgets/bria/savecallactivityById",{
			id:callerObjectId,
			direction: call.direction, 
			phone: call.phone, 
			status : call.status,
			duration : call.duration 
			});
		
	}else{
		$.post( "/core/api/widgets/bria/savecallactivity",{
			direction: call.direction, 
			phone: call.phone, 
			status : call.status,
			duration : call.duration
			});
	}
}

/*
 * This method sends the command to client to gets the log - for a given number
 */
function getLogsForBria(num){
	
	if(window.location.hash.indexOf("contact/") == -1)
	  {
		return;
	  }
	
	var logNumber;
	var parameter = {};
	parameter['error_message'] = "There is no phone number associated with this contact. <a href='#contact-edit' class='text-info' style='color:#23b7e5'>Add phone number</a>";
	parameter['num'] = agile_crm_get_contact_properties_list("phone");

	if($("#bria-logs-panel").length > 0){
			$("#bria_logs_load").show();
		}else{
			getTemplate('bria-logs', parameter, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#Bria').html($(template_ui));	
				
				if(parameter['num'].length == 0){
					$("#bria_no_phone").html(parameter.error_message);
				}

				$("body").on("change", '#bria_contact_number', function(e)
						{
							$("#bria_logs_load").show();
							getLogsForBria($("#bria_contact_number").val());
						});
				
			}, "#Bria");
		}
	
	
	if(num){
		logNumber = num;
		//$("#bria_contact_number option[value='"+num+"']").attr('selected', 'selected');
	}else{
		$('#bria_contact_number option:eq(0)').attr('selected', 'selected');
		logNumber = $("#bria_contact_number option:selected").val();
	}
	
		if(parameter['num'].length > 0){
			if(!logNumber){
				logNumber = parameter['num'][0].value;
			}
			var command = "getLogs";
			var number =  logNumber;
			var callId = "";
			sendMessageToBriaClient(command,number,callId);
		}
}

/*
 * This function handles the logs message sent from the client side to server
 */
function handleLogsForBria(message){
	$("#bria_logs_load").hide();
	
	getTemplate('bria-logs-fetch', message.data , undefined, function(template_ui){
		if(!template_ui)
			  return;
	   	var bria_logs_template = $(template_ui);
		$('#bria-logs-panel').html(bria_logs_template);

			// Load jquery time ago function to show time ago in logs
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago", bria_logs_template).timeago();
			});

	}, "#bria-logs-panel");
}