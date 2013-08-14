/**
 * ===freshbooks.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided. It interacts with the
 * application based on the function provided on agile_widgets.js (Third party
 * API)
 */
$(function()
{
	// FreshBooks widget name as a global variable
	FRESHBOOKS_PLUGIN_NAME = "FreshBooks";

	// FreshBooks update loading image declared as global
	FRESHBOOKS_LOGS_LOAD_IMAGE = '<center><img id="freshbooks_invoice_load" src="img/ajax-loader-cursor.gif" style="margin-top: 14px;margin-bottom: 10px;"></img></center>';

	// Retrieves widget which is fetched using script API
	var freshbooks_widget = agile_crm_get_plugin(FRESHBOOKS_PLUGIN_NAME);

	console.log('In FreshBooks');
	console.log(freshbooks_widget);

	// ID of the FreshBooks widget as global variable
	FreshBooks_Plugin_id = freshbooks_widget.id;

	// Stores email of the contact as global variable
	Email = agile_crm_get_contact_property('email');
	console.log('Email: ' + Email);

	/*
	 * Gets FreshBooks widget preferences, required to check whether to show
	 * setup button or to fetch details. If undefined - considering first time
	 * usage of widget, setUpFreshbooksAuth is shown and returned
	 */
	if (freshbooks_widget.prefs == undefined)
	{
		setUpFreshbooksAuth();
		return;
	}

	/*
	 * Checks if contact has email, if undefined shows message in FreshBooks
	 * panel
	 */
	if (!Email)
	{
		freshBooksError(FRESHBOOKS_PLUGIN_NAME, "No email is associated with this contact");
		return;
	}

	/*
	 * If FreshBooks widget preferences are defined, shows invoices from
	 * FreshBooks associated with current contact's email
	 */
	showFreshBooksClient();

	// Register click events
	/*
	 * On click of reset button of FreshBooks widget, widget preferences are
	 * deleted and initial set up is called
	 */
	$('#FreshBooks_plugin_delete').die().live('click', function(e)
	{
		e.preventDefault();

		// preferences are saved as undefined and set up is shown
		agile_crm_save_widget_prefs(FRESHBOOKS_PLUGIN_NAME, undefined, function(data)
		{
			setUpFreshbooksAuth();
		});
	});

	/*
	 * Retrieve first name and last name of contact, to add contact as client in
	 * FreshBooks
	 */
	var first_name = agile_crm_get_contact_property("first_name");
	var last_name = agile_crm_get_contact_property("last_name");

	/*
	 * On click of add client button in FreshBooks, calls method to add a client
	 * in FreshBooks with contact's first name, last name and email
	 */
	$('#freshbooks_add_client').die().live('click', function(e)
	{
		e.preventDefault();
		addClientToFreshBooks(first_name, last_name, Email);
	});

});

/**
 * Shows setup if user adds FreshBooks widget for the first time or clicks on
 * reset icon on FreshBooks panel in the UI
 */
function setUpFreshbooksAuth()
{
	// Shows loading image until set up is shown
	$('#FreshBooks').html(FRESHBOOKS_LOGS_LOAD_IMAGE);

	// Shows input fields to save the FreshBooks preferences
	$('#FreshBooks').html(getTemplate('freshbooks-login', {}));

	// On click of save button, check input and save details
	$('#freshbooks_save_token').die().live('click', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#freshbooks_login_form")))
		{
			return;
		}

		// Saves FreshBooks preferences in FreshBooks widget object
		savefreshBooksPrefs();
	});
}

/**
 * Calls method in script API (agile_widget.js) to save FreshBooks preferences
 * in FreshBooks widget object
 */
function savefreshBooksPrefs()
{
	// Store the data given by the user as JSON
	var freshbooks_prefs = {};
	freshbooks_prefs["freshbooks_apiKey"] = $("#freshbooks_apikey").val();
	freshbooks_prefs["freshbooks_url"] = $("#freshbooks_url").val();

	// Saves the preferences into widget with FreshBooks widget name
	agile_crm_save_widget_prefs(FRESHBOOKS_PLUGIN_NAME, JSON.stringify(freshbooks_prefs), function(data)
	{
		/*
		 * Checks if contact has email, if undefined shows information in
		 * FreshBooks panel
		 */
		if (!Email)
		{
			freshBooksError(FRESHBOOKS_PLUGIN_NAME, "No email is associated with this contact");
			return;
		}

		// Retrieves and shows FreshBooks invoices in the FreshBooks widget UI
		showFreshBooksClient();
	});
}

/**
 * Initializes an AJAX queue request to retrieve FreshBooks client details and
 * invoices of client based on given FreshBooks_Plugin_id and Email
 * 
 * <p>
 * Request is added to queue to make the requests from all the widgets
 * synchronous
 * </p>
 */
function showFreshBooksClient()
{
	// Shows loading image until set up is shown
	$('#FreshBooks').html(FRESHBOOKS_LOGS_LOAD_IMAGE);

	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve clients
	 */
	queueGetRequest("widget_queue", "/core/api/widgets/freshbooks/clients/" + FreshBooks_Plugin_id + "/" + Email, 'json', function success(data)
	{
		console.log('In FreshBooks clients');
		console.log(data);

		// If data is not defined return
		if (!data)
			return;

		// Fill FreshBooks widget template with FreshBooks clients data
		$('#FreshBooks').html(getTemplate('freshbooks-profile', data));

		// If no clients available, return
		if (!data.client)
			return;

		/*
		 * If clients exists, retrieve invoices relate to client. If more than
		 * one client exists with same email, we get JSONArray of clients, we
		 * take first client and retrieve invoices for its client id, else we
		 * get JSONObject of client
		 */
		if (isArray(data.client))
			getInvoicesOfClient(data.client[0].client_id);
		else
			getInvoicesOfClient(data.client.client_id);

	}, function error(data)
	{
		console.log("In FreshBooks clients error ");
		console.log(data);

		// Remove loading on error
		$('#freshbooks_invoice_load').remove();

		// Show FreshBooks error in FreshBooks Widget panel
		freshBooksError("FreshBooks", data.responseText);
	});
}

/**
 * Retrieves invoices of client base on widget id and client id
 * 
 * @param client_id
 *            id of client in FreshBooks
 */
function getInvoicesOfClient(client_id)
{
	/*
	 * send GET request to the URL to retrieve invoices based on widget id and
	 * client id as path parameters
	 */
	$.get("/core/api/widgets/freshbooks/invoices/" + FreshBooks_Plugin_id + "/" + client_id, function(data)
	{
		// Fill FreshBooks invoice template with invoice of client
		var freshbooks_invoice_template = $(getTemplate('freshbooks-invoice', data));

		// Load jquery time ago function to show time ago in invoices
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", freshbooks_invoice_template).timeago();
		});

		// Show invoices in FreshBooks widget panel
		$('#freshbooks_invoice_panel').html(freshbooks_invoice_template);

	}, 'json').error(function(data)
	{
		// Show FreshBooks error in FreshBooks invoice panel
		freshBooksError("freshbooks_invoice_panel", data.responseText);
	});
}

/**
 * Adds a client in FreshBooks account for the current contact with first name,
 * last name and email
 * 
 * @param first_name
 *            First name of contact
 * @param last_name
 *            Last name of contact
 */
function addClientToFreshBooks(first_name, last_name)
{
	/*
	 * send GET request to the URL to add client in FreshBooks based on widget
	 * id, first name, last name and email as path parameters
	 */
	$.get("/core/api/widgets/freshbooks/add/client/" + FreshBooks_Plugin_id + "/" + first_name + "/" + last_name + "/" + Email, function(data)
	{
		console.log('In FreshBooks add client ');
		console.log(data);

		/*
		 * Response from freshBooks will be sent as "ok" if client is added,
		 * check the response and show added client in FreshBooks widget panel
		 */
		if (data.status == "ok")
			showFreshBooksClient();

	}, 'json').error(function(data)
	{
		// Show FreshBooks error in FreshBooks invoice panel
		freshBooksError("FreshBooks", data.responseText);
	});

}

/**
 * Shows FreshBooks error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function freshBooksError(id, message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate('freshbooks-error', error_json));
}
