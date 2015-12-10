package com.socialsuite;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.sf.json.JSONObject;

import org.json.JSONArray;
import org.json.JSONException;

import twitter4j.Status;

import com.google.appengine.api.datastore.EntityNotFoundException;
import com.socialsuite.cron.ScheduledUpdate;
import com.socialsuite.util.SocialSuiteTwitterUtil;
import com.socialsuite.util.StreamUtil;

/**
 * <code>StreamAPI</code> is the API class for Social Suite Stream. This class
 * includes REST calls to interact with Stream class, Twitter class to access
 * social results
 * <p>
 * It is called from client side for Adding a stream, Deleting a stream, Getting
 * all stream to show in social suite, Searching Twitter profiles, Sending
 * posts/updates, Perform actions related to tweets. Also used to show available
 * streams.
 * </p>
 * <p>
 * To perform actions on tweets, It needs token and secret from stream. Stream
 * have details and credentials about user's twitter account. All tweet actions
 * are completed from REST API, which needs to create twitter object from
 * Twitter Factory.
 * </p>
 * 
 * @author Farah
 * 
 */
@Path("/social")
public class StreamAPI
{
    /**
     * Create new Stream in database related to current domain user.
     * 
     * @param Stream
     *            - Object of {@link Stream}
     */
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Stream createStream(Stream stream)
    {
	stream.save();
	return stream;
    }

    /**
     * Return the list of Stream available in dB related to current Domain User.
     * 
     * @return List<Stream> - Objects Stream
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Stream> getAllStreams()
    {
	return StreamUtil.getStreams();
    }

    /**
     * Return the details of Stream as per stream Id.
     * 
     * @param id
     *            - unique stream id.
     * 
     * @return Stream - Object with required stream id.
     */
    @GET
    @Path("/getstream/{id}")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Stream getStream(@PathParam("id") Long id) throws EntityNotFoundException
    {
	return StreamUtil.getStream(id);
    }

    /**
     * Delete Stream as per stream Id.
     * 
     * @param id
     *            - unique stream id.
     */
    @DELETE
    @Path("/{id}")
    public void deleteStream(@PathParam("id") Long id)
    {
	Stream stream = StreamUtil.getStream(id);
	if (stream != null)
	{
	    stream.delete();
	}
    }

    /**
     * Deletes the bulk of streams. Bulk operations - delete.
     * 
     * @param model_ids
     *            array of stream ids as String.
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteStreams(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray streamsJSONArray = new JSONArray(model_ids);
	Stream.dao.deleteBulkByIds(streamsJSONArray);
    }

    /**
     * Return the profile img url of client's social network account.
     * 
     * @param id
     *            - stream id.
     * @return url - profile img url in string form.
     */
    @GET
    @Path("/getprofileimg/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public String getProfileImg(@PathParam("id") Long streamId) throws EntityNotFoundException
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);

	    if (stream.network_type.toString().equals("TWITTER"))
		return SocialSuiteTwitterUtil.getUsersProfileImgUrl(stream);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	return null;
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} and 1. sends the post or tweet
     * in Twitter based on the parameter of stream. 2. send reply to particular
     * tweet from stream owner. 3. send direct message from stream owner to
     * tweet owner.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param message
     *            {@link String} message to send tweet
     * @return {@link String}
     */
    @Path("/tweet/{streamId}")
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public JSONObject sendTweet(@PathParam("streamId") Long streamId, ScheduledUpdate forMessage)
    {
	System.out.println(forMessage);
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    JSONObject result = new JSONObject();

	    if (forMessage.headline.equalsIgnoreCase("Tweet") || forMessage.headline.equalsIgnoreCase("Retweet"))
	    {
		// send tweet from particular account.
		result.accumulate("response", SocialSuiteTwitterUtil.tweetInTwitter(stream, forMessage.message));
	    }
	    else if (forMessage.headline.equalsIgnoreCase("Reply Tweet") && forMessage.tweetId != "")
	    {
		/*
		 * Calls SocialSuiteTwitterUtil method to send reply message to
		 * particular tweet.
		 */
		result.accumulate(
			"response",
			SocialSuiteTwitterUtil.replyTweetInTwitter(stream, forMessage.message,
				Long.parseLong(forMessage.tweetId), forMessage.tweetOwner));
	    }
	    else if (forMessage.headline.equalsIgnoreCase("Reply Tweet") && forMessage.tweetId == "")
	    {
		// send tweet from particular account.
		result.accumulate("response", SocialSuiteTwitterUtil.tweetInTwitter(stream, forMessage.message));
	    }
	    else if (forMessage.headline.equalsIgnoreCase("Direct Message"))
	    {
		/*
		 * Calls SocialSuiteTwitterUtil method to send direct message to
		 * particular tweet owner.
		 */
		result.accumulate("response", SocialSuiteTwitterUtil.directMessageInTwitter(stream, forMessage.message,
			forMessage.tweetOwner));
	    }

	    System.out.println(result);
	    return result;
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
     * and retweets a post in Twitter based on the given parameter.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetId
     *            {@link String} Id of the tweet to retweet in Twitter
     * @return {@link String}
     */
    @Path("/retweet/{streamId}/{tweetId}")
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public JSONObject retweetStatus(@PathParam("streamId") Long streamId, @PathParam("tweetId") Long tweetId)
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    JSONObject result = new JSONObject();

	    // Calls SocialSuiteTwitterUtil method to retweet given tweet.
	    result.accumulate("response", SocialSuiteTwitterUtil.retweetStatus(stream, tweetId));

	    return result;
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
     * and undo retweets a post in Twitter based on the given parameter.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetId
     *            {@link Long} Id of tweet to undo-retweet in Twitter
     * @param tweetIdStr
     *            {@link Long} IdStr of tweet to undo-retweet in Twitter
     * 
     * @return {@link String}
     */
    @Path("/undoretweet/{streamId}/{tweetId}/{tweetIdStr}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String undoRetweetStatus(@PathParam("streamId") Long streamId, @PathParam("tweetId") Long tweetId,
	    @PathParam("tweetIdStr") Long tweetIdStr)
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Calls SocialSuiteTwitterUtil method to undo-retweet as per given
	    // tweetId
	    return SocialSuiteTwitterUtil.undoRetweetStatus(stream, tweetId, tweetIdStr);
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
     * and favorite a post in Twitter based on the given parameter.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetId
     *            {@link String} Id of the tweet to retweet in Twitter
     * @return {@link String}
     */
    @Path("/favorite/{streamId}/{tweetId}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String favoriteStatus(@PathParam("streamId") Long streamId, @PathParam("tweetId") Long tweetId)
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Calls SocialSuiteTwitterUtil method to make tweet favorite as per
	    // given id
	    return SocialSuiteTwitterUtil.favoriteStatus(stream, tweetId);
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
     * and undo favorite a post in Twitter based on the given parameter.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetId
     *            {@link String} Id of the tweet to retweet in Twitter
     * @return {@link String}
     */
    @Path("/undofavorite/{streamId}/{tweetId}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String undoFavoriteStatus(@PathParam("streamId") Long streamId, @PathParam("tweetId") Long tweetId)
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Calls SocialSuiteTwitterUtil method to undo-favorite tweet
	    return SocialSuiteTwitterUtil.undoFavoriteStatus(stream, tweetId);
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
     * and check stream owner is following tweet owner in Twitter based on the
     * given parameter.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetOwner
     *            {@link String} Owner of the tweet
     * @return {@link boolean}
     */
    @Path("/checkfollowing/{streamId}/{tweetOwner}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public boolean checkFollowing(@PathParam("streamId") Long streamId, @PathParam("tweetOwner") String tweetOwner)
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return false;

	    // Calls SocialSuiteTwitterUtil method to check stream owner is
	    // following tweet owner
	    return SocialSuiteTwitterUtil.checkFollowing(stream, tweetOwner);
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
     * and check tweet owner is follower of user in Twitter based on the given
     * parameter.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetOwner
     *            {@link String} Owner of the tweet
     * @return {@link boolean}
     */
    @Path("/checkfollower/{streamId}/{tweetOwner}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public boolean checkFollower(@PathParam("streamId") Long streamId, @PathParam("tweetOwner") String tweetOwner)
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return false;

	    // Calls SocialSuiteTwitterUtil method to check tweet owner is
	    // following stream owner
	    return SocialSuiteTwitterUtil.checkFollower(stream, tweetOwner);
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
     * and check relationship between tweet owner and stream owner.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetOwner
     *            {@link String} Owner of the tweet
     * @return {@link boolean}
     */
    @Path("/checkrelationship/{streamId}/{tweetOwner}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML, MediaType.TEXT_PLAIN })
    public String checkRelationship(@PathParam("streamId") Long streamId, @PathParam("tweetOwner") String tweetOwner)
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Calls SocialSuiteTwitterUtil method to check tweet owner is
	    // following stream owner
	    return SocialSuiteTwitterUtil.checkRelationship(stream, tweetOwner);
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} user based on the name given
     * in stream and sends an follow request to contact in Twitter based on the
     * parameter stream id
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetOwner
     *            {@link String} Twitter screen name of the contact
     * 
     * @return {@link String}
     */
    @Path("/followuser/{streamId}/{tweetOwner}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String followUser(@PathParam("streamId") Long streamId, @PathParam("tweetOwner") String tweetOwner)
    {
	try
	{
	    System.out.println("in followuser : " + tweetOwner);

	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Calls SocialSuiteTwitterUtil method to send follow request of
	    // tweet owner.
	    return SocialSuiteTwitterUtil.follow(stream, tweetOwner);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} user based on the name given
     * in stream and sends an unfollow request to contact in Twitter based on
     * the parameter stream id.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetOwner
     *            {@link String} Twitter screen name of the contact
     * 
     * @return {@link String}
     */
    @Path("/unfollowuser/{streamId}/{tweetOwner}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String unfollowUser(@PathParam("streamId") Long streamId, @PathParam("tweetOwner") String tweetOwner)
    {
	try
	{
	    System.out.println("in unfollowUser : " + tweetOwner);

	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Send unfollow request to Twitter about tweet owner.
	    return SocialSuiteTwitterUtil.unfollow(stream, tweetOwner);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} user based on the name given
     * in stream and sends an block request to contact in Twitter based on the
     * parameter stream id.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetOwner
     *            {@link String} Twitter screen name of the contact
     * 
     * @return {@link String}
     */
    @Path("/blockuser/{streamId}/{tweetOwner}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String blockUser(@PathParam("streamId") Long streamId, @PathParam("tweetOwner") String tweetOwner)
    {
	try
	{
	    System.out.println("in blockUser : " + tweetOwner);

	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Calls SocialSuiteTwitterUtil method to send block request of
	    // tweet owner.
	    return SocialSuiteTwitterUtil.blockUser(stream, tweetOwner);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} user based on the name given
     * in stream and sends an unblock request to contact in Twitter based on the
     * parameter stream id.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetOwner
     *            {@link String} Twitter screen name of the contact
     * 
     * @return {@link String}
     */
    @Path("/unblockuser/{streamId}/{tweetOwner}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String unblockUser(@PathParam("streamId") Long streamId, @PathParam("tweetOwner") String tweetOwner)
    {
	try
	{
	    System.out.println("in unblockUser : " + tweetOwner);

	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Send unblock request to Twitter about tweet owner.
	    return SocialSuiteTwitterUtil.unblockUser(stream, tweetOwner);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} user based on the name given
     * in stream and delete tweet as per given details.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetOwner
     *            {@link String} Twitter screen name of tweet owner.
     * @param tweetId
     *            {@link String} Id of the tweet to delete in Twitter
     * 
     * @return {@link String}
     */
    @Path("/deletetweet/{streamId}/{tweetOwner}/{tweetId}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String deleteTweet(@PathParam("streamId") Long streamId, @PathParam("tweetOwner") String tweetOwner,
	    @PathParam("tweetId") Long tweetId)
    {
	try
	{
	    System.out.println("in API deleteTweet : " + tweetOwner);

	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Delete tweet on Twitter as per user's request.
	    return SocialSuiteTwitterUtil.deleteTweet(stream, tweetOwner, tweetId);
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} user based on the name given
     * in stream and fetch list of users who retweeted given tweet.
     * 
     * @param streamId
     *            {@link Long} stream id, to get {@link Stream} object
     * @param tweetId
     *            {@link String} Id of the tweet to fetch details from Twitter
     * 
     * @return List of user.
     */
    @GET
    @Path("/getrtusers/{streamId}/{tweetId}")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Status> getRTUsers(@PathParam("streamId") Long streamId, @PathParam("tweetId") Long tweetId)
    {
	try
	{
	    System.out.println("in API getRTUsers : " + tweetId);

	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    // Get users on Twitter as per user's request.
	    return SocialSuiteTwitterUtil.getRTUsers(stream, tweetId);
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to {@link SocialSuiteTwitterUtil} user based on the name given
     * in stream and fetch past tweets from given tweet id.
     * 
     * @param stream
     *            {@link Stream} stream, to get {@link Stream} details.
     * @param tweetId
     *            {@link String} Id of the tweet to get past tweets from this.
     * @return
     * 
     * @return List of status.
     */
    @GET
    @Path("/pasttweets/{streamId}/{tweetId}/{tweetIdStr}")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getPastTweets(@PathParam("streamId") Long streamId, @PathParam("tweetId") Long tweetId,
	    @PathParam("tweetIdStr") Long tweetIdStr)
    {
	try
	{
	    Stream stream = StreamUtil.getStream(streamId);
	    if (stream == null)
		return null;

	    System.out.println("in API getPastTweets : " + tweetId);

	    // Fetch past tweets on Twitter as per user's request.
	    twitter4j.internal.org.json.JSONArray resultList = SocialSuiteTwitterUtil.getPastTweets(stream, tweetId,
		    tweetIdStr);

	    if (resultList == null || resultList.length() == 0)
		return null;

	    return resultList.toString();
	}
	catch (SocketTimeoutException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
}