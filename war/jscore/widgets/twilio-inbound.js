// For Twilio inbound.
$(function()
{
	var Twilio_Plugin_Id;

	// After 15 sec procedure will start.
	setTimeout(function()
	{

		// after DOM ready.
		if (document.readyState === "complete")
		{

			console.log("In Twilio inbound call");
			// Get Sip widget
			$.getJSON("/core/api/widgets/Twilio", function(twilio_widget)
			{
				if (twilio_widget == null)
					return;

				Twilio_Widget_Object = twilio_widget;

				console.log(twilio_widget.prefs);

				// ID of the ClickDesk widget as global variable
				Twilio_Plugin_Id = twilio_widget.id;

				console.log(Twilio_Plugin_Id);
				if (twilio_widget.prefs != undefined)
				{

					// Parse string preferences as JSON
					var twilio_prefs = JSON.parse(twilio_widget.prefs);
					console.log(twilio_prefs);

					/*
					 * Check if Twilio account has registered numbers and shows
					 * set up to verify if no numbers available, else generates
					 * token required to make calls
					 */
					checkTwilioNumbersAndGenerateToken(Twilio_Plugin_Id, twilio_prefs);
				}
			}).error(function(data)
			{
				console.log("In twilio error");
				console.log(data);
			});
		}
	}, 20000); // 20 sec
});

function checkTwilioNumbersAndGenerateToken(Twilio_Plugin_Id, twilio_prefs)
{
	// Retrieves outgoing numbers from Twilio
	getOutgoingNumbers(Twilio_Plugin_Id, function(data)
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
			console.log("in if");
			checkTwilioPrefsAndGenerateToken(Twilio_Plugin_Id, twilio_prefs, twilio_prefs.verified_number);
			return;
		}

		// Else generate Twilio token for calls
		checkTwilioPrefsAndGenerateToken(Twilio_Plugin_Id, twilio_prefs, data[0].PhoneNumber);
	});
}

function getOutgoingNumbers(Twilio_Plugin_Id, callback)
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
		console.log("Error in getOutgoingNumbers: ");
		console.log(data);
	});

}

function checkTwilioPrefsAndGenerateToken(Twilio_Plugin_Id, twilio_prefs, from_number)
{
	console.log("in checkTwilioPrefsAndGenerateToken");

	/*
	 * If Twilio preferences has account SID after OAuth, checks for application
	 * SID whether we have created an application in AgileUser Twilio account,
	 * if created continues to generate token, else creates an application and
	 * calls the same method saving application SID in Twilio prefrences
	 */
	if (twilio_prefs.account_sid)
	{
		console.log(twilio_prefs.account_sid + " " + twilio_prefs.app_sid);
		// If no applicaiton SID
		if (!twilio_prefs.app_sid)
		{
			// Create application in Twilio and return
			createApplicationInTwilio(Twilio_Plugin_Id, function(appSid)
			{
				twilio_prefs['app_sid'] = appSid;

				// Save preferences with application SID set to Twilio
				agile_crm_save_widget_prefs("Twilio", JSON.stringify(twilio_prefs), function(data)
				{
					// Call same method after setting application SID
					checkTwilioPrefsAndGenerateToken(Twilio_Plugin_Id, twilio_prefs, from_number);
				});
			});
			return;
		}

		/*
		 * generates a token in Twilio and shows set up to make calls and shows
		 * details in Twilio panel
		 */
		generateTokenInTwilio(Twilio_Plugin_Id, from_number, function(token)
		{
			setUpTwilio(token, from_number);
			return;
		});
	}
}

function createApplicationInTwilio(Twilio_Plugin_Id, callback)
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

function generateTokenInTwilio(Twilio_Plugin_Id, from_number, callback)
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

function setUpTwilio(token, from_number)
{
	var to_number = $('#contact_number').val();

	// Loads twilio min.js to intiliaze twilio call events
	head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js", function()
	{
		// setup Twilio device
		Twilio.Device.setup(token, { debug : true });

		// When set up is ready this is called
		Twilio.Device.ready(function()
		{
			console.log("ready");
			$("#twilio_call").show();

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
				$("#twilio_hangup").show();
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
				$("#twilio_call").show();
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
			console.log("Twilio incoming call");
			// who is calling
			console.log(conn.parameters.From);
			// status before accepting call
			console.log(conn._status);
			// conn.accept();
			alert("incoming call");

			// If connection is opened, hide call and show hang up
			/*
			 * if (conn._status == "open") { $("#twilio_hangup").show();
			 * $("#twilio_call").hide(); }
			 */
		});

		// When call is cancelled, hide hang up and show call
		Twilio.Device.cancel(function(conn)
		{
			// who canceled the call
			console.log(conn.parameters.From);

			$("#twilio_hangup").hide();
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
			$("#twilio_call").show();
		});

		// registerClickEvents(from_number);

	});
}