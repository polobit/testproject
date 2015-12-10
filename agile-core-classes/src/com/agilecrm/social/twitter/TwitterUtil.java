package com.agilecrm.social.twitter;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;

import twitter4j.ResponseList;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.TwitterRuntimeException;
import twitter4j.User;
import twitter4j.auth.AccessToken;

import com.agilecrm.Globals;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.social.linkedin.LinkedInUtil;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.widgets.Widget;

/**
 * <code>TwitterUtil</code> class creates a client which connects to Twitter
 * based on the token and token secret, It includes methods to fetch current
 * user profile, search profiles based on first name and lastname, profile based
 * on twitter id(unique id provided by LinkedIn for each user).
 * <p>
 * This class is called from {@link WidgetsAPI} to search profiles from Twitter
 * or to get Profile based on Twitter id
 * </p>
 * 
 */
public class TwitterUtil
{

	/**
	 * Agile Twitter profile signature
	 * <p>
	 * We include it, while sending a message or tweet in Twitter from Agile
	 * </p>
	 */
	public static final String AGILE_TWITTER_SOURCE_MESSAGE = "-via @agilecrm";

	/**
	 * Creates a twitter instance and sets the consumer tokens (developer
	 * keys)and access tokens (retrieved from widget) on it.
	 * 
	 * @param widget
	 *            {@link Widget} to get access tokens
	 * @return {@link Twitter} after setting authorization required to connect
	 *         with the Twitter server.
	 * @throws Exception
	 */
	public static Twitter getTwitter(Widget widget) throws Exception
	{
		try
		{
			// Creates a twitter factory to connect with twitter
			Twitter twitter = new TwitterFactory().getInstance();

			// Sets authentication, sets developers api key and secret key
			twitter.setOAuthConsumer(Globals.TWITTER_API_KEY, Globals.TWITTER_SECRET_KEY);

			// Sets AccessToken, sets twitter api key and secret key
			twitter.setOAuthAccessToken(new AccessToken(widget.getProperty("token"), widget.getProperty("secret")));

			return twitter;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In get twitter exception");
			throw getErrorMessage(e);
		}
	}

	/**
	 * Retrieves the twitter profile of the contact based on URL provided for
	 * twitter.
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param webUrl
	 *            {@link String} twitter URL of the contact (complete URL not
	 *            screen name)
	 * @return {@link String} twitter id of the profile
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	public static String getTwitterIdByUrl(Widget widget, String webUrl) throws SocketTimeoutException, IOException,
			Exception
	{
		// Check if it is twitter URl
		if (!webUrl.startsWith("https://twitter.com/") && !webUrl.startsWith("http://twitter.com/")){
			return null;
		}

		// check if URL start with HTTP, if so replace with HTTPS
		if (webUrl.startsWith("http://twitter.com/")){
			webUrl = webUrl.replace("http://twitter.com/", "https://twitter.com/");
		}

		String screenName = webUrl.substring(webUrl.lastIndexOf("/") + 1);
		System.out.println("Twitter screen name from URL: " + screenName);
		try
		{
			/*
			 * Creates a twitter object to connect with twitter Fetch Twitter
			 * user profile based on twitter Id
			 */
			User user = getTwitter(widget).showUser(screenName);

			return String.valueOf(user.getId());
		}
		catch (TwitterRuntimeException e)
		{
			// If status is 404, Twitter doesn't have that profile
			if (e.getMessage().startsWith("404"))
				throw new Exception("Sorry, that page doesn't exist! @" + screenName);

			System.out.println("In get Twitter id exception");
			throw getErrorMessage(e);

		}

	}

	/**
	 * Fills each user details in a {@link SocialSearchResult} from the given
	 * users and forms a {@link List}
	 * 
	 * @param users
	 *            {@link ResponseList} of {@link User}
	 * @return
	 */
	public static List<SocialSearchResult> fillUsersDetailsInList(ResponseList<User> users)
	{
		List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

		/*
		 * Iterates through Twitter users and wraps the profile details in
		 * SocialSearchResult and adds to list
		 */
		for (User user : users){
			// Wraps into SocialSearchResult and adds each result in to list
			searchResults.add(wrapUserDetailsInSearchResult(user));
		}

		return searchResults;
	}

	/**
	 * Fills user details in a {@link SocialSearchResult} from {@link User}
	 * object
	 * 
	 * @param user
	 *            {@link User}
	 * @return {@link SocialSearchResult}
	 */
	private static SocialSearchResult wrapUserDetailsInSearchResult(User user)
	{
		SocialSearchResult result = new SocialSearchResult();
		result.id = user.getId() + "";
		result.name = user.getName();
		result.picture = user.getBiggerProfileImageURLHttps().toString();
		result.location = user.getLocation();
		result.summary = user.getDescription();
		result.screen_name = user.getScreenName();
		result.url = "https://twitter.com/" + user.getScreenName();
		result.num_connections = user.getFollowersCount() + "";
		result.tweet_count = user.getStatusesCount() + "";
		result.friends_count = user.getFriendsCount() + "";
		return result;
	}

	/**
	 * Retrieves profile for each Twitter Id given in {@link List} of IDs and
	 * wraps result into a {@link List} of {@link SocialSearchResult}
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param arrayOfIds
	 *            {@link List} of {@link Long} twitter IDs
	 * @return {@link List} of {@link SocialSearchResult}
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	public static List<SocialSearchResult> getListOfProfiles(Widget widget, JSONArray arrayOfIds)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a twitter object from widget preferences
			Twitter twitter = getTwitter(widget);
			List<SocialSearchResult> profilesList = new ArrayList<SocialSearchResult>();

			/*
			 * Iterate through the array, retrieve user information for every
			 * Id, wrap each user details into SocialSearchResult object and add
			 * it to list
			 */
			for (int i = 0; i < arrayOfIds.length(); i++){
				try
				{
					User user = twitter.showUser(Long.parseLong(arrayOfIds.getString(i)));

					// Wraps in object and adds each result in to list
					profilesList.add(wrapUserDetailsInSearchResult(user));
				}
				catch (TwitterRuntimeException e)
				{
					/*
					 * If user doesn't share information, we get a null pointer
					 * exception and we skip his profile
					 */
					continue;
				}
			}
			return profilesList;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In list of profiles twitter exception");
			throw getErrorMessage(e);
		}
	}

	/**
	 * Twitter exceptions are made proper and thrown by this method
	 * 
	 * @param error
	 *            {@link String} error message
	 * @return {@link String} proper error message
	 */
	public static Exception getErrorMessage(Exception exception)
	{

		String error = exception.getMessage();
		System.out.println("Before changing error: " + error);

		/*
		 * It returns message and code, we extract the message from it and throw
		 * it
		 */
		if (error.contains("message - ") && error.contains("code - "))
		{
			error = error.substring(error.indexOf("message - ") + 10, error.indexOf("code - "));
			System.out.println("After changing error: " + error);
			return new Exception(error);
		}

		return LinkedInUtil.extractException(exception);
	}
}