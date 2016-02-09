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
 *            {object} example : {tags:[tag1, tag2],
 *            properties:[{name:first_name, value: agile}, {name: last_name,
 *            value: crm}]}
 * @param callback
 *            callback function for agile_createContact
 */
function agile_createContact(data, callback)
{
	// Create json object and append properties
	var model = {};

	// Create properties list
	var properties = [];

	for ( var key in data)
	{
		if (data.hasOwnProperty(key) && key != "tags" && key != "lead_score")
		{
			// Add tags to properties array
			properties.push(agile_propertyJSON(key, data[key]));
		}
	}

	// Get original referrer from cookie
	var original_ref = agile_read_cookie(agile_guid.cookie_original_ref);

	// Get the tags from cookie
	var tags_from_cookie = agile_read_cookie(agile_guid.cookie_tags);

	// Get score from cookie
	var score_from_cookie = agile_read_cookie(agile_guid.cookie_score);

	// Get campaigns from cookie
	var campaigns_from_cookie = agile_read_cookie(agile_guid.cookie_campaigns);

	// Get utm params from cookie
	var utm_params_from_cookie = agile_getUtmParamsAsProperties();

	// Add properties to model
	model.properties = properties;

	if(original_ref)
		properties.push(agile_propertyJSON("original_ref", original_ref));

	// Save utm params in contact properties
	if(utm_params_from_cookie && utm_params_from_cookie.size != 0)
	{
		try
		{
			// Merge with properties array
			properties.push.apply(properties, utm_params_from_cookie);
		}
		catch(err)
		{
			console.debug("Error occured while pushing utm params " + err);
		}
	}


	if (data["tags"])
	{
		var tags = data["tags"];
		var tags_string = tags.trim().replace("/ /g", " ");

		// Replace ,space with ,
		tags_string = tags_string.replace("/, /g", ",");

		// Splitting tags string at ,
		model.tags = tags_string.split(",");

		// Trim each tag for spaces
		for ( var i = 0; i < model.tags.length; i++)
		{
			model.tags[i] = model.tags[i].trim();
		}
	}
	if (tags_from_cookie)
	{
		agile_delete_cookie(agile_guid.cookie_tags);
		var tags_string = tags_from_cookie.trim().replace("/ /g", " ");
		tags_string = tags_string.replace("/, /g", ",");
		var tags_array = tags_string.split(",");
		if (model.tags)
		{
			for ( var i = 0; i < tags_array.length; i++)
			{
				model.tags.push(tags_array[i].trim());
			}
		}
		else
		{
			model.tags = [];
			for ( var i = 0; i < tags_array.length; i++)
			{
				model.tags.push(tags_array[i].trim());
			}
		}
	}
	if(data["lead_score"])
	{
		model.lead_score = parseInt(data["lead_score"]);
	}
	if(score_from_cookie)
	{
		agile_delete_cookie(agile_guid.cookie_score);
		if(model.lead_score)
			model.lead_score = model.lead_score + parseInt(score_from_cookie);
		else
			model.lead_score = parseInt(score_from_cookie);
	}
	var params = "contact={0}".format(encodeURIComponent(JSON.stringify(model)));
	if(campaigns_from_cookie)
	{
		agile_delete_cookie(agile_guid.cookie_campaigns);
		params = params + "&campaigns={0}".format(encodeURIComponent(campaigns_from_cookie));
	}

	// Get
	var agile_url = agile_id.getURL() + "/contacts?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Delete a contact based on the email
 * 
 * @param email
 *            email of the contact
 * @param callback
 *            callback for agile_deleteContact
 */
function agile_deleteContact(email, callback)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var agile_url = agile_id.getURL() + "/contact/delete?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get contact based on the email
 * 
 * @param email
 *            email of the contact
 * @param callback
 *            callback of the agile_getContact
 */
function agile_getContact(email, callback)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "email={0}".format(encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/contact/email?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Update contact based on the email
 * 
 * @param data
 *            data on JSON format
 * @param callback
 *            callback for updateContact
 * @param email
 *            email of the contact to update
 */
function agile_updateContact(data, callback, email)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	// Query Params
	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/contact/update?callback=?&id=" + agile_id.get() + "&" + params;

	// Request
	agile_json(agile_url, callback);
}

/**
 * Creates a company
 * 
 * @param data
 *            Company data in JSON format
 * @param callback
 *            callback function
 */
function agile_createCompany(data, callback)
{
	// Properties array
	var properties = [];

	// Iterate data and add properties to array
	for ( var key in data)
	{
		if (data.hasOwnProperty(key))
		{
			properties.push(agile_propertyJSON(key, data[key]));
		}
	}

	// JSON model with properties
	var model = {};
	model.properties = properties;

	var agile_url = agile_id.getURL() + "/company?callback=?&id=" + agile_id.get() + "&data=" + encodeURIComponent(JSON.stringify(model));

	// Callback
	agile_json(agile_url, callback);
}

/**
* Returns all utm params as Contact Custom Parameters
**/
function agile_getUtmParamsAsProperties()
{
	var properties = [];

	try
	{
		var utm_params = agile_getUtmParams();

		for(var param in utm_params){

		if(utm_params.hasOwnProperty(param))
			properties.push(agile_propertyJSON(param, utm_params[param]));
		}
	}
	catch(err){
		console.debug(err);
	}

	return properties;
}

