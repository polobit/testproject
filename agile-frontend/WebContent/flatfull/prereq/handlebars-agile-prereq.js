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
 *            To decide whether templates should be downloaded synchronously or
 *            asynchronously.
 * 
 * @returns compiled html with the context
 */
function getTemplate(templateName, context, download, callback, loading_place_holder)
{
	var is_async = callback && typeof (callback) == "function";
	if(templateName == "admin-settings" && !CURRENT_DOMAIN_USER.is_admin){
		templateName = "others-not-allowed";
		callback = function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));
					}
	}
	// Check if it is (compiled template) present in templates
	if (Handlebars_Compiled_Templates[templateName])
	{
		if (callback)
			return callback(Handlebars_Compiled_Templates[templateName](context));
		else
			return Handlebars_Compiled_Templates[templateName](context);
	}
	else
		Handlebars_Compiled_Templates = {};

	// Check if source is available in body
	if (HANDLEBARS_PRECOMPILATION)
	{
		var template = Handlebars.templates[templateName + "-template"];

		// If teplate is found
		if (template)
		{
			// If callback is sent then template is downloaded asynchronously
			// and content is sent in callback
			if (is_async)
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
		if (source)
		{
			var template = Handlebars.compile(source);
			Handlebars_Compiled_Templates[templateName] = template;

			// If callback is sent then template is downloaded asynchronously
			// and content is sent
			if (is_async)
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

	// Shows loader icon if there is a loader placeholder
	if(loading_place_holder)
	{
		try{
			var loaderEl = $(getRandomLoadingImg());
			$(loading_place_holder).html(loaderEl.css("margin", "10px"));
		}catch(err){}
	}
		   

	// Stores urls of templates to be downloaded.
	var template_relative_urls = getTemplateUrls(templateName);

	if (is_async)
	{
		load_templates_async(templateName, context, template_relative_urls, callback);
		return;
	}

	load_templates_sync(template_relative_urls);

	return getTemplate(templateName, context, 'no');
}