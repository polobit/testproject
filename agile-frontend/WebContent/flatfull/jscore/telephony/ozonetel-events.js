/*
 * This will show the note to the user after the call is completed sucessfully
 */
function saveCallNoteOzonetel(message){

	var noteSub = message.direction + " Call - " + message.state;
	var cntId = globalCall.contactedId;
	var call = { "direction" : message.direction, "phone" : message.contact_number, "status" : message.state,
				"duration" : message.duration, "contactId" : cntId };

	if(message.direction == "Incoming"){
		var number = message.number;

	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    	if(!responseJson){
	    		alert("not json");

	    		resetCallLogVariables();
	    		
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
		    		CallLogVariables.status = message.state;
		    		var jsonObj = {};
		    		jsonObj['phoneNumber'] = number;
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
				showDynamicCallLogs(data);
	    	}else{
	    		
	    		call = { "direction" : message.direction, "phone" : message.number, "status" : message.state,
				"duration" : message.duration, "contactId" : contact.id };

	    		var note = {"subject" : noteSub, "message" : "", "contactid" : contact.id,"phone": message.number, "callType": "inbound", "status": message.state, "duration" : message.duration };
				autosaveNoteByUser(note,call,"/core/api/widgets/ozonetel/");
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
					data.url = "/core/api/widgets/ozonetel/";
					data.subject = noteSub;
					data.number = message.contact_number;
					data.callType = "outbound-dial";
					data.status = "answered";
					data.duration = message.duration;
					data.contId = cntId;
					data.contact_name = contact_name;
					data.widget = "Ozonetel";
					showDynamicCallLogs(data);
					});
				}else{
					var note = {"subject" : noteSub, "message" : "", "contactid" : cntId,"phone": message.contact_number,"callType": "outbound-dial", "status": message.state, "duration" : message.duration };
					autosaveNoteByUser(note,call,"/core/api/widgets/ozonetel");
				}
		}else{
			resetCallLogVariables();
    		
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
	    		CallLogVariables.status = message.state;
	    		var jsonObj = {};
	    		jsonObj['phoneNumber'] = message.contact_number;
	    		return showContactMergeOption(jsonObj);
		}
	}
}