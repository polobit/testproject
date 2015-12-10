// Displays modal with filled details.
function displayFilledModal(streamId, tweetId, tweetOwner, messageType)
{
	var urlForPost = "/core/social/tweet/" + streamId;

	// Fetch stream from collection
	var modelStream = Streams_List_View.collection.get(streamId);
	var stream = modelStream.toJSON();

	if (tweetId != null)
	{
		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();
	}

	// Store info in a json, to send it to the modal window when making send
	// tweet request
	var json = {};

	json["streamId"] = streamId;
	json["profileImg"] = $("#" + streamId + "-profile-img").prop("src");
	json["domain_user_id"] = CURRENT_DOMAIN_USER.id;
	json["screen_name"] = stream.screen_name;
	json["network_type"] = "TWITTER";
	json["token"] = stream.token;
	json["secret"] = stream.secret;
	json["schedule"] = "0";

	switch (messageType) {
	case "Tweet":
	{
		// Set headline of modal window as Send Message
		json["headline"] = "Tweet";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Status from " + stream.screen_name;
		json["description"] = "What's happening?";
	}
		break;
	case "Reply Tweet":
	{
		if (messageType == "Reply Tweet" && tweetOwner == null)
		{
			// Set headline of modal window as Send Message
			json["headline"] = "Reply Tweet";

			// Information to be shown in the modal to the user while sending
			// message
			json["info"] = "Reply " + "@" + tweet.user.screen_name + " from " + stream.screen_name;
			json["description"] = "@" + tweet.user.screen_name;
			json["tweetId"] = tweet.id_str;
			json["tweetOwner"] = tweet.user.screen_name;
		}
		else if (messageType == "Reply Tweet" && tweetOwner != null)
		{
			// Set headline of modal window as Send Message
			json["headline"] = "Reply Tweet";

			// Information to be shown in the modal to the user while sending
			// message
			json["info"] = "Reply " + "@" + tweetOwner + " from " + stream.screen_name;

			json["description"] = "@" + tweetOwner;
			json["tweetOwner"] = tweetOwner;
			json["tweetId"] = null;
		}
	}
		break;
	case "Direct Message":
	{
		json["headline"] = "Direct Message";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Direct message from " + stream.screen_name + " to " + tweet.user.screen_name;

		json["description"] = "Tip: you can send a message to anyone who follows you."
		json["tweetId"] = tweet.id_str;
		json["tweetOwner"] = tweet.user.screen_name;
	}
		break;
	case "Retweet":
	{
		// Set headline of modal window as Send Message
		json["headline"] = "Retweet";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Status of " + "@" + tweet.user.screen_name;

		json["description"] = tweet.original_text;
		json["tweetId"] = tweet.id;
		json["tweetOwner"] = tweet.user.screen_name;

		urlForPost = "/core/social/retweet/" + streamId + "/" + tweet.id_str;
	}
		break;
	}

	console.log(json);

	// Display Modal
	displayModal("socialsuite_twitter_messageModal", "socialsuite-twitter-message", json, "twitter-counter", "twit-tweet", urlForPost);

	// In compose message text limit is crossed so disable send button.
	$('#twit-tweet').on('cross', function()
	{
		$('#send_tweet').attr("disabled", "disable");		
	});

	// In compose message text limit is uncrossed so enable send button.
	$('#twit-tweet').on('uncross', function()
	{
		// If scheduling is selected and schedule is in past time so do not enable schedule button.
		if(!Schedule_In_Future && $("#schedule_controls").css("display") == "block")
			return;
		
		/*
		 * 1. If scheduling is selected and selected schedule is in future time so enable schedule button.
		 * 2. If scheduling is not selected and its non schedule message so enable schedule button.
		 */
		$('#send_tweet').removeAttr('disabled');
		
	});
}

// Displays Modal.
function displayModal(modalToDisplay, templt, json, counterVar, focusElmnt, urlForPost)
{
	// If modal already exists remove to show a new one
	$('#' + modalToDisplay).remove();
	
	Schedule_In_Future = false;

	// Populate the modal template with the above json details in the form
	Message_Model = new Base_Model_View({ data : json, url : urlForPost, template : templt, modal : '#' + modalToDisplay, postRenderCallback : function(el)
	{
		$('.modal-backdrop').remove();
		
		if (Message_Model.model.get("id") || Message_Model.model.get("response") == "Successful")
			return;

		$('#' + modalToDisplay, el).modal('show');
	}, saveCallback : function(data)
	{
		// Display Noty on top.
		displayNoty(data);

		// Hide message modal.
		$('#' + modalToDisplay).modal('hide');
		$('#' + modalToDisplay).remove();
	} });

	$('#content').append(Message_Model.render().el);

	if (counterVar != null && focusElmnt != null)
	{
		// Display modal
		$('#' + modalToDisplay).on('shown', function()
		{
			head.js(LIB_PATH + 'lib/bootstrap-limit.js', function()
			{
				$(".twit-tweet-limit").limit({ maxChars : 140, counter : "#" + counterVar });
				$('#' + modalToDisplay).find('#' + focusElmnt).focus();
			});
		});
	}
}

function displayNoty(data)
{
	// data.response may be :Successful, UnSuccessful or Id of RT.
	
	if (data.response == "Successful")
	{
		if (Message_Model.model.get("headline") == "Tweet")
			showNotyPopUp('information', "Your Tweet was posted!", "top", 5000);
		else
			showNotyPopUp('information', "Your Tweet to @" + Message_Model.model.get("tweetOwner") + " has been sent!", "top", 5000);
	}
	else if (data.response == "Unsuccessful")
	{
		// On failure, shows the status as retry
		$('#socialsuite_twitter_messageModal').find('span.save-status').html("Retry");
		showNotyPopUp('information', "Retry after sometime.", "top", 5000);
	}
	else if (Message_Model.model.get("headline") == "Retweet" && data.response != undefined)
		showEffectOfRT(data);
	else if (data.id != undefined && data.schedule != undefined)
		{
    	  // Show clock icon in social suite, which is linked to shcedule update page.	
	      $("#show_scheduled_updates").show(); 
		}	
}

/*
 * Makes changes in UI, user click on RT of tweet actions, After RT it will
 * change RT icon in green color.
 */
function showEffectOfRT(data)
{
	// Fetch stream from collection
	var modelStream = Streams_List_View.collection.get(Message_Model.model.get("streamId"));

	// Get tweet from stream.
	var modelTweet = modelStream.get('tweetListView').get(Message_Model.model.get("tweetId"));

	if (modelStream == undefined || modelTweet == undefined)
		return;

	// On success, the color of the retweet is shown green. Update
	// attribute in tweet.
	modelTweet.set("retweeted_by_user", "true");
	modelTweet.set("retweet_id", data.response);

	// Add back to stream.
	modelStream.get('tweetListView').add(modelTweet);

	// Create normal time.
	displayTimeAgo($(".chirp-container"));
}
