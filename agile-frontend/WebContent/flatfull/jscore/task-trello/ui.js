// Main Collection
var TASKS_LIST_COLLECTION = null;

// Grouping Map After selection from filter/ drop down
var GROUPING_MAP = { 
		"PRIORITY" : { "type" : ["HIGH", "NORMAL", "LOW"], "searchKey" : "priority_type" }, 
		"CATEGORY" : { "type" : ["CALL","EMAIL","FOLLOW_UP","MEETING", "MILESTONE","OTHER","SEND","TWEET"], "searchKey" : "type" }, 
        "STATUS" : { "type" : ["YET_TO_START", "IN_PROGRESS", "COMPLETED"], "searchKey" : "status" }, 
        "DUE" : { "type" : ["OVERDUE", "TODAY", "TOMORROW", "LATER"], "searchKey" : "due" }, 
        "OWNER" : { "type" : [], "searchKey" : "taskOwner.name" } };

// Status of Task
var YET_TO_START = "YET_TO_START";
var IN_PROGRESS = "IN_PROGRESS";
var COMPLETED = "COMPLETED";

var flag = true;

var FETCH_COUNTER = 0;
var IS_FECHING_DONE = false;

$(function()
{	
	$(document).ready(function() {
		// Adjust Height Of Task List And Scroll as per window size
	    adjustHeightOfTaskListAndScroll();
	});

	// for the window resize
	$(window).resize(function() {
		// Adjust Height Of Task List And Scroll as per window size
		adjustHeightOfTaskListAndScroll();
	});	
	
	// Display task actions
	$('.listed-task').live('mouseenter', function()
	{
		$(this).find(".task-actions").css("display", "block");
		$(this).find(".task-note-action").hide();
	});

	// Hide task actions
	$('.listed-task').live('mouseleave', function()
	{
		$(this).find(".task-actions").css("display", "none");
		$(this).find(".task-note-action").show();
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
	$('.edit-task').die().live('click', function(event)
	{
		event.preventDefault();

		// Show and Fill details in Task Edit modal
		editTask(getTaskId(this), getTaskListId(this), parseInt(getTaskListOwnerId(this)));
	});
	
	// Click events to agents dropdown of Owner's list and Criteria's list
	/*$("ul#new-owner-tasks li a, ul#new-type-tasks li a").die().live("click", function(e)
	{
		e.preventDefault();			
		
		// Hide list view and show column view with loading img
		hideListViewAndShowLoading();		
		
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
		
		//Add selected details of dropdown in cookie
		addDetailsInCookie(this);
		
		setTimeout(function() { // Do something after 2 seconds
			// Get details from dropdown and call function to create collection
			getDetailsForCollection();
		}, 2000);
	});

	// Change page heading as per owner selection
	$("ul#new-owner-tasks li a").die().live("click", function()
	{		
		// Change heading of page
		changeHeadingOfPage($('#new-owner-tasks').closest(".btn-group").find(".selected_name").html());
	});*/

	/*
	 * In new/update task modal, on selection of status, show progress slider
	 * and change %
	 */
	$(".status").change(function()
	{
		console.log("status change event");
		
		// Change status UI and input field
		changeStatus($(this).attr("value"), $(this).closest("form"));
	});	
	
	$(".group-view").die().live('click', function(event)
	{
		event.preventDefault();
		console.log("group-view event");
				
		// Change UI and input field
		applyDetailsFromGroupView();
	});	
});
