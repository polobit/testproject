/*
 * Function to sync form data to agile v4
 */
var _agile_synch_form_v4 = function()
{
	
	if(!agile_validations()){
		return;
	}

	var agile_button = document.getElementsByClassName("agile-button")[0];
	if(agile_button)
		agile_button.setAttribute("disabled", "disabled");

	var agile_error_msg = document.getElementById("agile-error-msg");
	if(agile_error_msg) {
		var spin = document.createElement("img");
		spin.src = "https://s3.amazonaws.com/PopupTemplates/form/spin.gif";
		agile_error_msg.appendChild(spin);
	}

	var agile_form = document.forms["agile-form"];
	if(!agile_form) return;

	var agile_redirect_url = "#";
	if(agile_form["_agile_redirect_url"]) {
		agile_redirect_url = agile_form["_agile_redirect_url"].value
	}

	var agile_contact = {};
	var agile_address = {};
	var agile_notes = [];
	var form_data = {};
	var new_contact = true;

	var field, l;
    if (typeof agile_form == 'object' && agile_form.nodeName == "FORM") {
    	var len = agile_form.elements.length;
        for (var i = 0; i < len; i++) {
            field = agile_form.elements[i];
            
            if(field.id && field.id == "g-recaptcha-response") continue;

            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
            	
            	form_data[field.id] = field.value;
            	
            	if ('address, city, state, country, zip'.indexOf(field.name) != -1) {
            		agile_address[field.name] = field.value;
            	} else if (field.type == 'select-multiple') {
                    l = agile_form.elements[i].options.length; 
                    for (var j = 0; j < l; j++) {
                        if(field.options[j].selected && field.options[j].value) {
                        	if(agile_contact.hasOwnProperty(field.name)) {
                        		agile_contact[field.name] = agile_contact[field.name] + ", " + field.options[j].value;
                        	} else {
                        		agile_contact[field.name] = field.options[j].value;
                        	}
                        }
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                	if(field.value) {
                		if(agile_contact.hasOwnProperty(field.name)) {
                        	agile_contact[field.name] = agile_contact[field.name] + "," + field.value;
	                    } else {
	                    	agile_contact[field.name] = field.value;
	                    }
                	}
                }
            
                if (field.name == "note" && agile_contact["note"]) {
					var agile_note = {};
					var closestParentLabelEl = agile_find_closest_element(field, function (el) {
					if(el.getElementsByTagName("label")[0])
					    return (" " + el.getElementsByTagName("label")[0].className + " ").replace(/[\n\t]/g, " ").indexOf(" agile-label ") != -1;
					return false;
					});
					
					var labelTextForFieldEl = "";
					if(closestParentLabelEl) {
						labelTextForFieldEl = closestParentLabelEl.getElementsByTagName("label")[0];
					}

					if(labelTextForFieldEl) {
						agile_note.subject = labelTextForFieldEl.innerText || labelTextForFieldEl.textContent || "Form Note";
					} else {
						agile_note.subject = "Form Note";
					}
					agile_note.subject = agile_note.subject.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
					agile_note.description = agile_contact["note"];
					if(agile_note.description)
						agile_notes.push(agile_note);
					delete agile_contact["note"];
				}

            }
        }
    }


	// If address present, add to contact
	agile_address = JSON.stringify(agile_address);
	if (agile_address.length > 2)
		agile_contact.address = agile_address;

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
	 agile_contact['agile_source'] = "form";
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