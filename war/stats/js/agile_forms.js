/**
 * Function to synch form data to agile v2
 */
var _agile_synch_form_v2 = function()
{
	// Disable button
	var agile_button = document.getElementsByClassName("agile-button")[0];
	agile_button.setAttribute("disabled", "disabled");
	var agile_error_msg = document.getElementById("agile-error-msg");

	// Get form data
	var agile_form = document.getElementById('agile-form');
	var agile_form_data = document.getElementById('agile-form-data').getAttribute('name').split(" ");
	var agile_contact = {};
	var agile_redirect_url = agile_form_data[2];
	var agile_api = agile_form_data[1];
	var agile_domain = agile_form_data[0];
	var agile_form_data_string = agile_domain + " " + agile_api + " " + agile_redirect_url + " ";
	var agile_form_identification_tag = document.getElementById('agile-form-data').getAttribute('name').replace(agile_form_data_string, "");

	var agile_address = {};
	var agile_tags;

	// Build contact JSON
	for ( var i = 0; i < agile_form.length; i++)
	{
		var name = agile_form[i].getAttribute('name');
		var value = agile_form[i].value;
		if (name && value)
		{
			if ('address, city, state, country, zip'.indexOf(name) != -1)
				agile_address[name] = value;
			else if (name == "tags")
			{
				if (agile_tags)
					agile_tags = agile_tags + ',' + value;
				else
					agile_tags = value;
			}
			else
				agile_contact[name] = value;
		}
	}

	// If address present, add to contact
	agile_address = JSON.stringify(agile_address);
	if (agile_address.length > 2)
		agile_contact.address = agile_address;

	// Add tags, agile_form_identification_tag to contact
	if (agile_tags)
		if (agile_form_identification_tag)
			agile_contact.tags = agile_tags + "," + agile_form_identification_tag;
		else
			agile_contact.tags = agile_tags;
	else if (agile_form_identification_tag)
		agile_contact.tags = agile_form_identification_tag;

	// If email, api, domain present execute JSAPI
	var agile_email = agile_contact.email;

	// Set account, tracking
	if (!(agile_id.get() && agile_id.getNamespace()))
	{
		_agile.set_account(agile_api, agile_domain);
		_agile.track_page_view();
	}

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
			// Update contact if duplicate
			_agile.update_contact(agile_contact, { success : function(data)
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
		}
		else
			agile_formCallback([
					"There was an error in sending data", agile_error_msg
			], agile_button, agile_redirect_url, data);
	} });
};

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
	var agile_tags;

	// Build contact JSON
	for ( var i = 0; i < agile_form.length; i++)
	{
		var name = agile_form[i].getAttribute('agile-field');
		var value = agile_form[i].value;
		if (name && value)
		{
			if ('address, city, state, country, zip'.indexOf(name) != -1)
				agile_address[name] = value;
			else if (name == "tags")
			{
				if (agile_tags)
					agile_tags = agile_tags + ',' + value;
				else
					agile_tags = value;
			}
			else
				agile_contact[name] = value;
		}
	}

	// If address present, add to contact
	agile_address = JSON.stringify(agile_address);
	if (agile_address.length > 2)
		agile_contact.address = agile_address;
	if (agile_tags)
		agile_contact.tags = agile_tags;

	// If email, api, domain present execute JSAPI
	var agile_email = agile_contact.email;

	// Set account, tracking
	if (!(agile_id.get() && agile_id.getNamespace()))
	{
		_agile.set_account(agile_api, agile_domain);
		_agile.track_page_view();
	}

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
			// Update contact if duplicate
			_agile.update_contact(agile_contact, { success : function(data)
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
		}
		else
			agile_formCallback([
					"There was an error in sending data", agile_error_msg
			], agile_button, agile_redirect_url, data);
	} });
};