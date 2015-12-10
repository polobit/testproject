package com.agilecrm.social.twitter;

import java.io.IOException;
import java.net.SocketTimeoutException;

import twitter4j.Status;
import twitter4j.TwitterRuntimeException;

import com.agilecrm.util.JSONUtil;
import com.agilecrm.widgets.Widget;

public class TwitterTweet
{

	/**
	 * Connects to the twitter based on widget prefs and post a tweet in twitter
	 * account of the contact based on twitter id
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @param message
	 *            {@link String} message to tweet
	 * @return
	 * @throws Exception
	 */
	public static String tweetInTwitter(Widget widget, String message) throws SocketTimeoutException, IOException,
			Exception
	{
		try
		{
			// Get twitter object and tweet in twitter
			Status status = TwitterUtil.getTwitter(widget).updateStatus(message);
			System.out.println("Tweet: " + JSONUtil.toJSONString(status));
			return "Successful";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In tweet twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}
	}

	/**
	 * Connects to the twitter based on widget preferences and retweets the
	 * tweet based on the given tweet id
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param tweetId
	 *            id of the {@link Tweet}
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String reTweetByTweetId(Widget widget, Long tweetId) throws SocketTimeoutException, IOException,
			Exception
	{
		try
		{
			// Get twitter object and retweet the status by its id
			Status reTweet = TwitterUtil.getTwitter(widget).retweetStatus(tweetId);
			return (reTweet != null) ? "Retweeted successfully" : "Unsuccessful";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In retweet twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}
	}

}
