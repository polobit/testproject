$(function(){
	$(".task-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		console.log(id);
		console.log(tasksView.collection.get(id));
		var value = tasksView.collection.get(id).toJSON();
		deserializeForm(value, $("#updateTaskForm"));
    	console.log("contact details tab owner list");
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data){
			$("#updateTaskForm").find("#owners-list").html(data);
			if(value.taskOwner)
			{
				$("#owners-list", $("#updateTaskForm")).find('option[value='+value['taskOwner'].id+']').attr("selected", "selected");
			}
			$("#updateTaskModal").modal('show');
		});
	})
	
	$(".complete-task").die().live('click', function(e){
		e.preventDefault();
		if ($(this).is(':checked')) {
		var id = $(this).attr('data');
		var that = this;
			complete_task(id, tasksView.collection, undefined, function(data) {
				$(that).fadeOut();
				$(that).siblings(".task-subject").css("text-decoration", "line-through");
				console.log($(that).parents('.activity-text-block').css("background-color", "#FFFAFA"));
			});
		}
	});
});