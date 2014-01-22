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
  if(TweetOwnerForAddContact != null)
	{
	  // Add values in continue form after add contact form.
	  // Add website / handle of twitter of tweet owner.
	  $("#website", $('#continueform')).attr("value",TweetOwnerForAddContact);		
	  		  
	  // Select network type.
	  $("div.website select").val("TWITTER");
	  
	  TweetOwnerForAddContact = null;
	}
}

// Change property of website and select network in add contact form.
function changeProperty()
{
  var display = $('#network_handle', $('#personModal')).css("display");	
  var picDisplay = $("#pic", $('#personModal')).css("display");
  var picValue = $("#pic", $('#personModal')).html();
  	
  if((picDisplay == 'inline' || picDisplay == 'block') && picValue != '')
	{
	  if(display == 'none')
		  document.getElementById("network_handle").className = 'after-img-load-hide'; 
	  else if (display == 'block')
		  document.getElementById("network_handle").className = 'after-img-load-show';
		
	  document.getElementById("handle").className = 'add-form-input';
	}  
  else if((picDisplay == 'none' || picDisplay == null || picDisplay == '') || (picValue == null || picValue == ''))
	{
	  if(display == 'none')
		  document.getElementById("network_handle").className = 'network-handle'; 
	  else if (display == 'block')
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
function registerAll(index)
{	
  console.log("In registerAll.");
  //console.log(index + " "+registerCounter+" "+StreamsListView.collection.length);
  
  var streamsJSON = StreamsListView.collection.toJSON();
		
  // Streams not available OR streams already registered OR pubnub not initialized OR (index 0 stream is done and RC is increased.)	
  if(streamsJSON == null || registerAllDone == true || pubnub == null || (registerCounter != null && index == 0))
	{
	  console.log("registerAllDone : "+registerAllDone);
	  return;
	}  
	
   // Get stream.
   var stream = StreamsListView.collection.at(index);
   console.log(stream);
  
   // Check stream is present or added in collection.
   if(stream == null || stream == undefined)
	  return;
    
   // Check ACK done with stream.
   //console.log(stream.get('tweetListView').where({text: "ACK"}));
  
   // First stream from collection to register and assign value to RC.
   if(index == 0 && registerCounter == null)
	 {
	   registerCounter = 0;
	   
	   if(addImgDone == false)
	     addUserImgToColumn();
	 }	 
     
   // Publish data to register on server 
   var publishJSON = {"message_type":"register", "stream":stream};
   sendMessage(publishJSON);
   
   // Global flag set.
   streamRegisterCall = true;
	    
   // All added streams registered.
   if(registerCounter == (StreamsListView.collection.length-1)) 
     registerAllDone = true;
}

/**
 *  Unregister all streams on server
 */
function unregisterAll()
{ 	
  // Collection not defined.	
  if(!StreamsListView)
	return;	
		
  // Streams not available OR pubnub not initialized.	
  if(StreamsListView == undefined || pubnub == null)
	return;	  	
   
  // Unregister on server
  var publishJSON = {"message_type":"unregister_all","client_channel":CURRENT_DOMAIN_USER.id +"_Channel" };
  sendMessage(publishJSON);
	 
   // Flush all data.
   registerAllDone = false;	
   registerCounter = null;
   addImgDone = false;
   StreamsListView = undefined;
}

/**
 * Add relevant profile img to stream in column header.
 */
function addUserImgToColumn()
{	
  console.log("In addUserImgToColumn");	
	
  var streamsJSON = StreamsListView.collection.toJSON();
                    
   // Get stream
   $.each(streamsJSON, function(i, stream)
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
	    });  
     });   
   addImgDone = true;   
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
  
  //Error message from server "Rate limit exceeded." or "server not connected."
  if(tweet.id == "001") //(tweet.delete != null)
	  {	    
	    displayErrorInStream(tweet);
	    return;
	  }
  
  // Get stream from collection.
  var modelStream = StreamsListView.collection.get(tweet.stream_id);	 

  if(modelStream != null || modelStream != undefined)
	{
	  //console.log("Current_Route: "+Current_Route+" focused: "+focused);
	  
	  // User on #social as well as window is active.
	  if(Current_Route == "social" && focused == true)
		  {
		   
		    // New tweet notification not yet clicked.
		    if( $('#stream_notifications_'+tweet.stream_id).is(':empty') == false)  
		      {
		    	//console.log("not clicked");
		    	
		    	// User did not click on notification so continue adding tweets in temp collection.
		    	addTweetToTempCollection(tweet);  
		    	
		    	// Change notification to show number of new tweets.
				checkNewTweets();
		      }		    	
		    else
		      {
		    	//console.log("no notification");
		    	
		    	// Add tweet to model in normal way.
		    	addTweetToStream(modelStream,tweet);
		      }
		  }
	  else
		  {
		    //console.log("not in social suite");
		    
		    // Add tweet to temp collection, user on another tab or window is inactive.
  	        addTweetToTempCollection(tweet);  	
  	        
  	        if(Current_Route == "social")
  	        	{
  	        	  // Change notification to show number of new tweets.
			      checkNewTweets();
  	        	}
		  }
	} // If End
}

/**
 * Add Tweet to relevant stream with some extra tags as per requirement.
 */
function addTweetToStream(modelStream,tweet)
{	
	console.log("In addTweetToStream.");
	
	// Hide waiting symbol.
	$("#stream-spinner-modal-"+tweet.stream_id).hide();
	
	// Add type of message
	if(tweet.text == "There is no tweets to show here." || tweet.text == "Dear you do not have any tweets.")
		{
		  tweet["msg_type"] = "NoTweet";
		  tweet["show"] = true;
		  //if(tweet.text == "Dear you do not have any tweets.")
		  tweet.text = "No Tweets to show here.";
		}
	else if(tweet.type == "ACK")
		{
		 tweet["msg_type"] = "ACK";
		 tweet["text"] = "ACK";		 
		}		
	else
		{
	      tweet["msg_type"] = "Tweet";
	     
	      // Remove no tweet notification.
	      if(modelStream.get('tweetListView').length == 1)
	    	clearNoTweetNotification(modelStream);
	      
	      // If stream owner is tweet owner no need to show retweet icon.0
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
	      
	      var checkRT = modelStream.get('screen_name')+" retweeted";
	      if(tweet.retweeted == checkRT)
	    	  tweet["retweeted_by_user"] = true;
	      
	      // Save original text for other actions.
	      tweet["original_text"] = tweet.text;
	      
	      // Converts normal text to tweet with link on url, # and @.
	      tweet.text = convertTextToTweet(tweet);
		}	
	    
	//console.log("tweet : "+tweet.text);
    //console.log("add at "+modelStream.get('tweetListView').length);   
		
	// On scroll down collect 5 tweets in JSON Array and then add to stream.
	if(scrollDownCall == true)
		{
		  checkPastTweetAdd(tweet);
		  return;
		}		
	
	// After stream registration on server collect 5 tweets in JSON Array and then add to stream.
	if(streamRegisterCall == true)
		{
		  checkRESTTweetAdd(tweet);
		  
		  // Ack from server that shows current streams registeration is done.
		  if(tweet.type == "ACK")
			{
			  streamRegisterCall = false;
			  addRESTTweetsToStream();
			  
			  registerCounter++;
			  registerAll(registerCounter);
			}		  
		  return;
		}		
	
    // Update collection.
	updateCollection(tweet, modelStream);	
}

/**
 * When social is not selected or user is on different tab, 
 * so temporarily add Tweet to temp collection.
 */
function addTweetToTempCollection(tweet)
{
  var modelStream = null;  
  
  if(tweet.id == "000" || tweet.type == "ACK")
	  {
	     console.log("got 000");
	     // Get stream from collection.
	     modelStream = StreamsListView.collection.get(tweet.stream_id);        
	  }
  else
	  {
	     // Get stream from temp collection.
	     modelStream = TempStreamsListView.collection.get(tweet.stream_id);
	  }
  
  // Add tweet to stream model.
  addTweetToStream(modelStream,tweet);
}

/** Create temporary collection to store tweets when user not on social tab.*/
function createTempCollection()
{
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
	var temp;
	
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
	linkableTweetArray = tweetText.split(/\s/); 
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
	        var tempModelStream = TempStreamsListView.collection.get(stream.id);
	  
	        if((modelStream != null || modelStream != undefined) && (tempModelStream != null || tempModelStream != undefined))
	    	{	        
	          // If any collection have some tweets then remove waiting.
	          if(modelStream.get('tweetListView').length >= 1 || tempModelStream.get('tweetListView').length >= 1)
	        	{
	        	  // Hide waiting symbol.
			      $("#stream-spinner-modal-"+stream.id).hide();	        	
	        	}
	    	}
		 });
}

/* Check for new tweets when user was not in social tab. 
 * Show new tweet notification on respective stream.*/
function checkNewTweets()
{ 
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
	        
	        if(modelStream != null || modelStream != undefined)
	    	{	        
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
		  		        document.getElementById('stream_notifications_'+stream.id).innerHTML= '<p>'+modelStream.get('tweetListView').length+' new Tweet </p>';

		  		        // Add relation from <div> for notification.
		  		        $('#stream_notifications_'+stream.id).attr("rel",'add-new-tweet');
	        		  }	        	  	        	
	        	}
	         else if(modelStream.get('tweetListView').length > 1)
        	    {
        	      // Add notification of new tweets on stream.
  		          document.getElementById('stream_notifications_'+stream.id).innerHTML= '<p>'+modelStream.get('tweetListView').length+' new Tweets </p>';
  		          
  		          // Add relation from <div> for notification.
	  		      $('#stream_notifications_'+stream.id).attr("rel",'add-new-tweet');
        	    }
	        
	         if(newTweet == true && modelStream.get('tweetListView').length >= 1)
	        	{
	        	  // Remove no tweet notification.		      
			      clearNoTweetNotification(StreamsListView.collection.get(stream.id));
	        	}
	    	}
		 });  
  
    //Remove deleted tweet element from ui
	 $('.deleted').remove();
}

/**
 * Add tweets from temp collection to original collection and remove notification.
 */
function mergeCollections(streamId)
{
    // Get stream from collections.
    var originalStream = StreamsListView.collection.get(streamId);
    var tempStream = TempStreamsListView.collection.get(streamId);
    
    // Get tweet collection from stream.
    var tweetCollection = originalStream.get('tweetListView');
    
    // Add new tweets from temp collection to original collection.
    tweetCollection.add(tempStream.get("tweetListView").toJSON());
        
    // Sort tweet collection on id. so recent tweet comes on top.
    tweetCollection.sort();    
	   
	// Create normal time.
	head.js('lib/jquery.timeago.js', function(){	 
		        $(".time-ago", $(".chirp-container")).timeago();	
			});
	 
	// Clear temp tweet collection.
	tempStream.get("tweetListView").reset();

	// Remove waiting symbol.
	removeWaiting();	
}

/**
 * When request rate limit is exceeded so Twitter server send code 88, It will not accept any more REST call.
 * When Twitter service or network is unavailable
 * User have to wait for some time and retry again.
 * We need to display notification for that in relavant stream.
 */
function displayErrorInStream(errorMsg)
{	
	console.log("errorMsg: ");
	console.log(errorMsg);
	var streamId = null;

	// Get stream id.
	if(errorMsg.id == "001") // from Tweet
		streamId = errorMsg.stream_id;
	else  // from Stream
		streamId = errorMsg.id;

	// Hide waiting symbol.
	$("#stream-spinner-modal-"+streamId).hide();
	
	var modelTempStream = TempStreamsListView.collection.get(streamId);
	var modelStream = StreamsListView.collection.get(streamId);
	
	if(modelStream.get('tweetListView').length == 0 && modelTempStream.get('tweetListView').length == 0)		
	{
		console.log("There is nothing to display");
		console.log(modelStream.get('tweetListView'));console.log(modelTempStream.get('tweetListView'));
		
	    // Add notification of error on stream.
	    document.getElementById('stream_notifications_'+streamId).innerHTML= '<p>Request rate limit exceeded, Retry after some time. <i class="icon icon-refresh" title="Retry again."></i></p>';
	      
	    // Add relation from <div> for notification.
	    $('#stream_notifications_'+streamId).attr("rel",'retry');	
	}
}

/**
 * Send register message again to twitter server.
 */
function registerStreamAgain(streamId)
 {
	// Fetch stream from collection
	var stream = StreamsListView.collection.get(streamId).toJSON();
	 
	// Register on server
	var publishJSON = {"message_type":"register", "stream":stream};
	sendMessage(publishJSON);	
	
	// Show waiting symbol.
	$("#stream-spinner-modal-"+streamId).show();
 }

/**
 * Gets Scheduled Updates fron DB and show button or hide it.
 */
function checkScheduledUpdates()
{
	$.getJSON("/core/scheduledupdate/getscheduledupdates",function(data)
	   		  {
				console.log("data after fetching scheduled updates from db");
	   		    console.log(data);
	   		    
	   		    if(data.length != 0)	   		    		 	
	   		    	 $("#show_scheduled_updates").show();	   		    		   		    
	   		    else
	   		      $("#show_scheduled_updates").hide();
	   	      }).error(function(jqXHR, textStatus, errorThrown) 
	   	    		  { 
	   	    	        $("#show_scheduled_updates").hide();
	   	    	        console.log("Error occured in scheduled updates search."); 
	   	    	      });	
}

/**
 * Adds newly added Scheduled Update In Stream. 
 */
function addScheduledUpdateInStream(scheduledUpdate)
{
	console.log("In addScheduledUpdateInStream");	
	console.log(scheduledUpdate);	
		
	if(ScheduledEdit == true)
	  {
		// Get scheduled update from collection.
		var newScheduledUpdate = ScheduledUpdatesView.collection.get(scheduledUpdate.id);
		
		// Set new data.
		newScheduledUpdate.set("message",scheduledUpdate.message);
		newScheduledUpdate.set("scheduled_date",scheduledUpdate.scheduled_date);
		newScheduledUpdate.set("scheduled_time",scheduledUpdate.scheduled_time);
		    	
		// Add back to stream.
		ScheduledUpdatesView.collection.add(newScheduledUpdate);	
		$('#socialsuite-scheduled-updates-content').append(ScheduledUpdatesView.render(true).el);
		
		ScheduledEdit = false;
	  }
	else
	  {
		// Add scheduled update in collection.
		if(Current_Route == "scheduledmessages")
		  ScheduledUpdatesView.collection.add(scheduledUpdate);
	  }	  	
}

/**
 * Checks scroll reached to end or not. 
 * Suppose it reached to end then call past tweets and add to stream 
 * as well as maintain scrolls current position.
 * 
 * @param elementDiv - element where scrollDown performed
 */
function OnScrollDiv(elementDiv)
{   
  // Check scroll bar is reached to end and function is not called before. 	
  if(($(elementDiv).scrollTop() + $(elementDiv).innerHeight() >= $(elementDiv)[0].scrollHeight) 
	  && ($(elementDiv).attr("data") == "0"))
     {	   	  
	  
	   // Function is alredy called for this stream.
	   $(elementDiv).attr("data","1");	  
	   
	   console.log("In OnScrollDiv.");
	  
	   // Get stream id.
       var streamId = ($(elementDiv).closest('li').attr('id'));   	   
   	
   	   // Get stream from collection.
   	   var modelStream = StreamsListView.collection.get(streamId);
   	   
   	   // Stream not found.
   	   if(modelStream == undefined || modelStream == null)
   	      return;
   	   
   	   // model to json.
   	   var stream = modelStream.toJSON();
   	   console.log(stream);
   	  	
   	   // Get tweet from stream.
	   var modelTweet = modelStream.get('tweetListView').at(modelStream.get('tweetListView').length - 2);
	   var tweet = modelTweet.toJSON();	  
	   console.log(tweet);
  	   
  	   // Store reference to top message
       var currMsg = $("#"+tweet.id);
  	          
       // Store current scroll/offset
       var curOffset = currMsg.offset().top - $(elementDiv).scrollTop();       
      	   
       // Append loading icon.
	   $(elementDiv).append('<span id="stream-waiting-modal-'+streamId+'" class="span6" style="margin-top: 3px;"><img class="pull-right" style="width:20px;height:20px;" src="img/ajax-spinner.gif"></span>');
	   
   	/*
   	 * Calls TwitterAPI class to request for 20 more updates tweeted before
   	 * the tweet id of the last update
   	 */   	
   	$.getJSON("/core/social/pasttweets/" + stream.id + "/" + tweet.id + "/" + tweet.id_str ,
   	function(data)
   	{
   		console.log("data");
   		console.log(data);
   		
   		// If no more updates available, show message.
   		if(data == null)
   		 {
   			showNotyPopUp('information', "No more updates available for stream "+ stream.stream_type +" of "+ stream.screen_name, "top", 5000);
   			
   			// Remove loading icon.
   			$('#stream-waiting-modal-'+streamId).remove();
   			
   			// Do not call this function again.
   			$(elementDiv).attr("data","1");
   			
   			// Twitter icon and up arrow appended in stream to show no more tweets available.
   			$(elementDiv).append('<span id="past-tweet-end-'+streamId+'" class="span6" style="margin-top: 3px;color: #888;"><i class="pull-right icon icon-long-arrow-up"></i><i class="pull-right icon icon-twitter"></i></span>');
   			return;
   		 }
   		if (data.length == 0)
   		 {
   			showNotyPopUp('information', "No more updates available for stream "+ stream.stream_type +" of "+ stream.screen_name, "top", 5000);
   			$('#stream-waiting-modal-'+streamId).remove();
   			$(elementDiv).attr("data","1");
   			$(elementDiv).append('<span id="past-tweet-end-'+streamId+'" class="span6" style="margin-top: 3px;color: #888;"><i class="pull-right icon icon-long-arrow-up"></i><i class="pull-right icon icon-twitter"></i></span>');
   			return;
   		 }
   		
   		/*
   		 * Populate the collection with update stream details and show
   		 */
   		var i; var myObject;
   		
   		// Global flag set.
   		scrollDownCall = true;
   		
   		for(i=0; i<data.length; i++)
   			{
   			  // String to json.
   			  myObject = eval('(' + data[i] + ')');
   	   		  console.log(myObject);
   	   		  
   	   		  // Add tweet to stram.
   	   	      handleMessage(myObject);
   	   	      
   	   	      // All tweets done.
   	   	      if(i+1 == data.length)
   	   	         scrollDownCall = false;
   			}   		
   		
   		// Add remaining tweets.
   		if(scrollDownCall == false && pastTweetsCount != 0 && pastTweets.length != 0)
    	      addPastTweetsToStream();
   		
   	    // Set scroll to current position minus previous offset/scroll
   	    var scrollOnDiv = $('#'+streamId).find('#Column-model-list');
   		scrollOnDiv.scrollTop((currMsg.offset().top - curOffset)+650);
   		
   		// Remove loading icon.
   		$('#stream-waiting-modal-'+streamId).remove();
   		
   		// One function call for current stream is over.
   		$(elementDiv).attr("data","0");
   		
   	}).error(function(data)
   	{   
   		// Loading icon remove.
   		$('#stream-waiting-modal-'+streamId).remove();
   		
   		// One function call for current stream is over.
   		$(elementDiv).attr("data","0");
   		
   		var result = data.responseText;
   		
   		// Error message is shown to the user
   		if(data.responseText == "")
   			showNotyPopUp('information', "No more updates available for stream "+ stream.stream_type +" of "+ stream.screen_name, "top", 7000);
   		else if (result.indexOf("rate") != -1)
   		    showNotyPopUp('information', "Request rate limit exceeded, Retry after some time.", "top", 5000);
   		else if (result.indexOf("Could not fetch URL") != -1)
   			showNotyPopUp('information', "Please, check your internet connection.", "top", 5000);
   		else
   			showNotyPopUp('information', data.responseText, "top", 5000);
		console.log(data);		
   	});      	   
 }
}

// Checks counter and adds tweet in json array. 
function checkPastTweetAdd(tweet)
{
	 // If collected tweets less than 5.
	  if(pastTweetsCount < 5)
		{
		  // Add tweet in json array.
		  pastTweets[pastTweetsCount] = tweet;
		  
		  // Increment counter.
		  pastTweetsCount++;		  
		}
	  else if(pastTweetsCount == 5) 
		{
		  // If collected tweets are 5 then add them in to stream.
		  addPastTweetsToStream();			  
		}	
}

// Checks counter and adds tweet in json array.
function checkRESTTweetAdd(tweet)
{
	// If collected tweets less than 5.
	  if(restTweetsCount < 5)
		{
		  // Add tweet in json array.
		  restTweets[restTweetsCount] = tweet;
		  
		  // Increment counter.
		  restTweetsCount++;		  
		}
	  else if(restTweetsCount == 5) 
		{
		  // If collected tweets are 5 then add them in to stream.
		  addRESTTweetsToStream();			  
		}
}

/**
 * Fetches relavant stream model from collection 
 * and update that collection with past tweets fetched on scroll down. 
 */
function addPastTweetsToStream()
{ 
  // If no tweets to add in collection.	
  if(pastTweets.length == 0)
	  return;
  
  console.log("In addPastTweetsToStream.");
	
  // Get stream from collection.
  var modelStream = StreamsListView.collection.get(pastTweets[0].stream_id);
	  
  // Update collection.
  updateCollection(pastTweets,modelStream);
  
  // Reset json array and counter.
  pastTweetsCount = 0;
  pastTweets = [];
}

/**
 * Fetches relavant stream model from collection 
 * and update that collection with REST tweets fetched after registration. 
 */
function addRESTTweetsToStream()
{ 
  // If no tweets to add in collection.	
  if(restTweets.length == 0)
     return;
	
  console.log("In addRESTTweetsToStream.");
	
  // Get stream from collection.
  var modelStream = StreamsListView.collection.get(restTweets[0].stream_id);
	  
  // Update collection.
  updateCollection(restTweets,modelStream);
  
  // Reset json array and counter.
  restTweetsCount = 0;
  restTweets = [];
}

/**
 * Add given tweets in given stream model.
 */
function updateCollection(tweet, modelStream)
{
	// Sort stream on tweet id basis which is unique and recent tweet has highest value.
	modelStream.get('tweetListView').comparator = function(model) 
	 { 		  
	  if (model.get('id'))
	     return -model.get('id');
	 };
	 		 
	 // Add tweet to stream.
	 modelStream.get('tweetListView').add(tweet);	
	   
	 // Sort stream on id. so recent tweet comes on top.
	 modelStream.get('tweetListView').sort();		    
	   
	 // Create normal time.
	 head.js('lib/jquery.timeago.js', function(){	 
		        $(".time-ago", $(".chirp-container")).timeago();	
			});		 	
}
