// Url from where twilio call is made
var Twilio_Caller_Url;

var connection;

window.onhashchange = hashchanged;



// If twilio call is in progress and tab/page is changed so display call noty.
function hashchanged()
{
	/*console.log("window.location.href");
	console.log(window.location.href);
	console.log(Twilio_Call_Noty);
	console.log(Twilio.Device.status());
	console.log(Twilio_Caller_Url);

	// if (Twilio_Caller_Url != window.location.href && Twilio.Device.status()
	// == "busy")
	if (Twilio.Device.status() == "busy" && Twilio_Call_Noty == undefined)
	{
		showCallNotyPopup("connected", "Twilio", "<b>On call : </b><br>" + To_Name + "   " + To_Number + "<br>", false);
	}*/
}

/**
 * Shows setup if user adds Twilio widget for the first time or clicks on reset
 * icon on Twilio panel in the UI. Uses ScribeServlet for OAuth process
 */
function setupTwilioOAuth()
{
	// Show loading until set up is shown
	$('#Twilio').html(TWILIO_LOGS_LOAD_IMAGE);
	console.log('In Twilio Auth');

	// Connects with ScribeServlet for authentication
	$('#Twilio')
			.html(
					'<div class="widget_content"><p style="border-bottom:none">Call your contacts directly using your Twilio account.</p><a id="twilio-connect-button" class="btn" href="https://www.twilio.com/authorize/CNf63bca035414be121d517a116066a5f8?state=' + encodeURIComponent(window.location.href) + '" style="margin-bottom: 10px;">Link Your Twilio</a></div>');

}

/**
 * Initializes an AJAX queue request to retrieve Twilio outgoing numbers based
 * on given Twilio_Plugin_Id
 * 
 * <p>
 * Request is added to queue to make the requests from all the widgets
 * synchronous
 * </p>
 * 
 * @param callback
 *            Function to be executed on success
 */
function getOutgoingNumbers(callback)
{
	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve numbers
	 */
	queueGetRequest("widget_queue", "/core/api/widgets/twilio/numbers/" + Twilio_Plugin_Id, 'json', function(data)
	{
		// If data is not defined return
		if (!data)
			return;

		console.log("In getting twilio numbers");
		console.log(data);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}, function(data)
	{
		// Remove loading on error
		$('#twilio_profile_load').remove();

		// Show error message in Twilio widget
		twilioError(Twilio_PLUGIN_NAME, data.responseText);
	});

}

/**
 * Verifies a given number In Twilio and returns verification code to verify in
 * the Twilio Widget
 * 
 * @param from_number
 *            {@link String} Number to verify
 * @param callback
 *            Function to be executed on success
 */
function verifyNumberFromTwilio(from_number, callback)
{
	// Shows verifying till the request is sent
	$('#Twilio').html('<div class="widget_content">Verifying........</div>');

	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/verify/numbers/"
	 * with Twilio_Plugin_Id and from_number as path parameters
	 */
	$.getJSON("/core/api/widgets/twilio/verify/numbers/" + Twilio_Plugin_Id + "/" + from_number, function(verified_data)
	{
		console.log("Twilio verified_data " + verified_data);

		// If data is not defined return
		if (!verified_data)
			return;

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(verified_data);

	}).error(
			function(data)
			{
				// Append the url with the random number in order to
				// differentiate the same action performed more than once.
				var flag = Math.floor((Math.random() * 10) + 1);
				// Show error message in widget panel, if error occur while
				// verifying numbers.
				setUpError(Twilio_PLUGIN_NAME, "widget-settings-error", data.responseText,
						window.location.protocol + "//" + window.location.host + "/#Twilio/twilio" + flag);
			});
}

/**
 * Retrieves outgoing numbers from Twilio to check whether the Twilio user has
 * registered numbers with Twilio, If not set up to verify number is shown, else
 * method is called to generate token
 * 
 * @returns
 */
function checkTwilioNumbersAndGenerateToken(twilio_prefs)
{
	// Retrieves outgoing numbers from Twilio
	getOutgoingNumbers(function(data)
	{
		console.log("Twilio outgoing numbers: " + data[0].PhoneNumber);

		// If no numbers, show set up
		if (!data[0].PhoneNumber)
		{
			$('#Twilio').html(getTemplate('twilio-initial', {}));
			return;
		}

		if (twilio_prefs.verification_status && twilio_prefs.verification_status == "success" && twilio_prefs.verified_number)
		{
			checkTwilioPrefsAndGenerateToken(twilio_prefs, twilio_prefs.verified_number);
			return;
		}

		// Else generate Twilio token for calls
		checkTwilioPrefsAndGenerateToken(twilio_prefs, data[0].PhoneNumber);
	});
}

/**
 * Checks if Twilio preferences has application SID, else creates one and after
 * creating generates Twilio token show set up to make calls and show details in
 * Twilio panel
 * 
 * <p>
 * To generate a token in Twilio to make calls, we need to set up an application
 * in Twilio on behalf of Agile specifying the URL to be called when a call is
 * made
 * </p>
 * 
 * @param twilio_prefs
 *            JSONObject of Twilio preferences
 * @param from_number
 *            {@link String} Number to verify
 */
function checkTwilioPrefsAndGenerateToken(twilio_prefs, from_number)
{
	/*
	 * If Twilio preferences has account SID after OAuth, checks for application
	 * SID whether we have created an application in AgileUser Twilio account,
	 * if created continues to generate token, else creates an application and
	 * calls the same method saving application SID in Twilio prefrences
	 */
	if (twilio_prefs.account_sid)
	{
		// If no applicaiton SID
		if (!twilio_prefs.app_sid)
		{
			// Create application in Twilio and return
			createApplicationInTwilio(function(appSid)
			{
				twilio_prefs['app_sid'] = appSid;

				// Save preferences with application SID set to Twilio
				agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME, JSON.stringify(twilio_prefs), function(data)
				{
					// Call same method after setting application SID
					checkTwilioPrefsAndGenerateToken(twilio_prefs, from_number);
				});
			});
			return;
		}

		/*
		 * generates a token in Twilio and shows set up to make calls and shows
		 * details in Twilio panel
		 */
		/*generateTokenInTwilio(from_number, function(token)
		{
			showTwilioDetails(token, from_number);
			return;
		});*/
		
		showTwilioDetails(null, from_number);
	}
}

/**
 * Creates an application in Twilio for agile to make calls
 * 
 * @param callback
 *            Function to be executed on success
 */
function createApplicationInTwilio(callback)
{
	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/appsid/" with
	 * Twilio_Plugin_Id as path parameter
	 */
	$.get("/core/api/widgets/twilio/appsid/" + Twilio_Plugin_Id, function(data)
	{
		console.log('Twilio app_sid: ' + data);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}).error(function(data)
	{
		// Shows error if error occurs in Twilio widget panel
		twilioError(Twilio_PLUGIN_NAME, data.responseText);
	});
}

/**
 * Generates token in Twilio to make calls
 * 
 * @returns
 */
function generateTokenInTwilio(from_number, callback)
{
	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/token/" with
	 * Twilio_Plugin_Id as path parameter
	 */
	$.get("/core/api/widgets/twilio/token/" + Twilio_Plugin_Id, function(token)
	{
		console.log("Twilio generated token : " + token);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(token);

	}).error(function(data)
	{
		// Shows error if error occurs in Twilio widget panel
		twilioError(Twilio_PLUGIN_NAME, data.responseText);
	});
}

/**
 * Shows details in Twilio panel and calls Twilio set up to intialize events to
 * handle calls
 * 
 * @param token
 *            Token to make calls
 */
function showTwilioDetails(token, from_number)
{
	console.log("In showTwilioDetails");
	
	// Shows loading until details are fetched
	$('#Twilio').html(TWILIO_LOGS_LOAD_IMAGE);

	// If no numbers for contact, show message
	if (Numbers.length == 0)
	{
		// Shows information in Twilio widget panel
		twilioError(Twilio_PLUGIN_NAME, "There is no phone number associated with this contact. <a href='#contact-edit'>Add phone number</a>");
		return;
	}

	var numbers = {};
	numbers['to'] = Numbers;

	// Get template and show details in Twilio widget
	$('#Twilio').html(getTemplate('twilio-profile', numbers));

	// Twilio set up to intialize events to handle calls
	//setUpTwilio(token, from_number);

	/*
	 * Hide if a link to add note exists (If call is made we show this link,
	 * after refresh we hide it)
	 */
	$('#twilio_note').hide();

	// Retreive Twilio call logs and show it in Twilio widget panel
	getTwilioLogs(Numbers[0].value);

	/*
	 * On change of number in select box, we retrieve call logs for it and show
	 */
	$('#contact_number').die().live('change', function(e)
	{
		var to = $('#contact_number').val();
		getTwilioLogs(to);
	});

}

/**
 * Retrives call logs from Twilio for the given number
 * 
 * @param to
 *            {@link String} number to which calls are made
 */
function getTwilioLogs(to)
{
	// shows loading until logs are fetched
	$('#twilio-logs-panel').html(TWILIO_LOGS_LOAD_IMAGE);

	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/call/logs/" with
	 * Twilio_Plugin_Id and to as path parameters
	 */
	$.get("/core/api/widgets/twilio/call/logs/" + Twilio_Plugin_Id + "/" + to, function(logs)
	{
		console.log('In Twilio logs ');
		console.log(logs);

		// get and fill template with logs and show
		var twilio_logs_template = $(getTemplate('twilio-logs', JSON.parse(logs)));
		$('#twilio-logs-panel').html(twilio_logs_template);

		// Load jquery time ago function to show time ago in logs
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", twilio_logs_template).timeago();
		});
		// Add the call logs to the timeline.
		addLogsToTimeLine($.parseJSON(logs));
		
		/*
		 * On click of play button in Twilio logs, call conversaion is played
		 */
		$("#record_sound_play").die().live("click", function(e)
		{
			e.preventDefault();

			/**
			 * We make play button on a widget disabled on click of it. This is done
			 * to avoid continuous click in a short time, like double click on add
			 * button
			 */
			/*
			 * if ($(this).attr("disabled")) return; // set attribute disabled as
			 * disabled $(this).attr("disabled", "disabled");
			 */
			
			//condition to check whether the sound is already playing
			if(audio != null)
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
			audio=null;
			$(this).addClass("icon-play");
			$(this).removeClass("icon-stop");
								
		});

	}).error(function(data)
	{
		// Remove loading if error occcurs
		$('#logs_load').remove();

		// Shows error if error occurs in Twilio widget panel
		twilioError('twilio-logs-panel', data.responseText);
	});
}

/**
 * Set up Twilio devices and hadlers to handle calls
 * 
 * @param token
 *            Token to make calls
 * @param from_number
 *            Number fromwhich calls should be made
 */
function setUpTwilio(token, from_number)
{
	var to_number = $('#contact_number').val();

	// Loads twilio min.js to intiliaze twilio call events
	head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js", function()
	{
		// setup Twilio device
		Twilio.Device.setup(token);

		// When set up is ready this is called
		Twilio.Device.ready(function()
		{
			console.log("ready");
			$("#twilio_call").show();

			// Add dialpad template in twilio content
			if ($('#Twilio').find('.widget_content').find("#dialpad_in_twilio").length == 0)
			{
				var dialpad = $(getTemplate("twilioio-dialpad"), {});
				$('#Twilio').find('.widget_content').append(dialpad);
			}

			if (Twilio_Caller_Url == window.location.href && Twilio.Device.status() == "busy")
			{
				console.log("Twilio call is already connected");

				$("#twilio_hangup").show();
				$("#twilio_dialpad").show();
				$("#twilio_call").hide();
			}
		});

		// After call is connected
		Twilio.Device.connect(function(conn)
		{
			console.log("Twilio call is connected");
			// Called for all new connections
			console.log(conn);
			console.log(conn._status);

			// After call connects, show hang up buttton and hide call button
			if (conn._status == "open")
			{
				// Save twilio caller's url
				Twilio_Caller_Url = window.location.href;
				To_Number = $('#contact_number').val();

				To_Name = getTwilioContactName();

				globalconnection = conn;
				$("#twilio_hangup").show();
				$("#twilio_dialpad").show();
				$("#twilio_call").hide();
			}
		});

		// If call is ended or disconnected
		Twilio.Device.disconnect(function(conn)
		{
			console.log("Twilio call is disconnected");
			// Called for all disconnections
			console.log(conn);

			// On call end, hide hang up,show call and link to add note
			if (conn._status == "closed")
			{
				to_number = $('#contact_number').val();
				console.log("Twilio Number in disconect: " + to_number);
				getTwilioLogs(to_number);
				$('#twilio_note').show();
				$("#twilio_hangup").hide();
				$("#twilio_dialpad").hide();
				$('#dialpad_in_twilio').hide();
				$("#twilio_call").show();

				// Remove twilio caller's url
				Twilio_Caller_Url = undefined;
				
				closeTwilioNoty();
			}

		});

		// If any network failure, show error
		Twilio.Device.offline(function()
		{
			// Called on network connection lost.
			console.log("Twilio went offline");
		});

		// When incoming call comes to Twilio
		Twilio.Device.incoming(function(conn)
		{
			// who is calling
			console.log(conn.parameters.From);
			// status before accepting call
			console.log(conn._status);
			conn.accept();

			// If connection is opened, hide call and show hang up
			if (conn._status == "open")
			{
				globalconnection = conn;
				$("#twilio_hangup").show();
				$("#twilio_dialpad").show();
				$("#twilio_call").hide();
			}

		});

		// When call is cancelled, hide hang up and show call
		Twilio.Device.cancel(function(conn)
		{
			// who canceled the call
			console.log(conn.parameters.From);

			$("#twilio_hangup").hide();
			$("#twilio_dialpad").hide();
			$('#dialpad_in_twilio').hide();
			$("#twilio_call").show();

		});

		/*
		 * Called for each available client when this device becomes ready and
		 * every time another client's availability changes.
		 */
		Twilio.Device.presence(function(presenceEvent)
		{
			// name of client whose availablity changed
			console.log(presenceEvent.from);

			// true or false
			console.log(presenceEvent.available);
		});

		/*
		 * If error occurs while calling, hide hang up and show call
		 */
		Twilio.Device.error(function(e)
		{
			// 31205 error code
			console.log("Twilio error");
			console.log(e);

			$("#twilio_hangup").hide();
			$("#twilio_dialpad").hide();
			$('#dialpad_in_twilio').hide();
			$("#twilio_call").show();
		});

		registerClickEvents(from_number);
	});
}

// Get name of contact
function getTwilioContactName()
{
	var contactName = "";
	var firstName = agile_crm_get_contact_property('first_name');
	var lastName = agile_crm_get_contact_property('last_name');

	if (firstName)
		contactName = firstName + " ";
	if (lastName)
		contactName = contactName + lastName;
	
	return contactName;
}

/**
 * Registers click events required for twilio call
 * 
 * @param to_number
 *            Number selected from select box
 */
function registerClickEvents(from_number)
{
	var to_number;
	var record = "false";

	/*
	 * On click of Twilio hang up, logs are retrieved again and and all
	 * connections are disconnected, hangup is hidden and call butoon is shown
	 */
	$("#twilio_hangup").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("Twilio call hang up");

		to_number = $('#contact_number').val();
		console.log("Twilio Number in hang up: " + to_number);

		// Get call logs and diconnect all connections
		getTwilioLogs(to_number);
		Twilio.Device.disconnectAll();
		$("#twilio_hangup").hide();
		$("#twilio_dialpad").hide();
		$('#dialpad_in_twilio').hide();
		$("#twilio_call").show();
	});

	$("#twilio_dialpad").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("Twilio call dailpad");
		$('#dialpad_in_twilio').toggle();
	});

	/*
	 * On click of play button in Twilio logs, call conversaion is played
	 */
	$("#record_sound_play").die().live("click", function(e)
	{
		e.preventDefault();

		/**
		 * We make play button on a widget disabled on click of it. This is done
		 * to avoid continuous click in a short time, like double click on add
		 * button
		 */
		/*
		 * if ($(this).attr("disabled")) return; // set attribute disabled as
		 * disabled $(this).attr("disabled", "disabled");
		 */

		// Sound URL from Twilio to play call
		var sound_url = "https://api.twilio.com" + $(this).attr("sound_url");
		console.log("Twilio sound URL: " + sound_url);

		// plays call conversion
		play_sound(sound_url, "true");

		// $(this).removeAttr("disabled");
	});

	/*
	 * On click of call in Twilio panel, shows a record modal asking for
	 * confirmation to make call and whether to record it
	 */
	$("#twilio_call").die().live("click", function(e)
	{
		e.preventDefault();

		// Retrieve to number from select box
		to_number = $('#contact_number').val();
		record = "false";

		// remove record modal if exists
		$("#twilio-record-modal").remove();

		// parameters to show in record modal
		var to_display = {};
		to_display['to'] = to_number;
		to_display['name'] = getTwilioContactName();

		// Get and fill template with details
		var record_modal = $(getTemplate('twilio-record', to_display));

		// Append the form into the content
		$('#content').append(record_modal);

		// Shows the modal after filling with details
		$("#twilio-record-modal").modal("show");

	});

	/*
	 * On click of button in record modal, calls connect method of Twilio to
	 * make call
	 */
	$('.enable-call').die().live(
			'click',
			function(e)
			{
				e.preventDefault();

				// hide record modal
				$("#twilio-record-modal").modal("hide");

				// To check if call is clicked or no is clicked
				var confirm = $(this).attr('make_call');

				// If no return
				if (confirm == "no")
					return;

				// If record is checked, nake record as true
				if ($('#enable-record').is(':checked'))
					record = "true";

				console.log("In Twilio call: " + record);

				// Call connect method of Twilio
				Twilio.Device.connect({ from : from_number, PhoneNumber : to_number, record : record,
					Url : "https://agile-crm-cloud.appspot.com/backend/voice?record=" + record });
			});
}

/**
 * Retrieves incoming numbers from Twilio
 * 
 * @param callback
 */
function getIncomingNumbers(callback)
{
	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/incoming/numbers/"
	 * with Twilio_Plugin_Id as path parameter
	 */
	$.get("/core/api/widgets/twilio/incoming/numbers/" + Twilio_Plugin_Id, function(data)
	{
		if (callback && typeof (callback) === "function")
			callback(data);

	}, "json").error(function(data)
	{
		// Removes loading if error occurs
		$('#twilio_profile_load').remove();

		// Shows error if error occurs in Twilio widget panel
		twilioError(Twilio_PLUGIN_NAME, data.responseText);
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
function twilioError(id, message)
{
	console.log('In Twilio error template');
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	$('#' + id).html(getTemplate('twilio-error', error_json));
	//$('#' + id).append('<a href="#add-widget" >widget settings page.</a>');
	$('#' + id).append('<a class="btn" id="delete-widget" widget-name="Twilio" style="margin-top: 5px;">Delete Widget</a>');
}

/**
 * Add the Call Logs to the time line.
 * 
 * @param logs
 *            the list of call made.
 */
function addLogsToTimeLine(logs)
{
	var callInfo;
	// Loop through all the calls and add each of them to the timeline.
	for ( var i = 0; i < logs.length; i++)
	{
		if (logs[i].call.Status == 'no-answer')
		{
			callInfo = 'Call unaswered - ' + logs[i].call.Duration + ' s';
		}
		else
		{
			callInfo = 'Duration ' + logs[i].call.Duration + ' s';
		}

		var date = new Date(logs[i].call.StartTime);
		// Prepare the model object with all the require information to add the
		// call logs to timeline.
		var model = { id : 'twilio' + (logs.length - i), name : callInfo, body : date.toDateString() + ' ' + date.toLocaleTimeString(), title : "Call",
			created_time : Date.parse(logs[i].call.StartTime) / 1000, entity_type : "twilio" }
		add_entity_to_timeline(new BaseModel(model));
	}
}

$(function()
		{
			// Twilio widget name as a global variable
			Twilio_PLUGIN_NAME = "Twilio";

			// Twilio loading image declared as global
			TWILIO_LOGS_LOAD_IMAGE = '<center><img id="logs_load" src=\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

			// Retrieves widget which is fetched using script API
			var twilio_widget = agile_crm_get_widget(Twilio_PLUGIN_NAME);

			console.log('In Twilio');
			console.log(twilio_widget);

			// Retrieves list of phone numbers in agile contact
			Numbers = agile_crm_get_contact_properties_list("phone");
			console.log(Numbers);

			// ID of the ClickDesk widget as global variable
			Twilio_Plugin_Id = twilio_widget.id;
			console.log("Plugin prefs in Twilio: " + twilio_widget.prefs);

			/*
			 * Gets Twilio widget preferences, required to check whether to show setup
			 * button or to fetch details. If undefined - considering first time usage
			 * of widget, setupTwilioOAuth is shown and returned
			 */
			if (twilio_widget.prefs == undefined || twilio_widget.prefs == "{}")
			{
				setupTwilioOAuth();
				return;
			}

			// Parse string preferences as JSON
			var twilio_prefs = JSON.parse(twilio_widget.prefs);
			console.log(twilio_prefs);

			// Because of new widget it is deprecated and all functions are commented.
			twilioError(Twilio_PLUGIN_NAME, 'Please delete this widget and add the new improved Twilio widget from the <a href="#add-widget" >widget settings page</a>.');
			
			/*
			 * Check if Twilio account has registered numbers and shows set up to verify
			 * if no numbers available, else generates token required to make calls
			 */
			//checkTwilioNumbersAndGenerateToken(twilio_prefs);

			/*
			 * If Twilio account doesn't have numbers, we need to verify numbers in
			 * Twilio.On click of verify button in Twilio initial template,
			 * verifyNumberFromTwilio is called to verify a number in Twilio
			 */
			$('#twilio_verify').die().live('click', function(e)
			{
				e.preventDefault();

				// Checks whether all input fields are given
				if (!isValidForm($("#twilio_call_form")))
				{
					return;
				}

				// From number to make calls as entered by user
				var from_number = $('#twilio_from').val();
				console.log("Twilio verify from number: " + from_number);

				/*
				 * Verifies a number in Twilio and shows verification code in the Twilio
				 * template with a procced button
				 */
				verifyNumberFromTwilio(from_number, function(verified_data)
				{
					$('#Twilio').html(getTemplate('twilio-verify', verified_data));
				});
			});

			/*
			 * On click of Twilio proceed button after verifying numbers, we will check
			 * the verification status of the number and generate token to make calls,
			 * else set up to verify number is shown again
			 */
			$('#twilio_proceed').die().live('click', function(e)
			{
				e.preventDefault();

				// Get preferences of Twilio widget by its name
				var check_twilio_prefs = agile_crm_get_widget_prefs(Twilio_PLUGIN_NAME);
				console.log("check_twilio_prefs : " + check_twilio_prefs);

				// check if verification status is success, generate token
				if (!check_twilio_prefs.verificaton_status || check_twilio_prefs.verificaton_status == "success")
					checkTwilioNumbersAndGenerateToken(check_twilio_prefs);

				// else if it is failure, show set up to verify
				else if (check_prefs.verificaton_status == "failure")
					$('#Twilio').html(getTemplate('twilio-initial', {}));
			});
		});
