/**
 * Function to get allowed domains string
 */
function agile_allowedDomains(callback){
	
	// GET
	var agile_url = agile_id.getURL() + "/allowed-domains?callback=?&id=" + agile_id.get();
	
	// Callback
	agile_json(agile_url,callback);
}

/**
 * Function to get allowed domains string
 */
function agile_getAllUsers(callback){
	
	// GET
	var agile_url = agile_id.getURL() + "/users?callback=?&id=" + agile_id.get();
	
	// Callback
	agile_json(agile_url,callback);
}