package com.socialsuite;

import java.io.IOException;
import java.net.SocketTimeoutException;

import twitter4j.DirectMessage;
import twitter4j.Status;
import twitter4j.StatusUpdate;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.TwitterRuntimeException;
import twitter4j.User;
import twitter4j.auth.AccessToken;

import com.agilecrm.Globals;
import com.agilecrm.util.JSONUtil;
import com.agilecrm.widgets.Widget;

public class SocialSuiteTwitterUtil
{
    /**
     * Creates a twitter instance and sets the consumer tokens (developer
     * keys)and access tokens (retrieved from stream) on it.
     * 
     * @param stream
     *            {@link Stream} to get access tokens
     * @return {@link Twitter} after setting authorization required to connect
     *         with the Twitter server.
     * @throws Exception
     */
    private static Twitter getTwitter(Stream stream) throws Exception
    {
	try
	{
	    // Creates a twitter factory to connect with twitter
	    Twitter twitter = new TwitterFactory().getInstance();

	    // Sets authentication, sets developers api key and secret key
	    twitter.setOAuthConsumer(Globals.TWITTER_API_KEY, Globals.TWITTER_SECRET_KEY);

	    // Sets AccessToken, sets twitter api key and secret key
	    twitter.setOAuthAccessToken(new AccessToken(stream.token, stream.secret));

	    return twitter;
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("in twitter exception");

	    String error = getErrorMessage(e.getMessage());
	    throw new Exception(error);
	}
    }

    private static String getErrorMessage(String error)
    {

	System.out.println(error);

	if (error.contains("message - ") && error.contains("code - "))
	{
	    error = error.substring(error.indexOf("message - ") + 10, error.indexOf("code - "));
	    System.out.println(error);
	    return error;
	}

	return error;
    }

    /**
     * Gets value of a screen name, matched with the given twitter user. From
     * credentials it will get screen name from twitter and return it to caller.
     * 
     * @param token
     *            social network account's authentication credentials
     * @param secret
     *            social network account's authentication credentials
     * @return screenName screen name from social network account need to
     *         distinguish streams
     */
    public static String getUsersProfileImgUrl(Stream stream) throws IllegalStateException
    {
	System.out.println("in getUsersProfileURL in SocialSuiteTwitterUtil");
	String profileImgUrl = null;
	Twitter twitter;

	try
	{
	    twitter = getTwitter(stream);
	    User user = twitter.showUser(twitter.getId());

	    profileImgUrl = user.getProfileImageURL();

	    System.out.println("profileImgUrl : " + profileImgUrl);
	    return profileImgUrl;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }// getUsersScreenName end

    /**
     * Connects to the twitter based on widget prefs and post a tweet in twitter
     * account of the contact based on twitter id
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param twitterId
     *            {@link String} to access recipient twitter account
     * @param message
     *            {@link String} message to tweet
     * @return
     * @throws Exception
     */
    public static String tweetInTwitter(Stream stream, String message) throws SocketTimeoutException, IOException,
	    Exception
    {
	try
	{
	    Twitter twitter = getTwitter(stream);
	    String agile = " via @agile_crm";
	    // if (message.length() < (140 - agile.length()))
	    // message = message + agile;
	    Status status = twitter.updateStatus(message + agile);
	    System.out.println(JSONUtil.toJSONString(status));
	    return "Successfull";
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("in twitter exception");

	    String error = getErrorMessage(e.getMessage());
	    throw new Exception(error);
	}
    }

    /**
     * Connects to the twitter based on widget prefs and post a tweet in twitter
     * account of the contact based on twitter id
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param twitterId
     *            {@link String} to access recipient twitter account
     * @param message
     *            {@link String} message to tweet
     * @return
     * @throws Exception
     */
    public static String replyTweetInTwitter(Stream stream, String message, Long tweetId, String tweetOwner)
	    throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    Twitter twitter = getTwitter(stream);
	    String agile = " via @agile_crm";
	    Status status = twitter.updateStatus(new StatusUpdate(message + agile).inReplyToStatusId(tweetId));
	    System.out.println(JSONUtil.toJSONString(status));
	    return "Successfull";
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("in twitter exception");

	    String error = getErrorMessage(e.getMessage());
	    throw new Exception(error);
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
     * @param tweetOwner
     * @return {@link String} success message
     * @throws Exception
     *             If the person with twitterId is not following agile user in
     *             twitter
     */
    public static String directMessageInTwitter(Stream stream, String message, String tweetOwner)
	    throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    Twitter twitter = getTwitter(stream);

	    String agile = " via @agile_crm";
	    if (!twitter.showFriendship(stream.screen_name, tweetOwner).isSourceFollowedByTarget())
	    {
		System.out.println("You can send a message only to persons who is following you");
		return "You can send a message only to persons who is following you";
	    }

	    DirectMessage dirMsg = twitter.sendDirectMessage(tweetOwner, message + agile);
	    if (dirMsg.getId() == 0)
	    {
		System.out.println("Unsuccessfull try again");
		return "Unsuccessfull try again";
	    }

	    System.out.println("Message sent Successfully");
	    return "Message sent Successfully";
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("in twitter exception");

	    String error = getErrorMessage(e.getMessage());
	    throw new Exception(error);
	}
    }

    /**
     * Connects to the twitter based on stream and retweets the tweet based on
     * the given tweet id
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetId
     *            id of the {@link Tweet}
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String retweetStatus(Stream stream, Long tweetId) throws SocketTimeoutException, IOException,
	    Exception
    {
	Twitter twitter = getTwitter(stream);
	Status reTweet = twitter.retweetStatus(tweetId);
	return (reTweet != null) ? "Retweeted successfully" : "Unsuccessfull";
    }

    /**
     * Connects to the twitter based on stream and undo retweets the tweet based
     * on the given tweet id
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetId
     *            id of the {@link Tweet}
     * @param retweetIdStr
     * @param retweetId
     * @param tweetIdStr
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String undoRetweetStatus(Stream stream, Long tweetId, Long tweetIdStr) throws SocketTimeoutException,
	    IOException, Exception
    {
	Twitter twitter = getTwitter(stream);
	System.out.println("tweetIdStr : " + tweetIdStr);

	Status status = twitter.destroyStatus(tweetIdStr);
	String result = status.toString();

	System.out.println("undo retweet return status : " + result);
	return result;

    }

    /**
     * Connects to the twitter based on stream and Favorite the tweet based on
     * the given tweet id
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetId
     *            id of the {@link Tweet}
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String favoriteStatus(Stream stream, Long tweetId) throws SocketTimeoutException, IOException,
	    Exception
    {
	Twitter twitter = getTwitter(stream);
	Status reTweet = twitter.createFavorite(tweetId);
	return (reTweet != null) ? "Favorited successfully" : "Unsuccessfull";
    }

    /**
     * Connects to the twitter based on stream and undo Favorite the tweet based
     * on the given tweet id
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetId
     *            id of the {@link Tweet}
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String undoFavoriteStatus(Stream stream, Long tweetId) throws SocketTimeoutException, IOException,
	    Exception
    {
	Twitter twitter = getTwitter(stream);
	Status reTweet = twitter.destroyFavorite(tweetId);
	return (reTweet != null) ? "Undo Favorited successfully" : "Unsuccessfull";
    }

    /**
     * Connects to the twitter based on stream and check tweet owner is
     * following by stream user.
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetOwner
     *            owner of the {@link Tweet}
     * @return {@link boolean} with success message
     * @throws Exception
     */
    public static boolean checkFollowing(Stream stream, String tweetOwner) throws SocketTimeoutException, IOException,
	    Exception
    {
	Twitter twitter = getTwitter(stream);
	boolean result = twitter.showFriendship(stream.screen_name, tweetOwner).isSourceFollowingTarget();
	System.out.println("checkFollower result : " + result);
	return result;
    }

    /**
     * Connects to the twitter based on stream and check tweet owner is follower
     * of stream user.
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetOwner
     *            owner of the {@link Tweet}
     * @return {@link boolean} with success message
     * @throws Exception
     */
    public static boolean checkFollower(Stream stream, String tweetOwner) throws SocketTimeoutException, IOException,
	    Exception
    {
	Twitter twitter = getTwitter(stream);
	boolean result = twitter.showFriendship(stream.screen_name, tweetOwner).isTargetFollowingSource();
	System.out.println("checkFollower result : " + result);
	return result;
    }

    /**
     * Connects to the twitter based on stream details and creates friendship
     * (follow) between agile user and the person with twitter screen name in
     * twitter
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetOwner
     *            {@link String} to access recipient twitter account
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String follow(Stream stream, String tweetOwner) throws SocketTimeoutException, IOException, Exception
    {
	Twitter twitter = getTwitter(stream);
	try
	{
	    System.out.println("in follow : " + tweetOwner);
	    User user = twitter.createFriendship(tweetOwner);
	    boolean connected = twitter.showFriendship(twitter.getId(), user.getId()).isSourceFollowingTarget();
	    return (connected) ? "true" : "false";
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("in twitter exception");

	    String error = getErrorMessage(e.getMessage());
	    throw new Exception(error);
	}
    }

    /**
     * Connects to the twitter based on stream details and destroys friendship
     * (unfollow) between agile user and the person with twitter screen name in
     * twitter
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetOwner
     *            {@link String} to access recipient twitter account
     * @param tweetId
     *            id of the {@link Tweet}
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String deleteTweet(Stream stream, String tweetOwner, Long tweetId) throws SocketTimeoutException,
	    IOException, Exception
    {
	try
	{
	    System.out.println("in deleteTweet : " + tweetOwner + " tweet id : " + tweetId);
	    Twitter twitter = getTwitter(stream);
	    String result = null;

	    if (stream.stream_type.equalsIgnoreCase("DM_Inbox") || stream.stream_type.equalsIgnoreCase("DM_Outbox"))
	    {
		DirectMessage dmsg = twitter.destroyDirectMessage(tweetId);
		result = dmsg.toString();
	    }
	    else
	    {
		Status status = twitter.destroyStatus(tweetId);
		result = status.toString();
	    }

	    System.out.println("delete tweet return status : " + result);
	    return result;
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("in twitter exception");

	    String error = getErrorMessage(e.getMessage());
	    throw new Exception(error);
	}
    }

    /**
     * Connects to the twitter based on stream details and destroys friendship
     * (unfollow) between agile user and the person with twitter screen name in
     * twitter and tweet id
     * 
     * @param stream
     *            {@link Stream} for accessing token and secret key
     * @param tweetOwner
     *            {@link String} to access recipient twitter account
     * @return {@link String} with success message
     * @throws Exception
     */
    public static String unfollow(Stream stream, String tweetOwner) throws SocketTimeoutException, IOException,
	    Exception
    {
	try
	{
	    System.out.println("in unfollowUser : " + tweetOwner);
	    Twitter twitter = getTwitter(stream);
	    User user = twitter.destroyFriendship(tweetOwner);

	    return (user != null) ? "Unfollowed" : "Unsuccessfull";
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("in twitter exception");

	    String error = getErrorMessage(e.getMessage());
	    throw new Exception(error);
	}
    }
}
