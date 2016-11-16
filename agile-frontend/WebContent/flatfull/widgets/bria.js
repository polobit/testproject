/*
 * This method is called after the sucessful loading of the widget
 * If the pubnub is not connected then it will reenter in timeout function
 * @author - Prakash
 */

function startBriaWidget(contact_id){
	sendTestCommandToClient(function(){
		getLogsIfPubnubIsConnectedBria();
	});
}


function getLogsIfPubnubIsConnectedBria(){
	
	//two cases 
	//1. if the client is opened
	//2. if the client is not opened
	// If the client is opened then we will wait for the pubnub to load
	// if the client is not opened then we will not wait for the pubnub and show the message
	
	if(!callJar.running){
		getLogsForBria();
		return;
	}
	setTimeout(function()
			{
				if(!Pubnub){
					getLogsIfPubnubIsConnectedBria();
					return;
				}
				if(!Pubnub.is_connected_call){
					getLogsIfPubnubIsConnectedBria();
					return;
				}
				getLogsForBria();
			}, 1000);
}

/*function showEmptyLog(){
	 var l = {};
     l.data = "";
     if (c == "Bria") {
         handleLogsForBria(l)
     } else {
         if (c == "Skype") {
             handleLogsForSkype(l)
         }
     }
}*/