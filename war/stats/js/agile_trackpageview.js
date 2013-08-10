function agile_trackPageview(callback)
{
	// Guid
	var guid = agile_guid.get();

	// Session-id
	var session_id = agile_session.get();

	// Page
	var url = document.location.href;
	console.log(url);
	if (url !== undefined && url != null)
		url = encodeURIComponent(url);
	else
		url = "";

	var agile = agile_id.get();

	var params = "";

	console.log("New session " + agile_session.new_session);

	// Get Visitor Info if session is new
	if (agile_session.new_session)
	{
		// Set the referrer
		var document_referrer = document.referrer;
		if (document_referrer !== undefined && document_referrer != null && document_referrer != "null")
			document_referrer = encodeURIComponent(document_referrer);
		else
			document_referrer = "";

		params = "guid={0}&sid={1}&url={2}&agile={3}&new=1&ref={4}".format(guid, session_id, url, agile, document_referrer);
	}
	else
		params = "guid={0}&sid={1}&url={2}&agile={3}".format(guid, session_id, url, agile);

	if (agile_guid.get_email())
		params += "&email=" + encodeURIComponent(agile_guid.get_email());

	var agile_url = "https://" + agile_id.getNamespace() + ".agilecrm.com/stats?callback=?&" + params;

	agile_json(agile_url, callback);
	// agile_ajax.send(url, ajax_data);
}