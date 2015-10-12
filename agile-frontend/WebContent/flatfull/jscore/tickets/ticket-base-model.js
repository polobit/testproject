var Ticket_Base_Model = Base_Model_View.extend({

	events:{
		
		"click .assign-ticket" : "assignTicket"
	},

	assignTicket: function(e){
		e.preventDefault();

		assignTicket(e);
	}
});