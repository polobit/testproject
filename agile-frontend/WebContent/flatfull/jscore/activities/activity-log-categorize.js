
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


$("#activities-listners").on('click', '.activity-event-edit', function(e) {
	e.preventDefault();
	var data = $(this).closest('a').attr("data");

	getEventObject(data, function(resp) {
			update_event_activity(resp);
		});
});

$("#activities-listners").on('click', '.email-details', function(e) {
	e.preventDefault();
	var data = $(this).closest('a').attr("data");

	getActivityObject(data, function(resp) {
			console.log(resp);

			getTemplate("infoModal", resp, undefined, function(template_ui){
				if(!template_ui)
					  return;
				var emailinfo = $(template_ui);
				emailinfo.modal('show');
			}, null);
		});

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

	$("#activities-listners").on('click', '#campaign-modify-history', function(e) 
	{
		e.preventDefault();

		$(this).find("i").toggleClass('icon-plus').toggleClass('fa fa-minus-circle');

		var $campaign_history_details = $(this).siblings('div.campaign-history-details');
		
		// If already exists, just show
		if($campaign_history_details.html())
		{
			$campaign_history_details.slideToggle("slow");
			return;
		}

		var updated_workflow = $(this).data('entity');
		var updated_workflow_rules = updated_workflow.rules;

		$.ajax({
			url: 'core/api/workflows/backups/get/' + updated_workflow.id,
			dataType: 'json',
			method: 'GET',
			contentType: 'application/json',
			success: function(workflow_backup){

				var workflow_backup_rules = workflow_backup.rules;

				head.js(LIB_PATH + 'lib/underscore-min.1.8.3.js', function(){

				 	var is_equal = _.isEqual(updated_workflow_rules, workflow_backup_rules);

					if(is_equal)
					{
						$campaign_history_details.html("<p class='m-b-none text-muted text-sm l-h-xs'>No modifications made to this campaign nodes.</p>");
						$campaign_history_details.slideToggle("slow");
						return;
					}

					get_campaign_changes(updated_workflow_rules, workflow_backup_rules, function(changes_map){

							var details = "";

							details = getTemplate('activity-campaign-history-modify', changes_map);
							
							$campaign_history_details.html(details);
							$campaign_history_details.slideToggle("slow");
					});
				});
			},

			error: function(){

				$campaign_history_details.html("<p>Modified details will be available on next save.</p>");
				$campaign_history_details.slideToggle("slow");
			}

		});	
	});

}

function getEventObject(id, callback)
{
	
	$.ajax({ 
			type : "GET", 
			url : 'core/api/events/getEventObject/' + id, 
			success : function(response) {
				if( callback && typeof(callback) === 'function' )	callback(response);
			} 
		});
}

function getActivityObject(id, callback)
{
	$.ajax({ 
			type : "GET", 
			url : 'core/api/activitylog/' + id, 
			success : function(response) {
				if( callback && typeof(callback) === 'function' )	callback(response);
			} 
		});
}

function update_event_activity(ele)
{
	$("#updateActivityModal").html(getTemplate("update-activity-modal"));
	
	var value = ele;
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
		var description = '<label class="control-label"><b>{{agile_lng_translate "misc-keys" "description"}} </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="{{agile_lng_translate "misc-keys" "add-description"}}"></textarea></div>'
		$("#event_desc").html(description);
		$("textarea#description").val(value.description);
	}
	else
	{
		var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> {{agile_lng_translate "misc-keys" "add-description"}} </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="{{agile_lng_translate "misc-keys" "add-description"}}"></textarea>' + '</div></div></div>'
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

	$("#opportunityUpdateModal").find("#currency-conversion-symbols").html(getTemplate("currency-conversion-symbols-list", {}));
    if(value.currency_type){
    	$("#opportunityUpdateModal").find("#currency-conversion-symbols").val(value.currency_type);
    }
    else{
    	var currency_value = ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency : "USD-$");
    	$("#opportunityUpdateModal").find("#currency-conversion-symbols").val(currency_value);
    }

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
