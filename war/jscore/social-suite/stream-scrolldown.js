/**
 * Checks scroll reached to end or not. Suppose it reached to end then call past
 * tweets and add to stream as well as maintain scrolls current position.
 * 
 * @param elementDiv -
 *            element where scrollDown performed
 */
function OnScrollDiv(elementDiv)
{
	// Check scroll bar is reached to end and function is not called before.
	if (($(elementDiv).scrollTop() + $(elementDiv).innerHeight() >= $(elementDiv)[0].scrollHeight) && ($(elementDiv).attr("data") == "0"))
	{

		// Function is alredy called for this stream.
		$(elementDiv).attr("data", "1");

		// Get stream id.
		var streamId = ($(elementDiv).closest('li').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Stream not found.
		if (modelStream == undefined || modelStream == null)
			return;

		// model to json.
		var stream = modelStream.toJSON();

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').at(modelStream.get('tweetListView').length - 2);
		var tweet = modelTweet.toJSON();
	
		// Store reference to top message
		var currMsg = $("#" + tweet.id);

		// Store current scroll/offset
		var curOffset = currMsg.offset().top - $(elementDiv).scrollTop();

		// Append loading icon.
		$(elementDiv)
				.append(
						'<span id="stream-waiting-modal-' + streamId + '" class="span6" style="margin-top: 3px;"><img class="pull-right" style="width:20px;height:20px;" src="img/ajax-spinner.gif"></span>');

		/*
		 * Calls TwitterAPI class to request for 20 more updates tweeted before
		 * the tweet id of the last update
		 */
		$
				.getJSON(
						"/core/social/pasttweets/" + stream.id + "/" + tweet.id + "/" + tweet.id_str,
						function(data)
						{
							// If no more updates available, show message.
							if (data == null)
							{
								showNotyPopUp('information', "No more updates available for stream " + stream.stream_type + " of " + stream.screen_name, "top",
										5000);

								// Remove loading icon.
								$('#stream-waiting-modal-' + streamId).remove();

								// Do not call this function again once its
								// called on one scroll.
								$(elementDiv).attr("data", "1");

								// Twitter icon and up arrow appended in stream
								// to show no more tweets available.
								$(elementDiv)
										.append(
												'<span id="past-tweet-end-' + streamId + '" class="span6" style="margin-top: 3px;color: #888;"><i class="pull-right icon icon-long-arrow-up"></i><i class="pull-right icon icon-twitter"></i></span>');
								return;
							}
							if (data.length == 0)
							{
								showNotyPopUp('information', "No more updates available for stream " + stream.stream_type + " of " + stream.screen_name, "top",
										5000);
								$('#stream-waiting-modal-' + streamId).remove();
								$(elementDiv).attr("data", "1");
								$(elementDiv)
										.append(
												'<span id="past-tweet-end-' + streamId + '" class="span6" style="margin-top: 3px;color: #888;"><i class="pull-right icon icon-long-arrow-up"></i><i class="pull-right icon icon-twitter"></i></span>');
								return;
							}

							/*
							 * Populate the collection with update stream
							 * details and show
							 */
							var i;
							var myObject;

							// Global flag set.
							Scroll_Down_Call = true;

							for (i = 0; i < data.length; i++)
							{
								// String to json.
								myObject = eval('(' + data[i] + ')');

								// Add tweet to stram.
								handleMessage(myObject);

								// All tweets done.
								if (i + 1 == data.length)
									Scroll_Down_Call = false;
							}

							// Add remaining tweets.
							if (Scroll_Down_Call == false && Past_Tweets_Count != 0 && Past_Tweets.length != 0)
								addPastTweetsToStream(modelStream);

							// Set scroll to current position minus previous
							// offset/scroll
							var scrollOnDiv = $('#' + streamId).find('#Column-model-list');
							scrollOnDiv.scrollTop((currMsg.offset().top - curOffset) + 650);

							// Remove loading icon.
							$('#stream-waiting-modal-' + streamId).remove();

							// One function call for current stream is over.
							$(elementDiv).attr("data", "0");

						}).error(function(data)
				{
					// Loading icon remove.
					$('#stream-waiting-modal-' + streamId).remove();

					// One function call for current stream is over.
					$(elementDiv).attr("data", "0");

					var result = data.responseText;

					// Error message is shown to the user
					if (data.responseText == "")
						showNotyPopUp('information', "No more updates available for stream " + stream.stream_type + " of " + stream.screen_name, "top", 7000);
					else if (result.indexOf("rate") != -1)
						showNotyPopUp('information', "Request rate limit exceeded, Retry after some time.", "top", 5000);
					else if (result.indexOf("Could not fetch URL") != -1)
						showNotyPopUp('information', "Please, check your internet connection.", "top", 5000);
					else
						showNotyPopUp('information', data.responseText, "top", 5000);
				});
	}

	// Remove deleted tweet element from ui
	$('.deleted').remove();
}

// Checks counter and adds tweet in json array.
function checkPastTweetAdd(tweet, modelStream)
{
	// If collected tweets less than 5.
	if (Past_Tweets_Count < 5)
	{
		// Add tweet in json array.
		Past_Tweets[Past_Tweets_Count] = tweet;

		// Increment counter.
		Past_Tweets_Count++;
	}
	else if (Past_Tweets_Count == 5)
	{
		// If collected tweets are 5 then add them in to stream.
		addPastTweetsToStream(modelStream);
	}
}

/**
 * Fetches relavant stream model from collection and update that collection with
 * past tweets fetched on scroll down.
 */
function addPastTweetsToStream(modelStream)
{
	// If no tweets to add in collection.
	if (Past_Tweets.length == 0)
		return;

	// Update collection.
	addTweetToStream(Past_Tweets, modelStream);

	// Reset json array and counter.
	Past_Tweets_Count = 0;
	Past_Tweets = [];
}
