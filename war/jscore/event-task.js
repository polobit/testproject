// UI Handlers for activities - event & task
$(function(){ 
		
    
    	// Show activity modal
		$('#show-activity').live('click', function (e) {
			e.preventDefault();
			highlightEvent();
			$("#activityModal").modal('show');
		});
	
		// Save task & event - Rammohan 03-08-2012
	    $('#task_event_validate').die().live('click', function (e) {
	    	        e.preventDefault();
	    	       
	    	        // Save functionality for task by checking task or not
	    	        if ($("#hiddentask").val() == "task") { 
	    	        	if (!isValidForm('#taskForm'))
	    		        	return false;
	    	        	
	    	        	// Show loading symbol until model get saved
	    	            $('#activityModal').find('span.save-status').html(LOADING_HTML);
	    	            
    	   	        	var json = serializeForm("taskForm");
	    	        	json.due = new Date(json.due).getTime()/1000.0;
	    	        	
	    	        	console.log(JSON.stringify(json));
	    	        	var newTask = new Backbone.Model();
	    	        	newTask.url = 'core/api/tasks';
	    	        	newTask.save(json,{
	    	        		success: function(data){
	    	        			$('#taskForm').each (function(){
	    		    	          	  this.reset();
	    		    	          	});
	    	        			
	    	        			$('#activityModal').find('span.save-status img').remove();
	    		    	        $("#activityModal").modal('hide');
	    	        			
	    	        			App_Settings.navigate("calendar", {
	    	        				trigger: true
	    	        			});
	    	        		} 
	    	        	});
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
			    	e.preventDefault();
			    	highlightTask();
			     	
			        var	el = $("#taskForm");
			    	agile_type_ahead("task_related_to", el, contacts_typeahead);
			    });
			    $("#event").click( function (e) {
			    	e.preventDefault();
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
			    $('#activityModal').on('hidden', function () {
			    	  
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
function isValidRange(startDate, endDate, startTime, endTime){
	 if(endDate-startDate >= 86400000){
		 return true;
	 }
	 else if (startDate > endDate){
         $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">×</a>Start date should not be greater than end date. Please change.</div>');

		 return false;
	 }	 
	 else if(startTime[0] > endTime[0]){
         $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">×</a>Start time should not be greater than end time. Please change.</div>');

		 return false;	 
	}
	else if(startTime[0] == endTime[0] && startTime[1] >= endTime[1]){
        $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">×</a>Start time should not be greater or equal to end time. Please change.</div>');

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
        success: function () {
        	
        	$('#' + formId).each (function(){
          	  this.reset();
          	});
        	
			$('#' + modalName).find('span.save-status img').remove();
        	$('#' + modalName).modal('hide');

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