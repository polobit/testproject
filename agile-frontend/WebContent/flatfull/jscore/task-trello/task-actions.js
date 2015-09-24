// Adds task to task list
function addTaskToTaskList(headingToSearch, tasksToAdd, conditionToCheck)
{
	console.log("In addTaskToTaskList");

	var modelTaskList;

	// Get task list on basis of heading and id in case of owner criteria
	if (conditionToCheck == "OWNER") // new task
	{
		modelTaskList = getTaskList("OWNER", tasksToAdd.taskOwner.name, tasksToAdd.taskOwner.id);

		// Remove Loading Icon from task list
		$('.task-list-loading-img-' + tasksToAdd.taskOwner.name + "-" + tasksToAdd.taskOwner.id, ".task-trello-list").hide();
	}
	else if ((conditionToCheck == "dragged" || conditionToCheck == true) && headingToSearch == "taskOwner.name")
	// dragged/edited task
	{
		modelTaskList = getTaskList("OWNER", tasksToAdd.get("taskOwner").name, tasksToAdd.get("taskOwner").id);

		// Remove Loading Icon from task list
		$('.task-list-loading-img-' + tasksToAdd.get("taskOwner").name + "-" + tasksToAdd.get("taskOwner").id, ".task-trello-list").hide();
	}
	else
	// task other than owner criteria
	{
		modelTaskList = getTaskList(null, headingToSearch, null);

		// Remove Loading Icon from task list
		$('.task-list-loading-img-' + headingToSearch + "-", ".task-trello-list").hide();
	}

	if (!modelTaskList)
		return;

	// Copy cursor for infi-scroll
	tasksToAdd = setCursor(modelTaskList[0], tasksToAdd, conditionToCheck);

	// Add task in sub collection means in Task List
	if (conditionToCheck == "dragged") // if dragged task then do not update UI
		modelTaskList[0].get('taskCollection').add(tasksToAdd.toJSON(), { silent : true });// sub-collection
	else
	{
		modelTaskList[0].get('taskCollection').add(tasksToAdd);// sub-collection

		// change task count in header of task list
		changeTaskCount(modelTaskList[0].toJSON(), true);
	}

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

	// Call method with task id to be deleted.
	var new_task = modelTaskList[0].get('taskCollection').get(taskId);
	new_task.url = '/core/api/tasks/' + taskId;
	new_task.destroy({ success : function(model, response)
	{
		// Creates normal time.
		displayTimeAgo($(".task-trello-list"));

		// change task count in header of task list
		changeTaskCount(modelTaskList[0].toJSON(), false);
		
		getDueTasksCount(function(count){
			var due_task_count= count;
			if(due_task_count==0)
				$(".navbar_due_tasks").css("display", "none");
			else
				$(".navbar_due_tasks").css("display", "inline-block");
			if(due_task_count !=0)
				$('#due_tasks_count').html(due_task_count);
			else
				$('#due_tasks_count').html("");

		});
		
	} });
}

/*
 * Compare counter with length of criteria array and call function to Fetch
 * tasks from DB for next task list if available.
 */
function fetchForNextTaskList()
{
	// is All task list are done?
	if (IS_FECHING_DONE)
		return;

	var criteria = getCriteria();
	var criteriaArray = GROUPING_MAP[criteria].type;

	// Some task list are pending
	if (FETCH_COUNTER < criteriaArray.length)
	{
		// call fetch for next task list.
		taskFetch(FETCH_COUNTER);
	}

	// All task list are done.
	if (FETCH_COUNTER >= criteriaArray.length)
		IS_FECHING_DONE = true;
}
