// UI Handlers for activities - event & task
$(function(){ 
	
		// Save task & event - Rammohan 03-08-2012
	    $('#task_event_validate').die().live('click', function (e) {
	    	        e.preventDefault();
	    	       
	    	        // Save functionality for task by checking task or not
	    	        if ($("#hiddentask").val() == "task") { 
	    	        	if (!isValidForm('#taskForm'))
	    		        	return false;
	    	        	$("#activityModal").modal('hide');
    	   	        	var json = serializeForm("taskForm");
	    	        	json.due = new Date(json.due).getTime()/1000.0;
	    	        	$('#taskForm').each (function(){
	    	          	  this.reset();
	    	          	});
	    	        	var newTask = new Backbone.Model();
	    	        	newTask.url = 'core/api/tasks';
	    	        	newTask.save(json); 
	    	        }
	    	        else
	    	        { 
	    	        	// Save functionality for event
	    	        	if (!isValidForm('#activityForm'))
	    		        	return false;
	    	        	var json = serializeForm("activityForm");
    	          	
	    	          	// Appending start time to start date 
	    	          	var startarray = (json.start_time).split(":"); 	
	     	          	json.start = new Date(json.start).setHours(startarray[0],startarray[1])/1000.0;

	    	          	// Appending end time to end date 
	    	          	var endarray = (json.end_time).split(":");
	    	          	json.end = new Date(json.end).setHours(endarray[0],endarray[1])/1000.0;
	    	        	
	    	            // For validation
	    	        	if(!isValidRange(json.start, json.end))
	    	                   return;
	    	        	
	    	        	$("#activityModal").modal('hide');
	    	        	
	    	        	$('#activityForm').each (function(){
	    	          	  this.reset();
	    	          	});
	    	        	
	    	        	// Deleting start_time and end_time from json 
	    	        	delete json.start_time;
	    	        	delete json.end_time;	

	    	        	var eventModel = new Backbone.Model();
	    	            eventModel.url = 'core/api/events';
	    	            eventModel.save(json,{
	    	                success: function () {
	    	                	$('#calendar').fullCalendar( 'refetchEvents' );                
	    	                   }
	    	               }); 
	    	        }
	    	    }); //End of Task and Event Validation function
			   
	    		// Date Picker
			    $('#task-date-1').datepicker({
			        format: 'mm-dd-yyyy'
			    });
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
			    $('.timepicker').timepicker({defaultTime: 'current', showMeridian: false, template: 'modal'});
			    
			    
			    // Set the time picker when the modal is shown
			    $('#activityModal').on('show', function () {
			    	$('.timepicker').val(getHHMM());			    	
			    	//$('.timepicker').val("05:30");		    	
			    });
			    
			    // Switch Task and Event: changing color and font-weight
			    $("#task").click(function (e) {
			     	highlightTask();
			     	
			        var	el = $("#taskForm");
			    	agile_type_ahead("task_related_to", el, contacts_typeahead);
			    });
			    $("#event").click( function (e) {
			    	highlightEvent();
			   });
			    
			    // Tasks checked
			    $('.tasks-select').live('change', function(){
			        if($(this).is(':checked')){
			            
			        	// Complete
			        	var taskId = $(this).attr('data');
			        	completeTask(taskId, $(this))
			        }
			    });
});

// Highlight task
function highlightTask(){
    $("#hiddentask").val("task");
    $("#task").css("color", "black");
    $("#event").css("color", "#DD4814");
    $("#relatedtask").css("display", "block");
    $("#relatedEvent").css("display", "none");
}

// Highlight event
function highlightEvent(){
	$("#hiddentask").val("event");
    $("#event").css("color", "black");
	$("#task").css("color", "#DD4814");
	$("#relatedtask").css("display", "none");        
	$("#relatedEvent").css("display", "block");
}

// Validate event(start and end durations) 
function isValidRange(startDate, endDate){
	 if (startDate <= endDate)
		 return true;
	 else
		 return false;		  
}


// Get Hours and Mins for the current time. It will be padded for 15 mins
function getHHMM() {
	
	
	var hours = new Date().getHours();
	var minutes = new Date().getMinutes();
	
    if (minutes % 15 != 0)
     minutes = minutes - (minutes % 15);
    
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    
    return hours + ':' + minutes;
}