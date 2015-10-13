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

	console.log(event);

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

			$("#ticket-assign-modal", el).modal('show');
			$('input#ticket_id', el).val($('.ticket-operations').attr('ticket-id'));
			
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

  	$('#ticket-modals').html(assignModalView.render().el);
}

/**
 *
 **/
function changePriority(event){

	$("#ticket-priority-modal").modal('hide'); 

	// Removes previous modals if exist. 
	if($('#ticket-priority-modal').size() != 0)
		 $('#ticket-priority-modal').remove();
	

	var changePriorityView = new Base_Model_View({
		isNew : true, 
		template : "ticket-priority",
		saveCallback : function(){
			$("#ticket-priority-modal").modal('hide');
		},
		url : "/core/api/tickets/change-priority",
		postRenderCallback : function(el) {

			$("#ticket-priority-modal", el).modal('show');
			$('input#ticket_id', el).val($('.ticket-operations').attr('ticket-id'));
		}
	});

  	$('#ticket-modals').html(changePriorityView.render().el);
}

/**
 *
 **/
function markSolved(event){

	$("#ticket-mark-solved-modal").modal('hide'); 

	// Removes previous modals if exist. 
	if($('#ticket-mark-solved-modal').size() != 0)
		 $('#ticket-mark-solved-modal').remove();
	

	var changePriorityView = new Base_Model_View({
		isNew : true, 
		template : "ticket-mark-solved",
		saveCallback : function(){
			$("#ticket-mark-solved-modal").modal('hide');
		},
		url : "/core/api/tickets/mark-solved",
		postRenderCallback : function(el) {

			$("#ticket-mark-solved-modal", el).modal('show');
			$('input#ticket_id', el).val($('.ticket-operations').attr('ticket-id'));
		}
	});

  	$('#ticket-modals').html(changePriorityView.render().el);
}

/**
 *
 **/
function toggleFavorite(event){

	var $btn = $('button.toggle-favorite');
	var is_favorite = ($btn.attr('is_favorite') == 'false') ? true : false;

	var json = {};
	json.id = $('.ticket-operations').attr('ticket-id');
	json.is_favorite = is_favorite;

	$.ajax({
		url : '/core/api/tickets/make-favorite',
		type : 'PUT',
		contentType: "application/json;charset=utf-8",
		accept:'application/json',
		data : JSON.stringify(json),
		dataType: "json",
		success : function()
		{
			$btn.attr('is_favorite', is_favorite);

			$btn.attr('data-original-title', (is_favorite) ? 'Unfavorite' : 'Favorite');

			if(is_favorite)
				$btn.find('i').removeClass('fa fa-star-o').addClass('fa fa-star');
			else
				$btn.find('i').removeClass('fa fa-star').addClass('fa fa-star-o');
		}
	});
}

/**
 *
 **/
function deleteTicket(event){

	$("#ticket-delete-modal").modal('hide'); 

	// Removes previous modals if exist. 
	if($('#ticket-delete-modal').size() != 0)
		 $('#ticket-delete-modal').remove();
	

	var changePriorityView = new Base_Model_View({
		isNew : true, 
		template : "ticket-delete",
		saveCallback : function(){
			$("#ticket-delete-modal").modal('hide');
		},
		url : "/core/api/tickets/delete-ticket",
		postRenderCallback : function(el) {

			$("#ticket-delete-modal", el).modal('show');
			$('input#ticket_id', el).val($('.ticket-operations').attr('ticket-id'));
		}
	});

  	$('#ticket-modals').html(changePriorityView.render().el);
}