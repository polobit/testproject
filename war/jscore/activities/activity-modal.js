// UI Handlers for activities - event & task
$(function() {

	// Save task & event - Rammohan 03-08-2012
	$('#task_event_validate').die().live('click', function(e) {
		e.preventDefault();

		// Save functionality for task by checking task or not
		if ($("#hiddentask").val() == "task") {

			saveTask('taskForm', 'activityModal');
		} else {
			
			// Save functionality for event
			saveEvent('activityForm', 'activityModal');
		}
	}); // End of Task and Event Validation function

	// Hide event of activity modal
	$('#activityModal').on('hidden', function() {

		// Remove appended contacts from related-to
		$("#taskForm").find("li").remove();

		// Remove validation error messages
		removeValidationErrors('activityModal');
	});
});
