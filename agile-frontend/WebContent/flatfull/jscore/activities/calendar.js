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

	var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
	var agile_event = false;
	if (eventFilters)
	{
		var type_of_cal = eventFilters.cal_type;
		var owners = eventFilters.owner_ids;
		if (owners && owners.length > 0)
		{
			$.each(owners, function(index, value)
			{
				if (value)
				{
					if (value.id == CURRENT_AGILE_USER.id)
						agile_event = true;
				}
			});
		}

		if ((type_of_cal && type_of_cal.length != 2 && type_of_cal[0] == 'agile') || type_of_cal.length == 0)
		{
			return;
		}
	}

	// Name of the cookie to store/ calendar prefs. Current user id is set
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
var fullCal;
function showCalendar()
{

	_init_gcal_options();
	putGoogleCalendarLink();
	var calendarView = (!readCookie('calendarDefaultView')) ? 'month' : readCookie('calendarDefaultView');
	$('#' + calendarView).addClass('bg-light');
	fullCal = $('#calendar_event')
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

									var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
									var agile_event_owners = '';
									if (eventFilters)
									{
										var type_of_cal = eventFilters.cal_type;
										var owners = eventFilters.owner_ids;

										$.each(type_of_cal, function(index, value)
										{
											if (value == 'agile')
												owners.push(CURRENT_AGILE_USER.id);
										});

										if (owners && owners.length > 0)
										{
											$.each(owners, function(index, value)
											{

												if (index >= 1)
													agile_event_owners += ",";
												agile_event_owners += value;
											});
										}

										if ((type_of_cal.length == 1 && type_of_cal[0] == 'google' && owners.length == 1 && owners[0] == CURRENT_AGILE_USER.id) || type_of_cal.length == 0 && owners.length == 0)
										{
											$("#loading_calendar_events").hide();
											return;
										}
									}

									/*
									 * if (readCookie('event-filters') &&
									 * eventFilters.type == 'google') {
									 * $("#loading_calendar_events").hide();
									 * return; }
									 */
									var start_end_array = {};
									start_end_array.startTime = start.getTime() / 1000;
									start_end_array.endTime = end.getTime() / 1000;
									createCookie('fullcalendar_start_end_time', JSON.stringify(start_end_array));

									var eventsURL = '/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000;

									eventsURL += '&owner_id=' + agile_event_owners;
									console.log('-----------------', eventsURL);
									$.getJSON(eventsURL, function(doc)
									{
										$.each(doc, function(index, data)
										{
											// decides the color of event based
											// on owner id
											data = renderEventBasedOnOwner(data);
										});

										if (doc)
										{

											callback(doc);

										}
									});
								} }, { dataType : 'agile-gcal' }
						],
						header : { left : 'prev', center : 'title', right : 'next' },
						defaultView : calendarView,
						slotEventOverlap : false,
						viewDisplay : function(view)
						{
							createCookie('calendarDefaultView', view.name, 90);
							$(".fc-agenda-axis").addClass('bg-light lter');
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
							$(".fc-agenda-axis").addClass('bg-light lter');
							$(".ui-resizable-handle").hide();
						},
						selectable : true,
						selectHelper : true,
						editable : true,
						theme : false,
						contentHeight : 400,
						themeButtonIcons : { prev : 'fc-icon-left-single-arrow', next : 'fc-icon-right-single-arrow' },
						eventMouseover : function(event, jsEvent, view)
						{
							calendarView = (!readCookie('calendarDefaultView')) ? 'month' : readCookie('calendarDefaultView');
							var reletedContacts = '';
							var meeting_type = '';
							if (event.contacts.length > 0)
								reletedContacts += '<i class="icon-user text-muted m-r-xs"></i>'
							for (var i = 0; i < event.contacts.length; i++)
							{
								if (event.contacts[i].entity_type == "contact_entity")
								{
									var last_name = getPropertyValue(event.contacts[i].properties, "last_name");
									if (last_name == undefined)
										last_name = "";
									reletedContacts += '<a class="text-info" href="#contact/' + event.contacts[i].id + '">' + getPropertyValue(
											event.contacts[i].properties, "first_name") + ' ' + last_name + '</a>';
								}
								else
									reletedContacts += '<a class="text-info" href="#contact/' + event.contacts[i].id + '">' + getPropertyValue(
											event.contacts[i].properties, "name") + '</a>';
								if (i != event.contacts.length - 1)
									reletedContacts += ', ';
							}
							var leftorright = 'left';
							var pullupornot = '';
							if (calendarView == "agendaDay")
								leftorright = 'top';
							else
							{
								if (event.start.getDay() == 5 || event.start.getDay() == 6)
									leftorright = 'right';
								pullupornot = 'pull-up';
							}
							if (event.meeting_type && event.description)
							{
								meeting_type = '<i class="icon-comment-alt text-muted m-r-xs"></i><span>Meeting Type - ' + event.meeting_type + '</span><br/><span title=' + event.description + '>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + addDotsAtEnd(event.description) + '</span>';
							}

							else if (event.description)
							{
								meeting_type = '<i class="icon-comment-alt text-muted m-r-xs"></i><span title=' + event.description + '>' + addDotsAtEnd(event.description) + '</span>';
							}
							var popoverElement = '<div class="fc-overlay ' + leftorright + '">' + '<div class="panel bg-white b-a pos-rlt p-sm">' + '<span class="arrow ' + leftorright + ' ' + pullupornot + '"></span>' + '<div class="h4 font-thin m-b-sm"><div class="pull-left">' + event.title + '</div><div class="pull-right"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px" title="' + event.owner.name + '"/></div></div>' + '<div class="line b-b b-light"></div>' + '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start
									.format('dd-mmm-yyyy HH:MM') + '</div>' + '<div>' + reletedContacts + '</div>' + '<div>' + meeting_type + '</div>' + '</div>' + '</div>';
							$(this).append(popoverElement);
							$(this).find('.fc-overlay').show();
							$(this).find(".ui-resizable-handle").show();
						},
						eventMouseout : function(event, jsEvent, view)
						{
							$(this).find('.fc-overlay').hide();
							$(this).find('.fc-overlay').remove();
							$(this).find(".ui-resizable-handle").hide();
						},
						eventAfterRender : function(event, element, view)
						{
							$(".ui-resizable-handle").hide();
							console.log("exec");
						},
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
							if (event1.className == "b-l,b-2x,b-danger,fc_border_height" || event1.className == "high,b-l,b-2x,b-light,fc_border_height")
								event.color = "red";
							else if (event1.className == "b-l,b-2x,b-info,fc_border_height" || event1.className == "low,b-l,b-2x,b-light,fc_border_height")
								event.color = "green";
							else if (event1.className == "b-l,b-2x,b-warning,fc_border_height" || event1.className == "normal,b-l,b-2x,b-light,fc_border_height")
								event.color = "#36C";
							var jsoncontacts = event.contacts;
							var _contacts = [];
							for ( var i in jsoncontacts)
							{
								_contacts.push(jsoncontacts[i].id);

							}
							event = renderEventBasedOnOwner(event);
							delete event.contacts;
							delete event.owner;
							event.contacts = _contacts;
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
							event = revertEVentColorBasedOnPrioirty(event);

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

							if (event.type == "WEB_APPOINTMENT" && parseInt(new Date(event.start).getTime() / 1000) > parseInt(new Date().getTime() / 1000))
							{
								$("[id='event_delete']").attr("id", "delete_web_event");
								web_event_title = event.title;
								if (event.contacts.length > 0)
								{
									var firstname = getPropertyValue(event.contacts[0].properties, "first_name");
									if (firstname == undefined)
										firstname = "";
									var lastname = getPropertyValue(event.contacts[0].properties, "last_name");
									if (lastname == undefined)
										lastname = "";
									web_event_contact_name = firstname + " " + lastname;
								}
							}
							else
							{
								$("[id='delete_web_event']").attr("id", "event_delete");
							}
							if (event.description)
							{
								var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
								$("#event_desc").html(description);
								$("textarea#description").val(event.description);
							}
							else
							{
								var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>' + '</div></div></div>'
								$("#event_desc").html(desc);
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
				else
				{
					if (user.domainUser)
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

	// loadDefaultFilters();

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
function changeView(view)
{
	currentView = view;
	fullCal.fullCalendar('changeView', view);
};
function today()
{
	fullCal.fullCalendar('today');
}
$('.agendaDayWeekMonth').die().live('click', function()
{
	currentView = $(this).attr('id');
	fullCal.fullCalendar('changeView', currentView);
	$(this).parent().find('button').each(function()
	{
		if ($(this).attr('id') == currentView)
			$(this).addClass('bg-light');
		else
			$(this).removeClass('bg-light');
	});

});

function getCalendarUsersDetails()
{

	var users = $.ajax({ type : "GET", url : '/core/api/users/agileusers', async : false }).responseText;
	var json_users = [];
	if (users)
	{
		$.each(JSON.parse(users), function(i, user)
		{

			if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
			{
				CURRENT_AGILE_USER = user;

			}
			else
			{
				if (user.domainUser)
				{
					var json_user = {};
					json_user.id = user.id;
					json_user.name = user.domainUser.name;
					json_user.domain_user_id = user.domainUser.id;
					json_users.push(json_user);
				}

			}

		});
	}

	return json_users;
}
