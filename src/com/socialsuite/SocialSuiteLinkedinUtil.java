package com.socialsuite;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.util.JSONUtil;
import com.google.code.linkedinapi.client.LinkedInApiClient;
import com.google.code.linkedinapi.client.LinkedInApiClientFactory;
import com.google.code.linkedinapi.client.NetworkUpdatesApiClient;
import com.google.code.linkedinapi.client.enumeration.NetworkUpdateType;
import com.google.code.linkedinapi.client.enumeration.ProfileField;
import com.google.code.linkedinapi.schema.Network;
import com.google.code.linkedinapi.schema.Person;
import com.google.code.linkedinapi.schema.Update;
import com.google.code.linkedinapi.schema.VisibilityType;

/**
 * <code>LinkedinUtil</code> class creates a client which connects to LinkedIn
 * based on the token and token secret, It includes methods to fetch current
 * user profile, search profiles based on first name and lastname, profile based
 * on linkedIn id(unique id provided by LinkedIn for each user).
 * <p>
 * This class is called from {@link StreamAPI} to search profiles from LinkedIn
 * or to get Profile based on LinkedIn id
 * </p>
 * 
 * @author Farah
 */

public class SocialSuiteLinkedinUtil
{

	/**
	 * Creates Client factory using developer keys, which allows to connect to
	 * LinkedIn using token and key
	 */
	private static final LinkedInApiClientFactory factory = LinkedInApiClientFactory.newInstance(
			Globals.LINKED_IN_API_KEY, Globals.LINKED_IN_SECRET_KEY);

	private static final String LINKEDINURLFORMAT = "https://m3-s.licdn.com";

	/**
	 * Creates a client to connect to LinkedIn using developers API key and
	 * secret key. Fetches profile user name for the current user who connects
	 * to LinkedIn based on token and token secret provided when user creates a
	 * connect
	 * 
	 * @param token
	 *            {@link String}
	 * @param tokenSecret
	 *            {@link String}
	 * @return {@link Map}
	 */
	public static String getLinkedInUserName(String token, String tokenSecret) throws Exception
	{

		// Creates a client using factory setting sending token and token secret
		final LinkedInApiClient client = factory.createLinkedInApiClient(token, tokenSecret);

		// Gets profile details, details are fetched based on the set that
		// specifies the properties
		Person profile = client.getProfileForCurrentUser(EnumSet.of(ProfileField.FIRST_NAME, ProfileField.LAST_NAME));

		// Sets the user name
		String userName = profile.getFirstName() + " " + profile.getLastName();

		// Returns user name
		return userName;
	}

	/**
	 * Creates a client to connect to LinkedIn using developers API key and
	 * secret key. Fetches profile image for the current user who connects to
	 * LinkedIn based on token and token secret provided from stream details.
	 * 
	 * @param stream
	 *            {@link Stream}
	 * 
	 * @return userName {@link String}
	 */
	public static String getUsersProfileImgUrl(Stream stream) throws Exception
	{

		// Creates a client using factory setting sending token and token secret
		final LinkedInApiClient client = factory.createLinkedInApiClient(stream.token, stream.secret);

		// Gets profile details, details are fetched based on the set that
		// specifies the properties
		Person profile = client.getProfileForCurrentUser(EnumSet.of(ProfileField.PICTURE_URL));

		System.out.println("stream : " + stream);
		System.out.println("profile.getPictureUrl : " + profile.getPictureUrl());

		// Changes http to https to avoid client side warnings by browser,
		// Changes certificate from m3 to m3-s to fix ssl broken image link
		String imgUrl = changeImageUrl(profile.getPictureUrl());

		// Returns user name
		return imgUrl;
	}

	/**
	 * Changes http to https to avoid client side warnings by browser, Changes
	 * certificate from m3 to m3-s to fix ssl broken image link.
	 * 
	 * @param url
	 *            - String which is url of profile image.
	 * 
	 * @return url - Change url in String.
	 */
	public static String changeImageUrl(String url)
	{
		if (!StringUtils.isBlank(url) && url.contains("licdn.com"))
			url = url.replace(url.substring(0, url.indexOf(".com") + 4), LINKEDINURLFORMAT);

		System.out.println(url);
		return url;
	}

	/**
	 * Creates a client based on token and secret token and sends a message to a
	 * person in LinkedIn based on his LinkedInId.
	 * 
	 * @param stream
	 *            {@link Stream} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @param commentText
	 *            Description to be sent while sending a message
	 * @param shareWith
	 *            Visibility of share update
	 * @return {@link String} with the success message
	 * @throws Exception
	 *             If the recipientId does not exists or recipient provides
	 *             restricted access to his profile
	 */
	public static String shareLinkedInUpdate(Stream stream, String commentText, String shareWith)
			throws SocketTimeoutException, IOException, Exception
	{
		final LinkedInApiClient client = factory.createLinkedInApiClient(stream.token, stream.secret);

		boolean postToTwitter = false;
		VisibilityType visibility = VisibilityType.CONNECTIONS_ONLY;

		if (shareWith.equalsIgnoreCase("ANYONE+TWITTER"))
		{
			postToTwitter = true;
			visibility = VisibilityType.ANYONE;
		}
		else if (shareWith.equalsIgnoreCase("ANYONE"))
			visibility = VisibilityType.ANYONE;

		System.out.println("visibility : " + visibility + " postToTwitter : " + postToTwitter);
		/*
		 * share update on linkedin void postShare(String commentText,String
		 * title,String description,String url,String imageUrl,VisibilityType
		 * visibility,boolean postToTwitter)
		 */
		client.postShare(commentText, null, "www.agilecrm.com", null, visibility, postToTwitter);
		return "Message sent successfully";
	}

	/**
	 * Creates a client based on token and secret token and gets messages from a
	 * person in LinkedIn based on his LinkedInId.
	 * 
	 * @param stream
	 *            {@link Stream} to retrieve token and secret of LinkedIn
	 *            account of agile user
	 * @return List {@link SocialUpdateStream} of objects which have details of
	 *         network updates.
	 * @throws Exception
	 *             If the recipientId does not exists or recipient provides
	 *             restricted access to his profile
	 */
	public static List<com.agilecrm.social.stubs.SocialUpdateStream> getLinkedInUpdate(Stream stream)
			throws SocketTimeoutException, IOException, Exception
	{
		final NetworkUpdatesApiClient client = factory.createNetworkUpdatesApiClient(stream.token, stream.secret);

		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
		Calendar cal = Calendar.getInstance();
		Date today = cal.getTime();

		System.out.println(dateFormat.format(today));

		Network network = client.getNetworkUpdates(EnumSet.of(NetworkUpdateType.PROFILE_UPDATE,
				NetworkUpdateType.CONNECTION_UPDATE, NetworkUpdateType.SHARED_ITEM,
				NetworkUpdateType.EXTENDED_PROFILE_UPDATE));

		LinkedInApiClient client1 = factory.createLinkedInApiClient(stream.token, stream.secret);

		return getListFromNetwork(network, client1);
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
	private static List<SocialUpdateStream> getListFromNetwork(Network network, LinkedInApiClient client1)
			throws SocketTimeoutException, IOException, Exception
	{
		List<SocialUpdateStream> list = new ArrayList<SocialUpdateStream>();

		for (Update update : network.getUpdates().getUpdateList())
		{
			SocialUpdateStream stream = new SocialUpdateStream();
			JSONObject json = null;

			System.out.println(" update: " + new JSONObject(update) + " UpdateContent: "
					+ new JSONObject(update.getUpdateContent()));

			if (update.getUpdateContent().getPerson().getCurrentShare() != null)
			{
				stream.id = update.getUpdateContent().getPerson().getCurrentShare().getId();
				stream.type = update.getUpdateType().name();
				stream.created_time = update.getTimestamp() / 1000;
				json = new JSONObject().put("comment",
						update.getUpdateContent().getPerson().getCurrentShare().getComment()).put("current-share",
						JSONUtil.toJSONString(update.getUpdateContent().getPerson().getCurrentShare()));

				json.put("owner_picture", update.getUpdateContent().getPerson().getPictureUrl());
				json.put("timestamp", update.getTimestamp());

				stream.message = json.toString();
				list.add(stream);
			}
			else if (update.getUpdateContent().getPerson().getConnections() != null)
			{

				for (Person person : update.getUpdateContent().getPerson().getConnections().getPersonList())
				{

					stream.id = person.getId();
					stream.type = update.getUpdateType().name();
					stream.created_time = update.getTimestamp() / 1000;

					try
					{
						Person connectWithPerson = client1.getProfileById(stream.id, EnumSet.of(
								ProfileField.PUBLIC_PROFILE_URL, ProfileField.LAST_NAME, ProfileField.FIRST_NAME,
								ProfileField.PICTURE_URL, ProfileField.HEADLINE, ProfileField.LOCATION_NAME,
								ProfileField.NUM_CONNECTIONS, ProfileField.ID, ProfileField.DISTANCE));

						// Changes http to https to avoid client side warnings
						// by browser, Changes certificate from m3 to m3-s to
						// fix ssl broken image link
						connectWithPerson.setPictureUrl(changeImageUrl(connectWithPerson.getPictureUrl()));

						Person updateOwner = client1.getProfileById(update.getUpdateContent().getPerson().getId(),
								EnumSet.of(ProfileField.PUBLIC_PROFILE_URL, ProfileField.LAST_NAME,
										ProfileField.FIRST_NAME, ProfileField.PICTURE_URL, ProfileField.HEADLINE,
										ProfileField.LOCATION_NAME, ProfileField.NUM_CONNECTIONS, ProfileField.ID,
										ProfileField.DISTANCE));

						// Changes http to https to avoid client side warnings
						// by browser, Changes certificate from m3 to m3-s to
						// fix ssl broken image link
						updateOwner.setPictureUrl(changeImageUrl(updateOwner.getPictureUrl()));

						JSONObject json1 = new JSONObject(connectWithPerson);
						JSONObject json2 = new JSONObject(updateOwner);
						json = new JSONObject();
						json.put("connect_with_person", json1);
						json.put("update_owner", json2);
						json.put("timestamp", update.getTimestamp());
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
}
