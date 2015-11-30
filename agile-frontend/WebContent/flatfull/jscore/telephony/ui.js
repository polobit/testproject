/**
 * Handles events related to telephony.
 */
$(function()
{
	/**
	 * On click of dialpad button on call noty, will display/remove keypad.
	 */
	$('body').on('click', '.dialpad', function(e)
	{
		e.preventDefault();

		// If noty do not have dialpad then add
		if ($('.noty_buttons').find('.dialpad_btns').html() == null)
		{
			getTemplate('dialpad', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$(".noty_buttons").prepend($(template_ui));	
			},null);
		}
		else
		{
			// If noty has dialpad then remove
			$("#dialpad_btns").remove();
		}
	});

	/**
	 * On click of call action on contact page from list, will make SIP call to
	 * hard coded number. For Testing purpose. Call action is not visible to
	 * user.
	 */
	$('body').on('click', '.make-call', function(e)
	{
		e.preventDefault();

		// SIP
		/*
		 * if (makeCall('sip:+18004321000@proxy.ideasip.com')) { // Hard coded
		 * user details. User_Name = "Agile"; User_Number =
		 * "sip:+18004321000@proxy.ideasip.com";
		 */

		if (makeCall('sip:farah@sip2sip.info'))
		{
			User_Name = "farah";
			User_Number = "sip:farah@sip2sip.info";

			// Display
			showCallNotyPopup("outgoing", "confirm", SIP_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Calling </b>' + User_Number +'<br><a href="#'+Contact_Link+'" style="color: inherit;">' + User_Name +  '</a><br></span><div class="clearfix"></div>', false);
		}
	});

	/**
	 * On click of telephone icon on contact page before phone number at top
	 * right panel, will make SIP call to same number.
	 */
	$('body').on('click', '.contact-make-sip-call', function(e)
	{
		e.preventDefault();

		// Get details from UI
		var userid = $(this).attr('userid');
		var phone = $(this).attr('phone');

		// Check number is available.
		if (phone == "" || phone == null)
		{
			alert(name + "'s contact number not added.");
			return;
		}

		// SIP outgoing call.
		if (makeCall(phone))
		{
			var currentContact = App_Contacts.contactDetailView.model.toJSON();
			
			// Assign details to set in noty.
			User_Name = getContactName(currentContact);
			User_Number = removeBracesFromNumber(phone);
			User_Img = getGravatar(currentContact.properties, 40);
			User_ID = currentContact.id;
			SIP_Call_Noty_IMG = addSipContactImg();
			Show_Add_Contact = false;

			// Display
			showCallNotyPopup("outgoing", "confirm", SIP_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Calling  </b>' + User_Number +'<br><a href="#'+Contact_Link+'" style="color: inherit;">' + User_Name +  '</a><br></span><div class="clearfix"></div>', false);
		}
	});

	/**
	 * Onclick of hangup button in call noty, when call is connected.
	 */
	$('body').on('click', '.hangup', function(e)
	{
		e.preventDefault();

		// Display
		showCallNotyPopup("hangup", "information", SIP_Call_Noty_IMG+'<span class="noty_contact_details"><b>Call ended with  </b>' + User_Number + '<br><a href="#'+Contact_Link+'" style="color: inherit;">' + User_Name +  '</a><br></span><div class="clearfix"></div>', false);

		// SIP hangup call.
		hangupCall();
	});

	/**
	 * On incoming call noty, on ignore button click. It will cut the call.
	 */
	$('body').on('click', '.ignore', function(e)
	{
		// Display
		showCallNotyPopup("ignored", "error", SIP_Call_Noty_IMG+'<span class="noty_contact_details"><b>Ignored call  </b>'+ User_Number + '<br><a href="#'+Contact_Link+'" style="color: inherit;">' + User_Name +  '</a><br></span><div class="clearfix"></div>', 5000);

		// SIP reject call.
		Sip_Session_Call.reject(Config_Call);

		Is_Ignore = true;
		
		// Remove html5 notification.
		if (Notify_Call)
		{
			Notify_Call.cancel();
			Notify_Call = null;
		}
	});

	/**
	 * On incoming call noty, on answer button click. It will connect call.
	 */
	$('body').on('click', '.answer', function(e)
	{
		// SIP accept call.
		Sip_Session_Call.accept(Config_Call);
	});

});

//Add contact img in html for call noty text with contact url
function addSipContactImg()
{
  console.log("User_Img:");
  console.log(User_Img);
	
  Contact_Link = "";
  
  if(User_ID)
	  Contact_Link = Contact_Link+"contact/"+User_ID;
	  
  // Default img 
  var notyContactImg = '<a href="#'+Contact_Link+'" style="float:left;margin-right:10px;"><img class="thumbnail" width="40" height="40" alt="" src="'+DEFAULT_GRAVATAR_url+'" style="display:inline;"></a>';
	
  // If contact have img
  if(User_Img)
     notyContactImg = '<a href="#'+Contact_Link+'" style="float:left;margin-right:10px;"><img class="thumbnail" width="40" height="40" alt="" src="'+User_Img+'" style="display:inline;"></a>';
	 
  console.log("notyContactImg: "+notyContactImg);
  return notyContactImg;     
}

// Remove <> from sip number
function removeBracesFromNumber(number)
{
	console.log("number: "+number);
	if(number.match("^<") && number.match(">$"))
		number = number.substr(1, number.length-2);	
 	
	var regExp = /\:([^@]+)\@/;
	var matches = regExp.exec(number);
	
	if(matches)
    {	
	  //matches[1] contains the value between the parentheses
	  console.log(matches[1]);
	  number = matches[1];
    }
	return number;
}