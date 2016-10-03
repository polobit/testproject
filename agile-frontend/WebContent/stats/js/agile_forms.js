/*
 * Function to sync form data to agile v4
 */
var _agile_synch_form_v4 = function()
{
	
	if(!agile_validations()){
		return;
	}

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

	var agile_form = document.forms["agile-form"];
	var agile_redirect_url = agile_form["_agile_redirect_url"].value;

	var agile_contact = {};
	var agile_address = {};
	var agile_multiple_checkbox = "";
	var agile_tags = undefined;
	var agile_notes = [];
	var form_data = {};
	var new_contact = true;

	for ( var i = 0; i < agile_form.length; i++)
	{
		var field_name = agile_form[i].getAttribute("name");
		var field_value = agile_form[i].value;
		var field_id = agile_form[i].getAttribute("id");
		var field_type = agile_form[i].getAttribute("type");
		if (field_type == "hidden")
			agile_form[i].setAttribute("disabled", "disabled");

		if ((field_type == "radio") && !agile_form[i].checked)
			continue;

		if (field_name && field_value)
		{
			form_data[field_id] = field_value;
			if ('address, city, state, country, zip'.indexOf(field_name) != -1)
				agile_address[field_name] = field_value;
			else if (field_name == "tags" && (field_id=="_agile_form_id_tags" || ((field_type=="checkbox" || 
				field_type=="radio") && agile_form[i].checked)))
			{
				if (agile_tags)
					agile_tags = agile_tags + ',' + field_value;
				else
					agile_tags = field_value;
			}
			else if (field_name == "note")
			{
				var agile_note = {};
				agile_note.subject = agile_form[i].parentNode.parentNode.getElementsByTagName("label")[0].innerHTML;
				agile_note.description = field_value;
				agile_notes.push(agile_note);
			}
			else if(agile_form[i].checked &&(field_type == "checkbox" &&  (typeof agile_tags == undefined || agile_tags)))
			   {
				if (agile_multiple_checkbox)
					agile_multiple_checkbox = agile_multiple_checkbox + ',' + field_value;
				else{
					agile_multiple_checkbox = field_value;
                    }
				  agile_contact[field_name] = agile_multiple_checkbox;  
				
			}

			else
				if(!agile_multiple_checkbox)
				agile_contact[field_name] = field_value;
		}
		else if (field_value)
		{
			form_data[field_id] = field_value;
		}

	}
	

	// If address present, add to contact
	agile_address = JSON.stringify(agile_address);
	if (agile_address.length > 2)
		agile_contact.address = agile_address;

	if (agile_tags)
		agile_contact.tags = agile_tags;

	var agile_email = agile_contact.email;
	if (agile_email)
		_agile.set_email(agile_email);
       	 	
	agile_contact = deleteAgileHiddenFields(agile_contact);
	var obj={};
	var arr_obj=[];
	//spliting agile_contact object for large form
	if(JSON.stringify(agile_contact).length > 600){
		var json_obj=agile_contact;
		for(var i=Object.keys(json_obj).length-1; i>=0;i-- ){			

			if(Object.keys(json_obj)[i]=="email"){
				obj[Object.keys(json_obj)[i-1]]=json_obj[Object.keys(json_obj)[i-1]];
				delete json_obj[Object.keys(json_obj)[i-1]];
			}
			else {
				obj[Object.keys(json_obj)[i]]=json_obj[Object.keys(json_obj)[i]];
				delete json_obj[Object.keys(json_obj)[i]];
			}
			if(Object.keys(json_obj).length==1 && JSON.stringify(json_obj).length > 600)
				json_obj[Object.keys(json_obj)[0]]=json_obj[Object.keys(json_obj)[0]].substring(0,500);
			
			if(JSON.stringify(json_obj).length < 600){
				arr_obj.push(json_obj);
				if(JSON.stringify(obj).length < 600){
					arr_obj.push(obj);
					break;
				}			
				else {
					json_obj=obj;
					obj={};
					i=Object.keys(json_obj).length;
				}				
			}		
		}
		agile_contact=arr_obj[0];
	}	
	_agile.create_contact(agile_contact, { success : function(data)
	{
		var contact_id = data.id;
		var note_counter = 0;
		for(var i=1;i<=arr_obj.length-1;i++){
			_agile.update_contact(arr_obj[i]);
		}
		if (agile_notes.length > 0)
		{
			for ( var h = 0; h < agile_notes.length; h++)
			{
				if(agile_notes[h].length > 600)
					agile_notes[h].description=agile_notes[h].description.substring(0,500);

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