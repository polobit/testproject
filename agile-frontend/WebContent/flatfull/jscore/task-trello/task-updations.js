// Shows and Fill Task Edit Modal
function editTask(taskId, taskListId, taskListOwnerId)
{
	console.log("editTask");
	var modelTaskList;

	if (taskListOwnerId)
		modelTaskList = getTaskList("OWNER", taskListId, taskListOwnerId);
	else
		modelTaskList = getTaskList(null, taskListId, null);

	if (!modelTaskList)
		return;

	var modelTask = modelTaskList[0].get('taskCollection').get(taskId);

	if (!modelTask)
		return;

	var taskJson = modelTask.toJSON();

	taskJson["taskListId"] = taskListId;
	taskJson["taskListOwnerId"] = taskListOwnerId;

	// Show modal
	$("#updateTaskModal").html(getTemplate("task-update-modal")).modal('show');
	
	loadProgressSlider($("#updateTaskForm"), function(el){
		// Fill form
		deserializeForm(taskJson, $("#updateTaskForm"));
		$('.update-task-timepicker').val(fillTimePicker(taskJson.due));

		categories.getCategoriesHtml(taskJson,function(catsHtml){
			$('#type',$("#updateTaskForm")).html(catsHtml);
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
		});

		showNoteOnForm("updateTaskForm", taskJson.notes);

		// Creates normal time.
		displayTimeAgo($(".task-trello-list"));
	});

}

// Update edited task
function updateTask(isUpdate, data, json)
{
	console.log("In updateTask");

	// Get selected criteria
	var criteria = getCriteria();

	var headingToSearch = json[GROUPING_MAP[criteria].searchKey];

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
			modelTaskList = getTaskList(criteria, json.taskListId, json.taskListOwnerId);
		else
			modelTaskList = getTaskList(null, headingToSearch, null);

		if (!modelTaskList)
			return;

		// Set new details in Task
		modelTaskList[0].get('taskCollection').get(json.id).set(data);

		// Update task in UI : set() won't work on task which is dragged, so need to do manually. 
		if (criteria == "OWNER")
			$(".list-header[ownerID=" + json.taskListOwnerId + "]").parent().find("#" + json.id).parent().html(getTemplate('task-model', data.toJSON()));
		else
			$("#" + headingToSearch).find("#" + json.id).parent().html(getTemplate('task-model', data.toJSON()));

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
	console.log("In changeTaskList");

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

		modelOldTaskList = getTaskList(criteria, json.taskListId, ownerId);

		headingToSearch = "taskOwner.name";

		// Find proper column with owner id and then dlt task in UI
		$(".list-header[ownerID=" + ownerId + "]").parent().find("#" + json.id).remove();
	}
	else
	{
		modelOldTaskList = getTaskList(null, json.taskListId, null);

		// Remove task from UI
		$("#" + json.taskListId).find("#" + json.id).remove();
	}

	if (!modelOldTaskList)
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
		modelTaskList = getTaskList("OWNER", taskListId, taskListOwnerId);
	else
		modelTaskList = getTaskList(null, taskListId, null);

	if (!modelTaskList)
		return;

	// Get task
	var modelTsk = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTsk.toJSON();

	if (taskJson.status == COMPLETED || taskJson.is_complete == true)
		return;

	// Replace contacts object with contact ids
	var contacts = [];
	$.each(taskJson.contacts, function(index, contact)
	{
		contacts.push(contact.id);
	});

	// Replace notes object with note ids
	var notes = [];
	$.each(taskJson.notes, function(index, note)
	{
		notes.push(note.id);
	});

	taskJson.contacts = contacts;
	taskJson.notes = notes;
	taskJson.is_complete = true;
	taskJson.due = new Date(taskJson.due).getTime();
	taskJson.status = COMPLETED;
	taskJson.progress = 100;
	taskJson.note_description = "";

	if (taskJson.taskOwner)
		taskJson.owner_id = taskJson.taskOwner.id;

	taskJson.taskListId = taskListId;

	if (taskListOwnerId)
		taskJson.taskListOwnerId = taskListOwnerId;

	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(taskJson, { success : function(data)
	{
		getDueTasksCount(function(count){
			var due_task_count= count;
			if(due_task_count==0)
				$(".navbar_due_tasks").css("display", "none");
			else
				$(".navbar_due_tasks").css("display", "block");
			if(due_task_count !=0)
				$('#due_tasks_count').html(due_task_count);
			else
				$('#due_tasks_count').html("");

		});
		
		updateTask(true, data, taskJson);

		// Maintain changes in UI
		displaySettings();
	} });
}
