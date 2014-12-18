function addDetailsInCookie(elmnt)
{
	console.log("In addDetailsInCookie");
	console.log($(elmnt));

	var name = $(elmnt).html();
	var id = $(elmnt).attr("href");

	var taskField = null;
	var taskFieldValue = null;

	if ($(elmnt).closest("ul").attr('id') == "new-type-tasks")
		taskField = "task_criteria";
	else if ($(elmnt).closest("ul").attr('id') == "new-owner-tasks")
		taskField = "task_owner";

	taskFieldValue = name + "_" + id;

	// Creates the cookie
	createCookie(taskField, taskFieldValue);
}

function readDetailsFromCookie()
{
	console.log("In readDetailsFromCookie");

	var task_criteria = readCookie("task_criteria");
	var task_owner = readCookie("task_owner");

	console.log(task_criteria + " " + task_owner);
	
	withoutEventChangeDropDowns(task_criteria, task_owner, undefined);	
}
