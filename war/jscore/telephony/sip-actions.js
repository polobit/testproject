$(function()
{

	$(".dialpad").die().live("click", function(e)
	{
		e.preventDefault();

		console.log($('.noty_message').find('.dialpad_btns').html());

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

	$(".make-call").die().live("click", function(e)
	{
		e.preventDefault();

		// SIP
		if (makeCall('sip:+18004321000@proxy.ideasip.com'))
		{
			User_Name = "Agile";
			User_Number = "sip:+18004321000@proxy.ideasip.com";

			/*
			 * if(makeCall('sip:farah@sip2sip.info')) { User_Name = "farah";
			 * User_Number = "sip:farah@sip2sip.info";
			 */

			// Display
			showCallNotyPopup("outgoing", "confirm", '<i class="icon icon-phone"></i><b>Calling :</b><br> ' + User_Name + "  " + User_Number + "<br>", false);
		}
	});

	$(".contact-make-call").die().live("click", function(e)
	{
		e.preventDefault();

		var name = $(this).attr('fname') + " " + $(this).attr('lname');
		var image = $(this).attr('image');
		var phone = $(this).attr('phone');

		if (phone == "" || phone == null)
		{
			alert(name + "'s contact number not added.");
			return;
		}

		// SIP
		if (makeCall(phone))
		{
			User_Name = name;
			User_Number = phone;
			User_Img = image;

			// Display
			showCallNotyPopup("outgoing", "confirm", '<i class="icon icon-phone"></i><b>Calling : </b><br>' + User_Name + "   " + User_Number + "<br>", false);
		}
	});

	$(".hangup").die().live("click", function(e)
	{
		e.preventDefault();

		// Display
		showCallNotyPopup("hangup", "information", "<b>Call ended with : </b><br>" + User_Name + "   " + User_Number + "<br>", false);

		// SIP
		hangupCall();
	});

	$('.ignore').die().live("click", function(e)
	{
		// Display
		showCallNotyPopup("ignored", "error", "<b>Ignored call : </b><br>" + User_Name + "   " + User_Number + "<br>", 5000);

		// SIP
		Sip_Session_Call.reject(Config_Call);

		if (Notifi_Call)
		{
			Notifi_Call.cancel();
			Notifi_Call = null;
		}
	});

	$('.answer').die().live("click", function(e)
	{
		// SIP
		Sip_Session_Call.accept(Config_Call);
	});

});
