// Twilio call noty when user change tab
var Twilio_Call_Noty;

var To_Number;
var To_Name = "";

var Twilio_Token;
var Verfied_Number;
var globalconnection;
var Twilio_Setup_Called = false;
var Twilio_Start = false;
var Restart_Twilio = false;

$(function()
{
	// After 15 sec procedure will start.
	setTimeout(function()
	{
		// after DOM ready.
		if (document.readyState === "complete")
		{
			globalTwilioIOSetup();
		}
	}, 15000); // 15 sec

	$(".noty_twilio_hangup").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("Twilio call hang up from noty");

		Twilio.Device.disconnectAll();
	});

	$(".noty_twilio_dialpad").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("Twilio call dailpad from noty");

		$('.noty_buttons').find('#dialpad_in_twilio').toggle();
	});

	$(".noty_twilio_answer").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("Twilio call answered from noty");

		globalconnection.accept();
	});

	$(".noty_twilio_ignore").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("Twilio call ignore from noty");

		globalconnection.ignore();
	});

	$(".noty_twilio_cancel").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("Twilio call canceld from noty");

		globalconnection.disconnect();

		Twilio.Device.disconnectAll();
	});

	$("#validate_account").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("In validate event");

		if ($(this).text() == "Validating...")
		{
			console.log("Do not hit me again " + $(this).text());
			return;
		}

		// Checks whether all input fields are given
		if (!isValidForm($("#twilioio_login_form")))
		{
			return;
		}

		var acc_sid = $("#twilio_acc_sid").val();
		var auth_token = $("#twilio_auth_token").val();

		// if (acc_sid.match("^AC"))
		{
			// Change validate to validating
			$("#validate_account").text("Validating...");
			$("#validate_account").attr("disabled", true);

			// validate entered details and get verified numbers
			getValidateAndVerfiedCallerId(acc_sid, auth_token, null);
		}
		/*
		 * else alert("Account SID should start with 'AC'");
		 */
	});

	$("#twilio_number").die().live('change', function(e)
	{
		e.preventDefault();
		$("#error-number-not-selected").hide();

		var numberSID = $("#twilio_number option:selected").attr("data");
		console.log("twilio_number change");
		console.log("twilio_number " + $(this).val() + " clicked " + numberSID);

		$("#twilio_number_sid").val(numberSID);
	});

	$("#twilio_from_number").die().live('change', function(e)
	{
		e.preventDefault();
		$("#error-number-not-selected").hide();
	});

	$(".contact-make-twilio-call").die().live('click', function(e)
	{
		e.preventDefault();

		if (Twilio.Device.status() == "busy")
		{
			alert("Already on call.");
			return;
		}

		console.log("phone: " + $(this).attr("phone"));

		twiliocall($(this).attr("phone"), getTwilioIOContactName());
	});

	$("#twilio_acc_sid", "#twilio_auth_token").die().live('click', function(e)
	{
		e.preventDefault();
		$("#note-number-not-available").hide();
	});
});

/*
 * Get token from widget details and setup twilio device. Caller : 1.
 * Twilio.Device.offline 2. init() 3. save_widget_prefs(...)
 */

function globalTwilioIOSetup()
{
	console.log("Twilio_Setup_Called: " + Twilio_Setup_Called);

	if (Twilio_Setup_Called)
		return;

	Twilio_Setup_Called = true;

	// Get Sip widget
	$.getJSON("/core/api/widgets/TwilioIO", function(twilioio_widget)
	{
		console.log("twilioio_widget");
		console.log(twilioio_widget);

		if (twilioio_widget == null)
			return;

		if (twilioio_widget.prefs != undefined)
		{
			twilioio_widget.prefs = eval("(" + twilioio_widget.prefs + ")");

			if (twilioio_widget.prefs.twilio_from_number)
				Verfied_Number = twilioio_widget.prefs.twilio_from_number;
			else
				Verfied_Number = twilioio_widget.prefs.twilio_number;

			getGlobalToken();
		}
	}).error(function(data)
	{
		console.log("twilioio error");
		console.log(data);
	});
}

function getGlobalToken()
{
	console.log("****** In getGlobalToken ******");
	Restart_Twilio = false;

	$.get("/core/api/widgets/twilio/getglobaltoken", function(token)
	{
		console.log("Twilio token " + token);
		Twilio_Token = token;

		setUpGlobalTwilio();

		setTimeout(function()
		{
			if (Twilio.Device.status() == "busy")
			{
				Restart_Twilio = true;
			}
			else
			{
				// Get widget, Create token and set twilio device
				globalTwilioIOSetup();
			}
		}, 86400000); // 24 hr = 86400000ms

	}).error(function(data)
	{
		console.log("Twilio IO error ");
		console.log(data);
	});
}

function getValidateAndVerfiedCallerId(acc_sid, auth_token, callback)
{
	$.get("/core/api/widgets/twilio/validateaccount/" + acc_sid + "/" + auth_token, function(result)
	{
		console.log("Twilio validate account " + result);
		console.log(result);
		result = eval("(" + result + ")");
		console.log("Twilio validate account " + result);

		if (result)
		{
			// Get twilio number
			getTwilioNumbers(acc_sid, auth_token, function(twilioNumbers)
			{
				// Get verified number
				getVerifiedNumbers(acc_sid, auth_token, function(verifiedNumbers)
				{
					addNumbersInUI(twilioNumbers, verifiedNumbers);

					// If defined, execute the callback function
					if (callback && typeof (callback) === "function")
						callback(result);
				});
			});
		}
		else
			setToValidate(result, true);
	}).error(function(data)
	{
		console.log("Twilio validate account error");
		setToValidate(data, true);
	});
}

function addNumbersInUI(twilioNumbers, verifiedNumbers)
{
	console.log("Twilio twilio number " + twilioNumbers + "  " + verifiedNumbers);
	console.log("Twilio twilio number " + twilioNumbers.length + "  " + verifiedNumbers.length);
	// console.log("Twilio twilio number " + twilioNumbers[0].PhoneNumber+" "
	// +verifiedNumbers[0].PhoneNumber );

	// no twilio # as well as no verified #
	if (twilioNumbers.length == 0 && verifiedNumbers.length == 0)
	{
		// Reset form
		setToValidate("no number", false);

		// Add error msg at bottom of form
		$("#note-number-not-available").html("You have no twilio numbers and verified numbers.");
		$("#note-number-not-available").show();
	}
	// twilio # is available but no verified #
	else if (twilioNumbers.length != 0 && verifiedNumbers.length == 0)
	{
		// Add note at bottom you do not have verified #
		$("#note-number-not-available").html("You have no verified numbers. Please verify number in your Twilio account.");
		$("#note-number-not-available").show();

		// If no numbers
		if (!twilioNumbers[0].PhoneNumber)
		{
			alert("You have no twilio numbers. Please buy or port a number in your Twilio account.");
			return;
		}

		console.log("Twilio twilio number " + twilioNumbers[0].PhoneNumber);

		// Add verified number in UI
		addTwilioNumbersInUI(twilioNumbers);

		// Hide validate button
		$("#validate_account").hide();

		// Show save button
		$("#save_prefs").show();

		// Hide twilio from numbers list
		$("#twilio_from_numbers").hide();

		// Show twilio numbers list
		$("#twilio_numbers").show();
		
		$("#twilio_number").addClass("required");
	}
	// verified # is available but no twilio #
	else if (twilioNumbers.length == 0 && verifiedNumbers.length != 0)
	{
		// Add note at bottom you do not have twilio #
		$("#note-number-not-available").html("You have no twilio numbers. Please buy or port a number in your Twilio account.");
		$("#note-number-not-available").show();

		// If no numbers
		if (!verifiedNumbers[0].PhoneNumber)
		{
			alert("You have no verified numbers. Please verify number in your Twilio account.");
			return;
		}

		console.log("Twilio verified number " + verifiedNumbers[0].PhoneNumber);

		// Add verified number in UI
		addVerifiedCallerIdInUI(verifiedNumbers);

		// Hide validate button
		$("#validate_account").hide();

		// Show save button
		$("#save_prefs").show();

		// Show twilio from numbers list
		$("#twilio_from_numbers").show();

		// Hide twilio numbers list
		$("#twilio_numbers").hide();
		
		$("#twilio_from_number").addClass("required");
	}
	// both available
	else if (twilioNumbers.length != 0 && verifiedNumbers.length != 0)
	{
		// Add verified number in UI
		addTwilioNumbersInUI(twilioNumbers);

		// Add verified number in UI
		addVerifiedCallerIdInUI(verifiedNumbers);

		// Hide validate button
		$("#validate_account").hide();

		// Show save button
		$("#save_prefs").show();

		// Show twilio from numbers list
		$("#twilio_from_numbers").show();

		// Show twilio numbers list
		$("#twilio_numbers").show();
	}
}

function setToValidate(data, showAlert)
{
	// Change validate to validating
	$("#validate_account").text("Validate");
	$("#validate_account").attr("disabled", false);

	console.log("Twilio error ");
	console.log(data);

	if (showAlert)
		alert("Please enter valid details.");

	// Reset form fields after sending email
	$("#twilioio_login_form").each(function()
	{
		this.reset();
	});
}

function getTwilioNumbers(acc_sid, auth_token, callback)
{
	$.get("/core/api/widgets/twilio/gettwilionumbers/" + acc_sid + "/" + auth_token, function(result)
	{
		console.log("Twilio getTwilioNumbers " + result);
		console.log(result);
		result = eval("(" + result + ")");
		console.log("Twilio getTwilioNumbers " + result);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(result);
	}).error(function(data)
	{
		console.log("error in getTwilioNumbers");
		setToValidate(data, true);
	});
}

function getVerifiedNumbers(acc_sid, auth_token, callback)
{
	$.get("/core/api/widgets/twilio/getverifiednumbers/" + acc_sid + "/" + auth_token, function(result)
	{
		console.log("Twilio getVerifiedNumbers " + result);
		console.log(result);
		result = eval("(" + result + ")");
		console.log("Twilio getVerifiedNumbers " + result);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(result);
	}).error(function(data)
	{
		console.log("error in getVerifiedNumbers");
		setToValidate(data, true);
	});
}

function addTwilioNumbersInUI(result)
{
	var phoneNumberHtml = '<option value="" default selected style="display:none;">Select a Twilio number</option>';
	var optionHtml = "";

	// Collect all twilio number for display
	$.each(result, function(index, phoneNumber)
	{
		optionHtml = '<option data="' + phoneNumber.Sid + '" value="' + phoneNumber.PhoneNumber + '">' + phoneNumber.PhoneNumber + '</option>';
		phoneNumberHtml = phoneNumberHtml + optionHtml;
	});

	// Add verified number in list
	$("#twilio_number").html(phoneNumberHtml);
}

function addVerifiedCallerIdInUI(result)
{
	var phoneNumberHtml = '<option value="" default selected style="display:none;">Select a verifed number</option>';
	var optionHtml = "";

	// Collect all verified number for display
	$.each(result, function(index, phoneNumber)
	{
		optionHtml = '<option value="' + phoneNumber.PhoneNumber + '">' + phoneNumber.PhoneNumber + '</option>';
		phoneNumberHtml = phoneNumberHtml + optionHtml;
	});

	// Add verified number in list
	$("#twilio_from_number").html(phoneNumberHtml);
}

//
function createAppSid(twilioio_prefs, callback)
{
	console.log("In createAppSid");
	var numberSid = "None";
	if (twilioio_prefs.twilio_number_sid != "")
		numberSid = twilioio_prefs.twilio_number_sid;

	$.get("/core/api/widgets/twilio/createappsid/" + twilioio_prefs.twilio_acc_sid + "/" + twilioio_prefs.twilio_auth_token + "/" + numberSid, function(result)
	{
		console.log("Twilio createAppSid " + result);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(result);
	}).error(function(data)
	{
		console.log("Twilio get app sid error ");
		console.log(data);

		alert("Please try again with valid details.");

		$("#save_prefs").text("Save");
		$("#save_prefs").attr("disabled", false);
		$("#save_prefs").hide();
		$("#validate_account").text("Validate");
		$("#validate_account").attr("disabled", false);
		$("#validate_account").show();

		// Show twilio from numbers list
		$("#twilio_from_numbers").hide();

		// Show twilio numbers list
		$("#twilio_numbers").hide();

		// Reset form fields after sending email
		$("#twilioio_login_form").each(function()
		{
			this.reset();
		});
	});
}

function fill_twilioio_numbers()
{
	// Hide validate button
	$("#validate_account").hide();

	// Show save button
	$("#save_prefs").show();

	$("#save_prefs").text("Loading...");
	$("#save_prefs").attr("disabled", true);

	// Retrieves widget which is fetched using script API
	// Get TwilioIO widget
	$.getJSON("/core/api/widgets/TwilioIO", function(twilioio_widget)
	{
		if (twilioio_widget == null)
			return;

		console.log("twilioio_widget");
		console.log(twilioio_widget);

		if (twilioio_widget.prefs != undefined)
		{
			twilioio_widget.prefs = eval("(" + twilioio_widget.prefs + ")");

			getValidateAndVerfiedCallerId(twilioio_widget.prefs.twilio_acc_sid, twilioio_widget.prefs.twilio_auth_token, function(data)
			{
				console.log("In callback getValidateAndVerfiedCallerId");
				$('#twilio_from_number').val(twilioio_widget.prefs.twilio_from_number);
				$('#twilio_number').val(twilioio_widget.prefs.twilio_number);
				$('#twilio_number_sid').val(twilioio_widget.prefs.twilio_number_sid);
				$("#save_prefs").text("Save");
				$("#save_prefs").attr("disabled", false);
			});
		}
	}).error(function(data)
	{
		console.log("twilioio_widget error");
		console.log(data);
	});
}

//Get name of contact
function getTwilioIOContactName()
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

function setUpGlobalTwilio()
{
	// Loads twilio min.js to intiliaze twilio call events
	head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js", function()
	{
		Twilio.Device.setup(Twilio_Token);

		if (Twilio_Start)
			return;

		Twilio_Start = true;

		Twilio.Device.ready(function(device)
		{
			console.log("ready");

			console.log("in twilio ready Twilio_Setup_Called: " + Twilio_Setup_Called);
			Twilio_Setup_Called = false;

			// Make call option visible on contact detail page
			if (Sip_Stack != undefined && Sip_Register_Session != undefined && Sip_Start == true)
			{
				$(".contact-make-sip-call").show();
				$(".contact-make-twilio-call").hide();
				$(".contact-make-call").hide();
			}
			else if (Twilio.Device.status() == "ready" || Twilio.Device.status() == "busy")
			{
				$(".contact-make-sip-call").hide();
				$(".contact-make-twilio-call").show();
				$(".contact-make-call").hide();
			}
		});

		Twilio.Device.error(function(error)
		{
			console.log("Twilio error");
			console.log(error);
			console.log(error.code);

			if (Twilio.Device.status() == "busy")
			{
				alert("A connection is currently active.");
				return;
			}

			closeTwilioNoty();

			// Token expired error
			if (error.code == "31205")
			{
				// Get widget, Create token and set twilio device
				globalTwilioIOSetup();
			}
		});

		Twilio.Device.connect(function(conn)
		{
			console.log("Twilio call is connected");
			// Called for all new connections
			console.log(conn);
			console.log(conn._status);
			globalconnection = conn;

			showCallNotyPopup("connected", "Twilio", "<b>On call : </b><br>" + To_Name + "   " + To_Number + "<br>", false);
		});

		Twilio.Device.disconnect(function(conn)
		{
			console.log("Twilio call is disconnected");
			// Called for all disconnections
			console.log(conn);

			if (Twilio.Device.status() != "busy")
			{
				closeTwilioNoty();
				if (Restart_Twilio == true)
				{
					// Get widget, Create token and set twilio device
					globalTwilioIOSetup();
				}
			}
		});

		Twilio.Device
				.incoming(function(conn)
				{
					console.log("Incoming connection from " + conn.parameters.From);
					
					if (Twilio.Device.status() == "busy")
					{
						console.log("getting one more call.");
						conn.disconnect();
						conn.reject();
						return;
					}

					globalconnection = conn;

					// accept the incoming connection and start two-way audio
					// conn.accept();
					To_Number = globalconnection.parameters.From;

					showCallNotyPopup("incoming", "Twilio",
							'<i class="icon icon-phone"></i><b>Incoming call :</b><br> ' + To_Name + "   " + To_Number + "<br>", false);
				});

		// If any network failure, show error
		Twilio.Device.offline(function()
		{
			// Called on network connection lost.
			console.log("Twilio went offline");

			closeTwilioNoty();

			// Get widget, Create token and set twilio device
			// globalTwilioIOSetup();
		});

		// When call is cancelled, hide hang up and show call
		Twilio.Device.cancel(function(conn)
		{
			// who canceled the call
			console.log(conn.parameters.From);

			closeTwilioNoty();
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
	});
}
function twiliocall(phoneNumber, toName)
{
	// get the phone number to connect the call to
	params = { "from" : Verfied_Number, "PhoneNumber" : phoneNumber };
	Twilio.Device.connect(params);

	To_Number = phoneNumber;
	To_Name = toName;

	showCallNotyPopup("outgoing", "Twilio", '<i class="icon icon-phone"></i><b>Calling :</b><br> ' + To_Name + "   " + To_Number + "<br>", false);
}

// Send DTMF signal to twilio active connection from dialpad.
function twilioSendDTMF(digit)
{
	console.log("twilioSendDTMF: " + digit);

	// session for call is active and number is available.
	if (Twilio.Device.status() == "busy" && digit)
	{
		// send dtmf on twilio
		// if (connection)
		globalconnection.sendDigits(digit);
	}
}

function closeTwilioNoty()
{
	if (Twilio.Device.status() == "busy")
		return;

	globalconnection = undefined;
	To_Number = undefined;
	To_Name = "";

	// Close noty
	if (Twilio_Call_Noty != undefined)
	{
		Twilio_Call_Noty.close();
		Twilio_Call_Noty = undefined;
	}
}
