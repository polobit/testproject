var Tickets_Count = {

	fetch_tickets_count: function(){

		var ticket_type = ['NEW','OPEN','STARRED','CLOSED'];

		for(var i=0; i < ticket_type.length; i++)
			this.show_count(ticket_type[i]);
	},

	fetch_filter_tickets_count: function(filters_colletion){

		var filters = App_Ticket_Module.ticketFiltersCollection.collection.toJSON();

		for(var i=0; i<filters.length; i++){

			this.show_filters_ticket_count(filters[i].id);	
		}
	},

	show_count: function(type){

		var url = '/core/api/tickets/count?status='+ type + '&group_id='+ Group_ID;

		this.ajax_call(url, function(data){

			switch(type){
				case 'NEW':
					New_Tickets = data.count;
					break;
				case 'OPEN':
					Opened_Tickets = data.count;
					break;
				case 'STARRED':
					Starred_Tickets = data.count;
					break;
				case 'CLOSED':
					Closed_Tickets = data.count;
					break;			
			}

			$('ul.ticket-types').find('li > a.'+ type.toLowerCase() +' > badge').html(data.count);
		});
	},
		
	show_filters_ticket_count: function(filter_id){

		var url = '/core/api/tickets/fitered-tickets-count?filter_id='+ filter_id;

		this.ajax_call(url, function(data){

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
	},

	render_tickets_count: function(){

		var $ul = $('ul.ticket-types').find('li');

		$ul.find('a.new > badge').html(New_Tickets);
		$ul.find('a.open > badge').html(Opened_Tickets);
		$ul.find('a.starred > badge').html(Starred_Tickets);
		$ul.find('a.closed > badge').html(Closed_Tickets);
	}
};