
$(function()
{
	
	$('body').on('click', '.show-dialler', function(e)
			{
			  	e.preventDefault();
			  	
				head.js(LIB_PATH + 'lib/jquery-ui.min.js',function()
						{
				  	getTemplate('dialler-page', {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						var x = 100;
						//var y = $(window).height()/2;
						var y = 100;
						$('#direct-dialler-div').html($(template_ui));
						$("#direct-dialler-div").css({'left':x,'top': y});
						$("#direct-dialler-div").show();
						$.each(default_call_option.callOption, function(i, obj){
							var name = widgetCallName[obj.name];
							var $option = new Option(name,name); 
							$("#dialler-widget").append($option);
						});
						
						
						
						dialled.dialler = "default";
						
						
						$("#direct-dialler-div").draggable({
							  stop: function( event, ui ) {
								  var maxWidth = ($(window).width())-320;
								  var maxHeight = $(window).height()-100;
								  if(ui.position.left < 50 || ui.position.left > maxWidth || ui.position.top < 50 || ui.position.top > maxHeight){
										var y = 100;
										var x = 100;
									  $("#direct-dialler-div").animate({ top: y, left:x }, 500);
									  return;
								  }
							}
						});
						
					}, "#direct-dialler-div");
						});
			});
	
	$('#agilecrm-container #direct-dialler-div').on('click', '.clear-dialler', function(e)
			{
			  	e.preventDefault();
			  	$("#dail_phone_number").val("");
			});
	
	$('#agilecrm-container #direct-dialler-div').on('click', '#close-dialler', function(e)
			{
			  	e.preventDefault();
			  	$("#direct-dialler-div").hide();
			  	dialled.using = "default";
			});
	
	
	$('#agilecrm-container #direct-dialler-div').on('click', '.dial-number', function(e)
			{
			  	e.preventDefault();
			  	var to = $("#dail_phone_number").val();
			  	var from ;
			  	if (to.length < 1){
			  		console.log("have no number inn dialler option. Please dial a valid number");
			  		return;
			  	}
			  		var widgetName = $("#dialler-widget option:selected").attr("value");
			  
			  if(checkForActiveCall()){
					alert("Already on call.");
					return;
				}
			  		
			  accessUrlUsingAjax("core/api/contacts/search/phonenumber/"+to, function(responseJson){
				  callToNumber(to,from,widgetName,responseJson,"dialler");
			  });
			});
	
	
	$('#agilecrm-container #direct-dialler-div').on('change', '#dialler-widget', function(e)
			{
				console.log("In dialler function widget option is changed..");
				var widget = $("#dialler-widget").val();
				var icon = "";
			if(widget == "Twilio"){
				icon = "<img src='/widgets/twilio-small-logo.png' style='width: 20px; height: 20px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Twilio' >";
				$("#dialler-widget-icon").html()
			}else if(widget == "Sip"){
				icon = "<img src='/widgets/sip-logo-small.png' style='width: 20px; height: 20px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Sip' >";
			}else if(widget == "Bria"){
				icon = "<img src='/img/plugins/bria-call.png' style='width: 20px; height: 20px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Bria' >";
			}else if(widget == "Skype"){
				icon = "<img src='/img/plugins/skype-call.png' style='width: 24px; height: 24px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='Skype' >";
			}
			$("#dialler-widget-icon").html(icon);
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
	 dialled.dialler = "default";
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
	twiliocall(to, name);
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
		closeCallNoty(true);
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
	
  	e.preventDefault();
	
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
		closeCallNoty(true);
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