/**
 * task timeline plugin
 * 
 * @auther jitendra
 */
// global task details model
var taskDetailView;
var task_tab_position_cookie_name = "task_tab_position";
var TaskDetailsRouter = Backbone.Router.extend({ routes : { 'task/:id' : 'taskDetailView' },

taskDetailView : function(id)
{

	if (id)
	{
		if (App_Calendar.allTasksListView)
		{
			var task = App_Calendar.allTasksListView.collection.get(id);
			taskDetailView = task;
			getTemplate("task-detail", task.toJSON(), undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	

				initializeTaskDetailListeners();
				task_details_tab.loadActivitiesView();

			}, "#content");
			

		}
		else if (App_Calendar.tasksListView)
		{
			var task = App_Calendar.tasksListView.collection.get(id);
			if (task)
			{
				taskDetailView = task;
				getTemplate("task-detail", task.toJSON(), undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					initializeTaskDetailListeners();
					task_details_tab.loadActivitiesView();
				}, "#content");
			}
			else
			{
				var taskModel = Backbone.Model.extend({});
				$.ajax({ url : "core/api/tasks/getTaskObject/" + id, success : function(response)
				{
					taskDetailView = new taskModel(response);
					getTemplate("task-detail", taskDetailView.toJSON(), undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	

						initializeTaskDetailListeners();
						task_details_tab.loadActivitiesView();
					}, "#content");					
				} });
			}
		}
		else
		{
			var taskModel = Backbone.Model.extend({});
			$.ajax({ url : "core/api/tasks/getTaskObject/" + id, success : function(response)
			{
				taskDetailView = new taskModel(response);

				getTemplate("task-detail", taskDetailView.toJSON(), undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					initializeTaskDetailListeners();
					task_details_tab.loadActivitiesView();
				}, "#content");				
			} });

		}
	}

}

});

function initializeTaskDetailListeners(){

	var id;

	/**
	 * Activates the Timeline tab-content to show the time-line with all
	 * details, which are already added to time-line, when the task is getting
	 * to its detail view.
	 */
	$('#task-tab-container-header #taskDetailsTab a[href="#timeline"]').off();
	$('#task-tab-container-header').on('click', '#taskDetailsTab a[href="#timeline"]', function(e) 
	{
		e.preventDefault();

		save_task_tab_position_in_cookie("timeline");

		task_details_tab.load_timeline();
	});

	/**
	 * Fetches all the notes related to the task and shows the notes collection
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */
	$('#task-tab-container-header #taskDetailsTab a[href="#notes"]').off();
	$('#task-tab-container-header').on('click', '#taskDetailsTab a[href="#notes"]', function(e) 
	{
		e.preventDefault();
		save_task_tab_position_in_cookie("notes");
		task_details_tab.load_notes();
	});

	$('#task-tab-container-header #taskDetailsTab a[href="#contacts"]').off();
	$('#task-tab-container-header').on('click', '#taskDetailsTab a[href="#contacts"]', function(e)
	{
		e.preventDefault();
		save_task_tab_position_in_cookie("contacts");
		task_details_tab.loadTaskRelatedContactsView();
	});

	$('#task-tab-container-header #taskDetailsTab a[href="#activity"]').off();
    $('#task-tab-container-header').on('click', '#taskDetailsTab a[href="#activity"]', function(e) 
	{
		e.preventDefault();
		save_task_tab_position_in_cookie("activity");
		task_details_tab.loadActivitiesView();
	});

	$('#task-tab-container-header #taskDetailsTab a[href="#deals"]').off();
	$('#task-tab-container-header').on('click', '#taskDetailsTab a[href="#deals"]', function(e)
	{
		e.preventDefault();
		save_task_tab_position_in_cookie("deals");
		task_details_tab.loadTaskRelatedDealsView();
	});
	
	$('#change-owner-element .task-owner-list').off();
	$('#change-owner-element').on('click', '.task-owner-list', function(e) 
	{

		$('#change-task-owner-ul').css('display', 'none');

		// Reads the owner id from the selected option
		var new_owner_id = $(this).attr('data');
		var new_owner_name = $(this).text();
		var current_owner_id = $('#task-owner').attr('data');
		// Returns, if same owner is selected again
		if (new_owner_id == current_owner_id)
		{
			// Showing updated owner
			show_task_owner();
			return;
		}

		var taskModel = new BaseModel();
		taskModel.url = '/core/api/tasks/change-owner/' + new_owner_id + "/" + taskDetailView.get('id');
		taskModel.save(taskDetailView.toJSON(), { success : function(model)
		{

			$('#task-owner').text(new_owner_name);
			$('#task-owner').attr('data', new_owner_id);

			// Showing updated owner
			show_task_owner();
			taskDetailView = model;
			task_details_tab.loadActivitiesView();

		} });
	});

	$('#change-owner-element .task-owner-add').off();
	$('#change-owner-element').on('click', '.task-owner-add', function(e)
	{
		e.preventDefault();
		fill_task_owners(undefined, undefined, function()
		{

			$('.task-owner-add').css('display', 'none');

			$('#change-task-owner-ul').css('display', 'inline-block');
			$('#change-task-owner-ul').addClass("open");

			if ($('#change-owner-element > #change-task-owner-ul').css('display') == 'inline-block')
				$("#change-owner-element").find(".loading").remove();

		});

	});

	$('#change-owner-element #task-owner').off();
	$('#change-owner-element').on('click', '#task-owner', function(e)
	{
		e.preventDefault();
		fill_task_owners(undefined, undefined, function()
		{

			$('#task-owner').css('display', 'none');

			$('#change-task-owner-ul').css('display', 'inline-block');

			if ($('#change-task-owner-ul').css('display') == 'inline-block')
				$("#change-owner-element").find(".loading").remove();

		});

	});

	/**
	 * task note update
	 */
	$('#task_tab_detail .task-note-edit').off();
	$('#task_tab_detail').on('click', '.task-note-edit', function(e) 
	{

		e.preventDefault();
		var note = notesView.collection.get($(this).attr('data'));
		console.log(note);
		deserializeForm(note.toJSON(), $("#tasknoteUpdateForm", $('#tasknoteupdatemodal')));
		fill_relation_task($('#tasknoteUpdateForm'));
		$('#tasknoteupdatemodal').modal('show');

	})

	/**
	 * * update task related notes /
	 */

	$('#tasknoteupdatemodal #task_note_update').off();
	$('#tasknoteupdatemodal').on('click', '#task_note_update', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));// $(this).attr('disabled', 'disabled');

		if (!isValidForm('#tasknoteUpdateForm'))
		{

			// Removes disabled attribute of save button
			enable_save_button($(this));
			return;
		}

		// Shows loading symbol until model get saved
		// $('#noteUpdateModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("tasknoteUpdateForm");

		saveTaskNote($("#tasknoteUpdateForm"), $("#tasknoteupdatemodal"), this, json);
	})

	$('#task-detail-lhs .delete_task').off();
    $('#task-detail-lhs').on('click', '.delete_task', function(e)
	{
		var id = $('.delete_task').attr('data');
		e.preventDefault();
		if (!confirm("Are you sure you want to delete?"))
			return false;
		$.ajax({ url : 'core/api/tasks/' + id, type : 'DELETE', success : function(response)
		{
			document.location.href = document.location.origin + "#/tasks";
			getDueTasksCount(function(count){
				var due_task_count = count;
				if(due_task_count !=0)
					$('#due_tasks_count').html(due_task_count);
				else
					$('#due_tasks_count').html("");
			});
			
		} });
	});

	/**
 * task note validate
 */
/**
 * Saves note model using "Bcakbone.Model" object, and adds saved data to
 * time-line if necessary.
 */
$('#new-task-modal').on('click', '#tasknote_validate', function(e) 
{
	e.preventDefault();

	// Returns, if the save button has disabled attribute
	if ($(this).attr('disabled'))
		return;

	if (!isValidForm('#tasknoteForm'))
	{
		return;
	}

	disable_save_button($(this));
	var json = serializeForm("tasknoteForm");

	console.log(json);

	saveTaskNote($("#tasknoteForm"), $("#new-task-modal"), this, json);
});


}


$(function(){

	$('#content #task_edit').off('click');
    $('#content').on('click', '#task_edit', function(e) 
	{
		e.preventDefault();
		var id = $(this).attr('data');
		var task
		if (App_Calendar.allTasksListView)
		{
			task = App_Calendar.allTasksListView.collection.get(id);
		}
		else if (App_Calendar.tasksListView)
		{
			task = App_Calendar.tasksListView.collection.get(id);
			if (!task)
			{
				task = taskDetailView;
			}
		}
		else
		{
			task = taskDetailView;

		}
		if (task)
			update_task(task.toJSON());

	});

    $('#content .task-add-contact').off('click');
	$('#content').on('click', '.task-add-contact', function(e) 
	{
		e.preventDefault();
		update_task(taskDetailView.toJSON());
	});

	$('#content .task-add-deal').off('click');
	$('#content').on('click', '.task-add-deal', function(e) 
	{
		e.preventDefault();
		update_task(taskDetailView.toJSON());
		setTimeout(function(){
			$('#update_task_relates_to_deals').focus();
		},1000);
	});

});


/**
 * Activates "Timeline" tab and its tab-content in contact details and also
 * deactivates the other activated tabs.
 * 
 * @method activate_timeline_tab
 * 
 * Changed to activate first tab in the list ( on contact-details page , works
 * even on company-details page
 * @modified Chandan
 */
function activate_timeline_tab()
{
	$('#contactDetailsTab').find('li.active').removeClass('active');
	$('#contactDetailsTab li:first-child').addClass('active');

	$('div.tab-content').find('div.active').removeClass('active');
	$('div.tab-content > div:first-child').addClass('active');

	// $('#time-line').addClass('active'); //old original code for flicking
	// timeline

	if (App_Contacts.contactDetailView.model.get('type') == 'COMPANY')
	{
		fill_company_related_contacts(App_Contacts.contactDetailView.model.id, 'company-contacts');
	}
}

function save_task_tab_position_in_cookie(tab_href)
{

	var position = '';

	if (readCookie(task_tab_position_cookie_name))
		position = readCookie(task_tab_position_cookie_name);

	if (position == tab_href)
		return;

	createCookie(task_tab_position_cookie_name, tab_href);
}


// update task
function update_task(value)
{

	deserializeForm(value, $("#updateTaskForm"));
	$("#updateTaskModal").modal('show');
	categories.getCategoriesHtml(value,function(catsHtml){
		$('#type',$("#updateTaskForm")).html(catsHtml);
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data)
		{
			$("#updateTaskForm").find("#owners-list").html(data);
			if (value.taskOwner)
			{
				$("#owners-list", $("#updateTaskForm")).find('option[value=' + value['taskOwner'].id + ']').attr("selected", "selected");
			}
			$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
		});
	});

    activateSliderAndTimerToTaskModal();

	// Add notes in task modal
	showNoteOnForm("updateTaskForm", value.notes);
}

/**
 * Shows all the domain users names as ul drop down list to change the owner of
 * a contact
 */
function fill_task_owners(el, data, callback)
{
	var optionsTemplate = "<li><a class='task-owner-list' data='{{id}}'>{{name}}</a></li>";
	fillSelect('task-detail-owner', '/core/api/users', 'domainUsers', callback, optionsTemplate, true);
}

/**
 * To show owner on change
 */
function show_task_owner()
{
	$('#task-owner').css('display', 'inline-block');
}

/**
 * Displays note modal, to add a note related to the task in task detail view.
 * Also prepends the task name to related to field of activity modal.
 */

function fill_relation_task(el)
{

	var json = taskDetailView.toJSON();
	var task_name = json.name;
	$('.tags', el).html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + task_name + '</li>');

}


function saveTaskNote(form, noteModal, element, note)
{

	var noteModel = new Backbone.Model();
	noteModel.url = 'core/api/notes';
	noteModel.save(note, { success : function(data)
	{

		// Removes disabled attribute of save button
		enable_save_button($(element));// $(element).removeAttr('disabled');

		form.each(function()
		{
			this.reset();
		});

		// Removes loading symbol and hides the modal
		// modal.find('span.save-status img').remove();
		noteModal.modal('hide');

		var note = data.toJSON();

		console.log(note);
		// Add model to collection. Disabled sort while adding and called
		// sort explicitly, as sort is not working when it is called by add
		// function
		if (!notesView)
		{
			notesView = new Base_Collection_View(data);
		}
		if (notesView && notesView.collection)
		{
			if (notesView.collection.get(note.id))
			{
				notesView.collection.get(note.id).set(new BaseModel(note));
			}
			else
			{

				// Replace contacts object with contact ids
				var taskJSON = taskDetailView.toJSON();
				var contacts = [];
				$.each(taskJSON.contacts, function(index, contact)
				{
					contacts.push(contact.id);
				});

				// Replace notes object with note ids
				var notes = [];
				$.each(taskJSON.notes, function(index, n)
				{
					notes.push(n.id);
				});

				notes.push(note.id);

				taskJSON.contacts = contacts;
				taskJSON.notes = notes;

				if (taskJSON.taskOwner)
					taskJSON.owner_id = taskJSON.taskOwner.id;
				var newTaskModel = new Backbone.Model();

				newTaskModel.url = 'core/api/tasks';
				newTaskModel.save(taskJSON, { success : function(data)
				{

					notesView.collection.add(new BaseModel(note), { sort : false });
					notesView.collection.sort();
					taskDetailView = data;
					

				} });

			}
		}

	} });
}
