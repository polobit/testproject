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

import com.agilecrm.social.SocialUpdateStream;
import com.agilecrm.social.TwitterUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;

/**
 * <code>StreamAPI</code> is the API class for Social Suite.
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
		System.out.print("Stream stream_type:" + stream.stream_type + "Stream n/w type: " + stream.network_type);
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
		System.out.println("In getAllStreams.");
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
		System.out.print("In get stream Id : " + id);
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
		System.out.print("Delete stream id : " + id);
		Stream stream = StreamUtil.getStream(id);
		if (stream != null)
		{
			stream.delete();
		}
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
			System.out.print("In get stream Id : " + streamId);
			Stream stream = StreamUtil.getStream(streamId);
			System.out.print("In get stream network_type : " + stream.network_type);

			if (stream.network_type.toString().equals("TWITTER"))
				return SocialSuiteTwitterUtil.getUsersProfileImgUrl(stream);
			else if (stream.network_type.toString().equals("LINKEDIN"))

				return SocialSuiteLinkedinUtil.getUsersProfileImgUrl(stream);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
		}
		return null;
	}

	/**
	 * Connects to {@link SocialSuiteTwitterUtil} and sends the post or tweet in
	 * Twitter based on the parameter of stream.
	 * 
	 * @param streamId
	 *            {@link Long} stream id, to get {@link Stream} object
	 * @param message
	 *            {@link String} message to send tweet
	 * @return {@link String}
	 */
	@Path("/tweet/{streamId}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String sendTweet(@PathParam("streamId") Long streamId, @FormParam("message") String message)
	{
		try
		{
			Stream stream = StreamUtil.getStream(streamId);
			if (stream == null)
				return null;

			// send tweet from particular account.
			return SocialSuiteTwitterUtil.tweetInTwitter(stream, message);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
		}
	}

	/**
	 * Connects to {@link SocialSuiteTwitterUtil}, send reply to particular
	 * tweet, of stream and tweet (status).
	 * 
	 * @param streamId
	 *            {@link Long} stream id, to get {@link Stream} object.
	 * @param tweetId
	 *            {@link String} Twitter id of the status/tweet.
	 * @param tweetOwner
	 *            {@link String} owner of tweet/status.
	 * @param message
	 *            {@link String} message to be sent.
	 * @return {@link String}
	 */
	@Path("/replytweet/{streamId}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String sendReplyTweet(@PathParam("streamId") Long streamId, @FormParam("tweetId") Long tweetId,
			@FormParam("tweetOwner") String tweetOwner, @FormParam("message") String message)
	{
		try
		{
			Stream stream = StreamUtil.getStream(streamId);
			if (stream == null)
				return null;

			/*
			 * Calls SocialSuiteTwitterUtil method to send reply message to
			 * particular tweet.
			 */
			return SocialSuiteTwitterUtil.replyTweetInTwitter(stream, message, tweetId, tweetOwner);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
		}
	}

	/**
	 * Connects to {@link SocialSuiteTwitterUtil}, send reply to particular
	 * tweet, of stream and tweet (status).
	 * 
	 * @param streamId
	 *            {@link Long} stream id, to get {@link Stream} object.
	 * @param tweetId
	 *            {@link String} Twitter id of the status/tweet.
	 * @param tweetOwner
	 *            {@link String} owner of tweet/status.
	 * @param message
	 *            {@link String} message to be sent.
	 * @return {@link String}
	 */
	@Path("/directmessage/{streamId}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String sendDirectMessage(@PathParam("streamId") Long streamId, @FormParam("tweetOwner") String tweetOwner,
			@FormParam("message") String message)
	{
		try
		{
			Stream stream = StreamUtil.getStream(streamId);
			if (stream == null)
				return null;

			/*
			 * Calls SocialSuiteTwitterUtil method to send reply message to
			 * particular tweet.
			 */
			return SocialSuiteTwitterUtil.directMessageInTwitter(stream, message, tweetOwner);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
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
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String retweetStatus(@PathParam("streamId") Long streamId, @PathParam("tweetId") Long tweetId)
	{
		try
		{
			Stream stream = StreamUtil.getStream(streamId);
			if (stream == null)
				return null;

			// Calls TwitterUtil method to send message to person by socialId
			return SocialSuiteTwitterUtil.retweetStatus(stream, tweetId);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
		}
	}

	/**
	 * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
	 * and undo retweets a post in Twitter based on the given parameter.
	 * 
	 * @param streamId
	 *            {@link Long} stream id, to get {@link Stream} object
	 * @param tweetId
	 *            {@link String} Id of the tweet to retweet in Twitter
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

			// Calls TwitterUtil method to send message to person by socialId
			return SocialSuiteTwitterUtil.undoRetweetStatus(stream, tweetId, tweetIdStr);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
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

			// Calls TwitterUtil method to send message to person by socialId
			return SocialSuiteTwitterUtil.favoriteStatus(stream, tweetId);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
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

			// Calls TwitterUtil method to send message to person by socialId
			return SocialSuiteTwitterUtil.undoFavoriteStatus(stream, tweetId);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
		}
	}

	/**
	 * Connects to {@link SocialSuiteTwitterUtil} based on the stream id given
	 * and check tweet owner followed by user in Twitter based on the given
	 * parameter.
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

			// Calls TwitterUtil method to send message to person by socialId
			return SocialSuiteTwitterUtil.checkFollowing(stream, tweetOwner);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return false;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return false;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return false;
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

			// Calls TwitterUtil method to send message to person by socialId
			return SocialSuiteTwitterUtil.checkFollower(stream, tweetOwner);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return false;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return false;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return false;
		}
	}

	/**
	 * Connects to {@link TwitterUtil} user based on the name given in stream
	 * and sends an follow request to contact in Twitter based on the parameter
	 * stream id
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
	 * Connects to {@link TwitterUtil} user based on the name given in stream
	 * and sends an unfollow request to contact in Twitter based on the
	 * parameter stream id
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
	 * Connects to {@link TwitterUtil} user based on the name given in stream
	 * and sends an unfollow request to contact in Twitter based on the
	 * parameter stream id
	 * 
	 * @param streamId
	 *            {@link Long} stream id, to get {@link Stream} object
	 * @param tweetOwner
	 *            {@link String} Twitter screen name of the contact
	 * @param tweetId
	 *            {@link String} Id of the tweet to retweet in Twitter
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

			return SocialSuiteTwitterUtil.deleteTweet(stream, tweetOwner, tweetId);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
		}

	}

	/**
	 * Connects to {@link SocialSuiteLinkedinUtil} and sends the post or share
	 * in Linkedin based on the parameter of stream.
	 * 
	 * @param streamId
	 *            {@link Long} stream id, to get {@link Stream} object
	 * @return {@link String}
	 */
	@Path("/shareupdate/{streamId}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String shareUpdate(@PathParam("streamId") Long streamId, @FormParam("comment_text") String commentText,
			@FormParam("share_with") String shareWith)
	{
		try
		{
			Stream stream = StreamUtil.getStream(streamId);
			if (stream == null)
				return null;

			// send tweet from particular account.
			return SocialSuiteLinkedinUtil.shareLinkedInUpdate(stream, commentText, shareWith);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
		}

	}

	/**
	 * Return the updates from linkedin account related to stream.
	 * 
	 * @param id
	 *            - unique stream id.
	 * 
	 * @return updates - updates from linkedin.
	 * @throws Exception
	 * @throws IOException
	 * @throws SocketTimeoutException
	 */
	@GET
	@Path("/updates/{id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SocialUpdateStream> getLinkedInNetworkUpdates(@PathParam("id") Long id)
	{
		try
		{
			System.out.println(" In getLinkedInNetworkUpdates : " + id);
			Stream stream = StreamUtil.getStream(id);
			if (stream == null)
				return null;

			// send tweet from particular account.
			return SocialSuiteLinkedinUtil.getLinkedInUpdate(stream);
		}
		catch (SocketTimeoutException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("Request timed out. Refresh and try again.").build());
			 */
			return null;
		}
		catch (IOException e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST)
			 * .entity("An error occured. Refresh and try again.").build());
			 */
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			/*
			 * throw new
			 * WebApplicationException(Response.status(Response.Status.
			 * BAD_REQUEST).entity(e.getMessage()) .build());
			 */
			return null;
		}
	}
}