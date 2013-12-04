package com.agilecrm.social.twitter;

import java.io.IOException;
import java.net.SocketTimeoutException;

import twitter4j.Twitter;
import twitter4j.TwitterRuntimeException;
import twitter4j.User;

import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.widgets.Widget;

public class TwitterProfile
{

	/**
	 * Fetches Twitter profiles based on the profile id, token and secret are
	 * retrieved from the widget object and Twitter sent. Result is wrapped in
	 * to {@link SocialSearchResult} class
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String}
	 * @return {@link SocialSearchResult}
	 * @throws Exception
	 */
	public static SocialSearchResult getTwitterProfileById(Widget widget, String twitterId)
			throws SocketTimeoutException, IOException, Exception
	{
		// Creates a twitter object to connect with twitter
		Twitter twitter = TwitterUtil.getTwitter(widget);

		try
		{
			// Fetch Twitter user profile based on twitter Id
			User user = twitter.showUser(Long.parseLong(twitterId));

			SocialSearchResult result = new SocialSearchResult();

			// Map user details to SocialSearchResult
			result.id = user.getId() + "";
			result.name = user.getName();
			result.screen_name = user.getScreenName();
			result.picture = user.getBiggerProfileImageURLHttps().toString();
			result.location = user.getLocation();
			result.summary = user.getDescription();
			result.num_connections = user.getFollowersCount() + "";
			result.tweet_count = user.getStatusesCount() + "";
			result.friends_count = user.getFriendsCount() + "";

			result.url = "https://twitter.com/" + user.getScreenName();
			result.is_follow_request_sent = user.isFollowRequestSent();
			result.is_connected = twitter.showFriendship(twitter.getId(), user.getId()).isSourceFollowingTarget();
			result.is_followed_by_target = twitter.showFriendship(twitter.getId(), user.getId())
					.isSourceFollowedByTarget();

			/*
			 * If current status is not null, get network updates Assuming
			 * current id as new status, 5 recent statuses are retrieved
			 */
			if (user.getStatus() != null)
			{
				result.current_update = user.getStatus().getText();
				result.current_update_id = user.getStatus().getId();

				result.updateStream = TwitterUpdates.getNetworkUpdates(widget, user.getId(), result.current_update_id,
						5);
			}
			return result;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In get profile twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}

	}
	
	
	/**
	 * Fetches Twitter profiles based on the profile id, token and secret are
	 * retrieved from the widget object and Twitter sent. Result is wrapped in
	 * to {@link SocialSearchResult} class
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String}
	 * @return {@link SocialSearchResult}
	 * @throws Exception
	 */
	public static SocialSearchResult getTwitterProfile(Widget widget)
			throws SocketTimeoutException, IOException, Exception
	{
		// Creates a twitter object to connect with twitter
		Twitter twitter = TwitterUtil.getTwitter(widget);

		try
		{
			// Fetch Twitter user profile based on twitter Id
			User user = twitter.showUser(twitter.getId());
			

			SocialSearchResult result = new SocialSearchResult();

			// Map user details to SocialSearchResult
			result.id = user.getId() + "";
			result.name = user.getName();
			result.screen_name = user.getScreenName();
			result.picture = user.getBiggerProfileImageURLHttps().toString();
			result.location = user.getLocation();
			result.summary = user.getDescription();
			result.num_connections = user.getFollowersCount() + "";
			result.tweet_count = user.getStatusesCount() + "";
			result.friends_count = user.getFriendsCount() + "";

			result.url = "https://twitter.com/" + user.getScreenName();
			result.is_follow_request_sent = user.isFollowRequestSent();
			result.is_connected = twitter.showFriendship(twitter.getId(), user.getId()).isSourceFollowingTarget();
			result.is_followed_by_target = twitter.showFriendship(twitter.getId(), user.getId())
					.isSourceFollowedByTarget();

			/*
			 * If current status is not null, get network updates Assuming
			 * current id as new status, 5 recent statuses are retrieved
			 */
			if (user.getStatus() != null)
			{
				result.current_update = user.getStatus().getText();
				result.current_update_id = user.getStatus().getId();

				result.updateStream = TwitterUpdates.getNetworkUpdates(widget, user.getId(), result.current_update_id,
						5);
			}
			return result;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In get profile twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}

	}

}
