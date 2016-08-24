 
$(function()
{
	
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
});	


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
			number = "+" + number.trimLeft();
		}
	}catch(e){
	}

	console.log("state--" + state + " number --" + number + "   skypeCallId" + callId + "  displayName" + displayName);
	
	if (state == "ringing"){
				
		
			globalCall.callDirection = "Incoming";
			globalCall.callStatus = "Ringing";
			globalCall.calledFrom = "Skype";
			globalCall.callId = callId;
			globalCall.callNumber = number;
				
	}else if(state == "connected"){
			
			globalCall.callStatus = "Connected";
	
	}else if(state == "connecting"){
		
		globalCall.callDirection = "Outgoing";
		globalCall.callStatus = "Connecting";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		
	}else if(state == "failed"){
		
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
		var action = {"command":  "getLastCallDetail", "number": globalCallForActivity.callNumber, "callId": globalCallForActivity.callId};
		sendActionToClient(action);
		
	}else if(state == "busy"){
		
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
		var action = {"command":  "getLastCallDetail", "number": globalCallForActivity.callNumber, "callId": globalCallForActivity.callId};
		sendActionToClient(action);
		
	}else if(state == "refused" || state == "missed"){
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
			var action = {"command":  "getLastCallDetail", "number": globalCallForActivity.callNumber, "callId": globalCallForActivity.callId};
			sendActionToClient(action);
			return;
			
	}else if(state == "ended"){
		
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
		var action = {"command":  "getLastCallDetail", "number": globalCallForActivity.callNumber, "callId": globalCallForActivity.callId};
		sendActionToClient(action);
		
	}
	
}


function saveCallActivitySkype(call){
	
	
	if(	globalCallForActivity.justCalledId == globalCallForActivity.justSavedCalledIDForActivity){
		return;
	}
	globalCallForActivity.justSavedCalledIDForActivity = globalCallForActivity.justCalledId;
	
/*	if(!globalCall.contactedId && dialled.using == "dialler"){
		$.post( "/core/api/widgets/skype/savecallactivity",{
			direction: call.direction, 
			phone: call.phone, 
			status : call.status,
			duration : call.duration
			});
	}*/
	
	if(call.status == "Answered"){
		return;
	}
	
	var callerObjectId = call.contactId;
	if(!callerObjectId){
		return;
	}
	
	if(call.direction == "Outgoing" || call.direction == "outgoing"){

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

function saveCallNoteSkype(call){
	
	
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
	var id;
	var desc;
	resetglobalCallForActivityVariables();
	
	var noteSub = direction + " Call - " + callStatus;

	if(direction == "Incoming"){
	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    	if(!responseJson){
	resetCallLogVariables();
	    		
	    		if(callStatus == "Answered") {
	    			var data = {};
	    			data.url = "/core/api/widgets/skype/";
	    			data.subject = noteSub;
	    			data.number = number;
	    			data.callType = "inbound";
	    			data.status = "answered";
	    			data.duration = duration;
	    			data.contId = null;
	    			data.contact_name = "";
	    			data.widget = "Skype";
	    			CallLogVariables.dynamicData = data;
	    		}
		    		CallLogVariables.callWidget = "Skype";
		    		CallLogVariables.callType = "inbound";
		    		CallLogVariables.phone = number;
		    		CallLogVariables.duration = duration;
		    		CallLogVariables.status = callStatus;
	    		return showNewContactModal(number);
	    	}
	    	id = responseJson.id;
	    	contact = responseJson;
	    	contact_name = getContactName(contact);
	    	if(callStatus == "Answered"){

				var data = {};
				data.url = "/core/api/widgets/skype/";
				data.subject = noteSub;
				data.number = number;
				data.callType = "inbound";
				data.status = "answered";
				data.duration = duration;
				data.contId = id;
				data.contact_name = contact_name;
				data.widget = "Skype";
				showDynamicCallLogs(data);

/*				var el = $('#noteForm');
			 	$('.tags',el).html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ id +'">'+contact_name+'</li>');
			 	$("#noteForm #subject").val(noteSub);
					$("#noteForm #description").val("Call duration - "+ twilioSecondsToFriendly(duration));
					$("#noteForm").find("#description").focus();
				$('#noteModal').modal('show');
				agile_type_ahead("note_related_to", el, contacts_typeahead);*/
	    	}else{
	    		var note = {"subject" : noteSub, "message" : "", "contactid" : id,"phone": number, "callType": "inbound", "status": callStatus, "duration" : 0 };
				autosaveNoteByUser(note,call,"/core/api/widgets/skype");
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
						data.url = "/core/api/widgets/skype/";
						data.subject = noteSub;
						data.number = number;
						data.callType = "outbound-dial";
						data.status = "answered";
						data.duration = duration;
						data.contId = cntId;
						data.contact_name = contact_name;
						data.widget = "Skype";
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
					var note = {"subject" : noteSub, "message" : "", "contactid" : cntId,"phone": number, "callType": "outbound-dial", "status": callStatus, "duration" : 0 };
					autosaveNoteByUser(note,call,"/core/api/widgets/skype");
				}
		}else{
				resetCallLogVariables();
				if(callStatus == "Answered") {
    			var data = {};
    			data.url = "/core/api/widgets/skype/";
    			data.subject = noteSub;
    			data.number = number;
    			data.callType = "outbound-dial";
    			data.status = "answered";
    			data.duration = duration;
    			data.contId = null;
    			data.contact_name = "";
    			data.widget = "Skype";
    			CallLogVariables.dynamicData = data;
    		}
	    		CallLogVariables.callWidget = "Skype";
	    		CallLogVariables.callType = "outbound-dial";
	    		CallLogVariables.phone = number;
	    		CallLogVariables.duration = duration;
	    		CallLogVariables.status = callStatus;
    		
    		return showNewContactModal(number);
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
	
	parameter['error_message'] = _agile_get_translated_val('widgets', 'skype-contact-info')+  " <a href='#contact-edit' class='text-info' style='color:#23b7e5'>"+_agile_get_translated_val('widgets', 'skype-invalid-number')+"</a>";
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
			var previousCalledClient  = globalCall.calledFrom;
			var action = {"command":  "getLogs", "number": logNumber, "callId": ""};
			globalCall.calledFrom = "Skype";
			sendActionToClient(action);
			globalCall.calledFrom = previousCalledClient;
			
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
			agileTimeAgoWithLngConversion($(".time-ago", skype_logs_template));

	}, "#skype-logs-panel");
}

