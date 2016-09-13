
function agile_track_webrule(json,domain,action)
{
	//var Track_Visitor_Server_URL = "https://stats3.agilecrm.com";


	
	//params="?domain="+json.domain+"&webruleid"+json.webtulrid+"&email"+json.email;

	var agile_url_new =  "http://localhost:8888/savedata?callback=?&email=" + json.email+"&domain="+agile_id.getNamespace()+"&webruleid="+gbal_web_id+"&webruletype="+action;

	// agile_json(agile_url, callback);

	agile_json(agile_url_new);

}


