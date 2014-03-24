/*
 * Check for new tweets when user was not in social tab. Show new tweet
 * notification on respective stream with number of new tweet.
 */
function checkNewTweets()
{
	var streamsJSON = Temp_Streams_List_View.collection.toJSON();

	// Streams not available.
	if (streamsJSON == null)
	{
		return;
	}

	// Get stream
	$.each(
					streamsJSON,
					function(i, stream)
					{
						var newTweet = true;

						// Get stream from collection.
						var modelStream = Temp_Streams_List_View.collection.get(stream.id);

						if (modelStream != null || modelStream != undefined)
						{
							if (modelStream.get('tweetListView').length == 1)
							{
								// Get tweet from stream.
								var modelTweet = modelStream.get('tweetListView').get('000');

								// "There is no tweet" is added in stream, so
								// need to show notification for that.
								if (modelTweet != null || modelTweet != undefined)
								{
									newTweet = false;
								}
								else
								// New tweet is common tweet so need to add
								// notification.
								{
									// Add notification of new tweets on stream.
									document.getElementById('stream_notifications_' + stream.id).innerHTML = '<p>' + modelStream.get('tweetListView').length + ' new Tweet </p>';

									// Add relation from <div> for notification.
									$('#stream_notifications_' + stream.id).attr("rel", 'add-new-tweet');
								}
							}
							else if (modelStream.get('tweetListView').length > 1)
							{
								// Add notification of new tweets on stream.
								document.getElementById('stream_notifications_' + stream.id).innerHTML = '<p>' + modelStream.get('tweetListView').length + ' new Tweets </p>';

								// Add relation from <div> for notification.
								$('#stream_notifications_' + stream.id).attr("rel", 'add-new-tweet');
							}

							if (newTweet == true && modelStream.get('tweetListView').length >= 1)
							{
								// Remove no tweet notification.
								clearNoTweetNotification(Streams_List_View.collection.get(stream.id));
							}
						}
					});

	// Remove deleted tweet element from ui
	$('.deleted').remove();
}
