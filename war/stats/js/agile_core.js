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

	if (type == undefined){
		switch(name){
		case 'first_name':
		case 'last_name':
		case 'email':
		case 'company':
		case 'title':
		case 'name':
		case 'url':
		case 'website':
		case 'address':
		case 'phone':
		case 'original_ref':
			json.type = "SYSTEM";
			break;
		default:
			json.type = "CUSTOM";
			break;
		}
	}
	else
		json.type = type;

	json.name = name;
	json.value = id;
	return json;
}

/**
 * Variable to maintain interval
 */
var agile_json_timer;

/**
 * Generates the callback
 * 
 * @param URL
 *            callback url
 * @param callback
 *            callback function
 * @param data
 *            callback function parameter (used optionally depending on
 *            callback)
 * @returns element
 */
function agile_json(URL, callback)
{
	if (!document.body)
	{
		clearInterval(agile_json_timer);
		agile_json_timer = setInterval(function()
		{
			agile_json(URL, callback);
		}, 100);
		return;
	}
	clearInterval(agile_json_timer);

	var ud = 'json' + (Math.random() * 100).toString().replace(/\./g, '');
	window[ud] = function(data)
	{
		if (data['error'])
		{
			if (callback && typeof (callback['error']) == "function")
			{
				callback['error'](data);
			}
			return;
		}

		if (callback && typeof (callback['success']) == "function")
			callback['success'](data);

		if (callback && typeof (callback) == 'function')
			callback(data);
	};

	document.getElementsByTagName('body')[0].appendChild((function()
	{
		var s = document.createElement('script');
		s.type = 'application/javascript';
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
