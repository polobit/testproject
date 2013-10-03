var StreamsListView;
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
	},
	
   /** On click on social tab this function is called, to initialize social suite,
    * it will include js files.
    */
   socialsuite : function() 
    {
		console.log("In SocialSuite router");		
		
		// Makes tab active
		$(".active").removeClass("active");
		$("#socialsuitemenu").addClass("active");	

		// Gets template to display.
		$('#content').html(getTemplate('socialsuite'),{});	
						
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
		console.log("in streams");	
		
		$('#content').html(getTemplate('socialsuite-show-streams'),{});		
		
		if(!StreamsListView)  // Streams not collected from dB
		{			
		 console.log("Creating Collection First Time.");
		 StreamsListView = new Base_Collection_View
	 		({
	 			 url : "/core/social",
	 	         restKey: "stream",
	 	         templateKey: "socialsuite-streams",
	 	         individual_tag_name: 'div', 
	 	         className :'app-content container span12 clearfix',
	 	         id : 'stream_container',        
	 	         
	 	         postRenderCallback : function(el)
	 	         {
	 	        	// User have streams so register all of them on server
	 		 		 registerAll(); 		 		
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
	 	return;
	  }// if end
		if(StreamsListView != undefined) // Streams already collected in collection
			{
			  console.log("Collection already defined.");
			  
			  // New stream to add in collection.
			  if(stream)
				StreamsListView.collection.add(stream);
			  
			  $('#socialsuite-tabs-content').append(StreamsListView.render(true).el);
			  
			    // Makes columns draggable.		
			    setup_dragging_columns();								
				
				// Creates normal time.
 		 	    head.js('lib/jquery.timeago.js', function(){	 
 		 		        $(".time-ago", $(".chirp-container")).timeago(); });
			}		
		
		 // Remove deleted tweet element from ui
		 $('.deleted').remove();		
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
	 			  tweetListView.collection.sort() ;	 			
	 		   }	 	   
	 	   
	 	   // Add new tweetList View as collection in stream model
            base_model.set('tweetListView', tweetListView.collection);	 		
            
	 		var el = streamView.render().el;
	 		$('#stream', el).html(tweetListView.render(true).el);
	 		$('#socialsuite-streams-model-list', this.el).append(el);	 		
	 }, // socialSuiteAppendItem end
});

// Global variable to call function from Router.
var socialsuitecall = new SocialSuiteRouter();