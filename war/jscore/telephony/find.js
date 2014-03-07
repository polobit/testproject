/**
 * On incoming call, It finds relevant contact user from added contacts with
 * same phone number.
 */
function findContact()
{
	// var n = "+918564789652"; for testing
	console.log("In findContact. " + Sip_Session_Call.getRemoteUri());

	// Get contact details on phone number
	$.getJSON("/core/api/contacts/search/phonenumber/" + Sip_Session_Call.getRemoteUri(), function(caller)
	{
		console.log(caller);

		// Contact added
		if (caller != null)
		{
			// Get details to update call noty.
			if (caller.properties[0].name == 'first_name' && caller.properties[1].name == 'last_name')
			{
				User_Name = caller.properties[0].value + " " + caller.properties[1].value;
				User_Number = Sip_Session_Call.getRemoteUri();
				User_Img = caller.properties[2].value;

				// Set details if call is still active.
				if (CALL != undefined)
					CALL.setText('<i class="icon icon-phone"></i><b>Incoming call : </b><br>' + User_Name + "   " + User_Number);
			}
		}
	}).error(function(data)
	{
		console.log("In Find contact : " + data.responseText);
	});
}
