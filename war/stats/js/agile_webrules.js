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
	_agile_require_js("/stats/min/agile-webrules-min.js", function(){_agile_webrules();});
}

/*
 * Loads js file during the run time and executes callback
 */
function _agile_require_js(file, callback) {
	   var script = document.getElementsByTagName('script')[0],
	   newjs = document.createElement('script');

	  // IE
	  newjs.onreadystatechange = function () {
	     if (newjs.readyState === 'loaded' || newjs.readyState === 'complete') {
	        newjs.onreadystatechange = null;
	        callback();
	     }
	  };
	  // others
	  newjs.onload = function () {
	     callback();
	  }; 
	  newjs.src = file;
	  script.parentNode.insertBefore(newjs, script);
	}