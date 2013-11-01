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

// Change property of website and select network in add contact form.
function changeProperty()
{
  var display = $('#network_handle', $('#personModal')).css("display");	
  var picDisplay = $("#pic", $('#personModal')).css("display");
  var picValue = $("#pic", $('#personModal')).html();
  
  console.log("display: "+display+" picDisplay: "+picDisplay);
  console.log("picValue:" +picValue);
	
  if((picDisplay == 'inline' || picDisplay == 'block') && (picValue != null || picValue != ''))
	{
	  if(display == 'none')
		  document.getElementById("network_handle").className = 'after-img-load-hide'; 
	  else if (display == 'block')
		  document.getElementById("network_handle").className = 'after-img-load-show';
		
	  document.getElementById("handle").className = 'add-form-input';
	}  
  else if(picDisplay == 'none' || picDisplay == null)
	{
	  if(display == 'none')
		  document.getElementById("network_handle").className = 'network-handle'; 
	  else if (display == 'block' && picValue == null)
		  document.getElementById("network_handle").className = 'socialsuite-network-handle';
	  
	  document.getElementById("handle").className = '';
	}
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
	      // Set url in stream model.
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
	  console.log("Current_Route: "+Current_Route+" focused: "+focused);
	  
	  // User on #social as well as window is active.
	  if(Current_Route == "social" && focused == true)
		  {
		   
		    // New tweet notification not yet clicked.
		    if( $('#new_tweet_notification_'+tweet.stream_id).is(':empty') == false)  
		      {
		    	 console.log("not clicked");
		    	// User did not click on notification so continue adding tweets in temp collection.
		    	addTweetToTempCollection(tweet);  
		    	
		    	// Change notification to show number of new tweets.
				checkNewTweets();
		      }		    	
		    else
		      {
		    	console.log("no notification");
		    	console.log("call from handleMessage to addTweetToStream");
		    	// Add tweet to model in normal way.
		    	addTweetToStream(modelStream,tweet);
		      }
		  }
	  else
		  {
		    console.log("not in social suite");
		    // Add tweet to temp collection, user on another tab or window is inactive.
  	        addTweetToTempCollection(tweet);  	
  	        
  	        if(Current_Route == "social")
  	        	{
  	        	  // Change notification to show number of new tweets.
			      checkNewTweets();
  	        	}
		  }
	} // If End  
    
     console.log("StreamsListView: ");console.log(StreamsListView);
	 console.log("TempStreamsListView: ");console.log(TempStreamsListView);
  
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
	console.log("In addTweetToStream.");
	console.log(tweet.text);
	
	// Hide waiting symbol.
	$("#stream-spinner-modal-"+tweet.stream_id).hide();
	
	// Add type of message
	if(tweet.text == "There is no tweets to show here." || tweet.text == "Dear you do not have any tweets.")
		{
		  tweet["msg_type"] = "NoTweet";
		  tweet["show"] = true;
		  if(tweet.text == "Dear you do not have any tweets.")
			  tweet["text"] = "There is no tweets to show here.";
		}
	else
		{
	      tweet["msg_type"] = "Tweet";
	     
	      // Remove no tweet notification.
	      if(modelStream.get('tweetListView').length == 1)
	    	clearNoTweetNotification(modelStream);
	      
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
	      
	      // Converts normal text to tweet with link on url, # and @.
	      tweet.text = convertTextToTweet(tweet);
		}	
	    
    console.log("add at "+modelStream.get('tweetListView').length);
    console.log(tweet.text);
		
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

/**
 * When social is not selected or user is on different tab, 
 * so temporarily add Tweet to temp collection.
 */
function addTweetToTempCollection(tweet)
{	
  console.log("In addTweetToCollection.");
  console.log(TempStreamsListView.collection.length);
		  
  // Get stream from collection.
  var modelStream = TempStreamsListView.collection.get(tweet.stream_id);
	 			  
  console.log("call from addTweetToTempCollection to addTweetToStream");
  // Add tweet to stream model.
  addTweetToStream(modelStream,tweet);
}

/** Create temporary collection to store tweets when user not on social tab.*/
function createTempCollection()
{
  console.log("In createTempCollection.");	
  if(!TempStreamsListView)  // Streams not collected from dB
	{	
	 TempStreamsListView = new Base_Collection_View
		({
			 url : "/core/social",
	         restKey: "stream",
	         templateKey: "socialsuite-streams",
	         individual_tag_name: 'div', 
	         className :'app-content container clearfix',
	         id : 'stream_container',
	     });	
	  
	// Creates new default function of collection
	 TempStreamsListView.appendItem = socialsuitecall.socialSuiteAppendItem;	
	
	 TempStreamsListView.collection.fetch({success : function(data)
		{
		 console.log(TempStreamsListView); 
		}});	
  }
}

/* Convert normal text of tweet to tweet with links on @screen_name , #hashtags and url.*/
function convertTextToTweet(tweet)
{	
	var linkableTweetArray = new Array();
	var tweetText = tweet.text;
	var regex = new RegExp();
	
	// Replace &amp; with &
	regex = new RegExp("&amp;","g");
	tweetText = tweetText.replace(regex,'&');
	 
	// Split text in array.
	linkableTweetArray = tweetText.split(/[\s,?&;.'":!)({}]+/);
	
	// Remove duplicate words.
	linkableTweetArray = _.uniq(linkableTweetArray);
		
	for (var i = 0; i < linkableTweetArray.length; i++) 
	  {			
		if(linkableTweetArray[i].charAt(0) == "@") // Mentions
		  {		    
		    regex = new RegExp(linkableTweetArray[i],"g");		   
		    tweetText = tweetText.replace(regex,'&lt;a href=\'https://twitter.com/'+linkableTweetArray[i].substring(1)+'\' target=\'_blank\' class=\'cd_hyperlink\'>'+linkableTweetArray[i]+'&lt;/a>');		    
		  }
		else if(linkableTweetArray[i].charAt(0) == "#") // Hashtags
		   {
		    regex = new RegExp(linkableTweetArray[i],"g");		    
		    var url = "https://twitter.com/search?q=%23" + linkableTweetArray[i].substring(1) + "&src=hash";
		    tweetText = tweetText.replace(regex,'&lt;a href=\''+url+'\' target=\'_blank\' class=\'cd_hyperlink\'>'+linkableTweetArray[i]+'&lt;/a>');
		   }
	  }

	// URL
	linkableTweetArray = new Array();
	linkableTweetArray = tweetText.split(" "); 
	var exp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";

	$.each(linkableTweetArray, function(index, word) {
		if (word.match(exp))
			tweetText = tweetText.replace(word, '&lt;a href=\'' + word
					+ '\' target=\'_blank\' class=\'cd_hyperlink\'>' + word + '&lt;/a>');
		});
		
	 regex = new RegExp("&lt;","g");
	 tweetText = tweetText.replace(regex,'<');
	 return tweetText;
}

// Remove no tweet notification. Search for that tweet in collection and makes that tweets model hide.
function clearNoTweetNotification(modelStream)
{
	console.log("In clearNoTweetNotification.");
	
	// Get tweet from stream.
	var modelTweet = modelStream.get('tweetListView').get('000');
	
	if(modelTweet != null || modelTweet != undefined)
	{
      // Set show false, so handlebar condition check will avoid to display.
	  modelTweet.set("show",false);

	  // Add back to stream.
	  modelStream.get('tweetListView').add(modelTweet);	  
	}	
}

// Remove waiting symbol from stream's column header, when user return to social tab.
function removeWaiting()
{
  var streamsJSON = StreamsListView.collection.toJSON();
	
  // Streams not available.	
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

/* Check for new tweets when user was not in social tab. 
 * Show new tweet notification on respective stream.*/
function checkNewTweets()
{ 
  console.log("In checkNewTweets.");
  
  var streamsJSON = TempStreamsListView.collection.toJSON();

  // Streams not available.	
  if(streamsJSON == null)
	{
	  return;
	}

  // Get stream
  $.each(streamsJSON, function(i, stream)
		 {	  	
	        var newTweet = true;
	        
     	    // Get stream from collection.
	        var modelStream = TempStreamsListView.collection.get(stream.id);	
	        
	        if(modelStream.get('tweetListView').length == 1)
	        	{
	        	  // Get tweet from stream.
	        	  var modelTweet = modelStream.get('tweetListView').get('000');
	        	
                  // "There is no tweet" is added in stream, so need to show notification for that. 
	        	  if(modelTweet != null || modelTweet != undefined)
	        		  {	        		   
	        		    newTweet = false;
	        		  }
	        	  else // New tweet is common tweet so need to add notification.
	        		  {
	        		    // Add notification of new tweets on stream.
		  		        document.getElementById('new_tweet_notification_'+stream.id).innerHTML= '<p>'+modelStream.get('tweetListView').length+' new Tweet </p>';
	        		  }	        	  	        	
	        	}
	        else if(modelStream.get('tweetListView').length > 1)
        	    {
        	      // Add notification of new tweets on stream.
  		          document.getElementById('new_tweet_notification_'+stream.id).innerHTML= '<p>'+modelStream.get('tweetListView').length+' new Tweets </p>';	        	  	        	
        	    }
	        
	        if(newTweet == true && modelStream.get('tweetListView').length >= 1)
	        	{
	        	  // Remove no tweet notification.		      
			      clearNoTweetNotification(StreamsListView.collection.get(stream.id));
	        	}
		 });      	
}