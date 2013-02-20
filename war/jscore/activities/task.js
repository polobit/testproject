/**
 * task.js is a script file to deal with all the actions (CRUD) of tasks from
 * client side.
 * 
 * @module Activities
 * 
 * author: Rammohan
 */

$(function() {

	/**
	 * Activates all features of a task form (highlighting the task form,
	 * relatedTo field typeahead, changing color and font-weight) when we click
	 * on task link in activities modal.
	 * 
	 */
	$("#task").click(function(e) {
		e.preventDefault();
		highlight_task();

		var el = $("#taskForm");
		agile_type_ahead("task_related_to", el, contacts_typeahead);
	});

	/**
	 * Shows activity modal with all the task create fields.
	 */
	$(".add-task").live('click', function(e) {
		e.preventDefault();
		$('#activityModal').modal('show');
		highlight_task();
		var el = $("#taskForm");
		agile_type_ahead("task_related_to", el, contacts_typeahead);
	});

	/**
	 * Tasks are categorized into four types (overdue, today, tomorrow and
	 * next-week) while displaying them in client side.Each category has it's
	 * own table, so to edit tasks call update_task function for each category.
	 * 
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
	 * When clicked on update button of task-update-modal, the task will get
	 * updated by calling save_task function
	 * 
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
	});

	/**
	 * Show event of update task modal Activates typeahead for task-update-modal
	 */
	$('#updateTaskModal').on('shown', function() {

		var el = $("#updateTaskForm");
		agile_type_ahead("update_task_related_to", el, contacts_typeahead);
	});

	/**
	 * Date Picker Activates datepicker for task due element
	 */
	$('#task-date-1').datepicker({
		format : 'mm/dd/yyyy'
	});

	/**
	 * Makes the pending task as completed by calling complete_task function
	 * 
	 */
	$('.tasks-select').live('click', function(e) {
		e.stopPropagation();
		if ($(this).is(':checked')) {
			// Complete
			var taskId = $(this).attr('data');
			// complete_task(taskId, $(this));
			complete_task(taskId, $(this).closest('tr'))
		}
	});

	/**
	 * All completed and pending tasks will be shown in separate section
	 */
	/*
	$('#tasks-list').live('click', function(e) {
		this.tasksListView = new Base_Collection_View({
			url : '/core/api/tasks/all',
			restKey : "task",
			templateKey : "tasks-list",
			individual_tag_name : 'tr'
		});
		this.tasksListView.collection.fetch();

		$('#content').html(this.tasksListView.el);

	});*/
});

/**
 * Highlights the task portion of activity modal (Shows task form and hides
 * event form, changes color and font-weight)
 */
function highlight_task() {
	$("#hiddentask").val("task");
	$("#task").css("color", "black");
	$("#event").css("color", "#DD4814");
	$("#relatedEvent").css("display", "none");
	$("#relatedTask").css("display", "block");
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
	if($(saveBtn).attr('disabled'))
		return;
	
	// Disables save button to prevent multiple click event issues
	$(saveBtn).attr('disabled', 'disabled');
	
	if (!isValidForm('#' + formId)){
		
		// Removes disabled attribute of save button
		$(saveBtn).removeAttr('disabled');
		return false;
	}	

	// Show loading symbol until model get saved
	$('#' + modalId).find('span.save-status').html(LOADING_HTML);

	var json = serializeForm(formId);
	if (!isUpdate)
		json.due = new Date(json.due).getTime() / 1000.0;

	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(json, {
		success : function(data) {
			
			// Removes disabled attribute of save button
			$(saveBtn).removeAttr('disabled');
			
			$('#' + formId).each(function() {
				this.reset();
			});

			$('#' + modalId).find('span.save-status img').remove();
			$('#' + modalId).modal('hide');

			var task = data.toJSON();
			if (Current_Route == 'calendar') {
				if (isUpdate)
					App_Calendar.tasksListView.collection.remove(json);

				// Updates task list view
				App_Calendar.tasksListView.collection.add(data);
				App_Calendar.tasksListView.render(true);
			}
			// Updates data to temeline
			else if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {
				
				/*
				 * Verifies whether the added task is related to the contact
				 * in contact detail view or not
				 */ 
				$.each(task.contacts, function(index, contact) {
					if (contact.id == App_Contacts.contactDetailView.model
							.get('id')) {

						/*
						 * Activates timeline in contact detail tab and tab
						 * content
						 */
						activate_timeline_tab();

						/*
						 * If timeline is not defined yet, initiates with the 
						 * data else inserts
						 */
						if (timelineView.collection.length == 0) {
							timelineView.collection.add(data);
							
							setup_timeline(timelineView.collection.toJSON(),
									App_Contacts.contactDetailView.el,
									undefined);
						} else{
							var newItem = $(getTemplate("timeline", data.toJSON()));
							newItem.find('.inner').append('<a href="#" class="open-close"></a>');
							$('#timeline').isotope('insert', newItem);
						}	

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
 * Shows a pop-up modal with pre-filled values to update a task
 * 
 * @method updateTask
 * @param {Object}
 *            ele assembled html object
 * 
 */
function update_task(ele) {
	deserializeForm($(ele).data().toJSON(), $("#updateTaskForm"));

	$("#updateTaskModal").modal('show');
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
		template : 'tasks-model',
		tagName : 'tr',
	});

	// add to the right box - overdue, today, tomorrow etc.
	var due = get_due(base_model.get('due'));
	// console.log(due);
	if (due < 0) {
		$('#overdue', this.el).append(itemView.render().el);
		$('#overdue', this.el).find('tr:last').data(base_model);
		$('#overdue', this.el).show();
		$('#overdue-heading', this.el).show();
		$('#label_color').addClass("label-important");
	}

	// Today
	if (due == 0) {
		$('#today', this.el).append(itemView.render().el);
		$('#today', this.el).find('tr:last').data(base_model);
		$('#today', this.el).show();
		$('#today-heading', this.el).show();
		$('#label_color').addClass("label-warning");
	}

	// Tomorrow
	if (due == 1) {
		$('#tomorrow', this.el).append(itemView.render().el);
		$('#tomorrow', this.el).find('tr:last').data(base_model);
		$('#tomorrow', this.el).show();
		$('#tomorrow-heading', this.el).show();
		$('#label_color').addClass("label-info");
	}

	// Next Week
	if (due > 1) {
		$('#next-week', this.el).append(itemView.render().el);
		$('#next-week', this.el).find('tr:last').data(base_model);
		$('#next-week', this.el).show();
		$('#next-week-heading', this.el).show();
		$('#label_color').addClass("label-inverse");
	}

	// $('#' + this.options.collection_key,
	// this.el).append(itemView.render().el);
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
function complete_task(taskId, ui) {
	console.log("Deleting Task " + taskId);
	var collection = App_Calendar.tasksListView.collection;
	var model = collection.get(taskId);

	var json = model.toJSON();

	// Make contacts null to avoid exception in prepersist (here contacts is
	// array of contact models)
	// Or replace objects with respective ids
	json.contacts = null;
	json.is_complete = true;

	var new_task = new Backbone.Model();
	new_task.url = '/core/api/tasks';
	new_task.save(json, {
		success : function(model, response) {
			App_Calendar.tasksListView.collection.remove(model);

			ui.fadeOut(2000);
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