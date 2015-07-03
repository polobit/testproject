$(function()
{
	$(".calendar_check").die().live('click', function(e)
	{
		createRequestUrlBasedOnFilter();
		var calendar = $(this).val();
		var ownerids = '';
		if (calendar == "agile")
		{
			if (this.checked == true)
			{
				ownerids = getOwnerIdsFromCookie(true);
				renderFullCalenarEvents(ownerids);
			}

			else
			{
				ownerids = getOwnerIdsFromCookie(true);
				removeFullCalendarEvents(ownerids);
			}

		}

		if (calendar == "google")
			loadFullCalednarOrListView();

	});

	$(".calendar_user_check").die().live('click', function(e)
	{
		// checkBothCalWhenNoCalSelected();
		createRequestUrlBasedOnFilter();
		// loadFullCalednarOrListView();
		var user_id = $(this).val();
		if (this.checked == true)
		{
			renderFullCalenarEvents(user_id);
		}
		else
		{
			removeFullCalendarEvents(user_id);
		}

		// $('.select_all_users').removeAttr("checked");

	});

	$('.select_all_users').die().live('click', function(event)
	{ // on click
		if (this.checked)
		{ // check select status
			$('.calendar_user_check').each(function()
			{
				this.checked = true;
			});
		}
		else
		{
			$('.calendar_user_check').each(function()
			{ // loop through each checkbox
				if ($(this).val() != CURRENT_AGILE_USER.id)
					this.checked = false;
			});
		}
		createRequestUrlBasedOnFilter();
		loadFullCalednarOrListView();
	});

	$('#event_time').die().live('change', function(event)
	{ // on click
		if ($("#event_time").val() == "future")
			createCookie("agile_calendar_view", "calendar_list_view_future");
		else
			createCookie("agile_calendar_view", "calendar_list_view");
		createRequestUrlBasedOnFilter();
		loadFullCalednarOrListView();
	});

});

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
	if (readCookie("agile_calendar_view"))
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
	/*
	 * if (event_list_type) json_obj.event_type = event_list_type;
	 */
	createCookie('event-lhs-filters', JSON.stringify(json_obj));

}

// this function will be called to read filters from cookie if not found creates
// cookie with default values
function buildCalendarLhsFilters()
{
	var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
	if (eventFilters)
	{
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
		 * if (readCookie("agile_calendar_view")) {
		 * 
		 * if (list_event_type) $("#event_time").val(list_event_type); }
		 */
	}
	else
	{
		/*
		 * $('.calendar_user_check').each(function() { // loop through each
		 * checkbox if ($(this).val() == CURRENT_AGILE_USER.id) this.checked =
		 * true; });
		 */
		$('.calendar_check').each(function()
		{ // loop through each checkbox
			this.checked = true;
		});

		/*
		 * if (readCookie("agile_calendar_view")) { $("#event_time").val(""); }
		 */
	}

}

// this function will be called to load full calendar based on filters
function loadFullCalednarOrListView()
{
	if (readCookie("agile_calendar_view"))
	{
		var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
		if (eventFilters)
		{
			if (eventFilters.event_type == "future")
			{
				createCookie("agile_calendar_view", "calendar_list_view_future");
			}
			else
			{
				createCookie("agile_calendar_view", "calendar_list_view");
			}
		}
		else
			createCookie("agile_calendar_view", "calendar_list_view");

	}

	// if list view
	if (!readCookie("agile_calendar_view"))
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

function putGoogleCalendarLink()
{
	var calEnable = false;

	$.ajax({ url : 'core/api/calendar-prefs/get', async : false, success : function(response)
	{
		if (response)
			calEnable = true;

	} });

	if (calEnable)
	{
		$("#google_cal").show();
		$("#google_cal_link").addClass('hide');
	}

	else
	{
		$("#google_cal").hide();
		if (!readCookie('calendarDefaultView'))
			$("#google_cal_link").removeClass('hide');
		else
			$("#google_cal_link").addClass('hide');
	}
}

function renderFullCalenarEvents(ownerid)
{
	var start_end_time = JSON.parse(readCookie('fullcalendar_start_end_time'));

	var eventsURL = '/core/api/events?start=' + start_end_time.startTime + "&end=" + start_end_time.endTime;

	eventsURL += '&owner_id=' + ownerid;
	console.log('-----------------', eventsURL);
	$.getJSON(eventsURL, function(doc)
	{
		$.each(doc, function(index, data)
		{
			data = renderEventBasedOnOwner(data);
			$('#calendar_event').fullCalendar('renderEvent', data);
		});
	});

}

function removeFullCalendarEvents(ownerid)
{
	var start_end_time = JSON.parse(readCookie('fullcalendar_start_end_time'));

	var eventsURL = '/core/api/events?start=' + start_end_time.startTime + "&end=" + start_end_time.endTime;

	eventsURL += '&owner_id=' + ownerid;
	console.log('-----------------', eventsURL);
	$.getJSON(eventsURL, function(doc)
	{
		$.each(doc, function(index, data)
		{
			$('#calendar_event').fullCalendar('removeEvents', data.id);
		});
	});

}

function getOwnerIdsFromCookie(uncheckedagile)
{
	var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
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

function loadGoogleEventsandRender()
{
	var start_end_time = JSON.parse(readCookie('fullcalendar_start_end_time'));
	$.getJSON('core/api/calendar-prefs/get', function(response)
	{
		console.log(response);
		if (response)
		{
			createCookie('google_event_token', response.access_token);

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

function renderAddedEventToFullCalenarBasedOnCookie(data)
{
	var renderEvent = false;
	var eventFilters = JSON.parse(readCookie('event-lhs-filters'));

	if (data.owner.id == CURRENT_DOMAIN_USER.id)
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

function renderEventBasedOnOwner(data)
{
	if (data.owner.id == CURRENT_DOMAIN_USER.id)
	{
		if (data.color == 'red' || data.color == '#f05050')
			data.className = 'b-l b-2x b-danger fc-z-index';
		else if (data.color == 'green' || data.color == '#bbb')
			data.className = 'b-l b-2x b-light fc-z-index';
		else if (data.color == '#36C' || data.color == '#23b7e5' || data.color == 'blue')
			data.className = 'b-l b-2x b-warning fc-z-index';
		data.color = '';
		data.backgroundColor = '#fff';
	}
	else
	{
		if (data.color == 'red' || data.color == '#f05050')
			data.className = 'high';
		else if (data.color == 'green' || data.color == '#bbb')
			data.className = 'low';
		else if (data.color == '#36C' || data.color == '#23b7e5' || data.color == 'blue')
			data.className = 'normal';
		data.color = '';
		data.backgroundColor = '#fff';
	}
	return data;
}
