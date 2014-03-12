/**
 * This file contains all event related actions on tweet, Like tweet, delete
 * tweet, follow, unfollow, RT, etc.
 */

$(function()
{
	/**
	 * get stream and create tweet for posting on Twitter.
	 */
	$(".compose-message").die().live("click", function(e)
	{
		Scheduled_Edit = false;

		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		var streamId = $(this).attr("stream-id");

		// Fetch stream from collection
		var stream = Streams_List_View.collection.get(streamId).toJSON();

		// Store info in a json, to send it to the modal window when making send
		// tweet request
		var json = {};

		// Set headline of modal window as Send Message
		json["headline"] = "Tweet";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Status from " + stream.screen_name;

		json["description"] = "What's happening?";
		json["streamId"] = streamId;
		json["profileImg"] = $("#" + streamId + "-profile-img").prop("src");

		// Display Modal
		displayModal("socialsuite_twitter_messageModal", "socialsuite-twitter-message", json, "twitter-counter", "twit-tweet");

		// In compose message text limit is crossed so disable send button.
		$('#twit-tweet').on('cross', function()
		{
			$('#send_tweet').addClass('disabled');
			$('#schedule_tweet').addClass('disabled');
		});

		// In compose message text limit is uncrossed so enable send button.
		$('#twit-tweet').on('uncross', function()
		{
			$('#send_tweet').removeClass('disabled');
			$('#schedule_tweet').removeClass('disabled');
		});

		// On click of send button in the modal, tweet request is sent
		$('#send_tweet').click(function(e)
		{
			e.preventDefault();

			// Check Send button is not enable
			if ($("#send_tweet").hasClass('disabled'))
				return;

			// Checks whether all the input fields are filled
			if (!isValidForm($("#socialsuite_twitter_messageForm")))
				return;

			$('#send_tweet').addClass('disabled');
			$("#spinner-modal").show();

			// Sends post request to url "/core/social/tweet/" and Calls
			// StreamsAPI with
			// Stream id and Twitter id as path parameters and form as post data
			$.post("/core/social/tweet/" + streamId, $('#socialsuite_twitter_messageForm').serialize(),

			function(data)
			{
				$("#spinner-modal").hide();

				if (data == "Successful")
				{
					// On success, shows the status as sent
					$('#socialsuite_twitter_messageModal').find('span.save-status').html("Sent");
					showNotyPopUp('information', "Your Tweet was posted!", "top", 5000);
				}

				// Hides the modal after 2 seconds after the sent is shown
				hideModal("socialsuite_twitter_messageModal");

			}).error(function(data)
			{
				// Displays Error Notification.
				displayError("socialsuite_twitter_messageModal", data);
			});
		});
	});

	// On copy paste from mouse right click call key press to check cross limit.
	$('#twit-tweet').die().live("mouseleave", function(e)
	{
		$('#twit-tweet').keypress();
	});

	$('#twit-edit-tweet').die().live("mouseleave", function(e)
	{
		$('#twit-edit-tweet').keypress();
	});

	/**
	 * Get stream and create reply tweet and post it on Twitter.
	 */
	$(".reply-message").die().live("click", function(e)
	{
		Scheduled_Edit = false;

		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);
		var stream = modelStream.toJSON();

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		// Store info in a json, to send it to the modal window when making send
		// tweet request
		var json = {};

		// Set headline of modal window as Send Message
		json["headline"] = "Reply Tweet";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Reply " + "@" + tweet.user.screen_name + " from " + stream.screen_name;

		json["description"] = "@" + tweet.user.screen_name;
		json["tweetId"] = tweet.id_str;
		json["tweetOwner"] = tweet.user.screen_name;
		json["streamId"] = streamId;
		json["profileImg"] = $("#" + streamId + "-profile-img").prop("src");

		// Display Modal
		displayModal("socialsuite_twitter_messageModal", "socialsuite-twitter-message", json, "twitter-counter", "twit-tweet");

		// In compose message text limit is crossed so disable send button.
		$('#twit-tweet').on('cross', function()
		{
			$('#send_tweet').addClass('disabled');
			$('#schedule_tweet').addClass('disabled');
		});

		// In compose message text limit is uncrossed so enable send button.
		$('#twit-tweet').on('uncross', function()
		{
			$('#send_tweet').removeClass('disabled');
			$('#schedule_tweet').removeClass('disabled');
		});

		// On click of send button in the modal, tweet request is sent
		$('#send_tweet').click(function(e)
		{
			e.preventDefault();

			// Check Send button is not enable
			if ($("#send_tweet").hasClass('disabled'))
				return;

			// Checks whether all the input fields are filled
			if (!isValidForm($("#socialsuite_twitter_messageForm")))
				return;

			$('#send_tweet').addClass('disabled');
			$("#spinner-modal").show();

			// Sends post request to url "/core/social/replytweet/" and Calls
			// StreamsAPI with
			// stream id and Twitter id as path parameters and form as post data
			$.post("/core/social/replytweet/" + streamId, $('#socialsuite_twitter_messageForm').serialize(),

			function(data)
			{
				$("#spinner-modal").hide();

				if (data == "Successful")
				{
					// On success, shows the status as sent
					$('#socialsuite_twitter_messageModal').find('span.save-status').html("Sent");
					showNotyPopUp('information', "Your Tweet to @" + tweet.user.screen_name + " has been sent!", "top", 5000);
				}

				// Hides the modal after 2 seconds after the sent is shown
				hideModal("socialsuite_twitter_messageModal");
			}).error(function(data)
			{
				// Displays Error Notification.
				displayError("socialsuite_twitter_messageModal", data);
			});
		});
	});

	/**
	 * Sends a direct message to the Twitter profile , who is tweet owner.
	 */
	$(".direct-message").die().live("click", function(e)
	{
		Scheduled_Edit = false;

		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);
		var stream = modelStream.toJSON();

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		// Store info in a json, to send it to the modal window when making send
		// tweet request
		var json = {};

		// Set headline of modal window as Send Message
		json["headline"] = "Direct Message";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Direct message from " + stream.screen_name + " to " + tweet.user.screen_name;

		json["description"] = "Tip: you can send a message to anyone who follows you."
		json["tweetId"] = tweet.id_str;
		json["tweetOwner"] = tweet.user.screen_name;
		json["streamId"] = streamId;
		json["profileImg"] = $("#" + streamId + "-profile-img").prop("src");

		// Display Modal
		displayModal("socialsuite_twitter_messageModal", "socialsuite-twitter-message", json, "twitter-counter", "twit-tweet");

		// In compose message text limit is crossed so disable send button.
		$('#twit-tweet').on('cross', function()
		{
			$('#send_tweet').addClass('disabled');
			$('#schedule_tweet').addClass('disabled');
		});

		// In compose message text limit is uncrossed so enable send button.
		$('#twit-tweet').on('uncross', function()
		{
			$('#send_tweet').removeClass('disabled');
			$('#schedule_tweet').removeClass('disabled');
		});

		// On click of send button in the modal, tweet request is sent
		$('#send_tweet').click(function(e)
		{
			e.preventDefault();

			// Check Send button is not enable
			if ($("#send_tweet").hasClass('disabled'))
				return;

			// Checks whether all the input fields are filled
			if (!isValidForm($("#socialsuite_twitter_messageForm")))
				return;

			$('#send_tweet').addClass('disabled');
			$("#spinner-modal").show();

			// Sends post request to url "/core/social/directmessage/" and Calls
			// StreamsAPI with
			// Stream id as path parameters and form as post data
			$.post("/core/social/directmessage/" + streamId, $('#socialsuite_twitter_messageForm').serialize(),

			function(data)
			{
				$("#spinner-modal").hide();

				if (data == "Successful")
				{
					// On success, shows the status as sent
					$('#socialsuite_twitter_messageModal').find('span.save-status').html("sent");
				}
				else if (data == "Unsuccessful")
				{
					// On failure, shows the status as retry
					$('#socialsuite_twitter_messageModal').find('span.save-status').html("Retry");
					showNotyPopUp('information', "Retry after sometime.", "top", 5000);
				}

				// Hides the modal after 2 seconds after the sent is shown
				hideModal("socialsuite_twitter_messageModal");
			}).error(function(data)
			{
				// Displays Error Notification.
				displayError("socialsuite_twitter_messageModal", data);
			});
		});
	});

	/**
	 * Get stream and perform retweet action on selected tweet.
	 */
	$(".retweet-status").die().live("click", function(e)
	{
		Scheduled_Edit = false;

		$('#socialsuite_twitter_messageModal').remove();

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		// Store info in a json, to send it to the modal window when making send
		// tweet request
		var json = {};

		// Set headline of modal window as Send Message
		json["headline"] = "Retweet";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Status of " + "@" + tweet.user.screen_name;

		json["description"] = tweet.original_text;
		json["tweetId"] = tweet.id_str;
		json["tweetOwner"] = tweet.user.screen_name;
		json["streamId"] = streamId;
		json["profileImg"] = $("#" + streamId + "-profile-img").prop("src");

		// Display Modal
		displayModal("socialsuite_twitter_RTModal", "socialsuite-twitter-RT", json, "twitter-retweet-counter", "twit-edit-tweet");

		$('#send_retweet').show();
		$('#edit_retweet').show();
		$('#twit-retweet').show();
		$('#send_edit_tweet').hide();
		$('#twit-edit-tweet').hide();
		$('#div-for-count').hide();
		$('#RT_scheduling').hide();

		// On click of send button in the modal, retweet request is sent
		$('#send_retweet').click(function(e)
		{
			e.preventDefault();

			// Check Send button is not enable
			if ($("#send_retweet").hasClass('disabled') && $("#edit_retweet").hasClass('disabled'))
				return;

			$('#send_retweet').addClass('disabled');
			$('#edit_retweet').addClass('disabled');
			$("#spinner-modal").show();

			/*
			 * Sends get request to url "core/social/retweet/" and Calls
			 * StreamAPI with Stream id, tweet id as path parameters.
			 */
			$.get("/core/social/retweet/" + streamId + "/" + tweet.id_str,

			function(data)
			{
				$("#spinner-modal").hide();

				// Hides the modal after 2 seconds after the sent is shown
				hideModal("socialsuite_twitter_RTModal");

				// Retweet is Unsuccessful.
				if (data == "Unsuccessful")
				{
					showNotyPopUp('information', "Retry after sometime.", "top", 5000);
					return;
				}

				// On success, the color of the retweet is shown green. Update
				// attribute in tweet.
				modelTweet.set("retweeted_by_user", "true");
				modelTweet.set("retweet_id", data);

				// Add back to stream.
				modelStream.get('tweetListView').add(modelTweet);

				// Create normal time.
				head.js('lib/jquery.timeago.js', function()
				{
					$(".time-ago", $(".chirp-container")).timeago();
				});
			}).error(function(data)
			{
				// Displays Error Notification.
				displayError("socialsuite_twitter_RTModal", data);
			});
		});

		// On click of edit button in the modal, retweet edit.
		$('#edit_retweet').click(function(e)
		{
			e.preventDefault();

			// Check Send button is not enable
			if ($("#send_retweet").hasClass('disabled') && $("#edit_retweet").hasClass('disabled'))
				return;

			$('#send_retweet').hide();
			$('#edit_retweet').hide();
			$('#twit-retweet').hide();
			$('#send_edit_tweet').show();
			$('#twit-edit-tweet').show();
			$('#div-for-count').show();
			$('#RT_scheduling').show();
		});

		// In compose message text limit is crossed so disable send button.
		$('#twit-edit-tweet').on('cross', function()
		{
			$('#send_edit_tweet').addClass('disabled')
		});

		// In compose message text limit is uncrossed so enable send button.
		$('#twit-edit-tweet').on('uncross', function()
		{
			$('#send_edit_tweet').removeClass('disabled')
		});

		// On click of send button in the modal, tweet request is sent
		$('#send_edit_tweet').click(function(e)
		{
			e.preventDefault();

			// Check Send button is not enable
			if ($("#send_edit_tweet").hasClass('disabled'))
				return;

			// Checks whether all the input fields are filled
			if (!isValidForm($("#socialsuite_twitter_RTForm")))
				return;

			$('#send_edit_tweet').addClass('disabled');
			$("#spinner-modal").show();

			// Sends post request to url "/core/social/tweet/" and Calls
			// StreamsAPI with
			// Stream id and Twitter id as path parameters and form as post data
			$.post("/core/social/tweet/" + streamId, $('#socialsuite_twitter_RTForm').serialize(),

			function(data)
			{
				$("#spinner-modal").hide();

				if (data == "Successful")
				{
					// On success, shows the status as sent
					$('#socialsuite_twitter_RTModal').find('span.save-status').html("Sent");
					showNotyPopUp('information', "Your Tweet was posted!", "top", 5000);
				}

				// Hides the modal after 2 seconds after the sent is shown
				hideModal("socialsuite_twitter_RTModal");
			}).error(function(data)
			{
				// Displays error notification
				displayError("socialsuite_twitter_RTModal", data);
			});
		});
	});

	/**
	 * Get stream and perform undo-retweet action on selected tweet.
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
			head.js('lib/jquery.timeago.js', function()
			{
				$(".time-ago", $(".chirp-container")).timeago();
			});
		}).error(function(data)
		{
			// Error message is shown when error occurs
			displayError(null, data);
		});
	});

	/**
	 * Get stream and perform favorite action on selected tweet.
	 */
	$(".favorite-status").die().live("click", function(e)
	{
		// Get the id of the tweet on which retweet is clicked
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		var tweetIdStr = tweet.id_str;
		var tweetOwner = tweet.user.screen_name;

		/*
		 * Sends get request to url "core/social/favorite/" and Calls StreamAPI
		 * with Stream id, tweet idStr as path parameters.
		 */
		$.get("/core/social/favorite/" + streamId + "/" + tweetIdStr,

		function(data)
		{
			// Favorite is Unsuccessful.
			if (data == "Unsuccessful")
			{
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
				return;
			}

			// On success, the color of the favorite is shown orange.
			// Update attribute in tweet.
			modelTweet.set("favorited_by_user", "true");

			// Add back to stream.
			modelStream.get('tweetListView').add(modelTweet);

			// Create normal time.
			head.js('lib/jquery.timeago.js', function()
			{
				$(".time-ago", $(".chirp-container")).timeago();
			});
		}).error(function(data)
		{
			// Error message is shown when error occurs
			displayError(null, data);
		});
	});

	/**
	 * Get stream and perform undo-favorite action on selected tweet.
	 */
	$(".undo-favorite-status").die().live("click", function(e)
	{
		// Get the id of the tweet on which retweet is clicked
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		var tweetIdStr = tweet.id_str;
		var tweetOwner = tweet.user.screen_name;

		/*
		 * Sends get request to url "core/social/undofavorite/" and Calls
		 * StreamAPI with Stream id, tweet idStr as path parameters.
		 */
		$.get("/core/social/undofavorite/" + streamId + "/" + tweetIdStr,

		function(data)
		{
			// Favorite is Unsuccessful.
			if (data == "Unsuccessful")
			{
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
				return;
			}

			// On success, Change favorite icon to normal.
			// Delete tweet from stream
			modelTweet.unset("favorited_by_user");

			// Add back to stream.
			modelStream.get('tweetListView').add(modelTweet);

			// Create normal time.
			head.js('lib/jquery.timeago.js', function()
			{
				$(".time-ago", $(".chirp-container")).timeago();
			});
		}).error(function(data)
		{
			// Error message is shown when error occurs
			displayError(null, data);
		});
	});

	/**
	 * Sends details of tweet and stream id. Method will check whether
	 * relashionship of stream owner and tweet owner, so more options will be
	 * displyed as per that.
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details.
	 * @param tweetOwner
	 *            Twitter user's screen name.
	 */
	$(".more-options")
			.die()
			.live(
					"click",
					function(e)
					{
						var streamId = ($(this).closest('article').attr('stream-id'));
						var tweetId = ($(this).closest('article').attr('id'));
						var elementId = $(this).attr("id");

						// Get stream from collection.
						var modelStream = Streams_List_View.collection.get(streamId);

						// Get tweet from stream.
						var modelTweet = modelStream.get('tweetListView').get(tweetId);
						var tweet = modelTweet.toJSON();

						var tweetIdStr = tweet.id_str;
						var tweetOwner = tweet.user.screen_name;

						// Fetch stream from collection
						var stream = modelStream.toJSON();

						// Remove extra element from dropdown menu list.
						$('.list-clear').remove();

						// Close all dropdowns of other tweets.
						$('.more-options-list').toggle(false);

						// Open dropdown with slow speed.
						$('#' + elementId + '_list', $('#' + streamId)).toggle("slow");

						// Tweet belongs to stream owner so no extra options
						// required.
						if (stream.screen_name == tweetOwner)
							return;

						// Check stream owner relashionship tweet owner.
						$
								.get(
										"/core/social/checkrelationship/" + streamId + "/" + tweetOwner,
										function(data)
										{
											// Stream owner follows tweet owner
											// then add unfollow option
											if (data.follow == "true")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="unfollow-user" tweet-owner=' + tweetOwner + '>Unfollow @' + tweetOwner + '</a></li>');
											}
											// Stream owner not following tweet
											// owner then add follow option
											else if (data.follow == "false")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="follow-user" tweet-owner=' + tweetOwner + '>Follow @' + tweetOwner + '</a></li>');
											}

											// Tweet owner is stream owner's
											// follower then add send DM option
											if (data.follower == "true")
											{
												$('#' + elementId + '_list', $('#' + streamId)).append(
														'<li class="list-clear"><a href="#social" class="direct-message">Send Direct Message</a></li>');
											}

											// Check tweet owner is Block or
											// Unblock
											if (data.blocked == "true")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="unblock-user" tweet-owner=' + tweetOwner + '>Unblock @' + tweetOwner + '</a></li>');
											}
											else if (data.blocked == "false")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="block-user" tweet-owner=' + tweetOwner + '>Block @' + tweetOwner + '</a></li>');
											}
										}).error(function(data)
								{
									// Error message is shown when error occurs
									displayError(null, data);
								});
					});

	/**
	 * Sends follow request to Follow the contact's Twitter profile in Twitter
	 * based on stream id and Twitter user's screen name
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details
	 * @param tweetOwner
	 *            Twitter user's screen name to send follow request
	 */
	$(".follow-user").die().live("click", function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		// Calls method to send request to follow user.
		$.get("/core/social/followuser/" + streamId + "/" + tweetOwner, function(data)
		{
			if (data == "true")
				showNotyPopUp('information', "Now you are following @" + tweetOwner, "top", 5000);
			else if (data == "false")
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
		}).error(function(data)
		{
			// Error message is shown if error occurs
			displayError(null, data);
		});
	});
	/**
	 * Sends unfollow request to unFollow the contact's Twitter profile in
	 * Twitter based on stream id and Twitter user's screen name
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details
	 * @param tweetOwner
	 *            Twitter user's screen name to send unfollow request
	 */
	$(".unfollow-user").die().live("click", function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		// Calls method to send request to unfollow user.
		$.get("/core/social/unfollowuser/" + streamId + "/" + tweetOwner, function(data)
		{
			if (data == "Unfollowed")
				showNotyPopUp('information', "Now you are not following @" + tweetOwner, "top", 5000);
			else if (data == "Unsuccessful")
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
		}).error(function(data)
		{
			// Error message is shown if error occurs
			displayError(null, data);
		});
	});

	/**
	 * Sends block request to Block the contact's Twitter profile in Twitter
	 * based on stream id and Twitter user's screen name.
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details
	 * @param tweetOwner
	 *            Twitter user's screen name to send block request
	 */
	$(".block-user").die().live("click", function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		// Calls method to send request to block user.
		$.get("/core/social/blockuser/" + streamId + "/" + tweetOwner, function(data)
		{
			if (data == "true")
				showNotyPopUp('information', "You just blocked @" + tweetOwner, "top", 5000);
			else if (data == "false")
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
		}).error(function(data)
		{
			// Error message is shown if error occurs
			displayError(null, data);
		});
	});

	/**
	 * Sends unblocked request to unBlocked the contact's Twitter profile in
	 * Twitter based on stream id and Twitter user's screen name.
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details
	 * @param tweetOwner
	 *            Twitter user's screen name to send unblock request
	 */
	$(".unblock-user").die().live("click", function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		// Calls method to send request to unblock user.
		$.get("/core/social/unblockuser/" + streamId + "/" + tweetOwner, function(data)
		{
			if (data == "Unblock")
				showNotyPopUp('information', "You just unblock @" + tweetOwner, "top", 5000);
			else if (data == "Unsuccessful")
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
		}).error(function(data)
		{
			// Error message is shown if error occurs
			displayError(null, data);
		});
	});

	/**
	 * Sends delete request to Twitter profile in Twitter based on stream id,
	 * Twitter user's screen name and tweet id.
	 */
	$(".delete-tweet").die().live("click", function(e)
	{
		// Ask confirmation to user.
		if (!confirm("Are you sure you want to delete this tweet?"))
			return;

		// Details to pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		var tweetIdStr = tweet.id_str;
		var tweetOwner = tweet.user.screen_name;

		// Call method with details of tweet to be deleted.
		$.get("/core/social/deletetweet/" + streamId + "/" + tweetOwner + "/" + tweetIdStr, function(data)
		{
			if (data == "Successful")
			{
				modelTweet.set("deleted_msg", "deleted");

				// Add back to stream.
				modelStream.get('tweetListView').add(modelTweet);

				showNotyPopUp('information', "Your tweet has been deleted.", "top", 5000);

				// Remove tweet element from ui
				$('.deleted').remove();
			}
			else if (data == "Unsuccessful")
			{
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
			}
		}).error(function(data)
		{
			// Error message is shown if error occurs
			displayError(null, data);
		});
	});

	/**
	 * Get tweet, show tweet with list of retweeted user details.
	 */
	$(".show-retweet").die().live("click", function(e)
	{
		Scheduled_Edit = false;

		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));
		var tweetIdStr = ($(this).closest('article').attr('tweet-id-str'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		// Display Modal
		displayModal("socialsuite_RT_userlistModal", "socialsuite-RT-userlist", tweet, null, null);

		$("#spinner-modal").show();

		var RTUserListView = new Base_Collection_View({ url : function()
		{
			return '/core/social/getrtusers/' + streamId + "/" + tweet.id_str;
		}, restKey : "user", templateKey : "socialsuite-RT-userlist", individual_tag_name : 'li', });

		RTUserListView.collection.fetch();

		$('#RTuser_list').html(RTUserListView.render(true).el);

		// Create normal time.
		head.js('lib/jquery.timeago.js', function()
		{
			$(".time-ago", $("#socialsuite_RT_userlistModal")).timeago();
		});
	});

	/**
	 * get stream and create tweet for posting on Twitter to user who RT owner's
	 * tweet.
	 */
	$(".tweet-to-user").die().live("click", function(e)
	{
		// Hide modal before showing message modal.
		$("#socialsuite_RT_userlistModal").modal("hide");

		Scheduled_Edit = false;

		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		// Fetch stream from collection
		var stream = Streams_List_View.collection.get(streamId).toJSON();

		// Store info in a json, to send it to the modal window when making send
		// tweet request
		var json = {};

		// Set headline of modal window as Send Message
		json["headline"] = "Reply Tweet";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Reply " + "@" + tweetOwner + " from " + stream.screen_name;

		json["description"] = "@" + tweetOwner;
		json["tweetOwner"] = tweetOwner;
		json["streamId"] = streamId;
		json["profileImg"] = $("#" + streamId + "-profile-img").prop("src");

		// Display Modal
		displayModal("socialsuite_twitter_messageModal", "socialsuite-twitter-message", json, "twitter-counter", "twit-tweet");

		// In compose message text limit is crossed so disable send button.
		$('#twit-tweet').on('cross', function()
		{
			$('#send_tweet').addClass('disabled');
			$('#schedule_tweet').addClass('disabled');
		});

		// In compose message text limit is uncrossed so enable send button.
		$('#twit-tweet').on('uncross', function()
		{
			$('#send_tweet').removeClass('disabled');
			$('#schedule_tweet').removeClass('disabled');
		});

		// On click of send button in the modal, tweet request is sent
		$('#send_tweet').click(function(e)
		{
			e.preventDefault();

			// Check Send button is not enable
			if ($("#send_tweet").hasClass('disabled'))
				return;

			// Checks whether all the input fields are filled
			if (!isValidForm($("#socialsuite_twitter_messageForm")))
				return;

			$('#send_tweet').addClass('disabled');
			$("#spinner-modal").show();

			// Sends post request to url "/core/social/tweet/" and Calls
			// StreamsAPI with
			// Stream id and Twitter id as path parameters and form as post data
			$.post("/core/social/tweet/" + streamId, $('#socialsuite_twitter_messageForm').serialize(),

			function(data)
			{
				$("#spinner-modal").hide();

				if (data == "Successful")
				{
					// On success, shows the status as sent
					$('#socialsuite_twitter_messageModal').find('span.save-status').html("Sent");
					showNotyPopUp('information', "Your Tweet was posted!", "top", 5000);
				}

				// Hides the modal after 2 seconds after the sent is shown
				hideModal("socialsuite_twitter_messageModal");

			}).error(function(data)
			{
				// Displays Error Notification.
				displayError("socialsuite_twitter_messageModal", data);
			});
		});
	});

}); // init end
