/**
 * As per given action type it selects url to send get request and perfome
 * action on tweet. Tweet actions are Follow, un follow, Favorite, undo favorite
 * etc.
 * 
 * @param streamId
 * @param tweetId
 * @param tweetOwner
 * @param actionType
 */
function performTweetAction(streamId, tweetId, tweetOwner, actionType)
{
	// Get stream from collection.
	var modelStream = Streams_List_View.collection.get(streamId);

	if (tweetId)
	{
		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		var tweetIdStr = tweet.id_str;
	}

	var urlForGet = null;

	switch (actionType) {
		case "favorite":
		{
			/*
			 * Sends get request to url "core/social/favorite/" and Calls
			 * StreamAPI with Stream id, tweet idStr as path parameters.
			 */
			urlForGet = "/core/social/favorite/" + streamId + "/" + tweetIdStr;
		}
			break;
		case "undofavorite":
		{
			/*
			 * Sends get request to url "core/social/undofavorite/" and Calls
			 * StreamAPI with Stream id, tweet idStr as path parameters.
			 */

			urlForGet = "/core/social/undofavorite/" + streamId + "/" + tweetIdStr;
		}
			break;
		case "followuser":
		{
			// Calls method to send request to follow user.
			urlForGet = "/core/social/followuser/" + streamId + "/" + tweetOwner;
		}
			break;
		case "unfollowuser":
		{
			// Calls method to send request to unfollow user.
			urlForGet = "/core/social/unfollowuser/" + streamId + "/" + tweetOwner;
		}
			break;
		case "blockuser":
		{
			// Calls method to send request to block user.
			urlForGet = "/core/social/blockuser/" + streamId + "/" + tweetOwner;
		}
			break;
		case "unblockuser":
		{
			// Calls method to send request to unblock user.
			urlForGet = "/core/social/unblockuser/" + streamId + "/" + tweetOwner;
		}
			break;
	}

	requestAction(urlForGet, actionType, modelStream, modelTweet, tweetOwner);
}

/**
 * Call REST api and perfome action as per reply from backend.
 */
function requestAction(urlForGet, actionType, modelStream, modelTweet, tweetOwner)
{
	$.get(urlForGet, function(data)
	{
		// Favorite is Unsuccessful.
		if (data == "Unsuccessful" || data == "false")
		{
			showNotyPopUp('information', "Retry after sometime.", "top", 5000);
			return;
		}

		// As per reply from get request reflect that in UI on tweet in stream.
		reflectActionOnTweet(data, actionType, modelStream, modelTweet, tweetOwner);

		// Create normal time.
		displayTimeAgo($(".chirp-container"));
		
	}).error(function(data)
	{
		// Error message is shown when error occurs
		displayError(null, data);
	});
}

/**
 * Accept data and reflect action in UI on tweet in stream. like On favorite :
 * change icon color to orange, Undo same action on undo favorite. On Block user ,
 * unfollow user and show noty... etc.
 * 
 * @param data
 * @param actionType
 * @param modelStream
 * @param modelTweet
 * @param tweetOwner
 */
function reflectActionOnTweet(data, actionType, modelStream, modelTweet, tweetOwner)
{
	if (modelTweet)
		var tweet = modelTweet.toJSON();

	switch (actionType) {
		case "favorite":
		{
			// On success, the color of the favorite is shown orange.
			// Update attribute in tweet.
			modelTweet.set("favorited_by_user", "true");

			// Add back to stream.
			modelStream.get('tweetListView').add(modelTweet);
		}
			break;

		case "undofavorite":
		{
			// On success, Change favorite icon to normal.
			// Delete tweet from stream
			modelTweet.unset("favorited_by_user");

			// Add back to stream.
			modelStream.get('tweetListView').add(modelTweet);
		}
			break;
		case "followuser":
		{
			if (data == "true")
				showNotyPopUp('information', "Now you are following @" + tweetOwner, "top", 5000);
		}
			break;
		case "unfollowuser":
		{
			if (data == "Unfollowed")
				showNotyPopUp('information', "Now you are not following @" + tweetOwner, "top", 5000);
		}
			break;
		case "blockuser":
		{
			if (data == "true")
				showNotyPopUp('information', "You just blocked @" + tweetOwner, "top", 5000);
		}
			break;
		case "unblockuser":
		{
			if (data == "Unblock")
				showNotyPopUp('information', "You just unblock @" + tweetOwner, "top", 5000);
		}
			break;

	}
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
	else if(result.trim() == "Sorry, that page does not exist")
		showNotyPopUp('information', "Sorry, that tweet does not exist.", "top", 5000);
	else
		showNotyPopUp('information', "Retry after sometime.", "top", 5000);

	console.log(data.responseText);
}
