function addDetailsInCookie(elmnt)
{
	console.log("In addDetailsInCookie");
	console.log($(elmnt));

	var name = $(elmnt).html();
	var id = $(elmnt).attr("href");

	var taskField = null;
	var taskFieldValue = null;
	var taskFieldForGroupView = null;
	var taskFieldValueForGroupView = null;

	if ($(elmnt).closest("ul").attr('id') == "new-type-tasks")
	   {
		taskField = "task_criteria";
		taskFieldForGroupView = "task_criteria_forgroupview";
	   }	
	else if ($(elmnt).closest("ul").attr('id') == "new-owner-tasks")
	   {
		taskField = "task_owner";
		taskFieldForGroupView = "task_owner_forgroupview";
	   }		
	
	taskFieldValue = name + "_" + id;
	taskFieldValueForGroupView = name + "_" + id;

	// Creates the cookie
	_agile_set_prefs(taskField, taskFieldValue);
	
	// Save setting for group view	
	if(getCriteria() != "LIST")
		{
		 // Creates the cookie
		 _agile_set_prefs(taskFieldForGroupView, taskFieldValueForGroupView);
		}	
}

function readDetailsFromCookie()
{
	console.log("In readDetailsFromCookie");

	var task_criteria = _agile_get_prefs("task_criteria");
	var task_owner = _agile_get_prefs("task_owner");

	console.log(task_criteria + " " + task_owner);
	
	withoutEventChangeDropDowns(task_criteria, task_owner, undefined);	
}
