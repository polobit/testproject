$(function()
{

	// Plugin name as a global variable
	Twilio_PLUGIN_NAME = "Twilio";
	Twilio_PLUGIN_HEADER = '<div></div>'

	// Twilio update loading image declared as global
	TWILIO_LOGS_LOAD_IMAGE = '<center><img id="logs_load" src=\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	Numbers = agile_crm_get_contact_properties_list("phone");
	console.log("Numbers in twilio: " + Numbers);

	var plugin = agile_crm_get_plugin(Twilio_PLUGIN_NAME);

	// Gets plugin id from plugin object, fetched using script API
	var plugin_id = plugin.id;

	$('#Twilio_plugin_delete').die().live('click', function(e)
	{
		e.preventDefault();

		agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME, undefined, function(data)
		{
			setupTwilioOAuth(plugin_id);
		});
	});

	/*
	 * Gets Plugin Prefs, required to check whether to show setup button or to
	 * fetch details
	 */
	var plugin_prefs = plugin.prefs;
	
	console.log("Plugin prefs in Twilio: " + plugin_prefs);

	// If not found - considering first time usage, setupTwilioOAuth called
	if (plugin_prefs == undefined)
	{
		setupTwilioOAuth(plugin_id);
		return;
	}

	if (Numbers.length == 0)
	{
		$("#Twilio").html("<div class='widget_content'>No contact number is associated with this contact</div>");
		return;
	}

	var prefs = JSON.parse(plugin_prefs);
	console.log(prefs);

	getOutgoingNumbers(plugin_id, function(data)
	{
		console.log("Twilio outgoing numbers: " + data.PhoneNumber);
		if (!data.PhoneNumber)
		{
			$('#Twilio').html(getTemplate('twilio-initial', {}));
			return;
		}
		generateTwilioToken(plugin_id, prefs, data.PhoneNumber);
	});

	$('#twilio_verify').die().live('click', function(e)
	{
		e.preventDefault();

		// Checks whether all input fields are given
		if (!isValidForm($("#twilio_call_form")))
		{
			return;
		}

		var from = $('#twilio_from').val();
		console.log("twilio from: " + from);

		$('#Twilio').html('<div class="widget_content">Verifying........</div>');

		$.getJSON("/core/api/widgets/twilio/verify/numbers/" + plugin_id + "/" + from, function(verified_data)
		{
			console.log("verified_data " + verified_data);
			$('#Twilio').html(getTemplate('twilio-verify', verified_data));
		});

	});

	$('#twilio_proceed').die().live('click', function(e)
	{
		e.preventDefault();

		var check_prefs = agile_crm_get_plugin_prefs(Twilio_PLUGIN_NAME);

		if (!check_prefs.verificaton_status || check_prefs.verificaton_status == "success")
		{
			getOutgoingNumbers(plugin_id, function(data)
			{
				if (!data.PhoneNumber)
				{
					$('#Twilio').html(getTemplate('twilio-initial', {}));
					return;
				}

				generateTwilioToken(plugin_id, prefs, data.PhoneNumber);
			});
		}
		else if (check_prefs.verificaton_status == "failure")
			$('#Twilio').html(getTemplate('twilio-initial', {}));
	});

});

/**
 * Shows setup if user adds Twilio widget for the first time, to set up
 * connection to Twilio account. Enter and api key provided by Twilio access
 * functionalities
 * 
 * @param plugin_id
 */
function setupTwilioOAuth(plugin_id)
{

	$('#Twilio').html(TWILIO_LOGS_LOAD_IMAGE);

	console.log('twilio auth');

	$('#Twilio')
			.html(
					'<p class="widget_content" style="border-bottom:none">Call your contacts directly using your Twilio account.</p><a id="twilio-connect-button" href="https://www.twilio.com/authorize/CNf63bca035414be121d517a116066a5f8?state=' + encodeURIComponent(window.location.href) + '" style="margin-bottom: 10px;"></a>');

}

function generateTwilioToken(plugin_id, prefs, from)
{
	if (prefs.account_sid)
	{
		if (!prefs.app_sid)
		{
			setUpApplication(plugin_id, prefs, from);
		}
		else
		{
			$.get("/core/api/widgets/twilio/token/" + plugin_id, function(token)
			{
				console.log("generated token : " + token);
				setUpTwilio(token, plugin_id, from);
				showTwilioDetails(token, plugin_id);
				return;
			});
		}
	}
}

function setUpApplication(plugin_id, prefs, from)
{
	$.get("/core/api/widgets/twilio/appsid/" + plugin_id, function(data)
	{

		prefs['app_sid'] = data;
		console.log(prefs);

		agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME, JSON.stringify(prefs), function(data)
		{

			generateTwilioToken(plugin_id, prefs, from);

		});
	});

}

function showTwilioDetails(token, plugin_id)
{
	$('#Twilio').html(TWILIO_LOGS_LOAD_IMAGE);

	if (Numbers.length == 0)
	{
		$("#Twilio").html("<div class='widget_content'>" + "No contact number is associated with this contact</div>");
		return;
	}

	var numbers = {};
	numbers['to'] = Numbers;

	// setUpTwilio(token, plugin_id);

	$('#Twilio').html(getTemplate('twilio-profile', numbers));

	$('#twilio_note').hide();
	getTwilioLogs(plugin_id, Numbers[0].value);

	$('#contact_number').die().live('change', function(e)
	{
		var to = $('#contact_number').val();

		getTwilioLogs(plugin_id, to);
	});

}

function getTwilioLogs(plugin_id, to, callback)
{
	$('#twilio-logs-panel').html(TWILIO_LOGS_LOAD_IMAGE);

	$.get("/core/api/widgets/twilio/call/logs/" + plugin_id + "/" + to, function(logs)
	{

		console.log(logs);

		var twilio_logs_template = $(getTemplate('twilio-logs', JSON.parse(logs)));

		$('#twilio-logs-panel').html(twilio_logs_template);

		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", twilio_logs_template).timeago();
		});

		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}

	}).error(function(data)
	{

		$('#logs_load').remove();
		$('#twilio-logs-panel').html('<div style="padding:10px">' + data.responseText + '</div>');
	});
}

function getOutgoingNumbers(plugin_id, callback)
{
	queueGetRequest("widget_queue", "/core/api/widgets/twilio/numbers/" + plugin_id, 'json', function(data)
	{

		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}

	}, function(data)
	{

		$('#twilio_profile_load').remove();
		$('#Twilio').html('<div style="padding:10px">' + data.responseText + '</div>');
	});

}

function getIncomingNumbers(plugin_id, callback)
{
	$.get("/core/api/widgets/twilio/incoming/numbers/" + plugin_id, function(data)
	{

		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}

	}, "json").error(function(data)
	{

		$('#twilio_profile_load').remove();
		$('#Twilio').html('<div style="padding:10px">' + data.responseText + '</div>');
	});

}

function setUpTwilio(token, plugin_id, from)
{

	var start_time;
	var end_time;
	var status;
	var to;

	head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js", function()
	{
		Twilio.Device.setup(token);

		Twilio.Device.ready(function()
		{
			console.log("ready");
			$("#twilio_call").show();

		});

		$("#record_sound_play").die().live("click", function(e)
		{
			e.preventDefault();
			var sound_url = "https://api.twilio.com" + $(this).attr("sound_url");
			console.log(sound_url);

			playSound(sound_url, "true");
		});

		$("#twilio_call").die().live(
				"click",
				function(e)
				{

					e.preventDefault();
					to = $('#contact_number').val();
					var record = "false";

					$("#twilio-record-modal").remove();

					var to_display = {};
					to_display['to'] = to;
					to_display['name'] = agile_crm_get_contact_property('first_name') + " " + agile_crm_get_contact_property('last_name');

					var record_modal = $(getTemplate('twilio-record', to_display));

					// Append the form into the content
					$('#content').append(record_modal);

					// Shows the modal after filling with details
					$("#twilio-record-modal").modal("show");

					$('.enable-call').die().live(
							'click',
							function(e)
							{
								e.preventDefault();
								$("#twilio-record-modal").modal("hide");

								var confirm = $(this).attr('make_call');

								if (confirm == "no")
									return;

								if ($('#enable-record').is(':checked'))
									record = "true";

								console.log(record);
								Twilio.Device.connect({ from : from, PhoneNumber : to, record : record,
									Url : "https://agile-crm-cloud.appspot.com/backend/voice?record=" + record });
							});
				});

		Twilio.Device.offline(function()
		{
			// Called on network connection lost.
			console.log("went offline");
		});

		Twilio.Device.incoming(function(conn)
		{
			console.log(conn.parameters.From); // who is calling
			console.log(conn._status);
			conn.status // => "pending"
			conn.accept();
			conn.status // => "connecting"

			if (conn._status == "open")
			{
				start_time = new Date().getTime();
				status = "incoming";
				console.log(start_time + "incoming started");
				$("#twilio_hangup").show();
				$("#twilio_call").hide();
			}

		});

		Twilio.Device.cancel(function(conn)
		{
			console.log(conn.parameters.From); // who canceled the call
			conn.status // => "closed"
			$("#twilio_hangup").hide();
			$("#twilio_call").show();

		});

		Twilio.Device.connect(function(conn)
		{
			console.log("call is connected");
			// Called for all new connections
			console.log(conn);
			console.log(conn._status);

			if (conn._status == "open")
			{
				start_time = new Date().getTime();
				status = "outgoing";
				console.log(start_time + " outgoing started");
				$("#twilio_hangup").show();
				$("#twilio_call").hide();
			}
		});

		Twilio.Device.disconnect(function(conn)
		{
			console.log("call is disconnected");
			// Called for all disconnections
			console.log(conn);
			if (conn._status == "closed")
			{
				end_time = new Date().getTime();
				console.log(end_time + "ended");
				// addCallNote(start_time,end_time,status);
				getTwilioLogs(plugin_id, to);
				$('#twilio_note').show();
				$("#twilio_hangup").hide();
				$("#twilio_call").show();
			}

		});

		Twilio.Device.presence(function(presenceEvent)
		{
			/*
			 * Called for each available client when this device becomes ready
			 * and every time another client's availability changes.
			 */
			console.log(presenceEvent.from); // => name of client whose availablity changed
			console.log(presenceEvent.available); // => true or false
		});

		Twilio.Device.error(function(e)
		{
			console.log("error");
			console.log(e);
			// 31205 error code
			$("#twilio_hangup").hide();
		});

		$("#twilio_hangup").die().live('click', function(e)
		{
			e.preventDefault();
			console.log("disconnected");

			getTwilioLogs(plugin_id, to);
			Twilio.Device.disconnectAll();
			$("#twilio_hangup").hide();
			$("#twilio_call").show();
		});

	});
}
