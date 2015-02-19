/**
 * This file contains all event related messages in Twitter like Tweet, Direct
 * Message, RT, Edit RT, Reply Message, Tweet to user.
 */

$(function()
{
	/**
	 * get stream and create tweet for posting on Twitter.
	 */
	$(".compose-message").die().live("click", function(e)
	{
		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		$('#socialsuite_twitter_messageModal').remove();

		var streamId = $(this).attr("stream-id");

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, null, null, "Tweet");
	});

	/**
	 * Get stream and create reply tweet and post it on Twitter to related
	 * tweet.
	 */
	$(".reply-message").die().live("click", function(e)
	{
		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		$('#socialsuite_twitter_messageModal').remove();

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, tweetId, null, "Reply Tweet");
	});

	/**
	 * get stream and create tweet for posting on Twitter to user who RT owner's
	 * tweet.
	 */
	$(".tweet-to-user").die().live("click", function(e)
	{
		// Hide modal before showing message modal.
		$("#socialsuite_RT_userlistModal").modal("hide");

		$('#socialsuite_twitter_messageModal').remove();

		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, null, tweetOwner, "Reply Tweet");
	});

	/**
	 * Sends a direct message to the Twitter profile , who is tweet owner.
	 */
	$(".direct-message").die().live("click", function(e)
	{
		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		$('#socialsuite_twitter_messageModal').remove();

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, tweetId, null, "Direct Message");
	});

	/**
	 * Get stream and perform retweet action on selected tweet.
	 */
	$(".retweet-status").die().live("click", function(e)
	{
		$('#socialsuite_twitter_messageModal').remove();

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, tweetId, null, "Retweet");

		// On click of edit button in the modal, retweet edit.
		$('#edit_retweet').click(function(e)
		{
			e.preventDefault();
			// Check Send button is not enable
			if ($("#send_retweet").hasClass('disabled') && $("#edit_retweet").hasClass('disabled'))
				return;

			/*
			 * Need to remove this element because it has save class and it is
			 * not disabled but hidden so base-model accept action save on click
			 * of send, which is disabled.
			 */
			$('#send_retweet').remove();

			$('#edit_retweet').hide();
			$('#twit-retweet').hide();
			$('#send_tweet').show();
			$('#twit-tweet').show();
			$('#link-text').show();
			$('#tweet_scheduling').show();

			// Update edit RT URL in model.
			Message_Model.model.url = "/core/social/tweet/" + streamId;
		});
	});

	/**
	 * Get stream and perform undo-retweet action on selected tweet. If stream
	 * is "Sent" then remove tweet from stream and if stream is "Home" then
	 * remove RT icon only.
	 */
	$(".undo-retweet-status").die().live("click", function(e)
	{
		// Ask for confirmation from user.
		if (!confirm("Are you sure you want to undo retweet this status?"))
			return;

		// Get the id of the tweet on which undo-retweet is clicked
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));
		var tweetIdStr = null;

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		// If stream type is "Sent" then "tweet-id-str" is tweet handle else
		// "retweet-id" to perform action.
		if (modelStream.toJSON().stream_type == "Sent")
			tweetIdStr = tweet.id_str;
		else if (modelStream.toJSON().stream_type == "Home")
			tweetIdStr = tweet.retweet_id;

		/*
		 * Sends get request to url "core/social/undoretweet/" and Calls
		 * StreamAPI with Stream id, tweet id and tweet idStr as path
		 * parameters.
		 */
		$.get("/core/social/undoretweet/" + streamId + "/" + tweetId + "/" + tweetIdStr,

		function(data)
		{
			// Undo-Retweet is Unsuccessful.
			if (data == "Unsuccessful")
			{
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
				return;
			}

			// On success, Change retweet icon to normal.
			// Delete tweet from stream
			if (tweet.stream_type == "Sent")
				modelTweet.set("deleted_msg", "deleted");
			else
				modelTweet.unset("retweeted_by_user");

			// Add back to stream.
			modelStream.get('tweetListView').add(modelTweet);

			// Remove tweet element from ui
			$('.deleted').remove();

			// Create normal time.
			displayTimeAgo($(".chirp-container"));

		}).error(function(data)
		{
			// Error message is shown when error occurs
			displayError(null, data);
		});
	});

	// On copy paste from mouse right click call key press to check cross limit.
	$('#twit-tweet').die().live("mouseleave", function(e)
	{
		$('#twit-tweet').keypress();
	});

	// On click of link in message modal, Add agile text to message text area in
	// message modal.
	$("#add_message").die().live("click", function(e)
	{
		var quote = " Sell & Market like Fortune 500 with @agilecrm";

		document.getElementById("twit-tweet").value += quote;

		$("#link-text").html("<b>Thank you.</b>");

		setTimeout(function()
		{
			$("#link-text").hide();
		}, 2000);
	});

	/*
	 * On modal close,Makes Scheduled_Edit flag false to show normal update
	 * flow, because scheduling div display is depend on that.
	 */
	$('#socialsuite_twitter_messageModal').on('hidden', function()
	{
		if (this.id != "#socialsuite_twitter_messageModal")
			return;

		$('.modal-backdrop').remove();
		Scheduled_Edit = false;
		$('#socialsuite_twitter_messageModal').remove();
	});
}); // init end
