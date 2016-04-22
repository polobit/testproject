/*!
 * FullCalendar v1.6.4 Google Calendar Plugin
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */

// or better


function loadUserEventsfromGoogle(start, end, callback){

	showLoadingOnCalendar(true);
		var isConfigured = load_events_from_google(function(data)
						{
							if (!data)
							{

								return;
							}

							return agile_transform_options(data, start, end);
						});

		if(!isConfigured)
			showLoadingOnCalendar(false);

	//	return;
}

function isDefined(x)
{
	var undefined;
	return typeof x !== undefined;
}

var isSet1  =false;
function _init_gcal_options(users)
{
	if(isSet1)
		return ;

	var fc = $.fullCalendar;
	//fc.sourceFetchers = [];
	// Transforms the event sources to Google Calendar Events
	fc.sourceFetchers.push(_googleEventFetcher);
	isSet1 =  true;
}

function _googleEventFetcher(sourceOptions, start, end, callback)
{	
	if (sourceOptions.dataType == 'agile-gcal')
		{
			
				loadUserEventsfromGoogle(start, end);

			return	{};

			//	callback([]);
		}
	else if (sourceOptions.dataType == "agile-events")
		{
			addEventsToCalendar(sourceOptions.events(start, end, function(test){}));

			return {};
			//return true;
		//	callback([]);

		}

		console.log("--------------- Events -----------------------");
		console.log(sourceOptions.className)
		if($.isFunction(sourceOptions.events))
		{
			//	return sourceOptions.events(start, end, callback);
		//	sourceOptions.events(start, end, callback);
				return;
		}		
		return;
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

	_load_gapi(function()
	{
		_fetchGCAndAddEvents(sourceOptions, start, end);
		return;
	});
}

function _load_gapi(callback)
{
	head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js?t=25', function()
		{
			setupGC(callback);
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

function _set_token_from_session(callback)
{
	if(typeof gapi === 'undefined')
	{
		_load_gapi(function()
		{
			get_google_calendar_prefs(function(sourceOptions){
				// Set the access token
				gapi.auth.setToken({ access_token : sourceOptions.token, state : "https://www.googleapis.com/auth/calendar" });
					callback();
				});
		});

		return;
	}

	// Set the access token
	var token = gapi.auth.getToken();

	if(token == null || token.access_token == null)
	{
		get_google_calendar_prefs(function(sourceOptions){
			// Set the access token
			gapi.auth.setToken({ access_token : sourceOptions.token, state : "https://www.googleapis.com/auth/calendar" });
			callback();
		});
		return;
	}
	return callback(gapi.auth.getToken());
}

function _resetGAPI()
{
	if(typeof gapi != 'undefined')
	{
		gapi.auth.setToken(undefined);
	}
}
function _fetchGoogleCalendarList(callback, retryCount)
{
	if(!retryCount)
			retryCount = 0;
	try
	{
		_set_token_from_session(function(data){
			var request = gapi.client.calendar.calendarList.list();
			request.execute(function(response){
				if(!response || response.code == '401')
				{
					if(retryCount < 2)
					{
						erase_google_calendar_prefs_cookie();
						gapi.auth.setToken(undefined);
						
						_set_token_from_session(function(){
							_fetchGoogleCalendarList(callback, ++retryCount)
						});
						return;
						//return _fetchGoogleCalendarList(callback, ++retryCount);
					}
				}
				else
					callback(response);
			});
		});

		return;
	}
	catch(err)
	{
	/*	console.log(err);
				if(retryCount > 2)
			return;

		return _fetchGoogleCalendarList(callback, ++retryCount);*/
	}
}

function _fetchGCAndAddEvents(sourceOptions, start, end)
{
	head.js('flatfull/lib/web-calendar-event/moment.min.js', function(){
		head.js('flatfull/lib/web-calendar-event/moment-timezone-with-data.js',function() {
			console.log(sourceOptions);
			// Set the access token
			gapi.auth.setToken({ access_token : sourceOptions.token, state : "https://www.googleapis.com/auth/calendar" });

			if(!sourceOptions.calendarIds)
			{
				sourceOptions.calendarIds = ["primary"];
			}

			showLoadingOnCalendar(false);
			$.each(sourceOptions.calendarIds, function(index, calendarId)
			{
				showLoadingOnCalendar(true);
				// Retrieve the events from primary
				var request = gapi.client.calendar.events.list({ 'calendarId' : calendarId, timeMin : ts2googleDate(start), timeMax : ts2googleDate(end),
					maxResults : 10000, // max results causes problems: http://goo.gl/FqwIFh
					singleEvents : true });

				request.execute(function(resp)
				{

					var google_events = [];
					for (var i = 0; i < resp.items.length; i++)
					{
						var fc_event = google2fcEvent(resp.items[i]);

						if (fc_event)
							var utcTime = new Date(fc_event.start).toUTCString();
	    					var tz = moment.tz(utcTime, CURRENT_USER_PREFS.timezone);
	      					fc_event.start = tz.format();
	      					
	      					utcTime = new Date(fc_event.end).toUTCString();
	    					tz = moment.tz(utcTime, CURRENT_USER_PREFS.timezone);
	      					fc_event.end = tz.format();
	      					
							google_events.push(fc_event);
						renderEventBasedOnOwner(fc_event);
						//$('#calendar_event').fullCalendar('renderEvent', fc_event);		
					}


					//$('#calendar_event').fullCalendar('renderEvents', google_events);
					addEventSourceToCalendar("google_" + calendarId, google_events);
					showLoadingOnCalendar(false);

					
					//$('#calendar_event').fullCalendar('removeEvents', function(value, i) {return false;});
					// Add event
					//$('#calendar_event').fullCalendar('renderEvents', google_events);
				});
			});
		});
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
			fc.end = $.fullCalendar.formatDate(end, 'yyyy-mm-dd');
		}
		else
		{
			end = new Date(fc.end);
		}
		end.setDate(end.getDate() - 1);
		fc.end = end.format('yyyy-mm-dd');

	}
	return fc;
}

// https://groups.google.com/forum/#!msg/google-api-javascript-client/ZFcvHvh3dJQ/-zKhUD5NtKgJ
