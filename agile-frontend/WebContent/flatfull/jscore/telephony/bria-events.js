/**
 * This page contains all the click or other events related to Bria calling
 * 
 *@author Prakash 
 */
 
$(function()
{
	
//mute the current call	
	$('body').on('click', '.noty_bria_mute', function(e)
	{
		
		e.preventDefault();
		var json = {"command" : "mute"};
	  	var action = makeCallAction(json);
	  	sendActionToClient(action);
		$('.noty_buttons').find('.noty_bria_unmute').css('display','inline');
		$('.noty_buttons').find('.noty_bria_mute').toggle();
		
	});

//unmute the call	
	$('body').on('click', '.noty_bria_unmute', function(e)
	{
		
		e.preventDefault();
		var json = {"command" : "unMute"};
	  	var action = makeCallAction(json);
	  	sendActionToClient(action);
	  	
		$('.noty_buttons').find('.noty_bria_unmute').toggle();
		$('.noty_buttons').find('.noty_bria_mute').toggle();
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
			
			globalCall.callDirection = "Incoming";
			globalCall.callStatus = "Ringing";
			globalCall.calledFrom = "Bria";
			globalCall.callId = callId;
			globalCall.callNumber = number;
			globalCallForActivity.justCalledId = callId;
				
	}else if(state == "connected"){
			globalCall.callStatus = "Connected";
	
	}else if(state == "missed"){
		//To_Number = number;
		
		globalCall.callDirection = "Incoming";
		globalCall.callStatus = "Missed";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		globalCallForActivity.justCalledId = callId;
		
	}else if(state == "connecting"){
		//var contactDetailsObj = agile_crm_get_contact();
		//displayName = getContactName(contactDetailsObj);
		
		globalCall.callDirection = "Outgoing";
		globalCall.callStatus = "Connecting";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		globalCallForActivity.justCalledId = callId;
		
	}else if(state == "failed"){
		
		globalCall.callStatus = "Failed";
		globalCallForActivity.justCalledId = callId;

	
	}else if(state == "ended"){
		if(globalCall.callStatus && globalCall.callStatus == "Connected"){
			globalCall.callStatus = "Answered"; //change form completed
		}else if(globalCall.callStatus && globalCall.callStatus == "Connecting"){
			globalCall.callStatus = "Busy";
		}else if(globalCall.callStatus && globalCall.callStatus == "Ringing"){
			globalCall.callStatus = "Missed";
		}
		
		number = globalCall.callNumber;
		replicateglobalCallVariable();
		resetglobalCallVariables();		
		
		
		//this is called to save the call activity of the user after the call
		if(!callId)
			callId = "";
		var action = {"command":  "getLastCallDetail", "number": number, "callId": callId};
		sendActionToClient(action);
	}
}

/*
 * This will show the note to the user after the call is completed sucessfully
 */
function saveCallNoteBria(call){
	
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
	var cntId = globalCallForActivity.contactedId;
	var contact;
	var desc;
	resetglobalCallForActivityVariables();
	
	var noteSub = direction + " Call - " + callStatus;

	if(direction == "Incoming"){
	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    	if(!responseJson){
	    		
	    		resetCallLogVariables();
	    		
	    		if(callStatus == "Answered") {
	    			var data = {};
	    			data.url = "/core/api/widgets/bria/";
	    			data.subject = noteSub;
	    			data.number = number;
	    			data.callType = "inbound";
	    			data.status = "answered";
	    			data.duration = duration;
	    			data.contId = null;
	    			data.contact_name = "";
	    			data.widget = "Bria";
	    			CallLogVariables.dynamicData = data;
	    		}
	    			CallLogVariables.subject = noteSub;
		    		CallLogVariables.callWidget = "Bria";
		    		CallLogVariables.callType = "inbound";
		    		CallLogVariables.phone = number;
		    		CallLogVariables.duration = duration;
		    		CallLogVariables.status = callStatus;
		    		var jsonObj = {};
		    		jsonObj['phoneNumber'] = number;
		    		return showContactMergeOption(jsonObj);
	    		//return showNewContactModal(number);
	    		
	    	}
	    	contact = responseJson;
	    	contact_name = getContactName(contact);
	    	if(callStatus == "Answered"){
	    		
				var data = {};
				data.url = "/core/api/widgets/bria/";
				data.subject = noteSub;
				data.number = number;
				data.callType = "inbound";
				data.status = "answered";
				data.duration = duration;
				data.contId = contact.id;
				data.contact_name = contact_name;
				data.widget = "Bria";
				showDynamicCallLogs(data);
/*				
				var el = $('#noteForm');

				var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{id}}">{{name}}</li>');
			 	// Adds contact name to tags ul as li element
				$('.tags',el).html(template({name : contact_name, id : contact.id}));

			 	$("#noteForm #subject").val(noteSub);
					$("#noteForm #description").val("Call duration - "+ twilioSecondsToFriendly(duration));
					$("#noteForm").find("#description").focus();
				$('#noteModal').modal('show');
				agile_type_ahead("note_related_to", el, contacts_typeahead);*/
				
	    	}else{
	    		var note = {"subject" : noteSub, "message" : "", "contactid" : contact.id,"phone": number, "callType": "inbound", "status": callStatus, "duration" : 0 };
				autosaveNoteByUser(note,call,"/core/api/widgets/bria");
	    	}
	    });
	}else{
		if(cntId){
				if( callStatus == "Answered"){
					twilioIOSaveContactedTime(cntId);
					accessUrlUsingAjax("core/api/contacts/"+cntId, function(resp){
					var json = resp;
					if(json == null) {
						return;
					}

					contact_name = getContactName(json);
					var data = {};
					data.url = "/core/api/widgets/bria/";
					data.subject = noteSub;
					data.number = number;
					data.callType = "outbound-dial";
					data.status = "answered";
					data.duration = duration;
					data.contId = cntId;
					data.contact_name = contact_name;
					data.widget = "Bria";
					showDynamicCallLogs(data);
					
/*					var el = $('#noteForm');
				 	$('.tags',el).html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ cntId +'">'+contact_name+'</li>');
				 	$("#noteForm #subject").val(noteSub);
				 	$("#noteForm #description").val("Call duration - "+ twilioSecondsToFriendly(duration));
						$("#noteForm").find("#description").focus();
					$('#noteModal').modal('show');
					agile_type_ahead("note_related_to", el, contacts_typeahead);*/
					
					});
				}else{
					var note = {"subject" : noteSub, "message" : "", "contactid" : cntId,"phone": number,"callType": "outbound-dial", "status": callStatus, "duration" : 0 };
					autosaveNoteByUser(note,call,"/core/api/widgets/bria");
				}
		}else{
			resetCallLogVariables();
    		
    		if(callStatus == "Answered") {
    			var data = {};
    			data.url = "/core/api/widgets/bria/";
    			data.subject = noteSub;
    			data.number = number;
    			data.callType = "outbound-dial";
    			data.status = "answered";
    			data.duration = duration;
    			data.contId = null;
    			data.contact_name = "";
    			data.widget = "Bria";
    			CallLogVariables.dynamicData = data;
    		}
    			CallLogVariables.subject = noteSub;
	    		CallLogVariables.callWidget = "Bria";
	    		CallLogVariables.callType = "outbound-dial";
	    		CallLogVariables.phone = number;
	    		CallLogVariables.duration = duration;
	    		CallLogVariables.status = callStatus;
	    		var jsonObj = {};
	    		jsonObj['phoneNumber'] = number;
	    		return showContactMergeOption(jsonObj);
    		//return showNewContactModal(number);
		}
	}
}

/*
 * This will save the note for the call
 */
function autosaveNoteByUser(note,call,url){
	$.post( "/core/api/widgets/twilio/autosavenote", {
			subject: note.subject,
			message: note.message,
			contactid: note.contactid,
			phone: note.phone,
			callType: note.callType,
			status: note.status,
			duration: note.duration			
		},function(data){
			if(call.direction == "Outgoing" || call.direction == "outgoing"){
				var callerObjectId = call.contactId;
				if(!callerObjectId){
					return;
				}
				$.post(url+"/savecallactivityById?note_id="+data.id,{
					id:callerObjectId,
					direction: call.direction, 
					phone: call.phone, 
					status : call.status,
					duration : call.duration,
					uuid: note.uuid
				});					
			}else{
				$.post( url+"/savecallactivity?note_id="+data.id,{
					direction: call.direction, 
					phone: call.phone, 
					status : call.status,
					duration : call.duration,
					uuid: note.uuid
				});
			}
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

/*	if(!globalCall.contactedId && dialled.using == "dialler"){
		$.post( "/core/api/widgets/bria/savecallactivity",{
			direction: call.direction, 
			phone: call.phone, 
			status : call.status,
			duration : call.duration
			});
		return;
	}*/
	
	if(call.status == "Answered"){
		return;
	}
	
	var callerObjectId = call.contactId;
	if(!callerObjectId){
		return;
	}
	
	if(call.direction == "Outgoing" || call.direction == "outgoing"){
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
	parameter['error_message'] = _agile_get_translated_val('widgets', 'no-phone-number-to-contact') +  " <a href='#contact-edit' class='text-info' style='color:#23b7e5'>" +_agile_get_translated_val('campaigns', 'add-phone-number')+"</a>";
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
			var previousCalledClient  = globalCall.calledFrom;
			var action = {"command":  "getLogs", "number": logNumber, "callId": ""};
			globalCall.calledFrom = "Bria";
			sendActionToClient(action);
			globalCall.calledFrom = previousCalledClient;
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
			agileTimeAgoWithLngConversion($(".time-ago", bria_logs_template));

	}, "#bria-logs-panel");
}