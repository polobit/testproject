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
	$('body').on('click', '#task_event_validate', function(e) {
		e.preventDefault();

		console.log(this);
		// Save functionality for task by checking task or not
		if ($("#hiddentask").val() == "task") {

			save_task('taskForm', 'activityTaskModal', false, this);
		} else {

			// Save functionality for event
			save_event('activityForm', 'activityModal', false, this,function(data){
						//	eventCollectionView.collection.comparator ='start';
									eventCollectionView.collection.add(data.toJSON());
									eventCollectionView.collection.sort();
							
			});
		}
	}); // End of Task and Event Validation function

	// Hide event of activity modal
	/**
	 * Removes appended contacts from related-to field of task form and
	 * validation error messages if any.
	 * when timepicker editing it will be return
	 */
	$('#activityTaskModal').on('hidden.bs.modal', function(e) {

		if ($(this).hasClass('in'))
		{
			return;
		}
		// Remove appended contacts from related-to
		$("#taskForm").find("li").remove();

		// Remove validation error messages
		remove_validation_errors('activityTaskModal');
		
		resetForm($("#taskForm"));

		// Removes note from from task form
		$('#taskForm #forNoteForm').html("");

		// Hide + Add note link
		$(".task-add-note", $("#taskForm")).show();
		/*$('#activityTaskModal').find('#new-task-related-contacts-label').parent().removeClass('hide');
		$('#activityTaskModal').find('.new-task-related-contacts-input').addClass('hide');
		$('#activityTaskModal').find('.new-task-related-contacts-label').addClass('hide');
		$('#activityTaskModal').find('#new-task-related-deals-label').parent().removeClass('hide');
		$('#activityTaskModal').find('.new-task-related-deals-input').addClass('hide');
		$('#activityTaskModal').find('.new-task-related-deals-label').addClass('hide');*/
		
	});
	
	/**
	 * Hide end-date & time for all day events.
	 */
	$('body').on('click', '#activityForm #allDay', function(e) {
		
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
	
	$('body').on('click', '#updateActivityForm #allDay', function(e) { 
		
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