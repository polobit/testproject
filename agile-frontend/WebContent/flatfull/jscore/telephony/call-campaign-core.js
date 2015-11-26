/**
 * Global object of call campaign to maintain state, call status and contact
 * details.
 * 
 * STATE = START, DISCONNECTED,PAUSE
 * Start = you can call for auto-dial // This is initial state
 * Pause = You cant dial from campaign // this state tells not to make twilio call request  because the campaing has been paused 
 * Disconnected = Call disconnected by twilio error or no answer or failed. //This state tells twilio call has been disconnected by twilio
 * 
 *call_status = IDEAL,CALL-ENDED,CONNECTED,CONNECTING
 *Ideal = The campaign is in ideal state // twilio call function is not called
 *Connecting = The camapign is connecting the call  //The twilio call has been made 
 *Connected = The call has been connected. // call connected by twilio
 *
 *
 *To start the manual call you have to call the below methods:
 * 1)changeContactDeatilView(); // only changes the contact detail page view taking the current object from campaign
 * 2)startCall();	//It will reset the campaign variabe, get contact detail, edit container and then make campaign call
 *
 *To start the call in case of autodial 
 * 1)getContactDetails();
 * 2)editCallContainer();
 * 3)makeCampaigncall();
 * 
 * 
 */

/**
 * Initialised the campaign variable to default value.
 */

var CALL_CAMPAIGN = {};

function campaignVariableToInitialState()
{
	CALL_CAMPAIGN = { "start" : false, "state" : "START", "total_count" : 0, "current_count" : 0, "temp_count" : 0, "contact_id_list" : null, "cursor" : 0,
		"select_all" : false, "autodial" : false, "total_time" : 0, "user_timer" : 0, "current_contact" : null, "current_contact_name" : null,
		"current_contact_img" : null, "current_contact_email" : null, "current_contact_phonenumber" : null, "countdown_timer" : 0, "call_duration" : 0,
		"call_status" : "IDEAL", "contact_update" : false, "selected_number" : null, "call_from_campaign" : false, "remember_phone" : [],
		"last_clicked" : null, "tag" : null, "has_tag" : false, "callObject" : null, "timeObject" : null };

}

/**
 * start call campaign will start calling to selected contacts or to all
 * contacts if selected all is true then fetch next 25 and call them too.
 * 
 * @param id_array
 */

function startCallCampaign(id_array)
{
	try
	{
		console.log("In startCallCampaign");

		// If collection is there then proceed otherwise refresh the page
		if (!App_Contacts.contactsListView || !App_Contacts.contactsListView.collection)
			return;

		console.log("collection found");
		// step1:
		CALL_CAMPAIGN.start = true;
		// step2:
		addCallContainer();
		// step3:
		updateContactInCampaignVariable();
		// step4:

		// step5:
		startCall();
	}
	catch (err)
	{
		console.log("error-->" + err.message);
		CALL_CAMPAIGN.start = false;
		//routeToPage("contacts");
		$('#startCampaignAgain').modal('show');
	}

}

/**
 * It will stop the ongoing campaign and disconnect the current call if any.
 * 
 */
function stopCallCampaign()
{
	console.log("In stopCallCampaign");

	// step1:
	disconnectAnyTwilioCall();
	// step2:
	removeCallContainer();
	// step3:
	campaignVariableToInitialState();
	// step4:
	routeToPage("contacts");

}

function showSettingPage()
{

	// changes for new requirement
	// when SELECT_ALL is true i.e., all contacts are selected.
	campaignVariableToInitialState();
	CALL_CAMPAIGN.contact_id_list = get_contacts_bulk_ids();

	if (CALL_CAMPAIGN.contact_id_list.length === 0)
	{
		console.log("all are selected");
		// Get id of first selected all contacts
		CALL_CAMPAIGN.select_all = true;
		CALL_CAMPAIGN.contact_id_list = getIdOfContacts(App_Contacts.contactsListView.collection.toJSON());
		CALL_CAMPAIGN.total_count = getAvailableContacts();
	}
	else
	{
		console.log("some are selected");
		CALL_CAMPAIGN.total_count = CALL_CAMPAIGN.contact_id_list.length;
	}

	console.log(CALL_CAMPAIGN.contact_id_list);

	Backbone.history.loadUrl("#call-contacts");

}

/**
 * this will route the page to given url
 * 
 * @param url
 */
function routeToPage(url)
{
	if(window.location.hash == ("#" + url))
        return;

	if (window.location.hash.indexOf("#" + url) != -1)
	{
		Backbone.history.loadUrl("#" + url);
	}
	else
	{
		Backbone.history.navigate(url, { trigger : true });
	}
}

/**
 * This will end any connected call by twilio
 */
function disconnectAnyTwilioCall()
{
	if (Twilio.Device.status() == "busy")
	{
		Twilio.Device.disconnectAll();
	}
}

/**
 * true if more contact is remaining to call otherwise false
 */
function hasMoreContactLeftToDial()
{
	var value = CALL_CAMPAIGN.total_count - 1;
	if (CALL_CAMPAIGN.current_count >= value)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function getNextContactIdSet()
{
	// fetch next 25 contacts id
	if ((CALL_CAMPAIGN.select_all == true) && (CALL_CAMPAIGN.current_count == (CALL_CAMPAIGN.contact_id_list.length - 1)))
	{
		if (CALL_CAMPAIGN.current_count == (CALL_CAMPAIGN.total_count-1))
			return;

		getNextContactsId(function(id_array)
		{
			CALL_CAMPAIGN.contact_id_list = CALL_CAMPAIGN.contact_id_list.concat(id_array);
		});

	}
}

/**
 * This will automatically dial next call otherwise return false
 */
function dialNextCallAutomatically()
{

	if (hasMoreContactLeftToDial())
	{
		pointToNextContact();
		updateContactInCampaignVariable();
		changeContactDeatilView();
		startCall();
		getNextContactIdSet();
	}
	else
	{
		console.log("Last call done");
		stopCallCampaign();
		var alertMessage = '<center><div class="alert alert-success fade in" style="z-index:10000;margin-bottom:0px;margin-right:-4px;font-size: 14px;"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a><strong>Congrats!</strong> Your call campaign has been completed successfully.</div></center>';
		var timeToDisplay = 5000;
		showCampaignAlert(alertMessage, timeToDisplay);
		return;
	}
}

/**
 * This will called for manual dialing of call
 */
function dialNextCallManually()
{

	restartCalling();
	getNextContactIdSet();
}

/**
 * 
 */

function startCall()
{
	console.log("In startCall");
	console.log(CALL_CAMPAIGN.total_count);
	console.log(CALL_CAMPAIGN.current_count);
	console.log(CALL_CAMPAIGN.contact_id_list[CALL_CAMPAIGN.current_count]);

	// step1 : check if campaign is already started
	if (!CALL_CAMPAIGN.start)
		return;

	// step2: reset some variable to make next call without error
	resetSomeCampaignVariable();
	// step3:
	editCallContainer();
	// step4: After 2 sec procedure will start.
	setTimeout(function()
	{
		if (CALL_CAMPAIGN.state == "START" && CALL_CAMPAIGN.autodial == true)
			makeCampaignCall();
	}, 2000);
}

/**
 * fetch the current contact and store in camaign variable
 */
function updateContactInCampaignVariable()
{
	try
	{
		CALL_CAMPAIGN.current_contact = getContact(CALL_CAMPAIGN.contact_id_list[CALL_CAMPAIGN.current_count]);
		getContactDetails();
		console.log(CALL_CAMPAIGN.current_contact);
	}
	catch (err)
	{
		console.log("error" + err.message);
	}

}

/**
 * It will move the current object pointer to next contact..
 */
function pointToNextContact()
{
	// Increase current_count
	var lastClick = CALL_CAMPAIGN.last_clicked;
	if (lastClick != "CONTINUE" && lastClick != "STOP")
	{
		if (CALL_CAMPAIGN.current_count <= CALL_CAMPAIGN.total_count)
		{
			CALL_CAMPAIGN.current_count++;
		}
	}

}

/**
 * Show the alert in campaign style to the user for n seconds
 */
function showCampaignAlert(alertMessage, timeToDisplay)
{
	try
	{
		$('#call-campaign-content').show();
		$("div#call-campaign-content center:first").remove();
		$("#call-campaign-content").prepend(alertMessage);
		removeAlertAutomaticallyAfter(timeToDisplay);
	}
	catch (err)
	{
		console.log("error in showCampaignAlert" + err.message);
	}
}

/**
 * 
 * This function is actually calling the twiliocall function to make the call If
 * the device is busy it will show alert message and return If the state is
 * pause it will show the aert messae and return This will take the nunber to
 * dail and dial the call
 * 
 */
function makeCampaignCall()
{
	console.log("In makeCampaignCall");

	// Step1: check whether to make a call or not
	if (Twilio.Device.status() == "busy")
	{
		$('#alreadyOnCall').modal('show');
		return;
	}
	if (CALL_CAMPAIGN.state === "PAUSE")
	{
		$('#pleaseWait').modal('show');
		return;
	}
	// Step2: get selected phone number to call otherwise select default phone
	if ($("#call_campaign_contact_number").length)
	{
		CALL_CAMPAIGN.selected_number = $("#call_campaign_contact_number option:selected").attr("value");
		$("#call_campaign_contact_number").attr("disabled", "disabled");
	}
	// else get from contact
	else
	{
		CALL_CAMPAIGN.selected_number = getPropertyValue(CALL_CAMPAIGN.current_contact.properties, "phone");
	}

	// Step3: If selected number is present then dial
	if (CALL_CAMPAIGN.selected_number)
	{

		// step3.1:Twilio setings for outgoing call
		TWILIO_CALLTYPE = "Outgoing";
		TWILIO_DIRECTION = "outbound-dial";
		TWILIO_IS_VOICEMAIL = false;

		// step3.2:update campaign variable
		CALL_CAMPAIGN.call_from_campaign = true;
		var rampUP_Time = 0;

		// step3.3:check for 1st contact and dial without rampup time/delay for
		// autodial
		if (CALL_CAMPAIGN.autodial)
		{
			var current_id = (CALL_CAMPAIGN.contact_id_list[CALL_CAMPAIGN.current_count]);
			var first_id = CALL_CAMPAIGN.contact_id_list[0];
				
			if (current_id != first_id)
			{
				// Step3.4: Initialize campaign variables
				rampUP_Time = CALL_CAMPAIGN.user_timer * 1000; // Time selected
				// by user to
				// start call
				// after n
				// seconds
				var callText = " Next call starts in ";
				CALL_CAMPAIGN.countdown_timer = CALL_CAMPAIGN.user_timer; // timer
				// variable
				// set
				// to
				// run
				// countdown
				// to
				// start
				// call

				// Step3.5: Show message when the next cal is going to start
				changeHtml("#callStartText", callText);
				changeHtml("#callStartTime", CALL_CAMPAIGN.countdown_timer);
				Tick();

				// Step3.6: show pause and resume button
				$("#pauseCallDiv").show();
				$("#campaign_resumeCall").hide();
				$("#campaign_pauseCall").show();
				$("#start").show();
			}
			// step3.7: Change the call icon from green to grey
			// $("#start").hide();
			// $("#start").css({'background':'rgb(185, 185,
			// 185)','cursor':'context-menu'});
			// $("#start").attr('id','non-start');
		}

		// step3.8: change the state to pause so that in mean time no other call
		// can be dialled from campaign
		CALL_CAMPAIGN.state = "PAUSE";
		console.log("CALL will start after -- >" + rampUP_Time + "sec.");

		// step3.9: twiliocall function is called after n sec, where n=0 for
		// manual or n otherwise
		CALL_CAMPAIGN.callObject = setTimeout(function()
		{
			CALL_CAMPAIGN.last_clicked = null; // this is to check the last
			// click variable in disconnect
			// call
			CALL_CAMPAIGN.state = "START";
			twiliocall(CALL_CAMPAIGN.selected_number, getContactName(CALL_CAMPAIGN.current_contact));
			CALL_CAMPAIGN.callObject = null;
		}, rampUP_Time);

	}

}
/**
 * Write html inside id or class.
 */
function changeHtml(select, value)
{
	$(select).html(value);
}

/**
 * For Auto dial restart calling from continue/call/resume btn only to current
 * call
 */
function restartCalling()
{
	resetSomeCampaignVariable();
	editCallContainer();
	if (CALL_CAMPAIGN.autodial == true)
	{
		makeCampaignCall();
	}
}

/**
 * Reset some variable to initial state : State variables we are not doing
 * anything with contact data here
 */
function resetSomeCampaignVariable()
{
	// Remove Dialpad
	if ($(".call_campaign_dialpad_btns").length != 0)
		$(".call_campaign_dialpad_btns").remove();

	// CALL_CAMPAIGN.call_duration : The current call duration
	CALL_CAMPAIGN.call_duration = 0;

	// CALL_CAMPAIGN.countdown_timer : Timer to start call after n seconds
	CALL_CAMPAIGN.countdown_timer = 0;

	// CALL_CAMPAIGN.selected_number : The number to dial the call
	CALL_CAMPAIGN.selected_number = null;

	// CALL_CAMPAIGN.callObject : The setTimeOut object to call twilio call
	// function
	CALL_CAMPAIGN.callObject = null;

	// CALL_CAMPAIGN.timeObject : The setTimeOut object to decrease the
	// countdown timer
	CALL_CAMPAIGN.timeObject = null;

	// CALL_CAMPAIGN.call_from_campaign : true if the call is dialled by
	// campaign otherwise manually
	CALL_CAMPAIGN.call_from_campaign = false;

	// CALL_CAMPAIGN.contact_update : true if the contact update is calle by
	// campaign otherwise false
	CALL_CAMPAIGN.contact_update = false;

	// CALL_CAMPAIGN.call_status : IDEAL if the twiliocall function is not
	// called
	CALL_CAMPAIGN.call_status = "IDEAL";
}

/** ***** Contacts function ****** */
/**
 * Returns array of ids of given contacts.
 */
function getIdOfContacts(contactsArray)
{
	console.log("In getIdOfContacts");
	console.log(contactsArray);

	var idArray = [];
	for (var i = 0; i < contactsArray.length; i++)
	{
		idArray[idArray.length] = contactsArray[i].id;
	}

	return idArray;
}

/**
 * 
 * It takes the contact id as a prarameter and return the contact object
 * 
 * @param contactId
 * @returns
 */
function getContact(contactId)
{
	console.log("In getContact");

	return App_Contacts.contactsListView.collection.where({ id : contactId })[0].toJSON();

	// var json = $.parseJSON($.ajax({ url : '/core/api/contacts/' + contactId,
	// async : false, dataType : 'json' }).responseText);

	// return json;
}

/**
 * IT will get the properties of contact. If the contact has no phone it will
 * set the campaign in pause state and autodial will not work
 */
function getContactDetails()
{
	// Contact name in normal format like "fname lname"
	To_Name = getContactName(CALL_CAMPAIGN.current_contact);

	// Contact id for twilio reference
	TWILIO_CONTACT_ID = CALL_CAMPAIGN.current_contact.id;

	CALL_CAMPAIGN.current_contact_name = To_Name;
	CALL_CAMPAIGN.current_contact_email = getPropertyValue(CALL_CAMPAIGN.current_contact.properties, "email");
	CALL_CAMPAIGN.current_contact_phonenumber = getPhoneNumbersInArray(CALL_CAMPAIGN.current_contact.properties);
}

/**
 * It will return the phone in array having more than one contact
 */
function getPhoneNumbersInArray(items)
{
	var va = [];
	var name = "phone";
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
		{
			// If phone number has value only then add to array
			if (items[i].value != "" || items[i].value != null)
				va[va.length] = items[i].value;
		}
	}
	return va;
}

/** ***** Fetching next contacts related functions ****** */
/**
 * Fetch next 25 contacts on cursor from db and append ids in contact id list of
 * call campaign.
 */
function getNextContactsId(callback)
{
	console.log("In getNextContactsId");

	var url = null;

	// Get sort key
	var sortKey = readCookie("sort_by_name");
	if (!sortKey || sortKey == null)
	{
		sortKey = '-created_time';
		// Saves Sort By in cookie
		createCookie('sort_by_name', sortKey);
	}

	console.log("1. CALL_CAMPAIGN.cursor");
	console.log(CALL_CAMPAIGN.cursor);

	// First time get cursor from collection
	if (CALL_CAMPAIGN.cursor == 0 || CALL_CAMPAIGN.cursor == undefined)
		CALL_CAMPAIGN.cursor = getCursor();

	console.log("after getcursor() CALL_CAMPAIGN.cursor");
	console.log(CALL_CAMPAIGN.cursor);

	if (!CALL_CAMPAIGN.cursor)
		return;

	// If there is a filter saved in cookie then show filter results
	if (readData('dynamic_contact_filter') && !readCookie('company_filter'))
		url = 'core/api/filters/filter/dynamic-filter?data=' + encodeURIComponent(readData('dynamic_contact_filter')) + '&cursor=' + CALL_CAMPAIGN.cursor + '&page_size=25&global_sort_key=' + sortKey;
	else if (readData('dynamic_company_filter') && readCookie('company_filter'))
		url = 'core/api/filters/filter/dynamic-filter?data=' + encodeURIComponent(readData('dynamic_company_filter')) + '&cursor=' + CALL_CAMPAIGN.cursor + '&page_size=25&global_sort_key=' + sortKey;
	else if (readCookie('contact_filter'))
		url = 'core/api/filters/query/' + readCookie('contact_filter') + '?cursor=' + CALL_CAMPAIGN.cursor + '&page_size=25&global_sort_key=' + sortKey;
	else if (readCookie('company_filter'))
		url = 'core/api/contacts/companies?cursor=' + CALL_CAMPAIGN.cursor + '&page_size=25&global_sort_key=' + sortKey;
	else
		url = '/core/api/contacts?cursor=' + CALL_CAMPAIGN.cursor + '&page_size=25&global_sort_key=' + sortKey;

	// Get next 25 contacts
	$.ajax({ url : url, dataType : 'json', success : function(nextContacts)
	{

		console.log("nextContacts");
		console.log(nextContacts);

		// update CURRENT_CURSOR for next fetch
		CALL_CAMPAIGN.cursor = nextContacts[nextContacts.length - 1].cursor;

		console.log("after contacts fetch CALL_CAMPAIGN.cursor");
		console.log(CALL_CAMPAIGN.cursor);

		// Get Id of fetched contact
		var idArray = getIdOfContacts(nextContacts);

		return callback(idArray);

	} });

}

/**
 * Get cursor from contacts collection
 * 
 * @returns
 */
function getCursor()
{
	console.log("In getCursor");
	var contactsJson = App_Contacts.contactsListView.collection.toJSON();
	return contactsJson[CALL_CAMPAIGN.current_count].cursor;
}

/**
 * It will add the container for noty to dail calls
 */
function addCallContainer()
{
	// show the div for call campaign
	$('#call-campaign-content').show();
	$('#call-campaign-content').html(getTemplate("call-campaign-start"));
	$('body').find('#wrap').addClass("call-campaign-running"); // the class is
}

/**
 * It will remove the contaner from page
 */
function removeCallContainer()
{
	try
	{
		$('#call-campaign-content').find('#callnoty-container').remove();
		$('body').find('#wrap').removeClass("call-campaign-running");
		// Remove Dialpad if there
		if ($(".call_campaign_dialpad_btns").length != 0)
			$(".call_campaign_dialpad_btns").remove();
	}
	catch (err)
	{
		console.log("error" + err.message);
	}

}

/**
 * It will automatically remove alert of campaign
 */
function removeAlertAutomaticallyAfter(time)
{
	if (CALL_CAMPAIGN.alertObject != null)
	{
		clearTimeout(CALL_CAMPAIGN.alertObject);
	}
	CALL_CAMPAIGN.alertObject = setTimeout(function hide()
	{
		$("div#call-campaign-content center:first").remove();
	}, time);
}

/**
 * This will edit the container with the current object of campaign get contact
 * method
 */
function editCallContainer()
{
	CALL_CAMPAIGN.temp_count = CALL_CAMPAIGN.current_count + 1;
	$('#call-campaign-content').find('#callnoty-container').html(getTemplate("call-campaign-body", CALL_CAMPAIGN));

	var dialpad = $(getTemplate("campaign-dialpad"), {});
	$('.campaign_noty_buttons').append(dialpad);

	accessUrlUsingAjax("core/api/voicemails", function(resp){

		var responseJson = resp;
		getTemplate("campaign-voicemail",responseJson, undefined, function(template_ui){
			if(!template_ui)
				  return;
				
			$('.campaign_voicemail_buttons').html($(template_ui));
			


		}, null);
	});
	lookForSelectedNumber();
}

/*
 * If contact have multiple number and so display selected number in list If
 * number is present in select box then select it. if number is present then
 * save it in select_number varables ** If the contact having many number is
 * selected to change the callin number in campaign. It wills store the number
 * to show in future : campaign variable
 */
function lookForSelectedNumber()
{
	CALL_CAMPAIGN.selected_number = null;
	CALL_CAMPAIGN.remember_phone = setSelectedPhone(CALL_CAMPAIGN.remember_phone, TWILIO_CONTACT_ID);

	if (CALL_CAMPAIGN.selected_number == null)
	{
		if ($("#call_campaign_contact_number"))
		{
			if ($("#call_campaign_contact_number > option").length > 1)
			{
				$("#call_campaign_contact_number option:selected").next().attr('selected', 'selected');
			}
		}
	}

	$("#call_campaign_contact_number").change(function()
	{
		console.log("In call_campaign_contact_number change function");
		console.log($(".noty_twilio_call"));
		CALL_CAMPAIGN.selected_number = $("#call_campaign_contact_number").val();
		CALL_CAMPAIGN.remember_phone = setValueInArray(CALL_CAMPAIGN.remember_phone, TWILIO_CONTACT_ID, CALL_CAMPAIGN.selected_number);
	});

}

/**
 * IT will show the countdown time to start the call
 */
function Tick()
{
	if (CALL_CAMPAIGN.countdown_timer <= 0)
	{
		$("#callStartText").html("");
		$("#callStartTime").html("");
		return;
	}

	CALL_CAMPAIGN.countdown_timer -= 1;
	$("#callStartTime").html(CALL_CAMPAIGN.countdown_timer + '  sec');

	// Set for next sec
	CALL_CAMPAIGN.timeObject = window.setTimeout("Tick()", 1000);
}

/**
 * This will set the value in remember_phone variable if not present - for
 * manual call only
 */
function setValueInArray(arrayObject, id, value)
{
	// var obj = $.parseJSON(arrayObject);
	var obj = arrayObject;
	var flag = false;
	// check if id is present -- if present then modify the existing selected
	// number
	// if not present then push a new record
	if (obj != undefined)
	{
		$.each(obj, function(index, element)
		{
			// alert(element.timeStamp);
			if (element.id == id)
			{
				flag = true;
				element.number = value;
			}
		});
	}
	else
	{
		obj = [];
	}
	if (!flag)
	{
		obj.push({ "id" : id, "number" : value });
	}
	return obj;
}

// function to select the number in select box if phone number is present -- for
// manual call only
// set the number in selected number variable if the number is present
function setSelectedPhone(arrayObject, id)
{
	// var obj = $.parseJSON(arrayObject );
	var obj = arrayObject;
	if (obj != undefined)
	{
		$.each(obj, function(index, element)
		{
			// alert(element.timeStamp);
			if (element.id == id)
			{
				if ($("#call_campaign_contact_number").find('option[value="' + element.number + '"]'))
				{
					$("#call_campaign_contact_number").find('option[value="' + element.number + '"]').prop('selected', true);
					CALL_CAMPAIGN.selected_number = element.number;
				}
				else
				{
					obj.splice(index, 1);
				}
			}
		});
	}

	return obj;
}

/**
 * It will change the contact detail view pointed by the current_count pointer
 */
function changeContactDeatilView()
{
	var id = (CALL_CAMPAIGN.contact_id_list[CALL_CAMPAIGN.current_count]);
	Backbone.history.navigate("contact/" + id, { trigger : true });
}

/**
 * changes the timer value to 00:00:00 format
 */
function secToColonFormat(time)
{
	var friendlyTime = null;
	var min = 0;
	var hours = 0;
	var sec = 0;
	if (time >= 3600)
	{
		hours = Math.floor(time / 3600);
		time = time - hours * 3600;
		if (hours < 10)
		{
			hours = "0" + hours;
		}
		friendlyTime = hours;
	}

	if (time >= 60)
	{
		min = Math.floor(time / 60);
		time = time - min * 60;
	}
	if (min < 10)
	{
		min = "0" + min;
	}
	if (friendlyTime != null)
	{
		friendlyTime += ":" + min;
	}
	else
	{
		friendlyTime = min;
	}

	sec = time;
	if (sec < 10)
	{
		sec = "0" + sec;
	}

	if (friendlyTime != null)
	{
		friendlyTime += ":" + sec;
	}
	else
	{
		friendlyTime = "00:" + sec;
	}

	return friendlyTime;
}

/**
 * provided time it will change it to 0sec format
 * 
 * @param time
 * @returns {String}
 */
function SecondsToCampaignTime(time)
{
	if (time == 0)
		return "0 sec";
	var hours = Math.floor(time / 3600);
	if (hours > 0)
		time = time - hours * 60 * 60;
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	var friendlyTime = "";
	if (hours == 1)
		friendlyTime = hours + " hour";
	if (hours > 1)
		friendlyTime = hours + " hour";
	if (minutes > 0)
		friendlyTime += minutes + " min";
	if (seconds > 0)
		friendlyTime += seconds + " sec";
	if (friendlyTime != "")
		return friendlyTime;
}

/**
 * This method is remaining for future
 */
function holdCurrentCall()
{
	var widgetDetails = twilioGetWidgetDetails();
	var widgetPrefs = $.parseJSON(widgetDetails.prefs);
	var acc_sid = widgetPrefs.twilio_acc_sid;
	var auth_token = widgetPrefs.twilio_auth_token;
	var url = "/core/api/widgets/twilio/holdtone/" + acc_sid + "/" + auth_token + "/" + globalconnection.parameters.CallSid;
	// rest is to be implemented later.

}

/**
 * After the call is success the function should be called to save tag for
 * particular contact
 */
function saveTagForCampaign()
{
	console.log("inside saveTagForCampaign --->");
	if (CALL_CAMPAIGN.has_tag)
	{
		var tag = CALL_CAMPAIGN.tag;
		var json = CALL_CAMPAIGN.current_contact;
		json.tagsWithTime.push({ "tag" : tag.toString() });
		var contact = new Backbone.Model();
		contact.url = 'core/api/contacts';
		contact.save(json, { success : function(data)
		{
			addTagToTimelineDynamically(tag, data.get("tagsWithTime"));
			tagsCollection.add(new BaseModel({ "tag" : tag }));
		}

		});
		console.log("Tag added to campaign call");
	}

}

/**
 * Update the total time by campaign
 * 
 * @param timeToAdd
 */
function updateTotalTime(timeToAdd)
{
	CALL_CAMPAIGN.total_time = CALL_CAMPAIGN.total_time + parseInt(timeToAdd);
	$("#totalTime").html('(' + SecondsToCampaignTime(CALL_CAMPAIGN.total_time) + ')');
}
