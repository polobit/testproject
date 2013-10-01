/**
 * agile_core.js is a script file which contains the helper functions used in
 * agile-min.js
 * 
 * @module Stats
 */

function agile_propertyJSON(name, id, type)
{
	/**
	 * Converts the parameters passed to it into a JSON object
	 * 
	 * @param name
	 *            name of the property. Example : "email"
	 * @param id
	 *            value of the property. Example : "clickdesk@example.com"
	 * @returns JSON
	 */
	var json = {};

	if (type == undefined)
		json.type = "SYSTEM";
	else
		json.type = type;

	json.name = name;
	json.value = id;
	return json;
}

function agile_json(URL, callback)
{
	/**
	 * Generates the callback
	 * 
	 * @param URL
	 *            callback url
	 * @param callback
	 *            callback function
	 * @param data
	 *            callback function parameter (used optionally depending on callback)
	 * @returns element
	 */
	var ud = 'json' + (Math.random() * 100).toString().replace(/\./g, '');
	window[ud] = function(data)
	{
		console.log(callback);
		if(data['error'])
			{
				if(callback && typeof(callback['error']) == "function")
				{
					callback['error'](data);
				}
				return;
			}
		
		if(callback && typeof(callback['success']) == "function")
			callback['success'](data);
		
		if(callback && typeof(callback) == 'function')
			callback(data);
	};
	document.getElementsByTagName('body')[0].appendChild((function()
	{
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = URL.replace('callback=?', 'callback=' + ud);
		return s;
	})());
}

String.prototype.format = function()
{
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number)
	{
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};
