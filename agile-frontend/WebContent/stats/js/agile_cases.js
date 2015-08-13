/**
 * Function call to add case to contact based on email
 * 
 * @param data
 * @param callback
 * @param email
 */

function agile_createCase(data, callback, email)
{
	if(!email)
	{
		if(!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	var params = "case={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));
	
	var agile_url = agile_id.getURL() + "/case?callback=?&id=" + agile_id.get() + "&" + params;
	
	agile_json(agile_url, callback);
}