var Tickets_Count = {

	ticketsCount : {},
	fetch_tickets_count: function(){

		if(!Reload_Tickets_Count){

			Tickets_Count.render_tickets_count();
			return;
		}

		var ticket_type = ['NEW','OPEN','STARRED','CLOSED'];

		for(var i=0; i < ticket_type.length; i++)
			this.show_count(ticket_type[i], Group_ID);

		Reload_Tickets_Count = false;
	},

	fetchFilterTicketsCount: function(filters_colletion){

		if(!App_Ticket_Module.ticketFiltersList)
			return;
		
		var filters = App_Ticket_Module.ticketFiltersList.collection.toJSON();

		for(var i=0; i<filters.length; i++){

			this.showFiltersTicketCount(filters[i].id);	
		}
	},

	show_count: function(type, group_id){

		var url = '/core/api/tickets/count?status='+ type + '&group_id='+ group_id;

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

			$('ul.ticket-types').find('li > a.'+ type.toLowerCase()).attr('href', '#tickets/group/' + group_id + '/' + type.toLowerCase());
			$('ul.ticket-types').find('li > a.'+ type.toLowerCase() +' > badge').html(data.count);
		});
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
	},

	render_tickets_count: function(){

		var $ul = $('ul.ticket-types').find('li');

		$ul.find('a.new > badge').html(New_Tickets);
		$ul.find('a.open > badge').html(Opened_Tickets);
		$ul.find('a.starred > badge').html(Starred_Tickets);
		$ul.find('a.closed > badge').html(Closed_Tickets);
	}
};