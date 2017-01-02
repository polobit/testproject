function loadAndroidEvents(){
	$('body').off('click', '.noty_android_cancel');
	$('body').on('click', '.noty_android_cancel', function(e){
		e.preventDefault();
		console.log("Android call canceld from noty");
		closeCallNoty(true);
	});
}

var isAndNotificationCame = false;
loadAndroidEvents();

function saveCallNoteAndroid(message){

	console.log("Event data : **** ");
	console.log(event);

	var callDirection = message.direction;
	var state = message.state;
	var customerNumber = message.contact_number;	

	if(customerNumber && customerNumber.indexOf(" ") == 0){		
		customerNumber = customerNumber.replace(" ","+");
	}

	var callDuration = message.duration;
	var agentNumber = message.phone_no;	
	

	console.log("callDirection : in Android "+callDirection);

	if(state){
		if(state == "ANSWERED"){
			state = "answered";
		}else if(state == "AGENT_MISSED" || state == "FAILED"){
			state = "failed";
		}
	}

	var noteSub = callDirection + " Call - " + state;
	var cntId;

	if(globalCall && globalCall.contactedContact){
		cntId = globalCall.contactedContact.id; // agilecrm DB ID
	}

	var data = {};
	data.url = "/core/api/widgets/android/";
	data.subject = noteSub;
	data.number = customerNumber;
	data.callType = "inbound";	
	data.duration = callDuration;
	data.contId = null;
	data.contact_name = "";
	data.widget = "Android";

	if(callDirection == "Outgoing") {
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

				var call = {
					"direction" : callDuration,
					"phone" : customerNumber,
					"status" : state, 
					"duration" : callDuration, 
					"contactId" : cntId
				};

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
				autosaveNoteByUser(note,call,"/core/api/widgets/android");
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
    		CallLogVariables.callWidget = "Android";
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



function androidCallNoty(message){
	if(message){
		isAndNotificationCame = true;
		var callDirection = message.direction;
		var state = message.state;
		var customerNumber = message.contact_number;
		var eventType = message.event_type;

		if(callDirection){
			if(callDirection == "Outgoing"){
				if(eventType == "CALL"){
					if(state){
						if(state == "INITIATED"){
							var btns = [{"id":"", "class":"btn btn-default btn-sm noty_android_cancel", "title": _agile_get_translated_val('widgets', 'Android-cancel') }];						
							showDraggableNoty("Knowlarity", globalCall.contactedContact, "connecting", globalCall.callNumber, btns);
						}
					}
				}
			}

			if(eventType == "CDR"){		
				closeCallNoty(true);	
				saveCallNoteAndroid(message);	
				isAndNotificationCame = false;		
			}
		}
	}	
}

function appDialer(to, contact){
	console.log("app dialer called **** ");
	console.log(to);
	console.log(contact);
	if(to){

		globalCall.contactedContact = contact;
		globalCall.callNumber = to;

		to = to.replace("+", "%2B");

		var requestURL = "core/api/widgets/android/call?phone_number="+to;	 
	 	console.log(requestURL);
	 
	 	$.ajax({	
	 		url : requestURL,
	 		type : "GET",	 		
	 		success : function(result) {
	 			var btns = [{"id":"", "class":"btn btn-default btn-sm noty_android_cancel", "title": _agile_get_translated_val('widgets', 'Android-cancel')}];						
				showDraggableNoty("Knowlarity", globalCall.contactedContact, "connecting", globalCall.callNumber, btns);
				setTimeout(function(){ 
					if(!isAndNotificationCame){
						closeCallNoty(true);
					}
				}, 10000);

	 			console.log("android *** success : "+ JSON.stringify(result));	 			
	 			console.log(to + " : "+ contact);	
	 			//androidCallNoty(result);			
	 		},error : function(result) {
	 			console.log("android *** error : "+ JSON.stringify(result));								
	 		}
	 	});
 	}
}

function startAndroidWidget(contact_id){
	ANDROID_PLUGIN_NAME = "Android";

	ANDROID_UPDATE_LOAD_IMAGE = '<center><img id="android_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var android_widget = agile_crm_get_widget(ANDROID_PLUGIN_NAME);

	console.log(android_widget);

	ANDROID_Plugin_Id = android_widget.id;	
	
	$('#Android').html("No Logs");

	$(".contact-make-call-div").off("click", ".Android_call");
 	$(".contact-make-call-div").on("click", ".Android_call", function(e){
 		e.preventDefault();
 		e.stopPropagation();
 		var contactDetailsObj = agile_crm_get_contact();
 		var contactPhoneNumber = $(this).closest(".contact-make-call").attr("phone");		
 	 	appDialer(contactPhoneNumber, contactDetailsObj);	
 	});
}