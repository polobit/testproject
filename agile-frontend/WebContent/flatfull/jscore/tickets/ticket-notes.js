var Tickets_Notes = {

	sendReply : function(e) {

		e.preventDefault();

		var $save_btn = $(e.target);
		
		$("#send-reply").validate({
  			  debug : true,
			  highlight : function(element, errorClass) {
			   $(element).closest('div').addClass('has-error');
			  },
			 unhighlight : function(element, errorClass) {
			   $(element).closest('div').removeClass('has-error');
			  },
			  errorPlacement: function(error, element) {
				$(element).closest('div').addClass('has-error');
			  }
		});

		if(!$("#send-reply").valid()){

			if($(e.target).hasClass('forward'))
				this.forwardTicket(json, $save_btn, false);
			    return;
		}
			

		var json = serializeForm("send-reply");

		json.html_text = json.html_text.trim() + "\r\n\r\n" + CURRENT_USER_PREFS.signature;

		if($(e.target).hasClass('forward')){
		    this.forwardTicket(json, $save_btn, true);
			return;
        }

		var note_type = $(e.target).hasClass('private') ? 'PRIVATE' : 'PUBLIC';
		json.note_type = note_type;

        var is_ticket_closed = $(e.target).hasClass('close-ticket');
         
        if(is_ticket_closed)
			json.close_ticket="true";
        
        disable_save_button($save_btn);

		var newTicketNotesModel = new BaseModel();
		newTicketNotesModel.url = '/core/api/tickets/notes/' + Current_Ticket_ID;
		newTicketNotesModel.save(json, {

			success : function(model) {

				var notes_json = model.toJSON();

				// Remove draft message from local staorage
				$('textarea#reply_textarea').val("");

				Tickets.remove_draft_message(Current_Ticket_ID, ((note_type == 'PUBLIC') ? 'reply' : 'comment'));
                
                if(notes_json.note_type == 'PRIVATE'){
                	showNotyPopUp('information', "Comment has been added" + ((is_ticket_closed) ? ' and status changed to Closed' : ''), 'bottomRight', 5000);
                }else{
	                
	                var msg = 'Comment has been added and ticket status changed to ' + ((is_ticket_closed) ? 'Closed' : 'Pending');

	                showNotyPopUp('information', msg, 'bottomRight', 5000);
				}
				
				var json = {};
                
                if(is_ticket_closed){
	            	$(".ticket_status").val("CLOSED");
	            	json.status = 'CLOSED'; 
	            }

	            if( App_Ticket_Module.ticketsCollection){

	                var ticket_model = App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID);

					//Update model in collection
					if(notes_json.note_type != 'PRIVATE'){
	                    
						var current_date = new Date().getTime();
	                    
	                    json.status = (is_ticket_closed) ? 'CLOSED' : 'PENDING'; 
	   					json.last_updated_time = current_date;
						json.closed_time= (is_ticket_closed) ? current_date : '';
						json.last_reply_text = notes_json.plain_text;
						json.last_updated_by = 'AGENT';
						json.user_replies_count = notes_json.user_replies_count;
					    json.assigneeID = model.attributes.assignee_id;
					}

					ticket_model.set(json, {
						silent : true
					});

					var next_ticket_url = $(".navigation .next-ticket").attr("href");

					if(next_ticket_url)
						Backbone.history.navigate(next_ticket_url, {
							trigger : true
						});

					return;
				}

				Tickets.renderExistingCollection();
				return;
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

	forwardTicket : function(data, targetEle, isValid){

		var emails = [];

		$('ul.forward-emails > li').each(function(index){
			var email =  $(this).find('a.anchor').text();
			if(email)
				emails.push(email);
		});

		if(emails.length == 0){
			$('ul.forward-emails').addClass("ticket-input-border-error");
			return;
		}
		
		if(!isValid)
			return;

		//set to emails
		data.email = emails.join();

		$.ajax({
			url : '/core/api/tickets/forward-ticket',
			method: "POST",
			data: data,
			contentType: 'application/x-www-form-urlencoded',
			accept: 'application/json',
			success : function(data){
				
				showNotyPopUp('information', "Ticket has been forwarded to " + emails.join(), 
					'bottomRight', 5000);

				// Remove draft message from local staorage
				$('textarea#reply_textarea').val("");
				Tickets.remove_draft_message(Current_Ticket_ID, 'forward');

				var next_ticket_url = $(".navigation .next-ticket").attr("href");
				if(next_ticket_url){
					Backbone.history.navigate(next_ticket_url, {
						trigger : true
					});
					return;
				}

				Tickets.renderExistingCollection();
			}	
		});
	},

	repltBtn : function(reply_type, el) {

		var ticketModel = App_Ticket_Module.ticketView.model;

		var data = ticketModel.toJSON();

		data.reply_type = (reply_type) ? reply_type : "reply";
		if(data.reply_type == 'forward')
		 data.notes = this.constructTextComments(App_Ticket_Module.notesCollection.collection.toJSON());
		

		if(Ticket_Canned_Response.cannedResponseCollection && 
			Ticket_Canned_Response.cannedResponseCollection.toJSON())
			data.canned_responses = Ticket_Canned_Response.cannedResponseCollection.toJSON();

		data.label_matched_canned_responses = this.getMatchedCannedResponses(data.labels);
		data.draft_message = (Tickets.get_draft_message())[data.id];

		var $container = (el) ?  $('#send-reply-container', el): $('#send-reply-container');

		$container.html(getTemplate('create-ticket-notes', data));

		if(data.reply_type == 'forward'){
			$("#macro_list", $container).addClass("disabled text-muted");
			$("#macro_list").css("cursor","no-drop");
		}

		Ticket_Utils.loadTextExpander(function()
		{	
			try{
				$('textarea#reply_textarea', $container).TextAreaExpander({'padding' : '8px 8px 1px 8px' });
				$('textarea#reply_textarea', $container).css({'height':'60px'});
			}catch(e){}
		});

		Tickets.start_ticket_draft_timer(data.id, 'textarea#reply_textarea');

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

	        	var emails = [];
	        	$('ul.forward-emails > li').each(function(index){
					var email =  $(this).find('a.anchor').text();
					if(email)
						emails.push(email);
				});

				if(emails.length > 0){
					$('ul.forward-emails').removeClass("ticket-input-border-error");
				}

	        	return false;
	    	}
		});

		if($("#forward_email_input", $container).length > 0){
			agile_type_ahead("forward_email_input", $container, Tickets_Typeahead.contact_typeahead, function(arg1, arg2){

				arg2 = arg2.split(" ").join("");

				var email = TYPEHEAD_EMAILS[arg2 + '-' + arg1];

				if(!email || email == 'No email')
					return;

				$('ul.forward-emails').prepend(getTemplate('forward-email-li', {email: email}));
				$('#forward_email_input').val('');

				$('ul.forward-emails').removeClass("ticket-input-border-error");
		  		
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

			Ticket_Utils.loadInsertCursor(function()
			{	
				$container.find("#reply_textarea").insertAtCaret(message);
			});
		})
	},

	getMatchedCannedResponses : function(labels){

		var allowedCannedResponses = [];

		if(!Ticket_Canned_Response.cannedResponseCollection)
			return;

		$.each(Ticket_Canned_Response.cannedResponseCollection.toJSON(), function(index, eachCannedResponse){

			     cannedResponseLabels = eachCannedResponse.labels;

			     if(!cannedResponseLabels)
			     	return true;

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
			
			if(note.note_type == "PRIVATE")
              	return;

            var noteAttachment=note.attachments_list;

            notesText += note.plain_text;
              
	        if(noteAttachment.length >0)
	            notesText +="\n\nAttachments:";   

	        $.each(noteAttachment,function(index,note_Attachment){
	           
	            notesText += "\n"+ (index+=1) +". "+note_Attachment.name+" - "+ encodeURI(note_Attachment.url);
	          
	        });
	         
            notesText += "\n\n-----------------------------------------\n\n";

            notesText = notesText.replace(/<br\s*[\/]?>/gi, "\n");
        });

		return notesText;
	},

	showCannedMessages : function(e) {

		var deleteTicketView = new Base_Model_View({
			isNew : true,
			url : "/core/api/tickets/delete-ticket?id=" + Current_Ticket_ID,
			template : "ticket-delete",
			saveCallback : function() {

				$('#ticketsModal').modal('hide');
				var url = '#tickets/group/'
						+ (!Group_ID ? DEFAULT_GROUP_ID : Group_ID) + '/'
						+ (Ticket_Status ? Ticket_Status : 'new');

				Backbone.history.navigate(url, {
					trigger : true
				});
			}
		});

		$('#ticketsModal').html(deleteTicketView.render().el).modal('show');
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
		newTicketModel.save(json, {	
				success: function(model){
					showNotyPopUp('information', 'Workflow execution has been started successfully', 'bottomRight', 5000);
			}}
		);
	},

	showOriginal: function(id, type){

		var params  = 'width=550';
		params += ', height=' + (screen.height-200);
		params += ', top=0, left=0';

		type = (!type) ? "html" : type;

		newwin=window.open('ticket-notes.jsp?id=' + id + '&type=' + type,'Help Desk | Agile CRM', params);

		if (window.focus)
			newwin.focus();

		return false;
	}
};
