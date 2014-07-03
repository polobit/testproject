var timeline_entity_loader = {

	init : function(contact)
	{
		MONTH_YEARS = [];
		var _this = this;
		// Load plugins for timeline
		head.load("/lib/isotope.pkgd.js", LIB_PATH + "lib/jquery.event.resize.js", "css/misc/agile-timline.css", function()
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
				"deals", "notes", "cases", "tasks"
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

			timeline_collection_view.addItems(entities);
		});
	},
	load_stats : function(contact)
	{
		/*
		 * Stores all urls (notes, deals and tasks) in an array to fetch data
		 * using same collection by changing its url.
		 */

		var email = getPropertyValue(contact.properties, "email");

		// Go for mails when only the contact has an email
		if (email)
		{
			this.timline_fetch_data('core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0', function(stats)
			{
				console.log(stats);
				
				if(stats)
				{
					console.log(stats["emails"]);
					timeline_collection_view.addItems(stats["emails"]);
				}
			})
		}
	},
	load_campaign_logs : function(contactId)
	{
		var url = '/core/api/campaigns/logs/contact/' + contactId;
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

							timeline_collection_view.addItems(log_models);
						})
	}, timline_fetch_data : function(url, callback)
	{
		$("#timeline-loading-img", App_Contacts.contactDetailView.el).show();

		this.active_connections = true;
		$.getJSON(url, function(data)
		{
			if (callback && typeof callback === "function")
				callback(data);
			$(".timeline-loading-img", App_Contacts.contactDetailView.el).hide();
		}).error(function()
		{
			$(".timeline-loading-img", App_Contacts.contactDetailView.el).hide();
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
		// If there are no web-stats - return
		if (!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && get_web_stats_count_for_domain() == '0'))
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

				timeline_collection_view.addItems(data.toJSON());

				addTagAgile(CODE_SETUP_TAG);
			}
		});
	}

}
