// Adds task to task list
function addTaskToTaskList(headingToSearch, tasksToAdd, conditionToCheck)
{
	console.log(tasksToAdd);
	console.log(conditionToCheck);
	console.log(headingToSearch);

	// Get task list on basis of heading and id in case of owner criteria
	if (conditionToCheck == "OWNER")
		var modelTaskList = tasksListCollection.collection.where({ heading : tasksToAdd.taskOwner.name, owner_id : tasksToAdd.taskOwner.id });
	else if (conditionToCheck == "dragged" && headingToSearch == "taskOwner.name")
		var modelTaskList = tasksListCollection.collection.where({ heading : tasksToAdd.get("taskOwner").name, owner_id : tasksToAdd.get("taskOwner").id });
	else
		var modelTaskList = tasksListCollection.collection.where({ heading : headingToSearch });

	console.log(modelTaskList[0]);

	// Add task in sub collection means in Task List
	if (conditionToCheck == "dragged") // if dragged task then do not update UI
		modelTaskList[0].get('taskCollection').add(tasksToAdd, { silent : true });// sub-collection
	else
		modelTaskList[0].get('taskCollection').add(tasksToAdd);// sub-collection

	// Creates normal time.
	displayTimeAgo($(".list"));
}

// Show Task View Modal with task details.
function viewTask(taskId, taskListId)
{
	console.log(taskId, taskListId);

	var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	var modelTsk = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTsk.toJSON();

	console.log(taskJson);

	// If modal already exists remove to show a new one
	$('#viewTaskModal').remove();

	// Display Modal
	$("#content").append(getTemplate("viewTask", taskJson));

	// Show modal
	$('#viewTaskModal').modal('show');

	// Creates normal time.
	displayTimeAgo($("#viewTaskModal"));
}

// Delete Task
function deleteTask(taskId, taskListId)
{
	// Get Task list
	var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	// Destroy task
	modelTaskList[0].get('taskCollection').get(taskId).destroy();

	// Creates normal time.
	displayTimeAgo($(".list"));
}

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
