var Ticket_Base_Model = Base_Model_View.extend({

	events:{

		"click .refresh-tickets" : "refreshTickets",

		"click .ticket_group_name" : "changeGroup",
		"click .ticket_assignee_name" : "changeAssignee",
		"click .ticket_type" : "changeTicketType",
		"click .ticket_priority" : "changeTicketPriority",

		"click .to-emails" : "toEmails",

		"click .clone-filter-ticket-conditions" : "cloneTicketFiltersRow",
		"click .remove-filter-ticket-conditions" : "removeTicketFiltersRow"
	},

	refreshTickets: function(e){
		e.preventDefault();

		App_Ticket_Module.ticketsByGroup(Group_ID, Ticket_Status);
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
	}
});