var Group_ID = null, Current_Ticket_ID = null, Ticket_Filter_ID = null, 
	Tickets_Util = {}, Sort_By = "-", Sort_Field = 'last_updated_time', Ticket_Position= null;
var popoverFunction = undefined, Helpdesk_Enabled = false;

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

				var json = {};
				json.sort_by = Sort_By;
				json.sort_field = Sort_Field;

				//Fetching ticket toolbar template
				getTemplate("tickets-toolbar-container", json, undefined, function(toolbar_ui){

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
				custom_scrollable_element: '.ticket-collection-container',
				customLoaderTemplate: 'ticket-collection-loader',
				individual_tag_name : 'tr',
				cursor : true,
				page_size : 20,
				slateKey : 'no-tickets',
				infini_scroll_cbk: function(){

					//Updating "showing ticket count" text
					Tickets.setCountText();
				},
				postRenderCallback: function(el){

					//Initializing click event on each ticket li
					Tickets.initEvents(el);

					//Initialize tooltips
					$('[data-toggle="tooltip"]').tooltip();

					head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){$("time", el).timeago();});
					
					//Clear bulk ops selections
					Ticket_Bulk_Ops.clearSelection();

					//Initializing checkbox events
					Ticket_Bulk_Ops.initEvents(el);

					if(!Tickets.isSingleRowView()){
						var Groups = Backbone.Collection.extend({url: '/core/api/tickets/groups'});
						new Groups().fetch({success: function(model, response, options){
							
							$('ul.ul-select-assignee').html(getTemplate('ticket-model-change-assignee', model.toJSON()))
						}});
					}

					Tickets.setCountText();

					if(Tickets.isSingleRowView())
						Tickets.setMinHeight();
				}
			});

			//Activating main menu
			$('nav').find(".active").removeClass("active");
			$("#tickets").addClass("active");

			App_Ticket_Module.ticketsCollection.collection.fetch();

			$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
		});
	},

	setCountText: function(){


		if(!App_Ticket_Module.ticketsCollection || 
			!App_Ticket_Module.ticketsCollection.collection || 
			App_Ticket_Module.ticketsCollection.collection.length == 0){

			$('.ticket-count-text').html('0 tickets found');
			return;
		}

		var last_model = App_Ticket_Module.ticketsCollection.collection.last().toJSON();

		var count = (last_model.count) ? last_model.count : App_Ticket_Module.ticketsCollection.collection.length;
		
		$('.ticket-count-text').html('Showing ' + App_Ticket_Module.ticketsCollection.collection.length + ' of ' + count);
	},
	renderExistingCollection: function(){

		if(!App_Ticket_Module.ticketsCollection){
			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
		}else{
			this.renderLayout(function(){

				//Initialize custom filters
				Ticket_Custom_Filters.init(Ticket_Custom_Filters.renderLayout);

				Ticket_Filters.renderFiltersCollection(function(){

					$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.render(true).el);
					
					Tickets.setCountText();

					//Initialize click event on each ticket li
					Tickets.initEvents(App_Ticket_Module.ticketsCollection.el);

					//Clear bulk ops selections
					Ticket_Bulk_Ops.clearSelection();

					//Initializing checkbox events
					Ticket_Bulk_Ops.initEvents(App_Ticket_Module.ticketsCollection.el);
					
					Backbone.history.navigate('#tickets/filter/' + Ticket_Filter_ID, {render:false});

					App_Ticket_Module.ticketsCollection.infiniScroll.enableFetch();

					$(window).scrollTop(Ticket_Position);

					Current_Ticket_ID = null;
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

				showNotyPopUp('information', message, 'bottomRight', 5000);
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
		$('.tickets-collection', el).off('change'); 
		$('.tickets-collection', el).on('change', "input.ticket-checkbox", function(e){
			e.stopPropagation();
			e.preventDefault();

			Ticket_Bulk_Ops.addOrRemoveTicketID(this);
			Ticket_Bulk_Ops.showText();
		});

		/**
		 * Initializing click event on each ticket list item
		 */
		$('.tickets-collection', el).off('click');
		$('.tickets-collection', el).on('click', 'tr > td.open-ticket', function(e){

			//Remove popovers when opening a ticket
			if(Tickets.isSingleRowView())
				$('div.ticket-last-notes').remove();
			else
				$('.ticket-last-notes').css('display', 'none').css('top', top);

			var url = '#tickets/filter/' + Ticket_Filter_ID + '/ticket/';

			Ticket_Position = $(window).scrollTop();

			Backbone.history.navigate(url + $(this).closest('tr').find('td.data').data('id'), {trigger : true});
		});

		/*
		 * Hover event on ticket subject for multiline ticket collection view
		 */
		$(el).off('mouseover mouseout');
		$(el)
			.on('mouseover mouseout', 'td.show-notes',
				function(event) {

					clearTimeout(popoverFunction);

					var top = '60px';
					if (event.type == 'mouseover'){

						var $tr = $(this).closest('tr'), $that = $tr.find('td.notes-container');

						popoverFunction = setTimeout(function(){

							if(Current_Ticket_ID || Current_Route.indexOf('ticket') == -1)
								return;

							var popup_height = $that.find('#ticket-last-notes').height();

							if (window.innerHeight - ($tr.offset().top - $(window).scrollTop()) <= (popup_height + 100))
								top = '-' + popup_height + 'px'

							$that.find('#ticket-last-notes').css('top', top).css('left','0').css('display', 'block');

						},600);
					} else {
						$('.ticket-last-notes').css('display', 'none').css('top', top);
					}
				}
			);

		/*
		 * Hover event on ticket subject single line ticket collection view
		 */
		$(el)
			.on('mouseover mouseout', 'tbody.ticket-single-row-model-list > tr',
				function(event) {

					clearTimeout(popoverFunction);
					
					if (event.type == 'mouseover'){

						var $that = $(this);
						
						popoverFunction = setTimeout(function(){

							var ticketID = $that.find('td.data').data('id');
							var ticketJSON = App_Ticket_Module.ticketsCollection.collection.get(ticketID).toJSON();

							getTemplate("ticket-single-row-popup", ticketJSON, undefined, function(template_ui){

								if(!template_ui)
							  		return;

								$('body').append($(template_ui));
								
								if(Current_Ticket_ID || Current_Route.indexOf('ticket') == -1)
									return;

								//Get closest div with row class to set left alignment. Table row left doesn't work as table have scrolling.
								var $closest_div = $that.closest('div.row');
								var top = 0, left = $closest_div.offset().left + 70 + 'px';

								if (window.innerHeight - ($that.offset().top - $(window).scrollTop()) >= 250)
									top = $that.offset().top + 35 + 'px';
								else
									top = $that.offset().top - $('#ticket-last-notes').height() + 'px';

								$('#ticket-last-notes').css('top', top).css('left', left).css('display', 'block');
							});
						},600);
						
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
			$(this).addClass('bg-light open');
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

			var $container = $('div#custom-filters-container').closest('div.col');

			if(_agile_get_prefs('hide_ticket_lhs_filter')){

				_agile_delete_prefs('hide_ticket_lhs_filter');
				$(this).find('i').attr('data-original-title', 'Hide Filters').css(
					'opacity', 1);

			}else{
				_agile_set_prefs('hide_ticket_lhs_filter', true);
				$(this).find('i').attr('data-original-title', 'Show Filters').css(
					'opacity', 0.7);
			}

			$container.toggle('slow');
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
		$(el).off('click mouseover mouseout', ".toggle-collection-view");
		$(el).on('click', ".toggle-collection-view", function(e){
			e.preventDefault();

			//Toggle view types
			var view_type = Tickets.isSingleRowView() ? 'MULTILINE' : 'SINGLELINE', $that = $(this);

			//Updating user preferences
			$.post("/core/api/users/helpdesk-settings/toggle-view?view_type=" + view_type, {}, function(){

				CURRENT_DOMAIN_USER.helpdeskSettings.ticket_view_type = view_type;

				App_Ticket_Module.ticketsCollection.options.templateKey = Tickets.isSingleRowView() ? 'ticket-single-row' : 'ticket';

				App_Ticket_Module.ticketsCollection.render(true);

				if(view_type == 'SINGLELINE')
					$('ul.choose-columns').closest('div').addClass('open');
			});
		});

		/**
		 * Initializing hover event on toggle view button
		 */
		$(el).on('mouseover mouseout', ".toggle-collection-view.single-line, ul.choose-columns", function(e){
			e.preventDefault();
			
			if (event.type == 'mouseover'){

				$('ul.choose-columns').closest('div').addClass('open');
				return;
			}

			$('ul.choose-columns').closest('div').removeClass('open');
		});

		//Initializing click event due date dropdown
		$(el).off('click','ul.choose-columns > li > a');
	  	$(el).on('click','ul.choose-columns > li > a', function(event){
	  		event.preventDefault();
	  		event.stopPropagation();

	  		var $target = $(event.currentTarget);
	  		$(event.target).blur();

	  		var $chbx = $target.find('input[type="checkbox"]');
	  		var isChecked = $chbx.is(':checked') ? false : true;
			$chbx.prop('checked', isChecked);

			var field_name = $chbx.attr('name');

			if(isChecked){
				$('table.single-row').find('th.' + field_name + '').show();
				$('table.single-row').find('td.' + field_name + '').show();
			}else{
				$('table.single-row').find('th.' + field_name + '').hide();
				$('table.single-row').find('td.' + field_name + '').hide();
			}

			var selected_columns = $('.choose-column-chbx:checked'), column_names = [];

			for(var i=0; i<selected_columns.length; i++)
				column_names.push($(selected_columns[i]).attr('name'));

			var json = {};
			json.choosed_columns= column_names;

			var baseModel = new BaseModel();
			baseModel.url = '/core/api/users/helpdesk-settings/choose-columns';
			baseModel.save(json, 
			{	success: function(model){
					CURRENT_DOMAIN_USER.helpdeskSettings = model.toJSON();
				}
			});

			return false;
	  	});
	},

	fillAssigneeAndGroup : function(el){

		var groupsAssignees = Backbone.Model.extend({urlRoot : '/core/api/tickets/groups'});
		new groupsAssignees().fetch({success: function(model, response, options){

			Tickets.groupsList = model.toJSON();
		
			var html = getTemplate('ticket-change-assignee', Tickets.groupsList);
			html += "<option role='separator' disabled>----------------------------------------------------------</option>";
			$.each(Tickets.groupsList, function(index, data){
				html += "<option value='"+data.id+"'>"+data.group_name+"</option>";
			});

			var selectedAssignee = App_Ticket_Module.ticketView.model.toJSON().assigneeID;
			var selectedGroup = App_Ticket_Module.ticketView.model.toJSON().groupID;

			$('#ticket-assignee', el).html(html);

			if(!selectedAssignee)
				$('#ticket-assignee', el).find("option[value='"+selectedGroup+"']").attr('selected', 'selected');
			else
      		 $('#ticket-assignee', el).find("optgroup[data-group-id='"+selectedGroup+"']").find("option[value='"+selectedAssignee+"']").attr('selected', 'selected');
      		

      		 // If current user not 
      		if(selectedAssignee != CURRENT_DOMAIN_USER.id && Tickets.isCurrentUserExistInGroup(selectedGroup, Tickets.groupsList))
      			$('.assign-to-me', el).show();
      		else
				$('.assign-to-me', el).hide();


		}, error: function(){

		}});
	},

	changeAssignee : function(e){

		var that = e.target;

		var assigneeId = $(that).val();
		console.log(assigneeId);

	    var groupId = $(that.options[that.selectedIndex]).closest('optgroup').attr('data-group-id');

	    if(!groupId){
	    	groupId = $(that).val();
	    	assigneeId = "";
	    }
       
       	Tickets.sendReqToChangeAssignee(assigneeId, groupId, App_Ticket_Module.ticketView.model.toJSON(), function(data){
            
            var modelData = data;

            try{
            	if(modelData.assigneeID != CURRENT_DOMAIN_USER.id && Tickets.isCurrentUserExistInGroup(groupId, Tickets.groupsList))
	    		$('.assign-to-me').show();
			else
				$('.assign-to-me').hide();
            }
            catch(e){

            }

            console.log(modelData);
            console.log(modelData.assigneeID);

            var assigneeName = (modelData.assigneeID) ? (modelData.assignee.name) : modelData.group.group_name;

			var message = 'Ticket group has been changed to ' + assigneeName;
			if(modelData.assigneeID)
				var message = 'Assignee has been changed to ' + assigneeName;
			
		    showNotyPopUp('information', message, 'bottomRight', 5000);

		    modelData.assignee = ((modelData.assignee) ? modelData.assignee : "");
		    modelData.group = ((modelData.group) ? modelData.group : "");

		   	// Update assignee in model and collection 
			Tickets.updateDataInModelAndCollection(Current_Ticket_ID, modelData); 					
			
		});

	},

	isCurrentUserExistInGroup : function(selectedGroupId, groupsList){

			var isExist = false;

			$.each(groupsList, function(index, data){

				$.each(data.group_users, function(index2, userData){

				if(data.id == selectedGroupId && userData.id == CURRENT_DOMAIN_USER.id)
					isExist = true;

				});
				
			});

			return isExist;

	},

	sendReqToChangeAssignee : function(assignee_id, group_id, ticketModel, callback){

		var url = "/core/api/tickets/assign-ticket?ticket_id=" + Current_Ticket_ID + '&group_id=' + group_id;
		if(assignee_id)
			url += "&assignee_id=" + assignee_id;

		$.ajax({
			url : url,
			method: "GET",
			data: {},
			contentType: 'application/x-www-form-urlencoded',
			accept: 'application/json',
			success : function(response){
				Tickets.updateDataInModelAndCollection(Current_Ticket_ID, modelData);
				if(callback)
					callback(response);
				
			}	
		});

	},

	changeTicketType: function(event){

		var $select = $('.ticket_type');
		var new_ticket_type = $select.find('option:selected').val();
		var url = "/core/api/tickets/change-ticket-type?id=" + Current_Ticket_ID + "&type=" + new_ticket_type;
		$select.attr('disabled', true);

		this.updateModel(url, function(){

		// current view
		Tickets.updateDataInModelAndCollection(Current_Ticket_ID, {type : new_ticket_type}); 
		//update collection 
   			$select.attr('disabled', false);
            showNotyPopUp('information', 'Ticket Type has been changed to '+ new_ticket_type.toLowerCase(), 'bottomRight', 5000);
		},

		 function(error){
			$select.attr('disabled', false);
			showNotyPopUp('information', error , 'bottomRight', 5000);
		});
	},

	changeTicketPriority: function(event){

		var $priority = $('.ticket_priority');
		var new_priority = $priority.find('option:selected').val();
		var url = "/core/api/tickets/change-priority?id=" + Current_Ticket_ID + "&priority=" + new_priority;
		$priority.attr('disabled', true);

		this.updateModel(url, function(){


			Tickets.updateDataInModelAndCollection(Current_Ticket_ID, {priority : new_priority});

			$priority.attr('disabled', false);
			showNotyPopUp('information', 'Ticket Type has been changed to '+ new_priority.toLowerCase() , 'bottomRight', 5000);
		    
		}, function(error){
			$priority.attr('disabled', false);
	        showNotyPopUp('information', 'Ticket Type has been changed to'+new_priority , 'bottomRight', 5000);
		});
	},

	updateDataInModelAndCollection : function(id, data){

		// if(id !== App_Ticket_Module.ticketView.model.toJSON().id)
		// 	return;
        if(!App_Ticket_Module.ticketsCollection)
        return;
		App_Ticket_Module.ticketView.model.set(data, {silent: true}); 

		// get data from collection with id
		updated_model = App_Ticket_Module.ticketsCollection.collection.get(id);

		// Update data in model
		updated_model.set(data, {silent: true});
		

	},

	changeSLA: function($input, selected_date){

		$input.attr('disabled', true);

        var slaEpoch = new Date(selected_date).getTime();

        var url = "/core/api/tickets/change-due-date?id=" + Current_Ticket_ID + "&due_time=" + slaEpoch;

        Tickets.updateModel(url, function(model){

			$input.attr('disabled', false).hide();

			var updatedDueDate = new Date(slaEpoch).format('mmm dd, yyyy HH:MM')

			showNotyPopUp('information', 'Ticket due date has been updated to ' + updatedDueDate, 'bottomRight', 5000);
		}, function(error){
			$input.attr('disabled', false);
			showNotyPopUp('information', error , 'bottomRight', 5000);
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

		//$(el).on('focusout', '#cc_email_field', function(e){
			//e.stopImmediatePropagation();
			//Tickets.ccEmailsList(e, true);
		//});
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

	addMeToCC: function(){

		var email = CURRENT_DOMAIN_USER.email;
		$('ul.cc-emails').prepend(getTemplate('cc-email-li', {email: email}));
		$('#cc_email_field').val('');
		Tickets.updateCCEmails(email, 'add');
		$('.add-me-to-cc').hide();

	},

	removeCCEmails: function(e){

		Tickets.updateCCEmails($(e.target).closest('li').attr('data'), 'remove', function(model){

			var email = CURRENT_DOMAIN_USER.email;
			
			var updated_cc_emails = (model) ? model.toJSON().cc_emails : [];

			if(!updated_cc_emails || updated_cc_emails.length == 0 || $.inArray(email, updated_cc_emails) == -1)
				$('.add-me-to-cc').show();

		});

		$(e.target).closest('li').remove();
	},

	updateCCEmails : function(email, command, callback){

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/update-cc-emails?command="
				+ command + "&email=" + email + '&id=' + Current_Ticket_ID;
		newTicketModel.save({'id': Current_Ticket_ID}, 
			{success: function(model){

					// If in time line add event to timeline
					if($('.ticket-timeline-container').length > 0){
						Ticket_Timeline.render_individual_ticket_timeline()
					}

					if($("#ticket-activities-model-list").length > 0)
						App_Ticket_Module.renderActivitiesCollection(Current_Ticket_ID, $('#notes-collection-container', App_Ticket_Module.ticketView.el), function(){});
					
					if(App_Ticket_Module.ticketsCollection){
						//Updating model collection
						var ticket_model = App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID);
	            		var cc_emails = ticket_model.get('cc_emails');

	            		if("add" == command){
	            			cc_emails.push(email);
	            		}else{
							cc_emails.splice(cc_emails.indexOf(cc_emails), 1);
	            		}

	            		//Settting update cc emails back to current ticket model
	            		ticket_model.set({cc_emails: cc_emails}, {silent : true});
	            	}

					if(callback)
						callback(model);
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

	ticket_detail_view_navigation : function(id, el){

			var ticket_list_view = App_Ticket_Module.ticketsCollection;
			if(!ticket_list_view)
				return;

			var ticket_collection = ticket_list_view.collection;

			var collection_length = ticket_collection.length;

		    var current_index = ticket_collection.indexOf(ticket_collection.get(id));

		    var previous_ticket_id;
		    var next_ticket_id;

		    //fetch next set so that next link will work further.
		    if(collection_length <= current_index+5) {
		    	App_Ticket_Module.ticketsCollection.infiniScroll.fetchNext();
		    }
		    if (collection_length > 1 && current_index < collection_length && ticket_collection.at(current_index + 1) && ticket_collection.at(current_index + 1).has("id")) {
		     	next_ticket_id = ticket_collection.at(current_index + 1).id
		    }

		    if (collection_length > 0 && current_index != 0 && ticket_collection.at(current_index - 1) && ticket_collection.at(current_index - 1).has("id")) {
		    	previous_ticket_id = ticket_collection.at(current_index - 1).id
		    }

		    if(previous_ticket_id != null)
		    	$('.navigation .previous-ticket', el).attr("href", "#tickets/filter/"+Ticket_Filter_ID+"/ticket/"+previous_ticket_id);
		    else
		    	$('.navigation .previous-ticket', el).replaceWith("<span class='pull-left text-disabled text-xs'><i class='icon icon-chevron-left v-middle'></i></span>");

		    if(next_ticket_id != null)
		    	$('.navigation .next-ticket', el).attr("href", "#tickets/filter/"+Ticket_Filter_ID+"/ticket/"+next_ticket_id);
		    else
		    	$('.navigation .next-ticket', el).replaceWith("<span class='pull-right text-disabled text-xs'><i class='icon icon-chevron-right v-middle'></i></span>");
		
	},
	
	changeStatus : function(status, callback){

		var url = "/core/api/tickets/change-status?status="+status+"&id=" + Current_Ticket_ID;

		Tickets.updateModel(url, function(model){

				if(status != "CLOSED"){
                    	$('#ticket_change_sla').removeAttr("disabled");
                    	$(".close-current-ticket").removeAttr("disabled");					
				}						
				else{ 
					$('#ticket_change_sla').attr("disabled","disabled");
					$(".close-current-ticket").attr("disabled","disabled");
				    Tickets.updateDataInModelAndCollection(CurrentTicket_ID,{closed_time:current_time});
				}
                Tickets.updateDataInModelAndCollection(CurrentTicket_ID,{status:status});
				
				if(callback)
					callback(model.toJSON());

			}, null, Current_Ticket_ID);		
	},

	closeTicket : function(e){

		this.changeStatus("CLOSED", function(){
            var current_time = new Date().getTime();

             Tickets.updateDataInModelAndCollection(Current_Ticket_ID,{closed_time:current_time});
			showNotyPopUp('information', "Ticket has been closed", 'bottomRight', 5000);

			var url = '#tickets/group/'+ (!Group_ID ? DEFAULT_GROUP_ID : Group_ID) + 
				'/' + (Ticket_Status ? Ticket_Status : 'new');

			Backbone.history.navigate(url, {trigger : true});
		
		});
	},

	deleteTicket: function(e){

		var deleteTicketView = new Base_Model_View({
			isNew : true,
			url : "/core/api/tickets/delete-ticket?id=" + Current_Ticket_ID,
			template : "ticket-delete",
			saveCallback : function(){

				$('#ticket-delete-modal').modal('hide');

				 if(App_Ticket_Module.ticketsCollection)
	           	 	App_Ticket_Module.ticketsCollection.collection.remove(Current_Ticket_ID);

	           	showNotyPopUp('information', "Ticket has been deleted",'bottomRight', 5000);
	                          
				var url = '#tickets/filter/' + Ticket_Filter_ID;
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

		var widgetState = _agile_get_prefs("hide_ticket_details_widgets");
		if(widgetState && widgetState == "true")
			return;

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

	/*clearSelection: function(e){

		var container = $('div.show-caret');

		if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        container.find('.dropdown-menu').dropdown('toggle');
			container.removeClass('bg-light');
			container.find('.caret-btn').removeClass('inline-block').addClass('display-none');
	    }
	},*/

	isSingleRowView: function(){
		return (CURRENT_DOMAIN_USER.helpdeskSettings && CURRENT_DOMAIN_USER.helpdeskSettings.ticket_view_type == 'SINGLELINE')
								 ? true : false;
	},

	toggleFavorite : function(e){

		var favourite = true; 

		//Toggling star color
		if($(e.target).hasClass("fa-star text-warning")){
			$(e.target).removeClass("fa-star text-warning").addClass("fa-star-o text-light");
		     favourite=false;
		}else{
		   
			$(e.target).addClass("fa-star text-warning").removeClass("fa-star-o text-light");
		}

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/toggle-favorite?id=" + Current_Ticket_ID;
		newTicketModel.save({'id': Current_Ticket_ID}, 
			{	

				success: function(model){
                     var succesmessage = "Ticket marked favourite";
					if(!favourite)

						succesmessage = "Ticket marked as unfavourite";
                     Tickets.updateDataInModelAndCollection(Current_Ticket_ID,{is_favorite:favourite});
					 showNotyPopUp('information', succesmessage, 'bottomRight', 5000);
					// if(model.toJSON().is_favorite)
					// 	$(e.target).addClass("fa-star text-warning").removeClass("fa-star-o text-light");
					// else
					// 	$(e.target).removeClass("fa-star text-warning").addClass("fa-star-o text-light");

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
					var message ="";
					var spam_value=true;
					if(model.toJSON().is_spam){
						$(e.target).addClass("btn-danger").removeClass("btn-default");
					    message="Ticket marked as Spam";
					    
					}
					else{
						$(e.target).removeClass("btn-danger").addClass("btn-default");
                        message="Ticket un marked as Spam";
                        spam_value=false;
                    }
                    showNotyPopUp('information',message, 'bottomRight', 5000);
					// If in time line add event to timeline
					if($('.ticket-timeline-container').length > 0){
						Ticket_Timeline.render_individual_ticket_timeline()
					}
					Tickets.updateDataInModelAndCollection(Current_Ticket_ID, {is_spam:spam_value});

				}
			});
	},

	toggleWidgets : function(e){

		$('.contact-right-widgetsview').toggle('slow', function(){

			var widgetStatus = true;
			if($('.contact-right-widgetsview').is(':visible'))
				widgetStatus = false;

			_agile_set_prefs('hide_ticket_details_widgets', widgetStatus);

			if($(e.target).hasClass('fa-dedent'))
			$(e.target).addClass('fa-indent').removeClass('fa-dedent');
			else
			$(e.target).addClass('fa-dedent').removeClass('fa-indent');

			if(widgetStatus == false && $("#widgets-model-list").length == 0)
				Tickets.loadWidgets();

		});
	},

	setMinHeight: function(){

		var $row = $('.ticket-collection-row');

		if($row && $row.offset() && $row.offset().top)
			$row.css('min-height', window.innerHeight - $row.offset().top + 'px');
	},

	updateDueDate : function(timeInMilli, callback){

	  	var json = {};
		json.due_time = Math.floor(timeInMilli);
		json.id = App_Ticket_Module.ticketView.model.toJSON().id;

		// Send req to trigger campaign
		var newTicketModel = new BaseModel();
		newTicketModel.url = "core/api/tickets/change-due-date?due_time="
		+ timeInMilli + "&id=" + Current_Ticket_ID;
		newTicketModel.save(json, {	
			success: function(model){

				var formatted_date = new Date(timeInMilli).format('mmm dd, yyyy');
				Tickets.updateDataInModelAndCollection(Current_Ticket_ID,{due_time:json.due_time});
				$(".remove-date").css("display", "block");
				showNotyPopUp('information', "Due date has been changed to " + formatted_date, 
					'bottomRight', 5000);

				if(callback)
					callback();
			}}
		);
	},
	removeDuedate : function(){
		url = "/core/api/tickets/remove-due-date?id=" + Current_Ticket_ID;

        Tickets.updateModel(url, function(model){

        		$('#ticket_change_sla').val(''); 

        		$(".remove-date").css("display", "none");

				Tickets.updateDataInModelAndCollection(Current_Ticket_ID,{due_time:''});

				showNotyPopUp('information', "Due date has been removed",'bottomRight', 5000);

		}, null, Current_Ticket_ID);
 
	},

	initializeTicketSLA : function(el){
		
		var ticket = App_Ticket_Module.ticketView.model.toJSON();

  		if(ticket.status == "CLOSED")
  			return;

		head.load(LIB_PATH + 'lib/date-charts.js', function()
		{
			$('#ticket_change_sla', el).datepicker({ 
				drops: "down", 
				dateFormat : CURRENT_USER_PREFS.dateFormat
			}).on('changeDate', function(ev)
			{
				
				var selected_date = $('#ticket_change_sla', el).val();
				var selected_date_epoch_time = Date.parse(selected_date).getTime();

				//Show alert if selected date is less than today start time
				if(selected_date_epoch_time < Date.today().getTime()){

					getTemplate("ticket-sla-error", {}, undefined, function(template_ui){

						if(!template_ui)
					  		return;

					  	$('#ticket_change_sla', el).datepicker( "hide" );


					  	var due_time = ticket.due_time;

					  	if(due_time)
					  		$('#ticket_change_sla').val(new Date(due_time).format('mm/dd/yyyy'));
					 
					  	else
					  		$('#ticket_change_sla').val('');

					  	$('#ticket-modals').html($(template_ui));
					  	$('#sla-error-modal').modal('show');
					});

					return;
				}

				
				Tickets.updateDueDate(selected_date_epoch_time, function(){
					$('#ticket_change_sla', el).datepicker("hide");
					$('#ticket_change_sla', el).blur();
				});
			});
		});

		//Initializing click event on due date button
	  	$(el).on('click','.choose-due-date', function(event){

	  		var value = $(this).data('value'), current_date = new Date();

	  		switch(value){
	  			case 'tomorrow':
	  				current_date.setDate(current_date.getDate() + 1);
	  				break;
	  			case 'next_two_days':
	  				current_date.setDate(current_date.getDate() + 2);
	  				break;
	  			case 'next_three_days':
	  				current_date.setDate(current_date.getDate() + 3);
	  				break;
	  			case 'next_five_days':
	  				current_date.setDate(current_date.getDate() + 5);
	  				break;
	  		}

	  		//Set selected date in input field
	  		$('#ticket_change_sla', el).val(new Date(current_date.getTime()).format('mm/dd/yyyy'));

	  		Tickets.updateDueDate(current_date.getTime(), function(){
				$('#ticket_change_sla', el).datepicker("hide");
				$('#ticket_change_sla', el).blur();
			});
	  	});
	},

	removeTicketsFromCollection: function(ticketIDCSV){

		var ticketIDArray = ticketIDCSV.split(",");

		if(!ticketIDArray || ticketIDArray.length ==0)
			return;

		for(var i=0; i<ticketIDArray.length; i++){
			$('td#' + ticketIDArray[i]).closest('tr').remove();
			App_Ticket_Module.ticketsCollection.collection.remove(ticketIDArray[i]);
		}
	},

	showPreviousTicketCount: function(email, el){

		$.get('/core/api/tickets/ticket-count?email=' + email, {}, function(count){

			if(count && count > 1){ 
					$(".previous-tickets-panel", el).find("#count").html("(" + (count - 1) + ")");
					$(".previous-tickets-panel", el).show();
				}
		});

	},

	togglePreviousTickets: function(email){

		if($("#previous_tickets_container").is(':visible')){
			$("#previous_tickets_container").toggle();
			$("#toggle_previous_tickets").addClass("fa-plus").removeClass("fa-minus");
			return;
		}

		$("#previous_tickets_container").toggle();
		$("#toggle_previous_tickets").removeClass("fa-plus").addClass("fa-minus");

		// If collection loaded
		if($("#previous_tickets_container").find(".each-previous-ticket").length > 0)
			return;
			
		var previousTickets = Backbone.Model.extend({
			url : '/core/api/tickets/email?email=' + email
		});
		new previousTickets().fetch({
			success : function(tickets) {

				if(tickets.toJSON().length > 1){
					$(".previous-tickets-panel").hide();
					return;
				}

				$("#previous_tickets_container").html(getTemplate('previous-tickets-list', tickets.toJSON())).show();

				Tickets.initPreviousTicketEvents($("#previous_tickets_container"));

			}
		});

	},

	initPreviousTicketEvents: function(el){

		$(el).off('mouseover mouseout');
		$(el)
			.on('mouseover mouseout', '.show-notes',
				function(event) {

					clearTimeout(popoverFunction);

					var top = '20px';
					if (event.type == 'mouseover'){

						var $tr = $(this).closest('.each-previous-ticket'), $that = $tr.find('#ticket-last-notes');

						popoverFunction = setTimeout(function(){

							var popup_height = $that.height();

							if (window.innerHeight - ($tr.offset().top - $(window).scrollTop()) <= (popup_height + 100))
								top = '-' + (popup_height + 20) + 'px';

							$that.css('top', top).css('left','25px').css('display', 'block');

						},600);
					} else {
						$('.ticket-last-notes').css('display', 'none').css('top', top);
					}
				}
			);

	},

	toggleActivitiesUI :  function(type){

		var targetEle = $(".toggle-activities-notes");
		var currentType = targetEle.attr("rel");

		if(type && type == "hide"){
			targetEle.attr("rel", "activities");
			targetEle.attr("data-original-title", "Hide activities");
			targetEle.html("<i class='fa fa-ellipsis-v'></i>");
		}
		else{
			//Rendering ticket notes
			targetEle.attr("rel", "notes");
			targetEle.attr("data-original-title", "Show activities");
			targetEle.html("<i class='fa fa-ellipsis-h'></i>");
		}

	},

	updateIframeHeight : function(iframe){

		$(iframe).height($(iframe).contents().height());

		$(iframe).contents().find('body').css({
		    'font-family': '"Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif',
		    'font-size': '14px',
		    '-webkit-font-smoothing': 'antialiased',
		    'line-height': '1.42857143',
		    'color': '#58666e',
		    'background-color': 'transparent',
		    'margin': '0',
		    'padding': '0'
		});
	},

	message_draft_timer : undefined,

	// Draft typed message
	start_ticket_draft_timer : function(key, ele){


		// Reset timer
		if (Tickets.message_draft_timer)
			clearInterval(Tickets.message_draft_timer);
		
		if (!ele)
			return;

		Tickets.message_draft_timer = setInterval(function() {

			var $ele = $(ele);

			if(!$ele || $ele.length == 0){
				clearInterval(Tickets.message_draft_timer);
				return;
			}
			
			Tickets.draft_typed_message(key, Tickets.get_typed_message_json($ele));

		}, 2000);

	},

	get_typed_message_json : function($ele){

		var value = $ele.val();

		if($ele.hasClass('forward'))
			return {"forward" : value};
		else if($ele.hasClass('comment'))
			return {"comment" : value};
		else
			return {"reply" : value};

	},

	draft_typed_message :  function(key, ticketDraftJSON) {

		if(!key || !ticketDraftJSON)
			return;

		var draft_mssgs = Tickets.get_draft_message();
		var value = draft_mssgs[key];
		if(!value)
			value = {};

		for (typeKey in ticketDraftJSON) {
			value[typeKey] = ticketDraftJSON[typeKey];
		}

		draft_mssgs[key] = value;

	 	try {
	 		// Add to localstorage
			localStorage.setItem("ticket-draft-message", JSON.stringify(draft_mssgs));
	    } catch (e) {

	    	draft_mssgs = {
	    		key:value
	    	}
	    	localStorage.setItem("ticket-draft-message", JSON.stringify(draft_mssgs));
	    }

	},

	get_draft_message : function(key){

		var draft_mssgs = localStorage.getItem("ticket-draft-message");
		if (!draft_mssgs)
			return {};

		// Parse stringify values
		return JSON.parse(draft_mssgs);
	
	},

	remove_draft_message : function(key, type){

		var draft_mssgs = Tickets.get_draft_message();

		var ticketDraft = draft_mssgs[key];

		// Delete message key
		delete ticketDraft[type];

		draft_mssgs[key] = ticketDraft;
		localStorage.setItem("ticket-draft-message", JSON.stringify(draft_mssgs));
	
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

