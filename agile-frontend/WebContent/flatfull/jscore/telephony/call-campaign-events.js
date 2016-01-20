$(function(){
	
	
// This method is called when the add-note modal is closed .....
//This will check if the campaign is started and need to dial the next call....
	$('#noteModal').on('hidden.bs.modal', function (e) {
		console.log(CALL_CAMPAIGN.start +"  closeTwilioNoty "+CALL_CAMPAIGN.call_from_campaign);
			
			// If call campaign then update call noty
		if(CALL_CAMPAIGN.last_clicked == "ADD-NOTE"){
				CALL_CAMPAIGN.last_clicked = null;
				return;
		}
			
		if(CALL_CAMPAIGN.start){
			if(CALL_CAMPAIGN.call_status == "DISCONNECTED"){
				  CALL_CAMPAIGN.state = "START";
				  if(CALL_CAMPAIGN.autodial){
					  dialNextCallAutomatically();
				  }else{
					  dialNextCallManually();
				  }
			}
		}	
			
	});  
	
	// This method is called when the add-note modal is closed .....
	//This will check if the campaign is started and need to dial the next call....
		$('#globalModal').on('hidden.bs.modal', function (e) {
			console.log(CALL_CAMPAIGN.start +"  closeTwilioNoty "+CALL_CAMPAIGN.call_from_campaign);
				
			if(CALL_CAMPAIGN.start){
				if(CALL_CAMPAIGN.call_status == "DISCONNECTED"){
					  CALL_CAMPAIGN.state = "START";
					  if(CALL_CAMPAIGN.autodial){
						  dialNextCallAutomatically();
					  }else{
						  dialNextCallManually();
					  }
				}
			}	
				
		});  
		
	
//This method is called when the personmodal is closed....
//This will check if the campaign is started and need to dial the next call....
	$('#personModal').on('hidden.bs.modal', function (e) {
			
			
		if(CALL_CAMPAIGN.start){
			if(CALL_CAMPAIGN.call_status == "DISCONNECTED"){
				  CALL_CAMPAIGN.state = "START";
				  if(CALL_CAMPAIGN.autodial){
					  dialNextCallAutomatically();
				  }else{
					  dialNextCallManually();
				  }
			}
		}	
			
	});  

//This method is called when the user click on select box for wrapup time in call-campaign setting page....
//This will update the selected value in variable....
	$('body').on('click', '#timerValue', function(e){
			e.preventDefault();
			if(CALL_CAMPAIGN.start){return;}
			var time = $(this).attr("value");
			var timeHtml = $(this).html();
			$("#call_campaign_timer").attr("value",time);
			$("#call_campaign_timer").html(timeHtml);
			CALL_CAMPAIGN.user_timer = time;
	});
	
//This method is called when the user checks the autodial radio button in call-campaign setting page....
//This will update the selected value in variable....
	$('body').on('click', '#call_campaign_autodial', function(e)
	{
					if(CALL_CAMPAIGN.start){return;}
					var autoDial = false;
					var type = $(this).val();
					$("#wrapUpDiv").hide();
					//$("#rampTimeButton").attr("disabled","disabled");
					if(type == "autodial"){
						autoDial = true;
						$("#wrapUpDiv").show();
						//$("#rampTimeButton").removeAttr('disabled');
					}
					
					CALL_CAMPAIGN.autodial = autoDial;
	});
			
//This method is called when the user clicks on close button in call-campaign setting page.... 
//This method will take the user back to contact list page....	
	$('body').on('click', '#bulk-close-call-campaign', function(e)
	{
				e.preventDefault();
				console.log("Cancel call campaign");
				if(CALL_CAMPAIGN.callObject != null){
					clearTimeout(CALL_CAMPAIGN.callObject);
					CALL_CAMPAIGN.callObject = null;
				}
				routeToPage("contacts");

	});	
	
//This method is called when the user clicks on start-campaign button in call-campaign setting page.... 	
//This method will start the call-campaign and take the user to contact detail page....		
	$('body').on('click', '#bulk-start-call-campaign', function(e)
	{
		
		try{
					e.preventDefault();
					if(CALL_CAMPAIGN.last_clicked == "start-bulk-campaign"){
						return;
					}
					
					// Disabled the buttons and fields......
					$("#bulk-start-call-campaign").attr("disabled","disabled");
					$("#bulk-start-call-campaign").html("Loading...");
					$("#call_campaign_autodial").attr("disabled","disabled");
					$("#addTag").attr("disabled","disabled");
					$("#rampTimeButton").attr("disabled","disabled");
					
					
					//set the rampup timer value to the variable.......
					CALL_CAMPAIGN.user_timer = $("#call_campaign_timer").attr("value");
					
					
					//set the dial type value to the variable.......
					var autoDial = false;
					var type = $("input[name=call_campaign_autodial]:checked").val();
					if(type == "autodial"){
						autoDial = true;
					}
					CALL_CAMPAIGN.autodial = autoDial;
					
					
					//check and set tag................
					var tag = $("#addTag").val().trim();
					if(tag.length>0)
					{
						if (!isValidTag(tag, false) || (/^\s*$/).test(tag)) {
							console.log("not valid tag");
							$('#correctTag').modal('show');
							$("#bulk-start-call-campaign").removeAttr('disabled');
							$("#bulk-start-call-campaign").html("Start Campaign");
							$("#call_campaign_autodial").removeAttr('disabled');
							$("#addTag").removeAttr('disabled');
							$("#addTag").val("");
							if(CALL_CAMPAIGN.autodial == true){
								$("#rampTimeButton").removeAttr('disabled');
							}
							return;
						}
						CALL_CAMPAIGN.tag = tag;
						CALL_CAMPAIGN.has_tag = true;	
							
					}	
					
					
					
					// check whether the twilio widget is loaded. If loaded then move to contact detail page.
					// after timeout it is not loaded ask client to check internet connection.
					if (!Twilio_Start)
					{
						
							var waitTime=1000; // this is in milisecond
							
							CALL_CAMPAIGN.callObject = setTimeout( function wait(){
									if(Twilio_Start){
										
										CALL_CAMPAIGN.last_clicked = "start-bulk-campaign";
										var id = (CALL_CAMPAIGN.contact_id_list[0]);
										Backbone.history.navigate("contact/" + id, { trigger : true });
										//CALL_CAMPAIGN.start = true;
										CALL_CAMPAIGN.callObject = null;
										$( window ).scrollTop( 0 );
										
									}else{
										
										waitTime = waitTime+1000;
										if(waitTime < 7000){
											CALL_CAMPAIGN.callObject = setTimeout(wait,waitTime);
										}else{
											
											$("#bulk-start-call-campaign").removeAttr('disabled');
											$("#bulk-start-call-campaign").html("Start Campaign");
											$("#call_campaign_autodial").removeAttr('disabled');
											$("#addTag").removeAttr('disabled');
											if(CALL_CAMPAIGN.autodial == true){
												$("#rampTimeButton").removeAttr('disabled');
											}
											$('#hitRefreshModel').modal('show');
										}
									}
									
								}, waitTime);
					
					}else{
						CALL_CAMPAIGN.last_clicked = "start-bulk-campaign";
						var id = (CALL_CAMPAIGN.contact_id_list[0]);
						Backbone.history.navigate("contact/" + id, { trigger : true });
						//CALL_CAMPAIGN.start = true;
						$( window ).scrollTop( 0 );
					}		
		}catch(err){
			console.log("error in -start-call-campaign " + err.message);
			CALL_CAMPAIGN.last_clicked = null;
			$("#bulk-start-call-campaign").removeAttr('disabled');
			$("#bulk-start-call-campaign").html("Start Campaign");
			$("#call_campaign_autodial").removeAttr('disabled');
			$("#addTag").removeAttr('disabled');
			if(CALL_CAMPAIGN.autodial == true){
				$("#rampTimeButton").removeAttr('disabled');
			}
		}
	   });
	
//This method is called when the user clicks on startcallcampaign button in contact list page.... 	
//This method will take the user to call campaign setting page....		
	$('body').on('click', '#show-callcampaignModal', function(e)
	{
				e.preventDefault();
				console.log("In show-callcampaignModal");
				
				if (CALL_CAMPAIGN.start)
				{
					var alertMessage = '<center><div class="alert alert-danger fade in" style="z-index:10000;margin-bottom:0px;margin-right:-4px;font-size: 14px;"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a><strong>Alert!</strong> Call campaign is already running.</div></center>';
					var timeToDisplay = 10000;
					showCampaignAlert(alertMessage,timeToDisplay);
					return;
				}
			
				// twilio check
				if (!Twilio_Start)
				{
					//-----------
					$.getJSON("/core/api/widgets/TwilioIO", function(twilioio_widget)
							{
								if (twilioio_widget == null){
									$('#twilioStateModal').modal('show');
									return;
								}	
								console.log("twilioio_widget");
								showSettingPage();
							}).error(function(data)
							{
								console.log("twilioio_widget error");
								console.log(data);
								return;
							});
					return;
					
				}else{
					showSettingPage();
				}
				
	});
			

//This method is called when the user clicks on mute button in campaign.... 	
//This method will mute the call and change the mute icon....	
	$('body').on('click', '#pause', function(e)
	{
				e.preventDefault();
				console.log("Twilio mute from noty");
				
					//CALL_CAMPAIGN.last_clicked = "PAUSE";
					//CALL_CAMPAIGN.state = "PAUSE";
					
					$("#pauseDiv").hide();
					$("#resumeDiv").show();
					if(globalconnection){
						globalconnection.mute(true);
					}
					
	});
	
//This method is called when the user clicks on unmute button in campaign.... 	
//This method will unmute the call and change the unmute icon....		
	$('body').on('click', '#resume', function(e)
			{
				e.preventDefault();
				console.log("Twilio unmute from noty");
				
					//CALL_CAMPAIGN.last_clicked = "RESUME";
					//CALL_CAMPAIGN.state = "RESUME";
					
					$("#resumeDiv").hide();
					$("#pauseDiv").show();
					if(globalconnection){
						globalconnection.mute(false);
					}
			});
	
//This method is called when the user clicks on exit button in campaign.... 	
//This method will show the alert to user confirming to exit from the campaign....		
	$('body').on('click', '#stop', function(e)
			{
				e.preventDefault();
				console.log("Twilio call noty_twilio_stop from noty");
				
				CALL_CAMPAIGN.last_clicked = "STOP";
				$('#exitCampaignModal').modal('show');
				//holdCurrentCall();
			});
	
//This method is called when the user clicks on hangup button in campaign.... 	
//This method will end the current call and dial next call in case of autodial....	
	$('body').on('click', '#hangup', function(e)
	{
				e.preventDefault();
				console.log("Twilio call hang up from noty");
				CALL_CAMPAIGN.last_clicked = "HANGUP";
				
				if(CALL_CAMPAIGN.call_status == "DISCONNECTED"  && (($("#noteModal").data('bs.modal') || {}).isShown != true)){
					CALL_CAMPAIGN.state = "START";
					
						  if(CALL_CAMPAIGN.autodial){
							  dialNextCallAutomatically();
						  }else{
							  dialNextCallManually();
						  }
					
				}
				
				Twilio.Device.disconnectAll();
				

				
				//if the call campaign is started then we try to make a next call from campaign
				// After 24hrs check where call is connected or not 
/*							if(CALL_CAMPAIGN.start && CALL_CAMPAIGN.call_from_campaign)
							  {
								// if state is pause i.e callresp.status != completed then make another call
								// if state is pause i.e callresp.status = completed then hidden function will make the call 
									if(CALL_CAMPAIGN.state == "DISCONNECTED"  && (($("#noteModal").data('bs.modal') || {}).isShown != true)){
										CALL_CAMPAIGN.state = "START";
										
											  if(CALL_CAMPAIGN.autodial){
												  dialNextCallAutomatically();
											  }else{
												  dialNextCallManually();
											  }
										
									}
								
										// Next contact call
									  
							  }*/
	});
	
//This method is called when the user clicks on start button in campaign.... 	
//This method will start the call in case of manual dailing....		
	$('body').on('click', '#start', function(e)	
	{
					e.preventDefault();
					console.log("Twilio call noty_twilio_call from noty");

					if(CALL_CAMPAIGN.autodial){
						if(CALL_CAMPAIGN.callObject != null){
							clearTimeout(CALL_CAMPAIGN.callObject);
							CALL_CAMPAIGN.callObject = null;
						}
						if(CALL_CAMPAIGN.timeObject != null){
							clearTimeout(CALL_CAMPAIGN.timeObject);
							CALL_CAMPAIGN.timeObject = null;
						}
							CALL_CAMPAIGN.state = "START";
							CALL_CAMPAIGN.last_clicked = null; // this is to check the last
							CALL_CAMPAIGN.countdown_timer = 0;
							twiliocall(CALL_CAMPAIGN.selected_number, getContactName(CALL_CAMPAIGN.current_contact));
						
					}else{
						if(CALL_CAMPAIGN.callObject != null){
							return;
						}
						makeCampaignCall();
					}
					

	});
	
//This method is called when the user .......... 	
//This method will .......		
			
	$('body').on('click', '#noty-show-note', function(e)
	{	
				e.preventDefault();
				console.log("Twilio call noty-show-note from noty");
				CALL_CAMPAIGN.last_clicked = "ADD-NOTE";
				// Show add note modal with current contact from call
				// noty
				var el = $("#noteForm");
				$('.tags', el)
						.html(
								'<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="' + CALL_CAMPAIGN.current_contact.id + '">' + CALL_CAMPAIGN.current_contact_name + '</li>');
				$("#noteForm").find("#description").focus();
				$('#noteModal').modal('show');
				agile_type_ahead("note_related_to", el, contacts_typeahead);
	});
	
	
//This method is called when the user clicks on next button in campaign in case of manual dialing.... 	
//This method will show the modal to confirm in case of ongoing call otherwise take to next contact....		
	$('body').on('click', '.noty_twilio_next', function(e)	
	{
				e.preventDefault();
				
				if(CALL_CAMPAIGN.call_status != "IDEAL"){
					$('#campaignNextModal').modal('show');
					
				}else{
					
					console.log("Twilio call noty_twilio_next from noty");
					CALL_CAMPAIGN.last_clicked = "NEXT"	;
					  
					  dialNextCallAutomatically();					
				}
	});
	
//This method is called when the user clicks on skip button in campaign in case of Autodaial dialing.... 	
//This method will show the modal to confirm in case of ongoing call otherwise take to next contact....
	$('body').on('click', '.noty_twilio_skip', function(e)	
	{
			e.preventDefault();
			if(CALL_CAMPAIGN.current_contact_phonenumber.length != 0 && (Twilio.Device.status() == "busy" || CALL_CAMPAIGN.call_status == "CALLING")){
					$('#campaignSkipModal').modal('show');
				
			}else{
				console.log("Twilio call noty_twilio_skip from noty");
				if(CALL_CAMPAIGN.callObject != null){
					clearTimeout(CALL_CAMPAIGN.callObject);
					CALL_CAMPAIGN.callObject = null;
				}
				CALL_CAMPAIGN.last_clicked = "SKIP"	;
				CALL_CAMPAIGN.state = "START";
				dialNextCallAutomatically();
			}
			
	});

//This method is called when the user clicks on next button in campaign in case of manual dialing.... 	
//This method will show the modal to confirm in case of ongoing call otherwise take to previous contact....

	$('body').on('click', '.noty_twilio_previous', function(e)
	{
					e.preventDefault();
					if(CALL_CAMPAIGN.call_status != "IDEAL"){
						$('#campaignPreviousModal').modal('show');
					}else{
						console.log("Twilio call noty_twilio_previous from noty");
						CALL_CAMPAIGN.last_clicked = "PREVIOUS"	;
						CALL_CAMPAIGN.current_count = CALL_CAMPAIGN.current_count - 2;
						  dialNextCallAutomatically();
							
					}
					
	});


//This method is called when the user clicks on addphonenumber button in campaign.... 	
//This method will show the continue edit page to edit the contact....
	$('body').on('click', '.noty_add_phone', function(e)	
	{
				e.preventDefault();
				console.log("Twilio call noty_add_phone from noty");
				CALL_CAMPAIGN.last_clicked = "ADD-PHONE";
				// Add loading img till contact update
				$(".noty_new_phone").html('<img src="'+updateImageS3Path("/img/ajax-loader.gif")+'">');

				CALL_CAMPAIGN.contact_update = true;

				var contact = CALL_CAMPAIGN.current_contact;

				// Open current contact edit
				// Contact Edit - take him to continue-contact form
				add_custom_fields_to_form(contact, function(contact)
				{
					if (contact.type == 'COMPANY')
						deserialize_contact(contact, 'continue-company');
					else
						deserialize_contact(contact, 'continue-contact');
				//	$("#continueform").css({"pointer-events":"auto"});
					$(".noty_new_phone").html('');
				}, contact.type);
	});

//This method is called when the user clicks on dialpad button in campaign.... 	
//This method will show the dialpad which can be closed by clicking anywhere on screen....
	$('body').on('click', '#dialpad', function(e)
	{
							e.preventDefault();
							e.stopPropagation();
							console.log("Twilio call dailpad from noty");
							$('#dialpad').hide();
							$('#campaign_dialpad_btns').show();
	});


//This method is called when the user clicks on dialpad buttons to prevent it from disappear in campaign.... 	
	$('body').on('click', '#campaign_dialpad_btns', function(e)	
	{
							e.stopPropagation();
	});


//This method will close the dialpad which can be closed by clicking anywhere on screen....
	$(document).on('click', function(e)
	{
			if($('#campaign_dialpad_btns').length !=0){
				$('#campaign_dialpad_btns').hide();
				$('#dialpad').show();
			}
	});	
	

//This method is called when the user clicks on No option in exitmodal in campaign.... 	
//This method will close the shown model....				
	$('body').on('click', '#exit_campaign_no', function(e)
	{
						e.preventDefault();
						$('#exitCampaignModal').modal('hide');
						
	});


//This method is called when the user clicks on Yes option in exitmodal in campaign.... 	
//This method will close the shown model and end the campaign taking the user to contact list page....
	$('body').on('click', '#exit_campaign_yes', function(e)
	{
				e.preventDefault();
				if(CALL_CAMPAIGN.start){
					$('#exitCampaignModal').modal('hide');
					if(CALL_CAMPAIGN.callObject != null){
						clearTimeout(CALL_CAMPAIGN.callObject);
					}
				
					stopCallCampaign();
					 var alertMessage = '<center><div class="alert alert-success fade in" style="z-index:10000;margin-bottom:0px;margin-right:-4px;font-size: 14px;"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>You have successfully exited the call campaign.</div></center>'; 
					 var timeToDisplay = 10000;
					 showCampaignAlert(alertMessage,timeToDisplay) 
				}
	});


//This method is called when the user clicks on No option in previousModal in campaign.... 	
//This method will close the shown model....
	$('body').on('click', '#previous_contact_no', function(e)
	{
					e.preventDefault();
					$('#campaignPreviousModal').modal('hide');
					
	});


//This method is called when the user clicks on Yes option in previousmodal in campaign in manualmode.... 	
//This method will close the shown model and take the user to next conntact....
	$('body').on('click', '#previous_contact_yes', function(e)
	{
			e.preventDefault();
			$('#campaignPreviousModal').modal('hide');
			console.log("Twilio call noty_twilio_previous from noty");
			CALL_CAMPAIGN.last_clicked = "PREVIOUS"	;
			
			CALL_CAMPAIGN.current_count = CALL_CAMPAIGN.current_count - 2;
		
			if (CALL_CAMPAIGN.call_status == "CONNECTED" || Twilio.Device.status() == "busy" || CALL_CAMPAIGN.call_status == "CALLING"){
				Twilio.Device.disconnectAll();
			}				

		//	  dialNextCallAutomatically();

	});



//This method is called when the user clicks on No option in Nextmodal in campaign.... 	
//This method will close the shown model....	
	$('body').on('click', '#next_contact_no', function(e)
	{
				e.preventDefault();
				$('#campaignNextModal').modal('hide');
				
	});


//This method is called when the user clicks on No option for skipModel in campaign for autodial mode.... 	
//This method will close the shown model....	
	$('body').on('click', '#skip_contact_no', function(e)
	{
				e.preventDefault();
				$('#campaignSkipModal').modal('hide');
				
	});



//This method is called when the user clicks on Skip option in twiliostatemodal in campaign.... 	
//This method will close the shown model....
	$('body').on('click', '#twilio_state_skip', function(e)	
	{
				e.preventDefault();
				$('#twilioStateModal').modal('hide');
	});



//This method is called when the user clicks on Add option in twiliostatemodal in campaign.... 	
//This method will close the shown model and take the user to add-widget page....	
	$('body').on('click', '#twilio_state_add', function(e)	
	{
		e.preventDefault();
		$('#twilioStateModal').modal('hide');
		routeToPage("add-widget");
	});


//This method is called when the user clicks on Ok option in alert message in campaign.... 	
//This method will close the shown model....
	$('body').on('click', '#info_onCall_ok', function(e)
	{
				e.preventDefault();
				$('#alreadyOnCall').modal('hide');
	});



//This method is called when the user clicks on Ok option in alert message in campaign.... 	
//This method will close the shown model....	
	$('body').on('click', '#info_wait_ok', function(e)
	{
				e.preventDefault();
				$('#pleaseWait').modal('hide');
	});


//This method is called when the user clicks on Ok option in alert message for tagmodal in campaign.... 	
//This method will close the shown model....	
	$('body').on('click', '#info_tag_ok', function(e)
	{
		e.preventDefault();
		$('#correctTag').modal('hide');
	});

//This method is called when the user clicks on Ok option in alert message for noconnection shown at the time of startcampaign in campaign.... 	
//This method will close the shown model....		
	$('body').on('click', '#hitRefresh_ok', function(e)
	{
		e.preventDefault();
		$('#hitRefreshModel').modal('hide');
	});

//This method is called when the user clicks on Pause button in campaign.... 	
//This method will pause the call which is scheduled to start after n sec....		
	$('body').on('click', '#campaign_pauseCall', function(e)
	{
				e.preventDefault();
				console.log("Twilio pause from noty");
				CALL_CAMPAIGN.last_clicked = "PAUSE";
				$("#campaign_pauseCall").hide();
				$("#campaign_resumeCall").show();
				$("#callPauseText").show();
				$("#pauseCallDiv").tooltip('hide')
				  .attr('data-original-title', "Resume current call.")
				  .tooltip('fixTitle')
				  .tooltip('show');
				
				if(CALL_CAMPAIGN.callObject != null){
					clearTimeout(CALL_CAMPAIGN.callObject);
					CALL_CAMPAIGN.callObject = null;
				}
				if(CALL_CAMPAIGN.timeObject != null){
					clearTimeout(CALL_CAMPAIGN.timeObject);
					CALL_CAMPAIGN.timeObject = null;
				}
	});


//This method is called when the user clicks on Resume button in campaign.... 	
//This method will start the pasued call....		
	$('body').on('click', '#campaign_resumeCall', function(e)
	{
				e.preventDefault();
				console.log("Twilio resume from noty");
				CALL_CAMPAIGN.last_clicked = "RESUME";
				$("#campaign_resumeCall").hide();
				$("#campaign_pauseCall").show();
				$("#callPauseText").hide();
				$("#pauseCallDiv").tooltip('hide')
				  .attr('data-original-title', "Pause current call.")
				  .tooltip('fixTitle')
				  .tooltip('show');
				var time = CALL_CAMPAIGN.countdown_timer * 1000;
				Tick();
				CALL_CAMPAIGN.callObject = setTimeout( function(){
					CALL_CAMPAIGN.state = "START";
					CALL_CAMPAIGN.last_clicked = null;   // this is to check the last click variable in disconnect call
					twiliocall(CALL_CAMPAIGN.selected_number, getContactName(CALL_CAMPAIGN.current_contact));
				}, time);
	});


//This method is called when the user clicks Yes option in campaign in manul mode.... 	
//This method will disconnect any ongoing call and the user to next contact....		
	$('body').on('click', '#next_contact_yes', function(e)
	{
		e.preventDefault();
		$('#campaignNextModal').modal('hide');
		console.log("Twilio call noty_twilio_next from noty");
		CALL_CAMPAIGN.last_clicked = "NEXT"	;

		if (CALL_CAMPAIGN.call_status == "CONNECTED" || Twilio.Device.status() == "busy" || CALL_CAMPAIGN.call_status == "CALLING"){
			Twilio.Device.disconnectAll();
		}				

		//  dialNextCallAutomatically();

	});


//This method is called when the user clicks Yes option in skipmodel in campaign in Autodial mode.... 	
//This method will disconnect any ongoing call and the user to next contact....		
	$('body').on('click', '#skip_contact_yes', function(e)
	{
		e.preventDefault();
		$('#campaignSkipModal').modal('hide');
		console.log("Twilio call noty_twilio_skip from noty");
		CALL_CAMPAIGN.last_clicked = "SKIP"	;
		
		if(CALL_CAMPAIGN.callObject != null){
			clearTimeout(CALL_CAMPAIGN.callObject);
			//CALL_CAMPAIGN.callObject = null;
		}

		if (CALL_CAMPAIGN.call_status == "CONNECTED" || Twilio.Device.status() == "busy" || CALL_CAMPAIGN.call_status == "CALLING"){
			Twilio.Device.disconnectAll();
		}				
	//	CALL_CAMPAIGN.state = "START";
	//	dialNextCallAutomatically();

	});


	//This will hide the info shown to the user at the time of starting of campaign
	$('body').on('click', '#reStartCampaign_ok', function(e)
			{
				e.preventDefault();
				$('#startCampaignAgain').modal('hide');
			});
	
	
	window.onbeforeunload = function() {
		var message = 'You are currently running a call campaign. If you reload the page the current call campaign will be exited automatically.';
		 if(CALL_CAMPAIGN.start){
			 return message;
		 }else{
			 return;
		 }
	}
});

//end call campaign related @Thnx Prakash @ 24/9/2015
