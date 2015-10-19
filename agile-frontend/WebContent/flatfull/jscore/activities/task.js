/**
 * task.js is a script file to deal with all the actions (CRUD) of tasks from
 * client side.
 * 
 * @module Activities
 * 
 * author: Rammohan
 */

$( document ).ready(function() {
	/**
	 * Makes the pending task as completed by calling complete_task function
	 */
	$("body").on("click", '.tasks-select', function(e)
	{
		e.stopPropagation();
		if ($(this).is(':checked'))
		{
			// Complete
			var taskId = $(this).attr('data');
			// complete_task(taskId, $(this));
			complete_task(taskId, App_Calendar.tasksListView.collection, $(this).closest('tr'))
		}
	});

	/**
	 * Shows activity modal with all the task create fields.
	 */
	$("body").on("click", '.add-task', function(e)
	{
		e.preventDefault();

		// Show task modal with owners list.
		showTaskModal(this);
	});
	/**
	 * Show event of update task modal Activates typeahead for task-update-modal
	 */
	$('#updateTaskModal').on('shown.bs.modal', function()
	{

		var el = $("#updateTaskForm");
		agile_type_ahead("update_task_related_to", el, contacts_typeahead);

		agile_type_ahead("update_task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

		// Fill details in form
		setForm(el);

		/*if($('#updateTaskModal').find('.update-task-related-contacts-input').find('ul').find('li').length>0 
			|| (Current_Route.indexOf("task")==0 && readCookie("task_tab_position")=="contacts"))
		{
			$('#updateTaskModal').find('#update-task-related-contacts-label').parent().addClass('hide');
			$('#updateTaskModal').find('.update-task-related-contacts-input').removeClass('hide');
			$('#updateTaskModal').find('.update-task-related-contacts-label').removeClass('hide');
		}
		else
		{
			$('#updateTaskModal').find('#update-task-related-contacts-label').parent().removeClass('hide');
			$('#updateTaskModal').find('.update-task-related-contacts-input').addClass('hide');
			$('#updateTaskModal').find('.update-task-related-contacts-label').addClass('hide');
		}
		if($('#updateTaskModal').find('.update-task-related-deals-input').find('ul').find('li').length>0 
			|| (Current_Route.indexOf("task")==0 && readCookie("task_tab_position")=="deals"))
		{
			$('#updateTaskModal').find('#update-task-related-deals-label').parent().addClass('hide');
			$('#updateTaskModal').find('.update-task-related-deals-input').removeClass('hide');
			$('#updateTaskModal').find('.update-task-related-deals-label').removeClass('hide');
		}
		else
		{
			$('#updateTaskModal').find('#update-task-related-deals-label').parent().removeClass('hide');
			$('#updateTaskModal').find('.update-task-related-deals-input').addClass('hide');
			$('#updateTaskModal').find('.update-task-related-deals-label').addClass('hide');
		}*/

	});

	/*$('#activityTaskModal').on('click', '#new-task-related-contacts-label', function(e){
		e.preventDefault();
		$(this).parent().parent().find('.new-task-related-contacts-input').removeClass('hide');
		$(this).parent().parent().find('.new-task-related-contacts-label').removeClass('hide');
		$(this).parent().addClass('hide');
	});

	$('#activityTaskModal').on('click', '#new-task-related-deals-label', function(e){
		e.preventDefault();
		$(this).parent().parent().find('.new-task-related-deals-input').removeClass('hide');
		$(this).parent().parent().find('.new-task-related-deals-label').removeClass('hide');
		$(this).parent().addClass('hide');
	});

	$('#updateTaskModal').on('click', '#update-task-related-contacts-label', function(e){
		e.preventDefault();
		$(this).parent().parent().find('.update-task-related-contacts-input').removeClass('hide');
		$(this).parent().parent().find('.update-task-related-contacts-label').removeClass('hide');
		$(this).parent().addClass('hide');
	});

	$('#updateTaskModal').on('click', '#update-task-related-deals-label', function(e){
		e.preventDefault();
		$(this).parent().parent().find('.update-task-related-deals-input').removeClass('hide');
		$(this).parent().parent().find('.update-task-related-deals-label').removeClass('hide');
		$(this).parent().addClass('hide');
	});*/

});


function activateSliderAndTimerToTaskModal(){

	$('.update-task-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false });
	$('.update-task-timepicker').timepicker().on('show.timepicker', function(e)
	{
		if ($('.update-task-timepicker').prop('value') != "" && $('.update-task-timepicker').prop('value') != undefined)
		{
			if ($('.update-task-timepicker').prop('value').split(":")[0] != undefined)
				e.time.hours = $('.update-task-timepicker').prop('value').split(":")[0];
			if ($('.update-task-timepicker').prop('value').split(":")[0] != undefined)
				e.time.minutes = $('.update-task-timepicker').prop('value').split(":")[1];
		}
		$('.bootstrap-timepicker-hour').val(e.time.hours);
		$('.bootstrap-timepicker-minute').val(e.time.minutes);
	});
	$('.new-task-timepicker').timepicker({ defaultTime : '12:00', showMeridian : false });
	$('.new-task-timepicker').timepicker().on('show.timepicker', function(e)
	{
		if ($('.new-task-timepicker').prop('value') != "" && $('.new-task-timepicker').prop('value') != undefined)
		{
			if ($('.new-task-timepicker').prop('value').split(":")[0] != undefined)
				e.time.hours = $('.new-task-timepicker').prop('value').split(":")[0];
			if ($('.new-task-timepicker').prop('value').split(":")[0] != undefined)
				e.time.minutes = $('.new-task-timepicker').prop('value').split(":")[1];
		}
		$('.bootstrap-timepicker-hour').val(e.time.hours);
		$('.bootstrap-timepicker-minute').val(e.time.minutes);
	});

	// Loads progress slider in add task / update modal.
	loadProgressSlider($("#taskForm"));
	loadProgressSlider($("#updateTaskForm"));

	/**
	 * Date Picker Activates datepicker for task due element
	 */

	$('#task-date-1').datepicker({ format : CURRENT_USER_PREFS.dateFormat , weekStart : CALENDAR_WEEK_START_DAY});
	$('#update-task-date-1').datepicker({ format : CURRENT_USER_PREFS.dateFormat , weekStart : CALENDAR_WEEK_START_DAY});


	/**
	 * When clicked on update button of task-update-modal, the task will get
	 * updated by calling save_task function
	 */
	$('#updateTaskModal #update_task_validate').off('click');
	$("#updateTaskModal").on("click", '#update_task_validate', function(e)
	{
		e.preventDefault();
		save_task('updateTaskForm', 'updateTaskModal', true, this);
	});

	/**
	 * initialises task time picker
	 */
	$('#updateTaskModal').off('hidden.bs.modal');
	$('#updateTaskModal').on('hidden.bs.modal', function()
	{

		if ($(this).hasClass('in'))
		{
			return;
		}

		$("#updateTaskForm").find("li").remove();

		resetForm($("#updateTaskForm"));

		// Removes note from from task form
		$('#updateTaskForm #forNoteForm').html("");

		// Hide + Add note link
		$(".task-add-note", $("#updateTaskForm")).show();
	});

}

function initializeTasksListeners(){
		
	activateSliderAndTimerToTaskModal();

	/**
	 * All completed and pending tasks will be shown in separate section
	 */
	/*
	 * $('#tasks-list').on('click', function(e) { this.tasksListView = new
	 * Base_Collection_View({ url : '/core/api/tasks/all', restKey : "task",
	 * templateKey : "tasks-list", individual_tag_name : 'tr' });
	 * this.tasksListView.collection.fetch();
	 * 
	 * $('#content').html(this.tasksListView.el);
	 * 
	 * });
	 */

	 $('#tasks-list-template').on('mouseenter', '.listed-task', function(e)
	{
		$(this).find(".task-actions").css("display", "block");
		$(this).find(".task-note-action").hide();
	});

	// Hide task actions
	$('#tasks-list-template').on('mouseleave', '.listed-task', function(e)
	{
		$(this).find(".task-actions").css("display", "none");
		$(this).find(".task-note-action").show();
	});

	/*
	 * Task Action: Delete task from UI as well as DB. Need to do this manually
	 * because nested collection can not perform default functions.
	 */
	$('#tasks-list-template').on('click', '.delete-task', function(event)
	{
		if (!confirm("Are you sure you want to delete?"))
			return;

		// Delete Task.
		deleteTask(getTaskId(this), getTaskListId(this), getTaskListOwnerId(this));
	});

	// Task Action: Mark task complete, make changes in DB.
	$('#tasks-list-template').on('click', '.is-task-complete', function(event)
	{
		event.preventDefault();

		// make task completed.
		completeTask(getTaskId(this), getTaskListId(this), getTaskListOwnerId(this));
	});

	// Task Action: Open Task Edit Modal and display details in it.
	$('#tasks-list-template').on('click', '.edit-task', function(event)
	{
		event.preventDefault();

		// Show and Fill details in Task Edit modal
		editTask(getTaskId(this), getTaskListId(this), parseInt(getTaskListOwnerId(this)));
	});
	
	

	/*
	 * In new/update task modal, on selection of status, show progress slider
	 * and change %
	 */
		
	$('#tasks-list-template').on('click', '.group-view', function(event)
	{
		event.preventDefault();
		console.log("group-view event");
				
		// Change UI and input field
		applyDetailsFromGroupView();
	});	

	
}

$("body").on("change", '.status', function()
	{
		console.log("status change event");
		
		// Change status UI and input field
		changeStatus($(this).val(), $(this).closest("form"));
	});	


/**
 * Highlights the task portion of activity modal (Shows task form and hides
 * event form, changes color and font-weight)
 */
function highlight_task()
{
	$("#hiddentask").val("task");
	$("#task").css({ "color" : "black" });
	$("#event").css({ "color" : "red" });
	$("#relatedEvent").css("display", "none");
	$("#relatedTask").css("display", "block");

	if ($("#activityForm").find("#event_related_to").closest(".controls").find("ul").children())
		$("#taskForm").find("#task_related_to").closest(".controls").find("ul").html(
				$("#activityForm").find("#event_related_to").closest(".controls").find("ul").children());

	// Date().format('mm/dd/yyyy'));
	$('input.date').val(getDateInFormat(new Date())).datepicker('update');
}

/**
 * Creates or updates a task and adds the saved object to the suitable
 * collection by verifying the current window location.
 * 
 * @protected
 * @method save_task
 * @param {String}
 *            formId the unique id for the form to identify it
 * @param {String}
 *            modalId the unique id for the modal to identify it
 * @param {Boolean}
 *            isUpdate the boolean value to identify weather saving the new one
 *            or updating the existing one
 * 
 */
function save_task(formId, modalId, isUpdate, saveBtn)
{

	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));// $(saveBtn).attr('disabled', 'disabled');

	if (!isValidForm('#' + formId))
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');
		return false;
	}

	// Show loading symbol until model get saved
	// $('#' + modalId).find('span.save-status').html(LOADING_HTML);

	var json = serializeForm(formId);

	if (!isUpdate)
		json.due = new Date(json.due).getTime();
	
	if(isUpdate){
		
		if($('#'+formId).find('ul#notes').length>0){
			var notes = [];
			$('#'+formId+' li.task-note').each(function()
			{
				notes.push($(this).attr('data'));
			});

			console.log(notes);

			json.notes = notes;
		}
	}
	var startarray = (json.task_ending_time).split(":");
	json.due = new Date((json.due) * 1000).setHours(startarray[0], startarray[1]) / 1000.0;

	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask
			.save(
					json,
					{ success : function(data)
					{

						// Removes disabled attribute of save button
						enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');

						$('#' + formId).each(function()
						{
							this.reset();
						});

						// $('#' + modalId).find('span.save-status
						// img').remove();
						$('#' + modalId).modal('hide');

						var task = data.toJSON();

						getDueTasksCount(function(count){

								var due_task_count = count;

								if (due_task_count == 0)
									$(".navbar_due_tasks").css("display", "none");
								else
									$(".navbar_due_tasks").css("display", "inline-block");
								if(due_task_count !=0)
									$('#due_tasks_count').html(due_task_count);
								else
									$('#due_tasks_count').html("");

						});
						

						if (Current_Route == 'calendar')
						{
							if (isUpdate)
								App_Calendar.tasksListView.collection.remove(json);

							// Updates task list view
							if (!data.toJSON().is_complete && data.toJSON().owner_id == CURRENT_DOMAIN_USER.id)
								App_Calendar.tasksListView.collection.add(data);

							App_Calendar.tasksListView.render(true);

						}
						else if (Current_Route == 'tasks-old')
						{

							/*
							 * To do without reloading the page should check the
							 * condition of (Owner and Category)
							 */

							var old_owner_id = $('#content').find('.type-task-button').find(".selected_name").text();
							var old_type = $('#content').find('.owner-task-button').find(".selected_name").text();

							if (isUpdate)
								App_Calendar.allTasksListView.collection.remove(json);

							if ((old_owner_id == "All Categories" || old_owner_id.toUpperCase() == json.type) && (old_type == "All Tasks" || json.owner_id == CURRENT_DOMAIN_USER.id))
								App_Calendar.allTasksListView.collection.add(data);

							App_Calendar.allTasksListView.render(true);
						}
						else if (Current_Route == 'tasks')
						{
							var criteria = getCriteria();

							if (criteria == "LIST")
							{
								if (isUpdate)
									App_Calendar.allTasksListView.collection.remove(json);

								App_Calendar.allTasksListView.collection.add(data);
								App_Calendar.allTasksListView.render(true);
								return;
							}

							updateTask(isUpdate, data, json);
						}
						// Updates data to temeline
						else if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
						{

							/*
							 * Verifies whether the added task is related to the
							 * contact in contact detail view or not
							 */
							$.each(task.contacts, function(index, contact)
							{
								if (contact.id == App_Contacts.contactDetailView.model.get('id'))
								{

									// Add model to collection. Disabled sort
									// while adding and called
									// sort explicitly, as sort is not working
									// when it is called by add
									// function
									if (tasksView && tasksView.collection)
									{
										if (tasksView.collection.get(data.id))
										{
											tasksView.collection.get(data.id).set(new BaseModel(data));
										}
										else
										{
											tasksView.collection.add(new BaseModel(data), { sort : false });
											tasksView.collection.sort();
										}
									}

									// Activates "Timeline" tab and its tab
									// content in
									// contact detail view
									// activate_timeline_tab();
									add_entity_to_timeline(data);

									return false;
								}
							});
						}
						else if (App_Portlets.currentPosition && App_Portlets.tasksCollection && App_Portlets.tasksCollection[parseInt(App_Portlets.currentPosition)] && (Current_Route == undefined || Current_Route == 'dashboard'))
						{
							if (isUpdate)
								App_Portlets.tasksCollection[parseInt(App_Portlets.currentPosition)].collection.remove(json);

							// Updates task list view
							App_Portlets.tasksCollection[parseInt(App_Portlets.currentPosition)].collection.add(data);

							App_Portlets.tasksCollection[parseInt(App_Portlets.currentPosition)].render(true);

						}
						else if (App_Deal_Details.dealDetailView && Current_Route == "deal/" + App_Deal_Details.dealDetailView.model.get('id'))
						{

							/*
							 * Verifies whether the added task is related to the
							 * deal in deal detail view or not
							 */
							$.each(task.deal_ids, function(index, deal_id)
							{
								if (deal_id == App_Deal_Details.dealDetailView.model.get('id'))
								{

									// Add model to collection. Disabled sort
									// while adding and called
									// sort explicitly, as sort is not working
									// when it is called by add
									// function
									if (dealTasksView && dealTasksView.collection)
									{
										if (dealTasksView.collection.get(data.id))
										{
											dealTasksView.collection.get(data.id).set(new BaseModel(data));
										}
										else
										{
											dealTasksView.collection.add(new BaseModel(data), { sort : false });
											dealTasksView.collection.sort();
										}
									}
									dealTasksView.render(true);
									return false;
								}
							});
						}
						else
						{

							if (App_Calendar.allTasksListView)
							{
								App_Calendar.allTasksListView.collection.remove(data.toJSON());
								App_Calendar.allTasksListView.collection.add(data.toJSON());
								App_Calendar.allTasksListView.render(true);
							}
							else if (App_Calendar.tasksListView)
							{
								App_Calendar.tasksListView.collection.remove(data.toJSON());
								App_Calendar.tasksListView.collection.add(data.toJSON());
								App_Calendar.tasksListView.render(true);
							}
							else
								App_Tasks.navigate("task/" + task.id, { trigger : true });
							taskDetailView = data;

							getTemplate("task-detail", data.toJSON(), undefined, function(template_ui){
								if(!template_ui)
									  return;
								$('#content').html($(template_ui));	
								task_details_tab.loadActivitiesView();
								initializeTaskDetailListeners();
							}, "#content");
						}
						
					} });
}

/**
 * Get due date of the task to categorize as overdue, today etc..
 * 
 * @method get_due
 * @param {Number}
 *            due of the task
 * 
 */
function get_due(due)
{
	// Get Todays Date
	var date = new Date();
	date.setHours(0, 0, 0, 0);

	date = date.getTime() / 1000;
	// console.log("Today " + date + " Due " + due);
	return Math.floor((due - date) / (24 * 3600));
}

function increaseCount(heading)
{
	var count = heading.find('.count').attr('count');

	count = count ? parseInt(count) + 1 : 1;
	heading.find('.count').attr('count', count);
	heading.find('.count').text("(" + count + ")");
	return count;
}
/**
 * Based on due date arranges the tasks UI
 * 
 * @method append_tasks
 * @param {Object}
 *            base_model task model
 * 
 */
function append_tasks(base_model)
{

	var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr', });

	// add to the right box - overdue, today, tomorrow etc.
	var due = get_due(base_model.get('due'));
	if (due < 0)
	{

		var heading = $('#overdue-heading', this.el);
		var count = increaseCount(heading)

		if (count > 5)
		{
			return;
		}
		$('#overdue', this.el).append(itemView.render().el);
		if (count == 5)
			$('#overdue', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#overdue', this.el).find('tr:last').data(base_model);
		$('#overdue', this.el).parent('table').css("display", "block");
		heading.show();
		$('#overdue', this.el).show();
	}

	// Today
	if (due == 0)
	{

		var heading = $('#today-heading', this.el);
		var count = increaseCount(heading);
		if (count > 5)
		{
			return;
		}
		if ($('#today > tr', this.el).length > 4)
			return;

		$('#today', this.el).append(itemView.render().el);
		if (count == 5)
			$('#today', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#today', this.el).find('tr:last').data(base_model);
		$('#today', this.el).parent('table').css("display", "block");
		$('#today', this.el).show();
		$('#today-heading', this.el).show();
	}

	// Tomorrow
	if (due == 1)
	{
		var heading = $('#tomorrow-heading', this.el);
		var count = increaseCount(heading);
		if (count > 5)
		{
			return;
		}

		$('#tomorrow', this.el).append(itemView.render().el);
		if (count == 5)
			$('#tomorrow', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#tomorrow', this.el).find('tr:last').data(base_model);
		$('#tomorrow', this.el).parent('table').css("display", "block");
		$('#tomorrow', this.el).show();
		$('#tomorrow-heading', this.el).show();
	}

	// Next Week
	if (due > 1)
	{
		var heading = $('#next-week-heading', this.el);
		var count = increaseCount(heading);
		if (count > 5)
		{
			return;
		}

		$('#next-week', this.el).append(itemView.render().el);
		if (count == 5)
			$('#next-week', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#next-week', this.el).find('tr:last').data(base_model);
		$('#next-week', this.el).parent('table').css("display", "block");
		$('#next-week', this.el).show();
		$('#next-week-heading', this.el).show();
	}

}

// dash board tasks based on conditions..
function append_tasks_dashboard(base_model)
{

	var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr',

	});

	var due = get_due(base_model.get('due'));

	var pendingTask = base_model.get("is_complete");

	if (pendingTask == false && due <= 0)
		$('#dashboard1-tasks-model-list', this.el).append(itemView.render().el);

}

/**
 * 
 * Turns the pending task as completed
 * 
 * @method complete_task
 * @param {Number}
 *            taskId to get the task from the collection
 * @param {Object}
 *            ui html Object to remove on success of the deletion
 * 
 */
function complete_task(taskId, collection, ui, callback)
{

	var taskJSON = collection.get(taskId).toJSON();
	// Replace contacts object with contact ids
	var contacts = [];
	$.each(taskJSON.contacts, function(index, contact)
	{
		contacts.push(contact.id);
	});

	console.log(taskJSON.notes);

	// Replace notes object with note ids
	var notes = [];
	$.each(taskJSON.notes, function(index, note)
	{
		notes.push(note.id);
	});

	console.log(notes);

	taskJSON.notes = notes;
	taskJSON.note_description = "";
	taskJSON.contacts = contacts;
	taskJSON.is_complete = true;
	taskJSON.status = "COMPLETED";
	taskJSON.progress = 100;
	taskJSON.owner_id = taskJSON.taskOwner.id;

	var new_task = new Backbone.Model();
	new_task.url = '/core/api/tasks';
	new_task.save(taskJSON, { success : function(model, response)
	{
		if(!Current_Route)
			  Current_Route = "/";

		if (Current_Route.indexOf("contact/") > -1)
		{
			collection.get(taskId).set(model);
		}
		else
		{
			collection.remove(model);
		}

		getDueTasksCount(function(due_task_count){

			if (due_task_count == 0)
			$(".navbar_due_tasks").css("display", "none");
			else
				$(".navbar_due_tasks").css("display", "inline-block");
			if(due_task_count !=0)
				$('#due_tasks_count').html(due_task_count);
			else
				$('#due_tasks_count').html("");
		
		});

		
		if (ui)
			ui.fadeOut(500);

		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as necessary
			callback(model);
		}
	} });

	// Set is complete flag to be true
	/*
	 * model.url = '/core/api/tasks'; model.set({'is_complete': true}, {silent:
	 * true}); // Destroy and hide the task model.save([],{success:
	 * function(model, response) { // Remove model from the collection
	 * App_Calendar.tasksListView.collection.remove(model);
	 * 
	 * //ui.closest('tr').slideUp('slow');
	 * 
	 * ui.fadeOut(2000); }} );
	 */

}

/**
 * 
 * @returns due tasks count upto today
 */
function getDueTasksCount(callback)
{
	accessUrlUsingAjax('core/api/tasks/overdue/uptotoday', function(response){
			if (!isNaN(response))
			{
				return callback(response);
			}
			return callback(0);

	});
}

/**
 * Show task modal with owners list and typeahead event.
 */
function showTaskModal(forAddTask)
{
	var el = $("#taskForm");

	agile_type_ahead("task_related_to", el, contacts_typeahead);
	// Deals type-ahead
	agile_type_ahead("task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
	$('#activityTaskModal').modal('show');
	highlight_task();
	categories.getCategoriesHtml(undefined,function(catsHtml){
		$('#type',el).html(catsHtml);
		// Fills owner select element
		populateUsers("owners-list", $("#taskForm"), undefined, undefined, function(data)
		{
			$("#taskForm").find("#owners-list").html(data);
			$("#owners-list", el).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
			$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();
	
			// Add selected task list details in add task modal
			addTasklListDetails(forAddTask);
		});
	});
}
