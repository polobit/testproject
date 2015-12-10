/**
 * When social tab is not selected or user is in different tab, so add isNew
 * field with value true in tweet. so that will usefull to count unread tweets
 * and display that count in stream notification.
 */
function isNewUnreadTweet(tweet)
{
	var modelStream = null;

	// Newly register stream tweet or first tweet. So need to take stream from
	// original collection.
	if (tweet.id == "000" || tweet.type == "ACK")
	{
		console.log("got 000");
	}
	else
	{
		tweet["isNew"] = "true";
	}

	// Get stream from collection.
	modelStream = Streams_List_View.collection.get(tweet.stream_id);

	// Add tweet to stream model.
	rebuildTweet(modelStream, tweet);
}

/**
 * Calls method to Add Tweet in relevant stream (in sub-collection) with some extra tags as per
 * requirement are added. We were not having pubnub channel capacity so this solution
 * applied.
 */
function rebuildTweet(modelStream, tweet)
{
	// Hide waiting symbol.
	$("#stream-spinner-modal-" + tweet.stream_id).hide();

	// Add type of message
	if (tweet.text == "There is no tweets to show here." || tweet.text == "Dear you do not have any tweets.")
	{
		tweet["msg_type"] = "NoTweet";
		tweet["show"] = true;
		tweet.text = "No Tweets to show here.";
	}
	else if (tweet.type == "ACK")
	{
		// This ACK is from our social server to indicate current stream is
		// registered.
		tweet["msg_type"] = "ACK";
		tweet["text"] = "ACK";
	}
	else
	{
		//console.log(tweet);
		if (tweet.text == null || tweet.user == null)
			return;

		tweet["msg_type"] = "Tweet";

		//console.log(modelStream.get('tweetListView').length);

		// Remove no tweet notification.
		if (modelStream.get('tweetListView').length == 2)
			clearNoTweetNotification(modelStream);

		// If stream owner is tweet owner no need to show retweet icon.
		if (modelStream.get('screen_name') != tweet.user.screen_name)
			tweet["tweetowner_not_streamuser"] = true;

		// If stream is Sent or tweet owner is stream owner then show delete
		// option.
		if (tweet.stream_type == "Sent" || modelStream.get('screen_name') == tweet.user.screen_name)
			tweet["deletable_tweet"] = true;

		// If tweet is DM then show delete options and hide other options.
		if (tweet.stream_type == "DM_Inbox" || tweet.stream_type == "DM_Outbox")
		{
			tweet["direct_message"] = true;
			tweet["deletable_tweet"] = true;
		}

		// To set RT icon green, to show tweet is RT by user.
		var checkRT = modelStream.get('screen_name') + " retweeted";
		if (tweet.retweeted == checkRT)
			tweet["retweeted_by_user"] = true;

		// Save original text for other actions.
		tweet["original_text"] = tweet.text;

		// Converts normal text to tweet with link on url, # and @.
		tweet.text = convertTextToTweet(tweet);
	}

	// console.log("tweet : "+tweet.text);
	// console.log("add at "+modelStream.get('tweetListView').length);

	// On scroll down, To avoid freezing, collect 5 tweets in JSON Array and then add to stream.
	if (Scroll_Down_Call == true)
	{
		checkPastTweetAdd(tweet, modelStream);
		return;
	}

	/*
	 * Ack from server that shows current streams registration is done. So call
	 * register all with new counter to register next stream
	 */
	if (tweet.type == "ACK")
	{
		Register_Counter++;
		registerAll(Register_Counter);
	}

	// Add tweet to relevant stream.
	addTweetToStream(tweet, modelStream);
}

/**
 * Add given tweets in given stream model which is sub-collection.
 */
function addTweetToStream(tweet, modelStream)
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
	displayTimeAgo($(".chirp-container"));
}

/**
 * Removes isNew field from tweet so new unread tweet can be visible in stream. 
 */
function mergeNewUnreadTweets(streamId)
{
	// Get stream from collections.
	var stream = Streams_List_View.collection.get(streamId);

	var newAddedTweets = stream.get('tweetListView').where({ isNew : "true" });

	$.each(newAddedTweets, function(i, tweetModel)
	{
		tweetModel.unset("isNew");
	});

	// Create normal time.
	displayTimeAgo($(".chirp-container"));

	// Remove waiting symbol.
	removeWaiting();
}
