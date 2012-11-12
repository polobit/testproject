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
	    	        	
	    	        	saveTask('taskForm', 'activityModal');
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
	    
	    // Delete event
	    $('#event_delete').die().live('click', function (e) {
	    		e.preventDefault();
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
	    
	    // Edit task
	    $('#overdue > tr').live('click', function(e){
			e.preventDefault();
			updateTask(this);
	    });	
	    
	    $('#today > tr').live('click', function(e){
			e.preventDefault();
			updateTask(this);
	    });
	    
	    $('#tomorrow > tr').live('click', function(e){
			e.preventDefault();
			updateTask(this);
	    });
	    
	    $('#next-week > tr').live('click', function(e){
			e.preventDefault();
			updateTask(this);
	    });
	    
	    // Update task
	    $('#update_task_validate').click(function (e) {
	    		e.preventDefault();
	    		
	    		saveTask('updateTaskForm', 'updateTaskModal', true);
	    });
	    
	 // Hide event of update task modal
	    $('#updateTaskModal').on('hidden', function () {
	    	  
	    	  // Remove appended contacts from related-to
	    	  $("#updateTaskForm").find("li").remove();
	    });
	    
	 // show event of update task modal
	    $('#updateTaskModal').on('shown', function () {
	    	
	    	// Activate related-to field of update task form 
			var	el = $("#updateTaskForm");
	    	agile_type_ahead("update_task_related_to", el, contacts_typeahead);
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
			    $('.start-timepicker').timepicker({defaultTime: 'current', showMeridian: false, template: 'modal'});
			    
			    $('.end-timepicker').timepicker({defaultTime: 'current', showMeridian: false, template: 'modal'});
			    
			    // Set the time picker when the modal is shown
			    $('#activityModal').on('shown', function () {
			    	
			    	// Fill current time only when there is no time in the fields
			    	if($('.start-timepicker').val() == '')
			    		$('.start-timepicker').val(getHHMM());
			    	
			    	if($('.end-timepicker').val() == '')
			    		$('.end-timepicker').val(getHHMM());
			    	
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
         $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">�</a>Start date should not be greater than end date. Please change.</div>');

		 return false;
	 }	 
	 else if(startTime[0] > endTime[0]){
         $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">�</a>Start time should not be greater than end time. Please change.</div>');

		 return false;	 
	}
	else if(startTime[0] == endTime[0] && startTime[1] >= endTime[1]){
        $("#activityModal").find(".invalid-range").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">�</a>Start time should not be greater or equal to end time. Please change.</div>');

		 return false;
	} 
	else
		return true;
}

// Save Task
function saveTask(formId, modalId, isUpdate){
	if (!isValidForm('#' + formId))
    	return false;
	
	// Show loading symbol until model get saved
    $('#' + modalId).find('span.save-status').html(LOADING_HTML);
    
   	var json = serializeForm(formId);
   	if(!isUpdate)
   		json.due = new Date(json.due).getTime()/1000.0;
	
	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(json,{
		success: function(data){
			$('#' + formId).each (function(){
	          	  this.reset();
	          	});
			
			$('#' + modalId).find('span.save-status img').remove();
	        $('#' + modalId).modal('hide');
		    
   	        var task = data.toJSON();
   	        if(Current_Route == 'calendar'){
   	        	if(isUpdate)
   	        		App_Calendar.tasksListView.collection.remove(json);
   	        	
    	        // Update task list view 
	        	App_Calendar.tasksListView.collection.add(data);
	        	App_Calendar.tasksListView.render(true);
	        }
   	        // Update data to temeline 
   	        else if(App_Contacts.contactDetailView){
				$.each(task.contacts, function(index, contact){
					if(contact.id == App_Contacts.contactDetailView.model.get('id')){
						
						// Activate timeline in contact detail tab and tab content
						activateTimelineTab();
						
						$('#timeline').isotope( 'insert', $(getTemplate("timeline", data.toJSON())) );
						
						// Add task to tasks collection in contact detail tabs
						/*if(TASKSVIEW){
							TASKSVIEW.collection.add(data);
							TASKSVIEW.render(true);
						}*/
						return false;
					}	

				});
				if(Current_Route != "contact/" + App_Contacts.contactDetailView.model.get('id')){
					App_Calendar.navigate("calendar", {
    	        		trigger: true
    	        	});
				}
   	        }else{
	        	App_Calendar.navigate("calendar", {
	        		trigger: true
	        	});
	        }
		} 
	});
}

function updateTask(ele){
	deserializeForm($(ele).data().toJSON(), $("#updateTaskForm"));
	
	$("#updateTaskModal").modal('show');
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

        //	$('#calendar').fullCalendar( 'refetchEvents' );
        	
        	$('#calendar').fullCalendar( 'renderEvent', data.toJSON() );
        	
        	App_Calendar.navigate("calendar", {
				trigger: true
			});
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