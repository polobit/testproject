var Tickets_Count;

$(function(){
	Tickets_Count = {

		fetch_tickets_count: function(){

			var ticket_type = ['NEW','OPEN','STARRED','CLOSED'];

			for(var i=0; i < ticket_type.length; i++)
				this.get_count(ticket_type[i]);
		},

		get_count: function(type){

			$.ajax({
				url : '/core/api/tickets/count?status='+ type + (!Group_ID ? "" : '&group_id='+Group_ID), 
				accept: 'application/json',
				success : function(data){

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
	}
});