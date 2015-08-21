
	
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


