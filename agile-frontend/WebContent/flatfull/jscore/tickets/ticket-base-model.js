var Ticket_Base_Model = Base_Model_View.extend({

	events:{

		"click .refresh-tickets" : "refreshTickets",

		//Ticket operations change group, assignee, priority etc
		"click .ticket_group_name" : "changeGroup",
		"click .ticket_assignee_name" : "changeAssignee",
		"click .ticket_type" : "changeTicketType",
		"click .ticket_priority" : "changeTicketPriority",

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

		//Ticket notes events
		"click .send-reply" : "sendReply",
		"click .back-to-tickets" : "backToTickets",
		"click .reply-btn" : "repltBtn",
		"click .discard-reply" : "discardReply"
	},

	refreshTickets: function(e){
		e.preventDefault();

		App_Ticket_Module.ticketsByGroup(Group_ID, Ticket_Status);

		//Fectching new, open, closed tickets count
		Tickets_Count.fetch_tickets_count();

		//Fectching ticket filters
		Ticket_Filters.fetch_filters_collection();
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

		$('.show_cc_emails_field').hide();
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
	}
});