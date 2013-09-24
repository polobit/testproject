/**
 * get stream and create tweet and post it.
 */
$(document).on("click",".compose-message", function(e)
{	
	var streamId = $(this).attr("stream-id");
	console.log(this);
	 
	//fetch stream from collection
	var stream = StreamsListView.collection.get(streamId).toJSON();
	
	// Store info in a json, to send it to the modal window when making send tweet request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Tweet";
        
    // Information to be shown in the modal to the user while sending message    
    json["info"] = "Owner of Tweet is " + stream.screen_name;

    json["description"] = "What's happening?" /*+ Twitter_current_profile_screen_name*/;
	    
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
    $('#send_tweet').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#socialsuite-twitter_messageForm")))
        {
            return;
        }

        $("#spinner-modal").show();
        
        // Sends post request to url "/core/social/tweet/" and Calls StreamsAPI with 
        // stream id and Twitter id as path parameters and form as post data
        $.post("/core/social/tweet/" + streamId ,
        $('#socialsuite-twitter_messageForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // On success, shows the status as sent
            $('#socialsuite-twitter_messageModal').find('span.save-status').html("sent");

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
            twitterError(data.responseText);
        });
    });
});

/**
 * get stream and create reply tweet and post it.
 */
$(document).on("click",".reply-message", function(e)
{	
	var streamId = $(this).attr("stream-id");
	var tweetId = $(this).attr("tweet-id");
	var tweetIdStr = $(this).attr("tweet-id-str");
	var tweetOwner = $(this).attr("owner-tweet");
	console.log(this);
	 
	//fetch stream from collection
	var stream = StreamsListView.collection.get(streamId).toJSON();
	
	// Store info in a json, to send it to the modal window when making send tweet request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Reply Tweet";
        
    // Information to be shown in the modal to the user while sending message    
    json["info"] = "Owner of Tweet is " + stream.screen_name;

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
        {
            return;
        }

        $("#spinner-modal").show();
        
        // Sends post request to url "/core/social/replytweet/" and Calls StreamsAPI with 
        // stream id and Twitter id as path parameters and form as post data
        $.post("/core/social/replytweet/" + streamId ,
        $('#socialsuite-twitter_messageForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // On success, shows the status as sent
            $('#socialsuite-twitter_messageModal').find('span.save-status').html("sent");

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
            twitterError(data.responseText);
        });
    });
});

/**
 * Sends a direct message to the Twitter profile of the contact based on Twitter Id of the profile
 * set to the contact  
 */
$(document).on("click",".direct-message", function(e)
{	
	var streamId = $(this).attr("stream-id");
	var tweetId = $(this).attr("tweet-id");
	var tweetIdStr = $(this).attr("tweet-id-str");
	var tweetOwner = $(this).attr("owner-tweet");
	console.log(this);
	 
	//fetch stream from collection
	var stream = StreamsListView.collection.get(streamId).toJSON();
	
	// Store info in a json, to send it to the modal window when making send tweet request
    var json = {};

    // Set headline of modal window as Send Message
    json["headline"] = "Direct Message";
        
    // Information to be shown in the modal to the user while sending message    
    json["info"] = stream.screen_name + " sending direct message to " + tweetOwner;
    
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
        {
            return;
        }

        $("#spinner-modal").show();
        
        // Sends post request to url "/core/social/replytweet/" and Calls StreamsAPI with 
        // stream id and Twitter id as path parameters and form as post data
        $.post("/core/social/directmessage/" + streamId ,
        $('#socialsuite-twitter_messageForm').serialize(),

        function (data)
        {
        	 $("#spinner-modal").hide();
        	 
            // On success, shows the status as sent
            $('#socialsuite-twitter_messageModal').find('span.save-status').html("sent");

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
            twitterError(data.responseText);
        });
    });
});

/**
 * get stream and perform retweet action.
 */
$(document).on("click",".retweet-status", function(e)
{
	if(!confirm("Are you sure you want to retweet this status to your followers?"))
 		return;
    
	// Get the id of the tweet on which retweet is clicked
     var streamId = $(this).attr("stream-id");
     var tweetId = $(this).attr("tweet-id");
 	 var tweetIdStr = $(this).attr("tweet-id-str");
 	 var tweetOwner = $(this).attr("owner-tweet"); 	
 	 console.log(this);
	
	/* Sends get request to url "core/social/retweet/" and Calls StreamAPI with 
     * stream id, tweet id and tweet owner as path parameters.
     */
    $.get("/core/social/retweet/" + streamId + "/" + tweetIdStr,

    function (data)
    {
        // On success, the color of the retweet is shown green    	
    	//Get stream from collection.
    	var modelStream = StreamsListView.collection.get(streamId);
    	console.log(modelStream);
    	
    	//Gwt tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	//update attribute in tweet.
    	modelTweet.set("retweeted_by_user","true");
    	console.log(modelTweet.toJSON());
    	
    	//add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    }).error(function (data)
    {
        // Error message is shown when error occurs
    	tweetError(data.responseText);
    });
});


/**
 * get stream and perform undo-retweet action.
 */
$(document).on("click",".undo-retweet-status", function(e)
{
	if(!confirm("Are you sure you want to undo retweet this status?"))
 		return;
    
	// Get the id of the tweet on which retweet is clicked
     var streamId = $(this).attr("stream-id");
     var tweetId = $(this).attr("tweet-id");
     var tweetIdStr = $(this).attr("tweet-id-str");      
 	 console.log(this);
	
	/* Sends get request to url "core/social/undoretweet/" and Calls StreamAPI with 
     * stream id, tweet id and tweet owner as path parameters.
     */
    $.get("/core/social/undoretweet/" + streamId + "/" + tweetId+ "/" + tweetIdStr,

    function (data)
    {    	
    	console.log(data);
    	
        //change retweet icon to normal.
    	//Get stream from collection.
    	var modelStream = StreamsListView.collection.get(streamId);
    	console.log(modelStream);
    	
    	//Gwt tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	//delete tweet from stream
    	if(modelTweet.toJSON().stream_type == "Sent")
    		 modelTweet.set("deleted_msg","deleted");
    	else    		
    	   modelTweet.unset("retweeted_by_user");
    	
    	console.log(modelTweet.toJSON());
    	
    	//add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    	
    	 //remove tweet element from ui
		 $('.deleted').remove();
    }).error(function (data)
    {
        // Error message is shown when error occurs
    	tweetError(data.responseText);
    });
});

/**
 * get stream and perform favorite action.
 */
$(document).on("click",".favorite-status", function(e)
{	
	// Get the id of the tweet on which retweet is clicked
     var streamId = $(this).attr("stream-id");
     var tweetId = $(this).attr("tweet-id");
 	 var tweetIdStr = $(this).attr("tweet-id-str");
 	 var tweetOwner = $(this).attr("owner-tweet");
 	 console.log(this);
	
	/* Sends get request to url "core/social/favorite/" and Calls StreamAPI with 
     * stream id, tweet id and tweet owner as path parameters.
     */
    $.get("/core/social/favorite/" + streamId + "/" + tweetIdStr,

    function (data)
    {
        // On success, the color of the retweet is shown green    	
    	//Get stream from collection.
    	var modelStream = StreamsListView.collection.get(streamId);
    	console.log(modelStream);
    	
    	//Gwt tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	//update attribute in tweet.
    	modelTweet.set("favorited_by_user","true");
    	console.log(modelTweet.toJSON());
    	
    	//add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    }).error(function (data)
    {
        // Error message is shown when error occurs
    	tweetError(data.responseText);
    });
});


/**
 * get stream and perform undo-favorite action.
 */
$(document).on("click",".undo-favorite-status", function(e)
{
	// Get the id of the tweet on which retweet is clicked
     var streamId = $(this).attr("stream-id");
     var tweetId = $(this).attr("tweet-id");
 	 var tweetIdStr = $(this).attr("tweet-id-str");
 	 var tweetOwner = $(this).attr("owner-tweet");
 	 console.log(this);
	
	/* Sends get request to url "core/social/undofavorite/" and Calls StreamAPI with 
     * stream id, tweet id and tweet owner as path parameters.
     */
    $.get("/core/social/undofavorite/" + streamId + "/" + tweetIdStr,

    function (data)
    {    	
        //change retweet icon to normal.
    	//Get stream from collection.
    	var modelStream = StreamsListView.collection.get(streamId);
    	console.log(modelStream);
    	
    	//Gwt tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	//delete tweet from stream
    	modelTweet.unset("favorited_by_user");
    	console.log(modelTweet.toJSON());
    	
    	//add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    }).error(function (data)
    {
        // Error message is shown when error occurs
    	tweetError(data.responseText);
    });
});

$(document).on("click",".more-options", function(e)
{	
  //close all dropdown of all tweets	
  $('.dropdown').removeClass("open");  
  
  var streamId = $(this).attr("stream-id");
  var tweetId = $(this).attr("tweet-id");
  var tweetIdStr = $(this).attr("tweet-id-str");
  var tweetOwner = $(this).attr("owner-tweet");
  var elementId = $(this).attr("id");
  
  $(this).dropdown('toggle'); 
  
  // fetch stream from collection
  var stream = StreamsListView.collection.get(streamId).toJSON();
  
  if(stream.screen_name == tweetOwner)
	  return;
  
  $.get("/core/social/checkfollowing/" + streamId + "/" + tweetOwner,
    function (data)
	  {
	    console.log(data);
	    if(data == "true")
	    	{	    	  
	    	  console.log("in unfollow");
	          $('#'+elementId+'_list').append('<li><a href="#socialsuite" class="unfollow-user" owner-tweet='+tweetOwner+' tweet-id='+tweetId+' tweet-id-str='+tweetIdStr+' stream-id='+streamId+'>Unfollow @'+tweetOwner+'</a></li>');	    	
            }
	    else if(data == "false")
	    	{
	    	  console.log("in follow");
	    	  $('#'+elementId+'_list').append('<li><a href="#socialsuite" class="follow-user" owner-tweet='+tweetOwner+' tweet-id='+tweetId+' tweet-id-str='+tweetIdStr+' stream-id='+streamId+'>Follow @'+tweetOwner+'</a></li>');
	    	}
	    $.get("/core/social/checkfollower/" + streamId + "/" + tweetOwner,
	    	    function (data1)
	    		  {	    	      
	    	       console.log(data1);
	    	       if(data1 == "true")
	    	         {	    	
	    	    	   console.log("in send DM");
	                   $('#'+elementId+'_list').append('<li><a href="#socialsuite" class="direct-message" owner-tweet='+tweetOwner+' tweet-id='+tweetId+' tweet-id-str='+tweetIdStr+' stream-id='+streamId+'>Send Direct Message</a></li>');	    	
                     }
	    		  });
	  }).error(function (data)
	  {
	    // Error message is shown when error occurs
	   	tweetError(data.responseText);
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
			var streamId = $(this).attr("stream-id");		
			var tweetOwner = $(this).attr("owner-tweet");
			console.log(this);
		    	
		    $.get("/core/social/followuser/" + streamId + "/" + tweetOwner, function (data)
		    {
		    	console.log(data);
		        alert("Now you are following @"+tweetOwner);
		    }).error(function (data)
		    {
		        // Error message is shown if error occurs
		    	twitterError(data.responseText);
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
	var streamId = $(this).attr("stream-id");	
	var tweetOwner = $(this).attr("owner-tweet");
	console.log(this);
    	
    $.get("/core/social/unfollowuser/" + streamId + "/" + tweetOwner, function (data)
    {
    	console.log(data);
        alert("Now you are not following @"+tweetOwner);
    }).error(function (data)
    {
        // Error message is shown if error occurs
    	twitterError(data.responseText);
    });
});

/**
 * Sends delete request to Twitter profile in Twitter based on
 * stream id and Twitter user's screen name and tweet id.
 */
$(document).on("click",".delete-tweet", function(e)
 {
	if(!confirm("Are you sure you want to delete this tweet?"))
		return;
	
	var streamId = $(this).attr("stream-id");	
	var tweetOwner = $(this).attr("owner-tweet");
	var tweetId = $(this).attr("tweet-id");
	var tweetIdStr = $(this).attr("tweet-id-str");
	console.log(this);
    
    $.get("/core/social/deletetweet/" + streamId + "/" + tweetOwner+ "/" +tweetIdStr, function (data)
    {
    	console.log("data : "+data);
        alert(data);        
        
        //Get stream from collection.
    	var modelStream = StreamsListView.collection.get(streamId);
    	console.log(modelStream);
    	
    	//Gwt tweet from stream.
    	var modelTweet = modelStream.get('tweetListView').get(tweetId);
    	console.log(modelTweet.toJSON());
    	
    	modelTweet.set("deleted_msg","deleted");
    	
    	console.log(modelTweet.toJSON());
    	
    	//add back to stream.
    	modelStream.get('tweetListView').add(modelTweet);
    	console.log(modelStream);
    	
    	//remove tweet element from ui
		$('.deleted').remove();        
    }).error(function (data)
    {
        // Error message is shown if error occurs
    	twitterError(data.responseText);
    });   
});

function twitterError(error)
{
	Errorjson['message'] = error;
    
	$('#twitter-error-panel').html(getTemplate('twitter-error-panel', Errorjson));
	$('#twitter-error-panel').show();
	
	// Hides the modal after 2 seconds after the sent is shown
    $('#twitter-error-panel').fadeOut(10000);
    
}

function tweetError(error)
{
	Errorjson['message'] = error;
    
    // Error message is shown to the user
	$('#tweet-error-panel').html(getTemplate('twitter-error-panel', Errorjson));
	$('#tweet-error-panel').show();
	
	// Hides the modal after 2 seconds after the sent is shown
    $('#tweet-error-panel').fadeOut(10000);
}

function twitterMainError(error)
{
	Errorjson['message'] = error;
    
	$('#Twitter').html(getTemplate('twitter-error-panel', Errorjson));
}