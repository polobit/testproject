var lead_timeline_view = Backbone.View.extend({ initialize : function()
{
	// Binds functions to view
	_.bindAll(this, 'render', 'appendItem', 'addItems');

	this.options.data = [];
	// this.options.data.concat();
	this.options.data.push(App_Leads.leadDetailView.model.toJSON());

	console.log(App_Leads.leadDetailView.model.toJSON().tagsWithTime);
	console.log(this.options.data);

	this.collection = new BaseCollection([], {});
	this.month_year_marker = [];
	this.month_year_marker_objects = [];
	configure_timeline_comparator(this.collection);

	this.collection.add(App_Leads.leadDetailView.model.toJSON().tagsWithTime, { silent : true });
	this.collection.add(this.options.data, { silent : true });

	// load_other_timline_entities();
	this.queue = new Queue;
	// this.render();
	this.collection.bind('add', this.appendItem);

}, appendItem : function(model)
{
	if (model.get("entity_type"))
		if (model.get("entity_type") == "year-marker")
		{
			getTemplate("year-marker", model.toJSON(), "yes", function(template)
			{
				$('#timeline', App_Leads.leadDetailView.el).isotope('insert', $(template));
			});
			return;
		}

	this.collection.add(model, { silent : true });
	var temp = [];
	temp.push(model.toJSON());
	var elements = getTemplate("timeline1", temp, undefined, function(result)
	{
		$('#timeline', App_Leads.leadDetailView.el).isotope("insert", $(result));
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
	this.queue.add_function(leadQuedfunction, models);
}

});

function leadQuedfunction(models)
{
	var is_empty_queue;
	// timeline_collection_view.queue.running = true;
	getTemplate("timeline1", models, undefined, function(result)
	{
		$("#timeline", $(App_Leads.leadDetailView.el)).isotope('insert', $(result), function(ele)
		{
			timeline_collection_view.queue.running = false;
			timeline_collection_view.queue.next();
		});
	});
}