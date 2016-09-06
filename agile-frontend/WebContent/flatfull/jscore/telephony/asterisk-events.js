/**
 * This page contains all the click or other events related to Bria calling
 * 
 *@author Prakash 
 */
 var Asterisk_Call_Noty;
 var asterisk_widget;
 //callDirection : Incoming, Outgoing
 //callStatus :Ideal, Incoming,Missed,  Connecting,Connected,  Ended,Failed

 var displayName="";
 
$(function()
{
	

	 $("body").on("click", ".asterisk-advance-settings", function(b) {
        b.preventDefault();
      
        $(".asterisk-advance-settings-hide").toggle();
        $(".asterisk-advance-settings-show").toggle();
        $("#asterisk-div-setting").toggle();
   });



//	This function is to hide the information shown to the client when the user is not running asterisk client
	$('#callInfoModal').on('click', '#callModal_info_ok', function(e)	{
		e.preventDefault();
		$('#callInfoModal').modal('hide');
	});
	
	
// this function is to hide the already on call alert 	
	$('#callInfoModal').on('click', '#callModal_status_ok', function(e)	{
		e.preventDefault();
		$('#callInfoModal').modal('hide');
	});
	
	

	
});


/*
 * this wil create a dynamic message to show in noty - as per the current phhone status
 */
function _getMessageAsterisk(message, callback){
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
	console.log("state--" + state + " number --" + number + "   asteriskCallId" + callId + "  displayName" + displayName);
	
	if (state == "ringing"){
			globalCall.callDirection = "Incoming";
			globalCall.callStatus = "Ringing";
			globalCall.calledFrom = "Asterisk";
			globalCall.callId = callId;
			globalCall.callNumber = number;
			globalCallForActivity.justCalledId = callId;
				
	}else if(state == "connected"){
		if(!globalCall.callDirection){
			globalCall.callDirection = "Outgoing";

		} 
			globalCall.callStatus = "Connected";
			globalCall.callId = callId;
			globalCall.callNumber = number;
			globalCallForActivity.justCalledId = callId;
	
	}else if(state == "missed"){

		globalCall.callDirection = "Incoming";
		globalCall.callStatus = "Missed";
		globalCall.callId = callId;
		globalCall.callNumber = number;
		globalCallForActivity.justCalledId = callId;
		
	}else if(state == "connecting"){

		globalCall.callDirection = "Outgoing";
		globalCall.callStatus = "Connecting";
		
		globalCall.callId = callId;
		globalCall.callNumber = number;
		globalCallForActivity.justCalledId = callId;
		
	}else if(state == "failed"){

		globalCall.callStatus = "Failed";
		globalCallForActivity.justCalledId = callId;
		globalCallForActivity.duration = 0;

		var call = { "direction" : globalCallForActivity.callDirection, "phone" : globalCallForActivity.callNumber,
				"status" : globalCallForActivity.callStatus, "duration" : globalCallForActivity.duration };
		saveCallNoteTelephony();
		saveCallActivityTelephony(call);

	}else if(state == "ended"){
		if(globalCall.lastReceived)	{
			if(globalCall.lastReceived == "lastCallDetail"){
				return;	
			}
		}
		if(globalCall.callStatus && globalCall.callStatus == "Connected"){
			globalCall.callStatus = "Answered"; //change form completed
		}else if(globalCall.callStatus && globalCall.callStatus == "Ringing"){
			globalCall.callStatus = "Missed";
		}
		if(!globalCall.callNumber){
			globalCall.callNumber = number;
		}
		replicateglobalCallVariable();
		resetglobalCallVariables();	
		globalCall.lastReceived = "ended";	
		
		//this is called to save the call activity of the user after the call
		if(!callId)
			callId = "";
/*				var action = {"command":  "getLastCallDetail", "number": number, "callId": callId};
		sendActionToClient(action);*/
		//sendMessageToBriaClient("getLastCallDetail",number,callId);
		
	}
	
}


function checkVariableFormat(str){
	//look got a=b or a=b|c=d
    var patt = /(^(\w+[=]\w+)$)|^((\w+=\w+)([|]\w+=\w+)*)$/;
    var result = patt.test(str);
    console.log(result);
}




