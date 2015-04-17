$('.activity-deal-edit').live('click', function(e)
{
	e.preventDefault();
	var data = $(this).closest('a').attr("data");

	var currentDeal = getDealObject(data);

	updatedeals(currentDeal);
});

$('.activity-event-edit').live('click', function(e)
{
	e.preventDefault();
	var data = $(this).closest('a').attr("data");

	var currentevent = getEventObject(data);

	update_event_activity(currentevent);

});

$(".activity-edit-note").die().live('click', function(e)
{
	e.preventDefault();
	console.log($(this).attr('data'));
	var data = $(this).attr('data');

	var note = getNoteObject(data);
	console.log(note);

	// Clone modal, so we dont have to create a update modal.
	// we can clone add change ids and use it as different modal

	$('#noteUpdateModal').remove();

	var noteModal = $("#noteModal").clone();

	$("#noteForm > fieldset", noteModal).prepend('<input name="id" type="hidden"/>');
	$("#noteForm", noteModal).parent().parent().find(".modal-header > h3").html('<i class="icon-edit"></i>&nbsp;Edit Note');
	$("#noteForm", noteModal).attr('id', "noteUpdateForm");
	noteModal.attr('id', "noteUpdateModal");
	$("#note_validate", noteModal).attr("id", "note_update");
	deserializeForm(JSON.parse(note), $("#noteUpdateForm", noteModal));

	noteModal.modal('show');
	
});

/*
 * $(".activity-delete-info").die().live('click', function(e) {
 * e.preventDefault(); console.log($(this).attr('data')); var data =
 * $(this).attr('data'); var deletednames = getActivityObject(data);
 * 
 * console.log(deletednames);
 * 
 * var ele = getTemplate("deletednames-detail-popover", deletednames);
 * $(this).attr({ "rel" : "popover", "data-placement" : 'right', "data-content" :
 * ele }); //$(this).popover('show');
 * 
 * });
 */

$('.activity-task-edit').live('click', function(e)
{
	e.preventDefault();
	var data = $(this).closest('a').attr("data");
	var currenttask = getTaskObject(data);

	updateactivity__task(currenttask);
});

$('.email-details').live('click', function(e)
		{
			e.preventDefault();
			var data = $(this).closest('a').attr("data");
			
			var obj=getActivityObject(data);
			console.log(obj);
			var emailinfo = $(getTemplate("infoModal", JSON.parse(obj)));
			emailinfo.modal('show');
		
		});

function getDealObject(id)
{

	return $.ajax({ type : "GET", url : 'core/api/opportunity/' + id, async : false }).responseText;

}

function getEventObject(id)
{

	return $.ajax({ type : "GET", url : 'core/api/events/getEventObject/' + id, async : false }).responseText;

}

function getTaskObject(id)
{

	return $.ajax({ type : "GET", url : 'core/api/tasks/getTaskObject/' + id, async : false }).responseText;

}

function getNoteObject(id)
{

	return $.ajax({ type : "GET", url : 'core/api/notes/' + id, async : false }).responseText;

}

function getActivityObject(id)
{

	return $.ajax({ type : "GET", url : 'core/api/activitylog/' + id, async : false }).responseText;

}

function update_event_activity(ele)
{
	var value = JSON.parse(ele);
	deserializeForm(value, $("#updateActivityForm"));
	$("#updateActivityModal").modal('show');

	$('.update-start-timepicker').val(fillTimePicker(value.start));

	$('.update-end-timepicker').val(fillTimePicker(value.end));

	// Fills owner select element
	populateUsersInUpdateActivityModal(value);
}

function getModal(){
	 var activity_object = App_Activity_log.activitiesview.collection.models[this];
	 alert(activity_object);
	 console.log(activity_object);
}

function updateactivity__task(ele)
{
	var value = JSON.parse(ele);
	deserializeForm(value, $("#updateTaskForm"));
	$("#updateTaskModal").modal('show');
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

	// Add notes in task modal
	showNoteOnForm("updateTaskForm", value.notes);
}

function updatedeals(ele)
{

	var value = JSON.parse(ele);
	console.log(value);

	add_recent_view(new BaseModel(value));

	var dealForm = $("#opportunityUpdateForm");

	$("#opportunityUpdateForm")[0].reset();

	deserializeForm(value, $("#opportunityUpdateForm"));

	$("#opportunityUpdateModal").modal('show');

	// Call setupTypeAhead to get contacts
	agile_type_ahead("relates_to", dealForm, contacts_typeahead);

	// Fills owner select element
	populateUsers("owners-list", dealForm, value, 'owner', function(data)
	{
		dealForm.find("#owners-list").html(data);
		if (value.owner)
		{
			$("#owners-list", dealForm).find('option[value=' + value['owner'].id + ']').attr("selected", "selected");
			$("#owners-list", $("#opportunityUpdateForm")).closest('div').find('.loading-img').hide();
		}
	});

// Fills the pipelines list in the select menu.
	populateTracks(dealForm, undefined, value, function(pipelinesList){

		// Fills milestone select element
		populateMilestones(dealForm, undefined, value.pipeline_id, value, function(data){
			dealForm.find("#milestone").html(data);
			if (value.milestone) {
				$("#milestone", dealForm).find('option[value=\"'+value.milestone+'\"]')
						.attr("selected", "selected");
			}
			$("#milestone", dealForm).closest('div').find('.loading-img').hide();
		});
	});

	// Add notes in deal modal
	showNoteOnForm("opportunityUpdateForm", value.notes);

	add_custom_fields_to_form(value, function(data)
	{
		var el = show_custom_fields_helper(data["custom_fields"], []);
		// if(!value["custom_data"]) value["custom_data"] = [];
		$("#custom-field-deals", dealForm).html(fill_custom_fields_values_generic($(el), value["custom_data"]));

	}, "DEAL")
}

function get_activity_created_time(due)
{
	// Get Todays Date
	var date = new Date();
	date.setHours(0, 0, 0, 0);

	date = date.getTime() / 1000;
	// console.log("Today " + date + " Due " + due);
	return Math.floor((due - date) / (24 * 3600));
}

/**
 * 
 * Based on created date arranges the activities UI
 * 
 * @method append_tasks
 * @param {Object}
 *            base_model task model
 * 
 */
function append_activity_log(base_model)
{

	var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'li', });

	// add to the right box - overdue, today, tomorrow etc.
	var createdtime = get_activity_created_time(base_model.get('time'));

	// Today
	if (createdtime == 0)
	{
		$('#earllier').show();
		$('#next-week-heading').addClass("ref-head");

		var heading = $('#today-heading', this.el);

		$('#today-activity', this.el).append(itemView.render().el);
		$('#today-activity', this.el).parent('table').css("display", "block");
		$('#today-activity', this.el).show();
		$('#today-heading', this.el).show();
	}

	if (createdtime == -1)
	{ 
		$('#earllier').show();
		$('#next-week-heading').addClass("ref-head");

		var heading = $('#tomorrow-heading', this.el);

		$('#tomorrow-activity', this.el).append(itemView.render().el);
		$('#tomorrow-activity', this.el).parent('table').css("display", "block");
		$('#tomorrow-activity', this.el).show();
		$('#tomorrow-heading', this.el).show();
	}
	if (createdtime < -1)
	{

		var heading = $('#next-week-heading', this.el);

		$('#next-week-activity', this.el).append(itemView.render().el);
		$('#next-week-activity', this.el).parent('table').css("display", "block");
		$('#next-week-activity', this.el).show();
		$('#next-week-heading', this.el).show();
	}

}
