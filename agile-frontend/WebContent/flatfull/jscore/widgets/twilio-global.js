// Twilio call noty when user change tab
var Twilio_Call_Noty;
var Twilio_Call_Noty_IMG = "";

var To_Number;
var To_Name = "";

var Twilio_Token;
var Verfied_Number;
var globalconnection;
var Twilio_Setup_Called = false;
var Twilio_Start = false;
var Restart_Twilio = false;
TWILIO_CONTACT_ID = 0;
TWILIO_CALLTYPE = "";
TWILIO_DIRECTION = "";
TWILIO_CALLED_NO = "";
TWILIO_IS_VOICEMAIL = false;

function initializeTwilioGlobalListeners(){
	
}

$(function(){

	// After 15 sec procedure will start.
	setTimeout(function()
	{
		// after DOM ready.
		if (document.readyState === "complete")
		{
			globalTwilioIOSetup();
		}
	}, 10000); // 15 sec
    
    $('body').off('click', '.noty_twilio_mute');
	$('body').on('click', '.noty_twilio_mute', function(e)
			{
				e.preventDefault();
				console.log("Twilio call noty_twilio_mute from noty");
				
				globalconnection.mute(true);
				
				$('.noty_buttons').find('.noty_twilio_unmute').toggle();
				$('.noty_buttons').find('.noty_twilio_mute').toggle();
			});
	
    $('body').off('click', '.noty_twilio_unmute');
	$('body').on('click', '.noty_twilio_unmute', function(e)
			{
				e.preventDefault();
				console.log("Twilio call noty_twilio_unmute from noty");

				globalconnection.mute(false);
				
				$('.noty_buttons').find('.noty_twilio_unmute').toggle();
				$('.noty_buttons').find('.noty_twilio_mute').toggle();
			});
	
	$('body').off('click', '.noty_twilio_hangup');
	$('body').on('click', '.noty_twilio_hangup', function(e)
	{
		e.preventDefault();
		console.log("Twilio call hang up from noty");

		Twilio.Device.disconnectAll();
	});

    $('body').off('click', '.noty_twilio_dialpad');
	$('body').on('click', '.noty_twilio_dialpad', function(e)
	{
		e.preventDefault();
		console.log("Twilio call dailpad from noty");

		$('.noty_buttons').find('#dialpad_in_twilio').toggle();
	});
	
	//START voice mails
    $('body').off('click', '#noty_twilio_voicemail');
	$('body').on('click', '#noty_twilio_voicemail', function(e){
		e.preventDefault();
		var voiceMailCount = parseInt($(this).attr('data-length'));
		if(voiceMailCount === 1) {
			sendVoiceAndEndCall($(this).attr('data-src'));
		} else {
			$("#splitButtonVoicemail").trigger("click");
		}
	});
	
    $('body').off('click', '.voiceMailItem');
	$('body').on('click', '.voiceMailItem', function(e){
		e.preventDefault();
		sendVoiceAndEndCall($(this).attr('data-src'));
	});
		
	//END voice mails related
    $('body').off('click', '.noty_twilio_answer');
	$('body').on('click', '.noty_twilio_answer', function(e)
	{
		e.preventDefault();
		console.log("Twilio call answered from noty");

		globalconnection.accept();
	});

    $('body').off('click', '.noty_twilio_ignore');
	$('body').on('click', '.noty_twilio_ignore', function(e)
	{
		e.preventDefault();
		console.log("Twilio call ignore from noty");

		globalconnection.ignore();
		if(CALL_CAMPAIGN.start){
				CALL_CAMPAIGN.state = "START";
				dialNextCallManually();			
	}
	});

    $('body').off('click', '.noty_twilio_cancel');
	$('body').on('click', '.noty_twilio_cancel', function(e)
	{
		e.preventDefault();
		console.log("Twilio call canceld from noty");

		//globalconnection.disconnect();

		Twilio.Device.disconnectAll();
	});

    $('body').off('click', '#validate_account');
	$('body').on('click', '#validate_account', function(e)
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

    $('body').off('change', '#twilio_number');
	$('body').on('change', '#twilio_number', function(e)
	{
		e.preventDefault();
		$("#error-number-not-selected").hide();

		var numberSID = $("#twilio_number option:selected").attr("data");
		console.log("twilio_number change");
		console.log("twilio_number " + $(this).val() + " clicked " + numberSID);

		$("#twilio_number_sid").val(numberSID);
	});
	
    $('body').off('change', '#twilio_from_number');
	$('body').on('change', '#twilio_from_number', function(e)
	{
		e.preventDefault();
		$("#error-number-not-selected").hide();
	});

    $('body').off('click', '.contact-make-twilio-call,.TwilioIO_call');
	$('body').on('click', '.contact-make-twilio-call, .TwilioIO_call', function(e)
	{
		e.preventDefault();
		TWILIO_CALLTYPE = "Outgoing";
		TWILIO_DIRECTION = "outbound-dial";
		TWILIO_IS_VOICEMAIL = false;
		
//		alert("connecting twilio call");
		
		var contactDetailsObj = agile_crm_get_contact();
		TWILIO_CONTACT_ID = contactDetailsObj.id;
//		alert(TWILIO_CONTACT_ID);

		if (Twilio.Device.status() == "busy"  || checkForActiveCall())
		{
			alert("Already on call.");
			return;
		}

		console.log("phone: " + $(this).closest(".contact-make-call").attr("phone"));

		if(CALL_CAMPAIGN.start )
			  {
				if(CALL_CAMPAIGN.state == "PAUSE"){
					alert("Already on call");
					return;
				}
				CALL_CAMPAIGN.state = "PAUSE" ;
			  }
		twiliocall($(this).closest(".contact-make-call").attr("phone"), getContactName(contactDetailsObj));
	});

	$('body').off('click', '#twilio_acc_sid, #twilio_auth_token');
    $('body').on('click', '#twilio_acc_sid, #twilio_auth_token', function(e)
	{
		e.preventDefault();
		$("#note-number-not-available").hide();
	});
	
    $('body').off('click', '.twilioio-advance-settings');
	$('body').on('click', '.twilioio-advance-settings', function(e)
	 {
		e.preventDefault();
		
		// If twimlet url is none so display nothing
		if("None" == $("#twilio_twimlet_url").val())
			$("#twilio_twimlet_url").val(""); 
		
		// Toggle advanced settings
		$(".twilioio-advance-settings-hide").toggle();
	    $(".twilioio-advance-settings-show").toggle();
	    $("#twilio_recording").toggle();
	    $("#twilio_twimlet_url_controls").toggle();
	 });

    $('body').off('click', '#twilio_verify_settings');
	$('body').on('click', '#twilio_verify_settings', function(e)
			{
				e.preventDefault();

				getTemplate('twilio-initial', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#widget-settings').html($(template_ui));	

				}, "#widget-settings");
			});
	
		/*
		 * If Twilio account doesn't have numbers, we need to verify numbers in
		 * Twilio.On click of verify button in Twilio initial template,
		 * verifyNumberFromTwilio is called to verify a number in Twilio
		 */
        $('body').off('click', '#twilio_verify');
		$('body').on('click', '#twilio_verify', function(e)
		{
			e.preventDefault();

			// Checks whether all input fields are given
			if (!isValidForm($("#twilio_call_form")))
				return;

			// From number to make calls as entered by user
			var from_number = $('#twilio_from').val();
			console.log("Twilio verify from number: " + from_number);

			$.getJSON("core/api/widgets/Twilio", function(data)
					{
						console.log(data);
						
						if(data)
						{
							/*
							 * Verifies a number in Twilio and shows verification code in the Twilio
							 * template with a procced button
							 */
							verifyNumberFromTwilio(from_number, data.id, function(verified_data)
							{
								verified_data["settings"] = true;
								// Append the url with the random number in order to differentiate the same action performed more than once.
								verified_data["id"] = Math.floor((Math.random()*10)+1);
								
								console.log(verified_data);
								getTemplate('twilio-verify', verified_data, undefined, function(template_ui){
									if(!template_ui)
										  return;

									$('#widget-settings').html($(template_ui));	
								}, "#widget-settings");

							});
						}
					});
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

		// Restart twilio after 24 hrs with new token, because token life is 24hrs
		setTimeout(function()
		{
			// After 24hrs check where call is connected or not 
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
	
	// Show record call option on form
	//$("#twilio_recording").show();
	
	// Show twimlet url controls
	//$("#twilio_twimlet_url_controls").show();
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

	optionHtml = '<option data="" value="">None</option>';
	phoneNumberHtml = phoneNumberHtml + optionHtml;
	
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

	optionHtml = '<option data="" value="">None</option>';
	phoneNumberHtml = phoneNumberHtml + optionHtml;
	
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

	if (twilioio_prefs.twilio_twimlet_url == "")
		twilioio_prefs.twilio_twimlet_url = "None";
	
	$.get("/core/api/widgets/twilio/createappsid/" + twilioio_prefs.twilio_acc_sid + "/" + twilioio_prefs.twilio_auth_token + "/" + numberSid+ "/" + twilioio_prefs.twilio_record+ "/" + encodeURIComponent(twilioio_prefs.twilio_twimlet_url), function(result)
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

		// Hide record call option on form
		//$("#twilio_recording").hide();
		
		// Hide twimlet url controls
		//$("#twilio_twimlet_url_controls").hide();
		
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
			
			// Show advanced settings if data available
			if((twilioio_widget.prefs.twilio_record == "true") || (twilioio_widget.prefs.twilio_twimlet_url != "None"))
				$(".twilioio-advance-settings").click();

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

function setUpGlobalTwilio()
{
	// Loads twilio min.js to intiliaze twilio call events
	head.js("https://static.twilio.com/libs/twiliojs/1.2/twilio.min.js", function()
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

	
		});

		Twilio.Device.error(function(error)
		{
			console.log("Twilio error");
			console.log(error);
			console.log(error.code);

			if (Twilio.Device.status() == "busy")
			{
				if(!(CALL_CAMPAIGN.start && CALL_CAMPAIGN.call_from_campaign)){
					alert("A connection is currently active.");
					return;
				}
			}
			Twilio.Device.disconnectAll();

			closeTwilioNoty();

			// Token expired error
			if (error.code == "31205")
			{
				// Get widget, Create token and set twilio device
				globalTwilioIOSetup();
			}
			
			if (error.code == "31000")
			{
				// Get widget, Create token and set twilio device
				Twilio_Start = false;
				setUpGlobalTwilio();
			}
/*			if(CALL_CAMPAIGN.state == "START" ){
				restartCalling();
			}*/
		});

		Twilio.Device.connect(function(conn)
		{
			console.log("Twilio call is connected");
			// Called for all new connections
			console.log(conn);
			console.log(conn._status);
			globalconnection = conn;

				// If call campaign then update call noty
				if(CALL_CAMPAIGN.start && CALL_CAMPAIGN.call_from_campaign)
				  {
					
						// Change status of call
						CALL_CAMPAIGN.call_status = "CONNECTED";				
						
						// Start all timers
						//setTimerCallDuration();
						
						// Edit call status on call noty
						//$(".call_status").html("On Call");
						//$("#currentTime").html("");
						editCallContainer();
						
						return;
					 
				  }else{
						//TWILIO_CALLTYPE = "Incoming";
						//TWILIO_DIRECTION = "inbound";
						//To_Number = globalconnection.parameters.From;
						//To_Name = searchForContact(To_Number);
						//Twilio_Call_Noty_IMG = addContactImg("Incoming");
					  
						console.log("calling call noty");
						showCallNotyPopup("connected", "Twilio", Twilio_Call_Noty_IMG+'<span class="noty_contact_details"><b>On call  </b>' + To_Number +'<br><a href="#contact/'+TWILIO_CONTACT_ID+'" style="color: inherit;">' + To_Name + '</a><br></span><div class="clearfix"></div>', false);
					 }		
		});

		Twilio.Device.disconnect(function(conn)
		{
			
			console.log("Twilio call is disconnected");

			if(CALL_CAMPAIGN.start){
				CALL_CAMPAIGN.call_status = "DISCONNECTED";
			}
			// Called for all disconnections
			console.log(conn);
			
			var phoneNumber = To_Number;
			var messageObj = conn.message;
			
			if (Twilio.Device.status() != "busy")
			{
				closeTwilioNoty();
					if(globalconnection){
						globalconnection.mute(false);
					}				

				// after disconnect check If restart is set so restart twilio with new token.
				// restart is set after 24hrs
				if (Restart_Twilio == true)
				{
					// Get widget, Create token and set twilio device
					globalTwilioIOSetup();
				}
			}
			
			try{
				// Get all call logs for widget only on cotact detail page
				if(window.location.hash.indexOf("contact/") != -1)
				  {
					if(typeof getTwilioIOLogs == 'undefined')
						return;
					
					getTwilioIOLogs(phoneNumber);
					
					// Change selected number if its different than calling number.
					var selectedNumber = $('#contact_number').val();
					if(selectedNumber != phoneNumber)
					{
						$("#contact_number").val(phoneNumber);
					}
				  }		
			}catch(err){
				console.log('error in log fetching' + err.message);
			}
	   	
			
		
		try{
			// notes related code			
			console.log("calSid new  " + conn.parameters.CallSid);
			
			
			twilioGetWidgetDetails(function(data){

				var widgetDetails = data;
				var widgetPrefs = $.parseJSON(data.prefs);
				var acc_sid = widgetPrefs.twilio_acc_sid;
				var auth_token = widgetPrefs.twilio_auth_token;	
				var isParent = "true";
				if(TWILIO_CALLTYPE == "Incoming") {
					isParent = "false";
				}

				var ApiCallUrl = "/core/api/widgets/twilio/getlastcall/" + acc_sid + "/" + auth_token + "/" + conn.parameters.CallSid + "/" + isParent;
				console.log(ApiCallUrl);
				if(!widgetDetails)
					return;

				twilioApiRequest(ApiCallUrl, function(data){
						var callDetails  = data;
						console.log("Call Details : isParent " + isParent);
						console.log(callDetails);
						
						if(!callDetails)
							return;

						var callDetailsJson = $.parseJSON(callDetails.responseText);
						if(isParent == "true")
							var callRespJson = callDetailsJson.calls[0];
						else
							var callRespJson = callDetailsJson;
						
						if(typeof callRespJson != "undefined") {
							if(typeof callRespJson.status != "undefined") {
								if(callRespJson.status != "completed" && CALL_CAMPAIGN.start){
									CALL_CAMPAIGN.state = "DISCONNECTED";
								}
								console.log(callRespJson.status);
								showNoteAfterCall(callRespJson,messageObj);
							}
						} else {
							if(CALL_CAMPAIGN.start){
								CALL_CAMPAIGN.state = "DISCONNECTED";
							}						

						}
						
							//if the call campaign is started then we try to make a next call from campaign
								if(($("#noteModal").data('bs.modal') || {}).isShown != true){
								if(CALL_CAMPAIGN.start)
								  {
									if(CALL_CAMPAIGN.call_from_campaign ){
											// if state is pause i.e callresp.status != completed then make another call
								
													if(TWILIO_IS_VOICEMAIL){
														TWILIO_IS_VOICEMAIL = false;
													}
													CALL_CAMPAIGN.state = "START";
														
													  if(CALL_CAMPAIGN.autodial){
														  dialNextCallAutomatically();
													  }else{
														  if(CALL_CAMPAIGN.last_clicked == "NEXT" || CALL_CAMPAIGN.last_clicked == "PREVIOUS"){
															  dialNextCallAutomatically();
														  }else{
															  dialNextCallManually();
														  }
													  }
									}else{
											CALL_CAMPAIGN.state = "START";
											dialNextCallManually();
										  }
								  	}	
								}
				});			

			});
			}catch(err){
				console.log("error --> " + err.message);
				if(CALL_CAMPAIGN.start)
				  {
					CALL_CAMPAIGN.state = "START";
					dialNextCallAutomatically();
				}
			}										
		});

		Twilio.Device
				.incoming(function(conn)
				{
					TWILIO_CALLTYPE = "Incoming";
					TWILIO_DIRECTION = "inbound";
					TWILIO_IS_VOICEMAIL = false;
					TWILIO_CONTACT_ID = 0;
					globalconnection = conn;
					var previousDialled;
					
						if(To_Number){
							previousDialled = To_Number;
						}
					
					To_Number = globalconnection.parameters.From;
					console.log("Incoming connection from " + conn.parameters.From);
					console.log("globalconnection status: "+globalconnection.status());


					addContactImg("Incoming", function(img){
						Twilio_Call_Noty_IMG = img;
					
						if (Twilio.Device.status() == "busy" || (CALL_CAMPAIGN.call_status == "CONNECTED" || CALL_CAMPAIGN.call_status == "CALLING" || CALL_CAMPAIGN.autodial == true))
						{
							console.log("getting one more call.");

							showCallNotyPopup("missedCall", "error", Twilio_Call_Noty_IMG+'<span class="noty_contact_details"><b>Missed call : </b><br>' + conn.parameters.From + '<br></span><div class="clearfix"></div>', 5000);
							if(previousDialled){
								To_Number = previousDialled ;  
							}
							conn.reject();						
							if (conn)
								conn.disconnect();
							return;
						}
					
						if(CALL_CAMPAIGN.start){
							CALL_CAMPAIGN.state = "PAUSE";
						}

					// accept the incoming connection and start two-way audio
					// conn.accept();

						searchForContact(To_Number, function(name){
								To_Name = name;


								showCallNotyPopup("incoming", "Twilio",
										Twilio_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Incoming call </b>'+ To_Number + '<br><a href="#contact/'+TWILIO_CONTACT_ID+'" style="color: inherit;">' + To_Name + '</a><br></span><div class="clearfix"></div>', false);										
						});
					});	
					
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
			
			console.log("Incoming call calSid new  " + conn.parameters.CallSid);
			
			var messageObj = conn.message;	

			twilioGetWidgetDetails(function(data){

				var widgetDetails = data;
				var widgetPrefs = $.parseJSON(widgetDetails.prefs);
				var acc_sid = widgetPrefs.twilio_acc_sid;
				var auth_token = widgetPrefs.twilio_auth_token;	
				var isParent = "true";
				if(TWILIO_CALLTYPE == "Incoming") {
					isParent = "false";
				}
				var ApiCallUrl = "/core/api/widgets/twilio/getlastcall/" + acc_sid + "/" + auth_token + "/" + conn.parameters.CallSid + "/" + isParent;
				console.log(ApiCallUrl);
				if(!widgetDetails)
					return;
				
				twilioApiRequest(ApiCallUrl, function(data1){

					var callDetails  = data1;
					console.log(callDetails);
					
					if(!callDetails)
						return;
					
					var callRespJson = $.parseJSON(callDetails.responseText);
					
					if(typeof callRespJson != "undefined") {
						if(typeof callRespJson.status != "undefined") {
							console.log(callRespJson.status);
							showNoteAfterCall(callRespJson,messageObj);
						}
					} 
					// added for call campaign
					if(CALL_CAMPAIGN.start){
						CALL_CAMPAIGN.state = "START";	
						if(CALL_CAMPAIGN.autodial){
							dialNextCallAutomatically();
						}else{
							dialNextCallManually();
						}
					}	

				});
			});		
			
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
	
	params = { "from" : Verfied_Number, "PhoneNumber" : phoneNumber};

	// if call campaign is running then modify call container	
	try{
		if(CALL_CAMPAIGN.start)
		  {
				if(Twilio.Device.status() == "busy" || CALL_CAMPAIGN.call_status == "CONNECTED" || CALL_CAMPAIGN.call_status == "CALLING"){
					return;
				}
				
			if(CALL_CAMPAIGN.call_from_campaign)
			  {
				// Change status of call
				TWILIO_CALLTYPE = "Outgoing";
				TWILIO_DIRECTION = "outbound-dial";
				CALL_CAMPAIGN.call_status = "CALLING";		
				$("#pauseCallDiv").hide();
				$("#callStartText").html("");
				$("#callStartTime").html("");
				$("#callPauseText").hide();
				// Edit call status on call noty
				//$(".call_status").html("Calling");
		  	  }
		  }	
	}catch(err) {
		console.log("error --> " + err.message);
		Twilio.Device.disconnectAll();
		$("#callStartText").html("");
		$("#callStartTime").html("");
		return;
	}
	
	Twilio.Device.connect(params);

	To_Number = phoneNumber;
	To_Name = toName;
	TWILIO_CALLED_NO = To_Number;	
	
	if(!CALL_CAMPAIGN.call_from_campaign){
		addContactImg("Outgoing", function(img){
			Twilio_Call_Noty_IMG = img;
			// this was added to remve the error of popup message	
				console.log("calling call noty");
				showCallNotyPopup("outgoing", "Twilio", Twilio_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Calling </b>'+ To_Number +'<br><a href="#contact/'+TWILIO_CONTACT_ID+'" style="color: inherit;">' + To_Name + '</a><br></span><div class="clearfix"></div>', false);
		});		
	}	
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

function showNoteAfterCall(callRespJson,messageObj)
{
	if(!(TWILIO_IS_VOICEMAIL == false))
		   return;

	var	el = $("#noteForm");
	//	TWILIO_CONTACT_ID = 0;

	if(CALL_CAMPAIGN.start){
		if(TWILIO_CALLTYPE == "Outgoing" && CALL_CAMPAIGN.call_from_campaign){
			getContactDetails();
		}
	}
	if(TWILIO_CONTACT_ID) {

		accessUrlUsingAjax("core/api/contacts/"+TWILIO_CONTACT_ID, function(resp){

			console.log(callRespJson);
			var json = resp;
			if(json == null) {
				return showNewContactModal(messageObj);
			}

			var contact_name = getContactName(json);
			var noteSub = "";
			var friendlyStatus = "";
			var callStatus = callRespJson.status;

			if(callStatus != 404 && typeof callRespJson.duration != "undefined") {
			
					var phoneNumber = "";
					if(TWILIO_DIRECTION == "outbound-dial") {
		//				phoneNumber = callRespJson.to;
						phoneNumber = TWILIO_CALLED_NO;
						TWILIO_CALLED_NO = "";
						
						$.post( "/core/api/widgets/twilio/savecallactivityById",{
							id:TWILIO_CONTACT_ID,
							direction: TWILIO_DIRECTION, 
							phone: phoneNumber, 
							status : callRespJson.status,
							duration : callRespJson.duration 
							});
					}
					else{
						phoneNumber = callRespJson.from;
						$.post( "/core/api/widgets/twilio/savecallactivity",{
							direction: TWILIO_DIRECTION, 
							phone: phoneNumber, 
							status : callRespJson.status,
							duration : callRespJson.duration 
							});
					}
						
					

					
					switch(callStatus) {
				    case "canceled":
				    	noteSub = TWILIO_CALLTYPE + " call - Declined";
				    	friendlyStatus = "Declined";
				        break;
				    case "completed":
				    	noteSub = TWILIO_CALLTYPE + " call - Done";
				    	friendlyStatus = "Done";
				    	break;
				    case "busy":
				    	noteSub = TWILIO_CALLTYPE + " call - Busy";
				    	friendlyStatus = "Received busy tone on number "+ phoneNumber;
				    	break;
				    case "failed":
				    	noteSub = TWILIO_CALLTYPE + " call - Failed";
				    	friendlyStatus = TWILIO_CALLTYPE + " call made to "+ phoneNumber +" has failed";
				    	break;
				    case "no-answer":
				    	noteSub = TWILIO_CALLTYPE + " call - No answer";
				    	friendlyStatus = "No answer";
				    	break;
				    default:
				        return;
					}
				 	// Adds contact name to tags ul as li element
					if(callStatus == "completed") {
						var data = {};
						data.subject = noteSub;
						data.number = To_Number;
						data.callType = TWILIO_DIRECTION;
						data.status = "answered";
						data.duration = callRespJson.duration;
						data.contId = json.id;
						data.contact_name = contact_name;
						showDynamicCallLogs(data);

						//changed by prakash to add the last_called parameter and last_connected parameter of contact object on server side - 15/6/15
							if(TWILIO_DIRECTION == "outbound-dial") {
								twilioIOSaveContactedTime();	
							//code to be written to save tag to cotacts for call campaign...
							if(CALL_CAMPAIGN.start && CALL_CAMPAIGN.call_from_campaign){
								updateTotalTime(callRespJson.duration);
								saveTagForCampaign();
							}
							}
											
					} else {
						//add note automatically
						$.post( "/core/api/widgets/twilio/autosavenote", {
							subject: noteSub,
							message: "",
							contactid: TWILIO_CONTACT_ID
							});
					}
				}
		});
			
	} else {
		var phoneNumber = "";
		if(TWILIO_DIRECTION == "outbound-dial"){
			phoneNumber = callRespJson.to;
			$.post( "/core/api/widgets/twilio/savecallactivityById",{
				id:TWILIO_CONTACT_ID,
				direction: TWILIO_DIRECTION, 
				phone: phoneNumber, 
				status : callRespJson.status,
				duration : callRespJson.duration 
				});
		}
		else{
			phoneNumber = callRespJson.from;
			$.post( "/core/api/widgets/twilio/savecallactivity",{
				direction: TWILIO_DIRECTION, 
				phone: phoneNumber, 
				status : callRespJson.status,
				duration : callRespJson.duration 
				});
		}

		return showNewContactModal(phoneNumber);
	}
	
}


function showNewContactModal(phoneNumber) {
	$('#personModal').modal('show');
	$("#personForm").find("#phone").val(phoneNumber);
	return;
}

function twilioSecondsToFriendly(time) {
	var hours = Math.floor(time / 3600);
	if(hours > 0)
	time = time - hours*60*60;
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	var friendlyTime = "";
	if(hours == 1)
		friendlyTime = hours+ "h ";
	if(hours > 1)
		friendlyTime = hours+ "h ";
	if(minutes > 0)
		friendlyTime += minutes + "m ";
	if(seconds > 0)
		friendlyTime += seconds + "s ";
	if(friendlyTime != "")
	return friendlyTime;
}

function searchForContact(from, callback) {
	console.log("searchForContact : " + from);	
	
	var name = "";
	try {

	    accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+from, function(responseJson){

	    	if(!responseJson)
	    		 callback(name);

			TWILIO_CONTACT_ID = responseJson.id;
			console.log("TWILIO_CONTACT_ID : "+TWILIO_CONTACT_ID);
			callback(getContactName(responseJson));
	    });
		
    } catch(e){
    	callback(name);
    }
}

function sendVoiceAndEndCall(fileSelected) {
	console.log("Sending voice mail...");

	if(TWILIO_IS_VOICEMAIL == false) {
		
		var conn = globalconnection;
		twilioGetWidgetDetails(function(data){
			var widgetDetails = data;
			var widgetPrefs = $.parseJSON(widgetDetails.prefs);

			var acc_sid = widgetPrefs.twilio_acc_sid;
			var auth_token = widgetPrefs.twilio_auth_token;	
			var isParent = "true";
			var ApiCallUrl = "/core/api/widgets/twilio/getlastcall/" + acc_sid + "/" + auth_token + "/" + conn.parameters.CallSid + "/" + isParent;
			if(!widgetDetails)
				return;

			twilioApiRequest(ApiCallUrl, function(data1){
				var callDetails  = data1;
				if(!callDetails)
					return;

				var callDetailsJson = $.parseJSON(callDetails.responseText);
				if(isParent == "true")
					var callRespJson = callDetailsJson.calls[0];
				else
					var callRespJson = callDetailsJson;

				if(typeof callRespJson != "undefined") {
				if(typeof callRespJson.status != "undefined" && callRespJson.status == 'in-progress') {

						// alert("Voicemail will be sent to user.Current call will be closed.");
						var messageObj = globalconnection.message;
						twilioVoiceMailRedirect(fileSelected, function(data){
								if(!data)
								  return;
								closeTwilioNoty();
								// added for call campaign...
								if(CALL_CAMPAIGN.start){
									if(TWILIO_CALLTYPE == "Outgoing" && CALL_CAMPAIGN.call_from_campaign){
										getContactDetails();
									}
								}
								//...............................
								if(TWILIO_CONTACT_ID) {		
									//add note automatically
									$.post( "/core/api/widgets/twilio/autosavenote", {
										subject: TWILIO_CALLTYPE + " call - Left voicemail",
										message: "",
										contactid: TWILIO_CONTACT_ID
										});
									
									if(TWILIO_CALLED_NO != "") {
										$.post( "/core/api/widgets/twilio/savecallactivityById",{
											id:TWILIO_CONTACT_ID,
											direction: TWILIO_DIRECTION, 
											phone: TWILIO_CALLED_NO, 
											status : "voicemail",
											duration : 0 
											});
									}
									TWILIO_IS_VOICEMAIL = true;					
								}
						});
					}

				} else {
					return;
				}


			});
		});

	}
}

function twilioVoiceMailRedirect(fileSelected, callback) {

	twilioGetWidgetDetails(function(data){

		var widgetDetails = data;	
		if(!widgetDetails)
			return callback(false);

		var widgetPrefs = $.parseJSON(widgetDetails.prefs);
		var acc_sid = widgetPrefs.twilio_acc_sid;
		var auth_token = widgetPrefs.twilio_auth_token;	
		
		var isParent = "true";
		if(TWILIO_CALLTYPE == "Incoming") {
			isParent = "false";
		}
		var ApiCallUrl = "/core/api/widgets/twilio/getlastcall/" + acc_sid + "/" + auth_token + "/" + globalconnection.parameters.CallSid + "/" + isParent;
		console.log(ApiCallUrl);
		
		twilioApiRequest(ApiCallUrl, function(data1){
 	
 			var callDetails  = data1;
 			console.log("Call Details : isParent " + isParent);
			console.log(callDetails);	
			if(!callDetails)
				return;

			var callDetailsJson = $.parseJSON(callDetails.responseText);
			if(isParent == "true")
				var callRespJson = callDetailsJson.calls[0];
			else
				var callRespJson = callDetailsJson;

			ApiCallUrl = "/core/api/widgets/twilio/setvoicemail/" + acc_sid + "/" + auth_token + "/" +callRespJson.sid + "/" + fileSelected
			console.log("In ajax send voice mail : " + ApiCallUrl);	
			var resp  = twilioApiRequest(ApiCallUrl);
			//added for call-campaign...
			if(CALL_CAMPAIGN.start){
				$('#noty_twilio_voicemail').attr('disabled','disabled');
				$('#splitButtonVoicemail').attr('disabled','disabled');
				
			}
			//...........................
			return callback(true);

		});
	});
}


function twilioGetWidgetDetails(callback){

	accessUrlUsingAjax("/core/api/widgets/TwilioIO", function(resp){
		return callback(resp);
	});
}

//this will return an object
function twilioApiRequest(ApiCallUrl, callback){

	accessUrlUsingAjax(ApiCallUrl, function(resp){
		return callback(resp);
	});
}

// Get contact from DB and then return contact img
function searchForContactImg(from, callback) {
	console.log("searchForContactImg : " + from);	
	var contactImg = "";
	try {

		accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+from, function(resp){

			var responseJson = resp;
			console.log("**** responseJson ****");
			console.log(responseJson);
			return callback(responseJson);

		});

	} catch(e) {
		return callback(null);
	}	
}

// Add contact img in html for call noty text with contact url
function addContactImg(callType, callback)
{
	var notyContactImg = "";
	if(callType == "Outgoing")
	  {
		var currentContact = agile_crm_get_contact();
		var contactImg = getGravatar(currentContact.properties, 40);
		notyContactImg = '<a href="#contact/'+TWILIO_CONTACT_ID+'" style="float:left;margin-right:10px;"><img class="thumbnail" width="40" height="40" alt="" src="'+contactImg+'" style="display:inline;"></a>';
		return callback(notyContactImg);
	  }
	else
	{
		searchForContactImg(To_Number, function(contact){
			var callingContact = contact;
			if(callingContact != null)
			{
				var contactImg = getGravatar(callingContact.properties, 40);
				notyContactImg = '<a href="#contact/'+TWILIO_CONTACT_ID+'" style="float:left;margin-right:10px;"><img class="thumbnail" width="40" height="40" alt="" src="'+contactImg+'" style="display:inline;"></a>';			
			}
			return callback(notyContactImg);
		});
	} 
}

/**
 * Take contact property and width for img, return gravatar or contact img.
 * Used for twilio IO as well as SIP call noty.
 */
function getGravatar(items, width)
{
	if (items == undefined)
		return;

	// Checks if properties already has an image, to return it
	var agent_image = getPropertyValue(items, "image");
	if (agent_image)
		return agent_image;

	// Default image
	var img = DEFAULT_GRAVATAR_url;
	var backup_image = "&d=404\" ";
	// backup_image="";
	var initials = text_gravatar_initials(items);

	if (initials.length == 0)
		backup_image = "&d=" + DEFAULT_GRAVATAR_url + "\" ";
	var data_name = "onLoad=\"image_load(this)\" onError=\"image_error(this)\" _data-name=\"" + initials;
	var email = getPropertyValue(items, "email");
	if (email)
	{
		return ('https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + backup_image + data_name);
	}

	return ('https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '' + backup_image + data_name);	
}