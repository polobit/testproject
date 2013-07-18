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
	});
	
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
	
	// For adding new deal from contact-details
	$(".contact-add-deal").die().live('click', function(e){
		e.preventDefault();
		var el = $("#opportunityForm");
		
		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data){
			
			$("#opportunityForm").find("#owners-list").html(data);
			$("#owners-list", $("#opportunityForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
			// Contacts type-ahead
			agile_type_ahead("relates_to", el, contacts_typeahead);
			
			// Fills milestone select element
			populateMilestones(el, undefined, undefined, function(data){
				$("#milestone", el).html(data);
			});

			// Enable the datepicker
			$('#close_date', el).datepicker({
				format : 'mm/dd/yyyy',
			});
			
        	var json = App_Contacts.contactDetailView.model.toJSON();
        	var contact_name = getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
        	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
			
			$("#opportunityModal").modal('show');
		});
	});
	
	// For updating a deal from contact-details
	$(".deal-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		updateDeal(dealsView.collection.get(id));
	});
	
	
	//For Adding new case from contacts/cases
	
	$(".contact-add-case").die().live('click', function(e){
		e.preventDefault();
		var el = $("#casesForm");
		
		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data){
			
			$("#casesForm").find("#owners-list").html(data);
			$("#owners-list", $("#casesForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
			// Contacts type-ahead
			agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);
			
			// Enable the datepicker
			$('#close_date', el).datepicker({
				format : 'mm/dd/yyyy',
			});
			
        	var json = App_Contacts.contactDetailView.model.toJSON();
        	var contact_name = getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
        	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
			
			$("#casesModal").modal('show');
		});
	});
	
	// For updating a case from contact-details
	$(".cases-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		updatecases(dealsView.collection.get(id));
	});
});