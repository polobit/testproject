
function agile_track_webrule(json,domain,action)
{
	var agile_url_new =  "https://"+agile_id.getNamespace()+".agilecrm.com/savedata?callback=?&email=" + json.email+"&domain="+agile_id.getNamespace()+"&webruleid="+CURRENT_AGILE_WEB_RULE_ID+"&webruletype="+action;

	agile_json(agile_url_new);

}


