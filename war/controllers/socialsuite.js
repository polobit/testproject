var StreamsListView;
/**
 * Creates backbone router to create and access streams of the user.
 */
var SocialSuiteRouter = Backbone.Router.extend({

	routes : 
	{		
		//route : function name
		
		//first function on click of tab
		"socialsuite" : "socialsuite",		
		
		//add stream
		"add-stream" : "addStream",
		
		//streams tab with collection
		"streams" : "streams",	
	},
	
   /** on click on social tab this function is called, to initialize social suite,
    * it will include js files
    */
   socialsuite : function() 
    {
		console.log("In SocialSuite router");		
		
		$(".active").removeClass("active");
		$("#socialsuitemenu").addClass("active");	

		$('#content').html(getTemplate('socialsuite'),{});	
		
		//It is added in home.jsp.
		/*$('head').append('<link rel="stylesheet" href="/css/socialsuite.css" type="text/css" />');*/	
				
		head.js('js/designer/ui.js', function(){});		
				
	    /*create pubnub object and channel dedicated for new user or relogin */
		initToPubNub();	
		
		//display added streams 
		this.streams();		
	}, //socialsuite end	
	
	/**
	 * Display list of twitter streams. 
	 */
	addStream : function()
	{				
		console.log("in add stream.");
		
		head.js('js/designer/ui.js', function(){});
		
		//default selected stream
		StreamType = "Home";
		
		$('#content').html(getTemplate('socialsuite'),{});
		$('#socialsuite-tabs-content').html(getTemplate('socialsuite-add-stream'),{});		
	},//addStream end	
	   
	/**
	  * this will create collection and store social suite in that, all columns 
	  * and tweets are displayed from this function and publish msg to register.
	  * 
	  * StreamsListView [streamView (tweetListView [tweet] ) ]
	  */
	streams : function(stream)
	 {			
		console.log("in streams");	
		
		$('#content').html(getTemplate('socialsuite'),{});		
		
		if(!StreamsListView)  //streams not collected from dB
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
	 	        	//user have streams so register all of them on server
	 		 		 registerAll(); 		 		
	 	         }
	 	     });	
		 
		 //create new default function of collection
		 StreamsListView.appendItem = this.socialSuiteAppendItem;		 
		 
		 StreamsListView.collection.fetch({success : function(data)
			    {
	 			  if(stream)
	 				StreamsListView.collection.add(new BaseModel(stream));
		 		}});
	 	
	 	$('#socialsuite-tabs-content').append(StreamsListView.render().el);	 
	 	return;
	  }// if end
		if(StreamsListView != undefined) //streams already collected in collection
			{
			  console.log("Collection already defined.");
			  //new stream to add in collection.
			  if(stream)
				StreamsListView.collection.add(stream);
			  
			  $('#socialsuite-tabs-content').append(StreamsListView.render(true).el);
			  
			    //make columns draggable.		
			    setup_dragging_columns();								
				
				//create normal time.
 		 	    head.js('lib/jquery.timeago.js', function(){	 
 		 		        $(".time-ago", $(".chirp-container")).timeago(); });
			}		
		
		 //remove tweet element from ui
		 $('.deleted').remove();
	 }, //streams end
		
	 socialSuiteAppendItem : function(base_model)
	 {	 
	 	   console.log("base_model in append.");
	 	   
		   var streamView = new Base_List_View({
	 			model : base_model,
	 			"view" : "inline", 		
	 			template :this.options.templateKey+ "-model", 
	 			tagName : 'li',
	 			className :'column ui-state-default span4 '+base_model.get("id"),
	 			id : base_model.get("id"),
	 			name : base_model.get("column_index"),
	 		   });		  
		   
	 	   var tweetListView = new Base_Collection_View
	 		({
	 	         data: [],
	 	         templateKey: 'Column',
	 	         individual_tag_name: 'div', 	                  
	 	     }); 	    
	 	   
	 	  tweetListView.collection.comparator = function(model) 
		    { 		  
		     if (model.get('id'))
			            return -model.get('id');
		    };
	 	   
	 	   //if model has tweets, need to save them
	 	   if(base_model.has("tweetListView"))
	 		   {
	 		      tweetListView.collection.add(base_model.get("tweetListView").toJSON());
	 			  tweetListView.collection.sort() ;	 			
	 		   }	 	   
	 	   
	 	   //add new tweetList View as collection in stream model
            base_model.set('tweetListView', tweetListView.collection);	 		
            
	 		var el = streamView.render().el;
	 		$('#stream', el).html(tweetListView.render(true).el);
	 		$('#socialsuite-streams-model-list', this.el).append(el);	 		
	 }, // socialSuiteAppendItem end
});

var socialsuitecall = new SocialSuiteRouter();