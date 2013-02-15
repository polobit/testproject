package com.agilecrm.social;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import twitter4j.DirectMessage;
import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.User;
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
     *            {@link Widget}, for accessing token and secret key
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
     *            {@link Widget}, for accessing token and secret key
     * @param twitterId
     *            {@link String}, to access recipient twitter account
     * @param message
     *            {@link String}, message to be sent
     * @return {@link String}, success message
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
     *            {@link Widget}, for accessing token and secret key
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
     *            {@link Widget}, for accessing token and secret key
     * @param twitterId
     *            {@link String}, to access recipient twitter account
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
     *            {@link Widget}, for accessing token and secret key
     * @param twitterId
     *            {@link String}, to access recipient twitter account
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
     *            {@link Widget}, for accessing token and secret key
     * @param twitterId
     *            {@link String}, to access recipient twitter account
     * @param text
     *            {@link String}, message to tweet
     * @return
     * @throws Exception
     */
    public static String tweetInTwitter(Widget widget, Long twitterId,
	    String text) throws Exception
    {
	Twitter twitter = getTwitter(widget);
	User user = twitter.showUser(twitterId);
	text = "@" + user.getScreenName() + " " + text;

	Status status = twitter.updateStatus(text);
	System.out.println(Util.toJSONString(status));
	return "Successfull";
    }

    /**
     * Searches in Twitter for the specified twitterId and gets the tweets of
     * that person
     * 
     * @param widget
     *            {@link Widget}, for accessing token and secret key
     * @param twitterId
     *            {@link String}, to access recipient twitter account
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

	List<SocialUpdateStream> updateStream = new ArrayList<SocialUpdateStream>();

	for (Status tweet : result.getTweets())
	{
	    SocialUpdateStream stream = new SocialUpdateStream();
	    stream.id = String.valueOf(tweet.getId());
	    stream.message = tweet.getText();
	    stream.is_retweeted = tweet.isRetweetedByMe();
	    stream.created_time = tweet.getCreatedAt().getTime() / 1000;
	    updateStream.add(stream);
	}
	return updateStream;
    }

    /**
     * Searches in Twitter for the specified twitterId and gets the tweets of
     * that person
     * 
     * @param widget
     *            {@link Widget}, for accessing token and secret key
     * @param twitterId
     *            {@link String}, to access recipient twitter account
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

	List<SocialUpdateStream> updateStream = new ArrayList<SocialUpdateStream>();
	for (Status tweet : result.getTweets())
	{
	    SocialUpdateStream stream = new SocialUpdateStream();
	    stream.id = String.valueOf(tweet.getId());
	    stream.message = tweet.getText();
	    stream.is_retweeted = tweet.isRetweetedByMe();
	    stream.created_time = tweet.getCreatedAt().getTime() / 1000;
	    updateStream.add(stream);
	}
	return updateStream;
    }

    /**
     * Searches in Twitter for the specified screen name and gets the tweets of
     * that person
     * 
     * @param twitter
     *            {@link Twitter},after setting authentication
     * @param screenName
     *            {@link String}, twitter screen name
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

}
