/**
 * THIRD PARTY SCRIPTS - PLUGINS - INTEGRATION POINTS.
 * 
 * agile_widgets.js defines third party JavaScript API.
 * Functionalities provided by script API are
 * <pre>
 * -- Return widget object by widget name			 : agile_crm_get_widget(pluginName)
 * -- Return widget preferences by widget name	     : agile_crm_get_widget_prefs(pluginName)
 * -- Save widget preferences  by widget name		 : agile_crm_save_widget_prefs(pluginName, preferences)
 * -- Delete widget preferences by widget name       : agile_crm_delete_widget_prefs(pluginName, callback)
 * -- Saves widget property to contact               : agile_crm_save_widget_property_to_contact(propertyName, value)
 * -- Retrieves widget property from current contact : agile_crm_get_widget_property_from_contact(propertyName)
 * -- Delete widget property from current contact	 : agile_crm_delete_widget_property_from_contact(propertyName)
 * -- Retrieves current contact object				 : agile_crm_get_contact()
 * -- Retrieves property of current contact 	     : agile_crm_get_contact_property(propertyName)
 * -- Retrieves properties list of current contact   : agile_crm_get_contact_properties_list(propertyName)
 * -- Retrieves contact property value by subtype    : agile_crm_get_contact_property_by_subtype(propertyName, subtype)
 * -- Save property to contact for given subtype     : agile_crm_save_contact_property(propertyName, subtype, value, type)
 * -- Updating a contact by specifying property name : agile_crm_update_contact(propertyName, Value)
 * -- Updates contact properties with given values   : agile_crm_update_contact_properties(propertiesArray, callback)
 * -- Delete value given from contact by subtype     : agile_crm_delete_contact_property_by_subtype(propertyName, subtype, value)
 * -- Add Note to current contact					 : agile_crm_add_note(subject, description)
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
	var contact_model = null;
	
	if(company_util.isCompany()){
		contact_model = App_Companies.companyDetailView.model;
	} else {
		contact_model = App_Contacts.contactDetailView.model;
	}

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

 	
	var model = new Backbone.Model();
	model.url = "core/api/contacts";

	// Save model
	model.save(contact_model.toJSON(), { success : function(model, response)
	{
	// Reset model view
	contact_model.set(model.toJSON(), { silent: true });

	if (callback && typeof (callback) == "function")
	callback();
	} }, { silent : true });
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
		console.log('contact saving ');
		if (callback && typeof (callback) == "function")
			callback();
	} }, { silent : true });
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
function agile_crm_get_widget(pluginName)
{
	pluginName = pluginName.replace(/ +/g, '');
	console.log('plugin name ' + pluginName);

	/*
	 * Retrieves plugin data from the model data which is set to plugin block
	 * while loading plugins
	 */
	console.log($('#' + pluginName));
	var model_data = $('#' + pluginName, App_Contacts.contactDetailView.el).data('model');

	console.log(model_data);

	return model_data.toJSON();
}

/**
 * Retrieves plugin preferences based on the name of the plugin
 * 
 * @param pluginName :
 *            name of the plugin to get preferences
 * @returns plugin preferences
 */
function agile_crm_get_widget_prefs(pluginName)
{
	pluginName = pluginName.replace(/ +/g, '');
	console.log("in get widget prefs " + pluginName);
	// Gets data attribute of from the plugin, and return prefs from that object
	return $('#' + pluginName, App_Contacts.contactDetailView.el).data('model').toJSON().prefs;
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
	console.log(pluginName);
	pluginName = pluginName.replace(/ +/g, '');

	console.log(App_Contacts.contactDetailView.el);
	console.log($('#' + pluginName, App_Contacts.contactDetailView.el));

	// Get the model from the the element
	var widget = $('#' + pluginName, App_Contacts.contactDetailView.el).data('model');

	console.log(widget);
	// Set changed preferences to widget backbone model
	widget.set({ "prefs" : prefs }, { silent : true });

	// URL to connect with widgets
	widget.url = "core/api/widgets"

	console.log(widget);

	var model = new BaseModel();
	model.url = "core/api/widgets";
	model.save(widget.toJSON(), { success : function(data)
	{
		console.log(data);
		console.log("Saved widget: " + data.toJSON());
		
		// Set the changed model data to respective plugin div as data
		$('#' + pluginName, App_Contacts.contactDetailView.el).data('model', widget);
		
		if (callback && typeof (callback) === "function")
		{
			console.log("in save callback");
			console.log(data.toJSON());
			// Execute the callback, passing parameters as necessary
			callback(data.toJSON());
		}
	} }, { silent : true });

}

/**
 * Deletes widget preferences saved in widget under the field prefs in widget
 * object
 * 
 * @param pluginName
 *            name of the plugin specified
 */
function agile_crm_delete_widget_prefs(pluginName, callback)
{
	// saves prefs as undefined
	agile_crm_save_widget_prefs(pluginName, undefined, callback);
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
function agile_crm_delete_contact_property_by_subtype(propertyName, subtype, value, callback)
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
			contact_model.set({ "properties" : properties }, { silent : true });

			contact_model.url = "core/api/contacts";

			// Save updated contact model
			contact_model.save([], { silent : true, success : function(data)
			{
				console.log("in success");
				if (callback && typeof callback === "function")
					callback(data);

			} });

			return false;
		}
	});

}

/**
 * Saves contact property value to contact with the given property name and sub
 * type of the property and value of the property.
 * 
 * <p>
 * type should be given as "SYSTEM" if it already exists and "CUSTOM" if it is a
 * new field
 * </p>
 * 
 * 
 * @param propertyName
 * @param subtype
 * @param value
 * @param type
 */
function agile_crm_save_contact_property(propertyName, subtype, value, type)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');

	var property = {};
	property["name"] = propertyName;
	property["value"] = value;
	property["subtype"] = subtype;
	property["type"] = type;

	properties.push(property);

	contact_model.set("properties", properties);

	console.log(properties);

	contact_model.url = "core/api/contacts"

	// Save updated contact model
	contact_model.save()

}

/**
 * Saves the given property to widget_properties field in contact as key value
 * pair, which is saved as JSON string object in field name widget_properties.
 * 
 * @param propertyName
 * @param value
 */
function agile_crm_save_widget_property_to_contact(propertyName, value, callback)
{

	// Gets Current Contact Model
	var contact_model = App_Contacts.contactDetailView.model;

	// Get WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');

	/*
	 * If widget_properties are null i.e, contact do not contain any widget
	 * properties yet, then create new JSON object to save widget properties
	 */
	if (!widget_properties)
		widget_properties = {};

	/*
	 * If widget properties already exists then convert Stringified JSON in to
	 * JSON object to add new properties
	 */
	else
		widget_properties = JSON.parse(widget_properties);

	/*
	 * Adds the new property name and key value pair, in widget_properties JSON
	 */
	widget_properties[propertyName] = value;

	// Stringifies widget_properties json in to string and set to contact model.
	contact_model.set({"widget_properties": JSON.stringify(widget_properties)}, {silent :true});

	contact_model.url = "core/api/contacts";

	// Saves updated model
	//contact_model.save(contact_model.toJSON);
	
	// Save updated contact model
	contact_model.save(contact_model.toJSON, { silent : true, success : function(data)
	{
		console.log("in success");
		if (callback && typeof callback === "function")
			callback(data);

	} });


}

function agile_crm_add_event_to_timeline(name, title, body, time)
{
	var model = {};
	model['id'] = name;
	model['body'] = body;
	model["title"] = title;
	
	if (time && (time / 100000000000) > 1)
		model["created_time"] = time;
	else
		model["created_time"] = time;
	
	model["entity_type"] = "custom";
	
	add_entity_to_timeline(new BaseModel(model));
}

function agile_crm_get_current_view()
{
	if(App_Contacts.contactDetailView)
		return App_Contacts.contactDetailView.el;
	
	return undefined;
}
