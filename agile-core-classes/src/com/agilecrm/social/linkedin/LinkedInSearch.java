package com.agilecrm.social.linkedin;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.client.enumeration.SearchParameter;
import com.google.code.linkedinapi.schema.People;

public class LinkedInSearch
{

	// Get Linkedin Profile
	/**
	 * Searches LinkedIn profiles based on first name and last name specified,
	 * result fetched are represented by class {@link SocialSearchResult}
	 * include details id, name, image_url, url etc..
	 * 
	 * <p>
	 * Token and secret required to connect are retrieved from the widget (saved
	 * as prefs JSONString)
	 * </p>
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @param contact
	 *            {@link Contact}
	 * @return {@link List} of {@link SocialSearchResult}
	 */
	public static List<SocialSearchResult> searchLinkedInProfiles(Widget widget, Contact contact)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			/*
			 * Retrieves first name and last name of the contact to search
			 * profiles
			 */
			String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
			String lastName = contact.getContactFieldValue(Contact.LAST_NAME);
	
			// If first name of last name is null or empty return null
			if (StringUtils.isBlank(firstName) && StringUtils.isBlank(lastName)){
				return new ArrayList<SocialSearchResult>();
			}
	
			firstName = (firstName != null) ? firstName : "";
			lastName = (lastName != null) ? lastName : "";
	
			/*
			 * Search profiles based on the searchParameters given, and returns
			 * list of search results
			 */
			return LinkedInSearch.modifiedSearchForLinkedInProfiles(widget, firstName + " " + lastName);
	
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

	/**
	 * Searches LinkedIn profiles based on widget id and the given keywords
	 * 
	 * <p>
	 * Key words would be first name and last name of contact
	 * </p>
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @param firstName
	 *            {@link String} first name of contact
	 * @param lastName
	 *            {@link String} last name of contact
	 * @param title
	 *            {@link String} title of contact
	 * @param company
	 *            {@link String} company name of contact
	 * @param keywords
	 *            {@link String} keywords of contact
	 * @return {@link List} of {@link SocialSearchResult}
	 * @throws Exception
	 */
	public static List<SocialSearchResult> modifiedSearchForLinkedInProfiles(Widget widget, String keywords)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Create list to store results
			List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();
	
			/*
			 * Creates map to fetch results based on searchParameters using
			 * SearchParameter provided by LinkedIn
			 */
			Map<SearchParameter, String> searchParameters = new EnumMap<SearchParameter, String>(SearchParameter.class);
	
			// check if keywords exists
			if (StringUtils.isBlank(keywords)){
				return searchResults;
			}
	
			System.out.println("Keywords searched: " + keywords);
			searchParameters.put(SearchParameter.KEYWORDS, keywords);
	
			// Creates client using token and secret to connect with LinkedIn
			final LinkedInApiClient client = LinkedInUtil.factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
	
			// searches for LinkedIn profiles based on search parameters
			searchResults = LinkedInSearch.searchPeopleInLinkedIn(client, searchParameters);
	
			return searchResults;
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw LinkedInUtil.handleExceptionInLinkedIn(e);
		}
	}

	/**
	 * Searches for the profile in LinkedIn for the given {@link Map} of
	 * {@link SearchParameter}
	 * 
	 * @param client
	 *            {@link LinkedInApiClient} created with token and secret
	 * @param searchParameters
	 *            {@link Map} of {@link SearchParameter}
	 * @return
	 */
	public static List<SocialSearchResult> searchPeopleInLinkedIn(LinkedInApiClient client,
			Map<SearchParameter, String> searchParameters) throws SocketTimeoutException, IOException, Exception
	{
	
		// search people
		People people = client.searchPeople(searchParameters, EnumSet.of(ProfileField.PICTURE_URL,
				ProfileField.FIRST_NAME, ProfileField.LAST_NAME, ProfileField.SUMMARY, ProfileField.HEADLINE,
				ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
				ProfileField.ID, ProfileField.DISTANCE), 0, 20);
	
		// wraps persons details into List of SocialSearchResult
		return LinkedInUtil.fillPersonsDetailsInList(people.getPersonList());
	
	}

}
