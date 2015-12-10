/**
 * Get all web rules associated with a domain
 */
function agile_webRules(callback)
{
	// Get
	var agile_url = agile_id.getURL() + "/web-rules?callback=?&id=" + agile_id.get();

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Download all web rules and execute them
 */
function _agile_execute_web_rules()
{
	// Download web rules and call _agile_webrules
	_agile_require_js("https://s3.amazonaws.com/agilewebgrabbers/scripts/agile-webrules-min.js", function()
	{
		_agile_webrules();
	});
}

/**
 * Loads js file during the run time and executes callback
 */
function _agile_require_js(scriptURL, callback)
{
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.src = scriptURL;

	// If IE browser
	if ((navigator.appVersion).indexOf('MSIE') > 0)
	{
		script.onreadystatechange = function()
		{
			if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete"))
			{
				callback();
			}
		};
	}
	// Browsers other than IE
	else
	{
		script.onload = function()
		{
			if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete"))
			{
				callback();
			}
		};
	}
	var head_tag = document.getElementsByTagName('head')[0];
	head_tag.appendChild(script);
}
