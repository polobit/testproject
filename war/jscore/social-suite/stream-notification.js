/**
 * Remove no tweet notification. Search for that tweet in collection and makes
 * that tweets model hide.
 */
function clearNoTweetNotification(modelStream)
{
	console.log("In clearNoTweetNotification.");

	// Get tweet from stream.
	var modelTweet = modelStream.get('tweetListView').get('000');

	console.log(modelTweet);

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
	console.log("errorMsg: ");
	console.log(errorMsg);
	var streamId = null;

	// Get stream id.
	if (errorMsg.id == "001") // from Tweet
		streamId = errorMsg.stream_id;
	else
		// from Stream
		streamId = errorMsg.id;

	// Hide waiting symbol.
	$("#stream-spinner-modal-" + streamId).hide();

	var modelTempStream = Temp_Streams_List_View.collection.get(streamId);
	var modelStream = Streams_List_View.collection.get(streamId);

	if (modelStream.get('tweetListView').length == 0 && modelTempStream.get('tweetListView').length == 0)
	{
		console.log("There is nothing to display");
		console.log(modelStream.get('tweetListView'));
		console.log(modelTempStream.get('tweetListView'));

		// Add notification of error on stream.
		document.getElementById('stream_notifications_' + streamId).innerHTML = '<p>Request rate limit exceeded, Retry after some time. <i class="icon icon-refresh" title="Retry again."></i></p>';

		// Add relation from <div> for notification.
		$('#stream_notifications_' + streamId).attr("rel", 'retry');
	}
}
