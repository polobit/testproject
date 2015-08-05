/**
 * agile_deals.js deals with function to add and get a deal to a contact based on the email
 */

/**
 * Add a opportunity to contact based on email
 * 
 * @param data
 *            example : {"name": "Deal sales", "description": "brief description on deal",
 *            "expected_value": "100", "milestone":"won", "close_date": data as epoch time}
 * @param callback
 *            callback function for agile_addDeal
 * @param email
 *            email of the contact
 */

function agile_addDeal(data, callback, email)
{
	// If email is not passed get it from cookie
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

	// Get
	var agile_url = agile_id.getURL() + "/opportunity?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get a contact opportunity based on email
 * 
 * @param email
 * 				email of the contact
 */

function agile_getDeals(callback, email)
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
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-deals?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}

function agile_updateDeal(data, callback, email)
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
	var params = "opportunity={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	// Build URL
	var agile_url = agile_id.getURL() + "/opportunity/update-deal?callback=?&id=" + agile_id.get() + "&" + params;

	// Send Request
	agile_json(agile_url, callback);
}
