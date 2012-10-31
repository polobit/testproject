// Serialize and save continue contact
function serializeAndSaveContinueContact(e, form_id, modal_id, continueContact, is_person) {
	if(e)
		e.preventDefault();
	
    var $form = $('#' + form_id);
    
    // Validate Form
    if(!isValidForm($form))
    {
    	
    	return;
    }
    
    // Show loading symbol until model get saved
    $('#' + modal_id).find('span.save-status').html(LOADING_HTML);
    $('#' + form_id).find('span.save-status').html(LOADING_HTML);
    
    // Read multiple values from continue contact
    var properties = [];

    var id = $('#' + form_id + ' input[name=id]').val();
    var obj = {};
    var properties = [];
    var address = [];
    var template;
    
    // Contact Custom properties

    var custom_field_elements =  $('#' + form_id).find('.custom_field');

    $.each(custom_field_elements, function(index, element){
    	var id = $(element).attr('id'), name = $(element).attr('name');
    	
    	if (isValidField(id)) properties.push(propertyJSON(name, id, 'CUSTOM'));
    });
    
    if(is_person){
    
    	template = 'continue-contact';
    	
    // Person properties
    if (isValidField('fname'))properties.push(propertyJSON('first_name', 'fname'));
   
    if (isValidField('lname'))properties.push(propertyJSON('last_name', 'lname'));
    
    if (isValidField('contact_company')) properties.push(propertyJSON('company', 'contact_company'));

    if (isValidField('email')) properties.push(propertyJSON('email', 'email'));

    if (isValidField('job_title')) properties.push(propertyJSON('title', 'job_title'));
    
    var tags = getTags(form_id);
	if (tags != undefined && tags.length != 0) obj.tags = tags[0].value;
	
    }else{
    	
    	template = 'continue-company';

    // Company properties
    if (isValidField('name')) properties.push(propertyJSON('name', 'name'));
    
    if (isValidField('url')) properties.push(propertyJSON('url', 'url'));
    
    var type = $('#' + form_id + ' input[name=type]').val();
    obj.type = type;
    }
    
    $('#' + form_id + ' div.multiple-template').each(function (index, element) {
       
    	if($(element).attr('data') == 'address'){
    		var addressJSON = {};
    		var subtype;
    		$.each($(element).children(":not(br)"), function (index, subelement){
    			if($(subelement).attr('name') == 'address-type')
    				subtype = $(subelement).val();
    			else
    				addressJSON[$(subelement).attr('name')] = $(subelement).val();
    		});
    		
    		properties.push({
        		"name": $(element).attr('data'),
        		"value": JSON.stringify(addressJSON),
        		"subtype": subtype
        	})
    	}
    	else{
    		var inputElement = $(element).find('input');
    		var selectElement = $(element).find('select');

    		// Checks whether fields for hidden fields (Used for clone do not save them)
    		if (!$(element).find('input').parents('div.controls').hasClass('hide'))
    			properties.push({
    				"name": $(element).attr('data'),
    				"value": inputElement.val(),
    				"subtype": selectElement.val()
    			})
    	} 	
    });

    var propertiesList = [];
    propertiesList.push({
        "name": "properties",
        "value": properties
    });
    
    // Convert array into JSON
    for (var i = 0; i < propertiesList.length; ++i) {
        obj[propertiesList[i].name] = propertiesList[i].value;
    }
    if (id != null) obj['id'] = id;
    
    // Save contact
    var contactModel = new Backbone.Model();
    contactModel.url = 'core/api/contacts';
    contactModel.save(obj, {
        success: function (data) {
        	// Remove loading image
        	$('#' + form_id).find('span.save-status img').remove();
        	$('#' + modal_id).find('span.save-status img').remove();
        	
        	// Remove loading image
        	$('#' + modal_id).find('img.person-img').remove();
        	            
        	if (continueContact) {
                
                addCustomFieldsToForm(data.toJSON(), function(contact){
                	
                deserializeContact(contact, template);
                	
                });
                
            } else if(is_person){
                App_Contacts.navigate("contact/" + data.id, {
                	trigger: true
            	});
            }else{
                  	App_Contacts.navigate("contacts", {
                	trigger: true
            	});            	
            }
        	
        	$('#' + modal_id).modal('hide');
            // Reset each element
            $('#' + form_id).each(function () {
                this.reset();
            });
            
            // Remove tags list 
            $('.tagsinput').empty();
        },
        error: function (model, response) {
        	
        	// Remove loading image
        	$('#' + modal_id).find('span.save-status img').remove();
        	$('#' + form_id).find('span.save-status img').remove();
        	
            $('#' + modal_id).find(".duplicate-email").html('<div class="alert alert-error" style="display:none"><a class="close" data-dismiss="alert" href="#">×</a>Please change email. A contact already exists with this email.</div>');

            $('#' + modal_id).find(".alert").show();
        }
    });

    return obj;
}

// Deserialize continue Contact
function deserializeContact(contact, template) {

    // Shows template  
    var form = $("#content").html(getTemplate(template, contact));
    
    // To set typeahead for tags
    setupTagsTypeAhead();
    
    // Iterates through properties and ui clones
    $.each(contact.properties, function (index, element) {

        // Removes first input field
        $($('#' + form.attr('id') + ' div.multiple-template.' + element.name).closest('div.controls.second')).remove();
        var field_element = $('#' + form.attr('id') + ' div.multiple-template.' + element.name);

        // Generate and populate multiple fields
        fillMultiOptions(field_element, element);
    });
}


// Generated new field for each value in Properties  Author : Yaswanth  08/09/2012
function fillMultiOptions(field_element, element) {
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
		var append_to = $(field_element).parents('div.control-group');

		var html_element = append_to.children().siblings("div.controls:first").clone().removeClass('hide');

		$(html_element).find('input').val(element.value).attr('name', element.value);
		$(html_element).find('select').val(element.subtype);
    
		html_element.appendTo(append_to);
	}
}

// Create a property object
function propertyJSON(name, id, type) {
    var json = {};

    if (type == undefined) json.type = "SYSTEM";
    else json.type = type;

    json.name = name;
    json.value = $('#' + id).val();
    return json;
}

// UI Handlers for Continue-contact and continue-company
$(function () {
    // Clone Multiple
    $("i.multiple-add").die().live('click', function (e) {
        // Clone the template
        $(this).parents("div.control-group").append(
        $(this).parents().siblings("div.controls:first").clone().removeClass('hide'));
    });



    // Remove multiple
    $("i.multiple-remove").live('click', function (e) {
        // Get closest template and remove from the container
        $(this).closest("div.multiple-template").remove();
    });

    // Continue editing in the new-person-modal Rammohan 03-08-2012.
    $('#continue-contact').click(function (e) {
        var model = serializeAndSaveContinueContact(e, 'personForm','personModal', true, true);
    });

    // Update in continue-contact
    $("#update").die().live('click', function (e) {
        serializeAndSaveContinueContact(e, 'continueform', 'personModal', false, true);
    });
    
    // Close in continue-contact
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

    // Continue editing in the new-company-modal
    /*$('#continue-company').click(function (e) {
     
        var model = serializeAndSaveContinueContact(e, 'companyForm', 'companyModal', true, false);
        
    });*/
    
 // Update in continue-company
    $("#company-update").die().live('click', function (e) {
        serializeAndSaveContinueContact(e, 'continueCompanyForm', 'companyModal', false, false);
    });

});