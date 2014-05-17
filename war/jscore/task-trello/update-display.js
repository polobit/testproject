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
function loadProgressSlider(el)
{	
	head.load(CSS_PATH + 'css/jslider.css', LIB_PATH + 'lib/jquery.slider.min.js', function()
	{
		$(".progress_slider", el).slider({ from : 0, to : 100, step : 1, skin : "round", onstatechange : function(value)
		{		
			changeProgress(value, $(".status", el).attr("value"), el);
		} });
	});
}

/*
 * Make changes in UI on status button and add new value to input field of
 * status in task edit modal.
 */
function changeStatus(status, parentForm)
{
	var value;

	if (status == YET_TO_START)
		value = 0;
	else if (status == COMPLETED)
		value = 100;
	else if (status == IN_PROGRESS)
		value = 1;

	changeProgress(value, status, parentForm);
}

/*
 * Make changes in UI in progress slider and add new value to input field of
 * progress in task edit modal.
 */
function changeProgress(value, status, parentForm)
{
	// Add progress % to input field
	$("#progress", parentForm).val(value);

	// Show slider for progress
	showProgressSlider(value, status, parentForm);
}

/*
 * Make changes in UI on status selection and display progress slider in task
 * update modal.
 */
function showProgressSlider(value, status, parentForm)
{
	if (value == 100 || status == COMPLETED)
	{		
		$(".status", parentForm).val(COMPLETED);
		$("#progress", parentForm).val(100);
		$("#is_complete", parentForm).val(true);
	}
	else
		$("#is_complete", parentForm).val(false);

	if (status == "IN_PROGRESS")
		$(parentForm).find(".progress-slider").css("display", "block");	
	else
		$(parentForm).find(".progress-slider").css("display", "none");
}

function resetForm(formToReset)
{
	$('#progress', formToReset).val(0);
	$('#is_complete', formToReset).val(false);
	$('#priority_type', formToReset).val("NORMAL");
	$('#status', formToReset).val(YET_TO_START);
	$(".progress_slider", formToReset).slider("value", 0);
}

/*
 * After loading update task modal check is_completed is true or false, is it is
 * true so change status and progress, make status completed and progress 100%.
 */
function setForm(formToSet)
{
	var isComplete = $("#is_complete", formToSet).val();

	if (isComplete == "true")
	{
		// Show slider for progress
		showProgressSlider(100, COMPLETED, formToSet);
	}
	else
	{
		// Show slider for progress
		showProgressSlider($('#progress', formToSet).val(), $('#status', formToSet).val(), formToSet);

		$(".progress_slider", formToSet).slider("value", $('#progress', formToSet).val());
	}
}
