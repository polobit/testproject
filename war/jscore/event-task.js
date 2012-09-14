// UI Handlers for activities - event & task
$(function(){ 
		
    
    	// Show activity modal
		$('#show-activity').live('click', function (e) {
			e.preventDefault();
			highlightEvent();
			$("#activityModal").modal('show');
			//cloneActivityModal();
		});
	
		// Save task & event - Rammohan 03-08-2012
	    $('#task_event_validate').die().live('click', function (e) {
	    	        e.preventDefault();
	    	       
	    	        // Save functionality for task by checking task or not
	    	        if ($("#hiddentask").val() == "task") { 
	    	        	if (!isValidForm('#taskForm'))
	    		        	return false;
	    	        	
    	   	        	var json = serializeForm("taskForm");
	    	        	json.due = new Date(json.due).getTime()/1000.0;
	    	        	$('#taskForm').each (function(){
	    	          	  this.reset();
	    	          	});
	    	        	$("#activityModal").modal('hide');
	    	        	var newTask = new Backbone.Model();
	    	        	newTask.url = 'core/api/tasks';
	    	        	newTask.save(json); 
	    	        }
	    	        else
	    	        { 
	    	        	// Save functionality for event
	    	        	saveEvent('activityForm', 'activityModal');
	    	        }
	    	    }); //End of Task and Event Validation function
	   
	    // Update event
	    $('#update_event_validate').die().live('click', function (e) {
	    		e.preventDefault();
	    		
	    		saveEvent('updateActivityForm', 'updateActivityModal');
	    });
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
			    
			    // Hide event of activity modal
			    $('#activityModal').on('hide', function () {
			    	  
			    	  // Remove appended contacts from related-to
			    	  $("#taskForm").find("li").remove();
			    });
});

// Highlight task
function highlightTask(){
    $("#hiddentask").val("task");
    $("#task").css("color", "black");
    $("#event").css("color", "#DD4814");
    $("#relatedEvent").css("display", "none");
    $("#relatedTask").css("display", "block");
}

// Highlight event
function highlightEvent(){
	$("#hiddentask").val("event");
    $("#event").css("color", "black");
	$("#task").css("color", "#DD4814");
	$("#relatedTask").css("display", "none");        
	$("#relatedEvent").css("display", "block");
}

// Validate event(start and end durations) 
function isValidRange(startDate, endDate){
	 if (startDate <= endDate)
		 return true;
	 else
		 return false;		  
}

// Save event
function saveEvent(formId, modalName, isUpdate){
	// Save functionality for event
	if (!isValidForm('#' + formId))
    	return false;
	var json = serializeForm(formId);
	
  	// Appending start time to start date 
  	var startarray = (json.start_time).split(":"); 	
   	json.start = new Date(json.start).setHours(startarray[0],startarray[1])/1000.0;

  	// Appending end time to end date 
  	var endarray = (json.end_time).split(":");
  	json.end = new Date(json.end).setHours(endarray[0],endarray[1])/1000.0;
	
    // For validation
	if(!isValidRange(json.start, json.end))
           return;
	
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
        success: function () {
        	$('#calendar').fullCalendar( 'refetchEvents' );                
           }
       });
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