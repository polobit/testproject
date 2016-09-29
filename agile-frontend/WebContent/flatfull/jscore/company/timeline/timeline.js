(function(company_timeline, $, undefined) {
	company_timeline.timeline = function(contact, view)
	{
		this.company = company;
		this.view = view;	
		this.timeline = new timeline(company, view);
	};


	// Add methods like this.  All Person objects will be able to invoke this
	company_timeline.timeline.prototype.buildTimeline = function(){
    	
	};


	var timeline = function(company, view)
	{
		this.company = company;
		this.view = view;
	};

	timeline.prototype.init  = function()
	{

	}

	timeline.prototype.build = function ()
	{
		
	}

}(window.company_timeline = window.company_timeline || {}, $));


function GetTimelineBuilder(templateKey, view, model, appendTo, comparatorFunction)
{
	var view = view;
	var model = model;
	var appendTo = appendTo;
	var comparatorFunction = comparatorFunction;

	var timelineView;
	GetTimelineBuilder.prototype.timeline = function(id, callback)
	{
		if(timelineView && id == model.get('id'))
		{
			$(appendTo, view.el).isotope('destroy');
			if(callback && typeof callback)
				callback();

			return;
		}

		// Load plugins for timeline
		head.load(FLAT_FULL_PATH + "lib/isotope.pkgd.js", FLAT_FULL_PATH + "lib/jquery.event.resize.js", FLAT_FULL_PATH + "css/misc/agile-timline.css", function()
		{
			
			$(appendTo, view.el).isotope('destroy');
			timelineView = new generic_timeline_view ({
				"model" : model,
				"tempateKey" : templateKey,
				"timeline_config" : {
					"appendTo" : appendTo,
					"view" : view,
					"model" : model
				}
			});

				configure_timeline(view.el);

			configure_generic_timeline_comparator(timelineView.collection, timelineView);

			timelineView.render(true);

		



			if(callback && typeof callback)
				callback();
		});
	};
	
	GetTimelineBuilder.prototype.addEntities = function(array)
	{
		timelineView.collection.add(array);
		console.log(timelineView);
	};
}

var generic_timeline_view = Backbone.View.extend({ initialize : function(options)
{
	// Binds functions to view
	_.bindAll(this, 'render', 'appendItem', 'addItems');

	this.options.data = [];
	this.collection = new BaseCollection([], {});
	this.options.data.push(this.model.toJSON());
	this.collection = new BaseCollection([], {});
	this.month_year_marker = [];
	this.month_year_marker_objects = [];
	configure_generic_timeline_comparator(this.collection);

	this.timeline_config = this.options.timeline_config;

	// load_other_timline_entities();
	this.queue = new Queue;
	this.collection.bind('add', this.appendItem);
},
 appendItem : function(model)
{
	var that = this;
	if (model.get("entity_type"))
		if (model.get("entity_type") == "year-marker")
		{

			getTemplate("generic-timeline-year-marker", model.toJSON(), "yes", function(template)
			{
				$(that.timeline_config.appendTo, that.timeline_config.view.el).isotope('insert', $(template));
			});
			return;
		}

	this.collection.add(model, { silent : true });
	var temp = [];
	temp.push(model.toJSON());
	var elements = getTemplate(this.options.tempateKey, temp, undefined, function(result)
	{
		$(that.timeline_config.appendTo, that.timeline_config.view.el).isotope("insert", $(result));
	});
}, addItems : function(models)
{
	this.collection.add(models, { silent : true });
	this.buildTimlinePosts(models)
},
buildTimlinePosts : function(models)
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
},
addToQueue : function(models)
{
	this.queue.add_function(quedfunction, models);
}

});

function configure_generic_timeline_comparator(collection, view)
{

	if (!view)
	{
		view = timeline_collection_view;
	}
	// Override comparator to sort models on time base
	collection.comparator = function(item)
	{
		var month_year = entity_created_month_year(item.toJSON());

		if (month_year)
			if (view && view.month_year_marker.indexOf(month_year) == -1)
			{

				view.month_year_marker.push(month_year);

				var monthYear = month_year.split('-');
				var timestamp = getTimestamp(monthYear[0], monthYear[1]) / 1000;
				var context = { year : monthArray[monthYear[0]].split(' ')[0], timestamp : timestamp, "entity_type" : "year-marker" };
				if (!collection.where({ "year" : monthArray[monthYear[0]].split(' ')[0] })[0])
					;
				collection.add(context);

				console.log(context);
				view.month_year_marker_objects.push(context);
			}

		if (item.get('created_time') && item.get('entity_type') != "event")
		{
			return item.get('created_time');
		}
		if (item.get('entity_type') == "event")
		{
			return item.get('start');
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