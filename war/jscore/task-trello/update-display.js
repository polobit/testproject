// Maintain changes in UI
function displaySettings()
{
	// Creates normal time.
	displayTimeAgo($(".list"));

	$(".listed-task").parent().css('padding-bottom', '5px');

	// Get selected criteria
	var criteria = getCriteria();

	// Change task UI as per group selection
	if (criteria == "CATEGORY")
	{
		// Remove type of task from UI when category filter selected
		$(".task-type").remove();

		// Assign new setting to Owner image
		$(".task-owner").addClass("shift-up");

		// Assign new min height to task
		$(".task-body").addClass("task-body-category");
	}

	if (criteria == "OWNER")
	{
		// Remove owner pic of task from UI when owner filter selected
		$(".task-owner").remove();

		// Assign new min height to task
		$(".task-body").addClass("task-body-owner");
	}
}

// Load and display slider in edit modal of task for progress.
function loadProgressSlider(el)
{
	head.load(CSS_PATH + 'css/jslider.css', LIB_PATH + 'lib/jquery.slider.min.js', function()
	{
		$(".progress_slider", el).slider({ from : 0, to : 100, step : 1, skin : "plastic", onstatechange : function(value)
		{
			$("#progress", el).val(value);
		} });

		$(".progress_slider").slider("value", $("#editTaskForm #progress").val());
	});
}

/*
 * Make changes in UI on status button and add new value to input field of
 * status in task edit modal.
 */
function changeStatus(status,checkProgress)
{
	// Remove btn class from all other status buttons
	$(".status-btn").removeClass("btn");

	// Add btn class to selected status
	$(".status-btn.[value="+status+"]").addClass("btn status-btn txt-mute");

	// Add status to input field
	$("#editTaskForm #status").val(status);
	
	if(checkProgress)
	 {
		if(status == "NOT_STARTED")
			changeProgress(0,false);
		else if(status == "COMPLETED")
			changeProgress(100,false);
		else if(status == "IN_PROGRESS")
			changeProgress(1,false);
	 }	
}

/*
 * Make changes in UI in progress slider and add new value to input field of
 * progress in task edit modal.
 */
function changeProgress(value,checkStatus)
{
	// Add progress 100 to input field
	$("#editTaskForm #progress").val(value);

	// Make changes in progress slider
	$(".progress_slider").slider("value", value);
}

/*
 * After click on is_completed task in task edit modal, make status completed
 * and progress 100%.
 */
function changeStatusProgress(isChecked)
{
	if (isChecked)
	{
		changeStatus("COMPLETED",false);
		changeProgress(100,false);		
	}
}
