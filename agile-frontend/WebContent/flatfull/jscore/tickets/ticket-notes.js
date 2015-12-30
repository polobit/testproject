var Tickets_Notes = {

	sendReply : function(e) {

		e.preventDefault();

		if(!$("#send-reply #reply_textarea").val())
			return;

		var $save_btn = $(e.target);
		disable_save_button($save_btn);

		var json = serializeForm("send-reply");

		json.html_text = json.html_text + "<br><br>" +CURRENT_USER_PREFS.signature;

		if($(e.target).hasClass('forward')){
			this.forwardTicket(json, $save_btn);
			return;
		}

		var note_type = $(e.target).hasClass('private') ? 'PRIVATE' : 'PUBLIC';
		json.note_type = note_type;

		if($(e.target).hasClass('close-ticket'))
			json.close_ticket="true";

		
		var newTicketNotesModel = new BaseModel();
		newTicketNotesModel.url = '/core/api/tickets/notes';
		newTicketNotesModel.save(json, {

			success : function(model) {

				Tickets_Notes.repltBtn('reply');

				App_Ticket_Module.notesCollection.collection.add(model);
				App_Ticket_Module.notesCollection.render(true);

				// If in time line add event to timeline
				if($('.ticket-timeline-container').length > 0){
					Ticket_Timeline.render_individual_ticket_timeline()
				}
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

	forwardTicket : function(data, targetEle){

		var newTicketNotesModel = new BaseModel();
		newTicketNotesModel.url = '/core/api/tickets/forward-ticket';
		newTicketNotesModel.save(data, {

			success : function(model) {

				Tickets_Notes.repltBtn('reply');

				// If in time line add event to timeline
				if($('.ticket-timeline-container').length > 0){
					Ticket_Timeline.render_individual_ticket_timeline()
				}
			},
			error : function(data, response) {

				$('.error-msg').html(response.responseText);

				enable_save_button(targetEle);

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

	repltBtn : function(reply_type, el) {

		var ticketModel = App_Ticket_Module.ticketView.model;
		var data = ticketModel.toJSON();

		data.reply_type = (reply_type) ? reply_type : "reply";
			
		if(data.reply_type == 'forward')
			data.notes = this.constructTextComments(App_Ticket_Module.notesCollection.collection.toJSON());

		if(Ticket_Canned_Response.cannedResponseCollection && Ticket_Canned_Response.cannedResponseCollection.toJSON() 
			&& Ticket_Canned_Response.cannedResponseCollection.toJSON().length > 0)
			data.canned_responses = Ticket_Canned_Response.cannedResponseCollection.toJSON();

		data.label_matched_canned_responses = this.getMatchedCannedResponses(data.labels);

		var $container = (el) ?  $('#send-reply-container', el): $('#send-reply-container');

		$container.html(getTemplate('create-ticket-notes', data));

		head.js('/flatfull/lib/jquery.textarea-expander.js', function()
		{	
			try{
				$('textarea#reply_textarea', $container).TextAreaExpander();
			}catch(e){}
			
		});

		//Initializing type ahead for cc emails
		$($container).on('keypress', '#forward_email_input', function(e){

			e.stopImmediatePropagation();
			
			if(e.which == 13) {

				var email = $('#forward_email_input').val();

	        	if(!email)
	        		return;
	        	
	        	var err_email = !Tickets.isValidEmail(email);

	        	$('ul.forward-emails').prepend(getTemplate('forward-email-li', {email: email, err_email: err_email}));
	        	$('#forward_email_input').val('');

	        	return false;

	    	}
		});

		if($("#forward_email_input", $container).length > 0){
			agile_type_ahead("forward_email_input", $container, tickets_typeahead, function(arg1, arg2){

				arg2 = arg2.split(" ").join("");

				var email = TYPEHEAD_EMAILS[arg2 + '-' + arg1];

				if(!email || email == 'No email')
					return;

				$('ul.forward-emails').prepend(getTemplate('forward-email-li', {email: email}));
				$('#forward_email_input').val('');
		  		
		  	},undefined, undefined, 'core/api/search/');
		}

		$($container).on('click', '.remove-ticket-forward-emails', function() {
			$(this).closest('li').remove();
		});

		
		// $('textarea#reply_textarea', $container).focus();

		$($container).on('click', '#ticket_canned_response', function() {

			var ticketModel = App_Ticket_Module.ticketView.model;

			var cannedResponseId = $(this).attr('rel');

			var message;

			var cannedResponseArray = (Ticket_Canned_Response.cannedResponseCollection) ? Ticket_Canned_Response.cannedResponseCollection.toJSON() : [];

			for (var i = 0; i < cannedResponseArray.length; i++) {
				if(cannedResponseArray[i].id == cannedResponseId){
					var template = Handlebars.compile(cannedResponseArray[i].message);
					message = template(data);;
					break;
				}
			};

			if(!message)
				return;

			// Get canned response
			var cannedMessage =  message + "<br><br>";
			
			$container.find("#reply_textarea").val(
					cannedMessage + $container.find("#reply_textarea").text());

		})

		// Scroll to bottom of page
		// $("html, body").animate({ scrollTop: $(document).height() }, 1000);

		// Initialize tooltips
		// $('[data-toggle="tooltip"]', $('#reply-editor')).tooltip();
	},

	getMatchedCannedResponses : function(labels){

		var allowedCannedResponses = [];

		if(!Ticket_Canned_Response.cannedResponseCollection)
			return;

		$.each(Ticket_Canned_Response.cannedResponseCollection.toJSON(), function(index, eachCannedResponse){

			     cannedResponseLabels = eachCannedResponse.labels;

			     var isAllowed = (cannedResponseLabels.length == 0) ? false : true;

			     for (var i = 0; i < cannedResponseLabels.length; i++) {
					if($.inArray(cannedResponseLabels[i], labels) == -1){
			     		isAllowed = false;
			     		break;
			     	}
				}

			     if(isAllowed)
			     	allowedCannedResponses.push(eachCannedResponse);
		});

		return allowedCannedResponses;

	},

	constructTextComments : function(notesCollection) {

		var notesText = "";

		if(!notesCollection || notesCollection.length == 0)
			return notesText;

		$.each(notesCollection, function(index, note){
			notesText += note.original_plain_text + "\n\n-----------------------------------------\n\n";
		})

		console.log("notesText = " + notesText);

		return notesText;

	},

	/**
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
		// $('[data-toggle="tooltip"]', $('#reply-editor')).tooltip();
	},
	*/

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

		var workflowId = $(e.target).attr('id');

		if(!workflowId)
			return;

		var json = {};
		json.workflow_id = workflowId;
		json.ticket_id = Current_Ticket_ID;


		// Send req to trigger campaign
		var newTicketModel = new BaseModel();
		newTicketModel.url = "core/api/tickets/execute-workflow";
		newTicketModel.save(json, 
			{	success: function(model){

			}}
		);

	}
};