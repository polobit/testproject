function isArray(a)
{
    return Object.prototype.toString.apply(a) === '[object Array]';
}

$(function(){

	$(".add-task").live('click', function(e){
		e.preventDefault();
		$('#activityModal').modal('show');
		highlightTask();
	    var	el = $("#taskForm");
		agile_type_ahead("task_related_to", el, contacts_typeahead);
	});
	
	$(".add-event").live('click', function(e){
		e.preventDefault();
		$('#activityModal').modal('show');
		highlightEvent();
	});
	
});

function showCalendar() {
    $('#calendar').fullCalendar({

        events: function (start, end, callback) {
            $.getJSON('/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000, function (doc) {
                 	
            	if(doc)
            	{
            		            		
            	    callback(doc);
            		
            	}
            });
        },
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventClick: function (event) {
            // opens events in a popup window
            window.open(event.url, 'gcalevent', 'width=700,height=600');
            return false;
        },

        loading: function (bool) {
            if (bool) {
                $('#loading').show();
            } else {
                $('#loading').hide();
            }
        },
        selectable: true,
		selectHelper: true,
		editable: true,
		theme: false,
		eventClick: function (event) {
            
			// Opens events in a popup window
        	console.log(event);
        	
        	$("#newactivityModal").modal('show');
        	
        	// Deserialize into the modal
        	// To do
        	
         },
        select: function(start, end, allDay) {
        	
        	// Show a new event
            $('#activityModal').modal('show');
            highlightEvent();
            // Set Date for Event
            var dateFormat = 'mm-dd-yy';
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
		eventDrop: function(event1, dayDelta, minuteDelta, allDay, revertFunc) {      
	    
			console.log(event1);
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
   	    eventClick: function (event) {
   	    	
   	    	// Deserialize
   	    	deserializeForm(event, $("#updateActivityForm"));
   	    	
   	    	// Set time for update Event
            $('#update-event-time-1').val((event.start.getHours() < 10 ? "0" : "") + event.start.getHours() + ":" + (event.start.getMinutes() < 10 ? "0" : "") +event.start.getMinutes());
            $('#update-event-time-2').val((event.end.getHours() < 10 ? "0" : "") + event.end.getHours() + ":" + (event.end.getMinutes() < 10 ? "0" : "") + event.end.getMinutes());
           
         // Set date for update Event
            var dateFormat = 'mm-dd-yy';
            $("#update-event-date-1").val((event.start).format(dateFormat));
            $("#update-event-date-2").val((event.end).format(dateFormat));
            
   	    	// Show edit modal for the event
   	    	$("#updateActivityModal").modal('show');
   	    	return false;
   	    }
   	    
    });
}

