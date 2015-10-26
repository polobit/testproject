var Tickets_Notes = {

	sendReply: function(e){

		e.preventDefault();
	
		var $save_btn = $('.send-reply');
		disable_save_button($save_btn);

		var json = serializeForm("send-reply");

		var note_type = $(e.target).hasClass('private') ? 'PRIVATE' : 'PUBLIC';
		json.note_type = note_type;

		var newTicketNotesModel = new BaseModel();
		newTicketNotesModel.url = '/core/api/tickets/notes';
		newTicketNotesModel.save(json, {
			
			success: function(model){

				Tickets_Notes.discardReply();
				App_Ticket_Module.notesCollection.collection.add(model);
				App_Ticket_Module.notesCollection.render(true);
			}
		});
	},

	backToTickets: function(e){

		//Rendering existing Tickets collection
		$('#right-pane').html(Tickets_Group_View.render().el);

		setTimeout(function(){

			if(!App_Ticket_Module.ticketsCollection){

				var url = '/core/api/tickets?status=' + Ticket_Status + '&group_id=' + Group_ID;

				if(Ticket_Filter_ID)
					url = '/core/api/tickets/filter?filter_id=' + Ticket_Filter_ID;

				Tickets.fetch_tickets_collection(url, Group_ID);
			}
			else{
				$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
			}	
		}, 0);

		var url = (Ticket_Filter_ID) ? '#tickets/filter/' + Ticket_Filter_ID : '#tickets/group/'+ Group_ID +'/' + Ticket_Status;

		//$("#right-pane").html(App_Ticket_Module.ticketsCollection.el);
		Backbone.history.navigate(url, {
				trigger : false
		});

		//Enable click events
		Tickets_Group_View.delegateEvents();
	},
	repltBtn: function(e){

		var ticketModel = App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID);

		$('#reply-editor').html(getTemplate('create-ticket-notes', ticketModel.toJSON()));
		$('#send-reply-container').hide();

		//Scroll to bottom of page
		$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	},
	discardReply: function(e){
		$('#reply-editor').html('');
		$('#send-reply-container').show();
	}
};