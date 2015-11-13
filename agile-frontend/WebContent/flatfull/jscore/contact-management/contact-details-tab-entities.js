var notesView;
var dealsView; 
var eventsView;
var tasksView;
var casesView;
var documentsView;
var campaignsView;
var mailsView;
var mailAccountsView;
var email_errors_divs = [];
var email_requests = [];

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
	              	contact_detail_page_infi_scroll($('#contact-dtl', App_Contacts.contactDetailView.el), notesView);
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
	              	});
	            	$('li',el).each(function(){
	            	if($(this).find('.priority_type').text().trim() == "High") {
            			$(this).css("border-left","3px solid #f05050");
            		}else if($(this).find('.priority_type').text().trim() == "Normal"){
            			$(this).css("border-left","3px solid #7266ba");
            		}else if($(this).find('.priority_type').text().trim() == "Low") {
            			$(this).css("border-left","3px solid #fad733");
            		}
	            	});
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
		              	});
		            
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
		              	});
		            	$('li',el).each(function(){
		            		if($(this).find('.priority_type').text().trim()== "HIGH") {
		            			$(this).css("border-left","3px solid #f05050");
		            		}else if($(this).find('.priority_type').text().trim() == "NORMAL"){
		            			$(this).css("border-left","3px solid #7266ba");
		            		}else if($(this).find('.priority_type').text().trim() == "LOW") {
		            			$(this).css("border-left","3px solid #fad733");
		            		}
		            	});
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
			killAllPreviousRequests();
			$('#mail #mails-span', App_Contacts.contactDetailView.el).remove();
			$('#mails', App_Contacts.contactDetailView.el).html("");
			if(typeof mailsView !== 'undefined')
			{
				mailsView.render = null;
				mailsView.collection = null;
			}
			var contact = App_Contacts.contactDetailView.model;
			var json = contact.toJSON();
			// Get email of the contact in contact detail
			var email = getAllPropertyValuesByName(json.properties, "email", ",");			
			// Shows an error alert, when there is no email to the contact
			if (!email)
			{
				show_no_email_alert();
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
				if(email_server !== 'all')
					fetchMails(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email);
				else
				{
					var email_accounts_model = mailAccountsView.model.toJSON();
					fetchAllMails(contact_details_tab_scope,has_email_configured,email_accounts_model,email);
				}
			}
			else
			{
				loadMailTabView(contact_details_tab_scope,email_server,mail_server_url,email);
			}		
		},
		load_stats : function()
		{
			var contact = App_Contacts.contactDetailView.model;
			var json = contact.toJSON();
			 
			// Get email of the contact in contact detail
			var email = getAllPropertyValuesByName(json.properties, "email", ",");
			
			// Shows an error alert, when there is no email to the contact 
			if(!email){
				$('#stats', App_Contacts.contactDetailView.el).html('<div class="alert alert-danger m-t-sm"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the stats.</div>');
				return;	
			}

			get_web_stats_count_for_domain(function(count){

				// To avoid unnecessary JSAPI count, first verify in cookie
				if(!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && count == '0'))
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
	            	
	            	var first_model_element = $('#stats-model-list').find('li')[0];
	            	
	            	// Expand first li by default
	            	if(first_model_element)
	            		$(first_model_element).find('#show-page-views').trigger('click');
	            	
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

			});
		},
		load_campaigns : function()
		{
			campaignsView = new Base_Collection_View({
				url: '/core/api/campaigns/logs/contact/' + App_Contacts.contactDetailView.model.id,
	            restKey: "logs",
	            templateKey: "campaigns",
	            individual_tag_name: 'li',
	            cursor : true,
	            page_size : 20,
	            sort_collection:false,
	            postRenderCallback: function(el) {            	

	            	$('#unsubscribe-modal', el).off('click');

	            	$('#unsubscribe-modal', el).on('click', function(e){
	            		e.preventDefault();	            	    

						show_resubscribe_modal();

	            	});

	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	              		 $("time.log-created-time", el).timeago();
	              	});
	            	contact_detail_page_infi_scroll($('#contact-dtl', App_Contacts.contactDetailView.el), campaignsView);
	            },
	            appendItemCallback : function(el)
				{
					includeTimeAgo(el);
				} 
	        });

			campaignsView.collection.fetch({
				success: function(){

					// Verify whether contact updated or not
					checkContactUpdated();
				}

			});	

	        $('#campaigns', App_Contacts.contactDetailView.el).html(campaignsView.el);
		}
};
/**
 * This method responsible for building mail tab UI in contact-details page.
 * First it loads configured email accounts and then loads emails from selected
 * email account. It has an option of showing all emails in one shot also.
 */
function loadMailTabView(contact_details_tab_scope,email_server,mail_server_url,email)
{
	var has_email_configured = true;
	var has_shared_email_configured = true;
	var model = "";
	var email_dropdown_html = "";
	var from_email = "";
    mailAccountsView = new Base_Model_View({ url : 'core/api/emails/synced-accounts', template : "email-account-types",change:false,
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
			//Fetching emails from All registered email accounts
			if(email_server ==='all' || mail_server_url === 'all')
				fetchAllMails(contact_details_tab_scope,has_email_configured,model,email)
			else
				fetchMails(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email);
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

/**
 * This function is used to get mails from specified server and email, 
 * if server or email is not specified then it fetches 
 * mails sent through Agile.
 */
function fetchMails(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email)
{	
	$('#mail', App_Contacts.contactDetailView.el).append('<span id="mails-span"> <img class="mails-loading p-r-xs m-b m-l-sm pull-left"  src= "/img/ajax-loader-cursor.gif"></img></span>');
	this.configured_sync_email = "";
	var cursor = true;

	// By default showing Agile emails
	if(email_server === 'agile')
	{
		mail_server_url = 'core/api/emails/agile-emails?search_email='+encodeURIComponent(email);
		email_server_type = "agilecrm";
		cursor = false;
	}
	else
		mail_server_url = mail_server_url + '&search_email='+encodeURIComponent(email);

	// Fetches mails collection
	mailsView = new Base_Collection_View({ url : mail_server_url , cursor : cursor, page_size : 10,
	templateKey : "email-social", sort_collection : true, sortKey : "date_secs", descending : true, individual_tag_name : "li",
	postRenderCallback : function(el)
	{
		$('#mail', App_Contacts.contactDetailView.el).find("#no-email").css('display','block');
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
		contact_detail_page_infi_scroll($('#contact-dtl', App_Contacts.contactDetailView.el), mailsView);
		$('#mail #mails-span', App_Contacts.contactDetailView.el).remove();
	}});
	mailsView.collection.fetch();
	$('#mails', App_Contacts.contactDetailView.el).html(mailsView.render().el);
}

function fetchAllMails(contact_details_tab_scope,has_email_configured,email_accounts_model,email)
{	
	var all_emails = [];
	var fetch_urls = email_accounts_model['fetchUrls'];
	$('#contact-dtl', App_Contacts.contactDetailView.el).unbind("scroll");
	loadAllMailsView(contact_details_tab_scope,has_email_configured,all_emails);
    fetchMailsFromAllAccounts(contact_details_tab_scope,has_email_configured,fetch_urls,email);
}

/**
 * 
 * This function is used to fetch mails from all configured email
 * accounts. It calls emails servers in asynchronous fashion.
 * After getting response from each server call, view automatically
 * gets sorted and rendered with new items
 
 * @param contact_details_tab_scope
 * @param has_email_configured
 * @param fetch_urls
 * @param email
 */
function fetchMailsFromAllAccounts(contact_details_tab_scope,has_email_configured,fetch_urls,email)
{
	var response_count = 0;
	if(fetch_urls)
	{
		if(fetch_urls.length > 0)
		{
			$('#mail-account-types', App_Contacts.contactDetailView.el).prepend('<span id="mails-span"> <img class="all-mails-loading p-r-xs m-b m-l-sm pull-left"  src= "/img/ajax-loader-cursor.gif"></img></span>');
			$('#mail-account-types', App_Contacts.contactDetailView.el).find('.all-mails-loading').css("display","block");
		}
		for(var i=0;i<fetch_urls.length;i++)
		{
			var xhr = $.ajax({ url : fetch_urls[i]+'&search_email='+encodeURIComponent(email),
				success : function(emails)
				{	
					response_count++;
					if(emails)
					{	if(ifNoError(emails[0]))
						{
							if(!mailsView)
							{				
								setTimeout(function(){
									mailsView.collection.add(emails);
									mailsView.render(true);
									showTransitionBar();
								},5000);
							}
							else
							{
								mailsView.collection.add(emails);
								mailsView.render(true);				
							}
						}
						if(response_count === fetch_urls.length)
						{
							showMailsInfoMessages();
						}
				    }
				},
			    error : function(response)
			    {
			    	response_count++;
			    	if(response_count === fetch_urls.length)
			    	{
			    		showMailsInfoMessages(response);
			    	}
			    }
			});
			email_requests.push(xhr);
		}
	}
}
/**
 * /**
 * This function is responsible for building mailsView.
 * Mails view consists mails fetched from emails servers.
 
 * @param contact_details_tab_scope
 * @param has_email_configured
 * @param fetched_emails
 * 
 */
function loadAllMailsView(contact_details_tab_scope,has_email_configured,fetched_emails)
{
	if(typeof mailsView !== 'undefined')
	{
		mailsView.render = null;
		mailsView = null;
	}
	this.configured_sync_email = "";
	mailsView = new Base_Collection_View({data : fetched_emails,
	templateKey : "email-social", sort_collection : true, sortKey : "date_secs", descending : true, individual_tag_name : "li",
	postRenderCallback : function(el)
	{
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
		//$('#mail #mails-span', App_Contacts.contactDetailView.el).remove();
	}});
	$('#mails', App_Contacts.contactDetailView.el).html(mailsView.render(true).el);
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
					if(email_server.toLowerCase()==='all')
					{
						cookie_info[0] = 'all'
						cookie_info[1] = 'All Mail';
						cookie_info[2] = 'all';
						cookie_info[3] = 'all';
					}
					else if(email_server.toLowerCase()==='google')
					{
						var hasGmail = false;
						if(typeof model.gmailUserNames !== 'undefined' && model.hasOwnProperty('gmailUserNames'))
						{
							for(var i=0;i<model.gmailUserNames.length;i++)
							{
								if(model.gmailUserNames[i] === email)
								{
									hasGmail = true;
									break;
								}
							}
						}
						if(typeof model.sharedGmailUserNames !== 'undefined' && model.hasOwnProperty('sharedGmailUserNames'))
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
						if(typeof model.imapUserNames !== 'undefined' && model.hasOwnProperty('imapUserNames'))
						{
							for(var i=0;i<model.imapUserNames.length;i++)
							{
								if(model.imapUserNames[i] === email)
								{
									hasImap = true;
									break;
								}
							}
						}
						if(typeof model.sharedImapUserNames !== 'undefined' && model.hasOwnProperty('sharedImapUserNames'))
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
						if(typeof model.exchangeUserNames !== 'undefined' && model.hasOwnProperty('exchangeUserNames'))
						{
							for(var i=0;i<model.exchangeUserNames.length;i++)
							{
								if(model.exchangeUserNames[i] === email)
								{
									hasExchange = true;
									break;
								}
							}
						}
						if(typeof model.sharedExchangeUserNames !== 'undefined' && model.hasOwnProperty('sharedExchangeUserNames'))
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

function contact_detail_page_infi_scroll(element_id, targetCollection)
{
	console.log("initialize_infinite_scrollbar",element_id);
	
	element_id.unbind("scroll");

	if (element_id == undefined || element_id == null)
	{
		console.log("no elmnt");
		return;
	}
	console.log(targetCollection);
	targetCollection.infiniScroll = new Backbone.InfiniScroll(targetCollection.collection, {
		target : element_id,
		untilAttr : 'cursor',
		param : 'cursor',
		strict : false,
		pageSize : targetCollection.page_size,
		success : function(colleciton, response)
		{
			console.log('in success');
			if (!colleciton.last().get("cursor"))
			{
				this.strict = true;
				targetCollection.infiniScroll.disableFetch();
			}
			// Remove loading icon
			$(targetCollection.infiniScroll.options.target).find('.scroll-loading').remove();
		},
		onFetch : function()
		{
			console.log('in fetch');
			// Add loading icon
			$(targetCollection.infiniScroll.options.target).append(
					'<div class="scroll-loading"> <img src="/img/ajax-loader-cursor.gif" style="margin-left: 44%;"> </div>');
		}
		});
}
function showMailsInfoMessages()
{
	showMailsErrorMessages();
	if(mailsView.collection.length > 0)
	{
		if(($('#all-emails-info',App_Contacts.contactDetailView.el).length === 0))
		{
			$('#mails',App_Contacts.contactDetailView.el).append('<div id="all-emails-info" class="alert alert-info">Showing relevant messages from all accounts. Maximum of 20 messages from each account </div>');
		}
	}
	$('#mail-account-types', App_Contacts.contactDetailView.el).find('.all-mails-loading').remove();
	$('#mail', App_Contacts.contactDetailView.el).find("#no-email").css('display','block');
}
function showMailsErrorMessages()
{
	for(var i=0;i<email_errors_divs.length;i++)
		$('#mails',App_Contacts.contactDetailView.el).prepend(email_errors_divs[i]);
	email_errors_divs = [];
}
function ifNoError(email)
{
	if(email && 'errormssg' in email && 'owner_email' in email)
	{
		var email_error_div = '<div class="alert alert-danger" > <a href="#" class="close" data-dismiss="alert">&times;</a><span class="text-dark">Unable to fetch emails from account "'+email.owner_email+'" Error:'+ email.errormssg+'</span>';
		email_errors_divs.push(email_error_div);
		return false;
	}
	return true;
}
function killAllPreviousRequests()
{
	for(var i=0;i<email_requests.length;i++)
	{
		var xhr = email_requests[i];
		xhr.abort();
	}
	email_requests = [];
}
function show_no_email_alert()
{
	$('#mail', App_Contacts.contactDetailView.el).html('<div class="alert alert-danger m-t-sm"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the mails.</div>');
}

function show_resubscribe_modal(){
	
	getTemplate('contact-detail-resubscribe-modal', {}, undefined, 
		function(template_ui){
							
					if(!template_ui)
							return;
					
					unsubscribe_status_updated = false;

					// Removes if previous modals exist.
					if ($('div#contact-detail-resubscribe-modal').size() != 0)
						$('div#contact-detail-resubscribe-modal').remove();

					var modal = $(template_ui).modal('show');

					modal.on('shown.bs.modal', function (e) {
		              

		              var el = $(template_ui);

		               $(this).find('.modal-body').css({
			              width:'auto', //probably not needed
			              height:'auto', //probably not needed 
			              'max-height':'100%'
       					});

		              
		              fillSelect('campaigns-list', '/core/api/workflows', 'workflow', function(collection)
						{
							
								$('#campaigns-list', el).empty();

								email_workflows_list = get_email_workflows(collection.toJSON());


								var modelTemplate = Handlebars.compile("{{#each this}}<option value='{{@key}}'>{{this}}</option>{{/each}}");
								var optionsHTML = modelTemplate(email_workflows_list);
								
								$('#campaigns-list', el).append(optionsHTML);

								// Remove image
								$('#campaigns-list', el).parent().find('.loading').remove();

								head.js(LIB_PATH + 'lib/bootstrap-multiselect/bootstrap-multiselect.min.js', CSS_PATH + 'css/bootstrap-multiselect/bootstrap-multiselect.css', function(){

									is_selected_all = false;
									$('#campaigns-list', el).multiselect({
										  onInitialized: function(select, container) {
			        								
		    								$(container).find('button').css({width: '252px'});
		    								// $(container).find('.multiselect-container').css({'position':'relative'});
		    								$(container).find('span').addClass('pull-left');
		    								$(container).find('b.caret').addClass('pull-right m-t-sm');
			    						},
										  nonSelectedText: 'Select Campaign',
										  selectAllValue: "ALL",
										  includeSelectAllOption: true,
										  maxHeight: 125,
										  disableIfEmpty: true,
										  buttonText: function(options){

										  		if(options.length == 0)
										  			return 'Select Campaign';

										  		return options.length + ' selected';
										  },
										  onSelectAll: function(checked){
										  		is_selected_all = checked;
										  		unsubscribe_contact();
										  		return;
										  },
										  onChange: function(option, checked) {

										  			if(!option)
										  				return;

													if(option.val() == 'ALL' && checked)
													{
														is_selected_all = true;
														unsubscribe_contact();
														return;
													}

													is_selected_all = false;

													unsubscribe_contact();
												},
										   onDropdownShow: function(event) {

											      var $menu = $(event.currentTarget).find(".dropdown-menu li label");
											      
											      $menu.css({ "width": "250px","white-space": "nowrap", "overflow": "hidden","text-overflow": "ellipsis"});
											  }
									});

									
									getTemplate('contact-detail-unsubscribe-campaigns-list', {}, undefined, function(campaigns_list_template){

										$('#unsubscribe-campaigns-list', el).html(campaigns_list_template);

										$('div#contact-detail-resubscribe-modal .modal-body').html(el.find('form'));

										var $tooltip = $('[data-toggle="tooltip"]').tooltip();

										$tooltip.on('shown.bs.tooltip', function(){
											
											 $(this).next('.tooltip').css({'padding-right': '2px'});

										});


									
									});
									
									// Unsubscribe
									unsubscribe_contact();

									// Resubscribe
									resubscribe(el);
							});
				
						}, "<option value='{{id}}'>{{name}}</option>", true, el);

					});
	
					// Modal hidden
					modal.on('hidden.bs.modal', function(e){

						if(typeof unsubscribe_status_updated != 'undefined' && unsubscribe_status_updated)
							contact_details_tab.load_campaigns()
					});
	
			}, null);

}

function get_email_workflows(workflows){

	if(!workflows)
		return;

	var email_workflows = {};

	for (var i = 0, len = workflows.length; i < len; i++){
        
        var workflow = workflows[i];
        var rules = JSON.parse(workflow["rules"]);
        var nodes = rules["nodes"];

		// Iterate nodes to check SendEmail
		for(var j=0, length = nodes.length; j < length; j++){

			var node = nodes[j];

			if((node["NodeDefinition"]["name"] == "Send Email" || node["NodeDefinition"]["name"] == "Send E-mail") && node["NodeDefinition"]["workflow_tasklet_class_name"] == "com.campaignio.tasklets.agile.SendEmail")
			{
				email_workflows[workflow.id] = workflow.name;
				break;
			}
		}
    }

    return email_workflows;

}
