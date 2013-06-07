/**
 * ===rapleaf.js==== It is a pluginIn to be integrated with CRM, developed based
 * on the third party javascript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API). Rapleaf 
 * fetches information based on the email
 */
$(function() {

	// Plugin name as a global variable
	RAPLEAF_PLUGIN_NAME = "Rapleaf";
	RAPLEAF_PLUGIN_HEADER = '<div></div>';
	
	Rapleaf_loader = '<div id="rap_info_load"><center><img  src=\"img/ajax-loader-cursor.gif\" ' + 
						'style="margin-top: 10px;margin-bottom: 14px;"></img></center></div>';

	// Gets plugin id from plugin object, fetched using script API
	var plugin_id = agile_crm_get_plugin(RAPLEAF_PLUGIN_NAME).id;

	// Gets Plugin Prefs, required to check whether to show setup button or to
	// fetch details
	var plugin_prefs = agile_crm_get_plugin_prefs(RAPLEAF_PLUGIN_NAME);

	 $('#Rapleaf_plugin_delete').die().live('click', function (e) {
	    	
	    	e.preventDefault();
	    	
	    	agile_crm_save_widget_prefs(RAPLEAF_PLUGIN_NAME,
			        undefined , function (data)
	        {
	    		setupRapleafOAuth(plugin_id);
	        });
	    });
	 
	// If not found - considering first time usage of widget, setupRapleafOAuth
	// called
	if (plugin_prefs == undefined) {
		setupRapleafOAuth(plugin_id);
		return;
	}

	// Gets Contact properties for this widget, based on plugin name (using
	// Third party script API)
	var rapleaf_id = agile_crm_get_widget_property_from_contact(RAPLEAF_PLUGIN_NAME);

	// If property with Rapleaf do not exist, all the matching profiles
	if (!rapleaf_id) {
		showRapleafDetails(plugin_id);
		return;
	}

});

/**
 * Shows setup if user adds rapleaf widget for the first time, to set up
 * connection to rapleaf account. Enter and api key provided by Rapleaf access
 * functionalities
 * 
 * @param plugin_id
 */
function setupRapleafOAuth(plugin_id) {
	
	// Shows an input filed to save the the prefs (api key provided by rapleaf)
	$('#Rapleaf')
			.html(
					RAPLEAF_PLUGIN_HEADER
							+ '<div class="widget_content" style="border-bottom:none"><p >Rapleaf helps you learn more about your customers, provides data (age, gender, marital status, income, etc., ) on US consumer email addresses.To access, </p>'
							+ '<p><label>Enter Your API key</label>'
							+ '<input type="text" id="rapleaf_api_key" class="input-medium required" placeholder="API Key" value=""></input></p>'
							+ '<button id="save_api_key" class="btn" ><a href="#" style="text-decoration:none;">Save</a></button><br/>'
							+ '<p style="line-height: 25px;padding:5px;">Don\'t have an API key? <a href="https://www.rapleaf.com/developers/api_access"> SignUp </a></p></div>');

	// Saves the api key
	$('#save_api_key').die().live('click', function(e) {
		e.preventDefault();
		var api_key = $("#rapleaf_api_key").val();
		
		// If input field is empty return
		if(api_key == "")
			return;
		// api_key = "f3e71aadbbc564750d2057612a775ec6";
		agile_crm_save_widget_prefs(RAPLEAF_PLUGIN_NAME, api_key);
		
		// On saving prefs, called to show rapleaf details
		showRapleafDetails(plugin_id);
	});
}

/**
 * Shows details of contact using rapleaf
 * 
 * 
 * @param plugin_id	  : plugin_id to get prefs (api key saved in widgets) to connect to rapleaf
 */
function showRapleafDetails(plugin_id) {

	// Shows loading, until info is fetched
	$('#Rapleaf').html(Rapleaf_loader);

	var email = agile_crm_get_contact_property('email');
	var url = "core/api/widgets/rapleaf/"
			+ agile_crm_get_plugin_prefs(RAPLEAF_PLUGIN_NAME) + "/" + email;

		queueGetRequest("widget_queue", url, 'json', 
		function success(data) 
		{
			$('#Rapleaf').html(getTemplate('rapleaf-profile', data))
						
		}, function error(data)
		{
			$('#Rapleaf').html("<div class='widget_content'>" + data.responseText + "</div>");
		});

}


