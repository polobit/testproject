var notesView;
var dealsView; 
var eventsView;
var tasksView;
var casesView;
var documentsView;

var contact_details_tab = {
		load_timeline : function()
		{
			$('div.tab-content', App_Contacts.contactDetailView.el).find('div.active').removeClass('active');
			
			$('#time-line', App_Contacts.contactDetailView.el).addClass('active');
			if($("#timeline", App_Contacts.contactDetailView.el).hasClass('isotope'))
			{
				$("#timeline", App_Contacts.contactDetailView.el).isotope( 'reLayout', function(){} )
				return;
			}
				load_timeline_details(App_Contacts.contactDetailView.el, App_Contacts.contactDetailView.model.get('id'));
		},
		load_notes : function()
		{
		    var id = App_Contacts.contactDetailView.model.id;
		    notesView = new Base_Collection_View({
	            url: '/core/api/contacts/' + id + "/notes",
	            restKey: "note",
	            templateKey: "notes",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".note-created-time", el).timeago();
	              	})
	            }
	        });
	        notesView.collection.fetch();
	        $('#notes', App_Contacts.contactDetailView.el).html(notesView.el);
		},
		load_events : function()
		{
			var id = App_Contacts.contactDetailView.model.id;
			eventsView = new Base_Collection_View({
	            url: '/core/api/contacts/' + id + "/events",
	            restKey: "event",
	            templateKey: "contact-events",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".event-created-time", el).timeago();
	              	})
	            }
	        });
			eventsView.collection.fetch();
	        $('#events', App_Contacts.contactDetailView.el).html(eventsView.el);
		},
		load_documents : function()
		{
			 id = App_Contacts.contactDetailView.model.id;
			 documentsView = new Base_Collection_View({
		            url: '/core/api/documents/' + id + "/docs",
		            restKey: "document",
		            templateKey: "contact-documents",
		            individual_tag_name: 'li',
		            sortKey:"uploaded_time",
		            descending: true,
		            postRenderCallback: function(el) {
		            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		            		 $(".document-created-time", el).timeago();
		              	})
		            }
		        });
			    documentsView.collection.fetch();
		        $('#documents', App_Contacts.contactDetailView.el).html(documentsView.el);
		},
		load_tasks : function()
		{
			   id = App_Contacts.contactDetailView.model.id;
				tasksView = new Base_Collection_View({
		            url: '/core/api/contacts/' + id + "/tasks",
		            restKey: "task",
		            templateKey: "contact-tasks",
		            individual_tag_name: 'li',
		            sortKey:"created_time",
		            descending: true,
		            postRenderCallback: function(el) {
		            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		            		 $(".task-created-time", el).timeago();
		              	})
		            }
		        });
				tasksView.collection.fetch();
		        $('#tasks', App_Contacts.contactDetailView.el).html(tasksView.el);
		},
		load_deals : function ()
		{
			id = App_Contacts.contactDetailView.model.id;
			dealsView = new Base_Collection_View({
				url: 'core/api/contacts/'+ id + "/deals" ,
	            restKey: "opportunity",
	            templateKey: "deals",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".deal-created-time", el).timeago();
	            	})
	            }
	        });
	        dealsView.collection.fetch();
	        $('#deals', App_Contacts.contactDetailView.el).html(dealsView.el);
		},
		load_cases : function()
		{
			id = App_Contacts.contactDetailView.model.id;
			casesView = new Base_Collection_View({
				url: 'core/api/contacts/'+ id + "/cases" ,
	            restKey: "cases",
	            templateKey: "cases-contact",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".deal-created-time", el).timeago();
	            	})
	            }
	        });
			casesView.collection.fetch();
	        $('#cases', App_Contacts.contactDetailView.el).html(casesView.el);
		},
		load_mail : function()
		{
			var contact = App_Contacts.contactDetailView.model;
			var json = contact.toJSON();
			 
			// Get email of the contact in contact detail
			var email = getPropertyValue(json.properties, "email");
			
			// Shows an error alert, when there is no email to the contact 
			if(!email){
				$('#mail', App_Contacts.contactDetailView.model.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the mails.</div>').show();
				return;	
			}	
			
			// Fetches mails collection
			var mailsView = new Base_Collection_View({
				url: 'core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0',
	            templateKey: "email-social",
	            restKey: "emails",
	            sortKey:"date_secs",
	            descending: true,
	            individual_tag_name: 'li',
	            postRenderCallback: function(el) {
	        	
	          	head.js(LIB_PATH + 'lib/jquery.timeago.js', function() { 
	    			$(".email-sent-time", el).each(function(index, element) {
	    				
	    				//console.log("before :" + $(element).html())
	    				//console.log("converted manually" + jQuery.timeago($(element).html()));
	    				$(element).timeago();
	    				//console.log($(element).html())
	    			});
				});
	          	
	          	 var imap;
	          	 queueGetRequest('email_prefs_queue','/core/api/imap','json', 
	          			 function(data){
	          		     imap = data;
	          	 });

	          	 queueGetRequest('email_prefs_queue','/core/api/social-prefs/GMAIL', 'json',
	          			 function(gmail){
	          		 if(!imap && !gmail)
	              		 $('#email-prefs-verification',el).css('display','block');
	             });
	            }
			});
	        mailsView.collection.fetch();
	        $('#mail', App_Contacts.contactDetailView.el).html(mailsView.el);
		},
		load_stats : function()
		{
			var contact = App_Contacts.contactDetailView.model;
			var json = contact.toJSON();
			 
			// Get email of the contact in contact detail
			var email = getPropertyValue(json.properties, "email");
			
			// Shows an error alert, when there is no email to the contact 
			if(!email){
				$('#stats', App_Contacts.contactDetailView.model.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the stats.</div>').show();
				return;	
			}
			
			// To avoid unnecessary JSAPI count, first verify in cookie
			if(!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && get_web_stats_count_for_domain() == '0'))
			{
				$('#stats', App_Contacts.contactDetailView.model.el).html('<h4><p>You have not yet setup the Javascript API on your website.</p><p>Please <a href="#analytics-code">set it up</a> to see the contact\'s site visits here.</p></h4>');
				return;
			}
				
			// Add tag if data is not 0
	        addTagAgile(CODE_SETUP_TAG);

				var statsView = new Base_Collection_View({
				url: 'core/api/web-stats?e=' + encodeURIComponent(email),
				data: statsCollection.toJSON(),
				templateKey: "stats",
	            individual_tag_name: 'li',
	            postRenderCallback: function(el)
	            {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function() { 
	        			$(".stats-created-time", el).each(function(index, element) {
	        				$(element).timeago();
	        			});
	    			});
	            }
	        });
			
	        statsView.collection.fetch();
	        
	        // Organises collection based on created_time in decreasing order
	        statsView.collection.comparator = function(model)
	        {
	        	if (model.get('created_time'))
		            return -model.get('created_time');
		                                      
	        }
	        
	        $('#stats', App_Contacts.contactDetailView.el).html(statsView.el);
		},
		load_campaigns : function()
		{
			var campaignsView = new Base_Collection_View({
				url: '/core/api/campaigns/logs/contact/' + App_Contacts.contactDetailView.model.id,
	            restKey: "logs",
	            templateKey: "campaigns",
	            individual_tag_name: 'li',
	            sortKey:'time',
				descending:true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	              		 $("time.log-created-time", el).timeago();
	              	});
	              // var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	             // fillSelect('campaignSelect','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
	            }
	        });
			campaignsView.collection.fetch();	
	        $('#campaigns', App_Contacts.contactDetailView.el).html(campaignsView.el);
		}
};