function serialize_and_save_continue_lead(e, form_id, modal_id, continueLead, saveBtn, tagsSourceId)
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

    var man_delet  = $("#" + form_id + " #Manual_delete").val();
	//Surce of the contact
	var contact_source = $('#' + form_id + ' input[name=source]').attr('data');

	// Makes created time constant
	var created_time = $('#' + form_id + ' input[name=created_time]').val();

	var city  = $("#" + form_id + " #city").val();
	var state  = $("#" + form_id + " #state").val();
	var country  = $("#" + form_id + " #country").val();
	var zip  = $("#" + form_id + " #zip").val();


	// Object to save
	var obj = {};
	//to check if it manually added

	// Stores all the property objects
	var properties = [];

	// Contact should be fetched based on id from any of the following views. It
	// is required so other properties saved are not lost.
	if (id)
	{

		// If user refreshes in lead details page, then none of the list
		// views are defined so, lead will be fetched from detailed view
		if (App_Leads.leadDetailView && App_Leads.leadDetailView.model != null && App_Leads.leadDetailView.model.get('id') == id)
			obj = App_Leads.leadDetailView.model.toJSON();

		// If lead list view is defined, then contact is fetched from list.
		else if (App_Leads.leadsListView && App_Leads.leadsListView.collection.get(id) != null)
			obj = App_Leads.leadsListView.collection.get(id).toJSON();
	}

	// Loads continue editing form
	var template;

	// Reads custom fields and pushes into properties
	var custom_field_elements = $('#' + form_id).find('.custom_field');
	var custom_fields_in_template = [];
	var contact_custom_fields_flag = true;

	$.each(custom_field_elements, function(index, element)
	{
		var id = $(element).attr('id'), name = $(element).attr('name');
		custom_fields_in_template.push(name);
		if($(element).hasClass("contact_input") || $(element).hasClass("company_input")){
			if ($(element).hasClass("required_field"))
			{
				if ($(this).parent().find("ul").find("li").length == 0)
				{
					$(this).parent().append('<span for="fname" generated="true" class="help-inline">This field is required.</span>');
					var that = this;
					setTimeout(function(){
						$(that).parent().find('span').remove();
					},1500);
					contact_custom_fields_flag = false;
				}
			}
			if (isValidContactCustomField(id))
				properties.push(custom_Property_JSON(name, 'CUSTOM', form_id));
		}else{
			if (isValidField(id))
				properties.push(custom_Property_JSON(name, 'CUSTOM', form_id));
		}
		
	});
	if (!contact_custom_fields_flag)
	{
		enable_save_button($(saveBtn));
		return;
	}

	// Stores person's continue editing form template key
	template = 'update-lead';
	obj.type = 'LEAD';

	//If lead status equals to converted, we are updating the lead as contact
	if($("#lead_conversion_status", $("#"+form_id)).val() == $("#lead_status_id", $("#"+form_id)).val())
	{
		obj.type = 'PERSON';
		obj.is_lead_converted = true;
	}

	var leadSourceId = $("#" + form_id + " #lead_source_id").val();
	var leadStatusId = $("#" + form_id + " #lead_status_id").val();
	if(leadSourceId)
	{
		obj.lead_source_id = leadSourceId;
	}

	if(leadStatusId)
	{
		obj.lead_status_id = leadStatusId;
	}
    
	if(contact_source)
		obj.source = contact_source ;

	// Creates properties of contact (person)
	if (isValidField(form_id + ' #fname'))
		properties.push(property_JSON('first_name', form_id + ' #fname'));

	if (isValidField(form_id + ' #lname'))
		properties.push(property_JSON('last_name', form_id + ' #lname'));

	// Add profile_img from both forms.
	// if(form_id == "personForm")
	if (isValidField(form_id + ' #image'))
		properties.push(property_JSON('image', form_id + ' #image'));
    //checking the condition for the when tweeterId is saving into the datastore
    if(isValidField(form_id +' #handle'))
    	properties.push({ "name" : "website", "value" :$('#handle').val(), "subtype" : "TWITTER" })

  
	// /give preference to autofilled company, ignore any text in textfield
	// for filling company name
	var company_el = $("#" + form_id + " [name='lead_company_id']").find('li');
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
	if(obj.contact_company_id){
		$.ajax({
			url : "/core/api/contacts/"+obj.contact_company_id,
			type: 'GET',
			dataType: 'json',
			success: function(company){
				if(company){
					contact_company = company ;
					return serialize_lead_properties_and_save(e, form_id, obj, properties, modal_id, continueLead, saveBtn, tagsSourceId, id, created_time, custom_fields_in_template, template , company);
				}
			},
			error: function(){
				console.log("company fetch failed.");
				return serialize_lead_properties_and_save(e, form_id, obj, properties, modal_id, continueLead, saveBtn, tagsSourceId, id, created_time, custom_fields_in_template, template);
			}
		});
	}
	else
		return serialize_lead_properties_and_save(e, form_id, obj, properties, modal_id, continueLead, saveBtn, tagsSourceId, id, created_time, custom_fields_in_template, template);
}

function serialize_lead_properties_and_save(e, form_id, obj, properties, modal_id, continueLead, saveBtn, tagsSourceId, id, created_time, custom_fields_in_template, template ,contact_company){
				
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
				{  
					return;
				}

				if ($(subelement).attr('name') == 'address-type')
					subtype = $(subelement).val();

				else
					addressJSON[$(subelement).attr('name')] = $(subelement).val();

				if($(subelement).attr('name') == 'country')
					addressJSON['countryname'] = $(subelement).find('option:selected').text();
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
	 * be stripe id..) using developers API and contact image saved as CUSTOM type,
	 * in order not to loose them following verification is done
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
														.indexOf(contact_property.name) == -1 && contact_property.type == "CUSTOM" && contact_property.name == "image")
												{
													properties.push(contact_property);
												}
											
											});
						});
	}
	if(contact_company){
		var prop = null;
		$.each(contact_company.properties , function(){
			if(this.name == "address" && this.subtype == "office")
				prop = this.value;
			});
		if(prop){
			var addressFlag = false;
			$.each(properties, function(key, value){
		    console.log(key);
		    	if(key == "address"){
		    		addressFlag = true ;
		    		return false;
				}
			});
			if(!addressFlag){
				var form_element = $(e.target).attr('id')
				if(form_element == "person_validate" || form_element == "continue-contact"){						
					console.log(prop);
					properties.push({ "name" : "address", "value" : prop, "subtype" : "office"});
				}
			}
		}
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
	var clickButtonId = e.currentTarget.id; 
	// Saves contact
	var leadModel = new BaseModel();
	leadModel.url = 'core/api/contacts';
	leadModel.save(obj, { success : function(data)
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));

		//add_contact_to_view(App_Leads.leadsListView, data, obj.id);

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
		if (continueLead)
		{

			add_custom_fields_to_form(data.toJSON(), function(contact)
			{
				console.log(contact);
				deserialize_contact(contact, template);

			}, data.toJSON()["type"]);

		}
		else
		{
			// update contacts-details view
			if (App_Leads.leadDetailView)
				App_Leads.leadDetailView.model = data;

			if(!CALL_CAMPAIGN.start && Current_Route != "lead/" + data.id)
			App_Leads.navigate("lead/" + data.id, { trigger : true });
		}

		// Hides the modal
		if(CallLogVariables.dynamicData != null){
			CallLogVariables.processed = true;
		}
		$('#' + modal_id).modal('hide');

		// Resets each element
		$('#' + form_id).each(function()
		{
			this.reset();
		});

		// Removes tags list(remove them from new person modal)
		$('.tagsinput', $("#" + modal_id)).empty();
		
		try{
			
			if(clickButtonId != "continue-contact"){
				if(CallLogVariables.dynamicData != null){
					var jsonData1 = data.toJSON();
					var dynamicData = CallLogVariables.dynamicData;
					dynamicData.contact_name = getContactName(jsonData1);
					dynamicData.contId = jsonData1.id;
					showDynamicCallLogs(dynamicData);
				}
			}
		}catch(e){}
		
		
		//added for call campaign - functionality after updating fom call campaign
			if(CALL_CAMPAIGN.start ){
				var id = $('#continueform input[name=id]').val();
				if(CALL_CAMPAIGN.contact_update){
					CALL_CAMPAIGN.current_count = CALL_CAMPAIGN.current_count - 1;
					CALL_CAMPAIGN.contact_update = false;
					dialNextCallAutomatically();
					Backbone.history.loadUrl("lead/" + id);
					$( window ).scrollTop( 0 );
					return;
				}else{
					var currentCampaignId = CALL_CAMPAIGN.contact_id_list[CALL_CAMPAIGN.current_count];
					if(id == currentCampaignId ){
						CALL_CAMPAIGN.current_count = CALL_CAMPAIGN.current_count-1;
						dialNextCallAutomatically();
					}
					
				}
				
				if(Current_Route != "lead/" + id)
				Backbone.history.navigate("lead/" + id, { trigger : true });	
				$( window ).scrollTop( 0 );
				
				
			}
			
			
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