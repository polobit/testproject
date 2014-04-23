$(function()
{
	console.log("In test.js");

	// Main Collection
	tasksListCollection = null;
	/* Url Map After selection from filter
	 * urlMap =[{"Priority":
	 * [{"High":"highurl"},{"Low":"lowurl"},{"Normal":"normalurl"}]},
	 * {"Category":
	 * [{"Email":"emailurl"},{"Low":"lowurl"},{"Normal":"normalurl"}]},
	 * {"Status":
	 * [{"Email":"emailurl"},{"Low":"lowurl"},{"Normal":"normalurl"}]}, 
	 * {"Due":
	 * [{"Email":"emailurl"},{"Low":"lowurl"},{"Normal":"normalurl"}]} ];
	 */

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
		var taskListId;
		
		if ($(this).hasClass('task-body'))
		{
			taskId = $(this).parent().attr('id');
			taskListId = $(this).find('.task-type').html();
		}
		else
		{
			taskId = $(this).attr('data');
			taskListId = $(this).parent().parent().parent().find('.task-type').html();
		}

		console.log("task-body");
		console.log(taskId);

		// Show Task View Modal
		viewTask(taskId, taskListId);
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

		var taskListId = $(this).parent().parent().parent().find('.task-type').html();

		editTask(taskId, taskListId);
	});

	/*
	 * Task Action: Delete task from UI as well as DB. Need to do this manually because
	 * nested collection can not perform default functions.
	 */
	$('.delete-task').die().live('click', function(event)
	{
		if (!confirm("Are you sure you want to delete?"))
			return;

		var taskId = $(this).attr('data');

		var taskListId = $(this).parent().parent().parent().find('.task-type').html();

		// Delete Task.
		deleteTask(taskId, taskListId);
	});

	//Task Action: Mark task complete, make changes in DB.
	$('.is-task-complete').die().live('click', function(event)
	{
		var taskId = $(this).attr('data');

		var taskListId = $(this).parent().parent().parent().find('.task-type').html();

		// make task completed.
		completeTask(taskId, taskListId);
	});

	// On click of Time icon in Task edit modal, displays clender.
	$('.display-due').die().live('click', function(event)
	{
		event.preventDefault();
		
		// show date picker
		$('.date', $("#editTaskForm")).datepicker('show');
	});

	/**
	 * Show event of update task modal Activates typeahead for task-update-modal
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
	});
	
	// Click events to agents dropdown and department
	$("ul#owner-tasks li a, ul#type-tasks li a").die().live("click", function(e) {
				e.preventDefault();

				// Show selected name
				var name = $(this).html(), id = $(this).attr("href");

				$(this).closest("ul").data("selected_item", id);
				$(this).closest(".btn-group").find(".selected_name")
						.text(name);
				var url = getParams();
				//updateData(url);
				console.log(url);
	});	
	
});
