/**
 * Creates leads details view with timeline,
 * notes, tasks, events, deals etc... information
 * 
 * @module Leads
 */
var LeadDetails = (function(){

	function LeadDetails() {};

	/*
	 * To show lead tabs tasks, events, timeline etc...
	 * 
	 * @param {Element} el - parent element
	 * @param {Object} - lead object to show lead information
	 */
	LeadDetails.prototype.loadLeadTabs = function(el, leadJSON)
	{
		timeline_collection_view = null;
		var position = _agile_get_prefs("lead_tab_position");
		if (!position)
		{
			position = "time-line";
		}

		if(agile_is_mobile_browser())
		{
			return;
		}

		if($('#contactDetailsTab a[href="#leads-'+position+'"]', el).length == 0)
		{
			position = "time-line";
		}
		
		$('#contactDetailsTab a[href="#leads-'+position+'"]', el).tab('show');
		$(".tab-content", el).find("#"+position+"").addClass("active");

		switch(position)
		{
			case "time-line" :
			{
				this.loadTimeline();
				break;
			}
			case "notes" :
			{
				this.loadNotes();
				break;
			}
			case "events" :
			{
				this.loadEvents();
				break;
			}
			case "tasks" :
			{
				this.loadTasks();
				break;
			}
			case "deals" :
			{
				this.loadDeals();
				break;
			}
			case "mail" :
			{
				this.loadMails();
				break;
			}
			case "documents" :
			{
				this.loadDocs();
				break;
			}
		}

	}

	/*
	 * To load relevant lead timeline
	 */
	LeadDetails.prototype.loadTimeline = function()
	{
	    $('div.tab-content', App_Leads.leadDetailView.el).find('div.active').removeClass('active');	
		$('#time-line', App_Leads.leadDetailView.el).addClass('active');
		if($("#timeline", App_Leads.leadDetailView.el).hasClass('isotope'))
		{
			$("#timeline", App_Leads.leadDetailView.el).isotope( 'reLayout', function(){} )
			return;
		}
		noAnimationBruteForce = true;
		timeline_entity_loader.init(App_Leads.leadDetailView.model.toJSON(), App_Leads.leadDetailView.el);

		var ele = $('#time-line', App_Leads.leadDetailView.el);
        this.activateLeadTab(ele);
	}

	/*
	 * To load relevant lead notes
	 */
	LeadDetails.prototype.loadNotes = function()
	{
	    var id = App_Leads.leadDetailView.model.id;
	    notesView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/notes",
            restKey: "note",
            templateKey: "notes",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	//Removing add call note button
            	$(".show-logPhone", el).parents("ul").siblings("button").remove();
            	$(".show-logPhone", el).parents("ul").remove();
            	agileTimeAgoWithLngConversion($(".note-created-time", el));
            	
              	contact_detail_page_infi_scroll($('#contact-dtl', App_Leads.leadDetailView.el), notesView);
            },
            appendItemCallback : function(el) {
				includeTimeAgo(el);
			}
        });
        notesView.collection.fetch();
        var ele = $('#notes', App_Leads.leadDetailView.el);
        $(ele).html(notesView.el);
        this.activateLeadTab(ele);
	}

	/*
	 * To load relevant lead events
	 */
	LeadDetails.prototype.loadEvents = function()
	{
		var id = App_Leads.leadDetailView.model.id;
		eventsView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/events",
            restKey: "event",
            templateKey: "contact-events",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".event-created-time", el));
            	
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
		var ele = $('#events', App_Leads.leadDetailView.el);
        $(ele).html(eventsView.el);
        this.activateLeadTab(ele);
	}

	/*
	 * To load relevant lead tasks
	 */
	LeadDetails.prototype.loadTasks = function()
	{
		var id = App_Leads.leadDetailView.model.id;
		tasksView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/tasks",
            restKey: "task",
            templateKey: "contact-tasks",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".task-created-time", el));
            	
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
		var ele = $('#tasks', App_Leads.leadDetailView.el);
        $(ele).html(tasksView.el);
        this.activateLeadTab(ele);
	}

	/*
	 * To load relevant lead deals
	 */
	LeadDetails.prototype.loadDeals = function ()
	{
		var id = App_Leads.leadDetailView.model.id;
		dealsView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/deals" ,
            restKey: "opportunity",
            templateKey: "deals",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".deal-created-time", el));
            	$(el).find('ul li').each(function(){
			    	$(this).addClass("deal-color");
			    	$(this).addClass($(this).find("input").attr("class"));
		        });
            }
        });
        dealsView.collection.fetch();
        var ele = $('#deals', App_Leads.leadDetailView.el);
        $(ele).html(dealsView.el);
        this.activateLeadTab(ele);
	}

	/*
	 * To load relevant lead mails
	 */
	LeadDetails.prototype.loadMails = function (mail_server_url, email_server)
	{
		var _this = this;
		killAllPreviousRequests();
		$('#mail #mails-span', App_Leads.leadDetailView.el).remove();
		$('#mails', App_Leads.leadDetailView.el).html("");
		if(typeof mailsView !== 'undefined')
		{
			mailsView.render = null;
			mailsView.collection = null;
		}
		var contact = App_Leads.leadDetailView.model;
		var json = contact.toJSON();
		// Get email of the contact in contact detail
		var email = getAllPropertyValuesByName(json.properties, "email", ",");			
		// Shows an error alert, when there is no email to the contact
		if (!email)
		{
			_this.show_no_email_alert();
			return;
		}
		var contact_details_tab_scope = this;
		var has_email_configured = true;
		var has_shared_email_configured = true;			
		if(email_server && mail_server_url)
		{
			if($('#has_email_configured', App_Leads.leadDetailView.el).html() === 'true')
				has_email_configured = true;
			else
				has_email_configured = false;
			if(email_server !== 'all')
				_this.fetchMails(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email);
			else
			{
				var email_accounts_model = mailAccountsView.model.toJSON();
				_this.fetchAllMails(contact_details_tab_scope,has_email_configured,email_accounts_model,email);
			}
		}
		else
		{
			_this.loadMailTabView(contact_details_tab_scope,email_server,mail_server_url,email);
		}
		var ele = $('#mail', App_Leads.leadDetailView.el);
        this.activateLeadTab(ele);
	}

	/*
	 * To load relevant lead documents
	 */
	LeadDetails.prototype.loadDocs = function()
	{
		var id = App_Leads.leadDetailView.model.id;
		documentsView = new Base_Collection_View({
			url: '/core/api/documents/contact/' + id + "/docs",
			restKey: "document",
			templateKey: "contact-documents",
			individual_tag_name: 'li',
			sortKey:"uploaded_time",
			descending: true,
			postRenderCallback: function(el) {
				agileTimeAgoWithLngConversion($(".document-created-time", el));
			}
		});
		documentsView.collection.fetch();
		var ele = $('#documents', App_Leads.leadDetailView.el);
        $(ele).html(documentsView.el);
        this.activateLeadTab(ele);
	}

	/*
	 * Saves selected lead tab as local storage variable
	 * to show correct tab from second time onwards.
	 *
	 * @param {String} tab_href - represents selected tab name
	 */
	LeadDetails.prototype.saveLeadTabPosition = function (tab_href)
	{
		var position = _agile_get_prefs("lead_tab_position");

		if (position == tab_href)
			return;

		_agile_set_prefs("lead_tab_position", tab_href);
	}

	/*
	 * Shows selected tab as active tab.
	 *
	 * @param {String} ele - selected tab id
	 */
	LeadDetails.prototype.activateLeadTab = function(ele)
	{
		$('#contact-tab-content .tab-pane').removeClass('active');
		$(ele).addClass('active');
	}

	/*
	 * Gets lead properties list based on property name.
	 *
	 * @param {String} propertyName - lead property name
	 *
	 * @return {List} property_list
	 */
	LeadDetails.prototype.getLeadPropertiesList = function(propertyName)
	{
		// Reads current contact model form the contactDetailView
		var lead_model = App_Leads.leadDetailView.model;

		// Gets properties list field from contact
		var properties = lead_model.get('properties');
		var property_list = [];

		/*
		 * Iterates through each property in contact properties and checks for the
		 * match in it for the given property name and retrieves value of the
		 * property if it matches
		 */
		$.each(properties, function(index, property)
		{
			if (property.name == propertyName)
			{
				property_list.push(property);
			}
		});

		// If property is defined then return property value list
		return property_list;

	}

	/**
	 * Loads, minified jquery.raty plug-in to show stars to rate a contact in its  
	 * detail view and highlights the (no.of) stars based on star_value of the contact.
	 * 
	 * @method starify 
	 * @param {Object} el
	 * 			html object of contact detail view
	 */
	LeadDetails.prototype.starify = function(el) 
	{
	    head.js(LIB_PATH + 'lib/jquery.raty.min.js', function(){
	    	
	    	var lead_model  =  App_Leads.leadDetailView.model;
	    	
	    	// If contact update is not allowed then start rating does not allow user to change it
	    	if(App_Leads.leadDetailView.model.get('owner') && !canEditContact(App_Leads.leadDetailView.model.get('owner').id))
	    	{
	    			$('#star', el).raty({
	    				'readOnly': true,
	    				score: App_Leads.leadDetailView.model.get('star_value')
	    			});
	    		 return;
	    	}
	    	
	    	// Set URL - is this required?
	    	$('#star', el).raty({
	    		/**
	    		 * When a star is clicked, the position of the star is set as star_value of
	    		 * the contact and saved.    
	    		 */
	        	click: function(score, evt) {
	        		App_Leads.leadDetailView.model.set({'star_value': score}, {silent : true});
	        		lead_model =  App_Leads.leadDetailView.model.toJSON();
	        		var new_model = new Backbone.Model();
	        		new_model.url = 'core/api/contacts';
	        		new_model.save(lead_model, {
	        			success: function(model){
	        				if(App_Leads.leadsListView && App_Leads.leadsListView.collection && App_Leads.leadsListView.collection.get(lead_model.id))
	        				{
	        					App_Leads.leadsListView.collection.get(lead_model.id).set(new BaseModel(model.toJSON()));
	        				}
	        			}
	        		});

	        	},
	        	
	        	/**
	        	 * Highlights the stars based on star_value of the contact
	        	 */
	        	score: lead_model.get('star_value')
	            
	        });
	    });
	    
	}

	/**
	 * Loads the "google map API" by appending the url as script to html document
	 * body and displays the map (using callback of url) based on the address of the
	 * lead. If the google map is already loaded, just displays the map.
	 * 
	 * Geocoder is used to get the latitude and longitude of the given address
	 * 
	 * @method show_map
	 * @param {object}
	 *            el html object of the lead detail view
	 * @param {Object}
	 *            lead going to be shown in detail
	 */
	LeadDetails.prototype.show_map = function(el) 
	{
		var lead = App_Leads.leadDetailView.model.toJSON();
		var address = getPropertyValue(lead.properties, "address");

		// Return, if no address is found 
		if (!address) 
			return;
		
		try
		{
			address = JSON.parse(address);
			if(!address)
				return;
		}
		catch (err)
		{
			return;
		}

		// If all the address fields are empty, just return.
		if (!address.address && !address.city && !address.state && !address.country)
			return;
		
		//reads the value from cookie or local store if the value is no it will return from here
		var map_view=_agile_get_prefs('LEADS_MAP_VIEW');
		if(map_view == "disabled"){
			$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='"+_agile_get_translated_val('contact-details','show-map')+"' id='enable_map_view'></i>");
			return;
		}

		// If google map is already loaded display the map else load the
		// "google maps api"
		try {
			if (google.maps) {
				display_google_map();
			}
		} catch (err) {

			load_gmap_script();
		}
	}

	/**
	 * This method responsible for building mail tab UI in contact-details page.
	 * First it loads configured email accounts and then loads emails from selected
	 * email account. It has an option of showing all emails in one shot also.
	 */
	LeadDetails.prototype.loadMailTabView = function(contact_details_tab_scope,email_server,mail_server_url,email)
	{
		var _this = this;
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
				var cookie_info = _this.fetch_mailserverurl_from_cookie(model);
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
					_this.fetchAllMails(contact_details_tab_scope,has_email_configured,model,email)
				else
					_this.fetchMails(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email);
				if(has_email_configured || has_shared_email_configured)
				{
					if(email_dropdown_html)
						$('#email-type-select',App_Leads.leadDetailView.el).html(email_dropdown_html);	 
					$('#mail-account-types', App_Leads.leadDetailView.el).css('display','block');
				} 						
			}
		});
		
		$('#mail-account-types', App_Leads.leadDetailView.el).html(mailAccountsView.render().el);	 
	}

	/**
	 * This function is used to get mails from specified server and email, 
	 * if server or email is not specified then it fetches 
	 * mails sent through Agile.
	 */
	LeadDetails.prototype.fetchMails = function(contact_details_tab_scope,has_email_configured,mail_server_url,email_server,email)
	{	
		$('#mail', App_Leads.leadDetailView.el).append('<span id="mails-span"> <img class="mails-loading p-r-xs m-b m-l-sm pull-left"  src= "'+updateImageS3Path("/img/ajax-loader-cursor.gif")+'"></img></span>');
		this.configured_sync_email = "";
		var cursor = true;

		// By default showing Agile emails
		if(email_server === 'agile')
		{
			mail_server_url = 'core/api/emails/agile-lead-emails?search_email='+encodeURIComponent(email);
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
			$(el).find('style').html("");
			$('#mail', App_Leads.leadDetailView.el).find("#no-email").css('display','block');
			agileTimeAgoWithLngConversion($(".email-sent-time", el));
			
			if(email_server_type!="agilecrm")
				contact_details_tab_scope.configured_sync_email = email_server_type;
		
			if(!has_email_configured)
				$('#email-prefs-verification',App_Leads.leadDetailView.el).css('display', 'block');
			contact_detail_page_infi_scroll($('#contact-dtl', App_Leads.leadDetailView.el), mailsView);
			$('#mail #mails-span', App_Leads.leadDetailView.el).remove();
		}});

		mailsView.collection.fetch();
		$('#mails', App_Leads.leadDetailView.el).html(mailsView.render().el);
	}

	LeadDetails.prototype.fetchAllMails = function(contact_details_tab_scope,has_email_configured,email_accounts_model,email)
	{	
		var all_emails = [];
		var fetch_urls = email_accounts_model['fetchUrls'];
		$('#contact-dtl', App_Leads.leadDetailView.el).unbind("scroll");
		this.loadAllMailsView(contact_details_tab_scope,has_email_configured,all_emails);
	    this.fetchMailsFromAllAccounts(contact_details_tab_scope,has_email_configured,fetch_urls,email);
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
	LeadDetails.prototype.fetchMailsFromAllAccounts = function(contact_details_tab_scope,has_email_configured,fetch_urls,email)
	{
		var _this = this;
		var response_count = 0;
		if(fetch_urls)
		{
			if(fetch_urls.length > 0)
			{
				$('#mail-account-types', App_Leads.leadDetailView.el).prepend('<span id="mails-span"> <img class="all-mails-loading p-r-xs m-b m-l-sm pull-left"  src= "'+updateImageS3Path("/img/ajax-loader-cursor.gif")+'"></img></span>');
				$('#mail-account-types', App_Leads.leadDetailView.el).find('.all-mails-loading').css("display","block");
			}
			for(var i=0;i<fetch_urls.length;i++)
			{
				var xhr = $.ajax({ url : fetch_urls[i]+'&search_email='+encodeURIComponent(email),
					success : function(emails)
					{	
						response_count++;
						if(emails)
						{	if(_this.ifNoError(emails[0]))
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
								_this.showMailsInfoMessages();
							}
					    }
					},
				    error : function(response)
				    {
				    	response_count++;
				    	if(response_count === fetch_urls.length)
				    	{
				    		_this.showMailsInfoMessages(response);
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
	LeadDetails.prototype.loadAllMailsView = function(contact_details_tab_scope,has_email_configured,fetched_emails)
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
			$(el).find('style').html("");
			agileTimeAgoWithLngConversion($(".email-sent-time", el));
			
			if(email_server_type!="agilecrm")
				contact_details_tab_scope.configured_sync_email = email_server_type;
		
			if(!has_email_configured)
				$('#email-prefs-verification',App_Leads.leadDetailView.el).css('display', 'block');
			//$('#mail #mails-span', App_Leads.leadDetailView.el).remove();
		}});
		$('#mails', App_Leads.leadDetailView.el).html(mailsView.render(true).el);
	}

	/**
	 * This method is used read email_type_select cookie , parses cookie value
	 * and evalutes if cookie informations has vaild now or not.
	 * This cookie stores information about selected mail type and mail under mail tab.
	 * @param model
	 * @returns {Array}
	 */
	LeadDetails.prototype.fetch_mailserverurl_from_cookie = function(model)
	{
		var cookie_value = _agile_get_prefs(email_server_type_cookie_name);
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
									html = html+ ' ('+_agile_get_translated_val('contact-details','shared')+')';
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
									html = html+ ' ('+_agile_get_translated_val('contact-details','shared')+')';
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
									html = html+ ' ('+_agile_get_translated_val('contact-details','shared')+')';
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

	LeadDetails.prototype.showMailsInfoMessages = function ()
	{
		this.showMailsErrorMessages();
		if(mailsView.collection.length > 20)
		{
			if(($('#all-emails-info',App_Leads.leadDetailView.el).length === 0))
			{
				$('#mails',App_Leads.leadDetailView.el).append('<div id="all-emails-info" class="alert alert-info">'+_agile_get_translated_val('mails','show-mails-error')+' </div>');
			}
		}
		$('#mail-account-types', App_Leads.leadDetailView.el).find('.all-mails-loading').remove();
		$('#mail', App_Leads.leadDetailView.el).find("#no-email").css('display','block');
	}

	LeadDetails.prototype.showMailsErrorMessages = function ()
	{
		for(var i=0;i<email_errors_divs.length;i++)
			$('#mails',App_Leads.leadDetailView.el).prepend(email_errors_divs[i]);
		email_errors_divs = [];
	}

	LeadDetails.prototype.ifNoError = function(email)
	{
		if(email && 'errormssg' in email && 'owner_email' in email)
		{
			var email_error_div = '<div class="alert alert-danger" > <a href="#" class="close" data-dismiss="alert">&times;</a><span class="text-dark">Unable to fetch emails from account "'+email.owner_email+'" Error:'+ email.errormssg+'</span>';
			email_errors_divs.push(email_error_div);
			return false;
		}
		return true;
	}

	LeadDetails.prototype.show_no_email_alert = function()
	{
		$('#mail', App_Leads.leadDetailView.el).html('<div class="alert alert-danger m-t-sm m-sm"><a class="close" data-dismiss="alert" href="#">&times;</a>{{agile_lng_translate "leads-view" "sorry-this-lead-has-no-email-to-get-the-mails"}}</div>');
		this.activateLeadTab($('#mail', App_Leads.leadDetailView.el));
	}

	return LeadDetails;

})();