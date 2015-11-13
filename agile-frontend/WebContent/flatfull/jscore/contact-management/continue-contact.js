/**
 * Shows error text, providing support for custom validation. Shows error
 * message in .errorClass, filling it with htmlText
 * 
 * @param modalId -
 *            id of modal, won't be used if modal hidden
 * @param formId -
 *            id of form,
 * @param htmlText -
 *            error message to display
 * @param errorClass -
 *            class in which to fill error text, i.e. htmlText
 */
function show_error(modalId, formId, errorClass, htmlText)
{
	var modal_elem = $('#' + modalId);
	var form_elem = $('#' + formId);

	if (modal_elem.css('display') !== 'none')
	{
		modal_elem.find('.' + errorClass).html(
				'<div class="alert alert-danger m-b-none" ><a class="close" data-dismiss="alert" href="#">&times</a>' + htmlText + '</div>').show();
	}
	else if (form_elem.css('display') !== 'none')
	{
		form_elem.find('.' + errorClass).html(
				'<div class="alert alert-danger m-b-none" ><a class="close" data-dismiss="alert" href="#">&times</a>' + htmlText + '</div>').show();
	}
}

function show_error_in_formactions(modalId, formId, errorClass, htmlText)
{
	var modal_elem = $('#' + modalId);
	var form_elem = $('#' + formId);

	// Show cause of error in saving
	var save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>' + htmlText + '</i></p></small></div>');

	// Hides the error message after 3
	// seconds

	if (modal_elem.css('display') !== 'none')
	{
		modal_elem.find('.' + errorClass).html(save_info).show().delay(3000).hide(1);
	}
	else if (form_elem.css('display') !== 'none')
	{
		form_elem.find('.' + errorClass).html(save_info).show().delay(3000).hide(1);
	}
}

/**
 * Serializes both contact (person or company) modal form (with basic
 * information) and its continue editing form (with detailed information) and
 * saves the serialized data into Contacts data base.
 * <p>
 * Each field (except tags field) value of the form is created as json object
 * (with name, type and value attributes) and pushed into "properties" array, if
 * any tags are exist, pushes them into tags array. Finally the object with
 * properties and tags is sent to save.
 * </p>
 * 
 * @method serialize_and_save_continue_contact
 * @param {Object}
 *            e default event to prevent
 * @param {String}
 *            form_id form to serialize the data
 * @param {String}
 *            modal_id modal to hide on save
 * @param {Boolean}
 *            continueContact verifies to show continue editing form
 * @param {Boolean}
 *            is_person verifies whether person or company
 * @param {String}
 *            id within which to search for tags, if ignored tags will be
 *            searched in form_id
 * @returns object get saved
 */
function serialize_and_save_continue_contact(e, form_id, modal_id, continueContact, is_person, saveBtn, tagsSourceId)
{

	// Prevents the default event, if any
	e.preventDefault();

	var $form = $('#' + form_id);

	// Returns, if the save button has disabled attribute, or form is invalid
	if ($(saveBtn).attr('disabled') || !isValidForm($form))
	{
		var ele = $(saveBtn).closest('form').find('.single-error').first();
		var container = $form;
		$('body').scrollTop(ele.offset().top - container.offset().top + container.scrollTop());
		return;
	}
	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));

	// Read multiple values from contact form
	var properties = [];

	// Reads id, to update the contact
	var id = $('#' + form_id + ' input[name=id]').val();

	// Makes created time constant
	var created_time = $('#' + form_id + ' input[name=created_time]').val();

	// Object to save
	var obj = {};

	// Stores all the property objects
	var properties = [];

	// Contact should be fetched based on id from any of the following views. It
	// is required so other properties saved are not lost.
	if (id)
	{

		// If user refreshes in contact details page, then none of the list
		// views are defined so, contact will be fetched from detailed view
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model != null && App_Contacts.contactDetailView.model.get('id') == id)
			obj = App_Contacts.contactDetailView.model.toJSON();

		// If contact list view is defined, then contact is fetched from list.
		else if (App_Contacts.contactsListView && App_Contacts.contactsListView.collection.get(id) != null)
			obj = App_Contacts.contactsListView.collection.get(id).toJSON();

		// If contact list is under a selected custom view, then contact is
		// fetched from the custom view list.
		else if (App_Contacts.contact_custom_view && App_Contacts.contact_custom_view.collection.get(id) != null)
			obj = App_Contacts.contact_custom_view.collection.get(id).toJSON();

	}
	
	if (company_util.isCompany() && id)
	{


		// If user refreshes in company details page, then none of the list
		// views are defined so, company will be fetched from detailed view
		if (App_Companies.companyDetailView && App_Companies.companyDetailView.model != null && App_Companies.companyDetailView.model.get('id') == id)
			obj = App_Companies.companyDetailView.model.toJSON();


		// If company list view is defined, then company is fetched from list.
		else if (App_Companies.companiesListView && App_Companies.companiesListView.collection.get(id) != null)
			obj = App_Companies.companiesListView.collection.get(id).toJSON();

	}

	// Loads continue editing form
	var template;

	// Reads custom fields and pushes into properties
	var custom_field_elements = $('#' + form_id).find('.custom_field');
	var custom_fields_in_template = [];

	$.each(custom_field_elements, function(index, element)
	{
		var id = $(element).attr('id'), name = $(element).attr('name');
		custom_fields_in_template.push(name);
		if (isValidField(id))
			properties.push(custom_Property_JSON(name, 'CUSTOM', form_id));
	});

	if (is_person)
	{

		// Stores person's continue editing form template key
		template = 'continue-contact';
		obj.type = 'PERSON';

		// Creates properties of contact (person)
		if (isValidField(form_id + ' #fname'))
			properties.push(property_JSON('first_name', form_id + ' #fname'));

		if (isValidField(form_id + ' #lname'))
			properties.push(property_JSON('last_name', form_id + ' #lname'));

		// Add profile_img from both forms.
		// if(form_id == "personForm")
		if (isValidField(form_id + ' #image'))
			properties.push(property_JSON('image', form_id + ' #image'));

		// /give preference to autofilled company, ignore any text in textfield
		// for filling company name
		var company_el = $("#" + form_id + " [name='contact_company_id']").find('li');
		if (company_el && company_el.length)
		{
			var company_id = $(company_el.get(0)).attr('data');
			var company_name = $(company_el.get(0)).find('a:first').text();

			obj.contact_company_id = company_id;
			properties.push({ type : "SYSTEM", name : "company", value : company_name });
		}
		else if (isValidField(form_id + ' #contact_company'))
		{
			if ($form.find('#contact_company').prop('value').length > 100)
			{
				show_error(modal_id, form_id, 'duplicate-email', 'Company name too long. Please restrict upto 100 characters.');
				enable_save_button($(saveBtn));// Remove loading image
				return;
			}
			obj.contact_company_id = null;
			properties.push(property_JSON('company', form_id + ' #contact_company'));
		}
		else
			obj.contact_company_id = null;

		if (isValidField(form_id + ' #email'))
			properties.push(property_JSON('email', form_id + ' #email'));

		if (isValidField(form_id + ' #phone'))
			properties.push(property_JSON('phone', form_id + ' #phone'));

		if (isValidField(form_id + ' #job_title'))
			properties.push(property_JSON('title', form_id + ' #job_title'));

		if (tagsSourceId === undefined || !tagsSourceId || tagsSourceId.length <= 0)
			tagsSourceId = form_id;

		var tags = get_tags(tagsSourceId);

		if (tags != undefined && tags.length != 0)
		{
			obj.tags = [];

			var tags_valid = true;
			if (!obj['tagsWithTime'] || obj['tagsWithTime'].length == 0)
			{
				$.each(tags[0].value, function(index, value)
				{
					if (!isValidTag(value, false))
					{
						tags_valid = false;
						return false;
					}
				});
				obj['tagsWithTime'] = [];
				$.each(tags[0].value, function(index, value)
				{
					obj.tagsWithTime.push({ "tag" : value });
				});
			}
			else
			{
				var tag_objects_temp = [];
				$.each(tags[0].value, function(index, value)
				{
					var is_new = true;
					$.each(obj['tagsWithTime'], function(index, tagObject)
					{
						if (value == tagObject.tag)
						{
							tag_objects_temp.push(tagObject);
							is_new = false
							return false;
						}
					});

					if (is_new)
					{
						tag_objects_temp.push({ "tag" : value });
						// check if tags are valid if they are newly adding to
						// the contact.
						if (!isValidTag(value, false))
						{
							tags_valid = false;
							return false;
						}
					}
				});
				obj['tagsWithTime'] = tag_objects_temp;
			}
			if (!tags_valid)
			{
				$('.invalid-tags-person').show().delay(6000).hide(1);
				enable_save_button($(saveBtn));
				return false;
			}
		}

		return serialize_contact_properties_and_save(e, form_id, obj, properties, modal_id, saveBtn, continueContact, is_person, tagsSourceId, id, created_time, custom_fields_in_template);
	}
	else
	{

		// Stores company's continue editing form template key
		template = 'continue-company';
		obj.type = 'COMPANY';
		// Creates properties of contact (company)

		if (isValidField('company_name'))
		{
			var companyName = $form.find('#company_name').prop('value');
			if (companyName.length > 100)
			{
				// Company name too long, show error and return;
				show_error(modal_id, form_id, 'duplicate-email', 'Company name too long. Please restrict upto 100 characters.');

				enable_save_button($(saveBtn));// Remove loading image
				return;
			}
			if (!id)
			{
				var status = isCompanyExist(companyName);
				if (status)
				{
					show_error(modal_id, form_id, 'duplicate-email', 'Company name already exist.');

					if (status)
					{
						show_error(modal_id, form_id, 'duplicate-email', 'Company name already exist.');

						enable_save_button($(saveBtn));// Remove loading image
						return;
					}
					else
					{
						properties.push(property_JSON('name', form_id + ' #company_name'));
						return serialize_contact_properties_and_save(e, form_id, obj, properties, modal_id, continueContact, is_person, saveBtn, tagsSourceId, id, created_time, custom_fields_in_template);
					}

				});

				return;
				
			}
			else
			{
				properties.push(property_JSON('name', form_id + ' #company_name'));
				return serialize_contact_properties_and_save(e, form_id, obj, properties, modal_id, continueContact, is_person, saveBtn, tagsSourceId, id, created_time, custom_fields_in_template);
			}
		}		
	}


}

function serialize_contact_properties_and_save(e, form_id, obj, properties, modal_id, continueContact, is_person, saveBtn, tagsSourceId, id, created_time, custom_fields_in_template){


		if (isValidField(form_id + ' #company_url'))
			properties.push(property_JSON('url', form_id + ' #company_url'));
		
		if (tagsSourceId === undefined || !tagsSourceId || tagsSourceId.length <= 0)
			tagsSourceId = form_id;

		var tags = get_tags(tagsSourceId);
		if (tags != undefined && tags.length != 0)
		{
			obj.tags = [];

			var tags_valid = true;
			if (!obj['tagsWithTime'] || obj['tagsWithTime'].length == 0)
			{
				$.each(tags[0].value, function(index, value)
				{
					if(!isValidTag(value, false)) {
						tags_valid = false;
						return false;
					}
				});
				obj['tagsWithTime'] = [];
				$.each(tags[0].value, function(index, value)
				{
					obj.tagsWithTime.push({ "tag" : value });
				});
			}
			else
			{
				var tag_objects_temp = [];
				$.each(tags[0].value, function(index, value)
				{
					var is_new = true;
					$.each(obj['tagsWithTime'], function(index, tagObject)
					{
						if (value == tagObject.tag)
						{
							tag_objects_temp.push(tagObject);
							is_new = false
							return false;
						}
					});

					if (is_new) {
						tag_objects_temp.push({ "tag" : value });
						//check if tags are valid if they are newly adding to the contact.
						if(!isValidTag(value, false)) {
							tags_valid = false;
							return false;
						}
					}
				});
				obj['tagsWithTime'] = tag_objects_temp;
			}
			if(!tags_valid) {
				$('.invalid-tags-person').show().delay(6000).hide(1);
				enable_save_button($(saveBtn));
				return false;
			}
		}
	// }

	/*
	 * Reads the values of multiple-template fields from continue editing form
	 * of both person and company and pushes into properties
	 */
	$('#' + form_id + ' div.multiple-template').each(function(index, element)
	{

		/*
		 * Reads each field (city, state, country and etc..) as a json object
		 * and pushes into 'addressJSON' and then it is pushed into properties.
		 */
		if ($(element).attr('data') == 'address')
		{
			var addressJSON = {};
			var subtype;
			$.each($(element).find(":input,select"), function(index, subelement)
			{

				if ($(subelement).val() == undefined || $(subelement).val().length == 0)
					return;

				if ($(subelement).attr('name') == 'address-type')
					subtype = $(subelement).val();
				else
					addressJSON[$(subelement).attr('name')] = $(subelement).val();
			});

			if ($.isEmptyObject(addressJSON))
				return;

			properties.push({ "name" : $(element).attr('data'), "value" : JSON.stringify(addressJSON), "subtype" : subtype })
		}
		else
		{
			var inputElement = $(element).find('input');
			var selectElement = $(element).find('select');

			// If element has no value, don't push into properties
			if (inputElement.val() == undefined || inputElement.val().trim().length == 0)
				return;

			// Checks whether fields for hidden fields (Used for clone do not
			// save them)
			if (!$(element).find('input').parents('div.controls').hasClass('hide'))
				properties.push({ "name" : $(element).attr('data'), "value" : inputElement.val(), "subtype" : selectElement.val() })
		}
	});

	/*
	 * Check whether there are any properties in existing contact, which can get
	 * lost in contact update form. There are chances user adds a property(may
	 * be stripe id..) using developers API, in order not to loose them
	 * following verification is done
	 */

	if (obj.properties)
	{
		var properties_temp = properties;
		$
				.each(obj.properties,
						function(contact_property_index, contact_property)
						{
							$
									.each(properties_temp,
											function(new_property_index, new_property)
											{

												// If property name exists in
												// new property, no changes are
												// made considering property is
												// updated.
												if (new_property.name == contact_property.name)
												{

													return false;
												}

												// If property name is missing
												// in new properties then
												// preserving them.
												else if (new_property_index == (properties_temp.length - 1) && custom_fields_in_template
														.indexOf(contact_property.name) == -1 && contact_property.type == "CUSTOM")
												{
													properties.push(contact_property);
												}
											});
						});
	}

	// Stores json object with "properties" as value
	var propertiesList = [];
	propertiesList.push({ "name" : "properties", "value" : properties });

	// Convert array into JSON
	for (var i = 0; i < propertiesList.length; ++i)
	{
		obj[propertiesList[i].name] = propertiesList[i].value;
	}

	// Updates the old contact
	if (id != null)
		obj['id'] = id;


	obj["created_time"] = created_time;

	// Saves contact
	var contactModel = new BaseModel();
	contactModel.url = 'core/api/contacts';
	contactModel.save(obj, { success : function(data)
	{

		// Remove social search results from local storage after editing a
		// contact
		localStorage.removeItem("Agile_linkedin_matches_" + data.get('id'));
		localStorage.removeItem("Agile_twitter_matches_" + data.get('id'));

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));

		if(is_person)
			add_contact_to_view(App_Contacts.contactsListView, data, obj.id);
		else
			add_contact_to_view(App_Companies.companiesListView, data, obj.id);

		// Adds the tags to tags collection
		if (tags != undefined && tags.length != 0)
		{
			$.each(tags[0].value, function(index, tag)
			{
				console.log(tagsCollection);
				tagsCollection.add(new BaseModel({ "tag" : tag }));
			});
		}

		// Removes person image form new-person-modal
		$('#' + modal_id).find('img.person-img').remove();

		// Loads continue editing form along with custom fields if any
		if (continueContact)
		{

			add_custom_fields_to_form(data.toJSON(), function(contact)
			{
				console.log(contact);
				deserialize_contact(contact, template);

			}, data.toJSON()["type"]);

		}
		else
		{
			if(is_person){
				// update contacts-details view
				if (App_Contacts.contactDetailView)
								App_Contacts.contactDetailView.model = data;

				// App_Contacts.contactDetails(data.id,data);
				// App_Contacts.navigate("contact/"+data.id);
				App_Contacts.navigate("contact/" + data.id, { trigger : true });
			} else {
				// update contacts-details view
				if (App_Companies.companyDetailView)
					App_Companies.companyDetailView.model = data;

				App_Companies.navigate("company/" + data.id, { trigger : true });
			}
		}

		// Hides the modal
		$('#' + modal_id).modal('hide');

		// Resets each element
		$('#' + form_id).each(function()
		{
			this.reset();
		});

		// Removes tags list(remove them from new person modal)
		$('.tagsinput', $("#" + modal_id)).empty();
	}, error : function(model, response)
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));

		// Shows error alert of duplicate contacts
		if (response.status == 400)
		{
			// 400 is our custom code, thrown when duplicate email detected.
			var dupEmail = response.responseText.split('|')[1];
			if (!dupEmail)
				dupEmail = "";
			// get the already existing email from response text.
			show_error(modal_id, form_id, 'duplicate-email', response.responseText);
		}
		else if (response.status == 403)
		{
			if(form_id == 'companyForm')
				show_error_in_formactions(modal_id, form_id, 'form-action-error', "You do not have permission to create Companies.");
			else if(form_id == 'continueCompanyForm')
				show_error_in_formactions(modal_id, form_id, 'form-action-error', "You do not have permission to update Companies.");
			else
				show_error_in_formactions(modal_id, form_id, 'form-action-error', response.responseText);
		}
		else
			show_error(modal_id, form_id, 'duplicate-email', response.responseText);
	} });

	return obj;

}

/**
 * Deserializes the contact to edit it. Loads the editing form using handlebars.
 * Fills the matched values, by iterating the properties.
 * 
 * @param {Object}
 *            contact contact object to edit
 * @param {String}
 *            template template key to load the form
 */
function deserialize_contact(contact, template)
{

	// Loads the form based on template value
	getTemplate(template, contact, undefined, function(template_ui){
		if(!template_ui)
			  return;
			
		var form = $('#content').html($(template_ui));	
		// Add placeholder and date picker to date custom fields
		$('.date_input').attr("placeholder", "Select Date");

		$('.date_input').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY});

		// To set typeahead for tags
		setup_tags_typeahead();

		// Iterates through properties and ui clones
		$.each(contact.properties, function(index, element)
		{

			if (element.type == "CUSTOM" && element.name != "website")
				return;
			// Removes first input field
			$($('#' + form.attr('id') + ' div.multiple-template.' + element.name).closest('div.controls.second')).remove();
			var field_element = $('#' + form.attr('id') + ' div.multiple-template.' + element.name);

			// Generate and populate multiple fields
			fill_multi_options(field_element, element);
		});

		var fxn_display_company = function(data, item)
		{
			$("#content [name='contact_company_id']")
					.html(
							'<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#contact/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
			$("#content #contact_company").hide();
		}
		agile_type_ahead("contact_company", $('#content'), contacts_typeahead, fxn_display_company, 'type=COMPANY', '<b>No Results</b> <br/> Will add a new one');

		if (contact.contact_company_id && contact.contact_company_id.length > 0)
		{
			for (var i = 0; i < contact.properties.length; ++i)
			{
				if (contact.properties[i].name == 'company')
				{
					$("#content #contact_company").hide();
					$("#content [name='contact_company_id']")
							.html(
									'<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + contact.contact_company_id + '"><span><a class="text-white m-r-xs" href="#contact/' + contact.contact_company_id + '">' + contact.properties[i].value + '</a><a class="close" id="remove_tag">&times</a></span></li>');
				}
			}
		}

		// If contact is added from social suite, need to add website.
		// socialsuite_add_website();

	}, "#content");

	
	
}

/**
 * Generates new field for each value in properties (especially for email, phone
 * and website)
 * 
 * @method fill_multi_options
 * @param {Object}
 *            field_element Html element having property name as class name
 * @param {Object}
 *            element property object
 * 
 */
function fill_multi_options(field_element, element)
{

	if (element.type == "CUSTOM" && element.name != "website")
		return;

	// Fills address fields
	if (element.name == 'address')
	{
		var json = JSON.parse(element.value);

		$.each($(field_element).find(":input,select"), function(index, sub_field_element)
		{
			var name = $(sub_field_element).attr('name');
			if (name == 'address-type')
				$(sub_field_element).val(element.subtype);
			else if (name == 'country')
			{
				if (json[name] && json[name].length > 2)
				{
					$("#country").remove();
					$(field_element).append('<input type="text" name="country" id="country" class="form-control m-b-sm" placeholder="country">');
					$("#country").val(json[name]);
				}
				else
					$(sub_field_element).val(json[name]);
			}
			else
				$(sub_field_element).val(json[name]);
		});
	}
	else
	{

		/*
		 * Fills other multiple-template fields (email, phone and website)
		 * Clones the fields into control-group and fills with associated values
		 */
		var append_to = $(field_element).parents('div.control-group');

		var html_element = append_to.children().siblings("div.controls:first").clone().removeClass('hide');

		$(html_element).find('input').val(element.value).attr('name', element.value);
		$(html_element).find('select').val(element.subtype);

		html_element.appendTo(append_to);
	}
}

/**
 * Creates json object for each custom field in contact form with name, type and
 * value as attributes.
 * 
 * @method custom_Property_JSON
 * @param name
 *            name of the field
 * @param form_id
 *            id of the form
 * @param type
 *            type of the element
 * @returns property json object
 */
function custom_Property_JSON(name, type, form_id)
{
	var json = {};

	// assign value after checking type, its different for checkbox
	json.name = name;
	json.type = type;

	var elem = $('#' + form_id).find('*[name="' + name + '"]');

	var elem_type = elem.attr('type'), elem_value;

	console.log(elem_type);


	if (elem_type == 'checkbox')
		elem_value = elem.is(':checked') ? 'on' : 'off';
	else if (elem.hasClass("date_input"))
		{
			if(CURRENT_USER_PREFS.dateFormat.indexOf("dd/mm/yy") != -1 || CURRENT_USER_PREFS.dateFormat.indexOf("dd.mm.yy") != -1)
				elem_value = new Date(convertDateFromUKtoUS(elem.val())).getTime() / 1000;
			else
				elem_value = new Date(elem.val()).getTime() / 1000;
		}
		else
			elem_value = elem.val();


	json.value = elem_value;

	return json;
}

// UI Handlers for Continue-contact and continue-company
$(function()
{

	$('body').on('click', '#content [name="contact_company_id"] a.close', function(e)
	{
		$("#content #contact_company").show();
		$("#content [name='contact_company_id']").html('');
	})

	// Clones multiple fields
	$('body').on('click', 'a.multiple-add', function(e)
	{
		e.preventDefault();

		// Clone the template
		$(this).parents("div.control-group").append($(this).parents().siblings("div.controls:first").clone().removeClass('hide'));
	});

	// Removes multiple fields
	$('body').on('click', 'a.multiple-remove', function(e)
	{
		e.preventDefault();

		// Get closest template and remove from the container
		$(this).closest("div.multiple-template").remove();
	});

	// Continue editing of new-person-modal
	$('#continue-contact').click(function(e)
	{
		serialize_and_save_continue_contact(e, 'personForm', 'personModal', true, true, this, 'tags_source_person_modal');
	});

	// Update button click event in continue-contact form
	$('body').on('click', '#update', function(e)
	{
		serialize_and_save_continue_contact(e, 'continueform', 'personModal', false, true, this, "tags_source_continue_contact");
	});

	// Close button click event in continue-contact form
	$('body').on('click', '#close', function(e)
	{
		e.preventDefault();
		var id = $('#continueform input[name=id]').val();
		if (id)
		{
			Backbone.history.navigate("contact/" + id, { trigger : true });
		}
	});

	// Continue editing in the new-company-modal (to avoid changing the route
	// event to be prevented.)
	$('#continue-company').click(function(e)
	{
		serialize_and_save_continue_contact(e, 'companyForm', 'companyModal', true, false, this);
	});

	// Update button click event in continue-company
	$('body').on('click', '#company-update', function(e)
	{
		serialize_and_save_continue_contact(e, 'continueCompanyForm', 'companyModal', false, false, this,'tags_source_continue_company');
	});
});

/**
 * Adds conatct to view, takes care of if its a COMPANY or PERSON.
 * 
 * @param appView -
 *            view whose collection to update
 * @param model -
 *            the model contact to add
 * @param isUpdate -
 *            if undefined, implies that its new one, else an update
 */
function add_contact_to_view(appView, model, isUpdate)
{
	if (!appView)
		return;

	if (model.get('type') == 'COMPANY')
	{
		if (appView.collection.get(model.id) != null) // update existing model
			appView.collection.get(model.id).set(model);
		else if (company_util.isCompany()) // add model only if its in
			// company view
			add_model_cursor(appView.collection, model);
		else if (isUpdate)
			COMPANIES_HARD_RELOAD = true; // reload contacts next time,
		// because we may have updated
		// Company, so reflect in Contact
	}
	else
	{
		if (!readCookie('company_filter')) // check if in contacts view
		{
			if (!readCookie('contact_filter')) // add model only if its in
			// plain contact view, otherwise
			// always hard reload
			{
				if (appView.collection.get(model.id) != null) // update
					// existing
					// model
					appView.collection.get(model.id).set(model);
				else
					add_model_cursor(appView.collection, model);
			}
			else
				CONTACTS_HARD_RELOAD = true; // custom filter active, make
			// sure to reload from server
		}
	}
}

/**
 * Adds model to collection at second last position, so cursor is preserved.
 * 
 * @param app_collection -
 *            the collection to add to, must exist
 * @param mdl -
 *            the new model to be added
 */
function add_model_cursor(app_collection, mdl)
{
	if (app_collection.models.length >= 1)
		app_collection.add(mdl, { at : app_collection.models.length - 1 });
	else
		app_collection.add(mdl);

	if (app_collection.at(0).attributes.count)
		app_collection.at(0).attributes.count += 1;
}

/**
 * check for duplicated company
 */
function isCompanyExist(company)
{
	$.get('core/api/contacts/company/validate/' + company, function(data){
		   if(data == "true"){
		   	    callback(true);
		   		return;
		   }

		   callback(false);
	});

}
