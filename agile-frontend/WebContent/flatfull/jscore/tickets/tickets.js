var Group_ID = '', Ticket_Status = 'new', Current_Ticket_ID = null, New_Tickets = 0, Opened_Tickets = 0, 
		Starred_Tickets = 0, Closed_Tickets =0, Tickets_Util = {} ;

$(function(){
	
	Tickets_Util = {

		initialize: function(group_id, callback){

			//Checking root template
			if($('#tickets-container').length == 0 || Group_ID != group_id){

				Group_ID = group_id;

				//Rendering root template
				getTemplate("tickets-container",  {group_id: group_id}, undefined, function(template_ui){

					if(!template_ui)
				  		return;

					$('#content').html($(template_ui));	

					//Fectching new, open, closed tickets count
					Tickets_Count.fetch_tickets_count();

					//Rendering Groups dropdown
					Tickets_Group_View = new Ticket_Base_Model({
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

				}, "#content");
			}	
			else{

				$('#right-pane').html(Tickets_Group_View.render().el);
				
				Tickets_Group_View.delegateEvents();

				if(callback)
					callback();
			}

			Current_Ticket_ID = null;
		},
	};
});

/**
 *
 **/
function changeGroup(event){

	
}