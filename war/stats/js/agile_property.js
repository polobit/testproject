/**
 * agile_property deals with function to add a property to 
 * contact based on the property name and email of contact
 * @param name {String}
 * 				name of the property to be added example : email etc.
 * @param id   {String}
 * 				value of the property to be added example : clickdesk@example.com
 * @param callback
 * 				callback for addProperty function
 * @param email	{String}
 * 				email of the contact, property should be added to
 */
function agile_setProperty(data, callback, email)
{
	// Check if email passed as parameter, else get from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	var agile_url = agile_id.getURL() + "/contacts/add-property?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Callback
	agile_json(agile_url, callback);
}

function agile_getProperty(name, callback, email)
{
	if (!email)
		{
			if(!agile_guid.get_email())
				{
					return;
				}
			else
				email = agile_guid.get_email();
		}
	if (!name)
		return;
	
	var agile_url = agile_id.getURL() + "/contacts/get-property?callback=?&id=" + agile_id.get() + "&name=" + name + "&email=" + encodeURIComponent(email);
	
	agile_json(agile_url, callback);
}

function agile_removeProperty(name, callback, email)
{
	if(!email)
		{
			if (!agile_guid.get_email())
				{
					return;
				}
			else 
				email = agile_guid.get_email();
		}
	if(!name)
		return;
	
	var agile_url = agile_id.getURL() + "/contacts/remove-property?callback=?&id=" + agile_id.get() + "&name=" + name + "&email=" + encodeURIComponent(email);
	
	agile_json(agile_url, callback);
}