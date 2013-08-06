package com.agilecrm.social;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.util.Util;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.LinkedInApiClientException;
import com.google.code.linkedinapi.client.LinkedInApiClientFactory;
import com.google.code.linkedinapi.client.NetworkUpdatesApiClient;
import com.google.code.linkedinapi.client.enumeration.CompanyField;
import com.google.code.linkedinapi.client.enumeration.NetworkUpdateType;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.client.enumeration.ProfileType;
import com.google.code.linkedinapi.client.enumeration.SearchParameter;
import com.google.code.linkedinapi.schema.Company;
import com.google.code.linkedinapi.schema.Connections;
import com.google.code.linkedinapi.schema.Network;
import com.google.code.linkedinapi.schema.People;
import com.google.code.linkedinapi.schema.Person;
import com.google.code.linkedinapi.schema.Position;
import com.google.code.linkedinapi.schema.Update;
import com.google.code.linkedinapi.schema.VisibilityType;

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
    private static final LinkedInApiClientFactory factory = LinkedInApiClientFactory
	    .newInstance(Globals.LINKED_IN_API_KEY,
		    Globals.LINKED_IN_SECRET_KEY);

    private static final String LINKEDINURLFORMAT = "https://m3-s.licdn.com";

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
	    String tokenSecret) throws Exception
    {

	// Creates a client using factory setting sending token and token secret
	final LinkedInApiClient client = factory.createLinkedInApiClient(token,
		tokenSecret);

	/*
	 * Gets profile details, details are fetched based on the set that
	 * specifies the properties
	 */
	Person profile = client
		.getProfileForCurrentUser(EnumSet.of(ProfileField.PICTURE_URL,
			ProfileField.FIRST_NAME, ProfileField.LAST_NAME,
			ProfileField.ID, ProfileField.DISTANCE));

	// Sets the user profiles details in to a map
	Map<String, String> properties = new HashMap<String, String>();
	properties.put("id", profile.getId());
	properties.put("name",
		profile.getFirstName() + " " + profile.getLastName());
	properties.put("pic", changeImageUrl(profile.getPictureUrl()));
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
	    Widget widget, Contact contact) throws SocketTimeoutException,
	    IOException, Exception
    {
	try
	{
	    List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

	    // Gets first name and last name of the contact to search profiles
	    String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
	    String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

	    // If first name of last name is null or empty return null
	    if (StringUtils.isBlank(firstName) && StringUtils.isBlank(lastName))
		return searchResults;

	    // Creates map to fetch results based on searchParameters using
	    // SearchParameter provided by LinkedIn
	    Map<SearchParameter, String> searchParameters = new EnumMap<SearchParameter, String>(
		    SearchParameter.class);

	    // Creates client using token and secret to connect with LinkedIn
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    firstName = (firstName != null) ? firstName : "";
	    lastName = (lastName != null) ? lastName : "";

	    // Sets name as filter to search profiles
	    searchParameters.put(SearchParameter.KEYWORDS, firstName + " "
		    + lastName);

	    // Search profiles based on the searchParameters given, and
	    // specifies
	    // field to be returned for result profiles
	    searchResults = searchPeopleInLinkedIn(client, searchParameters);

	    System.out.println("in search");
	    System.out.println(searchResults);
	    System.out.println(searchResults.size());

	    return searchResults;
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}
    }

    /**
     * Searches LinkedIn profiles based on first name and last name specified,
     * result fetched are represented by class {@link SocialSearchResult}
     * include details id, name, image_url, url etc..
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
    public static List<SocialSearchResult> modifiedSearchForLinkedInProfiles(
	    Widget widget, String keywords) throws SocketTimeoutException,
	    IOException, Exception
    {
	try
	{
	    // Creates map to fetch results based on searchParameters using
	    // SearchParameter provided by LinkedIn
	    Map<SearchParameter, String> searchParameters = new EnumMap<SearchParameter, String>(
		    SearchParameter.class);

	    if (!StringUtils.isBlank(keywords))
		searchParameters.put(SearchParameter.KEYWORDS, keywords);

	    List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

	    if (searchParameters.size() == 0)
		return searchResults;

	    // Creates client using token and secret to connect with LinkedIn
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    searchResults = searchPeopleInLinkedIn(client, searchParameters);

	    return searchResults;
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
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
    public static List<SocialSearchResult> searchPeopleInLinkedIn(
	    LinkedInApiClient client,
	    Map<SearchParameter, String> searchParameters)
	    throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    People people = client.searchPeople(searchParameters, EnumSet.of(
		    ProfileField.PICTURE_URL, ProfileField.FIRST_NAME,
		    ProfileField.LAST_NAME, ProfileField.SUMMARY,
		    ProfileField.HEADLINE, ProfileField.LOCATION_NAME,
		    ProfileField.NUM_CONNECTIONS,
		    ProfileField.PUBLIC_PROFILE_URL, ProfileField.ID,
		    ProfileField.DISTANCE), 0, 20);

	    List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

	    // Iterates through resutls fetched and creates SocialSearchResult
	    // wrapper class and adds results to a list
	    for (Person person : people.getPersonList())
	    {
		SocialSearchResult result = new SocialSearchResult();

		if (person.getId().equalsIgnoreCase("private"))
		    continue;

		if (person.getFirstName().equalsIgnoreCase("private")
			|| person.getLastName().equalsIgnoreCase("private"))
		    continue;

		result.id = person.getId();
		result.name = person.getFirstName() + " "
			+ person.getLastName();
		result.picture = person.getPictureUrl();
		result.url = person.getPublicProfileUrl();
		result.summary = person.getHeadline();
		result.distance = person.getDistance() + "";

		if (person.getDistance() != null && person.getDistance() == 1)
		    result.is_connected = true;

		System.out.println("in linkeidn");

		// Changes http to https to avoid client side warnings by
		// browser,
		// Changes certificate from m3 to m3-s to fix ssl broken image
		// link
		if (result.picture != null)
		    result.picture = changeImageUrl(result.picture);

		System.out.println(result.picture);

		// Sets number of connects if provided
		result.num_connections = (person.getNumConnections() != null) ? person
			.getNumConnections().toString() : "";

		result.location = (person.getLocation() != null) ? person
			.getLocation().getName() : "";

		result.distance = (person.getDistance() != null) ? person
			.getDistance().toString() : "";

		// Add result wrapper object to the list
		searchResults.add(result);
	    }
	    return searchResults;
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}
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
     * @throws Exception
     */
    public static SocialSearchResult getLinkedinProfileById(Widget widget,
	    String linkedInId) throws SocketTimeoutException, IOException,
	    Exception
    {

	try
	{
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    // Creates a client specifying the fields to be returned
	    Person person = client.getProfileById(linkedInId, EnumSet.of(
		    ProfileField.PICTURE_URL, ProfileField.FIRST_NAME,
		    ProfileField.LAST_NAME, ProfileField.SUMMARY,
		    ProfileField.HEADLINE, ProfileField.LOCATION_NAME,
		    ProfileField.NUM_CONNECTIONS,
		    ProfileField.PUBLIC_PROFILE_URL, ProfileField.ID,
		    ProfileField.DISTANCE, ProfileField.CURRENT_SHARE,
		    ProfileField.CURRENT_STATUS,
		    ProfileField.POSITIONS_COMPANY,
		    ProfileField.THREE_CURRENT_POSITIONS,
		    ProfileField.THREE_PAST_POSITIONS, ProfileField.POSITIONS,
		    ProfileField.POSITIONS_ID, ProfileField.POSITIONS_TITLE,
		    ProfileField.POSITIONS_SUMMARY,
		    ProfileField.POSITIONS_START_DATE,
		    ProfileField.POSITIONS_END_DATE,
		    ProfileField.POSITIONS_IS_CURRENT,
		    ProfileField.POSITIONS_TITLE,
		    ProfileField.POSITIONS_COMPANY_ID,
		    ProfileField.POSITIONS_COMPANY_INDUSTRY,
		    ProfileField.POSITIONS_COMPANY_TICKER,
		    ProfileField.POSITIONS_COMPANY_NAME,
		    ProfileField.POSITIONS_COMPANY_SIZE,
		    ProfileField.POSITIONS_COMPANY));

	    SocialSearchResult result = new SocialSearchResult();

	    // Get details and set it to SocialSearchResult class
	    result.id = person.getId();
	    result.name = person.getFirstName() + " " + person.getLastName();
	    result.picture = person.getPictureUrl();
	    result.url = person.getPublicProfileUrl();
	    result.summary = person.getHeadline();
	    result.location = person.getLocation().getName();
	    result.distance = person.getDistance() + "";
	    result.current_update = person.getCurrentStatus();
	    result.num_connections = String.valueOf(person.getNumConnections());

	    if (!(person.getDistance() > 1l))
		result.is_connected = true;

	    // Change http to https to avoid client side warnings by browser
	    // Change certificate from m3 to m3-s to fix ssl broken image link
	    if (result.picture != null)
		result.picture = changeImageUrl(result.picture);

	    result.searchResult = getExperience(person, linkedInId, client);

	    return result;

	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}
    }

    /**
     * Creates a client based on token and secret token and sends an add request
     * to a person in LinkedIn based on his LinkedInId.
     * 
     * @param widget
     *            {@link Widget} to retrieve token and secret of LinkedIn
     *            account of agile user
     * @param recipientId
     *            LinkedIn id of the recipient to whom add request is sent
     * @param subject
     *            Subject to be sent to recipient while sending a request
     * @param message
     *            Description to be sent while sending a request
     * @return {@link String} with the success message
     * @throws Exception
     *             If the recipientId does not exists or recipient provides
     *             restricted access to his profile
     */
    public static String sendLinkedInAddRequest(Widget widget,
	    String recipientId, String subject, String message)
	    throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    System.out.println("id " + recipientId);
	    // Fetches person details based on id since Header info present in
	    // API_STANDARD_PROFILE_REQUEST field is required to send an add
	    // request
	    Person person = client
		    .getProfileById(recipientId, EnumSet.of(ProfileField.ID,
			    ProfileField.API_STANDARD_PROFILE_REQUEST));

	    String agile = " - Sent from Agile CRM";

	    client.sendInviteToPerson(person, subject, message + agile);
	    return "Add request sent successfully";
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}
    }

    /**
     * Creates a client based on token and secret token and sends a message to a
     * person in LinkedIn based on his LinkedInId.
     * 
     * @param widget
     *            {@link Widget} to retrieve token and secret of LinkedIn
     *            account of agile user
     * @param recipientId
     *            LinkedIn id of the recipient to whom message is sent
     * @param subject
     *            Subject to be sent to recipient while sending a message
     * @param message
     *            Description to be sent while sending a message
     * @return {@link String} with the success message
     * @throws Exception
     *             If the recipientId does not exists or recipient provides
     *             restricted access to his profile
     */
    public static String sendLinkedInMessageById(Widget widget,
	    String recipientId, String subject, String message)
	    throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    ArrayList<String> list = new ArrayList<String>();
	    list.add(recipientId);

	    String agile = " - Sent from Agile CRM (www.agilecrm.com)";
	    if (message.length() < (7000 - agile.length()))
		message = message + agile;

	    // sends message to a person in LinkedIn based on list
	    client.sendMessage(list, subject, message);
	    return "Message sent successfully";
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}
    }

    /**
     * Fetches the updates of the person based on his LInkedIn id.
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
    public static List<SocialUpdateStream> getNetworkUpdates(Widget widget,
	    String linkedInId) throws SocketTimeoutException, IOException,
	    Exception
    {
	try
	{
	    final NetworkUpdatesApiClient client = factory
		    .createNetworkUpdatesApiClient(widget.getProperty("token"),
			    widget.getProperty("secret"));

	    Network network = client.getUserUpdates(linkedInId, EnumSet.of(
		    NetworkUpdateType.PROFILE_UPDATE,
		    NetworkUpdateType.CONNECTION_UPDATE,
		    NetworkUpdateType.SHARED_ITEM,
		    NetworkUpdateType.EXTENDED_PROFILE_UPDATE));

	    LinkedInApiClient client1 = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    return getListFromNetwork(network, client1);
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}

    }

    /**
     * Fetches the updates of the person based on his LInkedIn id and specific
     * number of updates which are limited to start and end point
     * 
     * @param widget
     *            {@link Widget} to retrieve token and secret of LinkedIn
     *            account of agile user
     * @param linkedInId
     *            Id of the person whose updates are required
     * @param startIndex
     * @param endIndex
     * @return {@link List} of {@link SocialUpdateStream}
     * @throws Exception
     *             If the personId does not exists or person provides restricted
     *             access to his profile
     */
    public static List<SocialUpdateStream> getNetworkUpdates(Widget widget,
	    String linkedInId, int startIndex, int endIndex)
	    throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    final NetworkUpdatesApiClient client = factory
		    .createNetworkUpdatesApiClient(widget.getProperty("token"),
			    widget.getProperty("secret"));

	    Network network = null;

	    network = client.getUserUpdates(linkedInId, EnumSet.of(
		    NetworkUpdateType.PROFILE_UPDATE,
		    NetworkUpdateType.CONNECTION_UPDATE,
		    NetworkUpdateType.SHARED_ITEM,
		    NetworkUpdateType.EXTENDED_PROFILE_UPDATE), startIndex,
		    endIndex);

	    LinkedInApiClient client1 = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    return getListFromNetwork(network, client1);
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}

    }

    /**
     * Fetches the updates of the person based on his LInkedIn id and specific
     * number of updates which are limited to start and end point and from
     * specific start date to end date
     * 
     * @param widget
     *            {@link Widget} to retrieve token and secret of LinkedIn
     *            account of agile user
     * @param linkedInId
     *            Id of the person whose updates are required
     * @param startIndex
     * @param endIndex
     * @param startDate
     * @param endDate
     * @return {@link List} of {@link SocialUpdateStream}
     * @throws Exception
     *             If the personId does not exists or person provides restricted
     *             access to his profile
     */
    public static List<SocialUpdateStream> getNetworkUpdates(Widget widget,
	    String linkedInId, int startIndex, int endIndex, String startDate,
	    String endDate) throws SocketTimeoutException, IOException,
	    Exception
    {
	try
	{
	    final NetworkUpdatesApiClient client = factory
		    .createNetworkUpdatesApiClient(widget.getProperty("token"),
			    widget.getProperty("secret"));

	    Calendar cal = Calendar.getInstance();

	    cal.setTimeInMillis(Long.parseLong(startDate) * 1000);
	    Date startDat = cal.getTime();

	    cal.setTimeInMillis(Long.parseLong(endDate) * 1000);
	    Date endDat = cal.getTime();

	    Network network = client.getUserUpdates(linkedInId, EnumSet.of(
		    NetworkUpdateType.PROFILE_UPDATE,
		    NetworkUpdateType.CONNECTION_UPDATE,
		    NetworkUpdateType.SHARED_ITEM,
		    NetworkUpdateType.EXTENDED_PROFILE_UPDATE), startIndex,
		    endIndex, startDat, endDat);

	    LinkedInApiClient client1 = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    return getListFromNetwork(network, client1);
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}

    }

    /**
     * Connects to linkedIn basedon widget prefs and reshares a post in LinkedIn
     * based on the given share id of the post.
     * 
     * @param widget
     *            {@link Widget} to retrieve token and secret of LinkedIn
     *            account of agile user
     * @param shareId
     *            Id of the post in LinkedIn
     * @param text
     *            Comment message while resharing the post
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String reshareLinkedInPost(Widget widget, String shareId,
	    String text) throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    final NetworkUpdatesApiClient client = factory
		    .createNetworkUpdatesApiClient(widget.getProperty("token"),
			    widget.getProperty("secret"));

	    text = "";
	    client.reShare(shareId, text, VisibilityType.ANYONE);

	    return "Shared Successfully";
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}
    }

    public static String getIdByUrl(Widget widget, String webUrl)
	    throws Exception
    {

	try
	{
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    // Creates a client specifying the fields to be returned
	    Person person = client.getProfileByUrl(webUrl, ProfileType.PUBLIC,
		    EnumSet.of(ProfileField.ID));

	    System.out.println(person.getId());
	    return person.getId();
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
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
    private static List<SocialUpdateStream> getListFromNetwork(Network network,
	    LinkedInApiClient client1) throws SocketTimeoutException,
	    IOException, Exception
    {
	List<SocialUpdateStream> list = new ArrayList<SocialUpdateStream>();

	for (Update update : network.getUpdates().getUpdateList())
	{
	    SocialUpdateStream stream = new SocialUpdateStream();
	    JSONObject json = null;

	    if (update.getUpdateContent().getPerson().getCurrentShare() != null)
	    {
		stream.id = update.getUpdateContent().getPerson()
			.getCurrentShare().getId();
		stream.type = update.getUpdateType().name();
		stream.created_time = update.getTimestamp() / 1000;
		json = new JSONObject().put(
			"comment",
			update.getUpdateContent().getPerson().getCurrentShare()
				.getComment()).put(
			"current-share",
			Util.toJSONString(update.getUpdateContent().getPerson()
				.getCurrentShare()));
		stream.message = json.toString();
		list.add(stream);
	    }
	    else if (update.getUpdateContent().getPerson().getConnections() != null)
	    {

		for (Person person : update.getUpdateContent().getPerson()
			.getConnections().getPersonList())
		{

		    stream.id = person.getId();
		    stream.type = update.getUpdateType().name();
		    stream.created_time = update.getTimestamp() / 1000;

		    try
		    {
			Person p = client1
				.getProfileById(stream.id, EnumSet.of(
					ProfileField.PUBLIC_PROFILE_URL,
					ProfileField.LAST_NAME,
					ProfileField.FIRST_NAME,
					ProfileField.PICTURE_URL,
					ProfileField.HEADLINE,
					ProfileField.LOCATION_NAME,
					ProfileField.NUM_CONNECTIONS,
					ProfileField.ID, ProfileField.DISTANCE));

			// Changes http to https to avoid client side warnings
			// by browser, Changes certificate from m3 to m3-s to
			// fix ssl broken image link
			p.setPictureUrl(changeImageUrl(p.getPictureUrl()));

			json = new JSONObject(p);
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
     * Retrieves connections profiles of the contacts LinkedIn profile
     * 
     * This method will not work as of now as LinkedIn does not give other
     * person connections
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
    public static List<SocialSearchResult> getConnections(Widget widget,
	    String linkedInId) throws SocketTimeoutException, IOException,
	    Exception
    {
	try
	{
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    Connections connections = client.getConnectionsById(linkedInId,
		    EnumSet.of(ProfileField.PUBLIC_PROFILE_URL,
			    ProfileField.LAST_NAME, ProfileField.FIRST_NAME,
			    ProfileField.PICTURE_URL, ProfileField.HEADLINE,
			    ProfileField.LOCATION_NAME,
			    ProfileField.NUM_CONNECTIONS, ProfileField.ID,
			    ProfileField.DISTANCE));

	    List<SocialSearchResult> persons = new ArrayList<SocialSearchResult>();

	    for (Person person : connections.getPersonList())
	    {
		SocialSearchResult result = new SocialSearchResult();

		if (person.getId().equalsIgnoreCase("private"))
		    continue;

		if (person.getFirstName().equalsIgnoreCase("private")
			|| person.getLastName().equalsIgnoreCase("private"))
		    continue;

		result.id = person.getId();
		result.name = person.getFirstName() + " "
			+ person.getLastName();
		result.picture = person.getPictureUrl();
		result.url = person.getPublicProfileUrl();
		result.summary = person.getHeadline();
		result.distance = person.getDistance() + "";

		if (person.getDistance() != null && person.getDistance() == 1)
		    result.is_connected = true;

		// Changes http to https to avoid client side warnings by
		// browser,
		// Changes certificate from m3 to m3-s to fix ssl broken image
		// link
		if (result.picture != null)
		    result.picture = changeImageUrl(result.picture);

		// Sets number of connects if provided
		result.num_connections = (person.getNumConnections() != null) ? person
			.getNumConnections().toString() : "";

		result.location = (person.getLocation() != null) ? person
			.getLocation().getName() : "";

		result.distance = (person.getDistance() != null) ? person
			.getDistance().toString() : "";

		// Add result wrapper object to the list
		persons.add(result);
	    }

	    return persons;
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}
    }

    public static SocialSearchResult getExperience(Widget widget,
	    String linkedInId) throws SocketTimeoutException, IOException,
	    Exception
    {
	try
	{
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    Person person = client.getProfileById(linkedInId, EnumSet.of(
		    ProfileField.POSITIONS_COMPANY,
		    ProfileField.THREE_CURRENT_POSITIONS,
		    ProfileField.THREE_PAST_POSITIONS,
		    ProfileField.POSITIONS_COMPANY_INDUSTRY,
		    ProfileField.POSITIONS_COMPANY_TICKER));

	    SocialSearchResult experience = new SocialSearchResult();
	    experience.id = linkedInId;

	    if (person.getPositions() == null
		    && person.getPositions().getPositionList() == null)
		return experience;

	    experience = getExperienceInLinkedIn(person, experience, client);

	    return experience;
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}

    }

    public static SocialSearchResult getExperience(Person person,
	    String linkedInId, LinkedInApiClient client)
	    throws SocketTimeoutException, IOException, Exception
    {

	try
	{
	    SocialSearchResult experience = new SocialSearchResult();
	    experience.id = linkedInId;

	    if (person.getPositions() == null
		    && person.getPositions().getPositionList() == null)
		return experience;

	    experience = getExperienceInLinkedIn(person, experience, client);

	    return experience;
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}

    }

    private static SocialSearchResult getExperienceInLinkedIn(Person person,
	    SocialSearchResult experience, LinkedInApiClient client)
	    throws Exception
    {

	for (Position position : person.getPositions().getPositionList())
	{
	    if (position.getCompany().getId() != null)
	    {
		try
		{
		    Company company = client.getCompanyById(position
			    .getCompany().getId(), EnumSet.of(
			    CompanyField.LOCATIONS_ADDRESS,
			    CompanyField.LOGO_URL, CompanyField.NAME,
			    CompanyField.NUM_FOLLOWERS,
			    CompanyField.BLOG_RSS_URL,
			    CompanyField.DESCRIPTION, CompanyField.ID,
			    CompanyField.INDUSTRY, CompanyField.TICKER));

		    if (company.getLogoUrl() != null)
			company.setLogoUrl(changeImageUrl(company.getLogoUrl()));
		    position.setCompany(company);
		}
		catch (LinkedInApiClientException e)
		{
		    System.out.println(e.getMessage());
		    e.printStackTrace();
		    // If company's id is some irrelevant and not related to
		    // company, company details are skipped
		    if (e.getMessage().contains("Company with ID {"))
			continue;
		    else
			throw new Exception(e.getMessage());
		}
	    }

	}

	experience.three_current_positions = person.getPositions()
		.getPositionList();

	return experience;

    }

    public static List<SocialSearchResult> getSharedConnections(Widget widget,
	    String linkedInId) throws SocketTimeoutException, IOException,
	    Exception
    {
	try
	{
	    final LinkedInApiClient client = factory.createLinkedInApiClient(
		    widget.getProperty("token"), widget.getProperty("secret"));

	    Person profile = client
		    .getProfileById(
			    linkedInId,
			    EnumSet.of(
				    ProfileField.DISTANCE,
				    ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS,
				    ProfileField.RELATION_TO_VIEWER,
				    ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_HEADLINE,
				    ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_PUBLIC_PROFILE_URL,
				    ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_LAST_NAME,
				    ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_FIRST_NAME,
				    ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_PICTURE_URL,
				    ProfileField.RELATION_TO_VIEWER_CONNECTIONS));

	    List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

	    if (profile.getRelationToViewer().getRelatedConnections() == null)
		return searchResults;

	    List<Person> persons = profile.getRelationToViewer()
		    .getRelatedConnections().getPersonList();

	    for (Person person : persons)
	    {
		SocialSearchResult result = new SocialSearchResult();

		if (person.getId() != "")
		    result.id = person.getId();

		if (person.getFirstName().equalsIgnoreCase("private")
			|| person.getLastName().equalsIgnoreCase("private"))
		    continue;

		result.name = person.getFirstName() + " "
			+ person.getLastName();
		result.picture = person.getPictureUrl();
		result.url = person.getPublicProfileUrl();
		result.summary = person.getHeadline();
		result.distance = String.valueOf(person.getDistance());

		if (person.getDistance() != null && person.getDistance() == 1)
		    result.is_connected = true;

		// Changes http to https to avoid client side warnings by
		// browser,
		// Changes certificate from m3 to m3-s to fix ssl broken image
		// link
		if (result.picture != null)
		    result.picture = changeImageUrl(result.picture);

		// Sets number of connects if provided
		result.num_connections = (person.getNumConnections() != null) ? person
			.getNumConnections().toString() : "";

		result.location = (person.getLocation() != null) ? person
			.getLocation().getName() : "";

		result.distance = (person.getDistance() != null) ? person
			.getDistance().toString() : "";

		// Add result wrapper object to the list
		searchResults.add(result);
	    }

	    return searchResults;
	}
	catch (Exception e)
	{
	    throw handleExceptionInLinkedIn(e);
	}
    }

    public static String changeImageUrl(String url)
    {
	if (!StringUtils.isBlank(url) && url.contains("licdn.com"))
	    url = url.replace(url.substring(0, url.indexOf(".com") + 4),
		    LINKEDINURLFORMAT);

	System.out.println(url);
	return url;
    }

    private static Exception handleExceptionInLinkedIn(Exception e)
    {
	Exception innerException = null;

	if (e.getMessage().contains(":"))
	    try
	    {
		innerException = (Exception) Class.forName(
			e.getMessage()
				.substring(0, e.getMessage().indexOf(":")))
			.newInstance();
	    }
	    catch (Exception e2)
	    {
		return e;
	    }

	if (innerException == null)
	    return e;
	return innerException;
    }

}
