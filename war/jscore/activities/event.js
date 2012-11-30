/**
 * event.js
 *
 * event.js is a script file to deal with the actions like creation, updation and deletion of 
 * events from client side.
 * ------------------------------------------------
 *  author:  Rammohan
 */

$(function(){

		// Show activity modal
		// Highlight the event features 	
		$('#show-activity').live('click', function (e) {
			e.preventDefault();
			highlightEvent();
			$("#activityModal").modal('show');
		});
	   
	    // Update event
		// When click on update of event-update-modal, it calls saveEvent function with 
	    // parameters
	    //          -formId (to serialize the form)
	    //          -modalId (to hide and reset the modal)
	    //          -boolean true (to indicate that the called function is updating the existing task)
	    $('#update_event_validate').die().live('click', function (e) {
	    		e.preventDefault();
	    		
	    		saveEvent('updateActivityForm', 'updateActivityModal', true);
	    });
	    
	    // Delete event
	    $('#event_delete').die().live('click', function (e) {
	    		e.preventDefault();
	    		
	    		// Confirmation alert to delete an event
	    		if(!confirm("Are you sure you want to delete?"))
		    		return;
	    		
	    		var event_id = $('#updateActivityForm input[name=id]').val()

	    		// Show loading symbol until model get saved
	            $('#updateActivityModal').find('span.save-status').html(LOADING_HTML);
	    		$.ajax({
	    			url: 'core/api/events/' + event_id,
	    			type: 'DELETE',
	    			success: function(){
	        			
	        			$('#updateActivityModal').find('span.save-status img').remove();
	        			
		    	        $("#updateActivityModal").modal('hide');
	        		    
		    	        $('#calendar').fullCalendar('removeEvents', event_id);
	    			}
	    		});
	    });
	    		
	    		// Date picker
			    $('#event-date-1').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    $('#event-date-2').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    $('#update-event-date-1').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    $('#update-event-date-2').datepicker({
			        format: 'mm-dd-yyyy'
			    });
			    
			    // Time Picker
			    $('.start-timepicker').timepicker({defaultTime: 'current', showMeridian: false, template: 'modal'});
			    
			    $('.end-timepicker').timepicker({defaultTime: 'current', showMeridian: false, template: 'modal'});
			    
			    // Set the time picker when the modal is shown
			    $('#activityModal').on('shown', function () {
			    	
			    	// Fill current time only when there is no time in the fields
			    	if($('.start-timepicker').val() == '')
			    		$('.start-timepicker').val(getHHMM());
			    	
			    	if($('.end-timepicker').val() == '')
			    		$('.end-timepicker').val(getHHMM(true));
			    	
			    });
			    
			   // Switch Task and Event: changing color and font-weight
			   $("#event").click( function (e) {
			    	e.preventDefault();
			    	highlightEvent();
			   });
			    
});

//Highlight event
function highlightEvent(){
	$("#hiddentask").val("event");
    $("#event").css("color", "black");
	$("#task").css("color", "#DD4814");
	$("#relatedTask").css("display", "none");        
	$("#relatedEvent").css("display", "block");
}

// Validate event(start and end durations) 
function isValidRange(startDate, endDate, startTime, endTime){
	 if(endDate-startDate >= 86400000){
		 return true;
	 }
	 else if (startDate > endDate){
         $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#"></a>Start date should not be greater than end date. Please change.</div>');

		 return false;
	 }	 
	 else if(startTime[0] > endTime[0]){
         $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times</a>Start time should not be greater than end time. Please change.</div>');

		 return false;	 
	}
	else if(startTime[0] == endTime[0] && startTime[1] >= endTime[1]){
        $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times</a>Start time should not be greater or equal to end time. Please change.</div>');

		 return false;
	} 
	else
		return true;
}

// Save event
function saveEvent(formId, modalName, isUpdate){
	// Save functionality for event
	if (!isValidForm('#' + formId))
    	return false;
	    
	var json = serializeForm(formId);
	console.log(JSON.stringify(json));
	 // For validation
	if(!isValidRange(new Date(json.start).getTime(), new Date(json.end).getTime(), (json.start_time).split(":"), (json.end_time).split(":")))
           return;

	// Show loading symbol until model get saved
    $('#' + modalName).find('span.save-status').html(LOADING_HTML);
    
  	// Appending start time to start date 
  	var startarray = (json.start_time).split(":"); 	
   	json.start = new Date(json.start).setHours(startarray[0],startarray[1])/1000.0;

  	// Appending end time to end date 
  	var endarray = (json.end_time).split(":");
  	json.end = new Date(json.end).setHours(endarray[0],endarray[1])/1000.0;
	
	$('#' + modalName).modal('hide');
	
	$('#' + formId).each (function(){
  	  this.reset();
  	});
	
	// Deleting start_time and end_time from json 
	delete json.start_time;
	delete json.end_time;	

	var eventModel = new Backbone.Model();
    eventModel.url = 'core/api/events';
    eventModel.save(json,{
        success: function (data) {
        	
        	$('#' + formId).each (function(){
          	  this.reset();
          	});
        	
			$('#' + modalName).find('span.save-status img').remove();
        	$('#' + modalName).modal('hide');

        	//$('#calendar').fullCalendar( 'refetchEvents' );
        	
        	// When updating an event remove the old event
        	if(isUpdate)
        		$('#calendar').fullCalendar('removeEvents', json.id);
        	
        	$('#calendar').fullCalendar( 'renderEvent', data.toJSON() );
        	
        	App_Calendar.navigate("calendar", {
				trigger: true
			});
           }
       });
}

//Get Hours and Mins for the current time. It will be padded for 15 mins
function getHHMM(end_time) {
	
	
	var hours = new Date().getHours();
	var minutes = new Date().getMinutes();
	
 if (minutes % 15 != 0)
  minutes = minutes - (minutes % 15);
 
 // Make end time 30 minutes more than start time
 if(end_time){
 	if(minutes == "30"){
 		hours = hours + 1;
 		minutes = 0;
 	}else if(minutes == "45"){
 		hours = hours + 1;
 		minutes = 15;
 	}else
 		minutes = minutes + 30;
 }	
 
 if (hours   < 10) {hours   = "0"+hours;}
 if (minutes < 10) {minutes = "0"+minutes;}
 
 return hours + ':' + minutes;
}