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

// Load and display slider in update task modal of task for progress.
function loadProgressSlider(el, callback)
{
	console.log("in loadProgressSlider");
	head.load(CSS_PATH + 'css/jslider.css', LIB_PATH + 'lib/jquery.slider.min.js', function()
	{
		$(".progress_slider", el).slider({ from : 0, to : 100, step : 1, skin : "plastic", onstatechange : function(value)
		{
			changeProgress(value, true, el);
		} });

		if (callback && typeof (callback) === "function")
		{
			// execute the callback
			callback();
		}
	});
}

/*
 * Make changes in UI on status button and add new value to input field of
 * status in task edit modal.
 */
function changeStatus(status, checkProgress, parentForm)
{
	var value = $("#progress", parentForm).val();

	// Remove btn class from all other status buttons
	$(".status-btn", parentForm).removeClass("btn");

	// Add btn class to selected status
	$(".status-btn.[value=" + status + "]", parentForm).addClass("btn status-btn txt-mute");

	// Add status to input field
	$("#status", parentForm).val(status);

	if (checkProgress)
	{
		if (status == "NOT_STARTED")
			value = 0;
		else if (status == "COMPLETED")
			value = 100;
		else if (status == "IN_PROGRESS")
		{
			// if progress has some % already then do not need to set 1%.
			if (value >= 1 && value < 100)
				return;
			
			// if progress has 0%/100% then need to set 1%.
			value = 1;
		}
		changeProgress(value, false, parentForm);
	}
}

/*
 * Make changes in UI in progress slider and add new value to input field of
 * progress in task edit modal.
 */
function changeProgress(value, checkStatus, parentForm)
{
	// Add progress 100 to input field
	$("#progress", parentForm).val(value);

	// Make changes in status buttons
	if (checkStatus)
	{
		// if status is paused then do not make changes in status buttons.
		if ($("#status", parentForm).val() == "PAUSED")
			return;

		if (value == 0)
			changeStatus("NOT_STARTED", false, parentForm);
		else if (value == 100)
			changeStatus("COMPLETED", false, parentForm);
		else if (value >= 1 && value < 100)
			changeStatus("IN_PROGRESS", false, parentForm);
	}
	else
		// Make changes in progress slider
		$(".progress_slider", parentForm).slider("value", value);
}

/*
 * After loading update task modal check is_completed is true or false, is it is
 * true so change status and progress, make status completed and progress 100%
 * as well as is_complete false. so in future we can remove is_complete.
 */
function checkIsComplete(el)
{
	var isComplete = $("#is_complete", el).val();

	if (isComplete == "true")
	{
		console.log("complete is true");
		changeStatus("COMPLETED", true, el);
		$("#is_complete", el).val(false);
	}
}
