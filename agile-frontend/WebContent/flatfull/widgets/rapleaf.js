/**
 * ===rapleaf.js==== It is a pluginIn to be integrated with CRM, developed based
 * on the third party JavaScript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API). Rapleaf
 * fetches information based on the email
 */

/**
 * Shows setup if user adds Rapleaf widget for the first time or clicks on reset
 * icon on Rapleaf panel in the UI, to set up connection to Rapleaf account.
 */
function setupRapleafAuth(contact_id)
{
	/*
	 * Shows an input filed to save Rapleaf preferences (API key provided by
	 * Rapleaf)
	 */
	$('#Rapleaf').html(getTemplate('rapleaf-login', ""));

	console.log('In Rapleaf Auth');

	// Saves the API key
    $("#widgets").off("click", '#save_api_key');
	$("#widgets").on("click", '#save_api_key', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#rapleaf_login_form")))
		{
			return;
		}

		// Saves Rapleaf preferences in Rapleaf widget object
		saveRaplefPrefs(contact_id);
	});
}

/**
 * Calls method in script API (agile_widget.js) to save Rapleaf preferences in
 * Rapleaf widget object
 */
function saveRaplefPrefs(contact_id)
{
	// Retrieve and store the Rapleaf API key entered by the user
	var Rapleaf_prefs = {};
	Rapleaf_prefs["rapleaf_api_key"] = $("#rapleaf_api_key").val();

	// Saves the preferences into widget with Rapleaf widget name
	agile_crm_save_widget_prefs(RAPLEAF_PLUGIN_NAME, JSON.stringify(Rapleaf_prefs), function(data)
	{
		// Retrieves and shows Rapleaf details in the Rapleaf widget UI
		showRapleafDetails(contact_id);
	});
}

/**
 * Shows details of contact from Rapleaf in Rapleaf widget panel. Initializes an
 * AJAX queue request to retrieve Rapleaf details based on given
 * ClickDesk_Plugin_Id and Email
 * 
 * <p>
 * Request is added to queue to make the requests from all the widgets
 * synchronous
 * </p>
 */
function showRapleafDetails(contact_id)
{
	// Shows loading, until info is fetched
	$('#Rapleaf').html(RAPLEAF_LOADING_IMAGE);

	/*
	 * Checks if contact has email, if undefined shows message in Rapleaf widget
	 * panel
	 */
	if (!Email)
	{
		rapleafError(RAPLEAF_PLUGIN_NAME, "Please provide email for this contact");
		return;
	}

	// URL to connect with RapleafWidgetsAPI
	var url = "core/api/widgets/rapleaf/" + Rapleaf_Plugin_Id + "/" + Email;

	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve details (age, gender.. etc)
	 */
	queueGetRequest("widget_queue_"+contact_id, url, 'json', function success(data)
	{
		// Get and fill the template with data and show it in Rapleaf panel
		$('#Rapleaf').html(getTemplate('rapleaf-profile', data))

	}, function error(data)
	{
		// Show error message in Rapleaf widget
		rapleafError(RAPLEAF_PLUGIN_NAME, data.responseText);
	});

}

/**
 * Shows Rapleaf error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function rapleafError(id, message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate('rapleaf-error', error_json));
}

function startRapleafWidget(contact_id){
	// Rapleaf widget name declared as global variable
	RAPLEAF_PLUGIN_NAME = "Rapleaf";

	// Rapleaf loading image declared as global
	RAPLEAF_LOADING_IMAGE = '<div id="rap_info_load"><center><img  src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center></div>';

	// Retrieves widget which is fetched using script API
	var rapleaf_widget = agile_crm_get_widget(RAPLEAF_PLUGIN_NAME);

	console.log('In Rapleaf');
	console.log(rapleaf_widget);

	// ID of the Rapleaf widget as global variable
	Rapleaf_Plugin_Id = rapleaf_widget.id;

	// Stores email of the contact as global variable
	Email = agile_crm_get_contact_property('email');
	console.log('Email: ' + Email);


	/*
	 * Gets Rapleaf widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget, setupRapleafAuth is shown and returned
	 */
	if (rapleaf_widget.prefs == undefined)
	{
		setupRapleafAuth(contact_id);
		return;
	}

	/*
	 * If Rapleaf widget preferences are defined, shows details from Rapleaf
	 * associated with current contact's email
	 */
	showRapleafDetails(contact_id);

}