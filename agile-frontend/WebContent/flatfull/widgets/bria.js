/*
 * This method is called after the sucessful loading of the widget
 * If the pubnub is not connected then it will reenter in timeout function
 * @author - Prakash
 */

function startBriaWidget(contact_id){
	setTimeout(function()
	{
		if(!Pubnub.is_connected_call){
			startBriaWidget();
			return;
		}
		getLogsForBria();
	}, 8000);

}
