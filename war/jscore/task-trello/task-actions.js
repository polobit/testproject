// Adds task to task list
function addTaskToTaskList(headingToSearch, tasksToAdd, conditionToCheck)
{
	var modelTaskList;

	// Get task list on basis of heading and id in case of owner criteria
	if (conditionToCheck == "OWNER") // new task
	{
		modelTaskList = getTaskList("OWNER", tasksToAdd.taskOwner.name, tasksToAdd.taskOwner.id);
	}
	else if ((conditionToCheck == "dragged" || conditionToCheck == true) && headingToSearch == "taskOwner.name")
	// dragged/edited task
	{
		modelTaskList = getTaskList("OWNER", tasksToAdd.get("taskOwner").name, tasksToAdd.get("taskOwner").id);
	}
	else
	// task other than owner criteria
	{
		modelTaskList = getTaskList(null, headingToSearch,null);
	}

	if (!modelTaskList)
		return;

	// Add task in sub collection means in Task List
	if (conditionToCheck == "dragged") // if dragged task then do not update UI
		modelTaskList[0].get('taskCollection').add(tasksToAdd, { silent : true });// sub-collection
	else
		modelTaskList[0].get('taskCollection').add(tasksToAdd);// sub-collection

	// Maintain changes in UI
	displaySettings();
}

// Delete Task
function deleteTask(taskId, taskListId, taskListOwnerId)
{
	var modelTaskList;

	// Get Task list
	if (taskListOwnerId)
		modelTaskList = getTaskList("OWNER", taskListId, taskListOwnerId);
	else
		modelTaskList = getTaskList(null, taskListId, null);

	if (!modelTaskList)
		return;

	// Destroy task
	modelTaskList[0].get('taskCollection').get(taskId).destroy();

	// Creates normal time.
	displayTimeAgo($(".list"));
}
