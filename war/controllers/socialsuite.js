var StreamsListView;
var TempStreamsListView;
var ScheduledUpdatesView;

/**
 * Creates backbone router to create and access streams of the user.
 */
var SocialSuiteRouter = Backbone.Router.extend({

	routes : 
	{		
		//route : function name
		
		// First function on click of tab
		"social" : "socialsuite",		
				
		// Streams tab with collection
		"streams" : "streams",	
		
		// Scheduled updates on new page
		"scheduledmessages" : "scheduledmessages",
	},
	
   /** On click on social tab this function is called, to initialize social suite,
    * it will include js files.
    */
   socialsuite : function() 
    {
		console.log("In SocialSuite router");	
		initializeSocialSuite();
		
		// Makes tab active
		$(".active").removeClass("active");
		$("#socialsuitemenu").addClass("active");	

		// Gets template to display.
		$('#content').html(getTemplate('socialsuite-show-streams'),{});	
						
	    /* Creates pubnub object and channel dedicated for new user or relogin */
		initToPubNub();	
		
		// Display added streams 
		this.streams();			
	}, // socialsuite end	
				   
	/**
	  * This will create collection and store social suite in that, all streams 
	  * and tweets are displayed from this function and publish msg to register.
	  * 
	  * Format : StreamsListView [streamView (tweetListView [tweet] ) ]
	  */
	streams : function(stream)
	 {			
		$('#content').html(getTemplate('socialsuite-show-streams'),{});	
		
		// Check scheduled updates.
		checkScheduledUpdates();
		
		if(!StreamsListView)  // Streams not collected from dB
		{			
		 console.log("Creating Collection First Time.");
		 StreamsListView = new Base_Collection_View
	 		({
	 			 url : "/core/social",
	 	         restKey: "stream",
	 	         templateKey: "socialsuite-streams",
	 	         individual_tag_name: 'div', 
	 	         className :'app-content container clearfix',
	 	         id : 'stream_container',        
	 	         
	 	         postRenderCallback : function(el)
	 	         {
	 	        	// User have streams so register all of them on server
	 		 		 registerAll(0); 		 		
	 	         }
	 	     });	
		 
		 // Creates new default function of collection
		 StreamsListView.appendItem = this.socialSuiteAppendItem;		 
		 
		 StreamsListView.collection.fetch({success : function(data)
			    {
	 			  if(stream)
	 				StreamsListView.collection.add(new BaseModel(stream));
		 		}});
	 	
	 	$('#socialsuite-tabs-content').append(StreamsListView.render().el);	
	 	
	    // Creates temporary collection to store tweets when user not in social tab.
		 createTempCollection();
		
	 	return;
	  }// if end
		if(StreamsListView != undefined) // Streams already collected in collection
			{
			  console.log("Collection already defined.");
			  		  
			  // New stream to add in collection.
			  if(stream)
				{
				  StreamsListView.collection.add(stream);				  
				}	
			 		  			  
			  $('#socialsuite-tabs-content').append(StreamsListView.render(true).el);
			  
			  // Creates normal time.
 		 	  head.js('lib/jquery.timeago.js', function(){	 
 		 		        $(".time-ago", $(".chirp-container")).timeago(); });
 		 	  
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
		   var streamView = new Base_List_View({
	 			model : base_model,
	 			"view" : "inline", 		
	 			template :this.options.templateKey+ "-model", 
	 			tagName : 'li',
	 			className :'column ui-state-default span4 '+base_model.get("id"),
	 			id : base_model.get("id"),
	 			name : base_model.get("column_index"),
	 		   });		  
		   
		   // Tweet collection in stream model
	 	   var tweetListView = new Base_Collection_View
	 		({
	 	         data: [],
	 	         templateKey: 'Column',
	 	         individual_tag_name: 'div', 	                  
	 	     }); 	    
	 	   
	 	   // Comparator to sort tweets in tweet collection
	 	  tweetListView.collection.comparator = function(model) 
		    { 		  
		     if (model.get('id'))
			            return -model.get('id');
		    };
	 	   
	 	   // If model has tweets, need to save them, when user change tab from social
	 	   if(base_model.has("tweetListView"))
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
	 
	 /** On click on scheduled update time button in socialsuite will 
	  * display scheduled updates if user have any.
	  */
	 scheduledmessages : function() 
	    {
			console.log("In scheduledmessages.");	
						
			// Makes tab active
			$(".active").removeClass("active");

			// Gets template to display.
			$('#content').html(getTemplate('socialsuite-scheduled-updates'),{});
			
		    ScheduledUpdatesView = new Base_Collection_View
			     ({
				     url : "/core/scheduledupdate/getscheduledupdates",
				     restKey: "scheduledUpdate",
				     templateKey: "socialsuite-scheduled-updates",				     			    
				     individual_tag_name: 'tr',
				 });	
				  
			ScheduledUpdatesView.collection.fetch();	  
						  
			$('#socialsuite-scheduled-updates-content').append(ScheduledUpdatesView.render(true).el);  
							
		}, // scheduledmessages end	
});

// Global variable to call function from Router.
var socialsuitecall = new SocialSuiteRouter();