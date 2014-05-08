// Adds task to task list
function addTaskToTaskList(headingToSearch, tasksToAdd, conditionToCheck)
{
	var modelTaskList;
	
	// Get task list on basis of heading and id in case of owner criteria
	if (conditionToCheck == "OWNER") // new task
	{
		modelTaskList = tasksListCollection.collection.where({ heading : tasksToAdd.taskOwner.name, owner_id : tasksToAdd.taskOwner.id });
	}
	else if ((conditionToCheck == "dragged" || conditionToCheck == true) && headingToSearch == "taskOwner.name") // dragged/edited
	// task
	{
		modelTaskList = tasksListCollection.collection.where({ heading : tasksToAdd.get("taskOwner").name, owner_id : tasksToAdd.get("taskOwner").id });
	}
	else
	// task other than owner criteria
	{
		modelTaskList = tasksListCollection.collection.where({ heading : headingToSearch });
	}
	
	if(!modelTaskList)
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
		modelTaskList = tasksListCollection.collection.where({ heading : taskListId, owner_id : parseInt(taskListOwnerId) });
	else
		modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	if(!modelTaskList)
		return;
	
	// Destroy task
	modelTaskList[0].get('taskCollection').get(taskId).destroy();

	// Creates normal time.
	displayTimeAgo($(".list"));
}
