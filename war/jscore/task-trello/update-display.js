// Maintain changes in UI
function displaySettings()
{
	// Creates normal time.
	displayTimeAgo($(".task-trello-list"));

	$(".listed-task").parent().css('padding-bottom', '5px');

	// Get selected criteria
	var criteria = getCriteria();

	// Change task UI as per group selection
	if (criteria == "CATEGORY")
	{
		// Remove type of task from UI when category filter selected
		$(".new-task-type").remove();

		// Assign new setting to Owner image
		$(".new-task-owner").addClass("shift-up");

		// Assign new min height to task
		$(".task-body").addClass("task-body-category");
	}

	if (criteria == "OWNER")
	{
		// Remove owner pic of task from UI when owner filter selected
		$(".new-task-owner").remove();

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

// Change Page heading as per selection of owner criteria
function changeHeadingOfPage(heading)
{
	// Change page heading
	$('#new-task-heading').html(heading + '&nbsp<small class="tasks-count"></small>');
}

/*
 * Remove Loading Icon from task list which is just loaded.
 */
function removeLoadingIcon(target)
{
	// Hide loading icon in same task list
	if (target.owner_id)
		$("img[id='task-list-loading-img-" + target.heading + "-" + target.owner_id + "']").hide();
	else
		$("img[id='task-list-loading-img-" + target.heading + "-']").hide();
}

/*
 * Display Task Count from task list in task list header.
 */
function addTaskCount(target)
{
	if (!target.taskCollection)
		return;

	var targetModel = target.taskCollection.at(0);
	console.log(targetModel);

	if (!targetModel)
		return;

	var count = targetModel.get("count");

	// Display task count in header of task list.
	displayTaskCount(count, target.heading, target.owner_id);
}

// Display task count in header of task list.
function displayTaskCount(count, heading, owner_id)
{
	if (count == 0)
		count = "";

	if (owner_id)
	{
		$("span[id='task-count-" + heading + "-" + owner_id + "']").html(count);
		$("span[id='task-count-" + heading + "-" + owner_id + "']").attr("count", count);
	}

	else
	{
		$("span[id='task-count-" + heading + "-']").html(count);
		$("span[id='task-count-" + heading + "-']").attr("count", count);
	}
}

/*
 * Change Task Count from task list in task list header after drag-drop, delete
 * or add task.
 */
function changeTaskCount(target, increased)
{
	var targetModel = target.taskCollection.at(0);
	console.log(targetModel);

	if (!targetModel)
		return;

	var count = null;

	// Get task count from header of task list.
	if (target.owner_id)
		count = $("span[id='task-count-" + target.heading + "-" + target.owner_id + "']").attr("count");
	else
		count = $("span[id='task-count-" + target.heading + "-']").attr("count");

	if (count != null)
	{
		console.log(count);
		if (increased)
			count++;
		else
			count--;
	}
	else
		count = 1;

	// Display task count in header of task list.
	displayTaskCount(count, target.heading, target.owner_id);
}

// Make drop down intelligent and return Pending value task to fetch or not
function dropdownintelligence()
{
	// As per selected criteria change owner dropdown's options
	changesOnCriteria();

	// As per selected owner change criteria dropdown's options
	return changesOnOwner();
}

// As per selected criteria change owner dropdown's options
function changesOnCriteria()
{
	var criteria = getCriteria();

	if (criteria == "OWNER")
	{
		// Hide pending task selection options from dropdown
		$(".hide-on-status").show();
		// $(".hide-on-owner").hide();
	}
	else if (criteria == "STATUS")
	{
		// Hide pending task selection options from dropdown
		$(".hide-on-owner").show();
		$(".hide-on-status").hide();
	}
	else
	{
		// show pending task selection options from dropdown
		$(".hide-on-status").show();
		$(".hide-on-owner").show();
	}
}

// As per selected owner change criteria dropdown's options
function changesOnOwner()
{
	// Get selection from owner's dropdown
	var owner = $('#new-owner-tasks').data("selected_item");

	if (owner == "all-pending-tasks")
	{
		// Show owner and status
		$(".hide-on-pending").show();

		// Hide status task selection options from dropdown
		$(".hide-on-all-pending").hide();

		return true;
	}
	else if (owner == "my-pending-tasks" || owner == undefined)
	{
		// Hide owner's and status task selection options from dropdown
		$(".hide-on-pending").hide();

		changeCriteriaToCategory();

		return true;
	}
	else if (owner == CURRENT_DOMAIN_USER.id) // My task
	{
		// Show owner's and status task selection options from dropdown
		$(".hide-on-pending").show();
		$(".hide-on-my-task").hide();

		changeCriteriaToCategory();

		return false;
	}
	else
	// All task
	{
		// Show owner's and status task selection options from dropdown
		$(".hide-on-pending").show();

		return false;
	}
}

// On selection of
function changeCriteriaToCategory()
{
	var criteria = getCriteria();

	if (criteria != "OWNER")
		return;

	$("#new-type-tasks").data("selected_item", "CATEGORY");
	$("#new-type-tasks").closest(".btn-group").find(".selected_name").text("Category");
}

// Adjust Height Of Task List And Scroll as per window size
function adjustHeightOfTaskListAndScroll()
{
	var bodyheight = $(window).height();

	$("#new-task-list-based-condition").height(bodyheight - 155);
	$(".list-tasks").css('max-height', bodyheight - 245);
}
