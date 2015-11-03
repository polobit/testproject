/*!
 * FullCalendar v1.6.4 Google Calendar Plugin
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */

// or better


function loadUserEventsfromGoogle(users, start, end){

		load_events_from_google(function(data)
						{
							if (!data)
								return;

							return agile_transform_options(data, start, end);
						});
}

function isDefined(x)
{
	var undefined;
	return typeof x !== undefined;
}

function _init_gcal_options(users)
{
	var fc = $.fullCalendar;
	fc.sourceFetchers = [];
	// Transforms the event sources to Google Calendar Events
	fc.sourceFetchers.push(function(sourceOptions, start, end)
	{
		if (sourceOptions.dataType == 'agile-gcal')
		{

			if(users){

				loadUserEventsfromGoogle(users, start, end);
				return;

			}
			// Check whether to show the google calendar events or not.

			$.getJSON('/core/api/users/agileusers', function(users)
				{
					loadUserEventsfromGoogle(users, start, end);
				});

		}
	});

}

// Tranform agile
function agile_transform_options(sourceOptions, start, end)
{
	// Setup GC for First time
	// console.log(gapi.client.calendar);

	if (typeof gapi != "undefined" && isDefined(gapi) && isDefined(gapi.client) && isDefined(gapi.client.calendar))
	{
		_fetchGCAndAddEvents(sourceOptions, start, end);
		return;
	}

	head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js', function()
	{
		setupGC(function()
		{
			_fetchGCAndAddEvents(sourceOptions, start, end);
		});
		return;
	});
}

// Setup Google Calendar
function setupGC(callback)
{
	console.log("Set up GC");

	// Configure Calendar
	gapi_helper.configure({ scopes : 'https://www.googleapis.com/auth/calendar', services : { calendar : 'v3' } });

	gapi_helper.when('calendarLoaded', callback);
}

function _fetchGCAndAddEvents(sourceOptions, start, end)
{
	// Set the access token
	gapi.auth.setToken({ access_token : sourceOptions.token, state : "https://www.googleapis.com/auth/calendar" });

	// Retrieve the events from primary
	var request = gapi.client.calendar.events.list({ 'calendarId' : 'primary', timeMin : ts2googleDate(start), timeMax : ts2googleDate(end),
		maxResults : 10000, // max results causes problems: http://goo.gl/FqwIFh
		singleEvents : true });

	request.execute(function(resp)
	{
		var google_events = [];
		for (var i = 0; i < resp.items.length; i++)
		{
			var fc_event = google2fcEvent(resp.items[i]);

			if (fc_event)
				google_events.push(fc_event);
				
		}

		// Add event
		$('#calendar_event').fullCalendar('addEventSource', google_events);
	});
}

// Convert a timestamp into google date format
function ts2googleDate(ts)
{
	return $.fullCalendar.formatDate($.fullCalendar.parseDate(ts), 'u');
}

// Convert Google Event to Full Calendar Event
function google2fcEvent(google)
{
	var fc = { title : google.summary || "No title", start : google.start.date || google.start.dateTime, end : google.end.date || google.end.dateTime,
		allDay : google.start.date ? true : false, google : google, // keep a
		// reference
		// to the
		// original,
		// color: 'orange',
		className : 'b-l b-2x b-dark b-b-l-r-2x b-t-l-r-2x fc_border_height', backgroundColor : '#fff', editable : false // To
	// make
	// the
	// google
	// cal
	// events
	// uneditable.
	};
	if (fc.allDay)
	{
		// subtract 1 from end date: Google all-day end dates are exclusive
		// FullCalendar's are inclusive
		var end;
		if (fc.end.length > 10)
		{
			end = $.fullCalendar.parseDate(fc.end);
			fc.end = $.fullCalendar.formatDate(end, 'yyyy-MM-dd');
		}
		else
		{
			end = new Date(fc.end);
		}
		end.setDate(end.getDate() - 1);
		fc.end = end.format('yyyy-MM-dd');

	}
	return fc;
}

// https://groups.google.com/forum/#!msg/google-api-javascript-client/ZFcvHvh3dJQ/-zKhUD5NtKgJ
