/**
 * TinyMCE is a platform independent web based Javascript HTML WYSIWYG editor.
 * TinyMCE has the ability to convert HTML TEXTAREA fields or other HTML
 * elements to editor instances.
 * 
 * @author Naresh
 */

/**
 * Sets up tinymce HTML Editor on given selector
 * 
 * @param selector -
 *            id of HTML element e.g., textarea#email-body
 * 
 */
function setupTinyMCEEditor(selector)
{
	// Id undefined
	if (selector === undefined)
	{
		console.log("selector is undefined...");
		return;
	}

	// Init tinymce first time
	if (typeof (tinymce) === "undefined")
	{
		head.js('/js/designer/tinymce/tinymce.min.js', function()
		{
			tinymce.init({ mode : "textareas", selector : selector, plugins : [
				"textcolor link image"
			], menubar : false,
				toolbar1 : "bold italic underline | alignleft aligncenter alignright alignjustify | link image | formatselect fontselect fontsizeselect",
				toolbar2 : "bullist numlist | outdent indent blockquote | forecolor backcolor | merge_fields", valid_elements : "*[*]",
				extended_valid_elements : "*[*]", setup : function(editor)
				{
					editor.addButton('merge_fields', { type : 'menubutton', text : 'Agile Contact Fields', icon : false, menu : set_up_merge_fields(editor) });
				} });
		});
		return;
	}

	// if tinymce instance exists, reinitialize tinymce on given selector
	setTimeout(function()
	{
		if (selector.indexOf('#') !== -1)
			selector = selector.split('#')[1];

		// reset previous content
		set_tinymce_content(selector, '');

		// reinitialize tinymce
		reinitialize_tinymce_editor_instance(selector);
	}, 10);
}

/**
 * Sets given content in tinymce.
 * 
 * @param selector -
 *            id of an element without '#' e.g., email-body
 * @param content -
 *            content to be inserted
 * 
 */
function set_tinymce_content(selector, content)
{
	try
	{
		tinymce.get(selector).setContent(content);
	}
	catch (err)
	{
		console.log("error occured while setting content...");
		console.log(err)
	}
}

/**
 * Saves tinymce content back to textarea.
 * 
 * @param selector -
 *            id of an element without '#'
 */
function save_content_to_textarea(selector)
{
	try
	{
		tinymce.get(selector).save();
	}
	catch (err)
	{
		console.log("error occured while saving content to textarea...");
		console.log(err)
	}
}

/**
 * Re-initialize HTML Editor on given selector using existing tinymce.
 * 
 * @param selector -
 *            id of an element without '#'
 */
function reinitialize_tinymce_editor_instance(selector)
{
	try
	{
		// Calling duplicate instances won't setup tinymce. So remove previous
		// instance
		remove_tinymce_editor_instance(selector);

		// Adds tinymce
		tinymce.EditorManager.execCommand('mceAddEditor', true, selector);
	}
	catch (err)
	{
		console.log("error occured while reinitializing tinymce...");
		console.log(err)
	}
}

/**
 * Removes tinymce instance on given selector
 * 
 * @param selector -
 *            id of an element without '#'
 */
function remove_tinymce_editor_instance(selector)
{
	try
	{
		tinymce.EditorManager.execCommand("mceRemoveEditor", true, selector);
	}
	catch (err)
	{
		console.log("error occured while removing tinymce editor instance...");
		console.log(err);
	}

}

/**
 * Set up merge fields as menu button in Editor
 * 
 * @param editor -
 *            editor instance
 */
function set_up_merge_fields(editor)
{
	var menu = [];

	var contact_property_json;

	// Compile templates immediately in Send email but not for bulk contacts
	if (Current_Route !== "bulk-email")
	{
		// Get Current Contact
		var contact_json = App_Contacts.contactDetailView.model.toJSON();
		contact_property_json = get_property_JSON(contact_json)
	}

	// Iterates over merge fields and builds merge fields menu
	$.each(get_merge_fields(), function(key, value)
	{

		var menu_item = {};

		menu_item["text"] = key;
		menu_item["onclick"] = function()
		{

			if (Current_Route === "bulk-email")
			{
				// Remove square brackets from templates to compile in mustache
				// java
				value = value.replace(/\[/g, '');
				value = value.replace(/\]/g, '');

				editor.insertContent(value);
			}
			else
			{
				var template = Handlebars.compile(value);
				editor.insertContent(template(contact_property_json));
			}
		};

		menu.push(menu_item);

	});

	return menu;
}

/**
 * Returns merge fields that includes custom fields
 * 
 */
function get_merge_fields()
{
	var options = { "First Name" : "{{first_name}}", "Last Name" : "{{last_name}}", "Email" : "{{email}}", "Company" : "{{company}}" };

	// Get Custom Fields in template format
	var custom_fields = get_custom_merge_fields();

	// Merges options json and custom fields json
	var merged_json = merge_jsons({}, options, custom_fields);

	return merged_json;
}

/**
 * Returns custom fields data in JSON
 */
function get_custom_fields()
{
	// Sends GET request for customfields.
	var msg = $.ajax({ type : "GET", url : '/core/api/custom-fields', async : false, dataType : 'json' }).responseText;

	// Parse stringify json
	return JSON.parse(msg);
}

/**
 * Returns custom fields in format required for merge fields. E.g., Nick
 * Name:{{[Nick Name]}}. Handlebars need to have square brackets for json keys
 * having space
 */
function get_custom_merge_fields()
{
	var data = get_custom_fields();

	var customfields = {};

	// Iterate over data and get field labels of each custom field
	$.each(data, function(index, obj)
	{
		// Iterate over single custom field to get field-label
		$.each(obj, function(key, value)
		{

			// Needed only field labels for merge fields
			if (key == 'field_label')
				customfields[value] = "{{[" + value + "]}}"
		});
	});

	return customfields;
}
/**
 * Returns merged json of two json objects
 */
function merge_jsons(target, object1, object2)
{
	return $.extend(target, object1, object2);
}
