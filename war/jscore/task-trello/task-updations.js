// Shows and Fill Task Edit Modal
function editTask(taskId, taskListId, taskListOwnerId)
{
	console.log(taskId + " " + taskListId);
	console.log(taskListOwnerId);

	if (taskListOwnerId)
		var modelTaskList = tasksListCollection.collection.where({ heading : taskListId, owner_id : taskListOwnerId });
	else
		var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	console.log(modelTaskList);

	var modelTask = modelTaskList[0].get('taskCollection').get(taskId);

	console.log(modelTask);

	var taskJson = modelTask.toJSON();

	console.log(taskJson);

	taskJson["taskListId"] = taskListId;
	taskJson["taskListOwnerId"] = taskListOwnerId;

	// Fill form
	deserializeForm(taskJson, $("#editTaskForm"));

	// Show modal
	$("#editTaskModal").modal('show');

	// Fills owner select element
	populateUsers(
			"owners-list",
			$("#editTaskForm"),
			taskJson,
			'taskOwner',
			function(data)
			{
				$("#editTaskForm").find("#owners-list").html(data);
				if (taskJson.taskOwner)
				{
					$("#owners-list", $("#editTaskForm")).find('option[value=' + taskJson['taskOwner'].id + ']').attr("selected", "selected");
				}

				if (taskJson.ownerPic)
				{
					$("#owner-pic", $("#editTaskForm"))
							.html(
									'<img class="thumbnail" src="' + taskJson.ownerPic + '" width="40px" height="40px" style="float: right;margin-right: -23px;margin-top: -59px;" />');
				}
				else
				{
					var imgSrc = 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=50&d=' + escape(DEFAULT_GRAVATAR_url);
					$("#owner-pic", $("#editTaskForm"))
							.html(
									'<img class="thumbnail" src="' + imgSrc + '" width="40px" height="40px" style="float: right;margin-right: -23px;margin-top: -59px;"/>');
				}

				$("#owners-list", $("#editTaskForm")).closest('div').find('.loading-img').hide();
			});

	// Creates normal time.
	displayTimeAgo($(".list"));
}

// Update edited task
function updateTask(isUpdate, data, json)
{
	console.log("In updateTask");
	var criteria = $('#type-tasks').data("selected_item");

	// If criteria is not selected then make it default one
	if (!criteria)
		criteria = "CATEGORY";

	var headingToSearch = json[urlMap[criteria].searchKey];

	console.log(data);
	console.log(json);
	console.log(criteria);
	console.log(headingToSearch);

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
		// Get Task List
		if (criteria == "OWNER")
			var modelTaskList = tasksListCollection.collection.where({ heading : json.taskListId, owner_id : parseInt(json.taskListOwnerId) });
		else
			var modelTaskList = tasksListCollection.collection.where({ heading : headingToSearch });

		console.log(modelTaskList);

		// Set new details in Task
		modelTaskList[0].get('taskCollection').get(json.id).set(data);

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
	console.log("In changeTaskList");
	console.log(data);
	console.log(json);
	console.log(isUpdate + "  " + criteria + "  " + headingToSearch);

	// Get old task list
	if (criteria == "OWNER")
	{
		if (json.taskListOwnerId)
			var ownerId = parseInt(json.taskListOwnerId);
		else
			var ownerId = json.taskOwner.id;

		var modelOldTaskList = tasksListCollection.collection.where({ heading : json.taskListId, owner_id : ownerId });

		headingToSearch = "taskOwner.name";

		// Find proper column with owner id and then dlt task in UI
		$(".list-header[ownerID=" + ownerId + "]").parent().find("#" + json.id).remove();
	}
	else
	{
		var modelOldTaskList = tasksListCollection.collection.where({ heading : json.taskListId });

		// Remove task from UI
		$("#" + json.taskListId).find("#" + json.id).remove();
	}

	console.log(modelOldTaskList);

	// Remove from task from old task list
	modelOldTaskList[0].get('taskCollection').remove(modelOldTaskList[0].get('taskCollection').get(json.id));

	// Add in task in new task list
	addTaskToTaskList(headingToSearch, data, isUpdate);
}

// On click of task action , makes task completed
function completeTask(taskId, taskListId, taskListOwnerId)
{
	// Get task list
	if (taskListOwnerId)
		var modelTaskList = tasksListCollection.collection.where({ heading : taskListId, owner_id : parseInt(taskListOwnerId) });
	else
		var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

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
	taskJson.is_complete = true;
	taskJson.due = new Date(taskJson.due).getTime();
	taskJson.owner_id = taskJson.taskOwner.id;
	
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

		// Creates normal time.
		displayTimeAgo($(".list"));
	} });
}
