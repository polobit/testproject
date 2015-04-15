$(function()
{
	// Twilio io widget name as a global variable
	TwilioIO_PLUGIN_NAME = "TwilioIO";

	// Twilio loading image declared as global
	TWILIOIO_LOGS_LOAD_IMAGE = '<center><img id="logs_load" src=\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	var twilioio_widget = agile_crm_get_widget(TwilioIO_PLUGIN_NAME);

	console.log('In twilioio_widget');
	console.log(twilioio_widget);

	// ID of the ClickDesk widget as global variable
	TwilioIO_Plugin_Id = twilioio_widget.id;
	console.log("Plugin prefs in Twilio: " + twilioio_widget.prefs);

	// Parse string preferences as JSON
	var twilioio_prefs = JSON.parse(twilioio_widget.prefs);

	// Retrieves list of phone numbers in agile contact
	TwilioIONumbers = agile_crm_get_contact_properties_list("phone");
	console.log("TwilioIONumbers");
	console.log(TwilioIONumbers);
	
	// Retrieves image of agile contact
	TwilioIOContactImg = agile_crm_get_contact_properties_list("image");
	console.log("TwilioIOContactImg");
	console.log(TwilioIOContactImg);

	showListOfContactNumbers();

	$("#twilioio_more_call_logs").die().live('click', function(e)
	{
		e.preventDefault();

		if($(this).attr("disabled"))
			return;
		
		// Disable btn
		$(this).attr("disabled", true);

		// Get all details to get next logs
		var page = $(this).attr("page");
		var pageToken = $(this).attr("pageToken");
		var to = $('#contact_number').val();

		// Append loading img to btn
		$(this).append('<img src="img/ajax-loader.gif" style="margin-left: 10px;"></img>');
		
		// If single contact available
		if (!to)
			to = TwilioIONumbers[0].value;

		// Get next 10 logs
		getNextLogs(to, page, pageToken);
	});
});

function showListOfContactNumbers()
{
	console.log("In showListOfContactNumbers");

	// If no numbers for contact, show message
	if (TwilioIONumbers.length == 0)
	{
		// Shows information in Twilio widget panel
		twilioIOError(TwilioIO_PLUGIN_NAME, "There is no phone number associated with this contact. <a href='#contact-edit'>Add phone number</a>");
		return;
	}

	var numbers = {};
	numbers['to'] = TwilioIONumbers;

	// Get template and show details in Twilio widget
	$('#TwilioIO').html(getTemplate('twilioio-profile', numbers));
	
	// Retreive Twilio call logs and show it in Twilio widget panel
	getTwilioIOLogs(TwilioIONumbers[0].value);

	/*
	 * On change of number in select box, we retrieve call logs for it and show
	 */
	$('#contact_number').die().live('change', function(e)
	{
		$('#twilio-logs-panel').html(TWILIOIO_LOGS_LOAD_IMAGE);
		var to = $('#contact_number').val();
		getTwilioIOLogs(to);
	});
}

/**
 * Retrives call logs from Twilio for the given number
 * 
 * @param to
 *            {@link String} number to which calls are made
 */
function getTwilioIOLogs(to)
{
	console.log("In getTwilioIOLogs:" + to);

	// When contact added from API, it may have empty number.
	if(to == "" || !to)
	  {
		// Shows information in Twilio widget panel
		twilioIOError(TwilioIO_PLUGIN_NAME, "There is no phone number associated with this contact. <a href='#contact-edit'>Add phone number</a>");
		return;
	  }		
	
	// If call logs are not added then only shows loading until logs are fetched
	var callLogPresent = $("#twilio-logs-panel li")[0];
	if (!$(callLogPresent).hasClass("row-fluid"))
		$('#twilio-logs-panel').html(TWILIOIO_LOGS_LOAD_IMAGE);

	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/call/logs/" with
	 * Twilio_Plugin_Id and to as path parameters
	 */
	$.get("/core/api/widgets/twilio/call/logs/" + TwilioIO_Plugin_Id + "/" + to, function(logs)
	{
		console.log('In TwilioIO logs ');

		// Get call logs from result
		var logsJson = JSON.parse(logs);
		
		// Get page info from result
		var pageInfo = logsJson.splice( 0, 1 )[0]; 
		
		// get and fill template with logs and show
		var twilio_logs_template = $(getTemplate('twilio-logs', logsJson));
		$('#twilio-logs-panel').html(twilio_logs_template);

		// Load jquery time ago function to show time ago in logs
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", twilio_logs_template).timeago();
		});

		// Add more button if more than 10 call logs present
		addMoreButton(pageInfo);

		/*
		 * On click of play button in Twilio logs, call conversaion is played
		 */
		$("#record_sound_play").die().live("click", function(e)
		{
			e.preventDefault();

			/**
			 * We make play button on a widget disabled on click of it. This is
			 * done to avoid continuous click in a short time, like double click
			 * on add button
			 */
			/*
			 * if ($(this).attr("disabled")) return; // set attribute disabled
			 * as disabled $(this).attr("disabled", "disabled");
			 */

			// condition to check whether the sound is already playing
			if (audio != null)
			{
				audio.pause();
				$(".icon-stop").addClass("icon-play");
				$(".icon-stop").removeClass("icon-stop");

			}

			// Sound URL from Twilio to play call
			var sound_url = "https://api.twilio.com" + $(this).attr("sound_url");
			console.log("Twilio sound URL: " + sound_url);

			// plays call conversion
			play_sound(sound_url, "true");
			$(this).addClass("icon-stop");
			$(this).removeClass("icon-play");

			// $(this).removeAttr("disabled");
		});

		// To stop the audio call when playing
		$(".icon-stop").die().live('click', function(e)
		{
			e.preventDefault();
			audio.pause();
			audio = null;
			$(this).addClass("icon-play");
			$(this).removeClass("icon-stop");

		});

	}).error(function(data)
	{
		// Remove loading if error occcurs
		$('#logs_load').remove();

		// Shows error if error occurs in Twilio widget panel
		twilioIOError('twilio-logs-panel', data.responseText);
	});
}

// add more button at end of call logs if more call logs are prsent
function addMoreButton(pageInfo)
{
	if (!pageInfo)
		return;

	
	$(".widget_tab_footer").remove();
	$("#twilioio_more_call_logs").remove();

	// If page and pageToken is present then only add more button else hide it
	if (pageInfo.page)
		$("#twilio-logs-panel")
				.append(
						'<div class="widget_tab_footer" align="center" style="float:none"><a href="#" id="twilioio_more_call_logs" page="' + pageInfo.page + '" pageToken="' + pageInfo.pageToken + '" style="margin-bottom: 10px;"  title="Click to see more call logs">Show More</a></div>');
}

// Get next 10 calls, add in UI, do "More" btn settings
function getNextLogs(to, page, pageToken)
{
	console.log("In getNextLogs:" + to);

	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/call/logs/" with
	 * Twilio_Plugin_Id and to as path parameters
	 */
	$.get("/core/api/widgets/twilio/call/nextlogs/" + TwilioIO_Plugin_Id + "/" + to + "/" + page + "/" + pageToken, function(logs)
	{
		console.log('In TwilioIO next logs ');

		// Get call logs from result
		var logsJson = JSON.parse(logs);
		
		// Get page info from result
		var pageInfo = logsJson.splice( 0, 1 )[0]; 
		
		// get and fill template with logs and show
		var twilio_logs_template = $(getTemplate('twilio-logs', logsJson));
		$('#twilio-logs-panel').append(twilio_logs_template);

		// Load jquery time ago function to show time ago in logs
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", twilio_logs_template).timeago();
		});

		// Add more button if more than 10 call logs present
		addMoreButton(pageInfo);
	}).error(function(data)
	{
		$("#twilioio_more_call_logs").html("Retry...");
		$("#twilioio_more_call_logs").attr("disabled", false);
	});
}

/**
 * Shows Twilio error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function twilioIOError(id, message)
{
	console.log('In TwilioIO error template');
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate('twilio-error', error_json));
}
