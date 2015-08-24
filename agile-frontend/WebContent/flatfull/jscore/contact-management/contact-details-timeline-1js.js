/*var noAnimationBruteForce = true;
var timeline_collection_view;
var MONTH_YEARS;
var month_years = [];

var timeline_view = Backbone.View.extend({ initialize : function()
{
	// Binds functions to view
	_.bindAll(this, 'render', 'appendItem', 'addItems');

	this.options.data = App_Contacts.contactDetailView.model.toJSON().tagsWithTime;
	this.options.data.push(App_Contacts.contactDetailView.model.toJSON());
	// this.options.data.push(App_Contacts.contactDetailView.model.toJSON().tagsWithTime);

	this.collection = new BaseCollection([], {});
	this.month_year_marker = [];
	this.month_year_marker_objects = [];
	configure_timeline_comparator(this.collection);
	this.collection.add(this.options.data, { silent : true });

	load_other_timline_entities();
	this.queue = new Queue;
	this.collection.bind('add', this.appendItem);

}, appendItem : function(model)
{
	if (model.get("entity_type"))
		if (model.get("entity_type") == "year-marker")
		{
			getTemplate("year-marker", model.toJSON(), "yes", function(template)
			{
				$('#timeline', App_Contacts.contactDetailView.el).isotope('insert', $(template));
			});
			return;
		}

	this.collection.add(model, { silent : true });
	var temp = [];
	temp.push(model.toJSON());
	var elements = getTemplate("timeline1", temp, undefined, function(result)
	{
		$('#timeline', App_Contacts.contactDetailView.el).isotope("insert", $(result));
	});

}, addItems : function(models)
{

	this.collection.add(models, { silent : true });
	// this.collection.add(this.month_year_marker_objects, {merge : true})
	this.buildTimlinePosts(models);

	// $("#timeline").append(getTemplate("timeline1", models));
	// $("#timeline").append($(getTemplate("timeline1", models)));
	
	 * getTemplate("timeline1", models, undefined, function(result){
	 * console.log($(result)); $("#timeline",
	 * App_Contacts.contactDetailView.el).isotope('insert', $(result),
	 * function(){ $("#timeline").isotope('reLayout'); }); })
	 * 
	 
}, render : function()
{
	// this.collection.add(this.month_year_marker_objects, {merge : true})
	this.buildTimlinePosts(this.collection.toJSON());
	
	 * if(this.collection.length > 20) { var i = 0; var length =
	 * this.collection.length; while(i < length) { var end = i + 20;
	 * 
	 * end = end > length ? length - 1 : end; if(end == i) break;
	 * console.log(this.collection); console.log(end + ", " + i);
	 * console.log(this.collection.toJSON().slice(i, end)); var _this = this;
	 * //console.log(getTemplate("timeline1", this.collection.toJSON()));
	 * getTemplate("timeline1", this.collection.toJSON().slice(i, end),
	 * undefined, function(result){
	 * 
	 * if(i == 0) { //var _this = this; $("#timeline",
	 * App_Contacts.contactDetailView.el).append(result);
	 * 
	 * //configure_timeline(); } else { var $newEls = $(result);
	 * //$("#timeline").append($newEls).isotope( 'appended', $newEls);
	 * $("#timeline",App_Contacts.contactDetailView.el).isotope('insert',
	 * $(result)); }
	 * 
	 * 
	 * 
	 * _this.queue.add_function(function(models){ alert(models); // return true; },
	 * _this.collection.toJSON().slice(i, end))
	 * 
	 * 
	 * 
	 * }); i += 20; } }
	 * 
	 * 
	 * 
	 * //configure_timeline();
	 * 
	 * 
	 * 
	 * 
	 * 
	 * 
	 * //create_month_marker(MONTH_YEARS, true,
	 * App_Contacts.contactDetailView.model.el);
	 * 
	 * 
	 * 
	 * //$("#timeline").isotope('reLayout'); // Resizes the line height based on
	 * entities overall height /* $('#timeline').resize(function(){
	 * adjust_line(); alert("test"); });
	 
}, buildTimlinePosts : function(models)
{
	var length = models.length;
	if (!length)
		return;

	this.addToQueue(models)
	return;

	var i = 0;
	while (i < length)
	{
		var end = i + 50;

		end = end > length ? length : end;
		if (end == i)
			break;
		this.addToQueue(models.slice(i, end));
		i += 50;
	}
}, addToQueue : function(models)
{
	this.queue.add_function(quedfunction, models);
}

});

function quedfunction(models)
{
	var is_empty_queue;
	// timeline_collection_view.queue.running = true;
	getTemplate("timeline1", models, undefined, function(result)
	{
		$("#timeline").isotope('insert', $(result), function(ele)
		{
			timeline_collection_view.queue.running = false;
			timeline_collection_view.queue.next();
		});
	});
}

function load_timeline_details(el, contactId, callback1, noAnimation)
{
	noAnimationBruteForce = true;
	init_timeline();

}

function init_timeline()
{
	MONTH_YEARS = [];
	// Load plugins for timeline
	head.load("/lib/isotope.pkgd.js", LIB_PATH + "lib/jquery.event.resize.js", "css/misc/agile-timline.css", function()
	{

		configure_timeline();
		timeline_collection_view = new timeline_view();
		timeline_collection_view.render();
		remove_loading_img(App_Contacts.contactDetailView.el);
	});

}

function configure_timeline_comparator(collection)
{

	// Override comparator to sort models on time base
	collection.comparator = function(item)
	{
		var month_year = entity_created_month_year(item.toJSON());

		if (month_year)
			if (timeline_collection_view && timeline_collection_view.month_year_marker.indexOf(month_year) == -1)
			{

				timeline_collection_view.month_year_marker.push(month_year);

				var monthYear = month_year.split('-');
				var timestamp = getTimestamp(monthYear[0], monthYear[1]) / 1000;
				console.log("(((((((((((((((((((((((((((((((((((((" + monthArray[monthYear[0]].split(' ')[0]);
				var context = { year : monthArray[monthYear[0]].split(' ')[0], timestamp : timestamp, "entity_type" : "year-marker" };
				if (!collection.where({ "year" : monthArray[monthYear[0]].split(' ')[0] })[0])
					;
				collection.add(context);

				console.log(context);
				timeline_collection_view.month_year_marker_objects.push(context);
			}

		if (item.get('created_time'))
		{
			return item.get('created_time');
		}
		else if (item.get('createdTime'))
		{
			return item.get('createdTime') / 1000;
		}
		else if (item.get('time'))
		{
			return item.get('time') / 1000;
		}
		else if (item.get('date_secs'))
		{
			return item.get('date_secs') / 1000;
		}
		else if (item.get('timestamp'))
		{
			return timestamp;
		}

		return item.get('id');
	}
}

function configure_timeline()
{
	customize_isotope();

	var $container = $("#timeline", App_Contacts.contactDetailView.el);

	// Initializes isotope with options (sorts the data based on created time)
	$container.isotope({ itemSelector : ".item", transformsEnabled : true, layoutMode : 'spineAlign', spineAlign : { gutterWidth : 56 },
		getSortData : { timestamp : function($elem)
		{
			var time = parseFloat($elem.find('.timestamp').text());

			if (!time)
				return 0;
			// If time is in milliseconds then return time in seconds
			if ((time / 100000000000) > 1)
				return time / 1000;

			return time
		} }, sortBy : 'timestamp', sortAscending : false, itemPositionDataEnabled : true });
}

function load_other_timline_entities()
{
	var contact = App_Contacts.contactDetailView.model.toJSON();
	var contactId = contact['id'];
	
	load_related_entities(contactId);
	load_stats(contact);
	load_campaign_logs(contactId);

}

function load_campaign_logs(contactId)
{
	var url = '/core/api/campaigns/logs/contact/' + contactId;
	$
			.getJSON(
					url,
					function(data)
					{
						if (data.length == 0)
							return;
						var log_models = [];

						$
								.each(
										data,
										function(index, model)
										{

											// Add these log-types in timeline
											if (model.log_type == 'EMAIL_SENT' || model.log_type == 'EMAIL_OPENED' || model.log_type == 'EMAIL_CLICKED' || model.log_type == 'SET_OWNER' || model.log_type == 'SCORE' || model.log_type == 'ADD_DEAL' || model.log_type == 'TWEET')
											{
												log_models.push(model);
											}

										});

						timeline_collection_view.addItems(log_models);
					})
}

function load_stats(contact)
{
	
	 * Stores all urls (notes, deals and tasks) in an array to fetch data using
	 * same collection by changing its url.
	 

	var email = getPropertyValue(contact.properties, "email");


	// Go for mails when only the contact has an email
	if (email)
	{
		get_stats('core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0', contact, App_Contacts.contactDetailView.el, function(stats)
		{
			// Clone emails Array to not affect original emails

			var stats_processed = [];
			if (stats && stats.length > 0)
			{
				for(var i = 0; i < stats.length; i ++)
				{
					// if error occurs in imap (model is obtained with the error msg along with contact-email models),
					// ignore that model
					if(('errormssg' in stats[i]) || stats[i].status === "error")
						continue;
					
					stats_processed.push(stats[i]);
				}
				
				
				// Addes opened emails into timeline
				var opened_emails = getOpenedEmailsFromEmails(stats_processed);
				if (opened_emails.length > 0)
					stats_processed.push(opened_emails);

				timeline_collection_view.addItems(stats_processed);
			}
		})
	}
}

function load_related_entities(contactId)
{
	var entity_types = ["deals", "notes", "cases", "tasks"];

	$.getJSON('core/api/contacts/related-entities/' + contactId, function(data)
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
}

function getOpenedEmailsFromEmails(emails)
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
}

function getTimlineTemplate(models)
{

}

function add_entity_to_timeline(model)
{
	var list = [];
	list.push(model.toJSON())

	// console.log(model.get('id'));

	if (!timeline_collection_view.collection.get(model.get('id')))
	{
		timeline_collection_view.addItems(list);
		return;
	}

	update_entity_template(model);

}

function update_entity_template(model)
{
	$("#" + model.get("id"), $('#timeline', App_Contacts.contactDetailView.el)).html(getTemplate('timeline1', [
		model.toJSON()
	]));
}

function get_stats(email, contact, el)
{
	// If there are no web-stats - return
	if(!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && get_web_stats_count_for_domain() == '0'))
	{
		// Remove loading image of mails
		$('#time-line', el).find('.loading-img-stats').remove();
		
		return;
	}
	
	// Made global variable false and set cookie
	NO_WEB_STATS_SETUP = false;
	createCookie('_agile_jsapi',true, 500);
	
	var StatsCollection = Backbone.Collection.extend({
		                        url:'core/api/web-stats?e='+ encodeURIComponent(email)
		                                             });
	
	this.statsCollection = new StatsCollection();
	statsCollection.fetch({
		success:function(data){
			
			is_mails_fetched = true;
			is_logs_fetched = false;
			is_array_urls_fetched = false;
			
			show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
			
         	$('#time-line', el).find('.loading-img-stats').remove();
			
			// Checks whether data is empty or not.
			if (data.toJSON() && data.toJSON().length > 0) {
				
				// Gets address of the contact from its browsing history
				var address = getPropertyValue(contact.properties, "address");
				
				if(!address)
				{
				var addressJSON = {};
				
				if(data.toJSON()[0].city != "")
				{
				    addressJSON.city = ucfirst(data.toJSON()[0].city);
				    addressJSON.state = ucfirst(data.toJSON()[0].region);
				    addressJSON.country = getCode(data.toJSON()[0].country);
				
					// If contact has no address property push the new one
					contact.properties.push({
					"name" : "address",
					"value" : JSON.stringify(addressJSON)
				                       });
					
					// Update contact with the browsing address
					var contactModel = new Backbone.Model();
					contactModel.url = 'core/api/contacts';
					contactModel.save(contact, {
						success : function(obj) {
						                        }
					                  });
				  }
				}
								
				timeline_collection_view.addItems(data);
				
				
				addTagAgile(CODE_SETUP_TAG);	
			}
			
		},
		error: function(){
			is_mails_fetched = true;
			show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
			
			// Remove loading image of mails
			$('#time-line', el).find('.loading-img-stats').remove();
		}
	});
	}

*//**
 * Removes an element from timeline
 * 
 * @param element
 *//*
function removeItemFromTimeline(element)
{
	console.log(element);
	$('#timeline').isotope('remove', element, function()
	{
		$("#timeline").isotope('reLayout')
	});
}

function addTagToTimelineDynamically(tags)
{	
	timeline_collection_view.addItems([tag]);
}*/