function agile_track_form_action(formInfo)
{

	var agile_url_new =  "http://localhost:8888/addformstats?callback=?&email=" + formInfo.email+"&formid="+formInfo.id+"&form_name="+formInfo.name;

	agile_json(agile_url_new);

}