/**
 * Serializes both contact (person or company) modal form (with basic information) 
 * and its continue editing form (with detailed information) and saves the serialized
 * data into Contacts data base.
 * <p>
 * Each field (except tags field) value of the form is created as json object (with name,
 * type and value attributes) and pushed into "properties" array, if any tags are exist,
 * pushes them into tags array. Finally the object with properties and tags is sent to
 * save.
 * </p>
 * 
 * @method serialize_and_save_continue_contact
 * @param {Object} e
 * 			default event to prevent
 * @param {String} form_id
 * 			form to serialize the data
 * @param {String} modal_id
 * 			modal to hide on save
 * @param {Boolean} continueContact
 * 			verifies to show continue editing form
 * @param {Boolean} is_person
 * 			verifies whether person or company
 * @param {String}
 * 			id within which to search for tags, if ignored tags will be searched in form_id
 * @returns object get saved
 */
function serialize_and_save_continue_contact(e, form_id, modal_id, continueContact, is_person, saveBtn, tagsSourceId) {
	
	// Prevents the default event, if any 
	e.preventDefault();

    var $form = $('#' + form_id);
    
	// Returns, if the save button has disabled attribute 
	if($(saveBtn).attr('disabled'))
		return;
	
	// Disables save button to prevent multiple click event issues
	$(saveBtn).attr('disabled', 'disabled');
	
    // Validate Form
    if(!isValidForm($form)){

    	// Removes disabled attribute of save button
		$(saveBtn).removeAttr('disabled');
    	return;
    }
    
    // Show loading symbol until model get saved
    $('#' + modal_id).find('span.save-status').html(LOADING_HTML);
    $('#' + form_id).find('span.save-status').html(LOADING_HTML);
    
    // Read multiple values from contact form
    var properties = [];

    // Reads id, to update the contact 
    var id = $('#' + form_id + ' input[name=id]').val();
    
    // Makes created time constant
    var created_time=$('#' + form_id + ' input[name=created_time]').val();
    
    // Object to save
    var obj = {};
    
    // Stores all the property objects
    var properties = [];

    // Contact should be fetched based on id from any of the following views. It is required so other properties saved are not lost.
    if(id)
    	{

			// If user refreshes in contact details page, then none of the list views are defined so, contact will be fetched from detailed view
			if(App_Contacts.contactDetailView && App_Contacts.contactDetailView.model != null && App_Contacts.contactDetailView.model.get('id') == id)
				obj = App_Contacts.contactDetailView.model.toJSON();
		
    		// If contact list view is defined, then contact is fetched from list.
			else if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection.get(id) != null)
    			obj = App_Contacts.contactsListView.collection.get(id).toJSON();
    			
    		// If contact list is under a selected custom view, then contact is fetched from the custom view list.
    		else if(App_Contacts.contact_custom_view && App_Contacts.contact_custom_view.collection.get(id) != null)
    			obj = App_Contacts.contact_custom_view.collection.get(id).toJSON();

    	}
    
    
    // Loads continue editing form
    var template;
    
    // Reads custom fields and pushes into properties
    var custom_field_elements =  $('#' + form_id).find('.custom_field');
    var custom_fields_in_template = [];
    $.each(custom_field_elements, function(index, element){
    	var id = $(element).attr('id'), name = $(element).attr('name');
    	custom_fields_in_template.push(name);
    	
    	if (isValidField(id)) properties.push(property_JSON(name, id, 'CUSTOM'));
    });
    
    if(is_person){
    
    	// Stores person's continue editing form template key
    	template = 'continue-contact';
    	
    	// Creates properties of contact (person)
    	if (isValidField('fname'))properties.push(property_JSON('first_name', 'fname'));
   
    	if (isValidField('lname'))properties.push(property_JSON('last_name', 'lname'));
    
    	///give preference to autofilled company, ignore any text in textfield for filling company name
    	var company_el=$("#"+form_id+" [name='contact_company_id']").find('li');
    	if(company_el && company_el.length)	
    	{
    		var company_id=$(company_el.get(0)).attr('data');
    		var company_name=$(company_el.get(0)).find('a:first').html();
    		
    		obj.contact_company_id=company_id;
    		properties.push({type:"SYSTEM",name:"company",value:company_name});
    	}
    	else if (isValidField('contact_company'))
    	{
    		obj.contact_company_id=null;
    		properties.push(property_JSON('company', 'contact_company'));
    	}
    	else obj.contact_company_id=null;

    	if (isValidField('email')) properties.push(property_JSON('email', 'email'));

    	if (isValidField('job_title')) properties.push(property_JSON('title', 'job_title'));
    
   
    	if(tagsSourceId===undefined || !tagsSourceId || tagsSourceId.length<=0)	tagsSourceId=form_id;
    	
    	
    	var tags = get_tags(tagsSourceId);
    	if (tags != undefined && tags.length != 0) 
    	{
    		obj.tags = [];
    		obj['tagsWithTime'] = [];
    		
    		$.each(tags[0].value, function(index, value){
    			obj.tagsWithTime.push({"tag": value});
    		});
       	}
	
    }else{
    	
    	// Stores company's continue editing form template key
    	template = 'continue-company';


    	// Creates properties of contact (company)

    	if (isValidField('company_name'))
    		properties.push(property_JSON('name', 'company_name'));
    	
    	if (isValidField('company_url')) properties.push(property_JSON('url', 'company_url'));

    
    	var type = $('#' + form_id + ' input[name=type]').val();
    	obj.type = type;
    }
    
    /*
     * Reads the values of multiple-template fields from continue editing form of
     * both person and company and pushes into properties
     */ 
    $('#' + form_id + ' div.multiple-template').each(function (index, element) {
       
    	/*
    	 * Reads each field (city, state, country and etc..) as a json object and
    	 * pushes into 'addressJSON' and then it is pushed into properties.
    	 */ 
    	if($(element).attr('data') == 'address'){
    		var addressJSON = {};
    		var subtype;
    		$.each($(element).children(":not(br)"), function (index, subelement){
    			
    			if($(subelement).val() == undefined || $(subelement).val().length == 0)
    				return;
    			
    			if($(subelement).attr('name') == 'address-type')
    				subtype = $(subelement).val();
    			else
    				addressJSON[$(subelement).attr('name')] = $(subelement).val();
    		});
    		
    		if($.isEmptyObject(addressJSON))
    			return;
    		
    		properties.push({
        		"name": $(element).attr('data'),
        		"value": JSON.stringify(addressJSON),
        		"subtype": subtype
        	})
    	}
    	else{
    		var inputElement = $(element).find('input');
    		var selectElement = $(element).find('select');

    		// If element has no value, don't push into properties 
    		if(inputElement.val() == undefined || inputElement.val().trim().length == 0)
    			return;
    		
    		// Checks whether fields for hidden fields (Used for clone do not save them)
    		if (!$(element).find('input').parents('div.controls').hasClass('hide'))
    			properties.push({
    				"name": $(element).attr('data'),
    				"value": inputElement.val(),
    				"subtype": selectElement.val()
    			})
    	} 	
    });

    
    /*
     * Check whether there are any properties in existing contact, which can get lost in contact update form.
     * There are chances user adds a property(may be stripe id..) using developers API, in order not to loose them 
     * following verification is done
     */
    
    if(obj.properties)
    	{
    	var properties_temp = properties;
    	$.each(obj.properties, function(contact_property_index, contact_property) {
    		$.each(properties_temp, function(new_property_index, new_property) {	
    			
    			// If property name exists in new property, no changes are made considering property is updated.
    			if(new_property.name == contact_property.name) {
    				
    				return false;
    			}
    		
    
    			// If property name is missing in new properties then preserving them.
    			else if(new_property_index == (properties_temp.length - 1) && custom_fields_in_template.indexOf(contact_property.name) == -1 && contact_property.type == "CUSTOM")
    			{
    				properties.push(contact_property);
    			}
    		});
    	});
    	}
    
    // Stores json object with "properties" as value
    var propertiesList = [];
    propertiesList.push({
        "name": "properties",
        "value": properties
    });
    
    // Convert array into JSON
    for (var i = 0; i < propertiesList.length; ++i) {
        obj[propertiesList[i].name] = propertiesList[i].value;
    }
    
    // Updates the old contact
    if (id != null) obj['id'] = id;
    
    obj["created_time"] = created_time;
    
    
    // Saves contact
    var contactModel = new BaseModel();
    contactModel.url = 'core/api/contacts';
    contactModel.save(obj, {
        success: function (data) {
        	
        	// Remove social search results from local storage after editing a contact
        	localStorage.removeItem("Agile_linkedin_matches_" + data.get('id'));
        	localStorage.removeItem("Agile_twitter_matches_" + data.get('id'));

        	// Removes disabled attribute of save button
			$(saveBtn).removeAttr('disabled');
			
        	// Adds the tags to tags collection 
        	if (tags != undefined && tags.length != 0)
        		{
        			$.each(tags[0].value,function(index, tag){
        				tagsCollection.add( {"tag" : tag} );
        			});
        		}
        	
        	// Removes loading image
        	$('#' + form_id).find('span.save-status img').remove();
        	$('#' + modal_id).find('span.save-status img').remove();
        	
        	// Removes person image form new-person-modal
        	$('#' + modal_id).find('img.person-img').remove();
        	            
        	// Loads continue editing form along with custom fields if any
        	if (continueContact) {
                
                add_custom_fields_to_form(data.toJSON(), function(contact){
                	
                deserialize_contact(contact, template);
                	
                });
                
            } 
        	else {
        
        		if(App_Contacts.contactDetailView)
        		{
        			App_Contacts.contactDetailView.model = data
        		}
        		
            	/*
            	 * If contactsListView is defined, it is getting the contact from there not the updated one.
            	 * Delete the old one and add the updated one to the listView. 
            	 */
        		if (App_Contacts.contactsListView && App_Contacts.contactsListView.collection.get(data.id) != null) {

            		App_Contacts.contactsListView.collection.remove(obj);
            	
            		App_Contacts.contactsListView.collection.add(data);
            	}
            	
            	// If contact list is under a selected custom view, then add changed contact to that list
        		if(App_Contacts.contact_custom_view && App_Contacts.contact_custom_view.collection.get(id) != null)
        		{
        			App_Contacts.contact_custom_view.collection.remove(obj);

        			App_Contacts.contact_custom_view.collection.add(data);
        		}
        		
        		if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection)
        		{
        			//Add to View only if of corresponding filter
        			if( (data.get('type')=='PERSON' && !readCookie('company_filter')) || (data.get('type')=='COMPANY' && readCookie('company_filter')))
        				App_Contacts.contactsListView.collection.add(data);
        			
        			console.log(App_Contacts.contactsListView.collection.length);
        		}
            	
            	App_Contacts.navigate("contact/" + data.id, {
                	trigger: true
            	});
            	               
            }
        	
        	
        	// Hides the modal
        	$('#' + modal_id).modal('hide');
            
        	// Resets each element
            $('#' + form_id).each(function () {
                this.reset();
            });
            
            // Removes tags list(remove them from new person modal)
            $('.tagsinput', $("#"+modal_id)).empty().append('<li class="tag" style="display: inline-block;" data="lead">lead<a class="close" id="remove_tag">&times</a></li>');
        },
        error: function (model, response) {
        	
        	// Removes disabled attribute of save button
    		$(saveBtn).removeAttr('disabled');
    		
        	// Remove loading image
        	$('#' + modal_id).find('span.save-status img').remove();
        	$('#' + form_id).find('span.save-status img').remove();
        	
            // Shows eroor alert of duplicate contacts
        	$('#' + modal_id).find(".duplicate-email").html('<div class="alert alert-error" style="display:none"><a class="close" data-dismiss="alert" href="#">&times</a>Please change email. A contact already exists with this email.</div>');

            $('#' + modal_id).find(".alert").show();
        }
    });

    return obj;
}

/**
 * Deserializes the contact to edit it. Loads the editing form using handlebars.
 * Fills the matched values, by iterating the properties. 
 *  
 * @param {Object} contact
 * 			contact object to edit
 * @param {String} template
 * 			template key to load the form
 */
function deserialize_contact(contact, template) {

    // Loads the form based on template value  
    var form = $("#content").html(getTemplate(template, contact));
    
    console.log('CONTACT = ');
    console.log(contact);
    
    // Add placeholder and date picker to date custom fields
    $('.date_input').attr("placeholder","MM/DD/YYYY");
    
    $('.date_input').datepicker({
        format: 'mm/dd/yyyy'
    });
    
    // To set typeahead for tags
    setup_tags_typeahead();
    
    // Iterates through properties and ui clones
    $.each(contact.properties, function (index, element) {

        // Removes first input field
        $($('#' + form.attr('id') + ' div.multiple-template.' + element.name).closest('div.controls.second')).remove();
        var field_element = $('#' + form.attr('id') + ' div.multiple-template.' + element.name);

        // Generate and populate multiple fields
        fill_multi_options(field_element, element);
    });
    
    var fxn_display_company=function(data,item)
	{
		$("#content [name='contact_company_id']").html('<li class="tag"  style="display: inline-block;" data="' + data + '"><a href="#contact/' + data +'">' + item + '</a><a class="close" id="remove_tag">&times</a></li>');
		$("#content #contact_company").hide();
	}
	agile_type_ahead("contact_company",$('#content'), contacts_typeahead,fxn_display_company,'type=COMPANY','<b>No Results</b> <br/> We will add a new one');

	if(contact.contact_company_id && contact.contact_company_id.length>0)
	{
		for(var i=0;i<contact.properties.length;++i)
		{	
			if(contact.properties[i].name =='company')
			{	
				$("#content #contact_company").hide();
				$("#content [name='contact_company_id']")
					.html('<li class="tag"  style="display: inline-block;" data="' + contact.contact_company_id + '"><a href="#contact/' + contact.contact_company_id +'">' +contact.properties[i].value + '</a><a class="close" id="remove_tag">&times</a></li>');
			}
		}
	}
}

/**
 * Generates new field for each value in properties (especially for email, phone and website)
 * 
 * @method fill_multi_options
 * @param {Object} field_element
 * 				Html element having property name as class name		
 * @param {Object} element
 * 				property object
 * 
 */
function fill_multi_options(field_element, element) {
	
	// Fills address fields
	if(element.name == 'address'){
		var json = JSON.parse(element.value);
		
		$.each($(field_element).children(":not(br)"), function (index, sub_field_element){
			var name = $(sub_field_element).attr('name');
			if(name == 'address-type')
				$(sub_field_element).val(element.subtype);
			else
				$(sub_field_element).val(json[name]);
		});
	}
	else{
		
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
 * Creates json object for each field in contact form with name, type and 
 * value as attributes.
 * 
 * @method property_JSON
 * @param name
 * 			name of the field
 * @param id
 * 			id of the field element
 * @param type
 * 			type of the element
 * @returns property json object
 */
function property_JSON(name, id, type) {
    var json = {};

    if (type == undefined) json.type = "SYSTEM";
    else json.type = type;

    json.name = name;
    json.value = $('#' + id).val();
    return json;
}

// UI Handlers for Continue-contact and continue-company
$(function () {

	
	$("#content [name='contact_company_id'] a.close").live('click',function(){
		$("#content #contact_company").show();
		$("#content [name='contact_company_id']").html('');
	})
	
    // Clones multiple fields
    $("a.multiple-add").die().live('click', function (e) {
    	e.preventDefault();
    	
        // Clone the template
        $(this).parents("div.control-group").append(
        $(this).parents().siblings("div.controls:first").clone().removeClass('hide'));
    });



    // Removes multiple fields
    $("a.multiple-remove").live('click', function (e) {
    	e.preventDefault();
    	
        // Get closest template and remove from the container
        $(this).closest("div.multiple-template").remove();
    });

    // Continue editing of new-person-modal 
    $('#continue-contact').click(function (e) {
          var model = serialize_and_save_continue_contact(e, 'personForm','personModal', true, true, this,'tags_source_person_modal');
    });

    // Update button click event in continue-contact form
    $("#update").die().live('click', function (e) {
          var model=serialize_and_save_continue_contact(e, 'continueform', 'personModal', false, true, this,"tags_source_continue_contact");
          
          if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection.get(model.id) != null)	
          {
        	  App_Contacts.contactsListView.collection.remove(model.id);
        	  App_Contacts.contactsListView.collection.add(model); 
          }
    });
    
    // Close button click event in continue-contact form
    $("#close").live('click', function (e) {
		e.preventDefault();
	    var id = $('#continueform input[name=id]').val();
	    if(id)
	    {
	    	Backbone.history.navigate("contact/" + id, {
	    		trigger: true
	    	});
	    }
    });

    // Continue editing in the new-company-modal (to avoid changing the route event to be prevented.)
    $('#continue-company').click(function (e) {
        var model = serialize_and_save_continue_contact(e, 'companyForm', 'companyModal', true, false);
         
    });
    
 // Update button click event in continue-company
    $("#company-update").die().live('click', function (e) {
        var model=serialize_and_save_continue_contact(e, 'continueCompanyForm', 'companyModal', false, false, this);
        
        if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection.get(model.id) != null)	
        {
        	App_Contacts.contactsListView.collection.remove(model.id);
      		App_Contacts.contactsListView.collection.add(model);
        }
    });
});