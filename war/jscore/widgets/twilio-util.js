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
								console.log(verified_data);
								console.log(getTemplate('twilio-verify', verified_data));
								$('#widget-settings').html(getTemplate('twilio-verify', verified_data));
							});
						}
					});
		});

		/*
		 * On click of Twilio proceed button after verifying numbers, we will check
		 * the verification status of the number and generate token to make calls,
		 * else set up to verify number is shown again
		 */
		/*$('#twilio_proceed_settings').die().live('click', function(e)
		{
			e.preventDefault();

			// check if verification status is success, generate token
			
				$.getJSON("core/api/widgets/Twilio", function(data)
						{
							console.log(data);
							
							if(data)
							{
								if (data.prefs.verificaton_status || data.prefs.verificaton_status == "success")
								{
									console.log(data);
									$.getJSON("/core/api/widgets/twilio/numbers/" + data.id,  function(data1)
									{
										if (!data1)
											return;
												
										set_up_access("Twilio", 'twilio-login', data1, encodeURIComponent(window.location.href), data);
												
									});
								
								}
								
								// else if it is failure, show set up to verify
								else if (data.prefs.verificaton_status == "failure")
									console.log("failure");
							}
						});

			
		});*/
	
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
		console.log("in error")
	});
}


