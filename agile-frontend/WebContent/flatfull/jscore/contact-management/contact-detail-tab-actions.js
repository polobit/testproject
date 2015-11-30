var existingDocumentsView;

$(function()
{
	$('body').on('click', '.task-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		var value = tasksView.collection.get(id).toJSON();

		deserializeForm(value, $("#updateTaskForm"));

		$("#updateTaskModal").modal('show');

		$('.update-task-timepicker').val(fillTimePicker(value.due));
		categories.getCategoriesHtml(value,function(catsHtml){
			$('#type',$("#updateTaskForm")).html(catsHtml);
			// Fills owner select element
			populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data)
			{
				$("#updateTaskForm").find("#owners-list").html(data);
				if (value.taskOwner)
					$("#owners-list", $("#updateTaskForm")).find('option[value=' + value['taskOwner'].id + ']').attr("selected", "selected");
	
				$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
			});
		});

		// Add notes in task modal
		showNoteOnForm("updateTaskForm", value.notes);

		activateSliderAndTimerToTaskModal();

	});

	// Event edit in contact details tab
	$('body').on('click', '.event-edit-contact-tab', function(e)
					{
						e.preventDefault();
						var id = $(this).attr('data');
						var value = eventsView.collection.get(id).toJSON();
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

	$('body').on('click', '.complete-task', function(e)
	{
		e.preventDefault();
		if ($(this).is(':checked'))
		{
			var id = $(this).attr('data');
			var that = this;
			complete_task(id, tasksView.collection, undefined, function(data)
			{
				$(that).parent().siblings(".task-subject").css("text-decoration", "line-through");
				console.log($(that).parents('.activity-text-block').css("background-color", "#FFFAFA"));
				$(that).parent().replaceWith('<span style="margin-right:9px;"><i class="fa fa-check"></i></span>');
				tasksView.collection.add(data, { silent : true });
			});
		}
	});

	// For adding new deal from contact-details
	$('body').on('click', '.contact-add-deal', function(e)
	{
		e.preventDefault();
		var el = $("#opportunityForm");
		$("#opportunityModal").modal('show');

		add_custom_fields_to_form({}, function(data)
		{
			var el_custom_fields = show_custom_fields_helper(data["custom_fields"], [
				"modal"
			]);
			$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));

		}, "DEAL");

		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data)
		{

			$("#opportunityForm").find("#owners-list").html(data);
			$("#owners-list", $("#opportunityForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
			$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
		});
		// Contacts type-ahead
		agile_type_ahead("relates_to", el, contacts_typeahead);

		// Fills the pipelines list in select box.
		populateTrackMilestones(el, undefined, undefined, function(pipelinesList)
		{
			console.log(pipelinesList);
			$.each(pipelinesList, function(index, pipe)
			{
				if (pipe.isDefault)
				{
					var val = pipe.id + '_';
					if (pipe.milestones.length > 0)
					{
						val += pipe.milestones.split(',')[0];
						$('#pipeline_milestone', el).val(val);
						$('#pipeline', el).val(pipe.id);
						$('#milestone', el).val(pipe.milestones.split(',')[0]);
					}

				}
			});
		});

		populateLostReasons(el, undefined);

		populateDealSources(el, undefined);

		// Enable the datepicker

		$('#close_date', el).datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY});


		var json = null;
		if(company_util.isCompany()){
			json = App_Companies.companyDetailView.model.toJSON();
		} else {
			json = App_Contacts.contactDetailView.model.toJSON();
		}
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

	});

	// For updating a deal from contact-details
	$('body').on('click', '.deal-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updateDeal(dealsView.collection.get(id));
	});

	// For Adding new case from contacts/cases
	$('body').on('click', '.contact-add-case', function(e)
	{
		e.preventDefault();
		var el = $("#casesForm");

		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data)
		{

			$("#casesForm").find("#owners-list").html(data);
			$("#owners-list", $("#casesForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
			// Contacts type-ahead
			agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);

			// Enable the datepicker

			$('#close_date', el).datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY });


			var json = null;
			if(company_util.isCompany()){
				json = App_Companies.companyDetailView.model.toJSON();
			} else {
				json = App_Contacts.contactDetailView.model.toJSON();
			}
			var contact_name = getContactName(json);
			$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

			$("#casesModal").modal('show');
		});
	});

	// For updating a case from contact-details
	$('body').on('click', '.cases-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updatecases(casesView.collection.get(id));
	});

	// Adding contact when user clicks Add contact button under Contacts tab in
	// Company Page
	$('body').on('click', '.contact-add-contact', function(e)
	{
		e.preventDefault();

		// This is a hacky method. ( See jscore/contact-management/modals.js for
		// its use )
		// 'forceCompany' is a global variable. It is used to enforce Company
		// name on Add Contact modal.
		// Prevents user from removing this company from the modal that is
		// shown.
		// Disables typeahead, as it won't be needed as there will be no Company
		// input text box.
		var json = {};

		if(Current_Route.indexOf("company") > -1)
			 json = App_Companies.companyDetailView.model.toJSON();
		else 
			 json = App_Contacts.contactDetailView.model.toJSON();

		forceCompany.name = getContactName(json); // name of Company
		forceCompany.id = json.id; // id of Company
		forceCompany.doit = true; // yes force it. If this is false the
		// Company won't be forced.
		// Also after showing modal, it is set to false internally, so
		// Company is not forced otherwise.
		//$('#personModal').modal('show');
		$.ajax({
			url : 'core/api/custom-fields/scope?scope=CONTACT',
			type : 'GET',
			dataType : 'json',
			success : function(data){
				if(data.length > 0)
				{
					Backbone.history.navigate("contact-add" , {trigger: true});
					setTimeout(function(){ 
					$("#continueform").find("ul[name=contact_company_id]").html('<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="'+forceCompany.id+'"><span><a class="text-white m-r-xs" href="#contact/'+forceCompany.id+'">'+forceCompany.name+'</a><a class="close text-white" id="remove_tag">×</a></span></li>')
					}, 800);
				}
				else
					$("#personModal").modal("show");
			}
		});
	});

	// For adding new document from contact-details
	$('body').on('click', '.contact-add-document', function(e)
	{
		e.preventDefault();
		var el = $("#uploadDocumentForm");
		$("#uploadDocumentModal").modal('show');

		// Contacts type-ahead
		agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

		// Deals type-ahead
		agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

		var json = null;
		if(company_util.isCompany()){
			json = App_Companies.companyDetailView.model.toJSON();
		} else {
			json = App_Contacts.contactDetailView.model.toJSON();
		}
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');
	});

	// For updating document from contact-details
	$('body').on('click', '.document-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updateDocument(documentsView.collection.get(id));
	});

	// For unlinking document from contact-details
	$('body').on('click', '.document-unlink-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		var json = documentsView.collection.get(id).toJSON();

		// To get the contact id and converting into string
		var contact_id = "";
		
		if(company_util.isCompany())
			contact_id = App_Companies.companyDetailView.model.id + "";
		else
			contact_id = App_Contacts.contactDetailView.model.id + "";

		// Removes the contact id from related to contacts
		json.contact_ids.splice(json.contact_ids.indexOf(contact_id), 1);

		// Updates the document object and hides
		var newDocument = new Backbone.Model();
		newDocument.url = 'core/api/documents';
		newDocument.save(json, { success : function(data)
		{
			documentsView.collection.remove(json);
			documentsView.render(true);
		} });
	});

	/**
	 * For showing new/existing documents
	 */
	$('body').on('click', '.add-document-select', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".contact-document-select").css("display", "block");
		var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
		fillSelect('document-select', 'core/api/documents', 'documents', function fillNew()
		{
			el.find("#document-select").append("<option value='new'>Add New Doc</option>");

		}, optionsTemplate, false, el);
	});

	/**
	 * To cancel the add documents request
	 */
	$('body').on('click', '.add-document-cancel', function(e)
	{
		e.preventDefault();
		var el = $("#documents");
		el.find(".contact-document-select").css("display", "none");
		el.find(".add-document-select").css("display", "inline-block");
	});

	/**
	 * For adding existing document to current contact
	 */
	$('body').on('click', '.add-document-confirm', function(e)
	{
		e.preventDefault();

		var document_id = $(this).closest(".contact-document-select").find("#document-select").val();

		var saveBtn = $(this);

		// To check whether the document is selected or not
		if (document_id == "")
		{
			saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>This field is required.</span>");
			saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
			return;
		}
		else if (document_id == "new")
		{
			var el = $("#uploadDocumentForm");
			$("#uploadDocumentModal").modal('show');

			// Contacts type-ahead
			agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

			// Deals type-ahead
			agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

			var json = null;
			if(company_util.isCompany()){
				json = App_Companies.companyDetailView.model.toJSON();
			} else {
				json = App_Contacts.contactDetailView.model.toJSON();
			}
			var contact_name = getContactName(json);
			$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');
		}
		else if (document_id != undefined && document_id != null)
		{
			if (!existingDocumentsView)
			{
				existingDocumentsView = new Base_Collection_View({ url : 'core/api/documents', restKey : "documents", });
				existingDocumentsView.collection.fetch({ success : function(data)
				{
					existing_document_attach(document_id, saveBtn);
				} });
			}
			else
				existing_document_attach(document_id, saveBtn);
		}

	});

});

/**
 * To attach the document to a contact
 * 
 * @param document_id
 * @param saveBtn
 */
function existing_document_attach(document_id, saveBtn)
{
	var json = existingDocumentsView.collection.get(document_id).toJSON();

	// To get the contact id and converting into string
	var contact_id = null;
	
	if(company_util.isCompany()){
		contact_id = App_Companies.companyDetailView.model.id + "";
	} else {
		contact_id = App_Contacts.contactDetailView.model.id + "";
	}

	// Checks whether the selected document is already attached to that contact
	if ((json.contact_ids).indexOf(contact_id) < 0)
	{
		json.contact_ids.push(contact_id);
		saveDocument(null, null, saveBtn, false, json);
	}
	else
	{
		saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>Linked Already</span>");
		saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
		hideTransitionBar();
		return;
	}
}
