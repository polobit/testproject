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
						{
							console.log(width + " " + event.pageX + " " + scrollX);
							$('.list-area-wrapper > div').scrollLeft(scrollX + 30);
						}

						else if (event.pageX < (width * 0.2)) // left 10%
						{
							console.log(width + " " + event.pageX + " " + scrollX);
							$('.list-area-wrapper > div').scrollLeft(scrollX - 35);
						}
					},
					// When task is dropped its criteria is changed
					update : function(event, ui)
					{
						// Same task list
						if (ui.sender == null)
							return;

						var item = ui.item[0];
						var sender = ui.sender[0];

						console.log(item);
						console.log(sender);

						// Get heading of task list
						var oldTaskListId = $(sender).closest('.list').attr('id');
						var newTaskListId = $(item).closest('.list').attr('id');

						console.log(oldTaskListId + " " + newTaskListId);

						// Checks current task list is different from previous
						if (oldTaskListId != newTaskListId)
						{
							var criteria = $('#type-tasks').data("selected_item");

							// If criteria is not selected then make it default
							// one
							if (!criteria)
								criteria = "CATEGORY";

							// Gets search key from map so we can change that field in task as per new task list.
							var fieldToChange = urlMap[criteria].searchKey;
							console.log(fieldToChange);

							// Get task id
							var taskId = $(item).find('.listed-task').attr('id');
							console.log(taskId);

							console.log($("#" + taskId).index());

							// Get old task list
							var modelOldTaskList = tasksListCollection.collection.where({ heading : oldTaskListId });
							console.log(modelOldTaskList);

							// Gets task from old sub collection (task list) to var type json
							var oldTask = modelOldTaskList[0].get('taskCollection').get(taskId).toJSON();
							console.log(oldTask);

							// Changes field of task
							if (fieldToChange == "due")
								oldTask["due"] = assignNewDue(newTaskListId);
							else if (fieldToChange == "taskOwner.name")
								oldTask.taskOwner = assignNewOwner(newTaskListId);
							else
								oldTask[fieldToChange] = newTaskListId;

							// To change task list in collection we need old task list id.
							oldTask["taskListId"] = oldTaskListId;

							console.log(oldTask);

							// Replace contacts object with contact ids
							var contacts = [];
							$.each(oldTask.contacts, function(index, contact)
							{
								contacts.push(contact.id);
							});

							oldTask.contacts = contacts;
							oldTask.due = new Date(oldTask.due).getTime();
							oldTask.owner_id = oldTask.taskOwner.id;

							// Save task in DB
							var newTask = new Backbone.Model();
							newTask.url = 'core/api/tasks';
							newTask.save(oldTask, { success : function(data)
							{
								console.log(data);
								updateTask("dragged", data, oldTask);

								// Update task in UI
								$("#" + newTaskListId).find("#" + taskId).parent().html(getTemplate('task-model', oldTask));

								// Creates normal time.
								displayTimeAgo($(".list"));
							} });
						}
					} }).disableSelection();
	});
}

function assignNewDue(newTaskListId)
{
  console.log(newTaskListId);	
}

function assignNewOwner(newTaskListId)
{
  console.log(newTaskListId);	
}