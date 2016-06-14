
$(function()
{
	
	$('body').on('click', '.show-dialler', function(e)
			{
			  	e.preventDefault();
			  	
				  	getTemplate('dialler-page', {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						var x = 100;
						var y = 100;
						$('#direct-dialler-div').html($(template_ui));
						$("#direct-dialler-div").css({'left':x,'top': y});
						$("#direct-dialler-div").show();
						$.each(default_call_option.callOption, function(i, obj){
							var name = widgetCallName[obj.name];
							$(".dialler-widget-name-" + name).show();
						});
						
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
	
	$('#agilecrm-container #direct-dialler-div').on('click', '.clear-dialler', function(e)
			{
			  	e.preventDefault();
			  	$("#dail_phone_number").val("");
			});
	
	$('#agilecrm-container #direct-dialler-div').on('click', '.dialler-widget-li', function(e)
			{
			  	e.preventDefault();
			  	var html = $(this).find("a").html();
			  	var value = $(this).find("a").attr("value");
			  	$("#dialler-widget-name-span").html(html);
			  	$("#dialler-widget-name-span").attr("value",value);
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
	
	$('#agilecrm-container #direct-dialler-div').on('click', '.dial-number', function(e)
			{
			  	e.preventDefault();
			  	var to = $("#dail_phone_number").val();
			  	var from ;
			  	var widgetName = $("#dialler-widget-name-span").attr("value");
			  	
			  	if(!widgetName){
			  		$("#diallerInfoModal").html(getTemplate("diallerInfoModal"));
			  		$(".dialler-modal-body").html("Please select a widget to call");
			  		$("#diallerInfoModal").modal("show");
			  		return;
			  	}
			  	if (to.length < 1){
			  		$("#diallerInfoModal").html(getTemplate("diallerInfoModal"));
			  		$(".dialler-modal-body").html("Please press number to dial");
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
			  	var newText = appendToText("#dail_phone_number",0);
			  	$("#dail_phone_number").val(newText);
			});
	
	$('body #direct-dialler-div').on('click', '.dial1', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",1);
			  	$("#dail_phone_number").val(newText);
			});
	$('body #direct-dialler-div').on('click', '.dial2', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",2);
			  	$("#dail_phone_number").val(newText);
			});
	$('body #direct-dialler-div').on('click', '.dial3', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",3);
			  	$("#dail_phone_number").val(newText);
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial4', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",4);
			  	$("#dail_phone_number").val(newText);
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial5', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",5);
			  	$("#dail_phone_number").val(newText);
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial6', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",6);
			  	$("#dail_phone_number").val(newText);
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial7', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",7);
			  	$("#dail_phone_number").val(newText);
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial8', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",8);
			  	$("#dail_phone_number").val(newText);
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial9', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number",9);
			  	$("#dail_phone_number").val(newText);
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial-star', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number","*");
			  	$("#dail_phone_number").val(newText);
			  	
			});
	$('body #direct-dialler-div').on('click', '.dial-hash', function(e)
			{
			  	e.preventDefault();
			  	var newText = appendToText("#dail_phone_number","#");
			  	$("#dail_phone_number").val(newText);
			  	
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
		}
	
}catch(e){
	console.log("error occured in calltonumber function " + e);
	 $("#direct-dialler-div").show();
	 dialled.using = "default";
}	 
	
}	

function dialFromTwilio(to,from,contact){
	if (checkForActiveCall())
	{
		alert("Already on call.");
		return;
	}
	
	var name = "";
	TWILIO_CONTACT_ID = null;
	
	if(contact){
		name = 	getContactName(contact);
		TWILIO_CONTACT_ID = contact.id;
		TWILIO_CONTACT = contact;
	}
	
		TWILIO_CALLTYPE = "Outgoing";
		TWILIO_DIRECTION = "outbound-dial";
		TWILIO_IS_VOICEMAIL = false;
		
		

		if(CALL_CAMPAIGN.start )
		  {
			if(CALL_CAMPAIGN.state == "PAUSE"){
				alert("Already on call");
				return;
			}
			CALL_CAMPAIGN.state = "PAUSE" ;
		  }
	twiliocall(to, name, null, contact);
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
  	action['number'] = to;
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
  	action['number'] = to;
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
			User_Number = removeBracesFromNumber(phone);
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
	
	if(widgetName == "Twilio"){
		icon = "<img src='/widgets/twilio-small-logo.png' style='width: 20px; height: 20px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Twilio' >";
	}else if(widgetName == "Sip"){
		icon = "<img src='/widgets/sip-logo-small.png' style='width: 20px; height: 20px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Sip' >";
	}else if(widgetName == "Bria"){
		icon = "<img src='/img/plugins/bria-call.png' style='width: 20px; height: 20px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Bria' >";
	}else if(widgetName == "Skype"){
		icon = "<img src='/img/plugins/skype-call.png' style='width: 24px; height: 24px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Skype' >";
	}
}