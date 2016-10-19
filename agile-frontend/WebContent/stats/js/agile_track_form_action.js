
function agile_track_form_action(json,id,name)
{
	//var Track_Visitor_Server_URL = "https://stats3.agilecrm.com";


	
	//params="?domain="+json.domain+"&webruleid"+json.webtulrid+"&email"+json.emai
	var agile_url_new =  "https://"+agile_id.getNamespace()+"-dot-sandbox-dot-agilecrmbeta.appspot.com/savedformdata?callback=?&email=" + json.email+"&domain="+json.domain+"&formid="+id+"&form_name="+name;


	// agile_json(agile_url, callback);

	agile_json(agile_url_new);

}


