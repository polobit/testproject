$(function()
{
	// Twilio widget name as a global variable
	TwilioIO_PLUGIN_NAME = "TwilioIO";

	// Retrieves widget which is fetched using script API
	var twilioio_widget = agile_crm_get_widget(TwilioIO_PLUGIN_NAME);

	console.log('In twilioio_widget');
	console.log(twilioio_widget);

	// Retrieves list of phone numbers in agile contact
	TwilioIONumbers = agile_crm_get_contact_properties_list("phone");
	console.log("TwilioIONumbers");
	console.log(TwilioIONumbers);

	showListOfNumbers();

	$("#twilioio_call").die().live('click', function(e)
	{
		e.preventDefault();

		if (Twilio.Device.status() == "busy")
		{
			alert("Already on call.");
			return;
		}

		twiliocall($('#twilioio_contact_number').val(), getTwilioIOContactName());
	});

	
});

// Get name of contact
function getTwilioIOContactName()
{
	var contactName = "";
	var firstName = agile_crm_get_contact_property('first_name');
	var lastName = agile_crm_get_contact_property('last_name');

	if (firstName)
		contactName = firstName + " ";
	if (lastName)
		contactName = contactName + lastName;

	return contactName;
}

function showListOfNumbers()
{
	// If no numbers for contact, show message
	if (TwilioIONumbers.length == 0)
	{
		// Shows information in Twilio widget panel
		twilioError(TwilioIO_PLUGIN_NAME, "There is no phone number associated with this contact. <a href='#contact-edit'>Add phone number</a>");
		return;
	}

	var numbers = {};
	numbers['to'] = TwilioIONumbers;

	// Get template and show details in Twilio widget
	$('#TwilioIO').html(getTemplate('twilioio-profile', numbers));

	/*
	 * Hide if a link to add note exists (If call is made we show this link,
	 * after refresh we hide it)
	 */
	$('#twilioio_note').show();
	$('#twilioio_call').show();
}

/**
 * Shows Twilio error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function twilioError(id, message)
{
	console.log('In Twilio error template');
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate('twilio-error', error_json));
}
