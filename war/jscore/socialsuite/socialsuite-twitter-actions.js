/**
 * get stream and create tweet for posting on Twitter.
 */
$(document).on("click",".compose-message", function(e)
{	
	var streamId = $(this).attr("stream-id");
	console.log(this);
	 
	// Fetch stream from collection
	var stream = StreamsListView.collection.get(streamId).toJSON();
	
	// Store info in a json, to send it to the modal window when making send tweet request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Tweet";
        
    // Information to be shown in the modal to the user while sending message    
    json["info"] = "Status from " + stream.screen_name;

    json["description"] = "What's happening?" /*+ Twitter_current_profile_screen_name*/;
	    
    // If modal already exists remove to show a new one
    $('#socialsuite-twitter_messageModal').remove();

    // Populate the modal template with the above json details in the form
    var message_form_modal = getTemplate("socialsuite-twitter-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);

    // Display modal
    $('#socialsuite-twitter_messageModal').on('shown', function () {
		  
		  head.js(LIB_PATH + 'lib/bootstrap-limit.js', function(){
			  $(".twit-tweet-limit").limit({
			  	  maxChars: 125,
			  	  counter: "#twitter-counter"
			  	});
			  $('#socialsuite-twitter_messageModal').find('#twit-tweet').focus();
		  });
	});
    
    // Shows the modal after filling with details
    $('#socialsuite-twitter_messageModal').modal("show");
    
    // On click of send button in the modal, tweet request is sent 
    $('#send_tweet').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#socialsuite-twitter_messageForm")))
            return;

        $("#spinner-modal").show();
        
        // Sends post request to url "/core/social/tweet/" and Calls StreamsAPI with 
        // Stream id and Twitter id as path parameters and form as post data
        $.post("/core/social/tweet/" + streamId ,
        $('#socialsuite-twitter_messageForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal").hide();
        
        	 console.log(data);
        	 if(data == "Successful")
        		 {
                   // On success, shows the status as sent
                   $('#socialsuite-twitter_messageModal').find('span.save-status').html("Sent");
        		 }
        	 else if(data == "Unsuccessful")
        		 {
                   // On failure, shows the status as retry
                   $('#socialsuite-twitter_messageModal').find('span.save-status').html("Retry");
        		 }
        	 
            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#socialsuite-twitter_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // If error occurs while posting modal is removed and error message is shown
            $('#socialsuite-twitter_messageModal').remove();

            // Error message is shown if error occurs
            alert("Retry after sometime.");
            console.log(data.responseText);            
        });
    });
}); 
/**
 * Get stream and create reply tweet and post it on Twitter.
 */
$(document).on("click",".reply-message", function(e)
{	
	var streamId = $(this).attr("stream-id");
	var tweetId = $(this).attr("tweet-id");
	var tweetIdStr = $(this).attr("tweet-id-str");
	var tweetOwner = $(this).attr("tweet-owner");
	console.log(this);
	 
	// Fetch stream from collection
	var stream = StreamsListView.collection.get(streamId).toJSON();
	
	// Store info in a json, to send it to the modal window when making send tweet request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Reply Tweet";
        
    // Information to be shown in the modal to the user while sending message    
    json["info"] = "Reply "+"@" + tweetOwner +" from " + stream.screen_name;

    json["description"] = "@" + tweetOwner;
    json["tweetId"] = tweetIdStr;
    json["tweetOwner"] = tweetOwner;    
	    
    // If modal already exists remove to show a new one
    $('#socialsuite-twitter_messageModal').remove();

    // Populate the modal template with the above json details in the form
    var message_form_modal = getTemplate("socialsuite-twitter-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);

    $('#socialsuite-twitter_messageModal').on('shown', function () {
		  
		  head.js(LIB_PATH + 'lib/bootstrap-limit.js', function(){
			  $(".twit-tweet-limit").limit({
			  	  maxChars: 125,
			  	  counter: "#twitter-counter"
			  	});
			  $('#socialsuite-twitter_messageModal').find('#twit-tweet').focus();
		  });
	});
    
    // Shows the modal after filling with details
    $('#socialsuite-twitter_messageModal').modal("show");
    
    // On click of send button in the modal, tweet request is sent 
    $('#send_reply').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#socialsuite-twitter_messageForm")))        
            return;        

        $("#spinner-modal").show();
        
        // Sends post request to url "/core/social/replytweet/" and Calls StreamsAPI with 
        // stream id and Twitter id as path parameters and form as post data
        $.post("/core/social/replytweet/" + streamId ,
        $('#socialsuite-twitter_messageForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal").hide();
        	 
        	 console.log(data);
        	 if(data == "Successful")
    		 {
               // On success, shows the status as sent
               $('#socialsuite-twitter_messageModal').find('span.save-status').html("Sent");
    		 }
        	 else if(data == "Unsuccessful")
    		 {
         	   // On failure, shows the status as retry
               $('#socialsuite-twitter_messageModal').find('span.save-status').html("Retry");
    		 }
        	 
            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#socialsuite-twitter_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // If error occurs while posting modal is removed and error message is shown
            $('#socialsuite-twitter_messageModal').remove();

            // Error message is shown if error occurs
            alert("Retry after sometime.");
            console.log(data.responseText);   
        });
    });
});

/**
 * Sends a direct message to the Twitter profile , who is tweet owner.
 */
$(document).on("click",".direct-message", function(e)
{	
	var streamId = $(this).attr("stream-id");
	var tweetId = $(this).attr("tweet-id");
	var tweetIdStr = $(this).attr("tweet-id-str");
	var tweetOwner = $(this).attr("tweet-owner");
	console.log(this);
	 
	// Fetch stream from collection
	var stream = StreamsListView.collection.get(streamId).toJSON();
	
	// Store info in a json, to send it to the modal window when making send tweet request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Direct Message";
        
    // Information to be shown in the modal to the user while sending message    
    json["info"] = "Direct message from "+stream.screen_name + " to " + tweetOwner;
    
    json["description"] = "Tip: you can send a message to anyone who follows you."
    json["tweetId"] = tweetIdStr;
    json["tweetOwner"] = tweetOwner;    
	    
    // If modal already exists remove to show a new one
    $('#socialsuite-twitter_messageModal').remove();

    // Populate the modal template with the above json details in the form
    var message_form_modal = getTemplate("socialsuite-twitter-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);

    $('#socialsuite-twitter_messageModal').on('shown', function () {
		  
		  head.js(LIB_PATH + 'lib/bootstrap-limit.js', function(){
			  $(".twit-tweet-limit").limit({
			  	  maxChars: 125,
			  	  counter: "#twitter-counter"
			  	});
			  $('#socialsuite-twitter_messageModal').find('#twit-tweet').focus();
		  });
	});
    
    // Shows the modal after filling with details
    $('#socialsuite-twitter_messageModal').modal("show");
    
    // On click of send button in the modal, tweet request is sent 
    $('#send_direct_message').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#socialsuite-twitter_messageForm")))        
            return;        

        $("#spinner-modal").show();
        
        // Sends post request to url "/core/social/directmessage/" and Calls StreamsAPI with 
        // Stream id as path parameters and form as post data
        $.post("/core/social/directmessage/" + streamId ,
        $('#socialsuite-twitter_messageForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal").hide();
        	 
        	 console.log(data);
        	 if(data == "Successful")
        	 {
               // On success, shows the status as sent
               $('#socialsuite-twitter_messageModal').find('span.save-status').html("sent");
        	 }
        	 else if(data == "Unsuccessful")
        		{
                 // On failure, shows the status as retry
                 $('#socialsuite-twitter_messageModal').find('span.save-status').html("Retry");        		 
        		}
            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#socialsuite-twitter_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // If error occurs while posting modal is removed and error message is shown
            $('#socialsuite-twitter_messageModal').remove();

            // Error message is shown if error occurs
            alert("Retry after sometime.");
            console.log(data.responseText);   
        });
    });
});

/**
 * Get stream and perform retweet action on selected tweet.
 */
$(document).on("click",".retweet-status", function(e)
{
	// Ask for user's confirmation.
	if(!confirm("Are you sure you want to retweet this status to your followers?"))
 		return;
    
	// Get the id of the tweet on which retweet is clicked
     var streamId = $(this).attr("stream-id");
     var tweetId = $(this).attr("tweet-id");
 	 var tweetIdStr = $(this).attr("tweet-id-str");
 	 var tweetOwner = $(this).attr("tweet-owner"); 	
 	 console.log(this);
	
	/* Sends get request to url "core/social/retweet/" and Calls StreamAPI with 
     * Stream id, tweet id as path parameters.
     */
    $.get("/core/social/retweet/" + streamId + "/" + tweetIdStr,

    function (data)
    {
    	console.log(data);
    	
    	// Retweet is Unsuccessful.
    	if(data == "Unsuccessful")
    		{
    		  alert("Retry after sometime.");
    		  return;
    		}
    	
        // On success, the color of the retweet is shown green.    	
    	// Get stream from collection.
    	var modelStream = StreamsListView.collection.get(streamId);
    	console.log(modelStream);
    	
    	// Get tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	// Update attribute in tweet.
    	modelTweet.set("retweeted_by_user","true");
    	modelTweet.set("retweet_id",data);
    	console.log(modelTweet.toJSON());
    	
    	// Add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    	
    	// Create normal time.
   	    head.js('lib/jquery.timeago.js', function(){	 
   		        $(".time-ago", $(".chirp-container")).timeago();});	
    }).error(function (data)
    {
        // Error message is shown when error occurs
    	alert("Retry after sometime.");
    	console.log(data.responseText);  
    });
});


/**
 * Get stream and perform undo-retweet action on selected tweet.
 */
$(document).on("click",".undo-retweet-status", function(e)
{
	// Ask for confirmation from user.
	if(!confirm("Are you sure you want to undo retweet this status?"))
 		return;
    
	// Get the id of the tweet on which undo-retweet is clicked
     var streamId = $(this).attr("stream-id");
     var tweetId = $(this).attr("tweet-id");
     var tweetIdStr = null; 
    	 
   // Get stream from collection.
 	 var modelStream = StreamsListView.collection.get(streamId);
 	 console.log(modelStream);
 	
     // If stream type is "Sent" then "tweet-id-str" is tweet handle else "retweet-id" to perform action.
     if(modelStream.toJSON().stream_type == "Sent")
    	 tweetIdStr = $(this).attr("tweet-id-str");
     else if(modelStream.toJSON().stream_type == "Home")
    	 tweetIdStr = $(this).attr("retweet-id");
 	 console.log(this);
	
	/* Sends get request to url "core/social/undoretweet/" and Calls StreamAPI with 
     * Stream id, tweet id and tweet idStr as path parameters.
     */
    $.get("/core/social/undoretweet/" + streamId + "/" + tweetId+ "/" + tweetIdStr,

    function (data)
    {    	
    	console.log(data);
    	
    	// Undo-Retweet is Unsuccessful.
    	if(data == "Unsuccessful")
    		{
    		  alert("Retry after sometime.");
    		  return;
    		}    	
    	
        // On success, Change retweet icon to normal.    	
    	// Get tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	// Delete tweet from stream
    	if(modelTweet.toJSON().stream_type == "Sent")
    		 modelTweet.set("deleted_msg","deleted");
    	else    		
    	   modelTweet.unset("retweeted_by_user");
    	
    	console.log(modelTweet.toJSON());
    	
    	// Add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    	
    	 // Remove tweet element from ui
		 $('.deleted').remove();
		 
		// Create normal time.
		 head.js('lib/jquery.timeago.js', function(){	 
			        $(".time-ago", $(".chirp-container")).timeago(); });	
    }).error(function (data)
    {
        // Error message is shown when error occurs
    	alert("Retry after sometime.");
    	console.log(data.responseText);  
    });
});

/**
 * Get stream and perform favorite action on selected tweet.
 */
$(document).on("click",".favorite-status", function(e)
{	
	// Get the id of the tweet on which retweet is clicked
     var streamId = $(this).attr("stream-id");
     var tweetId = $(this).attr("tweet-id");
 	 var tweetIdStr = $(this).attr("tweet-id-str");
 	 var tweetOwner = $(this).attr("tweet-owner");
 	 console.log(this);
	
	/* Sends get request to url "core/social/favorite/" and Calls StreamAPI with 
     * Stream id, tweet idStr as path parameters.
     */
    $.get("/core/social/favorite/" + streamId + "/" + tweetIdStr,

    function (data)
    {
    	console.log(data);
    	
    	// Favorite is Unsuccessful.
    	if(data == "Unsuccessful")
    		{
    		  alert("Retry after sometime.");
    		  return;
    		}    
    	
        // On success, the color of the favorite is shown orange.   	
    	// Get stream from collection.
    	var modelStream = StreamsListView.collection.get(streamId);
    	console.log(modelStream);
    	
    	// Get tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	// Update attribute in tweet.
    	modelTweet.set("favorited_by_user","true");
    	console.log(modelTweet.toJSON());
    	
    	// Add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    	
    	// Create normal time.
		head.js('lib/jquery.timeago.js', function(){	 
			        $(".time-ago", $(".chirp-container")).timeago(); });
    }).error(function (data)
    {
        // Error message is shown when error occurs
    	alert("Retry after sometime.");
    	console.log(data.responseText);  
    });
});


/**
 * Get stream and perform undo-favorite action on selected tweet.
 */
$(document).on("click",".undo-favorite-status", function(e)
{
	// Get the id of the tweet on which retweet is clicked
     var streamId = $(this).attr("stream-id");
     var tweetId = $(this).attr("tweet-id");
 	 var tweetIdStr = $(this).attr("tweet-id-str");
 	 var tweetOwner = $(this).attr("tweet-owner");
 	 console.log(this);
	
	/* Sends get request to url "core/social/undofavorite/" and Calls StreamAPI with 
     * Stream id, tweet idStr as path parameters.
     */
    $.get("/core/social/undofavorite/" + streamId + "/" + tweetIdStr,

    function (data)
    {    	
    	console.log(data);
    	
    	// Favorite is Unsuccessful.
    	if(data == "Unsuccessful")
    		{
    		  alert("Retry after sometime.");
    		  return;
    		}
    	
        // On success, Change favorite icon to normal.
    	// Get stream from collection.
    	var modelStream = StreamsListView.collection.get(streamId);
    	console.log(modelStream);
    	
    	// Get tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	// Delete tweet from stream
    	modelTweet.unset("favorited_by_user");
    	console.log(modelTweet.toJSON());
    	
    	// Add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    	
    	// Create normal time.
		head.js('lib/jquery.timeago.js', function(){	 
			        $(".time-ago", $(".chirp-container")).timeago(); });
    }).error(function (data)
    {
        // Error message is shown when error occurs
    	alert("Retry after sometime.");
    	console.log(data.responseText);  
    });
});

/**
 * Sends details of tweet and stream id. Method will check whether 
 * relashionship of stream owner and tweet owner, 
 * so more options will be displyed as per that. 
 * 
 * @param stream_id
 * 			stream id to fetch stream details.
 * @param tweetOwner
 * 			Twitter user's screen name.
 */
$(document).on("click",".more-options", function(e)
{	
  console.log("more-options in function");
    
  var streamId = $(this).attr("stream-id");
  var tweetId = $(this).attr("tweet-id");
  var tweetIdStr = $(this).attr("tweet-id-str");
  var tweetOwner = $(this).attr("tweet-owner");
  var elementId = $(this).attr("id");
    
  // Fetch stream from collection
  var stream = StreamsListView.collection.get(streamId).toJSON();
    
  // Remove extra element from dropdown menu list.
  $('.list-clear').remove();
  
  // Close all dropdowns of other tweets.
  $('.more-options-list').toggle( false );
  
  // Open dropdown with slow speed.
  $('#'+elementId+'_list').toggle( "slow" );
  
  // Tweet belongs to stream owner so no extra options required.
  if(stream.screen_name == tweetOwner)
	  return;
  
// Check stream owner relashionship tweet owner.
  $.get("/core/social/checkrelationship/" + streamId + "/" + tweetOwner,
    function (data)
	  {
	     console.log(data);	    
	     
	    // Stream owner follows tweet owner then add unfollow option
	    if(data.follow == "true")
	    	{
	      	  console.log("in unfollow");
	          $('#'+elementId+'_list').append('<li class="list-clear"><a href="#social" class="unfollow-user" tweet-owner='+tweetOwner+' tweet-id='+tweetId+' tweet-id-str='+tweetIdStr+' stream-id='+streamId+'>Unfollow @'+tweetOwner+'</a></li>');
	    	}
	    // Stream owner not following tweet owner then add follow option
	    else if(data.follow == "false")
	    	{
	    	  console.log("in follow");
	    	  $('#'+elementId+'_list').append('<li class="list-clear"><a href="#social" class="follow-user" tweet-owner='+tweetOwner+' tweet-id='+tweetId+' tweet-id-str='+tweetIdStr+' stream-id='+streamId+'>Follow @'+tweetOwner+'</a></li>');
	    	}
	  
  	    // Tweet owner is stream owner's follower then add send DM option
	    if(data.follower == "true")
           {	    	
   	         console.log("in send DM");
             $('#'+elementId+'_list').append('<li class="list-clear"><a href="#social" class="direct-message" tweet-owner='+tweetOwner+' tweet-id='+tweetId+' tweet-id-str='+tweetIdStr+' stream-id='+streamId+'>Send Direct Message</a></li>');	    	
           }
	    
	    // Check tweet owner is Block or Unblock
	    if(data.blocked == "true")
           {	    	
   	         console.log("in unblock");
             $('#'+elementId+'_list').append('<li class="list-clear"><a href="#social" class="unblock-user" tweet-owner='+tweetOwner+' tweet-id='+tweetId+' tweet-id-str='+tweetIdStr+' stream-id='+streamId+'>Unblock @'+tweetOwner+'</a></li>');	    	
            }	    
        else if(data.blocked == "false")
            {	    	
   	          console.log("in block");
              $('#'+elementId+'_list').append('<li class="list-clear"><a href="#social" class="block-user" tweet-owner='+tweetOwner+' tweet-id='+tweetId+' tweet-id-str='+tweetIdStr+' stream-id='+streamId+'>Block @'+tweetOwner+'</a></li>');	    	
            }
	  }).error(function (data)
		  {
		    // Error message is shown when error occurs
			  alert("Retry after sometime.");
			  console.log(data.responseText);  
		  });
});

/**
 * Sends follow request to Follow the contact's Twitter profile in Twitter based on
 * stream id and Twitter user's screen name
 * 
 * @param stream_id
 * 			stream id to fetch stream details
 * @param tweetOwner
 * 			Twitter user's screen name to send follow request
 */
$(document).on("click",".follow-user", function(e)
		 {
			// Details to be pass on to method.
			var streamId = $(this).attr("stream-id");		
			var tweetOwner = $(this).attr("tweet-owner");
			console.log(this);
		    	
			// Calls method to send request to follow user.
		    $.get("/core/social/followuser/" + streamId + "/" + tweetOwner, function (data)
		    {
		    	console.log(data);
		    	
		    	if(data == "true")
		           alert("Now you are following @"+tweetOwner);
		    	else if(data == "false")
		    	   alert("Retry after sometime.");
		    }).error(function (data)
		    {
		        // Error message is shown if error occurs
		    	alert("Retry after sometime.");
		    	console.log(data.responseText);  
		    });
		});
/**
 * Sends unfollow request to unFollow the contact's Twitter profile in Twitter based on
 * stream id and Twitter user's screen name
 * 
 * @param stream_id
 * 			stream id to fetch stream details
 * @param tweetOwner
 * 			Twitter user's screen name to send unfollow request
 */
$(document).on("click",".unfollow-user", function(e)
 {
	// Details to be pass on to method.
	var streamId = $(this).attr("stream-id");	
	var tweetOwner = $(this).attr("tweet-owner");
	console.log(this);
    	
	// Calls method to send request to unfollow user.
    $.get("/core/social/unfollowuser/" + streamId + "/" + tweetOwner, function (data)
    {
    	console.log(data);
    	
    	if(data == "Unfollowed")
          alert("Now you are not following @"+tweetOwner);
    	else if(data == "Unsuccessful")
    		alert("Retry after sometime.");
    }).error(function (data)
    {
        // Error message is shown if error occurs
    	alert("Retry after sometime.");
    	console.log(data.responseText);  
    });
});

/**
 * Sends block request to Block the contact's Twitter profile in Twitter based on
 * stream id and Twitter user's screen name.
 * 
 * @param stream_id
 * 			stream id to fetch stream details
 * @param tweetOwner
 * 			Twitter user's screen name to send block request
 */
$(document).on("click",".block-user", function(e)
		 {
			// Details to be pass on to method.
			var streamId = $(this).attr("stream-id");		
			var tweetOwner = $(this).attr("tweet-owner");
			console.log(this);
		    	
			// Calls method to send request to block user.
		    $.get("/core/social/blockuser/" + streamId + "/" + tweetOwner, function (data)
		    {
		    	console.log(data);
		    	
		    	if(data == "true")
		           alert("You just blocked @"+tweetOwner);
		    	else if(data == "false")
		    	   alert("Retry after sometime.");
		    }).error(function (data)
		    {
		        // Error message is shown if error occurs
		    	alert("Retry after sometime.");
		    	console.log(data.responseText);  
		    });
		});

/**
 * Sends unblocked request to unBlocked the contact's Twitter profile in Twitter based on
 * stream id and Twitter user's screen name.
 * 
 * @param stream_id
 * 			stream id to fetch stream details
 * @param tweetOwner
 * 			Twitter user's screen name to send unblock request
 */
$(document).on("click",".unblock-user", function(e)
 {
	// Details to be pass on to method.
	var streamId = $(this).attr("stream-id");	
	var tweetOwner = $(this).attr("tweet-owner");
	console.log(this);
    	
	// Calls method to send request to unblock user.
    $.get("/core/social/unblockuser/" + streamId + "/" + tweetOwner, function (data)
    {
    	console.log(data);
    	
    	if(data == "Unblock")
          alert("You just unblock @"+tweetOwner);
    	else if(data == "Unsuccessful")
    		alert("Retry after sometime.");
    }).error(function (data)
    {
        // Error message is shown if error occurs
    	alert("Retry after sometime.");
    	console.log(data.responseText);  
    });
});

/**
 * Sends delete request to Twitter profile in Twitter based on
 * stream id, Twitter user's screen name and tweet id.
 */
$(document).on("click",".delete-tweet", function(e)
 {
	// Ask confirmation to user.
	if(!confirm("Are you sure you want to delete this tweet?"))
		return;
	
	// Details to pass on to method.
	var streamId = $(this).attr("stream-id");	
	var tweetOwner = $(this).attr("tweet-owner");
	var tweetId = $(this).attr("tweet-id");
	var tweetIdStr = $(this).attr("tweet-id-str");
	console.log(this);
    
	// Call method with details of tweet to be deleted.
    $.get("/core/social/deletetweet/" + streamId + "/" + tweetOwner+ "/" +tweetIdStr, function (data)
    {
    	console.log("data : "+data);
        alert(data);        
        
        if(data == "Successful")
        	{
        
        		// Get stream from collection.
        		var modelStream = StreamsListView.collection.get(streamId);
        		console.log(modelStream);
    	
        		// Get tweet from stream.
        		var modelTweet = modelStream.get('tweetListView').get(tweetId);
        		console.log(modelTweet.toJSON());
    	
        		modelTweet.set("deleted_msg","deleted");
    	
        		console.log(modelTweet.toJSON());
    	
        		// Add back to stream.
        		modelStream.get('tweetListView').add(modelTweet);
        		console.log(modelStream);
    	
        		// Remove tweet element from ui
        		$('.deleted').remove();
        	}
        else if(data == "Unsuccessful")
        	{
        		alert("Retry after sometime.");
        	}
    }).error(function (data)
    {
        // Error message is shown if error occurs
    	alert("Retry after sometime.");
    	console.log(data.responseText);  
    });   
});
