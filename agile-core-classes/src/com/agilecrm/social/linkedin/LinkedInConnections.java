package com.agilecrm.social.linkedin;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.schema.Connections;
import com.google.code.linkedinapi.schema.Person;

public class LinkedInConnections
{

	/**
	 * Retrieves common connections of a Agile user LinkedIn profile and the
	 * person with given LinkedIn Id (contact LinkedIn Profile)
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @param linkedInId
	 *            {@link String} LinkedIn Id of the person whose updates are
	 *            required
	 * @return {@link List} of {@link SocialSearchResult}
	 * @throws SocketTimeoutException
	 * @throws IOException
	 * @throws Exception
	 */
	public static List<SocialSearchResult> getSharedConnections(Widget widget, String linkedInId)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			// Get profile of person fetching his shared connections details
			Person profile = client.getProfileById(linkedInId, EnumSet.of(ProfileField.RELATION_TO_VIEWER_DISTANCE,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS, ProfileField.RELATION_TO_VIEWER,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_HEADLINE,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_PUBLIC_PROFILE_URL,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_LAST_NAME,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_FIRST_NAME,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_PICTURE_URL,
					ProfileField.RELATION_TO_VIEWER_CONNECTIONS));
	
			// If no connections found return empty list
			if (profile.getRelationToViewer().getRelatedConnections() == null){
				return new ArrayList<SocialSearchResult>();
			}
	
			// fill each shared connection details in list
			return LinkedInUtil.fillPersonsDetailsInList(profile.getRelationToViewer().getRelatedConnections().getPersonList());
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

	/**
	 * Retrieves direct connections profiles of the LinkedIn profile based on
	 * LinkedIn Id
	 * 
	 * <p>
	 * Note: This method will not work as of now as LinkedIn does not give other
	 * person(contact) direct connections
	 * </p>
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @param linkedInId
	 *            Id of the person whose updates are required
	 * @return {@link List} of {@link SocialUpdateStream}
	 * @throws Exception
	 *             If the personId does not exists or person provides restricted
	 *             access to his profile
	 */
	public static List<SocialSearchResult> getConnections(Widget widget, String linkedInId)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			// Get profile of person fetching his direct connections details
			Connections connections = client.getConnectionsById(linkedInId, EnumSet.of(ProfileField.PUBLIC_PROFILE_URL,
					ProfileField.LAST_NAME, ProfileField.FIRST_NAME, ProfileField.PICTURE_URL, ProfileField.HEADLINE,
					ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.ID, ProfileField.DISTANCE));
	
			// fill each shared connection details in list
			return LinkedInUtil.fillPersonsDetailsInList(connections.getPersonList());
	
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

}
