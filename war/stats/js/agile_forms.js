/**
 * Function to synch form data to agile
 */
var _agile_synch_form = function()
{
	var agile_button = document.getElementsByClassName("agile-button")[0];
	agile_button.setAttribute("disabled", "disabled");
	var agile_error_msg = document.getElementById("agile-error-msg");

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
			if ('address, city, state, country, zip'.indexOf(name) != -1)
				agile_address[name] = value;
			else
				agile_contact[name] = value;
		}
	}

	// If address present, add to contact
	agile_address = JSON.stringify(agile_address);
	if (agile_address.length > 2)
		agile_contact.address = agile_address;

	// If email, api, domain present execute JSAPI
	var agile_email = agile_contact.email;
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
			agile_formCallback([
					"", agile_error_msg
			], agile_button, agile_redirect_url);
		}, error : function(data)
		{
			if (data.error.indexOf('Duplicate') != -1)
			{
				var agile_tags = agile_contact.tags;
				if (agile_tags)
					delete agile_contact.tags;

				// Update contact if duplicate
				_agile.update_contact(agile_contact, { success : function(data)
				{
					// If agile_tags add tags to contact
					if (agile_tags)
						_agile.add_tag(agile_tags, { success : function(data)
						{
							agile_formCallback([
									"", agile_error_msg
							], agile_button, agile_redirect_url);
						}, error : function(data)
						{
							agile_formCallback([
									"There was an error in sending data", agile_error_msg
							], agile_button, agile_redirect_url, data);
						} });
					else
						agile_formCallback([
								"", agile_error_msg
						], agile_button, agile_redirect_url);
				}, error : function(data)
				{
					agile_formCallback([
							"There was an error in sending data", agile_error_msg
					], agile_button, agile_redirect_url, data);
				} });
			}
			else
				agile_formCallback([
						"There was an error in sending data", agile_error_msg
				], agile_button, agile_redirect_url, data);
		} });
	}
};
