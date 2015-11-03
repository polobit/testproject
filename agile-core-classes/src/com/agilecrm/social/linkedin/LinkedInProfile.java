package com.agilecrm.social.linkedin;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.EnumSet;

import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.schema.Person;

public class LinkedInProfile
{

	/**
	 * Fetches LinkedIn profiles based on the profile id, token and secret are
	 * retrieved from the widget object and LinkedinId sent. Result is wrapped
	 * in to {@link SocialSearchResult} class
	 * 
	 * @param widget
	 *            {@link Widget}, for accessing token and secret key
	 * @param linkedInId
	 *            {@link String} LinkedIn Id of the person whose profile is
	 *            required
	 * @return {@link SocialSearchResult}
	 * @throws Exception
	 */
	public static SocialSearchResult getLinkedInProfileById(Widget widget, String linkedInId)
			throws SocketTimeoutException, IOException, Exception
	{
	
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			/*
			 * Requests the client to return profile details by specifying the
			 * fields to be returned
			 */
			Person person = client.getProfileById(linkedInId, EnumSet.of(ProfileField.PICTURE_URL,
					ProfileField.FIRST_NAME, ProfileField.LAST_NAME, ProfileField.SUMMARY, ProfileField.HEADLINE,
					ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
					ProfileField.ID, ProfileField.DISTANCE, ProfileField.CURRENT_SHARE, ProfileField.CURRENT_STATUS,
					ProfileField.POSITIONS_COMPANY, ProfileField.THREE_CURRENT_POSITIONS,
					ProfileField.THREE_PAST_POSITIONS, ProfileField.POSITIONS, ProfileField.POSITIONS_ID,
					ProfileField.POSITIONS_TITLE, ProfileField.POSITIONS_SUMMARY, ProfileField.POSITIONS_START_DATE,
					ProfileField.POSITIONS_END_DATE, ProfileField.POSITIONS_IS_CURRENT, ProfileField.POSITIONS_TITLE,
					ProfileField.POSITIONS_COMPANY_ID, ProfileField.POSITIONS_COMPANY_INDUSTRY,
					ProfileField.POSITIONS_COMPANY_TICKER, ProfileField.POSITIONS_COMPANY_NAME,
					ProfileField.POSITIONS_COMPANY_SIZE, ProfileField.POSITIONS_COMPANY));
	
			// wraps person details into a search result
			SocialSearchResult result = LinkedInUtil.wrapPersonDetailsInSearchResult(person);
	
			result.current_update = person.getCurrentStatus();
	
			/*
			 * Distance is 1 for direct connections and 0 for their own profile
			 */
			if (!(person.getDistance() > 1l)){
				result.is_connected = true;
			}
	
			// Retrieves work positions of the person
			result.searchResult = LinkedInExperience.fetchExperienceOfPerson(person, linkedInId, client);
	
			return result;
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

	
	/**
	 * Fetches LinkedIn profiles for the current user, token and secret are
	 * retrieved from the widget object and LinkedinId sent. Result is wrapped
	 * in to {@link SocialSearchResult} class
	 * 
	 * @param widget
	 *            {@link Widget}, for accessing token and secret key
	 *
	 * @return {@link SocialSearchResult}
	 * @throws Exception
	 */
	public static SocialSearchResult getLinkedInProfile(Widget widget)
			throws SocketTimeoutException, IOException, Exception{
				
				try
				{
					// Creates a client with token and secret retrieved from widget
					final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
							widget.getProperty("secret"));
			
					/*
					 * Requests the client to return profile details by specifying the
					 * fields to be returned
					 */
					Person person = client.getProfileForCurrentUser(EnumSet.of(ProfileField.PICTURE_URL,
							ProfileField.ID,ProfileField.FIRST_NAME, ProfileField.LAST_NAME, ProfileField.SUMMARY, ProfileField.HEADLINE,
							ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
							ProfileField.ID, ProfileField.DISTANCE, ProfileField.CURRENT_SHARE, ProfileField.CURRENT_STATUS,
							ProfileField.POSITIONS_COMPANY, ProfileField.THREE_CURRENT_POSITIONS,
							ProfileField.THREE_PAST_POSITIONS, ProfileField.POSITIONS, ProfileField.POSITIONS_ID,
							ProfileField.POSITIONS_TITLE, ProfileField.POSITIONS_SUMMARY, ProfileField.POSITIONS_START_DATE,
							ProfileField.POSITIONS_END_DATE, ProfileField.POSITIONS_IS_CURRENT, ProfileField.POSITIONS_TITLE,
							ProfileField.POSITIONS_COMPANY_ID, ProfileField.POSITIONS_COMPANY_INDUSTRY,
							ProfileField.POSITIONS_COMPANY_TICKER, ProfileField.POSITIONS_COMPANY_NAME,
							ProfileField.POSITIONS_COMPANY_SIZE, ProfileField.POSITIONS_COMPANY));
			
					// wraps person details into a search result
					SocialSearchResult result = LinkedInUtil.wrapPersonDetailsInSearchResult(person);
			
					result.current_update = person.getCurrentStatus();
			
					// Retrieves work positions of the person
					//result.searchResult = LinkedInExperience.fetchExperienceOfPerson(person, person.getId(), client);
			
					return result;
			
				}
				catch (Exception e)
				{
					// Handles exception thrown by LinkedIn and throws proper exceptions
					throw LinkedInUtil.handleExceptionInLinkedIn(e);
				}
			}
	
	
	public static void main(String args[])
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient("c20b03b2-0f17-49d4-b26b-4d4fe775f145",
					"4ae15e9d-1ab9-4503-964c-17aef93a7fc6");
	
			/*
			 * Requests the client to return profile details by specifying the
			 * fields to be returned
			 */
			Person person = client.getProfileForCurrentUser(EnumSet.of(ProfileField.PICTURE_URL,
					ProfileField.ID,ProfileField.FIRST_NAME, ProfileField.LAST_NAME, ProfileField.SUMMARY, ProfileField.HEADLINE,
					ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
					ProfileField.ID, ProfileField.DISTANCE, ProfileField.CURRENT_SHARE, ProfileField.CURRENT_STATUS,
					ProfileField.POSITIONS_COMPANY, ProfileField.THREE_CURRENT_POSITIONS,
					ProfileField.THREE_PAST_POSITIONS, ProfileField.POSITIONS, ProfileField.POSITIONS_ID,
					ProfileField.POSITIONS_TITLE, ProfileField.POSITIONS_SUMMARY, ProfileField.POSITIONS_START_DATE,
					ProfileField.POSITIONS_END_DATE, ProfileField.POSITIONS_IS_CURRENT, ProfileField.POSITIONS_TITLE,
					ProfileField.POSITIONS_COMPANY_ID, ProfileField.POSITIONS_COMPANY_INDUSTRY,
					ProfileField.POSITIONS_COMPANY_TICKER, ProfileField.POSITIONS_COMPANY_NAME,
					ProfileField.POSITIONS_COMPANY_SIZE, ProfileField.POSITIONS_COMPANY));
	
			// wraps person details into a search result
			SocialSearchResult result = LinkedInUtil.wrapPersonDetailsInSearchResult(person);
	
			result.current_update = person.getCurrentStatus();
	
			// Retrieves work positions of the person
			//result.searchResult = LinkedInExperience.fetchExperienceOfPerson(person, person.getId(), client);
	
			System.out.println("-------------------------------------");
			System.out.println(result);
	
		}
		catch (Exception e)
		{
			
			System.out.println("----------------exception---------------------");
			
			System.out.println(e.getMessage());
			System.out.println(LinkedInUtil.handleExceptionInLinkedIn(e));
	
			// Handles exception thrown by LinkedIn and throws proper exceptions
			//throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}
}