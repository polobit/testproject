package com.agilecrm.social;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.LinkedInApiClientFactory;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.client.enumeration.SearchParameter;
import com.google.code.linkedinapi.schema.People;
import com.google.code.linkedinapi.schema.Person;

public class LinkedInUtil {
	public static final String LINKED_IN_API_KEY = "kuft8xqzrnfi";
	public static final String LINKED_IN_SECRET_KEY = "BPN9L6QQvWwum7kn";

	public static Map<String, String> getLinkedInUserProperties(String token,
			String tokenSecret) {
		final LinkedInApiClientFactory factory = LinkedInApiClientFactory
				.newInstance(LINKED_IN_API_KEY, LINKED_IN_SECRET_KEY);
		final LinkedInApiClient client = factory.createLinkedInApiClient(token,
				tokenSecret);

		Person profile = client.getProfileForCurrentUser(EnumSet.of(
				ProfileField.PICTURE_URL, ProfileField.FIRST_NAME,
				ProfileField.LAST_NAME, ProfileField.ID));

		System.out.println(profile);

		// Properties
		Map<String, String> properties = new HashMap<String, String>();
		properties.put("id", profile.getId());
		properties.put("name",
				profile.getFirstName() + " " + profile.getLastName());
		properties.put("pic", profile.getPictureUrl());

		return properties;
	}

	// Get Linkedin Profile
	public static List<SocialSearchResult> searchLinkedInProfiles(
			Widget widget, Contact contact) {
		Map<SearchParameter, String> searchParameters = new EnumMap<SearchParameter, String>(
				SearchParameter.class);

		String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
		String lastName = contact.getContactFieldValue(Contact.LAST_NAME);
		if (firstName == null || lastName == null)
			return null;

		// Set name as filter
		searchParameters.put(SearchParameter.KEYWORDS, firstName + " "
				+ lastName);

		// Get Token, Secret
		final LinkedInApiClientFactory factory = LinkedInApiClientFactory
				.newInstance(LINKED_IN_API_KEY, LINKED_IN_SECRET_KEY);
		final LinkedInApiClient client = factory.createLinkedInApiClient(
				widget.getProperty("token"), widget.getProperty("secret"));

		List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

		People people = client.searchPeople(searchParameters, EnumSet.of(
				ProfileField.PICTURE_URL, ProfileField.FIRST_NAME,
				ProfileField.LAST_NAME, ProfileField.SUMMARY,
				ProfileField.HEADLINE, ProfileField.LOCATION_NAME,
				ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
				ProfileField.ID));
		System.out.println("Total search result:" + people.getPersonList()
				+ " " + people.getPersonList().size());
		for (Person person : people.getPersonList()) {
			SocialSearchResult result = new SocialSearchResult();

			result.id = person.getId();
			result.name = person.getFirstName() + " " + person.getLastName();
			result.picture = person.getPictureUrl();
			result.url = person.getPublicProfileUrl();
			result.summary = person.getHeadline();

			if (person.getNumConnections() != null)
				result.num_connections = person.getNumConnections().toString();
			else
				result.num_connections = "?";

			if (person.getLocation() != null)
				result.location = person.getLocation().getName();
			else
				result.location = "?";

			searchResults.add(result);
		}

		System.out.println("linkedin profiles:" + searchResults);

		return searchResults;
	}

	// Fetch Linkedin profile based on profile Id
	public static SocialSearchResult getLinkedinProfileById(Widget widget,
			String id) {
		final LinkedInApiClientFactory factory = LinkedInApiClientFactory
				.newInstance(LINKED_IN_API_KEY, LINKED_IN_SECRET_KEY);
		final LinkedInApiClient client = factory.createLinkedInApiClient(
				widget.getProperty("token"), widget.getProperty("secret"));

		Person person = client.getProfileById(id);

		SocialSearchResult result = new SocialSearchResult();

		result.id = person.getId();
		result.name = person.getFirstName() + " " + person.getLastName();
		result.picture = person.getPictureUrl();
		result.url = person.getPublicProfileUrl();
		result.summary = person.getHeadline();

		System.out.println("Linkedin profiles :" + result);
		return result;

	}
}
