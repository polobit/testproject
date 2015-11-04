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

	$("#activityTaskModal,#activityModal").on("click", "#activityForm #allDay, #updateActivityForm #allDay", function(e){

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

	/**
	 * Saves the content of activity modal by verifying whether it is a task or
	 * event
	 */
	$("#activityTaskModal,#activityModal").on('click', '#task_event_validate', function(e) {
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

});