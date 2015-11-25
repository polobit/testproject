var Ticket_Base_Model = Base_Model_View.extend({

	events:{

		//Ticket operations change group, assignee, priority etc
		/*"click .ticket_group_name" : "changeGroup",*/
		"click .ticket_status" : "changeStatus",
		"click .ticket_assignee_name" : "changeAssignee",
		"change .ticket_type" : "changeTicketType",
		"change .ticket_priority" : "changeTicketPriority",
		"click .delete-ticket" : "deleteTicket",
		"click .show-workflows" : "workflows",
		"click .toggle-timeline" : "toggleTimeline",
		"click #change-sla" : "changeSla",
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

		//New ticket events
		"click .show_cc_emails_field" : "showCCEmailsField",
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
		"click .back-to-tickets" : "backToTickets",
		"click .reply-btn" : "repltBtn",
		"click .discard-reply" : "discardReply",
		"click .timeline" : "renderTicketTimeline",
		"click .canned-messages" : "showCannedMessages",

		//Bulk actions
		"click .bulk-manage-labels" : "bulkManageLabels"
	},

	changeStatus: function(e){
		e.preventDefault();

		Tickets.changeStatus(e);
	},

	changeGroup: function(e){
		e.preventDefault();

		Tickets.changeGroup(e);
	},

	changeAssignee: function(e){
		e.preventDefault();

		Tickets.changeAssignee(e);
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

	backToTickets: function(e){
		e.preventDefault();
		
		Tickets_Notes.backToTickets(e);
	},
	repltBtn: function(e){
		e.preventDefault();
		
		Tickets_Notes.repltBtn(e);
	},
	discardReply: function(e){
		e.preventDefault();
		
		Tickets_Notes.discardReply(e);	
	},

	toggleTimeline: function(e){

		var tooltip_text = 'Timeline';
		if($('.ticket-timeline-container').is(':visible'))
		{
			//Rendering ticket notes
			App_Ticket_Module.renderNotesCollection(Current_Ticket_ID, $('#notes-collection-container', App_Ticket_Module.ticketView.el), function(){});
		}
		else{
			Ticket_Timeline.render_individual_ticket_timeline();
			tooltip_text = 'Notes';
		}

		$('.toggle-timeline').attr('data-original-title', tooltip_text);
	},

	changeSla: function(e){
		e.preventDefault();

		$('#datetimepicker').show();

		var ticketJSON = App_Ticket_Module.ticketView.model.toJSON();
		var defaultDate = (ticketJSON.due_time) ? moment.unix(Math.floor(ticketJSON.due_time/1000)) : false;
		
		$('#datetimepicker').data("DateTimePicker").defaultDate(defaultDate);
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

	deleteTicket: function(e){
		e.preventDefault();
		
		Tickets.deleteTicket();
	},

	workflows: function(e){
		e.preventDefault();
		
		Tickets.showWorkflows();
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
	},

	bulkManageLabels: function(e){
		console.log(e);

		Ticket_Bulk_Ops.bulkManageLabels();
	}
});