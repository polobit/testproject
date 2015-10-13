var Ticket_Base_Model = Base_Model_View.extend({

	events:{
		
		"click .assign-ticket" : "assignTicket",
		"click .change-priority" : "changePriority",
		"click .mark-solved" : "markSolved",
		"click .delete-ticket" : "deleteTicket",
		"click .toggle-favorite" : "toggleFavorite",

		"click .refresh-tickets" : "refreshTickets",

		"click .change-group" : "changeGroup",
		"click .change-assignee" : "changeAssignee",
		"click .change-status" : "changeStatus",
		"click .change-priority" : "changePriority"
	},

	assignTicket: function(e){
		e.preventDefault();

		assignTicket(e);
	},

	changePriority: function(e){
		e.preventDefault();

		changePriority(e);
	},

	markSolved: function(e){
		e.preventDefault();

		markSolved(e);
	},

	toggleFavorite: function(e){
		e.preventDefault();

		toggleFavorite(e);
	},

	deleteTicket: function(e){
		e.preventDefault();

		deleteTicket(e);
	},

	refreshTickets: function(e){
		e.preventDefault();

		App_Ticket_Module.ticketsByGroup(Group_ID, Ticket_Status);
	},

	changeGroup: function(e){
		e.preventDefault();
	}
});