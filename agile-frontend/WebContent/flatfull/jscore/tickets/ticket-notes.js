function initializeTicketNotesEvent(el){

	$(el).on('click', '.send-reply', function(e){
		e.preventDefault();
	
		var $save_btn = $(this);
		disable_save_button($save_btn);

		var json = serializeForm("send-reply");

		console.log(json);

		var note_type = $(this).hasClass('private') ? 'PRIVATE' : 'PUBLIC';
		json.note_type = note_type;

		$.ajax({
			url : '/core/api/tickets/notes',
			type : 'post',
			contentType:'application/x-www-form-urlencoded',
			accept: 'application/json',
			async:false,
			data : json,
			success : function()
			{
				setTimeout(function() {
					 enable_save_button($save_btn);
			     	}, 2000);

				App_Ticket_Module.renderNotesCollection(json.ticket_id, $('#notes-collection-container'), function(){

					 $("html, body").animate({ scrollTop: $(document).height() }, 1000);	
				});
			},
			error : function(error)
			{
				$('#error_message').html("There was an error in saving your settings. Please try again in a minute.");
				enable_save_button($save_btn);
			} 
		});
	});

	/**
	 * Click event for back button
	 */
	$(el).on('click', '#back-to-tickets', function(e){
		e.preventDefault();

		//Rendering existing Tickets collection
		$('#right-pane').html(Tickets_Group_View.render().el);
		$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);

		//$("#right-pane").html(App_Ticket_Module.ticketsCollection.el);

		Backbone.history.navigate('#tickets/group/'+ Group_ID +'/' + Ticket_Status, {
				trigger : false
		});
	});

	/**
	 * Click event for reply button to show text area
	 */
	$(el).on('click', '#reply-btn', function(e){
		e.preventDefault();

		$('#reply-editor').show();
		$('#send-reply-container').hide();
	});

	/**
	 * Click event for reply button to show text area
	 */
	$(el).on('click', '#discard-reply', function(e){
		e.preventDefault();

		$('#reply-editor').hide();
		$('#send-reply-container').show();
	});
}

/**
 *
 **/
function assignTicket(event){

	$("#ticket-assign-modal").modal('hide'); 

	// Removes previous modals if exist. 
	if($('#ticket-assign-modal').size() != 0)
		 $('#ticket-assign-modal').remove();
	

	var assignModalView = new Base_Model_View({
		isNew : false, 
		template : "ticket-assign",
		saveCallback : function(){
			$("#ticket-assign-modal").modal('hide');
		},
		url : "/core/api/tickets/assign-ticket",
		postRenderCallback : function(el) {

			head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
			{
				var LHS, RHS;

				// Assigning elements with ids LHS
				// and RHS
				// in trigger-add.html
				LHS = $("#group_id", el);
				RHS = $("#assignee_id", el);

				// Chaining dependencies of input
				// fields
				// with jquery.chained.js
				RHS.chained(LHS);
			});
		}
	});

  	$('#assign-ticket').html(assignModalView.render().el);

  	setTimeout(function(){
  		$("#ticket-assign-modal").modal('show');
  	},0);
}