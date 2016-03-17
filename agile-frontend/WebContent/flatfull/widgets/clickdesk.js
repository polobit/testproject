/**
 * ===clickdesk.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided. It interacts with the
 * application based on the function provided on agile_widgets.js (Third party
 * API)
 */


/**
 * Shows setup if user adds ClickDesk widget for the first time or clicks on
 * reset icon on ClickDesk panel in the UI
 */
function setupClickDeskAuth()
{
	// Shows loading image until set up is shown
	$('#ClickDesk').html(CLICKDESK_UPDATE_LOAD_IMAGE);

	console.log('In ClickDesk Auth');

	getTemplate('clickdesk-login', {}, undefined, function(template_ui){
		if(!template_ui)
			  return;

		// Shows input fields to save the ClickDesk preferences
		$('#ClickDesk').html($(template_ui));

		// On click of save button, check input and save details
		$("body #save_clickdesk_prefs").off("click");
		$("body").on("click", "#save_clickdesk_prefs", function(e)
		{
			e.preventDefault();

			// Checks whether all input fields are given
			if (!isValidForm($("#clickdesk_login_form")))
				return;

			// Saves ClickDesk preferences in ClickDesk widget object
			saveClickDeskPrefs();
		});

	}, "#ClickDesk");

	
}

/**
 * Calls method in script API (agile_widget.js) to save ClickDesk preferences in
 * ClickDesk widget object
 */
function saveClickDeskPrefs()
{
	// Retrieve and store the ClickDesk preferences entered by the user as JSON
	var ClickDesk_prefs = {};
	ClickDesk_prefs["clickdesk_username"] = $("#clickdesk_username").val();
	ClickDesk_prefs["clickdesk_api_key"] = $("#clickdesk_api_key").val();

	// Saves the preferences into widget with ClickDesk widget name
	agile_crm_save_widget_prefs(CLICKDESK_PLUGIN_NAME, JSON.stringify(ClickDesk_prefs), function(data)
	{
		// Retrieves and shows ClickDesk chats in the ClickDesk widget UI
		showClickDeskProfile();
	});
}

/**
 * Show data retrieved from ClickDesk in the ClickDesk widget
 */
function showClickDeskProfile(contact_id)
{
	// show loading until chats are retrieved
	$('#ClickDesk').html(CLICKDESK_UPDATE_LOAD_IMAGE);

	/*
	 * Checks if contact has email, if undefined shows message in ClickDesk
	 * panel
	 */
	if (!Email)
	{
		clickDeskError(CLICKDESK_PLUGIN_NAME, "Please provide email for this contact");
		return;
	}

	// Retrieves chats and calls method to show them in chats panel
	getChats(contact_id, function(data)
	{
		showChats(data);
	});

	// boolean which stores information whether tickets tab is clicked
	Tickets_clicked = false;

	/*
	 * On click of tickets tab in ClickDesk profile, retrieve tickets from
	 * ClickDesk and show in the ClickDesk tickets panel
	 */
    $("body").off("click", "#clickdesk_tickets");
	$("body").on("click", "#clickdesk_tickets", function(e)
	{
		e.preventDefault();

		/*
		 * If tickets tab is clicked once, it means we have retrieved tickets.
		 * We show them on second click, instead of retrieving every time
		 */
		if (Tickets_clicked)
			return;

		// Retrieve tickets from ClickDesk and show in tickets panel
		getClickDeskTickets(0, function(data)
		{
			showClickDeskTickets(data);
		});

		// set it to true on first click
		Tickets_clicked = true;
	});
}

/**
 * Initializes an AJAX queue request to retrieve clickDesk chats based on given
 * ClickDesk_Plugin_Id and Email
 * 
 * <p>
 * Request is added to queue to make the requests from all the widgets
 * synchronous
 * </p>
 */
function getChats(contact_id, callback)
{
	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve chats
	 */
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/clickdesk/chats/" + ClickDesk_Plugin_Id + "/" + Email + "/0", "json", function success(data)
	{
		// If data is not defined return
		if (!data)
			return;

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

		// Register click events
		registerClickEventsInChat(data);

	}, function error(data)
	{
		// Remove loading on error
		$('#chats_load').remove();

		// Show error message in ClickDesk widget
		clickDeskError("ClickDesk", data.responseText);
	});
}

/**
 * Appends data to the ClickDesk template and shows chats in the ClickDesk
 * widget UI
 * 
 * @param data
 *            Data required to show in ClcikDesk widget
 */
function showChats(data)
{

	getTemplate('clickdesk-profile', data, undefined, function(template_ui){
		if(!template_ui)
			  return;

		// Fill template with chats and append it to ClickDesk panel
		$('#ClickDesk').html($(template_ui));

		/*
		 * If chats array length is zero, show information in the chats panel and
		 * return, else show chats in chats panel
		 */
		if (data.length == 0)
		{
			$('#clickdesk_chats_panel').html('<li class="list-group-item r-none b-l-none b-r-none">No chats</li>');
			return;
		}else if(data.length == 5){
			$('.click-chat-footer').removeClass('hide');
		}

		// Fills chat template with chats and shows chat in chat panel
		getTemplate('clickdesk-chat-stream', data, undefined, function(template_ui1){
	 		if(!template_ui1)
	    		return;
			$('#clickdesk_chats_panel').html($(template_ui1)); 
			// Load jquery time ago function to show time ago in chats
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago", $('#clickdesk_chats_panel')).timeago();
			});
		}, "#clickdesk_chats_panel");


			

		
	}, "#ClickDesk");
}

/**
 * Registers click events in ClickDesk chat panel
 */
function registerClickEventsInChat(chats_data)
{
	/*
	 * On click of show chat, retrieve chat data appended to the chat element
	 * clicked and show it in modal
	 */
    $("body").off("click", "#clickdesk_chat_show");
	$("body").on("click", "#clickdesk_chat_show", function(e)
	{
		e.preventDefault();

		// retrieve appended data on element and parse it as JSON
		var chat_json = JSON.parse($(this).attr('data-attr'));

		// Show modal with chat data
		showChatModal(chat_json);
	});

	/*
	 * On click of show more link, retrieve more chats from ClickDesk if exists
	 * and shows it in the ClickDesk panel
	 */
    $("body").off("click", "#more_chats_link");
	$("body").on("click", "#more_chats_link", function(e)
	{
		e.preventDefault();

		/*
		 * If initial chats retrieved are less than 5, we don't have to retrieve
		 * chats on click of more chats and show information "no more chats"
		 */
		if (!chats_data.length >= 5)
		{
			clickDeskStreamError("clickdesk-chats-error-panel", 'No more chats');
			return;
		}

		// Get length of chats panel to set offset
		var offset = $('#chats ul li').length;
		console.log("offset in more chats: " + offset);

		// Retrieve more chats from ClickDesk, append and show in chats
		// panel
		getMoreChats(offset, function(data)
		{
			showMoreChats(data);
		});
	});
}

/**
 * Shows chat information in a modal
 * 
 * @param data
 *            chat data
 */
function showChatModal(data)
{
	// Remove the modal if already exists
	$('#clickdesk_chat_showModal').remove();

	getTemplate("clickdesk-show-chat", data, undefined, function(template_ui){

		if(!template_ui)
			  return;

		// Append the form into the content
		$('#content').append($(template_ui));

		// show time ago in modal
		$(".time-ago", $('#clickdesk_chat_showModal')).timeago();

		// Shows the modal after filling with details
		$('#clickdesk_chat_showModal').modal("show");

	}, "#clickdesk_chat_showModal");

}

/**
 * Retrieves more chats from ClickDesk based on offset
 */
function getMoreChats(offset, callback)
{
	// Show spinner till chats are retrieved
	$('#spinner-clickdesk-chats').show();

	/*
	 * send GET request to the URL to retrieve chats based on
	 * ClickDesk_Plugin_Id, email and offset as path parameters
	 */
	$.get("/core/api/widgets/clickdesk/chats/" + ClickDesk_Plugin_Id + "/" + Email + "/" + offset, function(data)
	{
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}, "json").error(function(data)
	{
		// Hide spinner on error
		$('#spinner-clickdesk-chats').hide();

		// Error message is shown in error panel for 10 seconds
		clickDeskStreamError("clickdesk-chats-error-panel", data.responseText);
	});
}

/**
 * Shows more chats retrieved from ClickDesk in ClickDesk widget chat panel
 * 
 * @param data
 *            More chats data
 */
function showMoreChats(data)
{
	// spinner is hidden after retrieving chats
	$('#spinner-clickdesk-chats').hide();

	/*
	 * If chats array length is zero, show information in the chats error panel
	 * and hide it after 10 seconds
	 */
	if (data.length == 0)
	{
		clickDeskStreamError("clickdesk-chats-error-panel", 'No more chats');
		return;
	}

	getTemplate('clickdesk-chat-stream', data, undefined, function(template_ui){
		if(!template_ui)
			  return;

		// Get template and fill it with chats data and append it to chats panel
		$('#clickdesk_chats_panel').append($(template_ui));

		// Call time ago on more chats
		$(".time-ago", $('#clickdesk_chats_panel')).timeago();

	}, null);

}

/**
 * Retrieves tickets from ClickDesk based on offset
 * 
 * @param offset
 *            start index to retrieve tickets
 * @param callback
 */
function getClickDeskTickets(offset, callback)
{
	// Show loading image until tickets are retrieved
	$('#clickdesk_tickets_panel').html(CLICKDESK_UPDATE_LOAD_IMAGE);

	/*
	 * send GET request to the URL to retrieve chats based on
	 * ClickDesk_Plugin_Id, email and offset as path parameters
	 */
	$.get("/core/api/widgets/clickdesk/tickets/" + ClickDesk_Plugin_Id + "/" + Email + "/" + offset, function(data)
	{
		// If undefined return
		if (!data)
			return;

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

		registerEventsInTickets(data);

	}, "json").error(function(data)
	{
		// Remove loading on error
		$('#chats_load').remove();

		/*
		 * If offset is zero and error occurs, tickets tab clicked is made
		 * false, so that on second click again we can retrieve tickets
		 */
		if (offset == 0)
			Tickets_clicked = false;

		// Error message is shown in tickets panel
		clickDeskError("clickdesk_tickets_panel", data.responseText);
	});

}

/**
 * Shows tickets in the ClickDesk widget UI
 * 
 * @param data
 *            Data required to show in ClickDesk tickets panel
 */
function showClickDeskTickets(data)
{
	/*
	 * If chats array length is zero, show information in the tickets panel and
	 * return, else show tickets in tickets panel
	 */
	if (data.length == 0)
	{
		$('#clickdesk_tickets_panel').html('<li class="list-group-item r-none b-l-none b-r-none">No tickets</li>');
		return;
	}else if(data.length == 5){
		$('.click-tickets-footer').removeClass('hide');
	}

	getTemplate('clickdesk-ticket-stream', data, undefined, function(template_ui){
		if(!template_ui)
			  return;
		
		// Fill template with tickets and append it to ClickDesk panel
		$('#clickdesk_tickets_panel').html($(template_ui));

		// Load jquery time ago function to show time ago in tickets
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", $('#clickdesk_tickets_panel')).timeago();
		});

	}, "#clickdesk_tickets_panel");

	
}

/**
 * Registers click events in ClickDesk chat panel
 */
function registerEventsInTickets(tickets_data)
{
	/*
	 * On click of show ticket, retrieve ticket data appended to the chat
	 * element clicked and show it in modal
	 */
    $("body").off("click", "#clickdesk_ticket_show");
	$("body").on("click", "#clickdesk_ticket_show", function(e)
	{
		e.preventDefault();

		// retrieve appended data on element and parse it as JSON
		var ticket_json = JSON.parse($(this).attr('data-attr'));

		// Show modal with ticket data
		showTicketModal(ticket_json);

	});
    
    $("body").off("click", "#more_tickets_link");
	$("body").on("click", "#more_tickets_link", function(e)
	{
		e.preventDefault();

		/*
		 * If initial tickets retrieved are less than 5, we don't have to
		 * retrieve tickets on click of more tickets and show information "no
		 * more tickets"
		 */
		if (!tickets_data.length >= 5)
		{
			clickDeskStreamError("clickdesk-tickets-error-panel", 'No more tickets');
			return;
		}

		// Get length of tickets panel to set offset
		var offset = $('#c_tickets ul li').length;
		console.log('offset ' + offset);

		// Retrieve more tickets from ClickDesk, append & show in
		// tickets panel
		getMoreTickets(offset, function(tickets_data)
		{
			showMoreTickets(tickets_data);
		});
	});
}

/**
 * Shows ticket information in a modal
 * 
 * @param data
 *            ticket data
 */
function showTicketModal(data)
{
	// Remove the modal if already exists
	$('#clickdesk_ticket_showModal').remove();

	getTemplate("clickdesk-show-ticket", data, undefined, function(template_ui){
		if(!template_ui)
			  return;
		
		// Append the form into the content
		$('#content').append($(template_ui));

		// show time ago in modal
		$(".time-ago", $('#clickdesk_ticket_showModal')).timeago();

		// Shows the modal after filling with details
		$('#clickdesk_ticket_showModal').modal("show");	

	}, "#clickdesk_ticket_showModal");

}

/**
 * Retrieves more tickets from ClickDesk based on offset
 * 
 * @param offset
 *            start index to retrieve tickets
 * @param callback
 */
function getMoreTickets(offset, callback)
{
	// Show spinner till tickets are retrieved
	$('#spinner-clickdesk-tickets').show();

	/*
	 * send GET request to the URL to retrieve tickets based on
	 * ClickDesk_Plugin_Id, email and offset as path parameters
	 */
	$.get("/core/api/widgets/clickdesk/tickets/" + ClickDesk_Plugin_Id + "/" + Email + "/" + offset, function(data1)
	{
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data1);

	}, "json").error(function(data1)
	{
		// Hide spinner on error
		$('#spinner-clickdesk-tickets').hide();

		// Error message is shown in error panel for 10 seconds
		clickDeskStreamError("clickdesk-tickets-error-panel", data1.responseText);
	});
}

/**
 * Shows more tickets retrieved from ClickDesk in ClickDesk widget ticket panel
 * 
 * @param data
 */
function showMoreTickets(data)
{
	// spinner is hidden after retrieving tickets
	$('#spinner-clickdesk-tickets').hide();

	/*
	 * If chats array length is zero, show information in the chats error panel
	 * and hide it after 10 seconds
	 */
	if (data.length == 0)
	{
		clickDeskStreamError("clickdesk-tickets-error-panel", 'No more tickets');
		return;
	}

	getTemplate('clickdesk-ticket-stream', data, undefined, function(template_ui){
		if(!template_ui)
			  return;
		
		// Get template and fill it with chats data and append it to chats panel
		$('#clickdesk_tickets_panel').append($(template_ui));

		// Call time ago on more chats
		$(".time-ago", $('#clickdesk_tickets_panel')).timeago();

	}, "#content");

	

}

/**
 * Shows ClickDesk error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function clickDeskError(id, message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	getTemplate('clickdesk-error', error_json, undefined, function(template_ui){
		if(!template_ui)
			  return;
			
		$('#' + id).html($(template_ui));

	}, "#" + id);

}

/**
 * Shows ClickDesk error message in the div allocated with given id and fades it
 * out after 10 secs
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function clickDeskStreamError(id, message)
{
	// Fill error template and show error message
	clickDeskError(id, message);

	/*
	 * div allocated with the id here is hidden by default, we need to show it
	 * with the error message and fade it out after 10 secs
	 */
	$('#' + id).show();
	$('#' + id).fadeOut(10000);
}

function startClickDeskWidget(contact_id) {

		// ClickDesk widget name as a global variable
		CLICKDESK_PLUGIN_NAME = "ClickDesk";

		// ClickDesk loading image declared as global
		CLICKDESK_UPDATE_LOAD_IMAGE = '<center><img id="chats_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

		// Retrieves widget which is fetched using script API
		var clickdesk_widget = agile_crm_get_widget(CLICKDESK_PLUGIN_NAME);

		console.log('In ClickDesk');
		console.log(clickdesk_widget);

		// ID of the ClickDesk widget as global variable
		ClickDesk_Plugin_Id = WIDGET_LOADED_CONTACT.id;

		// Stores email of the contact as global variable
		Email = agile_crm_get_contact_property('email');
		console.log('Email: ' + Email);


		/*
		 * Gets ClickDesk widget preferences, required to check whether to show
		 * setup button or to fetch details. If undefined - considering first time
		 * usage of widget, setupClickDeskAuth is shown and returned
		 */
		if (clickdesk_widget.prefs == undefined)
		{
			setupClickDeskAuth();
			return;

		}

		/*
		 * If ClickDesk widget preferences are defined, shows chats from ClickDesk
		 * associated with current contact's email
		 */
		showClickDeskProfile(contact_id);

		/*
		 * On mouse enter of ticket, show tab link which has a link to show detailed
		 * description of ticket
		 */
        $("#"+WIDGET_PARENT_ID).off("mouseenter", ".clickdesk_ticket_hover");
		$("#"+WIDGET_PARENT_ID).on("mouseenter", ".clickdesk_ticket_hover", function(e)
		{
			$(this).find('.clickdesk_ticket_tab_link').show();
		});

		// On mouse leave of ticket, hides tab link
        $("#"+WIDGET_PARENT_ID).off("mouseleave", ".clickdesk_ticket_hover");
		$("#"+WIDGET_PARENT_ID).on("mouseleave", ".clickdesk_ticket_hover", function(e)
		{
			$('.clickdesk_ticket_tab_link').hide();
		});

		/*
		 * On mouse enter of chat, show tab link which has a link to show detailed
		 * description of chat
		 */
        $("#"+WIDGET_PARENT_ID).off("mouseenter", ".clickdesk_chat_hover");
		$("#"+WIDGET_PARENT_ID).on("mouseenter", ".clickdesk_chat_hover", function(e)
		{
			$(this).find('.clickdesk_chat_tab_link').show();
		});

		// On mouse leave of chat, hides tab link
        $("#"+WIDGET_PARENT_ID).off("mouseleave", ".clickdesk_chat_hover");
		$("#"+WIDGET_PARENT_ID).on("mouseleave", ".clickdesk_chat_hover", function(e)
		{
			$('.clickdesk_chat_tab_link').hide();
		});
}
