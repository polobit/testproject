/*!
 * FullCalendar v1.6.4 Google Calendar Plugin
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */
 
(function($) {

var fc = $.fullCalendar;

alert(fc.sourceFetchers.length)
fc.sourceFetchers = [];
// Transforms the event sources to Google Calendar Events
fc.sourceFetchers.push(function(sourceOptions, start, end) {
	console.log(sourceOptions);
	if(sourceOptions.className == "google-calendar")
	{	
		console.log("*************************");
		console.log(sourceOptions);
		if (sourceOptions.events && typeof (sourceOptions.events) === "function")
	{
		sourceOptions.events(start, end, null, function(data){
		
			agile_transform_options(data, start, end);
		})
	}
	return;
	}
	
	if (sourceOptions.dataType == 'agile-gcal') {
		return agile_transform_options(sourceOptions, start, end);
	}
});

// or better
function isDefined(x) {
    var undefined;
    return x !== undefined;
}

// Tranform agile
function agile_transform_options(sourceOptions, start, end)
{	
	// Setup GC for First time
	//console.log(gapi.client.calendar);
	
	if(isDefined(gapi) && isDefined(gapi.client) && isDefined(gapi.client.calendar) ){ 
		_fetchGCAndAddEvents(sourceOptions, start, end);
		return;
	}
	
	setupGC(function(){
			_fetchGCAndAddEvents(sourceOptions, start, end);
			});
		return;
}

// Setup Google Calendar
function setupGC(callback)
{
	
	// Configure Calendar
	gapi_helper.configure({
    	scopes: 'https://www.googleapis.com/auth/calendar',
    	services: {
        	calendar: 'v3'
    	}
	});

	gapi_helper.when('calendarLoaded', callback);
}

function _fetchGCAndAddEvents(sourceOptions, start, end)
{
	// Set the access token
	
	//json["apiKey"] = "AIzaSyAHC_jmsqcrheJC-7ZMgByUCsOXyGZFn3M"; 
	//json["clientId"] = "396214664382-slcp1d7laq2u7hfv4n9e5g8hdgmar4nr.apps.googleusercontent.com";
	
	gapi.auth.setToken({access_token:sourceOptions.token, state: "https://www.googleapis.com/auth/calendar"});

	// Retrieve the events from primary
	var request = gapi.client.calendar.events.list({
      'calendarId': 'primary',
       timeMin: ts2googleDate(start),
        timeMax: ts2googleDate(end),
        maxResults: 10000, // max results causes problems: http://goo.gl/FqwIFh
        singleEvents: true
    });
    console.log("________________fetched__________________");
	request.execute(function(resp) {
		for (var i = 0; i < resp.items.length; i++) {	
			var fc_event = google2fcEvent(resp.items[i]);
			// Add event
		//	$('#calendar').fullCalendar('removeEvents', fc_event.id);
			$('#calendar').fullCalendar( 'renderEvent', fc_event )
		}
	});
}

// Convert a timestamp into google date format
function ts2googleDate(ts) {
    return $.fullCalendar.formatDate($.fullCalendar.parseDate(ts), 'u');
}
  
// Convert Google Event to Full Calendar Event  
function google2fcEvent(google) {
    var fc = {
       id : google.id,
      title: google.summary,
      start: google.start.date || google.start.dateTime,
      end: google.end.date || google.end.dateTime,
      allDay: google.start.date ? true : false,
      google: google, // keep a reference to the original,
      color: 'orange',
      editable : false
    };
    if (fc.allDay) {
      // subtract 1 from end date: Google all-day end dates are exclusive
      // FullCalendar's are inclusive
      var end = $.fullCalendar.parseDate(fc.end);
      end.setDate(end.getDate() - 1);
      fc.end = $.fullCalendar.formatDate(end, 'yyyy-MM-dd');
    }
    return fc;
}

})(jQuery);

//https://groups.google.com/forum/#!msg/google-api-javascript-client/ZFcvHvh3dJQ/-zKhUD5NtKgJ
