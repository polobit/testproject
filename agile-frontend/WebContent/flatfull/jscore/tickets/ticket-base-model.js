var Ticket_Base_Model = Base_Model_View.extend({

	events:{

		//Ticket operations change group, assignee, priority etc
		/*"click .ticket_group_name" : "changeGroup",*/
		"change .ticket_status" : "changeStatus",
		"click .ticket_assignee_name" : "changeAssignee",
		"click .assign-to-me" : "assignToMe",

		"change .ticket_type" : "changeTicketType",
		"change .ticket_priority" : "changeTicketPriority",
		"click .delete-ticket" : "deleteTicket",
		"click .close-ticket" : "closeTicket",
		"click .show-workflows" : "workflows",
		"click #workflows_list li a" : "executeWorkflows",

		"click .toggle-timeline" : "toggleTimeline",
		"click .toggle-activities-notes" : "toggleActivitiesAndNotes",

		// "click #change-sla" : "changeSla",
		"click .contact-deals" : "showContactDeals",
		"mouseover .hover-edit" : "showEditIcon",
		"mouseout  .hover-edit" : "hideEditIcon",

		"click .to-emails" : "toEmails",

		//Ticket Filters click events
		"click .clone-filter-ticket-conditions" : "cloneTicketFiltersRow",
		"click .remove-filter-ticket-conditions" : "removeTicketFiltersRow",

		//Ticket tags events
		"click .show-tags-field" : "showTagsField",
		"click .remove-ticket-tags" : "removeTicketTags",

		"click .remove-ticket-cc-emails" : "removeTicketCCEmails",
		"click .add-me-to-cc" : "addMeToCC",

		//New ticket events
		// "click .show_cc_emails_field" : "showCCEmailsField",
		"change .status" : "toggleGroupAssigneeFields",
		"click .nt-reqester_email" : "showContactTypeAhead",
		"click .toggle-options" : "toggleOptions",

		//Attachment events
		"click .toggle-docs-dropdown" : "toggleDocsDropdown",
		"click .add-document" : "addDocument",
		"click .cancel-docs-dropdown" : "cancelDocsDropdown",
		"click .remove-attachment" : "removeAttachment",

		//Ticket notes events
		"click .send-reply" : "sendReply",
		// "click .back-to-tickets" : "backToTickets",
		"click .reply-btn" : "repltBtn",
		"click .discard-reply" : "discardReply",
		"click .timeline" : "renderTicketTimeline",
		"click .canned-messages" : "showCannedMessages",
		// "click .ticket-canned-response" : "appendCannedResponseMessage"

		"click .toggle-favorite" : "toggleFavorite",
		"click .toggle-spam" : "toggleSpam",
		"click .toggle-widgets" : "toggleWidgets"
	},

	changeStatus: function(e){
		e.preventDefault();

		var status = $(e.target).val();

		Tickets.changeStatus(status, function(){

				showNotyPopUp('information', "Ticket status has been changed to " + status.toLowerCase(), 'bottomRight', 3000);

				var url = '#tickets/group/'+ (!Group_ID ? DEFAULT_GROUP_ID : Group_ID) + 
					'/' + status;

				Backbone.history.navigate(url, {trigger : true});

			});
	},

	changeGroup: function(e){
		e.preventDefault();

		Tickets.changeGroup(e);
	},

	changeAssignee: function(e){
		e.preventDefault();

		Tickets.changeAssignee(e);
	},

	assignToMe : function(e){

		e.preventDefault();

		// var $selected_option = $('select#ticket-assignee-list').find('option:selected');

		var groupId = App_Ticket_Module.ticketView.model.toJSON().groupID;
		var assigneeId = CURRENT_AGILE_USER.domainUser.id;

		$('#ticket-assignee').find("optgroup[data-group-id='"+groupId+"']").find("option[value='"+assigneeId+"']").attr('selected', 'selected');
		
		$('.assign-to-me').hide();

		Tickets.sendReqToChangeAssignee(assigneeId, groupId, App_Ticket_Module.ticketView.model.toJSON(), function(model){

			App_Ticket_Module.ticketView.model.set(model, {silent: true});
		});
		

	},

	addMeToCC : function(e){
		e.preventDefault();
		Tickets.addMeToCC();
	},

	changeTicketType: function(e){
		e.preventDefault();

		Tickets.changeTicketType(e);
	},

	changeTicketPriority: function(e){
		e.preventDefault();

		Tickets.changeTicketPriority(e);
	},

	toEmails: function(e){
		e.preventDefault();

		Tickets.toEmails();
	},

	cloneTicketFiltersRow: function(e){
		e.preventDefault();

		Ticket_Filters.cloneTicketFiltersRow(e);
	},

	removeTicketFiltersRow: function(e){
		e.preventDefault();

		Ticket_Filters.removeTicketFiltersRow(e);
	},

	showTagsField: function(e){
		e.preventDefault();

		Ticket_Tags.showTagsField();
	},

	removeTicketTags: function(e){
		e.preventDefault();

		Ticket_Tags.removeTag(e);
	},

	removeTicketCCEmails : function(e){
		e.preventDefault();

		Tickets.removeCCEmails(e);
	},


	showCCEmailsField: function(e){
		e.preventDefault();

		$('div.form-group.cc_emails_container').show();
		$('#cc_email_field').focus();
	},

	toggleGroupAssigneeFields: function(e){
		e.preventDefault();

		var disable_selection = ($(e.target).val() == 'OPEN') ? false : true;
		
		$('.grp-assigee').attr('disabled', disable_selection);
	},

	showContactTypeAhead: function(e){
		e.preventDefault();

		$('#reqester_email').hide();
		$('#reqester_email_typeahead').show().val($('#reqester_email').val()).focus();
	},

	toggleOptions: function(e){
		e.preventDefault();

		var $fields = $('.d-nt-show');
		var $icon = $('.toggle-options').find('i');

		if($fields.is(':visible'))
		{
			//hide more fields
			$fields.hide();

			$icon.attr('data-original-title', 'Show fields');

			//change icon to angle down
			$icon.removeClass('fa-angle-double-up').addClass('fa-angle-double-down');

		}else{
			//show more fields
			$fields.show();

			$icon.attr('data-original-title', 'Hide fields');

			//change to angle up icon
			$icon.removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
		}
	},

	sendReply: function(e){
		e.preventDefault();

		Tickets_Notes.sendReply(e);	
	},

	repltBtn: function(e){
		e.preventDefault();

		var $this = $(e.target);
		
		Tickets_Notes.repltBtn($this.attr('rel'));
	},

	/**
	appendCannedResponseMessage : function(e){
		e.preventDefault();
		
		Tickets_Notes.appendCannedResponseMessage(e);
	},
	*/

	discardReply: function(e){
		e.preventDefault();
		
		Tickets_Notes.discardReply(e);	
	},

	toggleTimeline: function(e){

		var tooltip_text = 'Show timeline';
		if($('.ticket-timeline-container').is(':visible'))
		{
			//Rendering ticket notes
			$(".toggle-activities-notes").show();
			App_Ticket_Module.renderNotesCollection(Current_Ticket_ID, $('#notes-collection-container', App_Ticket_Module.ticketView.el), function(){});
		}
		else{
			$(".toggle-activities-notes").hide();
			Ticket_Timeline.render_individual_ticket_timeline();
			tooltip_text = 'Show comments';
		}

		$('.toggle-timeline').text(tooltip_text);
	},

	toggleActivitiesAndNotes : function(e){

		var targetEle = $(".toggle-activities-notes");
		var currentType = targetEle.attr("rel");

		if(currentType && currentType == "notes"){
			App_Ticket_Module.renderActivitiesCollection(Current_Ticket_ID, $('#notes-collection-container', App_Ticket_Module.ticketView.el), function(){});
			targetEle.attr("rel", "activities");
			targetEle.attr("data-original-title", "Show notes");
			targetEle.html("<i class='fa fa-ellipsis-v'></i>");
		}
		else{
			//Rendering ticket notes
			App_Ticket_Module.renderNotesCollection(Current_Ticket_ID, $('#notes-collection-container', App_Ticket_Module.ticketView.el), function(){});
			targetEle.attr("rel", "notes");
			targetEle.attr("data-original-title", "Show activities");
			targetEle.html("<i class='fa fa-ellipsis-h'></i>");
		}
		
	},

	showContactDeals: function(e){
		e.preventDefault();

		var ticketJSON = App_Ticket_Module.ticketView.model.toJSON();
		var contactID = ticketJSON.contact.id;

		if(!contactID)
		{
			$('div#contact-deals').html('No deals');
			return;
		}

		var Deals = Backbone.Collection.extend({
		  url: '/core/api/contacts/' + contactID + '/deals'
		});

		new Deals().fetch({success: function(collection){
			$('div#contact-deals').html(getTemplate('ticket-deals-list', collection.toJSON()));
		}});
	},

	renderTicketTimeline: function(e){
		e.preventDefault();

		Ticket_Timeline.render_individual_ticket_timeline();
	},

	showCannedMessages: function(e){
		e.preventDefault();

		Tickets_Notes.showCannedMessages(e);
	},

	toggleFavorite : function(e){
		e.preventDefault();
		
		Tickets.toggleFavorite(e);
	},

	toggleSpam : function(e){
		e.preventDefault();
		
		Tickets.toggleSpam(e);
	},

	toggleWidgets : function(e){
		e.preventDefault();
		
		Tickets.toggleWidgets(e);
	},


	deleteTicket: function(e){
		e.preventDefault();
		
		Tickets.deleteTicket();
	},

	closeTicket : function(e){
		e.preventDefault();
		
		Tickets.closeTicket();
	},

	workflows: function(e){
		e.preventDefault();
		
		Tickets.showWorkflows(e);
	},

	executeWorkflows :  function(e){
		e.preventDefault();
		
		Tickets_Notes.executeWorkflow(e);
	},

	showEditIcon: function(e){
		e.preventDefault();
		$(e.target).find('.icon-edit').removeClass('hide');
	},
	
	hideEditIcon: function(e){
		e.preventDefault();
		$(e.target).find('.icon-edit').addClass('hide');
	},

	toggleDocsDropdown: function(e){
		e.preventDefault();

		Ticket_Attachments.toggleDocsDropdown();
	},

	addDocument: function(e){
		e.preventDefault();

		Ticket_Attachments.addDocument();
	},

	cancelDocsDropdown: function(e){
		e.preventDefault();

		Ticket_Attachments.cancelDocsDropdown();
	},

	removeAttachment: function(e){
		e.preventDefault();

		Ticket_Attachments.removeAttachment(e);
	}
});