/**
 * task.js is a script file to deal with all the actions (CRUD) of tasks from
 * client side.
 * 
 * @module Activities
 * 
 * author: Rammohan
 */
var task_ids;
var SELECT_ALL_TASKS = false ;

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
	 * Shows activity modal with all the task create fields.
	 */
	$("body").on("click", '.add-task', function(e)
	{
		e.preventDefault();

		// Show task modal with owners list.
		showTaskModal(this);
	});
	

	$('#updateTaskModal').on('shown.bs.modal', function()
	{

		var el = $("#updateTaskForm");
		agile_type_ahead("update_task_related_to", el, contacts_typeahead);

		agile_type_ahead("update_task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

		head.js(CSS_PATH + 'css/businesshours/jquerytimepicker.css',
				LIB_PATH + 'lib/businesshours/jquerytimepicker.js',
				function(){
		 			$('.update-task-timepicker').timepicker({ 'timeFormat' : 'H:i', 'step' : 15 });
		 			
		 			$('.update-task-timepicker').focus(function(){
		 				$('#activityModal').css("overflow", "hidden");
		 			});
		 			
		 			$('.update-task-timepicker').blur(function(){
		 				$('#activityModal').css("overflow", "auto");
		 			});

		 			/**
					 * Fills current time only when there is no time in the fields
					 */
					if ($('.update-task-timepicker', el).val() == '')
						$('.update-task-timepicker', el).val(get_hh_mm());
		 		}
		);
		
		// $('.update-task-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false });
		// $('.update-task-timepicker').timepicker().on('show.timepicker', function(e)
		// {
		// 	if ($('.update-task-timepicker').prop('value') != "" && $('.update-task-timepicker').prop('value') != undefined)
		// 	{
		// 		if ($('.update-task-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.hours = $('.update-task-timepicker').prop('value').split(":")[0];
		// 		if ($('.update-task-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.minutes = $('.update-task-timepicker').prop('value').split(":")[1];
		// 	}
		// 	$('.bootstrap-timepicker-hour').val(e.time.hours);
		// 	$('.bootstrap-timepicker-minute').val(e.time.minutes);
		// });

		// Fill details in form
		setForm(el);
	});

	

});


function activateSliderAndTimerToTaskModal(el){

	console.log("activateSliderAndTimerToTaskModal");

	head.js(CSS_PATH + 'css/businesshours/jquerytimepicker.css',
			LIB_PATH + 'lib/businesshours/jquerytimepicker.js',
			function(){
	 			$('.new-task-timepicker').timepicker({ 'timeFormat' : 'H:i', 'step' : 15 });
	 		}
	);
	
	// sets the time in time picker if it is empty
	if ($('.new-task-timepicker').val() == ''){
		$('.new-task-timepicker').val(get_hh_mm());
	}

	// $('.new-task-timepicker').timepicker({ defaultTime : '12:00', showMeridian : false });
	// $('.new-task-timepicker').timepicker().on('show.timepicker', function(e)
	// {
	// 	if ($('.new-task-timepicker').prop('value') != "" && $('.new-task-timepicker').prop('value') != undefined)
	// 	{
	// 		if ($('.new-task-timepicker').prop('value').split(":")[0] != undefined)
	// 			e.time.hours = $('.new-task-timepicker').prop('value').split(":")[0];
	// 		if ($('.new-task-timepicker').prop('value').split(":")[0] != undefined)
	// 			e.time.minutes = $('.new-task-timepicker').prop('value').split(":")[1];
	// 	}
	// 	$('.bootstrap-timepicker-hour').val(e.time.hours);
	// 	$('.bootstrap-timepicker-minute').val(e.time.minutes);
	// });

	console.log("loadProgressSlider");

	// Loads progress slider in add task / update modal.
	loadProgressSlider($("#taskForm"));
	loadProgressSlider($("#updateTaskForm"));

	/**
	 * Date Picker Activates datepicker for task due element
	 */
	 
	$('#update-task-date-1').datepicker({ format : CURRENT_USER_PREFS.dateFormat , weekStart : CALENDAR_WEEK_START_DAY, autoclose: true});


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
	
	$('#tasks-list-template').on('mouseenter', 'tr', function(e)
	{
		$(this).find("#task-list-actions").removeClass("hidden");
	});

	// Hide task actions
	$('#tasks-list-template').on('mouseleave', 'tr', function(e)
	{
		$(this).find("#task-list-actions").addClass("hidden");
	});
	/*
	 * Task Action: Delete task from UI as well as DB. Need to do this manually
	 * because nested collection can not perform default functions.
	 */
	$('#tasks-list-template').on('click', '.delete-task', function(event)
	{
		var that = this;
		showAlertModal("delete_task", "confirm", function(){
			if(!getTaskListId(that) && $(that).parent().attr('data')){
				deleteTask(getTaskId(that), $(that).parent().attr('data'), parseInt(getTaskListOwnerId(that)));
				$(that).parentsUntil('tr').parent('tr').remove();
			}
			else
				deleteTask(getTaskId(that), getTaskListId(that), parseInt(getTaskListOwnerId(that)));
		});

	});

	// Task Action: Mark task complete, make changes in DB.
	$('#tasks-list-template').on('click', '.is-task-complete', function(event)
	{
		event.preventDefault();
		var that=$(this);
		/*if(!confirm(_agile_get_translated_val('tasks','confirm-delete')))
		{
			$(this).closest(".task-content-view").find(".taskComplete").attr("checked", false);
				return;
		}*/
		if(!getTaskListId(that)  && $(that).parent().attr('data')){
					completeTask(getTaskId(that), $(that).parent().attr('data'), parseInt(getTaskListOwnerId(that)));
				}
				else
					completeTask(getTaskId(that), getTaskListId(that), parseInt(getTaskListOwnerId(that)));
		

		/*showAlertModal("complete_task", "confirm", 
			function() {
				if(!getTaskListId(that)  && $(that).parent().attr('data')){
					completeTask(getTaskId(that), $(that).parent().attr('data'), parseInt(getTaskListOwnerId(that)));
				}
				else
					completeTask(getTaskId(that), getTaskListId(that), parseInt(getTaskListOwnerId(that)));
			},
			function() {
				$(that).closest(".task-content-view").find(".taskComplete").attr("checked", false);
					
			});
*/
	});

	// Task Action: Open Task Edit Modal and display details in it.
	$('#tasks-list-template').on('click', '.edit-task', function(event)
	{
		event.preventDefault();
		if(!getTaskListId(this)  && $(this).parent().attr('data')){
			editTask(getTaskId(this), $(this).parent().attr('data'), parseInt(getTaskListOwnerId(this)));
		}
		else
			editTask(getTaskId(this), getTaskListId(this), parseInt(getTaskListOwnerId(this)));
	});
	$('#tasks-list-template').off('click', '#bulk-change-owner , #bulk-change-priority , #bulk-change-status , #bulk-change-dueDate');
	$('#tasks-list-template').on('click', '#bulk-change-owner , #bulk-change-priority , #bulk-change-status , #bulk-change-dueDate ', function(event)
	{
		task_ids = null ;
		var tasksNumber = $('#tasks-list-template').find('#select_all_tasks').attr('data');
		if(!tasksNumber)
			task_ids = getTaskIds();
		console.log(task_ids);
		var taskAction = this.id ; 
		if(taskAction == "bulk-change-status"){
			$("#task-bulk-change-status").modal('show');
			$("#task-bulk-change-status").find('.progress-slider').css('display','none');
			}			
		else if(taskAction == "bulk-change-priority")
			$("#task-bulk-change-priority").modal('show');
		else if(taskAction == "bulk-change-owner"){
			var el = $('#bulkTaskOwnerForm');
			$("#task-bulk-change-owner").modal('show');
			populateUsers("owners-list", el, undefined, undefined, function(data)
			{
				$("#task-bulk-change-owner").find("#owners-list").html(data);
				$("#owners-list", $("#task-bulk-change-owner")).closest('div').find('.loading-img').hide();
			});
		}
		else {
			$("#task-bulk-change-duedate").modal('show');
			$('#task-date-1').datepicker({ format : CURRENT_USER_PREFS.dateFormat , weekStart : CALENDAR_WEEK_START_DAY , autoclose : true});
			$('#task-date-1').datepicker('update');
			head.js(CSS_PATH + 'css/businesshours/jquerytimepicker.css',
					LIB_PATH + 'lib/businesshours/jquerytimepicker.js',
					function(){
			 			$('.new-task-timepicker').timepicker({ 'timeFormat' : 'H:i', 'step' : 15 });
			 		}
			);
			
			// sets the time in time picker if it is empty
			if ($('.new-task-timepicker').val() == ''){
				$('.new-task-timepicker').val(get_hh_mm());
			}
/*			var d1 = new Date ();
			var d2 = new Date ( d1 );
			d2.setHours(d1.getHours()+3)
			$('.new-task-timepicker').timepicker({ defaultTime : d2.format("HH:MM") , showMeridian : false , autoclose : true });
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
			});*/
		}

	});
	$('#task-bulk-change-status').off("shown.bs.modal");
	$('#task-bulk-change-status').on("shown.bs.modal", function()
	{	
		var el = $('#bulkTaskStatusForm');
		$('.progress-slider' ,el).append('<input id="progress_slider" type="slider" class="progress_slider" value="0" />');
		loadProgressSlider(el);
	//	$("#task-bulk-change-status").find('#status').val('YET_TO_START');
	//	$("#task-bulk-change-status").find('.progress-slider').css('display','none');
	});
	$('#task-bulk-change-status').on("hidden.bs.modal", function()
	{	
		$(this).find('#bulkTaskStatusForm')[0].reset();
		$("#task-bulk-change-status").find('.progress-slider').empty();
	});
	$('#task-bulk-change-owner, #task-bulk-change-status, #task-bulk-change-priority , #task-bulk-change-duedate').off('click', '#task_bulk_validate');
	$('#task-bulk-change-owner, #task-bulk-change-status, #task-bulk-change-priority , #task-bulk-change-duedate').on('click', '#task_bulk_validate', function(e)
	{
		e.preventDefault();
		//$('.bulk-task-action-model').find('#task_bulk_validate').addClass('disabled').text('changing');
		var form_id = $(this).closest('.bulk-task-action-model').find('form').attr("id");

		if ($(this).attr('disabled'))
			return;
		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));
		if (!isValidForm('#' + form_id))
		{
			enable_save_button($(this));
			return false;
		}
		var priorityJson = serializeForm(form_id);
		if(form_id == "bulkTaskDuedateForm"){
			var startarray = (priorityJson.task_ending_time).split(":");
			priorityJson.due = new Date((priorityJson.due) * 1000).setHours(startarray[0], startarray[1]) / 1000.0;
		}
		else if(form_id == "bulkTaskStatusForm"){
			var progress = $('#progress_slider').val() ; 
			if(progress)
				priorityJson['progress'] = $('#progress_slider').val() ;
		}
		enable_save_button($(this));
		$('.bulk-task-action-model').modal('hide');
		if(task_ids && task_ids.length < 50)
			saveBulkTaskProperties(task_ids,priorityJson,form_id);
		else{
			saveBulkTaskAction(task_ids,priorityJson,form_id);
		}
	});
	$('#tasks-list-template').off('click', '#bulk-delete-tasks');
	$('#tasks-list-template').on('click', '#bulk-delete-tasks', function(e)
	{
		task_ids = null ; var priorityJson = null ;
		var tasksNumber = $('#tasks-list-template').find('#select_all_tasks').attr('data');
		if(!tasksNumber)
			task_ids = getTaskIds();
		console.log(task_ids);
		var form_id = "bulkTaskDeleteForm" ; 
		var confirm_msg = "Are you sure you want to delete?";
		showAlertModal(confirm_msg, "confirm", function(){
			if(task_ids && task_ids.length < 50)
				saveBulkTaskProperties(task_ids,priorityJson,form_id);
			else{
				saveBulkTaskAction(task_ids,priorityJson,form_id);
			}
								
			}, undefined, "{{agile_lng_translate 'bulk-delete' 'bulk-delete'}}");
	});
	$('#tasks-list-template').off('click', '.tbody_check');
	$('#tasks-list-template').on('click', '.tbody_check', function(event)
	{
		var isChecked  = false;
		$('#tasks-list-template .thead_check').removeProp('checked');
		$('#tasks-list-template').find('#select_all_tasks').empty().removeAttr('data');
		$.each($('#tasks-list-template .tbody_check'), function(index, element)
			{
				if($(element).is(':checked')){
					isChecked = true ; 
					return ;
				}
			});
		if(isChecked){
			$('#tasks-list-template').find('.task_bulk_action').removeClass("disabled");
		}
		else{			
			$('#tasks-list-template').find('.task_bulk_action').addClass("disabled");
		}

	});
	$('#tasks-list-template').off('click', '.thead_check , #select_chosen_tasks');
	$('#tasks-list-template').on('click', '.thead_check , #select_chosen_tasks', function(event)
	{
		if(this.checked || this.id == 'select_chosen_tasks'){
			var taskCount = 0 ;
			SELECT_ALL_TASKS = false ;
			var totalTasks = getSimpleCount(window.App_Calendar.allTasksListView.collection.toJSON()) ;
			$('#tasks-list-template').find('.task_bulk_action').removeClass("disabled");
			$.each($('#tasks-list-template .tbody_check'), function(index, element)
				{
					$(element).attr('checked', "checked");
					taskCount = taskCount + 1;
				});
			if(taskCount && totalTasks && totalTasks > 25 && taskCount < totalTasks )
				$('#tasks-list-template').find('#select_all_tasks').html('Selected '+taskCount+' Tasks <a id="select_total_tasks" class="c-p text-info">Select all '+totalTasks+' tasks</a>').removeAttr('data');
		}
		else{
			$('#tasks-list-template').find('.task_bulk_action').addClass("disabled");
			$('#tasks-list-template').find('#select_all_tasks').empty().removeAttr('data');
			$.each($('.tbody_check'), function(index, element)
				{
					$(element).attr('checked', "unchecked");
				});
		}

	});
	$('#tasks-list-template').off('click', '#select_total_tasks');
	$('#tasks-list-template').on('click', '#select_total_tasks', function(event)
	{
		SELECT_ALL_TASKS = true ;	
		$('#tasks-list-template').find('.task_bulk_action').removeClass("disabled");
		var taskCount = getSimpleCount(window.App_Calendar.allTasksListView.collection.toJSON()) ;
		$('#tasks-list-template').find('.tbody_check').attr('checked', "checked");
		$('#tasks-list-template').find('#select_all_tasks').empty().html('All '+taskCount+' tasks Selected <a id="select_chosen_tasks" class="c-p text-info">Select chosen tasks only</a>').attr('data',taskCount);
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
	$('#tasks-list-template').on('click','.task-list-minimized',function(e)
	 {
	 	$(this).find(".expandbutton").trigger('click');
	 	
	 });
	$("#tasks-list-template").on("click", "#taskheading", function(b) {
        b.stopPropagation();
        taskAutoWidth(this)
    });

	$('#tasks-list-template').on('click', '.tasks-list-image', function(event)
			{
				event.preventDefault();
				// Change UI and input field
				var url = event.target.getAttribute('url');			
				routeToPage(url);
				event.stopPropagation();
				
			});
	$('#tasks-list-template').on('click','.taskComplete',function(e){
		if($(this).prop("checked") == true)
		{
			$(this).closest(".task-striped").find(".is-task-complete").trigger("click");
		}
	});
	$('#tasks-list-template').on("click", ".expandbutton", function(e)
	{	
		e.stopPropagation();
		taskAutoWidth(this);
	});	
	$('#tasks-list-template').on('click', '.view-task-details', function(event)
	{
		event.preventDefault();
		var route = $(this).parents('.agile-edit-row').attr('route');
		var data = $(this).siblings(".data").attr('data');
		if (data){
			Backbone.history.navigate(route + data, {
				trigger : true
			});
		} 

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
	$('input.date').val(getDateInFormat(new Date()));
	// datepicker('update');
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

							if ((old_owner_id == "All Categories" || old_owner_id.toUpperCase() == json.type) && (old_type == "{{agile_lng_translate 'tasks' 'All Tasks'}}" || json.owner_id == CURRENT_DOMAIN_USER.id))
								App_Calendar.allTasksListView.collection.add(data);

							App_Calendar.allTasksListView.render(true);
						}
						else if (Current_Route == 'tasks')
						{
							var criteria = getCriteria();

							if (criteria == "LIST")
							{
								if (isUpdate)
									App_Calendar.allTasksListView.collection.get(json).set(new BaseModel(data));
								App_Calendar.allTasksListView.render(true);
								return;
							}

							if (criteria == "CALENDAR")
							{
								if (isUpdate){
									fullCalTasks.fullCalendar('removeEvents', task.id);
								}
								setCalendarTaskColors(task);
								if ($('#new-owner-tasks').data("selected_item") == "all-pending-tasks"){
									if(task["is_complete"] == false || task["is_complete"] == "false"){
										fullCalTasks.fullCalendar('renderEvent', task);
									}
								}
								else if ($('#new-owner-tasks').data("selected_item") == "my-pending-tasks"){
									if((task["is_complete"] == false || task["is_complete"] == "false") && task.taskOwner.id == CURRENT_DOMAIN_USER.id){
										fullCalTasks.fullCalendar('renderEvent', task);
									}
								}
								else if ($('#new-owner-tasks').data("selected_item") == CURRENT_DOMAIN_USER.id){
									if(task.taskOwner.id == CURRENT_DOMAIN_USER.id){
										fullCalTasks.fullCalendar('renderEvent', task);
									}
								}
								else{
									fullCalTasks.fullCalendar('renderEvent', task);
								}
								return;
							}

							updateTask(isUpdate, data, json);
						}
						// Updates data to temeline
						else if ((App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id')) || 
							(App_Leads.leadDetailView && Current_Route == "lead/" + App_Leads.leadDetailView.model.get('id')))
						{
							var contactId;
							if(App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
							{
								contactId = App_Contacts.contactDetailView.model.get('id');
							}
							else
							{
								contactId = App_Leads.leadDetailView.model.get('id');
							}
							/*
							 * Verifies whether the added task is related to the
							 * contact in contact detail view or not
							 */
							$.each(task.contacts, function(index, contact)
							{
								if (contact.id == contactId)
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

						else if (App_Companies.companyDetailView && Current_Route == "company/" + App_Companies.companyDetailView.model.get('id'))
						{

							/*
							 * Verifies whether the added task is related to the
							 * company in company detail view or not
							 */
							$.each(task.contacts, function(index, contact)
							{
								if (contact.id == App_Companies.companyDetailView.model.get('id'))
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
										tasksView.render(true);
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
						
					},
					error : function(data, response){
						if(response && response.status == 403)
						{
							enable_save_button($(saveBtn));
							$('span.save-status', $("#"+modalId)).html("<i style='color:#B94A48;'>"+Handlebars.compile('{{name}}')({name : response.responseText})+"</i>");
							setTimeout(function()
							{
								$('span.save-status', $("#"+modalId)).html('');
							}, 4000);
						}
					}  });
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
function taskAutoWidth(el)
{	
	var arr = _agile_get_prefs("task-page-status");
	if(!arr)
		arr = [];
	else 
		arr = arr.split(",");

	var id = $(el).closest(".task-trello-list").attr("id");
	if(arr.indexOf(id) != -1)
	{
		delete arr[arr.indexOf(id)]
	}

	var expanded = $(el).closest(".task-trello-list").hasClass("compress");
	if(expanded)
	{
		arr.push($(el).closest(".task-trello-list").attr("id"))
		
		$(el).children().removeClass("fa fa-expand")
		$(el).children().addClass("fa fa-compress")
	}

	else
	{
		
		$(el).children().removeClass("fa fa-compress")
		$(el).children().addClass("fa fa-expand")
		
	}
	$(el).closest(".task-trello-list").toggleClass("expand compress");
	_agile_set_prefs('task-page-status' , arr.toString());
		
}

function getTaskTrackAutoWidthCurrentState(track_name){
   if(!track_name)
   	  return "compress";

   	// Get prefs form storage 
   	var prefs = _agile_get_prefs("task-page-status");
   	if(prefs && prefs.indexOf(track_name) != -1)
   		 return "expand";

   	return "compress";
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
	},
	error : function(model, response){
		showModalConfirmation("Complete Task", 
			'<span>'+response.responseText+'</span>', 
			function (){
				return;
			}, 
			function(){
				return;
			},
			function (){
				return;
			},
			'Cancel'
		);
		return;
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

	$('#activityTaskModal').html(getTemplate("new-task-modal")).modal('show');

	var el = $("#taskForm");

	agile_type_ahead("task_related_to", el, contacts_typeahead);
	// Deals type-ahead
	agile_type_ahead("task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
	
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
function getTaskIds(){
	event.preventDefault();
		var id_array = [];
		var index_array = [];
		var table = $('body').find('.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked store it's id in an array. !$(element).attr('disabled') included by Sasi to avoid disabled checkboxes
			if($(element).is(':checked') && !$(element).attr('disabled')){
				// Disables mouseenter once checked for delete(To avoid popover in deals when model is checked)
				$(element).closest('tr').on("mouseenter", false);
				index_array.push(index);
				if(!$(element).closest('tr').hasClass("pseduo-row"))
				{
					id_array.push($(element).closest('tr').data().get('id'));
				}
			}
		});
		return id_array;
}
function saveBulkTaskProperties(task_ids,priorityJson,form_id){
	var sendData = getsendDataJson(task_ids,priorityJson,form_id);
	var url = 'core/api/tasks/changeBulkTasks';
	if(sendData){
		$.ajax({ url : url, method: "POST" ,
			contentType: 'application/json', 
			data : JSON.stringify(sendData),
			success : function(data){				
			//	showNotyPopUp('information', "Task scheduled", "top", 5000);
			//	console.log(data);
			SELECT_ALL_TASKS = false ;
				if(data.length){
					for (var i in data) {
						App_Calendar.allTasksListView.collection.get(data[i].id).set(data[i]);
					}
					App_Calendar.allTasksListView.render(true);
					showTaskNotyMessage(""+data.length+" {{agile_lng_translate 'bulk-task-noty' 'tasks-modified'}}","information","bottomRight",5000);
				}
				else{
					var i;
					var t = task_ids.length ;
					for(i=0;i<t;i++){
						App_Calendar.allTasksListView.collection.remove(task_ids[i]);
					}
					showTaskNotyMessage(""+t+" {{agile_lng_translate 'bulk-task-noty' 'tasks-deleted'}}","information","bottomRight",5000);
					if(t){
						var count = $('#tasks-list-template').find('.tasks-count').attr('data');
						count = count - t ;
						$('#tasks-list-template').find('.tasks-count').removeAttr('data');
						$('#tasks-list-template').find('.tasks-count').attr('data' , count);
						$('#tasks-list-template').find('.tasks-count').text('('+count+' {{agile_lng_translate "other" "total"}})');
					}
					App_Calendar.allTasksListView.render(true);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
  				console.log(textStatus, errorThrown);
  				SELECT_ALL_TASKS = false ;
       		} 
		});
	}
}
function saveBulkTaskAction(task_ids,priorityJson,form_id){
	var sendData = getsendDataJson(task_ids,priorityJson,form_id);
	var url = "core/api/tasks/bulk/changeBulkTasksProperties" ;
	var taskType = $('#tasks-list-template').find('.owner-task-button').find('.selected_name').text();
	var criteria = "LIST" ;
	var pending = false; var ownerId = null ;
	if(taskType ){
		if(taskType == "All Pending Tasks")
			pending = true ;
		else if (taskType == "My Tasks")
			ownerId = CURRENT_DOMAIN_USER.id ;
		else if (taskType == "My Pending Tasks"){
			pending = true;
			ownerId = CURRENT_DOMAIN_USER.id ;
		}
	}
	sendData.criteria = criteria ;
	sendData.pending = pending;
	sendData.ownerId = ownerId ;
	if(sendData){
		$.ajax({ url : url, method: "POST" ,
			contentType: 'application/json', 
			data : JSON.stringify(sendData),
			success : function(data){				
				showNotyPopUp('information', "{{agile_lng_translate 'bulk-task-noty' 'task-scheduled'}}", "top", 5000);
				console.log(data);
				App_Calendar.allTasksListView.render(true);
				SELECT_ALL_TASKS = false ;
			},
			error: function(jqXHR, textStatus, errorThrown) {
  				console.log(textStatus, errorThrown);
  				SELECT_ALL_TASKS = false ;
       		} 
		});
	}

}
function getsendDataJson(task_ids,priorityJson,form_id){
	var sendData = {};
	sendData.IdJson = task_ids;
	sendData.priority = priorityJson;
	sendData.form_id = form_id;
	return sendData;
}
