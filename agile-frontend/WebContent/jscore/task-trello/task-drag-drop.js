/**
 * Sets tasks as sortable list.
 */
function setup_sortable_tasks()
{
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function()
	{
		$(".task-model-list").sortable(
				{
					connectWith : '.task-model-list',
					cursor : "move",
					/*containment : ".list-area-wrapper",*/
					scroll : false,
					helper : "clone",
					placeholder : "ui-sortable-placeholder",
					forcePlaceholderSize : true,					
					revert : true,

					start: function(e, ui){
				        ui.placeholder.height(ui.item.height());
				    },
					
					beforeStop : function(event, ui)
					{
						// If sender and receiver is same
						if ($(ui.helper).closest('.task-trello-list').find('.list-header').attr('attr') === $(ui.placeholder).closest('.task-trello-list').find('.list-header').attr(
								'attr'))
						{
							// If criteria is owner
							if ($(ui.helper).closest('.task-trello-list').find('.list-header').attr('ownerID'))
							{
								// If sender and receiver is same owner
								if ($(ui.helper).closest('.task-trello-list').find('.list-header').attr('ownerID') === $(ui.placeholder).closest('.task-trello-list').find(
										'.list-header').attr('ownerID'))
									return false;
								// $(this).sortable('cancel');
							}
							else
								return false;
							// $(this).sortable('cancel');
						}
					},

					// When task is dragged to adjust the horizontal scroll
					change : function(event, ui)
					{						
						var width = $('.list-area-wrapper > div').width();
						var scrollX = $('.list-area-wrapper > div').scrollLeft();

						if (event.pageX > (width * 0.9)) // right 90%
							$('.list-area-wrapper > div').scrollLeft(scrollX + 100);
						else if (event.pageX < (width * 0.2)) // left 10%
							$('.list-area-wrapper > div').scrollLeft(scrollX - 105);

					},
					// When task is dropped its criteria is changed
					update : function(event, ui)
					{
						// Same task list
						if (ui.sender == null)
							return;

						// Make UI and DB changes after task dropped.
						changeAfterDrop(event, ui);

					} }).disableSelection();
	});
}

// Make changes after task dropped to other task list
function changeAfterDrop(event, ui)
{
	var item = ui.item[0];
	var sender = ui.sender[0];

	// Get heading of task list
	var oldTaskListId = getTaskListId(sender);
	var newTaskListId = getTaskListId(item);

	var oldTaskListOwnerId = getTaskListOwnerId(sender);
	var newTaskListOwnerId = getTaskListOwnerId(item);

	// Get selected criteria
	var criteria = getCriteria();

	var getUpdatedUI = false;

	// If criteria is owner and task is dragged to other task list
	if (criteria == "OWNER" && oldTaskListOwnerId != newTaskListOwnerId)
		getUpdatedUI = true;
	else if (oldTaskListId != newTaskListId) // Checks current task list is
		// different from previous
		getUpdatedUI = true;

	if (getUpdatedUI)
	{
		// Gets search key from map so we can change that field in task as per
		// new task list.
		var fieldToChange = GROUPING_MAP[criteria].searchKey;

		// Get task id
		var taskId = $(item).find('.listed-task').attr('id');

		// Get old task list
		var modelOldTaskList = getTaskList(criteria, oldTaskListId, oldTaskListOwnerId);

		// Gets task from old sub collection (task list) to var type json
		var oldTask = modelOldTaskList[0].get('taskCollection').get(taskId).toJSON();

		// Make updation in task and save in DB as well as collection
		updateDraggedTask(oldTask, criteria, oldTaskListOwnerId, oldTaskListId, newTaskListId, newTaskListOwnerId, taskId, fieldToChange);

		// Change count of old task list.
		changeTaskCount(modelOldTaskList[0].toJSON(), false);
	}
}

// Make updation in task and save in DB as well as collection
function updateDraggedTask(oldTask, criteria, oldTaskListOwnerId, oldTaskListId, newTaskListId, newTaskListOwnerId, taskId, fieldToChange)
{
	// Changes field of task
	if (fieldToChange == "due")
	{
		// Criteria is due
		if (oldTask.taskOwner)
			oldTask.owner_id = oldTask.taskOwner.id;
		oldTask["due"] = getNewDueDateBasedOnTime(newTaskListId,oldTask['due']);
	}
	else if (fieldToChange == "taskOwner.name")
	{
		// Criteria is owner
		oldTask.owner_id = newTaskListOwnerId;
		oldTask["taskListOwnerId"] = oldTaskListOwnerId;
	}
	else
	{
		if (oldTask.taskOwner)
			oldTask.owner_id = oldTask.taskOwner.id;
		oldTask[fieldToChange] = newTaskListId;

		// Criteria is status
		if (fieldToChange == "status")
		{
			// send new status
			oldTask.progress = getProgressValue(newTaskListId);

			if (newTaskListId == "COMPLETED")
				oldTask.is_complete = true;
			else
				oldTask.is_complete = false;
		}
	}

	// To change task list in collection we need old task list id.
	oldTask["taskListId"] = oldTaskListId;

	// Replace contacts object with contact ids
	var contacts = [];
	$.each(oldTask.contacts, function(index, contact)
	{
		contacts.push(contact.id);
	});

	// Replace notes object with note ids
	var notes = [];
	$.each(oldTask.notes, function(index, note)
	{
		notes.push(note.id);
	});

	oldTask.contacts = contacts;
	oldTask.notes = notes;
	oldTask.due = new Date(oldTask.due).getTime();

	// Save task after dropped to new task list
	saveAfterDrop(oldTask, criteria, newTaskListId, newTaskListOwnerId, taskId);
}

// Save task after dropped to new task list
function saveAfterDrop(oldTask, criteria, newTaskListId, newTaskListOwnerId, taskId)
{
	// Save task in DB
	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(oldTask, { success : function(data)
	{
		// Will add new task to dropped task list and remove task from dragged
		// task list.
		updateTask("dragged", data, oldTask);

		// Update task in UI
		if (criteria == "OWNER")
			$(".list-header[ownerID=" + newTaskListOwnerId + "]").parent().find("#" + taskId).parent().html(getTemplate('task-model', data.toJSON()));
		else
			$("#" + newTaskListId).find("#" + taskId).parent().html(getTemplate('task-model', data.toJSON()));

		// Maintain changes in UI
		displaySettings();

		// Get new task list
		var modelNewTaskList = getTaskList(criteria, newTaskListId, newTaskListOwnerId);

		// Change count of new task list.
		changeTaskCount(modelNewTaskList[0].toJSON(), true);
		var due_task_count=getDueTasksCount();
		if(due_task_count==0)
			$(".navbar_due_tasks").css("display", "none");
		else
			$(".navbar_due_tasks").css("display", "block");
		$('#due_tasks_count').html(due_task_count);
	} });
}
