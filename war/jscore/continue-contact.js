// Serialize and save continue contact
function serializeAndSaveContinueContact(e, form_id, continueContact) {
    e.preventDefault();
    
    var $form = $('#' + form_id);
    
    // Validate Form
    if(!isValidForm($form))
    {
    	
    	return;
    }
    
    
    // Read multiple values from continue contact
    var properties = [];

    var id = $('#' + form_id + ' input[name=id]').val();
    var obj = {};
    var properties = [];
    properties.push(propertyJSON('first_name', 'fname'));
    properties.push(propertyJSON('last_name', 'lname'));

    // if (isValidField('organization')) properties.push(propertyJSON('company', 'organization'));

    // if (isValidField('job')) properties.push(propertyJSON('title', 'job'));

    if (isValidField('contact_company')) properties.push(propertyJSON('company', 'contact_company'));

    if (isValidField('email')) properties.push(propertyJSON('email', 'email'));

    if (isValidField('job_title')) properties.push(propertyJSON('title', 'job_title'));

    $('#' + form_id + ' div.multiple-template').each(function (index, element) {
        var inputElement = $(element).find('input');
        var selectElement = $(element).find('select');

        // Checks whether fields for hidden fields (Used for clone do not save them)
        if (!$(element).find('input').parents('div.controls').hasClass('hide'))
        	properties.push({
        		"name": $(element).attr('data'),
        		"value": inputElement.val(),
        		"subtype": selectElement.val()
        	})
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

    var tags = getTags('tags-new-person');
    if (tags != undefined) obj.tags = tags;

    // Save contact
    var contactModel = new Backbone.Model();
    contactModel.url = 'core/api/contacts';
    contactModel.save(obj, {
        success: function (data) {
            if (continueContact) {
                $('#personModal').modal('hide');
                deserializeContact(data.toJSON());
            } else {
                $('#personModal').modal('hide');
                App_Contacts.navigate("contact/" + data.id, {
                    trigger: true
                });
            }
            // Reset each element
            $('#' + form_id).each(function () {
                this.reset();
            });
        },
        error: function (model, response) {
            $("#personModal").find(".duplicate-email").html('<div class="alert alert-error" style="display:none"><a class="close" data-dismiss="alert" href="#">×</a>Please change email. A contact already exists with this email.</div>');

            $("#personModal").find(".alert").show();
        }
    });

    return obj;
}

// Deserialize continue Contact
function deserializeContact(contact) {

    // Shows template  
    var form = $("#content").html(getTemplate("continue-contact", contact));

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

    var append_to = $(field_element).parents('div.control-group');

    var html_element = append_to.children().siblings("div.controls:first").clone().removeClass('hide');

    $(html_element).find('input').val(element.value).attr('name', element.value);
    $(html_element).find('select').val(element.subtype);
    
    html_element.appendTo(append_to);
    
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
        var model = serializeAndSaveContinueContact(e, 'personForm', true);
    });

    // Update in continue-contact
    $("#update").die().live('click', function (e) {
        serializeAndSaveContinueContact(e, 'continueform');
    });

    // Continue editing in the new-company-modal
    $('#continue-company').click(function (e) {
        $("#companyModal").modal('hide');
        alert("test");
        App_Contacts.navigate("continue-company", {
            trigger: true
        });
    });

});