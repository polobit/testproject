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
	
});
