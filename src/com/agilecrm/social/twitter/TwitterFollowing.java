package com.agilecrm.social.twitter;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;

import twitter4j.IDs;
import twitter4j.Twitter;
import twitter4j.TwitterRuntimeException;

import com.agilecrm.widgets.Widget;

public class TwitterFollowing
{

	/**
	 * Retrieves the list of twitter IDs who are followed by the contact in
	 * twitter and wraps the result into a {@link List}
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} twitter id of the contact
	 * @return {@link List} of {@link Long} IDs
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	public static List<Long> getFollowingIDs(Widget widget, String twitterId) throws SocketTimeoutException,
			IOException, Exception
	{
		try
		{
			IDs ids;
			List<Long> listOfIds = new ArrayList<Long>();
			long cursor = -1;

			/*
			 * Creates a twitter object to connect with twitter and retrieves
			 * following Twitter Ids based on Twitter ID. If more than 5000
			 * following Ids are required then unComment this do while condition
			 */
			// do {
			ids = TwitterUtil.getTwitter(widget).getFriendsIDs(Long.parseLong(twitterId), cursor);
			listOfIds.addAll(Arrays.asList(ArrayUtils.toObject(ids.getIDs())));
			System.out.println("List of Ids: " + listOfIds);
			// } while ((cursor = ids.getNextCursor()) != 0);

			return listOfIds;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In following Ids twitter exception ");
			throw TwitterUtil.getErrorMessage(e);
		}
	}

}
