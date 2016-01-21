/**
 * creates request url based on values selected from calenar LHS filters
 */

function createRequestUrlBasedOnFilter()
{
	var calendars_val = [];
	var calendars_user_val = [];
	var calendars_domain_user_ids = [];
	var event_list_type = '';

	$('.calendar_check').each(function()
	{
		if (this.checked)
			calendars_val.push($(this).val());

	});

	$('.calendar_user_check').each(function()
	{
		if (this.checked)
		{
			calendars_user_val.push($(this).val());
			calendars_domain_user_ids.push($(this).attr("data"));
		}

	});
	if (_agile_get_prefs("agile_calendar_view"))
	{

		event_list_type = $("#event_time").val();
	}

	var uniqueNames = [];
	$.each(calendars_user_val, function(i, el)
	{
		if ($.inArray(el, uniqueNames) === -1)
			uniqueNames.push(el);
	});
	calendars_user_val = uniqueNames;
	var json_obj = {};
	json_obj.cal_type = calendars_val;
	json_obj.owner_ids = calendars_user_val;
	json_obj.domain_user_ids = calendars_domain_user_ids;
	var result ={};
	result[CURRENT_AGILE_USER.id] = json_obj;

	/*
	 * if (event_list_type) json_obj.event_type = event_list_type;
	 */
	_agile_set_prefs('event-lhs-filters', JSON.stringify(result));

}

// this function will be called to read filters from cookie if not found creates
// cookie with default values
function buildCalendarLhsFilters()
{
	var eventFilters = JSON.parse(_agile_get_prefs('event-lhs-filters'));	

	if (eventFilters)
	{
		eventFilters = eventFilters[CURRENT_AGILE_USER.id];
		var type_of_cal = eventFilters.cal_type;
		var owners = eventFilters.owner_ids;
		var event_time = eventFilters.events_time;
		var list_event_type = eventFilters.event_type;

		if (type_of_cal)
		{
			$.each(type_of_cal, function(index, value)
			{
				$('.calendar_check').each(function()
				{ // loop through each checkbox
					if ($(this).val() == value)
						this.checked = true;
				});

			});
		}

		if (owners && owners.length > 0)
		{
			$.each(owners, function(index, value)
			{
				$('.calendar_user_check').each(function()
				{ // loop through each checkbox
					if ($(this).val() == value)
						this.checked = true;
				});

			});
		}

		/*
		 * if (_agile_get_prefs("agile_calendar_view")) {
		 * 
		 * if (list_event_type) $("#event_time").val(list_event_type); }
		 */
	}
	// else
	// {
	// 	/*
	// 	 * $('.calendar_user_check').each(function() { // loop through each
	// 	 * checkbox if ($(this).val() == CURRENT_AGILE_USER.id) this.checked =
	// 	 * true; });
	// 	 */
	// 	$('.calendar_check').each(function()
	// 	{ // loop through each checkbox
	// 		this.checked = true;
	// 	});

	// 	/*
	// 	 * if (_agile_get_prefs("agile_calendar_view")) { $("#event_time").val(""); }
	// 	 */
	// }

}

// this function will be called to load full calendar based on filters
function loadFullCalednarOrListView()
{
	if (_agile_get_prefs("agile_calendar_view"))
	{
		var eventFilters = JSON.parse(_agile_get_prefs('event-lhs-filters'));		

		if (eventFilters)
		{
			eventFilters = eventFilters[CURRENT_AGILE_USER.id];

			if (eventFilters.event_type == "future")
			{
				_agile_set_prefs("agile_calendar_view", "calendar_list_view_future");
			}
			else
			{
				_agile_set_prefs("agile_calendar_view", "calendar_list_view");
			}
		}
		else
			_agile_set_prefs("agile_calendar_view", "calendar_list_view");

	}

	// if list view
	if (!_agile_get_prefs("agile_calendar_view"))
	{
		$('#calendar_event').html('');
		showCalendar();
	}
	else
	{

		loadAgileEvents();
		loadGoogleEvents();

	}
}

/**
 * when  no calenar selected i.e agile /google it enables checkboxes for both
 */
function checkBothCalWhenNoCalSelected()
{
	var selectedCal = [];
	$('.calendar_check').each(function()
	{
		if (this.checked)
			selectedCal.push($(this).val());

	});
	if (selectedCal && selectedCal.length == 0)
	{
		$('.calendar_check').each(function()
		{
			this.checked = true;

		});
		createRequestUrlBasedOnFilter();
		loadFullCalednarOrListView();
	}

}


/**
 * 
 * if google calendar sync is enabled then disappears link addtocalednar in lhs filters
 */
function putGoogleCalendarLink(calEnable)
{
		if (calEnable)
		{
			$("#google_cal").removeClass('hide');
			$("#google_cal_link").addClass('hide');
		}
		else
		{
			$("#google_cal").addClass('hide');
			$("#google_cal_link").removeClass('hide');
		}
}

function put_thirdparty_calendar_links()
{
	putOfficeCalendarLink(false);
	putGoogleCalendarLink(false);
	$.getJSON('core/api/calendar-prefs/list', function(data){
		console.log(data);
		$.each(data, function(index, preference){
			console.log(preference);
			if(preference.calendar_type == 'GOOGLE'){
				putGoogleCalendarLink(true);
			}else if(preference.calendar_type == 'OFFICE365'){
				var eventFilters = JSON.parse(_agile_get_prefs('event-lhs-filters'));
				eventFilters = eventFilters[CURRENT_AGILE_USER.id];

				var filtterList = eventFilters.cal_type;
				var display = false;
				if(filtterList.indexOf("office") >= 0){
					display = true;
				}else{
					display = false;
				}				
				$('input:checkbox[value="office"]').attr('checked', display);
				putOfficeCalendarLink(true);				
			}
		});
	})
}


function putOfficeCalendarLink(calEnable)
{
	if (calEnable){
		$("#office_cal").removeClass('hide');
		$("#office_cal_link").addClass('hide');
	} else {
		$("#office_cal").addClass('hide');
		$("#office_cal_link").removeClass('hide');
	}
}

/**
 * fetches and renders events in full calendar
 * @param ownerid
 */
function renderFullCalenarEvents(ownerid)
{
	var start_end_time = JSON.parse(_agile_get_prefs('fullcalendar_start_end_time'));

	var eventsURL = '/core/api/events?start=' + start_end_time.startTime + "&end=" + start_end_time.endTime;

	eventsURL += '&owner_id=' + ownerid;
	console.log('-----------------', eventsURL);
	addEventsToCalendar(eventsURL)

/*	$.getJSON(eventsURL, function(doc)
	{
		$.each(doc, function(index, data)
		{
			data = renderEventBasedOnOwner(data);
			$('#calendar_event').fullCalendar('renderEvent', data);
		});

		// Add event
		//$('#calendar_event').fullCalendar('addEventSource', doc);

		showLoadingOnCalendar(false);

	});*/

}

var functions = {};
function addEventsToCalendar(eventsURL)
{
		var resultMap = {};
		if(!eventsURL)
			return;
		showLoadingOnCalendar(true);
		$.getJSON(eventsURL, function(doc)
									{

										if(doc && doc.length > 0)
										$.each(doc, function(index, data)
										{
											// decides the color of event based
											// on owner id
											console.log(data);
											if(!resultMap[data.owner.id])
											{
												var array = [];
												resultMap[data.owner.id] = array;
											}

												data = renderEventBasedOnOwner(data);
												resultMap[data.owner.id].push(data);

										});

										console.log(resultMap);
										$.each(resultMap, function(index, eventArray){
												console.log(index);
												addEventSourceToCalendar(index, eventArray);
										});

										showLoadingOnCalendar(false)
							});
}

function addEventSourceToCalendar(key, eventArray)
{
			$('#calendar_event').fullCalendar('removeEventSource', functions["event_" + key]);

			functions["event_" + key] = function(start, end, callback)
			{
				console.log(this);
				console.log("function : " +  "event_" + functions["event_" + key])
				callback(eventArray);
			}

			
			//if(addScource)
			$('#calendar_event').fullCalendar('addEventSource', functions["event_" + key]);

			eventArray = [];
}

function removeGoogleEventSource()
{
	$.each(functions, function(key, value){
		if(key.indexOf('event_google') == 0)
		{
			//if(addScource)
			$('#calendar_event').fullCalendar('removeEventSource', functions[key]);
		}
	})	
}

function removeEventSource(key)
{
	//if(addScource)
	$('#calendar_event').fullCalendar('removeEventSource', functions["event_" + key]);
}

function addGoogleCalendarEvents()
{
	addAsyncCalendarEvents(loadUserEventsfromGoogle);
//	$('#calendar_event').fullCalendar('removeEventSource', tempFunction);

}

function addOffice365CalendarEvents(){
	addAsyncCalendarEvents(loadOfficeEvents);
}

function addAsyncCalendarEvents(asyncCallbackFunction)
{
	if(!asyncCallbackFunction || typeof asyncCallbackFunction != 'function')
	{
		return;
	}
	var tempFunction = function(start, end, callback)
	{
		asyncCallbackFunction(start, end);
		callback({});
		$('#calendar_event').fullCalendar('removeEventSource', tempFunction);
		return;
	}

	$('#calendar_event').fullCalendar('addEventSource', tempFunction);
}

/**
 * removed full calendar events based on ids
 * @param ownerid
 */
function removeFullCalendarEvents(domain_user_id)
{
	if(!domain_user_id)
		return;

	showLoadingOnCalendar(true);
	removeEventSource(domain_user_id);

	// Removes all events at once
	$('#calendar_event').fullCalendar('removeEvents', function(value, index) {
		if(value && value.owner && value.owner.id)
			return value.owner.id == domain_user_id;
		else
			return false;
	});

	showLoadingOnCalendar(false);


/*	$.getJSON(eventsURL, function(doc)
	{
		$.each(doc, function(index, data)
		{
			if(data.id)
				ids.push(data.id);	
		});

		// Removes all events at once
		$('#calendar_event').fullCalendar('removeEvents', function(value, index) {
			return $.inArray(value, ids) < 0;
		});

		
	});*/
}



/**
 * if agile calenar is unchecked then from cookie it removes all userids and puts only current userid
 * @param uncheckedagile
 * @returns {String}
 */
function getOwnerIdsFromCookie(uncheckedagile)
{
	var eventFilters = JSON.parse(_agile_get_prefs('event-lhs-filters'));
	eventFilters = eventFilters[CURRENT_AGILE_USER.id];

	var agile_event_owners = '';
	if (eventFilters)
	{
		var type_of_cal = eventFilters.cal_type;

		var owners = eventFilters.owner_ids;

		if (uncheckedagile && owners.length >= 1)
			owners = [];
		owners.push(CURRENT_AGILE_USER.id);
		if (owners && owners.length > 0)
		{
			$.each(owners, function(index, value)
			{
				if (index >= 1)
					agile_event_owners += ",";
				agile_event_owners += value;
			});
		}
	}
	return agile_event_owners;
}

/**
 * fetches google events
 */
function loadGoogleEventsandRender()
{
	var start_end_time = JSON.parse(_agile_get_prefs('fullcalendar_start_end_time'));
	$.getJSON('core/api/calendar-prefs/get', function(response)
	{
		console.log(response);
		if (response)
		{
			_agile_set_prefs('google_event_token', response.access_token);

			head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js',
					function()
					{
						setupGC(function()
						{

							gapi.auth.setToken({ access_token : response.access_token, state : "https://www.googleapis.com/auth/calendar" });

							var startDate = new Date(start_end_time.startTime * 1000);
							var gDateStart = startDate.toISOString();
							var endDate = new Date(start_end_time.endTime * 1000);
							var gDateEnd = endDate.toISOString();
							var request = gapi.client.calendar.events.list({ 'calendarId' : 'primary', singleEvents : true, timeMin : gDateStart,
								timeMax : gDateEnd });
							request.execute(function(resp)
							{

								if (resp)
								{
									for (var i = 0; i < resp.items.length; i++)
									{
										var fc_event = google2fcEvent(resp.items[i]);

										if (fc_event)
											$('#calendar_event').fullCalendar('renderEvent', fc_event);

									}
								}

							});

						});

					});
		}

	});
}


/**
 * renders event to fullcalednar by changing color based on Owner id
 * @param data
 */
function renderAddedEventToFullCalenarBasedOnCookie(data)
{
	try
	{
		var renderEvent = false;
		var current_user_checked = false;
		var eventFilters = JSON.parse(_agile_get_prefs('event-lhs-filters'));		

		if (eventFilters)
		{
			eventFilters = eventFilters[CURRENT_AGILE_USER.id];
			var type_of_cal = eventFilters.cal_type;
			for ( var cal in type_of_cal)
			{
				if (type_of_cal[cal] == "agile")
					current_user_checked = true;
			}
		}
		if (data.owner.id == CURRENT_DOMAIN_USER.id && current_user_checked)
		{
			renderEvent = true;
		}

		if (eventFilters && !renderEvent)
		{
			var domain_users = eventFilters.domain_user_ids;
			if (domain_users && domain_users.length > 0)
			{
				$.each(domain_users, function(index, value)
				{
					if (value == data.owner.id)
						renderEvent = true;
				});
			}
		}
		if (renderEvent)
		{
			$('#calendar_event').fullCalendar('renderEvent', data);
		}
	}
	catch (err)
	{
		console.log("error");
	}
}


/**
 * sets color to event based on owner id
 * @param data
 * @returns {___anonymous8560_8563}
 */
function renderEventBasedOnOwner(data)
{
	try
	{
		if (data.owner)
		{
			if (data.owner.id == CURRENT_DOMAIN_USER.id)
			{
				if (data.color == 'red' || data.color == '#f05050')
					data.className = 'fc-b-l fc-b-2x fc-b-danger fc-border-height fc-event-month';
				else if (data.color == 'green' || data.color == '#bbb')
					data.className = 'fc-b-l fc-b-2x fc-b-info fc-border-height fc-event-month';
				else if (data.color == '#36C' || data.color == '#23b7e5' || data.color == 'blue')
					data.className = 'fc-b-l fc-b-2x fc-b-warning fc-border-height fc-event-month';
				data.color = '';
				data.backgroundColor = '#fff';
			}

			else
			{
				if (data.color == 'red' || data.color == '#f05050')
					data.className = 'high fc-b-l fc-b-2x fc-b-light fc-border-height fc-event-month';
				else if (data.color == 'green' || data.color == '#bbb')
					data.className = 'low fc-b-l fc-b-2x fc-b-light fc-border-height fc-event-month';
				else if (data.color == '#36C' || data.color == '#23b7e5' || data.color == 'blue')
					data.className = 'normal fc-b-l fc-b-2x fc-b-light fc-border-height fc-event-month';
				data.color = '';
				data.backgroundColor = '#fff';
			}
		}

	}
	catch (err)
	{
		console.log("error");
	}
	return data;
}


/**
 * while editing event in full calendar its priority will be set based on color of event
 * @param event
 * @returns {___anonymous10119_10123}
 */
function revertEventColorBasedOnPriority(event)
{
	if (event.className == "fc-b-l,fc-b-2x,fc-b-danger,fc-border-height,fc-event-month" || event.className == "high,fc-b-l,fc-b-2x,fc-b-light,fc-border-height,fc-event-month" || event.className == "fc-b-l fc-b-2x fc-b-danger fc-border-height fc-event-month" || event.className == "high fc-b-l fc-b-2x fc-b-light fc-border-height fc-event-month")
		event.color = "red";
	else if (event.className == "fc-b-l,fc-b-2x,fc-b-info,fc-border-height,fc-event-month" || event.className == "low,fc-b-l,fc-b-2x,fc-b-light,fc-border-height,fc-event-month" || event.className == "fc-b-l fc-b-2x fc-b-info fc-border-height fc-event-month" || event.className == "low fc-b-l fc-b-2x fc-b-light fc-border-height fc-event-month")
		event.color = "green";
	else if (event.className == "fc-b-l,fc-b-2x,fc-b-warning,fc-border-height,fc-event-month" || event.className == "normal,fc-b-l,fc-b-2x,fc-b-light,fc-border-height,fc-event-month" || event.className == "fc-b-l fc-b-2x fc-b-warning fc-border-height fc-event-month" || event.className == "normal fc-b-l fc-b-2x fc-b-light fc-border-height fc-event-month")
		event.color = "#36C";
	return event;

}


var loadingCounter = 0;
function pushLoading()
{
	if(loadingCounter < 0)
		loadingCounter = 0;
	loadingCounter ++ ;
	return loadingCounter;
}

function popLoading()
{
	loadingCounter--;
	return loadingCounter;
}
/**
 * shows loading symbol while fetching events
 * @param loading
 */
function showLoadingOnCalendar(loading)
{
	if (loading)
	{
		pushLoading();

		$("#loading_calendar_events").remove();
		$("#user_calendars *").attr('disabled','disabled');
		$("#user_cal_sub *").attr('disabled','disabled');

		$("#user_calendars *").addClass('disable-cp');
		$("#user_cal_sub *").addClass('disable-cp');

		$('.fc-header-left').append(
				'<span id="loading_calendar_events" style="margin-left:5px;vertical-align:middle;padding-top: 5px;position: absolute;">loading...</span>')
				.show();
		$('.fc-header-left').show();
	}
	else if(popLoading() <= 0)
	{
		$("#loading_calendar_events").hide();		
		$("#user_calendars *").removeAttr('disabled');
		$("#user_cal_sub *").removeAttr('disabled');

		$("#user_calendars *").removeClass('disable-cp');
		$("#user_cal_sub *").removeClass('disable-cp');
	}
}