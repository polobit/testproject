/**
 * Ticket Router with callbacks
 */
 var TicketsUtilRouter = Backbone.Router.extend({
 	routes : {

 		/* Tickets */
 		"tickets" : "tickets",
 		
 		/* Tickets  by filter*/
		"tickets/filter/:id" : "ticketsByFilter",
		"tickets/filter/:id/ticket/:id" : "ticketDetailsByFilter",

		/*Ticket details*/
		"ticket/:id" : "ticketDetails",

		/* Ticket bulk actions*/
		"tickets/bulk-actions/:action_type" : "ticketsBulkActions",

		/*Ticket Groups CRUD*/
		"ticket-groups" : "ticketGroups",
		"add-ticket-group" : "addTicketGroup",
		"ticket-group/:id" : "editTicketGroup",

		"ticket-labels" : "ticketLabels",
		"add-ticket-label" : "addTicketLabel",
		"ticket-label/:id" : "editTicketLabel",

		/*Ticket Filters CRUD*/
		"ticket-views" : "ticketFilters",
		"add-ticket-view" : "addTicketFilter",
		"ticket-view/:id" : "editTicketFilter",

		/*Ticket Canned Responses CRUD*/
		"canned-responses" : "cannedResponses",
		"add-canned-response" : "addCannedResponse",
		"edit-canned-response/:id" : "editCannedResponse",

		/*Ticket reports*/
		"ticket-reports" : "ticketReports",
		"ticket-report/:report_type" : "ticketReport",
		"ticket-feedback":"ticketFeedback",
	     
         /*Help center Routes*/
		"knowledgebase" : "categories",
        "knowledgebase/:id/sections":"sections",  
       	"knowledgebase/:name/articles":"articles",
		"knowledgebase/add-article" : "addArticle",
		"knowledgebase/add-article/:id" : "addArticle",
		"knowledgebase/section/:section_id/edit-article/:name" : "editArticle",	
		"knowledgebase/section/:section_id/article/:id" : "showArticle",
		"knowledgebase/add-section" : "addSection",
		"knowledgebase/add-section/:id" : "addSection",
		"knowledgebase/category/:categorie_id/section/:id/edit-section" : "editSection",	
		"knowledgebase/add-category":"addCategory",
		"knowledgebase/:id/edit-category":"editCategory",
		"selectlandingpage":"addLandingpage"


	},

	/**
	 * Default root path provided in main menu
	 */
	tickets: function(){
		
		loadServiceLibrary(function(){
			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);
		});
		make_menu_item_active("tickets");
	},

	ticketFeedback: function(){
		
		initReportLibs(function(){

			loadServiceLibrary(function(){
			

				if(!$('#ticket-feedback').length){	
									
					getTemplate("ticket-feedback-header", {}, undefined, function(template_ui){
			 		
			 		if(!template_ui)
			 			return;
			 		
			 		var el = $('#content').html($(template_ui));
			 		
			 		$("#feedback").off();
					$("#feedback").on('change',function(){
						App_Ticket_Module.renderfeedbackmodel(el);
					});

					$("#group_names").off();
					$("#group_names").on('change',function(){
						App_Ticket_Module.renderfeedbackmodel(el);
					});
			 		//initializing date range picket
					initDateRange(App_Ticket_Module.renderfeedbackmodel);
						
			fillSelect('group_names', '/core/api/tickets/groups', '', function(collection){
			 	 			getTemplate("ticket-feedback-group", collection.toJSON(), undefined, function(template_ui){						

								if(!template_ui)
									return;

				                $('#group_names', el).html($(template_ui));
				       
				  
									
								
			               	} );		
					
					},'', true);

						App_Ticket_Module.renderfeedbackmodel(el);
			 		});
						
				}				
			});		
		});
	make_menu_item_active("feedbackactivitiesmenu");
	},	 	

	renderfeedbacktemplate :function(start_time,end_time,feedback,group,assignee){
		
		//Rendering root template	
		App_Ticket_Module.feedbackollection = new Base_Collection_View({
			url : '/core/api/tickets/notes/feedback/?start_time=' + start_time + '&end_time=' 
			+ end_time + '&feedback=' + feedback+ '&group=' + group + '&assignee=' + assignee,
			templateKey : "ticket-feedback-log",
			isNew : true,
			individual_tag_name : 'tr',
			sort_collection : true, 
			sortKey : 'created_time',
			descending: true,
			postRenderCallback:function(el,model){		
				includeTimeAgo(el);
			
				/*Ticket related click event to show the modal when requester or assignee replies*/
				$(".ticket-feedback-notes").on('click', function(e) 
				{
					e.preventDefault();
				   	var id = $(this).data("id");
				    
				    var activity_ticket_feedback_notes = App_Ticket_Module.feedbackollection.collection.get(id).toJSON();;

					getTemplate("ticket-note-feedback-modal", activity_ticket_feedback_notes, undefined, function(template_ui){

						if(!template_ui)
							  return;

						var emailinfo = $(template_ui);

						emailinfo.modal('show');
					}, null);

				});
				$(".ticket-feedback-comment").on('click', function(e) 
				{
					
					e.preventDefault();
				   	var id = $(this).data("id");
				    
				    var activity_ticket_feedback_notes = App_Ticket_Module.feedbackollection.collection.get(id).toJSON();;

					getTemplate("ticket-feedback-comment-modal", activity_ticket_feedback_notes, undefined, function(template_ui){

						if(!template_ui)
							  return;

						var emailinfo = $(template_ui);

						emailinfo.modal('show');
					}, null);	

				});

		// $(el)
		// 	.on('mouseover mouseout', 'tbody#ticket-feedback-log-model-list> tr>td#ticket_note',
		// 		function(event) {

		// 			clearTimeout(popoverFunction);
					
					    
		// 			if (event.type == 'mouseover'){

		// 				var $that = $(this);
						
		// 				popoverFunction = setTimeout(function(){

		// 					var id = $that.data("id");
		// 					var ticketJSON = App_Ticket_Module.feedbackollection.collection.get(id).toJSON();

		// 					getTemplate("ticket-feedback-popup", ticketJSON, undefined, function(template_ui){

                               
                               
  //                           	  if(!template_ui)
		// 					  		return;

		// 						$('body').append($(template_ui));
								
								         
		// 						if(Current_Ticket_ID || Current_Route.indexOf('ticket') == -1)
		// 							return;

		// 						//Get closest div with row class to set left alignment. Table row left doesn't work as table have scrolling.
		// 						var $closest_div = $that.closest('div.row');
		// 						var top = 0, left = $closest_div.offset().left + 500 + 'px';

		// 						if (window.innerHeight - ($that.offset().top - $(window).scrollTop()) >= 250)
		// 							top = $that.offset().top + 35 + 'px';
		// 						else
		// 							top = $that.offset().top - $('#ticket-feedback-comment').height() + 'px';
                                
  //                               Ticket_Utils.loadTimeAgoPlugin(function(){
		// 			        	     var x = $("time","#ticket-feedback-comment").timeago();
		// 			        	 });
								 
                                
		// 						$('#ticket-feedback-comment').css('top', top).css('left', left).css('display', 'block');
		// 					});
		// 				},600);
						
		// 			}else{
		// 				$('div.ticket-feedback-comment').remove();
		// 			}

			//});	

			}


	
		});
		App_Ticket_Module.feedbackollection.collection.fetch();

		$('#ticket-feedback').html(App_Ticket_Module.feedbackollection.render().el);	
	},

	renderfeedbackmodel: function(el){
		
		var range = $('#range',el).html().split("-");
		var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
	    var d = new Date();
	    start_time=start_time+(d.getTimezoneOffset()*60*1000);
	    var end_value = $.trim(range[1]);
	    // To make end value as end time of day
	    if (end_value)
	        end_value = end_value + " 23:59:59";

	    var group = 0;
	    var assignee = 0;
	    	if($('#group_names').find('option:selected').val()){
	    		group = $('#group_names').find('option:selected').val();
	    	}

	    	if($('#group_names').find('option:selected').data('assignee-id')){
	    		assignee = $('#group_names').find('option:selected').data('assignee-id');

	    	}
	    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	    end_time += (((23*60*60)+(59*60)+59)*1000);
	    end_time=end_time+(d.getTimezoneOffset()*60*1000);
		var feedback =null;
	    feedback = $('#feedback').find('option:selected').val();
		
		App_Ticket_Module.renderfeedbacktemplate(start_time,end_time,feedback,group,assignee);
	},


	/**
	 * Shows new ticket form
	 */
	renderNewTicketModalView: function(){

		loadServiceLibrary(function(){
			var newTicket = new Base_Model_View({
				isNew : true,
				template : "ticket-new-modal",
				url : "/core/api/tickets/new-ticket",
				saveCallback: function(){
					$('#ticketsModal').modal('hide');
				},
				prePersist : function(model){
					
					var json = {};

					//Fetching selected assignee ID
					var assignee_id = $('#groupID option:selected').data('assignee-id');

					if(assignee_id)
						json.assigneeID = assignee_id;

					var last_name = $('#last_name').val();

					if(last_name)
						json.requester_name = $('#first_name').val() + ' ' + last_name;

					var email = $('#email_input').val();

					if(email)
						json.requester_email = email;

					model.set(json, { silent : true });
				},
				postRenderCallback : function(el) {

					//Initializing click event on add new contact link
					el.on('click', '.add-ticket-contact', function(e){

						//Toggle views between search contact and add contact
						$('div.new-contact-row').toggle();
						$('div.search-contact-row').toggle();

						$('#email_input').val($('#requester_email').val());
					});
				}
			});
			
			//Appending template to ticket modals container
			$('#ticketsModal').html(newTicket.render().el).modal('show').on('shown.bs.modal', function(){

				Tickets.initNewTicketTypeahead($('#ticketsModal'));
			});

			$('#ticketsModal').on('hidden.bs.modal', function (e) {
			    $(e.currentTarget).unbind();    
			});
		});
	},

	/**
	 * Shows list of tickets for the given filter id
	 **/
	 ticketsByFilter : function(filter_id){

	 	loadServiceLibrary(function(){
		 	//Fetching whole tickets count to show suggestion if there are no tickets
		 	$.getJSON("/core/api/tickets/count", function(json) {
				
				if(json.count)
					Helpdesk_Enabled = true;
			});

		 	//Verifying there exits any ticket collection
		 	if(App_Ticket_Module.ticketsCollection && 
		 		App_Ticket_Module.ticketsCollection.collection.length > 0 
		 		&& Ticket_Filter_ID == filter_id){

		 		Tickets.renderExistingCollection();
		 		return;
		 	}

		 	Ticket_Filter_ID = filter_id;

			//Rendering the root layout
			Tickets.renderLayout(function(){

				//Initialize custom filters and render layout with filter conditions selected
				Ticket_Custom_Filters.renderLayout();

				//Fetching filters collection
				Ticket_Filters.fetchFiltersCollection(function(){

					//Reseting custom filters
					Ticket_Custom_Filters.reset();
					
					//Showing selected filter name on top
					Ticket_Filters.updateFilterName();

					//Fetching selected filter ticket collection
					Tickets.fetchTicketsCollection();
				});
			});
		});
	},

	/**
	 * Shows individual ticket details and notes collection
	 **/
	ticketDetailsByFilter : function(filter_id, ticket_id){

		loadServiceLibrary(function(){
			Ticket_Filter_ID = filter_id;

			App_Ticket_Module.ticketDetails(ticket_id);
		});
	},

	/**
	 * Shows individual ticket details and notes collection
	 **/
	 ticketDetails: function(id){

	 	loadServiceLibrary(function(){
		 	var ticketModel = null;

		 	//Fetching ticket model from collection
		 	if (App_Ticket_Module.ticketsCollection && App_Ticket_Module.ticketsCollection.collection){
		 	   ticketModel = App_Ticket_Module.ticketsCollection.collection.get(id);
		 	}
		 
		 	Current_Ticket_ID = id;

		 	//Fetching canned responses collection
		 	Ticket_Canned_Response.fetchCollection(function(){

		 		// Get ticket models
			 	if(!ticketModel){

			 		// Fetch ticket details
			 		Tickets.fetchTicketModel( id, function(model){
			 			App_Ticket_Module.getTicketModelView(model);
			 		});

			 		return;
			 	}

			 	//Rendering ticket details page
			 	App_Ticket_Module.getTicketModelView(ticketModel);

			 	return;
		 	});
		});
	},

	/**
	 * Renders ticket details page for given ticket model
	 **/
	getTicketModelView: function(model){

		loadServiceLibrary(function(){
			if(!model || !model.toJSON().id)
				return;

			var id = model.toJSON().id;

			App_Ticket_Module.ticketView = new Ticket_Base_Model({
		 		model : model, 
		 		isNew : true,
		 		template : "ticket-details",
		 		url : "/core/api/tickets/" + id,
		 		postRenderCallback : function(el, data) {

		 			//Get ticket contact
		 			Ticket_Utils.fetchContact(data.contactID, function(){

		 				//Rendering ticket notes
						App_Ticket_Module.renderNotesCollection(id, 
							$('#notes-collection-container', el), function(){});

		 				//Render template with contact details
		 				if(Ticket_Utils.Current_Ticket_Contact &&
		 					!$.isEmptyObject(Ticket_Utils.Current_Ticket_Contact.toJSON())){

		 					var json = Ticket_Utils.Current_Ticket_Contact.toJSON();

		 					json.status = data.status;

		 					$('#ticket-contact-details', el).html(

		 						getTemplate('ticket-contact', json));
		 				}else{
		 					
		 					$('#ticket-contact-details', el).html(
		 						getTemplate('ticket-contact-fallback', data));
		 				}
		 				Tickets.ticketsloadWidgets(el, Ticket_Utils.Current_Ticket_Contact.toJSON());
		 				//loadWidgets(el, Ticket_Utils.Current_Ticket_Contact.toJSON(), "widgets");
		 			});


		 			// Append reply container
		 			Tickets_Notes.repltBtn("reply", el);

		 			//Initialize tooltips
					Ticket_Utils.enableTooltips(el);

					//Showing ticket labels as selected labels
					Ticket_Labels.showSelectedLabels(data.labels, $(el), true);

					
					//Initializing Assignee dropdown with groups and assignees
					Tickets.fillAssigneeAndGroup(el);

					//Initializing date picker on due date fields
					Tickets.initializeTicketSLA(el);
					Tickets.initializeTicketSLAinHours(el);

					// Fill next, Prev navigation
					Tickets.ticket_detail_view_navigation(id, el)

					//Initializing type ahead for cc emails
					agile_type_ahead("cc_email_field", el, Tickets_Typeahead.contact_typeahead, function(arg1, arg2){

						arg2 = arg2.split(" ").join("");

						var email = TYPEHEAD_EMAILS[arg2 + '-' + arg1];

						if(!email || email == 'No email')
							return;

						//$('ul.cc-emails').prepend(getTemplate('cc-email-li', {email: email}));
	        			$('#cc_email_field').val('');

	        	  		Tickets.updateCCEmails(email, 'add');
	        	  	},undefined, undefined, 'core/api/search/');

					// Initialize events on cc input
					Tickets.initCCEmailsListeners();

					// Get previous ticket 
					Tickets.showPreviousTicketCount(data.requester_email, el);	
					
				}
			});

			//$(".tickets-collection-pane").html('');
			$('#content').html(App_Ticket_Module.ticketView.render().el);
		});
	},

	/**
	 * Bulk actions route
	 */
	ticketsBulkActions: function(action_type){
		loadServiceLibrary(function(){
			Ticket_Bulk_Ops.renderTemplate(action_type);
		});
	},

	/**
	 * Shows list of Groups
	 */
	 ticketGroups : function() {

	 	loadServiceLibrary(function(){
			
			if( !(Tickets.checkAdminPrivilege()) )	return;

		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsHelpdeskTemplate({groups: true}, function(callback){

		 		//Initializing base collection with groups URL
	 			App_Ticket_Module.groupsCollection = new Base_Collection_View({
	 				url : '/core/api/tickets/groups',
	 				templateKey : "ticket-groups",
	 				sort_collection : true,
	 				descending : true,
	 				sortKey : 'updated_time',
	 				individual_tag_name : 'tr',
	 				postRenderCallback : function(el, collection) {

	 					//Disabling click events on copy btn
						$('#ticket-groups-model-list', el).on('click', 'a.a-frwd-email', function(e){

							console.log('e');
							e.stopPropagation();
							e.stopImmediatePropagation();
						});

						//Loading and initializing copy to clipboard buttons
						loadZeroclipboard2(function()
						{
							var array = collection.toJSON();
							for(var i=0; i< array.length; i++){

								var model = array[i];
								initZeroClipboard2($('#grp-' + model.id), $('#source-' + model.id));
							}
						});
					}
				});

	 			//Fetching groups collections
				App_Ticket_Module.groupsCollection.collection.fetch();

				//Rendering template
				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.groupsCollection.el);
		 		
		 		if(callback)
		 			callback();
		 	});
		});
		make_menu_item_active("ticketgroupsmenu");
	},

	/**
	 * Add ticket group
	 */
	 addTicketGroup: function(){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;
			
		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

		 		var addTicketGroupView = new Base_Model_View({
	 				isNew : true,
	 				template : "add-edit-ticket-group",
	 				url : "/core/api/tickets/groups",
	 				saveCallback : function(){
	 					Backbone.history.navigate( "ticket-groups", { trigger : true });
	 				},
	 				postRenderCallback : function(el) {

	 					//Fetches domain users collection and shows them in add group form
	 					App_Ticket_Module.renderUsersCollection($('#users-collection', el));

	 					var optionTemplate = "<option value='{{id}}'>{{name}}</option>";

	 					//Fetching all email templates
						fillSelect('template_id', '/core/api/email/templates', '', 
							function(collection){}, optionTemplate, false, el);
	 				}
	 			});

	 			$('#admin-prefs-tabs-content').html(addTicketGroupView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
	 },

	/**
	 * Edit ticket group
	 */
	 editTicketGroup: function(id){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
			App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

				//Redirecting to groups collection if collection not exists
		 		if(!App_Ticket_Module.groupsCollection || !App_Ticket_Module.groupsCollection.collection){

	 				Backbone.history.navigate( "ticket-groups", { trigger : true });
	 				return;
	 			}

	 			//Fetching selected group model form collection to render edit form
	 			var group = App_Ticket_Module.groupsCollection.collection.get(id);

	 			//Create base model view with existing group
	 			var editTicketGroupView = new Base_Model_View({
	 				model : group, 
	 				isNew : true, 
	 				template : "add-edit-ticket-group",
	 				saveCallback : function(){
	 					Backbone.history.navigate( "ticket-groups", { trigger : true });
	 				},
	 				url : "/core/api/tickets/groups",
	 				postRenderCallback : function(el, data) {

	 					//Fetching all domains users
	 					App_Ticket_Module.renderUsersCollection($('#users-collection', el), function(){

	 						var agents_keys = data.agents_keys;

	 						//Selecting domain users who are exists in current group
	 						for(var i=0; i < agents_keys.length; i++)
	 							$("input[data='"+ agents_keys[i] +"']").attr('checked', 'checked');

	 						var optionTemplate = "<option value='{{id}}'>{{name}}</option>";

		 					//Fetching all email templates and selecting chosen template
							fillSelect('template_id', '/core/api/email/templates', '', 
								function(){

									if(data.template_id)
										$('#template_id option[value=' + data.template_id + ']', el).attr('selected','selected');
								
								}, optionTemplate, false, el);

	 						//Initializing copy to clipboard button
	 						loadZeroclipboard2(function()
	 						{	
	 							initZeroClipboard2($('#grp-' + data.id), $('#source-' + data.id));
	 						});
	 					});
	 				}
	 			});

	 			$('#admin-prefs-tabs-content').html(editTicketGroupView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
	},

	/**
	 *Shows labels collection
	 */
	 ticketLabels: function(){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsHelpdeskTemplate({labels: true}, function(callback){

		 		//Creating base collection for fetching labels collection
	 			Ticket_Labels.labelsCollection = new Base_Collection_View({ 
	 				url : 'core/api/tickets/labels', 
	 				templateKey : "ticket-label", 
	 				individual_tag_name : 'tr',
	 				sort_collection : true,
	 				descending : true,
	 				sortKey : 'updated_time'
	 			});

				//Fetching labels collection
				Ticket_Labels.labelsCollection.collection.fetch();

				$('.ticket-settings', $('#admin-prefs-tabs-content')).html(Ticket_Labels.labelsCollection.el);

		 		if(callback)
		 			callback();
		 	});
		});

		make_menu_item_active("ticketlabelsmenu");
	 },

	/**
	 * Add ticket group
	 */
	 addTicketLabel: function(){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
			App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

				var addTicketLabelView = new Base_Model_View({
	 				isNew : false,
	 				template : "ticket-label-add-edit",
	 				url : "/core/api/tickets/labels",
	 				window : "ticket-labels",
	                errorCallback :function(response)
	                {
	                	$('.error_message_label').css('display','block');
	                	// Hides the error message after 5 seconds
	                	
	                	//setTimeout($('.error_message_label').text(response.responseText),5000);
	                    $('.error_message_label').text(response.responseText).delay(5000).hide(1);
	        	        
	                }
	 			});

	 			$('#admin-prefs-tabs-content').html(addTicketLabelView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
	},

	/**
	 * Edit ticket group
	 */
	 editTicketLabel: function(id){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
			App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

				if(!Ticket_Labels.labelsCollection || !Ticket_Labels.labelsCollection.collection){

	 				Backbone.history.navigate( "ticket-labels", { trigger : true });
	 				return;
	 			}

	 			var label = Ticket_Labels.labelsCollection.collection.get(id);

	 			var editTicketGroupView = new Base_Model_View({
	 				model : label, 
	 				isNew : true, 
	 				template : "ticket-label-add-edit",
	 				url : "/core/api/tickets/labels",
	 				window : "ticket-labels"
	 			});

	 			$('#admin-prefs-tabs-content').html(editTicketGroupView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
	},

	/**
	 * Shows list of Groups
	 */
	 ticketFilters : function() {

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsHelpdeskTemplate({filters: true}, function(callback){

		 		App_Ticket_Module.ticketFiltersCollection = new Base_Collection_View({
	 				url : '/core/api/tickets/filters',
	 				templateKey : "ticket-filters",
	 				individual_tag_name : 'tr',
	 				sort_collection : true, 
	 				sortKey : 'updated_time',
	 				descending : true,
	 				slateKey : "no-ticket-filters"
	 			});

	 			App_Ticket_Module.ticketFiltersCollection.collection.fetch();

	 			$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.ticketFiltersCollection.el);

		 		if(callback)
		 			callback();
		 	});
		});

		make_menu_item_active("ticketviewsmenu");
	 },

	/**
	 * Add ticket filter
	 */
	 addTicketFilter: function(){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
			App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

				var addTicketFilterView = new Ticket_Base_Model({
	 				isNew : true,
	 				template : "ticket-filter-add-edit",
	 				url : "/core/api/tickets/filters",
	 				window : "ticket-views",
	 				postRenderCallback : function(el) {

	 					head.js('lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
	 					{
	 						Ticket_Filters.initChaining(el);
	 					});
	 				}
	 			});

	 			$('#admin-prefs-tabs-content').html(addTicketFilterView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
	},

	/**
	 * Edit ticket group
	 */
	 editTicketFilter: function(id){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
			App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

				if(!App_Ticket_Module.ticketFiltersCollection || !App_Ticket_Module.ticketFiltersCollection.collection){

	 				Backbone.history.navigate( "ticket-views", { trigger : true });
	 				return;
	 			}

	 			var filter = App_Ticket_Module.ticketFiltersCollection.collection.get(id);

	 			var editTicketFilterView = new Ticket_Base_Model({
	 				model : filter, 
	 				isNew : true,
	 				url : "/core/api/tickets/filters",
	 				template : "ticket-filter-add-edit",
	 				window : "ticket-views",
	 				postRenderCallback : function(el, data) {

	 					head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
	 					{
	 						Ticket_Filters.initChaining(el, data);
	 					});

	 				}
	 			});

	 			$('#admin-prefs-tabs-content').html(editTicketFilterView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
	},

	/**
	 * Shows list of Canned Responses
	 */
	 cannedResponses : function() {

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsHelpdeskTemplate({canned_responses: true}, function(callback){

		 		Ticket_Labels.fetchCollection(function(){

					App_Ticket_Module.cannedResponseCollection = new Base_Collection_View({
						url : '/core/api/tickets/canned-messages',
						templateKey : "ticket-canned-response",
						individual_tag_name : 'tr',
						sort_collection : true, 
	 					sortKey : 'updated_time',
	 					descending : true,
						slateKey : "no-groups"
					});

					App_Ticket_Module.cannedResponseCollection.collection.fetch();

					$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.cannedResponseCollection.el);
					
					if(callback)
						callback();
				});
		 	});
		});
		make_menu_item_active("ticketcannedmessagesmenu");
	},

	/**
	 * Adds canned response
	 */
	 addCannedResponse: function(){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
			App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

				var addCannedResponseView = new Base_Model_View({
	 				isNew : true,
	 				template : "ticket-canned-response-add-edit",
	 				url : '/core/api/tickets/canned-messages',
	 				window : 'canned-responses',
	 				postRenderCallback: function(el){

	 					Ticket_Labels.showSelectedLabels([], $(el));

	 					initTicketCannedResponseEvents(el);
	 				}
	 			});

	 			$('#admin-prefs-tabs-content').html(addCannedResponseView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
	},

	/**
	 * Edit canned response
	 */
	 editCannedResponse: function(id){

	 	loadServiceLibrary(function(){
			if( !(Tickets.checkAdminPrivilege()) )	return;

			//Rendering root template
			App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

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
	 				window : "canned-responses",
	 				postRenderCallback: function(el) {
	 					
	 					Ticket_Labels.showSelectedLabels(cannedResponse.toJSON().labels, $(el));
	 					initTicketCannedResponseEvents(el);
	 				}
	 			});

	 			$('#admin-prefs-tabs-content').html(editCannedResponseView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
	},

	/**
	 * Ticket reports router
	 */
	ticketReports: function(){

		loadServiceLibrary(function(){
			
			getTemplate("ticket-report-container", {}, undefined, function(template_ui){

		 		if(!template_ui)
		 			return;

		 		$('#content').html($(template_ui));

		 		hideTransitionBar();

		 		$('#ticket-reports-tab-container a[href="#overview"]').tab('show');
		 	});
	
		});
	},

	/**
	 * Generates highchart reports for given report type
	 */
	ticketReport: function(report_type){

		loadServiceLibrary(function(){
			report_utility.loadReportsTemplate(function(){
			hideTransitionBar();

			$(".active").removeClass("active");
			$("#reportsmenu").addClass("active");

			//Loading highchart files and daterange picker files
			initReportLibs(function(){

				//CallbCK function executes when daterange picker is changed
				var template = '', callback;

				switch(report_type){
					case 'tickets':
						template = 'tickets-report';
						callback = Ticket_Reports.tickets;
						break;
					case 'priority-report':
						template = 'ticket-priority-report';
						callback = Ticket_Reports.priorityReports;
						break;
					case 'sla-report':
						template = 'ticket-sla-report';
						callback = Ticket_Reports.slaReport;
						break;
					case 'avg-first-resp-time':
						template = 'ticket-avg-first-resp-time';
						callback = Ticket_Reports.avgFirstRespTime;
						break;
					case 'feedback':
						template = 'ticket-feedback-report';
						callback = Ticket_Reports.feedbackReports;
						break;
				}

				//Renders the required template based on report type
				getTemplate(template, {}, undefined, function(template_ui){

					if(!template_ui)
						return;

					var $template_ui = $(template_ui);

					$('.reports-Container').html($template_ui);	

					//initializing date range picket
					initDateRange(callback);

					callback();

				}, ".reports-Container");
			});
				});
		});
	},

	/**
	 * Renders ticket activities collection
	 */
	renderActivitiesCollection : function(ticket_id, $ele, callback){

	 	App_Ticket_Module.activitiesCollection = new Base_Collection_View({
	 		url : '/core/api/tickets/activity?id=' + ticket_id,
	 		templateKey : "ticket-activities",
	 		sort_collection : true,
	 		sortKey:"time",
	 		customLoader: true,
	 		customLoaderTemplate: "ticket-notes-loader",
	 		descending:true,
	 		individual_tag_name : 'div',
	 		postRenderCallback : function(el) {

	 			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$("time", el).timeago();
				});

	 			if(callback)
	 				callback();
	 		}
	 	});

	 	App_Ticket_Module.activitiesCollection.collection.fetch();

	 	$ele.html(App_Ticket_Module.activitiesCollection.el);
	 },

	/**
	 * Fetches all notes related to given ticket id and renders html to provided element.
	 **/
	 renderNotesCollection : function(ticket_id, $ele, callback){

	 	App_Ticket_Module.notesCollection = new Base_Collection_View({
	 		url : '/core/api/tickets/notes/' + ticket_id,
	 		templateKey : "ticket-notes",
	 		sortKey:"created_time",
	 		customLoader: true,
	 		customLoaderTemplate: "ticket-notes-loader",
	 		descending:true,
	 		individual_tag_name : 'div',
	 		postRenderCallback : function(el) {

	 			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$("time", el).timeago();
				});

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

		collection.fetch(
			{ success : function(){

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

	loadAdminsettingsTemplate: function(callback){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				return;
			
			$('#content').html($(template_ui));	
			
			var tab_highlight_callback = function(){
 				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');
 			};

 			if(callback)
 				callback(tab_highlight_callback);
		});
	},

	categories: function(){
		
		loadServiceLibrary(function(){
		 	//Rendering root template
			App_Ticket_Module.loadAdminsettingsHelpdeskTemplate({knowledgebase: true},function(callback){
				//Initializing base collection with groups URL
			App_Ticket_Module.categoriesCollection = new Base_Collection_View({
				url : '/core/api/knowledgebase/categorie',
				templateKey : "ticket-helpcenter-categories",
				individual_tag_name : 'tr',
				sortKey:"updated_time",
				sort_collection:"true",
				postRenderCallback : function(el, collection) {

					head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
						$(el).find('tbody').each(function(index){
							$(this).sortable({
							      items:'tr',
							      helper: function(e, tr){
							          var $originals = tr.children();
							          var $helper = tr.clone();
							          $helper.children().each(function(index)
							          {
							            // Set helper cell sizes to match the original sizes
							            $(this).width($originals.eq(index).width());
							            console.log('-----------'+$originals.eq(index).width());
							          });
							          return $helper;
							      },
							      start: function(event, ui){
							    	  $.each(ui.item.children(),function(index,ele){
							    		  ui.helper.children().eq(index).width(ui.helper.children().eq(index).width()-$(this).width());
							    	  });
							    	  ui.helper.width(ui.helper.width());
							      },
							      sort: function(event, ui){
							    	  ui.helper.css("top",(ui.helper.offset().top+ui.item.offset().top)+"px");
							      },
							      forceHelperSize:true,
							      placeholder:'<tr><td></td></tr>',
							      forcePlaceholderSize:true,
							      handle: ".icon-move",
							      cursor: "move",
							      tolerance: "intersect",
							      
						    });
						
							$('#ticket-helpcenter-categories-model-list',$('#ticket-categorie-table')).on("sortstop",function(event, ui){
								
								var sourceIds = [];
								$('#ticket-helpcenter-categories-model-list > tr').each(function(column){
									sourceIds[column] = $(this).data().id;
								});
								// Saves new positions in server
									$.ajax({ type : 'POST', url : '/core/api/knowledgebase/categorie/position', data : JSON.stringify(sourceIds),
										contentType : "application/json; charset=utf-8", dataType : 'json', success : function(data){
											$.each(sourceIds, function(index, val){
												$('#dealSourcesForm_'+val).find('input[name="order"]').val(index);
									
											});
									}});	
								});
							});	
							

						});	
								
				}
			});	
			
			//Fetching groups collections
			if(!App_Ticket_Module.categoriesCollection.collection.fetch())
			setTimeout(function(){
            App_Ticket_Module.categoriesCollection.collection.fetch();

            },2000);

			//Rendering template
			$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.categoriesCollection.el);

		 	make_menu_item_active("ticketknowledgebasemenu");
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.helpdesk-tab').addClass('select');
	
	 	});
		});
	},


	sections: function(categorie_id){
		loadServiceLibrary(function(){
		 	//Rendering root template
			App_Ticket_Module.loadAdminsettingsHelpdeskTemplate({knowledgebase: true},function(callback){
				//Initializing base collection with groups URL
			App_Ticket_Module.sectionsCollection = new Base_Collection_View({
				
				url : '/core/api/knowledgebase/section/' + categorie_id,		
				templateKey : "ticket-helpcenter-sections",
				individual_tag_name : 'tr',
				sort_collection : true, 
	 			sortKey : 'order',
				postRenderCallback : function(el, collection) {

                  //Helcenter_Events.sectionDelete(el);

                  head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
						$(el).find('tbody').each(function(index){
							$(this).sortable({
							      items:'tr',
							      helper: function(e, tr){
							          var $originals = tr.children();
							          var $helper = tr.clone();
							          $helper.children().each(function(index)
							          {
							            // Set helper cell sizes to match the original sizes
							            $(this).width($originals.eq(index).width());
							            console.log('-----------'+$originals.eq(index).width());
							          });
							          return $helper;
							      },
							      start: function(event, ui){
							    	  $.each(ui.item.children(),function(index,ele){
							    		  ui.helper.children().eq(index).width(ui.helper.children().eq(index).width()-$(this).width());
							    	  });
							    	  ui.helper.width(ui.helper.width());
							      },
							      sort: function(event, ui){
							    	  ui.helper.css("top",(ui.helper.offset().top+ui.item.offset().top)+"px");
							      },
							      forceHelperSize:true,
							      placeholder:'<tr><td></td></tr>',
							      forcePlaceholderSize:true,
							      handle: ".icon-move",
							      cursor: "move",
							      tolerance: "intersect",
							      
						    });
						
							$('#ticket-helpcenter-sections-model-list',$('#ticket-section-table')).on("sortstop",function(event, ui){
								
								var sourceIds = [];
								$('#ticket-helpcenter-sections-model-list > tr').each(function(column){
									sourceIds[column] = $(this).data().id;
								});
								// Saves new positions in server
									$.ajax({ type : 'POST', url : '/core/api/knowledgebase/section/position', data : JSON.stringify(sourceIds),
										contentType : "application/json; charset=utf-8", dataType : 'json', success : function(data){
											$.each(sourceIds, function(index, val){
												$('#dealSourcesForm_'+val).find('input[name="order"]').val(index);
									
											});
									}});	
								});
							});	
							

						});
				}
			});

			//Fetching groups collections
			App_Ticket_Module.sectionsCollection.collection.fetch();

			//Rendering template
			$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.sectionsCollection.el);

		 	});
		});
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');
	},
    
    articles: function(name){

		loadServiceLibrary(function(){
		 	//Rendering root template
			App_Ticket_Module.loadAdminsettingsHelpdeskTemplate({knowledgebase: true},function(callback){
				//Initializing base collection with groups URL
			App_Ticket_Module.articlesCollection = new Base_Collection_View({

				url : '/core/api/knowledgebase/article/admin-articles?section_id=' + name, 		
				templateKey : "ticket-helpcenter-articles",
				individual_tag_name : 'tr',
				sort_collection : true, 
	 			sortKey : 'order',
				postRenderCallback : function(el, collection) {

                  //Helcenter_Events.articleDelete(el);
				
                  head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
						$(el).find('tbody').each(function(index){
							$(this).sortable({
							      items:'tr',
							      helper: function(e, tr){
							          var $originals = tr.children();
							          var $helper = tr.clone();
							          $helper.children().each(function(index)
							          {
							            // Set helper cell sizes to match the original sizes
							            $(this).width($originals.eq(index).width());
							            console.log('-----------'+$originals.eq(index).width());
							          });
							          return $helper;
							      },
							      start: function(event, ui){
							    	  $.each(ui.item.children(),function(index,ele){
							    		  ui.helper.children().eq(index).width(ui.helper.children().eq(index).width()-$(this).width());
							    	  });
							    	  ui.helper.width(ui.helper.width());
							      },
							      sort: function(event, ui){
							    	  ui.helper.css("top",(ui.helper.offset().top+ui.item.offset().top)+"px");
							      },
							      forceHelperSize:true,
							      placeholder:'<tr><td></td></tr>',
							      forcePlaceholderSize:true,
							      handle: ".icon-move",
							      cursor: "move",
							      tolerance: "intersect",
							      
						    });
						
							$('#ticket-helpcenter-articles-model-list',$('#ticket-article-table')).on("sortstop",function(event, ui){
								
								var sourceIds = [];
								$('#ticket-helpcenter-articles-model-list > tr').each(function(column){
									sourceIds[column] = $(this).data().id;
								});
								// Saves new positions in server
									$.ajax({ type : 'POST', url : '/core/api/knowledgebase/article/position', data : JSON.stringify(sourceIds),
										contentType : "application/json; charset=utf-8", dataType : 'json', success : function(data){
											$.each(sourceIds, function(index, val){
												$('#dealSourcesForm_'+val).find('input[name="order"]').val(index);
									
											});
									}});	
								});
							});	
							

						});	


				}
			});

			//Fetching article collections
			App_Ticket_Module.articlesCollection.collection.fetch();

			//Rendering template
			$('.ticket-settings', $('#admin-prefs-tabs-content')).html(App_Ticket_Module.articlesCollection.el);

		 	});
		});
	
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');
	},

	addArticle : function(section_id){

		loadServiceLibrary(function(){
		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

		 		var addArticleView = new Base_Model_View({
	 				isNew : true, 
	 				url : '/core/api/knowledgebase/article',
	 				template : "ticket-helpcenter-add-article",
	 				window : "back",
			        
					prePersist : function(model){
						
						var title = model.toJSON().title;
						 title = $.trim(title);
						var json = {};
						var catogery_id = $("#catogery option:selected").data('catogery-id');
						var encodedtitle = encodeURIComponent(title);
						json = {"categorie_id" : catogery_id,"title" : title,"encodedtitle":encodedtitle};

						var plain_content = '';

						try{
							plain_content = $(tinyMCE.activeEditor.getBody()).text();

							json.plain_content = plain_content;
						}
						catch(err){}
						
						model.set(json, { silent : true });
				    },

			        postRenderCallback : function(el){
					
						setupTinyMCEEditor('textarea#description-article', true, undefined, function(){
							$("textarea#description-article").css("display", "none");
						});
  
						 section_id = decodeURIComponent(section_id);
						fillSelect('catogery', '/core/api/knowledgebase/categorie/kb-admin', '', function(collection){
			 	 			getTemplate("helpcenter-section-category", collection.toJSON(), undefined, function(template_ui){						

								if(!template_ui)
									return;

				                $('#catogery', el).html($(template_ui));
				       
				                if(section_id){
									 $('#catogery option[value="'+section_id+'"]',el).attr('selected','selected');
								}	
								if(callback)
					 				callback();
			               	} );		
					
					},'', true);

			        },
			        
			    });

	 			$('#admin-prefs-tabs-content').html(addArticleView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
		
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');
	},

	editArticle : function(section_id,name){

		loadServiceLibrary(function(){
		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){

		 		var editarticleView = new Base_Model_View({
 				isNew : false, 
 				url : "/core/api/knowledgebase/article/" +name,
 				template : "ticket-helpcenter-add-article",
 				window : "back",
                prePersist : function(model){
                	var title = model.toJSON().title;
					title = $.trim(title);
					var encodedtitle = encodeURIComponent(title);

					var json = {};
					var catogery_id = $("#catogery option:selected").data('catogery-id');
					json = {"categorie_id" : catogery_id, "title":title ,"encodedtitle":encodedtitle};
					model.set(json, { silent : true });
			    },

		        postRenderCallback : function(el){
				setupTinyMCEEditor('textarea#description-article', true, undefined, function(){
					$("textarea#description-article").css("display", "none");
				});

				fillSelect('catogery', '/core/api/knowledgebase/categorie/kb-admin', '', function(collection){

		 	 		$('#catogery', el).html(getTemplate('helpcenter-section-category', collection.toJSON()));
   					$('#catogery option[value="'+section_id+'"]',el).attr("selected",true);                    
				
				},'', true);

		        }
		    });    
	 			$('#admin-prefs-tabs-content').html(editarticleView.render().el);

		 		if(callback)
		 			callback();
		 	});
		});
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');

	},

	showArticle : function(section_id,article_id){

		loadServiceLibrary(function(){
		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){
  
				var articleView = new Base_Model_View({
					
					isNew : false,
					template : "ticket-helpcenter-article",
					url : "/core/api/knowledgebase/article/" + article_id,
			        postRenderCallback: function(el, data){

			     
					}
				});

				$('#admin-prefs-tabs-content').html(articleView.render().el);

							
			});	
		});	
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');
	},

	addSection : function(category_id){

		loadServiceLibrary(function(){
		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){
  
				var addsectionView = new Base_Model_View({

	 				isNew : true, 
	 				url : '/core/api/knowledgebase/section',
	 				template : "ticket-helpcenter-add-section",
			        window:'back',
			        prePersist : function(model){
			        	var json = {};
			        	var name = model.toJSON().name;
			        	 name = $.trim(name);
			        	 json = {'name':name};
			        	 model.set(json, { silent : true });
			        },
			        postRenderCallback : function(el){
			        	 var optionsTemplate = "<option value={{id}}>{{name}}</option>";
							 fillSelect('catogery', '/core/api/knowledgebase/categorie', '',function(){
	                                           
	                                       if(!category_id)
	                                       	  return;

	                                       $('select option[value="'+category_id+'"]').attr("selected",true);
	                                        
							 },optionsTemplate, true);

			        }
				});

				$('#admin-prefs-tabs-content').html(addsectionView.render().el);			
			});	
		});	
		
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');
	},


    editSection : function(category_id,section_id){

    	var name = $("#"+section_id).data("id");
		loadServiceLibrary(function(){
		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){
  
				var editSectionView = new Base_Model_View({
					isNew : false,
					template : "ticket-helpcenter-add-section",
					url : "/core/api/knowledgebase/section/kb-admin?id=" + section_id,
					window:'back',
				    postRenderCallback : function(el){
				        var optionsTemplate = "<option value={{id}}>{{name}}</option>";
	 						fillSelect('catogery', '/core/api/knowledgebase/categorie', '', function(){
	                                       $('select option[value="'+category_id+'"]').attr("selected",true);    
				                     		},optionsTemplate, true);
	 				},
	 				prePersist : function(model){
			        	var json = {};
			        	var name = model.toJSON().name;
			        	 name = $.trim(name);
			        	 json = {'name':name};
			        	 model.set(json, { silent : true });
			        }
			    });

				$('#admin-prefs-tabs-content').html(editSectionView.render().el);			
			});	
		});	
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');
	}, 

	addLandingpage : function(){
		

			loadServiceLibrary(function(){	
			 	//Rendering root template
			 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){
	  
					var addLandingpageView = new Base_Model_View({
						isNew : false,
						template : "ticket-helpcenter-select-landingpage",
						url : "/core/api/knowledgebase/KBlandingpage",
					    postRenderCallback : function(el,json){
					       
					        var kblpid = json.kb_landing_page_id;
					        var kb_id = json.id;
					        var optionTemplate = "<option value='{{id}}'>{{name}}</option>";
								
					        	var pageSize = getMaximumPageSize();
								fillSelect('template_id', '/core/api/landingpages?page_size='+pageSize, '', 
								function(){
									$("#template_id",el).append('<option value=1>Default</option>');
									$('#template_id option[value=""]',el).attr("value",0);
									$('#template_id option[value="'+kblpid+'"]',el).attr("selected",true);
																							
								}, optionTemplate, false, el,"Basic");
										
							
		 				}
					   
				    });

					$('#admin-prefs-tabs-content').html(addLandingpageView.render().el);			
				});	
			});
				make_menu_item_active("ticketknowledgebasemenu");
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.helpdesk-tab').addClass('select');	
		}, 


	addCategory : function(){

		loadServiceLibrary(function(){
		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){
  
				var addCatogeryView = new Base_Model_View({
							isNew : true, 
						 	url : '/core/api/knowledgebase/categorie',
							template : "helpcenter-add-catogery",
							window : "back",
				    });

				$('#admin-prefs-tabs-content').html(addCatogeryView.render().el);    
			});
		});
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');
	},


	editCategory : function(category_id){

		if(!App_Ticket_Module.categoriesCollection || !App_Ticket_Module.categoriesCollection.collection){
	 		return;
	} 			

		loadServiceLibrary(function(){
		 	//Rendering root template
		 	App_Ticket_Module.loadAdminsettingsTemplate(function(callback){
  
			var categorieModel = App_Ticket_Module.categoriesCollection.collection.get(category_id);

        	console.log(categorieModel);
		
		    var editCatogeryView = new Base_Model_View({
 				model : categorieModel,
 				isNew : true, 
 				url : '/core/api/knowledgebase/categorie',
 				template : "helpcenter-add-catogery",
 				window : "back",
		    });

				$('#admin-prefs-tabs-content').html(editCatogeryView.render().el);    
			});
		});
		make_menu_item_active("ticketknowledgebasemenu");
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.helpdesk-tab').addClass('select');
	},

	loadAdminsettingsHelpdeskTemplate: function(json, callback){

		getTemplate("admin-settings", {}, undefined, function(template_ui){

	 		if(!template_ui)
	 			return;

	 		$('#content').html($(template_ui));	

	 		getTemplate("ticket-settings-nav-tab", json, undefined, function(tab_template_ui){

	 			if(!tab_template_ui)
	 				return;

	 			$('#admin-prefs-tabs-content').html($(tab_template_ui));

	 			var tab_highlight_callback = function(){
	 				$('#content').find('#AdminPrefsTab .select').removeClass('select');
 					$('#content').find('.helpdesk-tab').addClass('select');
	 			};

	 			if(callback)
	 				callback(tab_highlight_callback);

	 		}, '#admin-prefs-tabs-content');
	 	}, '#content');
	}
});