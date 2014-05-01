$(function()
{
	// Main Collection
	tasksListCollection = null;
	
	// Url Map After selection from filter
	urlMap = { "PRIORITY" : { "type" : ["HIGH", "LOW", "NORMAL"], "searchKey" : "priority_type" }, 
			   "CATEGORY" : { "type" : ["EMAIL", "CALL", "SEND", "TWEET", "FOLLOW_UP", "MEETING", "MILESTONE", "OTHER"], "searchKey" : "type" }, 
			   "STATUS" : { "type" : ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "PAUSED"], "searchKey" : "status" }, 
			   "DUE" : { "type" : ["TODAY","TOMORROW", "OVERDUE","LATER"], "searchKey" : "due" }, 
			   "OWNER" : { "type" : [], "searchKey" : "taskOwner.name" } };
	
	// Get user's name and id to add in urlMap for owner of task, user name can be redundant so we need user's id too.
	$.getJSON('/core/api/users', function(users)
	{
		console.log(users);
		for ( var i in users)
			{
			  urlMap.OWNER.type[i] = {"name":users[i].name,"id":users[i].id};
			}			
	}).error(function(data)
	{
		console.log("get user err");
		console.log(data);
	});

	// Display task actions
	$('.listed-task .task-footer').live('mouseenter', function()
	{
		$(this).find(".task-actions").css("display", "block");
	});

	// Hide task actions
	$('.listed-task .task-footer').live('mouseleave', function()
	{
		$(this).find(".task-actions").css("display", "none");
	});

	// Open Task View modal on click of Task and Due time
	$('.task-body, .task-due-time').die().live('click', function(event)
	{
		var taskId;
		var taskListId = $(this).closest('.list').attr('id');
		var taskListOwnerId = $(this).closest('.list').find('.list-header').attr('ownerID');

		if ($(this).hasClass('task-body'))
			taskId = $(this).parent().attr('id');
		else
			taskId = $(this).attr('data');

		// Show Task View Modal
		viewTask(taskId, taskListId, taskListOwnerId);
	});

	// Save edited task
	$('#edit_task_validate').click(function(e)
	{
		e.preventDefault();

		// Save task
		save_task('editTaskForm', 'editTaskModal', true, this);
	});

	// Task Action: Open Task Edit Modal and display details in it.
	$('.edit-task').die().live('click', function(event)
	{
		var taskId = $(this).attr('data');		
		var taskListId = $(this).closest('.list').attr('id');
		var taskListOwnerId = $(this).closest('.list').find('.list-header').attr('ownerID');

		// Show and Fill details in Task Edit modal
		editTask(taskId, taskListId, parseInt(taskListOwnerId));
	});

	/*
	 * Task Action: Delete task from UI as well as DB. Need to do this manually
	 * because nested collection can not perform default functions.
	 */
	$('.delete-task').die().live('click', function(event)
	{
		if (!confirm("Are you sure you want to delete?"))
			return;

		// Get Task id
		var taskId = $(this).attr('data');

		// Get heading of task list
		var taskListId = $(this).closest('.list').attr('id');
		var taskListOwnerId = $(this).closest('.list').find('.list-header').attr('ownerID');

		// Delete Task.
		deleteTask(taskId, taskListId,taskListOwnerId);
	});

	// Task Action: Mark task complete, make changes in DB.
	$('.is-task-complete').die().live('click', function(event)
	{
		// Get Task id
		var taskId = $(this).attr('data');

		// Get heading of task list
		var taskListId = $(this).closest('.list').attr('id');
		var taskListOwnerId = $(this).closest('.list').find('.list-header').attr('ownerID');

		// make task completed.
		completeTask(taskId, taskListId,taskListOwnerId);
	});

	// On click of Time icon in Task edit modal, displays calendar.
	$('.display-due').die().live('click', function(event)
	{
		event.preventDefault();

		// show date picker
		//$('.date', $("#editTaskForm")).datepicker('show');
	});

	/**
	 * Show event of update task modal Activates typeahead for task-edit-modal
	 */
	$('#editTaskModal').on('shown', function()
	{
		var el = $("#editTaskForm");
		agile_type_ahead("update_task_related_to", el, contacts_typeahead);
	});

	/**
	 * Hide event of update task modal. Removes the relatedTo field elements if
	 * any, when the modal is hidden in order to not to show them again when the
	 * modal is shown next
	 * 
	 */
	$('#editTaskModal').on('hidden', function()
	{
		$("#editTaskForm").find("li").remove();
		//$('.date', $("#editTaskForm")).datepicker('hide');
	});

	// Click events to agents dropdown of Owner's list and Criteria's list
	$("ul#owner-tasks li a, ul#type-tasks li a").die().live("click", function(e)
	{
		e.preventDefault();

		// Show selected name
		var name = $(this).html(), id = $(this).attr("href");

		$(this).closest("ul").data("selected_item", id);
		$(this).closest(".btn-group").find(".selected_name").text(name);

		// Get selection from both dropdown
		var criteria = $('#type-tasks').data("selected_item");
		var owner = $('#owner-tasks').data("selected_item");

		// If criteria is not selected then make it default one
		if (!criteria)
			criteria = "CATEGORY";

		// Find array of type's related to criteria in Map
		findDetails(criteria, owner)
	});

	$("ul#owner-tasks li a").die().live("click", function()
	{
		$('.task-heading').html($(this).html() + '&nbsp<small class="tasks-count"></small>');
		
		//pieTasks(getParams()); // Show tasks only when user changes My Tasks vs All Tasks
	});	
});
