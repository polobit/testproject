var default_call_option = { "callOption" : [] };
var callOptionDiv = "" ;
var globalCall = { "callDirection" : null, "callStatus" : "Ideal", "callId" : null, "callNumber" : null, "timeObject" : null, "lastReceived":null, "lastSent":null , "calledFrom":null, "contactedId":null, "contactedContact" : null};
var globalCallForActivity = { "callDirection" : null, "callId" : null, "callNumber" : null, "callStatus" : null, "duration" : 0, "requestedLogs" : false, "justCalledId" : null, "justSavedCalledIDForNote" : null, "justSavedCalledIDForActivity" : null}; 
var widgetCallName = { "Sip" : "Sip", "TwilioIO" : "Twilio", "Bria" : "Bria", "Skype" : "Skype", "CallScript" : "CallScript" };
var CallLogVariables = {"callActivitySaved" : false, "id" : null, "callType" : null, "status" : null, "callWidget" : null, "duration" : null, "phone" : null, "url" : null };
var dialled = {"using" : "default"};
$(function()
{
	initToPubNub();
	globalCallWidgetSet();
});

function getContactImage(number, type, callback)
{
	try{
		if (type)
		{
			if (type == "Outgoing")
			{
				var currentContact = agile_crm_get_contact();
				getTemplate('contact-image', currentContact, undefined, function(image)
				{
					if (!image)
						callback("");
					callback(image);
				});

			}
			else
			{

				searchForContactImg(number, function(currentContact)
				{
					if (!currentContact)
					{
						 callback("");
						 return;
					}
					getTemplate('contact-image', currentContact, undefined, function(image)
					{
						if (!image){
							callback("");
							return;
						}
						callback(image);
					});
				});
			}
		}
	}catch(e){
		if (callback && typeof callback === "function"){
			callback("");
			return;
		}else{
			return "";
		}
			
	}
}

function globalCallWidgetSet()
{
	$
			.getJSON(
					"/core/api/widgets/availableCallWidgets",
					function(call_widget)
					{
						console.log("default call option selected is :" + call_widget);

						if (call_widget.length == 0)
						{
							return;
						}

						callOptionDiv = "<span class='inner-call-option m-l-sm'>";

						$
								.each(
										call_widget,
										function(index, widget)
										{
											if (widget != undefined)
											{
												var temp = { "name" : widget.name, "logo" : widget.mini_logo_url };
												addtoCallOption(temp);
												var name = widget.name;
												if(name != "CallScript"){
													callOptionDiv = callOptionDiv
													.concat("<img class ='" + name + "_call c-p active' src='" + widget.mini_logo_url + "' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='" + widgetCallName[name] + "'>");
												}
											}
										});

						callOptionDiv = callOptionDiv.concat("</span>");

						$.each(default_call_option.callOption, function(i, obj)
						{
							if (obj.name == "Bria" || obj.name == "Skype")
							{
								sendTestCommand();
								return false;
							}
						});

						$('body').on({ mouseenter : function(e)
						{
							if (!Pubnub)
							{
								return;
							}
							else
							{
								if (!Pubnub.is_connected_call)
								{
									return;
								}
							}

							if ($(".contact-make-call").hasClass("c-progress"))
							{
								$(".contact-make-call").removeClass("c-progress");
							}
							$(".inner-call-option").remove();
							$(this).append(callOptionDiv);
							$('[data-toggle="tooltip"]').tooltip();
							if (Twilio_Start != true)
							{
								$(".TwilioIO_call").removeClass("active");
								$(".TwilioIO_call").addClass("disable");

							}
							if (Sip_Stack != undefined && Sip_Register_Session != undefined && Sip_Start == true)
							{
								$(".Sip_call").removeClass("active");
								$(".Sip_call").addClass("disable");
							}

						}, mouseleave : function()
						{
							$(".inner-call-option").remove();

						} }, '.contact-make-call');

						$('body')
								.on(
										{
											mouseenter : function(e)
											{
												if (!Pubnub)
												{
													return;
												}
												else
												{
													if (!Pubnub.is_connected_call)
													{
														return;
													}
												}

												if ($(".contact-make-skype-call").hasClass("c-progress"))
												{
													$(".contact-make-skype-call").removeClass("c-progress");
												}
												$(".inner-call-option").remove();

												var array = default_call_option.callOption;
												var index = containsOption(array, "name", "Skype");

												if (index != -1)
												{
													var ele = "<span class='inner-call-option m-l-sm'>";
													ele = ele
															.concat("<img class ='" + array[index].name + "_call c-p active' src='" + array[index].logo + "' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='" + array[index].name + "'>");
													ele = ele.concat("</span>")
													$(this).append(ele);
												}
												$('[data-toggle="tooltip"]').tooltip();
											}, mouseleave : function()
											{
												$(".inner-call-option").remove();

											} }, '.contact-make-skype-call');

					}).error(function(data)
			{
				console.log("error in fetching the default call widget name");
				console.log(data);
			});
}

function changeTooltipTo(selector, text)
{
	$(selector).tooltip('hide').attr('data-original-title', text).tooltip('fixTitle');

}

function removeFromCallOption(name)
{
	var index;
	$.each(default_call_option.callOption, function(i, obj)
	{
		if (obj.name == name)
		{
			index = i;
		}
	});

	if (!index)
	{
		return;
	}
	default_call_option.callOption.splice(index, 1); // this will remove the
	// index value and leave
	// the remaining
	// variable with change
}

function addtoCallOption(option)
{

	$.each(default_call_option.callOption, function(i, obj)
	{
		if (obj.name == option.name)
		{
			return;
		}
	});
	default_call_option.callOption.push(option);
}

function containsOption(array, property, name)
{
	var result = -1;
	$.each(array, function(i, obj)
	{
		if (obj[property] == name)
		{
			result = i;
			return result;
		}
	});
	return result;
}

function sendTestCommand()
{
		setTimeout(function()
				{
					if(!Pubnub){
						sendTestCommand();
						return;
					}
					if(!Pubnub.is_connected_call){
						sendTestCommand();
						return;
					}
					
					var image = new Image();

					var domain = CURRENT_DOMAIN_USER['domain'];
					var id = CURRENT_DOMAIN_USER['id'];

					var command = "testConnection";
					var number = "";
					var callid = "";

					image.onload = function(png)
					{
						console.log("test sucess");
						window.focus();
					};
					image.onerror = function(png)
					{
						showCallNotyMessage("Executable file is not running");
					};
					image.src = "http://localhost:33333/" + new Date().getTime() + "?command=" + command + ";number=" + number + ";callid=" + callid + ";domain=" + domain + ";userid=" + id + ";type=test?";

					
				}, 5000);
		
	
	}

function sendCommandToClient(command,widget)
{
			var command = command;
			var number =  "";
			var callId = "";
			if(widget == "Skype"){
				sendMessageToSkypeClient(command,number,callId);
			}else{
				sendMessageToBriaClient(command,number,callId);
			}
			
			return;
}

function replicateglobalCallVariable()
{

	globalCallForActivity.callStatus = globalCall.callStatus;
	globalCallForActivity.callDirection = globalCall.callDirection;
	globalCallForActivity.callNumber = globalCall.callNumber;
	globalCallForActivity.callId = globalCall.callId;
	globalCallForActivity.requestedLogs = false;
}

// This method resets the varibles which are need to show values in noty for new
// call...

function resetglobalCallVariables()
{
	globalCall.callDirection = null;
	globalCall.callStatus = "Ideal";
	globalCall.callId = null;
	globalCall.callNumber = null;
	globalCall.lastReceived = null;
	globalCall.lastSent = null;
	//globalCall.calledFrom = null;
	if (globalCall.timeObject != null)
	{
		clearTimeout(globalCall.timeObject);
		globalCall.timeObject = null;
	}

}

function resetglobalCallForActivityVariables()
{
	globalCallForActivity.callDirection = null;
	globalCallForActivity.callStatus = null;
	globalCallForActivity.callId = null;
	globalCallForActivity.callNumber = null;
	globalCallForActivity.duration = 0;
}

function resetCallLogVariables(){
	CallLogVariables.callActivitySaved = false;
	CallLogVariables.id = null;
	CallLogVariables.callType = null;
	CallLogVariables.status = null;
	CallLogVariables.callWidget = null;
	CallLogVariables.duration = null;
	CallLogVariables.phone = null;
	CallLogVariables.url = null;
}

function handleCallRequest(message)
{
	// Display message in stream.
	if ((message || {}).callType == "Bria")
	{
		var index = containsOption(default_call_option.callOption, "name", "Bria");
		if( index == -1){
			sendCommandToClient("notConfigured","Bria");
			return;
		}
		if (message.state == "lastCallDetail")
		{
			globalCallForActivity.duration = message.duration;
			var call = { "direction" : message.direction, "phone" : globalCallForActivity.callNumber, "status" : globalCallForActivity.callStatus,
				"duration" : message.duration };
			var num = globalCallForActivity.callNumber;
			saveCallNoteBria();
			saveCallActivityBria(call);
			try
			{
				var phone = $("#bria_contact_number").val();
				if (!phone || phone == "")
				{
					phone = agile_crm_get_contact_properties_list("phone")[0].value;
				}
				if (phone == num)
				{
					getLogsForBria(num);
				}
			}
			catch (e)
			{
			}
			
			if(dialled.using == "dialler"){
				  $("#direct-dialler-div").show();
				  dialled.dialler = "default";
			  }
			
			return;
		}
		else if (message.state == "error")
		{
			closeCallNoty(true);
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
			
			if(dialled.using == "dialler"){
				  $("#direct-dialler-div").show();
				  dialled.dialler = "default";
			  }
			
			return;
		}
		else if (message.state == "logs")
		{
			handleLogsForBria(message);
			return;
		}
		else if (message.state == "closed")
		{
			if(globalCall.calledFrom == "Bria"){
				showCallNotyMessage("Bria is not running");
				closeCallNoty(true);
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
			}
			
			if(dialled.using == "dialler"){
				  $("#direct-dialler-div").show();
				  dialled.dialler = "default";
			  }
			return;
		}
		showBriaCallNoty(message);
		return;
	}
	else if ((message || {}).callType == "Skype")
	{
		var index = containsOption(default_call_option.callOption, "name", "Skype");
		if( index == -1){
			sendCommandToClient("notConfigured","Skype");
			return;
		}
		// start from here
		if (message.state == "lastCallDetail")
		{
			globalCallForActivity.duration = message.duration;
			console.log("message.direction : " + message.direction + "-----" + globalCallForActivity.callDirection);
			var call = { "direction" : globalCallForActivity.callDirection, "phone" : globalCallForActivity.callNumber,
				"status" : globalCallForActivity.callStatus, "duration" : message.duration };
			var num = globalCallForActivity.callNumber;
			console.log("last called : " + call);
			saveCallNoteSkype();
			saveCallActivitySkype(call);
			try
			{
				
				//var contact = agile_crm_get_contact();

				var phone = $("#skype_contact_number").val();
				if (!phone || phone == "")
				{
					phone = agile_crm_get_contact_properties_list("phone")[0].value;
					//phone = getPhoneWithSkypeInArray(contact.properties)[0];
				}
				if (phone == num)
				{
					getLogsForSkype(num);
				}
			}
			catch (e)
			{
			}
			globalCallForActivity.requestedLogs = false;
			
			if(dialled.using == "dialler"){
				  $("#direct-dialler-div").show();
				  dialled.dialler = "default";
			  }
			
			return;
		}
		else if (message.state == "error")
		{
			closeCallNoty(true);
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
			if(dialled.using == "dialler"){
				  $("#direct-dialler-div").show();
				  dialled.dialler = "default";
			  }
			
			return;
		}
		else if (message.state == "logs")
		{
			handleLogsForSkype(message);
			return;
		}
		else if (message.state == "closed")
		{
			
			if(globalCall.calledFrom == "Skype"){
				closeCallNoty(true);
				showCallNotyMessage("Skype is not running");
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
			}
			
			if(dialled.using == "dialler"){
				  $("#direct-dialler-div").show();
				  dialled.dialler = "default";
			  }
			return;
		}
		showSkypeCallNoty(message);
		return;
	
		}
}

// this is to download the jar file....
$('body').on('click', '#downloadCallJar', function(e)
{
	e.preventDefault();
	window.location.href = 'https://s3.amazonaws.com/agilecrm/website/widgetCall.jar';
});

function checkForActiveCall()
{
	var flag = false;
	try
	{
		if (Twilio.Device.status() == "busy")
		{
			flag = true;
		}
	}
	catch (e)
	{

	}
	try
	{
		if (globalCall.callStatus != "Ideal")
		{
			flag = true;
		}
	}
	catch (e)
	{

	}
	return flag;
}

function closeCallNoty(option){
	
	if(!option){
		if(checkForActiveCall()){
			return;
		}
	}
	$("#draggable_noty").hide();
	$("#draggable_noty").removeClass("draggable-popup");
	
}



function setTimerToCheckDialing(name)
{
	globalCall.timeObject = setTimeout(function()
	{
		if (globalCall.callStatus == "dialing")
		{
			closeCallNoty(true);
			var number = globalCall.contactedId ;
			var cont = globalCall.contactedContact;
			var previousCalledClient  = globalCall.calledFrom; 
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
			globalCall.calledFrom = previousCalledClient;
			globalCall.contactedId = number;
			globalCall.contactedContact = cont;
		}
	}, 20000);
}


/**
 * It will return the phone and skype phone in array having more than one
 * contact
 */
function getPhoneWithSkypeInArray(items)
{
	var va = [];
	var phone = "phone";
	var skype = "skypePhone";
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == phone || items[i].name == skype)
		{
			// If phone number has value only then add to array
			if (items[i].value != "" || items[i].value != null)
				va[va.length] = items[i].value;
		}
	}
	return va;
}

/**
 * @ author - prakash - 15/6/15
 * This method updates two fields of contact object - lastcalled and last contacted
 * This method retrieves the current contact object and make the json call to server to save json time in server.
 */
function twilioIOSaveContactedTime(contactId)
{
	console.log ('in IOSaveContactedTime');
	var id;
	if(contactId){
		id = contactId;
	}else{
		id = agile_crm_get_contact().id;
	}
	console.log('contact id = ' + id);
	$.get("/core/api/widgets/twilio/save/time/?id=" + id , function(result)
			{
				console.log('processed In twilioIOSaveContactedTime');
				console.log('Results : ' + result);
				console.log('result = ' + result);
			}).error(function(data)
			{
				console.log('Error - Results :' + data);
			});
}

