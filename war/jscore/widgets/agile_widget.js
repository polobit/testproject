
/*
 * THIRD PARTY SCRIPTS - PLUGINS - INTEGRATION POINTS
 */

//Updates the current contact
function agile_crm_update_contact(propertyName, value)
{
	
	// Get Current Contact Model
	var contact_model =  App_Contacts.contactDetailView.model;
	var properties = contact_model.toJSON()['properties'];
    
	// Update Property if already present
	if(agile_crm_get_contact_property(propertyName))
	{
    		$.each(properties, function(key, property){
    			if(property.name == propertyName){
    				property.value = value;
    			}
    		});
	}
    else
	    properties.push({"name":propertyName, "value":value});
	
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
	
	if(property)
	return property.value;

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

//Get Plugin Prefs
function agile_crm_save_widget_prefs(pluginName, prefs)
{
	 var widget = $('#' + pluginName).data('model').toJSON();
	 widget.prefs = prefs;
	 
	 var widget_model = new Backbone.Model();
	 
	 widget_model.url = 'core/api/widgets'
		 
	 widget_model.save(widget);
	 
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