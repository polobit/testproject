var Ticket_Custom_Filters = {

	init: function(event){

		head.js('/lib/chosen.jquery.min.js', function()
		{	
			//Labels select
			$(".labels-select").chosen();

			//Status select
			$(".status-select").chosen();

			//Ticket type select
			$(".type-select").chosen();
				
			var groupsAssignees = Backbone.Model.extend({urlRoot : '/core/api/tickets/groups'});
			new groupsAssignees().fetch({success: function(model, response, options){
			
				$('#ticket-assignee-list').html(getTemplate('ticket-change-assignee', model.toJSON()));
	      		$('#ticket-group-list').html(getTemplate('ticket-change-group', model.toJSON()));

	      		var $select = $('.ticket-group-assignee-list');
	      			
				

				//Initliazing multi select drop down
				$select.chosen();

				$select.off('change');
				$select.on('change', function(evt, params) {
				   
				   console.log(evt);
				   console.log(params);

				   Tickets.initChangeAssigneeEvent(evt, params);
				});
				

			}, error: function(){

			}});
		});	
	},
};