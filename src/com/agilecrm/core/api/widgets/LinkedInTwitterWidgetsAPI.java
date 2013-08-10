package com.agilecrm.core.api.widgets;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;

import twitter4j.Twitter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.LinkedInUtil;
import com.agilecrm.social.TwitterUtil;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

@Path("/api/widgets/social")
public class LinkedInTwitterWidgetsAPI
{
    // Get matching profiles for LinkedIn and Twitter
    /**
     * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
     * given in widget and fetches matching profiles for the contact in LinkedIn
     * and Twitter, based on the parameter social id
     * 
     * @param contactId
     *            {@link Long} customer id, to get name of contact
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @return {@link List} of {@link SocialSearchResult}
     */
    @Path("/match/{widget-id}/{contact-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialSearchResult> getSocialMatchingProfiles(
	    @PathParam("contact-id") Long contactId,
	    @PathParam("widget-id") Long widgetId)
    {
	try
	{
	    // Get contact and widget based on their id
	    Contact contact = ContactUtil.getContact(contactId);
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    // Returns null if widget doesn't exist with given widget id
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Gets profiles from LinkedInUtil based on contact
	     */
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.searchLinkedInProfiles(widget, contact);

	    // Gets profiles from TwitterUtil based on contact
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.searchTwitterProfiles(widget, contact);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link LinkedInUtil} based on the name given in widget and
     * fetches matching profiles for the contact in LinkedIn based on given
     * parameters
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
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
     */
    @Path("/modified/match/linkedin/{widget-id}")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    public List<SocialSearchResult> getModifiedMatchingProfilesInLinkedIn(
	    @PathParam("widget-id") Long widgetId,

	    @FormParam("keywords") String keywords)
    {
	try
	{
	    // Get contact and widget based on their id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    // Returns null if widget doesn't exist with given widget id
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Gets profiles from LinkedInUtil based on contact
	     */
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.modifiedSearchForLinkedInProfiles(widget,
			keywords);

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link TwitterUtil} based on the name given in widget and
     * fetches matching profiles for Twitter, based on search string
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param searchString
     *            {@link String} to be searched
     * @return {@link List} of {@link SocialSearchResult}
     */
    @Path("/modified/match/twitter/{widget-id}/{search-string}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialSearchResult> getModifiedMatchingProfilesInTwitter(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("search-string") String searchString)
    {
	try
	{
	    // Get contact and widget based on their id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    // Returns null if widget doesn't exist with given widget id
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Retrieves profiles from LinkedInUtil based on contact
	     */
	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.modifiedSearchForTwitterProfiles(widget, searchString);

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Retrieves the id of the LinkedIn or Twitter based on widget preferences
     * provided and URL saved for contact.
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param webUrl
     *            {@link String} URL saved for the contact
     * @return {@link String} Id of LinkedIn or Twitter
     */
    @Path("getidbyurl/{widget-id}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public String getSocialIdByUrl(@PathParam("widget-id") Long widgetId,
	    @FormParam("web_url") String webUrl)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Calls LinkedUtil method to send message to person by socialId
	     */
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.getIdByUrl(widget, webUrl);

	    // Calls TwitterUtil method to send message to person by socialId
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getTwitterIdByUrl(widget, webUrl);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    // Get widget
    /**
     * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
     * given in widget and fetches profile of the contact in LinkedIn or Twitter
     * based on the parameter social id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @return {@link SocialSearchResult}
     */
    @Path("profile/{widget-id}/{social-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public SocialSearchResult getSocialProfileById(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId)
    {
	// Gets widget based on id
	Widget widget = WidgetUtil.getWidget(widgetId);

	if (widget == null)
	    return null;

	try
	{
	    // Gets profiles from LinkedInUtil based on socialId
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.getLinkedinProfileById(widget, socialId);

	    // Gets profiles from TwitterUtil based on socialId
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getTwitterProfileById(widget, socialId);
	}

	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Retrieves the experience information of a person in LinkedIn based on
     * LinkedIn id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id of the profile
     * @return {@link SocialSearchResult}
     */
    @Path("/experience/{widget-id}/{social-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public SocialSearchResult getExperienceInLinkedIn(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.getExperience(widget, socialId);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
     * given in widget and fetches the posts or tweets in LinkedIn and Twitter
     * based on the parameter social id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @return {@link List} of {@link SocialUpdateStream}
     */
    @Path("/updates/{widget-id}/{social-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialUpdateStream> getSocialNetworkUpdates(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Calls LinkedUtil method to send message to person by socialId
	     */
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.getNetworkUpdates(widget, socialId, 0, 0,
			null, null);

	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getNetworkUpdates(widget,
			Long.parseLong(socialId));

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link TwitterUtil} based on the name given in widget and
     * fetches specified number of tweets in Twitter based on the parameter
     * social id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @param tweetId
     *            {@link String} Id of the tweet after which the tweets are
     *            given
     * @param endIndex
     *            {@link String} count of tweets to be retrieved
     * @return {@link List} of {@link SocialUpdateStream}
     */
    @Path("/updates/more/{widget-id}/{social-id}/{tweet_id}/{endIndex}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialUpdateStream> getSocialNetworkUpdatesInTwitter(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId,
	    @PathParam("tweet_id") String tweetId,
	    @PathParam("endIndex") String endIndex)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    // If request is from Twitter, fetches tweets
	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getNetworkUpdates(widget,
			Long.parseLong(socialId), Long.parseLong(tweetId) - 5,
			Integer.parseInt(endIndex));

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link LinkedInUtil} based on the name given in widget and
     * fetches posts based on index in LinkedIn
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @param startIndex
     *            {@link String}
     * @param endIndex
     *            {@link String}
     * @return {@link List} of {@link SocialUpdateStream}
     */
    @Path("/updates/index/{widget-id}/{social-id}/{startIndex}/{endIndex}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialUpdateStream> getSocialNetworkUpdatesByIndex(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId,
	    @PathParam("startIndex") String startIndex,
	    @PathParam("endIndex") String endIndex)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Calls LinkedUtil method to send message to person by socialId
	     */
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.getNetworkUpdates(widget, socialId,
			Integer.parseInt(startIndex),
			Integer.parseInt(endIndex), null, null);

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link LinkedInUtil} based on the name given in widget and
     * fetches specified number of posts LinkedIn based on the parameter social
     * id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @param startIndex
     *            {@link String} start index of list of updates to be retrieved
     * @param endIndex
     *            {@link String} end index of list of updates
     * @param startDate
     *            {@link String} since which updates are retrieved
     * @param endDate
     *            {@link String} until which updates are retrieved
     * @return {@link List} of {@link SocialUpdateStream}
     */
    @Path("/updates/more/{widget-id}/{social-id}/{startIndex}/{endIndex}/{startDate}/{endDate}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialUpdateStream> getSocialNetworkUpdatesByDate(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId,
	    @PathParam("startIndex") String startIndex,
	    @PathParam("endIndex") String endIndex,
	    @PathParam("startDate") String startDate,
	    @PathParam("endDate") String endDate)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Calls LinkedUtil method to send message to person by socialId
	     */
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
	    {
		if (endDate != null)
		    endDate = String.valueOf(Integer.parseInt(endDate) - 5);
		return LinkedInUtil.getNetworkUpdates(widget, socialId,
			Integer.parseInt(startIndex),
			Integer.parseInt(endIndex), startDate, endDate);
	    }

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
     * given in widget and reshares or retweets a post in LinkedIn and Twitter
     * based on the parameter social id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param shareId
     *            {@link String} Id of the tweet or post in Twitter or LinkedIn
     * @param comment
     *            {@link String} Comment to be set while sharing
     * @return {@link String}
     */
    @Path("/reshare/{widget-id}/{share-id}/{comment}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String shareSocialNetworkupdates(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("share-id") String shareId,
	    @PathParam("comment") String comment)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    // Calls TwitterUtil method to send message to person by socialId
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.reshareLinkedInPost(widget, shareId,
			comment);

	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.reTweetByTweetId(widget,
			Long.parseLong(shareId));

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return "Unsuccessfull";
    }

    /**
     * Retrieves followers of a contact Twitter profile based on {@link Widget}
     * id and {@link Twitter} id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} {@link Twitter} id of the contact
     * @return {@link List} of {@link Long} {@link Twitter} IDs of followers
     */
    @Path("/followers/{widget-id}/{social-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public List<Long> getFollowersListInTwitter(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    System.out.println("in widgets api");

	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getFollowersIDs(widget, socialId);

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Retrieves {@link Twitter} IDs of Twitter profiles whom contact follows
     * based on {@link Widget} id and {@link Twitter} id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} {@link Twitter} id of the contact
     * @return {@link List} of {@link Long} {@link Twitter} IDs of following
     *         {@link Twitter} profiles of contact
     */
    @Path("/following/{widget-id}/{social-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public List<Long> getFollowingListInTwitter(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    System.out.println("in widgets api");

	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getFollowingIDs(widget, socialId);

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Retrieves {@link Twitter} profiles for {@link List} of {@link Twitter}
     * IDs provided based on {@link Widget} id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param twitterIds
     *            String {@link JSONArray} of {@link Twitter} IDs
     * @return {@link List} of {@link SocialSearchResult}
     */
    @Path("/profile/list/{widget-id}")
    @POST
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialSearchResult> getListOfProfilesByIdsInTwitter(
	    @PathParam("widget-id") Long widgetId,
	    @FormParam("twitter_ids") String twitterIds)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    System.out.println("in widgets api");

	    JSONArray twitterIdsJsonArray = new JSONArray(twitterIds);

	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getListOfProfiles(widget,
			twitterIdsJsonArray);

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Retrieves the shared connections information of a person in LinkedIn
     * based on LinkedIn id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id of the profile
     * @return {@link List} of {@link SocialSearchResult}
     */
    @Path("/shared/connections/{widget-id}/{social-id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<SocialSearchResult> getSharedConnectionsInLinkedIn(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.getSharedConnections(widget, socialId);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link LinkedInUtil} or {@link TwitterUtil} user based on the
     * name given in widget and sends an add request to contact in LinkedIn and
     * Twitter based on the parameter social id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @param subject
     *            {@link String} subject to be sent with request
     * @param message
     *            {@link String} message to be sent
     * @return {@link String}
     */
    @Path("/connect/{widget-id}/{social-id}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public String sendAddRequest(@PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId,
	    @FormParam("subject") String subject,
	    @FormParam("message") String message)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Calls LinkedUtil method to send message to person by socialId
	     */
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.connectInLinkedIn(widget, socialId,
			subject, message);

	    // Calls TwitterUtil method to send message to person by socialId
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.follow(widget, Long.parseLong(socialId));
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link LinkedInUtil} or {@link TwitterUtil} user based on the
     * name given in widget and disconnects or unfollows a contact in LinkedIn
     * and Twitter based on the parameter social id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @return {@link String}
     */
    @Path("/disconnect/{widget-id}/{social-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String unfollowInTwitter(@PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId)

    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    // Calls TwitterUtil method to send message to person by socialId
	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.unfollow(widget, Long.parseLong(socialId));
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
     * given in widget and sends a message to the contact in LinkedIn and
     * Twitter based on the parameter social id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @param subject
     *            {@link String} subject to be sent with message
     * @param message
     *            {@link String} message to be sent
     * @return {@link String}
     */
    @Path("/message/{widget-id}/{social-id}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public String sendSocialMessageBySocialId(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId,
	    @FormParam("subject") String subject,
	    @FormParam("message") String message)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Calls LinkedUtil method to send message to person by socialId
	     */
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.sendLinkedInMessageById(widget, socialId,
			subject, message);

	    // Calls TwitterUtil method to send message to person by socialId
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.sendTwitterMessageById(widget, socialId,
			message);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to {@link TwitterUtil} and sends the post or tweet in Twitter
     * based on the parameter social id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param socialId
     *            {@link String} LinkedIn id or Twitter id of the contact
     * @param message
     *            {@link String} message to send tweet
     * @return {@link String}
     */
    @Path("/tweet/{widget-id}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public String tweetInTwitter(@PathParam("widget-id") Long widgetId,
	    @FormParam("message") String message)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    /*
	     * Profiles are searched based on first and last name of contact
	     * Calls LinkedUtil method to send message to person by socialId
	     */
	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.tweetInTwitter(widget, message);

	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and try again.")
		    .build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST)
		    .entity("An error occured. Refresh and try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

}
