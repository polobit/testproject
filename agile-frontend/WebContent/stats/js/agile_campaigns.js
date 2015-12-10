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
			agile_cookieCampaigns("add", data);
			return;
		}
		else 
			email = agile_guid.get_email();
	}
	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));
	
	// Get
	var agile_url = agile_id.getURL() + "/contacts/add-campaign?callback=?&id=" + agile_id.get() + "&" + params;
	
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

/**
* Get a multiple campaign logs based on email of the contact
* 
* @param email
* 				email of the contact
*/
function agile_getCampaignlogs(callback, email)
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
	var agile_url = agile_id.getURL() + "/contacts/get-campaign-logs?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}

/**
* Get all work-flows created by current domain user
*/
function agile_getWorkflows(callback)
{
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-workflows?callback=?&id=" + agile_id.get();
	
	// Callback
	agile_json(agile_url, callback);
}

/**
* Remove a campaign based on the email of the contact
* 
* @param email
* 				email of the contact
*/
function agile_unsubscribeCampaign(data, callback, email)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			agile_cookieCampaigns("delete", data);
			return;
		}
		else 
			email = agile_guid.get_email();
	}
	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));
	
	// Get
	var agile_url = agile_id.getURL() + "/contacts/unsubscribe-campaign?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Callback
	agile_json(agile_url, callback);
}