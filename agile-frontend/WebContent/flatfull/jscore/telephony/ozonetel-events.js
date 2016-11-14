function _getMessageOzonetel(message){
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
function saveCallNoteOzonetel(message){

	var noteSub = message.direction + " Call - " + message.state;
	var cntId = globalCall.contactedId;
alert(cntId);
	/*if(direction == "Incoming"){
	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    	if(!responseJson){
	    		
	    		resetCallLogVariables();
	    		
	    		if(callStatus == "answered") {
	    			var data = {};
	    			data.url = "/core/api/widgets/bria/";
	    			data.subject = noteSub;
	    			data.number = number;
	    			data.callType = "inbound";
	    			data.status = "answered";
	    			data.duration = duration;
	    			data.contId = null;
	    			data.contact_name = "";
	    			data.widget = "Ozonetel";
	    			CallLogVariables.dynamicData = data;
	    		}
	    			CallLogVariables.subject = noteSub;
		    		CallLogVariables.callWidget = "Ozonetel";
		    		CallLogVariables.callType = "inbound";
		    		CallLogVariables.phone = number;
		    		CallLogVariables.duration = duration;
		    		CallLogVariables.status = callStatus;
		    		var jsonObj = {};
		    		jsonObj['phoneNumber'] = number;
		    		return showContactMergeOption(jsonObj);
	    		
	    	}
	    	contact = responseJson;
	    	contact_name = getContactName(contact);
	    	if(callStatus == "answered"){
	    		
				var data = {};
				data.url = "/core/api/widgets/bria/";
				data.subject = noteSub;
				data.number = number;
				data.callType = "inbound";
				data.status = "answered";
				data.duration = duration;
				data.contId = contact.id;
				data.contact_name = contact_name;
				data.widget = "Ozonetel";
				showDynamicCallLogs(data);
	    	}else{
	    		var note = {"subject" : noteSub, "message" : "", "contactid" : contact.id,"phone": number, "callType": "inbound", "status": callStatus, "duration" : 0 };
				autosaveNoteByUser(note,call,"/core/api/widgets/bria");
	    	}
	    });
	}else{
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
					data.url = "/core/api/widgets/bria/";
					data.subject = noteSub;
					data.number = message.contact_number;
					data.callType = "outbound-dial";
					data.status = "answered";
					data.duration = message.callduration;
					data.contId = cntId;
					data.contact_name = contact_name;
					data.widget = "Ozonetel";
					showDynamicCallLogs(data);
					});
				}else{
					var note = {"subject" : noteSub, "message" : "", "contactid" : cntId,"phone": message.contact_number,"callType": "outbound-dial", "status": message.state, "duration" : 0 };
					autosaveNoteByUser(note,call,"/core/api/widgets/bria");
				}
		}else{
			resetCallLogVariables();
    		
    		if(message.state == "answered") {
    			var data = {};
    			data.url = "/core/api/widgets/bria/";
    			data.subject = noteSub;
    			data.number = message.contact_number;
    			data.callType = "outbound-dial";
    			data.status = "answered";
    			data.duration = message.callduration;;
    			data.contId = null;
    			data.contact_name = "";
    			data.widget = "Ozonetel";
    			CallLogVariables.dynamicData = data;
    		}
    			CallLogVariables.subject = noteSub;
	    		CallLogVariables.callWidget = "Ozonetel";
	    		CallLogVariables.callType = "outbound-dial";
	    		CallLogVariables.phone = message.contact_number;
	    		CallLogVariables.duration = message.callduration;;
	    		CallLogVariables.status = message.state;
	    		var jsonObj = {};
	    		jsonObj['phoneNumber'] = message.contact_number;
	    		return showContactMergeOption(jsonObj);
		}
	}*/
}