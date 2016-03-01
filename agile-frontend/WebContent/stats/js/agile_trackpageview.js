/**
 * Checks if guid, session_id are assigned else sets them by calling get() from
 * agile_guid.js and agile_session.js. Gets agile_id, and namespace by calling
 * agile_id.getNamespace() and agile_id.get(). Captures document.referrer if the
 * session is new.
 * 
 * @param callback
 *            callback function for trackpageview
 * @returns params
 */
function agile_trackPageview(callback)
{
	var Track_Visitor_Server_URL = "https://agilecrm-web-stats.appspot.com";

	// Get guid
	var guid = agile_guid.get();

	// Get Session-id
	var session_id = agile_session.get();

	// Current url
	var url = document.location.href || "";

	// Get agile_id
	var agile = agile_id.get();

	// Initialize params
	var params = "";

	// If it is a new session
	if (agile_session.new_session)
	{
		// Set the referrer
		var document_referrer = document.referrer || "";
		params = "guid={0}&sid={1}&url={2}&agile={3}&new=1&ref={4}".format(guid, session_id, encodeURIComponent(url), agile, encodeURIComponent(document_referrer));
	}
	else
		params = "guid={0}&sid={1}&url={2}&agile={3}".format(guid, session_id, encodeURIComponent(url), agile);

	if (agile_guid.get_email())
		params += "&email=" + encodeURIComponent(agile_guid.get_email());

	if(agile_id.getNamespace())
		params += "&domain=" + encodeURIComponent(agile_id.getNamespace());

	// Add action param
	params += "&action=ADD";

	// Sets UTM params
	agile_setUtmParams();	

	var agile_url = "https://" + agile_id.getNamespace() + ".agilecrm.com/stats?callback=?&" + params;
	var agile_url_new =  Track_Visitor_Server_URL + "/addstats?callback=?&" + params;

	// Callback
	agile_json(agile_url, callback);

	agile_json(agile_url_new);

}

function agile_trackingDomain(host){
	agile_id.setDomain(host);
}