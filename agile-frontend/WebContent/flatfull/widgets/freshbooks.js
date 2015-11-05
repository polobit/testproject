/**
 * ===freshbooks.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided. It interacts with the
 * application based on the function provided on agile_widgets.js (Third party
 * API)
 */
var FBSmails = {};
var FBSCount = 1;
var showMoreHtmlFBS = '<div class="widget_tab_footer freshbooks_show_more" align="center"><a class="c-p text-info" id="FBS_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';
var FBSclientID = "";

/**
 * Shows setup if user adds FreshBooks widget for the first time or clicks on
 * reset icon on FreshBooks panel in the UI
 */
function setUpFreshbooksAuth(contact_id)
{
	// Shows loading image until set up is shown
	$('#FreshBooks').html(FRESHBOOKS_LOGS_LOAD_IMAGE);

	// Shows input fields to save the FreshBooks preferences
	$('#FreshBooks').html(getTemplate('freshbooks-login', {}));

	// On click of save button, check input and save details
    $("#widgets").off("click", "#freshbooks_save_token");
	$("#widgets").on("click", "#freshbooks_save_token", function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#freshbooks_login_form")))
		{
			return;
		}

		// Saves FreshBooks preferences in FreshBooks widget object
		savefreshBooksPrefs(contact_id);
	});
}

/**
 * Calls method in script API (agile_widget.js) to save FreshBooks preferences
 * in FreshBooks widget object
 */
function savefreshBooksPrefs(contact_id)
{
	// Store the data given by the user as JSON
	var freshbooks_prefs = {};
	freshbooks_prefs["freshbooks_apiKey"] = $("#freshbooks_apiKey").val();
	freshbooks_prefs["freshbooks_url"] = $("#freshbooks_url").val();

	// Saves the preferences into widget with FreshBooks widget name
	agile_crm_save_widget_prefs(FRESHBOOKS_PLUGIN_NAME, JSON.stringify(freshbooks_prefs), function(data)
	{
		// Retrieves and shows FreshBooks invoices in the FreshBooks widget UI
		showFreshBooksClient(contact_id);
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
function showFreshBooksClient(contact_id)
{

	// Shows loading image until set up is shown
	$('#FreshBooks').html(FRESHBOOKS_LOGS_LOAD_IMAGE);

	/*
	 * Checks if contact has email, if undefined shows information in FreshBooks
	 * panel
	 */
	if (!Email)
	{
		freshBooksError(FRESHBOOKS_PLUGIN_NAME, "Please provide email for this contact");
		return;
	}

	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve clients
	 */
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/freshbooks/clients/" + FreshBooks_Plugin_id + "/" + Email, 'json', function success(data)
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
			FBSclientID = data.client[0].client_id;
		else
			FBSclientID = data.client.client_id;

		getInvoicesOfClient(FBSclientID , 0)

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


function loadFBSInvoices(client_id, callback){

	/*
	 * send GET request to the URL to retrieve invoices based on widget id and
	 * client id as path parameters
	 */
	$.get("/core/api/widgets/freshbooks/invoices/" + FreshBooks_Plugin_id + "/" + client_id, function(data)
	{
		console.log(" freshbooks widget **** ");
		console.log(data);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}, 'json').error(function(data)
	{
		// Show FreshBooks error in FreshBooks invoice panel
		freshBooksError("freshbooks_invoice_panel", data.responseText);
	});

} 
/**
 * Retrieves invoices of client base on widget id and client id
 * 
 * @param client_id
 *            id of client in FreshBooks
 */
function getInvoicesOfClient(client_id, offSet)
{
	if(offSet == 0){
		FBSmails = {};
		FBSCount = 1;
		loadFBSInvoices(client_id, function(data){
			console.log("widgets **** freshbooks");
			console.log(data);

			var result = {};

			if(data.total > 0){
				if(data.invoice){
					FBSmails.invoice = data.invoice;
					result.invoice = FBSmails.invoice.slice(0, 5);	
				}
				FBSmails.total = data.total;
			}

			result.total = data.total;

			// Fill FreshBooks invoice template with invoice of client
			var freshbooks_invoice_template = $(getTemplate('freshbooks-invoice', result));

			// Show invoices in FreshBooks widget panel
			$('#freshbooks_invoice_panel').append(freshbooks_invoice_template);
			// Load jquery time ago function to show time ago in invoices
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago", freshbooks_invoice_template).timeago();
			});

			$('#freshbooks_invoice_load').remove();

			if(result.total > 5){
				$('#freshbooks_invoice_panel').append(showMoreHtmlFBS);
			}
		});
	}else if(offSet > 0  && (offSet+5) < FBSmails.total){
		var result = {};
		result.invoice = FBSmails.invoice.slice(offSet, (offSet+5));
		result.total = FBSmails.total;
		$('.freshbooks_show_more').remove();
		$('#freshbooks_invoice_panel').apped(getTemplate('freshbooks-invoice', result));
		$('#freshbooks_invoice_panel').append(showMoreHtmlFBS);
	}else{
		var result = {};
		result.invoice = FBSmails.invoice.slice(offSet, FBSmails.total);
		result.total = FBSmails.total;
		$('.freshbooks_show_more').remove();
		$('#freshbooks_invoice_panel').append(getTemplate('freshbooks-invoice', result));
	}
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
function addClientToFreshBooks(contact_id, first_name, last_name, email)
{
	/*
	 * send GET request to the URL to add client in FreshBooks based on widget
	 * id, first name, last name and email as path parameters
	 */
	
	var company = agile_crm_get_contact_property("company");
	
	var requestURL = "/core/api/widgets/freshbooks/add/client/" + FreshBooks_Plugin_id + "/" + first_name + "/" + last_name + "/" + Email;
		requestURL += "/" + company;
	
	$.get(requestURL, function(data)
	{
		console.log('In FreshBooks add client ');
		console.log(data);

		/*
		 * Response from freshBooks will be sent as "ok" if client is added,
		 * check the response and show added client in FreshBooks widget panel
		 */
		if (data.status == "ok")
			showFreshBooksClient(contact_id);

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

function startFreshBooksWidget(contact_id){

	FBSmails = {};
	FBSCount = 1;

	console.log('freshbooks loaded ********** ');
	// FreshBooks widget name as a global variable
	FRESHBOOKS_PLUGIN_NAME = "FreshBooks";

	// FreshBooks update loading image declared as global
	FRESHBOOKS_LOGS_LOAD_IMAGE = '<center><img id="freshbooks_invoice_load" src="img/ajax-loader-cursor.gif" style="margin-top: 14px;margin-bottom: 10px;"></img></center>';

	// Retrieves widget which is fetched using script API
	var freshbooks_widget = agile_crm_get_widget(FRESHBOOKS_PLUGIN_NAME);

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
		setUpFreshbooksAuth(contact_id);
		return;
	}

	/*
	 * If FreshBooks widget preferences are defined, shows invoices from
	 * FreshBooks associated with current contact's email
	 */
	showFreshBooksClient(contact_id);

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
	$("#widgets").off("click", "#freshbooks_add_client");
	$("#widgets").on("click", "#freshbooks_add_client", function(e)
	{
		e.preventDefault();
		addClientToFreshBooks(contact_id, first_name, last_name, Email);
	});

	
	/*
	 * On click of add client button in FreshBooks, calls method to add a client
	 * in FreshBooks with contact's first name, last name and email
	 */
	$("#widgets").off("click", "#FBS_show_more");
	$("#widgets").on("click", "#FBS_show_more", function(e)
	{
		e.preventDefault();
		var offSet = FBSCount * 5;
		getInvoicesOfClient(FBSclientID, offSet);
		++FBSCount;
		
	});

}
