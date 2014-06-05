// UI Handlers for activities - event & task
/**
 * activity-modal.js is a script file to deal with common UI Handlers for
 * activities - event & task from client side.
 * 
 * @module Activities  
 * 
 * author: Rammohan
 */
$(function() {

	/**
	 * Saves the content of activity modal by verifying whether it is a task or
	 * event
	 */
	$('#task_event_validate').die().live('click', function(e) {
		e.preventDefault();

		console.log(this);
		// Save functionality for task by checking task or not
		if ($("#hiddentask").val() == "task") {

			save_task('taskForm', 'activityModal', false, this);
		} else {

			// Save functionality for event
			save_event('activityForm', 'activityModal', false, this);
		}
	}); // End of Task and Event Validation function

	// Hide event of activity modal
	/**
	 * Removes appended contacts from related-to field of task form and
	 * validation error messages if any.
	 */
	$('#activityModal').on('hidden', function(e) {

		// Remove appended contacts from related-to
		$("#taskForm").find("li").remove();

		// Remove validation error messages
		remove_validation_errors('activityModal');
		
		
		if(e.target.id=='activityModal')
		{
			$('#activityForm #allDay').removeAttr('checked');
			$('#activityForm #event-time-1').closest('.control-group').show();
			$('#activityForm #event-date-2').closest('.row').show(); // only of modal, no inside modal
		}
		
	});
	
	/**
	 * Hide end-date & time for all day events.
	 */
	$('#activityForm #allDay').live('click',function(e){
		
		if($(this).is(':checked'))
		{	
			$('#activityForm #event-time-1').closest('.control-group').hide();
			$('#activityForm #event-date-2').closest('.row').hide();
		}
		else 
		{
			$('#activityForm #event-time-1').closest('.control-group').show();
			$('#activityForm #event-date-2').closest('.row').show();
		}
	});
	
	$('#updateActivityForm #allDay').live('click',function(e){
		
		if($(this).is(':checked'))
		{
			$('#updateActivityForm #update-event-time-1').closest('.control-group').hide();
			$('#updateActivityForm #update-event-date-2').closest('.row').hide();
		}
		else 
		{
			$('#updateActivityForm #update-event-time-1').closest('.control-group').show();
			$('#updateActivityForm #update-event-date-2').closest('.row').show();
		}
	});
});