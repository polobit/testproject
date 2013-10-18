/**
 *  Fill details of stream in add-stream form and arrange elements as per requirement.
 */
function fillStreamDetail()
{	
	 // Network Type not selected
	 NetworkType = null;
	 
	 // Stream Type not selected
	 StreamType = null;

	// Empty screen name means Oauth is not done.
	$("#twitter_account", $('#addStreamModal')).attr("value",'');

	// Empty stream type.
	$("#stream_type", $('#addStreamModal')).attr("value",'');
	
	//remove keyword input element
	$('.remove-keyword').remove();
    		
	// Add value to hidden input element.
	$("#domain_user_id", $('#addStreamModal')).attr("value",CURRENT_DOMAIN_USER.id);	
	$("#client_channel", $('#addStreamModal')).attr("value",CURRENT_DOMAIN_USER.id + "_Channel");
	
	// Add button for twitter is hidden.
	$('#add_twitter_stream').hide();
	
	// Add button for linkedin is hidden.
	$('#add_linkedin_stream').hide();
	
	// To hide stream type description.
	document.getElementById("stream_description_label").className = 'description-hidden txt-mute';
	
	// Empty hidden profile image on form.	
	$('#twitter_profile_img_url').attr("src","");
}

// Calls from Profile image onload to fill account holder's name in Form.
function onloadProfileImg()
{
	// Add button for twitter is shown.
	$('#add_twitter_stream').show();
		
	// Add button for linkedin is hidden.
	$('#add_linkedin_stream').hide();
		    		
    // Add twitter stream types template.
	$("#streamDetails").html(getTemplate('twitter-stream-type'),{});	
	
	// Add profile image to account description.	
	$('#twitter_profile_img').attr("src",document.getElementById("twitter_profile_img_url").src);
	
	// Add screen name to label.
	document.getElementById('account_description_label').innerHTML='<b>'+$('#twitter_account').val()+'</b>';
}

// Add website and select network on continue form in add contact flow.
function socialsuite_add_website()
{
  if (TweetOwnerForAddContact == null)
	  return;
   
  // Add values in continue form after add contact form.
  // Add website / handle of twitter of tweet owner.
  $("#website", $('#continueform')).attr("value",TweetOwnerForAddContact);		
  TweetOwnerForAddContact = null;  
  
  // Select network type.
  $("div.website select").val("TWITTER");
}

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
}

/**
 * Add relevant profile img to stream in column header.
 */
function addUserImgToColumn(stream)
{	
	  // Get stream from collection.
	  var modelStream = StreamsListView.collection.get(stream.id);	 
	  
	  // Fetching profile image url from twitter/linkedin server    											  	
	  $.get("/core/social/getprofileimg/" + stream.id, 
			    function (url)
			    {
	              modelStream.set("profile_img_url",url);
	            	
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
  // We need this messages to reflect actions in all added relevant streams.
  if(tweet["delete"] != null) //(tweet.delete != null)
	  {
	    console.log("delete tweet");
	    return;
	  }
  
  // Get stream from collection.
  var modelStream = StreamsListView.collection.get(tweet.stream_id);	 

  if(modelStream != null || modelStream != undefined)
	{
	  // Temp : Add tweet to model.
	  addTweetToStream(modelStream,tweet);	  
	} // If End  
  
	 // Searchs tweet owner's kloutscore.
	 // Fetches tweet owner's klout id.
/*	 var url = "https://api.klout.com/v2/identity.json/twitter?screenName="+tweet.user.screen_name+"&key=89tdcs5g6ztxvef3q72mwzc6&callback=?";

     $.getJSON( url , function(data) {
    	 console.log(data);   
        })
     .success(function( data ){
        console.log(data);      
    	
   	    // Fetches tweet owner's klout score.
    	url = "https://api.klout.com/v2/user.json/"+data.id+"/score?key=89tdcs5g6ztxvef3q72mwzc6&callback=?";
    	      
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
	}// If end*/
}

/**
 * Add Tweet to relevant stream with some extra tags as per requirement.
 */
function addTweetToStream(modelStream,tweet)
{	
	// Hide waiting symbol.
	$("#stream-spinner-modal-"+tweet.stream_id).hide();

	// Add type of message
	if(tweet.text == "Dear you do not have any tweets.")
		tweet["msg_type"] = "NoTweet";
	else
	    tweet["msg_type"] = "Tweet";
	
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
	   
	 if(modelStream.get('tweetListView').length == 1)
	   {
		 // Check for no tweet notification and remove it.		 
		 checkNoTweetNotification(modelStream);
		 $('.deleted').remove();
	   }
		 
	 // Add tweet to stream.
	 modelStream.get('tweetListView').add(tweet);	
	   
	 // Sort stream on id. so recent tweet comes on top.
	 modelStream.get('tweetListView').sort() ;	   
	   
	 // Create normal time.
	 head.js('lib/jquery.timeago.js', function(){	 
		        $(".time-ago", $(".chirp-container")).timeago();	
			});
}

// Remove notification about user do not have any tweet.
function checkNoTweetNotification(modelStream)
{		
	// Get tweet from stream.
	var modelTweet = modelStream.get('tweetListView').get('000');
	
	if(modelTweet != null || modelTweet != undefined)
	{
	  console.log(modelTweet.toJSON());

	  modelTweet.set("deleted_msg","deleted");

	  console.log(modelTweet.toJSON());

  	  // Add back to stream.
	  modelStream.get('tweetListView').add(modelTweet);
	  console.log(modelStream);

	  // Remove tweet element from ui
	  $('.deleted').remove();
	  console.log("notification dlt");
	}
}

// Remove waiting symbol from stream's column header, when user return to social tab.
function removeWaiting()
{
  var streamsJSON = StreamsListView.collection.toJSON();
	
  // Streams not available OR streams already registered OR pubnub not initialized	
  if(streamsJSON == null)
	{
	  return;
	}

  // Get stream
  $.each(streamsJSON, function(i, stream)
		 {	  		
       	    // Get stream from collection.
	        var modelStream = StreamsListView.collection.get(stream.id);	
	  
	        if(modelStream.get('tweetListView').length >= 1)
	        	{
	        	  // Hide waiting symbol.
			      $("#stream-spinner-modal-"+stream.id).hide();	        	
	        	}	        
		 });
}
