/**
 * Ticket Router with callbacks
 */
var TicketsUtilRouter = Backbone.Router.extend({
	routes : {

		/* Tickets */
		"tickets" : "tickets",
		"new-ticket" : "newTicket",
		/*"ticket/:id" : "ticketDetails",*/

		/*Tickets by group*/
		/*"tickets/group/:id" : "ticketsByGroup",
		"tickets/group/:id/:status" : "ticketsByGroup",
		"tickets/group/:id/:status/:id" : "ticketNotes",*/

		/* Tickets  by filter*/
		"tickets/filter/:id" : "ticketsByFilter",
		"tickets/filter/:id/ticket/:id" : "filteredTicketNotes",

		/* Ticket bulk actions*/
		"tickets/bulk-actions/:action_type" : "ticketsBulkActions",

		/*Ticket Groups CRUD*/
		"ticket-groups" : "ticketGroups",
		"add-ticket-group" : "addTicketGroup",
		"ticket-group/:id" : "editTicketGroup",

		"ticket-labels" : "ticketLabels",

		/*Ticket Filters CRUD*/
		"ticket-filters" : "ticketFilters",
		"add-ticket-filter" : "addTicketFilter",
		"ticket-filter/:id" : "editTicketFilter",

		/*Ticket Canned Responses CRUD*/
		"canned-responses" : "cannedResponses",
		"add-canned-response" : "addCannedResponse",
		"edit-canned-response/:id" : "editCannedResponse"
	},

	tickets: function(){
		/*App_Ticket_Module.ticketsByGroup(DEFAULT_GROUP_ID, 'new');*/
		App_Ticket_Module.ticketsByFilter();
	},

	/**
	 * Shows new ticket form
	 */
	newTicket : function(){

		if($('#tickets-container').length == 0)
		{
			Tickets.initialize(DEFAULT_GROUP_ID, function(){
				App_Ticket_Module.renderNewTicketModalView();
			});
		}else{
			App_Ticket_Module.renderNewTicketModalView();
		}
	},

	renderNewTicketModalView: function(){

		//Rendering root template
		getTemplate("ticket-new-modal", {}, undefined, function(template_ui){

			if(!template_ui)
		  		return;

			$('#ticket-modals').html($(template_ui));
			$('#new-ticket-modal').modal('show');

			var ticketView = new Ticket_Base_Model({
				isNew : false, 
				template : "ticket-new-modal-form",
				url : "/core/api/tickets/new-ticket",
				saveCallback : function(ticket){

					$('#new-ticket-modal').modal('hide');
					
					/*var url = 'tickets/group/'+ ticket.groupID +'/'+ ticket.status.toLowerCase() +'/' + ticket.id;

					Backbone.history.navigate( url, { trigger : true });*/
				},
				postRenderCallback : function(el, data) {

					$('[data-toggle="tooltip"]').tooltip();

					//Initializing chaining on Group and Assignee select fields
					head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
					{
						var LHS = $("#group_id", el);
						var RHS = $("#assignee_id", el);

						RHS.chained(LHS);
					});

					//Initializing type ahead for tags
					Ticket_Tags.initTagsTypeahead('.ticket-tags-typeahead');
					
					//Initializing click on CC email field
					Tickets.initCCEmailsListeners(el);

					//Initializing type ahead for selecting contact in To address field
					agile_type_ahead("requester_email_typeahead", el, tickets_typeahead, function(arg1, arg2){

							arg2 = arg2.split(" ").join("");

							var email = TYPEHEAD_EMAILS[arg2 + '-' + arg1];

							if(!email || email == 'No email')
								return;

							$('#requester_name').val(arg2);
							$('#contact_id').val(arg1);
							$('#requester_email').val(email).show();
							$('#requester_email_typeahead').hide();

						},undefined, undefined, 'core/api/search/');
				}
			});

			$('#modal-body').html(ticketView.render().el);
		});	
	},

	/**
	 * Renders new ticket form and initializes required events
	 */ 
	renderNewTicketView: function(){

		var ticketView = new Ticket_Base_Model({
			isNew : false, 
			template : "ticket-new",
			url : "/core/api/tickets/new-ticket",
			saveCallback : function(ticket){

				// var url = 'tickets/group/'+ ticket.groupID +'/'+ ticket.status.toLowerCase() +'/' + ticket.id;

				// Backbone.history.navigate( url, { trigger : true });
			},
			postRenderCallback : function(el, data) {

				$('[data-toggle="tooltip"]').tooltip();

				//Activating ticket type pill
				$('ul.ticket-types').find('.active').removeClass('active');

				//Initializing chaining on Group and Assignee select fields
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					var LHS = $("#group_id", el);
					var RHS = $("#assignee_id", el);

					RHS.chained(LHS);
				});

				//Initializing type ahead for tags
				Ticket_Tags.initTagsTypeahead('.ticket-tags-typeahead');
				
				//Initializing click on CC email field
				Tickets.initCCEmailsListeners(el);

				//Initializing type ahead for selecting contact in To address field
				agile_type_ahead("requester_email_typeahead", el, tickets_typeahead, function(arg1, arg2){

						arg2 = arg2.split(" ").join("");

						var email = TYPEHEAD_EMAILS[arg2 + '-' + arg1];

						if(!email || email == 'No email')
							return;

						$('#requester_name').val(arg2);
						$('#contact_id').val(arg1);
						$('#requester_email').val(email).show();
						$('#requester_email_typeahead').hide();

					},undefined, undefined, 'core/api/search/');
			}
		});
		
		$(".tickets-collection-pane").html('');
		$("#right-pane").html(ticketView.render().el);
	},

	/**
	 * Shows list of tickets for the selected Group
	 */
	ticketsByGroup: function(group_id, status){

		Ticket_Status = status;
		Ticket_Filter_ID = null;
		var url = '/core/api/tickets?status=' + Ticket_Status + '&group_id=' + group_id;

		if(!Group_ID || Group_ID != group_id){

			Group_ID = group_id;
			Reload_Tickets_Count = true;
		}	

		Tickets.fetch_tickets_collection(url, group_id);
	},

	/**
	 * Shows ticket details and notes for select ticket
	 */
	ticketNotes: function(group_id, status, id){

		Ticket_Status = status;
		Ticket_Filter_ID = null;

		var ticketModal = null;

		if(App_Ticket_Module.ticketsCollection && App_Ticket_Module.ticketsCollection.collection)
			ticketModal = App_Ticket_Module.ticketsCollection.collection.get(id);

		//Verifying ticket exists in collection or not
		if(!ticketModal)
		{
			Group_ID = group_id;
			Reload_Tickets_Count = true;
			
			//If collection doesn't exists the re-render the whole layout and then fetch ticket notes
			Tickets.initialize(group_id, function(){
				App_Ticket_Module.ticketDetails(id);
			});
		}else{
			
			//If model exists renders the view directly
			App_Ticket_Module.ticketDetails(id);
		}
	},

	/**
	 * Shows list of tickets for the given filter id
	**/
	ticketsByFilter : function(filter_id){

		Ticket_Filter_ID = filter_id;

		//Rendering the whole layout
		Tickets.renderLayout(function(){

			//Fetching filters collection
			Ticket_Filters.fetchFiltersCollection(function(){

				//Fetching selected filter ticket collection
				Tickets.fetchTicketsCollection();
			});		
		});
	},

	/**
	 * Shows individual filtered ticket details and notes collection
	**/
	filteredTicketNotes: function(filter_id, id){

		Ticket_Filter_ID = filter_id;

		var ticketModal = null;

		if(App_Ticket_Module.ticketsCollection && App_Ticket_Module.ticketsCollection.collection)
			ticketModal = App_Ticket_Module.ticketsCollection.collection.get(id);

		//Verifying ticket exists in collection or not
		if(!ticketModal)
		{	
			//Rendering the whole layout
			Tickets.renderLayout(function(){

				App_Ticket_Module.ticketDetails(id);		
			});
		}else{
			
			//If model exists renders the view directly
			App_Ticket_Module.ticketDetails(id);
		}
	},

	/**
	 * Shows individual ticket details and notes collection
	**/
	ticketDetails: function(id){

		var ticketModal = null;

		if(App_Ticket_Module.ticketsCollection && App_Ticket_Module.ticketsCollection.collection){

			ticketModal = App_Ticket_Module.ticketsCollection.collection.get(id);
		}	

		Current_Ticket_ID = id;

		App_Ticket_Module.ticketView = new Ticket_Base_Model({
			model : ticketModal, 
			isNew : (ticketModal) ? true : false, 
			template : "ticket-details",
			url : "/core/api/tickets/" + id,
			postRenderCallback : function(el, data) {
				
				//Initialize tooltips
				$('[data-toggle="tooltip"]', el).tooltip();

				//Initializing type ahead for tags
				Ticket_Tags.initTagsTypeahead('.ticket-tags-typeahead');

				//Initializing events on CC email field
				Tickets.initCCEmailsListeners(el);

				//Rendering ticket notes
				App_Ticket_Module.renderNotesCollection(id, $('#notes-collection-container', el), function(){});

				//Load widgets
				Tickets.loadWidgets(App_Ticket_Module.ticketView.el);
			}
		});

		//$(".tickets-collection-pane").html('');
		$('#content').html(App_Ticket_Module.ticketView.render().el);
	},

	ticketsBulkActions: function(action_type){
		Ticket_Bulk_Ops.renderTemplate(action_type);
	},

	/**
	 * Shows list of Groups
	 */
	ticketGroups : function() {

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {groups: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
					return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

				App_Ticket_Module.groupsCollection = new Base_Collection_View({
				url : '/core/api/tickets/groups',
				templateKey : "ticket-groups",
				individual_tag_name : 'tr',
				postRenderCallback : function(el, collection) {

						//Disabling click events on copy btn
						$('#ticket-groups-model-list', el).on('click', 'a.a-frwd-email', function(e){

							console.log('e');
							e.stopPropagation();
							e.stopImmediatePropagation();
						});

						head.js('/lib/zeroclipboard2/ZeroClipboard.min.js', function()
						{
							$('[data-toggle="popover"]').popover();

							var array = collection.toJSON();
							for(var i=0; i< array.length; i++){

								var model = array[i];
								initZeroClipboard2($('#grp-' + model.id), $('#source-' + model.id));
							}
						});	

						setTimeout(function(){

							var $ele  = $('td[default_group]').closest('tr').find('.tbody_check');
							
							//Disabling default group checkbox to avoid deleting
							$ele.attr('disabled', true).removeClass('tbody_check');
							$ele.closest('label').addClass('cursor-default');
							
						}, 1000);
					}
				});

				App_Ticket_Module.groupsCollection.collection.fetch();

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.groupsCollection.el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 * Add ticket group
	 */
	addTicketGroup: function(){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {groups: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	
				var addTicketGroupView = new Base_Model_View({
					isNew : true,
					template : "add-edit-ticket-group",
					url : "/core/api/tickets/groups",
					saveCallback : function(){
						Backbone.history.navigate( "ticket-groups", { trigger : true });
					},
					postRenderCallback : function(el) {
						App_Ticket_Module.renderUsersCollection($('#users-collection', el));
					}
				});

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(addTicketGroupView.render().el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 * Edit ticket group
	 */
	editTicketGroup: function(id){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {groups: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

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

							head.js('/lib/zeroclipboard2/ZeroClipboard.min.js', function()
							{	
								initZeroClipboard2($('#grp-' + data.id), $('#source-' + data.id));
							});
						});
					}
				});

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(editTicketGroupView.render().el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 *Shows labels collection
	 */
	ticketLabels: function(){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {labels: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

				var labelsCollectionView = new Base_Collection_View({ 
					url : 'core/api/tickets/labels', 
					templateKey : "ticket-label", 
					individual_tag_name : 'li',
					sort_collection : true, 
					sortKey : 'tag', 
					postRenderCallback : function(el)
					{
						Ticket_Labels.initEvents(el);
					} 
				});
				
				labelsCollectionView.appendItem = Ticket_Labels.appendLabelManagement;
				labelsCollectionView.collection.fetch();

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(labelsCollectionView.el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});	
	},

	/**
	 * Shows list of Groups
	 */
	ticketFilters : function() {

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {filters: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

				App_Ticket_Module.ticketFiltersCollection = new Base_Collection_View({
					url : '/core/api/tickets/filters',
					templateKey : "ticket-filters",
					individual_tag_name : 'tr',
					slateKey : "no-ticket-filters",
					postRenderCallback : function(el) {

					}
				});

				App_Ticket_Module.ticketFiltersCollection.collection.fetch();

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.ticketFiltersCollection.el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 * Add ticket filter
	 */
	addTicketFilter: function(){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {filters: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

				var addTicketFilterView = new Ticket_Base_Model({
					isNew : true,
					template : "ticket-filter-add-edit",
					url : "/core/api/tickets/filters",
					saveCallback : function(){
						Backbone.history.navigate( "ticket-filters", { trigger : true });
					},
					postRenderCallback : function(el) {

						head.js('lib/agile.jquery.chained.min.js', function()
						{
							Ticket_Filters.initChaining(el);
						});
					}
				});

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(addTicketFilterView.render().el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 * Edit ticket group
	 */
	editTicketFilter: function(id){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {filters: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

				if(!App_Ticket_Module.ticketFiltersCollection || !App_Ticket_Module.ticketFiltersCollection.collection){

					Backbone.history.navigate( "ticket-filters", { trigger : true });
					return;
				}

				var filter = App_Ticket_Module.ticketFiltersCollection.collection.get(id);

				var editTicketFilterView = new Ticket_Base_Model({
					model : filter, 
					isNew : true,
					url : "/core/api/tickets/filters",
					template : "ticket-filter-add-edit",
					saveCallback : function(){
						Backbone.history.navigate( "ticket-filters", { trigger : true });
					},
					postRenderCallback : function(el, data) {

						head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
						{
							Ticket_Filters.initChaining(el, data);
						});

					}
				});

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(editTicketFilterView.render().el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 * Shows list of Canned Responses
	 */
	cannedResponses : function() {

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {canned_responses: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

				App_Ticket_Module.cannedResponseCollection = new Base_Collection_View({
					url : '/core/api/tickets/canned-messages',
					templateKey : "ticket-canned-response",
					individual_tag_name : 'tr',
					slateKey : "no-groups",
					postRenderCallback : function(el) {

					}
				});

				App_Ticket_Module.cannedResponseCollection.collection.fetch();

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.cannedResponseCollection.el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 * Adds canned response
	 */
	addCannedResponse: function(){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {canned_responses: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

				var addCannedResponseView = new Base_Model_View({
					isNew : true,
					template : "ticket-canned-response-add-edit",
					url : '/core/api/tickets/canned-messages',
					saveCallback : function(){
						Backbone.history.navigate( "ticket-canned-responses", { trigger : true });
					}
				});

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(addCannedResponseView.render().el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 * Edit canned response
	 */
	editCannedResponse: function(id){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			getTemplate("ticket-settings-nav-tab", {canned_responses: true}, undefined, function(tab_template_ui){

				if(!tab_template_ui)
				  return;

				$('#admin-prefs-tabs-content').html($(tab_template_ui));	

				if(!App_Ticket_Module.cannedResponseCollection || !App_Ticket_Module.cannedResponseCollection.collection){

					Backbone.history.navigate( "canned-responses", { trigger : true });
					return;
				}

				var cannedResponse = App_Ticket_Module.cannedResponseCollection.collection.get(id);

				var editCannedResponseView = new Base_Model_View({
					model : cannedResponse, 
					isNew : true, 
					url : '/core/api/tickets/canned-messages',
					template : "ticket-canned-response-add-edit",
					saveCallback : function(){
						Backbone.history.navigate( "ticket-canned-responses", { trigger : true });
					}
				});

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(editCannedResponseView.render().el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
			});
		});
	},

	/**
	 * Fetches all notes related to given ticket id and renders html to provided element.
	**/
	renderNotesCollection : function(ticket_id, $ele, callback){

		App_Ticket_Module.notesCollection = new Base_Collection_View({
			url : '/core/api/tickets/notes?ticket_id=' + ticket_id,
			templateKey : "ticket-notes",
			sortKey:"created_time",
			customLoader: true,
			customLoaderTemplate: "ticket-notes-loader",
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
	}
});