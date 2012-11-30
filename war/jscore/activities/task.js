/**
 * task.js is a script file to deal with all the actions (CRUD) of 
 * tasks from client side.
 * 
 * @module tasks
 * ------------------------------------------------
 *  author:  Rammohan
 */

$(function(){ 
	
	  // Activates all features of task (highlighting the task, relatedTo field typeahead)
	  // when we click on task link in activities modal. 
	  $("#task").click(function (e) {
	    	e.preventDefault();
	    	highlightTask();
	     	
	        var	el = $("#taskForm");
	    	agile_type_ahead("task_related_to", el, contacts_typeahead);
	    });
	  
	    
	    // Edit task
	  /**Tasks are categorized into four types (overdue, today, tomorrow and next-week) 
	    * while displaying them in client side.Each category has it's own table, so to edit
	    * tasks call updateTask function for each category.
	    * 
	    */
	    $('#overdue > tr').live('click', function(e){
			e.preventDefault();
			updateTask(this);
	    });	
	    
	    $('#today > tr').live('click', function(e){
			e.preventDefault();
			updateTask(this);
	    });
	    
	    $('#tomorrow > tr').live('click', function(e){
			e.preventDefault();
			updateTask(this);
	    });
	    
	    $('#next-week > tr').live('click', function(e){
			e.preventDefault();
			updateTask(this);
	    });
	    
	    // Update task
	    /**
	     *  When click on update of task-update-modal, it calls saveTask function with
	     * 
	     */ 

	    $('#update_task_validate').click(function (e) {
	    		e.preventDefault();
	    		
	    		saveTask('updateTaskForm', 'updateTaskModal', true);
	    });
	    
	    // Hide event of update task modal
	    /**
	     * Remove the relatedTo field elements if any, when the modal is hidden in order to 
	     * not to show them again when the modal is shown next
	     * 
	     */  
	    $('#updateTaskModal').on('hidden', function () {
	    	  
	    	  // Remove appended contacts from related-to
	    	  $("#updateTaskForm").find("li").remove();
	    });
	    
	    // show event of update task modal
	    // Activate typeahead for task-update-modal
	    $('#updateTaskModal').on('shown', function () {
	    	
	    	// Activate related-to field of update task form 
			var	el = $("#updateTaskForm");
	    	agile_type_ahead("update_task_related_to", el, contacts_typeahead);
	    });
	    
	    // Date Picker
	    // Activate datepicker for task due element
	    $('#task-date-1').datepicker({
	    	format: 'mm-dd-yyyy'
		});
	    
	    // Clicking checkbox
		$('.tasks-select').live('click', function(e){
			e.stopPropagation();
	        if($(this).is(':checked')){
	        	// Complete
	        	var taskId = $(this).attr('data');
	        	//completeTask(taskId, $(this));
	        	completeTask(taskId, $(this).closest('tr'))
	        }
	    });
		
		// All tasks
		$('#tasks-list').live('click', function(e){
			this.tasksListView = new Base_Collection_View({
	            url: '/core/api/tasks/all',
	            restKey: "task",
	            templateKey: "tasks-list",
	            individual_tag_name: 'tr'
	        });
			this.tasksListView.collection.fetch();

	        $('#content').html(this.tasksListView.el);

		});
});


//Highlight task
function highlightTask(){
 $("#hiddentask").val("task");
 $("#task").css("color", "black");
 $("#event").css("color", "#DD4814");
 $("#relatedEvent").css("display", "none");
 $("#relatedTask").css("display", "block");
}

// Save Task

/**
 * Creates or updates a task and adds the saved object to the suitable 
 * collection by verifying the current window location.
 * @protected
 * @method saveTask
 * @param {String} formId the unique id for the form to identify it
 * @param {String} modalId the unique id for the modal to identify it 
 * @param {Boolean} isUpdate the boolean value to identify weather saving 
 * 					the new one or updating the existing one
 * 
 */
function saveTask(formId, modalId, isUpdate){
	if (!isValidForm('#' + formId))
    	return false;
	
	// Show loading symbol until model get saved
    $('#' + modalId).find('span.save-status').html(LOADING_HTML);
    
   	var json = serializeForm(formId);
   	if(!isUpdate)
   		json.due = new Date(json.due).getTime()/1000.0;
	
	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(json,{
		success: function(data){
			$('#' + formId).each (function(){
	          	  this.reset();
	          	});
			
			$('#' + modalId).find('span.save-status img').remove();
	        $('#' + modalId).modal('hide');
		    
   	        var task = data.toJSON();
   	        if(Current_Route == 'calendar'){
   	        	if(isUpdate)
   	        		App_Calendar.tasksListView.collection.remove(json);
   	        	
    	        // Update task list view 
	        	App_Calendar.tasksListView.collection.add(data);
	        	App_Calendar.tasksListView.render(true);
	        }
   	        // Update data to temeline 
   	        else if(App_Contacts.contactDetailView){
				$.each(task.contacts, function(index, contact){
					if(contact.id == App_Contacts.contactDetailView.model.get('id')){
						
						// Activate timeline in contact detail tab and tab content
						activateTimelineTab();
						
						$('#timeline').isotope( 'insert', $(getTemplate("timeline", data.toJSON())) );

						return false;
					}	

				});
				if(Current_Route != "contact/" + App_Contacts.contactDetailView.model.get('id')){
					App_Calendar.navigate("calendar", {
    	        		trigger: true
    	        	});
				}
   	        }else{
	        	App_Calendar.navigate("calendar", {
	        		trigger: true
	        	});
	        }
		} 
	});
}

// Update task
/**
 * Shows a pop-up modal with pre-filled values to update a task
 * @method updateTask
 * @param {Object} ele assembled html object
 * 
 */
function updateTask(ele){
	deserializeForm($(ele).data().toJSON(), $("#updateTaskForm"));
	
	$("#updateTaskModal").modal('show');
}

/**
 * Get due of the task to categorize as overdue, today etc..
 * @method getDue
 * @param {Number} due of the task
 * 
 */
function getDue(due) {
    // Get Todays Date
    var date = new Date();
    date.setHours(0, 0, 0, 0);

    date = date.getTime() / 1000;
    //console.log("Today " + date + " Due " + due);
    return Math.floor((due - date) / (24 * 3600));
}

/**
 * Based on due arranges the tasks UI
 * @method appendTasks
 * @param {Object} base_model task object
 * 
 */
function appendTasks(base_model) {

	//console.log(base_model);
	
	var itemView = new Base_List_View({
        model: base_model,
        "view": "inline",
        template: 'tasks-model',
        tagName: 'tr',
       });

    // add to the right box - overdue, xxx
    var due = getDue(base_model.get('due'));
    //console.log(due);
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


    //  $('#' + this.options.collection_key, this.el).append(itemView.render().el);
}

/**
 * 
 * Turns the pending task as completed
 * @method completeTask
 * @param {Number} taskId to get the task from the collection
 * @param {Object} ui html Object to remove on success of the deletion
 * 
 */
function completeTask(taskId, ui)
{
	console.log("Deleting Task " + taskId);
	var collection = App_Calendar.tasksListView.collection;
	var model = collection.get(taskId);
	
	var json = model.toJSON();
	
	// Make contacts null to avoid exception in prepersist (here contacts is array of contact models)
	// Or replace objects with respective ids
	json.contacts = null;
	json.is_complete = true;
	
	var new_task = new Backbone.Model();
	new_task.url = '/core/api/tasks';
	new_task.save(json,{
		success: function(model, response){
			App_Calendar.tasksListView.collection.remove(model);
			
			ui.fadeOut(2000);
		}
	});
	
	// Set is complete flag to be true
	/*model.url = '/core/api/tasks';
	model.set({'is_complete': true}, {silent: true});
	
	// Destroy and hide the task
	model.save([],{success: function(model, response) {
		
		// Remove model from the collection		
		App_Calendar.tasksListView.collection.remove(model);
		
		//ui.closest('tr').slideUp('slow');
		
		ui.fadeOut(2000);
	}}
	);*/
	
}