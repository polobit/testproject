var NOWLARITY_PREVIOUS_EVENT;
var knowlarityOBJ = {};
var showMoreKnowlarityLog = '<div class="widget_tab_footer knowlarity_log_show_more" align="center"><a class="c-p text-info" id="stripe_inv_show_more" rel="tooltip" title="'+_agile_get_translated_val('widgets', 'click-to-see-more-tickets')+'">' +_agile_get_translated_val('widgets', 'show-more')+'</a></div>';

loadKnowlarityBindings();


function loadKnowlarityBindings(){
	$('body').off('click', '.noty_knowlarity_cancel');
	$('body').on('click', '.noty_knowlarity_cancel', function(e){
		e.preventDefault();
		console.log("knowlarity call canceld from noty");
		closeCallNoty(true);
	});
}

function loadKnowlarityLogs(responceObject, to, contact){
	//console.log(knowlarityNumber+" : "+agentNumber+" : "+authCode+" : "+appCode+" : "+channel);

	var knowlarityNumber = responceObject.knowlarityNumber;
	var agentNumber = responceObject.agentNumber;
	var authCode = responceObject.apiKEY;
	var appCode = responceObject.app_code;
	var channel = responceObject.knowlarity_channel;

	var d = new Date();
	var dateTemp = "-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" +5:30";
	var startDate = (d.getFullYear()-5) + dateTemp;
	var endDate = d.getFullYear() + dateTemp;

	var requestURL = "https://kpi.knowlarity.com/"+channel+"/v1/account/calllog";
	requestURL += "?start_time="+startDate;
	requestURL += "&end_time="+endDate;
	requestURL += "&knowlarity_number="+knowlarityNumber;
	requestURL += "&customer_number="+to;
	
	console.log(requestURL);

	$.ajax({
		headers : {
			"Accept-Language" : "en_US",
			"Authorization" : authCode,
			"x-api-key" : appCode
		},
		url : requestURL,
		type : "GET",		
		success : function(result) {
			//getKnowlarityLogs(0);
			console.log("Knowlarity *** success : logs ");
			console.log(JSON.stringify(result));
		},error : function(result) {
			console.log("Knowlarity *** error : logs ");
			console.log(JSON.stringify(result));								
		}
	});	
}

function getKnowlarityLogs(offSet){
	if(offSet == 0){
		var result = {};
		result.logs = knowlarityOBJ.logs.slice(0, 5);

		getTemplate('knolarity-call-logs', result, undefined, function(template_log){			
			$('#invoice_block').append(template_log);
		},null);

		if(knowlarityOBJ.logs.length > 5){
			$('#invoice_block').append(showMoreKnowlarityLog);
		}
	}else if(offSet > 0  && (offSet+5) < knowlarityOBJ.logs.length){
		var result = {};
		result.logs = knowlarityOBJ.logs.slice(offSet, (offSet+5));
		$('.knowlarity_log_show_more').remove();
		$('#invoice_block').apped(getTemplate('knolarity-call-logs', result));
		$('#invoice_block').append(showMoreKnowlarityLog);
	}else{
		var result = {};
		result.logs = knowlarityOBJ.logs.slice(offSet, knowlarityOBJ.logs.length);
		$('.knowlarity_log_show_more').remove();
		$('#invoice_block').append(getTemplate('knolarity-call-logs', result));
	}
}


function saveCallNoteKnolarity(event){

	console.log("Event data : **** ");
	console.log(event);

	var callDirection = event.call_direction;
	var eventType = event.event_type;
	var type = event.type;
	var callType = event.Call_Type;
	var agentNumber = event.agent_number;		
	var knowlarityNumber = event.knowlarity_number;
	var customerNumber = event.caller_id;
	var state = event.business_call_type;
	var callDuration = 0;

	console.log("callDirection : in knowlarity_load "+callDirection);

	if(event.call_duration){
		callDuration = event.call_duration;
	}

	if(state){
		if(state == "Phone"){
			state = "answered";
		}else if(state == "Agent Missed"){
			state = "failed";
		}else if(state == "Customer Missed"){
			state = "busy";
		}
	}

	var noteSub = callType + " Call - " + state;
	var cntId;

	if(globalCall && globalCall.contactedContact){
		cntId = globalCall.contactedContact.id; // agilecrm DB ID
	}

	var call = { 
		"direction" : callType,
		"phone" : customerNumber,
		"status" : state, 
		"duration" : callDuration, 
		"contactId" : cntId
	};

	var data = {};
	data.url = "/core/api/widgets/knowlarity/";
	data.subject = noteSub;
	data.number = customerNumber;
	data.callType = "inbound";	
	data.duration = callDuration;
	data.contId = null;
	data.contact_name = "";
	data.widget = "Knowlarity";

	console.log(callType +" : "+ state);

	if(callType == "Incoming"){		

	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+customerNumber, function(responseJson){
	    	if(!responseJson){
	    		alert("not json");

	    		resetCallLogVariables();
	    		
	    		if(state == "answered") {
	    			data.status = "answered";
	    			CallLogVariables.dynamicData = ;
	    		}data

    			CallLogVariables.subject = noteSub;
	    		CallLogVariables.callWidget = "Knowlarity";
	    		CallLogVariables.callType = "inbound";
	    		CallLogVariables.phone = customerNumber;
	    		CallLogVariables.duration = callDuration;
	    		CallLogVariables.status = state;

	    		var jsonObj = {};
	    		jsonObj['phoneNumber'] = customerNumber;

	    		return showContactMergeOption(jsonObj);	    		
	    	}

	    	contact = responseJson;
	    	contact_name = getContactName(contact);
	    	if(state == "answered"){				
				data.status = "answered";		
				data.contId = contact.id;
				data.contact_name = contact_name;
				showDynamicCallLogs(data);
	    	}else{    

	    		var call = { 
					"direction" : callType,
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
    		
    		if(state == "answered") {    			
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
    		jsonObj['phoneNumber'] = customerNumber;
    		return showContactMergeOption(jsonObj);
		}
	}	
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
		
		console.log("*************");
		console.log("Event type : "+eventType);
		console.log("Type : "+type);
		console.log("callDirection : "+callDirection);
		console.log(event);
		console.log("_____________");

		if(callDirection){
			if(callDirection == "Outbound"){
				if(eventType){				
					if(eventType == "AGENT_CALL"){
						KNOWLARITY_PREVIOUS_EVENT = "AGENT_CALL";						
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_knowlarity_cancel", "title": _agile_get_translated_val('widgets', 'Knowlarity-cancel') }];						
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "connecting", globalCall.callNumber, btns);
					}else if(eventType == "CUSTOMER_CALL"){
						KNOWLARITY_PREVIOUS_EVENT = "CUSTOMER_CALL";
						var json = {"callId": agentNumber};				
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_knowlarity_cancel", "title": _agile_get_translated_val('widgets', 'Knowlarity-cancel') }];											
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "ringing", globalCall.callNumber, btns, json, callDirection);					
					}else if(eventType == "BRIDGE"){
						KNOWLARITY_PREVIOUS_EVENT = "BRIDGE";
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_knowlarity_cancel", "title": _agile_get_translated_val('widgets', 'Knowlarity-cancel') }];						
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "connected", globalCall.callNumber, btns);					
					}else if(eventType == "HANGUP"){
						KNOWLARITY_PREVIOUS_EVENT = "HANGUP";										
					}
				}
			}else if(callDirection == "Inbound"){
				if(eventType){			
					if(eventType == "ORIGINATE"){
						KNOWLARITY_PREVIOUS_EVENT = "ORIGINATE"; 
						searchForContactImg(customerNumber, function(currentContact){
							if(!currentContact){
								globalCall.contactedContact = {};
								globalCall.contactedId = "";
							}else{
								globalCall.contactedContact = currentContact;
								globalCall.contactedId = currentContact.id;
							}
							
							globalCall.callNumber = customerNumber;

							var btns = [{"id":"", "class":"btn btn-default btn-sm noty_knowlarity_cancel", "title": _agile_get_translated_val('widgets', 'Knowlarity-cancel') }];		
							var json = {"callId": customerNumber};
							showDraggableNoty("Knowlarity", globalCall.contactedContact, "incoming", globalCall.callNumber, btns,json);
						});									
					}else if(KNOWLARITY_PREVIOUS_EVENT == "ORIGINATE" && eventType == "BRIDGE"){
						KNOWLARITY_PREVIOUS_EVENT = "BRIDGE";					
						var btns = [{"id":"", "class":"btn btn-default btn-sm noty_knowlarity_cancel", "title": _agile_get_translated_val('widgets', 'Knowlarity-cancel') }];		
						showDraggableNoty("Knowlarity", globalCall.contactedContact, "connected", globalCall.callNumber, btns);	
					}else if(eventType == "HANGUP"){
						KNOWLARITY_PREVIOUS_EVENT = "HANGUP";												
					}
				}	
			}
		}

		if(callType && type && type == "CDR"){
			if(callType == "Outgoing"){
				KNOWLARITY_PREVIOUS_EVENT = undefined;
				closeCallNoty(true);	
				saveCallNoteKnolarity(event);						
			}else if(callType == "Incoming"){
				KNOWLARITY_PREVIOUS_EVENT = undefined;
				closeCallNoty(true);
				saveCallNoteKnolarity(event);
			}
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
	var contactDetailsObj = agile_crm_get_contact();

	KNOWLARITY_Plugin_Id = knowlarity_widget.id;	
	Email = agile_crm_get_contact_property('email');

	$('#Knowlarity').html('<div class="wrapper-sm">No Logs</div>');
	
	$(".contact-make-call-div").off("click", ".Knowlarity_call");
	$(".contact-make-call-div").on("click", ".Knowlarity_call", function(e){
		e.preventDefault();
		e.stopPropagation();

		var contactPhoneNumber = $(this).closest(".contact-make-call").attr("phone");		
   		knowlarityDailer(KnowlarityWidgetPrefs, contactPhoneNumber, contactDetailsObj);		
	});
}