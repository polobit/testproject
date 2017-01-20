var default_call_option;
var callOptionDiv;
var globalCall;
var globalCallForActivity; 
var widgetCallName;
var dialled;
var CallLogVariables;
var callConference;
var callJar;
var notifications_sound;
var messagefromcallback;
var outboundmessage;
var KnowlarityWidgetPrefs;
var knowlaritySource;

function androidSetup(){
	head.js('widgets/android.js', function(){
		console.log("App Calling js file loaded");
	});
}

function knowlaritySetup(){
	var requestURL = "core/api/widgets/knowlarity/getPrefs";
	$.ajax({
		url : requestURL,
		type : "GET",	
		success : function(result) {
			if(result && result.length > 0){
				console.log(result);
				KnowlarityWidgetPrefs = JSON.parse(result);				
				head.js('widgets/knowlarity.js', function(){ 
					if(!knowlaritySource){
						knowlarityEventsFinder(KnowlarityWidgetPrefs);
					}					
				});								
			}
		}
	});
}

$(function(){
	default_call_option = { "callOption" : [] };
	callOptionDiv = "" ;
	globalCall = { "callDirection" : null, "callStatus" : "Ideal", "callId" : null, "callNumber" : null, "timeObject" : null, "lastReceived":null, "lastSent":null , "calledFrom":null, "contactedId":null, "contactedContact" : null};
	globalCallForActivity = { "callDirection" : null, "callId" : null, "callNumber" : null, "callStatus" : null, "duration" : 0, "requestedLogs" : false, "justCalledId" : null, "justSavedCalledIDForNote" : null, "justSavedCalledIDForActivity" : null,"contactedId":null, "answeredByTab" : false}; 
	widgetCallName = { "Sip" : "Sip", "TwilioIO" : "Twilio", "Bria" : "Bria", "Skype" : "Skype", "CallScript" : "CallScript", "Android" : "Android", "SMS-Gateway" :"SMS", "Ozonetel":"Ozonetel", "Knowlarity" : "Knowlarity", "Asterisk" : "Asterisk"};
	dialled = {"using" : "default"};
	CallLogVariables = {"callActivitySaved" : false, "id" : null, "callType" : null, "subject":null, "status" : null, "callWidget" : null, "duration" : null, "phone" : null, "url" : null,"description":null , "dynamicData" : null, "processed" : false};
	callConference = {"started" : false, "name" : "MyRoom1234", "lastContactedId" : null, "hideNoty" : true, "totalMember" : 0, "addnote" : true, "conferenceDuration" : 0 , "phoneNumber" : null};
	callJar = {"running" : false};
	notifications_sound = true;
	messagefromcallback = false;
	outboundmessage = true;

	//	initToPubNub();
	globalCallWidgetSet();
	if(!agile_is_mobile_browser()){
		knowlaritySetup();
		androidSetup();
	}
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

function agile_is_iPhone(){
   return (/iPhone/i.test(navigator.userAgent));
 }

function globalCallWidgetSet()
{
	$
			.getJSON(
					"/core/api/widgets/availableCallWidgets",
					function(call_widget)
					{
						console.log("default call option selected is :" + call_widget);
						default_call_option.callOption = [];
						$("body .contact-make-call").off("click");
						$("body .contact-make-call").off("dblclick");
						if(agile_is_mobile_browser()){
							if(agile_is_iPhone()){
								$("body").on("click", ".contact-make-call", function(e){
									e.preventDefault();
									var phone = $(this).attr("phone");
									window.location.href="tel://"+phone;
								});
								return;
							}else{
								$("body").on("dblclick", ".contact-make-call", function(e){
									e.preventDefault();
									var phone = $(this).attr("phone");
									window.location.href="tel://"+phone;
								});
							}
						}else{
							$("body").on("click", ".contact-make-call", function(e){
								e.preventDefault();
								var phone = $(this).attr("phone");
								window.location.href="tel://"+phone;
							});
						}
						if (call_widget.length == 0)
						{
							if(agile_is_mobile_browser()){
								
								$("body").on("click", ".contact-make-call", function(e){
									e.preventDefault();
									var phone = $(this).attr("phone");
									window.location.href="tel://"+phone;
								});
							}
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
												if(name != "CallScript" ){
													callOptionDiv = callOptionDiv
													.concat("<img class ='" + name + "_call c-p active' src='" + widget.mini_logo_url + "' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='" + widgetCallName[name] + "'>");
												}

												var prefs =JSON.parse(widget.prefs)
												var sms_status=prefs["twilio_sms"];

												if(name == "TwilioIO" && sms_status){
													callOptionDiv = callOptionDiv
													.concat("<img class ='" + "SMS-Gateway_sms" + " c-p active' src='/widgets/sms-small-logo.png' style='width: 20px; height: 20px; margin-right: 5px;' data-toggle='tooltip' data-placement='top' title='' data-original-title='" +"SMS"+ "'>");
												}
												if(name == "Asterisk"){
													asterisk_widget = widget;
												}
											}
										});

						callOptionDiv = callOptionDiv.concat("</span>");

						// this is to get the name of widget stored in cache for direct dialing
						var nameToStore = "";
						var selectedWidget = _agile_get_prefs("dial-default-widget");
						var alreadySetPrefs = false;
						if(selectedWidget){
							if(selectedWidget == "Twilio"){
								selectedWidget = "TwilioIO";
							}
							var index = containsOption(default_call_option.callOption, "name", selectedWidget);
							if( index == -1){
								nameToStore = "";
							}else{
								alreadySetPrefs = true;
								nameToStore = widgetCallName[selectedWidget];
							}
						}
						
						var flag = false;
						$.each(default_call_option.callOption, function(i, obj)
						{
							// this is to store twilio as default in localstorrage otherwise any
							if(!alreadySetPrefs){
								if(widgetCallName[obj.name] == "Twilio"){
									nameToStore = "Twilio";
								}else if(nameToStore != "Twilio" && obj.name != "CallScript" && obj.name != "Asterisk"){
									nameToStore = widgetCallName[obj.name];
								}
							}

							//check whether executables are running or not
							if ((obj.name == "Bria" || obj.name == "Skype" ) && !flag)
							{
								flag = true;
								sendTestCommand();
							}
							
							// this will show the option of widget to select in direct dial from new tab
							var name = widgetCallName[obj.name];
							$(".dialler-widget-name-" + name).removeClass("none");
							$(".dialler-widget-name-" + name +"> a").removeClass("inactive");
							$(".dialler-widget-name-" + name +"> a").addClass("actives");
						});
						
						// saving the name in local storage to show in direct dial 
							_agile_set_prefs("dial-default-widget", nameToStore);
						// if only one icon is shown we will hide it	
						if($(".dialler-widget-li:not(.none)").length == 1){
							$(".dialler-widget-li:not(.none)").addClass("none");
							$(".panel-heading","#dialler-page").css("height",0);
						}	

						
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
					sendTestCommandToClient();			
				}, 5000);
		
	
	}

/*function sendCommandToClient(command,widget)
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
}*/

function replicateglobalCallVariable()
{

	globalCallForActivity.callStatus = globalCall.callStatus;
	globalCallForActivity.callDirection = globalCall.callDirection;
	globalCallForActivity.callNumber = globalCall.callNumber;
	globalCallForActivity.callId = globalCall.callId;
	globalCallForActivity.contactedId = globalCall.contactedId;
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
	globalCall.contactedId = "";
	globalCall.contactedContact = null;
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
	globalCallForActivity.contactedId = "";
	globalCallForActivity.answeredByTab = false;

	
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
	CallLogVariables.description = null;
	CallLogVariables.dynamicData = null;
	CallLogVariables.subject = null;
	CallLogVariables.processed = false;
}

function handleCallRequest(message)
{
	// Display message in stream.
	if ((message || {}).callType == "Asterisk"){
			var index = containsOption(default_call_option.callOption, "name", "Asterisk");
			if( index == -1){
				//sendCommandToClient("notConfigured","Asterisk");
				return;
			}

			// start from here
			if (message.state == "lastCallDetail"){

				if(globalCall.lastReceived == "lastCallDetail") {
					return;
				}

				if(message.callid != globalCallForActivity.callid){
					return;
				}
				
				if(globalCall.lastReceived){
					if(globalCall.lastReceived != "ended") {
						if(globalCall.callStatus && globalCall.callStatus == "Connected"){
							globalCall.callStatus = "Answered"; //change form completed
						}else if(globalCall.callStatus && globalCall.callStatus == "Ringing"){
							globalCall.callStatus = "Missed";
						}

						replicateglobalCallVariable();
						resetglobalCallVariables();	
						globalCall.lastReceived = "lastCallDetail";
					}
				}

				if(message.duration == 0){
					globalCallForActivity.callStatus = "Failed";
				}

				closeCallNoty(true);

				if(globalCall.callStatus == "Missed" || globalCallForActivity.callStatus =="Missed"){
					message.duration = 0;
				}

				globalCallForActivity.duration = message.duration;
				
				globalCallForActivity.duration = message.duration;
				console.log("message.direction : " + message.direction + "-----" + globalCallForActivity.callDirection);
				var call = { 
					"direction" : globalCallForActivity.callDirection, 
					"phone" : globalCallForActivity.callNumber,
					"status" : globalCallForActivity.callStatus, 
					"duration" : message.duration,
					"contactId" : globalCallForActivity.contactedId 
				};
				
				console.log("last called : " + call);
				saveCallNoteTelephony(call);

				//saveCallNoteTelephony();
				//saveCallActivityTelephony(call);
				return;
			}else if (message.state == "error"){
				closeCallNoty(true);
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
				console.log("error message received...");
				return;
			}else if (message.state == "error-message"){
				closeCallNoty(true);
				showCallNotyMessage(message.message);
				return;
			}else if (message.state == "logs"){
				//handleLogsForAsterisk(message);
				return;
			}else if (message.state == "closed"){
					closeCallNoty(true);
					showCallNotyMessage("Asterisk is not running");
					resetglobalCallVariables();
					resetglobalCallForActivityVariables();
				return;
			}
			showAsteriskCallNoty(message);
			return;
	
	}else if ((message || {}).callType == "Bria"){
		var index = containsOption(default_call_option.callOption, "name", "Bria");
		if( index == -1){
			sendCommandToClient("notConfigured","Bria");
			return;
		}
		if (message.state == "lastCallDetail"){
			if(message.direction == "Incoming" || message.direction == "inbound"){
				if(!globalCallForActivity.answeredByTab){
					return;
				}
			}
			globalCallForActivity.duration = message.duration;
			var call = { "direction" : message.direction, "phone" : globalCallForActivity.callNumber, "status" : globalCallForActivity.callStatus,
				"duration" : message.duration, "contactId" : globalCallForActivity.contactedId };
			var num = globalCallForActivity.callNumber;
			saveCallNoteBria(call);
			//saveCallActivityBria(call);
			try{
				var phone = $("#bria_contact_number").val();
				if (!phone || phone == ""){
					phone = agile_crm_get_contact_properties_list("phone")[0].value;
				}
				if (phone == num){
					getLogsForBria(num);
				}
			}catch (e){

			}
			
			return;
		}else if (message.state == "error"){
			closeCallNoty(true);
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();
			
			return;
		}else if (message.state == "logs"){
			handleLogsForBria(message);
			return;
		}else if (message.state == "closed"){
			if(globalCall.calledFrom == "Bria"){
				showCallNotyMessage("Bria is not running");
				closeCallNoty(true);
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
				return;
			}
			var message ={};
			message["data"] = "";
			handleLogsForBria(message);		
				
			showCallNotyMessage("Bria is not running");
			return;
		}
		showBriaCallNoty(message);
		return;
	}else if ((message || {}).callType == "Skype"){
		var index = containsOption(default_call_option.callOption, "name", "Skype");
		if(index == -1){
			sendCommandToClient("notConfigured","Skype");
			return;
		}

		// start from here
		if (message.state == "lastCallDetail"){
			if(message.direction == "Incoming" || message.direction == "inbound"){
				if(!globalCallForActivity.answeredByTab){
					return;
				}
			}
			
			globalCallForActivity.duration = message.duration;
			console.log("message.direction : " + message.direction + "-----" + globalCallForActivity.callDirection);
			var call = { 
				"direction" : globalCallForActivity.callDirection, 
				"phone" : globalCallForActivity.callNumber,
				"status" : globalCallForActivity.callStatus, 
				"duration" : message.duration, 
				"contactId" : globalCallForActivity.contactedId 
			};
			var num = globalCallForActivity.callNumber;
			console.log("last called : " + call);
			saveCallNoteSkype(call);
			//saveCallActivitySkype(call);
			try{
				
				//var contact = agile_crm_get_contact();

				var phone = $("#skype_contact_number").val();
				if (!phone || phone == ""){
					phone = agile_crm_get_contact_properties_list("phone")[0].value;
					//phone = getPhoneWithSkypeInArray(contact.properties)[0];
				}
				if (phone == num){
					getLogsForSkype(num);
				}
			}catch (e){

			}
			globalCallForActivity.requestedLogs = false;
			return;
		}else if (message.state == "error"){
			closeCallNoty(true);
			resetglobalCallVariables();
			resetglobalCallForActivityVariables();

			return;
		}else if (message.state == "logs"){
			handleLogsForSkype(message);
			return;
		}else if (message.state == "closed"){
			
			if(globalCall.calledFrom == "Skype"){
				closeCallNoty(true);
				showCallNotyMessage("Skype is not running");
				resetglobalCallVariables();
				resetglobalCallForActivityVariables();
				return;
			}
			var message ={};
			message["data"] = "";
			handleLogsForSkype(message);
			showCallNotyMessage("Skype is not running");
			return;
		}
		showSkypeCallNoty(message);
		return;

	}else if ((message || {}).callType == "Android"){
			if(!agile_is_mobile_browser()){
				androidCallNoty(message);	
			}
	}else if((message || {}).callType == "Ozonetel"){
		if(message.message_from != "callback"){
				messagefromcallback = true;	
				if(message.direction == "Incoming"){
					outboundmessage = false;
				}else{
					outboundmessage = true;
				}
		}else{
			if(messagefromcallback && outboundmessage){
				messagefromcallback = false;
				outboundmessage = true;
			}else{
				messagefromcallback = true;
				outboundmessage = false;
			}
		}			
		if(messagefromcallback == true){				
			var index = containsOption(default_call_option.callOption, "name", "Ozonetel");
			if( index == -1){
				sendCommandToClient("notConfigured","Ozonetel");
				return;
			}
			try{
				var phone = $("#ozonetel_contact_number").val();
				if (!phone || phone == ""){
					phone = agile_crm_get_contact_properties_list("phone")[0].value;
				}
				if (phone == num){
					getLogsForOzonetel(num);
					//handleLogsForOzonetel(message);
				}
			}catch (e){

			}

			if(message.number){
				globalCall.callNumber = message.number;
			}else{
				globalCall.callNumber = message.contact_number;
			}
			showOzonetelCallNoty(message);
			if(message.state && message.state != "ringing"){
				saveCallNoteOzonetel(message);
				globalCall.callStatus = "Ideal";
			}
		}
	}
}

// this is to download the jar file....
$('body').on('click', '#downloadCallJar', function(e){
	e.preventDefault();
	window.location.href = 'https://s3.amazonaws.com/agilecrm/website/widgetCall.jar';
});

$('body').on('click', '#downloadCallJar_widget', function(e){
	e.preventDefault();
	var widget_name = $(this).attr("widget-name");
	var version = '1.0';
	window.location.href = 'https://s3.amazonaws.com/agilecrm/website/'+widget_name+'-'+version+'.jar';
});
function checkForActiveCall(){
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
	$(".draggable_noty_callScript","#draggable_noty").html("");
	$("#draggable_noty").removeClass("draggable-popup");
	 if(dialled.using == "dialler"){
		  $("#direct-dialler-div").show();
		  dialled.using = "default";
	  }
	notifications_sound = true;
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
function twilioIOSaveContactedTime(contactId, callback)
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
				if(callback && typeof callback === "function")
				{
					callback();
				}
			}).error(function(data)
			{
				console.log('Error - Results :' + data);
				if(callback && typeof callback === "function")
				{
					callback();
				}
			});
}

function newCallLogVariables (json){
	if(!json.length > 0){
		return;
	}
	$.each(json,function(i,obj){
		if(CallLogVariables.contains(obj)){
			CallLogVariables[obj.key] = obj.value;
		}
	});
}

function resetcallConferenceVariables(){
	callConference.started = false;
}

function showContactMergeOption(jsonObj){
	var phoneNumber = jsonObj.phoneNumber;
	showModal($("#mergeContactModal"),"newContactAddPhone");
	$("#call_newNumber_btn_continue", "#mergeContactModal").data("phoneNumber",phoneNumber);
	var el = $("#mergeContactModal");
	var contact_display = function(data, item)
	  {
	   setTimeout(function(){
	 	var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{id}}">' +
	 			
	 			'<a class="text-white" href="#contact/{{id}}">{{name}}</a><a class="close text-white m-l-xs v-middle" id="remove_tag">×</a></li>');
	 	// Adds contact name to tags ul as li element
	 	$("#relates_to_call_contact_ul").html(template({name : item, id : data}));
	 	 $(".modal-backdrop", $(".modal:visible")).height(screen.height);
	 	//$("#relates_to_call_contact").attr("data",data);
	   },10);
	   
	  }
	agile_type_ahead("relates_to_call_contact", el, contacts_typeahead, contact_display, "type=PERSON");
}

function showModal(modal, templateName){
	modal.html(getTemplate(templateName));
	modal.modal('show');
}

function proessEditPage(contact,jsonParam){
	
	var phoneNumber;
	if(!contact){
		console.log("cant show editpage as the contactsent is empty");
		return;
	}
	if(jsonParam){
		if(!jQuery.isEmptyObject(jsonParam)){
			phoneNumber = jsonParam.phoneNumber;
		}
	}
	
	if(!phoneNumber){
		console.log("Phone number not available in proessEditPage")
	}
	if(window.location.hash.indexOf("#contact/") != -1 || window.location.hash.indexOf("#contact/") != -1){
		routeToPage("contacts");
	}
	
	showEditContactPage(contact, function(){
		if (contact.type == 'COMPANY'){
			var el  = $("#phone").closest("div.control-group");
			if($($("#phone,el")[1]).val()){
				el.append(el.find("div.controls:first").clone().removeClass('hide').addClass('col-sm-offset-3'));
				$($("#phone,el")[($("#phone,el").length-2)]).val(phoneNumber);
				}else{
				$($("#phone,el")[1]).val(phoneNumber);
				}
		}else{
			var el  = $("#phone").closest("div.control-group");
			if($($("#phone,el")[1]).val()){
				el.append(el.find("div.controls:first").clone().removeClass('hide').addClass('col-sm-offset-3'));
				$($("#phone,el")[($("#phone,el").length-2)]).val(phoneNumber);
				}else{
				$($("#phone,el")[1]).val(phoneNumber);
				}
		}
	});
	
}

function showEditContactPage(contact, callback){
	add_custom_fields_to_form(contact, function(contact)
			{
				if (contact.type == 'COMPANY')
					deserialize_contact(contact, 'continue-company', callback);
				else
					deserialize_contact(contact, 'continue-contact', callback);
			}, contact.type);
}


function sendTestCommandToClient(callback){
	var image = new Image();

	var domain = CURRENT_DOMAIN_USER['domain'];
	var id = CURRENT_DOMAIN_USER['id'];

	var command = "testConnection";
	var number = "";
	var callid = "";

	image.onload = function(png)
	{
		callJar.running = true;
		console.log("test sucess");
		window.focus();
		if (callback && typeof (callback) === "function")
			callback();	
		
	};
	image.onerror = function(png)
	{
		callJar.running = false;
		if (callback && typeof (callback) === "function"){
			callback();
		}else{
			showCallNotyMessage("Executable file is not running");
		}
	};
	image.src = "http://localhost:33333/" + new Date().getTime() + "?command=" + command + ";number=" + number + ";callid=" + callid + ";domain=" + domain + ";userid=" + id + ";type=test?";


}

