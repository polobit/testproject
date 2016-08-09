/**
 * This file contains all event related actions on tweet, Like delete tweet,
 * follow, unfollow, favorite, block, etc.
 */

$(function()
{
	/**
	 * Get stream and perform favorite action on selected tweet.
	 */
	$('body').on('click', '.favorite-status', function(e)
	{
		// Get the id of the tweet on which retweet is clicked
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		performTweetAction(streamId, tweetId, null, "favorite");
	});

	/**
	 * Get stream and perform undo-favorite action on selected tweet.
	 */
	$('body').on('click', '.undo-favorite-status', function(e)
	{
		// Get the id of the tweet on which retweet is clicked
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		performTweetAction(streamId, tweetId, null, "undofavorite");
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
	$('body').on('click', '.more-options', function(e)
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
																'<li class="list-clear"><a href="#social" class="unfollow-user" tweet-owner=' + tweetOwner + '>{{agile_lng_translate "socialsuite" "unfollow"}} @' + tweetOwner + '</a></li>');
											}
											// Stream owner not following tweet
											// owner then add follow option
											else if (data.follow == "false")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="follow-user" tweet-owner=' + tweetOwner + '>{{agile_lng_translate "widgets" "follow"}} @' + tweetOwner + '</a></li>');
											}

											// Tweet owner is stream owner's
											// follower then add send DM option
											if (data.follower == "true")
											{
												$('#' + elementId + '_list', $('#' + streamId)).append(
														'<li class="list-clear"><a href="#social" class="direct-message">{{agile_lng_translate "widgets" "send-direct-message"}}</a></li>');
											}

											// Check tweet owner is Block or
											// Unblock
											if (data.blocked == "true")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="unblock-user" tweet-owner=' + tweetOwner + '>{{agile_lng_translate "socialsuite" "unblock"}} @' + tweetOwner + '</a></li>');
											}
											else if (data.blocked == "false")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="block-user" tweet-owner=' + tweetOwner + '>{{agile_lng_translate "socialsuite" "block"}} @' + tweetOwner + '</a></li>');
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
	$('body').on('click', '.follow-user', function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		performTweetAction(streamId, null, tweetOwner, "followuser");
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
	$('body').on('click', '.unfollow-user', function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		performTweetAction(streamId, null, tweetOwner, "unfollowuser");
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
	$('body').on('click', '.block-user', function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		performTweetAction(streamId, null, tweetOwner, "blockuser");
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
	$('body').on('click', '.unblock-user', function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		performTweetAction(streamId, null, tweetOwner, "unblockuser");
	});

	/**
	 * Sends delete request to Twitter profile in Twitter based on stream id,
	 * Twitter user's screen name and tweet id.
	 */
	$('body').on('click', '.delete-tweet', function(e)
	{
		// Ask confirmation to user.
		var $that = $(this);
		showAlertModal("delete_tweet", "confirm", function(){
			// Details to pass on to method.
			var streamId = ($that.closest('article').attr('stream-id'));
			var tweetId = ($that.closest('article').attr('id'));

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

					showNotyPopUp('information', "{{agile_lng_translate 'socialsuite' 'tweet-deleted'}}", "top", 5000);

					// Remove tweet element from ui
					$('.deleted').remove();
				}
				else if (data == "Unsuccessful")
				{
					showNotyPopUp('information', "{{agile_lng_translate 'socialsuite' 'retry-after'}}", "top", 5000);
				}
			}).error(function(data)
			{
				// Error message is shown if error occurs
				displayError(null, data);
			});
		});
	});

	/**
	 * Get tweet, show tweet in modal with list of user with details, who
	 * retweeted that tweet.
	 */
	$('body').on('click', '.show-retweet', function(e)
	{		
		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		/*
		 * Suppose input json has id then modal will not be display. Before
		 * calling displayModal need to remove tweet id. Tweet id is not used
		 * here in future.
		 */
		delete tweet.id;

		// Display Modal
		displayModal("socialsuite_RT_userlistModal", "socialsuite-RT-userlist", tweet, null, null, "/core/social/tweet/" + streamId);

		$("#spinner-modal").show();
		
		// Collection for user's list.
		var RTUserListView = new Base_Collection_View({ url : function()
		{
			return '/core/social/getrtusers/' + streamId + "/" + tweet.id_str;
		}, restKey : "user", templateKey : "socialsuite-RT-userlist", individual_tag_name : 'li', });

		RTUserListView.collection.fetch({
		    success : function(data) {		        
		        $("#spinner-modal").hide();
		    },
		    error: function(response) {
		        console.log("ON ERROR");
		        console.log(response);
		        
		        var data = {}; data["responseText"] = "{{agile_lng_translate 'socialsuite' 'page-not-foumd'}}";
		        
		        displayError("socialsuite_RT_userlistModal", data);
		    }
		});

		$('#RTuser_list').html(RTUserListView.render(true).el);

		// Create normal time.
		displayTimeAgo($("#socialsuite_RT_userlistModal"));		
	});
});
