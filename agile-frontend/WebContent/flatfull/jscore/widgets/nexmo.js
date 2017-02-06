 /*
 *@author Priyanka
 *Date:31 jan 2017
 *<p>nexmo.js file for all the function related to the nexmo sms</p>
 */
 $(function(){

 $('body').off('click', '#validate_nexmo_account');
	$('body').on('click', '#validate_nexmo_account', function(e)
	{
		e.preventDefault();
		console.log("In validate event");

		if ($(this).text() == "Validating...")
		{
			console.log("Do not hit me again " + $(this).text());
			return;
		}

		// Checks whether all input fields are given
		if (!isValidForm($("#nexmo_login_form")))
		{
			return;
		}

		var api_key = $("#nexmo_api_key").val();
		var secret_key = $("#nexmo_secret_key").val();

		// if (acc_sid.match("^AC"))
		{
			// Change validate to validating
			$("#validate_nexmo_account").text("Validating...");
			$("#validate_nexmo_account").attr("disabled", true);

			// validate entered details and get verified numbers
			getValidateAndVerfiedNexmo(api_key, secret_key, null);
		}
		/*
		 * else alert("Account SID should start with 'AC'");
		 */
	});

});

  //send sms from contact dash let
    $('body').off('click', '.SMS-nexmo_sms');
	$('body').on('click', '.SMS-nexmo_sms', function(e)
	{
		
		e.preventDefault();
		e.stopPropagation();

        var number = $(this).closest(".contact-make-call").attr("phone");
		var contact  = agile_crm_get_contact();

		number =getFormattedPhone(number, contact);
		contact['phone'] = number;
		contact['widget_name'] = "Nexmo";
		showDraggablePopup(contact, "sms");

      /* $.each(SMS_From_Number,function(index,num){ 		
         var option = new Option(num,num);	
 		  $("#draggable_noty").find("select").append($(option));
 	    });*/

	});
  
/*verify the oauth aacount with api_key and secret_key*/
function getValidateAndVerfiedNexmo(api_key, secret_key, callback)
{
	$.get("/core/api/widgets/nexmo/validateaccount?apikey=" + api_key + "&secretkey=" + secret_key, function(result)
	{
		console.log("nexmo validate account " + result);
		result = eval("(" + result + ")");
		console.log("Nexmo validate account " + result);

		if (result)
		{
			// Get Nexmo number
			getNexmoNumbers(api_key, secret_key, function(nexmoNumbers)
			{
					addNumbersInNexmo(nexmoNumbers);

					// If defined, execute the callback function
					if (callback && typeof (callback) === "function")
						callback(result);
			});
		}
		else
			setToValidateNexmo(result, true);
		//setToValidateNexmo(result);
	}).error(function(data)
	{
		console.log("Nexmo validate account error");
		setToValidate(data, true);
	});
}

function addNumbersInNexmo(verifiedNumbers)
{
	console.log("Nexmo number " + verifiedNumbers);

	// no twilio # as well as no verified #
	if (verifiedNumbers.length == 0)
	{
		// Reset form
		setToValidateNexmo("no number", false);

		// Add error msg at bottom of form
		$("#note-number-not-available").html("{{agile_lng_translate 'twill' 'invalid-numbers'}}");
		$("#note-number-not-available").show();
	}
	// twilio # is available but no verified #
	else if (verifiedNumbers.length != 0 )
	{
		
		// If no numbers
		if (!verifiedNumbers[0])
		{
		showNotyPopUp
			//showAlertModal("no_nexmo_numbers");
			return;
		}

		// Add verified number in UI
		addNexmoNumbersInUI(verifiedNumbers);
		// Hide validate button
		$("#validate_nexmo_account").hide();

		// Show save button
		$("#save_prefs").show();

		// Hide twilio from numbers list
		$("#nexmo_number").show();
		// Hide twilio from numbers list
		$("#nexmo_from_number").show();
	}
	
}

function setToValidateNexmo(data,showAlert)
{
	// Change validate to validating
	$("#validate_nexmo_account").text("Validate");
	$("#validate_nexmo_account").attr("disabled", false);

	console.log("Nexmo error ");
	console.log(data);

	if (data){
		//showAlertModal("valid_details");
		showNotyPopUp("success" , "{{agile_lng_translate 'widgets' 'saved-nexmo-success'}}", "bottomRight");
		window.location.href = "#add-widget";
		return;
	}else{
		showNotyPopUp("error" , "{{agile_lng_translate 'widgets' 'widget-nexmo-error'}}", "bottomRight");
	}

	// Reset form fields after sending email
	$("#nexmo_login_form").each(function()
	{
		this.reset();
	});
}

function getNexmoNumbers(api_key, secret_key, callback)
{
	$.get("/core/api/widgets/nexmo/getnexmonumbers/" + api_key + "/" + secret_key, function(result)
	{
		console.log("Get Nexmo Number " + result);
	
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(result);
	}).error(function(data)
	{
		console.log("error in getNexmoNumbers");
		setToValidateNexmo(data, true);
		// setTValidateNexmo(data);
	});
}


function addNexmoNumbersInUI(result)
{
	result=eval(result);
	var phoneNumberHtml = '<option value="" default selected style="display:none;">{{agile_lng_translate "twill" "select-nexmo-number"}}</option>';
	var optionHtml = "";

	// Collect all twilio number for display
	$.each(result, function(index, phoneNumber)
	{
		optionHtml = '<option data="" value="' + phoneNumber + '">' + phoneNumber+ '</option>';
		phoneNumberHtml = phoneNumberHtml + optionHtml;
	});

	//optionHtml = '<option data="" value="">{{agile_lng_translate "widgets" "none"}}</option>';
	if(result.length == 0)
		phoneNumberHtml = phoneNumberHtml + optionHtml;	
	
	// Add verified number in list
	$("#nexmo_number").html(phoneNumberHtml);
}

function fill_nexmo_numbers()
{
	// Hide validate button
	$("#validate_nexmo_account").hide();

	// Show save button
	$("#save_prefs").show();

	$("#save_prefs").text("{{agile_lng_translate 'tickets' 'loading'}}");
	$("#save_prefs").attr("disabled", true);
	
	// Retrieves widget which is fetched using script API
	// Get Nexmo widget
	$.getJSON("/core/api/widgets/Nexmo", function(nexmo_widget)
	{
		if (nexmo_widget == null)
			return;

		console.log("nexmo_widget");
		console.log(nexmo_widget);

		if (nexmo_widget.prefs != undefined)
		{
			nexmo_widget.prefs = eval("(" + nexmo_widget.prefs + ")");
			
			// Show advanced settings if data available
			//if((nexmo_widget.prefs.twilio_record == "true") || (twilioio_widget.prefs.twilio_twimlet_url != "None"))
				//$(".twilioio-advance-settings").click();

			getValidateAndVerfiedNexmo(nexmo_widget.prefs.nexmo_api_key, nexmo_widget.prefs.nexmo_secret_key, function(data)
			{
				console.log("In callback getValidateAndVerfiedNexmo");
				$('#nexmo_number').val(nexmo_widget.prefs.nexmo_number);
				$('#nexmo_api_key').val(nexmo_widget.prefs.nexmo_api_key);
				$('#nexmo_secret_key').val(nexmo_widget.prefs.nexmo_secret_key);
				$("#save_prefs").text("{{agile_lng_translate 'modals' 'save'}}");
				$("#save_prefs").attr("disabled", false);
			});
		}
	}).error(function(data)
	{
		console.log("nexmo_widget error");
		console.log(data);
	});
}