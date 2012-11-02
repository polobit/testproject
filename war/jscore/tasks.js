  // Tasks
$(function () { 
	$('.tasks-select').live('change', function(e){
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
        $('#overdue', this.el).show();
        $('#label_color').addClass("label-important");
    }

    // Today
    if (due == 0) {
        $('#today', this.el).append(itemView.render().el);
        $('#today', this.el).show();
        $('#label_color').addClass("label-warning");
    }

    // Tomorrow
    if (due == 1) {
        $('#tomorrow', this.el).append(itemView.render().el);
        $('#tomorrow', this.el).show();
        $('#label_color').addClass("label-info");
    }

    // Next Week
    if (due > 1) {
        $('#next-week', this.el).append(itemView.render().el);
        $('#next-week', this.el).show();
        $('#label_color').addClass("label-inverse");
    }


    //  $('#' + this.options.collection_key, this.el).append(itemView.render().el);
}

function completeTask(taskId, ui)
{
	console.log("Deleting Task " + taskId);
	var collection = App_Calendar.tasksListView.collection;
	var model = collection.get(taskId);
	
	// Set is complete flag to be true
	model.set('is_complete', true);
	model.url = '/core/api/tasks';

	// Destroy and hide the task
	model.save([],{success: function(model, response) {
		
		// Remove model from the collection		
		App_Calendar.tasksListView.collection.remove(model);
		
		//ui.closest('tr').slideUp('slow');
		
		ui.fadeOut(2000);
	}}
	);
	
}