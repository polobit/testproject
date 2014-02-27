
var existingDocumentsView;

$(function(){
	$(".task-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		var value = tasksView.collection.get(id).toJSON();
		deserializeForm(value, $("#updateTaskForm"));
    	$("#updateTaskModal").modal('show');
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data){
			$("#updateTaskForm").find("#owners-list").html(data);
			if(value.taskOwner)
				$("#owners-list", $("#updateTaskForm")).find('option[value='+value['taskOwner'].id+']').attr("selected", "selected");
			
			$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
		});
	});
	
	// Event edit in contact details tab
	$(".event-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		var value = eventsView.collection.get(id).toJSON();
		deserializeForm(value, $("#updateActivityForm"));
    	$("#updateActivityModal").modal('show');
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
		$("#opportunityModal").modal('show');
		
		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data){
			
			$("#opportunityForm").find("#owners-list").html(data);
			$("#owners-list", $("#opportunityForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
			$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
		});
		// Contacts type-ahead
		agile_type_ahead("relates_to", el, contacts_typeahead);
		
		// Fills milestone select element
		populateMilestones(el, undefined, undefined, function(data){
			$("#milestone", el).html(data);
			$("#milestone", el).closest('div').find('.loading-img').hide();
		});

		// Enable the datepicker
		$('#close_date', el).datepicker({
			format : 'mm/dd/yyyy',
		});
		
    	var json = App_Contacts.contactDetailView.model.toJSON();
    	var contact_name = getContactName(json);
    	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
		
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
        	var contact_name = getContactName(json);
        	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
			
			$("#casesModal").modal('show');
		});
	});
	
	// For updating a case from contact-details
	$(".cases-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		updatecases(casesView.collection.get(id));
	});
	
	//Adding contact when user clicks Add contact button under Contacts tab in Company Page
	$(".contact-add-contact").die().live('click',function(e)
	{
		e.preventDefault();
		
		//This is a hacky method. ( See jscore/contact-management/modals.js for its use )
		//'forceCompany' is a global variable. It is used to enforce Company name on Add Contact modal.
		//Prevents user from removing this company from the modal that is shown.
		//Disables typeahead, as it won't be needed as there will be no Company input text box.
		var json = App_Contacts.contactDetailView.model.toJSON();
		forceCompany.name=getContactName(json); //name of Company
		forceCompany.id=json.id;	// id of Company
		forceCompany.doit=true;		// yes force it. If this is false the Company won't be forced.
									// Also after showing modal, it is set to false internally, so 
									// Company is not forced otherwise.
		$('#personModal').modal('show');
	});
	
	// For adding new document from contact-details
	$(".contact-add-document").die().live('click', function(e){
		e.preventDefault();
		var el = $("#uploadDocumentForm");
		$("#uploadDocumentModal").modal('show');

		// Contacts type-ahead
		agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

    	var json = App_Contacts.contactDetailView.model.toJSON();
    	var contact_name = getContactName(json);
    	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
	});
	
	// For updating document from contact-details
	$(".document-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		updateDocument(documentsView.collection.get(id));
	});
	
	/**
	 * For showing existing documents
	 */
	$(".document-exist").die().live('click', function(e){
		e.preventDefault();
	    
		var el = $("#existinguploadDocumentForm");
		$("#existingDocumentModal").modal('show');
		$("#existingDocumentModal").find('.save-status').html("");
		
		if(! existingDocumentsView)
		{
			existingDocumentsView = new Base_Collection_View({ 
				url : 'core/api/documents',
				restKey : "documents",
				templateKey : "contact-document",
				descending : true,
				sortKey :'upload_time',
				individual_tag_name : 'tr',
				postRenderCallback : function(el)
					{
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$(".document-created-time", el).timeago();
						});
					}
			});
		}
		existingDocumentsView.collection.fetch();
		$("#document-list", this.el).html(existingDocumentsView.render().el);

	});
	
	/**
	 * When a existing document is selected changing background color
	 */
	$("#contact-document-model-list > tr").die().live('click', function(e){
		$("#existingDocumentModal").find('.save-status').html("");
		$("#contact-document-model-list").find("tr.documentSelected").removeClass("documentSelected");
		$(this).closest("tr").addClass("documentSelected");
	});
	
	/**
	 * For adding existing document to current contact
	 */
	$("#existing_document_update").die().live('click', function(e){
		e.preventDefault();
	    var saveBtn = $(this);
		
	    var document_id = $("#contact-document-model-list").find(".documentSelected").find('.data').attr('data');
	    
	    // To check whether the document is selected or not
	    if(document_id == undefined)
	    {
	    	$("#existingDocumentModal").find('.save-status').html('<span style="color:red;">Please select a document</span>');
	    	enable_save_button($(saveBtn));
	    	return;
	    }
	    	
	    var json = existingDocumentsView.collection.get(document_id).toJSON();

		// To get the contact id and converting into string
		var contact_id = App_Contacts.contactDetailView.model.id + "";
	    
	    // Checks whether the selected document is already attached to that contact
	    if((json.contact_ids).indexOf(contact_id) < 0)
	    {
	    	json.contact_ids.push(contact_id);
	    	saveDocument(null, "existingDocumentModal", saveBtn, false, json);
	    }
	    else
	    {
	    	enable_save_button($(saveBtn));
	    	$('#existingDocumentModal').modal('hide');
	    	return;
	    }
	});
	
	// For unlinking document from contact-details
	$(".document-unlink-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		var json = documentsView.collection.get(id).toJSON();
		
		// To get the contact id and converting into string
		var contact_id = App_Contacts.contactDetailView.model.id + "";
		
	    // Removes the contact id from related to contacts
		json.contact_ids.splice(json.contact_ids.indexOf(contact_id),1);
		
		// Updates the document object and hides 
		var newDocument = new Backbone.Model();
		newDocument.url = 'core/api/documents';
		newDocument.save(json, {
			success : function(data) {
				documentsView.collection.remove(json);
				documentsView.render(true);
			}
		});
	});
	
});