package com.agilecrm.social;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.util.Util;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.LinkedInApiClient;
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

	// Gets profile details, details are fetched based on the set that
	// specifies the properties
	Person profile = client
		.getProfileForCurrentUser(EnumSet.of(ProfileField.PICTURE_URL,
			ProfileField.FIRST_NAME, ProfileField.LAST_NAME,
			ProfileField.ID, ProfileField.DISTANCE));

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
	    Widget widget, Contact contact) throws Exception
    {
	// Creates map to fetch results based on searchParameters using
	// SearchParameter provided by LinkedIn
	Map<SearchParameter, String> searchParameters = new EnumMap<SearchParameter, String>(
		SearchParameter.class);

	// Gets first name and last name of the contact to search profiles
	String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
	String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

	// If first name of last name is null or empty return null
	if (StringUtils.isBlank(firstName) || StringUtils.isBlank(lastName))
	    return null;

	// Sets name as filter to search profiles
	searchParameters.put(SearchParameter.KEYWORDS, firstName + " "
		+ lastName);

	// Creates client using token and secret to connect with LinkedIn
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

	    if (person.getId().equalsIgnoreCase("private"))
		continue;

	    result.id = person.getId();
	    result.name = person.getFirstName() + " " + person.getLastName();
	    result.picture = person.getPictureUrl();
	    result.url = person.getPublicProfileUrl();
	    result.summary = person.getHeadline();
	    result.distance = person.getDistance() + "";

	    if (person.getDistance() != null && person.getDistance() == 1)
		result.is_connected = true;

	    // Changes http to https to avoid client side warnings by browser,
	    // Changes certificate from m3 to m3-s to fix ssl broken image link
	    if (result.picture != null)
		result.picture = result.picture.replace("http:", "https:")
			.replace("m3", "m3-s");

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
	    String linkedInId) throws Exception
    {
	final LinkedInApiClient client = factory.createLinkedInApiClient(
		widget.getProperty("token"), widget.getProperty("secret"));

	// Creates a client specifying the fields to be returned
	Person person = client.getProfileById(linkedInId, EnumSet.of(
		ProfileField.PICTURE_URL, ProfileField.FIRST_NAME,
		ProfileField.LAST_NAME, ProfileField.SUMMARY,
		ProfileField.HEADLINE, ProfileField.LOCATION_NAME,
		ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
		ProfileField.ID, ProfileField.DISTANCE,
		ProfileField.CURRENT_SHARE, ProfileField.CURRENT_STATUS));

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
	{
	    result.is_connected = true;
	    try
	    {
		result.updateStream = getNetworkUpdates(widget, linkedInId, 0,
			5);
	    }
	    catch (Exception e)
	    {
		result.updateStream = new ArrayList<SocialUpdateStream>();
	    }
	}

	// Change http to https to avoid client side warnings by browser
	// Change certificate from m3 to m3-s to fix ssl broken image link
	if (result.picture != null)
	    result.picture = result.picture.replace("http:", "https:").replace(
		    "m3", "m3-s");

	return result;

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
	    throws Exception
    {
	final LinkedInApiClient client = factory.createLinkedInApiClient(
		widget.getProperty("token"), widget.getProperty("secret"));

	System.out.println("id " + recipientId);
	// Fetches person details based on id since Header info present in
	// API_STANDARD_PROFILE_REQUEST field is required to send an add request
	Person person = client.getProfileById(recipientId, EnumSet.of(
		ProfileField.ID, ProfileField.API_STANDARD_PROFILE_REQUEST));

	client.sendInviteToPerson(person, subject, message);
	return "Add request sent successfully";
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
	    throws Exception
    {
	final LinkedInApiClient client = factory.createLinkedInApiClient(
		widget.getProperty("token"), widget.getProperty("secret"));

	ArrayList<String> list = new ArrayList<String>();
	list.add(recipientId);

	// sends message to a person in LinkedIn based on list
	client.sendMessage(list, subject, message);
	return "Message sent successfully";
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
	    String linkedInId) throws Exception
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
	    String linkedInId, int startIndex, int endIndex) throws Exception
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
	    String endDate) throws Exception
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
	    String text) throws Exception
    {
	final NetworkUpdatesApiClient client = factory
		.createNetworkUpdatesApiClient(widget.getProperty("token"),
			widget.getProperty("secret"));

	text = "";
	client.reShare(shareId, text, VisibilityType.ANYONE);

	return "Shared Successfully";
    }

    public static String getIdByUrl(Widget widget, String webUrl)
    {

	final LinkedInApiClient client = factory.createLinkedInApiClient(
		widget.getProperty("token"), widget.getProperty("secret"));

	// Creates a client specifying the fields to be returned
	Person person = client.getProfileByUrl(webUrl, ProfileType.PUBLIC,
		EnumSet.of(ProfileField.ID));

	System.out.println(person.getId());
	return person.getId();

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
	    LinkedInApiClient client1) throws Exception
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
			p.setPictureUrl(p.getPictureUrl()
				.replace("http:", "https:")
				.replace("m3", "m3-s"));

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
	    String linkedInId) throws Exception
    {
	final LinkedInApiClient client = factory.createLinkedInApiClient(
		widget.getProperty("token"), widget.getProperty("secret"));

	Connections connections = client.getConnectionsById(linkedInId, EnumSet
		.of(ProfileField.PUBLIC_PROFILE_URL, ProfileField.LAST_NAME,
			ProfileField.FIRST_NAME, ProfileField.PICTURE_URL,
			ProfileField.HEADLINE, ProfileField.LOCATION_NAME,
			ProfileField.NUM_CONNECTIONS, ProfileField.ID,
			ProfileField.DISTANCE));

	List<SocialSearchResult> persons = new ArrayList<SocialSearchResult>();

	for (Person person : connections.getPersonList())
	{
	    SocialSearchResult result = new SocialSearchResult();

	    if (person.getId().equalsIgnoreCase("private"))
		continue;

	    result.id = person.getId();
	    result.name = person.getFirstName() + " " + person.getLastName();
	    result.picture = person.getPictureUrl();
	    result.url = person.getPublicProfileUrl();
	    result.summary = person.getHeadline();
	    result.distance = person.getDistance() + "";

	    if (person.getDistance() != null && person.getDistance() == 1)
		result.is_connected = true;

	    // Changes http to https to avoid client side warnings by browser,
	    // Changes certificate from m3 to m3-s to fix ssl broken image link
	    if (result.picture != null)
		result.picture = result.picture.replace("http:", "https:")
			.replace("m3", "m3-s");

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

    public static SocialSearchResult getExperience(Widget widget,
	    String linkedInId)
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

	for (Position position : person.getThreeCurrentPositions()
		.getPositionList())
	{
	    if (position.getCompany().getId() != null)
	    {
		Company company = client.getCompanyById(position.getCompany()
			.getId(), EnumSet.of(CompanyField.LOCATIONS_ADDRESS,
			CompanyField.LOGO_URL, CompanyField.NAME,
			CompanyField.NUM_FOLLOWERS, CompanyField.BLOG_RSS_URL,
			CompanyField.DESCRIPTION, CompanyField.ID,
			CompanyField.INDUSTRY, CompanyField.TICKER));

		company.setLogoUrl(company.getLogoUrl()
			.replace("http:", "https:").replace("m3", "m3-s"));
		position.setCompany(company);
	    }

	}

	experience.three_current_positions = person.getThreeCurrentPositions()
		.getPositionList();

	for (Position position : person.getThreePastPositions()
		.getPositionList())
	{
	    if (position.getCompany().getId() != null)
	    {
		Company company = client.getCompanyById(position.getCompany()
			.getId(), EnumSet.of(CompanyField.LOCATIONS_ADDRESS,
			CompanyField.LOGO_URL, CompanyField.NAME,
			CompanyField.NUM_FOLLOWERS, CompanyField.BLOG_RSS_URL,
			CompanyField.DESCRIPTION, CompanyField.ID,
			CompanyField.INDUSTRY, CompanyField.TICKER));

		company.setLogoUrl(company.getLogoUrl()
			.replace("http:", "https:").replace("m3", "m3-s"));
		position.setCompany(company);

	    }

	}

	experience.three_past_positions = person.getThreePastPositions()
		.getPositionList();

	return experience;
    }

    public static void main(String[] args)
    {
	final LinkedInApiClient client = factory.createLinkedInApiClient(
	// "4c1b1828-e275-4e09-b7f9-1f85ee32c22e", // devikkah
	// "4abc6b56-a41e-4864-a759-22c36c36e460");
		"f71d216b-16b7-41d5-a593-92c928b6fa13", // revathi
		"9c9a2635-3efd-474c-8459-61251a5006e1");
	// "3382f692-f598-4b72-9dd3-891853fec2fc", // test
	// "7984afcf-f0f7-4fb3-b39c-cb7379d0336e");

	// {"token":"4c1b1828-e275-4e09-b7f9-1f85ee32c22e","secret":"4abc6b56-a41e-4864-a759-22c36c36e460"}
	// {"token":"3382f692-f598-4b72-9dd3-891853fec2fc","secret":"7984afcf-f0f7-4fb3-b39c-cb7379d0336e"}
	Person cons = client
		.getProfileById(
			"ZQglvOshW2",
			EnumSet.of(
				ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS,
				ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_HEADLINE,
				ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_PUBLIC_PROFILE_URL,
				ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_LAST_NAME,
				ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_FIRST_NAME,
				ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_PICTURE_URL,
				ProfileField.RELATION_TO_VIEWER_CONNECTIONS));

	// Company com = client.getCompanyById("1680", EnumSet.of(
	// CompanyField.LOCATIONS_ADDRESS, CompanyField.LOGO_URL,
	// CompanyField.NAME, CompanyField.NUM_FOLLOWERS,
	// CompanyField.BLOG_RSS_URL, CompanyField.DESCRIPTION,
	// CompanyField.ID, CompanyField.INDUSTRY, CompanyField.TICKER));
	//
	// com.setLogoUrl(com.getLogoUrl().replace("http:", "https:")
	// .replace("m3", "m3-s"));
	// tUqQPRTrto
	// mgSCSTsq2V

	ObjectMapper mapper = new ObjectMapper();
	String json;
	try
	{
	    // json = mapper.writeValueAsString(com);
	    // System.out.println(json);
	    // json = mapper.writeValueAsString(cons);
	    // System.out.println(json);
	    json = mapper.writeValueAsString(cons);
	    System.out.println(json);
	    // cons.getThreeCurrentPositions().getPositionList().get(0)
	    // .setCompany(com);
	    json = mapper.writeValueAsString(cons.getThreeCurrentPositions());
	    System.out.println(json);
	    // json = mapper.writeValueAsString(cons.getThreePastPositions());
	    // System.out.println(json);
	}
	catch (Exception e)
	{
	    e.getMessage();
	}
	// for (Position pos :
	// cons.getThreeCurrentPositions().getPositionList())
	// {
	//
	// System.out.println(pos.getTitle());
	//
	// System.out.println("summary" + pos.getSummary());
	// System.out.println("company" + pos.getCompany().getName());
	// System.out.println(pos.getStartDate().getMonth() + "-"
	// + pos.getStartDate().getYear());
	// System.out.println(pos.getEndDate());
	// }
	//
	// for (Position pos : cons.getThreePastPositions().getPositionList())
	// {
	//
	// System.out.println(pos.getTitle());
	// System.out.println(pos.getSummary());
	// System.out.println(pos.getCompany().getName());
	// System.out.println(pos.getStartDate().getMonth() + "-"
	// + pos.getStartDate().getYear());
	// System.out.println(pos.getEndDate().getMonth() + "-"
	// + pos.getEndDate().getYear());
	// }

    }
}
