var Ticket_Bulk_Ops = {

	selected_all_tickets : false,
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

				//Set global variable to send it in URL param and to show suggestion text
				Ticket_Bulk_Ops.selected_all_tickets = selected_all ? true : false;

				//Checking/unchecking checkboxes
				selected_all ? Ticket_Bulk_Ops.checkAllTickets($el) : Ticket_Bulk_Ops.uncheckAllTickets($el);
			}
		});
	},

	checkAllTickets: function($el){
		$('.ticket-checkbox', $el).prop('checked', true);
		$('.bulk-action-btn-grp', $el).show();

		Ticket_Bulk_Ops.showText();
	},

	uncheckAllTickets: function($el){
		$('.ticket-checkbox', $el).prop('checked', false);
		$('.bulk-action-btn-grp', $el).hide();
		$('#tickets-bulk-select').html('');
		Ticket_Bulk_Ops.selected_all_tickets = false;
	},

	showText: function(){

		var selected_tickets_count = $('ul#ticket-model-list').find('input.ticket-checkbox:checked').length;
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
	}
};