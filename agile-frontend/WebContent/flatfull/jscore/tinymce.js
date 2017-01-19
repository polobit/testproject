/**
 * TinyMCE is a platform independent web based Javascript HTML WYSIWYG editor.
 * TinyMCE has the ability to convert HTML TEXTAREA fields or other HTML
 * elements to editor instances.
 * 
 * @author Naresh
 */

var CONTACT_CUSTOM_FIELDS = undefined;

/**
 * Sets up tinymce HTML Editor on given selector
 * 
 * @param selector -
 *            id of HTML element e.g., textarea#email-body
 * 
 */
function setupTinyMCEEditor(selector, noAgileContactFields, plugins, callback,merge_fields_values_callback)
{
	
	var that=this;
	that._merge_fields_values_callback	=merge_fields_values_callback;
	// Id undefined
	if (selector === undefined)
	{
		console.log("selector is undefined...");
		return;
	}
	
	// Show loading image instead of textarea
	$('#loading-editor').html(getRandomLoadingImg());
	
	var toolbar_2 = "bullist numlist | outdent indent blockquote | forecolor backcolor | merge_fields | preview | code";
	
	// Remove Agile Contact fields button
	if(noAgileContactFields)
		toolbar_2 = "bullist numlist | outdent indent blockquote | forecolor backcolor | preview | code";
	
	var default_plugins = ["textcolor link image preview code fullpage"];
	
	// If no plugins, assign default
	if(!plugins)
		plugins = default_plugins;
	
	// Init tinymce first time
	if (typeof (tinymce) === "undefined")
	{
		head.js('/js/designer/tinymce/tinymce.min.js', function()
		{
			get_custom_fields(function(data){

				// If loading src script fails
				if(typeof (tinymce) === "undefined")
				{
					console.log("Reloading script...");
					
					// Show confirmation for reload
					
					if(confirm("Unable to load editor. Click OK to Reload."))
					  location.reload();

					
					return;
				}
				
				// Show textarea and remove loading img
				$(selector).css('display', '');
				$('#loading-editor').html("");
				var mceClassName = "";
				if($("html").hasClass("agile-theme-15"))
					mceClassName = "agile-theme-15";

				tinymce.init({ mode : "exact", selector : selector, plugins : plugins,
				    menubar : false,
				    body_class: mceClassName,
					toolbar1 : "bold italic underline | alignleft aligncenter alignright alignjustify | link image | formatselect | fontselect | fontsizeselect",
					toolbar2 : toolbar_2, valid_elements : "*[*]",
					toolbar_items_size: 'small',
					browser_spellcheck : true,
					relative_urls : false,
					convert_urls : false,
			        gecko_spellcheck: true,
			        forced_root_block : false,
					extended_valid_elements : "*[*]", setup : function(editor)
					{
						editor.addButton('merge_fields', { type : 'menubutton', text : '{{agile_lng_translate "contact-view" "merge-fields"}}', icon : false, menu : set_up_merge_fields(editor,that._merge_fields_values_callback) });
					},
					language : get_tinymce_supported_language(),
					});
				
				// callback after tinymce initialised
		    	setTimeout(function(){
		    		if(callback != undefined && typeof (callback) === "function")
		    		callback();
		    		},500);

			});

			
		});
    	
		return;
	}

	// if tinymce instance exists, reinitialize tinymce on given selector
	if (selector.indexOf('#') !== -1)
		selector = selector.split('#')[1];

	// Add custom toolbar
	tinymce.settings.toolbar2 = toolbar_2;
	
	// Add required plugins
	tinymce.settings.plugins = plugins;
	
	// reinitialize tinymce
	reinitialize_tinymce_editor_instance(selector, callback);
		
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
		if(typeof (tinymce) !== "undefined")
		{
			tinymce.get(selector).setContent(content);
		}
	}
	catch (err)
	{
		console.log("error occured while setting content...");
		console.log(err);
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
		if(typeof (tinymce) !== "undefined")
			tinymce.get(selector).save();
	}
	catch (err)
	{
		console.log("error occured while saving content to textarea...");
		console.log(err)
	}
}

/**
 * 
 * Triggers all tinymce editors save. It is used in base-modal to save
 * content back to textarea before form serialization.
 * 
 **/
function trigger_tinymce_save()
{
	try
	{
		if(typeof (tinymce) !== "undefined")
			tinymce.triggerSave();
	}
	catch(err)
	{
		console.log("error occured while triggering tiny save...");
		console.log(err);
	}
}
/**
 * Re-initialize HTML Editor on given selector using existing tinymce.
 * 
 * @param selector -
 *            id of an element without '#'
 */
function reinitialize_tinymce_editor_instance(selector, callback)
{
	try
	{
		// Calling duplicate instances won't setup tinymce. So remove previous
		// instance
		remove_tinymce_editor_instance(selector);

		// Surrounded within timeout to work in Firefox
	    setTimeout(function(){

	    	// Show textarea and remove loading img
	    	$('#loading-editor').html("");
	    	$('#'+ selector).css('display', '');
			
	    	tinymce.EditorManager.execCommand('mceAddEditor', true, selector);
	    	
	    	// callback after tinymce re-initialised
	    	if(callback != undefined && typeof (callback) === "function")
	    		callback();
	    		
	    	// Show hidden tinymce
	    	$('.mce-tinymce').css('display', '');

	    }, 100);
	
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
		// Removes all tinymce editors 
		for(var i=0; i < tinymce.editors.length; i++)
		{
			tinyMCE.remove(tinyMCE.editors[i]);
		}
		
		//tinymce.EditorManager.execCommand("mceRemoveEditor", false, selector);
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
function set_up_merge_fields(editor,merge_fields_values_callback)
{
	var menu = [];

	var contact_json;
	var _merge_fields_values_callback=merge_fields_values_callback;
	// Get Current Contact json for merge fields
	if (App_Contacts.contactDetailView != undefined && App_Contacts.contactDetailView.model != undefined)
		contact_json = get_contact_json_for_merge_fields();

	// Iterates over merge fields and builds merge fields menu
	//$.each(get_merge_fields(), function(key, value)
	$.each(get_merge_field_objs(), function(key, value)
	{	
		var main_menu_item = {};
		main_menu_item["text"] = key;

		var sub_menu = [];

		$.each(value, function(key, value)
		{
			var menu_item = {};

			menu_item["text"] = key;
			menu_item["onclick"] = function()
			{

				// Insert value without compiling
				if (Current_Route === "bulk-email" || Current_Route === "send-email" || Current_Route.indexOf('email-template') != -1 || Current_Route.indexOf('emailbuilder') != -1 || Current_Route.indexOf('document-template') != -1 || Current_Route.indexOf('webrule') != -1)
				{
					editor.insertContent(value);
				}
				else
				{
					var template = Handlebars.compile(value);
					var compiled_template;

					try
					{
						if(_merge_fields_values_callback)
							contact_json=_merge_fields_values_callback(contact_json);

						compiled_template = template(contact_json);
					}
					catch(err)
					{
						console.log("error.....");
						
						// Handlebars need [] if json keys have spaces
						value = '{{['+key+']}}';
						
						template = Handlebars.compile(value);
						compiled_template = template(contact_json);
					}
					
					editor.insertContent(compiled_template + '');
				}
			};

			sub_menu.push(menu_item);
		});

		main_menu_item['menu'] = sub_menu;

		menu.push(main_menu_item);
	});
	
	console.log(menu);
	return menu;
}

/**
 * Returns merge fields that includes custom fields
 * 
 */
function get_merge_fields(callback)
{
	var options = {
			"{{agile_lng_translate 'contacts-view' 'First Name'}}": "{{first_name}}",
			"{{agile_lng_translate 'contacts-view' 'Last name'}}": "{{last_name}}",
			"{{agile_lng_translate 'report-add' 'score'}}": "{{score}}",
			"{{agile_lng_translate 'modals' 'email'}}": "{{email}}",
			"{{agile_lng_translate 'contacts-view' 'Company'}}": "{{company}}",
			"{{agile_lng_translate 'other' 'title'}}": "{{title}}",
			"{{agile_lng_translate 'other' 'address'}}": "{{location.address}}",
			"{{agile_lng_translate 'contact-edit' 'city'}}": "{{location.city}}",
			"{{agile_lng_translate 'contact-edit' 'state'}}":"{{location.state}}",
			"{{agile_lng_translate 'contacts-view' 'country'}}":"{{location.country}}",
			"{{agile_lng_translate 'contact-view' 'owner-name'}}":"{{owner.name}}",
			"{{agile_lng_translate 'contact-view' 'owner-email'}}":"{{owner.email}}",
			"{{agile_lng_translate 'domain-user' 'phone'}}":"{{owner.phone}}", 
			"{{agile_lng_translate 'contact-view' 'calendar-url'}}":"{{owner.calendar_url}}"
			}
	
	if((Current_Route.indexOf('document-template') != -1 || Current_Route.indexOf('document') != -1))
	{
		var document_options={"{{agile_lng_translate 'documents' 'pricing-table'}}":"{{{pricing_table}}}"}
		options = merge_jsons({}, options,document_options);
	}

	if(!callback){
		// Get Custom Fields in template format
		var custom_fields = get_custom_merge_fields();

		// Merges options json and custom fields json
		var merged_json = merge_jsons({}, options, custom_fields);

		return merged_json;
	}else{
		
		// Get Custom Fields in template format
		get_custom_merge_fields(function(custom_fields){
			// Merges options json and custom fields json
			var merged_json = merge_jsons({}, options, custom_fields);

			return callback(merged_json);
		});


	}



}

/**
 * Returns json object containing merge field object like contact, custom & ticket if exists.
 * 
 */
function get_merge_field_objs()
{
	
	var contact_merge_fields = {
		"{{agile_lng_translate 'contacts-view' 'First Name'}}": "{{first_name}}",
		"{{agile_lng_translate 'contacts-view' 'Last name'}}": "{{last_name}}",
		"{{agile_lng_translate 'report-add' 'score'}}": "{{score}}",
		"{{agile_lng_translate 'modals' 'email'}}": "{{email}}",
		"{{agile_lng_translate 'contacts-view' 'Company'}}": "{{company}}",
		"{{agile_lng_translate 'other' 'title'}}": "{{title}}",
		"{{agile_lng_translate 'other' 'address'}}": "{{location.address}}",
		"{{agile_lng_translate 'contact-edit' 'city'}}": "{{location.city}}",
		"{{agile_lng_translate 'contact-edit' 'state'}}":"{{location.state}}",
		"{{agile_lng_translate 'contacts-view' 'country'}}":"{{location.country}}",
		"{{agile_lng_translate 'contact-view' 'owner-name'}}":"{{owner.name}}",
		"{{agile_lng_translate 'contact-view' 'owner-email'}}":"{{owner.email}}", 
		"{{agile_lng_translate 'domain-user' 'phone'}}":"{{owner.phone}}", 
		"{{agile_lng_translate 'contact-view' 'calendar-url'}}":"{{owner.calendar_url}}",
		"{{agile_lng_translate 'contacts-view' 'unsubscribe'}} {{agile_lng_translate 'landingpage-builder' 'link'}}":"{{{unsubscribe_link}}}"
	}
	
	// Get Custom Fields in template format
	var custom_fields = get_custom_merge_fields();

	var json = {"{{agile_lng_translate 'contact-details' 'Contact'}}": contact_merge_fields};

	if(custom_fields && !$.isEmptyObject(custom_fields))
		json['{{agile_lng_translate "campaigns" "custom"}}'] = custom_fields;

	if((Current_Route.indexOf('document-template') != -1 || Current_Route.indexOf('document') != -1))
	{
		json['{{agile_lng_translate "documents" "deal-products"}}']={"{{agile_lng_translate 'documents' 'pricing-table'}}":"{{{pricing_table}}}"}
	}
	//Return json if path isn't email-template
	if(Current_Route.indexOf('emailbuilder-add') == -1 && 
		Current_Route.indexOf('email-template-add') == -1 &&
		Current_Route.indexOf('emailbuilder/') == -1 && 
		Current_Route.indexOf('email-template/') == -1)
		return json;

	var ticket_merge_fields = {
		"{{agile_lng_translate 'tickets' 'ticket-id'}}": "{{ticket_id}}",
		"{{agile_lng_translate 'widgets' 'subject'}}": "{{subject}}",
		"{{agile_lng_translate 'tickets' 'requester-name'}}": "{{requester_name}}",
		"{{agile_lng_translate 'tickets' 'requester-email'}}": "{{requester_email}}",
		"{{agile_lng_translate 'widgets' 'priority'}}": "{{priority}}",
		"{{agile_lng_translate 'widgets' 'status'}}": "{{status}}",
		"{{agile_lng_translate 'tickets' 'comments'}}": "{{{ticket_comments}}}",
		"{{agile_lng_translate 'tickets' 'footer'}}": "{{{ticket_footer}}}",
		"{{agile_lng_translate 'tickets' 'group'}}": "{{group_name}}",
		"{{agile_lng_translate 'tickets' 'assignee'}}": "{{agent_name}}"
	};

	json['{{agile_lng_translate "contact-details" "ticket"}}'] = ticket_merge_fields

	return json;
}

/**
 * Returns custom fields data in JSON
 */
function get_custom_fields(callback)
{
	// If already fetched, return
	if(CONTACT_CUSTOM_FIELDS != undefined){
		if(callback)
			  return callback(CONTACT_CUSTOM_FIELDS)

		return CONTACT_CUSTOM_FIELDS;
	}
		
	
	// Sends GET request for customfields.
	accessUrlUsingAjax('/core/api/custom-fields/scope?scope=CONTACT', function(data){

		// Parse stringify json
		CONTACT_CUSTOM_FIELDS = data;
		
		if(callback)
			  return callback(CONTACT_CUSTOM_FIELDS)

		return CONTACT_CUSTOM_FIELDS;

	});

}

/**
 * Returns custom fields in format required for merge fields. E.g., Nick
 * Name:{{[Nick Name]}}. Handlebars need to have square brackets for json keys
 * having spaceaaa
 */
function get_custom_merge_fields(callback)
{
	
	var customfields = {};

	if(!callback){
		// Iterate over data and get field labels of each custom field
		var custom_fields = get_custom_fields();
		
		$.each(custom_fields, function(index, obj)
					{
						customfields[obj['field_label']] = "{{" + obj['field_label'] + "}}"
					});

		return customfields;
	}else{
		
		// Iterate over data and get field labels of each custom field
		get_custom_fields(function(custom_fields){
			$.each(custom_fields, function(index, obj)
					{
						customfields[obj['field_label']] = "{{" + obj['field_label'] + "}}"
					});

					return callback(customfields);
		});
	}


}
/**
 * Returns merged json of two json objects
 */
function merge_jsons(target, object1, object2)
{
	return $.extend(target, object1, object2);
}


/**
 * Returns json required for merge fields in Editor
 */
function get_contact_json_for_merge_fields(contact_json)
{
	if (contact_json==undefined && App_Contacts.contactDetailView != undefined && App_Contacts.contactDetailView.model != undefined)
	{

		// Get Current Contact
		contact_json = App_Contacts.contactDetailView.model.toJSON();
		
	}	
	// Compile templates immediately in Send email but not for bulk contacts
	if(contact_json!=undefined)
	{

		// Get Current Contact
		var contact_property_json = get_property_JSON(contact_json);		
		try
		{
			contact_property_json["score"]= contact_json["lead_score"];
			
			// Replace epoch times with formatted date values in property json
			var arr = get_custom_field_labels_by_type(get_custom_fields(), 'DATE');
			
			// Format each epochtime to Date
			for(var i in arr)
				contact_property_json[arr[i]]= get_formatted_date(contact_property_json[arr[i]]);
			
			contact_property_json["id"] = contact_json["id"];
			
			if(contact_property_json["address"])
				contact_property_json["location"] = JSON.parse(contact_property_json["address"]);
		}
		catch(err)
		{
			console.log("Error occured while parsing json");
			console.log(err);
		}
		
		return merge_jsons({}, {"owner":contact_json.owner}, contact_property_json);
		
	}  
}

/**
 * Replaces {{}} with {{[]}} to allow spaces in keys
 * 
 * @param text - text to replace
 * 
 **/
function add_square_brackets_to_merge_fields(text)
{
	// Matches all strings within {{}}. e.g., {{first_name}}, {{New Note}}
	var t = text.match(/{{[a-zA-Z0-9 _]*[a-zA-Z0-9 _]}}/g);
	
	if(t)
	{
		// Change {{New Note}}  to {{[New Note]}}. 
		// Handlebars allow keys having spaces, 
		// within square brackets
		for(var i=0; i < t.length;i++)
		{
			text = text.replace(t[i], '{{['+t[i].match(/{{(.*?)}}/)[1]+']}}');
		}
	};
	
	return text;
}

/**
 * Returns array of custom field labels that matches
 * with given field_type
 * 
 * @param custom_data - Custom fields
 * 
 * @param field_type - field type
 **/
function get_custom_field_labels_by_type(custom_data, field_type)
{
	var field_labels = [];
	
	// Iterate over data and get field labels of each custom field
	$.each(custom_data, function(index, obj)
	{
		
		if(obj['field_type'] == field_type)
			field_labels.push(obj['field_label']);
		
	});
	
	return field_labels;
}

/**
 * Returns formatted date from epoch time
 * 
 * @param epoch_time - Epoch time in milliseconds
 *                     
 **/
function get_formatted_date(epoch_time, format)
{
	if (!epoch_time)
	    return;

	var d = undefined;
	
	if ((epoch_time / 100000000000) > 1)
	   d = new Date(parseInt(epoch_time));
	else
	   d = new Date(parseInt(epoch_time) * 1000);
	
	var month_names = new Array("Jan", "Feb", "Mar", 
			"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
			"Oct", "Nov", "Dec");

	var date = d.getDate();
	var month = d.getMonth();
	var year = d.getFullYear();
	
	return date + " " + month_names[month] 
			+ " " + year;
}

function register_focus_on_tinymce(selector)
{
	var document = $("iframe#"+selector+"_ifr").contents()[0];
	
	if(!document)
		return;
	
	$(document).on('click', function(e){
		
		e.preventDefault();
		
		$(this).find('body').focus();
		
	});
}

function get_tinymce_supported_language(){
	var supported_language = "en_US";
	if(_LANGUAGE == "es")
		supported_language = "es";

	return supported_language;
}
