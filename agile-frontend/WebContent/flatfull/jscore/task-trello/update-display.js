// Maintain changes in UI
function displaySettings()
{
	// Creates normal time.
	displayTimeAgo($(".task-trello-list"));

	$(".listed-task").parent().addClass("task-striped");

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
function loadProgressSlider(el, callback)
{
	head.load(LIB_PATH + 'lib/jquery.slider.min.js', function()
	{
		$(".progress_slider", el).slider({ 
			from : 0, 
			to : 100, 
			step : 1, 
			skin : "round", 
			onstatechange : function(value){
				changeProgress(value, $(".status", el).val(), el);
			}
		});

		if(callback)
			  callback(el);
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
	if (value == 100 || status == COMPLETED){
		$(".status", parentForm).val(COMPLETED);
		$("#progress", parentForm).val(100);
		$("#is_complete", parentForm).val(true);
	}else{
		$("#is_complete", parentForm).val(false);
	}

	if (status == IN_PROGRESS){
		$(parentForm).find(".progress-slider").css("display", "block");
		if($(parentForm).find(".jslider-label-to").is(':visible'))
			$(parentForm).find(".jslider-label-to").hide();
	}else{
		$(parentForm).find(".progress-slider").css("display", "none");
	}
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
		// loadProgressSlider(formToSet, function(formToSet){
				// Show slider for progress
				showProgressSlider(100, COMPLETED, formToSet);
		// });
	}
	else
	{
		// loadProgressSlider(formToSet, function(formToSet){

			// Show slider for progress
			showProgressSlider($('#progress', formToSet).val(), $('#status', formToSet).val(), formToSet);

			$(".progress_slider", formToSet).slider("value", $('#progress', formToSet).val());

		// });

		
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

/**
 * Hide task in list view and display column view with loading img. 
 */
function hideListViewAndShowLoading()
{	
	// Hide list view and show column view
	$('#new-task-list-based-condition').show();
	$('#task-list-based-condition').hide();
	$('.tasks-count').html("");
	
	// Shows loading image untill data gets ready for displaying
	$('#new-task-list-based-condition').html(LOADING_HTML);	
}

/**
 * Display task in list view with selected filter. 
 */
function displayListView()
{
	console.log("in displayListView");
	$('#new-task-list-based-condition').hide();
	$('#task-list-based-condition').show();
	
	// Display group view
	$(".group-view").show();
	
	// Hide group by
	$(".do-onclick-nothing").hide();
	
	// Hide list view
	$(".list-view").hide();
	
	var url = getParamsNew();
	
	// When user hit list view first time and my pending is selected as default one, we have to set pending true.
	var owner = $('#new-owner-tasks').data("selected_item");
	if(owner == undefined)
		url = url  + "&pending=" + true;
	
	console.log("url for list view: "+url);	
	
	updateData(url);
}

//
function bindDropdownEvents()
{
	$('.dropdown-menu').find(".do-onclick-nothing").on("click",function(e)
	 {
	    e.stopImmediatePropagation();
	 });
	
	// Click events to agents dropdown of Owner's list and Criteria's list
	$("ul#new-owner-tasks li a,ul#new-type-tasks .new-type-task").on("click", function(e)
	{        
		e.preventDefault();			
				
		// Hide list view and show column view with loading img
		hideListViewAndShowLoading();		
		
		// Hide dropdown
		if($(".type-task-button").hasClass("open"))
			$(".type-task-button").removeClass("open");
		
		// Show selected name
		var name = $(this).html(), id = $(this).attr("href");
		
		var selectedDropDown = $(this).closest("ul").attr("id");
				
		if(selectedDropDown == "new-type-tasks") // criteria type
		    $(this).closest("ul.main-menu").data("selected_item", id);
		else  // owner type
			$(this).closest("ul").data("selected_item", id);
		
		$(this).closest(".btn-group").find(".selected_name").text(name);

		// Empty collection
		if(TASKS_LIST_COLLECTION != null)
		TASKS_LIST_COLLECTION.collection.reset();
		
		// Add selected details of dropdown in cookie
		addDetailsInCookie(this);
				
		setTimeout(function() { // Do something after 2 seconds
			// Get details from dropdown and call function to create collection
			getDetailsForCollection();
		}, 2000);
	});

	// Change page heading as per owner selection
	$("ul#new-owner-tasks li a").on("click", function()
	{		
		// Change heading of page
		changeHeadingOfPage($('#new-owner-tasks').closest(".btn-group").find(".selected_name").html());
	});	
}

// Change UI and input field 
function applyDetailsFromGroupView()
{
	console.log("In applyDetailsFromGroupView");
	
	var task_criteria_forgroupview = _agile_get_prefs("task_criteria_forgroupview");
	var task_owner_forgroupview = _agile_get_prefs("task_owner_forgroupview");

	console.log(task_criteria_forgroupview + " " + task_owner_forgroupview);
			
	withoutEventChangeDropDowns(task_criteria_forgroupview, task_owner_forgroupview, true);	

	// Hide group view
	$(".group-view").hide();
	
	// Display group by
	$(".do-onclick-nothing").show();
	
	// Display list view
	$(".list-view").show();
	
	var ownerType = $('#new-owner-tasks').data("selected_item");
	
	// Add owner type in cookie
	addDetailsInCookie($("ul#new-owner-tasks").find('a[href='+ownerType+']'));
	
	// Add task type in cookie
	addDetailsInCookie($("ul#new-type-tasks").find('a[href='+getCriteria()+']'));
}

//
function withoutEventChangeDropDowns(task_criteria, task_owner, apply_groupview)
{
	console.log("In withoutEventChangeDropDowns");
	console.log(task_criteria + " " + task_owner);	
	
	if (task_criteria)
	{
		var res = task_criteria.split("_");

		console.log(res);

		$('#new-type-tasks').data("selected_item", res[1]);
		$('#new-type-tasks').closest(".btn-group").find(".selected_name").text(res[0]);
	}

	if (task_owner)
	{
		var res = task_owner.split("_")

		console.log(res);

		$('#new-owner-tasks').data("selected_item", res[1]);
		$('#new-owner-tasks').closest(".btn-group").find(".selected_name").text(res[0]);
	}

	if(!task_criteria && !task_owner && apply_groupview)
	  {
		// Type of task
		$('#new-type-tasks').data("selected_item", "DUE");
		$('#new-type-tasks').closest(".btn-group").find(".selected_name").text("Due");		
	  }
	
	// Change heading of page
	changeHeadingOfPage($('#new-owner-tasks').closest(".btn-group").find(".selected_name").html());

	// Get details from dropdown and call function to create collection
	getDetailsForCollection();
}

//Add details about task list where add task btn is clicked
function addTasklListDetails(addTaskElement)
{
	console.log("In addTasklListDetails");
	console.log(addTaskElement);	
	
	if(!$(addTaskElement).hasClass("list-bottom"))
		return;	
	
	switch (getCriteria()) {
	case "STATUS":
	{ 
		$("#status", $("#taskForm")).val($(addTaskElement).attr("heading"));
		changeStatus($(addTaskElement).attr("heading"), $("#taskForm"));
	}
		break;	
	case "CATEGORY":
	{$("#type", $("#taskForm")).val($(addTaskElement).attr("heading"));}
		break;
	case "OWNER":
	{$("#owners-list", $("#taskForm")).val($(addTaskElement).attr("ownerID"));}
		break;
	case "DUE":
	{		
		var epochTime = getNewDueDate($(addTaskElement).attr("heading"));
		var startDate = getDateInFormatFromEpoc(epochTime);
		$("#taskForm").find("input.date").val(startDate);
		// .datepicker('update');		
	}
		break;		
	case "PRIORITY":
	{$("#priority_type", $("#taskForm")).val($(addTaskElement).attr("heading"));}
		break;	
	}	
}