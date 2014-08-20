/**
 * task.js is a script file to deal with all the actions (CRUD) of tasks from
 * client side.
 * 
 * @module Activities
 * 
 * author: Rammohan
 */

$(function() {
	
	// Loads progress slider in add task / update modal.
	loadProgressSlider($("#taskForm"));
	loadProgressSlider($("#updateTaskForm"));

	/**
	 * To stop propagation to edit page
	 */ 
	$(".activate-link").die().live('click', function(e){
		e.stopPropagation();
	});
	
	/**
	 * Activates all features of a task form (highlighting the task form,
	 * relatedTo field typeahead, changing color and font-weight) when we click
	 * on task link in activities modal.
	 */
	$("#task").click(function(e) {
		e.preventDefault();
		var el = $("#taskForm");
		highlight_task();
		agile_type_ahead("task_related_to", el, contacts_typeahead);
		// Fills owner select element
		populateUsers("owners-list", $("#taskForm"), undefined, undefined,
				function(data) {
					$("#taskForm").find("#owners-list").html(data);
					$("#owners-list", el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
					$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();
		});
	});

	/**
	 * Shows activity modal with all the task create fields.
	 */
	$(".add-task").live('click', function(e) {
		e.preventDefault();

		var el = $("#taskForm");
		
		agile_type_ahead("task_related_to", el, contacts_typeahead);
		$('#activityModal').modal('show');
		highlight_task();
		
		// Fills owner select element
		populateUsers("owners-list", $("#taskForm"), undefined, undefined,
				function(data) {
					$("#taskForm").find("#owners-list").html(data);
					$("#owners-list", el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
					$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();
		});

	});

	/**
	 * Tasks are categorized into four types (overdue, today, tomorrow and
	 * next-week) while displaying them in client side.Each category has it's
	 * own table, so to edit tasks call update_task function for each category.
	 */
	$('#overdue > tr').live('click', function(e) {
		e.preventDefault();
		update_task(this);
	});
	$('#today > tr').live('click', function(e) {
		e.preventDefault();
		update_task(this);
	});
	$('#tomorrow > tr').live('click', function(e) {
		e.preventDefault();
		update_task(this);
	});
	$('#next-week > tr').live('click', function(e) {
		e.preventDefault();
		update_task(this);
	});
	
	/**
	 * Task list edit
	 */
	$('#tasks-list-model-list > tr > td:not(":first-child")').live('click', function(e) {
		e.preventDefault();
		update_task($(this).closest('tr'));
	});
	
	/**
	 * Dash board edit
	 */
	$('#dashboard1-tasks-model-list > tr').live('click', function(e) {
		e.preventDefault();
		update_task(this);
	});

	/**
	 * When clicked on update button of task-update-modal, the task will get
	 * updated by calling save_task function
	 */
	$('#update_task_validate').click(function(e) {
		e.preventDefault();
		save_task('updateTaskForm', 'updateTaskModal', true, this);
	});

	/**
	 * Hide event of update task modal. Removes the relatedTo field elements if
	 * any, when the modal is hidden in order to not to show them again when the
	 * modal is shown next
	 * 
	 */
	$('#updateTaskModal').on('hidden', function() {

		$("#updateTaskForm").find("li").remove();
		
		resetForm($("#updateTaskForm"));

		// Removes note from from task form
		$('#updateTaskForm #forNoteForm').html("");

		// Hide + Add note link
		$(".task-add-note", $("#updateTaskForm")).show();
	});

	/**
	 * Show event of update task modal Activates typeahead for task-update-modal
	 */
	$('#updateTaskModal').on('shown', function() {
		var el = $("#updateTaskForm");
		agile_type_ahead("update_task_related_to", el, contacts_typeahead);
		
		// Fill details in form
		setForm(el);
	});

	/**
	 * Date Picker Activates datepicker for task due element
	 */
	$('#task-date-1').datepicker({
		format : 'mm/dd/yyyy'
	});

	/**
	 * Shows a pop-up modal with pre-filled values to update a task
	 * 
	 * @method updateTask
	 * @param {Object}
	 *            ele assembled html object
	 * 
	 */
	function update_task(ele) {
		var value = $(ele).data().toJSON();
		deserializeForm(value, $("#updateTaskForm"));
		$("#updateTaskModal").modal('show');
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner',
				function(data) {
					$("#updateTaskForm").find("#owners-list").html(data);
					if (value.taskOwner) {
						$("#owners-list", $("#updateTaskForm")).find(
								'option[value=' + value['taskOwner'].id + ']')
								.attr("selected", "selected");
					}
					$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
				});
		
		// Add notes in task modal
		showNoteOnForm("updateTaskForm", value.notes);
	}

	/**
	 * Makes the pending task as completed by calling complete_task function
	 */
	$('.tasks-select').live('click', function(e) {
				e.stopPropagation();
				if ($(this).is(':checked')) {
					// Complete
					var taskId = $(this).attr('data');
					// complete_task(taskId, $(this));
					complete_task(taskId,
							App_Calendar.tasksListView.collection, $(this)
									.closest('tr'))
				}
	});

	/**
	 * All completed and pending tasks will be shown in separate section
	 */
	/*
	 * $('#tasks-list').live('click', function(e) { this.tasksListView = new
	 * Base_Collection_View({ url : '/core/api/tasks/all', restKey : "task",
	 * templateKey : "tasks-list", individual_tag_name : 'tr' });
	 * this.tasksListView.collection.fetch();
	 * 
	 * $('#content').html(this.tasksListView.el);
	 * 
	 * });
	 */
});

/**
 * Highlights the task portion of activity modal (Shows task form and hides
 * event form, changes color and font-weight)
 */
function highlight_task() {
	$("#hiddentask").val("task");
	$("#task").css({"color":"black"});
	$("#event").css({"color":"red"});
	$("#relatedEvent").css("display", "none");
	$("#relatedTask").css("display", "block");
	
	// Date().format('mm/dd/yyyy'));
	$('input.date').val(new Date().format('mm/dd/yyyy')).datepicker('update');
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
function save_task(formId, modalId, isUpdate, saveBtn) {

	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));//$(saveBtn).attr('disabled', 'disabled');

	if (!isValidForm('#' + formId)) {

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
		return false;
	}

	// Show loading symbol until model get saved
	//$('#' + modalId).find('span.save-status').html(LOADING_HTML);
	
	var json = serializeForm(formId);
		
	if (!isUpdate)
		json.due = new Date(json.due).getTime();

	console.log(json);
	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(json, {
		success : function(data) {

			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');

			$('#' + formId).each(function() {
				this.reset();
			});

			//$('#' + modalId).find('span.save-status img').remove();
			$('#' + modalId).modal('hide');

			var task = data.toJSON();
			if (Current_Route == 'calendar') {
				if (isUpdate)
					App_Calendar.tasksListView.collection.remove(json);

				// Updates task list view
				if (!data.toJSON().is_complete && data.toJSON().owner_id == CURRENT_DOMAIN_USER.id)
					App_Calendar.tasksListView.collection.add(data);

				App_Calendar.tasksListView.render(true);

			} else if (Current_Route == 'tasks-old') {
				
				/*	To do without reloading the page should check the condition of (Owner and Category)*/
  				
  				var old_owner_id = $('#content').find('.type-task-button').find(".selected_name").text();
  				var old_type = $('#content').find('.owner-task-button').find(".selected_name").text();

  				if (isUpdate)
					App_Calendar.allTasksListView.collection.remove(json);

  				if((old_owner_id == "All Categories" || old_owner_id.toUpperCase() == json.type) && (old_type == "All Tasks" || json.owner_id == CURRENT_DOMAIN_USER.id))
  					App_Calendar.allTasksListView.collection.add(data);
  				
				App_Calendar.allTasksListView.render(true);
			}
			else if (Current_Route == 'tasks')
			{
				updateTask(isUpdate, data, json);
			}
			// Updates data to temeline
			else if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {
				
				/*
				 * Verifies whether the added task is related to the contact in
				 * contact detail view or not
				 */
				$.each(task.contacts, function(index, contact) {
					if (contact.id == App_Contacts.contactDetailView.model
							.get('id')) {

						// Add model to collection. Disabled sort while adding and called
						// sort explicitly, as sort is not working when it is called by add
						// function
						if (tasksView && tasksView.collection)
						{
							if(tasksView.collection.get(data.id))
							{
								tasksView.collection.get(data.id).set(new BaseModel(data));
							}
							else
							{
								tasksView.collection.add(new BaseModel(data), { sort : false });
								tasksView.collection.sort();
							}
						}
						
						// Activates "Timeline" tab and its tab content in
						// contact detail view
						// activate_timeline_tab();
						add_entity_to_timeline(data);

						return false;
					}
				});
			} else {
				App_Calendar.navigate("calendar", {
					trigger : true
				});
			}
		}
	});
}

/**
 * Get due date of the task to categorize as overdue, today etc..
 * 
 * @method get_due
 * @param {Number}
 *            due of the task
 * 
 */
function get_due(due) {
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
	heading.find('.count').text("(" + count +  ")");
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
function append_tasks(base_model) {
	
	var itemView = new Base_List_View({
		model : base_model,
		"view" : "inline",
		template : this.options.templateKey + "-model",
		tagName : 'tr',
	});

	
	// add to the right box - overdue, today, tomorrow etc.
	var due = get_due(base_model.get('due'));
	if (due < 0) {
		
		var heading = $('#overdue-heading', this.el);
		var count = increaseCount(heading) 
		
		if(count > 5)
		{
			return;
		}
		$('#overdue', this.el).append(itemView.render().el);
		if(count ==5) $('#overdue', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#overdue', this.el).find('tr:last').data(base_model);
		$('#overdue', this.el).parent('table').css("display","block");
		heading.show();
		$('#overdue', this.el).show();
	}

	// Today
	if (due == 0) {
		
		var heading = $('#today-heading', this.el);
		var count = increaseCount(heading); 
		if(count > 5)
		{
			return;
		}
		if($('#today > tr', this.el).length > 4)
			return;
		
		$('#today', this.el).append(itemView.render().el);
		if(count ==5) $('#today', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#today', this.el).find('tr:last').data(base_model);
		$('#today', this.el).parent('table').css("display","block");
		$('#today', this.el).show();
		$('#today-heading', this.el).show();
	}

	// Tomorrow
	if (due == 1) {
		var heading = $('#tomorrow-heading', this.el);
		var count = increaseCount(heading); 
		if(count > 5)
		{
			return;
		}
		
		$('#tomorrow', this.el).append(itemView.render().el);
		if(count ==5) $('#tomorrow', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#tomorrow', this.el).find('tr:last').data(base_model);
		$('#tomorrow', this.el).parent('table').css("display","block");
		$('#tomorrow', this.el).show();
		$('#tomorrow-heading', this.el).show();
	}

	// Next Week
	if (due > 1) {
		var heading = $('#next-week-heading', this.el);
		var count = increaseCount(heading); 
		if(count > 5)
		{
			return;
		}
		
		$('#next-week', this.el).append(itemView.render().el);
		if(count ==5) $('#next-week', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#next-week', this.el).find('tr:last').data(base_model);
		$('#next-week', this.el).parent('table').css("display","block");
		$('#next-week', this.el).show();
		$('#next-week-heading', this.el).show();
	}

}


//dash board tasks based on conditions..
function append_tasks_dashboard(base_model) {
	
	var itemView = new Base_List_View({
		model : base_model,
		"view" : "inline",
		template : this.options.templateKey + "-model",
		tagName : 'tr',
	
	});
	
	var due = get_due(base_model.get('due'));

	var pendingTask = base_model.get("is_complete");
	
	if(pendingTask == false && due <= 0)
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
function complete_task(taskId, collection, ui, callback) {

	var taskJSON = collection.get(taskId).toJSON();
	// Replace contacts object with contact ids
	var contacts = [];
	$.each(taskJSON.contacts, function(index, contact) {
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
	new_task.save(taskJSON, {
		success : function(model, response) {
			collection.remove(model);

			if (ui)
				ui.fadeOut(2000);

			if (callback && typeof (callback) === "function") {
				// execute the callback, passing parameters as necessary
				callback(model);
			}
		}
	});

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