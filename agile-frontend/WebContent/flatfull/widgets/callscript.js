function startCallScriptWidget(){
	// CallScript widget name as a global variable
	CallScript_PLUGIN_NAME = "CallScript";

	// Twilio loading image declared as global
	CALLSCRIPT_LOGS_LOAD_IMAGE = '<center><img id="logs_load" src=\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	if(App_Widgets.Catalog_Widgets_View)
	  var callscript_widget = App_Widgets.Catalog_Widgets_View.collection.where({ name : CallScript_PLUGIN_NAME })[0].toJSON();
	else
	// Following wont give current updated widget 
	  var callscript_widget = agile_crm_get_widget(CallScript_PLUGIN_NAME);

	// ID of the CallScript widget as global variable
	CallScript_Plugin_Id = callscript_widget.id;

	/*
	 * Gets CallScript widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget
	 */
	if (callscript_widget.prefs == undefined || callscript_widget.prefs == "{}")
	{
		// show default text
		$('#CallScript').html("<div class='wrapper-sm'>Welcome to CallScript</div>");
		return;
	}			
	
	// Parse string preferences as JSON
	var callscript_prefs = JSON.parse(callscript_widget.prefs);

	_agile_contact = agile_crm_get_contact();
	
	// Apply call script rules
	_agile_execute_callscriptrules(callscript_prefs.csrules);
}
