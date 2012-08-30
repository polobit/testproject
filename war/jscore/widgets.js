var Catalog_Widgets_View = null;

// Show when Add widget is selected by user in contact view
function pickWidget() {
    if (Catalog_Widgets_View == null) {
        Catalog_Widgets_View = new Base_Collection_View({
            url: '/core/api/widgets/default',
            restKey: "widget",
            templateKey: "widgets-add",
            individual_tag_name: 'div'
        });

        Catalog_Widgets_View.collection.fetch();
    }
    $('#content').html(Catalog_Widgets_View.el);
}

// Load Widgets
function loadWidgets(el, contact, user) {
	
	// Create Data JSON
	var data = {contact: contact, user: user};
	
	// console.log("Contact length" + escape(contact).length)
	
    var view = new Base_Collection_View({
        url: '/core/api/widgets',
        restKey: "widget",
        templateKey: "widgets",
        individual_tag_name: 'li',
        sortKey: 'position',
        modelData: data
    });

    view.collection.fetch({
        success: function () {
        	
        	
        	// Fetch all Widgets URL and run them through handlebars to convert {{xx} to actual values
        	  _(view.collection.models).each(function (model) { // in case collection is not empty
						var id = model.get("id");
						var url = model.get("url");
						$.get(url, "script");
						
						// Set the data element in the div
						// We can retrieve this in get plugin prefs
						
						$('#' + model.get('name')).data('model', model);						
				}, this);
        	
            // Make widgets sortable
            $(".widget-sortable", newEl).sortable({
                update: function (event, ui) {                	
                	var models = [];

                    // Store the save
                    $('.widget-sortable li').each(function (index) {
<<<<<<< HEAD
                    	
                        var modelId = $(this).find('.widget-add').attr('id');
=======
                        var model_name = $(this).find('.widget-add').attr('id');
                        
                        // Get Model
                        var model = $('#' + model_name).data('model');
                        
>>>>>>> a1be267395d3dbe5052e02aacf51bd3d0177d75d
                        // console.log(modelId);
                        models.push({id: model.get("id"), position: index});
                    });
                    
                    // Store the positions at server
                    $.ajax({
                        type: 'POST',
                        url: '/core/api/widgets/positions',
                        data: JSON.stringify(models),
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                           // console.log("Positions Saved Successfully");
                        },
                        dataType: 'json'
                    });
                }
            });
            $(".widget-sortable", newEl).disableSelection();
        }
    });
    
    
    
    var newEl = view.render().el;

    $('#widgets', el).html(newEl);
}

$(function () {

    $('.add-widget').live('click', function (e) {

        var widgetName = $(this).attr('widget-name');
        if (Catalog_Widgets_View == null) {
            alert("widgets are not loaded yet");
            return;
        }

        alert("saving " + widgetName);

        // Get Widget Model
        var models = Catalog_Widgets_View.collection.where({
            name: widgetName
        });
        if (models.length == 0) {
            alert("Not found");
        }
        var widgetModel = models[0];
        var newWidgetModel = widgetModel.clone();
        newWidgetModel.url = '/core/api/widgets';
        newWidgetModel.save();
        
        // Navigate back to the contact id form
        Backbone.history.navigate("contact/" + App_Contacts.contactDetailView.model.id, { trigger: true });
        
    })
});


function addSocial(socialEl) {

    // Add Social Search
    var socialServices = ["TWITTER", "LINKEDIN"];

    $.each(socialServices, function (index, value) {
        var url = "/core/api/social/" + value + "/" + App_Contacts.contactDetailView.model.id
      
        var socialResults = new SocialSearchesListView();
        socialResults.collection.url = url;

        // Check if the results are present in local Storage 
        var key = value + '-' + App_Contacts.contactDetailView.model.id;

        // Store the key for list to retrieve
        socialResults.key = key;
        var cache = localStorage.getItem(key);

        if (localStorage && cache != null && JSON.parse(cache).length != 0) {
            socialResults.collection = new SocialSearchCollection(JSON.parse(cache));
            socialResults.render();
        } else socialResults.collection.fetch();


        	$('#social', socialEl).append(socialResults.el);
    });
}


/*
 * THIRD PARTY SCRIPTS - PLUGINS - INTEGRATION POINTS
 */

//Updates the current contact
function agile_crm_update_contact(propertyName, value)
{
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	
	var properties = contact_model.toJSON()['properties'];

	properties.push({"name":propertyName,"value":value});
	

	// Update the property
	
	contact_model.set("properties", properties);
	
	// Set URL - is this required?
	contact_model.url = 'core/api/contacts'
	// Save model
	contact_model.save();
}

function agile_crm_add_note(sub, description)
{
	// Add Note to Notes Collection
	
	// Get Current Contact Model
	var contact_model =  this.contactDetailView.model;
	
	// Get ID
	
	// Create Model and Save
	
}

function agile_crm_get_contact ()
{
	return App_Contacts.contactDetailView.model.toJSON();
		
}

// Finds whether property name exists 
function agile_crm_get_contact_property(propertyName) {
	
	var contact_model =  App_Contacts.contactDetailView.model;
	
	var properties = contact_model.get('properties');
	var property;
	
	$.each(properties,function(key,value){
		if(value.name == propertyName){
			property = value;
		}
	});
	
	if(!property) {
		var object = agile_crm_get_widget_property("Twitter");
		//$.getJSON("/core/api/widget/contact/TWITTER/" + object.Twitter +"/" + plugin_id, function (data) {
	}
		
	return property;

}

// Get Plugin Id
function agile_crm_get_plugin_id(pluginName)
{
	var model_data = $('#' + pluginName).data('model');
	return model_data.get('id');
}
	
// Get Plugin Prefs
function agile_crm_get_plugin_prefs(pluginName)
{
	
	return $('#' + pluginName).data('model').toJSON().prefs;
}


 // Save widget Property 
function agile_crm_save_widget_property(propertyName, value) {
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	
	// Get WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');
		
	// If widget_properties are null
	if(!widget_properties)
		widget_properties = {};
	
	else
		widget_properties = JSON.parse(widget_properties);

	widget_properties[propertyName] = value;
	
	contact_model.set({"widget_properties" : JSON.stringify(widget_properties)},{silent: true});
	
	contact_model.url = 'core/api/contacts'
		
	// Save model
		contact_model.save()
	
}

// Get widget by property name
function agile_crm_get_widget_property(propertyName) {
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	
	// Get WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');
	
	// If widget-properties are null return 
	if(!widget_properties)
		return;
	
	// Convert JSON string to JSON Object
	widget_properties = JSON.parse(widget_properties);
	
	
	
	
	return widget_properties[propertyName];
}

// Delete widget property
function agile_crm_delete_widget_property(propertyName) {
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	
	// Get WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');
	
	// If widget-properties are null return 
	if(!widget_properties)
		return;

	widget_properties = JSON.parse(widget_properties);
	
	delete  widget_properties[propertyName];
	
	contact_model.set({"widget_properties" : JSON.stringify(widget_properties)},{silent: true});
	
	contact_model.url = 'core/api/contacts';
	
	// Save model
	contact_model.save()
}