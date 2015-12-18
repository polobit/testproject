var Group_ID = null, Current_Ticket_ID = null, Ticket_Filter_ID = null, Tickets_Util = {}, Sort_By = "-", Sort_Field = 'last_updated_time';
var popoverFunction = undefined;

$("body").bind('click', function(e) {

	Tickets.clearSelection(e);
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
				getTemplate("tickets-toolbar-container", {isSingleRowView: Tickets.isSingleRowView()}, undefined, function(toolbar_ui){

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

				//Showing selected filter name on top
				Ticket_Filters.updateFilterName();

				//Reset custom filters
				Ticket_Custom_Filters.reset();

				//Initialize custom filters and render layout with filter conditions selected
				Ticket_Custom_Filters.init(Ticket_Custom_Filters.renderLayout);
				
				//Fetching selected filter ticket collection
				Tickets.fetchTicketsCollection();
			}	
		}

		Current_Ticket_ID = null;
	},

	fetchTicketModel : function(ticket_id, callback){

		var ticket = Backbone.Model.extend({
			url : "/core/api/tickets/" + ticket_id
		});

		new ticket().fetch({
			success : function(ticketModel) {

				if (callback)
					callback(ticketModel);
			}
		});

	},

	//Fetches new ticket collection
	fetchTicketsCollection: function(){

		Ticket_Labels.fetchCollection(function() {

				App_Ticket_Module.ticketsCollection = new Base_Collection_View({
				url : '/core/api/tickets/filter?filter_id=' + Ticket_Filter_ID + '&custom_filters=' + encodeURI(JSON.stringify(Ticket_Custom_Filters.customFilters)),
				global_sort_key: Sort_By + Sort_Field,
				sort_collection: false,
				templateKey : Tickets.isSingleRowView() ? 'ticket-single-row' : 'ticket',
				customLoader: true,
				custom_scrollable_element: '#ticket-model-list',
				customLoaderTemplate: 'ticket-collection-loader',
				individual_tag_name : 'tr',
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
					
					//Initializing checkbox events
					Ticket_Bulk_Ops.initEvents();

					//Clear bulk ops selections
					Ticket_Bulk_Ops.clearSelection();

					var Groups = Backbone.Collection.extend({url: '/core/api/tickets/groups'});
					new Groups().fetch({success: function(model, response, options){
						
						$('ul.ul-select-assignee').html(getTemplate('ticket-model-change-assignee', model.toJSON()))
					}});

					if(!App_Ticket_Module.ticketsCollection || 
						!App_Ticket_Module.ticketsCollection.collection || 
						App_Ticket_Module.ticketsCollection.collection.length == 0){

						$('.ticket-count-text').html('');
						return;
					}

					var last_model = App_Ticket_Module.ticketsCollection.collection.last().toJSON();

					var count = (last_model.count) ? last_model.count : App_Ticket_Module.ticketsCollection.collection.length;
					
					$('.ticket-count-text').html(count + ' tickets found');
				}
			});

			//Activating main menu
			$('nav').find(".active").removeClass("active");
			$("#tickets").addClass("active");

			App_Ticket_Module.ticketsCollection.collection.fetch();

			$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
		});
	},

	renderExistingCollection: function(){

		if(!App_Ticket_Module.ticketsCollection){
			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
		}else{
			this.renderLayout(function(){

				//Initialize custom filters
				Ticket_Custom_Filters.init(Ticket_Custom_Filters.renderLayout);

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
		 * Initializing click event on ul lists in ticket collection
		 */
		$('ul.ul-select', el).off('click'); 
		$('ul.ul-select', el).on('click', "li a", function(e){
			e.stopPropagation();
			e.preventDefault();

			var $that = $(this);
			var action_type = $that.data('field'), action_value = $that.attr('value');
			var ticket_id = $that.closest('ul').data('ticket-id'), url = '/core/api/tickets', message = '';

			switch(action_type){

				case 'status':
					url += "/change-status?id=" + ticket_id + "&status=" + action_value;
					message = 'Status has been updated to ' + action_value.toLowerCase();
					break;
				case 'priority':
					url += "/change-priority?id=" + ticket_id + "&priority=" + action_value;
					message = 'Priority has been updated to ' + action_value.toLowerCase();
					break;
				case 'assignee':
				{
					var group_id = $that.data('group-id');

					url += "/assign-ticket?ticket_id=" + ticket_id + "&assignee_id=" + action_value + 
			                     '&group_id=' + group_id;

					if(action_value == 0){
						 message = 'Ticket group has been changed to ' + $that.data('name');
					}
					else{
			            message = 'Assignee has been changed to ' + $that.data('name');
			        }

			        action_value = $that.data('name');
			    }
			}

			Tickets.updateModel(url, function(){

				showNotyPopUp('information', message, 'bottomRight', 3000);
				$that.closest('tr').find('a.' + action_type).html(action_value);
				$that.closest('div').find('.dropdown-menu').dropdown('toggle');

				if(action_type == 'priority'){
					if(action_value == 'HIGH')
						$('td#'+ticket_id).addClass('b-l b-l-3x high-priority');
					else
						$('td#'+ticket_id).removeClass('b-l b-l-3x high-priority');
				}

				//Clearing selections
				$that.closest('div').removeClass('bg-light');
				$that.closest('div').find('.caret-btn').removeClass('inline-block').addClass('display-none');

			}, null, ticket_id);
		});

		/**
		 * Initializing click event on ticket checkboxes
		 */
		$('#ticket-model-list', el).off('change'); 
		$('#ticket-model-list', el).on('change', "input.ticket-checkbox", function(e){
			e.stopPropagation();
			e.preventDefault();

			Ticket_Bulk_Ops.addOrRemoveTicketID(this);
			Ticket_Bulk_Ops.showText();
		});

		/**
		 * Initializing click event on each ticket list item
		 */
		$('#ticket-model-list', el).off('click');
		$('#ticket-model-list', el).on('click', 'tr > td.open-ticket', function(e){

			if($(e.target).hasClass('ticket-checkbox'))
				return;

			var url = '#tickets/filter/' + Ticket_Filter_ID + '/ticket/';

			Backbone.history.navigate(url + $(this).closest('tr').find('td.data').attr('data-id'), {trigger : true});
		});

		/*
		 * Hover event on ticket subject
		 */
		$(el).off('mouseover mouseout');
		$(el)
			.on('mouseover mouseout', 'td.show-notes',
				function(event) {

					clearTimeout(popoverFunction);

					var top = '70px';
					if (event.type == 'mouseover'){

						var $tr = $(this).closest('tr'), $that = $(this);

						popoverFunction = setTimeout(function(){

							if (window.innerHeight - $tr.offset().top < 210)
								top = '-' + $that.find('#ticket-last-notes').height() + 'px'

							$that.find('#ticket-last-notes').css('top', top).css('display', 'block');

						},1000);
					} else {
						$('.ticket-last-notes').css('display', 'none').css('top', top);
					}
				}
			);

		/*
		 * Hover event on ticket subject
		 */
		$(el)
			.on('mouseover mouseout', 'tbody.ticket-single-row-model-list > tr',
				function(event) {

					clearTimeout(popoverFunction);
					
					if (event.type == 'mouseover'){

						var $that = $(this);
						var ticketID = $that.find('td.data').data('id');
						var ticketJSON = App_Ticket_Module.ticketsCollection.collection.get(ticketID).toJSON();

						getTemplate("ticket-single-row-popup", ticketJSON, undefined, function(template_ui){

							if(!template_ui)
						  		return;

							$('body').append($(template_ui));

							popoverFunction = setTimeout(function(){

								//Get closest div with row class to set left alignment. Table row left doesn't work as table have scrolling.
								var $closest_div = $that.closest('div.row');
								var top = 0, left = $closest_div.offset().left + 70 + 'px';

								if (window.innerHeight - $that.offset().top >= 210)
									top = $that.offset().top + 40 + 'px';
								else
									top = $that.offset().top - $('#ticket-last-notes').height() + 'px';

								$('#ticket-last-notes').css('top', top).css('left', left).css('display', 'block');
							},1000);
						});
					}else{
						$('div.ticket-last-notes').remove();
					}
			});

		//Initialization click event on inline dropdown to change assingee, status or priority
		$('.show-caret').off('click');
		$(el).on('click', '.show-caret', function(e){
			e.preventDefault();
			e.stopPropagation();

			$(this).find('.dropdown-menu').dropdown('toggle');
			$(this).addClass('bg-light');
			$(this).find('.caret-btn').addClass('inline-block');
		});

		//Initialization click event on refresh button
		$('.tickets-toolbar').off('click');
		$('.tickets-toolbar').on('click', '.refresh-tickets', function(e){
			e.preventDefault();

			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
			
			//Fetch ticket collection count
			Tickets_Count.fetchFilterTicketsCount();
			
			Ticket_Bulk_Ops.clearSelection();
		});

		//Initialization click event on toggle custom filters btn
		$('.tickets-toolbar').on('click', '.toggle-custom-filters', function(e){
			e.preventDefault();

			$('div#custom-filters-container').closest('div.col').toggle('slow');
			var $icon = $(this).find('i');

			if($icon.hasClass('fa-dedent')){

				$(this).attr('data-original-title', 'Show filters');
				$icon.removeClass('fa-dedent').addClass('fa-indent');
			}else{

				$(this).attr('data-original-title', 'Hide filters');
				$icon.removeClass('fa-indent').addClass('fa-dedent');
			}
		});

		//Initialization click event on sort filters
		$('.tickets-toolbar').on('click', 'a.sort-field', function(e){
			e.preventDefault();

			if($(this).data('sort-key') == Sort_Field)
				return;

			Sort_Field = $(this).data('sort-key');

			$('.sort-field-check').addClass('display-none');
			$(this).find('i').removeClass('display-none');

			$('.sort-field-txt').html($(this).text());

			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
		});

		//Initialization click event on sort by filter
		$('.tickets-toolbar').on('click', 'a.sort-by', function(e){
			e.preventDefault();

			if($(this).data('sort-key') == Sort_By)
				return;

			Sort_By = $(this).data('sort-by');

			$('.sort-by-check').addClass('display-none');
			$(this).find('i').removeClass('display-none');

			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
		});

		/**
		 * Initializing click event on toggle view button
		 */
		$('.toggle-collection-view').off('click');
		$(el).on('click', ".toggle-collection-view", function(e){
			e.preventDefault();

			//Toggle view types
			var view_type = Tickets.isSingleRowView() ? 'MULTILINE' : 'SINGLELINE', $that = $(this);

			//Updating user preferences
			$.post("/core/api/users/helpdesk-settings/toggle-view?view_type=" + view_type, {}, function(){

				CURRENT_DOMAIN_USER.helpdeskSettings.ticket_view_type = view_type;

				showNotyPopUp('information', 'Default view changed to ' + ((view_type == 'MULTILINE') ? 'Multi line' : 'Single line'), 'bottomRight', 3000);

				Tickets.renderExistingCollection();
			});
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

				if(assignee_id && assignee_id == CURRENT_AGILE_USER.domainUser.id)
					$('.assign-to-me').hide();
				else
					$('.assign-to-me').hide();

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

		head.load(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', "/flatfull/css/final-lib/date-picker.css",  function()
		{
			$('.daterangepicker').remove();

			$('#reportrange').daterangepicker({
			    "timePicker": true,
			    "startDate": "12/03/2015",
			    "endDate": "12/09/2015",
			    "drops": "up"
			}, function(start, end, label) {
			  	callback();
			});
			
			$('.daterangepicker > .ranges > ul').on("click", "li", function(e)
			{
				$('.daterangepicker > .ranges > ul > li').each(function(){
					$(this).removeClass("active");
				});
				$(this).addClass("active");
			});
		});
	},

	updateModel: function(url, success_cbk, err_cbk, ticket_id){
		var newTicketModel = new BaseModel();
		newTicketModel.url = url;
		
		ticket_id = !ticket_id ? Current_Ticket_ID : ticket_id;

		newTicketModel.save({id: ticket_id}, 
			{
				success: function(model){

				if(App_Ticket_Module.ticketView)
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

        	$('ul.cc-emails').prepend(getTemplate('cc-email-li', {email: email, err_email: err_email}));
        	$('#cc_email_field').val('');

        	// Save cc emails to the
        	if(!err_email)
        	  Tickets.updateCCEmails(email, 'add');
    	}
	},

	removeCCEmails: function(e){

		Tickets.updateCCEmails($(e.target).closest('li').attr('data'), 'remove');
		$(e.target).closest('li').remove();
	},

	updateCCEmails : function(email, command){

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/update-cc-emails?command="
				+ command + "&email=" + email + '&id=' + Current_Ticket_ID;
		newTicketModel.save({'id': Current_Ticket_ID}, 
			{success: function(model){

					// If in time line add event to timeline
					if($('.ticket-timeline-container').length > 0){
						Ticket_Timeline.render_individual_ticket_timeline()
					}

				}
			});
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

	closeTicket : function(e){

		var url = "/core/api/tickets/change-status?status=CLOSED&id=" + Current_Ticket_ID;

		Tickets.updateModel(url, function(){

				showNotyPopUp('information', "Ticket has been closed", 'bottomRight', 3000);

				var url = '#tickets/group/'+ (!Group_ID ? DEFAULT_GROUP_ID : Group_ID) + 
					'/' + (Ticket_Status ? Ticket_Status : 'new');

				Backbone.history.navigate(url, {trigger : true});

			}, null, Current_Ticket_ID);

		
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

		var $this = $(e.target);

		$this.siblings("#workflows_list").html('<li><a href="javascript:void(0);">Loading...</a></li>');

		var workflows = Backbone.Collection.extend({
			url : 'core/api/tickets/execute-workflow'
		});

		new workflows().fetch({
			success : function(Collection) {

				$('#workflows_list').html(getTemplate("ticket-show-workflows-list", Collection.toJSON()));

			}
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
	},

	clearSelection: function(e){

		var container = $('div.show-caret');

		if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        container.find('.dropdown-menu').dropdown('toggle');
			container.removeClass('bg-light');
			container.find('.caret-btn').removeClass('inline-block').addClass('display-none');
	    }
	},

	isSingleRowView: function(){
		return (CURRENT_DOMAIN_USER.helpdeskSettings && CURRENT_DOMAIN_USER.helpdeskSettings.ticket_view_type == 'SINGLELINE')
								 ? true : false;
	},

	toggleFavorite : function(e){

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/toggle-favorite?id=" + Current_Ticket_ID;
		newTicketModel.save({'id': Current_Ticket_ID}, 
			{	
				success: function(model){
					if(model.toJSON().is_favorite)
						$(e.target).addClass("fa-star text-warning").removeClass("fa-star-o text-light");
					else
						$(e.target).removeClass("fa-star text-warning").addClass("fa-star-o text-light");

					// If in time line add event to timeline
					if($('.ticket-timeline-container').length > 0){
						Ticket_Timeline.render_individual_ticket_timeline()
					}

				}
			});
		
	},

	toggleSpam : function(e){

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/toggle-spam?id=" + Current_Ticket_ID;
		newTicketModel.save({'id': Current_Ticket_ID}, 
			{	
				success: function(model){
					if(model.toJSON().is_spam)
						$(e.target).addClass("btn-danger").removeClass("btn-default");
					else
						$(e.target).removeClass("btn-danger").addClass("btn-default");

					// If in time line add event to timeline
					if($('.ticket-timeline-container').length > 0){
						Ticket_Timeline.render_individual_ticket_timeline()
					}

				}
			});
	},

	toggleWidgets : function(e){

		$('.contact-right-widgetsview').toggle('slow');

		if($(e.target).hasClass('fa-dedent'))
			$(e.target).addClass('fa-indent').removeClass('fa-dedent');
		else
			$(e.target).addClass('fa-dedent').removeClass('fa-indent');
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

function tickets_cc_emails_typeahead(data){

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

