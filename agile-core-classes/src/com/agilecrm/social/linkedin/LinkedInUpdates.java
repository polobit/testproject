package com.agilecrm.social.linkedin;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Date;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import org.json.JSONObject;

import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.util.JSONUtil;
import com.agilecrm.util.StringUtils2;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.NetworkUpdatesApiClient;
import com.google.code.linkedinapi.client.enumeration.NetworkUpdateType;
import com.google.code.linkedinapi.schema.Network;
import com.google.code.linkedinapi.schema.Person;
import com.google.code.linkedinapi.schema.Update;
import com.google.code.linkedinapi.schema.VisibilityType;

public class LinkedInUpdates
{

	/**
	 * Fetches the updates of the person based on his LinkedIn id and specific
	 * number of updates which are limited to start and end point and from
	 * specific start date to end date
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @param linkedInId
	 *            LinkedIn Id of the person whose updates are required
	 * @param startIndex
	 * @param endIndex
	 * @param startDate
	 * @param endDate
	 * @return {@link List} of {@link SocialUpdateStream}
	 * @throws Exception
	 *             If the personId does not exists or person provides restricted
	 *             access to his profile
	 */
	public static List<SocialUpdateStream> getNetworkUpdates(Widget widget, String linkedInId, int startIndex,
			int endIndex, String startDate, String endDate) throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Create network updates client, to fetch user network updates
			final NetworkUpdatesApiClient client = LinkedInUtil.factory.createNetworkUpdatesApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			// Retrieves filtered network updates based on parameters
			Network network = LinkedInUpdates.getSpecificNetwork(client, linkedInId, startIndex, endIndex, startDate, endDate);
	
			/*
			 * LinkedInApiClient is required to retrieve person details in the
			 * network connection updates
			 */
			LinkedInApiClient client1 = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			// Forms a list from retrieved updates and returned
			return LinkedInUpdates.getListFromNetworkUpdates(network, client1);
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

	/**
	 * Fetches user updates from {@link NetworkUpdatesApiClient} based on the
	 * parameters provided
	 * 
	 * @param client
	 *            {@link NetworkUpdatesApiClient} configured with tokens
	 * @param linkedInId
	 *            {@link String} LinkedIn Id of the person whose updates are
	 *            required
	 * @param startIndex
	 * @param endIndex
	 * @param startDate
	 * @param endDate
	 * @return {@link Network} with user updates
	 * @throws SocketTimeoutException
	 * @throws IOException
	 * @throws Exception
	 */
	public static Network getSpecificNetwork(NetworkUpdatesApiClient client, String linkedInId, int startIndex,
			int endIndex, String startDate, String endDate) throws SocketTimeoutException, IOException, Exception
	{
		// Set of details which are to be fetched
		Set<NetworkUpdateType> enumSet = EnumSet.of(NetworkUpdateType.PROFILE_UPDATE,
				NetworkUpdateType.CONNECTION_UPDATE, NetworkUpdateType.SHARED_ITEM,
				NetworkUpdateType.EXTENDED_PROFILE_UPDATE);
	
		// If start index and end index are provided, filter those updates
		if (!(startIndex < 0) && !(endIndex <= 0))
		{
			// If start date and end date are provided, filter updates on it
			if (!StringUtils2.isNullOrEmpty(new String[] { startDate, endDate }))
			{
				System.out.println("In network updates indexed and dated");
	
				/*
				 * Given epoch date is converted into milliseconds from seconds
				 * and a date object is formed
				 */
				Date startDat = new Date(Long.parseLong(startDate) * 1000);
				Date endDat = new Date(Long.parseLong(endDate) * 1000);
	
				return client.getUserUpdates(linkedInId, enumSet, startIndex, endIndex, startDat, endDat);
			}else{
				System.out.println("In network updates indexed");
				// filters updates only on start and end index
				return client.getUserUpdates(linkedInId, enumSet, startIndex, endIndex);
			}
	
		}
		else
		{
			System.out.println("In network updates normal");
			// fetch all updates
			return client.getUserUpdates(linkedInId, enumSet);
		}
	}

	/**
	 * Used to form a {@link List} of {@link SocialUpdateStream} from
	 * {@link Network} object
	 * 
	 * @param network
	 *            {@link Network}
	 * @param client1
	 *            {@link LinkedInApiClient}
	 * @return {@link List} of {@link SocialUpdateStream}
	 * @throws Exception
	 */
	public static List<SocialUpdateStream> getListFromNetworkUpdates(Network network, LinkedInApiClient client1)
			throws SocketTimeoutException, IOException, Exception
	{
		List<SocialUpdateStream> list = new ArrayList<SocialUpdateStream>();
	
		// Iterate for each object
		for (Update update : network.getUpdates().getUpdateList())
		{
			SocialUpdateStream stream = new SocialUpdateStream();
			JSONObject json = null;
	
			// If update is on share
			if (update.getUpdateContent().getPerson().getCurrentShare() != null)
			{
				stream.id = update.getUpdateContent().getPerson().getCurrentShare().getId();
				stream.type = update.getUpdateType().name();
				stream.created_time = update.getTimestamp() / 1000;
				json = new JSONObject().put("comment",
						update.getUpdateContent().getPerson().getCurrentShare().getComment()).put("current-share",
						JSONUtil.toJSONString(update.getUpdateContent().getPerson().getCurrentShare()));
				stream.message = json.toString();
				list.add(stream);
			}
			// If update is on connection
			else if (update.getUpdateContent().getPerson().getConnections() != null)
			{
				/*
				 * Person is connected to one person or more persons at a time.
				 * For each person iterate the loop and it to list
				 */
				for (Person person : update.getUpdateContent().getPerson().getConnections().getPersonList())
				{
	
					stream.id = person.getId();
					stream.type = update.getUpdateType().name();
					stream.created_time = update.getTimestamp() / 1000;
	
					/*
					 * If person doesn't share information for third party
					 * applications, that will be an exception, we skip those
					 * profiles
					 */
					try
					{
						/*
						 * Id or name is private for the people who doesn't
						 * share their information to third party applications,
						 * we skip those profiles
						 */
						if (person.getId() != null && person.getId().equalsIgnoreCase("private"))
							continue;
	
						if (person.getFirstName().equalsIgnoreCase("private")
								|| person.getLastName().equalsIgnoreCase("private"))
							continue;
	
						// Fetches person details from LinkedIn
						json = new JSONObject(LinkedInUtil.fetchPersonDetailsInLinkedin(client1, person.getId()));
					}
					catch (Exception e)
					{
						continue;
					}
					stream.message = json.toString();
					list.add(stream);
				}
			}
	
		}
	
		return list;
	}

	/**
	 * Connects to linkedIn based on widget preferences and re-shares a post in
	 * LinkedIn based on the given share id of the post.
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @param shareId
	 *            Id of the post in LinkedIn
	 * @param text
	 *            Comment message while re-sharing the post
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String reshareLinkedInPost(Widget widget, String shareId, String text) throws SocketTimeoutException,
			IOException, Exception
	{
		try
		{
			// Create network updates client, to re-share the post
			final NetworkUpdatesApiClient client = LinkedInUtil.factory.createNetworkUpdatesApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
			/*
			 * comment while re-sharing, we are not taking this parameter from
			 * user
			 */
			text = "";
			client.reShare(shareId, text, VisibilityType.ANYONE);
			return "Shared Successfully";
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

}
