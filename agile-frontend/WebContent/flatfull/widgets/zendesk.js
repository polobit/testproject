/**
 * ===zendesk.js==== It is a pluginIn to be integrated with CRM, developed based
 * on the third party JavaScript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API).
 */

var ZENTickets = {};
var ZENCount = 1;
var showMoreHtmlZEN = '<div class="widget_tab_footer zen_show_more" align="center"><a class="c-p text-info" id="ZEN_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';


/**
 * Shows setup if user adds Zendesk widget for the first time or clicks on reset
 * icon on Zendesk panel in the UI
 * 
 * @param plugin_id
 *            To get the widget and save tokens in it.
 */
function setupZendeskAuth(contact_id)
{
	// Shows loading image until set up is shown
	$('#Zendesk').html(ZENDESK_UPDATE_LOAD_IMAGE);

	console.log('In Zendesk Auth');

	// Shows input fields to save the Zendesk preferences
	getTemplate('zendesk-login', {}, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		$('#Zendesk').html($(template_ui)); 
	}, "#Zendesk");

	// On click of save button, check input and save details
    $("#widgets").off('click','#save_prefs');
	$("#widgets").on('click','#save_prefs', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#zendesk_login_form")))
		{
			return;
		}
		// Saves Zendesk preferences in ClickDesk widget object
		saveZendeskPrefs(contact_id);

	});
}

/**
 * Calls method in script API (agile_widget.js) to save Zendesk preferences in
 * Zendesk widget object
 */
function saveZendeskPrefs(contact_id)
{
	// Retrieve and store the Zendesk preferences entered by the user as JSON
	var zendesk_prefs = {};
	zendesk_prefs["zendesk_username"] = $("#zendesk_username").val();
	zendesk_prefs["zendesk_password"] = $("#zendesk_password").val();
	zendesk_prefs["zendesk_url"] = $("#zendesk_url").val();

	// Saves the preferences into widget with zendesk widget name
	agile_crm_save_widget_prefs(ZENDESK_PLUGIN_NAME, JSON.stringify(zendesk_prefs), function(data)
	{
		// Retrieves and shows Zendesk tickets in the Zendesk widget UI
		showZendeskProfile(contact_id);
	});
}

/**
 * Show data retrieved from Zendesk in the Zendesk widget
 */
function showZendeskProfile(contact_id)
{
	// show loading until tickets are retrieved
	$('#Zendesk').html(ZENDESK_UPDATE_LOAD_IMAGE);

	/*
	 * Checks if contact has email, if undefined shows message in Zendesk panel
	 */
	if (!Email)
	{
		zendeskError(ZENDESK_PLUGIN_NAME, "Please provide email for this contact");
		return;
	}
	
	// Retrieves tickets and calls method to show them in Zendesk tickets panel
	getTicketsFromZendesk(function(data)
	{
		console.log("zendesk profile : " + data);

		// Shows ticket in Zendesk panel
		showTicketsInZendesk(data);

		// Registers click events in Zendesk
		registerClickEventsInZendesk();
	}, contact_id);
}

/**
 * Initializes an AJAX queue request to retrieve Zendesk tickets based on given
 * Zendesk_Plugin_Id and Email
 * 
 * <p>
 * Request is added to queue to make the requests from all the widgets
 * synchronous
 * </p>
 * 
 * @param callback
 *            Function to be executed on success
 */
function getTicketsFromZendesk(callback, contact_id)
{

	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve tickets
	 */
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/zendesk/profile/" + Zendesk_Plugin_Id + "/" + Email, "json", function success(data)
	{
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}, function error(data)
	{
		
		// Loading is removed if error occurs
		$('#tickets_load').remove();

		// Error message is shown
		zendeskError(ZENDESK_PLUGIN_NAME, data.responseText);
	});
}


function loadZENTickets(offSet){
	if(offSet == 0){

		var result = {};
		var isArray = ZENTickets.isArray;
		
		if(ZENTickets instanceof Array){
			result = ZENTickets.slice(0, 5); 
		}else{
			result = ZENTickets;
		}

		getTemplate('zendesk-ticket-stream', result, undefined, function(template_ui){
			$('#all_tickets_panel').append(template_ui);
			if(ZENTickets.length > 5 && ZENTickets instanceof Array){
				$('#all_tickets_panel').append(showMoreHtmlZEN);
			}
		});
		
		// Load jquery time ago function to show time ago in tickets
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function(template_ui)
		{
			$(".time-ago", template_ui).timeago();
		});
	}else if(offSet > 0  && (offSet + 5) < ZENTickets.length){
		var result = {};
		result = ZENTickets.slice(offSet, (offSet+5));
		console.log("xero 2nd result **** ");
		console.log(result);
		$('.zen_show_more').remove();
		$('#all_tickets_panel').append(getTemplate('zendesk-ticket-stream', result)).append(showMoreHtmlZEN);
	}else{
		var result = {};
		result = ZENTickets.slice(offSet, ZENTickets.length);
		$('.zen_show_more').remove();
		$('#all_tickets_panel').append(getTemplate('zendesk-ticket-stream', result));
	}
}

/**
 * Shows retrieved tickets in Zendesk widget tickets Panel
 * 
 * @param data
 *            List of tickets
 */
function showTicketsInZendesk(data)
{
	// Fill template with tickets and append it to Zendesk panel
	
	getTemplate('zendesk-profile', data, undefined, function(template_ui){
 		if(!template_ui){
    		return;
    	}
    	
		$('#Zendesk').html(template_ui); 

		if(data){
			try{
				ZENTickets = JSON.parse(data.all_tickets);
			}catch (err){
				ZENTickets = data.all_tickets;
			}
		}

		loadZENTickets(0);

	}, "#Zendesk");

		

	
}

/**
 * Shows more tickets in the Zendesk ticket panel
 * 
 * @param more_tickets
 *            List of tickets
 */
function showZenMoreTickets(more_tickets)
{
	// Show spinner until tickets are shown
	$('#spinner-tickets').show();

	/*
	 * If length is zero, information is shown to user and hidden after 10
	 * seconds and spinner is hidden
	 */
	if (more_tickets.length == 0)
	{
		$('#spinner-tickets').hide();
		zendeskStreamError("tickets-error-panel", 'No more tickets');
		return;
	}

	/*
	 * Get and fill the template with more tickets information, append to the
	 * ticket stream and hide the spinner
	 */
	
	getTemplate('zendesk-ticket-stream', more_tickets, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		$('#all_tickets_panel').append(template_ui);
		$('#spinner-tickets').hide();

		// Load jquery time ago function to show time ago in tickets
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", template_ui).timeago();
		});
	}, null);
}

/**
 * Shows ticket from tickets data retrieved from zendesk based on ticket id
 * 
 * @param ticket_data
 *            Data related to Ticket which is to be shown
 * @param ticket_id
 *            Id of the ticket to be shown
 */
function showTicketById(json, ticket_id)
{
	// Sets headline of modal as Ticket TicketId
	json["headline"] = "Ticket " + ticket_id;

	/*
	 * If length of description of ticket is stored as boolean to check in
	 * handle bars, if it is more than 200, scroll bar is shown for description
	 */
	json["desc_len"] = json['description'].length > 200;

	// Remove the modal if already exists
	$('#zendesk_showModal').remove();

	// Append the form into the content
	getTemplate('zendesk-ticket-show', json, undefined, function(template_ui){	
 		if(!template_ui)
    		return;

    	$('body').append(template_ui);
    	$('#zendesk_showModal').modal("show"); 
	}, null);

	// Shows the modal after filling with details
	
}

function registerClickEventsInZendesk()
{
	/*
	 * On click of update ticket link for ticket, update ticket method is called
	 */
    $("#widgets").off('click','#ticket_update');
	$("#widgets").on('click','#ticket_update', function(e)
	{
		e.preventDefault();

		// Id of the ticket is retrieved to update ticket based on id
		var ticket_id = $(this).attr('update_id');
		updateTicketInZendesk(ticket_id);
	});

	// On click of show ticket, show ticket by ticket id method is called
    $("#widgets").off('click','#ticket_show');
	$("#widgets").on('click','#ticket_show', function(e)
	{		
		e.preventDefault();

		var json = JSON.parse($(this).attr('data-attr'));

		// Id of the ticket is retrieved to show ticket based on id
		var ticket_id = $(this).attr('ticket_id');

		// Shows ticket in modal
		showTicketById(json, ticket_id);
	});

}

/**
 * Adds a ticket in Zendesk with the contact first name, last name and email
 * based on Zendesk widget id
 */
function addTicketToZendesk()
{
	/*
	 * Stores info as JSON, to send it to the modal when add ticket request is
	 * made
	 */
	var json = {};

	// Set headline of modal window as Add Ticket
	json["headline"] = "Add Ticket";

	// Information to be shown in the modal to the user
	json["info"] = "Add ticket in Zendesk";

	// Name of the contact to be added to ticket
	var name = "";
	if(agile_crm_get_contact_property('first_name')){
		name += agile_crm_get_contact_property('first_name');
	}
	if(agile_crm_get_contact_property('last_name')){
		name += agile_crm_get_contact_property('last_name');
	}
	json["name"] = name;

	// Email of the contact based on which ticket is added
	json["email"] = Email;

	// Remove the modal if already exists
	$('#zendesk_messageModal').remove();

	// Populate the modal template with the above JSON details in the form
	
	getTemplate('zendesk-message', json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		var message_form_modal = $(template_ui); 
		 // Append the form into the content
		$('#content').append(message_form_modal);

		// Shows the modal after filling with details
		$('#zendesk_messageModal').modal("show");

		/*
		 * On click of send button in the modal, calls send request method to add a
		 * ticket in Zendesk
		 */
		$('#send_request').click(function(e)
		{
			e.preventDefault();
			
			//check button disabled or not
			if ($("#send_request").attr('disabled'))
				return;
			
			// Checks whether all the input fields are filled
			if (!isValidForm($("#zendesk_messageForm")))
			{
				return;
			}

			//disabling the send request button after first click
			$("#send_request").attr("disabled", true);
			
			// Sends request to Zendesk to add ticket
			sendRequestToZendesk("/core/api/widgets/zendesk/add/" + Zendesk_Plugin_Id, "zendesk_messageForm", "zendesk_messageModal", "add-ticket-error-panel");
		});
	}, null);

		
}

/**
 * Updates the ticket in Zendesk with the specified ticket id based on plugin id
 * 
 * @param plugin_id
 *            To get the widget and save tokens in it.
 * @param ticket_id
 *            Id of the ticket to update it
 */
function updateTicketInZendesk(ticket_id)
{
	/*
	 * Stores info as JSON, to send it to the modal when update ticket request
	 * is made
	 */
	var json = {};

	// Set headline of modal window as Update Ticket
	json["headline"] = "Update Ticket";

	// Information to be shown in the modal to the user
	json["info"] = "Updates Ticket No " + ticket_id + " in Zendesk";

	// Id of the ticket to update it
	json["id"] = ticket_id;

	// Remove the modal if already exists
	$('#zendesk_messageModal').remove();

	// Populate the modal template with the above JSON details in the form
	
	getTemplate('zendesk-message', json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
    	var message_form_modal = $(template_ui);
		 // Append the form into the content
		$('#content').append(message_form_modal);

		// Shows the modal after filling with details
		$('#zendesk_messageModal').modal("show");

		/*
		 * On click of send button in the modal, calls send request method to update
		 * a ticket in Zendesk
		 */
		$('#send_request').click(function(e)
		{
			e.preventDefault();
			
			//check button disabled or not
			if ($("#send_request").attr('disabled'))
				return;
			
			// Checks whether all the input fields are filled
			if (!isValidForm($("#zendesk_messageForm")))
			{
				return;
			}
			
			//disabling the send request button after first click
			$("#send_request").attr("disabled", true);
			
			sendRequestToZendesk("/core/api/widgets/zendesk/update/" + Zendesk_Plugin_Id, "zendesk_messageForm", "zendesk_messageModal", "add-ticket-error-panel");
		});
	}, null);

	
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
function sendRequestToZendesk(url, formId, modalId, errorPanelId)
{
	/*
	 * Sends post request to given url and Calls ZendeskWidgetsAPI with Zendesk
	 * id as path parameter and form as post data
	 */
	$.post(url, $('#' + formId).serialize(), function(data)
	{
		// On success, shows the status as sent
		$('#' + modalId).find('span.save-status').html("sent");

		// Hides the modal after 2 seconds after the sent is shown
		setTimeout(function()
		{
			$('#' + modalId).modal("hide");
		}, 2000);

	}).error(function(data)
	{
		/*
		 * If error occurs modal is removed and error message is shown in
		 * Zendesk panel
		 */
		$('#' + modalId).modal("hide");
		//$('#' + modalId).remove();
		zendeskStreamError(errorPanelId, data.responseText);
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
function zendeskError(id, message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	getTemplate('zendesk-error', error_json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		 $('#' + id).html($(template_ui)); 
	}, '#' + id);
}

/**
 * Shows Zendesk error message in the div allocated with given id and fades it
 * out after 10 secs
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function zendeskStreamError(id, message)
{
	// Fill error template and show error message
	zendeskError(id, message);

	/*
	 * div allocated with the id here is hidden by default, we need to show it
	 * with the error message and fade it out after 10 secs
	 */
	$('#' + id).show();
	$('#' + id).fadeOut(10000);
}

function startZendeskWidget(contact_id){

	ZENTickets = {};
	ZENCount = 1;

	// Zendesk widget name declared as global variable
	ZENDESK_PLUGIN_NAME = "Zendesk";

	// Zendesk update loading image declared as global
	ZENDESK_UPDATE_LOAD_IMAGE = '<center><img id="tickets_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	var zendesk_widget = agile_crm_get_widget(ZENDESK_PLUGIN_NAME);

	console.log('In Zendesk');
	console.log(zendesk_widget);

	// ID of the Zendesk widget as global variable
	Zendesk_Plugin_Id = zendesk_widget.id;

	// Stores email of the contact as global variable
	Email = agile_crm_get_contact_property('email');
	console.log('Email: ' + Email);


	/*
	 * Gets Zendesk widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget, setupZendeskAuth is shown and returned
	 */
	if (zendesk_widget.prefs == undefined)
	{
		setupZendeskAuth(contact_id);
		return;
	}

	/*
	 * If Zendesk widget preferences are defined, shows tickets from Zendesk
	 * associated with current contact's email
	 */
	showZendeskProfile(contact_id);

	// On click of add ticket, add ticket method is called
    $("#widgets").off('click','#add_ticket');
	$("#widgets").on('click','#add_ticket', function(e)
	{
		e.preventDefault();
		addTicketToZendesk();
	});

	/*
	 * On mouse enter of ticket, show tab link which has a link to show detailed
	 * description of ticket and comment on it
	 */
     $("#widgets").off('mouseenter','.zendesk_ticket_hover');
	 $("#widgets").on('mouseenter','.zendesk_ticket_hover', function(e)
	{
		$(this).find('.zendesk_tab_link').show();
	});

	// On mouse leave of chat, hides tab link
    $("#widgets").off('mouseleave','.zendesk_ticket_hover');
	$("#widgets").on('mouseleave','.zendesk_ticket_hover', function(e)
	{
		$('.zendesk_tab_link').hide();
	});


	/*
	 * On click of show more in tickets panel, we splice 5 tickets from
	 * all_tickets and show every time
	 */
	 $('body').off('click', '.revoke-widget');
	 $("#widgets").off('click','#ZEN_show_more');
	 $("#widgets").on('click','#ZEN_show_more', function(e){
		e.preventDefault();
		var offSet = ZENCount * 5;
		loadZENTickets(offSet);
		++ZENCount;
	 });

}