/**
 * contact-details-tabs.js fetches the contact (which is in contact detail view)
 * related details (notes, tasks, deals, campaigns and mails etc..) and presents
 * in tab content as specified, when the corresponding tab is clicked. Timeline
 * tab is activated by default to show all the details as vertical time-line.
 * 
 * @module deal management
 * @author jagadeesh
 */

var deal_tab_position_cookie_name = "deal_tab_position";
var id;

function initializeDealDetailsListners(el)
{	
}

$(function(){
	/**
	 * Fetches all the notes related to the deal and shows the notes collection
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */
	$('#content').on('click', '#deal-details-tab a[href="#dealnotes"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealnotes");
		deal_details_tab.load_deal_notes();
	});

	/**
	 * Fetches all the contacts related to the deal and shows the contacts
	 * collection as a table in its tab-content, when "contacts" tab is clicked.
	 */
	$('#content').on('click', '#deal-details-tab a[href="#dealrelated"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealrelated");
		deal_details_tab.loadDealRelatedContactsView();
	});

	/**
	 * Fetches all the notes related to the contact and shows the tasks
	 * collection as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('#content').on('click', '#deal-details-tab a[href="#dealactivities"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealactivities");
		deal_details_tab.load_deal_activities();
	});

	/**
	 * Fetches all the docs related to the deal and shows the docs collection as
	 * a table in its tab-content, when "Documents" tab is clicked.
	 */
	$('#content').on('click', '#deal-details-tab a[href="#dealdocs"]', function(e)
	{		e.preventDefault();
		save_deal_tab_position_in_cookie("dealdocs");
		deal_details_tab.load_deal_docs();
	});
	
	/**
	 * Fetches all the tasks related to the deal and shows the docs collection as
	 * a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('#content').on('click', '#deal-details-tab a[href="#dealtasks"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealtasks");
		deal_details_tab.load_deal_tasks();
	});

	/**
	 * Fetches all the events related to the deal and shows the docs collection as
	 * a table in its tab-content, when "Events" tab is clicked.
	 */
	$('#content').on('click', '#deal-details-tab a[href="#dealevents"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealevents");
		deal_details_tab.load_deal_events();
	});


	$("#content").on('click', "#deal-owner", function(e)

	{
		e.preventDefault();
		fill_deal_owners(undefined, undefined, function()
		{

			$('#deal-owner').css('display', 'none');

			$('#change-deal-owner-ul').css('display', 'inline-block');

			if ($('#change-deal-owner-ul').css('display') == 'inline-block')
				$("#change-owner-element").find(".loading").remove();

		});

	});


	$("#content").on('click', "#opportunity-actions-delete", function(e)

	{
		e.preventDefault();

		if (!confirm("Are you sure you want to delete?"))
			return;

		var id = $(this).closest('.deal_detail_delete').attr('data');

		$.ajax({ url : 'core/api/opportunity/' + id, type : 'DELETE', success : function(data)
		{
			Backbone.history.navigate("#deals", { trigger : true });
		}, error : function(response)
		{
			alert("some exception occured please try again");
		} });
	});

	$('#content').on('click', '.deal-edit-note', function(e)
	{

		e.preventDefault();

		var note = dealNotesView.collection.get($(this).attr('data'));
		console.log(note);
		deserializeForm(note.toJSON(), $("#dealnoteUpdateForm", $('#dealnoteupdatemodal')));
		fill_relation_deal($('#dealnoteUpdateForm'));
		$('#dealnoteupdatemodal').modal('show');
	});

	$('body').on('click', '#dealnote_update', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));// $(this).attr('disabled', 'disabled');

		if (!isValidForm('#dealnoteUpdateForm'))
		{

			// Removes disabled attribute of save button
			enable_save_button($(this));
			return;
		}

		// Shows loading symbol until model get saved
		// $('#noteUpdateModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("dealnoteUpdateForm");

		saveDealUpdateNote($("#dealnoteUpdateForm"), $("#dealnoteupdatemodal"), this, json);
	});
	/**
	 * Saves note model using "Bcakbone.Model" object, and adds saved data to
	 * time-line if necessary.
	 */
	$('#deal-note-modal').on('click', '#dealnote_validate', function(e)
	{

		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		if (!isValidForm('#dealnoteForm'))
		{
			return;
		}

		disable_save_button($(this));

		// Shows loading symbol until model get saved
		// $('#noteModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("dealnoteForm");

		console.log(json);

		saveDealNote($("#dealnoteForm"), $("#deal-note-modal"), this, json);
	});

	/**
	 * Shows note modal and activates contacts typeahead to its related to field
	 */
	$('#content').on('click', '#dealshow-note', function(e)
	{
		if (App_Deal_Details.dealDetailView.model.get('archived') == true)
			return;
		e.preventDefault();
		$("#deal-note-modal").modal('show');

		var el = $("#dealnoteForm");

	});

	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.
	 */
	$("#content").on('click', ".deal-owner-list", function(e)
	{

		$('#change-deal-owner-ul').css('display', 'none');

		// Reads the owner id from the selected option
		var new_owner_id = $(this).attr('data');
		var new_owner_name = $(this).text();
		var current_owner_id = $('#deal-owner').attr('data');
		// Returns, if same owner is selected again
		if (new_owner_id == current_owner_id)
		{
			// Showing updated owner
			show_deal_owner();
			return;
		}

		var dealModel = new BaseModel();
		dealModel.url = '/core/api/opportunity/change-owner/' + new_owner_id + "/" + App_Deal_Details.dealDetailView.model.get('id');
		dealModel.save(App_Deal_Details.dealDetailView.model.toJSON(), { success : function(model)
		{

			$('#deal-owner').text(new_owner_name);
			$('#deal-owner').attr('data', new_owner_id);

			// Showing updated owner
			show_deal_owner();
			App_Deal_Details.dealDetailView.model = model;
			App_Deal_Details.dealDetailView.render(true)
			Backbone.history.navigate("deal/" + model.toJSON().id, { trigger : true });

		} });

	});

	$("#content").on('click', ".deal-add-contact", function(e)
	{
		e.preventDefault();
		console.log(App_Deal_Details.dealDetailView.model.toJSON());
		var currentdeal = App_Deal_Details.dealDetailView.model;
		updateDeal(currentdeal);

		$('#opportunityUpdateModal').addClass('focusRelatedTo');
		
	});


	


	$("#content").on('click', ".deal-detail-edit-deal", function(e)
	{
		e.preventDefault();
		console.log(App_Deal_Details.dealDetailView.model.toJSON());
		var currentdeal = App_Deal_Details.dealDetailView.model;
		updateDeal(currentdeal);

		$('#opportunityUpdateModal').removeClass('focusRelatedTo');

	});

	$("#content").on('click', ".deal-note", function(e)
	{
		e.preventDefault();

		var el1 = $("#dealnoteForm");

		// Displays contact name, to indicate the note is related to the contact
		fill_relation_deal(el1);
		$('#deal-note-modal').modal('show');
	});

	$("#content").on('click', "#dealdetail-archive", function(e)
	{
		e.preventDefault();

		var currentDeal = App_Deal_Details.dealDetailView.model.toJSON();
		$("#archived-deal-id", $("#deal_archive_confirm_modal")).val(currentDeal.id);
		$("#archived-deal-milestone", $("#deal_archive_confirm_modal")).val(currentDeal.milestone);
		$("#deal_archive_confirm_modal").modal('show');

	});

	$("#content").on('click', ".deal-restore-detail-view", function(e)
	{
		e.preventDefault();

		var currentDeal = App_Deal_Details.dealDetailView.model.toJSON();

		$("#restored-deal-id", $("#deal_restore_confirm_modal")).val(currentDeal.id);
		$("#restored-deal-milestone", $("#deal_restore_confirm_modal")).val(currentDeal.milestone);
		$("#deal_restore_confirm_modal").modal('show');

	});

	//For updating document from contact-details
$('#content').on('click', '.document-edit-deal-tab', function(e){
	e.preventDefault();
	var id = $(this).attr('data');
	updateDocument(dealDocsView.collection.get(id));
});

// For unlinking document from contact-details
$('#content').on('click', '.document-unlink-deal-tab', function(e){
	e.preventDefault();
	var id = $(this).attr('data');
	var json = dealDocsView.collection.get(id).toJSON();
	
	// To get the contact id and converting into string
	var deal_id = App_Deal_Details.dealDetailView.model.id + "";
	
    // Removes the contact id from related to contacts
	json.deal_ids.splice(json.deal_ids.indexOf(deal_id),1);
	
	// Updates the document object and hides 
	var newDocument = new Backbone.Model();
	newDocument.url = 'core/api/documents';
	newDocument.save(json, {
		success : function(data) {
			dealDocsView.collection.remove(json);
			dealDocsView.render(true);
		}
	});
});

/**
 * For showing new/existing documents
 */
$('#content').on('click', '.add-deal-document-select', function(e){
	e.preventDefault();
	var el = $(this).closest("div");
	$(this).css("display", "none");
	el.find(".deal-document-select").css("display", "block");
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
    fillSelect('document-select','core/api/documents', 'documents',  function fillNew()
	{
		el.find("#document-select").append("<option value='new'>Add New Doc</option>");

	}, optionsTemplate, false, el); 
});

/**
 * For adding existing document to current contact
 */
$('#content').on('click', '.add-deal-document-confirm', function(e){
	e.preventDefault();
	
    var document_id = $(this).closest(".deal-document-select").find("#document-select").val();

    var saveBtn = $(this);
	
		// To check whether the document is selected or not
    if(document_id == "")
    {
    	saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>This field is required.</span>");
    	saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
    	return;
    }	    	
    else if(document_id == "new")
    {
    	var el = $("#uploadDocumentForm");
		$("#uploadDocumentModal").modal('show');
		
		// Contacts type-ahead
		agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);
		
		// Deals type-ahead
		agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

    	var deal_json = App_Deal_Details.dealDetailView.model.toJSON();
    	var deal_name = deal_json.name;
    	$('.deal_tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ deal_json.id +'">'+deal_name+'</li>');
    }
    else if(document_id != undefined && document_id != null)
    {
		if(!existingDealDocumentsView)
		{
			existingDealDocumentsView = new Base_Collection_View({ 
				url : 'core/api/documents',
				restKey : "documents",
			});
			existingDealDocumentsView.collection.fetch({
			    success: function(data){
			    		existing_deal_document_attach(document_id, saveBtn);
			    	}
		        });
		}
		else
			existing_deal_document_attach(document_id, saveBtn);
    }

});

/**
 * To cancel the add documents request
 */
$('#content').on('click', '.add-deal-document-cancel', function(e){
	e.preventDefault();
	var el = $(this).closest("div");
	el.find(".deal-document-select").css("display", "none");
	el.find(".add-deal-document-select").css("display", "inline");
});

	$('#content').on('click', '.deal-add-task', function(e){ 
    	e.preventDefault();

    	var	el = $("#taskForm");
		$('#activityTaskModal').modal('show');
		highlight_task();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation_deal_task(el);

		agile_type_ahead("task_related_to", el, contacts_typeahead);

        agile_type_ahead("task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

		// Fills owner select element
		populateUsers("owners-list", $("#taskForm"), undefined, undefined,
				function(data) {
					$("#taskForm").find("#owners-list").html(data);
					$("#owners-list", el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
					$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();					
		});

       activateSliderAndTimerToTaskModal();
    });

    $('#content').on('click', '.task-edit-deal-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		var value = dealTasksView.collection.get(id).toJSON();

		deserializeForm(value, $("#updateTaskForm"));

		$("#updateTaskModal").modal('show');

		$('.update-task-timepicker').val(fillTimePicker(value.due));
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data)
		{
			$("#updateTaskForm").find("#owners-list").html(data);
			if (value.taskOwner)
				$("#owners-list", $("#updateTaskForm")).find('option[value=' + value['taskOwner'].id + ']').attr("selected", "selected");

			$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
		});

		// Add notes in task modal
		showNoteOnForm("updateTaskForm", value.notes);

		activateSliderAndTimerToTaskModal();

	});

	/**
	 * Delete functionality for tasks blocks in deal details
	 */
	$('#content').on('click', '.deal-task-delete', function(e)
	{
		e.preventDefault();

		var model = $(this).parents('li').data();

		if (model && model.toJSON().type != "WEB_APPOINTMENT")
		{
			if (!confirm("Are you sure you want to delete?"))
				return;
		}
		else if (model && model.toJSON().type == "WEB_APPOINTMENT" && parseInt(model.toJSON().start) < parseInt(new Date().getTime() / 1000))
		{
			if (!confirm("Are you sure you want to delete?"))
				return;
		}

		if (model && model.collection)
		{
			model.collection.remove(model);
		}

		// Gets the id of the entity
		var entity_id = $(this).attr('id');

		if (model && model.toJSON().type == "WEB_APPOINTMENT" && parseInt(model.toJSON().start) > parseInt(new Date().getTime() / 1000))
		{
			web_event_title = model.toJSON().title;
			if (model.toJSON().contacts.length > 0)
			{
				var firstname = getPropertyValue(model.toJSON().contacts[0].properties, "first_name");
				if (firstname == undefined)
					firstname = "";
				var lastname = getPropertyValue(model.toJSON().contacts[0].properties, "last_name");
				if (lastname == undefined)
					lastname = "";
				web_event_contact_name = firstname + " " + lastname;
			}
			$("#webEventCancelModel").modal('show');
			$("#cancel_event_title").html("Delete event &#39" + web_event_title + "&#39");
			$("#event_id_hidden").html("<input type='hidden' name='event_id' id='event_id' value='" + entity_id + "'/>");
			return;
		}

		// Gets the url to which delete request is to be sent
		var entity_url = $(this).attr('url');

		if (!entity_url)
			return;

		var id_array = [];
		var id_json = {};

		// Create array with entity id.
		id_array.push(entity_id);

		// Set entity id array in to json object with key ids,
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);
		var that = this;

		// Add loading. Adds loading only if there is no loaded image added
		// already i.e.,
		// to avoid multiple loading images on hitting delete multiple times
		if ($(this).find('.loading').length == 0)
			$(this).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));

		$.ajax({ url : entity_url, type : 'POST', data : id_json, success : function()
		{
			// Removes activity from list
			$(that).parents(".activity").parent().fadeOut(400, function()
			{
				$(this).remove();
			});
			if(dealTasksView && dealTasksView.collection.length==0)
			{
				$('#dealtasks').html(dealTasksView.render(true).el);
			}
		} });
	});

	$('#content').on('click', '.complete-deal-task', function(e)
	{
		e.preventDefault();
		if ($(this).is(':checked'))
		{
			var id = $(this).attr('data');
			var that = this;
			complete_task(id, dealTasksView.collection, undefined, function(data)
			{
				$(that).parent().siblings(".task-subject").css("text-decoration", "line-through");
				console.log($(that).parents('.activity-text-block').css("background-color", "#FFFAFA"));
				$(that).parent().replaceWith('<span style="margin-right:9px;"><i class="fa fa-check"></i></span>');
				dealTasksView.collection.add(data, { silent : true });
				
			});
		}
	});

	/**
	 * Displays activity modal with all event features,  to add a event 
	 * related to the deal in deal detail view. Also prepends the 
	 * deal name to related to field of activity modal.
	 */ 
    $('#content').on('click', '.deal-add-event', function(e){ 
    	e.preventDefault();

    	var	el = $("#activityForm");
		$('#activityModal').modal('show');
		highlight_event();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation_deal_task(el);
		agile_type_ahead("event_related_to", el, contacts_typeahead);
        agile_type_ahead("task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

    });

    // Event edit in contact details tab
	$('#content').on('click', '.event-edit-deal-tab', function(e)
					{
						e.preventDefault();
						var id = $(this).attr('data');
						var value = dealEventsView.collection.get(id).toJSON();
						deserializeForm(value, $("#updateActivityForm"));
						$("#updateActivityModal").modal('show');

						$('.update-start-timepicker').val(fillTimePicker(value.start));
						$('.update-end-timepicker').val(fillTimePicker(value.end));

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
	});

	/**
	 * Delete functionality for events blocks in deal details
	 */
	$('#content').on('click', '.deal-event-delete', function(e)
	{
		e.preventDefault();

		var model = $(this).parents('li').data();

		if (model && model.toJSON().type != "WEB_APPOINTMENT")
		{
			if (!confirm("Are you sure you want to delete?"))
				return;
		}
		else if (model && model.toJSON().type == "WEB_APPOINTMENT" && parseInt(model.toJSON().start) < parseInt(new Date().getTime() / 1000))
		{
			if (!confirm("Are you sure you want to delete?"))
				return;
		}

		if (model && model.collection)
		{
			model.collection.remove(model);
		}

		// Gets the id of the entity
		var entity_id = $(this).attr('id');

		if (model && model.toJSON().type == "WEB_APPOINTMENT" && parseInt(model.toJSON().start) > parseInt(new Date().getTime() / 1000))
		{
			web_event_title = model.toJSON().title;
			if (model.toJSON().contacts.length > 0)
			{
				var firstname = getPropertyValue(model.toJSON().contacts[0].properties, "first_name");
				if (firstname == undefined)
					firstname = "";
				var lastname = getPropertyValue(model.toJSON().contacts[0].properties, "last_name");
				if (lastname == undefined)
					lastname = "";
				web_event_contact_name = firstname + " " + lastname;
			}
			$("#webEventCancelModel").modal('show');
			$("#cancel_event_title").html("Delete event &#39" + web_event_title + "&#39");
			$("#event_id_hidden").html("<input type='hidden' name='event_id' id='event_id' value='" + entity_id + "'/>");
			return;
		}

		// Gets the url to which delete request is to be sent
		var entity_url = $(this).attr('url');

		if (!entity_url)
			return;

		var id_array = [];
		var id_json = {};

		// Create array with entity id.
		id_array.push(entity_id);

		// Set entity id array in to json object with key ids,
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);
		var that = this;

		// Add loading. Adds loading only if there is no loaded image added
		// already i.e.,
		// to avoid multiple loading images on hitting delete multiple times
		if ($(this).find('.loading').length == 0)
			$(this).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));

		$.ajax({ url : entity_url, type : 'POST', data : id_json, success : function()
		{
			// Removes activity from list
			$(that).parents(".activity").parent().fadeOut(400, function()
			{
				$(this).remove();
			});
			if(dealEventsView && dealEventsView.collection.length==0)
			{
				$('#dealevents').html(dealEventsView.render(true).el);
			}
		} });
	});

});

// }

function save_deal_tab_position_in_cookie(tab_href)
{

	var position = readCookie(deal_tab_position_cookie_name);

	if (position == tab_href)
		return;

	createCookie(deal_tab_position_cookie_name, tab_href);
}

function load_deal_tab(el, dealJSON)
{
	// timeline_collection_view = null;
	var position = readCookie(deal_tab_position_cookie_name);
	if (position)
	{
		if (position == "dealactivities")
		{
			$('#deal-details-tab a[href="#dealactivities"]', el).tab('show');

			deal_details_tab.load_deal_activities();
		}
		else if (position == "dealrelated")
		{
			$('#deal-details-tab a[href="#dealrelated"]', el).tab('show');

			deal_details_tab.loadDealRelatedContactsView();
		}
		else if (position == "dealnotes")
		{
			$('#deal-details-tab a[href="#dealnotes"]', el).tab('show');

			deal_details_tab.load_deal_notes();
		}
		else if (position == "dealdocs")
		{
			$('#deal-details-tab a[href="#dealdocs"]', el).tab('show');

			deal_details_tab.load_deal_docs();
		}
		else if (position == "dealtasks")
		{
			$('#deal-details-tab a[href="#dealtasks"]', el).tab('show');

			deal_details_tab.load_deal_tasks();
		}
		else if (position == "dealevents")
		{
			$('#deal-details-tab a[href="#dealevents"]', el).tab('show');

			deal_details_tab.load_deal_events();
		}
	}
	else
	{

		$('#deal-details-tab a[href="#dealactivities"]', el).tab('show');

		deal_details_tab.load_deal_activities();
	}

}
