var ticket_timeline_collection_view = null;
var Ticket_Timeline = {
	render_ticket_timeline: function(ticket_id){

		//Removing existing items from view
		var $timeline = $('#timeline', App_Ticket_Module.ticketView.el);
		try{
			var $allAtoms = $timeline.data('isotope').$allAtoms;
    		$timeline.isotope( 'remove', $allAtoms );
    	}catch(e){}

		// Load plugins for timeline
		head.load(FLAT_FULL_PATH + "lib/isotope.pkgd.js", FLAT_FULL_PATH + "lib/jquery.event.resize.js", FLAT_FULL_PATH + "css/misc/agile-timline.css", function()
		{
			// customize_isotope()
			configure_timeline(App_Ticket_Module.ticketView.el);
			ticket_timeline_collection_view = new ticket_timeline_view();

			var url = 'core/api/tickets/activity?id=' + ticket_id;

			showTransitionBar();

			$.getJSON(url, function(data)
			{
				ticket_timeline_collection_view.addItems(data);

				hideTransitionBar();
			}).error(function(){ hideTransitionBar(); });

			ticket_timeline_collection_view.render();
		});
	},

	render_individual_ticket_timeline: function(){

		$('#notes-collection-container').html(getRandomLoadingImg());

		//Fetching users collection
		var collection_def = Backbone.Collection.extend({url : 'core/api/tickets/activity?id=' + Current_Ticket_ID});
		var collection = new collection_def();

		collection.fetch({ success : function(){

			// To timeline in sorting(dec) order
			var data = new BaseCollection(collection.toJSON(), {sortKey : "created_time",descending:false}).toJSON();

			var $template = $(getTemplate("ticket-timeline", data));

			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$("time", $template).timeago();
			});

			//Initialize tooltips
			$('[data-toggle="tooltip"]', $template).tooltip();

			$('#notes-collection-container').html($template);
			
		}}

		);

	}
};	

var ticket_timeline_view = Backbone.View.extend({ 
	initialize : function()
	{
		// Binds functions to view
		_.bindAll(this, 'render', 'appendItem', 'addItems');

		this.options.data = [];

		this.collection = new BaseCollection([], {});
		this.month_year_marker = [];
		this.month_year_marker_objects = [];
		configure_timeline_comparator(this.collection);

		// load_other_timline_entities();
		this.queue = new Queue;

		// this.render();
		this.collection.bind('add', this.appendItem);
	}, 
	appendItem : function(model)
	{
		this.collection.add(model, { silent : true });
		var temp = [];
		temp.push(model.toJSON());
		var elements = getTemplate("timeline1", temp, undefined, function(result)
		{
			$('#timeline', App_Ticket_Module.ticketView.el).isotope("insert", $(result));
		});
	}, 
	addItems : function(models)
	{
		this.collection.add(models, { silent : true });
		this.buildTimlinePosts(models);

	}, 
	render : function()
	{
		this.buildTimlinePosts(this.collection.toJSON());
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
		this.queue.add_function(function(models){

			getTemplate("timeline1", models, undefined, function(result)
			{
				$("#timeline", $(App_Ticket_Module.ticketView.el)).isotope('insert', $(result), function(ele)
				{
					ticket_timeline_collection_view.queue.running = false;
					ticket_timeline_collection_view.queue.next();
				});
			});

		}, models);
	}
});