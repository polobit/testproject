/**
 * This page contains all the click or other events related to Bria calling
 * 
 *@author Prakash 
 */
 //callDirection : Incoming, Outgoing
 //callStatus :Ideal, Incoming,Missed,  Connecting,Connected,  Ended,Failed
var chromeExtensionInstalled = false;
$(function(){
	var evt = document.createEvent('Event');
	evt.initEvent('asteriskplugincheck', true, false);
	document.dispatchEvent(evt);
	console.log("============="+chromeExtensionInstalled);

	window.addEventListener("asteriskplugindata", function(evt) {
    	if(evt.detail == "success"){
    		var btns = [{"id":"", "class":"btn btn-default btn-sm noty_ozonetel_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];
    		var client = globalCall.calledFrom;
			showDraggableNoty(client, globalCall.contactedContact , "connected", globalCall.callNumber, btns);
    	}else{
    		var msgType = "error";
			var msg = "Error while connecting the call. Extension does not exist.";
			showNotyPopUp(msgType , msg, "bottomRight");
    	}
	}, false);

	$('#content').on('click', '.Asterisk_call', function(e){
	  	e.preventDefault();
	  	e.stopPropagation(); 
	  	if($('.plugin-installed').css('display') == 'none'){
	  		chromeExtensionInstalled = true;
	  	}
	  	console.log("============="+chromeExtensionInstalled);
		if(checkForActiveCall()){
			$('#callInfoModal').html(getTemplate("callStatusModal"));
			$('#callInfoModal').modal('show');
			$('#callStatusModal_title').html("{{agile_lng_translate 'widgets' 'asterisk'}}");
			
			return;
		}
		var contactDetailsObj = agile_crm_get_contact();
		var cnt = get_contact_json_for_merge_fields(contactDetailsObj);
		var num = $(this).closest(".contact-make-call").attr("phone");
		cnt['phone'] = num;
		try{
				var prefs = {};
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
				if (!asterisk_widget){
					console.log("widget is not ready");
					return;
				}

				if(typeof(asterisk_widget.prefs) == "string"){

					//prefs = replaceMergeFields(asterisk_widget.prefs);
					//prefs = JSON.parse(prefs);		
					var template = Handlebars.compile(asterisk_widget.prefs);
					prefs = template(cnt);
					prefs = eval("(" + prefs + ")");
					//asterisk_widget.prefs = eval("(" + asterisk_widget.prefs + ")");
				}	
		
				
				var manager_details = {};
				manager_details["id"] = prefs.manager_id;
				manager_details["password"] = prefs.manager_password;
				manager_details["hostname"] = prefs.asterisk_hostname;
				var asterisk_details = {};
				asterisk_details["channel"] = prefs.asterisk_call_channel;
				asterisk_details["context"] = prefs.asterisk_call_context;
				asterisk_details["extension"] = prefs.asterisk_call_extension;
				asterisk_details["callerId"] = prefs.asterisk_call_callerId
				//asterisk_details["variables"] = asterisk_widget.prefs.asterisk_call_variables;
				asterisk_details["timeout"] = prefs.asterisk_call_timeout;
				asterisk_details["priority"] = prefs.asterisk_call_priority;
				var asterisk_details_long = {};
				asterisk_details_long["variables"] = prefs.asterisk_call_variables;


			  	var action ={};
			  	action['command'] = "startCall";
			  	action['number'] = asterisk_details["extension"];	
			  	action['callId'] = "";

				}catch(e){
					console.log("exception occured while calling -->" + e)
					return;
				}

		globalCall.callStatus = "dialing";
		globalCall.calledFrom = "Asterisk";
		
		try{
			
			globalCall.contactedId = contactDetailsObj.id;
			globalCall.contactedContact = contactDetailsObj;
		}catch (e) {
		}
		setTimerToCheckDialing("Asterisk");
		globalCall.callDirection = "Outgoing";
		if(!chromeExtensionInstalled){
			sendActionToClient(action,manager_details,asterisk_details,asterisk_details_long);
		}else{
			var asterisk_data = {};
			asterisk_data.manager_id = prefs.manager_id;
			asterisk_data.password = prefs.password;
			asterisk_data.asterisk_hostname = prefs.asterisk_hostname;
			asterisk_data.asterisk_call_channel = prefs.asterisk_call_channel;
			asterisk_data.asterisk_call_context = prefs.asterisk_call_context;
			asterisk_data.asterisk_call_extension = prefs.asterisk_call_extension;
			asterisk_data.asterisk_call_callerId = prefs.asterisk_call_callerId;
			asterisk_data.asterisk_call_timeout = prefs.asterisk_call_timeout;
			asterisk_data.asterisk_call_priority = prefs.asterisk_call_priority;
			asterisk_data.asterisk_call_variables = prefs.asterisk_call_variables;
			asterisk_data.num = num;
			asterisk_data.data_from = "asteriskwidget";

			window.postMessage(asterisk_data,"*");
			var domain = CURRENT_DOMAIN_USER['domain'];
			var id = CURRENT_DOMAIN_USER['id'];
			var command = action.command;
			var number = action.number;
			var callid = action.callId;
			var client = globalCall.calledFrom;
			
			if(command == "startCall"){
				var btns = [];
				showDraggableNoty(client, globalCall.contactedContact , "dialing", globalCall.callNumber, btns);
				globalCall.callDirection = "Outgoing";
				globalCall.callStatus = "dialing";
				globalCall.callNumber = number;
			}
		}
	});

	$('body').on('click', '.contact-make-bria-call, .Bria_call', function(e)
	{
	  	e.preventDefault();
	  	e.stopPropagation();
		if(checkForActiveCall()){
			$('#briaInfoModal').html(getTemplate("briaCallStatusModal"));
			$('#briaInfoModal').modal('show');
			return;
		}
		var action ={};
	  	action['command'] = "startCall";
	  	action['number'] = $(this).closest(".contact-make-call").attr("phone");
	  	action['callId'] = "";

	  	
		try{
			closeCallNoty(true);
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
			globalCall.callStatus = "dialing";
			globalCall.calledFrom = "Bria";
			setTimerToCheckDialing("bria");
			var contactDetailsObj = agile_crm_get_contact();
			globalCall.contactedId = contactDetailsObj.id;
			globalCall.contactedContact = contactDetailsObj;
		  	sendActionToClient(action);
		}catch (e) {
		}
	});
	
	
	// this function is used to make call frn skype
	$('body').on('click', '.Skype_call', function(e)
			{
			  	e.preventDefault();
			  	e.stopPropagation();
				var action ={};
			  	action['command'] = "startCall";
			  	action['number'] = $(this).closest(".contact-make-call-div").children().first().attr("phone");
			  	action['callId'] = "";
			  	
				if(checkForActiveCall()){
					$('#skypeInfoModal').html(getTemplate("skypeCallStatusModal"));
					$('#skypeInfoModal').modal('show');
					return;
				}
				
				try{
					closeCallNoty(true);
					resetglobalCallVariables();
					resetglobalCallForActivityVariables();
				}catch(e){
				}
				
				globalCall.callStatus = "dialing";
				globalCall.calledFrom = "Skype";
				setTimerToCheckDialing("skype");
				try{
					var contactDetailsObj = agile_crm_get_contact();
					globalCall.contactedId = contactDetailsObj.id;
					globalCall.contactedContact = contactDetailsObj;
					sendActionToClient(action);
				}catch (e) {
				}
			});
	



	
// }


//call script button
	$('body #wrap #agilecrm-container').on('click', '.noty_call_callScript', function(e)
		{
			e.preventDefault();
			$("#draggable_noty").find(".draggable_noty_callScript").toggle();
			
			if($("#draggable_noty").find(".draggable_noty_callScript").is(':visible')){
				$("#draggable_noty").find(".draggable_noty_callScript").html($(getTemplate("callScript")));	
				var contact = $(this).data("contact");
				showvalue(contact);
				}
	  });
	
	
//answer the callT
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_answer, .noty_skype_answer, .noty_asterisk_answer', function(e)
		{
			e.preventDefault();
			var json = {"command" : "answerCall"};
		  	var action = makeCallAction(json);
		  	sendActionToClient(action);
		  	globalCallForActivity.answeredByTab = true;
		  	play_sound("dtmf");
	  });
	  
//ignore the incoming call
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_ignore, .noty_skype_ignore', function(e)
		{
			e.preventDefault();
			var json = {"command" : "ignoreCall"};
		  	var action = makeCallAction(json);
		  	//globalCall.callStatus = "Missed";
		  	sendActionToClient(action);
		  	globalCallForActivity.answeredByTab = true;
		  	play_sound("dtmf");
	});


//hang up the call	
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_hangup, .noty_skype_hangup, .noty_asterisk_hangup', function(e)
		{
		
		e.preventDefault();
		if(globalCall.lastSent){
			if(globalCall.lastSent == "endCall"){
				console.log("duplicate command recived endCall");
				closeCallNoty(true);
				return;
			}
		}	
		var json = {"command" : "endCall"};
	  	var action = makeCallAction(json);
	  	sendActionToClient(action);
	  	play_sound("dtmf");	
	  	
	});


//cancel the outgoing call	
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_cancel, .noty_skype_cancel, .noty_asterisk_cancel', function(e)
	{
		
		e.preventDefault();
		if(globalCall.lastSent){
			if(globalCall.lastSent == "cancelCall"){
				console.log("duplicate command recived endCall");
				closeCallNoty(true);
				return;
			}
		}
		var json = {"command" : "cancelCall"};
	  	var action = makeCallAction(json);
	  	sendActionToClient(action);
	  	play_sound("dtmf");
	  	
	});

	
//show dialpad	 ---note implemented
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_dialpad, .noty_skype_dialpad, .noty_asterisk_dialpad', function(e)
	{
	e.preventDefault();
	e.stopPropagation();
	$('#dialpad_btns').toggle();
	if($('#dialpad_btns:visible').length > 0){
		$("#panel-body1, #draggable-noty" ).css({"height":"150px"});
	}else{
		$("#panel-body1, #draggable-noty" ).css({"height":"45px"});
	}
	});


//this is to close the dialpad when clicked anywhere in screen
	$(document).on('click', function(e){
		if($('#dialpad_btns').length !=0){
			$('#dialpad_btns').hide();
			$("#panel-body1, #draggable-noty" ).css({"height":"45px"});
		}
	});	
	
// this is used to prevent dialpad from closing 	
	$('body #wrap #agilecrm-container').on('click', '#dialpad_btns', function(e)	{
		e.stopPropagation();
	});
// this is to call onclick of checkbox in add/update contact	
	$('body').on('click', '#call_newNumber_check', function(e)
			{
							$(this).attr("checked");
							var opt = $(this).val();
							if(opt == "update"){
								$("#call_newNumber_relatedTo_div").show();
								//$("#rampTimeButton").removeAttr('disabled');
							}else{
								$("#call_newNumber_relatedTo_div").hide();
							}
			});
	
//this function is called when the continue button is clicked on add new contact in call	
	$('body').on("click","#call_newNumber_btn_continue",function(e)
	{
		e.preventDefault();
		
		CallLogVariables.processed = true;
		var opt = $("#call_newNumber_check:checked").val();
		//var phoneNumber = $("#mergeContactModal","#call_newNumber_btn_continue").data("phoneNumber");
		var phoneNumber = $(this).data("phoneNumber");
		if(!phoneNumber){
			$("#mergeContactModal").modal('hide');
			return;
		}
		
		if(opt == "new"){
			$("#mergeContactModal").modal('hide');
			  setTimeout(function(){
				  showNewContactModal(phoneNumber);
			 },2);
			
		}else{
			//take the contact and move to edit contact page
			/*if update show new contact and log call
			if selected contact is type contact then 
			1)if continue - show log call
			2)if cance - save activities
			if selected is type companies then
			1) if continue - show log call 
			2)if cancel - save activities;*/
			
			//var contactId = $("#call_newNumber_relatedTo_div").find(".tagsinput:first li:nth-child(1)").attr("data");
			var contactId = $("#relates_to_call_contact_ul li").attr("data");
			if(!contactId){
				$("#relates_to_call_error").show().delay(3000).hide(1);
				console.log("error no contact found");
				return;
			}
			
			accessUrlUsingAjax("core/api/contacts/"+contactId, function(data){
				if(!data){
					console.log("no contact found");
					return;
				}
				var json = {};
				json['phoneNumber'] = phoneNumber;
				$("#mergeContactModal").modal('hide');
				 setTimeout(function(){
					 proessEditPage(data,json);
				 },2);
			});
		}
	});
	
	$('#mergeContactModal').on('hidden.bs.modal', function (e) {
		if(CallLogVariables.callWidget){

			if(CallLogVariables.processed){
				CallLogVariables.processed = false;
					return;
			}
			try{
				//if the data is not there - it means call status is not completed - so we log the activities of the call
				var widgetType = CallLogVariables.callWidget.toLowerCase();
				var direction = CallLogVariables.callType;
				var phoneNumber = CallLogVariables.phone;
				var status = CallLogVariables.status;
				var duration = CallLogVariables.duration;
				var url = "/core/api/widgets/" + widgetType + "/savecallactivity";
				
				
				//url is : 
				//1)twilio : /core/api/widgets/twilio/savecallactivity
				//2)bria : /core/api/widgets/bria/savecallactivity
				//3)skype: /core/api/widgets/skype/savecallactivity
				
				$.post( url,{
				direction: direction, 
				phone: phoneNumber, 
				status : status,
				duration : duration 
				});
				resetCallLogVariables();
			}catch(e){
			}
		}	
		
	});
	
});

function makeCallAction(json){
	
	var action = {};
	action['command'] = json.command;
	try{
		action['number'] = $("#notyCallDetails").attr("number");
		action['callId'] = $("#notyCallDetails").attr("callId");
	}catch(e){
	}
	return action;
}
//function for sending DTMF
function sendDTMF(digit)
{
	var caller_id;
	caller_id= $("#notyCallDetails").attr("callId"); 		
	if(digit){
			play_sound("dtmf");
			var action = {"command":  "sendDTMF", "number": digit, "callId": caller_id};
			sendActionToClient(action);
			return;
	}
}

// This function sends the command to local jar running in client side to make the call
//{paramerters} -- command to execute, number to call and call id of the ingoing call if any

function sendActionToClient(action, manager, asterisk, long_details){
	
	var domain = CURRENT_DOMAIN_USER['domain'];
	var id = CURRENT_DOMAIN_USER['id'];
	var command = action.command;
	var number = action.number;
	var callid = action.callId;
	var client = globalCall.calledFrom;
	
	if(command == "startCall"){
		var btns = [];
		showDraggableNoty(client, globalCall.contactedContact , "dialing", globalCall.callNumber, btns);
		globalCall.callDirection = "Outgoing";
		globalCall.callStatus = "dialing";
		globalCall.callNumber = number;
	}
	var image = new Image();
	image.onload = function(png) {
		console.log("client sucess");
		globalCall.lastSent =  command;
		window.focus();
	};
	image.onerror= function(png) {
		return;
		console.log("client failure");
		window.focus();
		if(command != "getLogs"){
			resetglobalCallVariables();	
		}
		if(command == "getLogs"){
			var message ={};
			message["data"] = "";
			if(client == "Bria"){
				handleLogsForBria(message);		
			}else if(client == "Skype"){
				handleLogsForSkype(message);
			}
			showCallNotyMessage("Executable file is not running");
			return;
		}
		
		
		if(client == "Bria"){
			$('#briaInfoModal').html(getTemplate("briaInfoModal"));
			$('#briaInfoModal').modal('show');
			closeCallNoty(true);
			return;
		}else if(client == "Skype"){
			$('#skypeInfoModal').html(getTemplate("skypeInfoModal"));
			$('#skypeInfoModal').modal('show');
			closeCallNoty(true);
			return;
		}else if(client == "Asterisk"){
			closeCallNoty(true);
		//	$('#callInfoModal').html(getTemplate("callInfoModal"));
		//	$('#callInfoModal').modal('show');
		//	$('#callModal_title').html("{{agile_lng_translate 'widgets' 'asterisk'}}");
		//	$('#downloadCallJar_widget').attr("widget-name","Asterisk");
			return;
		}
	};
	if(client == "Asterisk"){
		if(command == "startCall"){
			image.src = "http://localhost:33333/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type=Asterisk;mName="+manager.id+";mPass="+manager.password+";ip=" +manager.hostname+";channel="+asterisk.channel+";context="+asterisk.context+";exten="+asterisk.extension+";callerId="+asterisk.callerId+";timeout="+asterisk.timeout+";priority="+asterisk.priority+";variables="+long_details.variables+"?";	
		}else{
			image.src = "http://localhost:33333/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type=Asterisk?";	
		}
	return;	
	}

	image.src = "http://localhost:33333/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type="+client+"?";
}




/*
 * This will save the note for the call
 */
function autosaveNoteTelephony(note,call){
	$.post( "/core/api/widgets/twilio/autosavenote", {
		subject: note.subject,
		message: note.message,
		contactid: note.contactid,
		phone: note.phone,
		callType: note.callType,
		status: note.status,
		duration: note.duration},
		function(data){

			var callerObjectId = call.contactId;

		$.post("/core/api/call/widgets/savecallactivity?note_id="+data.id,{
			id:callerObjectId,
			direction: call.direction, 
			phone: call.phone, 
			status : call.status,
			duration : call.duration,
			callWidget : call.client 
			});
		});
}



/*
 * This will show the note to the user after the call is completed sucessfully
 */
function saveCallNoteTelephony(call){
	
	if(!globalCallForActivity.callDirection || !globalCallForActivity.callStatus  || !globalCallForActivity.callNumber){
		return;
	}
	
	var callStatus = globalCallForActivity.callStatus;
	var direction = globalCallForActivity.callDirection;
	var number = globalCallForActivity.callNumber;
	var callId = globalCallForActivity.callId;
	var duration = globalCallForActivity.duration;
	var cntId = globalCallForActivity.contactedId;
	var client = globalCall.calledFrom;
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
	    			data.url = "/core/api/call/widgets/";
	    			data.subject = noteSub;
	    			data.number = number;
	    			data.callType = "inbound";
	    			data.status = "answered";
	    			data.duration = duration;
	    			data.contId = null;
	    			data.contact_name = "";
	    			data.widget = client;
	    			CallLogVariables.dynamicData = data;
	    		}
	    			CallLogVariables.subject = noteSub;
		    		CallLogVariables.callWidget = client;
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
	    	if(callStatus == "Answered"){
	    		
				var data = {};
				data.url = "/core/api/call/widgets/";
				data.subject = noteSub;
				data.number = number;
				data.callType = "inbound";
				data.status = "answered";
				data.duration = duration;
				data.contId = contact.id;
				data.contact_name = contact_name;
				data.widget = client;
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
				call.client = client;
				autosaveNoteTelephony(note,call);
	    	}
	    });
	}else{
		
		if(cntId){
				if( callStatus == "Answered"){
					twilioIOSaveContactedTime();
					accessUrlUsingAjax("core/api/contacts/"+cntId, function(resp){
					var json = resp;
					if(json == null) {
						return;
					}

					contact_name = getContactName(json);
					var data = {};
					data.url = "/core/api/call/widgets/";
					data.subject = noteSub;
					data.number = number;
					data.callType = "outbound-dial";
					data.status = "answered";
					data.duration = duration;
					data.contId = cntId;
					data.contact_name = contact_name;
					data.widget = client;
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
					call.client = client;
					autosaveNoteTelephony(note,call);
				}
		}else{
				resetCallLogVariables();
				if(callStatus == "Answered") {
    			var data = {};
    			data.url = "/core/api/call/widgets/";
    			data.subject = noteSub;
    			data.number = number;
    			data.callType = "outbound-dial";
    			data.status = "answered";
    			data.duration = duration;
    			data.contId = null;
    			data.contact_name = "";
    			data.widget = client;
    			CallLogVariables.dynamicData = data;
    		}
    			CallLogVariables.subject = noteSub;
	    		CallLogVariables.callWidget = client;
	    		CallLogVariables.callType = "outbound-dial";
	    		CallLogVariables.phone = number;
	    		CallLogVariables.duration = duration;
	    		CallLogVariables.status = callStatus;
    			var jsonObj = {};
				jsonObj['phoneNumber'] = number;
				return showContactMergeOption(jsonObj);
	}
	}
}

function generateNumberAndExtension(number, json){
	 var num = "";
	 var ext = "";
	 
	 if(number && number.indexOf(";") != -1){
	  ext = number.split(";")[1];
	  num = number.split(";")[0];
	 }else{
	  num = number;
	 }

	 json['number'] = num;
	 json['extension'] = ext;
	 return;
}