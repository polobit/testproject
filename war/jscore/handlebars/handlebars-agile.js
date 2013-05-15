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
 * @returns compiled html with the context
 */
function getTemplate(templateName, context, download) {

	// Check if it is (compiled template) present in templates
	if (Handlebars_Compiled_Templates[templateName])
			return Handlebars_Compiled_Templates[templateName](context);
	else
		Handlebars_Compiled_Templates = {};

	// Check if source is available in body
	var source = $('#' + templateName + "-template").html();
	if (source) {
		
		var template = Handlebars.compile(source);
		
		// Store it in template
		Handlebars_Compiled_Templates[templateName] = template;

		//alert("template");
		return template(context);
	}

	// Check if the download is explicitly set to no
	if (download == 'no') {
		console.log("Not found " + templateName);
		return;
	}

	// Download
	var templateHTML = '';

	// If starts with settings
	/**
	 * If the template is not found in document body, then download the template
	 * synchronously (stops other browser actions) by verifying the starting
	 * name of the given templateName, if it is down-loaded append it to the
	 * document body. And call the function (getTemplate) again by setting the
	 * download parameter to "no"
	 */
	if (templateName.indexOf("settings") == 0) {
		templateHTML = downloadSynchronously("tpl/min/settings.js");
	}
	if (templateName.indexOf("admin-settings") == 0) {
		templateHTML = downloadSynchronously("tpl/min/admin-settings.js");
	}
	if (templateName.indexOf("continue") == 0) {
		templateHTML = downloadSynchronously("tpl/min/continue.js");
	}

	if (templateHTML) {
		// console.log("Adding " + templateHTML);
		$('body').append($(templateHTML));
	}

	return getTemplate(templateName, context, 'no');
}

/**
 * Downloads the template synchronously (stops other browsing actions) from the
 * given url and returns it
 * 
 * @param {String}
 *            url location to download the template
 * @returns down-loaded template content
 */
function downloadSynchronously(url) {

	var urlContent;
	jQuery.ajax({
		url : url,
		dataType : 'html',
		success : function(result) {
			urlContent = result;
		},
		async : false
	});

	return urlContent;
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
function getPropertyValue(items, name) {
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++) {
		if (items[i].name == name)
			return items[i].value;
	}
}

/**
 * Turns the first letter of the given string to upper-case and the remaining to
 * lower-case (EMaiL to Email).
 * 
 * @param {String}
 *            value to convert as ucfirst
 * @returns converted string
 */
function ucfirst(value) {
	return (value && typeof value === 'string') ? (value.charAt(0)
			.toUpperCase() + value.slice(1).toLowerCase()) : '';

}

function titleFromEnums(value){
	if (!value)
		return;
	
	var str = value.replace(/_/g, ' ');
	
	return ucfirst(str.toLowerCase());
}

/**
 * Counts total number of attributes in a json object 
 * @param obj
 * @returns {Number}
 */
function countJsonProperties(obj) {
	  var prop;
	  var propCount = 0;

	  for (prop in obj) {
	    propCount++;
	  }
	  return propCount;
	}