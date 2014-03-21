/**
 * Handles events related to telephony.
 */
$(function()
{
	/**
	 * On click of dialpad button on call noty, will display/remove keypad.
	 */
	$(".dialpad").die().live("click", function(e)
	{
		e.preventDefault();

		// If noty do not have dialpad then add
		if ($('.noty_message').find('.dialpad_btns').html() == null)
		{
			var dialpad = $(getTemplate("dialpad"), {});
			$(".noty_message").append(dialpad);
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
	$(".make-call").die().live("click", function(e)
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
			showCallNotyPopup("outgoing", "confirm", '<i class="icon icon-phone"></i><b>Calling :</b><br> ' + User_Name + "  " + User_Number + "<br>", false);
		}
	});

	/**
	 * On click of telephone icon on contact page before phone number at top
	 * right panel, will make SIP call to same number.
	 */
	$(".contact-make-call").die().live("click", function(e)
	{
		e.preventDefault();

		// Get details from UI
		var name = $(this).attr('fname') + " " + $(this).attr('lname');
		var image = $(this).attr('image');
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
			// Assign details to set in noty.
			User_Name = name;
			User_Number = phone;
			User_Img = image;

			// Display
			showCallNotyPopup("outgoing", "confirm", '<i class="icon icon-phone"></i><b>Calling : </b><br>' + User_Name + "   " + User_Number + "<br>", false);
		}
	});

	/**
	 * Onclick of hangup button in call noty, when call is connected.
	 */
	$(".hangup").die().live("click", function(e)
	{
		e.preventDefault();

		// Display
		showCallNotyPopup("hangup", "information", "<b>Call ended with : </b><br>" + User_Name + "   " + User_Number + "<br>", false);

		// SIP hangup call.
		hangupCall();
	});

	/**
	 * On incoming call noty, on ignore button click. It will cut the call.
	 */
	$('.ignore').die().live("click", function(e)
	{
		// Display
		showCallNotyPopup("ignored", "error", "<b>Ignored call : </b><br>" + User_Name + "   " + User_Number + "<br>", 5000);

		// SIP rehject call.
		Sip_Session_Call.reject(Config_Call);

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
	$('.answer').die().live("click", function(e)
	{
		// SIP accept call.
		Sip_Session_Call.accept(Config_Call);
	});

});
