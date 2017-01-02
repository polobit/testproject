

 

var timeline_entity_loader = {


	init : function(contact, el)
	{
		this.active_connections = 0;
		MONTH_YEARS = [];
		var _this = this;
		// Load plugins for timeline
		head.load(FLAT_FULL_PATH + "lib/isotope.pkgd.js", FLAT_FULL_PATH + "lib/jquery.event.resize.js", FLAT_FULL_PATH + "css/misc/agile-timline.css", function()
		{
			// customize_isotope()
			if(contact.type == "COMPANY"){
				configure_timeline(App_Companies.companyDetailView.el);
				timeline_collection_view = new company_timeline_view();
				console.log(_this);
				_this.load_other_company_timeline_entities(contact);
				timeline_collection_view.render(true);
			}
			else if(contact && contact.type == "LEAD")
			{
				configure_timeline(el);
				timeline_collection_view = new lead_timeline_view();
				console.log(_this);
				_this.load_other_timline_entities(contact);
				timeline_collection_view.render(true);
			}
			else{
				configure_timeline();
				timeline_collection_view = new timeline_view();
				console.log(_this);
				_this.load_other_timline_entities(contact);
				timeline_collection_view.render(true);
			// timeline_collection_view.render();
			}

		});
	},
	load_other_timline_entities : function(contact)
	{
		var contactId = contact['id'];

		this.load_related_entites(contactId);
		this.load_stats(contact);
		if((contact && contact.type != "LEAD"))
		{
			this.load_campaign_logs(contactId);
		
			if(!getPropertyValue(contact.properties, "email")){
				return;
			}
			this.get_stats(getPropertyValue(contact.properties, "email"), contact, App_Contacts.contactDetailView.el);
		}
		//setTimeout(this.load_reload_emails, 5000);
	},
	load_other_company_timeline_entities : function(contact)
	{
		var companyId = contact['id'];

		this.load_related_entites(companyId);
		this.load_stats(contact);
		this.load_campaign_logs(companyId);

		if(!getPropertyValue(contact.properties, "email")){
			return;
		}
		this.get_stats(getPropertyValue(contact.properties, "email"), contact, App_Companies.companyDetailView.el);
		//setTimeout(this.load_reload_emails, 5000);
	},
	
	load_reload_emails : function(contactId)
	{
		divArr = $('.isotope-item');
		$.each(divArr,function(index, data){
			parentEMailDivId = divArr[index].id;
			childEMailDivId = parentEMailDivId+'-inner';
			if($('#'+childEMailDivId).length==0){
				childEMailDivId = parentEMailDivId+'\\/-inner';
				//$('#'+parentEMailDivId).html($('#'+childEMailDivId).html());
				$('#'+parentEMailDivId).html($('#'+childEMailDivId).wrapAll('<div>').parent().html());
				$('#'+childEMailDivId).remove();
			}
			//$('#message-'+parentEMailDivId).show();
		});
	},

	load_related_entites : function(contactId)
	{
		var entity_types = [
				"deals", "notes", "cases", "tasks","calls","events", "tickets","sms"
		];

		var url = 'core/api/contacts/related-entities/' + contactId;
		this.timline_fetch_data(url, function(data)
		{
			var entities = [];

			for ( var index in entity_types)
			{
				if (data[entity_types[index]].length == 0)
					continue;

				entities = entities.concat(data[entity_types[index]]);

			}
			
			if((App_Contacts.contactDetailView && App_Contacts.contactDetailView.model.get('id') == contactId) || (App_Companies.companyDetailView && App_Companies.companyDetailView.model.get('id') == contactId))
			{
				timeline_collection_view.addItems(entities);
			}
			else if(App_Leads.leadDetailView && App_Leads.leadDetailView.model.get('id') == contactId)
			{
				timeline_collection_view.addItems(entities);
			}
		});
	},
	load_stats : function(contact)
	{
		/*
		 * Stores all urls (notes, deals and tasks) in an array to fetch data
		 * using same collection by changing its url.
		 */

		var email = getAllPropertyValuesByName(contact.properties, "email", ",");
		var url = "core/api/emails/imap-email" ;
		if(Current_Route.includes('company') || Current_Route.includes('companies')){
			url = "core/api/emails/imap-comEmail" ;
		}
		// Go for mails when only the contact has an email
		if (email)
		{
			//If passed object type is lead, change the fetch url to fetch lead emails
			if(contact && contact.type == "LEAD")
			{
				url = 'core/api/emails/imap-lead-email';
			}

			this.timline_fetch_data(url + '?e=' + encodeURIComponent(email) + '&c=10&o=0', function(stats)
			{
				console.log(stats);
				
				if(stats && stats["emails"])
				{
					var array = [];
					$.each(stats["emails"], function(index,data){
						// if error occurs in imap (model is obtained with the
						// error msg along with contact-email models),
						// ignore that model
						if(('errormssg' in data) || data.status === "error")
						return;
						
						array.push(data);
						
						});

					if((App_Contacts.contactDetailView && App_Contacts.contactDetailView.model.get('id') !== contact['id'] && Current_Route && Current_Route.indexOf("contact") == 0) || (App_Companies.companyDetailView && App_Companies.companyDetailView.model.get('id') !== contact['id']))
						return;

					if(App_Leads.leadDetailView && App_Leads.leadDetailView.model.get('id') !== contact.id && Current_Route && Current_Route.indexOf("lead") == 0)
						return;

					var contact_emails = [];

					// Add open tracking
					var emails_opened = timeline_entity_loader.getOpenedEmailsFromEmails(stats["emails"]);

					if(emails_opened)
						contact_emails = emails_opened.concat(array);

					if(contact_emails)
						timeline_collection_view.addItems(contact_emails);
				}
				if(stats && stats["emailPrefs"]){
					killAllPreviousRequests();
					var fetch_urls = stats["emailPrefs"];
					var contact_social_emails = [];
					
					for(var i=0;i<fetch_urls.length;i++)
					{
						var xhr = $.ajax({ url : fetch_urls[i]+'&search_email='+encodeURIComponent(email),
							success : function(emails)
							{	
								if(emails)
								{	
									var mail_array = [];
									$.each(emails, function(index,data){
										// if error occurs in imap (model is obtained with the
										// error msg along with contact-email models),
										// ignore that model
										if(('errormssg' in data) || data.status === "error")
										return;
										mail_array.push(data);
										});
									
									if(mail_array.length > 0){
										timeline_collection_view.addItems(mail_array);
									}
							    }
							},
						    error : function(response)
						    {
						    }
						});
						email_requests.push(xhr);
					}
				}
				
				
			})
		}
	},
	load_campaign_logs : function(contactId)
	{
		var url = '/core/api/campaigns/logs/contact/' + contactId + '?cursor=0&page_size=100';
		this
				.timline_fetch_data(
						url,
						function(data)
						{
							if (!data || data.length == 0)
								return;
							var log_models = [];

							$
									.each(
											data,
											function(index, model)
											{

												// Add these log-types in
												// timeline
												if (model.log_type == 'EMAIL_SENT' || model.log_type == 'EMAIL_OPENED' || model.log_type == 'EMAIL_CLICKED' || model.log_type == 'SET_OWNER' || model.log_type == 'SCORE' || model.log_type == 'ADD_DEAL' || model.log_type == 'TWEET' 
													|| model.log_type == 'SMS_SENT' || model.log_type == 'SMS_FAILED' 
													|| model.log_type == 'SMS_LINK_CLICKED' || model.log_type == 'EMAIL_REPLIED')
												{
													log_models.push(model);
												}

											});
							if((App_Contacts.contactDetailView && App_Contacts.contactDetailView.model.get('id') == contactId) || (App_Companies.companyDetailView && App_Companies.companyDetailView.model.get('id') == contactId))
								timeline_collection_view.addItems(log_models);
						})
	}, timline_fetch_data : function(url, callback)
	{
		//$("#timeline-loading-img", App_Contacts.contactDetailView.el).show();
		showTransitionBar();

		console.log(this.active_connections);
		// this.active_connections = true;
		++this.active_connections;
		var _this = this;
		$.getJSON(url, function(data)
		{
			
			console.log("success : " + _this.active_connections);
			--_this.active_connections;
			console.log("success : " + _this.active_connections)
			if (callback && typeof callback === "function")
				callback(data);
			
			if(!_this.active_connections)
				//$(".timeline-loading-img", App_Contacts.contactDetailView.el).hide();
				hideTransitionBar();
		}).error(function()
		{
			-- _this.active_connections;
			
			if(!_this.active_connections)
				//$(".timeline-loading-img", App_Contacts.contactDetailView.el).hide();
				hideTransitionBar();
		});
	}, getOpenedEmailsFromEmails : function(emails)
	{
		var opened_emails = [];
		$.each(emails, function(index, model)
		{
			if (model.email_opened_at && model.email_opened_at !== 0)
			{
				var json = {};

				// Need createdTime key to sort in timeline.
				json.createdTime = (model.email_opened_at) * 1000;

				// Temporary entity to identify timeline template
				json.agile_email = "agile_email";

				json.subject = model.subject;
				json.email_link_clicked_at = (model.email_link_clicked_at) * 1000;
				json.trackerId = model.trackerId;

				// // To avoid merging with emails template having date entity
				// json.date = undefined;

				opened_emails.push(json);
			}

		});

		return opened_emails;
	},

	get_stats : function(email, contact, el)
	{
		var that = this;
		get_web_stats_count_for_domain(function(count){

			// If there are no web-stats - return
			if (!(_agile_get_prefs('_agile_jsapi') != null && _agile_get_prefs('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && count == '0'))
			{
				// Remove loading image of mails
				$('#time-line', el).find('.loading-img-stats').remove();

				return;
			}

			// Made global variable false and set cookie
			NO_WEB_STATS_SETUP = false;
			_agile_set_prefs('_agile_jsapi', true, 500);

			var StatsCollection = Backbone.Collection.extend({});

			that.timline_fetch_data('core/api/web-stats?e=' + encodeURIComponent(email), function(data)
			{

				that.statsCollection = new StatsCollection(data);
				data = that.statsCollection;

				is_mails_fetched = true;
				is_logs_fetched = false;
				is_array_urls_fetched = false;
				var contact_updated_time=0;
				var web_stats_time=0;

			    try{
				    if(data!=null && data.toJSON().length > 0){
				    	if(contact.updated_time!=null){
					    contact_updated_time = new Date(0).setUTCSeconds(contact.updated_time);
					    }
					    if(data.toJSON()[0].stats_time!=null){
					    web_stats_time = new Date(data.toJSON()[0].stats_time).getTime();
					   }
				    }
			    }
			    catch(e){

			     }
            
				// show_timeline_padcontent(is_logs_fetched, is_mails_fetched,
				// is_array_urls_fetched);

				$('#time-line', el).find('.loading-img-stats').remove();

				// Checks whether data is empty or not.
				if (data.toJSON() && data.toJSON().length > 0)
				{

					// Gets address of the contact from its browsing history  
					var address = getPropertyValue(contact.properties, "address");
					//var remote_addr= getPropertyValue(contact.properties, "remote_addr");
					/*if(address){
						var remote_addr=JSON.parse(address).remote_addr;
					}*/
					if (!address)
					{
						var addressJSON = {};


						if (contact_updated_time<=web_stats_time && data.toJSON()[0].city != "" )
						{
							addressJSON.city = ucfirst(data.toJSON()[0].city);
							addressJSON.state = ucfirst(data.toJSON()[0].region);
							addressJSON.country = getCode(data.toJSON()[0].country);

							// If contact has no address property push the new one
							contact.properties.push({ "name" : "address", "value" : JSON.stringify(addressJSON) });

							// Update contact with the browsing address
							var contactModel = new Backbone.Model();
							contactModel.url = 'core/api/contacts';
							contactModel.save(contact, { success : function(obj)
							{
							} });
						}
					}
					if((App_Contacts.contactDetailView && App_Contacts.contactDetailView.model.get('id') == contact['id']) || (App_Companies.companyDetailView && App_Companies.companyDetailView.model.get('id') == contact['id']))
						timeline_collection_view.addItems(data.toJSON());

					addTagAgile(CODE_SETUP_TAG);
				}
			
			});

		});
	}

}
