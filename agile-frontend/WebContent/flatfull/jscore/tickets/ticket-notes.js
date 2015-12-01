var Tickets_Notes = {

	sendReply : function(e) {

		e.preventDefault();

		var $save_btn = $('.send-reply');
		disable_save_button($save_btn);

		var json = serializeForm("send-reply");

		var note_type = $(e.target).hasClass('private') ? 'PRIVATE' : 'PUBLIC';
		json.note_type = note_type;

		var newTicketNotesModel = new BaseModel();
		newTicketNotesModel.url = '/core/api/tickets/notes';
		newTicketNotesModel.save(json, {

			success : function(model) {

				Tickets_Notes.discardReply();
				App_Ticket_Module.notesCollection.collection.add(model);
				App_Ticket_Module.notesCollection.render(true);
			},
			error : function(data, response) {

				$('.error-msg').html(response.responseText);

				enable_save_button($save_btn);

				setTimeout(function() {
					$('.error-msg').html('');
				}, 3000);
			}
		});
	},

	backToTickets : function(e) {

		Tickets.renderExistingCollection();
		Ticket_Bulk_Ops.clearSelection();

		// Initializing checkbox events
		Ticket_Bulk_Ops.initEvents();
	},

	repltBtn : function(e) {

		var ticketModel = App_Ticket_Module.ticketView.model;

		$('#reply-editor').html(
				getTemplate('create-ticket-notes', ticketModel.toJSON()));
		$('#send-reply-container').hide();

		// Scroll to bottom of page
		// $("html, body").animate({ scrollTop: $(document).height() }, 1000);

		// Initialize tooltips
		$('[data-toggle="tooltip"]', $('#reply-editor')).tooltip();
	},

	appendCannedResponseMessage : function(e) {

		var ticketModel = App_Ticket_Module.ticketView.model;

		$('#reply-editor').html(getTemplate('create-ticket-notes', ticketModel.toJSON()));

		// Get canned response
		var cannedMessage = e.currentTarget.children.message.innerHTML + "<br><br><br>";
		
		$("#reply-editor").find("#reply_textarea").html(
				cannedMessage + $("#reply-editor").find("#reply_textarea").text());

		$('#send-reply-container').hide();

		// Scroll to bottom of page
		// $("html, body").animate({ scrollTop: $(document).height() }, 1000);

		// Initialize tooltips
		$('[data-toggle="tooltip"]', $('#reply-editor')).tooltip();
	},

	discardReply : function(e) {
		$('#reply-editor').html('');
		$('#send-reply-container').show();
	},

	showCannedMessages : function(e) {

		var deleteTicketView = new Base_Model_View({
			isNew : true,
			url : "/core/api/tickets/delete-ticket?id=" + Current_Ticket_ID,
			template : "ticket-delete",
			saveCallback : function() {

				$('#ticket-delete-modal').modal('hide');
				var url = '#tickets/group/'
						+ (!Group_ID ? DEFAULT_GROUP_ID : Group_ID) + '/'
						+ (Ticket_Status ? Ticket_Status : 'new');

				Backbone.history.navigate(url, {
					trigger : true
				});
			}
		});

		$('#ticket-modals').html(deleteTicketView.render().el);
		$('#ticket-delete-modal').modal('show');
	},

	executeWorkflow : function(e) {

		var $that = $(e.target);

		console.log($that.data('id'));

		$('#ticket_id').val(Current_Ticket_ID);
		$('#workflow_id').val($that.data('id'));
		$that.closest('form').submit();
	}
};