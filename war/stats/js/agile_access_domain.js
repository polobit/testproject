function agile_accessDomains(callback)
{
	var agile_url = agile_id.getURL() + "/whitelist?callback=?&id=" + agile_id.get();
	agile_json(agile_url, callback);
}
