// Main Collection
var	TasksListCollection = null;

// Grouping Map After selection from filter/ drop down
var	GroupingMap = { 
		"PRIORITY" : { "type" : ["HIGH", "LOW", "NORMAL"], "searchKey" : "priority_type" }, 
		"CATEGORY" : { "type" : ["EMAIL", "CALL", "SEND", "TWEET", "FOLLOW_UP", "MEETING", "MILESTONE", "OTHER"], "searchKey" : "type" }, 
		"STATUS" : { "type" : ["YET_TO_START", "IN_PROGRESS", "COMPLETED"], "searchKey" : "status" }, 
		"DUE" : { "type" : ["TODAY", "TOMORROW", "OVERDUE", "LATER"], "searchKey" : "due" }, 
		"OWNER" : { "type" : [], "searchKey" : "taskOwner.name" } 
		};

// Status of Task
var YET_TO_START = "YET_TO_START";
var IN_PROGRESS = "IN_PROGRESS";
var COMPLETED = "COMPLETED";

$(function()
{	
	// Get user details and add into GroupingMap's owner array.
	getUserDetails();

	// Display task actions
	$('.listed-task .task-footer').live('mouseenter', function()
	{
		$(this).find(".task-actions").css("display", "block");
	});

	// Hide task actions
	$('.listed-task .task-footer').live('mouseleave', function()
	{
		$(this).find(".task-actions").css("display", "none");
	});

	/*
	 * Task Action: Delete task from UI as well as DB. Need to do this manually
	 * because nested collection can not perform default functions.
	 */
	$('.delete-task').die().live('click', function(event)
	{
		if (!confirm("Are you sure you want to delete?"))
			return;

		// Delete Task.
		deleteTask(getTaskId(this), getTaskListId(this), getTaskListOwnerId(this));
	});

	// Task Action: Mark task complete, make changes in DB.
	$('.is-task-complete').die().live('click', function(event)
	{
		event.preventDefault();

		// make task completed.
		completeTask(getTaskId(this), getTaskListId(this), getTaskListOwnerId(this));
	});

	// Task Action: Open Task Edit Modal and display details in it.
	$('.edit-task, .task-body, .task-due-time').die().live('click', function(event)
	{
		event.preventDefault();

		// Show and Fill details in Task Edit modal
		editTask(getTaskId(this), getTaskListId(this), parseInt(getTaskListOwnerId(this)));
	});

	// Click events to agents dropdown of Owner's list and Criteria's list
	$("ul#owner-tasks li a, ul#type-tasks li a").die().live("click", function(e)
	{
		e.preventDefault();

		// Show selected name
		var name = $(this).html(), id = $(this).attr("href");

		$(this).closest("ul").data("selected_item", id);
		$(this).closest(".btn-group").find(".selected_name").text(name);

		// Get selection from owner's dropdown
		var owner = $('#owner-tasks').data("selected_item");

		// Find array of type's related to criteria in Map
		findDetails(getCriteria(), owner);
	});

	// Change page heading as per owner selection
	$("ul#owner-tasks li a").die().live("click", function()
	{
		// Change page heading
		$('.task-heading').html($(this).html() + '&nbsp<small class="tasks-count"></small>');
	});

	/*
	 * In new/update task modal, on selection of status, show progress slider and change %
	 */
	$(".status").change(function()
	{		
		// Change status UI and input field
		changeStatus($(this).attr("value"), $(this).closest("form"));	
	});	
});
