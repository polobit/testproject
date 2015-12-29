var timeline_entity_loader = {

	init : function(contact)
	{
		this.active_connections = 0;
		MONTH_YEARS = [];
		var _this = this;
		// Load plugins for timeline
		head.load(FLAT_FULL_PATH + "lib/isotope.pkgd.js", FLAT_FULL_PATH + "lib/jquery.event.resize.js", FLAT_FULL_PATH + "css/misc/agile-timline.css", function()
		{
			// customize_isotope()
			configure_timeline();
			timeline_collection_view = new timeline_view();
			console.log(_this);
			_this.load_other_timline_entities(contact);

			timeline_collection_view.render();
			// timeline_collection_view.render();

		});
	},
	load_other_timline_entities : function(contact)
	{
		var contactId = contact['id'];

		this.load_related_entites(contactId);
		this.load_stats(contact);
		this.load_campaign_logs(contactId);
		
		this.get_stats(getPropertyValue(contact.properties, "email"), contact, App_Contacts.contactDetailView.el);
	},
	load_related_entites : function(contactId)
	{
		var entity_types = [
				"deals", "notes", "cases", "tasks","calls","events"
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
			
			if(App_Contacts.contactDetailView.model.get('id') == contactId)
			timeline_collection_view.addItems(entities);
		});
	},
	load_stats : function(contact)
	{
		/*
		 * Stores all urls (notes, deals and tasks) in an array to fetch data
		 * using same collection by changing its url.
		 */

		var email = getAllPropertyValuesByName(contact.properties, "email", ",");

		// Go for mails when only the contact has an email
		if (email)
		{
			this.timline_fetch_data('core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0', function(stats)
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

					var emails=[]

					if(App_Contacts.contactDetailView.model.get('id') == contact.id)
						emails = array;

					// Add open tracking
					var emails_opened = timeline_entity_loader.getOpenedEmailsFromEmails(stats["emails"]);

					if(emails_opened)
						emails.concat(emails_opened);

					if(emails)
						timeline_collection_view.addItems(emails);
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
												if (model.log_type == 'EMAIL_SENT' || model.log_type == 'EMAIL_OPENED' || model.log_type == 'EMAIL_CLICKED' || model.log_type == 'SET_OWNER' || model.log_type == 'SCORE' || model.log_type == 'ADD_DEAL' || model.log_type == 'TWEET')
												{
													log_models.push(model);
												}

											});
							if(App_Contacts.contactDetailView.model.get('id') == contactId)
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
			
			console.log("success : " + _this.active_connections)
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
				// Need createdTime key to sort in timeline.
				model.createdTime = (model.email_opened_at) * 1000;

				// Temporary entity to identify timeline template
				model.agile_email = "agile_email";

				// To avoid merging with emails template having date entity
				model.date = undefined;

				opened_emails.push(model);
			}

		});

		return opened_emails;
	},

	get_stats : function(email, contact, el)
	{
		get_web_stats_count_for_domain(function(count){

			// If there are no web-stats - return
			if (!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && count == '0'))
			{
				// Remove loading image of mails
				$('#time-line', el).find('.loading-img-stats').remove();

				return;
			}

			// Made global variable false and set cookie
			NO_WEB_STATS_SETUP = false;
			createCookie('_agile_jsapi', true, 500);

			var StatsCollection = Backbone.Collection.extend({});

			this.timline_fetch_data('core/api/web-stats?e=' + encodeURIComponent(email), function(data)
			{

				this.statsCollection = new StatsCollection(data);
				data = statsCollection;

				is_mails_fetched = true;
				is_logs_fetched = false;
				is_array_urls_fetched = false;

				// show_timeline_padcontent(is_logs_fetched, is_mails_fetched,
				// is_array_urls_fetched);

				$('#time-line', el).find('.loading-img-stats').remove();

				// Checks whether data is empty or not.
				if (data.toJSON() && data.toJSON().length > 0)
				{

					// Gets address of the contact from its browsing history
					var address = getPropertyValue(contact.properties, "address");

					if (!address)
					{
						var addressJSON = {};

						if (data.toJSON()[0].city != "")
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
					if(App_Contacts.contactDetailView.model.get('id') == contact.id)
					timeline_collection_view.addItems(data.toJSON());

					addTagAgile(CODE_SETUP_TAG);
				}
			});

		});
	}

}
