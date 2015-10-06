/**
 * Ticket Router with callbacks
 */
var TicketsUtilRouter = Backbone.Router.extend({
	routes : {

		/* Tickets */
		"tickets" : "tickets",
		"ticket/:id" : "ticketDetails",

		/*Ticket Groups*/
		"ticket-groups" : "ticketGroups",
		"add-ticket-group" : "addTicketGroup",
		"ticket-group/:id" : "editTicketGroup"
	},

	/**
	 * Shows list of Tickets
	 */
	tickets : function() {

		$("#content").html(getTemplate('tickets-container'));

		App_Ticket_Module.ticketsCollection = new Base_Collection_View({
			url : '/core/api/tickets?status=NEW',
			// restKey : "workflow",
			//sort_collection : false,
			templateKey : "ticket",
			individual_tag_name : 'tr',
			cursor : true,
			page_size : 20,
			slateKey : "no-tickets"
		});

		$(".active").removeClass("active");
		$("#tickets").addClass("active");

		App_Ticket_Module.ticketsCollection.collection.fetch();

		$("#right-pane").html(App_Ticket_Module.ticketsCollection.el);
	},

	/**
	 * Shows individual ticket details and notes collection
	**/
	ticketDetails: function(id){

		if(!App_Ticket_Module.ticketsCollection || !App_Ticket_Module.ticketsCollection.collection){

			Backbone.history.navigate( "tickets", { trigger : true });
			return;
		}

		var ticketModal = App_Ticket_Module.ticketsCollection.collection.get(id);

		if(!ticketModal || ticketModal == null || ticketModal == undefined)
		{
			Backbone.history.navigate( "tickets", { trigger : true });
			return;
		}	

		var ticketView = new Base_Model_View({
			model : ticketModal, 
			isNew : true, 
			template : "ticket-details",
			url : "/core/api/ticket/" + id,
			postRenderCallback : function(el, data) {

				App_Ticket_Module.renderNotesCollection(id, $('#notes_collection'), function(){});
			}
		});

		$("#right-pane").html(ticketView.render().el);
	},

	/**
	 * Shows list of Groups
	 */
	ticketGroups : function() {

		App_Ticket_Module.groupsCollection = new Base_Collection_View({
			url : '/core/api/tickets/groups',
			// restKey : "workflow",
			//sort_collection : false,
			templateKey : "ticket-groups",
			individual_tag_name : 'tr',
			slateKey : "no-groups",
			postRenderCallback : function(el) {

			}
		});

		$(".active").removeClass("active");
		$("#ticket-groups").addClass("active");

		App_Ticket_Module.groupsCollection.collection.fetch();

		$("#content").html(App_Ticket_Module.groupsCollection.el);
	},

	addTicketGroup: function(){

		var addTicketGroupView = new Base_Model_View({
			isNew : true,
			template : "add-edit-ticket-group",
			saveCallback : function(){
				Backbone.history.navigate( "ticket-groups", { trigger : true });
			},
			url : "/core/api/tickets/groups",
			postRenderCallback : function(el) {

				App_Ticket_Module.renderUsersCollection($('#users-collection', el));
			}
		});

		$('#content').html(addTicketGroupView.render().el);
	},

	editTicketGroup: function(id){

		if(!App_Ticket_Module.groupsCollection || !App_Ticket_Module.groupsCollection.collection){

			Backbone.history.navigate( "ticket-groups", { trigger : true });
			return;
		}

		var group = App_Ticket_Module.groupsCollection.collection.get(id);

		var editTicketGroupView = new Base_Model_View({
			model : group, 
			isNew : true, 
			template : "add-edit-ticket-group",
			saveCallback : function(){
				Backbone.history.navigate( "ticket-groups", { trigger : true });
			},
			url : "/core/api/tickets/groups",
			postRenderCallback : function(el, data) {

				App_Ticket_Module.renderUsersCollection($('#users-collection', el), function(){

					var agents_keys = data.agents_keys;

					for(var i=0; i < agents_keys.length; i++){
						$("input[data='"+ agents_keys[i] +"']").attr('checked', 'checked');
					}
				});

			}
		});

		$('#content').html(editTicketGroupView.render().el);
	},

	/**
	 * Fetches all notes related to given ticket id and renders html to provided element.
	**/
	renderNotesCollection : function(ticket_id, $ele, callback){

		App_Ticket_Module.notesCollection = new Base_Collection_View({
			url : '/core/api/tickets/notes?ticket_id=' + ticket_id,
			// restKey : "workflow",
			//sort_collection : false,
			templateKey : "ticket-notes",
			individual_tag_name : 'tr',
			postRenderCallback : function(el) {

			}
		});

		App_Ticket_Module.notesCollection.collection.fetch();

		$ele.html(App_Ticket_Module.notesCollection.el);
	},

	/**
	 * Fetches all domain users and renders html to the provided element.
	**/
	renderUsersCollection : function($ele, callback){

		//Fetching users collection
		var collection_def = Backbone.Collection.extend({url : '/core/api/users'});
		var collection = new collection_def();

		collection.fetch({ success : function(){

		   		var data = collection.toJSON();
				data.sort(function(a, b)
				{
					if (a.name < b.name)
						return -1;
					if (b.name < a.name)
						return 1;
					return 0;
				});

				var html = '';
				for(var i=0; i < data.length; i++){
					html+= getTemplate('ticket-add-group-user', data[i]);
				}

				$ele.html(html);

				if(callback)
					callback();
			}
		});
	}
});