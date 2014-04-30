// Shows and Fill Task Edit Modal
function editTask(taskId, taskListId)
{
	console.log(taskId, taskListId);

	var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	var modelTsk = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTsk.toJSON();

	taskJson["taskListId"] = taskListId;

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

	// Task list change
	if (json.taskListId != undefined)
		if (headingToSearch != json.taskListId)
		{
			// Change task's list
			changeTaskList(data, json, criteria, headingToSearch, isUpdate);
			return;
		}

	// Task update(edit)
	if (isUpdate)
	{
		// Get Task List
		var modelTaskList = tasksListCollection.collection.where({ heading : headingToSearch });

		// Set new details in Task
		modelTaskList[0].get('taskCollection').get(json.id).set(data);

		return;
	}

	// Add new task
	addTaskToTaskList(headingToSearch, data, null);
}

// Removes task from old task list and add to new task list.
function changeTaskList(data, json, criteria, headingToSearch, isUpdate)
{
	console.log(data);
	console.log(json);	
	console.log(isUpdate+"  "+criteria+"  "+headingToSearch);	
	
	// Get old task list
	if (criteria == "OWNER")
	  {
		var modelOldTaskList = tasksListCollection.collection.where({ heading : json.taskListId, owner_id:json.taskOwner.id });
		headingToSearch = "taskOwner.name";
	  }		
	else
		var modelOldTaskList = tasksListCollection.collection.where({ heading : json.taskListId });

	console.log(modelOldTaskList);

	// Remove from task from old task list
	modelOldTaskList[0].get('taskCollection').remove(modelOldTaskList[0].get('taskCollection').get(json.id));

	// Remove task from UI
	$("#" + json.taskListId).find("#" + json.id).remove();

	// Add in task in new task list
	addTaskToTaskList(headingToSearch, data, isUpdate);
}

// On click of task action , makes task completed
function completeTask(taskId, taskListId)
{
	var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

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

	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(taskJson, { success : function(data)
	{
		updateTask(true, data, taskJson);

		// Creates normal time.
		displayTimeAgo($(".list"));
	} });
}
