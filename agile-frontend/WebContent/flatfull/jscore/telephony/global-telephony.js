var default_call_option = { "callOption" : [] };
var callOptionDiv = "" ;
var globalCall = { "callDirection" : null, "callStatus" : "Ideal", "callId" : null, "callNumber" : null, "timeObject" : null, "lastReceived":null };
var globalCallForActivity = { "callDirection" : null, "callId" : null, "callNumber" : null, "callStatus" : null, "duration" : 0, "requestedLogs" : false }
var widgetCallName = { "Sip" : "Sip", "TwilioIO" : "Twilio", "Bria" : "Bria", "Skype" : "Skype", "CallScript" : "CallScript" };
$(function()
{
	initToPubNub();
	globalCallWidgetSet();
});

function getContactImage(number, type, callback)
{
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
												callOptionDiv = callOptionDiv
														.concat("<img class ='" + name + "_call c-p active' src='" + widget.mini_logo_url + "' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='" + widgetCallName[name] + "'>");

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
						console.log("bria sucess");
						window.focus();
					};
					image.onerror = function(png)
					{
						showNotyPopUp("error", ("Executable file is not running to call"), "bottomRight")
					};
					image.src = "http://localhost:33333/" + new Date().getTime() + "?command=" + command + ";number=" + number + ";callid=" + callid + ";domain=" + domain + ";userid=" + id + ";type=test?";

					
				}, 5000);
		
	
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

function handleCallRequest(message)
{
	// Display message in stream.
	if ((message || {}).callType == "Bria")
	{
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
			return;
		}
		else if (message.state == "error")
		{
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
					LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
					{
						if (Bria_Call_Noty != undefined)
							Bria_Call_Noty.close();
						try
						{
							$('#briaCallId').parents("ul").last().remove();
						}
						catch (e)
						{
						}
					});
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
			return;
		}
		else if (message.state == "logs")
		{
			handleLogsForBria(message);
			return;
		}
		else if (message.state == "closed")
		{
			showNotyPopUp("error", ("Bria is not running"), "bottomRight");
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
			return;
		}
		showBriaCallNoty(message);
		return;
	}
	else if ((message || {}).callType == "Skype")
	{
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
				
				var contact = agile_crm_get_contact();

				var phone = $("#skype_contact_number").val();
				if (!phone || phone == "")
				{
					phone = getPhoneWithSkypeInArray(contact.properties)[0];
				}
				if (phone == num)
				{
					getLogsForSkype(num);
				}
			}
			catch (e)
			{
			}
			return;
		}
		else if (message.state == "error")
		{
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
					LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
					{
						if (Skype_Call_Noty != undefined)
							Skype_Call_Noty.close();
						try
						{
							$('#skypeCallId').parents("ul").last().remove();
						}
						catch (e)
						{
						}
					});
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();

			console.log("error message received...");
		}
		else if (message.state == "logs")
		{
			handleLogsForSkype(message);
			return;
		}
		else if (message.state == "closed")
		{
			showNotyPopUp("error", ("Skype is not running"), "bottomRight");
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
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

function setTimerToCheckDialing(name)
{
	globalCall.timeObject = setTimeout(function()
	{
		if (globalCall.callStatus == "dialing")
		{
			$('#' + name + 'CallId').parents("ul").last().remove();
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
		}
	}, 15000);
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
