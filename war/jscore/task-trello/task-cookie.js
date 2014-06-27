function addDetailsInCookie(elmnt)
{
	console.log("In addDetailsInCookie");

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

	console.log(task_criteria+" "+task_owner);
	
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
	
	// Change heading of page
	changeHeadingOfPage($('#new-owner-tasks').closest(".btn-group").find(".selected_name").html());
	
	// Get details from dropdown and call function to create collection
	getDetailsForCollection();
}
