package com.agilecrm.social.twitter;

import java.io.IOException;
import java.net.SocketTimeoutException;

import twitter4j.Twitter;
import twitter4j.TwitterRuntimeException;
import twitter4j.User;

import com.agilecrm.widgets.Widget;

public class TwitterFollow
{

	/**
	 * Connects to the twitter based on widget prefs and creates friendship
	 * (follow) between agile user and the person with twitter id in twitter
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String follow(Widget widget, Long twitterId) throws SocketTimeoutException, IOException, Exception
	{
		// Get twitter object
		Twitter twitter = TwitterUtil.getTwitter(widget);
		try
		{
			/*
			 * Creates friendship (follow) and checks whether followed, because
			 * some have restricted access for following
			 */
			User user = twitter.createFriendship(twitterId);
			boolean connected = twitter.showFriendship(twitter.getId(), user.getId()).isSourceFollowingTarget();
			return (connected) ? "true" : "false";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In follow twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}
	}

	/**
	 * Connects to the twitter based on widget prefs and destroys friendship
	 * (unfollow) between agile user and the person with twitter id in twitter
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String unfollow(Widget widget, Long twitterId) throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Get twitter object and unfollow a person in Twitter
			User user = TwitterUtil.getTwitter(widget).destroyFriendship(twitterId);
			return (user != null) ? "Unfollowed" : "Unsuccessful";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In unfollow twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}
	}

}
