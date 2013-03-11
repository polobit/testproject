/**
 * THIRD PARTY SCRIPTS - PLUGINS - INTEGRATION POINTS.
 * 
 * agile_widgts.js defines Provides Third party javascript API.
 * Functionalities provided by script API are
 * <pre>
 * -- Gets property name from current contact 		 : agile_crm_get_contact_property(propertyName),
 * -- Updating a contact by specifying property name : agile_crm_update_contact(propertyName, Value),
 * -- Returns current contact object				 : agile_crm_get_contact()
 * -- Add Note to current contact					 : agile_crm_add_note(sb, description)
 * -- Return widget object 							 : agile_crm_get_plugin(pluginName)
 * -- Return widget prefs							 : agile_crm_get_plugin_prefs(pluginName)
 * -- Save widget prefs								 : agile_crm_save_widget_prefs(pluginName, prefs)
 * -- Save widget property in contact				 : agile_crm_save_widget_property_to_contact(propertyName, value)
 * -- Return widget property value					 : agile_crm_get_widget_property_from_contact(propertyName)
 * -- Delete widget property from contact, based on 
 * 		widget propertyName			 				 : agile_crm_delete_widget_property_from_contact(propertyName)
 * 
 * </pre>
 */
/**
 * Searches the property field in current contact with given property name, if
 * property with given name exists, then returns property value
 * 
 * @param propertyName
 *            name of the property
 */
function agile_crm_get_contact_property(propertyName)
{

    // Reads current contact model form the contactDetailView
    var contact_model = App_Contacts.contactDetailView.model;

    // Gets properties list field from contact
    var properties = contact_model.get('properties');
    var property;

    // Iterates though each property and finds the value related to the property
    // name
    $.each(properties, function (key, value)
    {
        if (value.name == propertyName)
        {
            property = value;
        }
    });

    // If property is defined then return property value
    if (property) return property.value;

}

/**
 * Gets the contact properties list based on property name
 * 
 * @param propertyName
 * 		property name of which contact properties are required
 * @returns {Array}
 */
function agile_crm_get_contact_properties_list(propertyName)
{

    // Reads current contact model form the contactDetailView
    var contact_model = App_Contacts.contactDetailView.model;

    // Gets properties list field from contact
    var properties = contact_model.get('properties');
    var property = [];

    // Iterates though each property and finds the value related to the property
    // name
    $.each(properties, function (key, value)
    {
        if (value.name == propertyName)
        {
            property.push(value);
        }
    });

    // If property is defined then return property value list
    return property;

}


/**
 * Updates a contact based on the property name and its value specified. If
 * property name already exists with the given then replaces the value, if
 * property is new then creates a new field and returns it
 * 
 * @param propertyName:
 *            Name of the property to be created/updated
 * @param value :
 *            value for the property
 */
function agile_crm_update_contact(propertyName, value)
{

    // Gets current contact model from the contactDetailView object
    var contact_model = App_Contacts.contactDetailView.model;

    // Reads properties fied from the contact
    var properties = contact_model.toJSON()['properties'];

    if (agile_crm_get_contact_property(propertyName))
    {
        $.each(properties, function (key, property)
        {
            // Checks if property name given already exists in list
            // If property name already exists then updates the value
            if (property.name == propertyName)
            {
                property.value = value;
            }
        });
    }
    // If property is new then new field is created
    else properties.push(
    {
        "name": propertyName,
        "value": value,
        "type": "CUSTOM"
    });

    contact_model.set("properties", properties);

    // Save model
    contact_model.save();
}

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
function agile_crm_add_note(sub, description)
{
    // Add Note to Notes Collection

    // Get Current Contact Model
    var contact_model = App_Contacts.contactDetailView.model;

    // Get ID
    var note = new Backbone.Model();

    note.url = 'core/api/notes';

    var related_contact = [];

    related_contact.push(contact_model.id)
    note.set("subject", sub);
    note.set("description", description);

    note.set("contacts", [contact_model.id.toString()])

    note.save();
}

/**
 * Returns plugin object based on the plugin name specified
 * 
 * @param pluginName :
 *            name of the plugin to fetch
 */
function agile_crm_get_plugin(pluginName)
{

    // Gets plugin data from the model data which is set to plugin block while
    // loading plugins
    var model_data = $('#' + pluginName).data('model');

    return model_data.toJSON();
}

/**
 * Gets plugin prefs based on the name of the plugin
 * 
 * @param pluginName :
 *            name of the plugin to get prefs
 * @returns plugin prefs
 */
function agile_crm_get_plugin_prefs(pluginName)
{

    // Gets data attribute of from the plugin, and return prefs from that object
    return $('#' + pluginName).data('model').toJSON().prefs;
}

/**
 * Saves widget prefs, saves prefs with respect to plugin name Name of the
 * plugin and prefs needs to be specified.
 * 
 * @param pluginName :
 *            name of the plugin name specified, to associate prefs
 * @param prefs :
 *            prefs to be saved
 */
function agile_crm_save_widget_prefs(pluginName, prefs)
{

    // Get the model from the the element
    var widget = $('#' + pluginName).data('model');

    // Set changed prefs to widget backbone model
    widget.set("prefs", prefs);

    widget.url = "core/api/widgets"
    // Set the changed model data to respective plugin div as data
    $('#' + pluginName).data('model', widget);

    // Save the updated model attributes
    widget.save(widget);

}

/**
 * Associates the properties with widget_properties in contact, which is saved
 * as JSON string object in field name widget_properties.
 * 
 * @param propertyName
 * @param value
 */
function agile_crm_save_widget_property_to_contact(propertyName, value)
{

    // Gets Current Contact Model
    var contact_model = App_Contacts.contactDetailView.model;

    // Get WidgetProperties from Contact Model
    var widget_properties = contact_model.get('widget_properties');

    // If widget_properties are null i.e, contact do not contain any widget
    // properties yet, then create new JSON object to save widget properties
    if (!widget_properties) widget_properties = {};

    // If widget properties already exists then convert Stringified JSON in to
    // JSON object to add new properties
    else widget_properties = JSON.parse(widget_properties);

    // Adds the new property name and value value pair, in widget_properties
    // JSON
    widget_properties[propertyName] = value;

    // Stringifies widget_properties json in to string and set to contact model.
    contact_model.set("widget_properties", JSON.stringify(widget_properties));

    contact_model.url = "core/api/contacts"

    // Saves updated model
    contact_model.save()

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
    if (!widget_properties) return;

    // Converts JSON string to JSON Object
    widget_properties = JSON.parse(widget_properties);

    // Returns value of property from widget_properties JSON
    return widget_properties[propertyName];
}

/**
 * Deletes widget property the property key value pair from widget_properties
 * JSON string in contact
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
    if (!widget_properties) return;

    // If widget_properties are not null, then convert widget_properties string
    // in to JSON object
    widget_properties = JSON.parse(widget_properties);

    // Deletes value from JSON
    delete widget_properties[propertyName];

    // sets Updated widget_properties in to contact model
    contact_model.set("widget_properties", JSON.stringify(widget_properties));

    contact_model.url = "core/api/contacts"

    // Save updated contact model
    contact_model.save()
}

/**
 *  Retrieves the contact property value based on property name and sub type of the property
 * 
 * @param propertyName
 * @param subtype
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
    $.each(properties, function (key, value)
    {
        if (value.name == propertyName && value.subtype == subtype)
        {
            property = value;
        }
    });

    // If property is defined then return property value
    if (property) return property.value;

}

/**
 * Deletes the contact property value based on property name and sub type of the property 
 * and value of the property
 * 
 * @param propertyName
 * @param subtype
 * @param value
 */
function agile_crm_delete_contact_property_by_subtype(propertyName, subtype, value)
{

    // Reads current contact model form the contactDetailView
    var contact_model = App_Contacts.contactDetailView.model;

    // Gets properties list field from contact
    var properties = contact_model.get('properties');


    // Iterates though each property and finds the value related to the property
    // name
    $.each(properties, function (index, property)
    {
        if (property.name == propertyName && property.subtype == subtype && property.value == value)
        {
            console.log(index);
            properties.splice(index, 1);
        }
    });


    contact_model.set("properties", properties);

    contact_model.url = "core/api/contacts"

    // Save updated contact model
    contact_model.save()
}