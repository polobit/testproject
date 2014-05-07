$(function()
{
	// Main Collection
	tasksListCollection = null;

	// Url Map After selection from filter
	urlMap = { "PRIORITY" : { "type" : [
			"HIGH", "LOW", "NORMAL"
	], "searchKey" : "priority_type" }, "CATEGORY" : { "type" : [
			"EMAIL", "CALL", "SEND", "TWEET", "FOLLOW_UP", "MEETING", "MILESTONE", "OTHER"
	], "searchKey" : "type" }, "STATUS" : { "type" : [
			"NOT_STARTED", "IN_PROGRESS", "COMPLETED", "PAUSED"
	], "searchKey" : "status" }, "DUE" : { "type" : [
			"TODAY", "TOMORROW", "OVERDUE", "LATER"
	], "searchKey" : "due" }, "OWNER" : { "type" : [], "searchKey" : "taskOwner.name" } };

	// Get user's name and id to add in urlMap for owner of task, user name can
	// be redundant so we need user's id too.
	$.getJSON('/core/api/users', function(users)
	{
		console.log(users);
		for ( var i in users)
		{
			urlMap.OWNER.type[i] = { "name" : users[i].name, "id" : users[i].id };
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

	// Save edited task
	$('#edit_task_validate').click(function(e)
	{
		e.preventDefault();

		// Save task
		save_task('editTaskForm', 'editTaskModal', true, this);
	});

	/*
	 * Task Action: Delete task from UI as well as DB. Need to do this manually
	 * because nested collection can not perform default functions.
	 */
	$('.delete-task').die().live('click', function(event)
	{
		if (!confirm("Are you sure you want to delete?"))
			return;

		// Delete Task.
		deleteTask(getTaskId(this), getTaskListId(this), getTaskListOwnerId(this));
	});

	// Task Action: Mark task complete, make changes in DB.
	$('.is-task-complete').die().live('click', function(event)
	{
		event.preventDefault();

		// make task completed.
		completeTask(getTaskId(this), getTaskListId(this), getTaskListOwnerId(this));
	});

	// Task Action: Open Task Edit Modal and display details in it.
	$('.edit-task, .task-body, .task-due-time').die().live('click', function(event)
	{
		event.preventDefault();

		// Show and Fill details in Task Edit modal
		editTask(getTaskId(this), getTaskListId(this), parseInt(getTaskListOwnerId(this)));
	});

	/**
	 * Show event of update task modal Activates typeahead for task-edit-modal
	 */
	$('#editTaskModal').on('shown', function()
	{
		var el = $("#editTaskForm");
		agile_type_ahead("update_task_related_to", el, contacts_typeahead);

		// Make btn selected as per previous priority
		$("span.[value=" + $("#editTaskForm #priority_type").val() + "]").addClass("btn");

		// Make btn selected as per previous status
		$("span.[value=" + $("#editTaskForm #status").val() + "]").addClass("btn");

		// Loads progress slider in task sedit modal.
		loadProgressSlider(el);
	});

	/**
	 * Hide event of update task modal. Removes the relatedTo field elements if
	 * any, when the modal is hidden in order to not to show them again when the
	 * modal is shown next
	 * 
	 */
	$('#editTaskModal').on('hidden', function()
	{
		// Empty contact list and owner list
		$("#editTaskForm").find("li").remove();

		// Remove btn class from all other priority
		$(".priority-btn").removeClass("btn");

		// Remove btn class from all other status
		$(".status-btn").removeClass("btn");
	});

	// Click events to agents dropdown of Owner's list and Criteria's list
	$("ul#owner-tasks li a, ul#type-tasks li a").die().live("click", function(e)
	{
		e.preventDefault();

		// Show selected name
		var name = $(this).html(), id = $(this).attr("href");

		$(this).closest("ul").data("selected_item", id);
		$(this).closest(".btn-group").find(".selected_name").text(name);

		// Get selection from owner's dropdown
		var owner = $('#owner-tasks').data("selected_item");

		// Find array of type's related to criteria in Map
		findDetails(getCriteria(), owner);
	});

	// Change page heading as per owner selection
	$("ul#owner-tasks li a").die().live("click", function()
	{
		// Change page heading
		$('.task-heading').html($(this).html() + '&nbsp<small class="tasks-count"></small>');
	});

	/*
	 * In edit task modal, on selection of priority change input field as well
	 * as change btn
	 */
	$(".priority-btn").die().live("click", function()
	{
		// Remove btn class from all other priority
		$(".priority-btn").removeClass("btn");

		// Add btn class to selected priority
		$(this).addClass("btn priority-btn");

		// Add priority to input field
		$("#editTaskForm #priority_type").val($(this).attr("value"));
	});

	/*
	 * In edit task modal, on selection of status change input field as well as
	 * change btn
	 */
	$(".status-btn").die().live("click", function()
	{
		console.log($(this).attr("value"));

		// Change status UI and input field
		changeStatus($(this).attr("value"), true);
	});

	/*
	 * If is complete true so make status and progress UI and input field
	 * changes.
	 */
	$("#is_complete").die().live("click", function()
	{
		console.log($(this).is(':checked'));

		// Change UI and input field
		changeStatusProgress($(this).is(':checked'));
	});

});
