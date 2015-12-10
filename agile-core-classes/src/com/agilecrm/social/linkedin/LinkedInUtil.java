package com.agilecrm.social.linkedin;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.Globals;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.LinkedInApiClientException;
import com.google.code.linkedinapi.client.LinkedInApiClientFactory;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.client.enumeration.ProfileType;
import com.google.code.linkedinapi.schema.Person;

/**
 * <code>LinkedinUtil</code> class creates a client which connects to LinkedIn
 * based on the token and token secret, It includes methods to fetch current
 * user profile, search profiles based on first name and lastname, profile based
 * on linkedIn id(unique id provided by LinkedIn for each user).
 * <p>
 * This class is called from {@link WidgetsAPI} to search profiles from LinkedIn
 * or to get Profile based on LinkedIn id
 * </p>
 * 
 * @since August 2012
 */
public class LinkedInUtil
{
	/**
	 * Creates Client factory using developer keys, which allows to connect to
	 * LinkedIn using token and key
	 */
	public static final LinkedInApiClientFactory factory = LinkedInApiClientFactory.newInstance(
			Globals.LINKED_IN_API_KEY, Globals.LINKED_IN_SECRET_KEY);

	/**
	 * Basic LinkedIn URL for LinkedIn images.
	 * 
	 * As LinkedIn keeping on changing LinkedIn image URLs, we change the image
	 * URLs into this format
	 */
	private static final String LINKEDIN_IMAGE_URL_FORMAT = "https://m3-s.licdn.com";

	/**
	 * Creates a client to connect to LinkedIn using developers API key and
	 * secret key. Fetches profile for the current user who connects to LinkedIn
	 * based on token and token secret provided when user creates a connect
	 * 
	 * @param token
	 *            {@link String}
	 * @param tokenSecret
	 *            {@link String}
	 * @return {@link Map}
	 */
	public static Map<String, String> getLinkedInUserProperties(String token, String tokenSecret) throws Exception
	{

		// Creates a client using factory setting sending token and token secret
		final LinkedInApiClient client = factory.createLinkedInApiClient(token, tokenSecret);

		/*
		 * Retrieves profile details, details are fetched based on the set that
		 * specifies the properties
		 */
		Person profile = client.getProfileForCurrentUser(EnumSet.of(ProfileField.PICTURE_URL, ProfileField.FIRST_NAME,
				ProfileField.LAST_NAME, ProfileField.ID, ProfileField.DISTANCE));

		// Sets the user profiles details in to a map
		Map<String, String> properties = new HashMap<String, String>();
		properties.put("id", profile.getId());
		properties.put("name", profile.getFirstName() + " " + profile.getLastName());
		properties.put("pic", changeImageUrl(profile.getPictureUrl()));
		properties.put("distance", profile.getDistance() + "");

		// Returns profile details as a map
		return properties;
	}

	/**
	 * Iterates through given {@link List} of persons and fills each
	 * {@link Person} details in {@link SocialSearchResult} and forms a
	 * {@link List}
	 * 
	 * @param persons
	 * @return
	 */
	public static List<SocialSearchResult> fillPersonsDetailsInList(List<Person> persons)
	{
		List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

		/*
		 * Iterates through results fetched and wraps the details into
		 * SocialSearchResult wrapper class and adds it to list
		 */
		for (Person person : persons)
		{

			/*
			 * Id or name is private for the people who doesn't share their
			 * information to third party applications, we skip those profiles
			 */
			if (person.getId() != null && person.getId().equalsIgnoreCase("private")){
				continue;
			}
			if (person.getFirstName().equalsIgnoreCase("private") || person.getLastName().equalsIgnoreCase("private")){
				continue;
			}

			// Add wrapper filled with details to the list
			searchResults.add(wrapPersonDetailsInSearchResult(person));

		}
		return searchResults;

	}

	/**
	 * Fills {@link Person} details in a {@link SocialSearchResult}
	 * 
	 * @param person
	 *            {@link Person}
	 * @return {@link SocialSearchResult}
	 */
	public static SocialSearchResult wrapPersonDetailsInSearchResult(Person person)
	{
		SocialSearchResult result = new SocialSearchResult();

		result.id = person.getId();

		// check if first name and last name is null and add them
		result.name = (((person.getFirstName() != null) ? person.getFirstName() : "") + " " + ((person.getLastName() != null) ? person
				.getLastName() : "")).trim();
		result.picture = person.getPictureUrl();
		result.url = person.getPublicProfileUrl();
		result.summary = person.getHeadline();
		result.distance = (person.getDistance() != null) ? person.getDistance().toString() : "";

		System.out.println("distance" + result.distance);
		result.location = (person.getLocation() != null) ? person.getLocation().getName() : "";

		// If degree of connection is 1, both profiles are connected
		if (result.distance != "" && Integer.parseInt(result.distance) == 1){
			result.is_connected = true;
		}

		System.out.println("pic url : " + person.getPictureUrl());
		/*
		 * Changes http to https to avoid client side warnings by browser,
		 * Changes certificate from m3 to m3-s to fix SSL broken image link
		 */
		if (result.picture != null){
			result.picture = changeImageUrl(result.picture);
		}

		/*
		 * Set number of connections, location and distance(degree of
		 * connection) if provided
		 */
		result.num_connections = (person.getNumConnections() != null) ? person.getNumConnections().toString() : "";

		return result;
	}

	/**
	 * Retrieve LinkedIn Id from LinkedIn URL of person whose profile details
	 * are required
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @param linkedInURL
	 *            {@link String} linkedIn URL
	 * @return {@link String} LinkedIn Id
	 * @throws Exception
	 */
	public static String getLinkedInIdByUrl(Widget widget, String linkedInURL) throws Exception
	{

		try
		{
			// Create LinkedInApiClient to fetch profile by URL
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));
			// Creates a client specifying the fields to be returned
			Person person = client.getProfileByUrl(linkedInURL, ProfileType.PUBLIC, EnumSet.of(ProfileField.ID));

			return person.getId();
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw handleExceptionInLinkedIn(e);
		}

	}

	/**
	 * Fetches person details from LinkedIn and changes picture URL
	 * 
	 * @param client
	 *            {@link LinkedInApiClient}
	 * @param linkedInId
	 *            {@link String} LinkedIN Id
	 * @return {@link Person}
	 */
	public static Person fetchPersonDetailsInLinkedin(LinkedInApiClient client, String linkedInId)
	{
		Person person1 = client.getProfileById(linkedInId, EnumSet.of(ProfileField.PUBLIC_PROFILE_URL,
				ProfileField.LAST_NAME, ProfileField.FIRST_NAME, ProfileField.PICTURE_URL, ProfileField.HEADLINE,
				ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.ID, ProfileField.DISTANCE));

		System.out.println("pic url : " + person1.getPictureUrl());
		/*
		 * Changes http to https to avoid client side warnings by browser,
		 * Changes certificate from m3 to m3-s to fix SSL broken image link
		 */
		person1.setPictureUrl(changeImageUrl(person1.getPictureUrl()));

		return person1;
	}

	/**
	 * Changes LinkedIn image URL to the basic LinkedIn image URL format
	 * 
	 * <p>
	 * This is done to get rid of broken images bug in LinkedIn
	 * </p>
	 * 
	 * @param url
	 *            {@link String} to be changed
	 * @return {@link String} URL
	 */
	public static String changeImageUrl(String url)
	{
		if (!StringUtils.isBlank(url) && url.contains("licdn.com")){
			url = url.replace(url.substring(0, url.indexOf(".com") + 4), LINKEDIN_IMAGE_URL_FORMAT);
		}

		System.out.println("Changed URL in LinkedIn: " + url);
		return url;
	}

	/**
	 * LinkedIn exceptions are wrapped in {@link LinkedInApiClientException},
	 * this method extracts it into proper format
	 * 
	 * @param exception
	 *            {@link Exception}
	 * @return {@link Exception} with proper exception extracted
	 */
	public static Exception handleExceptionInLinkedIn(Exception exception)
	{
		System.out.println("Exception message: " + exception.getMessage());

		if (exception.getMessage().contains("The token used in the OAuth request is not valid") || exception.getMessage().contains("[unauthorized]. restricted")){
			return new Exception("Access granted to your linkedin account has expired.");
		}
		
		if(exception.getMessage().contains("[invalid.profile.access]. You don't have access to the profile")){
			return new Exception("LinkedIn doesn't allow you to access this profile");
		}

		/*
		 * We extract the inner exception from LinkedIn exception, since it is
		 * returned as string and make the exception out of string and throw
		 * proper exception like (TimeoutException, IOException..)
		 */
		return extractException(exception);
	}

	/**
	 * Extracts the inner exception from Exception and throw proper exception
	 * like (TimeoutException, IOException..)
	 * 
	 * @param exception
	 *            {@link Exception}
	 * @return {@link Exception} with proper exception extracted
	 */
	public static Exception extractException(Exception exception)
	{
		Exception innerException = null;

		if (exception.getMessage().contains(":"))
			try{
				innerException = (Exception) Class.forName(
						exception.getMessage().substring(0, exception.getMessage().indexOf(":"))).newInstance();
			}catch (Exception e2){
				return exception;
			}

		/*
		 * If inner exception, is not an exception and a proper message from
		 * LinkedIn , we throw it as it is
		 */
		if (innerException == null){
			return exception;
		}
		return innerException;
	}
}