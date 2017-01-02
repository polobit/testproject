/*
 * This will show the note to the user after the call is completed sucessfully
 */
function saveCallNoteOzonetel(message){
	var notsub_message = "";
	if(message.state == "not_answered"){
		notsub_message = "noanswer";
	}else{
		if(message.state == "noanswer"){
			notsub_message = "Failed";
		}else{
			notsub_message = message.state;
		}
	}

	var noteSub = message.direction + " Call - " + notsub_message;
	var cntId = globalCall.contactedId;
	var  callStatus = "";
	if(message.state == "connected"){
		callStatus = "Connected";
	}else if(message.state == "ringing"){
		callStatus = "Ringing";
	}else if(message.state == "missed"){
		callStatus = "Missed";
	}else if(message.state == "connecting"){
		callStatus = "Connecting";
	}else if(message.state == "failed" || message.state == "noanswer"){
		callStatus = "Failed";
	}else if(message.state == "busy"){
		callStatus = "Busy";
	}else if(message.state == "not_answered"){
		callStatus = "Busy";
	}else if(message.state == "answered"){
		callStatus = "Answered";
	}else if(message.state == "ended" ||message.state == "refused" || message.state == "missed"){
		callStatus = "Missed";
	}

	//alert(globalCall.callStatus);

	var call = { "direction" : message.direction, "phone" : message.contact_number, "status" : callStatus,
				"duration" : message.duration, "contactId" : cntId };

	if(message.direction == "Incoming"){
		resetCallLogVariables();
		var number = message.number;
	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    	if(!responseJson){
	    		if(message.state == "answered") {
	    			var data = {};
	    			data.url = "/core/api/widgets/ozonetel/";
	    			data.subject = noteSub;
	    			data.number = number;
	    			data.callType = "inbound";
	    			data.status = "answered";
	    			data.duration = message.duration;
	    			data.contId = null;
	    			data.contact_name = "";
	    			data.widget = "Ozonetel";
	    			CallLogVariables.dynamicData = data;
	    		}
	    			CallLogVariables.subject = noteSub;
		    		CallLogVariables.callWidget = "Ozonetel";
		    		CallLogVariables.callType = "inbound";
		    		CallLogVariables.phone = message.number;
		    		CallLogVariables.duration = message.duration;
		    		CallLogVariables.status = callStatus;
		    		var jsonObj = {};
		    		jsonObj['phoneNumber'] = number;
		    		$("#draggable_noty").hide();
		    		setTimeout(function(){ closeCallNoty(true); }, 2000);
		    		return showContactMergeOption(jsonObj);
	    	}
	    	contact = responseJson;
	    	contact_name = getContactName(contact);
	    	if(message.state == "answered"){
	    		
				var data = {};
				data.url = "/core/api/widgets/ozonetel/";
				data.subject = noteSub;
				data.number = message.number;
				data.callType = "inbound";
				data.status = "answered";
				data.duration = message.duration;
				data.contId = contact.id;
				data.contact_name = contact_name;
				data.widget = "Ozonetel";
				$("#draggable_noty").hide();
		    	setTimeout(function(){ closeCallNoty(true); }, 2000);
				showDynamicCallLogs(data);
	    	}else{
	    		
	    		call = { "direction" : message.direction, "phone" : message.number, "status" : callStatus,
				"duration" : message.duration, "contactId" : contact.id };

	    		var note = {"subject" : noteSub, "message" : "", "contactid" : contact.id,"phone": message.number, "callType": "inbound", "status": callStatus, "duration" : message.duration };
				autosaveNoteByUser(note,call,"/core/api/widgets/ozonetel");
	    	}
	    });
	}else{
		resetCallLogVariables();
		if(cntId){
				if( message.state == "answered"){
					twilioIOSaveContactedTime(cntId);
					accessUrlUsingAjax("core/api/contacts/"+cntId, function(resp){
					var json = resp;
					if(json == null) {
						return;
					}

					contact_name = getContactName(json);
					var data = {};
					data.url = "/core/api/widgets/ozonetel/";
					data.subject = noteSub;
					data.number = message.contact_number;
					data.callType = "outbound-dial";
					data.status = "answered";
					data.duration = message.duration;
					data.contId = cntId;
					data.contact_name = contact_name;
					data.widget = "Ozonetel";
					$("#draggable_noty").hide();
		    		setTimeout(function(){ closeCallNoty(true); }, 2000);
					showDynamicCallLogs(data);
					});
				}else{
					var note = {"subject" : noteSub, "message" : "", "contactid" : cntId,"phone": message.contact_number,"callType": "outbound-dial", "status": callStatus, "duration" : message.duration };
					autosaveNoteByUser(note,call,"/core/api/widgets/ozonetel");
				}
		}else{
    		if(message.state == "answered") {
    			var data = {};
    			data.url = "/core/api/widgets/ozonetel/";
    			data.subject = noteSub;
    			data.number = message.contact_number;
    			data.callType = "outbound-dial";
    			data.status = "answered";
    			data.duration = message.duration;;
    			data.contId = null;
    			data.contact_name = "";
    			data.widget = "Ozonetel";
    			CallLogVariables.dynamicData = data;
    		}
    			CallLogVariables.subject = noteSub;
	    		CallLogVariables.callWidget = "Ozonetel";
	    		CallLogVariables.callType = "outbound-dial";
	    		CallLogVariables.phone = message.contact_number;
	    		CallLogVariables.duration = message.duration;;
	    		CallLogVariables.status = callStatus;
	    		var jsonObj = {};
	    		jsonObj['phoneNumber'] = message.contact_number;
	    		$("#draggable_noty").hide();
		    	setTimeout(function(){ closeCallNoty(true); }, 2000);
	    		return showContactMergeOption(jsonObj);
		}
	}
}

/*
 * This method sends the command to client to gets the log - for a given number
 */
function getLogsForOzonetel(num){
	if(window.location.hash.indexOf("contact/") == -1)
	  {
		return;
	  }
	
	var logNumber;
	var parameter = {};
	parameter['error_message'] = _agile_get_translated_val('widgets', 'no-phone-number-to-contact') +  " <a href='#contact-edit' class='text-info' style='color:#23b7e5'>" +_agile_get_translated_val('campaigns', 'add-phone-number')+"</a>";
	parameter['num'] = agile_crm_get_contact_properties_list("phone");
	if($("#ozonetel-logs-panel").length > 0){
			$("#ozonetel_logs_load").show();
		}else{
			getTemplate('ozonetel-logs', parameter, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$('#Ozonetel').html($(template_ui));	
				
				if(parameter['num'].length == 0){
					$("#ozonetel_no_phone").html(parameter.error_message);
				}

				$("body").on("change", '#ozonetel_contact_number', function(e)
						{
							$("#ozonetel_logs_load").show();
							getLogsForOzonetel($("#ozonetel_contact_number").val());
						});
				
			}, "#Ozonetel");
		}
	
	
	if(num){
		logNumber = num;
	}else{
		$('#ozonetel_contact_number option:eq(0)').attr('selected', 'selected');
		logNumber = $("#ozonetel_contact_number option:selected").val();
	}
	
		if(parameter['num'].length > 0){
			if(!logNumber){
				logNumber = parameter['num'][0].value;
			}
			var previousCalledClient  = globalCall.calledFrom;
			var action = {"command":  "getLogs", "number": logNumber, "callId": ""};
			globalCall.calledFrom = "ozonetel";
			var message = {};
			handleLogsForOzonetel(message);
			globalCall.calledFrom = previousCalledClient;
		}
}
/*
 * This function handles the logs message sent from the client side to server
 */
function handleLogsForOzonetel(message){
	$("#bria_logs_load").hide();
	
	getTemplate('ozonetel-logs-fetch', message.data , undefined, function(template_ui){
		if(!template_ui)
			  return;

	   	var ozonetel_logs_template = $(template_ui);
		$('#ozonetel-logs-panel').html(ozonetel_logs_template);

			// Load jquery time ago function to show time ago in logs
			agileTimeAgoWithLngConversion($(".time-ago", ozonetel_logs_template));

	}, "#ozonetel-logs-panel");
}