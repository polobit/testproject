  // Tasks
$(function () { 
	$('.tasks-select').live('click', function(e){
		e.stopPropagation();
        if($(this).is(':checked')){
        	// Complete
        	var taskId = $(this).attr('data');
        	//completeTask(taskId, $(this));
        	completeTask(taskId, $(this).closest('tr'))
        }
    });
	
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

function getDue(due) {
    // Get Todays Date
    var date = new Date();
    date.setHours(0, 0, 0, 0);

    date = date.getTime() / 1000;
    //console.log("Today " + date + " Due " + due);
    return Math.floor((due - date) / (24 * 3600));
}


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