// Adds task to task list
function addTaskToTaskList(headingToSearch, tasksToAdd)
{
	// Get task list on basis of heading
	var modelTaskList = tasksListCollection.collection.where({ heading : headingToSearch });

	console.log(modelTaskList[0]);

	// Add task in sub collection means in Task List
	modelTaskList[0].get('taskCollection').add(tasksToAdd);// sub-collection
	
	// Creates normal time.
	displayTimeAgo($(".list"));
}

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
	
	if(criteria == "DUE")
		headingToSearch = getHeadingForDueTask(json);	
	
	if (json.taskListId != undefined)
		if (headingToSearch != json.taskListId)
		{
			// Change task's list
			changeTaskList(data, json, criteria, headingToSearch);
			return;
		}

	if (isUpdate)
	{
		// Get Task List
		var modelTaskList = tasksListCollection.collection.where({ heading : headingToSearch });

		// Set new details in Task
		modelTaskList[0].get('taskCollection').get(json.id).set(data);
		
		return;
	}
	
	// Add new task
	addTaskToTaskList(headingToSearch, data);
}

// Removes task from old task list and add to new task list.
function changeTaskList(data, json, criteria, headingToSearch)
{
	// Get old task list
	var modelOldTaskList = tasksListCollection.collection.where({ heading : json.taskListId });

	console.log(modelOldTaskList);

	// Remove from task from old task list
	modelOldTaskList[0].get('taskCollection').remove(modelOldTaskList[0].get('taskCollection').get(json.id));

	// Remove task from UI
	$("#" + json.taskListId).find("#" + json.id).remove();

	// Add in task in new task list
	addTaskToTaskList(headingToSearch, data);
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

//Gives heading of task list from due of task
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
