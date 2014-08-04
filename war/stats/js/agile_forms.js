/**
 * Function to synch form data to agile
 */
var _agile_synch_form = function()
{
	// Get form data
	var agile_form = document.getElementById('agile-form');
	var agile_form_data = document.getElementById('agile-form-data');
	var agile_contact = {};
	var agile_redirect_url = agile_form_data.getAttribute('agile-redirect-url');
	var agile_api = agile_form_data.getAttribute('agile-api');
	var agile_domain = agile_form_data.getAttribute('agile-domain');
	var agile_address = {};

	// Build contact JSON
	for ( var i = 0; i < agile_form.length; i++)
	{
		var name = agile_form[i].getAttribute('agile-field');
		var value = agile_form[i].value;
		if (name && value)
		{
			if ('addresscitystatecountryzip'.indexOf(name) != -1)
				agile_address[name] = value;
			else
				agile_contact[name] = value
		}
	}

	// If address present, add to contact
	agile_address = JSON.stringify(agile_address);
	if (agile_address.length > 2)
		agile_contact['address'] = agile_address;

	// If email, api, domain present execute JSAPI
	var agile_email = agile_contact['email'];
	if (agile_api && agile_domain)
	{
		// Set account, tracking
		_agile.set_account(agile_api, agile_domain);
		_agile.track_page_view();

		// Set email
		if (agile_email)
			_agile.set_email(agile_email);

		// Create contact
		_agile.create_contact(agile_contact, { success : function(data)
		{
			window.location.replace(agile_redirect_url) // Redirect to url
		}, error : function(data)
		{
			if (data.error.indexOf('Duplicate') != -1)
			{
				// Update contact if duplicate
				_agile.update_contact(agile_contact, { success : function(data)
				{
					window.location.replace(agile_redirect_url) // Redirect to url
				}, error : function(data)
				{
					console.log('Error submitting form ' + data.error);
					window.location.replace(agile_redirect_url) // Redirect to url
				} })
			}
			else
				window.location.replace(agile_redirect_url) // Redirect to url
		} })
	}
}
