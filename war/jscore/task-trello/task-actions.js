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
	else if ((conditionToCheck == "dragged" || conditionToCheck == true) && headingToSearch == "taskOwner.name") // dragged/edited
	// task
	{
		console.log("conditionToCheck == dragged and headingToSearch == taskOwner.name");
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

	// Maintain changes in UI
	displaySettings();
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
