/**
 * Calls updateNotification method to update or add new tweet notification with
 * count of new unread tweets in stream.
 * 
 * @param stream
 */
function showNotification(stream)
{
	if (stream)
		updateNotification(stream);
	else
	{
		var streamsJSON = Streams_List_View.collection.toJSON();

		// Streams not available.
		if (streamsJSON == null)
			return;

		// Get stream
		$.each(streamsJSON, function(i, stream)
		{
			updateNotification(stream);
		});
	}

	// Remove deleted tweet element from ui
	$('.deleted').remove();
}

/**
 * Check for new tweets when user was not in social tab. Show new tweet
 * notification on respective stream with number of new tweet.
 */
function updateNotification(stream)
{
	// Get stream from collection.
	var modelStream = Streams_List_View.collection.get(stream.id);

	// Get all new unread tweet on basis of isNew field value true.
	var newAddedTweets = modelStream.get('tweetListView').where({ isNew : "true" });

	// If no new unread tweets are available but stream has some tweets so clear
	// no tweet notification from stream.
	if (newAddedTweets.length == 0 && modelStream.get('tweetListView').length >= 1)
	{
		// Remove no tweet notification.
		clearNoTweetNotification(Streams_List_View.collection.get(stream.id));

		return;
	}
	else if (newAddedTweets.length == 1)
	{
		// Add notification of new tweet on stream.
		document.getElementById('stream_notifications_' + stream.id).innerHTML = '<p>' + newAddedTweets.length + ' new Tweet </p>';
	}
	else if (newAddedTweets.length > 1)
	{
		// Add notification of new tweets on stream.
		document.getElementById('stream_notifications_' + stream.id).innerHTML = '<p>' + newAddedTweets.length + ' new Tweets </p>';
	}

	/*
	 * Add relation from <div> for notification. So on click of notification we
	 * can add new unread tweets to stream.
	 */
	$('#stream_notifications_' + stream.id).attr("rel", 'add-new-tweet');
}

/**
 * Remove no tweet notification. Search for that tweet in collection and makes
 * that tweets model hide.
 */
function clearNoTweetNotification(modelStream)
{
	// Get tweet from stream.
	var modelTweet = modelStream.get('tweetListView').get('000');

	if (modelTweet != null || modelTweet != undefined)
	{
		// Set show false, so handlebar condition check will avoid to display.
		modelTweet.set("show", false);

		// Add back to stream.
		modelStream.get('tweetListView').add(modelTweet);
	}
}

/**
 * When request rate limit is exceeded so Twitter server send code 88, It will
 * not accept any more REST call. When Twitter service or network is unavailable
 * User have to wait for some time and retry again. We need to display
 * notification for that in relavant stream.
 */
function displayErrorInStream(errorMsg)
{
	var streamId = null;

	// Get stream id.
	if (errorMsg.id == "001") // from Tweet
		streamId = errorMsg.stream_id;
	else
		// from Stream
		streamId = errorMsg.id;

	// Hide waiting symbol.
	$("#stream-spinner-modal-" + streamId).hide();

	var modelStream = Streams_List_View.collection.get(streamId);

	if (modelStream.get('tweetListView').length == 0)
	{
		// Add notification of error on stream.
		document.getElementById('stream_notifications_' + streamId).innerHTML = '<p>Request rate limit exceeded, Retry after some time. <i class="icon icon-refresh" title="Retry again."></i></p>';

		// Add relation from <div> for notification.
		$('#stream_notifications_' + streamId).attr("rel", 'retry');
	}
}
