/**
 * agile_property deals with function to add a property to 
 * contact based on the property name and email of contact
 * @param name
 * 				name of the property to be added example : email etc.
 * @param id
 * 				value of the property to be added example : clickdesk@example.com
 * @param callback
 * 				callback for addProperty function
 * @param email
 * 				email of the contact, property should be added to
 */
function agile_addProperty(name, id, callback, email)
{
	//check if email passed as parameter, else get from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	//convert parameters to json object data
	var data = {};
	data.name = name;
	data.value = id;

	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	var agile_url = agile_id.getURL() + "/contacts/add-property?callback=?&id=" + agile_id.get() + "&" + params;
	
	//callback
	agile_json(agile_url, callback);
}