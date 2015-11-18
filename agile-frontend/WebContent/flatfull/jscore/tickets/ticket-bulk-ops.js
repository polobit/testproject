var Ticket_Bulk_Ops = {

	selected_collection_tickets : false,
	selected_all_filter_tickets : false,
	selected_ticket_ids : new Array(),
	initEvents: function(){

		var $el = $('#tickets-container');

		/**
		 * Initializing click event on ticket checkboxes
		 */
		$el.on('change', ".ticket-checkbox", function(e){
			// e.stopPropagation();
			
			var $this = $(this);

			if($this.hasClass('select-all')){

				//Checking if select all checkbox is selected
				var selected_all = $this.is(':checked');

				//Checking/unchecking checkboxes
				selected_all ? Ticket_Bulk_Ops.checkAllTickets($el) : Ticket_Bulk_Ops.clearSelection();
			}
		});
	},

	checkAllTickets: function($el){

		//$('.ticket-checkbox', $el).prop('checked', true);
		$('.bulk-action-btn-grp', $el).show();

		//Iterating through all ticket checkboxes
		$('.each-ticket.ticket-checkbox').each(function(){

			//Set checkbox as enabled
		    $(this).prop('checked', true);
		    
		    var ticketID = $(this).data('ticket-id');

		    if(Ticket_Bulk_Ops.selected_ticket_ids.indexOf(ticketID) == -1)
		    	//Set selected ticket id
		    	Ticket_Bulk_Ops.selected_ticket_ids.push(ticketID);
		});

		Ticket_Bulk_Ops.selected_collection_tickets = true;
		Ticket_Bulk_Ops.showText();
	},

	clearSelection: function(){

		//Unchecking all tickets
		$('.ticket-checkbox').prop('checked', false);

		//Hiding bulk action button group
		$('.bulk-action-btn-grp').hide();

		//Hiding suggestion text
		$('#tickets-bulk-select').html('');

		//Initializing tickets array to empty
		Ticket_Bulk_Ops.selected_ticket_ids = [];

		//Set selected all tickets to false
		Ticket_Bulk_Ops.selected_collection_tickets = false;
	},

	showText: function(){

		var selected_tickets_count = Ticket_Bulk_Ops.selected_ticket_ids.length;
		var collection_count = App_Ticket_Module.ticketsCollection.collection.length;

		//Checking if total selected tickets count is equal to tickets collection
		if(selected_tickets_count == collection_count){
			$('.ticket-checkbox.select-all').prop('checked', true);

			var total_tickets_count = Tickets_Count.ticketsCount[Ticket_Filter_ID];

			if(collection_count == total_tickets_count)
				total_tickets_count = 0;

			//Rendering suggestion text
			$('#tickets-bulk-select').html(getTemplate('ticket-bulk-ops-text', 
				{selected_tickets_count: collection_count, total_tickets_count : total_tickets_count}));
		}else{

			$('.ticket-checkbox.select-all').prop('checked', false);

			if(selected_tickets_count == 0){
				
				$('.bulk-action-btn-grp').hide();
				$('#tickets-bulk-select').html('');
			}else{
				$('.bulk-action-btn-grp').show();
			}	
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

	renderTemplate: function(action_type){

		if (!App_Ticket_Module.ticketsCollection || App_Ticket_Module.ticketsCollection.collection.length == 0)
			Backbone.history.navigate("tickets", { trigger : true });

		switch(action_type){
			case 'add-labels':{

				var view = new Ticket_Base_Model({
					isNew : false, 
					template : "ticket-bulk-actions-add-labels",
					url : "/core/api/tickets/new-ticket",
					postRenderCallback : function(){

						//Initializing type ahead for tags
						Ticket_Tags.showTagsField();
					}
				});

				$('#content').html(view.render().el);
				break;
			}
			case 'remove-labels':
				break;
			case 'change-assignee':{

				var view = new Ticket_Base_Model({
					isNew : false, 
					template : "ticket-bulk-actions-change-assignee",
					url : "/core/api/tickets/bulk-actions/change-assignee",
					postRenderCallback : function(){

					}
				});

				$('#content').html(view.render().el);
				break;
			}	
			case 'execute-workflows':
				break;
			case 'close-tickets':
				break;
			case 'delete-tickets':
				break;					
		}
	},

	bulkAddLabels: function(e){

		var saveButton = $('.bulk-add-labels');
		disable_save_button(saveButton);

		var tagsObj = get_tags('bulk-labels').pop();

		if(tagsObj['value'].length == 0)
		{
			var $err_msg = $('.error-tags');
			$err_msg.show();
			setTimeout(function(){$err_msg.hide();}, 3000);
			enable_save_button(saveButton);
			return;
		}

		var url = '/core/api/tickets/bulk-actions/add-tags';

		var json = {};
		json.action_type = 'ADD_TAGS';
		json.tags = tagsObj['value'].toString();
		json.ticket_ids = Ticket_Bulk_Ops.getSelectedTickesObj();

		if(Ticket_Bulk_Ops.selected_all_filter_tickets)
			json.filter_id =  Ticket_Filter_ID;

		this.ajax_call(url, json, function(){
			enable_save_button(saveButton);
		});
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