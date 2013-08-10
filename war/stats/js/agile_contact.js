function agile_createContact(data, callback)
{
	var properties = [];

	for ( var key in data)
	{
		if (data.hasOwnProperty(key) && key != "tags")
		{
			// alert(key + " -> " + p[key]);
			properties.push(agile_propertyJSON(key, data[key]));
		}
	}

	var original_ref = "original_ref";
	properties.push(agile_propertyJSON(original_ref, agile_read_cookie(agile_guid.cookie_original_ref)));

	var model = {};
	model.properties = properties;
	console.log(model);
	if (data["tags"])
	{
		var tags = data["tags"];
		var tags_string = tags.trim().replace("/ /g", " ");

		// Replace ,space with ,
		tags_string = tags.replace("/, /g", ",");

		model.tags = tags_string.split(",");
	}

	// var params = "contact={0}&tags={1}".format(encodeURIComponent(data),
	// encodeURIComponent(JSON.stringify(tags)));
	// Get
	var agile_url = agile_id.getURL() + "/contacts?callback=?&id=" + agile_id.get() + "&contact=" + encodeURIComponent(JSON.stringify(model));

	agile_json(agile_url, callback, data);
}

function agile_deleteContact(email, callback)
{
	var agile_url = agile_id.getURL() + "/contact/delete?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);

	agile_json(agile_url, callback);
}

function agile_getContact(email, callback)
{
	var params = "email={0}".format(encodeURIComponent(email));
	console.log(agile_id);
	console.log(agile_id.getURL());
	console.log(agile_id.get());
	// Get
	var agile_url = agile_id.getURL() + "/contact/email?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, callback);
}