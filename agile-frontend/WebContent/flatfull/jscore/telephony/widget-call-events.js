/**
 * This page contains all the click or other events related to Bria calling
 * 
 *@author Prakash 
 */
 //callDirection : Incoming, Outgoing
 //callStatus :Ideal, Incoming,Missed,  Connecting,Connected,  Ended,Failed

$(function()
{
	
	$('body').on('click', '.contact-make-bria-call, .Bria_call', function(e)
	{
	  	e.preventDefault();
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
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_answer, .noty_skype_answer', function(e)
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
		  	sendActionToClient(action);
		  	globalCallForActivity.answeredByTab = true;
		  	play_sound("dtmf");
	});


//hang up the call	
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_hangup, .noty_skype_hangup', function(e)
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
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_cancel, .noty_skype_cancel', function(e)
	{
		
		e.preventDefault();
		if(globalCall.lastSent){
			if(globalCall.lastSent == "endCall"){
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
	$('body #wrap #agilecrm-container').on('click', '.noty_bria_dialpad, .noty_skype_dialpad', function(e)
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
	if(digit){
			play_sound("dtmf");
			var action = {"command":  "sendDTMF", "number": digit, "callId": ""};
			sendActionToClient(action);
			return;
	}
}

// This function sends the command to local jar running in client side to make the call
//{paramerters} -- command to execute, number to call and call id of the ingoing call if any

function sendActionToClient(action){
	
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
		globalCall.callStatus = "Dialing";
		globalCall.callNumber = number;
	}
	var image = new Image();
	image.onload = function(png) {
		console.log("client sucess");
		globalCall.lastSent =  command;
		window.focus();
	};
	image.onerror= function(png) {
		console.log("client failure");
		window.focus();
		resetglobalCallVariables();
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
		}
	};
	image.src = "http://localhost:33333/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type="+client+"?";
}


