/**
 * ===helpscout.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API).
 */
$(function()
{
	HELPSCOUT_PLUGIN_NAME = "HelpScout";

	// Zendesk update loading image declared as global
	HELPSCOUT_UPDATE_LOAD_IMAGE = '<center><img id="tickets_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	var helpscout_widget = agile_crm_get_widget(HELPSCOUT_PLUGIN_NAME);

	console.log('In HelpScout');
	console.log(helpscout_widget);

	// ID of the Zendesk widget as global variable
	HelpScout_Plugin_Id = helpscout_widget.id;

	// Stores email of the contact as global variable
	Email = agile_crm_get_contact_property('email');
	console.log('Email: ' + Email);

	showHelpScoutMails();
});

/**
 * Show data retrieved from HelpScout in the HelpScout widget
 */
function showHelpScoutMails()
{
	// show loading until tickets are retrieved
	$('#HelpScout').html(HELPSCOUT_UPDATE_LOAD_IMAGE);

	/*
	 * Checks if contact has email, if undefined shows message in HelpScout
	 * panel
	 */
	if (!Email)
	{
		helpscoutError(HELPSCOUT_PLUGIN_NAME, "Please provide email for this contact");
		return;
	}

	// Retrieves tickets and calls method to show them in HelpScout tickets
	// panel
	getMailsFromHelpScout(function(data)
	{
		console.log("HelpScout profile : " + data);

		$('#HelpScout').html(getTemplate('helpscout-profile', data));
		// Shows ticket in HelpScout panel
		showMailsInHelpScout(data.id);
	});
}

/**
 * Initializes an AJAX queue request to retrieve HelpScout mails based on given
 * HelpScout_Plugin_Id and Email
 * 
 * <p>
 * Request is added to queue to make the requests from all the widgets
 * synchronous
 * </p>
 * 
 * @param callback
 *            Function to be executed on success
 */
function getMailsFromHelpScout(callback)
{
	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve tickets
	 */
	queueGetRequest("widget_queue", "/core/api/widgets/helpscout/get/" + HelpScout_Plugin_Id + "/" + Email, "json", function success(data)
	{
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);
	}, function error(data)
	{
		// Error message is shown
		helpscoutError(HELPSCOUT_PLUGIN_NAME, data.responseText);
	});
}

/**
 * Shows retrieved tickets in Zendesk widget tickets Panel
 * 
 * @param data
 *            List of tickets
 */
function showMailsInHelpScout(customerId)
{
	// show loading until tickets are retrieved
	$('#all_tickets_panel').html(HELPSCOUT_UPDATE_LOAD_IMAGE);
	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve tickets
	 */
	queueGetRequest("widget_queue", "/core/api/widgets/helpscout/get/" + HelpScout_Plugin_Id + "/customer/" + customerId, "json", function success(data)
	{
		// Get and fill the template with tickets
		$('#all_tickets_panel').html(getTemplate('helpscout-conversation', data));

		// Load jquery time ago function to show time ago in tickets
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago").timeago();
		});

	}, function error(data)
	{
		// Error message is shown
		helpscoutError(HELPSCOUT_PLUGIN_NAME, data.responseText);
	});

}

/**
 * Shows Zendesk error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function helpscoutError(id, message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate('helpscout-error', error_json));
}
