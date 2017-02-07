/**
 * contact-details-tabs.js fetches the contact (which is in contact detail view)
 * related details (notes, tasks, deals, campaigns and mails etc..) and presents
 * in tab content as specified, when the corresponding tab is clicked. Timeline
 * tab is activated by default to show all the details as vertical time-line.
 * 
 * @module deal management
 * @author jagadeesh
 */

	/*
    get actual name and update the name of the deal
    */
 function inlineDealNameChange(e){

    	
    	var dealName = $("#inline-input").val();
    	var lastname = $("#deals-inline").text();
    	name = dealName.trim();


    	if(!name)
    	{
    		$("#inline-input").addClass("error-inputfield");
          	 return;
    	}

    	if(lastname != name)
    	{
    		name = name.trim();

    		dealNameEdit(name);
    	}

    	else
    	{
    		$("#inline-input").addClass("hidden");
			$("#deals-inline").removeClass("hidden");
			return;
    	}

    	

    }

var deal_tab_position_cookie_name = "deal_tab_position";
var id;

/**
* Deal modal actions
*/
var Deal_Modal_Event_View = Base_Model_View.extend({
    events: {
    	'click #deal-details-tab a[href="#dealnotes"]' : 'openDealNotes',
    	'click #deal-details-tab a[href="#dealrelated"]' : 'openDealContacts',
    	'click #deal-details-tab a[href="#dealactivities"]' : 'openDealActivities',
    	'click #deal-details-tab a[href="#dealdocs"]' : 'openDealDocs',
    	'click #deal-details-tab a[href="#dealtasks"]' : 'openDealTasks',
    	'click #deal-details-tab a[href="#dealevents"]' : 'openDealEvents',
    	'click #deal-owner' : 'showOwnerList',

    	'click #opportunity-actions-delete' : 'opportunityDelete',
    	'click .deal-edit-note' : 'dealNoteEdit',
    	'click .activity-delete': 'deleteActivity',

    	'click #dealshow-note' : 'dealShowNoteModal',
    	'click .deal-owner-list' : 'openDealOwnersList',
    	'click .deal-add-contact' : 'addDealContact',
    	'click .deal-detail-edit-deal' : 'editDeal',
    	'click .deal-note' : 'showDealNote',
    	'click #dealdetail-archive' : 'dealArchive',
    	'click .deal-restore-detail-view' : 'dealRestoreView',
    	'click .document-edit-deal-tab' : 'dealDocumentEdit',
    	'click .document-unlink-deal-tab' : 'dealUnlinkDocument',
    	'click .add-deal-document-select' : 'dealDocumentsList',
    	'click .add-deal-edocument-select' : 'navigateToeDocument',
    	'click .add-deal-document-confirm' : 'dealAddDocumentConfirm',
    	'click .add-deal-document-cancel' : 'dealAddDocumentCancel',
    	'click .deal-add-task' : 'dealAddtask',
    	'click .task-edit-deal-tab' : 'dealEditTask',
    	'click .deal-task-delete' : 'dealDeleteTask',
    	'click .complete-deal-task' : 'dealCompleteTask',
    	'click .deal-add-event' : 'dealAddEvent',
    	'click .event-edit-deal-tab' : 'dealEditEvent',
		'click .deal-event-delete' : 'dealEditDelete', 
		'click .activity-delete' : 'deleteActivity',  
		'click #add-tags' : 'onAddDealTag',	
		'click .remove-tags' : 'onRemoveDealTag',
		'click #deal-add-tags' : 'onAddDealTags',
		//agile-x-edit
		'click #deals-inline' : 'dealInlineEdit', 	
    	'blur #inline-input' : 'dealinlineedit',
    	'keydown #inline-input' : 'dealNameChange',
    	'click .change-deal-activity' : 'dealActivityChange'
    },
    dealActivityChange : function(e){
    	console.log(e);
    	var mode = $('.change-deal-activity').attr('data');
    	dealDetailMode = mode ;
    	deal_details_tab.load_deal_activities();
    },
    dealinlineedit : function(e){
    	inlineDealNameChange();
    },

    dealNameChange : function(e)
    {
    	if(e.keyCode == 13)
    	inlineDealNameChange();
    },

    
    

    /*deals inline edit function
    shows and hides the inline input for editing
    */
    dealInlineEdit : function(e){
    	e.preventDefault();
    	$("#deals-inline").toggleClass("hidden");
    	$("#inline-input").toggleClass("hidden");
    	if(!$("#inline-input").hasClass("hidden"))
			$("#inline-input").focus();
    },
    /**
	 * Shows a form to add tags with typeahead option
	 */ 
    onAddDealTag : function(e){
    	e.preventDefault();

		$(e.currentTarget).css("display", "none");
		$("#addTagsForm").removeClass("hidden");
		$("#addTagsForm").css("display", "block");
		$("#addTags").focus();
		setup_tags_typeahead();
	
    },
    onRemoveDealTag : function(e){

    	e.preventDefault();
    	var targetEl = $(e.currentTarget);

		var tag = $(targetEl).attr("tag");
	   	var id = App_Deal_Details.dealDetailView.model.id;
     	var json = App_Deal_Details.dealDetailView.model.toJSON();
       	var that = targetEl;
     	
     	// Unbinds click so user cannot select delete again
     	$(targetEl).unbind("click");
     	var deal = new Backbone.Model();
		deal.url = 'core/api/opportunity/deleteDealTag?tag='+tag+'&id='+id;
        deal.save(json, {
       		success: function(data)
       			{ 	      		
       				$(that).closest("li").parent('ul').find('.loading').remove();
       				$(that).closest("li").remove();
       				
       			// Updates to both model and collection
	       			App_Deal_Details.dealDetailView.model.set(data.toJSON(), {silent : true});
	       			App_Deal_Details.dealDetailView.render(true);
	       		}
        });
    },
     /**
	 * "click" event of add button of tags form in contact detail view
	 * Pushes the added tags into tags array attribute of the contact and saves it
	 */ 
	 onAddDealTags : function(e){
	 	e.preventDefault();
		
	    // Add Tags
		var new_tags = get_new_tags('addTags');
		if(new_tags)new_tags=new_tags.trim();
		
		if(!new_tags || new_tags.length<=0 || (/^\s*$/).test(new_tags))
		{
			console.log(new_tags);
			return;
		}
		if (!isValidTag(new_tags, true)) {
			return;
		}
		$('#add-tags').css("display", "block");
		$("#addTagsForm").css("display", "none");
		console.log(new_tags);
		
		if(new_tags) {
			var json = App_Deal_Details.dealDetailView.model.toJSON();
			var id = App_Deal_Details.dealDetailView.model.id;
	    		
	    	
	    	// Reset form
	    	$('#addTagsForm input').each (function(){
   		  	  	$(e.currentTarget).val("");
   		  	});
	    	
	    	// Checks if tag already exists in contact
			if($.inArray(new_tags, json.tags) >= 0){
				$("#addTagsForm").css("display", "none");
        		$("#add-tags").css("display", "block");
        		$("#addTags").val('');
				return;
			}
			acl_util.canAddTag(new_tags.toString(),function(respnse){
		    	json.tagsWithTime.push({"tag" : new_tags.toString()});
	   			
		    	// Save the deal with added tags
		    	var dealWithTag = new Backbone.Model();
		        dealWithTag.url = 'core/api/opportunity/AddDealTag?tag='+new_tags+'&id='+id;
		        dealWithTag.save(json,{
		       		success: function(data){
		       			
		       			// Updates to both model and collection
		       			App_Deal_Details.dealDetailView.model.set(data.toJSON(), {silent : true});
		       			App_Deal_Details.dealDetailView.render(true);		       			
		       			console.log(new_tags);
		       			saveDealTag(new_tags);
		       			// Adds the added tags (if new) to tags collection
		       			tagsCollection.add(new BaseModel({"tag" : new_tags}));
		       		},
		       		error: function(model,response){
		       			console.log(response);
		       			alert(response.responseText);
		       		}
		        });
			});
		}
	 },

	/**
	 * Fetches all the notes related to the deal and shows the notes collection
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */
	openDealNotes :  function(e)
	{
		e.preventDefault();

		save_deal_tab_position_in_cookie("dealnotes");
		deal_details_tab.load_deal_notes();
	},
	deleteActivity : function(e)
	{
		e.preventDefault();

		Contact_Details_Tab_Actions.deleteActivity(e);
	},

	/**
	 * Fetches all the contacts related to the deal and shows the contacts
	 * collection as a table in its tab-content, when "contacts" tab is clicked.
	 */
	openDealContacts : function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealrelated");
		deal_details_tab.loadDealRelatedContactsView();
	},

	/**
	 * Fetches all the notes related to the contact and shows the tasks
	 * collection as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	openDealActivities : function(e)
	{
		e.preventDefault();

		save_deal_tab_position_in_cookie("dealactivities");
		deal_details_tab.load_deal_activities();
	},

	/**
	 * Fetches all the docs related to the deal and shows the docs collection as
	 * a table in its tab-content, when "Documents" tab is clicked.
	 */
	openDealDocs : function(e)
	{		e.preventDefault();
		save_deal_tab_position_in_cookie("dealdocs");
		deal_details_tab.load_deal_docs();
	},
	
	/**
	 * Fetches all the tasks related to the deal and shows the docs collection as
	 * a table in its tab-content, when "Tasks" tab is clicked.
	 */
	openDealTasks: function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealtasks");
		deal_details_tab.load_deal_tasks();
	},

	/**
	 * Fetches all the events related to the deal and shows the docs collection as
	 * a table in its tab-content, when "Events" tab is clicked.
	 */
	openDealEvents : function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealevents");
		deal_details_tab.load_deal_events();
	},

	deleteActivity: function(b) {
        b.preventDefault();
        Contact_Details_Tab_Actions.deleteActivity(b)
    },
    
	showOwnerList: function(e)
	{
		e.preventDefault();
		fill_deal_owners(undefined, undefined, function()
		{
			if(hasScope("UPDATE_DEALS") || $(this).attr("data") == CURRENT_DOMAIN_USER.id)
			{
				$('#deal-owner').css('display', 'none');
			}
			else
			{
				$("#deal_update_privileges_error_modal").modal("show");
			}
			$('#change-deal-owner-ul').css('display', 'inline-block');

			if ($('#change-deal-owner-ul').css('display') == 'inline-block')
				$("#change-owner-element").find(".loading").remove();

		});

	},


	opportunityDelete : function(e)
	{
		e.preventDefault();

		showAlertModal("delete_opportunity", "confirm", function(){
			var targetEl = $(e.currentTarget);
			var id = $(targetEl).closest('.deal_detail_delete').attr('data');

			$.ajax({ url : 'core/api/opportunity/' + id, type : 'DELETE', success : function(data)
			{
				Backbone.history.navigate("#deals", { trigger : true });
			}, error : function(response)
			{
				//alert("some exception occured please try again");
				showAlertModal(response.responseText, undefined, undefined, undefined, "Error");
			} });
		});
	},

	dealNoteEdit:  function(e)
	{

		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var note = dealNotesView.collection.get($(targetEl).attr('data'));
		console.log(note);
		showNoteModel(undefined , function()
		{
			deserializeForm(note.toJSON(), $("#dealnoteUpdateForm", $('#dealnoteupdatemodal')));
			fill_relation_deal($('#dealnoteUpdateForm'));
		},"dealNoteUpdateModal");
	},
	

	/**
	 * Shows note modal and activates contacts typeahead to its related to field
	 */
	dealShowNoteModal: function(e)
	{
		if (App_Deal_Details.dealDetailView.model.get('archived') == true)
			return;

		e.preventDefault();
		$("#deal-note-modal").modal('show');

	},

	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.
	 */
	openDealOwnersList: function(e)
	{

		$('#change-deal-owner-ul').css('display', 'none');
		var targetEl = $(e.currentTarget);

		// Reads the owner id from the selected option
		var new_owner_id = $(targetEl).attr('data');
		var new_owner_name = $(targetEl).text();
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

	},

	addDealContact: function(e)
	{
		e.preventDefault();
		console.log(App_Deal_Details.dealDetailView.model.toJSON());
		var currentdeal = App_Deal_Details.dealDetailView.model;
		updateDeal(currentdeal);

		//setTimeout(function()
		//{
		//	$('#opportunityUpdateForm').find("input[name='relates_to']").focus();
		//}, 800);

		$('#opportunityUpdateModal').addClass('focusRelatedTo');

	},

	editDeal:  function(e)
	{
		e.preventDefault();
		console.log(App_Deal_Details.dealDetailView.model.toJSON());
		var currentdeal = App_Deal_Details.dealDetailView.model;
		updateDeal(currentdeal);
		// To set typeahead for tags
		setup_tags_typeahead();
	},

	showDealNote: function(e)
	{
		e.preventDefault();

		showNoteModel(undefined , function()
            {
              var el1 = $("#dealnoteForm");
            // Displays contact name, to indicate the note is related to the contact
              fill_relation_deal(el1);
              },"new-deal-notemodel");
		
		// Displays contact name, to indicate the note is related to the contact
		//$('#deal-note-modal').modal('show');
	},

	dealArchive: function(e)
	{
		e.preventDefault();

		var currentDeal = App_Deal_Details.dealDetailView.model.toJSON();
		$("#archived-deal-id", $("#deal_archive_confirm_modal")).val(currentDeal.id);
		$("#archived-deal-milestone", $("#deal_archive_confirm_modal")).val(currentDeal.milestone);
		$("#deal_archive_confirm_modal").modal('show');

	},

	dealRestoreView: function(e)
	{
		e.preventDefault();

		var currentDeal = App_Deal_Details.dealDetailView.model.toJSON();

		$("#restored-deal-id", $("#deal_restore_confirm_modal")).val(currentDeal.id);
		$("#restored-deal-milestone", $("#deal_restore_confirm_modal")).val(currentDeal.milestone);
		$("#deal_restore_confirm_modal").modal('show');

	},

	//For updating document from contact-details
	dealDocumentEdit: function(e){
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var document_id = $(targetEl).attr('data');
		var currentDeal = App_Deal_Details.dealDetailView.model.toJSON();
		
		Backbone.history.navigate("documents/"+document_id+"/" + currentDeal.id,{trigger: true});	
		//updateDocument(dealDocsView.collection.get(id));
	},

	// For unlinking document from contact-details
	dealUnlinkDocument: function(e){
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var id = $(targetEl).attr('data');
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
			},
			error : function(model, response){
				showModalConfirmation("Delete <span class='text-cap'>"+model.get("entity_type")+"</span>", 
					'<span>'+response.responseText.replace("attached", "detached")+'</span>', 
					function (){
						return;
					}, 
					function(){
						return;
					},
					function (){
						return;
					},
					'Cancel'
				);
				return;
			}
		});
	},

	/**
	 * For showing new/existing documents
	 */
	navigateToeDocument:function(e)
	{
		e.preventDefault();
		var deal_json = App_Deal_Details.dealDetailView.model.toJSON();
		Backbone.history.navigate("documents/deal/" + deal_json.id+ "/edoc",{trigger: true});	        
	},
	dealDocumentsList: function(e){
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var el = $(targetEl).closest("div");
		$(targetEl).css("display", "none");
		$(".add-deal-edocument-select,.dropdown-toggle",el).css("display", "none");
		el.find(".deal-document-select").css("display", "block");
		var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	    fillSelect('document-select','core/api/documents', 'documents',  function fillNew()
		{
			var text = _agile_get_translated_val("misc-keys", "add-new-doc");
			el.find("#document-select > option:first").after("<option value='new'>" + text + "</option><option style='font-size: 1pt; background-color: #EDF1F2;'disabled>&nbsp;</option>");
			el.find("#document-select > option:first").remove();
		}, optionsTemplate, false, el); 
	},

	/**
	 * For adding existing document to current contact
	 */
	dealAddDocumentConfirm: function(e){
		e.preventDefault();
		var targetEl = $(e.currentTarget);

	    var document_id = $(targetEl).closest(".deal-document-select").find("#document-select").val();
		var saveBtn = $(targetEl);
		
			// To check whether the document is selected or not
	    if(document_id == "")
	    {
	    	var linkedtext = _agile_get_translated_val("validation-msgs", "this-field-is-required");
	    	saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>" + linkedtext + "</span>");
	    	saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
	    	return;
	    }	    	
	    else if(document_id == "new")
	    {
	    	var deal_json = App_Deal_Details.dealDetailView.model.toJSON();
	    	Backbone.history.navigate("documents/deal/" + deal_json.id+ "/attachment",{trigger: true});	        
	    	return;
	    	$('#uploadDocumentModal').html(getTemplate("upload-document-modal", {})).modal('show');
			
			var el = $("#uploadDocumentForm");
			// Contacts type-ahead
			agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);
			
			// Deals type-ahead
			agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

	    	var deal_json = App_Deal_Details.dealDetailView.model.toJSON();
	    	var deal_name = deal_json.name;

	    	var template = Handlebars.compile('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="{{id}}">{{name}}</li>');
  
		 	// Adds contact name to tags ul as li element
		 	$('.deal_tags',el).html(template({name : deal_name, id : deal_json.id}));
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

	},

	/**
	 * To cancel the add documents request
	 */
	dealAddDocumentCancel: function(e){
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var el = $(targetEl).closest("div");
		el.find(".deal-document-select").css("display", "none");
		el.find(".add-deal-document-select,.add-deal-edocument-select,.dropdown-toggle").css("display", "inline");
		
	},

	
	dealAddtask:  function(e){ 
    	e.preventDefault();
    	$('#activityTaskModal').html(getTemplate("new-task-modal")).modal('show');

		var	el = $("#taskForm");
		highlight_task();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation_deal_task(el);

		agile_type_ahead("task_related_to", el, contacts_typeahead);

        agile_type_ahead("task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
		categories.getCategoriesHtml(undefined,function(catsHtml){
		   $('#type',el).html(catsHtml);
		   // Fills owner select element
		   populateUsers("owners-list", $("#taskForm"), undefined, undefined,
		     function(data) {
		      $("#taskForm").find("#owners-list").html(data);
		      $("#owners-list", el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		      $("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();     
		   });
		  });

       activateSliderAndTimerToTaskModal();
    },

    dealEditTask: function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var id = $(targetEl).attr('data');
		var value = dealTasksView.collection.get(id).toJSON();

		$("#updateTaskModal").html(getTemplate("task-update-modal")).modal('show');
			loadProgressSlider($("#updateTaskForm"), function(el){
			deserializeForm(value, $("#updateTaskForm"));
			
			$('.update-task-timepicker').val(fillTimePicker(value.due));
			agile_type_ahead("task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
			categories.getCategoriesHtml(value,function(catsHtml){
			   $('#type',el).html(catsHtml);			   
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
		});
			
		// activateSliderAndTimerToTaskModal();

	},
	/**
	 * Delete functionality for tasks blocks in deal details
	 */
	dealDeleteTask: function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var model = $(targetEl).parents('li').data();

		if (model && (model.toJSON().type != "WEB_APPOINTMENT" || parseInt(model.toJSON().start) < parseInt(new Date().getTime() / 1000)))
		{
			showAlertModal("delete", "confirm", function(){
				modelDelete(model, targetEl, function(){
					if(dealTasksView && dealTasksView.collection.length==0){
						$('#dealtasks').html(dealTasksView.render(true).el);
					}
				});
			});
			return;
		}
		modelDelete(model, targetEl, function(){
			if(dealTasksView && dealTasksView.collection.length==0){
				$('#dealtasks').html(dealTasksView.render(true).el);
			}
		});
		
	},

	dealCompleteTask: function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		if ($(targetEl).is(':checked'))
		{
			var id = $(targetEl).attr('data');
			var that = targetEl;
			//showAlertModal("complete_task", "confirm", function() 
			//{
				complete_task(id, dealTasksView.collection, undefined, function(data)
				{
					$(that).parent().siblings(".task-subject").css("text-decoration", "line-through");
					console.log($(that).parents('.activity-text-block').css("background-color", "#FFFAFA"));
					$(that).parent().replaceWith('<span style="margin-right:9px;"><i class="fa fa-check"></i></span>');
					dealTasksView.collection.add(data, { silent : true });
				});
			 //});
		}
	},

	/**
	 * Displays activity modal with all event features,  to add a event 
	 * related to the deal in deal detail view. Also prepends the 
	 * deal name to related to field of activity modal.
	 */ 
    dealAddEvent: function(e){ 
    	e.preventDefault();

    	$('#activityModal').html(getTemplate("new-event-modal")).modal('show');

    	var	el = $("#activityForm");

		highlight_event();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation_deal_task(el);
		agile_type_ahead("event_related_to", el, contacts_typeahead);
        agile_type_ahead("task_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
        
        var size = $('.newtypeaheadcontact', el).children().length;
       	if(size && size > 0){        
        	var sendInviteHtml = '<div class="control-group"><div class="checkbox col-sm-offset-3 col-sm-6"><label class="i-checks i-checks-sm c-p">';
        	sendInviteHtml += '<input type="checkbox" name="sendInvite" id="sendInviteEmail" checked/><i></i> Send Email Invitation </label></div></div>';
        	$('#sendEmailInviteBlock').html(sendInviteHtml);
    	}

    },

    // Event edit in contact details tab
	dealEditEvent: function(e)
					{
						e.preventDefault();
						var targetEl = $(e.currentTarget);

						$("#updateActivityModal").html(getTemplate("update-activity-modal"));
						
						var id = $(targetEl).attr('data');
						var value = dealEventsView.collection.get(id).toJSON();
						deserializeForm(value, $("#updateActivityForm"));
						var color_box_id = $("#updateActivityForm #backgroundColor").val().replace("#","");
					    $("#updateActivityForm").find('div[id='+color_box_id+']').children().addClass('bcp-selected');

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
			var description = '<label class="control-label"><b>'+_agile_get_translated_val("misc-keys", "description")+' </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="' + _agile_get_translated_val("misc-keys", "add-description") + '"></textarea></div>'

			$("#event_desc").html(description);
			$("textarea#description").val(value.description);
		}
		else
		{
			var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> ' + _agile_get_translated_val("misc-keys", "add-description") + ' </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="' + _agile_get_translated_val("misc-keys", "add-description") + '"></textarea>' + '</div></div></div>'
			$("#event_desc").html(desc);
		}
		// Fills owner select element
		populateUsersInUpdateActivityModal(value);
	},

	/**
	 * Delete functionality for events blocks in deal details
	 */
	dealEditDelete: function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget)

		var model = $(targetEl).parents('li').data();

		var owner = model.get("owner_id");

	  	if(!owner && model.get("owner")){
	  		owner = model.get("owner").id;
	  	}

		if(!hasScope("DELETE_CALENDAR") && model.get("entity_type") && model.get("entity_type") == "event"){
			$("#deleteEventErrorModal").html(getTemplate("delete-event-error-modal")).modal('show');
			return;
		}

		if (model && (model.toJSON().type != "WEB_APPOINTMENT" || parseInt(model.toJSON().start) < parseInt(new Date().getTime() / 1000)))
		{
			showAlertModal("delete", "confirm", function(){
				modelDelete(model, targetEl, function(){
					if(dealEventsView && dealEventsView.collection.length==0)
						$('#dealevents').html(dealEventsView.render(true).el);
				});
			});
			return;
		}
		modelDelete(model, targetEl, function(){
			if(dealEventsView && dealEventsView.collection.length==0)
				$('#dealevents').html(dealEventsView.render(true).el);
		});
	},

});

function save_deal_tab_position_in_cookie(tab_href)
{

	var position = _agile_get_prefs(deal_tab_position_cookie_name);

	if (position == tab_href)
		return;

	_agile_set_prefs(deal_tab_position_cookie_name, tab_href);
}

function load_deal_tab(el, dealJSON)
{
	// timeline_collection_view = null;
	var position = _agile_get_prefs(deal_tab_position_cookie_name);
	if (position)
	{
		//Any tab is saved as cookie and if that tab doesn't have permissions,
		//change the tab position to contacts
		if($('#deal-details-tab a[href="#'+position+'"]', el).length == 0)
		{
			position = "dealactivities";
		}

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


$(function(){
 	/**
	 * Saves note model using "Bcakbone.Model" object, and adds saved data to
	 * time-line if necessary.
	 */
	$('#newNoteModal').on('click', '#dealnote_validate', function(e)
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

		saveDealNote($("#dealnoteForm"), $("#newNoteModal"), this, json);
	});

	$('#newNoteModal').on('click', '#dealnote_update', function(e)
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

		saveDealUpdateNote($("#dealnoteUpdateForm"), $("#newNoteModal"), this, json);

	});

});
