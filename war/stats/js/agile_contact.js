/**
 * agile_contact.js deals with the functions used to create, get,
 * and delete the contact.
 * 
 * @module stats
 */

/**
 * Creates a contact with the following properties
 * 
 * @param data
 * 				example : {tags:[tag1, tag2], properties:[{name:first_name, value: agile}, {name: last_name, value: crm}]
 * @param callback 
 * 				callback function for agile_createContact
 */
function agile_createContact(data, callback)
{
	var properties = [];

	for (var key in data)
	{
		if (data.hasOwnProperty(key) && key != "tags")
		{
			//add tags to properties array
			properties.push(agile_propertyJSON(key, data[key]));
		}
	}

	var original_ref = "original_ref";
	properties.push(agile_propertyJSON(original_ref, agile_read_cookie(agile_guid.cookie_original_ref)));
	//creating json object and appending properties 
	var model = {};
	model.properties = properties;
	console.log(model);
	if (data["tags"])
	{
		var tags = data["tags"];
		var tags_string = tags.trim().replace("/ /g", " ");

		//Replace ,space with ,
		tags_string = tags.replace("/, /g", ",");
		//Splitting tags string at ,
		model.tags = tags_string.split(",");
	}

	//var params = "contact={0}&tags={1}".format(encodeURIComponent(data), encodeURIComponent(JSON.stringify(tags)));
	//Get
	var agile_url = agile_id.getURL() + "/contacts?callback=?&id=" + agile_id.get() + "&contact=" + encodeURIComponent(JSON.stringify(model));
	//callback
	agile_json(agile_url, callback, data);
}

/**
 * Delete a contact based on the email
 * @param email
 * 				email of the contact
 * @param callback
 * 				callback for agile_deleteContact
 */			
function agile_deleteContact(email, callback)
{
	var agile_url = agile_id.getURL() + "/contact/delete?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);
	//callback
	agile_json(agile_url, callback);
}

/**
 * Get contact based on the email
 * @param email
 * 				email of the contact
 * @param callback
 * 				callback of the agile_getContact
 */
function agile_getContact(email, callback)
{
	var params = "email={0}".format(encodeURIComponent(email));
	console.log(agile_id);
	console.log(agile_id.getURL());
	console.log(agile_id.get());
	//Get
	var agile_url = agile_id.getURL() + "/contact/email?callback=?&id=" + agile_id.get() + "&" + params;
	//callback
	agile_json(agile_url, callback);
}