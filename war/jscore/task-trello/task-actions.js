// Adds task to task list
function addTaskToTaskList(headingToSearch, tasksToAdd, conditionToCheck)
{
	console.log("In addTaskToTaskList");
	console.log(tasksToAdd);
	console.log(conditionToCheck);
	console.log(headingToSearch);

	// Get task list on basis of heading and id in case of owner criteria
	if (conditionToCheck == "OWNER") // new task
	{
		console.log("conditionToCheck == OWNER");
		var modelTaskList = tasksListCollection.collection.where({ heading : tasksToAdd.taskOwner.name, owner_id : tasksToAdd.taskOwner.id });
	}
	else if ((conditionToCheck == "dragged" || conditionToCheck == true) && headingToSearch == "taskOwner.name") // dragged/edited task
	{
		console.log("conditionToCheck == dreagged and headingToSearch == taskOwner.name");
		var modelTaskList = tasksListCollection.collection.where({ heading : tasksToAdd.get("taskOwner").name, owner_id : tasksToAdd.get("taskOwner").id });
	}
	else
	// task other than owner criteria
	{
		console.log("heading : headingToSearch");
		var modelTaskList = tasksListCollection.collection.where({ heading : headingToSearch });
	}

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
function viewTask(taskId, taskListId, taskListOwnerId)
{
	console.log(taskId, taskListId, taskListOwnerId);

	// Get task list
	if (taskListOwnerId)
		var modelTaskList = tasksListCollection.collection.where({ heading : taskListId, owner_id : parseInt(taskListOwnerId) });
	else
		var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	// Get task
	var modelTask = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTask.toJSON();

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
function deleteTask(taskId, taskListId, taskListOwnerId)
{
	// Get Task list
	if (taskListOwnerId)
		var modelTaskList = tasksListCollection.collection.where({ heading : taskListId, owner_id : parseInt(taskListOwnerId) });
	else
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
