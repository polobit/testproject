var Group_ID = '', Ticket_Status = 'new', Current_Ticket_ID = null, New_Tickets = 0, Opened_Tickets = 0, 
		Starred_Tickets = 0, Closed_Tickets =0, Tickets_Util = {} ;

$(function(){
	
	Tickets_Util = {

		initialize: function(group_id, callback){

			//Checking root template
			if($('#tickets-container').length == 0 || Group_ID != group_id){

				Group_ID = group_id;

				//Fectching new, open, closed tickets count
				Tickets_Count.fetch_tickets_count();

				//Rendering root template
				$("#content").html(getTemplate('tickets-container', {group_id: group_id}));

				//Rendering Groups dropdown
				Tickets_Group_View = new Base_Model_View({
					isNew : false,
					template : "tickets-groups-container",
					url : "/core/api/tickets/groups",
					postRenderCallback : function(el, data) {

						//Render Group name on drop down
						$.map(data, function(obj,index){

							if(obj.id == Group_ID)
							{
								$('a#group_name').html(obj.group_name);
								return true;
							}	
						});

						if(callback)
							callback();
					}
				});

				$('#right-pane').html(Tickets_Group_View.render().el);
			}	
			else{

				$('#right-pane').html(Tickets_Group_View.render().el);
				
				if(callback)
					callback();
			}

			Current_Ticket_ID = null;
		},
	}
});