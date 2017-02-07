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
var TWILIO_CONTACT ;
var calltransfer = false;
var transfer_number;
var Twilio_From_Numbers = [];
function initializeTwilioGlobalListeners(){
	
}

$(function(){

	// After 15 sec procedure will start.
	setTimeout(function()
	{
		// after DOM ready.
		if (document.readyState === "complete" && CURRENT_DOMAIN_USER)
		{
			//globalTwilioIOSetup();
			//SMS_From_Number=getTwilioIncomingListForSms();
		}
	}, 10000); // 15 sec

    $('body').off('click', '.twiliousers');
    $('body').on('click', '.twiliousers', function(e){
		e.preventDefault();
		var callsid = globalconnection.parameters.CallSid;
		var form = Verfied_Number;
		var to = $(this).attr("data-src");
		var name = $(this).attr("data-name");
		var trans_number = name+" ("+to+")";
		$("#draggable_noty div:first-child").css({"z-index":"1000"});
		showAlertModal(_agile_get_translated_val('widgets', 'twilo-call-transfer-confirmation')+" "+trans_number+"?", "confirm", function(){
			$("#draggable_noty div:first-child").css({"z-index":"10000"});
			calltransfer = true;
			$.post( "/core/api/widgets/twilio/transferCall", {
				callSid:callsid,
				direction:TWILIO_CALLTYPE,
				From: form,
				To: to						
			},function(data){
				data  = JSON.parse(data);
				transfer_number = trans_number;
				var modifyStatus = data.modifyStatus;
				if(modifyStatus == "in-progress"){
					var msgType = "success";
					var msg = "{{agile_lng_translate 'twill' 'success-start-transferred'}}";
					showNotyPopUp(msgType , msg, "bottomRight");
				}else{
					$("#globalModal").html(getTemplate("callInfoModalAlert"));
					$(".call-modal-body","#globalModal").html('{{agile_lng_translate "twill" "error-start-transfer"}}');
					$("#globalModal").modal('show');
					return;
				}
			});
		},undefined, "Call Transfer"); 
	});

	$('body').off('click', '.twiliousersconf');
    $('body').on('click', '.twiliousersconf', function(e){
		e.preventDefault();
		var callsid = globalconnection.parameters.CallSid;
		var form = Verfied_Number;
		var to = $(this).attr("data-src");
		$("#draggable_noty div:first-child").css({"z-index":"1000"});
		var contactToCall = "";
		if(App_Contacts.contactDetailView){
			contactToCall  = agile_crm_get_contact();
		}else{
			contactToCall = TWILIO_CONTACT;
		}
		if (checkForActiveCall()){
			var jsonParam = {};
			jsonParam['number'] = to;
			jsonParam['contact'] = contactToCall;
			$("#draggable_noty div:first-child").css({"z-index":"1000"});			
			if(callConference.totalMember == 2){
				$("#globalModal").html(getTemplate("callInfoModalAlert"));
				$(".call-modal-body","#globalModal").html('{{agile_lng_translate "twill" "max-participants"}}');
				$("#globalModal").modal('show');
				return;
			}else{
				confirmConferenceCallToDial(jsonParam);
				return;
			}
		}
	});
	/*$('body').off('click', '.noty_twilio_phone');
    $('body').on('click', '.noty_twilio_phone', function(e){
		e.preventDefault();
		makeDraggableTransfer();
	});*/

	/*$('body').off('click', '.noty_twilio_voice_mail');
    $('body').on('click', '.noty_twilio_voice_mail', function(e){
		e.preventDefault();
		makeDraggableVoicemail();
	});
	$('body').off('click', 'noty_twilio_conf');
    $('body').on('click', '.noty_twilio_conf', function(e){
		e.preventDefault();
		makeDraggableConference();
	});*/
	
    $('body').off('click', '.noty_twilio_add_contact');
    $('body').on('click', '.noty_twilio_add_contact', function(e){
    	e.preventDefault();
    	var jsonObj = {};
    	if(!TWILIO_CONTACT_ID){
	    	var phone_number = $("#notyCallDetails").text();
			jsonObj['phoneNumber'] = phone_number;
			return showContactMergeOption(jsonObj);
		}else{
			alert("contact already exists");
		}
	});

    //send sms from contact dash let
    $('body').off('click', '.SMS-Gateway_sms');
	$('body').on('click', '.SMS-Gateway_sms', function(e)
	{
		
		e.preventDefault();
		e.stopPropagation();

        var number = $(this).closest(".contact-make-call").attr("phone");
		var contact  = agile_crm_get_contact();

		number =getFormattedPhone(number, contact);
		contact['phone'] = number;
		contact['widget_name'] = "Twilio";
		showDraggablePopup(contact, "sms");

      /* $.each(SMS_From_Number,function(index,num){ 		
         var option = new Option(num,num);	
 		  $("#draggable_noty").find("select").append($(option));
 	    });*/

	});
  
    $('body').off('click', '.noty_twilio_mute');
	$('body').on('click', '.noty_twilio_mute', function(e)
			{
				e.preventDefault();
				console.log("Twilio call noty_twilio_mute from noty");
				
				globalconnection.mute(true);
				
				$('.noty_buttons').find('.noty_twilio_unmute').css('display','inline');
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
		if($('#dialpad_in_twilio:visible').length > 0){
			$("#panel-body1, #draggable-noty" ).css({"height":"150px"});
		}else{
			$("#panel-body1, #draggable-noty" ).css({"height":"45px"});
		}
		
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

		closeTwilioNoty();
		//globalconnection.disconnect();
		if( Twilio.Device.status()=="ready"){
			Twilio.Device.disconnectAll();
		}

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

	var setVal = false;
    $('body').off('change', '#twilio_number');
	$('body').on('change', '#twilio_number', function(e)
	{
		e.preventDefault();
		$("#error-number-not-selected").hide();

		var numberSID = $("#twilio_number option:selected").attr("data");
		console.log("twilio_number change");
		console.log("twilio_number " + $(this).val() + " clicked " + numberSID);
		
		if(!setVal){
			$('#twilio_from_number option[value="'+$("#twilio_number option:selected").attr("value")+'"]').attr("selected",true).siblings().removeAttr('selected');
		}

		$("#twilio_number_sid").val(numberSID);
	});
	
    $('body').off('change', '#twilio_from_number');
	$('body').on('change', '#twilio_from_number', function(e)
	{
		setVal = true;
		console.log(setVal+" set value")
		e.preventDefault();
		$("#error-number-not-selected").hide();
	});

	
	

	
	
    $('body').off('click', '.contact-make-twilio-call,.TwilioIO_call');
	$('body').on('click', '.contact-make-twilio-call, .TwilioIO_call', function(e)
	{
		
		e.preventDefault();
		e.stopPropagation();

	if($(this).closest(".contact-make-call").hasClass('popover-call'))
		{
			var from;
			var contactPopoverObj = App_Contacts.contact_popover.toJSON();
			callToNumber($(this).closest(".contact-make-call").attr("phone"), from, "Twilio",contactPopoverObj, "");
			return;
		}

		
//		alert("connecting twilio call");
		
/*		var contactDetailsObj = agile_crm_get_contact();
		TWILIO_CONTACT_ID = contactDetailsObj.id;
		TWILIO_CONTACT = contactDetailsObj;*/
//		alert(TWILIO_CONTACT_ID);
		var number = $(this).closest(".contact-make-call").attr("phone");
		var contactToCall  = agile_crm_get_contact();
		if (checkForActiveCall())
		{
			var jsonParam = {};
			jsonParam['number'] = number;
			jsonParam['contact'] = contactToCall;
			confirmConferenceCallToDial(jsonParam);
			return;
		}



		var contactDetailsObj = agile_crm_get_contact();
		TWILIO_CONTACT_ID = contactDetailsObj.id;
		TWILIO_CONTACT = contactDetailsObj;
		console.log("phone: " + $(this).closest(".contact-make-call").attr("phone"));
		if(CALL_CAMPAIGN.start )
			  {
				if(CALL_CAMPAIGN.state == "PAUSE"){
					showAlertModal("on_call");
					return;
				}
				CALL_CAMPAIGN.state = "PAUSE" ;
			  }
		TWILIO_CALLTYPE = "Outgoing";
		TWILIO_DIRECTION = "outbound-dial";
		TWILIO_IS_VOICEMAIL = false;
		callConference.started = false;
		twiliocall($(this).closest(".contact-make-call").attr("phone"), getContactName(contactDetailsObj), null, contactDetailsObj);
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
	    //$("#twilio_recording").toggle();
	    $("#twilio_twimlet_url_controls").toggle();
	    //$("#twilio_twimlet_url_controls #twilio_twimlet_url").val("http://twimlets.com/voicemail?Email="+CURRENT_DOMAIN_USER.email);
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
		
		 $('body').off('click', '.play-twilio-record');
		$("body").on("click", '.play-twilio-record', function(e)
				{
			//close all the opened audio file
					var opened_audio_length = $(".audio-inside-sound:visible").length;
					while(opened_audio_length > 0){
						$($(".audio-inside-sound:visible")[0]).closest(".twilio-sound").find(".text-inside-sound").show()
						$($(".audio-inside-sound:visible")[0]).find(".twilio_audio")[0].pause();
						$($(".audio-inside-sound:visible")[0]).hide();
						opened_audio_length = opened_audio_length-1;
					}
					var el = $(this).closest(".twilio-sound");
					el.find(".audio-inside-sound").show();
					el.find(".text-inside-sound").hide();
					el.find(".twilio_audio")[0].play();
					
					
				});
		 $('body').off('click', '.close-twilio-record');
		$("body").on("click", '.close-twilio-record', function(e)
				{
					var el = $(this).closest(".twilio-sound");
					el.find(".twilio_audio")[0].pause();
					el.find(".audio-inside-sound").hide();
					el.find(".text-inside-sound").show();
				});
		
		
	$('#globalModal').off('click', '#callModalConfirm_info_ok');
    $('#globalModal').on('click', '#callModalConfirm_info_ok', function(e)
	{
		e.preventDefault();
		var paramJson = $(this).data("param");
		$("#draggable_noty div:first-child").css({"z-index":"10000"});
		try{
			if(paramJson.attribute == "conference-confirm"){
				var number = paramJson.number;
				var callSid = paramJson.callSid;
				var contact = paramJson.contact;
				dialConferenceCall(number,callSid,contact);
				//dialConferenceCall(number,callSid);
			}
		}catch(e){}
		$("#globalModal").modal('hide');
	});
	
    
	$('#globalModal').off('click', '#callModalAlert_info_ok, #callModalConfirm_info_cancel');
    $('#globalModal').on('click', '#callModalAlert_info_ok, #callModalConfirm_info_cancel', function(e)
	{
		e.preventDefault();
		$("#globalModal").modal('hide');
	});
    
    
});


// newNum is the number of second party whom we have to make the call..
//contact is the contact of old party whom call has been made.
function dialConferenceCall(newNum, callSid, newCnt){
	

	var numberToDial = newNum;
	var newContact = newCnt;
	var oldContact = TWILIO_CONTACT;
	var oldNumber = To_Number;
	
	try{
		var number = getFormattedPhone(numberToDial, newContact);
		
		if(Twilio.Device.status() == "busy"){
				
				callConference.totalMember = 0;
				callConference.conferenceDuration = 0;
				
				if(callSid){
					callConference.hideNoty = false; // this is set to false to stop hiding of popup in disconnect function
					callConference.started = true; // this will help in knowing in disconnect function whether the callcampiang has started or not
					callConference.addnote = false;
					
					$.post( "/core/api/widgets/twilio/modifyCallAddConference", {
						callSid:callSid,
						conferenceName: callConference.name,
						direction:TWILIO_CALLTYPE,
						From: Verfied_Number,
						To: number						
					},function(data){
						console.log(data);
						data  = JSON.parse(data);
						var modifyStatus = data.modifyStatus;
						var conferenceStatus = data.conferenceStatus;
						callConference.lastContactedId = TWILIO_CONTACT_ID;
						callConference.phoneNumber = To_Number;
						
							if(modifyStatus == "in-progress"){
								// do something
								callConference.totalMember = parseInt(callConference.totalMember)+1;
								// we are dialing again to the ver first contact...
								var numberToCall = oldNumber;
								var nameOfContact = "";
								if(oldContact){
									nameOfContact =	getContactName(oldContact);
								}
								
								setTimeout(function()
										{
									callConference.addnote = true;
									callConference.started = true;
									console.log("callConference.started" + callConference.started);
											twiliocall(numberToCall, nameOfContact, callConference.name);
										}, 4000);
								// dialing to very first number done............
								
								if(conferenceStatus == "queued"){
									callConference.totalMember = parseInt(callConference.totalMember)+1;
								}else{
									$("#globalModal").html(getTemplate("callInfoModalAlert"));
									$(".call-modal-body","#globalModal").html("{{agile_lng_translate 'twill' 'failed-join-another-number'}}");
								//	$(".call-modal-body","#globalModal").html("Failed to add another number to the conference call. Please try again.");
									$("#globalModal").modal('show');
								}
							}else{
								// reset the variable for conference call 
								callConference.hideNoty = true;
								callConference.started = false;
								callConference.addnote = true;
								callConference.lastContactedId = null;
								$("#globalModal").html(getTemplate("callInfoModalAlert"));
								$(".call-modal-body","#globalModal").html("{{agile_lng_translate 'twill' 'error-start-conference'}}");
								//$(".call-modal-body","#globalModal").html("Problem in starting the conference. Please start again");
								$("#globalModal").modal('show');
								return;
							}
						
					});
				}	
				return;
		}else{
			
/*			var a = confirm("Do you want to dial this call in conference");
			if(a == true){
				TWILIO_CALLTYPE = "Outgoing";
				TWILIO_DIRECTION = "outbound-dial";
				TWILIO_IS_VOICEMAIL = false;
				
				var contactDetailsObj = agile_crm_get_contact();
				TWILIO_CONTACT_ID = contactDetailsObj.id;
				TWILIO_CONTACT = contactDetailsObj;
				twiliocall(number, getContactName(contactDetailsObj),callConference.name);
				return;
				
				return;
			}else{
				return;
			}*/

		
			}
	}catch(e){
		return;
	}

}

/*
function dialConferenceCall(num, callSid){
	

	var number = num;
	
	try{
		
		if(Twilio.Device.status() == "busy"){
			if(!callConference.started){
				if(callSid){
					callConference.showNoty = false; // this is set to false to stop hiding of popup in disconnect function
					$.post( "/core/api/widgets/twilio/modifyCall", {
						callSid:callSid,
						conferenceName: callConference.name,
						direction:TWILIO_CALLTYPE
					},function(data){
						console.log(data);
						callConference.number = number;
						callConference.contact = agile_crm_get_contact();
						$.post( "/core/api/widgets/twilio/confCall", {
							From: Verfied_Number,
							To: number,
							conferenceName: callConference.name
						},function(data){
							setTimeout(function()
									{
										TWILIO_CONTACT_ID = callConference.contact.id;						
										twiliocall(callConference.number, getContactName(callConference.contact), callConference.name);
										callConference.started = true;
									}, 5000);
						});
					});
				}	
				return;
			}else{
				$.post( "/core/api/widgets/twilio/confCall", {
					From: Verfied_Number,
					To: number,
					conferenceName: callConference.name
				});
			}
		}else{
			
			var a = confirm("Do you want to dial this call in conference");
			if(a == true){
				TWILIO_CALLTYPE = "Outgoing";
				TWILIO_DIRECTION = "outbound-dial";
				TWILIO_IS_VOICEMAIL = false;
				
				var contactDetailsObj = agile_crm_get_contact();
				TWILIO_CONTACT_ID = contactDetailsObj.id;
				TWILIO_CONTACT = contactDetailsObj;
				twiliocall(number, getContactName(contactDetailsObj),callConference.name);
				return;
				
				return;
			}else{
				return;
			}

		
			}
	}catch(e){
		return;
	}
	

}*/

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
		$("#note-number-not-available").html("{{agile_lng_translate 'twill' 'invalid-numbers'}}");
		$("#note-number-not-available").show();
	}
	// twilio # is available but no verified #
	else if (twilioNumbers.length != 0 && verifiedNumbers.length == 0)
	{
		// Add note at bottom you do not have verified #
		//$("#note-number-not-available").html("{{agile_lng_translate 'twill' 'invalid-twilio-numbers'}}");
		//$("#note-number-not-available").show();

		// If no numbers
		if (!twilioNumbers[0].PhoneNumber)
		{
			showAlertModal("no_twilio_numbers");
			return;
		}

		console.log("Twilio twilio number " + twilioNumbers[0].PhoneNumber);

		// Add verified number in UI
		addTwilioNumbersInUI(twilioNumbers);
		addVerifiedCallerIdInUI(twilioNumbers);
		// Hide validate button
		$("#validate_account").hide();

		// Show save button
		$("#save_prefs").show();

		// Hide twilio from numbers list
		$("#twilio_from_numbers").show();

		// Show twilio numbers list
		$("#twilio_numbers").show();

		//$("#twilio_number").addClass("required");
	}
	// verified # is available but no twilio #
	else if (twilioNumbers.length == 0 && verifiedNumbers.length != 0)
	{
		// Add note at bottom you do not have twilio #
		$("#note-number-not-available").html("{{agile_lng_translate 'twillio' 'invalid-number'}}");
		$("#note-number-not-available").show();

		// If no numbers
		if (!verifiedNumbers[0].PhoneNumber)
		{
			showAlertModal("no_verified_num");
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
		addVerifiedCallerIdInUI(verifiedNumbers,twilioNumbers);

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

	if (showAlert){
		showAlertModal("valid_details");
		return;
	}

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
	var phoneNumberHtml = '<option value="" default selected style="display:none;">{{agile_lng_translate "twill" "select-twilio-number"}}</option>';
	var optionHtml = "";

	// Collect all twilio number for display
	$.each(result, function(index, phoneNumber)
	{
		optionHtml = '<option data="' + phoneNumber.Sid + '" value="' + phoneNumber.PhoneNumber + '">' + phoneNumber.PhoneNumber + '</option>';
		phoneNumberHtml = phoneNumberHtml + optionHtml;
	});

	//optionHtml = '<option data="" value="">{{agile_lng_translate "widgets" "none"}}</option>';
	if(result.length == 0)
		phoneNumberHtml = phoneNumberHtml + optionHtml;	
	
	// Add verified number in list
	$("#twilio_number").html(phoneNumberHtml);
}

function addVerifiedCallerIdInUI(result,result1)
{
	var phoneNumberHtml = '<option value="" default selected style="display:none;">Select a Outbound Number</option>';
	var optionHtml = "";
	var numArry = [];
	var finalnumArry = [];
	// Collect all verified number for display
	if(!result1){
		$.each(result, function(index, phoneNumber)
		{
			optionHtml = '<option value="' + phoneNumber.PhoneNumber + '">' + phoneNumber.PhoneNumber + '</option>';
			phoneNumberHtml = phoneNumberHtml + optionHtml;
		});
	}else{
		$.each(result, function(index, phoneNumber){
			numArry.push(parseInt(phoneNumber.PhoneNumber));
		});
		$.each(result1, function(index, phoneNumber1){
			numArry.push(parseInt(phoneNumber1.PhoneNumber));
		});

		numArry.sort(function(a, b){return a-b});

		for(var i=0;i<numArry.length;i++){
			optionHtml = '<option value="+' + numArry[i] + '">+' + numArry[i] + '</option>';
			phoneNumberHtml = phoneNumberHtml + optionHtml;
		}
		phoneNumberHtml = phoneNumberHtml + optionHtml;
	}

	//optionHtml = '<option data="" value="">{{agile_lng_translate "widgets" "none"}}</option>';
	if(result.length == 0 && result1.length == 0)
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
		var that = this;
		showAlertModal("valid_details_try_again", undefined, function(){
			$("#save_prefs").text("{{agile_lng_translate 'modals' 'save'}}");
			$("#save_prefs").attr("disabled", false);
			$("#save_prefs").hide();
			$("#validate_account").text("{{agile_lng_translate 'widgets' 'validate'}}");
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
				that.reset();
			});
		});

		
	});
}

function fill_twilioio_numbers()
{
	// Hide validate button
	$("#validate_account").hide();

	// Show save button
	$("#save_prefs").show();

	$("#save_prefs").text("{{agile_lng_translate 'tickets' 'loading'}}");
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
				$("#save_prefs").text("{{agile_lng_translate 'modals' 'save'}}");
				$("#save_prefs").attr("disabled", false);
			});
		}
	}).error(function(data)
	{
		console.log("twilioio_widget error");
		console.log(data);
	});
}

function loadTwilioMin()
{
	head.js("https://static.twilio.com/libs/twiliojs/1.2/twilio.min.js", function()
	{
		if(Twilio.Device!=null && Twilio.Device!=undefined)
			initTwilioListeners()
		else
			loadTwilioMin();			
	});	
}
function initTwilioListeners()
{
		Twilio.Device.setup(Twilio_Token, {debug: true});

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
					showAlertModal("active_connection");
					return;
				}
			}

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
			console.log("Twilio call is connected after sending the request to twilio to dial");
			// Called for all new connections
			console.log(conn);
			console.log(conn._status);
			globalconnection = conn;

				// If call campaign then update call noty
			
				if(CALL_CAMPAIGN.start && CALL_CAMPAIGN.call_from_campaign)
				  {
					console.log("call campaign is calling and we are changing the conatiner");
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
						if(callConference.started){
							//return without showing the popup on new number
							return;
						}
						var btns = [];
						if(TWILIO_DIRECTION && TWILIO_DIRECTION != "inbound" &&  TWILIO_DIRECTION != "incoming"){
							btns.push({"id":"", "class":"btn btn-sm btn-default p-xs noty_twilio_voice_mail","popover-date":"Voicemail","title":""});
						}
						btns.push({"id":"", "class":"btn btn-sm btn-default p-xs noty_twilio_phone  icon-call-out","popover-date":"Transfer call","title":""},{"id":"", "class":"btn btn-sm btn-default p-xs noty_twilio_conf  fa fa-group","popover-date":"Call Conference","title":""},{"id":"", "class":"btn btn-sm btn-default p-xs noty_twilio_mute icon-microphone","popover-date":"Mute","title":""},{"id":"", "class":"btn btn-sm btn-default p-xs noty_twilio_unmute icon-microphone-off","popover-date":"Unmute","title":""},{"id":"", "class":"btn btn-xs btn-default noty_twilio_dialpad icon-th","popover-date":"Dialpad","title":""},{"id":"", "class":"btn btn-sm btn-danger fa fa-headphones cam-call-icon noty_twilio_hangup","popover-date":"Hangup","title":""});
						showDraggableNoty("Twilioio", TWILIO_CONTACT, "connected", To_Number, btns);
						
						/*showCallNotyPopup("connected", "Twilio", Twilio_Call_Noty_IMG+'<span class="noty_contact_details"><b>On call  </b>' + To_Number +'<br><a href="#contact/'+TWILIO_CONTACT_ID+'" style="color: inherit;">' + To_Name + '</a><br></span><div class="clearfix"></div>', false);*/
					 }		
		});
Twilio.Device.disconnect(function(conn){
			
			console.log("Twilio call is disconnected");

			if(CALL_CAMPAIGN.start){
				CALL_CAMPAIGN.call_status = "DISCONNECTED";
			}
			//callConference.totalMember = 0;
			
			// Called for all disconnections
			console.log(conn);
			
			var phoneNumber = To_Number;
			var messageObj = conn.message;
			var cnf_started = false;
			var showNoteParam = {};
			
			
			if (Twilio.Device.status() != "busy")
			{
				if(callConference.hideNoty){
					callConference.totalMember = 0;
					closeTwilioNoty();
				}else{
					callConference.hideNoty = true;
				}
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
			
			if(callConference.started){
				callConference.started = false;	
				cnf_started = true;
			}
			
			try{
				// Get all call logs for widget only on cotact detail page
				console.log("Get all call logs for widget only on cotact detail page in disconnected function");
				if(window.location.hash.indexOf("contact/") != -1)
				  {
					if(typeof getTwilioIOLogs == 'undefined')
						return;
					
					if(!cnf_started){
						
						// Change selected number if its different than calling number.
						//var selectedNumber = $('#contact_number').val();

						var contact_id = window.location.hash.split("/")[1];
						if(contact_id == (TWILIO_CONTACT.id+""))
						{
						  var from_number = phoneNumber.replace(/[\+\-\(\)]/gi,'');
						 // var patt = new RegExp(from_number);
						  for(var i=0; i<TWILIO_CONTACT.properties.length; i++){
						  	if(TWILIO_CONTACT.properties[i].name == "phone"){
						  		var reg_exp = new RegExp(TWILIO_CONTACT.properties[i].value.replace(/[\+\-\(\)]/gi,''));
						  		if(reg_exp.test(from_number)){
						  			$("#contact_number").val(TWILIO_CONTACT.properties[i].value);
						  			// getting logs if the conference call is not there
									getTwilioIOLogs(phoneNumber,null, TWILIO_CONTACT);
									break;
						  		} 
						  	}
						  }
						  /*if(selectedNumber != phoneNumber)
						  {
							$("#contact_number").val(phoneNumber);
						  }*/
						}
				    }	
				  }	
			}catch(err){
				console.log('error in log fetching' + err.message);
			}
	   	
			
		
		try{
			// notes related code			
			console.log("calSid new  " + conn.parameters.CallSid);
			
			console.log("getting twilio widget iin disconnect");
			twilioGetWidgetDetails(function(data){
				console.log("after getting twilio widget in disconnect");
				var widgetDetails = data;
				var widgetPrefs = $.parseJSON(data.prefs);
				var acc_sid = widgetPrefs.twilio_acc_sid;
				var auth_token = widgetPrefs.twilio_auth_token;	
				var isParent = "true";
				showNoteParam['cnf_started'] = cnf_started;
				if(TWILIO_CALLTYPE == "Incoming" || cnf_started) {
					isParent = "false";
				}

/*				try{
					var conferenceName = conn.message.conference;
					if(typeof conferenceName != "undefined"){
						var ApiCallUrl = "/core/api/widgets/twilio/getlastconfcall/" + acc_sid + "/" + auth_token + "/" + conferenceName ;
						twilioApiRequest(ApiCallUrl, function(data){
							var lastCallDetails  = data;
						});
						return;
					}
				}catch(e){
				}*/

				if(calltransfer)
					isParent = "false";

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
					
						var waitForNextDial = false;
						if(typeof callRespJson != "undefined") {
							waitForNextDial = true;
							if(typeof callRespJson.status != "undefined") {
								if(callRespJson.status != "completed" && CALL_CAMPAIGN.start){
									CALL_CAMPAIGN.state = "DISCONNECTED";
									waitForNextDial = false;
								}
								console.log(callRespJson.status);
								contactid = TWILIO_CONTACT_ID;
								if(calltransfer){
									var callnotes = $("#agilecrm-container #call-noty-notes").val();
									if(!callnotes){
										$("#agilecrm-container #call-noty-notes").val("Call Transferred to "+ transfer_number);
									}else{
										$("#agilecrm-container #call-noty-notes").val("Call Transferred to "+ transfer_number+". "+callnotes);
									}
								}
								showNoteAfterCall(callRespJson,messageObj,showNoteParam);
								/*if(calltransfer){
									saveNoteAfterTransfer(callRespJson,messageObj,showNoteParam,contactid,transfer_number);
								}*/
							}
						} else {
							calltransfer = false;
							if(CALL_CAMPAIGN.start){
								CALL_CAMPAIGN.state = "DISCONNECTED";
							}						

						}
						if(!waitForNextDial){
							//if the call campaign is started then we try to make a next call from campaign
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
				console.log("error in geting twilio widget --> " + err.message);
				console.log("dialing next call for call campaign");
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
					TWILIO_CONTACT = null;
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
					
						if (Twilio.Device.status() == "busy" ||callConference.started || (CALL_CAMPAIGN.call_status == "CONNECTED" || CALL_CAMPAIGN.call_status == "CALLING" || CALL_CAMPAIGN.autodial == true))
						{
							console.log("getting one more call.");
							//var btns = [];
							//showDraggableNoty("Twilioio", TWILIO_CONTACT, "missedCall", conn.parameters.From, btns);
							showCallNotyPopup("missedCall", "error",'<span class="noty_contact_details"><b>Missed call : </b><br>' + conn.parameters.From + '<br></span><div class="clearfix"></div>', 5000);
							//showCallNotyPopup("missedCall", "error", Twilio_Call_Noty_IMG+'<span class="noty_contact_details"><b>Missed call : </b><br>' + conn.parameters.From + '<br></span><div class="clearfix"></div>', 5000);
							if(previousDialled){
								To_Number = previousDialled ; 
								previousDialled = "";
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

								var btns = [{"id":"", "class":"btn btn-primary noty_twilio_answer","title":"{{agile_lng_translate 'calls' 'answer'}}"},{"id":"","class":"btn btn-danger noty_twilio_ignore","title":"{{agile_lng_translate 'contacts-view' 'ignore'}}"}];
								showDraggableNoty("Twilioio", TWILIO_CONTACT, "incoming", To_Number, btns);
								
								/*showCallNotyPopup("incoming", "Twilio",
										Twilio_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Incoming call </b>'+ To_Number + '<br><a href="#contact/'+TWILIO_CONTACT_ID+'" style="color: inherit;">' + To_Name + '</a><br></span><div class="clearfix"></div>', false);										*/
						});
					});	
					
				});

		// If any network failure, show error
		Twilio.Device.offline(function()
		{
			// Called on network connection lost.
			console.log("Twilio went offline");

			//closeTwilioNoty();

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
}
function setUpGlobalTwilio()
{

	loadTwilioMin();
/*	head.js(LIB_PATH + "jscore/telephony/i18PhoneFormat.js", function()
			{
				console.log("i18PhoneFormat  loaded for validating numbers");
			});*/
	// Loads twilio min.js to intiliaze twilio call events
	//head.js("https://static.twilio.com/libs/twiliojs/1.2/twilio.min.js", function()
	
}
function twiliocall(phoneNumber, toName,conferenceName, contact)
{
	// get the phone number to connect the call to
	console.log("In twilio call finction after makingcall function and starting call");
	
	var num = phoneNumber;
	var extension;
	if(num.indexOf(";") != -1){
		extension = num.split(";")[1];
		num = num.split(";")[0];
	}
	var cont = contact;
	var numberToDial = getFormattedPhone(num, cont);
	// converting number to dial i 164 format...
	
	if(conferenceName){
		params = { "from" : Verfied_Number, "PhoneNumber" : numberToDial, "conference" : conferenceName};
	}else{
		if(extension){
			params = { "from" : Verfied_Number, "PhoneNumber" : numberToDial,"extension":extension};
		}else{
			params = { "from" : Verfied_Number, "PhoneNumber" : numberToDial};
		}
	}
	
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
		if( Twilio.Device.status()=="ready"){
			Twilio.Device.disconnectAll();
		}
		$("#callStartText").html("");
		$("#callStartTime").html("");
		return;
	}
	
	Twilio.Device.connect(params);

	console.log("calling request sent to twilio to start call");
	
	To_Number = phoneNumber;
	To_Name = toName;
	TWILIO_CALLED_NO = numberToDial;	
	
	if(!CALL_CAMPAIGN.call_from_campaign){
		addContactImg("Outgoing", function(img){
			Twilio_Call_Noty_IMG = img;
			// this was added to remve the error of popup message	
				console.log("calling call noty");
				
				
				if(callConference.started){
					//return without showing the popup on new number
					return;
				}
				var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];
				showDraggableNoty("Twilioio", TWILIO_CONTACT, "outgoing", To_Number, btns);
				
				/*showCallNotyPopup("outgoing", "Twilio", Twilio_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Calling </b>'+ To_Number +'<br><a href="#contact/'+TWILIO_CONTACT_ID+'" style="color: inherit;">' + To_Name + '</a><br></span><div class="clearfix"></div>', false);*/
		},contact);		
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
	//To_Number = undefined;
	To_Name = "";
	closeCallNoty(true);
	// Close noty
	if (Twilio_Call_Noty != undefined)
	{
		Twilio_Call_Noty.close();
		Twilio_Call_Noty = undefined;
	}
	
	
}

function showNoteAfterCall(callRespJson,messageObj,paramJson)
{
	if(!(TWILIO_IS_VOICEMAIL == false))
		   return;

	try{
		if(paramJson){
			if(!jQuery.isEmptyObject(paramJson)){
				if(paramJson.cnf_started){
					if(!callConference.addnote){
						if(callRespJson.duration != "undefined"){
							if(!callRespJson.duration){
								callRespJson.duration = 0;
							}
							callConference.conferenceDuration = parseInt(callConference.conferenceDuration)+parseInt(callRespJson.duration);
							return;
						}
					}else{
						if(!callRespJson.duration){
							callRespJson.duration = 0;
						}
						callConference.conferenceDuration = parseInt(callConference.conferenceDuration)+parseInt(callRespJson.duration);
						var jsonParam = {};
						jsonParam['noteSub'] = TWILIO_CALLTYPE + " call - Done";
						jsonParam['phoneNumber'] = callConference.phoneNumber; // this is phone number of fist person between agent and customer
						jsonParam['direction'] = TWILIO_DIRECTION;
						jsonParam['duration'] =  callConference.conferenceDuration;
						jsonParam['callType'] = TWILIO_DIRECTION;	
						jsonParam['contactId'] = callConference.lastContactedId;
						saveNotesAndActivitiesForConference(jsonParam);
						return;
					}	
				}
			}
		}
	}catch (e) {}
	var	el = $("#noteForm");
	//	TWILIO_CONTACT_ID = 0;

	if(CALL_CAMPAIGN.start){
		if(TWILIO_CALLTYPE == "Outgoing" && CALL_CAMPAIGN.call_from_campaign){
			getContactDetails();
		}
	}
	var callStatus = callRespJson.status;
	var noteStatus = "";
	var noteSub = "";
	var friendlyStatus = "";
	var phoneNumber = "";
	if(TWILIO_DIRECTION == "outbound-dial"){
		phoneNumber = To_Number;
		//phoneNumber = TWILIO_CALLED_NO;
	}else{
		phoneNumber = callRespJson.from;
	}
	
	if(callStatus != 404 && typeof callRespJson.duration != "undefined") {
		switch(callStatus) {
	    case "canceled":
	    	noteSub = TWILIO_CALLTYPE + " call - Declined";
	    	friendlyStatus = "Declined";
	    	noteStatus = "failed";
	        break;
	    case "completed":
	    	noteSub = TWILIO_CALLTYPE + " call - Done";
	    	friendlyStatus = "Done";
	    	noteStatus = "answered";
	    	break;
	    case "busy":
	    	noteSub = TWILIO_CALLTYPE + " call - Busy";
	    	friendlyStatus = "Received busy tone on number "+ phoneNumber;
	    	noteStatus = "busy";
	    	break;
	    case "failed":
	    	noteSub = TWILIO_CALLTYPE + " call - Failed";
	    	friendlyStatus = TWILIO_CALLTYPE + " call made to "+ phoneNumber +" has failed";
	    	noteStatus = "failed";
	    	break;
	    case "no-answer":
	    	noteSub = TWILIO_CALLTYPE + " call - No answer";
	    	friendlyStatus = "No answer";
	    	noteStatus = "busy";
	    	break;
	    default:
	        return;
		}
	}else{
		return;
	}
	
	if(TWILIO_CONTACT_ID) {

		accessUrlUsingAjax("core/api/contacts/"+TWILIO_CONTACT_ID, function(resp){
			console.log(callRespJson);
			var json = resp;
			if(json == null) {
				var jsonObj = {};
				jsonObj['phoneNumber'] = phoneNumber;
				return showContactMergeOption(jsonObj);
			//	return showNewContactModal(phoneNumber);
			}
			var contact_name = getContactName(json);

			if(TWILIO_DIRECTION == "outbound-dial") {
		//				phoneNumber = callRespJson.to;
						phoneNumber = To_Number;
						//phoneNumber = TWILIO_CALLED_NO;
						//TWILIO_CALLED_NO = "";
					}else{
						phoneNumber = callRespJson.from;
					}
					

				 	// Adds contact name to tags ul as li element
					if(callStatus == "completed") {
						var status = "";
						if(calltransfer){
							noteSub = TWILIO_CALLTYPE + " call - Transferred";
							status = "transferred"
						}else{
							status = "answered";
						}
						var data = {};
						data.url = "/core/api/widgets/twilio/";
						data.subject = noteSub;
						data.number = phoneNumber;
						data.callType = TWILIO_DIRECTION;
						data.status = status;
						data.duration = callRespJson.duration;
						data.contId = json.id;
						data.contact_name = contact_name;
						data.widget = "Twilio";
						showDynamicCallLogs(data);

						//changed by prakash to add the last_called parameter and last_connected parameter of contact object on server side - 15/6/15
							if(TWILIO_DIRECTION == "outbound-dial") {
								twilioIOSaveContactedTime(undefined, function(){
									//code to be written to save tag to cotacts for call campaign...
									if(CALL_CAMPAIGN.start && CALL_CAMPAIGN.call_from_campaign){
										updateTotalTime(callRespJson.duration);
										saveTagForCampaign();
									}
								});	
							}
						calltransfer = false;					
					} else {
						//add note automatically
						$.post( "/core/api/widgets/twilio/autosavenote", {
							subject: noteSub,
							message: "",
							contactid: TWILIO_CONTACT_ID,
							phone: phoneNumber,
							callType: TWILIO_DIRECTION,
							status: noteStatus,
							duration: 0 },function(data){
								if(TWILIO_DIRECTION == "outbound-dial") {
						
						if(callStatus != "completed") {
							$.post( "/core/api/widgets/twilio/savecallactivityById?note_id="+
											data.id,{
								id:TWILIO_CONTACT_ID,
							direction: data.callType, 
								phone: data.phone, 
								status : data.status,
								duration : data.duration 
								});
						}
					}else{

						if(callStatus != "completed") {
							$.post( "/core/api/widgets/twilio/savecallactivity?note_id="+
											data.id,{
							direction: data.callType, 
								phone: data.phone, 
								status : data.status,
								duration : data.duration 
								});
						};
					};
					TWILIO_CONTACT_ID = null;
				});
						calltransfer = false;
						
					}
					
				
		});
			
	} else {
		calltransfer = false;
		resetCallLogVariables();
		
		if(callStatus == "completed") {
			var data = {};
			data.url = "/core/api/widgets/twilio/";
			data.subject = noteSub;
			data.number = phoneNumber;
			data.callType = TWILIO_DIRECTION;
			data.status = "answered";
			data.duration = callRespJson.duration;
			data.contId = null;
			data.contact_name = "";
			data.widget = "Twilio";
			CallLogVariables.dynamicData = data;
		}
		
		CallLogVariables.subject = noteSub;
		CallLogVariables.callWidget = "Twilio";
		CallLogVariables.callType = TWILIO_DIRECTION;
		CallLogVariables.phone = phoneNumber;
		CallLogVariables.duration = callRespJson.duration;
		CallLogVariables.status = callRespJson.status;
		
			/*$.post( "/core/api/widgets/twilio/savecallactivity",{
				direction: TWILIO_DIRECTION, 
				phone: phoneNumber, 
				status : callRespJson.status,
				duration : callRespJson.duration 
				});*/
		var jsonObj = {};
		jsonObj['phoneNumber'] = phoneNumber;
		return showContactMergeOption(jsonObj);
		//return showNewContactModal(phoneNumber);
	}

	
}


function showNewContactModal(phoneNumber) {
	$('#personModal').modal('show');
	$("#personForm").find("#phone").val(phoneNumber);
	$("#personForm").find("#phone").removeClass("phone"); 
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
			TWILIO_CONTACT = responseJson;
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
			if(TWILIO_CALLTYPE == "Incoming") {
				isParent = "false";
			}
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
										contactid: TWILIO_CONTACT_ID,
										phone: TWILIO_CALLED_NO,
										callType: TWILIO_DIRECTION,
										status : "voicemail",
										duration : 0
									},function(data){
												if(TWILIO_CALLED_NO != "") {
										$.post( "/core/api/widgets/twilio/savecallactivityById?note_id="+
											data.id,{
											id:TWILIO_CONTACT_ID,
											direction: TWILIO_DIRECTION, 
											phone: TWILIO_CALLED_NO, 
											status : "voicemail",
											duration : 0 
											},function(d){
												console.log(d);
											});
									}
								
										});
									
								
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
function addContactImg(callType, callback, contact)
{
	var notyContactImg = "";
	try{
		if(callType == "Outgoing")
		  {
			var currentContact;
			if(contact){
				currentContact = contact;
			}else{
				try{
					currentContact = agile_crm_get_contact();
				}catch (e) {
				}
			}
			
			if(!currentContact){
				return callback(notyContactImg);
			}
			
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
	}catch(e){
		console.log("error occured in getting image " + e);
		return callback(notyContactImg);
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

function endConferenceIfOne(sid){
	
	if(!sid){
		sid = globalconnection.parameters.CallSid;
	}
	
	$.post( "/core/api/widgets/twilio/endSingleConference", {
		callSid:sid
	},function(data){
		console.log(data);
	});
	
	
}

//jsonParam['number'] and jsonParam['contact'] are two parameter
function confirmConferenceCallToDial(jsonParam){
	
	try{
		
		if(Twilio.Device.status() == "busy"){
				if(globalconnection && globalconnection.parameters){
					// this will build the confirm message and show modal
					var newNum = jsonParam.number;
					var newCnt = jsonParam.contact;
					var number = getFormattedPhone(newNum, newCnt);
					
					
					if(callConference.totalMember >= 1){  // total member == 1
								$.post( "/core/api/widgets/twilio/confCall", {
									From: Verfied_Number,
									To: number,
									conferenceName: callConference.name
								},function(data){
									console.log(data);
									data  = JSON.parse(data);
									var conferenceStatus = data.conferenceStatus;
									if(conferenceStatus == "queued"){
										callConference.totalMember = parseInt(callConference.totalMember)+1;
									}else{
										$("#globalModal").html(getTemplate("callInfoModalAlert"));
										$(".call-modal-body","#globalModal").html("{{agile_lng_translate 'twill' 'failed-join-another-number'}}");
										//$(".call-modal-body","#globalModal").html("Failed to add another number to the conference call. Please try again.");
										$("#globalModal").modal('show');
									}
								});
								return
					}/*else if(callConference.totalMember == 2){
						$("#globalModal").html(getTemplate("callInfoModalAlert"));
						$(".call-modal-body","#globalModal").html("Cannot add another number to the conference call because the maximum participants limit is reached.");
						$("#globalModal").modal('show');
						return;
					}*/
					$("#globalModal").html(getTemplate("callInfoModalConfirm"));
					$(".call-modal-body","#globalModal").html("{{agile_lng_translate 'twill' 'add-another-number'}}");
				//	$(".call-modal-body","#globalModal").html("Do you want to add another number to existing call?");
					var param = {};
					param['number'] = jsonParam.number;
					param['callSid'] = globalconnection.parameters.CallSid;
					param['attribute'] = "conference-confirm"; // this attribute is used to check if-else condition to find
					param['contact'] = jsonParam.contact;
					$("#callModalConfirm_info_ok","#globalModal").data("param", param);
					$("#globalModal").modal('show');
					return;
				}else{
					$("#globalModal").html(getTemplate("callInfoModalAlert"));
					$(".call-modal-body","#globalModal").html("{{agile_lng_translate 'twill' 'connection-lost-conference'}}");
				//	$(".call-modal-body","#globalModal").html("The connection is not active to dial another call.");
					$("#globalModal").modal('show');
				}
				return;
		} 
	}catch(e){
		return;
	}
}

function saveNotesAndActivitiesForConference(jsonParam){
	resetCallLogVariables();
	var data = {};
	
	
	if(jsonParam.contactId) {

		accessUrlUsingAjax("core/api/contacts/"+jsonParam.contactId, function(resp){
			var json = resp;
			var data = {};
			data.url = "/core/api/widgets/twilio/";
			data.subject = jsonParam.noteSub;
			data.number = jsonParam.phoneNumber;
			data.callType = jsonParam.direction;
			data.status = "answered";
			data.duration = jsonParam.duration;
			data.contId = json.id;
			data.contact_name = getContactName(json);
			data.widget = "Twilio";
			showDynamicCallLogs(data);

			//changed by prakash to add the last_called parameter and last_connected parameter of contact object on server side - 15/6/15
				if(TWILIO_DIRECTION == "outbound-dial") {
					twilioIOSaveContactedTime(jsonParam.contactId);
				}	
		});
	}else{
		data.url = "/core/api/widgets/twilio/";
		data.subject = jsonParam.noteSub;
		data.number = jsonParam.phoneNumber;
		data.callType = jsonParam.direction;
		data.status = "answered";
		data.duration = jsonParam.duration;		
		data.widget = "Twilio";
		data.contId = null;
		data.contact_name = "";
		CallLogVariables.dynamicData = data;
		
		CallLogVariables.callWidget = "Twilio";
		CallLogVariables.callType = jsonParam.direction;
		CallLogVariables.phone = jsonParam.phoneNumber;
		CallLogVariables.duration = jsonParam.duration;
		CallLogVariables.status = "answered";
		return showNewContactModal(jsonParam.phoneNumber);
	}	
	







	

	
		/*$.post( "/core/api/widgets/twilio/savecallactivity",{
			direction: TWILIO_DIRECTION, 
			phone: phoneNumber, 
			status : callRespJson.status,
			duration : callRespJson.duration 
			});*/

}
// this function will take number, contact and required format as parameter and gives the desired number..
// country code is taken from contact if available..
function getFormattedPhone(number, cont, format){
	try{
		
		if(!cont || !number){
			return number;
		}
		var numToReturn = number;
		var numberToFormat = number;
		var contact = cont;
		var code ;
		var formattedNumber;
		var countryCode;
		var address = getPropertyValue(contact.properties,'address');
		countryCode = JSON.parse(address).country;
		code = countryCode;
		
		// this will call the library method and gets output in json format
		formattedNumber = phoneNumberParser(numberToFormat,code);
		
		// check if the formatted number is valid
		var formattedNumberResult;	
		if(format){
			if(format == "national"){
				formattedNumberResult =formattedNumber.result.nationalFormat;
			}else if(format == "international"){
				formattedNumberResult = formattedNumber.result.internationalFormat;
			}else if(format == "carrierFormat"){
				formattedNumberResult = formattedNumber.result.carrierFormat;
			}else{
				formattedNumberResult = formattedNumber.result.format164;
			}
		}else{
			formattedNumberResult =  formattedNumber.result.format164;
		}
			
		if(formattedNumberResult && formattedNumberResult!= "invalid"){
			numToReturn = formattedNumberResult;
		}
		console.log("changes format phonenumber is " + formattedNumber);
		
	}catch(e){}
	return numToReturn;
}

function saveNoteAfterTransfer(callRespJson,messageObj,paramJson, TWILIO_CONTACT_ID,tonumber){
	var callStatus = callRespJson.status;
	var noteStatus = "";
	var noteSub = "";
	var friendlyStatus = "";
	var phoneNumber = tonumber;
	
	noteSub =  "Call Transfer - Done";
	friendlyStatus = "Done";
	noteStatus = "Transfer";
	
	if(TWILIO_CONTACT_ID) {
		$.post( "/core/api/widgets/twilio/autosavenote", {
			subject: noteSub,
			message: "",
			contactid: TWILIO_CONTACT_ID,
			phone: tonumber,
			callType: TWILIO_DIRECTION,
			status: noteStatus,
			duration: 0 },function(data){
			if(TWILIO_DIRECTION == "outbound-dial") {
				if(callStatus != "completed") {
					$.post( "/core/api/widgets/twilio/savecallactivityById?note_id="+
									data.id,{
						id:TWILIO_CONTACT_ID,
						direction: TWILIO_DIRECTION, 
						phone: data.phone, 
					});
				}
			}else{
				if(callStatus != "completed") {
					$.post( "/core/api/widgets/twilio/savecallactivity?note_id="+
						data.id,{
						direction: TWILIO_DIRECTION, 
						phone: data.phone
					});
				};
			};
			TWILIO_CONTACT_ID = null;
		});
	}
}