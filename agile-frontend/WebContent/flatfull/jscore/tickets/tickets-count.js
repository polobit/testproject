var Tickets_Count = {

	ticketsCount : {},
	fetchFilterTicketsCount: function(filters_colletion){

		if(!App_Ticket_Module.ticketFiltersList)
			return;
		
		var filters = App_Ticket_Module.ticketFiltersList.collection.toJSON();

		for(var i=0; i<filters.length; i++){

			this.showFiltersTicketCount(filters[i].id);	
		}
	},

	showFiltersTicketCount: function(filter_id){

		var url = '/core/api/tickets/fitered-tickets-count?filter_id='+ filter_id;

		this.ajax_call(url, function(data){

			Tickets_Count.ticketsCount[filter_id] = data.count;
			$('a[filter-id="'+ filter_id +'"]').find('badge').html(data.count);
		});
	},
		
	ajax_call: function(url, callback){

		$.ajax({
			url : url, 
			accept: 'application/json',
			success : function(data){

				if(callback)
					callback(data);
			}	
		});
	}
};