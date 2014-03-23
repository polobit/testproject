var Streams_List_View;
var Temp_Streams_List_View;
var Scheduled_Updates_View;
var Past_Tweets = [];
var Pubnub = null;
var Message_Model;

/**
 * Creates backbone router to create and access streams of the user.
 */
var SocialSuiteRouter = Backbone.Router.extend({

	routes : {
	// route : function name

	// First function on click of tab
	"social" : "socialsuite",

	// Streams tab with collection
	"streams" : "streams",

	// Scheduled updates on new page
	"scheduledmessages" : "scheduledmessages",

	// Scheduled updates on new page
	"scheduledmessages/:id" : "scheduledmessagesEdit",

	},

	/**
	 * On click on social tab this function is called, to initialize social
	 * suite, it will include js files.
	 */
	socialsuite : function()
	{
		console.log("In SocialSuite router");
		initializeSocialSuite();

		// Makes tab active
		$(".active").removeClass("active");
		$("#socialsuitemenu").addClass("active");

		// Gets template to display.
		$('#content').html(getTemplate('socialsuite-show-streams'), {});

		/* Creates pubnub object and channel dedicated for new user or relogin */
		initToPubNub();

		// Display added streams
		this.streams();
	}, // socialsuite end

	/**
	 * This will create collection and store social suite in that, all streams
	 * and tweets are displayed from this function and publish msg to register.
	 * 
	 * Format : Streams_List_View [streamView (tweetListView [tweet] ) ]
	 */
	streams : function(stream)
	{
		$('#content').html(getTemplate('socialsuite-show-streams'), {});

		// Check scheduled updates.
		checkScheduledUpdates();

		if (!Streams_List_View) // Streams not collected from dB
		{
			console.log("Creating Collection First Time.");
			Streams_List_View = new Base_Collection_View({ url : "/core/social", restKey : "stream", templateKey : "socialsuite-streams",
				individual_tag_name : 'div', className : 'app-content container clearfix', id : 'stream_container',

				postRenderCallback : function(el)
				{
					// User have streams so register all of them on server
					registerAll(0);
				} });

			// Creates new default function of collection
			Streams_List_View.appendItem = this.socialSuiteAppendItem;

			Streams_List_View.collection.fetch({ success : function(data)
			{
				if (stream)
					Streams_List_View.collection.add(new BaseModel(stream));
			} });

			$('#socialsuite-tabs-content').append(Streams_List_View.render().el);

			// Creates temporary collection to store tweets when user not in
			// social tab.
			createTempCollection();

			return;
		}// if end
		if (Streams_List_View != undefined) // Streams already collected in
		// collection
		{
			console.log("Collection already defined.");

			// New stream to add in collection.
			if (stream)
			{
				Streams_List_View.collection.add(stream);
			}

			$('#socialsuite-tabs-content').append(Streams_List_View.render(true).el);

			// Creates normal time.
			head.js('lib/jquery.timeago.js', function()
			{
				$(".time-ago", $(".chirp-container")).timeago();
			});

			// Check for new tweets and show notification.
			checkNewTweets();
		}

		// Remove deleted tweet element from ui
		$('.deleted').remove();

		// Remove waiting symbol.
		removeWaiting();
	}, // streams end

	/**
	 * Append Model and Collection with Models in Collection.
	 */
	socialSuiteAppendItem : function(base_model)
	{
		console.log("base_model in append.");

		// Stream model in main collection
		var streamView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'li',
			className : 'column ui-state-default span4 ' + base_model.get("id"), id : base_model.get("id"), name : base_model.get("column_index"), });

		// Tweet collection in stream model
		var tweetListView = new Base_Collection_View({ data : [], templateKey : 'Column', individual_tag_name : 'div', });

		// Comparator to sort tweets in tweet collection
		tweetListView.collection.comparator = function(model)
		{
			if (model.get('id'))
				return -model.get('id');
		};

		// If model has tweets, need to save them, when user change tab from
		// social
		if (base_model.has("tweetListView"))
		{
			tweetListView.collection.add(base_model.get("tweetListView").toJSON());
			tweetListView.collection.sort();
		}

		// Add new tweetList View as collection in stream model
		base_model.set('tweetListView', tweetListView.collection);

		var el = streamView.render().el;
		$('#stream', el).html(tweetListView.render(true).el);
		$('#socialsuite-streams-model-list', this.el).append(el);
	}, // socialSuiteAppendItem end

	/**
	 * On click on scheduled update time button in socialsuite will display
	 * scheduled updates if user have any.
	 */
	scheduledmessages : function()
	{
		console.log("In scheduledmessages.");
		
		$('#socialsuite_twitter_messageModal').remove();

		// Makes tab active
		$(".active").removeClass("active");

		// Gets template to display.
		$('#content').html(getTemplate('socialsuite-scheduled-updates'), {});

		Scheduled_Updates_View = new Base_Collection_View({ url : "/core/scheduledupdate", restKey : "scheduledUpdate",
			templateKey : "socialsuite-scheduled-updates", individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				// Creates normal time.
				head.js('lib/jquery.timeago.js', function()
				{
					$(".time-ago", $(".is-actionable")).timeago();
				});
			}, });

		Scheduled_Updates_View.collection.fetch();

		$('#socialsuite-scheduled-updates-content').append(Scheduled_Updates_View.render(true).el);

	}, // scheduledmessages end

	/**
	 * On click of scheduled update it will open message modal. And on click of
	 * schedule it will save modified scheduled update.
	 */
	scheduledmessagesEdit : function(id)
	{		
		console.log("In scheduledmessages Edit." + id);

		$('#socialsuite_twitter_messageModal').remove();
		
		// Navigates to list of scheduled updates, if it is not defined
		if (!Scheduled_Updates_View || Scheduled_Updates_View.collection.length == 0)
		{
			console.log("hi");
			this.navigate("scheduledmessages", { trigger : true });
			return;
		}

		// Gets the template form its collection
		var selectedUpdate = Scheduled_Updates_View.collection.get(id);
		console.log(selectedUpdate);

		Scheduled_Edit = true;

		Message_Model = new Base_Model_View({ url : '/core/scheduledupdate', model : selectedUpdate, template : "socialsuite-twitter-message",
			modal : '#socialsuite_twitter_messageModal', window : 'scheduledmessages', postRenderCallback : function(el)
			{
				$('.modal-backdrop').remove();

				console.log("Schedule edit postrender");

				$('#socialsuite_twitter_messageModal', el).modal('show');

			}, saveCallback : function(data)
			{
				console.log('Message_Model save callback');
				console.log(data);

				// Hide message modal.
				$('#socialsuite_twitter_messageModal').modal('hide');
				$('#socialsuite_twitter_messageModal').remove();

				Scheduled_Edit = false;
			} });

		var view = Message_Model.render();

		$('#socialsuite-scheduled-updates-content').append(view.el);

		$("#tweet_scheduling").click();
		$('input.date', $('#schedule_controls')).val((new Date(selectedUpdate.toJSON().scheduled_date * 1000)).toLocaleDateString());
		scheduledRangeCheck();
	}, // scheduledmessagesEdit end
});

// Global variable to call function from Router.
var socialsuitecall = new SocialSuiteRouter();
