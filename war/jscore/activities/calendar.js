/**
 * 
 * Describes the given object is an array or not
 * 
 * @param {Object}
 *            a to verify array or not
 * @returns {Boolean} true if given param is array else false
 */
function isArray(a)
{
	return Object.prototype.toString.apply(a) === '[object Array]';
}

/**
 * Loads events from google calendar using tokens either from cookies or token
 * from backend when token in cookie is epired
 * 
 * @param callback
 */
function load_events_from_google(callback)
{
	if (readCookie('event-filters'))
	{
		if (JSON.parse(readCookie('event-filters')).type == 'agile')
			return;

		// Check whether to show the google calendar events or not.
		if (JSON.parse(readCookie('event-filters')).owner_id.length > 0 && CURRENT_AGILE_USER.id != JSON.parse(readCookie('event-filters')).owner_id)
			return;
	}

	// Name of the cookie to store/fetch calendar prefs. Current user id is set
	// in cookie name to avoid
	// showing tasks in different users calendar if logged in same browser
	var google_calendar_cookie_name = "_agile_google_calendar_prefs_" + CURRENT_DOMAIN_USER.id;

	// Reads existing cookie
	var _agile_calendar_prefs_cookie = readCookie(google_calendar_cookie_name);

	// If cookie is not null, then it check it token is still valid; checks
	// based on expiry time.
	if (_agile_calendar_prefs_cookie && _agile_calendar_prefs_cookie != "null")
	{
		var prefs = JSON.parse(_agile_calendar_prefs_cookie);

		// Checks if token expired. It considers expire before 2 minutes window
		// of actual expiry time.
		if (prefs.expires_at - (2 * 60 * 1000) >= new Date().getTime())
		{
			// Returns token to the callback accoring to specification of gcal
			get_google_calendar_event_source(prefs, callback);
			return;
		}

		// Erases cookie if token is expired and sends request to backend to
		// acquire new token
		erase_google_calendar_prefs_cookie()

	}

	// Fetch new token from backen, saves in cookie, and token is returned to
	// gcal
	$.getJSON('/core/api/calendar-prefs/refresh-token', function(prefs)
	{
		if (!prefs)
			return;

		// Creates cookie
		createCookie(google_calendar_cookie_name, JSON.stringify(prefs));
		get_google_calendar_event_source(prefs, callback);
	});
}

/**
 * Erases calendar cookie
 */
function erase_google_calendar_prefs_cookie()
{
	var google_calendar_cookie_name = "_agile_google_calendar_prefs_" + CURRENT_DOMAIN_USER.id;
	eraseCookie(google_calendar_cookie_name);
}

// Returns token in to gcal callback in specified format
function get_google_calendar_event_source(data, callback)
{

	if (callback && typeof (callback) === "function")
		callback({ token : data.access_token, dataType : 'agile-gcal', className : "agile-gcal" });
}

/**
 * Shows the calendar
 */
function showCalendar()
{

	_init_gcal_options();
	var calendarView = (!readCookie('calendarDefaultView')) ? 'month' : readCookie('calendarDefaultView');
	$('#calendar_event')
			.fullCalendar(
					{

						/**
						 * Renders the events displaying currently on
						 * fullCalendar
						 * 
						 * @method events
						 * @param {Object}
						 *            start fullCalendar current section start
						 *            day date object
						 * @param {Object}
						 *            end fullCalendar current section end day
						 *            date object
						 * @param {function}
						 *            callback displays the events on
						 *            fullCalendar
						 * 
						 */

						eventSources : [
								{ events : function(start, end, callback)
								{

									var eventFilters = JSON.parse(readCookie('event-filters'));
									if (readCookie('event-filters') && eventFilters.type == 'google')
									{
										$("#loading_calendar_events").hide();
										return;
									}

									var eventsURL = '/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000;
									if (readCookie('event-filters') && eventFilters.owner_id.length > 0)
										eventsURL += '&owner_id=' + eventFilters.owner_id;
									console.log('-----------------', eventsURL);
									$.getJSON(eventsURL, function(doc)
									{

										if (doc)
										{

											callback(doc);

										}
									});
								} }, { dataType : 'agile-gcal' }
						],
						header : { left : 'prev,next today', center : 'title', right : 'month,agendaWeek,agendaDay' },
						defaultView: calendarView,
					    viewDisplay: function(view){
						        createCookie('calendarDefaultView', view.name,90);
						    },
						loading : function(bool)
						{
							if (bool)
							{

								$("#loading_calendar_events").remove();
								$('.fc-header-left').append(
										'<span id="loading_calendar_events" style="margin-left:5px;vertical-align:middle">loading...</span>').show();
								$('.fc-header-left').show();

							}
							else
							{
								// $('#loading').hide();
								$("#loading_calendar_events").hide();
								start_tour('calendar');
							}
						},
						selectable : true,
						selectHelper : true,
						editable : true,
						theme : false,
						/**
						 * Shows event pop-up modal with pre-filled date and
						 * time values, when we select a day or multiple days of
						 * the fullCalendar
						 * 
						 * @method select
						 * @param {Object}
						 *            start start-date of the event
						 * @param {Object}
						 *            end end-date of the event
						 * @param {Boolean}
						 *            allDay
						 */
						select : function(start, end, allDay)
						{
							// Show a new event
							$('#activityModal').modal('show');
							highlight_event();

							// Set Date for Event
							var dateFormat = 'mm/dd/yyyy';
							$('#task-date-1').val(start.format(dateFormat));
							$("#event-date-1").val(start.format(dateFormat));
							$("#event-date-2").val(end.format(dateFormat));

							// Set Time for Event
							if ((start.getHours() == 00) && (end.getHours() == 00) && (end.getMinutes() == 00))
							{
								$('#event-time-1').val('');
								$('#event-time-2').val('');
							}
							else
							{
								$('#event-time-1')
										.val(
												(start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start
														.getMinutes());
								$('#event-time-2').val(
										(end.getHours() < 10 ? "0" : "") + end.getHours() + ":" + (end.getMinutes() < 10 ? "0" : "") + end.getMinutes());
							}

						},
						/**
						 * Updates the event by changing start and end date,
						 * when it is dragged to another location on
						 * fullCalendar.
						 * 
						 * @method eventDrop
						 * @param {Object}
						 *            event1 event with new start and end date
						 * @param {Number}
						 *            dayDelta holds the number of days the
						 *            event was moved forward
						 * @param {Number}
						 *            minuteDelta holds the number of minutes
						 *            the event was moved forward
						 * @param {Boolean}
						 *            allDay weather the event has been dropped
						 *            on a day in month view or not
						 * @param {Function}
						 *            revertFunc sets the event back to it's
						 *            original position
						 */
						eventDrop : function(event1, dayDelta, minuteDelta, allDay, revertFunc)
						{

							// Confirm from the user about the change
							if (!confirm("Are you sure about this change?"))
							{
								revertFunc();
								return;
							}

							var event = $.extend(true, {}, event1);

							// Update event if the user changes it in the
							// calendar
							event.start = new Date(event.start).getTime() / 1000;
							event.end = new Date(event.end).getTime() / 1000;
							if (event.end == null || event.end == 0)
								event.end = event.start;
							var jsoncontacts=event.contacts;
							var _contacts=[];
							for(var i in jsoncontacts){
								_contacts.push(jsoncontacts[i].id);
								
							}
							delete event.contacts;
							delete event.owner;
							event.contacts=_contacts;
							var eventModel = new Backbone.Model();
							eventModel.url = 'core/api/events';

							eventModel.save(event);
						},
						/**
						 * Updates or deletes an event by clicking on it
						 * 
						 * @method eventClick
						 * @param {Object}
						 *            event to update or delete
						 */
						eventClick : function(event)
						{
							if (isNaN(event.id))
								return;
							// Deserialize
							deserializeForm(event, $("#updateActivityForm"));

							// Set time for update Event
							$('#update-event-time-1')
									.val(
											(event.start.getHours() < 10 ? "0" : "") + event.start.getHours() + ":" + (event.start.getMinutes() < 10 ? "0" : "") + event.start
													.getMinutes());
							$('#update-event-time-2').val(
									(event.end.getHours() < 10 ? "0" : "") + event.end.getHours() + ":" + (event.end.getMinutes() < 10 ? "0" : "") + event.end
											.getMinutes());

							// Set date for update Event
							var dateFormat = 'mm/dd/yyyy';
							$("#update-event-date-1").val((event.start).format(dateFormat));
							$("#update-event-date-2").val((event.end).format(dateFormat));

							// hide end date & time for all day events
							if (event.allDay)
							{
								$("#update-event-date-2").closest('.row').hide();
								$('#update-event-time-1').closest('.control-group').hide();
							}
							else
							{
								$('#update-event-time-1').closest('.control-group').show();
								$("#update-event-date-2").closest('.row').show();
							}

							// Show edit modal for the event
							$("#updateActivityModal").modal('show');
							
							// Fills owner select element
							populateUsersInUpdateActivityModal(event);
							return false;
						}

					});
}

function showEventFilters()
{
	$('#filter_options').show();

	if (readCookie("agile_calendar_view"))
		$('#filter_options .calendar-view').hide();
	else
		$('#filter_options .list-view').hide();

	if (readCookie('event-filters'))
	{
		var eventFilters = JSON.parse(readCookie('event-filters'));
		$('#event-owner').val(eventFilters.owner_id);
		$('#event_type').val(eventFilters.type);
	}

}

function buildEventFilters()
{
	$.getJSON('/core/api/users/agileusers', function(users)
	{
		var html = '', html1 = '';
		if (users)
		{
			$.each(users, function(i, user)
			{
				if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
					html1 = '<option value=' + user.id + '>Me</option>';
				else{
					if(user.domainUser)
					html += '<option value=' + user.id + '>' + user.domainUser.name + '</option>';
				}
			});
			html += '<option value="">Any</option>';
		}
		$('#event-owner').html(html1 + html);
	});
}

function loadDefaultFilters(callback)
{
	// Create a cookie with default option, if there is no cookie related to
	// event filter.
	if (!readCookie('event-filters'))
	{
		$.getJSON('/core/api/users/agileusers', function(users)
		{
			if (users)
			{
				$.each(users, function(i, user)
				{
					if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
					{
						var json = {};
						json.owner_id = user.id.toString();
						json.type = '';
						createCookie('event-filters', JSON.stringify(json));
					}
				});
			}

			if (callback)
				callback();
		});
	}
}

$(function()
{
	$("#sync-google-calendar").die().live('click', function(e)
	{
		e.preventDefault();

		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href;

		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=google_calendar&return_url=" + encodeURIComponent(callbackURL);
	});

	$("#sync-google-calendar-delete").die().live('click', function(e)
	{
		e.preventDefault();

		var disabled = $(this).attr("disabled");
		if (disabled)
			return;

		$(this).attr("disabled", "disabled");

		$(this).after(getRandomLoadingImg());
		App_Widgets.calendar_sync_google.model.url = "/core/api/calendar-prefs"
		console.log(App_Widgets.calendar_sync_google.model.destroy({ success : function()
		{

			App_Widgets.calendar_sync_google.model.clear();
			App_Widgets.calendar_sync_google.model.url = "/core/api/calendar-prefs/get"
			App_Widgets.calendar_sync_google.render(true);
			erase_google_calendar_prefs_cookie();

		} }));
	});

	// Show filter drop down.
	$('#event-filter-button').live('click', function(e)
	{
		e.preventDefault();
		showEventFilters();
	});

	$('#event-filter-validate').live('click', function(e)
	{
		$('#filter_options').hide();
		var formId = 'eventsFilterForm';
		var json = serializeForm(formId);
		createCookie('event-filters', JSON.stringify(json));

		if (readCookie("agile_calendar_view"))
		{
			if (json.time === 'future')
				createCookie("agile_calendar_view", "calendar_list_view_future");
			else
				createCookie("agile_calendar_view", "calendar_list_view");
		}

		// if list view
		if (!readCookie("agile_calendar_view"))
		{
			$('#calendar_event').html('');
			// App_Calendar.calendar();
			showCalendar();
		}
		else
		{

			loadAgileEvents();
			loadGoogleEvents();

		}
	});

	// Show filter drop down.
	$('#clear-event-filters').live('click', function(e)
	{
		e.preventDefault();
		$('#filter_options select').val('');
		eraseCookie('event-filters');
		loadDefaultFilters();
		showEventFilters();
	});

	$('#event_type').live('change', function()
	{
		console.log("----------", this.options[this.selectedIndex].text);
		var dd = document.getElementById('event-owner');
		var opt = $(this).val();
		if (opt == 'google' && dd.options[dd.selectedIndex].text != 'Any')
		{
			dd.selectedIndex = 0;
		}
	});

	$('#event-owner').live('change', function()
	{
		console.log("----------", this.options[this.selectedIndex].text);
		var opt = this.options[this.selectedIndex].text;
		if (opt != 'Me' && opt != 'Any')
			$('#event_type').val('agile');
	});

	/**
	 * Hide the filters window when click on out side of the filters pop up.
	 */
	$(document).mouseup(function(e)
	{
		var container = $("#filter_options");

		if (!container.is(e.target) // if the target of the click isn't the
				// container...
				&& container.has(e.target).length === 0) // ... nor a
		// descendant of the
		// container
		{
			container.hide();
		}
	});

	loadDefaultFilters();

	// Save current agile user in global.
	$.getJSON('/core/api/users/agileusers', function(users)
	{
		$.each(users, function(i, user)
		{
			if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
			{
				CURRENT_AGILE_USER = user;
			}
		});
	});
});