/**
 *  Fill details of stream in add-stream form and arrange elements as per requirement.
 */
function fillStreamDetail()
{	
	StreamType = null;	
	NetworkType = null;
	
	// Remove keyword input element
	 $('.remove-keyword').remove();
	 
	// Oauth required warning and link hidden. 
	$("#oauth_link").hide();	
	$("#twitter_warning").hide();	
	
	// profile image and screen name is hidden.
	$("#account_description").hide();	
	
	// Div where Lists are going to display, is hidden when form open.  
	$("#select_stream").hide();

	// Add button for linkedin is hidden.
	$('#add_linkedin_stream').hide();

	// Add Twitter stream button visible.
	$('#add_twitter_stream').show();   

	// Empty screen name means Oauth is not done.
	$("#twitter_account", $('#addStreamModal')).attr("value",'');
    		
	// Add value to hidden input element.
	$("#domain_user_id", $('#addStreamModal')).attr("value",CURRENT_DOMAIN_USER.id);	
	$("#client_channel", $('#addStreamModal')).attr("value",CURRENT_DOMAIN_USER.id + "_Channel");	
	
	// Display default description for selection of social network.
	document.getElementById('network_type_description_label').innerHTML='<i class="icon-sitemap"></i> You can select your favorite social network type.';
}

// Hide twitter warning, when user going to click on Oauth link.
function hideWarning() {		
	// Hide warning about authentication access.
	$("#twitter_warning").hide();
};

/**
 * Shows setup if user adds LinkedIn stream. Uses ScribeServlet 
 * to create a stream and save it to the dB.
 */
function setupSocialSuiteLinkedinOAuth()
{
    // URL to return, after fetching token and secret key from LinkedIn
    var callbackURL = window.location.href;

    /*
     * Creates a URL, which on click can connect to scribe using parameters sent
     * and returns back to the profile based on return URL provided and saves widget  
     * preferences in widget based on plugin id
     */
    var url = '/scribe?service=linkedin&return_url=' + encodeURIComponent(callbackURL) +
        '&stream_type=' + encodeURIComponent(StreamType);

    // Shows a link button in the UI which connects to the above URL
    $('#add_linkedin_stream').attr("href",url);    
}

/**
 *  Register all streams on server
 */
function registerAll()
{ 	
  var streamsJSON = StreamsListView.collection.toJSON();
		
  // Streams not available OR streams already registered OR pubnub not initialized	
  if(streamsJSON == null || registerAllDone == true || pubnub == null)
	{
	  console.log("registerAllDone : "+registerAllDone);
	  return;
	}

   console.log("In registerAll have streams.");       
   console.log(streamsJSON);
	  	
   // Get stream
   $.each(streamsJSON, function(i, stream)
	 {	  		       
	    /* Publish data to register on server */
	 	var publishJSON = {"message_type":"register", "stream":stream};
	    sendMessage(publishJSON);
	 });
   
   // All added streams registered. 
   registerAllDone = true;
   console.log("registerAllDone : "+registerAllDone);  
}

/**
 * Add relevant profile img to stream in column header.
 */
function addUserImgToColumn(stream)
{	
	  // Get stream from collection.
	  var modelStream = StreamsListView.collection.get(stream.id);	 
	  console.log(modelStream);
	  
	  console.log("to get profile img url");
	  
	  // Fetching profile image url from twitter/linkedin server    											  	
	  $.get("/core/social/getprofileimg/" + stream.id, 
			    function (url)
			    {
			      console.log("profile img url");
				  console.log(url);
				  
	              modelStream.set("profile_img_url",url);
	              console.log(modelStream.toJSON());
	            	
	              // Append in collection 			
	    		  socialsuitecall.streams(modelStream);

	    		  // Get network updates from linkedin
	    		  if(stream.stream_type == "All_Updates")	    			  
	    		     getSocialSuiteLinkedInNetworkUpdates(stream);
   			    });  
}

/**
 * Add tweet in stream.
 */
function handleMessage(tweet)
{		
  // Add type of message
  tweet["msg_type"] = "Tweet";
	
  // We need this messages to reflect actions in all added relevant streams.
  if(tweet.delete != null)
	  {
	    console.log("delete tweet");
	    return;
	  }
  
  // Get stream from collection.
  var modelStream = StreamsListView.collection.get(tweet.stream_id);	 
  console.log(modelStream);
  
  if(modelStream != null || modelStream != undefined)
	{		
	 // Searchs tweet owner's kloutscore.
	 // Fetches tweet owner's klout id.
	 var url = "http://api.klout.com/v2/identity.json/twitter?screenName="+tweet.user.screen_name+"&key=89tdcs5g6ztxvef3q72mwzc6&callback=?";

     $.getJSON( url , function(data) {
    	 console.log(data);   
        })
     .success(function( data ){
        console.log(data);      
    	
   	    // Fetches tweet owner's klout score.
    	url = "http://api.klout.com/v2/user.json/"+data.id+"/score?key=89tdcs5g6ztxvef3q72mwzc6&callback=?";
    	      
    	$.getJSON( url, function(data) {
    		  console.log(data);
    	    })
    	 .success( function( userScore ){
    		// On mouse focus on profile img of tweet shows klout score
            console.log(tweet.user.screen_name +" screen_name : klout_score " + userScore.score);
            tweet["klout_score"] = Math.round(userScore.score);
            
            addTweetToStream(modelStream,tweet);           
           }) // Get klout score of user end
         .error(function( jqxhr, textStatus, error ) {
       	   var err = textStatus + ", " + error;
       	   console.log( "klout score of user end Request Failed: " + err );
       	   addTweetToStream(modelStream,tweet);
       	   });
         })// Get klout id of user end
       .error(function( jqxhr, textStatus, error ) {
    	   var err = textStatus + ", " + error;
    	   console.log( "klout id of user end Request Failed: " + err );
    	   addTweetToStream(modelStream,tweet);
    	   });
	}// If end
}

/**
 * Add Tweet to relevant stream with some extra tags as per requirement.
 */
function addTweetToStream(modelStream,tweet)
{
	// If stream owner is tweet owner no need to show retweet icon.
    if(modelStream.get('screen_name') != tweet.user.screen_name)            	
       tweet["tweetowner_not_streamuser"] = true;      

    // If stream is Sent or tweet owner is stream owner then show delete option.
    if(tweet.stream_type == "Sent" || modelStream.get('screen_name') == tweet.user.screen_name)
    	 tweet["deletable_tweet"] = true;
    
    // If tweet is DM then show delete options and hide other options.
    if(tweet.stream_type == "DM_Inbox" || tweet.stream_type == "DM_Outbox")
      {
    	tweet["direct_message"] = true;
        tweet["deletable_tweet"] = true;
      }
    
    console.log("for add "+modelStream.get('tweetListView').length);
		
    // Sort stream on tweet id basis which is unique and recent tweet has highest value.
	modelStream.get('tweetListView').comparator = function(model) 
	 { 		  
	  if (model.get('id'))
	     return -model.get('id');
	 };
	   
	 // Add tweet to stream.
	 modelStream.get('tweetListView').add(tweet);	
	   
	 // Sort stream on id. so recent tweet comes on top.
	 modelStream.get('tweetListView').sort() ;	   
	   
	 // Create normal time.
	 head.js('lib/jquery.timeago.js', function(){	 
		        $(".time-ago", $(".chirp-container")).timeago();	
			});
}

// Make columns draggable.
function setup_dragging_columns()
{
	console.log("in setup_dragging_columns");
	console.log("StreamsListView : ");console.log(StreamsListView);
	
	head.js('http://code.jquery.com/ui/1.10.3/jquery-ui.js',
			function()
			   {
				$('ul.columns').sortable({
					  change:function(event, ui)
					     {  
						  $('#socialsuite-streams-model-list > li').scrollLeft($(this).position().left);
					     }, //change end
					  update: function(event, ui) 
					    {						  						  
						  console.log("StreamsListView : ");console.log(StreamsListView);
						  var id = ui.item[0].id;
						  console.log("ui :");console.log(ui);
						  console.log("ui.item[0] :");console.log(ui.item[0]);
						  console.log("id :"+id);
						  console.log("ui.originalPosition :");console.log(ui.originalPosition);
						  console.log("ui.currentPosition :");console.log(ui.position);
						  
						  var oldColumn = StreamsListView.collection.get(id).toJSON();
						  console.log("oldColumn :");console.log(oldColumn);
						  
						  var newColumn = $(this).html();
						  console.log("newColumn :");console.log(newColumn);							
					    },// Update end
					 }); // Sortable end
				 $('ul.columns').disableSelection();
			   });	
}// Setup_column_in_columns end
