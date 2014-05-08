// Shows and Fill Task Edit Modal
function editTask(taskId, taskListId, taskListOwnerId)
{
	var modelTaskList;

	if (taskListOwnerId)
		modelTaskList = tasksListCollection.collection.where({ heading : taskListId, owner_id : taskListOwnerId });
	else
		modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	if (!modelTaskList)
		return;

	var modelTask = modelTaskList[0].get('taskCollection').get(taskId);

	if (!modelTask)
		return;

	var taskJson = modelTask.toJSON();

	console.log(taskJson);

	taskJson["taskListId"] = taskListId;
	taskJson["taskListOwnerId"] = taskListOwnerId;

	// Fill form
	deserializeForm(taskJson, $("#updateTaskForm"));

	// Show modal
	$("#updateTaskModal").modal('show');

	// Fills owner select element
	populateUsers("owners-list", $("#updateTaskForm"), taskJson, 'taskOwner', function(data)
	{
		$("#updateTaskForm").find("#owners-list").html(data);
		if (taskJson.taskOwner)
		{
			$("#owners-list", $("#updateTaskForm")).find('option[value=' + taskJson['taskOwner'].id + ']').attr("selected", "selected");
		}

		$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
	});

	// Creates normal time.
	displayTimeAgo($(".list"));
}

// Update edited task
function updateTask(isUpdate, data, json)
{
	// Get selected criteria
	var criteria = getCriteria();

	var headingToSearch = json[urlMap[criteria].searchKey];

	if (criteria == "DUE")
		headingToSearch = getHeadingForDueTask(json);

	// To update task with criteria owner, it will skip if of changeTaskList()
	// and will continue to update task
	if (criteria == "OWNER" && parseInt(json.taskListOwnerId) == data.get("taskOwner").id)
		headingToSearch = json.taskListId;

	// Task list change
	if (json.taskListId != undefined)
		if (headingToSearch != json.taskListId) // Not belongs to same task list
		{
			// Change task's list
			changeTaskList(data, json, criteria, headingToSearch, isUpdate);
			return;
		}

	// Task update(edit)
	if (isUpdate == true)
	{
		var modelTaskList;

		// Get Task List
		if (criteria == "OWNER")
			modelTaskList = tasksListCollection.collection.where({ heading : json.taskListId, owner_id : parseInt(json.taskListOwnerId) });
		else
			modelTaskList = tasksListCollection.collection.where({ heading : headingToSearch });

		if (!modelTaskList)
			return;

		// Set new details in Task
		modelTaskList[0].get('taskCollection').get(json.id).set(data);

		// Maintain changes in UI
		displaySettings();

		return;
	}

	// Add new task
	if (criteria == "OWNER")
		addTaskToTaskList(headingToSearch, data.toJSON(), criteria);
	else
		addTaskToTaskList(headingToSearch, data, null);
}

// Removes task from old task list and add to new task list.
function changeTaskList(data, json, criteria, headingToSearch, isUpdate)
{
	var modelOldTaskList;
	
	// Get old task list
	if (criteria == "OWNER")
	{
		var ownerId;

		if (json.taskListOwnerId)
			ownerId = parseInt(json.taskListOwnerId);
		else
			ownerId = json.taskOwner.id;

		if (!ownerId)
			return;
			
		modelOldTaskList = tasksListCollection.collection.where({ heading : json.taskListId, owner_id : ownerId });

		headingToSearch = "taskOwner.name";

		// Find proper column with owner id and then dlt task in UI
		$(".list-header[ownerID=" + ownerId + "]").parent().find("#" + json.id).remove();
	}
	else
	{
	    modelOldTaskList = tasksListCollection.collection.where({ heading : json.taskListId });

		// Remove task from UI
		$("#" + json.taskListId).find("#" + json.id).remove();
	}

	if(!modelOldTaskList)
		return;

	// Remove from task from old task list
	modelOldTaskList[0].get('taskCollection').remove(modelOldTaskList[0].get('taskCollection').get(json.id));

	// Add in task in new task list
	addTaskToTaskList(headingToSearch, data, isUpdate);
}

// On click of task action , makes task completed
function completeTask(taskId, taskListId, taskListOwnerId)
{
	var modelTaskList;
	
	// Get task list
	if (taskListOwnerId)
		modelTaskList = tasksListCollection.collection.where({ heading : taskListId, owner_id : parseInt(taskListOwnerId) });
	else
		modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	if(!modelTaskList)
		return;
	
	// Get task
	var modelTsk = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTsk.toJSON();

	// Replace contacts object with contact ids
	var contacts = [];
	$.each(taskJson.contacts, function(index, contact)
	{
		contacts.push(contact.id);
	});

	taskJson.contacts = contacts;
	// taskJson.is_complete = true; field will b removed.
	taskJson.due = new Date(taskJson.due).getTime();
	taskJson.owner_id = taskJson.taskOwner.id;
	taskJson.status = "COMPLETED";
	taskJson.progress = 100;

	if (taskListOwnerId)
	{
		taskJson.taskListId = taskListId;
		taskJson.taskListOwnerId = taskListOwnerId;
	}

	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(taskJson, { success : function(data)
	{
		updateTask(true, data, taskJson);

		// Maintain changes in UI
		displaySettings();
	} });
}
