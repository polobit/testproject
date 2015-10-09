/**
 * Ticket Router with callbacks
 */
var TicketsUtilRouter = Backbone.Router.extend({
	routes : {

		/* Tickets */
		"tickets" : "tickets",
		"ticket/:id" : "ticketDetails",

		/*Tickets by group*/
		"tickets/group/:id" : "ticketsByGroup",
		"tickets/group/:id/:status" : "ticketsByGroup",

		/*Ticket Groups*/
		"ticket-groups" : "ticketGroups",
		"add-ticket-group" : "addTicketGroup",
		"ticket-group/:id" : "editTicketGroup"
	},

	/**
	 * Shows list of Tickets
	 */
	tickets : function() {
		Backbone.history.navigate('#tickets/group/'+ DEFAULT_GROUP_ID +'/new', {trigger: true});
	},

	ticketsByGroup: function(group_id, status){

		Ticket_Status = status;

		//Renders root template, fetches tickets count & loads Groups drop down
		Tickets_Util.initialize(group_id, function(){

			App_Ticket_Module.ticketsCollection = new Base_Collection_View({
				url : '/core/api/tickets?status=' + Ticket_Status + '&group_id=' + Group_ID,
				sortKey:"created_time",
				descending:true,
				templateKey : "ticket",
				individual_tag_name : 'div',
				cursor : true,
				page_size : 20,
				slateKey : "no-tickets",
				postRenderCallback: function(el){
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
			$('ul.ticket-types').find('li a.' + Ticket_Status).parent().addClass('active');

			App_Ticket_Module.ticketsCollection.collection.fetch();

			$(".tickets-collection-pane").html(App_Ticket_Module.ticketsCollection.el);
		});
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

		Current_Ticket_ID = id;

		var ticketView = new Base_Model_View({
			model : ticketModal, 
			isNew : true, 
			template : "ticket-details",
			url : "/core/api/ticket/" + id,
			postRenderCallback : function(el, data) {

				//Initializing click events on ticket details view
				initializeTicketNotesEvent(el);

				//Initialize tooltips
				$('[data-toggle="tooltip"]', el).tooltip();

				App_Ticket_Module.renderNotesCollection(id, $('#notes-collection-container', el), function(){});

				// App_Ticket_Module.loadHtmlEditor($('#summernote', el), function(){

				// });
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

		App_Ticket_Module.groupsCollection.collection.fetch();

		$("#content").html(App_Ticket_Module.groupsCollection.el);
	},

	/**
	 * Add ticket group
	 */
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

	/**
	 * Edit ticket group
	 */
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
			templateKey : "ticket-notes",
			sortKey:"created_time",
			descending:false,
			individual_tag_name : 'div',
			postRenderCallback : function(el) {

				if(callback)
					callback();
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
	},

	loadHtmlEditor : function($ele, callback){

		head.js(LIB_PATH+'lib/summer-note/summernote.js',
				CSS_PATH+'css/summernote/summernote.css', function()
		{	
			$ele.summernote({
			      toolbar : [
			        [
			          'style',
			          [ 'bold', 'italic', 'underline',
			            'clear' ] ],
			        [ 'fontsize', [ 'fontsize' ] ],
			        [ 'insert', [ 'link' ] ] ],
			        height:'130'
			});

			if(callback)
				callback();
		});
	}
});