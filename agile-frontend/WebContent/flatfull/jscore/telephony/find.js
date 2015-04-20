/**
 * On incoming call, It finds relevant contact user from added contacts with
 * same phone number.
 */
function findContact()
{	
	console.log("FindContact. " + Sip_Session_Call.getRemoteUri());

	// Get contact details on phone number
	$.getJSON("/core/api/contacts/search/phonenumber/" + removeBracesFromNumber(Sip_Session_Call.getRemoteUri()), function(caller)
	{
		console.log(caller);

		// Contact added
		if (caller != null)
		{
			// Get details to update call noty.
			//if (caller.properties[0].name == 'first_name' || caller.properties[1].name == 'last_name')
			{
				User_ID = caller.id;
				User_Name = getContactName(caller);
				User_Number = removeBracesFromNumber(Sip_Session_Call.getRemoteUri());
				User_Img = getGravatar(caller.properties, 40);
				SIP_Call_Noty_IMG = addSipContactImg();				

				// Set details if call is still active.
				if (CALL != undefined)
					CALL.setText(SIP_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Incoming call  </b>'+ User_Number +'<br><a href="#'+Contact_Link+'" style="color: inherit;">' + User_Name +  '</a><br></span><div class="clearfix"></div>' );
			}
		}
		else
			Show_Add_Contact = true;
	}).error(function(data)
	{
		console.log("Find contact : " + data.responseText);
	});
}
