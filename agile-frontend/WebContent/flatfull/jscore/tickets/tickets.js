var Group_ID = '', Ticket_Status = 'new', Current_Ticket_ID = null, Ticket_Filter_ID = null,
New_Tickets = 0, Opened_Tickets = 0, 
		Starred_Tickets = 0, Closed_Tickets =0, Tickets_Util = {} ;

$("body").bind('click', function(ev) {
	Tickets.hideDropDowns(ev);
});

var Tickets = {

	fetch_tickets_collection: function(url, group_id){

		//Renders root template, fetches tickets count & loads Groups drop down
		Tickets.initialize(group_id, function(){

			App_Ticket_Module.ticketsCollection = new Base_Collection_View({
				url : url,
				sortKey:"created_time",
				descending:true,
				templateKey : "ticket",
				individual_tag_name : 'div',
				cursor : true,
				page_size : 20,
				slateKey : "no-tickets",
				postRenderCallback: function(el){

					//Initialize tooltips
					$('.refresh-tickets').tooltip();

					head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
					{
						$("time", el).timeago();
								
					});
				}
			});

			//Activating main menu
			$('nav').find(".active").removeClass("active");
			$("#tickets").addClass("active");

			//Activating ticket type pill
			$('ul.ticket-types').find('.active').removeClass('active');

			if(!Ticket_Filter_ID)
				$('ul.ticket-types').find('li a.' + Ticket_Status).parent().addClass('active');
			else
				$('ul.ticket-types').find('li > a[filter-id="' + Ticket_Filter_ID + '"]').parent().addClass('active');

			App_Ticket_Module.ticketsCollection.collection.fetch();

			$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
		});	
	},

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

				//Fectching ticket filters
				Ticket_Filters.fetch_filters_collection();

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

	changeGroup: function(event){

		var optionsTemplate = "<li><a class='change-ticket-group-li' data-id='{{id}}'>{{group_name}}</a></li>";

		fillSelect('ticket-groups-list','/core/api/tickets/groups', null,  function(){

	        	$('.ticket_group_name').hide();
	        	$('#change-ticket-group-ul').show();

	        	Tickets.initChangeGroupEvent();
	      
	    	}, optionsTemplate, true); 
	},

	initChangeGroupEvent: function(){

		$('ul#ticket-groups-list').on('click', '.change-ticket-group-li', function(e){
		
			$('#change-ticket-group-ul').hide();
			
			// Reads the owner id from the selected option
			var new_group_id = $(this).attr('data-id');
			var new_group_name = $(this).text();
			
			// Returns, if same owner is selected again 
			if(new_group_id == Group_ID)
			{
				$('.ticket_group_name').show();
				return;
			}
			
			var ticketModel = App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID);

			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/assign-ticket?id=" + Current_Ticket_ID + "&group_id=" + new_group_id;
			newTicketModel.save(ticketModel.toJSON(), 
				{success: function(model){

					$('.ticket_group_name').html(new_group_name);
					$('td#group-id').attr('data-id', new_group_id);
					$('.ticket_group_name').show();

					ticketModel.set(model, {silent: true});
				}}
			);
   		});
	},
	changeAssignee: function(event){

		var optionsTemplate = "<li><a class='change-ticket-assignee-li' data-id='{{id}}'>" +
							  "<span class='thumb-sm avatar'><img src='{{ownerPic}}' width='40px' height='40px'></span>" + 
								" {{name}}</a></li>";

		fillSelect('ticket-assignee-list','/core/api/tickets/groups/domain-users?group_id=' + $('td#group-id').attr('data-id'), null,  
			function(){

	        	$('.ticket_assignee_name').css('display', 'none');
	        	$('#change-ticket-assignee-ul').css('display', 'inline-block');
	      		
	      		Tickets.initChangeAssigneeEvent();

	    	}, optionsTemplate, true); 
	},

	initChangeAssigneeEvent: function(){

		$('ul#ticket-assignee-list').on('click', '.change-ticket-assignee-li', function(e){
		
			$('#change-ticket-assignee-ul').hide();
			
			var ticketModel = App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID);

			// Reads the owner id from the selected option
			var new_assignee_id = $(this).attr('data-id');
			var new_assignee_name = $(this).text();
			
			// Returns, if same owner is selected again 
			if(new_assignee_id == ticketModel.assigneeID)
			{
				$('.ticket_assignee_name').show();
				return;
			}
			
			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/assign-ticket?id=" + Current_Ticket_ID + "&assignee_id=" + new_assignee_id;
			newTicketModel.save(ticketModel.toJSON(), 
				{success: function(model){

					$('.ticket_assignee_name').html(new_assignee_name);
					$('.ticket_assignee_name').show();
					$('td#assignee-id').attr('data-id', new_assignee_id);

					ticketModel.set(model, {silent: true});
				}}
			);
   		});
	},

	changeTicketType: function(event){

		$('.ticket_type').css('display', 'none');
	    $('#change-ticket-type-ul').css('display', 'inline-block');
	    Tickets.initChangeTicketTypeEvent();
	},

	initChangeTicketTypeEvent: function(){

		$('ul#ticket-type-list').on('click', '.change-ticket-type-li', function(e){
		
			$('#change-ticket-type-ul').hide();
			
			var ticketModel = App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID);

			var new_ticket_type = $(this).attr('data-value');
			
			if(new_ticket_type == ticketModel.type)
			{
				$('.ticket_type').show();
				return;
			}
			
			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/change-ticket-type?id=" + Current_Ticket_ID + "&type=" + new_ticket_type;
			newTicketModel.save(ticketModel.toJSON(), 
				{success: function(model){

					$('.ticket_type').html(new_ticket_type);
					$('.ticket_type').show();

					ticketModel.set(model, {silent: true});
				}}
			);
   		});
	},

	changeTicketPriority: function(event){

		$('.ticket_priority').css('display', 'none');
	    $('#change-ticket-priority-ul').css('display', 'inline-block');

	    Tickets.initChangeTicketPriorityEvent();
	},

	initChangeTicketPriorityEvent: function(){

		$('ul#ticket-priority-list').on('click', '.change-ticket-priority-li', function(e){
		
			$('#change-ticket-priority-ul').hide();
			
			var ticketModel = App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID);

			var new_priority = $(this).attr('data-value');
			
			if(new_priority == ticketModel.priority)
			{
				$('.ticket_priority').show();
				return;
			}
			
			var newTicketModel = new BaseModel();
			newTicketModel.url = "/core/api/tickets/change-priority?id=" + Current_Ticket_ID + "&priority=" + new_priority;
			newTicketModel.save(ticketModel.toJSON(), 
				{success: function(model){

					$('.ticket_priority').html(new_priority);
					$('.ticket_priority').show();

					ticketModel.set(model, {silent: true});
				}}
			);
   		});
	},

	toEmails: function(){

		$('.to-emails').hide();

		$('.ticket-email').show(function(){
			$('#cc_emails').focus();
		});
	},

	hideDropDowns: function(ev){

		if(Current_Route.indexOf('ticket/') == -1)
			return;

		console.log(ev);

		if($(ev.target).closest('div.ticket-details-dropdown').length > 0 || $(ev.target).hasClass('ticket-details-value'))
			return;

		$('.ticket-details-dropdown').hide();
		$('.ticket-details-value').show();
	}
};