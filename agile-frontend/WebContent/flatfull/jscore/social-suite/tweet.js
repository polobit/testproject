/**
 * AS per tweet data and type, It will perform actions like : display rate limit
 * exceed error, add tweet, show notification if user is not in social
 * tab/window.
 * if tweet id is 001 : Rate limit exceeded.
 * if tweet id is 000 : tweets not available for stream..
 * if tweet type is ACK : tweet is register on server and all REST tweets are sent.
 */
function handleMessage(tweet)
{
	// We need this messages to reflect actions in all added relevant streams.
	if (tweet["delete"] != null) // (tweet.delete != null)
	{
		return;
	}

	// Error message from server "Rate limit exceeded." or "server not connected."
	if (tweet.id == "001") // (tweet.delete != null)
	{
		displayErrorInStream(tweet);
		return;
	}

	// Get stream from collection.
	var modelStream = Streams_List_View.collection.get(tweet.stream_id);

	if (modelStream != undefined)
	{
		// User on #social as well as window is active.
		if (Current_Route == "social" && Focused == true)
		{
			// New tweet notification not yet clicked in stream.
			if ($('#stream_notifications_' + tweet.stream_id).is(':empty') == false)
			{
				// console.log("not clicked");

				// User did not click on notification so mark tweet as new unread tweet.
				isNewUnreadTweet(tweet);

				// Change notification to show number of new tweets.
				showNotification(modelStream);
			}
			else
			{
				// User is in #social and there is no notification on stream.
				// Rebuild tweet and Add tweet to model in normal way.
				rebuildTweet(modelStream, tweet);
			}
		}
		else
		{			
			// Add tweet as new unread, because user is on another tab or window is inactive.
			isNewUnreadTweet(tweet);

			// User in #social but window is inactive.
			if (Current_Route == "social")
			{
				// Change notification to show number of new tweets.
				showNotification(modelStream);
			}
		}
	} // If End

	// Remove deleted tweet element from ui
	$('.deleted').remove();
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
