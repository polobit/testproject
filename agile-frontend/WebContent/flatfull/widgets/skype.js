
function startSkypeWidget(contact_id){
	setTimeout(function()
	{
		if(!Pubnub.is_connected_call){
			startSkypeWidget();
			return;
		}
		getLogsForSkype();
	}, 9000);
}