function findContact()
{
	// var n = "+918564789652";
	console.log("In findContact. " + Sip_Session_Call.getRemoteUri());
	$.getJSON("/core/api/contacts/search/phonenumber/" + Sip_Session_Call.getRemoteUri(), function(caller)
	{
		console.log(caller);

		if (caller != null)
		{
			if (caller.properties[0].name == 'first_name' && caller.properties[1].name == 'last_name' && caller.properties[2].name == 'image')
			{
				User_Name = caller.properties[0].value + " " + caller.properties[1].value;
				User_Number = Sip_Session_Call.getRemoteUri();
				User_Img = caller.properties[2].value;

				if (CALL != undefined)
					CALL.setText('<i class="icon icon-phone"></i><b>Incoming call : </b><br>' + User_Name + "   " + User_Number);
			}
		}
	}).error(function(data)
	{
		console.log("In Find contact : " + data.responseText);
	});
}
