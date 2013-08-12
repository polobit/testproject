/**
 * agile_deals.js deals with function to add a deal to a contact 
 * based on the email
 * @param data
 * 				example : {"name": "Deal sales", "description": "brief description on deal", 
 * 						  "expected_value": "100", "milestone":"won", "close_date": data as epoch time}
 * @param callback
 * 				callback function for agile_addDeal
 * @param email
 * 				email of the contact
 */

function agile_addDeal(data, callback, email)
{
	//if email is not passed get it from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}

	var params = "opportunity={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	//Get
	var agile_url = agile_id.getURL() + "/opportunity?callback=?&id=" + agile_id.get() + "&" + params;
	//callback
	agile_json(agile_url, callback, data);
}