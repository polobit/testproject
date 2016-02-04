var TEMPLATE_LIB_PATH = "";

/**
 * Downloads the template synchronously (stops other browsing actions) from the
 * given url and returns it
 * 
 * @param {String}
 *            url location to download the template
 * @returns down-loaded template content
 */
function downloadTemplate(url, callback)
{

	var dataType = 'html', template_url = CLOUDFRONT_PATH;


	// If Precompiled is enabled, we change the directory to precompiled. If
	// pre-compiled flat is set true then template path is sent accordingly
	if (HANDLEBARS_PRECOMPILATION)
	{
		url = "tpl/min/precompiled/" + FLAT_FULL_UI +  url;
	}
	else
		url = "tpl/min/" + FLAT_FULL_UI +  url;

	// If JS
	if (url.endsWith("js") && HANDLEBARS_PRECOMPILATION)
	{
		dataType = 'script';
		template_url = template_url.replace("flatfull/", "");
		url = template_url + url;
	}

	url += "?_=" + _AGILE_VERSION;
	
	// If callback is sent to this method then template is fetched synchronously
	var is_async = false;
	if (callback && typeof (callback) === "function")
		is_async = true;

	console.log(url + " " + dataType + " " + is_async);

	var is_cached = !LOCAL_SERVER;

	jQuery.ajax({ url : url, dataType : dataType, cache:is_cached, success : function(result)
	{
		// If HTMl, add to body
		if (dataType == 'html')
			$('body').append((result));

		if (is_async)
			callback(result);
	}, async : is_async });

	return "";
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
