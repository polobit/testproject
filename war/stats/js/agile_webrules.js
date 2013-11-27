/**
 * Get all web rules associated with a domain
 */
function agile_webRules(callback)
{
	// Get
	var agile_url = agile_id.getURL() + "/web-rules?callback=?&id=" + agile_id.get();

	// Callback
	agile_json(agile_url, callback);
}