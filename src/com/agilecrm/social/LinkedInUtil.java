package com.agilecrm.social;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Date;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.util.JSONUtil;
import com.agilecrm.util.StringUtils2;
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
	private static final LinkedInApiClientFactory factory = LinkedInApiClientFactory.newInstance(
			Globals.LINKED_IN_API_KEY, Globals.LINKED_IN_SECRET_KEY);

	/**
	 * Basic LinkedIn URL for LinkedIn images.
	 * 
	 * As LinkedIn keeping on changing LinkedIn image URLs, we change the image
	 * URLs into this format
	 */
	private static final String LINKEDINIMAGEURLFORMAT = "https://m3-s.licdn.com";

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
			List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

			/*
			 * Retrieves first name and last name of the contact to search
			 * profiles
			 */
			String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
			String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

			// If first name of last name is null or empty return null
			if (StringUtils.isBlank(firstName) && StringUtils.isBlank(lastName))
				return searchResults;

			/*
			 * Creates map to fetch results based on searchParameters using
			 * SearchParameter provided by LinkedIn
			 */
			Map<SearchParameter, String> searchParameters = new EnumMap<SearchParameter, String>(SearchParameter.class);

			// Creates client using token and secret to connect with LinkedIn
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			firstName = (firstName != null) ? firstName : "";
			lastName = (lastName != null) ? lastName : "";

			// Sets name as filter to search profiles
			searchParameters.put(SearchParameter.KEYWORDS, firstName + " " + lastName);

			/*
			 * Search profiles based on the searchParameters given, and returns
			 * list of search results
			 */
			searchResults = searchPeopleInLinkedIn(client, searchParameters);

			System.out.println("In LinkedIn search : " + searchResults);
			System.out.println("No. of results : " + searchResults.size());

			return searchResults;
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw handleExceptionInLinkedIn(e);
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
			/*
			 * Creates map to fetch results based on searchParameters using
			 * SearchParameter provided by LinkedIn
			 */
			Map<SearchParameter, String> searchParameters = new EnumMap<SearchParameter, String>(SearchParameter.class);

			// check if keywords exists
			if (!StringUtils.isBlank(keywords))
				searchParameters.put(SearchParameter.KEYWORDS, keywords);

			List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

			if (searchParameters.size() == 0)
				return searchResults;

			// Creates client using token and secret to connect with LinkedIn
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			// searches for LinkedIn profiles based on search parameters
			searchResults = searchPeopleInLinkedIn(client, searchParameters);

			return searchResults;
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
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
	private static List<SocialSearchResult> searchPeopleInLinkedIn(LinkedInApiClient client,
			Map<SearchParameter, String> searchParameters) throws SocketTimeoutException, IOException, Exception
	{

		// search people
		People people = client.searchPeople(searchParameters, EnumSet.of(ProfileField.PICTURE_URL,
				ProfileField.FIRST_NAME, ProfileField.LAST_NAME, ProfileField.SUMMARY, ProfileField.HEADLINE,
				ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.PUBLIC_PROFILE_URL,
				ProfileField.ID, ProfileField.DISTANCE), 0, 20);

		// wraps persons details into List of SocialSearchResult
		return fillPersonsDeatilsInList(people.getPersonList());

	}

	/**
	 * Iterates through given {@link List} of persons and fills each
	 * {@link Person} details in {@link SocialSearchResult} and forms a
	 * {@link List}
	 * 
	 * @param persons
	 * @return
	 */
	private static List<SocialSearchResult> fillPersonsDeatilsInList(List<Person> persons)
	{
		List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

		/*
		 * Iterates through results fetched and wraps the details into
		 * SocialSearchResult wrapper class and adds it to list
		 */
		for (Person person : persons)
		{
			SocialSearchResult result = new SocialSearchResult();

			/*
			 * Id or name is private for the people who doesn't share their
			 * information to third party applications, we skip those profiles
			 */
			if (person.getId() != null && person.getId().equalsIgnoreCase("private"))
				continue;

			if (person.getFirstName().equalsIgnoreCase("private") || person.getLastName().equalsIgnoreCase("private"))
				continue;

			result.id = person.getId();
			result.name = person.getFirstName() + " " + person.getLastName();
			result.picture = person.getPictureUrl();
			result.url = person.getPublicProfileUrl();
			result.summary = person.getHeadline();
			result.distance = (person.getDistance() != null) ? person.getDistance().toString() : "";

			// If degree of connection is 1, both profiles are connected
			if (result.distance != "" && Integer.parseInt(result.distance) == 1)
				result.is_connected = true;

			System.out.println("pic url : " + person.getPictureUrl());
			/*
			 * Changes http to https to avoid client side warnings by browser,
			 * Changes certificate from m3 to m3-s to fix SSL broken image link
			 */
			if (result.picture != null)
				result.picture = changeImageUrl(result.picture);

			/*
			 * Set number of connections, location and distance(degree of
			 * connection) if provided
			 */
			result.num_connections = (person.getNumConnections() != null) ? person.getNumConnections().toString() : "";

			result.location = (person.getLocation() != null) ? person.getLocation().getName() : "";

			// Add wrapper filled with details to the list
			searchResults.add(result);

		}
		return searchResults;

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
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
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

			SocialSearchResult result = new SocialSearchResult();

			// Get details and wrap into SocialSearchResult class
			result.id = person.getId();
			result.name = person.getFirstName() + " " + person.getLastName();
			result.picture = person.getPictureUrl();
			result.url = person.getPublicProfileUrl();
			result.summary = person.getHeadline();
			result.location = person.getLocation().getName();
			result.distance = person.getDistance() + "";
			result.current_update = person.getCurrentStatus();
			result.num_connections = String.valueOf(person.getNumConnections());

			/*
			 * Distance is 1 for direct connections and 0 for their own profile
			 */
			if (!(person.getDistance() > 1l))
				result.is_connected = true;

			/*
			 * Change http to https to avoid client side warnings by browser
			 * Change certificate from m3 to m3-s to fix SSL broken image link
			 */
			if (result.picture != null)
				result.picture = changeImageUrl(result.picture);

			// Retrieves work positions of the person
			result.searchResult = fetchExperienceOfPerson(person, linkedInId, client);

			return result;

		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw handleExceptionInLinkedIn(e);
		}
	}

	/**
	 * Retrieves work positions of a given person in LinkedIn based on tokens in
	 * widget and LinkedIn Id and wraps the result into
	 * {@link SocialSearchResult}
	 * 
	 * @param widget
	 *            {@link Widget}, for accessing token and secret key
	 * @param linkedInId
	 *            {@link String} LinkedIn Id of the person whose work positions
	 *            are required
	 * @return {@link SocialSearchResult}
	 * @throws SocketTimeoutException
	 * @throws IOException
	 * @throws Exception
	 */
	public static SocialSearchResult getExperience(Widget widget, String linkedInId) throws SocketTimeoutException,
			IOException, Exception
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			// Retrieve person details from client based on LinkedIn Id
			Person person = client.getProfileById(linkedInId, EnumSet.of(ProfileField.POSITIONS,
					ProfileField.POSITIONS_ID, ProfileField.POSITIONS_TITLE, ProfileField.POSITIONS_SUMMARY,
					ProfileField.POSITIONS_START_DATE, ProfileField.POSITIONS_END_DATE,
					ProfileField.POSITIONS_IS_CURRENT, ProfileField.POSITIONS_TITLE, ProfileField.POSITIONS_COMPANY_ID,
					ProfileField.POSITIONS_COMPANY_INDUSTRY, ProfileField.POSITIONS_COMPANY_TICKER,
					ProfileField.POSITIONS_COMPANY_NAME, ProfileField.POSITIONS_COMPANY_SIZE,
					ProfileField.POSITIONS_COMPANY, ProfileField.THREE_CURRENT_POSITIONS,
					ProfileField.THREE_PAST_POSITIONS, ProfileField.POSITIONS_COMPANY_INDUSTRY,
					ProfileField.POSITIONS_COMPANY_TICKER));

			// retrieve company details of positions and return
			return fetchExperienceOfPerson(person, linkedInId, client);
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw handleExceptionInLinkedIn(e);
		}

	}

	/**
	 * Retrieves work positions of a given person in LinkedIn and wraps the
	 * result into {@link SocialSearchResult}
	 * 
	 * @param person
	 *            {@link Person}
	 * @param linkedInId
	 *            {@link String} LinkedIn Id of the person whose experience is
	 *            required
	 * @param client
	 *            {@link LinkedInApiClient}
	 * @return {@link SocialSearchResult} with work details
	 * @throws SocketTimeoutException
	 * @throws IOException
	 * @throws Exception
	 */
	private static SocialSearchResult fetchExperienceOfPerson(Person person, String linkedInId, LinkedInApiClient client)
			throws SocketTimeoutException, IOException, Exception
	{
		SocialSearchResult experience = new SocialSearchResult();
		experience.id = linkedInId;

		// If no work positions, return empty result
		if (person.getPositions() == null && person.getPositions().getPositionList() == null)
			return experience;

		// For each position, fill company details
		fillPositionsWithCompanyDetails(person, client);

		// set positions in a wrapper
		experience.three_current_positions = person.getPositions().getPositionList();

		return experience;
	}

	/**
	 * Retrieves company details for each position and fills each position with
	 * company details
	 * 
	 * @param person
	 *            {@link Person}
	 * @param client
	 *            {@link LinkedInApiClient}
	 * @throws Exception
	 */
	private static void fillPositionsWithCompanyDetails(Person person, LinkedInApiClient client) throws Exception
	{

		// Iterate each position and fill company details
		for (Position position : person.getPositions().getPositionList())
		{
			// If company details available
			if (position.getCompany().getId() != null)
			{
				try
				{
					// fetch company details based on its id
					position.setCompany(fetchCompanyDetails(position.getCompany().getId(), client));
				}
				catch (LinkedInApiClientException e)
				{
					System.out.println("In fill positions exception " + e.getMessage());

					/*
					 * If company's id is some irrelevant and not related to
					 * company, company details are skipped
					 */
					if (e.getMessage().contains("Company with ID {"))
						continue;
					else
						throw new Exception(e.getMessage());
				}
			}

		}

	}

	/**
	 * Retrieves company details of a work position based on position id
	 * 
	 * @param person
	 *            {@link Person}
	 * @param client
	 *            {@link LinkedInApiClient}
	 * @return {@link Company}
	 * @throws Exception
	 */
	private static Company fetchCompanyDetails(String positionId, LinkedInApiClient client) throws Exception
	{

		Company company = client.getCompanyById(positionId, EnumSet.of(CompanyField.LOCATIONS_ADDRESS,
				CompanyField.LOGO_URL, CompanyField.NAME, CompanyField.NUM_FOLLOWERS, CompanyField.BLOG_RSS_URL,
				CompanyField.DESCRIPTION, CompanyField.ID, CompanyField.INDUSTRY, CompanyField.TICKER));

		if (company.getLogoUrl() != null)
			company.setLogoUrl(changeImageUrl(company.getLogoUrl()));

		return company;

	}

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
			System.out.println("Start index: " + startIndex);
			System.out.println("End index: " + endIndex);
			System.out.println("Start Date: " + startDate);
			System.out.println("End Date: " + endDate);

			// Create network updates client, to fetch user network updates
			final NetworkUpdatesApiClient client = factory.createNetworkUpdatesApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			// Retrieves filtered network updates based on parameters
			Network network = getSpecificNetwork(client, linkedInId, startIndex, endIndex, startDate, endDate);

			/*
			 * LinkedInApiClient is required to retrieve person details in the
			 * network connection updates
			 */
			LinkedInApiClient client1 = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			// Forms a list from retrieved updates and returned
			return getListFromNetworkUpdates(network, client1);
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw handleExceptionInLinkedIn(e);
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
	private static Network getSpecificNetwork(NetworkUpdatesApiClient client, String linkedInId, int startIndex,
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
			}
			else
			{
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
	private static List<SocialUpdateStream> getListFromNetworkUpdates(Network network, LinkedInApiClient client1)
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
						Person person1 = client1.getProfileById(stream.id, EnumSet.of(ProfileField.PUBLIC_PROFILE_URL,
								ProfileField.LAST_NAME, ProfileField.FIRST_NAME, ProfileField.PICTURE_URL,
								ProfileField.HEADLINE, ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS,
								ProfileField.ID, ProfileField.DISTANCE));

						System.out.println("pic url : " + person1.getPictureUrl());
						/*
						 * Changes http to https to avoid client side warnings
						 * by browser, Changes certificate from m3 to m3-s to
						 * fix SSL broken image link
						 */
						person1.setPictureUrl(changeImageUrl(person1.getPictureUrl()));

						json = new JSONObject(person1);
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
	 * Creates a client based on token and secret token and sends connect
	 * request to a person in LinkedIn based on his LinkedInId.
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
	public static String connectInLinkedIn(Widget widget, String recipientId, String subject, String message)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			System.out.println("In connect LinkedInId : " + recipientId);

			/*
			 * Fetches person details based on id since Header info present in
			 * API_STANDARD_PROFILE_REQUEST field is required to connect with
			 * another profile
			 */
			Person person = client.getProfileById(recipientId,
					EnumSet.of(ProfileField.ID, ProfileField.API_STANDARD_PROFILE_REQUEST));

			/*
			 * Message is added while sending connect request to specify request
			 * is sent from Agile
			 */
			String agile = " - Sent from Agile CRM";

			// send request to connect from client
			client.sendInviteToPerson(person, subject, message + agile);
			return "Add request sent successfully";
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
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
	public static String sendLinkedInMessageById(Widget widget, String recipientId, String subject, String message)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a client with token and secret retrieved from widget
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			ArrayList<String> list = new ArrayList<String>();
			list.add(recipientId);

			System.out.println("In message LinkedInId : " + recipientId);

			/*
			 * Message is added while sending message to specify it is sent from
			 * Agile
			 */
			String agile = " - Sent from Agile CRM (www.agilecrm.com)";

			/*
			 * check if message length exceeds 7000, if so agile message is
			 * skipped
			 */
			if (message.length() < (7000 - agile.length()))
				message = message + agile;

			// sends message to a person in LinkedIn based on LinkedInId in list
			client.sendMessage(list, subject, message);
			return "Message sent successfully";
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw handleExceptionInLinkedIn(e);
		}
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
			final NetworkUpdatesApiClient client = factory.createNetworkUpdatesApiClient(widget.getProperty("token"),
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
			throw handleExceptionInLinkedIn(e);
		}
	}

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
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			// Get profile of person fetching his shared connections details
			Person profile = client.getProfileById(linkedInId, EnumSet.of(ProfileField.DISTANCE,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS, ProfileField.RELATION_TO_VIEWER,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_HEADLINE,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_PUBLIC_PROFILE_URL,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_LAST_NAME,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_FIRST_NAME,
					ProfileField.RELATION_TO_VIEWER_RELATED_CONNECTIONS_PICTURE_URL,
					ProfileField.RELATION_TO_VIEWER_CONNECTIONS));

			// If no connections found return empty list
			if (profile.getRelationToViewer().getRelatedConnections() == null)
				return new ArrayList<SocialSearchResult>();

			// fill each shared connection details in list
			return fillPersonsDeatilsInList(profile.getRelationToViewer().getRelatedConnections().getPersonList());
		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw handleExceptionInLinkedIn(e);
		}
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
		if (!StringUtils.isBlank(url) && url.contains("licdn.com"))
			url = url.replace(url.substring(0, url.indexOf(".com") + 4), LINKEDINIMAGEURLFORMAT);

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
	private static Exception handleExceptionInLinkedIn(Exception exception)
	{
		System.out.println("Exception message: " + exception.getMessage());
		Exception innerException = null;

		if (exception.getMessage().contains("The token used in the OAuth request is not valid"))
			return new Exception("Access granted to your linkedin account has expired.");

		/*
		 * We extract the inner exception from LinkedIn exception, since it is
		 * returned as string and make the exception out of string and throw
		 * proper exception like (TimeoutException, IOException..)
		 */
		if (exception.getMessage().contains(":"))
			try
			{
				innerException = (Exception) Class.forName(
						exception.getMessage().substring(0, exception.getMessage().indexOf(":"))).newInstance();
			}
			catch (Exception e2)
			{
				return exception;
			}

		/*
		 * If inner exception, is not an exception and a proper message from
		 * LinkedIn , we throw it as it is
		 */
		if (innerException == null)
			return exception;
		return innerException;
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
			final LinkedInApiClient client = factory.createLinkedInApiClient(widget.getProperty("token"),
					widget.getProperty("secret"));

			// Get profile of person fetching his direct connections details
			Connections connections = client.getConnectionsById(linkedInId, EnumSet.of(ProfileField.PUBLIC_PROFILE_URL,
					ProfileField.LAST_NAME, ProfileField.FIRST_NAME, ProfileField.PICTURE_URL, ProfileField.HEADLINE,
					ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.ID, ProfileField.DISTANCE));

			// fill each shared connection details in list
			return fillPersonsDeatilsInList(connections.getPersonList());

		}
		catch (Exception e)
		{
			// Handles exception thrown by LinkedIn and throws proper exceptions
			throw handleExceptionInLinkedIn(e);
		}
	}

}
