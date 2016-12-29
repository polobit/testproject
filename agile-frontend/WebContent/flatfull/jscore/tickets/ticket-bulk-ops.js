//Ticket_Bulk_Ops handles bulk operations performed by assignee. It initializes the events on
//all checkboxes and bulk operation buttons.
var Ticket_Bulk_Ops = {

	selected_all_filter_tickets : false,
	selected_ticket_ids : new Array(),
	initEvents: function(el){

		var $el = $('.tickets-div', el);

		/**
		 * Initializing click event on top ticket checkbox
		 */
		$('label.select-all', el).off('click', "input.select-all");
		$('label.select-all', el).on('click', "input.select-all", function(e){
			
			var selected_all = $(this).is(':checked');

			//Checking/unchecking checkboxes
			selected_all ? Ticket_Bulk_Ops.checkAllTickets($el) : Ticket_Bulk_Ops.clearSelection();
		});

		/**
		 * Initializing click event on bulk action close tickets
		 */
		$el.off('click', ".bulk-ticket-close");
		$el.on('click', ".bulk-ticket-close", function(e){
			e.preventDefault();
			
			Ticket_Bulk_Ops.renderTemplate('close-tickets');
		});

		/**
		 * Initializing click event on bulk action close tickets
		 */
		$el.off('click', ".bulk-favorite-tickets");
		$el.on('click', ".bulk-favorite-tickets", function(e){
			e.preventDefault();
			
			Ticket_Bulk_Ops.renderTemplate('mark-favorite');
		});

		/**
		 * Initializing click event on bulk action close tickets
		 */
		$el.off('click', ".bulk-spam-tickets");
		$el.on('click', ".bulk-spam-tickets", function(e){
			e.preventDefault();
			
			Ticket_Bulk_Ops.renderTemplate('mark-spam');
		});

		/**
		 * Initializing click event on bulk action delete tickets
		 */
		$el.off('click', ".bulk-ticket-delete");
		$el.on('click', ".bulk-ticket-delete", function(e){
			e.preventDefault();

			Ticket_Bulk_Ops.renderTemplate('delete-tickets');
		});

		/**
		 * Initializing click event on bulk action delete tickets
		 */
		$el.off('click', "a#select-all-tickets");
		$el.on('click', "a#select-all-tickets", function(e){
			e.preventDefault();

			Ticket_Bulk_Ops.selected_all_filter_tickets = true;

			//Check all tickets
			$('.ticket-checkbox').prop('checked', true);

			//Rendering suggestion text.Template incl. in tickets-groups-container-template.html
			$('#tickets-bulk-select').html(getTemplate('ticket-bulk-ops-text', {total_tickets_selected : true}));
		});

		/**
		 * Initializing click event on clear selection tickets
		 */
		$el.off('click', "a#clear-ticket-selection");
		$el.on('click', "a#clear-ticket-selection", function(e){
			e.preventDefault();

			Ticket_Bulk_Ops.clearSelection();
		});
	},

	checkAllTickets: function(){

		//Iterating through all ticket checkboxes
		$('.each-ticket.ticket-checkbox').each(function(){

			//Set checkbox as enabled
		    $(this).prop('checked', true);
		    
		    var ticketID = $(this).data('ticket-id');

		    if(!ticketID)
		    	return false;

		    if(Ticket_Bulk_Ops.selected_ticket_ids.indexOf(ticketID) == -1)
		    	//Set selected ticket id
		    	Ticket_Bulk_Ops.selected_ticket_ids.push(ticketID);
		});

		//Show bulk actions and hide ticket filters dropdown
		$('.bulk-action-btn').removeClass('disabled');

		Ticket_Bulk_Ops.showText();
	},

	clearSelection: function(){

		//Unchecking all tickets
		$('.ticket-checkbox').prop('checked', false);

		//disabling bulk action button group
		$('.bulk-action-btn').addClass('disabled');
		$('#tickets-bulk-select').html('');
		Ticket_Bulk_Ops.selected_all_filter_tickets = false;

		//Initializing tickets array to empty
		Ticket_Bulk_Ops.selected_ticket_ids = [];
	},

	showText: function(){

		var selected_tickets_count = Ticket_Bulk_Ops.selected_ticket_ids.length;

		//Checking if total selected tickets count is equal to tickets collection
		if(selected_tickets_count > 0){
			var total_tickets_count = Tickets_Count.ticketsCount[Ticket_Filter_ID], json = {};

			//Checking if all tickets selected and is equal to tickets count
			if(selected_tickets_count == total_tickets_count){
				Ticket_Bulk_Ops.selected_all_filter_tickets = true;
				$('.ticket-checkbox.select-all').prop('checked', true);
				json.total_tickets_selected = true;
				json.total_tickets_count = total_tickets_count;

				//Rendering suggestion text. Template incl. in tickets-groups-container-template.html
				$('#tickets-bulk-select').html(getTemplate('ticket-bulk-ops-text', json));
			}
			else if(selected_tickets_count == App_Ticket_Module.ticketsCollection.collection.length){

				json.tickets_count = selected_tickets_count;
				json.total_tickets_count = total_tickets_count;

				//Rendering suggestion text. Template incl. in tickets-groups-container-template.html
				$('#tickets-bulk-select').html(getTemplate('ticket-bulk-ops-text', json));
			}
			else{
				Ticket_Bulk_Ops.selected_all_filter_tickets = false;
			}

			$('.bulk-action-btn').removeClass('disabled');
		}else{
			Ticket_Bulk_Ops.clearSelection();
		}
	},

	//This method will be called when ticket checkbox is either checked or unchecked
	addOrRemoveTicketID: function(that){
		
		//Get selected ticket id
		var ticketID = $(that).data('ticket-id');

		if($(that).is(':checked')){
			 Ticket_Bulk_Ops.selected_ticket_ids.push(ticketID);
		}
		else{
			var index = Ticket_Bulk_Ops.selected_ticket_ids.indexOf(ticketID);
			
			if (index > -1) {
			    Ticket_Bulk_Ops.selected_ticket_ids.splice(index, 1);
			}
		}	
	},

	getSelectedTickesObj: function(){
		return Ticket_Bulk_Ops.selected_ticket_ids.toString();
	},

	//When bulk operation is performed we need to change template accordingly.
	renderTemplate: function(action_type){

		if (!App_Ticket_Module.ticketsCollection || App_Ticket_Module.ticketsCollection.collection.length == 0)
		{	
			Backbone.history.navigate("tickets", { trigger : true });
			return;
		}
		
		switch(action_type){
			case 'manage-labels':{

				var view = new Ticket_Base_Model({
					isNew : true,
					template : "ticket-bulk-actions-add-labels",
					url : "/core/api/tickets/bulk-actions/manage-labels",
					saveCallback: function(){
						Tickets.renderExistingCollection();
					},
					prePersist : function(model)
					{
						var json = {};
						json.ticketIDs = Ticket_Bulk_Ops.getSelectedTickesObj();

						if(Ticket_Bulk_Ops.selected_all_filter_tickets)
							json.conditions = Ticket_Custom_Filters.customFilters;

						model.set(json, { silent : true });
					},
					postRenderCallback : function(el){

						Ticket_Labels.showSelectedLabels(new Array(), $(el));
					}
				});

				$('#content').html(view.render(true).el);
				break;
			}
			case 'change-assignee':{

				var view = new Ticket_Base_Model({
					isNew : true, 
					template : "ticket-bulk-actions-change-assignee",
					url : "/core/api/tickets/bulk-actions/change-assignee",
					saveCallback: function(){
						//Backbone.history.navigate('#tickets/filter/' + Ticket_Filter_ID,{render:true});
						Tickets.renderExistingCollection();
					},
					prePersist : function(model)
					{
						var json = {};
						json.ticketIDs = Ticket_Bulk_Ops.getSelectedTickesObj();

						if(Ticket_Bulk_Ops.selected_all_filter_tickets){
							json.conditions = Ticket_Custom_Filters.customFilters;
							//json.filterID =  Ticket_Filter_ID;
						}
						
						json.assigneeID = $('[name="groupID"]').find('option:selected').data('assignee-id');

						model.set(json, { silent : true });
					},
					postRenderCallback: function(el){

						//Fetching all groups, assignees and appending them to select dropdown
						fillSelect('groupID', '/core/api/tickets/new-ticket', '', function(collection){
							$('#groupID').html(getTemplate('select-assignee-dropdown', collection.toJSON()));
						}, '', false, el);
					}
				});

				$('#content').html(view.render().el);
				break;
			}	
			case 'execute-workflows':

				var view = new Ticket_Base_Model({
					isNew : true, 
					template : "ticket-bulk-actions-execute-workflow",
					url : "/core/api/tickets/bulk-actions/execute-workflow",
					saveCallback: function(){
						//Backbone.history.navigate('#tickets/filter/' + Ticket_Filter_ID,{render:true});
						Tickets.renderExistingCollection();
					},
					prePersist : function(model)
					{
						var json = {};
						json.ticketIDs = Ticket_Bulk_Ops.getSelectedTickesObj();

						if(Ticket_Bulk_Ops.selected_all_filter_tickets){
							json.conditions = Ticket_Custom_Filters.customFilters;
							//json.filterID =  Ticket_Filter_ID;
						}

						model.set(json, { silent : true });
					},
					postRenderCallback: function(el){

						var template = '<option value="{{id}}" {{#is_disabled}}disabled{{/is_disabled}}>{{name}}</option>';

						//Fetching all groups, assignees and appending them to select dropdown
						fillSelect('workflowID', '/core/api/workflows/partial', '', null, template, false, el);
					}
				});

				$('#content').html(view.render().el);
				break;
			case 'close-tickets':

				var view = new Ticket_Base_Model({
					isNew : true, 
					template : "ticket-bulk-actions-close-tickets",
					url : "/core/api/tickets/bulk-actions/close-tickets",
					saveCallback: function(){
						Ticket_Bulk_Ops.clearSelection();
						//$('#close-tickets-modal').modal('hide');

						Ticket_Utils.resetModalSettings($('#ticketsModal'));
					},
					prePersist : function(model)
					{
						var json = {};
						json.ticketIDs = Ticket_Bulk_Ops.getSelectedTickesObj();

						if(Ticket_Bulk_Ops.selected_all_filter_tickets)
							json.conditions = Ticket_Custom_Filters.customFilters;

						model.set(json, { silent : true });
					}
				});

				$('#ticketsModal').html(view.render().el).modal('show');
				break;
			case 'delete-tickets':

				var view = new Ticket_Base_Model({
					isNew : true,
					template : "ticket-bulk-actions-delete-tickets",
					url : "/core/api/tickets/bulk-actions/delete-tickets",
					saveCallback: function(){
						
						if(Ticket_Bulk_Ops.selected_all_filter_tickets)
							Tickets_Count.ticketsCount[Ticket_Filter_ID] = 0;
						else
							Tickets_Count.ticketsCount[Ticket_Filter_ID] = Tickets_Count.ticketsCount[Ticket_Filter_ID] - 
												Ticket_Bulk_Ops.selected_ticket_ids.length;

						Tickets_Rest.removeTicketsFromCollection(Ticket_Bulk_Ops.getSelectedTickesObj());
						Ticket_Bulk_Ops.clearSelection();
						//$('#delete-tickets-modal').modal('hide');

						Ticket_Utils.resetModalSettings($('#ticketsModal'));
					},
					prePersist : function(model)
					{
						var json = {};
						json.ticketIDs = Ticket_Bulk_Ops.getSelectedTickesObj();

						if(Ticket_Bulk_Ops.selected_all_filter_tickets)
							json.conditions = Ticket_Custom_Filters.customFilters;
						
						model.set(json, { silent : true });
					}
				});

				$('#ticketsModal').html(view.render().el).modal('show');
				break;
			case 'mark-spam':

				var view = new Ticket_Base_Model({
					isNew : true,
					template : "ticket-bulk-actions-spam-tickets",
					url : "/core/api/tickets/bulk-actions/spam-tickets",
					saveCallback: function(){
						Ticket_Bulk_Ops.clearSelection();
						//$('#spam-tickets-modal').modal('hide');

						Ticket_Utils.resetModalSettings($('#ticketsModal'));
					},
					prePersist : function(model)
					{
						var json = {};
						json.ticketIDs = Ticket_Bulk_Ops.getSelectedTickesObj();

						if(Ticket_Bulk_Ops.selected_all_filter_tickets)
							json.conditions = Ticket_Custom_Filters.customFilters;
						
						model.set(json, { silent : true });
					}
				});

				$('#ticketsModal').html(view.render().el).modal('show');
				break;
			case 'mark-favorite':

				var view = new Ticket_Base_Model({
					isNew : true,
					template : "ticket-bulk-actions-favorite-tickets",
					url : "/core/api/tickets/bulk-actions/favorite-tickets",
					saveCallback: function(){
						Ticket_Bulk_Ops.clearSelection();
						//$('#favorite-tickets-modal').modal('hide');

						Ticket_Utils.resetModalSettings($('#ticketsModal'));
					},
					prePersist : function(model)
					{
						var json = {};
						json.ticketIDs = Ticket_Bulk_Ops.getSelectedTickesObj();

						if(Ticket_Bulk_Ops.selected_all_filter_tickets)
							json.conditions = Ticket_Custom_Filters.customFilters;
						
						model.set(json, { silent : true });
					}
				});

				$('#ticketsModal').html(view.render().el).modal('show');
				break;
		}
	},
	
	ajax_call: function(url, data, callback){

		$.ajax({
			url : url,
			type: 'POST',
			data: data,
			ContentType: 'application/x-www-form-urlencoded',
			success : function(data){

				if(callback)
					callback(data);
			}
		});
	}
};