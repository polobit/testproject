// Gives heading of task list from due of task
function getHeadingForDueTask(task)
{
	var headingToSearch = null;

	// add to the right task list - overdue, today, tomorrow etc.
	var due = get_due(task.due);
	console.log(task.due);
	console.log(due);

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
	{
		d.setDate(d.getDate() - 1);
	}
	// Today
	if (newTaskListId == "TODAY")
	{
		console.log(getGMTTimeFromDate(d) / 1000);
	}
	// Tomorrow
	if (newTaskListId == "TOMORROW")
	{
		d.setDate(d.getDate() + 1);
	}
	// Later Day after tomorrow
	if (newTaskListId == "LATER")
	{
		d.setDate(d.getDate() + 2);
	}

	return (getGMTTimeFromDate(d) / 1000);
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

//
function getCriteria()
{
	// Get selection from criteria dropdown
	var criteria = $('#type-tasks').data("selected_item");
	
	// If criteria is not selected then make it default one
	if (!criteria)
		criteria = "CATEGORY";
	
	return criteria;
}