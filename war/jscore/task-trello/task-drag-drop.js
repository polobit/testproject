/**
 * Sets tasks as sortable list.
 */
function setup_sortable_tasks()
{
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function()
	{
		$(".task-model-list").sortable(
				{ connectWith : '.task-model-list', placeholder : "ui-sortable-placeholder", cursor : "move", containment : ".list-area-wrapper",
					scroll : false,
					// When task is dragged to adjust the horizontal scroll
					change : function(event, ui)
					{
						var width = $('.list-area-wrapper > div').width();
						var scrollX = $('.list-area-wrapper > div').scrollLeft();

						if (event.pageX > (width * 0.8)) // right 90%
							$('.list-area-wrapper > div').scrollLeft(scrollX + 30);
						else if (event.pageX < (width * 0.2)) // left 10%
							$('.list-area-wrapper > div').scrollLeft(scrollX - 35);

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
	var oldTaskListId = $(sender).closest('.list').attr('id');
	var newTaskListId = $(item).closest('.list').attr('id');

	var oldTaskListOwnerId = $(sender).closest('.list').find('.list-header').attr('ownerID');
	var newTaskListOwnerId = $(item).closest('.list').find('.list-header').attr('ownerID');

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
		var fieldToChange = urlMap[criteria].searchKey;

		// Get task id
		var taskId = $(item).find('.listed-task').attr('id');

		var modelOldTaskList;
		
		// Get old task list
		if (criteria == "OWNER")
			modelOldTaskList = tasksListCollection.collection.where({ heading : oldTaskListId, owner_id : parseInt(oldTaskListOwnerId) });
		else
			modelOldTaskList = tasksListCollection.collection.where({ heading : oldTaskListId });

		// Gets task from old sub collection (task list) to var type json
		var oldTask = modelOldTaskList[0].get('taskCollection').get(taskId).toJSON();

		// Changes field of task
		if (fieldToChange == "due")
		{
			oldTask.owner_id = oldTask.taskOwner.id;
			oldTask["due"] = getNewDueDate(newTaskListId);
		}
		else if (fieldToChange == "taskOwner.name")
		{
			oldTask.owner_id = newTaskListOwnerId;
			oldTask["taskListOwnerId"] = oldTaskListOwnerId;
		}		
		else
		{
			oldTask.owner_id = oldTask.taskOwner.id;
			oldTask[fieldToChange] = newTaskListId;
			
			 if (fieldToChange == "status") 
			   oldTask.progress = getProgressValue(newTaskListId); // send new status 
		}

		// To change task list in collection we need old task list id.
		oldTask["taskListId"] = oldTaskListId;

		// Replace contacts object with contact ids
		var contacts = [];
		$.each(oldTask.contacts, function(index, contact)
		{
			contacts.push(contact.id);
		});

		oldTask.contacts = contacts;
		oldTask.due = new Date(oldTask.due).getTime();

		// Save task after dropped to new task list
		saveAfterDrop(oldTask, criteria, newTaskListId, newTaskListOwnerId, taskId);
	}
}

// Save task after dropped to new task list
function saveAfterDrop(oldTask, criteria, newTaskListId, newTaskListOwnerId, taskId)
{
	// Save task in DB
	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(oldTask, { success : function(data)
	{
		updateTask("dragged", data, oldTask);

		// Update task in UI
		if (criteria == "OWNER")
			$(".list-header[ownerID=" + newTaskListOwnerId + "]").parent().find("#" + taskId).parent().html(getTemplate('task-model', data.toJSON()));
		else
			$("#" + newTaskListId).find("#" + taskId).parent().html(getTemplate('task-model', data.toJSON()));

		// Maintain changes in UI
		displaySettings();
	} });
}
