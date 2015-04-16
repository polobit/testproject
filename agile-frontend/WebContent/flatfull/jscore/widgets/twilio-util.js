$(function(){
	
	
	$('#twilio_verify_settings').die().live('click', function(e)
			{
				e.preventDefault();
				
				$('#widget-settings').html(getTemplate('twilio-initial', {}));
				
			});
	
		/*
		 * If Twilio account doesn't have numbers, we need to verify numbers in
		 * Twilio.On click of verify button in Twilio initial template,
		 * verifyNumberFromTwilio is called to verify a number in Twilio
		 */
		$('#twilio_verify').die().live('click', function(e)
		{
			e.preventDefault();

			// Checks whether all input fields are given
			if (!isValidForm($("#twilio_call_form")))
				return;

			// From number to make calls as entered by user
			var from_number = $('#twilio_from').val();
			console.log("Twilio verify from number: " + from_number);

			$.getJSON("core/api/widgets/Twilio", function(data)
					{
						console.log(data);
						
						if(data)
						{
							/*
							 * Verifies a number in Twilio and shows verification code in the Twilio
							 * template with a procced button
							 */
							verifyNumberFromTwilio(from_number, data.id, function(verified_data)
							{
								verified_data["settings"] = true;
								// Append the url with the random number in order to differentiate the same action performed more than once.
								verified_data["id"] = Math.floor((Math.random()*10)+1);
								
								console.log(verified_data);
								console.log(getTemplate('twilio-verify', verified_data));
								$('#widget-settings').html(getTemplate('twilio-verify', verified_data));
							});
						}
					});
		});


	
});


/**
 * Verifies a given number In Twilio and returns verification code to verify in
 * the Twilio Widget
 * 
 * @param from_number
 *            {@link String} Number to verify
 * @param callback
 *            Function to be executed on success
 */
function verifyNumberFromTwilio(from_number, id, callback)
{

	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/verify/numbers/"
	 * with Twilio_Plugin_Id and from_number as path parameters
	 */
	$.getJSON("/core/api/widgets/twilio/verify/numbers/" + id + "/" + from_number, function(verified_data)
	{
		console.log("Twilio verified_data " + verified_data);

		// If data is not defined return
		if (!verified_data)
			return;

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(verified_data);

	}).error(function(data)
	{	
		// Append the url with the random number in order to differentiate the same action performed more than once.
		var flag = Math.floor((Math.random()*10)+1); 
		setUpError("Twilio", "widget-settings-error", data.responseText, window.location.protocol + "//" 
				+ window.location.host + "/#Twilio/twilio"+flag);
	});
	
	return;
}


