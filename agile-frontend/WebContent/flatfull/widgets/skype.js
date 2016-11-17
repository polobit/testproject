
function startSkypeWidget(contact_id){
	sendTestCommandToClient(function(){
		getLogsIfPubnubIsConnectedSkype();
	});
}

function getLogsIfPubnubIsConnectedSkype(){
	if(!callJar.running){
		getLogsForSkype();
		return;
	}
	setTimeout(function()
			{
				if(!Pubnub){
					getLogsIfPubnubIsConnectedSkype();
					return;
				}
		
				if(!Pubnub.is_connected_call){
					getLogsIfPubnubIsConnectedSkype();
					return;
				}
				getLogsForSkype();
			}, 1000);
}