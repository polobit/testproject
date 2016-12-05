var NOWLARITY_PREVIOUS_EVENT;


function saveCallNoteKnolarity(event){

	console.log("Event data : **** ");
	console.log(event);

	var callDirection = event.call_direction;
	var eventType = event.event_type;
	var type = event.type;
	var callType = event.Call_Type;
	var agentNumber = event.agent_number;		
	var knowlarityNumber = event.knowlarity_number;
	var customerNumber = event.caller;
	var state = event.business_call_type;
	var callDuration = 0;

	if(event.call_duration){
		callDuration = event.call_duration;
	}


	var noteSub = callDirection + " Call - " + state;
	var cntId;

	if(globalCall && globalCall.contactedContact){
		cntId = globalCall.contactedContact.id; // agilecrm DB ID
	}

	var call = { 
		"direction" : callDirection,
		"phone" : customerNumber,
		"status" : state, 
		"duration" : callDuration, 
		"contactId" : cntId
	};

	var data = {};
	data.url = "/core/api/widgets/knowlarity/";
	data.subject = noteSub;
	data.number = number;
	data.callType = "inbound";	
	data.duration = callDuration;
	data.contId = null;
	data.contact_name = "";
	data.widget = "Knowlarity";

	if(callDirection == "Incoming"){
		var number = customerNumber;

	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+number, function(responseJson){
	    	if(!responseJson){
	    		alert("not json");

	    		resetCallLogVariables();
	    		
	    		if(state == "answered") {
	    			data.status = "answered";
	    			CallLogVariables.dynamicData = data;
	    		}

    			CallLogVariables.subject = noteSub;
	    		CallLogVariables.callWidget = "Knowlarity";
	    		CallLogVariables.callType = "inbound";
	    		CallLogVariables.phone = customerNumber;
	    		CallLogVariables.duration = callDuration;
	    		CallLogVariables.status = state;

	    		var jsonObj = {};
	    		jsonObj['phoneNumber'] = number;

	    		return showContactMergeOption(jsonObj);	    		
	    	}

	    	contact = responseJson;
	    	contact_name = getContactName(contact);
	    	if(message.state == "answered"){				
				data.status = "answered";		
				data.contId = contact.id;
				data.contact_name = contact_name;
				showDynamicCallLogs(data);
	    	}else{    

	    		var call = { 
					"direction" : callDirection,
					"phone" : customerNumber,
					"status" : state, 
					"duration" : callDuration, 
					"contactId" : contact.id
				};

	    		var note = {
	    			"subject" : noteSub, 
	    			"message" : "", 
	    			"contactid" : contact.id,
	    			"phone": customerNumber, 
	    			"callType": "inbound", 
	    			"status": state, 
	    			"duration" : callDuration
	    		};
				autosaveNoteByUser(note, call, "/core/api/widgets/Knowlarity/");
	    	}
	    });
	}else {
		console.log("Outgoing *** ");
		if(cntId){
			console.log("cntId *** "+ state);
			if(state == "answered"){
				twilioIOSaveContactedTime(cntId);
				accessUrlUsingAjax("core/api/contacts/"+cntId, function(resp){
					var json = resp;
					if(json == null) {
						return;
					}

					contact_name = getContactName(json);
					
					data.callType = "outbound-dial";
					data.status = "answered";					
					data.contId = cntId;
					data.contact_name = contact_name;					
					showDynamicCallLogs(data);
				});
			}else{
				var note = {
					"subject" : noteSub, 
					"message" : "", 
					"contactid" : cntId, 
					"phone": customerNumber, 
					"callType": "outbound-dial", 
					"status": state, 
					"duration" : callDuration
				};

				console.log("Note ***** ");
				console.log(note);
				autosaveNoteByUser(note,call,"/core/api/widgets/knowlarity");
			}
		}else{
			resetCallLogVariables();
    		
    		if(message.state == "answered") {    			
    			data.callType = "outbound-dial";
    			data.status = "answered";    			
    			data.contId = null;
    			data.contact_name = "";    			
    			CallLogVariables.dynamicData = data;
    		}

			CallLogVariables.subject = noteSub;
    		CallLogVariables.callWidget = "Knowlarity";
    		CallLogVariables.callType = "outbound-dial";
    		CallLogVariables.phone = customerNumber;
    		CallLogVariables.duration = callDuration;;
    		CallLogVariables.status = state;

    		var jsonObj = {};
    		jsonObj['phoneNumber'] = message.contact_number;
    		return showContactMergeOption(jsonObj);
		}
	}

	var message = {
		state : "connecting",
		number : "+918919198785",
		callId : "+919908164425",
		displayName : "Premnath",
		callType : ""
	}	

	//saveCallNoteOzonetel(message);	
}



function changeCallNotyBasedOnStatus(event){

	if(event){

		var callDirection = event.call_direction;
		var eventType = event.event_type;
		var type = event.type;
		var callType = event.Call_Type;
		var agentNumber = event.agent_number;		
		var knowlarityNumber = event.knowlarity_number;
		var customerNumber = event.caller;
		//"customer_number": "+919052500344",
		console.log("Event type : "+eventType);
		console.log("Type : "+type);
		console.log("callDirection : "+callDirection);

		if(callDirection){
			if(callDirection == "Outbound"){
				if(eventType){				
					if(eventType == "AGENT_CALL"){
						KNOWLARITY_PREVIOUS_EVENT = "AGENT_CALL";									
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];						
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "connecting", globalCall.callNumber, btns);
					}else if(eventType == "CUSTOMER_CALL"){
						KNOWLARITY_PREVIOUS_EVENT = "CUSTOMER_CALL";
						var json = {"callId": agentNumber};				
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];							
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "ringing", globalCall.callNumber, btns, json);					
					}else if(eventType == "BRIDGE"){
						KNOWLARITY_PREVIOUS_EVENT = "BRIDGE";
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];	
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "connected", globalCall.callNumber, btns);					
					}else if(KNOWLARITY_PREVIOUS_EVENT && KNOWLARITY_PREVIOUS_EVENT == "BRIDGE" && eventType == "HANGUP"){
						KNOWLARITY_PREVIOUS_EVENT = "HANGUP";
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];	
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "answered", globalCall.callNumber, btns);					
					}else if(KNOWLARITY_PREVIOUS_EVENT && KNOWLARITY_PREVIOUS_EVENT == "AGENT_CALL" && eventType == "HANGUP"){
						KNOWLARITY_PREVIOUS_EVENT = "HANGUP";
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];	
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "failed", globalCall.callNumber, btns);					
					}
				}
			}
			// else if(callDirection == "Inbound"){
			// 	if(eventType){			
			// 		if(eventType == "ORIGINATE"){
			// 			KNOWLARITY_PREVIOUS_EVENT = "ORIGINATE"; 
			// 			searchForContactImg(customerNumber, function(currentContact){
			// 				if(!currentContact){
			// 					globalCall.contactedContact = {};
			// 					globalCall.contactedId = "";
			// 				}else{
			// 					globalCall.contactedContact = currentContact;
			// 					globalCall.contactedId = currentContact.id;
			// 				}
							
			// 				globalCall.callNumber = customerNumber;

			// 				var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];	
			// 				var json = {"callId": customerNumber};
			// 				showDraggableNoty("Knowlarity", globalCall.contactedContact, "incoming", globalCall.callNumber, btns,json);
			// 			});									
			// 		}else if(KNOWLARITY_PREVIOUS_EVENT == "ORIGINATE" && eventType == "BRIDGE"){
			// 			KNOWLARITY_PREVIOUS_EVENT = "BRIDGE";					
			// 			var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];	
			// 			showDraggableNoty("Knowlarity", globalCall.contactedContact, "connected", globalCall.callNumber, btns);	
			// 		}else if(KNOWLARITY_PREVIOUS_EVENT && KNOWLARITY_PREVIOUS_EVENT == "BRIDGE" && eventType == "HANGUP"){
			// 			KNOWLARITY_PREVIOUS_EVENT = "HANGUP";
			// 			var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];	
			// 			showDraggableNoty("Knowlarity", globalCall.contactedContact, "answered", globalCall.callNumber, btns);						
			// 		}
			// 	}	
			// }
		}

		if(callType && type && type == "CDR"){
			if(callType == "Outgoing"){
				KNOWLARITY_PREVIOUS_EVENT = undefined;
				closeCallNoty(true);	
				saveCallNoteKnolarity(event);						
			}
			// else if(callType == "Incoming"){
			// 	KNOWLARITY_PREVIOUS_EVENT = undefined;
			// 	closeCallNoty(true);
			// }
		}
	}	
}

function knowlarityEventsFinder(SR_API_KEY){
	console.log("In event source created");
	
	var notificationURL = "https://konnect.knowlarity.com:8100/update-stream/"+SR_API_KEY+"/konnect";
	knowlaritySource = new EventSource(notificationURL);
	knowlaritySource.onopen = function (event) {
		console.log("*** event source onopened *** ");
		//console.log(event);
	},
	knowlaritySource.onmessage = function (event) {
		console.log('***** Received an event *****');
		//console.log(event);
		var data = JSON.parse(event.data);				
		changeCallNotyBasedOnStatus(data);
		//console.log(JSON.stringify(data));
	},
	knowlaritySource.onerror = function (event) {
		console.log("*** event source got error *** ");
		//console.log(event);
	}
}

function knowlarityDailer(responceObject, to, contact){

	var knowlarityNumber = responceObject.knowlarityNumber;
	var agentNumber = responceObject.agentNumber;
	var authCode = responceObject.apiKEY;
	var appCode = responceObject.app_code;
	var channel = responceObject.knowlarity_channel;	

	globalCall.contactedContact = contact;
	globalCall.callNumber = to;

	//console.log("Knowlarity url : "+url);

	var dataObj = {
	  "k_number": knowlarityNumber,
	  "agent_number": agentNumber,
	  "customer_number": to
	};

	//console.log(knowlarityNumber+" : "+agentNumber+" : "+authCode+" : "+appCode+" : "+channel);

	var requestURL = "https://kpi.knowlarity.com/"+channel+"/v1/account/call/makecall";

	//console.log(requestURL);

	$.ajax({
		headers : {
				"Accept-Language" : "en_US",			
				"Authorization" : authCode,
				"x-api-key" : appCode
		},
		url : requestURL,
		type : "POST",		
		data : JSON.stringify(dataObj),
		success : function(result) {
			console.log("Knowlarity *** success : "+ JSON.stringify(result));						
			//{{agile_lng_translate 'other' 'cancel'}}			
			console.log(to + " : "+ contact);				
		},
		error : function(result) {
			console.log("Knowlarity *** error : "+ JSON.stringify(result));								
		}
	});
}


function startKnowlarityWidget(contact_id){
	KNOWLARITY_PLUGIN_NAME = "Knowlarity";

	KNOWLARITY_UPDATE_LOAD_IMAGE = '<center><img id="knowlarity_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';
	var knowlarity_widget = agile_crm_get_widget(KNOWLARITY_PLUGIN_NAME);
	console.log(knowlarity_widget);
	KNOWLARITY_Plugin_Id = knowlarity_widget.id;	
	Email = agile_crm_get_contact_property('email');

	$('#Knowlarity').html('<div class="wrapper-sm">No Logs</div>');
	
	$(".contact-make-call-div").off("click", ".Knowlarity_call");
	$(".contact-make-call-div").on("click", ".Knowlarity_call", function(e){
		e.preventDefault();
		e.stopPropagation();
		var contactDetailsObj = agile_crm_get_contact();
		var contactPhoneNumber = $(this).closest(".contact-make-call").attr("phone");		
   		knowlarityDailer(KnowlarityWidgetPrefs, contactPhoneNumber, contactDetailsObj);		
	});
}