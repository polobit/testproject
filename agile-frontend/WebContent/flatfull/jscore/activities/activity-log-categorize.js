
function initializeActivitiesListner(el){


	$("#activities-listners").off();
	// Click events to agents dropdown and department
	$("#activities-listners").on("click", "ul#user-select li a, ul#entity_type li a", function(e)
	{
		e.preventDefault();

		// Show selected name
		var name = $(this).html(), id = $(this).attr("href");

		$(this).closest("ul").data("selected_item", id);
		$(this).closest(".btn-group").find(".selected_name").text(name);
		var url = getActivityFilterParameters();

		renderActivityView(url);

	});
	$("#activities-listners").on("click", "ul#entity_type li a", function(e)
	{
		var entitytype = $(this).html();

		var entity_attribute = $(this).attr("href");

		buildActivityFilters(entitytype,entity_attribute,"entityDropDown");
		$('.activity-sub-heading').html(entitytype);

	});
	$("#activities-listners").on("click", "ul#user-select li a", function(e)
	{

		var user = $(this).html();
		var user_attribute = $(this).attr("href");

		buildActivityFilters(user,user_attribute,"userDropDown");

	});



	$("#activities-listners").on('click', '.activity-event-edit', function(e)
	{
	e.preventDefault();
	var data = $(this).closest('a').attr("data");

	var currentevent = getEventObject(data);

	update_event_activity(currentevent);

});



	$("#activities-listners").on('click', '.email-details', function(e) 
{
	e.preventDefault();
	var data = $(this).closest('a').attr("data");

	var obj = getActivityObject(data);
	console.log(obj);

	getTemplate("infoModal", JSON.parse(obj), undefined, function(template_ui){
		if(!template_ui)
			  return;
		var emailinfo = $(template_ui);
		emailinfo.modal('show');
	}, null);

});
	/*Ticket related click event to show the modal when requester or assignee replies*/
	$("#activities-listners").on('click', '.ticket-activity-notes', function(e) 
{
	e.preventDefault();
   	var id = $(this).data("id");
    
    var activity_ticket_notes = activitiesview.collection.get(id).toJSON();

    //console.log(activity_ticket_notes.entityObject);
	getTemplate("ticket-activity-notes-modal", activity_ticket_notes, undefined, function(template_ui){

		if(!template_ui)
			  return;

		var emailinfo = $(template_ui);

		emailinfo.modal('show');
	}, null);

});

}
function getDealObject(id)
{

	return $.ajax({ type : "GET", url : 'core/api/opportunity/' + id, async : true }).responseText;

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
	$("#updateActivityModal").html(getTemplate("update-activity-modal"));
	
	var value = JSON.parse(ele);
	deserializeForm(value, $("#updateActivityForm"));
	$('.update-start-timepicker').val(fillTimePicker(value.start));
	$('.update-end-timepicker').val(fillTimePicker(value.end));

	$("#updateActivityModal").modal('show');

	if (value.type == "WEB_APPOINTMENT" && parseInt(value.start) > parseInt(new Date().getTime() / 1000))
	{
		$("[id='event_delete']").attr("id", "delete_web_event");
		web_event_title = value.title;
		if (value.contacts.length > 0)
		{
			var firstname = getPropertyValue(value.contacts[0].properties, "first_name");
			if (firstname == undefined)
				firstname = "";
			var lastname = getPropertyValue(value.contacts[0].properties, "last_name");
			if (lastname == undefined)
				lastname = "";
			web_event_contact_name = firstname + " " + lastname;
		}
	}
	else
	{
		$("[id='delete_web_event']").attr("id", "event_delete");
	}
	if (value.description)
	{
		var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
		$("#event_desc").html(description);
		$("textarea#description").val(value.description);
	}
	else
	{
		var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>' + '</div></div></div>'
		$("#event_desc").html(desc);
	}
	// Fills owner select element
	populateUsersInUpdateActivityModal(value);
}

function getModal()
{
	var activity_object = App_Activity_log.activitiesview.collection.models[this];
	alert(activity_object);
	console.log(activity_object);
}

function updateactivity__task(ele)
{
	var value = JSON.parse(ele);

	$("#updateTaskModal").html(getTemplate("task-update-modal")).modal('show');

	loadProgressSlider($("#updateTaskForm"), function(el){

		deserializeForm(value, $("#updateTaskForm"));
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

	});

	
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
	populateTracks(dealForm, undefined, value, function(pipelinesList)
	{

		// Fills milestone select element
		populateMilestones(dealForm, undefined, value.pipeline_id, value, function(data)
		{
			dealForm.find("#milestone").html(data);
			if (value.milestone)
			{
				$("#milestone", dealForm).find('option[value=\"' + value.milestone + '\"]').attr("selected", "selected");
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
