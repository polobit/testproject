package com.agilecrm.social;

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
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.URLEntity;
import twitter4j.User;
import twitter4j.UserMentionEntity;
import twitter4j.auth.AccessToken;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.util.Util;
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
     * Creates a twitter instance and sets the consumer tokens (developer
     * keys)and access tokens (retrieved from widget) on it.
     * 
     * @param widget
     *            {@link Widget} to get access tokens
     * @return {@link Twitter} after setting authorization required to connect
     *         with the Twitter server.
     */
    private static Twitter getTwitter(Widget widget)
    {
	// Creates a twitter factory to connect with twitter
	Twitter twitter = new TwitterFactory().getInstance();

	// Sets authentication, sets developers api key and secret key
	twitter.setOAuthConsumer(Globals.TWITTER_API_KEY,
		Globals.TWITTER_SECRET_KEY);

	// Sets AccessToken, sets twitter api key and secret key
	twitter.setOAuthAccessToken(new AccessToken(
		widget.getProperty("token"), widget.getProperty("secret")));

	return twitter;
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
    public static List<SocialSearchResult> searchTwitterProfiles(Widget widget,
	    Contact contact) throws Exception
    {
	// Gets first name and last name of the contact to search profiles
	String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
	String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

	// returns null if firstname or lastname of contact is null
	if (StringUtils.isBlank(firstName) && StringUtils.isBlank(lastName))
	    return null;

	// Creates a twitter object to connect with twitter
	Twitter twitter = getTwitter(widget);

	// Searches twitter profiles based on first name and last name
	ResponseList<User> users = twitter.searchUsers(firstName + " "
		+ lastName, 1);

	List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

	// Iterates through Twitter results and wraps the profile details in to
	// SocialSearchResult and adds to list
	for (User user : users)
	{
	    SocialSearchResult result = new SocialSearchResult();

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

	    // Adds each result in to list
	    searchResults.add(result);
	}

	// Returns list of matching profiles
	return searchResults;
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
    public static SocialSearchResult getTwitterProfileById(Widget widget,
	    String twitterId) throws Exception
    {
	// Creates a twitter object to connect with twitter
	Twitter twitter = getTwitter(widget);

	// Fetch Twitter user profile based on twitter Id
	User user = twitter.showUser(Long.parseLong(twitterId));

	SocialSearchResult result = new SocialSearchResult();

	// Gets user details from twitter and maps to SocialSearchResult
	// class
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
	result.is_connected = twitter.showFriendship(twitter.getId(),
		user.getId()).isSourceFollowingTarget();
	result.is_followed_by_target = twitter.showFriendship(twitter.getId(),
		user.getId()).isSourceFollowedByTarget();

	if (user.getStatus() != null)
	{
	    result.current_update = user.getStatus().getText();
	    result.current_update_id = user.getStatus().getId();

	    result.updateStream = getNetworkUpdates(widget,
		    Long.parseLong(twitterId), result.current_update_id, 5);
	}

	return result;
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
    public static String sendTwitterMessageById(Widget widget,
	    String twitterId, String message) throws Exception
    {
	long profile_id = Long.parseLong(twitterId);
	Twitter twitter = getTwitter(widget);
	long id = twitter.getId();

	if (!twitter.showFriendship(id, profile_id).isSourceFollowedByTarget())
	    return "You can send a message only to persons who is following you";

	DirectMessage dirMess = twitter.sendDirectMessage(profile_id, message);
	if (dirMess.getId() == 0)
	    return "Unsuccessfull try again";
	return "Message sent Successfully";
    }

    /**
     * Connects to the twitter based on widget prefs and retweets the tweet
     * based on the given tweet id
     * 
     * @param widget
     *            {@link Widget} for accessing token and secret key
     * @param tweetId
     *            id of the {@link Tweet}
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String reTweetByTweetId(Widget widget, Long tweetId)
	    throws Exception
    {
	Twitter twitter = getTwitter(widget);
	Status reTweet = twitter.retweetStatus(tweetId);
	return (reTweet != null) ? "Retweeted successfully" : "Unsuccessfull";
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
    public static String unfollow(Widget widget, Long twitterId)
	    throws Exception
    {
	Twitter twitter = getTwitter(widget);
	User user = twitter.destroyFriendship(twitterId);

	return (user != null) ? "Unfollowed" : "Unsuccessfull";
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
    public static String follow(Widget widget, Long twitterId) throws Exception
    {
	Twitter twitter = getTwitter(widget);
	User user = twitter.createFriendship(twitterId);
	boolean connected = twitter.showFriendship(twitter.getId(),
		user.getId()).isSourceFollowingTarget();
	return (connected) ? "true" : "false";
    }

    /**
     * Connects to the twitter based on widget prefs and post a tweet in twitter
     * account of the contact based on twitter id
     * 
     * @param widget
     *            {@link Widget} for accessing token and secret key
     * @param twitterId
     *            {@link String} to access recipient twitter account
     * @param text
     *            {@link String} message to tweet
     * @return
     * @throws Exception
     */
    public static String tweetInTwitter(Widget widget, String text)
	    throws Exception
    {
	Twitter twitter = getTwitter(widget);

	Status status = twitter.updateStatus(text);
	System.out.println(Util.toJSONString(status));
	return "Successfull";
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
    public static List<SocialUpdateStream> getNetworkUpdates(Widget widget,
	    Long twitterId) throws Exception
    {
	Twitter twitter = getTwitter(widget);
	User user = twitter.showUser(twitterId);
	Query query = new Query("from:" + user.getScreenName());
	QueryResult result = twitter.search(query);

	return getListOfSocialUpdateStream(user, twitter, result);

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
    public static List<SocialUpdateStream> getNetworkUpdates(Widget widget,
	    Long twitterId, long statusId, int count) throws Exception
    {
	Twitter twitter = getTwitter(widget);
	User user = twitter.showUser(twitterId);
	Query query = new Query("from:" + user.getScreenName());
	query.maxId(statusId);
	query.setCount(count);
	QueryResult result = twitter.search(query);

	return getListOfSocialUpdateStream(user, twitter, result);

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
    public static List<Status> getTweetsByName(Twitter twitter,
	    String screenName) throws Exception
    {
	Query query = new Query("from:" + screenName);
	QueryResult result = twitter.search(query);

	return result.getTweets();
    }

    /**
     * Retrieves the twitter profile of the contact based on URL provided for
     * twitter.
     * 
     * @param widget
     *            {@link Widget} for accessing token and secret key
     * @param webUrl
     *            {@link String} twitter URL of the contact
     * @return {@link String} twitter id of the profile
     * @throws Exception
     *             If {@link Twitter} throws an exception
     */
    public static String getTwitterIdByUrl(Widget widget, String webUrl)
	    throws Exception
    {

	// Creates a twitter object to connect with twitter
	Twitter twitter = getTwitter(widget);

	if (!webUrl.startsWith("https://twitter.com/"))
	    return null;

	System.out.println(webUrl.substring(webUrl.lastIndexOf("/") + 1));
	try
	{
	    // Fetch Twitter user profile based on twitter Id
	    User user = twitter.showUser(webUrl.substring(webUrl
		    .lastIndexOf("/") + 1));
	    return String.valueOf(user.getId());
	}
	catch (Exception e)
	{
	    if (e.getMessage().startsWith("404"))
		throw new Exception(
			"URL provided for Twitter is invalid. No such user exists.");

	    throw new Exception(e.getMessage());
	}

    }

    /**
     * Retrieves the list of follower IDs of the contact based on the contact's
     * twitter id and wraps the result into a {@link List}
     * 
     * @param widget
     *            {@link Widget} for accessing token and secret key
     * @param twitterId
     *            {@link String} twitter id of the contact
     * @return {@link List} of {@link Long} IDs
     * @throws Exception
     *             If {@link Twitter} throws an exception
     */
    public static List<Long> getFollowersIDs(Widget widget, String twitterId)
	    throws Exception
    {
	// Creates a twitter object to connect with twitter
	Twitter twitter = getTwitter(widget);
	IDs ids;
	List<Long> listOfIds = new ArrayList<Long>();
	long cursor = -1;

	System.out.println("Listing ids.");

	// If more than 5000 followers are required then unComment this do while
	// do {

	ids = twitter.getFollowersIDs(Long.parseLong(twitterId), cursor);
	listOfIds.addAll(Arrays.asList(ArrayUtils.toObject(ids.getIDs())));
	System.out.println(listOfIds);

	// } while ((cursor = ids.getNextCursor()) != 0);

	return listOfIds;
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
    public static List<Long> getFollowingIDs(Widget widget, String twitterId)
	    throws Exception
    {
	// Creates a twitter object to connect with twitter
	Twitter twitter = getTwitter(widget);
	IDs ids;
	List<Long> listOfIds = new ArrayList<Long>();
	long cursor = -1;

	System.out.println("Listing ids.");

	// If more than 5000 following are required then unComment this do while
	// do {

	ids = twitter.getFriendsIDs(Long.parseLong(twitterId), cursor);
	listOfIds.addAll(Arrays.asList(ArrayUtils.toObject(ids.getIDs())));
	System.out.println(listOfIds);

	// } while ((cursor = ids.getNextCursor()) != 0);

	return listOfIds;

    }

    /**
     * Retrieves profile for each Twitter Id given in {@link List} of IDs and
     * wraps result into a {@link List} of {@link SocialSearchResult}
     * 
     * @param widget
     *            {@link Widget} for accessing token and secret key
     * @param ids
     *            {@link List} of {@link Long} twitter IDs
     * @return {@link List} of {@link SocialSearchResult}
     * @throws Exception
     *             If {@link Twitter} throws an exception
     */
    public static List<SocialSearchResult> getListOfProfiles(Widget widget,
	    JSONArray ids) throws Exception
    {
	Twitter twitter = getTwitter(widget);
	List<SocialSearchResult> profilesList = new ArrayList<SocialSearchResult>();

	for (int i = 0; i < ids.length(); i++)
	{
	    SocialSearchResult result = new SocialSearchResult();

	    try
	    {
		User user = twitter.showUser(Long.parseLong(ids.getString(i)));
		result.id = user.getId() + "";
		result.name = user.getName();
		result.picture = user.getBiggerProfileImageURLHttps()
			.toString();
		result.location = user.getLocation();
		result.summary = user.getDescription();
		result.url = "https://twitter.com/" + user.getScreenName();
		result.num_connections = user.getFollowersCount() + "";
		result.tweet_count = user.getStatusesCount() + "";
		result.friends_count = user.getFriendsCount() + "";

	    }
	    catch (TwitterException e)
	    {
		continue;
	    }

	    System.out.println(result.url);
	    System.out.println(result);
	    // Adds each result in to list
	    profilesList.add(result);
	}
	return profilesList;
    }

    /**
     * Forms a {@link List} of {@link SocialUpdateStream} with the tweets of the
     * contact
     * 
     * @param user
     *            {@link User} contact whose tweets are to be filled in list
     * @param twitter
     *            {@link Twitter} after setting authentication
     * @param result
     *            {@link QueryResult} to retrieve tweets of the person
     * @return {@link List} of {@link SocialUpdateStream}
     * @throws Exception
     *             If {@link Twitter} throws an exception
     */
    private static List<SocialUpdateStream> getListOfSocialUpdateStream(
	    User user, Twitter twitter, QueryResult result) throws Exception
    {
	List<SocialUpdateStream> updateStream = new ArrayList<SocialUpdateStream>();

	for (Status tweet : result.getTweets())
	{
	    SocialUpdateStream stream = new SocialUpdateStream();

	    stream.id = String.valueOf(tweet.getId());
	    stream.message = tweet.getText();
	    stream.is_retweet = tweet.isRetweet();

	    // If tweet is a retweet, get the picture URL and profile URL of
	    // person who actually tweeted it, else get picture URL and profile
	    // URL of contact
	    if (tweet.isRetweet())
	    {
		User tweetor = twitter
			.showUser(tweet.getUserMentionEntities()[0]
				.getScreenName());
		stream.tweeted_person_pic_url = tweetor
			.getMiniProfileImageURLHttps();
		stream.tweeted_person_profile_url = "https://twitter.com/"
			+ tweetor.getScreenName();

	    }
	    else
	    {
		stream.tweeted_person_pic_url = user
			.getBiggerProfileImageURLHttps();
		stream.tweeted_person_profile_url = "https://twitter.com/"
			+ user.getScreenName();

	    }

	    // For every tweetor who retweeted the tweet, linking his name with
	    // a URL which redirects to his/her twitter profile
	    for (UserMentionEntity entity : tweet.getUserMentionEntities())
	    {
		stream.message = stream.message.replace(
			"@" + entity.getScreenName(),
			"<a href='https://twitter.com/"
				+ entity.getScreenName()
				+ "' target='_blank' class='cd_hyperlink'>@"
				+ entity.getScreenName() + "</a>");
	    }

	    // For every hash tag, linking it with a URL which redirects to
	    // twitter profile of it
	    for (HashtagEntity entity : tweet.getHashtagEntities())
	    {

		String url = "https://twitter.com/search?q=%23"
			+ entity.getText() + "&src=hash";
		stream.message = stream.message.replace("#" + entity.getText(),
			"<a href='" + url
				+ "' target='_blank' class='cd_hyperlink'>#"
				+ entity.getText() + "</a>");
	    }

	    // If tweet contains links, replacing the link with its display
	    // content returned from twitter and linking it with the actual URL
	    for (URLEntity entity : tweet.getURLEntities())
	    {

		stream.message = stream.message.replace(entity.getURL(),
			"<a href='" + entity.getURL()
				+ "' target='_blank' class='cd_hyperlink'>"
				+ entity.getDisplayURL() + "</a>");
	    }

	    // If still tweet contains URL, showing it as hyper link and linking
	    // it with its own URL
	    String[] words = stream.message.split(" ");
	    String exp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";

	    for (String word : words)
	    {
		if (word.matches(exp))
		    stream.message = stream.message.replace(word, "<a href='"
			    + word + "' target='_blank' class='cd_hyperlink'>"
			    + word + "</a>");
	    }
	    System.out.println(stream.message);
	    stream.is_retweeted = tweet.isRetweetedByMe();
	    stream.created_time = tweet.getCreatedAt().getTime() / 1000;
	    updateStream.add(stream);
	}
	return updateStream;
    }
}
