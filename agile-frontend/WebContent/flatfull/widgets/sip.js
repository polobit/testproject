/*
 * === sip.js ==== It is a pluginIn to be integrated with CRM.
 * It interacts with the
 * application based on the function provided on agile_widgets.js(Third party API)
 */

$(function()
{
	console.log("In sip.js");

	// sip widget name declared as global variable
	SIP_PLUGIN_NAME = "Sip";

	// sip update loading image declared as global
	SIP_UPDATE_LOAD_IMAGE = '<center><img id="sip_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	SIP_WIDGET = agile_crm_get_widget(SIP_PLUGIN_NAME);

	console.log("SIP_WIDGET");
	console.log(SIP_WIDGET);

	// ID of the sip widget as global variable
	Sip_Plugin_Id = SIP_WIDGET.id;

	console.log(Sip_Plugin_Id);

	/*
	 * Gets sip widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget, setupsipAuth is shown and returned
	 */

	if (SIP_WIDGET.prefs == undefined)
	{
		// setupSipAuth();
		return;
	}

	/*
	 * If sip widget preferences are defined, shows tickets from sip associated
	 * with current contact's email
	 */
	// showSipProfile();

});

/**
 * Shows setup if user adds Sip widget for the first time or clicks on reset
 * icon on Sip panel in the UI
 * 
 * @param plugin_id
 *            To get the widget and save tokens in it.
 * 
 */
function setupSipAuth()
{
	/*
	 * // Shows loading image until set up is shown
	 * $('#Sip').html(SIP_UPDATE_LOAD_IMAGE);
	 * 
	 * console.log('In setupSipAuth');
	 *  // Shows input fields to save the Sip preferences
	 * $('#Sip').html(getTemplate('sip-login', {}));
	 *  // On click of save button, check input and save details
	 * $('#save_prefs').die().live('click', function(e) { e.preventDefault();
	 *  // Checks whether all input fields are given if
	 * (!isValidForm($("#sip_login_form"))) { return; } // Saves Sip preferences
	 * in ClickDesk widget object saveSipPrefs();
	 */

	//});
}

/**
 * Calls method in script API (agile_widget.js) to save sip preferences in Sip
 * widget object
 */
function saveSipPrefs()
{
	/*
	 * console.log("In saveSipPrefs.");
	 *  // Retrieve and store the Sip preferences entered by the user as JSON
	 * var sip_prefs = {}; sip_prefs["sip_username"] = $("#sip_username").val();
	 * sip_prefs["sip_privateid"] = $("#sip_privateid").val();
	 * sip_prefs["sip_realm"] = $("#sip_realm").val(); sip_prefs["sip_password"] =
	 * $("#sip_password").val();
	 * 
	 * sip_prefs["sip_publicid"] = "sip:" + $("#sip_privateid").val() + "@" +
	 * $("#sip_realm").val();
	 * 
	 * if ($('#sip_wsenable').is(':checked')) sip_prefs["sip_wsenable"] =
	 * "true"; else sip_prefs["sip_wsenable"] = "false";
	 * 
	 * console.log(sip_prefs);
	 *  // Saves the preferences into widget with sip widget name
	 * agile_crm_save_widget_prefs(SIP_PLUGIN_NAME, JSON.stringify(sip_prefs),
	 * function(data) { // Retrieves and shows sip tickets in the sip widget UI
	 * showSipProfile(); });
	 */

}

/**
 * Show data retrieved from Sip in the Sip widget
 */
function showSipProfile()
{
	/*
	 * // show loading until tickets are retrieved
	 * $('#Sip').html(SIP_UPDATE_LOAD_IMAGE);
	 * 
	 * console.log("In showSipProfile.");
	 * 
	 * if (document.readyState === "complete") { console.log(SIP_WIDGET);
	 * 
	 * console.log(Sip_Start); console.log(Sip_Stack);
	 * console.log(Sip_Register_Session);
	 * 
	 * var data = eval('(' + SIP_WIDGET.prefs + ')');
	 * 
	 * if (Sip_Stack != undefined && Sip_Register_Session != undefined &&
	 * Sip_Start == true) { data["msg"] = "You can make and receive calls with
	 * SIP."; $(".contact-make-sip-call").show(); $(".make-call").show();
	 *  // Contact with tel: is hidden $(".contact-make-call").hide(); } else { //
	 * Register on Sip. sipStart();
	 * 
	 * data["msg"] = "Need to register on SIP.";
	 * $(".contact-make-sip-call").hide(); $(".make-call").hide();
	 *  // Contact with tel: is shown $(".contact-make-call").show(); }
	 * console.log(data);
	 *  // Fill template with data and append it to Sip panel
	 * $('#Sip').html(getTemplate('sip-profile', data)); }
	 */
}
