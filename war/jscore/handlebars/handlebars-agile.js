// We store one template compiled - if repetitive templates are called, we save time on compilations
var Handlebars_Compiled_Templates = {};

/**
 * Loads the template (script element with its id attribute as templateName
 * appended with "-template". For example if the templateName is "tasks", then
 * the script element id should be as "tasks-template") from html document body.
 * 
 * Compiles the loaded template using handlebars and replaces the context
 * related property names (which are under mustache like {{name}}) in the
 * template, with their associated values, on calling the context with the
 * compiled template.
 * 
 * @method getTemplate
 * @param {String}
 *            templateName name of the tempate to be loaded
 * @param {Object}
 *            context json object to call with the compiled template
 * @param {String}
 *            download verifies whether the template is found or not
 *            
 * @param {callback} 
 * 			 To decide whether templates should be downloaded synchronously or asynchronously.
 * 
 * @returns compiled html with the context
 */
function getTemplate(templateName, context, download)
{
	var is_async = callback && typeof(callback) == "function";
	
	// Check if it is (compiled template) present in templates
	if (Handlebars_Compiled_Templates[templateName])
		return Handlebars_Compiled_Templates[templateName](context);
	else
		Handlebars_Compiled_Templates = {};

	// Check if source is available in body
	if(HANDLEBARS_PRECOMPILATION)
	{
		var template = Handlebars.templates[templateName + "-template"];
		
		// If teplate is found
		if (template) {
			
			// If callback is sent then template is downloaded asynchronously and content is sent 
			if(is_async)
			{
				callback(template(context));
				return;
			}
			
			// console.log("Template " + templateName + " found");
			return template(context);
		}
	}
	else
		{
			var source = $('#' + templateName + "-template").html();
			console.log(source);
			if (source)
			{
				var template = Handlebars.compile(source);
				Handlebars_Compiled_Templates[templateName] = template;
				
				// If callback is sent then template is downloaded asynchronously and content is sent 
				if(is_async)
				{
					callback(template(context));
					return;
				}
				return template(context);
			}
		}

	// Check if the download is explicitly set to no
	if (download == 'no')
	{
		console.log("Not found " + templateName);
		return;
	}

	// Download
	var templateHTML = '';


	// Stores urls of templates to be downloaded.
	var template_relative_urls = [];
	
	// If starts with settings
	/**
	 * If the template is not found in document body, then download the template
	 * synchronously (stops other browser actions) by verifying the starting
	 * name of the given templateName, if it is down-loaded append it to the
	 * document body. And call the function (getTemplate) again by setting the
	 * download parameter to "no"
	 */
	if (templateName.indexOf("settings") == 0)
	{
		template_relative_urls.push("settings.js");
	}
	if (templateName.indexOf("admin-settings") == 0)
	{
		template_relative_urls.push("admin-settings.js");
	}
	if (templateName.indexOf("continue") == 0)
	{
		template_relative_urls.push("continue.js");
	}
	if (templateName.indexOf("all-domain") == 0)
	{
		template_relative_urls.push("admin.js");
	}
	if (templateName.indexOf("contact-detail") == 0 || templateName.indexOf("timeline") == 0 || templateName.indexOf("company-detail") == 0)
	{
		template_relative_urls.push("contact-detail.js");
		if(HANDLEBARS_PRECOMPILATION)
			template_relative_urls.push("contact-detail.html");
	}
	if (templateName.indexOf("contact-filter") == 0 || templateName.indexOf("filter-contacts") == 0)
	{
		template_relative_urls.push("contact-filter.js");
	}
	if (templateName.indexOf("contact-view") == 0 || templateName.indexOf("contact-custom") == 0  || templateName.indexOf("contacts-custom") == 0 || templateName.indexOf("contacts-grid") == 0)
	{
		template_relative_urls.push("contact-view.js");
	}
	if (templateName.indexOf("bulk-actions") == 0)
	{
		template_relative_urls.push("bulk-actions.js");
	}
	if (templateName.indexOf("case") == 0)
	{
		template_relative_urls.push("case.js");
	}
	if (templateName.indexOf("document") == 0)
	{
		template_relative_urls.push("document.js");
	}
	if (templateName.indexOf("gmap") == 0)
	{
		template_relative_urls.push("gmap.js");
	}
	if (templateName.indexOf("report") == 0)
	{
		template_relative_urls.push("report.js");
	}
	if (templateName.indexOf("webrule") == 0)
	{
		template_relative_urls.push("web-rules.js");
	}
	if (templateName.indexOf("workflow") == 0 || templateName.indexOf("campaign") == 0 || templateName.indexOf("trigger") == 0)
	{
		template_relative_urls.push("workflow.js");
	}
	if (templateName.indexOf("purchase") == 0 || templateName.indexOf("subscription") == 0 || templateName.indexOf("subscribe") == 0 || templateName.indexOf("invoice") == 0)
	{
		template_relative_urls.push("billing.js");
	}
	if (templateName.indexOf("helpscout") == 0 || templateName.indexOf("clickdesk") == 0 || templateName.indexOf("zendesk") == 0 || templateName.indexOf("freshbooks") == 0 || templateName.indexOf("linkedin") == 0 || templateName.indexOf("rapleaf") == 0 || templateName.indexOf("stripe") == 0 || templateName.indexOf("twilio") == 0 || templateName.indexOf("twitter") == 0 || templateName.indexOf("widget") == 0)
	{
		template_relative_urls.push("widget.js");
	}
	if (templateName.indexOf("socialsuite") == 0)
	{
		template_relative_urls.push("socialsuite.js");
	
		if(HANDLEBARS_PRECOMPILATION)
			template_relative_urls.push("socialsuite.html");
	}

	
	if(is_async)
	{
		load_templates_async(templateName, context, template_relative_urls, callback);
		return;
	}
	
	load_templates_sync(template_relative_urls);
	
	return getTemplate(templateName, context, 'no');
}

function load_templates_async(templateName, context, template_relative_urls, callback)
{
	console.log(template_relative_urls);
	console.log(context);
	var url = template_relative_urls.pop();
	if(!url)
	{
		getTemplate(templateName, context, 'no', callback);
		return;
	}
	//else
		//getTemplate(templateName, context, 'no', callback);

	downloadSynchronously(url, function(){
		{
				load_templates_async(templateName, context, template_relative_urls, callback);

		}
			
	});
}

function load_templates_sync(template_relative_urls)
{
	for(var index in template_relative_urls)
		downloadSynchronously(template_relative_urls[index]);
}


function loadContent()
{
	getTemplate(templateName, context, 'no');
}

/**
 * Downloads the template synchronously (stops other browsing actions) from the
 * given url and returns it
 * 
 * @param {String}
 *            url location to download the template
 * @returns down-loaded template content
 */
function downloadSynchronously(url)
{	
	var dataType = 'html';
	
	// If JS
	if(url.endsWith("js") && HANDLEBARS_PRECOMPILATION)
		dataType = 'script';
	
	// If Precompiled is enabled, we change the directory to precompiled
	if(HANDLEBARS_PRECOMPILATION && url.indexOf("precompiled") == -1)
		url = url.replace("tpl/min", "tpl/min/precompiled");
	
	console.log(url + " " + dataType);
	

	var is_async = false;
	if(callback && typeof (callback) === "function")
		is_async = true;
	
	jQuery.ajax({ url : url, dataType : dataType, success : function(result)
	{	
		// If HTMl, add to body
		if(dataType == 'html')
			$('body').append((result));
	}, async : false });

	return "";
}

/**
 * Iterates the given "items", to find a match with the given "name", if found
 * returns the value of its value attribute
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @returns value of the matched object
 */
function getPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the name of the property
 * 
 * @param items :
 *            porperties in contact object
 * @param name :
 *            name of the property
 * @returns
 */
function getProperty(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i];
	}
}

/**
 * Returns contact property based on its property name and subtype
 */
function getPropertyValueBySubtype(items, name, subtype)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name && items[i].subtype == subtype)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the sub type (LINKEDIN, TWITTER, URL, SKYPE
 * etc..) of the property
 * 
 * @param items :
 *            properties list
 * @param name :
 *            name of the property
 * @param type :
 *            type of the property
 * @param subtype :
 *            subtype of property
 * @returns
 */
function getPropertyValueBytype(items, name, type, subtype)
{
	if (items == undefined)
		return;

	// Iterates though each property object and compares each property by name
	// and its type
	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
		{
			if (type && type == items[i].type)
			{
				if (subtype && subtype == items[i].subtype)
					return items[i].value;
			}

			if (subtype && subtype == items[i].subtype)
			{
				return items[i].value;
			}
		}
	}
}

/**
 * Returns list of custom properties. used to fill custom data in fields in
 * continue contact
 * 
 * @param items
 * @returns
 */
function getContactCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	for ( var i = 0; i < items.length; i++)
	{
		if (items[i].type == "CUSTOM" && items[i].name != "image")
		{
			fields.push(items[i]);
		}
	}
	return fields;
}

/**
 * Turns the first letter of the given string to upper-case and the remaining to
 * lower-case (EMaiL to Email).
 * 
 * @param {String}
 *            value to convert as ucfirst
 * @returns converted string
 */
function ucfirst(value)
{
	return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';

}

/**
 * Creates titles from strings. Replaces underscore with spaces and capitalize
 * first word of string.
 * 
 * @param value
 * @returns
 */
function titleFromEnums(value)
{
	if (!value)
		return;

	var str = value.replace(/_/g, ' ');

	return ucfirst(str.toLowerCase());
}

/**
 * Counts total number of attributes in a json object
 * 
 * @param obj
 * @returns {Number}
 */
function countJsonProperties(obj)
{
	var prop;
	var propCount = 0;

	for (prop in obj)
	{
		propCount++;
	}
	return propCount;
}

/**
 * Get the current contact property
 * 
 * @param value
 * @returns {String}
 */
function getCurrentContactProperty(value)
{
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{
		var contact_properties = App_Contacts.contactDetailView.model.get('properties')
		console.log(App_Contacts.contactDetailView.model.toJSON());
		return getPropertyValue(contact_properties, value);
	}
}

function getCount(collection)
{
	console.log(collection);
	if (collection[0] && collection[0].count && (collection[0].count != -1))
		return "(" + collection[0].count + " Total)";
	else
		return "(" + collection.length + " Total)";	
}

/**
 * Returns id from hash. Id must be last in hash.
 **/
function getIdFromHash(){
	
	// Returns "workflows" from "#workflows"
	var hash = window.location.hash.substr(1);
	
	// remove trailing slash '/'
	if(hash.substr(-1) === "/")
	{
		hash = hash.replace(/\/$/, "");
	}
	
	// Returns campaign_id from "workflow/all-contacts/campaign_id".
	var id = hash.split('/').pop();
	
	return id;
}

function updateCustomData(el)
{
	$(".custom-data", App_Contacts.contactDetailView.el).html(el)
}
