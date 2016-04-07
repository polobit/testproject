var Ticket_Groups = {

	//Fetches ticket groups and stores view in Tickets_Group_View for re-rendering
	fetchGroups: function(){

		//Rendering Groups dropdown
		Tickets_Group_View = new Ticket_Base_Model({
			isNew : false,
			template : "tickets-groups-container",
			url : "/core/api/tickets/groups",
			postRenderCallback : function(el, data) {

				//Including group name on drop down
				$('a#group_name', el).html($('a[data-group-id="'+ Group_ID +'"]').attr('data-group-name'));
			}
		});

		$('#groups-list-container').html(Tickets_Group_View.render().el);
	},

	//Renders existing groups view
	renderGroupsView: function(){

		var el = Tickets_Group_View.render().el;

		//Rendering existing ticket group view
		$('#groups-list-container').html(el);

		//Including group name on drop down
		$('a#group_name', el).html($('a[data-group-id="'+ Group_ID +'"]').attr('data-group-name'));

		Tickets_Group_View.delegateEvents();
	}
};