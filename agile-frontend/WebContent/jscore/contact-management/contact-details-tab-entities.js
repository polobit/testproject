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
	            cursor : true, page_size : 20,
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
		            url: '/core/api/documents/contact/' + id + "/docs",
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
		load_mail : function(mail_server_url,email_server)
		{				
			$('#mails', App_Contacts.contactDetailView.el).html("");
			var contact = App_Contacts.contactDetailView.model;
			var json = contact.toJSON();
			
			// Get email of the contact in contact detail
			var email = getAllPropertyValuesByName(json.properties, "email", ",");
			
			// Shows an error alert, when there is no email to the contact
			if (!email)
			{
				$('#mail', App_Contacts.contactDetailView.el)
						.html(
								'<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the mails.</div>');
				return;
			}
			var contact_details_tab_scope = this;
			var has_email_configured = true;
			var has_shared_email_configured = true;
			
			if(email_server && mail_server_url)
			{
				if($('#has_email_configured', App_Contacts.contactDetailView.el).html() === 'true')
					has_email_configured = true;
				else
					has_email_configured = false;
				fetch_mails(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email);
			}
			else
			{
				var model = "";
				var email_dropdown_html = "";
				var from_email = "";
				var mailAccountsView = new Base_Model_View({ url : 'core/api/emails/synced-accounts', template : "email-account-types",change:false,
					postRenderCallback : function(el)
					{	
						model = mailAccountsView.model.toJSON();
						if(model.hasEmailAccountsConfigured)
							has_email_configured = true;
						else
							has_email_configured = false;
						if(model.hasSharedEmailAccounts)
							has_shared_email_configured = true;
						else
							has_shared_email_configured = false;
						//Reading cookie info, fetches mail server type and email from cookie 
						var cookie_info = fetch_mailserverurl_from_cookie(model);
						if(cookie_info && cookie_info.length == 4)
						{
							mail_server_url = cookie_info[0];
							email_dropdown_html = cookie_info[1];
							email_server = cookie_info[2];
							from_email = cookie_info[3];
							if(from_email)
								email_server_type = from_email;
						}
						//By default loads mails from Agile server
						if(!email_server || !mail_server_url || !from_email || (!has_email_configured && !has_shared_email_configured))
						{
							email_server = "agile";
							email_dropdown_html = '<i class="icon-cloud" style="margin-right:4px;font-size: 1.2em"></i>'+'Agile';
							email_server_type = "agilecrm";
						}					
						fetch_mails(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email);
						if(has_email_configured || has_shared_email_configured)
						{
							if(email_dropdown_html)
								$('#email-type-select',App_Contacts.contactDetailView.el).html(email_dropdown_html);	 
							$('#mail-account-types', App_Contacts.contactDetailView.el).css('display','block');
						} 						
					}
				});
				$('#mail-account-types', App_Contacts.contactDetailView.el).html(mailAccountsView.render().el);	    
			}		
		},
		load_stats : function()
		{
			var contact = App_Contacts.contactDetailView.model;
			var json = contact.toJSON();
			 
			// Get email of the contact in contact detail
			var email = getPropertyValue(json.properties, "email");
			
			// Shows an error alert, when there is no email to the contact 
			if(!email){
				$('#stats', App_Contacts.contactDetailView.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the stats.</div>');
				return;	
			}
			
			// To avoid unnecessary JSAPI count, first verify in cookie
			if(!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && get_web_stats_count_for_domain() == '0'))
			{
				$('#stats', App_Contacts.contactDetailView.el).html('<h4><p>You have not yet setup the Javascript API on your website.</p><p>Please <a href="#analytics-code">set it up</a> to see the contact\'s site visits here.</p></h4>');
				return;
			}
				
			
			// Add tag if data is not 0
	        addTagAgile(CODE_SETUP_TAG);

				var statsView = new Base_Collection_View({
				url: 'core/api/web-stats?e=' + encodeURIComponent(email),
			//	data: statsCollection.toJSON(),
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
	        console.log($('#stats', App_Contacts.contactDetailView.el));
	        $('#stats', App_Contacts.contactDetailView.el).html(statsView.render().el);
		},
		load_campaigns : function()
		{
			var campaignsView = new Base_Collection_View({
				url: '/core/api/campaigns/logs/contact/' + App_Contacts.contactDetailView.model.id,
	            restKey: "logs",
	            templateKey: "campaigns",
	            individual_tag_name: 'li',
	            cursor : true,
	            page_size : 20,
	            sort_collection:false,
	            postRenderCallback: function(el) {            	
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	              		 $("time.log-created-time", el).timeago();
	              	});
	              // var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	             // fillSelect('campaignSelect','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
	            },
	            appendItemCallback : function(el)
				{
					includeTimeAgo(el);
				}  
	        });
			campaignsView.collection.fetch();	
	        $('#campaigns', App_Contacts.contactDetailView.el).html(campaignsView.el);
		}
};
/**
 * This function is used to get mails from specified server and email, 
 * if server or email is not specified then it fetches 
 * mails sent through Agile.
 */
function fetch_mails(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email)
{
	
	this.configured_sync_email = "";
	var cursor = true;

	// By default showing Agile emails
	if(email_server === 'agile')
	{
		mail_server_url = 'core/api/emails/agile-emails?e='+encodeURIComponent(email);
		email_server_type = "agilecrm";
		cursor = false;
	}
	else
		mail_server_url = mail_server_url + '&search_email='+encodeURIComponent(email);
	
//	$('#email-type-select-dropdown',App_Contacts.contactDetailView.el).attr('disabled', 'disabled');

	// Fetches mails collection
	var mailsView = new Base_Collection_View({ url : mail_server_url , cursor : cursor, page_size : 10,
		templateKey : "email-social", sort_collection : true, sortKey : "date_secs", descending : true, individual_tag_name : "li",
		postRenderCallback : function(el)
		{
//			$('#email-type-select-dropdown',App_Contacts.contactDetailView.el).removeAttr('disabled');
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".email-sent-time", el).each(function(index, element)
				{
					$(element).timeago();
				});
			});
			
			if(email_server_type!="agilecrm")
				contact_details_tab_scope.configured_sync_email = email_server_type;
			
			if(!has_email_configured)
				$('#email-prefs-verification',App_Contacts.contactDetailView.el).css('display', 'block');		
		}});
	mailsView.collection.fetch();
	$('#mails', App_Contacts.contactDetailView.el).html(mailsView.render().el);
}

/**
 * This method is used read email_type_select cookie , parses cookie value
 * and evalutes if cookie informations has vaild now or not.
 * This cookie stores information about selected mail type and mail under mail tab.
 * @param model
 * @returns {Array}
 */
function fetch_mailserverurl_from_cookie(model)
{
	var cookie_value = readCookie(email_server_type_cookie_name);
	var final_url = "";
	var cookie_info = [];
	if(cookie_value)
	{
		var values = cookie_value.split("|");
		if(values)
		{
			if(values.length === 2)
			{
				var email = values[0];
				var email_server = values[1];
				var html = "";
				var shared = false;
				if(email && email_server)
				{
					if(email_server.toLowerCase()==='google')
					{
						var hasGmail = false;
						if(model.hasOwnProperty('gmailUserName') && (model.gmailUserName === email))					
							hasGmail = true;
						else if(typeof model.sharedGmailUserNames !== 'undefined' && model.hasOwnProperty('sharedGmailUserNames'))
						{
							for(var i=0;i<model.sharedGmailUserNames.length;i++)
							{
								if(model.sharedGmailUserNames[i] === email)
								{
									hasGmail = true;
									shared = true;
									break;
								}
							}
						}
						if(hasGmail)
						{
							final_url = 'core/api/social-prefs/google-emails?from_email='+email;
							html = '<i class="icon-google-plus" style="margin-right:4px;font-size: 1.2em"></i>'+email;
							if(shared)
								html = html+ ' (Shared)';
						}
					}
					else if(email_server.toLowerCase()==='imap')
					{
						var hasImap = false;
						if(model.hasOwnProperty('imapUserName') && (model.imapUserName === email))
							hasImap = true;	
						else if(typeof model.sharedImapUserNames !== 'undefined' && model.sharedImapUserNames.length > 0)
						{
							for(var i=0;i<model.sharedImapUserNames.length;i++)
							{
								if(model.sharedImapUserNames[i] === email)
								{
									hasImap = true;
									shared = true;
									break;
								}
							}
						}
						if(hasImap)
						{
							final_url = 'core/api/imap/imap-emails?from_email='+email;
							html = '<i class="icon-envelope-alt" style="margin-right:4px;font-size: 1.2em"></i>'+email;
							if(shared)
								html = html+ ' (Shared)';
						}
					}
					else if(email_server.toLowerCase()==='exchange')
					{
						var hasExchange = false;
						if(model.hasOwnProperty('exchangeUserName') && (model.exchangeUserName === email))
							hasExchange = true;
						else if(model.sharedExchangeUserNames !== 'undefined' && model.hasOwnProperty('sharedExchangeUserNames'))
						{
							for(var i=0;i<model.sharedExchangeUserNames.length;i++)
							{
								if(model.sharedExchangeUserNames[i] === email)
								{
									hasExchange = true;
									shared = true;
									break;
								}
							}
						}
						if(hasExchange)
						{
							final_url = 'core/api/office/office365-emails?from_email='+email;
							html = '<i class="icon-windows" style="margin-right:4px;font-size: 1.2em"></i>'+email;
							if(shared)
								html = html+ ' (Shared)';
						}
					}
					if(final_url)
					{
						cookie_info[0] = final_url
						cookie_info[1] = html;
						cookie_info[2] = email_server;
						cookie_info[3] = email;
					}
				}
			}// end of if cookie values == 2
		}
	}
	return cookie_info;
}

