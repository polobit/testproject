/**
 * Add tweet in stream.
 */
function handleMessage(tweet)
{
	// We need this messages to reflect actions in all added relevant streams.
	if (tweet["delete"] != null) // (tweet.delete != null)
	{
		console.log("delete tweet");
		return;
	}

	// Error message from server "Rate limit exceeded." or "server not
	// connected."
	if (tweet.id == "001") // (tweet.delete != null)
	{
		displayErrorInStream(tweet);
		return;
	}

	// Get stream from collection.
	var modelStream = Streams_List_View.collection.get(tweet.stream_id);

	if (modelStream != null || modelStream != undefined)
	{
		// console.log("Current_Route: "+Current_Route+" Focused: "+Focused);

		// User on #social as well as window is active.
		if (Current_Route == "social" && Focused == true)
		{

			// New tweet notification not yet clicked.
			if ($('#stream_notifications_' + tweet.stream_id).is(':empty') == false)
			{
				// console.log("not clicked");

				// User did not click on notification so continue adding tweets
				// in temp collection.
				addTweetToTempCollection(tweet);

				// Change notification to show number of new tweets.
				checkNewTweets();
			}
			else
			{
				// console.log("no notification");

				// Add tweet to model in normal way.
				addTweetToStream(modelStream, tweet);
			}
		}
		else
		{
			// console.log("not in social suite");

			// Add tweet to temp collection, user on another tab or window is
			// inactive.
			addTweetToTempCollection(tweet);

			if (Current_Route == "social")
			{
				// Change notification to show number of new tweets.
				checkNewTweets();
			}
		}
	} // If End

	// Remove deleted tweet element from ui
	$('.deleted').remove();

}

/**
 * Add Tweet to relevant stream with some extra tags as per requirement.
 */
function addTweetToStream(modelStream, tweet)
{
	console.log("In addTweetToStream.");

	// Hide waiting symbol.
	$("#stream-spinner-modal-" + tweet.stream_id).hide();

	// Add type of message
	if (tweet.text == "There is no tweets to show here." || tweet.text == "Dear you do not have any tweets.")
	{
		tweet["msg_type"] = "NoTweet";
		tweet["show"] = true;
		// if(tweet.text == "Dear you do not have any tweets.")
		tweet.text = "No Tweets to show here.";
	}
	else if (tweet.type == "ACK")
	{
		tweet["msg_type"] = "ACK";
		tweet["text"] = "ACK";
	}
	else
	{
		tweet["msg_type"] = "Tweet";

		console.log(modelStream.get('tweetListView').length);

		// Remove no tweet notification.
		if (modelStream.get('tweetListView').length == 2)
			clearNoTweetNotification(modelStream);

		// If stream owner is tweet owner no need to show retweet icon.0
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

	// On scroll down collect 5 tweets in JSON Array and then add to stream.
	if (Scroll_Down_Call == true)
	{
		checkPastTweetAdd(tweet, modelStream);
		return;
	}

	// Ack from server that shows current streams registeration is done.
	if (tweet.type == "ACK")
	{
		Register_Counter++;
		registerAll(Register_Counter);
	}

	// Update collection.
	updateCollection(tweet, modelStream);
}

/**
 * When social is not selected or user is on different tab, so temporarily add
 * Tweet to temp collection.
 */
function addTweetToTempCollection(tweet)
{
	var modelStream = null;

	if (tweet.id == "000" || tweet.type == "ACK")
	{
		console.log("got 000");
		// Get stream from collection.
		modelStream = Streams_List_View.collection.get(tweet.stream_id);
	}
	else
	{
		// Get stream from temp collection.
		modelStream = Temp_Streams_List_View.collection.get(tweet.stream_id);
	}

	// Add tweet to stream model.
	addTweetToStream(modelStream, tweet);
}

/** Create temporary collection to store tweets when user not on social tab. */
function createTempCollection()
{
	if (!Temp_Streams_List_View) // Streams not collected from dB
	{
		Temp_Streams_List_View = new Base_Collection_View({ url : "/core/social", restKey : "stream", templateKey : "socialsuite-streams",
			individual_tag_name : 'div', className : 'app-content container clearfix', id : 'stream_container', });

		// Creates new default function of collection
		Temp_Streams_List_View.appendItem = socialsuitecall.socialSuiteAppendItem;

		Temp_Streams_List_View.collection.fetch({ success : function(data)
		{
			console.log(Temp_Streams_List_View);
		} });
	}
}

/*
 * Convert normal text of tweet to tweet with links on @screen_name , #hashtags
 * and url.
 */
function convertTextToTweet(tweet)
{
	var linkableTweetArray = new Array();
	var tweetText = tweet.text;
	var regex = new RegExp();
	var temp;

	// Replace &amp; with &
	regex = new RegExp("&amp;", "g");
	tweetText = tweetText.replace(regex, '&');

	// Split text in array.
	linkableTweetArray = tweetText.split(/[\s,?&;.'":!)({}]+/);

	// Remove duplicate words.
	linkableTweetArray = _.uniq(linkableTweetArray);

	for ( var i = 0; i < linkableTweetArray.length; i++)
	{
		if (linkableTweetArray[i].charAt(0) == "@") // Mentions
		{
			regex = new RegExp(linkableTweetArray[i], "g");
			tweetText = tweetText
					.replace(
							regex,
							'&lt;a href=\'https://twitter.com/' + linkableTweetArray[i].substring(1) + '\' target=\'_blank\' class=\'cd_hyperlink\'>' + linkableTweetArray[i] + '&lt;/a>');
		}
		else if (linkableTweetArray[i].charAt(0) == "#") // Hashtags
		{
			regex = new RegExp(linkableTweetArray[i], "g");
			var url = "https://twitter.com/search?q=%23" + linkableTweetArray[i].substring(1) + "&src=hash";
			tweetText = tweetText.replace(regex, '&lt;a href=\'' + url + '\' target=\'_blank\' class=\'cd_hyperlink\'>' + linkableTweetArray[i] + '&lt;/a>');
		}
	}

	// URL
	linkableTweetArray = new Array();
	linkableTweetArray = tweetText.split(/\s/);
	var exp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";

	$.each(linkableTweetArray, function(index, word)
	{
		if (word.match(exp))
			tweetText = tweetText.replace(word, '&lt;a href=\'' + word + '\' target=\'_blank\' class=\'cd_hyperlink\'>' + word + '&lt;/a>');
	});

	regex = new RegExp("&lt;", "g");
	tweetText = tweetText.replace(regex, '<');
	return tweetText;
}

// Remove no tweet notification. Search for that tweet in collection and makes
// that tweets model hide.
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

// Remove waiting symbol from stream's column header, when user return to social
// tab.
function removeWaiting()
{
	var streamsJSON = Streams_List_View.collection.toJSON();

	// Streams not available.
	if (streamsJSON == null)
	{
		return;
	}

	// Get stream
	$.each(streamsJSON, function(i, stream)
	{
		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(stream.id);
		var tempModelStream = Temp_Streams_List_View.collection.get(stream.id);

		if ((modelStream != null || modelStream != undefined) && (tempModelStream != null || tempModelStream != undefined))
		{
			// If any collection have some tweets then remove waiting.
			if (modelStream.get('tweetListView').length >= 1 || tempModelStream.get('tweetListView').length >= 1)
			{
				// Hide waiting symbol.
				$("#stream-spinner-modal-" + stream.id).hide();
			}
		}
	});
}

/*
 * Check for new tweets when user was not in social tab. Show new tweet
 * notification on respective stream.
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
	$
			.each(
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

/**
 * Add tweets from temp collection to original collection and remove
 * notification.
 */
function mergeCollections(streamId)
{
	// Get stream from collections.
	var originalStream = Streams_List_View.collection.get(streamId);
	var tempStream = Temp_Streams_List_View.collection.get(streamId);

	// Get tweet collection from stream.
	var tweetCollection = originalStream.get('tweetListView');

	// Add new tweets from temp collection to original collection.
	tweetCollection.add(tempStream.get("tweetListView").toJSON());

	// Sort tweet collection on id. so recent tweet comes on top.
	tweetCollection.sort();

	// Create normal time.
	head.js('lib/jquery.timeago.js', function()
	{
		$(".time-ago", $(".chirp-container")).timeago();
	});

	// Clear temp tweet collection.
	tempStream.get("tweetListView").reset();

	// Remove waiting symbol.
	removeWaiting();
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

		console.log("In OnScrollDiv.");

		// Get stream id.
		var streamId = ($(elementDiv).closest('li').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Stream not found.
		if (modelStream == undefined || modelStream == null)
			return;

		// model to json.
		var stream = modelStream.toJSON();
		console.log(stream);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').at(modelStream.get('tweetListView').length - 2);
		var tweet = modelTweet.toJSON();
		console.log(tweet);

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
							console.log("data");
							console.log(data);

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
								console.log(myObject);

								// Add tweet to stram.
								handleMessage(myObject);

								// All tweets done.
								if (i + 1 == data.length)
									Scroll_Down_Call = false;
							}

							// Add remaining tweets.
							if (Scroll_Down_Call == false && Past_Tweets_Count != 0 && Past_Tweets.length != 0)
								addPastTweetsToStream();

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
					console.log(data);
				});
	}
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

	console.log("In addPastTweetsToStream.");

	// Update collection.
	updateCollection(Past_Tweets, modelStream);

	// Reset json array and counter.
	Past_Tweets_Count = 0;
	Past_Tweets = [];
}

/**
 * Add given tweets in given stream model.
 */
function updateCollection(tweet, modelStream)
{
	// Sort stream on tweet id basis which is unique and recent tweet has
	// highest value.
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
	head.js('lib/jquery.timeago.js', function()
	{
		$(".time-ago", $(".chirp-container")).timeago();
	});
}

// Displays Modal.
function displayModal(modalToDisplay, templt, json, counterVar, focusElmnt)
{
	// If modal already exists remove to show a new one
	$('#' + modalToDisplay).remove();

	// Populate the modal template with the above json details in the form
	var message_form_modal = getTemplate(templt, json);

	// Append the form into the content
	$('#content').append(message_form_modal);

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

	// Shows the modal after filling with details
	$('#' + modalToDisplay).modal("show");
}

// Hides the modal after 2 seconds after the sent is shown
function hideModal(modalToHide)
{
	setTimeout(function()
	{
		$('#' + modalToHide).modal("hide");
	}, 2000);
}

// Displays Error notification.
function displayError(modalToDisplay, data)
{
	$("#spinner-modal").hide();

	if (modalToDisplay != null)
	{
		// If error occurs while posting modal is removed and error message is
		// shown
		$('#' + modalToDisplay).modal("hide");
	}

	var result = data.responseText;

	// Error message is shown if error occurs
	if (result.trim() == "Status is a duplicate.")
		showNotyPopUp('information', "Whoops! You already tweeted that...", "top", 5000);
	else
		showNotyPopUp('information', "Retry after sometime.", "top", 5000);

	console.log(data.responseText);
}
