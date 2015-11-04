var Group_ID = null, Ticket_Status = 'new', Current_Ticket_ID = null, Ticket_Filter_ID = null,
New_Tickets = 0, Opened_Tickets = 0, Starred_Tickets = 0, Closed_Tickets =0, Tickets_Util = {}, Reload_Filters = true,
Reload_Tickets_Count = false;

$("body").bind('click', function(ev) {
	Tickets.hideDropDowns(ev);
	Ticket_Tags.hideTicketTagField(ev);
});

var Tickets = {

	fetch_tickets_collection: function(url, group_id){

		//Renders root template, fetches tickets count & loads Groups drop down
		Tickets.initialize(group_id, function(){

			App_Ticket_Module.ticketsCollection = new Base_Collection_View({
				url : url,
				sortKey:"created_time",
				descending:true,
				templateKey : "ticket",
				individual_tag_name : 'div',
				cursor : true,
				page_size : 20,
				slateKey : "no-tickets",
				postRenderCallback: function(el){

					//Initialize tooltips
					$('.refresh-tickets').tooltip();

					head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
					{
						$("time", el).timeago();		
					});

					//Activating ticket type pill
					$('ul.ticket-types').find('.active').removeClass('active');
					if(!Ticket_Filter_ID)
						$('ul.ticket-types').find('li a.' + Ticket_Status).parent().addClass('active');
					else
						$('ul.ticket-types').find('li > a[filter-id="' + Ticket_Filter_ID + '"]').parent().addClass('active');
				
					//Init click event on each ticket li
					Tickets.initEvents(el);
				}
			});

			//Activating main menu
			$('nav').find(".active").removeClass("active");
			$("#tickets").addClass("active");

			App_Ticket_Module.ticketsCollection.collection.fetch();

			$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
		});	
	},

	initialize: function(group_id, callback){

		//Checking root template
		if($('#tickets-container').length == 0){

			//Rendering root template
			getTemplate("tickets-container",  {group_id: group_id, ticket_status: Ticket_Status}, undefined, function(template_ui){

				if(!template_ui)
			  		return;

				$('#content').html($(template_ui));	

				//Fectching new, open, closed tickets count
				Tickets_Count.fetch_tickets_count();

				//Rendering Groups dropdown
				Tickets_Group_View = new Ticket_Base_Model({
					isNew : false,
					template : "tickets-groups-container",
					url : "/core/api/tickets/groups",
					postRenderCallback : function(el, data) {

						//Replacing group name
						$('a#group_name', el).html($('a[data-group-id="'+ Group_ID +'"]').attr('data-group-name'));

						Ticket_Filters.fetch_filters_collection();
					}
				});

				$('#right-pane').html(Tickets_Group_View.render().el);

				if(callback)
					callback();

			}, "#content");
		}	
		else{

			$('#right-pane').html(Tickets_Group_View.render().el);
			
			Tickets_Group_View.delegateEvents();

			//Fectching new, open, closed tickets count
			Tickets_Count.fetch_tickets_count();

			$("#filters-list-container").html(App_Ticket_Module.ticketFiltersList.el);

			if(callback)
				callback();
		}

		Current_Ticket_ID = null;
	},

	initEvents: function(el){
		
		$('ul#ticket-model-list', el).on('click', 'li.ticket', function(e){

			var url = '#tickets/group/' + (!Group_ID ? DEFAULT_GROUP_ID : Group_ID) + 
					'/' + (Ticket_Status ? Ticket_Status : 'new') + '/';

			if(Ticket_Filter_ID)
				url = '#tickets/filter/' + Ticket_Filter_ID + '/ticket/';

			Backbone.history.navigate(url + $(this).attr('data-id'), {trigger : true});
		});

		/*
		 * Hover event on ticket subject
		 */
		$('ul#ticket-model-list', el)
			.on('mouseover mouseout', 'li.ticket',
				function(event) {
					if (event.type == 'mouseover'){

						var top_offset = $('#' + $(this).attr('data-id'))
								.offset().top;

						if (window.innerHeight - top_offset >= 210)
							$(this).find('#ticket-last-notes').css(
									'display', 'block');
						else
							$(this).find('#ticket-last-notes').css(
									'display', 'block').css('top','-'
											+ $(this).find(
													'#ticket-last-notes')
													.height() + 'px');
					} else {
						$(this).find('#ticket-last-notes').css('display',
								'none').css('top', '60px');
					}
				}
			);
	},

	changeStatus: function(event){

		var ticketModel = App_Ticket_Module.ticketView.model.toJSON();
		

		getTemplate("ticket-status",  {status: ticketModel.status}, undefined, function(template_ui){

			if(!template_ui)
			  		return;

			$('#ticket-status-list').html($(template_ui));	

			$('.ticket_status').hide();
	        $('#change-ticket-status-ul').show();

	        Tickets.initChangeStatusEvent();

		}, '#ticket-status-list');
	},

	initChangeStatusEvent: function(){

		$('ul#ticket-status-list').on('click', '.change-ticket-status-li', function(e){
		
			$('#change-ticket-status-ul').hide();
			
			var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

			var new_ticket_status = $(this).attr('data-value');

			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/change-status?id=" + Current_Ticket_ID + "&status=" + new_ticket_status;
			newTicketModel.save(ticketModel, {
				
					success: function(model){

					$('.ticket_status').html(new_ticket_status).show();

					 App_Ticket_Module.ticketView.model.set(model, {silent: true});
				}
			});
   		});
	},
	changeGroup: function(event){

		var optionsTemplate = "<li><a class='change-ticket-group-li' data-id='{{id}}'>{{group_name}}</a></li>";

		fillSelect('ticket-groups-list','/core/api/tickets/groups', null,  function(){

	        	$('.ticket_group_name').hide();
	        	$('#change-ticket-group-ul').show();

	        	Tickets.initChangeGroupEvent();
	      
	    	}, optionsTemplate, true); 
	},

	initChangeGroupEvent: function(){

		$('ul#ticket-groups-list').on('click', '.change-ticket-group-li', function(e){
		
			$('#change-ticket-group-ul').hide();
			
			// Reads the owner id from the selected option
			var new_group_id = $(this).attr('data-id');
			var new_group_name = $(this).text();
			
			// Returns, if same owner is selected again 
			if(new_group_id == Group_ID)
			{
				$('.ticket_group_name').show();
				return;
			}
			
			var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/change-group?id=" + Current_Ticket_ID + "&group_id=" + new_group_id;
			newTicketModel.save(ticketModel, {
				
					success: function(model){

					$('.ticket_group_name').html(new_group_name);
					$('td#group-id').attr('data-id', new_group_id);
					$('.ticket_group_name').show();

					 App_Ticket_Module.ticketView.model.set(model, {silent: true});
				}
			});
   		});
	},
	changeAssignee: function(event){

		var optionsTemplate = "<li><a class='change-ticket-assignee-li' data-id='{{id}}'>" +
							  "<span class='thumb-sm avatar'><img src='{{ownerPic}}' width='40px' height='40px'></span>" + 
								" {{name}}</a></li>";

		fillSelect('ticket-assignee-list','/core/api/tickets/groups/domain-users?group_id=' + $('td#group-id').attr('data-id'), null,  
			function(){

	        	$('.ticket_assignee_name').css('display', 'none');
	        	$('#change-ticket-assignee-ul').css('display', 'inline-block');
	      		
	      		Tickets.initChangeAssigneeEvent();

	    	}, optionsTemplate, true); 
	},

	initChangeAssigneeEvent: function(){

		$('ul#ticket-assignee-list').on('click', '.change-ticket-assignee-li', function(e){
		
			$('#change-ticket-assignee-ul').hide();
			
			var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

			// Reads the owner id from the selected option
			var new_assignee_id = $(this).attr('data-id');
			var new_assignee_name = $(this).text();
			
			// Returns, if same owner is selected again 
			if(new_assignee_id == ticketModel.assigneeID)
			{
				$('.ticket_assignee_name').show();
				return;
			}
			
			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/assign-ticket?id=" + Current_Ticket_ID + "&assignee_id=" + new_assignee_id;
			newTicketModel.save(ticketModel, 
				{success: function(model){

					$('.ticket_assignee_name').html(new_assignee_name);
					$('.ticket_assignee_name').show();
					$('td#assignee-id').attr('data-id', new_assignee_id);

					 App_Ticket_Module.ticketView.model.set(model, {silent: true});
				}}
			);
   		});
	},

	changeTicketType: function(event){

		$('.ticket_type').css('display', 'none');
	    $('#change-ticket-type-ul').css('display', 'inline-block');
	    Tickets.initChangeTicketTypeEvent();
	},

	initChangeTicketTypeEvent: function(){

		$('ul#ticket-type-list').on('click', '.change-ticket-type-li', function(e){
		
			$('#change-ticket-type-ul').hide();
			
			var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

			var new_ticket_type = $(this).attr('data-value');
			
			if(new_ticket_type == ticketModel.type)
			{
				$('.ticket_type').show();
				return;
			}
			
			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/change-ticket-type?id=" + Current_Ticket_ID + "&type=" + new_ticket_type;
			newTicketModel.save(ticketModel, 
				{success: function(model){

					$('.ticket_type').html(new_ticket_type);
					$('.ticket_type').show();

					 App_Ticket_Module.ticketView.model.set(model, {silent: true});
				}}
			);
   		});
	},

	changeTicketPriority: function(event){

		$('.ticket_priority').css('display', 'none');
	    $('#change-ticket-priority-ul').css('display', 'inline-block');

	    Tickets.initChangeTicketPriorityEvent();
	},

	initChangeTicketPriorityEvent: function(){

		$('ul#ticket-priority-list').on('click', '.change-ticket-priority-li', function(e){
		
			$('#change-ticket-priority-ul').hide();
			
			var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

			var new_priority = $(this).attr('data-value');
			
			if(new_priority == ticketModel.priority)
			{
				$('.ticket_priority').show();
				return;
			}
			
			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/change-priority?id=" + Current_Ticket_ID + "&priority=" + new_priority;
			newTicketModel.save(ticketModel, 
				{success: function(model){

					$('.ticket_priority').html(new_priority);
					$('.ticket_priority').show();

					App_Ticket_Module.ticketView.model.set(model, {silent: true});
				}}
			);
   		});
	},

	toEmails: function(){

		$('.to-emails').hide();

		$('.ticket-email').show(function(){
			$('#cc_emails').focus();
		});
	},

	hideDropDowns: function(ev){

		if(!Current_Ticket_ID)
			return;

		if($(ev.target).closest('div.ticket-details-dropdown').length > 0 
				|| $(ev.target).hasClass('ticket-details-value'))
			return;

		//Hiding dropdowns
		$('.ticket-details-dropdown').hide();
		$('.ticket-details-value').show();
	},

	//Activate enter click event listener and focus out events on CC email field
	initCCEmailsListeners: function(el){

		$(el).on('keypress', '#cc_email_field', function(e){
			Tickets.ccEmailsList(e);
		});

		$(el).on('focusout', '#cc_email_field', function(e){
			e.stopImmediatePropagation();
			Tickets.ccEmailsList(e, true);
		});
	},

	//Appends email as list item in cc emails list
	ccEmailsList: function(e, force_allow){

		e.stopImmediatePropagation();
		if(e.which == 13 || force_allow) {

        	var email = $('#cc_email_field').val();

        	if(!email)
        		return;
        	
        	var err_email = !Tickets.isValidEmail(email);

        	$('ul[name="cc_emails"]').prepend(getTemplate('cc-email-li', {email: email, err_email: err_email}));
        	$('#cc_email_field').val('');
    	}
	},

	//Return true if provided email is valid
	isValidEmail : function(email) {

		// Email Regex pattern
		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,9}$/;

		if (!emailPattern.test(email))
				return false;

		return true;
	},

	getCCEmailsList: function(form_id){

		return $('#' + form_id + ' [name="cc_emails"]').map(function() {

        	var f = [];
        	$.each($(this).children(), function(g, h) {

        			if($(h).attr("data"))
            			f.push(($(h).attr("data")).toString())
	        	}
	        );

	        return {
	            name: 'cc_emails',
	            value: f
	        }

	    }).get();
	},

	next_prev_ticket_exists: function(action_type){
		var ticket_collection = App_Ticket_Module.ticketsCollection.collection;
		var current_ticket_index = ticket_collection.indexOf(ticket_collection.get(Current_Ticket_ID));

		current_ticket_index = (action_type == "previous") ? --current_ticket_index
				: ++current_ticket_index;

		if(!ticket_collection.at(current_ticket_index))
			return false;

		return true;
	},

	get_next_prev_ticket_id: function(action_type){
		var ticket_collection = App_Ticket_Module.ticketsCollection.collection;
		var current_ticket_index = ticket_collection.indexOf(ticket_collection.get(Current_Ticket_ID));

		current_ticket_index = (action_type == "previous") ? --current_ticket_index
				: ++current_ticket_index;
		
		if(current_ticket_index == null)
			return null;

		return ticket_collection.at(current_ticket_index).id;
	},

	deleteTicket: function(e){

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

function tickets_typeahead(data){

	if (data == null)
		return;

	// To store contact names list
	var contact_names_list = [];

	/*
	 * Iterates through all the contacts and get name property
	 */
	$.each(data, function(index, contact)
	{
		var contact_name;

		// Appends first and last name to push in to a list
		contact_name = getContactName(contact) + "-" + contact.id;

		// Spaces are removed from the name, name should be used as a key in map
		// "TYPEHEAD_TAGS"
		contact_names_list.push(contact_name.split(" ").join(""));
	});

	// Returns list of contact/company names
	return contact_names_list;
}
