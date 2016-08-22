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
		}
	};
	image.src = "http://localhost:33333/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";type="+client+"?";
}


