/**
 * Function to synch form data to agile v2
 */
var _agile_synch_form_v2 = function()
{
	// Disable button & add spinner
	var agile_button = document.getElementsByClassName("agile-button")[0];
	if (agile_button)
		agile_button.setAttribute("disabled", "disabled");
	var agile_error_msg = document.getElementById("agile-error-msg");
	if (agile_error_msg)
	{
		var spin = document.createElement("img");
		spin.src = "https://s3.amazonaws.com/PopupTemplates/form/spin.gif";
		agile_error_msg.appendChild(spin);
	}

	// Get form data
	var agile_form = document.getElementById('agile-form');
	var agile_form_data = document.getElementById('agile-form-data').getAttribute('name').split(" ");
	var agile_redirect_url = agile_form_data[2];
	var agile_api = agile_form_data[1];
	var agile_domain = agile_form_data[0];
	var agile_form_data_string = agile_domain + " " + agile_api + " " + agile_redirect_url + " ";
	var agile_form_identification_tag = document.getElementById('agile-form-data').getAttribute('name').replace(agile_form_data_string, "");

	// Initialize / declare variables
	var agile_contact = {};
	var agile_address = {};
	var agile_tags = undefined;
	var agile_notes = [];
	var form_data = {};
	var new_contact = true;

	// Build contact JSON
	for ( var i = 0; i < agile_form.length; i++)
	{
		var name = agile_form[i].getAttribute('name');
		var value = agile_form[i].value;
		var field_id = agile_form[i].getAttribute('id');
		var field_type = agile_form[i].getAttribute("type");
		if ((field_type == "radio" || field_type == "checkbox") && !agile_form[i].checked)
			continue;

		if (name && value)
		{
			form_data[field_id] = value;
			if ('address, city, state, country, zip'.indexOf(name) != -1)
				agile_address[name] = value;
			else if (name == "tags")
			{
				if (agile_tags)
					agile_tags = agile_tags + ',' + value;
				else
					agile_tags = value;
			}
			else if (name == "note")
			{
				var agile_note = {};
				agile_note.subject = agile_form[i].parentNode.parentNode.getElementsByTagName("label")[0].innerHTML;
				agile_note.description = value;
				agile_notes.push(agile_note);
			}
			else
				agile_contact[name] = value;
		}
		else if (value)
		{
			form_data[field_id] = value;
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
		var contact_id = data.id;
		var note_counter = 0;
		if (agile_notes.length > 0)
		{
			for ( var h = 0; h < agile_notes.length; h++)
			{
				_agile.add_note(agile_notes[h], { success : function(data)
				{
					note_counter++;
					if (note_counter == agile_notes.length)
					{
						agile_formCallback([
								"", agile_error_msg
						], agile_button, agile_redirect_url, agile_form, contact_id, form_data, new_contact);
					}
				}, error : function(data)
				{
					agile_formCallback([
							"Error in sending data", agile_error_msg
					], agile_button, agile_redirect_url, agile_form);
				} });
			}
		}
		else
		{
			agile_formCallback([
					"", agile_error_msg
			], agile_button, agile_redirect_url, agile_form, contact_id, form_data, new_contact);
		}
	}, error : function(data)
	{
		if (data.error.indexOf('Duplicate') != -1)
		{
			// Update contact if duplicate
			_agile.update_contact(agile_contact, { success : function(data)
			{
				new_contact = false;
				var contact_id = data.id;
				var note_counter = 0;
				if (agile_notes.length > 0)
				{
					for ( var h = 0; h < agile_notes.length; h++)
					{
						_agile.add_note(agile_notes[h], { success : function(data)
						{
							note_counter++;
							if (note_counter == agile_notes.length)
							{
								agile_formCallback([
										"", agile_error_msg
								], agile_button, agile_redirect_url, agile_form, contact_id, form_data, new_contact);

							}
						}, error : function(data)
						{
							agile_formCallback([
									"Error in sending data", agile_error_msg
							], agile_button, agile_redirect_url, agile_form);
						} });
					}
				}
				else
				{
					agile_formCallback([
							"", agile_error_msg
					], agile_button, agile_redirect_url, agile_form, contact_id, form_data, new_contact);
				}

			}, error : function(data)
			{
				agile_formCallback([
						"Error in sending data", agile_error_msg
				], agile_button, agile_redirect_url, agile_form);
			} });
		}
		else
			agile_formCallback([
					"Error in sending data", agile_error_msg
			], agile_button, agile_redirect_url, agile_form);
	} });
};