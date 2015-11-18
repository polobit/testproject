var Group_ID = null, Current_Ticket_ID = null, Ticket_Filter_ID = null, Tickets_Util = {}, Sort_Field = '-last_updated_time';

$("body").bind('click', function(ev) {
	Tickets.hideDropDowns(ev);
	Ticket_Tags.hideTicketTagField(ev);
});

var Tickets = {

	//Renders the basic ticketing layout on which every view will be constructed
	renderLayout: function(callback){

		//Checking root template
		if($('#tickets-container').length == 0){

			//Rendering root template
			getTemplate("tickets-container", {}, undefined, function(template_ui){

				if(!template_ui)
			  		return;

				$('#content').html($(template_ui));	

				//Fetching ticket toolbar template
				getTemplate("tickets-toolbar-container", {}, undefined, function(toolbar_ui){

					if(!toolbar_ui)
			  			return;

			  		//Rendering top toolbar container
					$('#right-pane').html($(toolbar_ui));

					if(callback)
						callback();

				}, "");
				
			}, "#content");
		}else{

			if(!Ticket_Filter_ID)
			{
				if(callback)
					callback();
			}else{
				//Fetching selected filter ticket collection
				Tickets.fetchTicketsCollection();
			}	
		}

		Current_Ticket_ID = null;
	},

	//Fetches new ticket collection
	fetchTicketsCollection: function(){

		App_Ticket_Module.ticketsCollection = new Base_Collection_View({
			url : '/core/api/tickets/filter?filter_id=' + Ticket_Filter_ID,
			global_sort_key: Sort_Field,
			sort_collection: false,
			templateKey : 'ticket',
			customLoader: true,
			customLoaderTemplate: 'ticket-notes-loader',
			individual_tag_name : 'div',
			cursor : true,
			page_size : 20,
			slateKey : 'no-tickets',
			postRenderCallback: function(el){

				//Initialize tooltips
				$('[data-toggle="tooltip"]').tooltip();

				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$("time", el).timeago();		
				});

				$('ul.ticket-types').find('li').removeClass('active');
				$('a[filter-id="' + Ticket_Filter_ID + '"]').closest('li').addClass('active');

				//Initializing click event on each ticket li
				Tickets.initEvents(el);

				//Initializing checkbox events
				Ticket_Bulk_Ops.initEvents();
			}
		});

		//Activating main menu
		$('nav').find(".active").removeClass("active");
		$("#tickets").addClass("active");

		App_Ticket_Module.ticketsCollection.collection.fetch();

		$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
	},

	renderExistingCollection: function(){

		if(!App_Ticket_Module.ticketsCollection){
			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
		}else{
			this.renderLayout(function(){

				Ticket_Filters.renderFiltersCollection(function(){

					$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
					
					//Initialize click event on each ticket li
					Tickets.initEvents(App_Ticket_Module.ticketsCollection.el);

					Backbone.history.navigate('#tickets/filter/' + Ticket_Filter_ID,{render:false});
				});
			});
		}
	},

	initEvents: function(el){
		
		/**
		 * Initializing click event on ticket checkboxes
		 */
		$('ul#ticket-model-list', el).off('change'); 
		$('ul#ticket-model-list', el).on('change', "input.ticket-checkbox", function(e){
			e.stopPropagation();
			e.preventDefault();

			Ticket_Bulk_Ops.showText();
			Ticket_Bulk_Ops.addOrRemoveTicketID(this);
		});

		/**
		 * Initializing click event on each ticket list item
		 */
		$('ul#ticket-model-list', el).off('click');
		$('ul#ticket-model-list', el).on('click', 'li.ticket', function(e){

			if($(e.target).hasClass('ticket-checkbox'))
				return;

			var url = '#tickets/filter/' + Ticket_Filter_ID + '/ticket/';

			Backbone.history.navigate(url + $(this).attr('data-id'), {trigger : true});
		});

		/*
		 * Hover event on ticket subject
		 */
		$('ul#ticket-model-list', el).off('mouseover mouseout');
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

		//Initialization click event on refresh button
		$('.tickets-toolbar').off('click');
		$('.tickets-toolbar').on('click', '.refresh-tickets', function(e){
			e.preventDefault();

			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
			
			//Fetch ticket collection count
			Tickets_Count.fetchFilterTicketsCount();
			
			Ticket_Bulk_Ops.uncheckAllTickets();
		});

		//Initialization click event on sort filters
		$('.tickets-toolbar').on('click', 'ul.sort-filters li a', function(e){
			e.preventDefault();

			Sort_Field = $(this).data('sort-key');

			$('ul.sort-filters').find('li').removeClass('active');
			$(this).closest('li').addClass('active');

			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
		});
	},

	changeStatus: function(event){

		var ticketModel = App_Ticket_Module.ticketView.model.toJSON();
		

		getTemplate("ticket-status",  {status: ticketModel.status}, undefined, function(template_ui){

			if(!template_ui)
			  	return;

			$('#ticket-status-list').html($(template_ui));	

			$('.ticket_status').hide();

			var $dropdown = $('#change-ticket-status-ul');
			$dropdown.find('a.dropdown-toggle').removeClass('disabled');
			$dropdown.show();

	        Tickets.initChangeStatusEvent();

		}, '#ticket-status-list');
	},

	initChangeStatusEvent: function(){

		$('ul#ticket-status-list').on('click', '.change-ticket-status-li', function(e){
		
			$('#change-ticket-status-ul').find('a.dropdown-toggle').addClass('disabled');
			var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

			var new_ticket_status = $(this).attr('data-value');

			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/change-status?id=" + Current_Ticket_ID + "&status=" + new_ticket_status;
			newTicketModel.save(ticketModel, {
				
					success: function(model){

					$('#change-ticket-status-ul').hide();
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

		var groupsAssignees = Backbone.Model.extend({urlRoot : '/core/api/tickets/groups'});
		new groupsAssignees().fetch({success: function(model, response, options){
		
			$('.ticket_assignee_name').css('display', 'none');

			var $dropdown = $('#change-ticket-assignee-ul');
			$dropdown.find('a.dropdown-toggle').removeClass('disabled');
        	$dropdown.css('display', 'inline-block');
      		
      		var html = getTemplate('ticket-change-assignee', model.toJSON());
      		$('#ticket-assignee-list').html(html);

      		Tickets.initChangeAssigneeEvent();
		}, error: function(){

		}});
	},

	initChangeAssigneeEvent: function(){

		$('ul#ticket-assignee-list').on('click', '.change-ticket-assignee-li', function(e){
			
			$('#change-ticket-assignee-ul').find('a.dropdown-toggle').addClass('disabled');

			var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

			// Reads the owner id from the selected option
			var assignee_id = $(this).data('assignee-id');
			var assignee_name = $(this).text();
			var group_id = $(this).data('group-id');
			var group_name = $(this).data('group-name');
			
			// Returns, if same owner is selected again 
			if(assignee_id == ticketModel.assigneeID && group_id == ticketModel.groupID)
			{	
				$('#change-ticket-assignee-ul').hide();
				$('.ticket_assignee_name').show();
				return;
			}
			
			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/assign-ticket?ticket_id=" + Current_Ticket_ID + "&assignee_id=" + assignee_id + 
			                     '&group_id=' + group_id;
			newTicketModel.save(ticketModel, 
				{success: function(model){

					$('#change-ticket-assignee-ul').hide();

					//Set new assignee details on view
					$('.ticket_assignee_name').html(assignee_name);
					$('td#assignee-id').attr('data-id', assignee_id);
					$('.ticket_assignee_name').show();

					//Set new assignee details on view
					$('.ticket_group_name').html(group_name);
					$('td#group-id').attr('data-id', group_id);

					 App_Ticket_Module.ticketView.model.set(model, {silent: true});
				}}
			);
   		});
	},

	changeTicketType: function(event){

		$('.ticket_type').css('display', 'none');

		var $dropdown = $('#change-ticket-type-ul');
		$dropdown.find('a.dropdown-toggle').removeClass('disabled');
		$dropdown.css('display', 'inline-block');

	    Tickets.initChangeTicketTypeEvent();
	},

	initChangeTicketTypeEvent: function(){

		$('ul#ticket-type-list').on('click', '.change-ticket-type-li', function(e){
			
			$('#change-ticket-type-ul').find('a.dropdown-toggle').addClass('disabled');
			
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

					$('#change-ticket-type-ul').hide();
					$('.ticket_type').html(new_ticket_type);
					$('.ticket_type').show();

					 App_Ticket_Module.ticketView.model.set(model, {silent: true});
				}}
			);
   		});
	},

	changeTicketPriority: function(event){

		$('.ticket_priority').css('display', 'none');

		var $dropdown = $('#change-ticket-priority-ul');
		$dropdown.find('a.dropdown-toggle').removeClass('disabled');
		$dropdown.css('display', 'inline-block');

	    Tickets.initChangeTicketPriorityEvent();
	},

	initChangeTicketPriorityEvent: function(){

		$('ul#ticket-priority-list').on('click', '.change-ticket-priority-li', function(e){
			
			$('#change-ticket-priority-ul').find('a.dropdown-toggle').addClass('disabled');
			
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

					$('#change-ticket-priority-ul').hide();
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
	},

	showWorkflows: function(e){

		//Rendering root template
		getTemplate("ticket-show-workflows-modal", {}, undefined, function(template_ui){

			if(!template_ui)
		  		return;

			$('#ticket-modals').html($(template_ui));
			$('#show-workflows-modal').modal('show');

			var workflowsView = new Ticket_Base_Model({
				isNew : false,
				url : "core/api/tickets/execute-workflow",
				template : "ticket-show-workflows-form",
				saveCallback : function(){
					$('#show-workflows-modal').modal('hide');
				},
				postRenderCallback: function(el){
					$('#ticket_id',el).val(Current_Ticket_ID);
				}
			});

			$('#modal-body').html(workflowsView.render().el);
		});
	},

	loadWidgets: function(){

		var model_coun = 0;

		var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

		//Loading widgets
		if(ticketModel && ticketModel.contactID){
			/*var contactDetails = Backbone.Model.extend({urlRoot : '/core/api/contacts/' + ticketModel.contactID});
			new contactDetails().fetch({success: function(contact, response, options){
				}, error: function(){}
			});*/
			App_Contacts.contactDetailView = new Base_Model_View({ 
				isNew : false,
				url: '/core/api/contacts/' + ticketModel.contactID,
				template : "contact-detail",
				postRenderCallback : function(el, contact)
				{	
					model_coun++;

					if(model_coun > 1)
						return;

					clearContactWidetQueues(ticketModel.contactID);

					loadWidgets(App_Ticket_Module.ticketView.el, contact);
				}
			});

			//App_Contacts.contactDetailView.render(true).el;
		}
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
