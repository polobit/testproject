var noAnimationBruteForce = true;
var timeline_collection_view;
var MONTH_YEARS;
var month_years = [];

var timeline_view = Backbone.View.extend({ initialize : function()
{
	// Binds functions to view
	_.bindAll(this, 'render', 'appendItem', 'addItems');

	this.options.data = [];
	// this.options.data.concat();
	this.options.data.push(App_Contacts.contactDetailView.model.toJSON());

	console.log(App_Contacts.contactDetailView.model.toJSON().tagsWithTime);
	console.log(this.options.data);
	// this.options.data.push(App_Contacts.contactDetailView.model.toJSON().tagsWithTime);

	this.collection = new BaseCollection([], {});
	this.month_year_marker = [];
	this.month_year_marker_objects = [];
	configure_timeline_comparator(this.collection);

	this.collection.add(App_Contacts.contactDetailView.model.toJSON().tagsWithTime, { silent : true });
	this.collection.add(this.options.data, { silent : true });

	//load_other_timline_entities();
	this.queue = new Queue;
//	this.render();
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
	this.buildTimlinePosts(models);

}, render : function()
{
	this.buildTimlinePosts(this.collection.toJSON());

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
		$("#timeline", $(App_Contacts.contactDetailView.el)).isotope('insert', $(result), function(ele)
		{
			timeline_collection_view.queue.running = false;
			timeline_collection_view.queue.next();
		});
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