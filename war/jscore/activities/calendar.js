/**

 * Describes the given object is an array or not
 * @param {Object} a to verify array or not 
 * @returns {Boolean} true if given param is array else false
 */
function isArray(a)
{
    return Object.prototype.toString.apply(a) === '[object Array]';
}

function load_events_from_google()
{
	var google_calendar_cookie_name = "_agile_google_calendar_prefs";
	var _agile_calendar_prefs_cookie = readCookie(google_calendar_cookie_name);
	console.log(_agile_calendar_prefs_cookie);
	if(_agile_calendar_prefs_cookie && _agile_calendar_prefs_cookie != "null")
	{
		var prefs = JSON.parse(_agile_calendar_prefs_cookie);
		console.log(prefs);
		if(prefs.expires_at - (2 * 60 * 1000)  >= new Date().getTime())
		{
			fill_events_from_google(prefs);
			return;
		}
		erase_google_calendar_prefs_cookie()
		
	}
	
	$.getJSON('/core/api/calendar-prefs/refresh-token', function (doc) {
		if(!doc)
			return;
		createCookie("_agile_google_calendar_prefs", JSON.stringify(doc));
		fill_events_from_google(doc);
 	});
}

function erase_google_calendar_prefs_cookie()
{
	var google_calendar_cookie_name = "_agile_google_calendar_prefs";
	eraseCookie(google_calendar_cookie_name);
}

function fill_events_from_google(data)
{
	head.js('lib/calendar/gcal.js', 'https://apis.google.com/js/client.js', 'https://rawgithub.com/dr-skot/gapi-helper/master/gapi-helper.js', function(){
		$('#calendar').fullCalendar( 'addEventSource', {token:data.access_token, dataType:'agile-gcal'});		
	});
}



/**
 * Shows the calendar
 */
function showCalendar() {
  $('#calendar').fullCalendar({
    	
       /**
        * Renders the events displaying currently on fullCalendar
        * @method events
        * @param {Object} start fullCalendar current section start day date object
        * @param {Object} end fullCalendar current section end day date object
        * @param {function} callback displays the events on fullCalendar
        * 
        */
    	
        eventSources :[{events: function (start, end, callback) {
        	load_events_from_google();
            $.getJSON('/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000, function (doc) {
                
            	if(doc)
            	{
            		  
            	    callback(doc);
            		
            	}
            });
        }}],
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        loading: function (bool) {
            if (bool) {
                $('#loading').show();
                
            } else {
                $('#loading').hide();
                
                $('#subscribe-ical').css('display','block');
                start_tour('calendar');
            }
        },
        selectable: true,
		selectHelper: true,
		editable: true,
		theme: false,
	   /**
	    * Shows event pop-up modal with pre-filled date and time values, 
	    * when we select a day or multiple days of the fullCalendar 
	    * @method select
	    * @param {Object} start start-date of the event
	    * @param {Object} end end-date of the event
	    * @param {Boolean} allDay   
	    */	
        select: function(start, end, allDay) {
        	// Show a new event
            $('#activityModal').modal('show');
            highlight_event();
            
            // Set Date for Event
            var dateFormat = 'mm/dd/yyyy';
            $('#task-date-1').val(start.format(dateFormat));
            $("#event-date-1").val(start.format(dateFormat));
            $("#event-date-2").val(end.format(dateFormat));

            
            // Set Time for Event
            if ((start.getHours() == 00) && (end.getHours() == 00) && (end.getMinutes() == 00)) {
                $('#event-time-1').val('');
                $('#event-time-2').val('');
            } else {
                $('#event-time-1').val((start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start.getMinutes());
                $('#event-time-2').val((end.getHours() < 10 ? "0" : "") + end.getHours() + ":" + (end.getMinutes() < 10 ? "0" : "") + end.getMinutes());
            }
            
		},
	   /**
	    * Updates the event by changing start and end date, when it is 
	    * dragged to another location on fullCalendar.
	    * @method eventDrop
	    * @param {Object} event1 event with new start and end date
	    * @param {Number} dayDelta holds the number of days the event was moved forward
	    * @param {Number} minuteDelta holds the number of minutes the event was moved forward
	    * @param {Boolean} allDay weather the event has been dropped on a day in month view or not
	    * @param {Function} revertFunc sets the event back to it's original position
	    */	
		eventDrop: function(event1, dayDelta, minuteDelta, allDay, revertFunc) {      
	    
			
			// Confirm from the user about the change
			if (!confirm("Are you sure about this change?")) {
	            revertFunc();
	            return;
	        }
			
			var event = $.extend(true, {}, event1);
			
			
			// Update event if the user changes it in the calendar
			event.start = new Date(event.start).getTime()/1000;
	        event.end = new Date(event.end).getTime()/1000;
	        if(event.end == null || event.end == 0)	        	
	        	event.end = event.start;
	        var eventModel = new Backbone.Model();
	        eventModel.url = 'core/api/events';
	        
	        eventModel.save(event);	        
   	    },
   	   /**
   	    * Updates or deletes an event by clicking on it
   	    * @method eventClick
   	    * @param {Object} event to update or delete
   	    */ 
   	    eventClick: function (event) {
   	    	
   	    	// Deserialize
   	    	deserializeForm(event, $("#updateActivityForm"));
   	    	
   	    	// Set time for update Event
            $('#update-event-time-1').val((event.start.getHours() < 10 ? "0" : "") + event.start.getHours() + ":" + (event.start.getMinutes() < 10 ? "0" : "") +event.start.getMinutes());
            $('#update-event-time-2').val((event.end.getHours() < 10 ? "0" : "") + event.end.getHours() + ":" + (event.end.getMinutes() < 10 ? "0" : "") + event.end.getMinutes());
           
         // Set date for update Event
            var dateFormat = 'mm/dd/yyyy';
            $("#update-event-date-1").val((event.start).format(dateFormat));
            $("#update-event-date-2").val((event.end).format(dateFormat));
            
   	    	// hide end date & time for all day events
            if(event.allDay)
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
   	    	return false;
   	    }
   	    
    });
}

$(function(){
	$("#sync-google-calendar").die().live('click', function(e){
		e.preventDefault();
		
		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href;
		
		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=google_calendar&return_url=" + encodeURIComponent(callbackURL);
	});
	
	$("#sync-google-calendar-delete").die().live('click', function(e){
		e.preventDefault();
		
		var disabled = $(this).attr("disabled");
		if(disabled)
			return;
		
		$(this).attr("disabled", "disabled");
		
		$(this).after(LOADING_HTML);
		App_Settings.calendar_sync_google.model.url = "/core/api/calendar-prefs"
		console.log(App_Settings.calendar_sync_google.model.destroy({success : function(){
			
			App_Settings.calendar_sync_google.model.clear();
			App_Settings.calendar_sync_google.model.url = "/core/api/calendar-prefs/get"
			App_Settings.calendar_sync_google.render(true);
			erase_google_calendar_prefs_cookie();
			
		}}));
	});
});

