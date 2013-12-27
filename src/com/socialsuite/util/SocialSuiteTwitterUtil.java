package com.socialsuite.util;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.List;

import org.json.JSONObject;

import twitter4j.DirectMessage;
import twitter4j.Paging;
import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.StatusUpdate;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.TwitterRuntimeException;
import twitter4j.User;
import twitter4j.auth.AccessToken;

import com.agilecrm.Globals;
import com.agilecrm.util.JSONUtil;
import com.socialsuite.Stream;
import com.socialsuite.StreamAPI;

/**
 * <code>SocialSuiteTwitterUtil</code> class creates a client which connects to
 * Twitter based on the token and token secret, It includes methods to fetch
 * current user profile image, send requests for retweet, favorite, follow,
 * unfollow etc., profile based on twitter screen name(unique screen name
 * provided by Twitter for each user).
 * <p>
 * This class is called from {@link StreamAPI} to tweet, retweet, undoretweet,
 * favorites , etc. based on Twitter screen name as well as tweet id.
 * </p>
 * 
 * @author farah
 */
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

	/**
	 * Separates error message from error stack.
	 * 
	 * @param error
	 *            - {@link String}
	 * @return message - {@link String}
	 */
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
	 * Gets credentials from stream, Creates twitter instance. Gets user's
	 * profile and then return url of profile image of user.
	 * 
	 * @param stream
	 *            - {@link Stream} object of relevant stream
	 * 
	 * @return url - profile url from twitter account in form {@link String}
	 */
	public static String getUsersProfileImgUrl(Stream stream) throws IllegalStateException
	{
		System.out.println("in getUsersProfileURL in SocialSuiteTwitterUtil");
		String profileImgUrl = null;
		Twitter twitter;

		try
		{
			// Creates Twitter instance
			twitter = getTwitter(stream);

			// Fetches User from Twitter
			User user = twitter.showUser(twitter.getId());

			// Fetches profile image url
			profileImgUrl = user.getOriginalProfileImageURLHttps();

			System.out.println("profileImgUrl : " + profileImgUrl);
			return profileImgUrl;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}// getUsersProfileImgUrl end

	/**
	 * Connects to the twitter based on stream details and post a tweet in
	 * twitter account.
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key
	 * @param message
	 *            {@link String} message to tweet
	 * @return message - {@link String} Sent successfully or not.
	 * @throws Exception
	 */
	public static String tweetInTwitter(Stream stream, String message) throws SocketTimeoutException, IOException,
			Exception
	{
		try
		{
			Twitter twitter = getTwitter(stream);
			/* String agile = " via @agilecrm"; */
			String result = null;

			// Send current update/status
			Status status = twitter.updateStatus(message);
			System.out.println("tweetInTwitter : ");
			System.out.println(JSONUtil.toJSONString(status));

			if (status.toString().contains(message))
			{
				result = "Successful";

				System.out.println("result: " + result);
				return result;
			}
			System.out.println("result: " + result);
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
	 * Connects to the twitter based on stream details and post a reply tweet to
	 * perticular tweet in twitter account.
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
			/* String agile = " via @agilecrm"; */
			String result = null;

			// Send reply tweet to particular tweet based on tweet id.
			Status status = twitter.updateStatus(new StatusUpdate(message).inReplyToStatusId(tweetId));
			System.out.println("replyTweetInTwitter : ");
			System.out.println(status.toString());

			if (status.toString().contains(message))
				result = "Successful";

			System.out.println("result: " + result);

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
	 * Checks whether the stream owner is followed by tweet owner. If he is
	 * following, then stream owner can send direct message to tweet owner.
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key
	 * @param tweetOwner
	 *            {@link String} screen name of tweet owner
	 * @param message
	 *            {@link String} message to be sent
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
			/* String agile = " via @agilecrm"; */
			String result = null;

			if (!twitter.showFriendship(stream.screen_name, tweetOwner).isSourceFollowedByTarget())
			{
				System.out.println("You can send a message only to persons who is following you.");
				return "You can send a message only to persons who is following you.";
			}

			// Send DM
			DirectMessage dirMsg = twitter.sendDirectMessage(tweetOwner, message);
			System.out.println("directMessageInTwitter : ");
			System.out.println(dirMsg);

			return (dirMsg.getId() == 0) ? "Unsuccessful" : "Successful";
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

		// Retweet status
		Status reTweet = twitter.retweetStatus(tweetId);
		System.out.println("reTweet : " + reTweet);
		System.out.println("reTweet id : " + reTweet.getId());

		return (reTweet != null) ? String.valueOf(reTweet.getId()) : "Unsuccessful";
	}

	/**
	 * Connects to the twitter based on stream and undo retweets the tweet based
	 * on the given tweet id
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key
	 * @param tweetId
	 *            id of the {@link Re-Tweet} with stream owner's account.
	 * @param tweetIdStr
	 *            id str of the {@link Re-Tweet} with stream owner's account.
	 * @return message {@link String} with success message
	 * @throws Exception
	 */
	public static String undoRetweetStatus(Stream stream, Long tweetId, Long tweetIdStr) throws SocketTimeoutException,
			IOException, Exception
	{
		Twitter twitter = getTwitter(stream);
		System.out.println("tweetIdStr : " + tweetIdStr);

		// Delete only retweeted status and not original tweet.
		Status status = twitter.destroyStatus(tweetIdStr);
		System.out.println("undo retweet return status : " + status.toString());

		return (status != null) ? "Successful" : "Unsuccessful";
	}

	/**
	 * Connects to the twitter based on stream and Favorite the tweet based on
	 * the given tweet id.
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key.
	 * @param tweetId
	 *            id of the {@link Tweet}.
	 * @return {@link String} with success message.
	 * @throws Exception
	 */
	public static String favoriteStatus(Stream stream, Long tweetId) throws SocketTimeoutException, IOException,
			Exception
	{
		Twitter twitter = getTwitter(stream);
		Status status = twitter.createFavorite(tweetId);
		System.out.println("favoriteStatus : ");
		System.out.println(status.toString());

		return (status != null) ? "Successful" : "Unsuccessful";
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
		Status status = twitter.destroyFavorite(tweetId);
		System.out.println("undoFavoriteStatus : ");
		System.out.println(status.toString());

		return (status != null) ? "Successful" : "Unsuccessful";
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
		System.out.println("checkFollowing result : " + result);
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
	 * Connects to the twitter based on stream and check tweet owner's
	 * relationship with stream user.
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key
	 * @param tweetOwner
	 *            owner of the {@link Tweet}
	 * @return {@link boolean} with success message
	 * @throws Exception
	 */
	public static String checkRelationship(Stream stream, String tweetOwner) throws SocketTimeoutException,
			IOException, Exception
	{
		JSONObject result = new JSONObject();
		Twitter twitter = getTwitter(stream);

		// Check tweet owner is following by stream user.
		if (twitter.showFriendship(stream.screen_name, tweetOwner).isSourceFollowingTarget())
			result.put("follow", "true");
		else
			result.put("follow", "false");

		// Check tweet owner is follower of stream user.
		if (twitter.showFriendship(stream.screen_name, tweetOwner).isTargetFollowingSource())
			result.put("follower", "true");
		else
			result.put("follower", "false");

		// Check tweet owner is blocked by stream user.
		if (twitter.showFriendship(stream.screen_name, tweetOwner).isSourceBlockingTarget())
			result.put("blocked", "true");
		else
			result.put("blocked", "false");

		System.out.println("checkFollower result : " + result.toString());
		return result.toString();
	}

	/**
	 * Connects to the twitter based on stream details and creates friendship
	 * (follow) between stream owner and tweet owner.
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key
	 * @param tweetOwner
	 *            {@link String} owner of tweet
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String follow(Stream stream, String tweetOwner) throws SocketTimeoutException, IOException, Exception
	{
		Twitter twitter = getTwitter(stream);
		try
		{
			System.out.println("in follow : " + tweetOwner);

			// Follow tweet owner
			User user = twitter.createFriendship(tweetOwner);

			// Check friendship is created
			boolean connected = twitter.showFriendship(twitter.getId(), user.getId()).isSourceFollowingTarget();
			System.out.println("connected : " + connected);

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
	 * (unfollow) between stream owner and tweet owner
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

			// Unfollow tweet owner.
			User user = twitter.destroyFriendship(tweetOwner);

			// Check friendship is destroyed.
			boolean connected = twitter.showFriendship(twitter.getId(), user.getId()).isSourceFollowingTarget();
			System.out.println("connected : " + connected);

			return (connected) ? "Unsuccessful" : "Unfollowed";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("in twitter exception");

			String error = getErrorMessage(e.getMessage());
			throw new Exception(error);
		}
	}

	/**
	 * Connects to the twitter based on stream details and block tweet owner.
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key
	 * @param tweetOwner
	 *            {@link String} owner of tweet
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String blockUser(Stream stream, String tweetOwner) throws SocketTimeoutException, IOException,
			Exception
	{
		Twitter twitter = getTwitter(stream);
		try
		{
			System.out.println("in blockUser : " + tweetOwner);

			// Block tweet owner
			User user = twitter.createBlock(tweetOwner);

			// Check user is blocked.
			boolean blocked = twitter.showFriendship(twitter.getId(), user.getId()).isSourceBlockingTarget();
			System.out.println("blocked : " + blocked);

			return (blocked) ? "true" : "false";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("in twitter exception");

			String error = getErrorMessage(e.getMessage());
			throw new Exception(error);
		}
	}

	/**
	 * Connects to the twitter based on stream details and unblock tweet owner
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key
	 * @param tweetOwner
	 *            {@link String} to access recipient twitter account
	 * @return {@link String} with success message
	 * @throws Exception
	 */
	public static String unblockUser(Stream stream, String tweetOwner) throws SocketTimeoutException, IOException,
			Exception
	{
		try
		{
			System.out.println("in unfollowUser : " + tweetOwner);
			Twitter twitter = getTwitter(stream);

			// Unblock tweet owner.
			User user = twitter.destroyBlock(tweetOwner);

			// Check user is unblocked.
			boolean unblocked = twitter.showFriendship(twitter.getId(), user.getId()).isSourceBlockingTarget();
			System.out.println("unblocked : " + unblocked);

			return (unblocked) ? "Unsuccessful" : "Unblock";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("in twitter exception");

			String error = getErrorMessage(e.getMessage());
			throw new Exception(error);
		}
	}

	/**
	 * Deletes tweet based on tweet id, connects with twitter from details of
	 * stream.
	 * 
	 * @param stream
	 *            {@link Stream} for accessing token and secret key
	 * @param tweetOwner
	 *            {@link String} to access recipient twitter account
	 * @param tweetId
	 *            {@link Long} id of the {@link Tweet}
	 * 
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

			// Delete DM
			if (stream.stream_type.equalsIgnoreCase("DM_Inbox") || stream.stream_type.equalsIgnoreCase("DM_Outbox"))
			{
				DirectMessage dmsg = twitter.destroyDirectMessage(tweetId);
				result = dmsg.toString();
			}
			else
			// Delete tweet
			{
				Status status = twitter.destroyStatus(tweetId);
				result = status.toString();
			}

			System.out.println("delete tweet return status : " + result);

			return (result != null) ? "Successful" : "Unsuccessful";
		}
		catch (TwitterRuntimeException e)
		{
			System.out.println("in twitter exception");

			String error = getErrorMessage(e.getMessage());
			throw new Exception(error);
		}
	}

	public static List<Status> getRTUsers(Stream stream, Long tweetId) throws Exception 
	{
		Twitter twitter = getTwitter(stream);
				
		List<Status> userList;		
		
		userList =  twitter.getRetweets(tweetId);	
		
		for(Status st : userList)
			System.out.println("st: "+st.toString());
		
		return userList;
	}
}
