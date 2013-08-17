/**
* agile_campaigns.js deals with functions to add or get campaigns based on the email of the contact
*/

/**
* Add a campaign based on the email of the contact
* 
* @param email
* 				email of the contact
*/
function agile_addCampaign(data, callback, email)
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
	var agile_url = agile_id.getURL() + "/contacts/add-campaign?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}

/**
* Get a campaign based on email of the contact
* 
* @param email
* 				email of the contact
*/
function agile_getCampaigns(callback, email)
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
	var agile_url = agile_id.getURL() + "/contacts/get-campaigns?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}
