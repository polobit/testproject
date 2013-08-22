package com.agilecrm.social;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import twitter4j.DirectMessage;
import twitter4j.HashtagEntity;
import twitter4j.IDs;
import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.TwitterRuntimeException;
import twitter4j.URLEntity;
import twitter4j.User;
import twitter4j.UserMentionEntity;
import twitter4j.auth.AccessToken;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.util.JSONUtil;
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
	public static final String AGILETWITTERSOURCEMESSAGE = " via @agile_crm";

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
	private static Twitter getTwitter(Widget widget) throws Exception
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
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Searches Twitter profiles based on first name and last name specified,
	 * result fetched are represented by class {@link SocialSearchResult}
	 * including details id, name, image_url, url etc..
	 * 
	 * <p>
	 * Token and secret required to connect are retrieved from the widget
	 * </p>
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @param contact
	 *            {@link Contact}
	 * @return {@link List} of {@link SocialSearchResult}
	 * @throws Exception
	 *             If twitter throws an exception
	 */
	public static List<SocialSearchResult> searchTwitterProfiles(Widget widget, Contact contact)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Gets first name and last name of the contact to search profiles
			String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
			String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

			// returns empty if first name and last name both are null
			if (StringUtils.isBlank(firstName) && StringUtils.isBlank(lastName))
				return new ArrayList<SocialSearchResult>();

			/*
			 * check first name and last name, if null put it as empty for
			 * search
			 */
			firstName = (firstName != null) ? firstName : "";
			lastName = (lastName != null) ? lastName : "";

			/*
			 * Creates a twitter object to connect with twitter and searches
			 * twitter profiles based on first name and last name
			 */
			ResponseList<User> users = getTwitter(widget).searchUsers(firstName + " " + lastName, 1);

			// Fill user details in list and return
			return fillUsersDetailsInList(users);
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In search twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Searches Twitter profiles based on search string, result fetched are
	 * represented by class {@link SocialSearchResult} including details id,
	 * name, image_url, url etc..
	 * 
	 * <p>
	 * Token and secret required to connect are retrieved from the widget
	 * </p>
	 * 
	 * @param widget
	 *            {@link Widget}
	 * @param searchString
	 *            {@link String} to be searched
	 * @return {@link List} of {@link SocialSearchResult}
	 * @throws Exception
	 *             If twitter throws an exception
	 */
	public static List<SocialSearchResult> modifiedSearchForTwitterProfiles(Widget widget, String searchString)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{

			// returns empty list if String to be searched is null
			if (StringUtils.isBlank(searchString))
				return new ArrayList<SocialSearchResult>();

			/*
			 * Creates a twitter object to connect with twitter Searches twitter
			 * profiles based on the search string
			 */
			ResponseList<User> users = getTwitter(widget).searchUsers(searchString, 1);

			// Fill user details in list and return
			return fillUsersDetailsInList(users);
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In modified search twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
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
	private static List<SocialSearchResult> fillUsersDetailsInList(ResponseList<User> users)
	{
		List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

		/*
		 * Iterates through Twitter users and wraps the profile details in
		 * SocialSearchResult and adds to list
		 */
		for (User user : users)
			// Wraps into SocialSearchResult and adds each result in to list
			searchResults.add(wrapUserDetailsInSearchResult(user));

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
		if (!webUrl.startsWith("https://twitter.com/") && !webUrl.startsWith("http://twitter.com/"))
			return null;

		// check if URL start with http, if so replace with https
		if (webUrl.startsWith("http://twitter.com/"))
			webUrl = webUrl.replace("http://twitter.com/", "https://twitter.com/");

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
			// If status is 404, Twitter doesnot have that profile
			if (e.getMessage().startsWith("404"))
				throw new Exception("Sorry, that page doesn't exist! @" + screenName);

			System.out.println("In get Twitter id exception");
			throw new Exception(getErrorMessage(e.getMessage()));

		}

	}

	/**
	 * Fetches Twitter profiles based on the profile id, token and secret are
	 * retrieved from the widget object and Twitter sent. Result is wrapped in
	 * to {@link SocialSearchResult} class
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String}
	 * @return {@link SocialSearchResult}
	 * @throws Exception
	 */
	public static SocialSearchResult getTwitterProfileById(Widget widget, String twitterId)
			throws SocketTimeoutException, IOException, Exception
	{
		// Creates a twitter object to connect with twitter
		Twitter twitter = getTwitter(widget);

		try
		{
			// Fetch Twitter user profile based on twitter Id
			User user = twitter.showUser(Long.parseLong(twitterId));

			SocialSearchResult result = new SocialSearchResult();

			// Map user details to SocialSearchResult
			result.id = user.getId() + "";
			result.name = user.getName();
			result.screen_name = user.getScreenName();
			result.picture = user.getBiggerProfileImageURLHttps().toString();
			result.location = user.getLocation();
			result.summary = user.getDescription();
			result.num_connections = user.getFollowersCount() + "";
			result.tweet_count = user.getStatusesCount() + "";
			result.friends_count = user.getFriendsCount() + "";

			result.url = "https://twitter.com/" + user.getScreenName();
			result.is_follow_request_sent = user.isFollowRequestSent();
			result.is_connected = twitter.showFriendship(twitter.getId(), user.getId()).isSourceFollowingTarget();
			result.is_followed_by_target = twitter.showFriendship(twitter.getId(), user.getId())
					.isSourceFollowedByTarget();

			/*
			 * If current status is not null, get network updates Assuming
			 * current id as new status, 5 recent statuses are retrieved
			 */
			if (user.getStatus() != null)
			{
				result.current_update = user.getStatus().getText();
				result.current_update_id = user.getStatus().getId();

				result.updateStream = getNetworkUpdates(widget, user.getId(), result.current_update_id, 5);
			}
			return result;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In get profile twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}

	}

	/**
	 * Connects to the twitter based on widget prefs and creates friendship
	 * (follow) between agile user and the person with twitter id in twitter
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String follow(Widget widget, Long twitterId) throws SocketTimeoutException, IOException, Exception
	{
		// Get twitter object
		Twitter twitter = getTwitter(widget);
		try
		{
			/*
			 * Creates friendship (follow) and checks whether followed, because
			 * some have restricted access for following
			 */
			User user = twitter.createFriendship(twitterId);
			boolean connected = twitter.showFriendship(twitter.getId(), user.getId()).isSourceFollowingTarget();
			return (connected) ? "true" : "false";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In follow twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Connects to the twitter based on widget prefs and destroys friendship
	 * (unfollow) between agile user and the person with twitter id in twitter
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String unfollow(Widget widget, Long twitterId) throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Get twitter object and unfollow a person in Twitter
			User user = getTwitter(widget).destroyFriendship(twitterId);
			return (user != null) ? "Unfollowed" : "Unsuccessful";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In unfollow twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Connects to the twitter based on widget prefs and post a tweet in twitter
	 * account of the contact based on twitter id
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @param message
	 *            {@link String} message to tweet
	 * @return
	 * @throws Exception
	 */
	public static String tweetInTwitter(Widget widget, String message) throws SocketTimeoutException, IOException,
			Exception
	{
		try
		{
			// Get twitter object and tweet in twitter
			Status status = getTwitter(widget).updateStatus(message + AGILETWITTERSOURCEMESSAGE);
			System.out.println("Tweet: " + JSONUtil.toJSONString(status));
			return "Successful";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In tweet twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Connects to the twitter based on widget preferences and retweets the
	 * tweet based on the given tweet id
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param tweetId
	 *            id of the {@link Tweet}
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String reTweetByTweetId(Widget widget, Long tweetId) throws SocketTimeoutException, IOException,
			Exception
	{
		try
		{
			// Get twitter object and retweet the status by its id
			Status reTweet = getTwitter(widget).retweetStatus(tweetId);
			return (reTweet != null) ? "Retweeted successfully" : "Unsuccessful";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In retweet twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Checks whether the person with the parameter twitterId is following the
	 * agile user or not.If he is following, then he sends direct message to his
	 * twitter account.
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @param message
	 *            {@link String} message to be sent
	 * @return {@link String} success message
	 * @throws Exception
	 *             If the person with twitterId is not following agile user in
	 *             twitter
	 */
	public static String sendTwitterMessageById(Widget widget, String twitterId, String message)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			// Creates a twitter object to connect with twitter
			Twitter twitter = getTwitter(widget);

			// Current Twitter user id in agile
			long agileUserTwitterId = twitter.getId();

			/*
			 * If the twitter profile with with given twitter Id (contact)
			 * follows agile user Twitter profile, agile user can send a direct
			 * message to contact
			 */
			if (!twitter.showFriendship(agileUserTwitterId, Long.parseLong(twitterId)).isSourceFollowedByTarget())
				return "You can send a message only to persons who is following you";

			DirectMessage directMessage = twitter.sendDirectMessage(Long.parseLong(twitterId), message
					+ AGILETWITTERSOURCEMESSAGE);

			// If returned DM id is zero, message is not sent
			if (directMessage.getId() == 0)
				return "Unsuccessful try again";
			return "Message sent Successfully";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In DM twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Searches in Twitter for the specified twitterId and gets the tweets of
	 * that person
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @return {@link List} of {@link SocialUpdateStream}
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	public static List<SocialUpdateStream> getNetworkUpdates(Widget widget, Long twitterId)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			/*
			 * Get Twitter object and on that fetch user to get screen name,
			 * form a query on screen name and search for tweets
			 */
			Twitter twitter = getTwitter(widget);
			User user = twitter.showUser(twitterId);
			Query query = new Query("from:" + user.getScreenName());
			QueryResult queryResult = twitter.search(query);

			return getListOfSocialUpdateStream(user, twitter, queryResult.getTweets());
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In network updates twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Searches in Twitter for the specified twitterId and gets the tweets of
	 * that person
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} to access recipient twitter account
	 * @param statusId
	 *            tweet id of the tweet after which updates are retrieved
	 * @param count
	 *            number of tweets to be retrieved
	 * @return {@link List} of {@link SocialUpdateStream}
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	public static List<SocialUpdateStream> getNetworkUpdates(Widget widget, Long twitterId, long statusId, int count)
			throws SocketTimeoutException, IOException, Exception
	{
		try
		{
			/*
			 * Get Twitter object and on that fetch user to get screen name,
			 * form a query on screen name and search for tweets setting max
			 * status id and count as 5 tweets
			 */
			Twitter twitter = getTwitter(widget);
			User user = twitter.showUser(twitterId);
			Query query = new Query("from:" + user.getScreenName());
			query.maxId(statusId);
			query.setCount(count);
			QueryResult queryResult = twitter.search(query);

			return getListOfSocialUpdateStream(user, twitter, queryResult.getTweets());
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In network updates twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Forms a {@link List} of {@link SocialUpdateStream} from the {@link List}
	 * of {@link Status} (tweets)
	 * 
	 * @param user
	 *            {@link User} contact whose tweets are to be filled in list
	 * @param twitter
	 *            {@link Twitter} after setting authentication
	 * @param queryResult
	 *            {@link QueryResult} to retrieve tweets of the person
	 * @return {@link List} of {@link SocialUpdateStream}
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	private static List<SocialUpdateStream> getListOfSocialUpdateStream(User user, Twitter twitter, List<Status> tweets)
			throws SocketTimeoutException, IOException, Exception
	{
		List<SocialUpdateStream> updateStream = new ArrayList<SocialUpdateStream>();

		/*
		 * For each tweet, retrieve the information and make it into proper
		 * string with links to display it
		 */
		for (Status tweet : tweets)
			try
			{
				SocialUpdateStream stream = new SocialUpdateStream();

				stream.id = String.valueOf(tweet.getId());
				stream.message = tweet.getText();
				stream.is_retweet = tweet.isRetweet();
				stream.is_retweeted = tweet.isRetweetedByMe();
				stream.created_time = tweet.getCreatedAt().getTime() / 1000;

				/*
				 * If tweet is a retweet, get the picture URL and profile URL of
				 * person who actually tweeted it, else get picture URL and
				 * profile URL of the the contact's twitter profile
				 */
				if (tweet.isRetweet())
				{
					User tweetor = twitter.showUser(tweet.getUserMentionEntities()[0].getScreenName());
					stream.tweeted_person_pic_url = tweetor.getMiniProfileImageURLHttps();
					stream.tweeted_person_profile_url = "https://twitter.com/" + tweetor.getScreenName();
				}
				else
				{
					stream.tweeted_person_pic_url = user.getBiggerProfileImageURLHttps();
					stream.tweeted_person_profile_url = "https://twitter.com/" + user.getScreenName();
				}

				/*
				 * For every user who retweeted the tweet, make its screen name
				 * as link in the tweet string which can be redirected to
				 * his/her twitter profile
				 */
				for (UserMentionEntity entity : tweet.getUserMentionEntities())
					stream.message = stream.message.replace("@" + entity.getScreenName(),
							"<a href='https://twitter.com/" + entity.getScreenName()
									+ "' target='_blank' class='cd_hyperlink'>@" + entity.getScreenName() + "</a>");

				/*
				 * For every hash tag, make its name as link in the tweet string
				 * which can be redirected to twitter profile of it
				 */
				for (HashtagEntity entity : tweet.getHashtagEntities())
				{
					String url = "https://twitter.com/search?q=%23" + entity.getText() + "&src=hash";
					stream.message = stream.message.replace("#" + entity.getText(), "<a href='" + url
							+ "' target='_blank' class='cd_hyperlink'>#" + entity.getText() + "</a>");
				}

				/*
				 * If tweet contains links, replacing the link with its display
				 * content returned from Twitter, which redirects with the
				 * actual URL
				 */
				for (URLEntity entity : tweet.getURLEntities())
					stream.message = stream.message.replace(entity.getURL(), "<a href='" + entity.getURL()
							+ "' target='_blank' class='cd_hyperlink'>" + entity.getDisplayURL() + "</a>");

				/*
				 * If still tweet contains URL, showing it as hyper link and
				 * linking it with its own URL
				 */
				String[] words = stream.message.split(" ");
				String exp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";

				for (String word : words)
					if (word.matches(exp))
						stream.message = stream.message.replace(word, "<a href='" + word
								+ "' target='_blank' class='cd_hyperlink'>" + word + "</a>");

				System.out.println("Tweet after showing links: " + stream.message);

				// Each tweet is added in a list
				updateStream.add(stream);
			}
			catch (TwitterRuntimeException e)
			{
				System.out.println("In list of updates twitter exception");
				throw new Exception(getErrorMessage(e.getMessage()));
			}
		return updateStream;
	}

	/**
	 * Searches in Twitter for the specified screen name and gets the tweets of
	 * that person
	 * 
	 * @param twitter
	 *            {@link Twitter}after setting authentication
	 * @param screenName
	 *            {@link String} twitter screen name
	 * @return {@link List} of {@link Tweet}
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	public static List<Status> getTweetsByScreenName(Twitter twitter, String screenName) throws SocketTimeoutException,
			IOException, Exception
	{
		try
		{
			// Create a query with screen name and search for tweets
			QueryResult result = twitter.search(new Query("from:" + screenName));

			return result.getTweets();
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In get tweets by screen name exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Retrieves the list of follower IDs of the contact based on the contact's
	 * twitter id and wraps the result into a {@link List}
	 * 
	 * <p>
	 * Retrieves 5000 IDs at a time
	 * </p>
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} twitter id of the contact
	 * @return {@link List} of {@link Long} IDs
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	public static List<Long> getFollowersIDs(Widget widget, String twitterId) throws SocketTimeoutException,
			IOException, Exception
	{
		try
		{

			IDs ids;
			List<Long> listOfIds = new ArrayList<Long>();
			long cursor = -1;

			/*
			 * Creates a twitter object to connect with twitter and retrieves
			 * follower Twitter Ids based on Twitter ID. If more than 5000
			 * followers are required then unComment this do while condition
			 */
			// do {
			ids = getTwitter(widget).getFollowersIDs(Long.parseLong(twitterId), cursor);
			listOfIds.addAll(Arrays.asList(ArrayUtils.toObject(ids.getIDs())));
			System.out.println("List of Ids: " + listOfIds);
			// } while ((cursor = ids.getNextCursor()) != 0);

			return listOfIds;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In follower Ids twitter exception ");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Retrieves the list of twitter IDs who are followed by the contact in
	 * twitter and wraps the result into a {@link List}
	 * 
	 * @param widget
	 *            {@link Widget} for accessing token and secret key
	 * @param twitterId
	 *            {@link String} twitter id of the contact
	 * @return {@link List} of {@link Long} IDs
	 * @throws Exception
	 *             If {@link Twitter} throws an exception
	 */
	public static List<Long> getFollowingIDs(Widget widget, String twitterId) throws SocketTimeoutException,
			IOException, Exception
	{
		try
		{
			IDs ids;
			List<Long> listOfIds = new ArrayList<Long>();
			long cursor = -1;

			/*
			 * Creates a twitter object to connect with twitter and retrieves
			 * following Twitter Ids based on Twitter ID. If more than 5000
			 * following Ids are required then unComment this do while condition
			 */
			// do {
			ids = getTwitter(widget).getFriendsIDs(Long.parseLong(twitterId), cursor);
			listOfIds.addAll(Arrays.asList(ArrayUtils.toObject(ids.getIDs())));
			System.out.println("List of Ids: " + listOfIds);
			// } while ((cursor = ids.getNextCursor()) != 0);

			return listOfIds;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In following Ids twitter exception ");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
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
			for (int i = 0; i < arrayOfIds.length(); i++)
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

			return profilesList;
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("In list of profiles twitter exception");
			throw new Exception(getErrorMessage(e.getMessage()));
		}
	}

	/**
	 * Twitter exceptions are made proper and thrown by this method
	 * 
	 * @param error
	 *            {@link String} error message
	 * @return {@link String} proper error message
	 */
	private static String getErrorMessage(String error)
	{

		System.out.println("Before changing error: " + error);

		/*
		 * It returns message and code, we extract the message from it and throw
		 * it
		 */
		if (error.contains("message - ") && error.contains("code - "))
		{
			error = error.substring(error.indexOf("message - ") + 10, error.indexOf("code - "));
			System.out.println("After changing error: " + error);
			return error;
		}

		return error;
	}
}
