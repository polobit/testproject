/**
 * ===helpscout.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API).
 */

var helpscoutmails = [];
var showMoreCount = 1;
var showMoreHtml = '<div class="widget_tab_footer helpscout_show_more" align="center"><a class="c-p text-info" id="help_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';

/**
 * Show data retrieved from HelpScout in the HelpScout widget
 */
function showHelpScoutMails(contact_id)
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
		// Shows ticket in HelpScout panel
		if(data.hasOwnProperty("message"))
		{	
			helpscoutError(HELPSCOUT_PLUGIN_NAME, data.message);
		} 
		else 
		{
			$('#HelpScout').html(getTemplate('helpscout-profile', data));
			customerId = data.id;
			showMailsInHelpScout(data.id, contact_id, 0);
		}
		
	}, contact_id);
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
function getMailsFromHelpScout(callback, contact_id)
{
	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve tickets
	 */
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/helpscout/get/" + HelpScout_Plugin_Id + "/" + Email, "json", function success(data)
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
 * Shows retrieved tickets in HelpScout widget Conversations Panel
 * 
 * @param data
 *            List of tickets
 */
function showMailsInHelpScout(customerId, contact_id, offSet)
{
	if(offSet == 0){		
		loadTickets(customerId, contact_id, function(data){			
			if(data.mailbox){
				var obj = data.mailbox;
				$.each(obj, function( key, value ) {
					var arrayList = obj[key].conversations;
					$.each(arrayList, function( index, val ) {
						helpscoutmails.push(arrayList[index]);
				    });
				});
			}

			var result = helpscoutmails.slice(0, 5);
			// Get and fill the template with tickets
			$('#all_conv_panel').html(getTemplate('helpscout-conversation', result));

			if(helpscoutmails.length > 5){			
				$('#all_conv_panel').append(showMoreHtml);
			}

			// Load jquery time ago function to show time ago in tickets
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago").timeago();
			});
		});
	}else if(offSet > 0  && (offSet+5) < helpscoutmails.length){
		var result = helpscoutmails.slice(offSet, (offSet+5));
		$('.helpscout_show_more').remove();
		$('#all_conv_panel').apped(getTemplate('helpscout-conversation', result));
		$('#all_conv_panel').append(showMoreHtml);
	}else {
		var result = helpscoutmails.slice(offSet, helpscoutmails.length);
		$('.helpscout_show_more').remove();
		$('#all_conv_panel').append(getTemplate('helpscout-conversation', result));
	}
}

function loadTickets(customerId, contact_id, callback){

	// show loading until tickets are retrieved
	$('#all_conv_panel').html(HELPSCOUT_UPDATE_LOAD_IMAGE);
	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve tickets
	 */
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/helpscout/get/" + HelpScout_Plugin_Id + "/customer/" + customerId, "json", function success(data)
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

function addTicketToHelpScout(contact_id)
{
	$('#add_conv').toggle();
	$('#helpscout_loading').toggle();
	/*
	 * Stores info as JSON, to send it to the modal when add ticket request is
	 * made
	 */
	var json = {};

	// Set headline of modal window as Add Ticket
	json["headline"] = "Add Conversation to HelpScout";

	// Information to be shown in the modal to the user
	json["info"] = "Add Conversation in HelpScout";

	// Name of the contact to be added to ticket
	json["customerId"] = customerId;

	// Email of the contact based on which ticket is added
	json["email"] = Email;

	// Remove the modal if already exists
	$('#helpscout_messageModal').remove();

	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/helpscout/get/createform/" + HelpScout_Plugin_Id, "json", function success(data)
	{
		if(data.hasOwnProperty("mailboxes"))
		{
			json["mailboxes"] = data.mailboxes;
			
			json["assignees"] = data.assignees;
			
			console.log(json);
			// Populate the modal template with the above JSON details in the form
			var message_form_modal = getTemplate("helpscout-message", json);

			// Append the form into the content
			$('#content').append(message_form_modal);
			
			// Shows the modal after filling with details
			$('#helpscout_messageModal').modal("show");

			// To show the radio button (for type) as buttons with toggle state.
            $("#helpscout_messageModal").off("click", "#helpscout_messageModal input[type='radio']");
			$("#helpscout_messageModal").on("click", "#helpscout_messageModal input[type='radio']", function(e)
					{	
						$('#helpscout_messageModal label.btn').toggleClass("active");
					});
			
			$('#add_conv').toggle();
			$('#helpscout_loading').toggle();

			/*
			 * On click of send button in the modal, calls send request method to add a
			 * Conversation in HelpScout.
			 */
		    $("#helpscout_messageModal").off("click", "#helpscout_send_request");
			$("#helpscout_messageModal").on("click", "#helpscout_send_request", function(e)
			{
				e.preventDefault();
				console.log("subbmitting the HelpScout form");
				// Checks whether all the input fields are filled
				if (!isValidForm($("#helpscout_messageForm")))
				{
					return;
				}

				var currentUserID = CURRENT_DOMAIN_USER.id;
				// Sends request to HelpScout to create conversation
				sendRequestToHelpScout("/core/api/widgets/helpscout/add/" + HelpScout_Plugin_Id, "helpscout_messageForm", "helpscout_messageModal",
						"add-conv-error-panel", currentUserID);
			});
		}

	}, function error(data)
	{
		$('#add_conv').toggle();
		$('#helpscout_loading').hide();
		$('#helpscout_error').show();
		setTimeout(function()
		{
			$('#helpscout_error').hide();
		}, 2000);
	});
}

/**
 * Sends post request to the given URL with the form data from form id and show
 * the sent status in modal
 * 
 * @param url
 * @param formId
 *            form data to be sent to add ticket
 * @param modalId
 *            modal on which sent status is shown and hidden
 * @param errorPanelId
 *            Error div id where error is shown
 */
function sendRequestToHelpScout(url, formId, modalId, errorPanelId, contact_id)
{
	/*
	 * Sends post request to given url and Calls HelpScoutWidgetsAPI with
	 * HelpScout id as path parameter and form as post data
	 */
	$.post(url, $('#' + formId).serialize(), function(data)
	{
		// On success, shows the status as sent
		$('#' + modalId).find('span.save-status').html("sent");

		// Hides the modal after 2 seconds after the sent is shown and
		// update the conversation Slist in the Widget.
		setTimeout(function()
		{
			$('#' + modalId).modal("hide");
			showMailsInHelpScout(customerId, contact_id, 0);
		}, 2000);

	}).error(function(data)
	{
		/*
		 * If error occurs modal is removed and error message is shown in
		 * HelpScout panel
		 */
		$('#' + modalId).remove();
		helpscoutStreamError(errorPanelId, data.responseText);
	});
}

/**
 * Shows HelpScout error message in the div allocated with given id
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

/**
 * Shows HelpScout error message in the div allocated with given id and fades it
 * out after 10 secs
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function helpscoutStreamError(id, message)
{
	// Fill error template and show error message
	helpscoutError(id, message);

	/*
	 * div allocated with the id here is hidden by default, we need to show it
	 * with the error message and fade it out after 10 secs
	 */
	$('#' + id).show();
	$('#' + id).fadeOut(10000);
}

function startHelpScoutWidget(contact_id){

	HELPSCOUT_PLUGIN_NAME = "HelpScout";

	helpscoutmails = [];

	// HelpScout update loading image declared as global
	HELPSCOUT_UPDATE_LOAD_IMAGE = '<center><img id="conv_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	var helpscout_widget = agile_crm_get_widget(HELPSCOUT_PLUGIN_NAME);

	console.log('In HelpScout');
	console.log(helpscout_widget);

	// ID of the HelpScout widget as global variable
	HelpScout_Plugin_Id = helpscout_widget.id;

	// Stores email of the contact as global variable
	Email = agile_crm_get_contact_property('email');
	console.log('Email: ' + Email);
	customerId = 0;
	showHelpScoutMails(contact_id);

	// On click of add ticket, add ticket method is called
    $("#widgets").off("click", "#add_conv");
	$("#widgets").on("click", "#add_conv", function(e){
		e.preventDefault();
		addTicketToHelpScout(contact_id);
	});

    $("#widgets").off("click", "#help_show_more");
	$("#widgets").on("click", "#help_show_more", function(e){
		e.preventDefault();
		var offSet = showMoreCount * 5;
		showMailsInHelpScout(customerId, contact_id, offSet);
		++showMoreCount;
	});
}