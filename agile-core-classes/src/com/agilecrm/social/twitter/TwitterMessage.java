package com.agilecrm.social.twitter;

import java.io.IOException;
import java.net.SocketTimeoutException;

import twitter4j.DirectMessage;
import twitter4j.Twitter;
import twitter4j.TwitterRuntimeException;

import com.agilecrm.widgets.Widget;

public class TwitterMessage
{

	/**
	 * Checks whether the person with the parameter twitterId is following the
	 * agile user or not.If he is following, then he sends direct message to his
	 * twitter account.
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @param message
	 *            {@link String} message to be sent
	 * @return {@link String} success message
	 * @throws Exception
	 *             If the person with twitterId is not following agile user in
	 *             twitter
	 */
	public static String sendTwitterMessageById(Widget widget, String twitterId, String message)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a twitter object to connect with twitter
			Twitter twitter = TwitterUtil.getTwitter(widget);

			// Current Twitter user id in agile
			long agileUserTwitterId = twitter.getId();

			/*
			 * If the twitter profile with with given twitter Id (contact)
			 * follows agile user Twitter profile, agile user can send a direct
			 * message to contact
			 */
			if (!twitter.showFriendship(agileUserTwitterId, Long.parseLong(twitterId)).isSourceFollowedByTarget()){
				return "You can send a message only to persons who is following you";
			}
			DirectMessage directMessage = twitter.sendDirectMessage(Long.parseLong(twitterId), message
					+ TwitterUtil.AGILE_TWITTER_SOURCE_MESSAGE);

			// If returned DM id is zero, message is not sent
			if (directMessage.getId() == 0){
				return "Unsuccessful try again";
			}
			return "Message sent Successfully";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In DM twitter exception");
			throw TwitterUtil.getErrorMessage(e);
		}
	}

}
