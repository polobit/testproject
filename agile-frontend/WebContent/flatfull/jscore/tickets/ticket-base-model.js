var Ticket_Base_Model = Base_Model_View.extend({

	events:{

		"click .refresh-tickets" : "refreshTickets",

		//Ticket operations change group, assignee, priority etc
		/*"click .ticket_group_name" : "changeGroup",*/
		"click .ticket_status" : "changeStatus",
		"click .ticket_assignee_name" : "changeAssignee",
		"click .ticket_type" : "changeTicketType",
		"click .ticket_priority" : "changeTicketPriority",
		"click .delete-ticket" : "deleteTicket",
		"click .show-workflows" : "workflows",
		"mouseover .hover-edit" : "showEditIcon",
		"mouseout  .hover-edit" : "hideEditIcon",
		"click .widgets" : "showWidgets",

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

		//Ticket notes events
		"click .send-reply" : "sendReply",
		"click .back-to-tickets" : "backToTickets",
		"click .reply-btn" : "repltBtn",
		"click .discard-reply" : "discardReply",
		"click .timeline" : "renderTicketTimeline",
		"click .canned-messages" : "showCannedMessages"
	},

	refreshTickets: function(e){
		e.preventDefault();

		Reload_Tickets_Count = true;

		App_Ticket_Module.ticketsByGroup(Group_ID, Ticket_Status);

		//Fectching new, open, closed tickets count
		Tickets_Count.fetch_tickets_count(Group_ID);

		//Fectching ticket filters
		Ticket_Filters.fetchFiltersCollection();
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

		($(e.target).val() == 'OPEN') ? $('.grp-assigee').show() : $('.grp-assigee').hide();
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

	showWidgets: function(e){
		e.preventDefault();
		
		var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

		//Loading widgets
		if(ticketModel && ticketModel.contactID){
			var contactDetails = Backbone.Model.extend({urlRoot : '/core/api/contacts/' + ticketModel.contactID});
			new contactDetails().fetch({success: function(contact, response, options){
					loadWidgets(App_Ticket_Module.ticketView.el, contact.toJSON());
				}, error: function(){}
			});
		}
	}
});