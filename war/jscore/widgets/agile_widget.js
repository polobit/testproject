/**
 * THIRD PARTY SCRIPTS - PLUGINS - INTEGRATION POINTS.
 * 
 * agile_widgets.js defines third party JavaScript API.
 * Functionalities provided by script API are
 * <pre>
 * -- Retrieves property of current contact 	     : agile_crm_get_contact_property(propertyName)
 * -- Retrieves properties list of current contact   : agile_crm_get_contact_properties_list(propertyName)
 * -- Updating a contact by specifying property name : agile_crm_update_contact(propertyName, Value)
 * -- Updates contact properties with given values   : agile_crm_update_contact_properties(propertiesArray, callback)
 * -- Retrieves current contact object				 : agile_crm_get_contact()
 * -- Add Note to current contact					 : agile_crm_add_note(subject, description)
 * -- Return widget object by widget name			 : agile_crm_get_plugin(pluginName)
 * -- Return widget preferences by widget name	     : agile_crm_get_plugin_prefs(pluginName)
 * -- Save widget preferences  by widget name		 : agile_crm_save_widget_prefs(pluginName, preferences)
 * -- Retrieves widget property from current contact : agile_crm_get_widget_property_from_contact(propertyName)
 * -- Delete widget property from current contact	 : agile_crm_delete_widget_property_from_contact(propertyName)
 * -- Retrieves contact property value by subtype    : agile_crm_get_contact_property_by_subtype(propertyName, subtype)
 * -- Delete value given from contact by subtype     : agile_crm_delete_contact_property_by_subtype(propertyName, subtype, value)
 * -- Save property to contact for given subtype     : agile_crm_save_contact_properties_subtype(propertyName, subtype, value)
 * </pre>
 */

/**
 * Searches the property fields in current contact with given property name, if
 * property with given property name exists, then returns its value as string
 * 
 * @param propertyName
 *            name of the property
 */
function agile_crm_get_contact_property(propertyName)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties field list from contact
	var properties = contact_model.get('properties');
	var property_value;

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and retrieves value of the
	 * property if it matches
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			property_value = property.value;
			return false;
		}
	});

	// If property value is defined then return it
	if (property_value)
		return property_value;

}

/**
 * Searches the property fields in current contact with given property name, if
 * property with given property name exists, then returns its value in a array
 * 
 * <p>
 * This method is used when contact property has multiple values like email,
 * phone, website etc
 * </p>
 * 
 * @param propertyName
 *            name of the property
 * @returns {Array}
 */
function agile_crm_get_contact_properties_list(propertyName)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');
	var property_list = [];

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and retrieves value of the
	 * property if it matches
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			property_list.push(property);
		}
	});

	// If property is defined then return property value list
	return property_list;

}

/**
 * Updates a contact based on the property name and its value specified. If
 * property name already exists with the given then replaces the value, if
 * property is new then creates a new field and saves it
 * 
 * @param propertyName:
 *            Name of the property to be created/updated
 * @param value :
 *            value for the property
 */
function agile_crm_update_contact(propertyName, value, callback)
{
	// Gets current contact model from the contactDetailView object
	var contact_model = App_Contacts.contactDetailView.model;

	// Reads properties fied from the contact
	var properties = contact_model.toJSON()['properties'];
	var flag = false;

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and if match is found, updates
	 * the value of it with the given value
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			// flag is set true to indicate property already exists in contact
			flag = true;
			property.value = value;
			return false;
		}
	});

	// If flag is false, given property is new then new field is created
	if (!flag)
		properties.push({ "name" : propertyName, "value" : value, "type" : "CUSTOM" });

	contact_model.set({ "properties" : properties }, { silent : true });
	contact_model.url = "core/api/contacts";

	// Save model
	contact_model.save({ success : function(model, response)
	{
		if (callback && typeof (callback) == "function")
			callback();
	} });

}

/**
 * Updates a contact with the list of property name and its value specified in
 * propertiesArray. If property name already exists with the given then replaces
 * the value, if property is new then creates a new field and saves it
 * 
 * @param propertiesArray
 *            Array of the properties to be created/updated
 * @param callback
 */
function agile_crm_update_contact_properties(propertiesArray, callback)
{
	// Gets current contact model from the contactDetailView object
	var contact_model = App_Contacts.contactDetailView.model;

	// Reads properties field from the contact
	var properties = contact_model.toJSON()['properties'];

	// Iterates for each property in properties list
	for ( var i in propertiesArray)
	{
		var flag = false;

		// Iterates through each property in contact properties
		$.each(properties, function(index, property)
		{
			/*
			 * checks for the match with given property name in properties list
			 * and if match is found and if given properties has no subtype,
			 * updates the value of it with the given value
			 */
			if (property.name == propertiesArray[i].name)
			{
				// flag is set true to indicate property is not new
				flag = true;

				/*
				 * If given properties list has subtype, then update the value
				 * of it, else flag is set false to indicate it as new property
				 */
				if (propertiesArray[i].subtype)
				{
					if (propertiesArray[i].subtype == property.subtype)
						property.value = propertiesArray[i].value;
					else
						flag = false;
				}
				else
					property.value = propertiesArray[i].value;

				// break each if match is found
				return false;
			}
		});

		// If flag is false, given property is new then new field is created
		if (!flag)
			properties
					.push({ "name" : propertiesArray[i].name, "value" : propertiesArray[i].value, "subtype" : propertiesArray[i].subtype, "type" : "CUSTOM" });

	}

	// If property is new then new field is created
	contact_model.set({ "properties" : properties }, { silent : true });
	contact_model.url = "core/api/contacts";

	// Save model
	contact_model.save({ success : function(model, response)
	{

		if (callback && typeof (callback) == "function")
			callback();
	} });
}

/**
 * Retrieves current contact from model
 * 
 * @returns
 */
function agile_crm_get_contact()
{
	return App_Contacts.contactDetailView.model.toJSON();
}

/**
 * Adds note to current contact
 * 
 * @param sub
 * @param description
 */
function agile_crm_add_note(subject, description)
{
	// Get Current Contact Model
	var contact_model = App_Contacts.contactDetailView.model;

	// Get ID
	var note = new Backbone.Model();
	var contactModel = new Backbone.Model();
	note.url = 'core/api/notes';

	note.set("subject", subject);
	note.set("description", description);

	note.set("contacts", [
		contact_model.id.toString()
	]);

	note.save();
	// Create Model and Save
}

/**
 * Retrieves plugin object based on the plugin name specified
 * 
 * @param pluginName :
 *            name of the plugin to fetch
 */
function agile_crm_get_plugin(pluginName)
{
	/*
	 * Retrieves plugin data from the model data which is set to plugin block
	 * while loading plugins
	 */
	var model_data = $('#' + pluginName).data('model');

	return model_data.toJSON();
}

/**
 * Retrieves plugin preferences based on the name of the plugin
 * 
 * @param pluginName :
 *            name of the plugin to get preferences
 * @returns plugin preferences
 */
function agile_crm_get_plugin_prefs(pluginName)
{
	// Gets data attribute of from the plugin, and return prefs from that object
	return $('#' + pluginName).data('model').toJSON().prefs;
}

/**
 * Saves given widget preferences to current user based on given plugin name.
 * 
 * @param pluginName :
 *            name of the plugin specified, to associate preferences
 * @param prefs :
 *            preferences to be saved
 */
function agile_crm_save_widget_prefs(pluginName, prefs, callback)
{
	// Get the model from the the element
	var widget = $('#' + pluginName).data('model');

	// Set changed preferences to widget backbone model
	widget.set("prefs", prefs);

	// URL to connect with widgets
	widget.url = "core/api/widgets"

	// Set the changed model data to respective plugin div as data
	$('#' + pluginName).data('model', widget);

	// Save the updated model attributes
	widget.save(widget, { success : function(data)
	{
		console.log("Saved widget: " + data.toJSON());
		if (callback && typeof (callback) === "function")
		{
			// Execute the callback, passing parameters as necessary
			callback(data.toJSON());
		}
	} });

}

/**
 * Returns widget property value from widget_properties field in contact
 * 
 * @param propertyName :
 *            name(key) of the property value stored in widget_properties JSON
 * @Return widget property value
 * 
 */
function agile_crm_get_widget_property_from_contact(propertyName)
{

	// Gets Current Contact Model
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');

	// If widget-properties are null return
	if (!widget_properties)
		return;

	// Converts JSON string to JSON Object
	widget_properties = JSON.parse(widget_properties);

	// Returns value of property from widget_properties JSON
	return widget_properties[propertyName];
}

/**
 * Deletes widget property, the property key value pair from widget_properties
 * JSON string in contact based on given property name
 * 
 * @param propertyName :
 *            Name of the property to be deleted
 */
function agile_crm_delete_widget_property_from_contact(propertyName)
{

	// Gets Current Contact Model from contactDetailView object
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');

	// If widget-properties id null return
	if (!widget_properties)
		return;

	/*
	 * If widget_properties are not null, then convert widget_properties string
	 * in to JSON object
	 */
	widget_properties = JSON.parse(widget_properties);

	// deletes value from JSON
	delete widget_properties[propertyName];

	// set Updated widget_properties in to contact model
	contact_model.set("widget_properties", JSON.stringify(widget_properties));

	contact_model.url = "core/api/contacts";

	// Save updated contact model
	contact_model.save();
}

/**
 * Retrieves property value from current contact based on given property name
 * and sub type of the property
 * 
 * @param propertyName
 *            Name of the property
 * @param subtype
 *            Subtype of the property
 */
function agile_crm_get_contact_property_by_subtype(propertyName, subtype)
{

	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');
	var property;

	// Iterates though each property and finds the value related to the property
	// name
	$.each(properties, function(key, value)
	{
		if (value.name == propertyName && value.subtype == subtype)
		{
			property = value;
		}
	});

	// If property is defined then return property value
	if (property)
		return property.value;

}

/**
 * Deletes contact property value from contact based on given property name and
 * sub type of the property and value of the property
 * 
 * @param propertyName
 *            Name of the property
 * @param subtype
 *            Subtype of the property
 * @param value
 *            Value of the property
 */
function agile_crm_delete_contact_property_by_subtype(propertyName, subtype, value)
{

	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');

	/*
	 * Iterates though each property and finds the value related to the property
	 * name and deletes it
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName && property.subtype == subtype && property.value == value)
		{
			properties.splice(index, 1);
			contact_model.set("properties", properties);

			contact_model.url = "core/api/contacts";

			// Save updated contact model
			contact_model.save();

			return false;
		}
	});

}

/**
 * Saves contact property value to contact with the given property name and sub
 * type of the property and value of the property
 * 
 * @param propertyName
 * @param subtype
 * @param value
 */
function agile_crm_save_contact_properties_subtype(propertyName, subtype, value)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');

	var property = {};
	property["name"] = propertyName;
	property["value"] = value;
	property["subtype"] = subtype;

	properties.push(property);

	contact_model.set("properties", properties);

	console.log(properties);

	contact_model.url = "core/api/contacts"

	// Save updated contact model
	contact_model.save()

}
