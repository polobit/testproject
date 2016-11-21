function startAppCallingWidget(contact_id){
	APPCALLING_PLUGIN_NAME = "AppCalling";

	APPCALLING_UPDATE_LOAD_IMAGE = '<center><img id="appcalling_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var appcalling_widget = agile_crm_get_widget(APPCALLING_PLUGIN_NAME);

	console.log(appcalling_widget);

	APPCALLING_Plugin_Id = appcalling_widget.id;	
	
	$('#AppCalling').html("No Logs");
}