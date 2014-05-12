// Get user's name and id to add in urlMap for owner of task, user name can
// be redundant so we need user's id too.
function getUserDetails()
{
	$.getJSON('/core/api/users', function(users)
	{
		for ( var i in users)
		{
			urlMap.OWNER.type[i] = { "name" : users[i].name, "id" : users[i].id };
		}
	}).error(function(data)
	{
		console.log("get user err");
		console.log(data);
	});

}

// Gives heading of task list from due of task
function getHeadingForDueTask(task)
{
	var headingToSearch = null;

	// add to the right task list - overdue, today, tomorrow etc.
	var due = get_due(task.due);

	// OVERDUE
	if (due < 0)
		return headingToSearch = "OVERDUE";

	// Today
	if (due == 0)
		return headingToSearch = "TODAY";

	// Tomorrow
	if (due == 1)
		return headingToSearch = "TOMORROW";

	// Next Week
	if (due > 1)
		return headingToSearch = "LATER";
}

// As per new task list get new due date for task, after task drop
function getNewDueDate(newTaskListId)
{
	var d = new Date();

	// OVERDUE (yesterday)
	if (newTaskListId == "OVERDUE")
		d.setDate(d.getDate() - 1);

	// Today
	if (newTaskListId == "TODAY")
		console.log(getGMTTimeFromDate(d) / 1000);

	// Tomorrow
	if (newTaskListId == "TOMORROW")
		d.setDate(d.getDate() + 1);

	// Later Day after tomorrow
	if (newTaskListId == "LATER")
		d.setDate(d.getDate() + 2);

	return (getGMTTimeFromDate(d) / 1000);
}

// On basis of status return progress value, when criteria is status and task is
// dragged in task lists.
function getProgressValue(status)
{
	if (status == "YET_TO_START")
		return 0;
	else if (status == "COMPLETED")
		return 100;
	else if (status == "IN_PROGRESS")
		return 1;
}

// Get Task id from UI
function getTaskId(element)
{
	if ($(element).hasClass('task-body'))
		return $(element).parent().attr('id');
	else
		return $(element).attr('data');
}

// Get heading of task list
function getTaskListId(element)
{
	return $(element).closest('.list').attr('id');
}

/*
 * Get owner's id when heading of task list is Owner's name, name can be
 * duplicate so get owner's Id.
 */
function getTaskListOwnerId(element)
{
	return $(element).closest('.list').find('.list-header').attr('ownerID');
}

// Get Criteria from dropdown
function getCriteria()
{
	// Get selection from criteria dropdown
	var criteria = $('#type-tasks').data("selected_item");

	// If criteria is not selected then make it default one
	if (!criteria)
		criteria = "CATEGORY";

	return criteria;
}
