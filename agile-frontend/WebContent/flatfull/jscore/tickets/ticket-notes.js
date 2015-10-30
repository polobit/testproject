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
			},
			error: function(data, response){

				$('.error-msg').html(response.responseText);

				enable_save_button($save_btn);

				setTimeout(function(){
					$('.error-msg').html('');
				}, 3000);
			}
		});
	},

	backToTickets: function(e){

		//Rendering existing Tickets collection
		$('#right-pane').html(Tickets_Group_View.render().el);

		$("#filters-list-container").html(App_Ticket_Module.ticketFiltersCollection.el);
		
		if(!App_Ticket_Module.ticketsCollection){

			Group_ID = (!Group_ID ? DEFAULT_GROUP_ID : Group_ID);

			var url = '/core/api/tickets?status=' + Ticket_Status + '&group_id=' + Group_ID;

			if(Ticket_Filter_ID)
				url = '/core/api/tickets/filter?filter_id=' + Ticket_Filter_ID;

			Tickets.fetch_tickets_collection(url, Group_ID);
		}
		else{
			$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
		}

		var url = (Ticket_Filter_ID) ? '#tickets/filter/' + Ticket_Filter_ID : '#tickets/group/'+ Group_ID +'/' + Ticket_Status;

		//$("#right-pane").html(App_Ticket_Module.ticketsCollection.el);
		Backbone.history.navigate(url, {
				trigger : false
		});

		//Enable click events
		Tickets_Group_View.delegateEvents();
	},
	repltBtn: function(e){

		var ticketModel = App_Ticket_Module.ticketView.model;

		$('#reply-editor').html(getTemplate('create-ticket-notes', ticketModel.toJSON()));
		$('#send-reply-container').hide();

		//Scroll to bottom of page
		$("html, body").animate({ scrollTop: $(document).height() }, 1000);

		//Initialize tooltips
		$('[data-toggle="tooltip"]', $('#reply-editor')).tooltip();
	},
	discardReply: function(e){
		$('#reply-editor').html('');
		$('#send-reply-container').show();
	},

	showCannedMessages: function(e){

		var deleteTicketView = new Base_Model_View({
			isNew : true,
			url : "/core/api/tickets/delete-ticket?id=" + Current_Ticket_ID,
			template : "ticket-delete",
			saveCallback : function(){

				$('#ticket-delete-modal').modal('hide');
				var url = '#tickets/group/'+ (!Group_ID ? DEFAULT_GROUP_ID : Group_ID) + 
					'/' + (Ticket_Status ? Ticket_Status : 'new');

				Backbone.history.navigate(url, {trigger : true});
			}
		});

		$('#ticket-modals').html(deleteTicketView.render().el);
		$('#ticket-delete-modal').modal('show');
	}
};