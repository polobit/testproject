
$(function()
{
	
	$('body').on('click', '.show-dialler', function(e)
			{
			  	e.preventDefault();
			  	if(default_call_option.callOption.length == 0){
			  	$('#twilioStateModal').modal('show'); // using it as it fulfill the requrements
			  		return;
			  	}else if(default_call_option.callOption.length == 1){
			  		var index = containsOption(default_call_option.callOption, "name", "CallScript");
			  		var index1 = containsOption(default_call_option.callOption, "name", "Asterisk");
			  		if(index != -1  || index1 != -1 ){
			  			$('#twilioStateModal').modal('show'); // using it as it fulfill the requrements
				  		return;
			  		}
			  	}
			  	else if(default_call_option.callOption.length == 2){
			  		var index = containsOption(default_call_option.callOption, "name", "CallScript");
			  		var index1 = containsOption(default_call_option.callOption, "name", "Asterisk");
			  		if(index != -1 && index1 != -1 ){
			  			$('#twilioStateModal').modal('show'); // using it as it fulfill the requrements
				  		return;
			  		}
			  	}	
			  	// loading the direct -dialing template
				  	getTemplate('dialler-page', {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						var x = 100;
						var y = 100;
						$('#direct-dialler-div').html($(template_ui));
						$("#direct-dialler-div").css({'left':x,'top': y});
						$("#direct-dialler-div").show();
						$('[data-toggle="tooltip"]').tooltip();
						
						
				// selecting the default widget or preffed widget	
				// we are not counting cal script so leaving adding one more condition to check 2 options 		
				var selectedWidget = _agile_get_prefs("dial-default-widget");
								
				// adding active and inactive widget to dial		
				if(default_call_option.callOption.length>2){	
						var index = containsOption(default_call_option.callOption, "name", "CallScript");
						var index1 = containsOption(default_call_option.callOption, "name", "Asterisk");
						$.each(default_call_option.callOption, function(i, obj){
							var name = widgetCallName[obj.name];
							$(".dialler-widget-name-" + name +"> a").removeClass("inactive");
							//$(".dialler-widget-name-" + name).removeClass("none");
							$(".dialler-widget-name-" + name +"> a").removeClass("selected-widget");
							$(".dialler-widget-name-" + name +"> a").addClass("actives");
							if( index != -1 && index1 !=-1){
								if(default_call_option.callOption.length>3){
									$(".dialler-widget-name-" + name).removeClass("none");
								}	
							}else{
								$(".dialler-widget-name-" + name).removeClass("none");
							}	
							
						});
					if(selectedWidget){
						$(".dialler-widget-name-" + selectedWidget +"> a").addClass("selected-widget");
					}else{
						var index = containsOption(default_call_option.callOption, "name", "TwilioIO");
						if( index == -1){
							if (widgetCallName[default_call_option.callOption[0].name] != "CallScript"){
								selectedWidget = widgetCallName[default_call_option.callOption[0].name];
							}else{
								selectedWidget = widgetCallName[default_call_option.callOption[1].name];
							}
							_agile_set_prefs("dial-default-widget", selectedWidget);
						}else{
							selectedWidget = "Twilio";
							_agile_set_prefs("dial-default-widget", "Twilio");
						}
						$(".dialler-widget-name-" + selectedWidget +"> a").addClass("selected-widget");
					}
				}else if(default_call_option.callOption.length == 2){
					var index = containsOption(default_call_option.callOption, "name", "CallScript");
					var index1 = containsOption(default_call_option.callOption, "name", "Asterisk");
					$.each(default_call_option.callOption, function(i, obj){
						var name = widgetCallName[obj.name];
						$(".dialler-widget-name-" + name +"> a").removeClass("inactive");
						$(".dialler-widget-name-" + name +"> a").removeClass("selected-widget");
						$(".dialler-widget-name-" + name +"> a").addClass("actives");
						if( index == -1 && index1 ==-1){
							$(".dialler-widget-name-" + name).removeClass("none");
						}
					});
					if( index != -1 || index1 !=-1){
						$(".panel-heading","#dialler-page").css("height",0);
						// take name of other and keep it
					}else{
						if(selectedWidget){
							$(".dialler-widget-name-" + selectedWidget +"> a").addClass("selected-widget");
						}else{
							var index1 = containsOption(default_call_option.callOption, "name", "TwilioIO");
							if( index == -1){
									selectedWidget = widgetCallName[default_call_option.callOption[0].name];
									_agile_set_prefs("dial-default-widget", selectedWidget);
							}else{
								selectedWidget = "Twilio";
								_agile_set_prefs("dial-default-widget", "Twilio");
							}
								$(".dialler-widget-name-" + selectedWidget +"> a").addClass("selected-widget");
						}
					}
				}else{
					$(".panel-heading","#dialler-page").css("height",0);
				}
				
				var isDragging = false;
				$("#dail_phone_number")
				.mousedown(function() {
					$( "#dail_phone_number" ).unbind('blur');
					isDragging = true;
				})
				.mousemove(function() {
					if(isDragging){
						$( "#dail_phone_number" ).blur(); 
					}else{
						$( "#dail_phone_number" ).unbind('blur');
					}
				})
				.mouseup(function() {
					$( "#dail_phone_number" ).unbind('blur');
					isDragging = false;
				});
				// start- dialler configuring		
				dialled.using = "default";

				$("#direct-dialler-div").draggableTouch();
				
				$("#direct-dialler-div").bind("dragstart", function(e, pos) {
					 flag = true;
						//you can do anything related to move
				    }).bind("dragend", function(e, pos) {
				    	if(flag){
				    		flag = false;
				  		//  var maxWidth = ($(window).width())-190;
				  		  var maxHeight = $(window).height()-100;
				  		  var popup_position_top = $(this).css('top').split("px")[0];
				  		 // var popup_position_left = $(this).css('left').split("px")[0];
				  				var y = $(window).height()-200;
				  				var x = 200;
				  			  if( popup_position_top > maxHeight){
				  				$("#direct-dialler-div").animate({ top: y, left:x }, 500);
				  			  }
				    	}
				    });
				}, "#direct-dialler-div");
			});
	
	$('#agilecrm-container #direct-dialler-div').on('click', '#clear-dialler', function(e)
			{
			  	e.preventDefault();
			  	$("#dail_phone_number").val("");
			  	$("#clear-dialler").hide();
			});
	
	$('#agilecrm-container #direct-dialler-div').on('click', '.dialler-widget-li', function(e)
			{
			  	e.preventDefault();
			  	var flag = $(this).find("a").hasClass("actives");
			  	if(!flag){
			  		return;
			  	}
			  	$(this).parent().find("a").removeClass("selected-widget");
		  		$(this).find("a").addClass("selected-widget");	
			  	var value = $(this).find("a").attr("value");
			  	_agile_set_prefs("dial-default-widget", value);
			});
	
	
	$('#agilecrm-container #direct-dialler-div').on('click', '#close-dialler', function(e)
			{
			  	e.preventDefault();
			  	$("#direct-dialler-div").hide();
			  	dialled.using = "default";
			});
	
	$('#agilecrm-container #direct-dialler-div').on('keydown', '#dail_phone_number', function(e) {
    	if(e.which == 13 )
    		{
    			$(".dial-number").trigger('click');
    			
    			$("#dialler-phone-number-form").submit();
    		}

	});
	
	$('#agilecrm-container #direct-dialler-div').on('keyup', '#dail_phone_number', function(e) {
    	var value = $("#dail_phone_number").val();
    	if(!value){
    		$("#clear-dialler").hide();
    	}else{
    		$("#clear-dialler").show();
    	}
	});
	
	$('#agilecrm-container #direct-dialler-div').on('click', '.dial-number', function(e){
	  	e.preventDefault();
	  	var to = $("#dail_phone_number").val();
	  	var from;
	  	var widgetName;
	  	if(default_call_option.callOption.length>2){
	  		widgetName = $(".dialler-widget-li").parent().find("a.selected-widget").attr("value");
	  	}else if(default_call_option.callOption.length == 2){
	  		var index = containsOption(default_call_option.callOption, "name", "CallScript");
	  		var index1 = containsOption(default_call_option.callOption, "name", "Asterisk");
	  		if(index == -1 && index1 == -1){
	  			widgetName = $(".dialler-widget-li").parent().find("a.selected-widget").attr("value");
	  		}else{
	  			widgetName = $(".dialler-widget-li").parent().find("a.actives").attr("value");
	  		}	  		
	  	}else if(default_call_option.callOption.length == 1){
	  		if(_agile_get_prefs("dial-default-widget")){
	  			widgetName = _agile_get_prefs("dial-default-widget");
	  		}else{
	  			widgetName = widgetCallName[default_call_option.callOption[0].name];
	  		}
	  		
	  	}
	  	
	  	if(!widgetName || widgetName== "CallScript" || widgetName== "Asterisk"){
	  		$("#diallerInfoModal").html(getTemplate("diallerInfoModal"));
	  		$(".dialler-modal-body").html("Please select a widget from the dropdown to dial.");
	  		$("#diallerInfoModal").modal("show");
	  		return;
	  	}
	  	if (to.length < 1){
	  		$("#diallerInfoModal").html(getTemplate("diallerInfoModal"));
	  		$(".dialler-modal-body").html("Please enter a number to dial.");
	  		$("#diallerInfoModal").modal("show");
	  		return;
	  	}
	  
	  	$("#dialler-phone-number-form").submit();
	  	if(checkForActiveCall()){
		  alert("Already on call.");
			return;
		}
	  		
		accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+to, function(responseJson){
			callToNumber(to,from,widgetName,responseJson,"dialler");
		});
	});
	
	$('body').on('click', '#dialler_info_ok', function(e)
			{
			  	e.preventDefault();
			  	$("#diallerInfoModal").modal("hide");
	});
	
	
	$('body #direct-dialler-div').on('click', '.dial0', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","0");
			  	$("#clear-dialler").show();
			  	//var newText = appendToText("#dail_phone_number",0);
			  	//$("#dail_phone_number").val(newText);
			});
	
	
	$('body #direct-dialler-div').on('click', '.dial1', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","1");
			  	$("#clear-dialler").show();
			  	/*var newText = appendToText("#dail_phone_number",1);
			  	$("#dail_phone_number").val(newText);*/
			});
	$('body #direct-dialler-div').on('click', '.dial2', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","2");
			  	$("#clear-dialler").show();
			  	/*var newText = appendToText("#dail_phone_number",2);
			  	$("#dail_phone_number").val(newText);*/
			});
	$('body #direct-dialler-div').on('click', '.dial3', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","3");
			  	$("#clear-dialler").show();
			  	/* 	var newText = appendToText("#dail_phone_number",3);
			  	$("#dail_phone_number").val(newText);*/
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial4', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","4");
			  	$("#clear-dialler").show();
			  	/*var newText = appendToText("#dail_phone_number",4);
			  	$("#dail_phone_number").val(newText);*/
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial5', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","5");
			  	$("#clear-dialler").show();
			  	/*  	var newText = appendToText("#dail_phone_number",5);
			  	$("#dail_phone_number").val(newText);*/
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial6', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","6");
			  	$("#clear-dialler").show();
			  	/*var newText = appendToText("#dail_phone_number",6);
			  	$("#dail_phone_number").val(newText);*/
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial7', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","7");
			  	$("#clear-dialler").show();
			  	/*	var newText = appendToText("#dail_phone_number",7);
			  	$("#dail_phone_number").val(newText);*/
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial8', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","8");
			  	$("#clear-dialler").show();
			  	/*var newText = appendToText("#dail_phone_number",8);
			  	$("#dail_phone_number").val(newText);*/
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial9', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","9");
			  	$("#clear-dialler").show();
			  	/*var newText = appendToText("#dail_phone_number",9);
			  	$("#dail_phone_number").val(newText);*/
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial-star', function(e)
			{
			  	e.preventDefault();
			  	insertValueInAt("#dail_phone_number","*");
			  	$("#clear-dialler").show();
			  	/*var newText = appendToText("#dail_phone_number","*");
			  	$("#dail_phone_number").val(newText);*/
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial-hash', function(e)
			{
			  	e.preventDefault();
			  	
			  	insertValueInAt("#dail_phone_number","#");
			  	$("#clear-dialler").show();
			  	/*var newText = appendToText("#dail_phone_number","#");
			  	$("#dail_phone_number").val(newText);*/
			  	
			});

	$('body').off('click', '.noty_ozonetel_cancel');
	$('body').on('click', '.noty_ozonetel_cancel', function(e){		
		closeCallNoty(true);
	});

	$('body').off('click', '.noty_asterisk_cancel');
 	$('body').on('click', '.noty_asterisk_cancel', function(e){	
 		resetglobalCallVariables();
 		resetglobalCallForActivityVariables();
 		closeCallNoty(true);
 	});
});


function appendToText(name,value){
	var el = $(name);
	var preValue = el.val();
	return preValue + value;
}

//dialler - dialler and default
//widget - Twilio,Sip,Bria,Skype
//to - number to call
function callToNumber(to,from,widgetName,contact,dialler){
	console.log("widgetName : **** "+ widgetName);
	dialled.using = dialler; //Needed to know if dialled from dialler or contact-detail or from campaign
	
	if(dialled.using == "dialler"){
		$("#direct-dialler-div").hide();
	}
	
	try{
		if(widgetName == "Twilio"){
			dialFromTwilio(to,from,contact)
		}else if(widgetName == "Bria"){
			dialFromBria(to,from,contact)
		}else if(widgetName == "Sip"){
			dialFromSip(to,from,contact)
		}else if(widgetName == "Skype"){
			dialFromSkype(to,from,contact)
		}else if(widgetName == "Android"){
			dialFromMobileAPP(to, from, contact);
		}else if(widgetName == "Ozonetel"){
			dialFromOzonetel(to,from,contact);
		}else if(widgetName == "Knowlarity"){
			dialFromKnowlarity(to,from,contact);
		}

	}catch(e){
		console.log("error occured in calltonumber function " + e);
		 $("#direct-dialler-div").show();
		 dialled.using = "default";
	}	 
}

function dialFromMobileAPP(to, from, contact){
	if (checkForActiveCall()){
		alert("Already on call.");
		return;
	}
	appDialer(to, contact);
}

function dialFromKnowlarity(to, from, contact){
	if (checkForActiveCall()){
		alert("Already on call.");
		return;
	}	

	knowlarityDailer(KnowlarityWidgetPrefs, to, contact);
}

function dialFromTwilio(to,from,contact){
	if (checkForActiveCall())
	{
		alert("Already on call.");
		return;
	}
	
	var name = "";
	TWILIO_CONTACT_ID = null;
	TWILIO_CONTACT  = null;
	
	if(contact){
		name = 	getContactName(contact);
		TWILIO_CONTACT_ID = contact.id;
		TWILIO_CONTACT = contact;
	}
	
	TWILIO_CALLTYPE = "Outgoing";
	TWILIO_DIRECTION = "outbound-dial";
	TWILIO_IS_VOICEMAIL = false;
	
	

	if(CALL_CAMPAIGN.start){
		if(CALL_CAMPAIGN.state == "PAUSE"){
			alert("Already on call");
			return;
		}
		CALL_CAMPAIGN.state = "PAUSE" ;
	}
	twiliocall(to, name, null, contact);
}
function dialFromOzonetel(to,from,contact){
	if(checkForActiveCall()){
		alert("Already on call.");
		return;
	}
	var action ={};
  	action['command'] = "startCall";
  	action['number'] = to;
  	action['callId'] = "";
	//alert(contact)
	try{
		resetglobalCallVariables();
		resetglobalCallForActivityVariables();
		globalCall.callStatus = "dialing";
		globalCall.calledFrom = "Ozonetel";
		setTimerToCheckDialing("ozonetel");
		
		if(!contact){
			globalCall.contactedContact = {};
			globalCall.contactedId = "";
		}else{
			globalCall.contactedContact = contact;
			globalCall.contactedId = contact.id;
		}
		var to_number = "";
		if(to.startsWith("+91") || (to.startsWith("91") && to.length > 10)){
			to_number = "0"+to.trim().slice(-10)
		}else{
			to_number = to;
		}
	  	$.ajax({ 
			url : 'core/api/widgets/ozonetel/connect?user_phone=' + to_number+'&domain_user='+CURRENT_DOMAIN_USER.id, 
			type : 'GET', 
			success : function(data){
				if(data == "success"){
					$("#draggable_noty #call-noty-notes").val("");
					var btns = [{"id":"", "class":"btn btn-default btn-sm noty_ozonetel_cancel","title":"{{agile_lng_translate 'other' 'cancel'}}"}];
					showDraggableNoty("Ozonetel", contact, "outgoing", to, btns);
					globalCall.callStatus = "Oncall";
				}else{
					showAlertModal(_agile_get_translated_val('widgets', 'ozonetel-make-call'), undefined, function(){

					},undefined, "Ozonetel");
				}
			}, error : function(response){
				console.log(response);
			} 
		});
	}catch (e) {
	}
}
function dialFromBria(to,from,contact){

	var command = "startCall";
	var number =  to;
	var callId = "";
	
	if(checkForActiveCall()){
		$('#briaInfoModal').html(getTemplate("briaCallStatusModal"));
		$('#briaInfoModal').modal('show');
		return;
	}
	
	var action ={};
  	action['command'] = "startCall";
  	var callNumber = to;
  	generateNumberAndExtension(callNumber, action);
  	//action['number'] = to;
  	action['callId'] = "";
	
	try{
		resetglobalCallVariables();
		resetglobalCallForActivityVariables();
		globalCall.callStatus = "dialing";
		globalCall.calledFrom = "Bria";
		setTimerToCheckDialing("bria");
		
		if(!contact){
			globalCall.contactedContact = {};
			globalCall.contactedId = "";
		}else{
			globalCall.contactedContact = contact;
			globalCall.contactedId = contact.id;
		}
	  	sendActionToClient(action);
	}catch (e) {
	}
}

function dialFromSkype(to,from,contact){
	
  	if(checkForActiveCall()){
		$('#skypeInfoModal').html(getTemplate("skypeCallStatusModal"));
		$('#skypeInfoModal').modal('show');
		return;
	}
	
	var action ={};
  	action['command'] = "startCall";
  	var callNumber = to;
  	generateNumberAndExtension(callNumber, action);
  	//action['number'] = to;
  	action['callId'] = "";
  	
	try{
		resetglobalCallVariables();
		resetglobalCallForActivityVariables();
		globalCall.callStatus = "dialing";
		globalCall.calledFrom = "Skype";
		setTimerToCheckDialing("skype");
		
		if(!contact){
			globalCall.contactedContact = {};
			globalCall.contactedId = "";
		}else{
			globalCall.contactedContact = contact;
			globalCall.contactedId = contact.id;
		}
				
		sendActionToClient(action);
	}catch (e) {
	}
	
}

function dialFromSip(to,from,contact){

	// SIP outgoing call.
	if (makeCall(to))
	{
		if(contact){
			User_Name = getContactName(contact);
			User_Number = removeBracesFromNumber(to);
			User_Img = getGravatar(contact.properties, 40);
			User_ID = contact.id;
			SIP_Call_Noty_IMG = addSipContactImg();
			Show_Add_Contact = false;
		}else{
			// Assign details to set in noty.
			User_Name = "";
			User_Number = to;
			User_Img = "";
			User_ID = null;
			SIP_Call_Noty_IMG = "";
			Show_Add_Contact = true;
		}
		// Display
		showCallNotyPopup("outgoing", "confirm", SIP_Call_Noty_IMG+'<span class="noty_contact_details"><i class="icon icon-phone"></i><b>Calling  </b>' + User_Number +'<br><a href="#'+Contact_Link+'" style="color: inherit;">' + User_Name +  '</a><br></span><div class="clearfix"></div>', false);
	}

}

function getIcon(widgetName){
	var icon = "";
	if(widgetName == "Twilio"){
		icon = "<img src='/widgets/twilio-small-logo.png' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Twilio' >Twilio";
	}else if(widgetName == "Sip"){
		icon = "<img src='/widgets/sip-logo-small.png' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Sip' >SIP";
	}else if(widgetName == "Bria"){
		icon = "<img src='/img/plugins/bria-call.png' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Bria' >Bria";
	}else if(widgetName == "Skype"){
		icon = "<img src='/img/plugins/skype-call.png' style='width: 24px; height: 24px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Skype' >Skype";
	}else if(widgetName == "Android"){
		icon = "<img src='/img/plugins/android-sm-logo.png' style='width: 24px; height: 24px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Android' >Android";
	}else if(widgetName == "Knowrality"){
		icon = "<img src='/img/plugins/knowlarity-md-logo.png' style='width: 24px; height: 24px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Knowrality' >Knowrality";
	}else if(widgetName == "Ozonetel"){
		icon = "<img src='/widgets/ozonetel_fullsize.png' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Sip' >SIP";
	}
	return icon;
}