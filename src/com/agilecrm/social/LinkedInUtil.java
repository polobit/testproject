package com.agilecrm.social;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.LinkedInApiClientFactory;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.client.enumeration.SearchParameter;
import com.google.code.linkedinapi.schema.People;
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
    public static Map<String, String> getLinkedInUserProperties(String token,
	    String tokenSecret)
    {
	// Creates a client factory built based on the developer API keys
	final LinkedInApiClientFactory factory = LinkedInApiClientFactory
		.newInstance(Globals.LINKED_IN_API_KEY,
			Globals.LINKED_IN_SECRET_KEY);

	// Creats a client using factory setting sending token and token secret
	final LinkedInApiClient client = factory.createLinkedInApiClient(token,
		tokenSecret);

	// Gets profile details, details are fetched based on the set that
	// specifies the properties
	Person profile = client
		.getProfileForCurrentUser(EnumSet.of(ProfileField.PICTURE_URL,
			ProfileField.FIRST_NAME, ProfileField.LAST_NAME,
			ProfileField.ID, ProfileField.DISTANCE));

	System.out.println("profile: " + profile);

	// Sets the user profiles details in to a map
	Map<String, String> properties = new HashMap<String, String>();
	properties.put("id", profile.getId());
	properties.put("name",
		profile.getFirstName() + " " + profile.getLastName());
	properties.put("pic", profile.getPictureUrl());
	properties.put("distance", profile.getDistance() + "");

	// Returns profile details as a map
	return properties;
    }

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
    public static List<SocialSearchResult> searchLinkedInProfiles(
	    Widget widget, Contact contact)
    {
	// Creates searchParamters map usgin SearchParameter provided by
	// LinkedIn
	Map<SearchParameter, String> searchParameters = new EnumMap<SearchParameter, String>(
		SearchParameter.class);

	/* Gets first name and last name of the contact to search profiles */
	String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
	String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

	// If first name of last name is null return null
	if (firstName == null || lastName == null)
	    return null;

	// Sets name as filter to search profiles
	searchParameters.put(SearchParameter.KEYWORDS, firstName + " "
		+ lastName);

	// Creates Client factory using developer keys, which allows to connect
	// to LinkedIn using token and key
	final LinkedInApiClientFactory factory = LinkedInApiClientFactory
		.newInstance(Globals.LINKED_IN_API_KEY,
			Globals.LINKED_IN_SECRET_KEY);

	// Creates client to connect to Linkedin using token and secret,
	// retrieved from widgets.
	final LinkedInApiClient client = factory.createLinkedInApiClient(
		widget.getProperty("token"), widget.getProperty("secret"));

	List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

	// Search profiles based on the searchParameters given, and specifies
	// field to be returned for result profiles
	People people = client.searchPeople(searchParameters, EnumSet.of(
		ProfileField.PICTURE_URL, ProfileField.FIRST_NAME,
		ProfileField.LAST_NAME, ProfileField.SUMMARY,
		ProfileField.HEADLINE, ProfileField.LOCATION_NAME,
		ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
		ProfileField.ID, ProfileField.DISTANCE));

	// Iterates through resutls fetched and creates SocialSearchResult
	// wrapper class and adds results to a list
	for (Person person : people.getPersonList())
	{
	    SocialSearchResult result = new SocialSearchResult();

	    result.id = person.getId();
	    result.name = person.getFirstName() + " " + person.getLastName();
	    result.picture = person.getPictureUrl();
	    result.url = person.getPublicProfileUrl();
	    result.summary = person.getHeadline();
	    result.distance = person.getDistance() + "";

	    // Changes http to https to avoid client side warnings by browser,
	    // Changes certificate from m3 to m3-s to fix ssl broken image link
	    if (result.picture != null)
		result.picture = result.picture.replace("http:", "https:")
			.replace("m3", "m3-s");

	    // Sets number of connects if provided
	    if (person.getNumConnections() != null)
		result.num_connections = person.getNumConnections().toString();
	    else
		result.num_connections = "?";

	    if (person.getLocation() != null)
		result.location = person.getLocation().getName();
	    else
		result.location = "?";

	    if (person.getDistance() != null)
		result.distance = person.getDistance().toString();
	    else
		result.distance = "?";

	    // Add result wrapper object to the list
	    searchResults.add(result);
	}

	System.out.println("linkedin profiles:" + searchResults);

	// Returns list of matches, details wrapped with SocialSearchResults
	// class
	return searchResults;
    }

    /**
     * Fetches LinkedIn profiles based on the profile id, token and secret are
     * retrieved from the widget object and LinkedinId sent. Result is wrapped
     * in to {@link SocialSearchResult} class
     * 
     * @param widget
     *            {@link Widget}, for accessing token and secret key
     * @param id
     *            {@link String}
     * @return {@link SocialSearchResult}
     */
    public static SocialSearchResult getLinkedinProfileById(Widget widget,
	    String id)
    {
	// Creates Client factory using developer keys, which allows to connect
	// to LinkedIn using token and key
	final LinkedInApiClientFactory factory = LinkedInApiClientFactory
		.newInstance(Globals.LINKED_IN_API_KEY,
			Globals.LINKED_IN_SECRET_KEY);
	final LinkedInApiClient client = factory.createLinkedInApiClient(
		widget.getProperty("token"), widget.getProperty("secret"));

	// Creates a client specifying the fields to be returned
	Person person = client.getProfileById(id, EnumSet.of(
		ProfileField.PICTURE_URL, ProfileField.FIRST_NAME,
		ProfileField.LAST_NAME, ProfileField.SUMMARY,
		ProfileField.HEADLINE, ProfileField.LOCATION_NAME,
		ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
		ProfileField.ID, ProfileField.DISTANCE));

	SocialSearchResult result = new SocialSearchResult();

	// Get details and set it to SocialSearchResult class
	result.id = person.getId();
	result.name = person.getFirstName() + " " + person.getLastName();
	result.picture = person.getPictureUrl();
	result.url = person.getPublicProfileUrl();
	result.summary = person.getHeadline();
	result.distance = person.getDistance() + "";

	// Change http to https to avoid client side warnings by browser
	// Change certificate from m3 to m3-s to fix ssl broken image link
	if (result.picture != null)
	    result.picture = result.picture.replace("http:", "https:").replace(
		    "m3", "m3-s");

	System.out.println("Linkedin profiles :" + result);
	return result;

    }
}
