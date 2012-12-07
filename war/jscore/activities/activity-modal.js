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

		// Save functionality for task by checking task or not
		if ($("#hiddentask").val() == "task") {

			save_task('taskForm', 'activityModal');
		} else {

			// Save functionality for event
			save_event('activityForm', 'activityModal');
		}
	}); // End of Task and Event Validation function

	// Hide event of activity modal
	/**
	 * Removes appended contacts from related-to field of task form and
	 * validation error messages if any.
	 */
	$('#activityModal').on('hidden', function() {

		// Remove appended contacts from related-to
		$("#taskForm").find("li").remove();

		// Remove validation error messages
		remove_validation_errors('activityModal');
	});
});
