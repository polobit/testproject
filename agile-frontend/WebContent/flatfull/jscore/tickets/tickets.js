var Group_ID = null, Current_Ticket_ID = null, Ticket_Filter_ID = null, Tickets_Util = {}, Sort_Field = '-last_updated_time';

$("body").bind('click', function(ev) {
	/*Tickets.hideDropDowns(ev);
	Ticket_Tags.hideTicketTagField(ev);*/
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

				var isSingleRowView = (CURRENT_DOMAIN_USER.helpdesk_view && CURRENT_DOMAIN_USER.helpdesk_view == 'double_row')
								 ? true : false;

				//Fetching ticket toolbar template
				getTemplate("tickets-toolbar-container", {isSingleRowView: isSingleRowView}, undefined, function(toolbar_ui){

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

		var isSingleRowView = (CURRENT_DOMAIN_USER.helpdesk_view && CURRENT_DOMAIN_USER.helpdesk_view == 'double_row')
								 ? true : false;

		//Initialize custom filters
		Ticket_Custom_Filters.init(Ticket_Custom_Filters.renderLayout);

		App_Ticket_Module.ticketsCollection = new Base_Collection_View({
			url : '/core/api/tickets/filter?filter_id=' + Ticket_Filter_ID,
			global_sort_key: Sort_Field,
			sort_collection: false,
			templateKey : isSingleRowView ? 'ticket-single-row' : 'ticket',
			customLoader: true,
			customLoaderTemplate: 'ticket-notes-loader',
			individual_tag_name : isSingleRowView ? 'tr' : 'div',
			cursor : true,
			page_size : 20,
			slateKey : 'no-tickets',
			postRenderCallback: function(el){

				//Initializing click event on each ticket li
				Tickets.initEvents(el);

				//Initialize tooltips
				$('[data-toggle="tooltip"]').tooltip();

				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$("time", el).timeago();		
				});
				
				///Showing selected filter name on top
				Ticket_Filters.updateFilterName();

				//Initializing checkbox events
				Ticket_Bulk_Ops.initEvents();

				//Clear bulk ops selections
				Ticket_Bulk_Ops.clearSelection();
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

			Ticket_Bulk_Ops.addOrRemoveTicketID(this);
			Ticket_Bulk_Ops.showText();
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
			
			Ticket_Bulk_Ops.clearSelection();
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
	
	changeAssignee: function(event){

		var groupsAssignees = Backbone.Model.extend({urlRoot : '/core/api/tickets/groups'});
		new groupsAssignees().fetch({success: function(model, response, options){
		
			$('.ticket_assignee_name').css('display', 'none');

      		var html = getTemplate('ticket-change-assignee', model.toJSON());

      		var $select = $('#ticket-assignee-list');
      		$select.closest('div').show();
      		$select.html(html);

      		head.js('/lib/chosen.jquery.min.js', function()
			{
				//Initliazing multi select drop down
				$select.chosen();

				$select.off('change');
				$select.on('change', function(evt, params) {
				   
				   console.log(evt);
				   console.log(params);

				   Tickets.initChangeAssigneeEvent(evt, params);
				});
			});

		}, error: function(){

		}});
	},

	initChangeAssigneeEvent: function(evt, params){

		var assignee_id = params.selected;
		var $selected_option = $('select#ticket-assignee-list').find('option:selected');

		var assignee_name = $selected_option.text();
		var group_id = $selected_option.data('group-id');
		var group_name = $selected_option.data('group-name');

		var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

		// Returns, if same owner is selected again 
		if(assignee_id == ticketModel.assigneeID && group_id == ticketModel.groupID)
		{	
			$('#ticket-assignee-list').closest('div').hide();
			$('.ticket_assignee_name').show();
			return;
		}

		//Disable select box while updating
		$('select#ticket-assignee-list').attr('disabled', true);

		//Re-initalize to disable select box
		$('#ticket-assignee-list').trigger('chosen:updated');

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/assign-ticket?ticket_id=" + Current_Ticket_ID + "&assignee_id=" + assignee_id + 
		                     '&group_id=' + group_id;
		newTicketModel.save(ticketModel, 
			{	success: function(model){

				//Enable select box
				$('select#ticket-assignee-list').attr('disabled', false);

				//Re-initalize to disable select box
				$('#ticket-assignee-list').trigger('chosen:updated');

				//Set new assignee details on view
				$('#assignee_name').html(assignee_name).attr('data-id', assignee_id);

				//Set new assignee details on view
				$('#group_name').html(group_name).attr('data-id', group_id);

				//Hide select dropdown
				$('#ticket-assignee-list').closest('div').hide();

				//Show new group name and assignee name
				$('.ticket_assignee_name').show();

				App_Ticket_Module.ticketView.model.set(model, {silent: true});
			}}
		);
	},

	changeTicketType: function(event){

		var $select = $('.ticket_type');
		var new_ticket_type = $select.find('option:selected').val();
		var url = "/core/api/tickets/change-ticket-type?id=" + Current_Ticket_ID + "&type=" + new_ticket_type;
		$select.attr('disabled', true);

		this.updateModel(url, function(){
			$select.attr('disabled', false);
		}, function(){
			$select.attr('disabled', false);
		});
	},

	changeTicketPriority: function(event){

		var $priority = $('.ticket_priority');
		var new_priority = $priority.find('option:selected').val();
		var url = "/core/api/tickets/change-priority?id=" + Current_Ticket_ID + "&priority=" + new_priority;
		$priority.attr('disabled', true);

		this.updateModel(url, function(){
			$priority.attr('disabled', false);
		}, function(){
			$priority.attr('disabled', false);
		});
	},

	changeSLA: function($input, selected_date){

		$input.attr('disabled', true);

        var slaEpoch = new Date(selected_date).getTime();

        var url = "/core/api/tickets/change-due-date?id=" + Current_Ticket_ID + "&due_time=" + slaEpoch;

        Tickets.updateModel(url, function(model){

			$input.attr('disabled', false).hide();

			var updatedDueDate = new Date(slaEpoch).format('mmm dd, yyyy HH:MM')

			showNotyPopUp('information', 'Ticket due date has been updated to ' + updatedDueDate, 'bottomRight', 3000);
		}, function(){
			$input.attr('disabled', false);
		});
	},

	initDateTimePicker: function($input, callback){

		head.js('/lib/web-calendar-event/moment.min.js','/lib/bootstrap-datetimepicker.min.js', function()
		{	
			// Enable the datepicker
			$input.datetimepicker({sideBySide: true});
				
			$input.off("dp.hide");
			$input.on("dp.hide", function (e) {
	            
	            if(callback)
	            	callback($input, $input.val());
	        });
		});
	},

	updateModel: function(url, success_cbk, err_cbk){
		var newTicketModel = new BaseModel();
		newTicketModel.url = url;
		
		newTicketModel.save(App_Ticket_Module.ticketView.model.toJSON(), 
			{
				success: function(model){
				App_Ticket_Module.ticketView.model.set(model, {silent: true});

				if(success_cbk)
					success_cbk(model);
			}, error: function(){
				if(err_cbk)
					err_cbk(model);
			}}
		);
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

		if(!App_Ticket_Module.ticketsCollection || !App_Ticket_Module.ticketsCollection.collection)
			return false;
		
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
