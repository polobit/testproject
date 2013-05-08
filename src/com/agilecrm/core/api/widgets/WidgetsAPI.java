package com.agilecrm.core.api.widgets;

import java.net.SocketTimeoutException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import twitter4j.Twitter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.FreshBooksUtil;
import com.agilecrm.social.LinkedInUtil;
import com.agilecrm.social.SocialSearchResult;
import com.agilecrm.social.SocialUpdateStream;
import com.agilecrm.social.StripePluginUtil;
import com.agilecrm.social.TwilioUtil;
import com.agilecrm.social.TwitterUtil;
import com.agilecrm.social.ZendeskUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.thirdparty.Rapleaf;

/**
 * <code>WidgetsAPI</code> class includes REST calls to interact with Widget
 * class, LinkedIn class, Twitter class to access social results
 * <p>
 * It is called from client side for Adding a widget, Searching LinkedIn/
 * Twitter profiles, Rapleaf information. Also used to show available widgets,
 * saves the position of the saved widgets in contacts details page
 * </p>
 * 
 */
@Path("/api/widgets")
public class WidgetsAPI
{

    // Widget
    /**
     * Gets list of available widgets
     * 
     * @return {@link List} of {@link Widget}
     */
    @Path("default")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Widget> getAvailableWidgets()
    {
	return WidgetUtil.getAvailableWidgets();
    }

    /**
     * Gets List of widgets added for current user
     * 
     * @return {@link List} of {@link Widget}
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Widget> getWidgets()
    {
	// Returns list of widgets saved by current user
	return WidgetUtil.getWidgetsForCurrentUser();
    }

    /**
     * Saves a widget, can also save custom widget by specifying script url to
     * load and prefs to connect.
     * 
     * @param widget
     *            {@link Widget}
     * @return {@link Widget}
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Widget createWidget(Widget widget)
    {
	widget.save();
	return widget;
    }

    /**
     * Updates a widget
     * 
     * @param widget
     *            {@link Widget}
     * @return {@link Widget}
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Widget updateWidget(Widget widget)
    {
	widget.save();
	return widget;
    }

    /**
     * Deletes an widget based on widget name
     * 
     * @param widget_name
     *            {@link String}
     */
    @Path("{widget_name}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteWidget(@PathParam("widget_name") String widget_name)
    {
	// Deletes widget based on name
	WidgetUtil.getWidget(widget_name).delete();
    }

    /**
     * Saves position of widget, used to show widgets in order according to
     * position ascending order
     * 
     * @param widgets
     *            {@link List} of {@link Widget}
     */
    @Path("positions")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void savePositions(List<Widget> widgets)
    {
	// UI sends only ID and Position
	for (Widget widget : widgets)
	{
	    Widget fullWidget = WidgetUtil.getWidget(widget.id);
	    System.out.println(fullWidget);
	    fullWidget.position = widget.position;
	    fullWidget.save();
	}
    }

    // Get matching profiles for linkedin and Twitter
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
    public List<SocialSearchResult> getSocialResults(
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

	    // Profiles are searched based on first and last name of contact
	    // Gets profiles from LinkedInUtil based on contact
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.searchLinkedInProfiles(widget, contact);

	    // Gets profiles from TwitterUtil based on contact
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.searchTwitterProfiles(widget, contact);
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
    public SocialSearchResult getSocialProfile(
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

	catch (Exception e)
	{
	    e.printStackTrace();

	    String error = "[invalid.profile.access].";
	    error = (e.getMessage().contains(error)) ? e.getMessage().replace(
		    error, "") : e.getMessage().trim();

	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(error).build());
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

	    System.out.println("in widgets api");
	    System.out.println(webUrl);
	    // Profiles are searched based on first and last name of contact
	    // Calls LinkedUtil method to send message to person by socialId
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.getIdByUrl(widget, webUrl);

	    // Calls TwitterUtil method to send message to person by socialId
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getTwitterIdByUrl(widget, webUrl);
	}
	catch (SocketTimeoutException e)
	{
	    return "TimeOut";
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
    public List<SocialSearchResult> getProfileListInTwitter(
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

	    // Profiles are searched based on first and last name of contact
	    // Calls LinkedUtil method to send message to person by socialId
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.sendLinkedInAddRequest(widget, socialId,
			subject, message);

	    // Calls TwitterUtil method to send message to person by socialId
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.follow(widget, Long.parseLong(socialId));
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
    public String disconnect(@PathParam("widget-id") Long widgetId,
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
    public String sendMessage(@PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId,
	    @FormParam("subject") String subject,
	    @FormParam("message") String message)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    // Profiles are searched based on first and last name of contact
	    // Calls LinkedUtil method to send message to person by socialId
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.sendLinkedInMessageById(widget, socialId,
			subject, message);

	    // Calls TwitterUtil method to send message to person by socialId
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.sendTwitterMessageById(widget, socialId,
			message);
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
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return "Unsuccessfull";
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

	    // Profiles are searched based on first and last name of contact
	    // Calls LinkedUtil method to send message to person by socialId
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
		return LinkedInUtil.getNetworkUpdates(widget, socialId);

	    else if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getNetworkUpdates(widget,
			Long.parseLong(socialId));

	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
    public List<SocialUpdateStream> getSocialNetworkUpdates(
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

	    // Profiles are searched based on first and last name of contact
	    // Calls LinkedUtil method to send message to person by socialId
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
	    {
		if (endDate != null)
		    endDate = String.valueOf(Integer.parseInt(endDate) - 5);
		return LinkedInUtil.getNetworkUpdates(widget, socialId,
			Integer.parseInt(startIndex),
			Integer.parseInt(endIndex), startDate, endDate);
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
    public List<SocialUpdateStream> getSocialNetworkUpdates(
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

	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.getNetworkUpdates(widget,
			Long.parseLong(socialId), Long.parseLong(tweetId) - 5,
			Integer.parseInt(endIndex));

	}
	catch (Exception e)
	{
	    e.printStackTrace();
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

	    // Profiles are searched based on first and last name of contact
	    // Calls LinkedUtil method to send message to person by socialId
	    if (widget.name.equalsIgnoreCase("TWITTER"))
		return TwitterUtil.tweetInTwitter(widget, message);

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
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
    }

    /**
     * Connects to Rapleaf and fetches information based on the email
     * 
     * @param apikey
     *            {@link String} API key given by user from rapleaf account
     * @param email
     *            {@link String} email of the contact
     * @return {@link String}
     */
    @Path("rapleaf/{apikey}/{email}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getRapleafDetails(@PathParam("apikey") String apikey,
	    @PathParam("email") String email)
    {
	// Return rapportive results
	return Rapleaf.getRapportiveValue(email, apikey).toString();
    }

    /**
     * Connects to Stripe and fetches the data based on customer id.
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param customerId
     *            {@link String} id of the stripe customer
     * @return {@link String}
     */
    @Path("stripe/{widget-id}/{customerId}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getStripeCustomerDetails(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("customerId") String customerId)
    {

	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    return StripePluginUtil.getCustomerDetails(widget, customerId)
		    .toString();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * Retrieves Tickets from Zendesk based on the email and {@link Widget} Id
     * provided
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email of the {@link Contact}
     * @return {@link String} form of Tickets {@link JSONArray}
     */
    @Path("zendesk/get/{widget-id}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getTicketsFromZendesk(@PathParam("widget-id") Long widgetId,
	    @PathParam("email") String email)
    {

	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    return ZendeskUtil.getContactTickets(widget, email);
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * Adds a Ticket to Zendesk based on the given parameters and {@link Widget}
     * id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param name
     *            {@link String} name of the {@link Contact} to be added to
     *            Ticket
     * @param subject
     *            {@link String} subject of the Ticket to be added
     * @param email
     *            {@link String} email of the {@link Contact} to be added to
     *            Ticket
     * @param description
     *            {@link String} description of the Ticket to be added
     * @return {@link String} form of Ticket added
     */
    @Path("zendesk/add/{widget-id}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public String addTicketToZendesk(@PathParam("widget-id") Long widgetId,
	    @FormParam("name") String name,
	    @FormParam("subject") String subject,
	    @FormParam("email") String email,
	    @FormParam("message") String description)
    {

	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    return ZendeskUtil.addTicket(widget, name, email, subject,
		    description);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * Updates an existing Ticket in Zendesk based on the {@link Widget} id and
     * ticket number provided with the given description as comment
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param ticketNumber
     *            {@link String} Id of the Ticket to be updated
     * @param description
     *            {@link String} description of the Ticket to be added as
     *            comment
     * @return {@link String} form of Ticket updated
     */
    @Path("zendesk/update/{widget-id}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public String updateTicketinZendesk(@PathParam("widget-id") Long widgetId,
	    @FormParam("ticketNumber") String ticketNumber,
	    @FormParam("message") String description)
    {

	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    return ZendeskUtil.updateTicket(widget, ticketNumber, description);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * Retrieves the agent information from his Zendesk account
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("zendesk/agent/{widget-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getAgentInfo(@PathParam("widget-id") Long widgetId)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    return ZendeskUtil.getUserInfo(widget);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * Retrieves the tickets from Zendesk server based on its status for a
     * specified contact
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email of the contact
     * @param status
     *            {@link String} status of the ticket
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("zendesk/ticket/status/{widget-id}/{email}/{status}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getTicketsOnstatus(@PathParam("widget-id") Long widgetId,
	    @PathParam("email") String email, @PathParam("status") String status)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    return ZendeskUtil.getTicketsByStatus(widget, email, status);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * Retrieves the agent information based on his zendesk user name from
     * Agent's Zendesk account and open tickets based on contact email
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email of the contact
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("zendesk/profile/{widget-id}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getZendeskProfile(@PathParam("widget-id") Long widgetId,
	    @PathParam("email") String email)
    {
	try
	{
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    if (widget == null)
		return null;

	    return ZendeskUtil.getZendeskProfile(widget, email);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Connects to Twilio and fetches call logs based on the accountSID
     * 
     * @param widgetId
     *            {@link String} widget id to get {@link Widget} preferences
     * @return {@link String} form of {@link JSONArray} of call logs
     */
    @Path("twilio/call/logs/{widget-id}/{to}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getCallLogsOfTwilio(@PathParam("widget-id") Long widgetId,
	    @PathParam("to") String to)
    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;

	try
	{
	    return TwilioUtil.getCallLogs(widget, to).toString();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    /**
     * Initiates a call from agent Twilio account to the given number
     * 
     * @param widgetId
     *            {@link String} widget id to get {@link Widget} preferences
     * @param from
     *            {@link String} caller id of the phone call
     * @param to
     *            {@link String} phone number to be called
     * @param url
     *            {@link String} URL to execute when the called party answers
     * @return {@link String} form of {@link JSONObject} of call made
     */
    @Path("twilio/call/{widget-id}")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_PLAIN)
    public String makeCallFromTwilio(@PathParam("widget-id") Long widgetId,
	    @FormParam("from") String from, @FormParam("to") String to,
	    @FormParam("url") String url)

    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;
	try
	{
	    return TwilioUtil.makeCall(widget, from, to, url).toString();
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}
    }

    /**
     * Retrieves registered phone numbers from agent's Twilio account
     * 
     * @param accountsid
     * @return {@link String} form of {@link JSONArray}
     */
    @Path("twilio/numbers/{account_sid}/{from}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getOutgoingNumbersfromTwilio(
	    @PathParam("account_sid") String accountsid,
	    @PathParam("from") String from)
    {

	try
	{
	    return TwilioUtil.getOutgoingNumbers(accountsid, from);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}
    }

    /**
     * Connects to Twilio and fetches token based on the accountSID and appsid
     * 
     * @param accountSid
     *            {@link String} accountSid of agent Twilio account
     * @param appSID
     *            {@link String} appSid of agent Twilio account
     * @return {@link String} token generated from Twilio
     */
    @Path("twilio/accountsid/{accountSID}/{appSID}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getTwilioToken(@PathParam("accountSID") String accountSID,
	    @PathParam("appSID") String appSID)
    {
	if (accountSID == null)
	    return null;

	try
	{
	    return TwilioUtil.generateTwilioToken(accountSID, appSID);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    /**
     * Connects to Twilio and fetches applicaiton sid based on the accountSID
     * 
     * @param accountSid
     *            {@link String} accountSid of agent Twilio account
     * @return {@link String} token generated from Twilio
     */
    @Path("twilio/appsid/{accountSID}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getTwilioAppSid(@PathParam("accountSID") String accountSID)
    {
	if (accountSID == null)
	    return null;

	try
	{
	    return TwilioUtil.getTwilioAppSID(accountSID);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    /**
     * Retrieves clients from agent's FreshBooks account based on contact email
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email of the contact
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("freshbooks/clients/{widget-id}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getClientsFromFreshBooks(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("email") String email)
    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;
	try
	{
	    return FreshBooksUtil.getClients(widget, email);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    /**
     * Retrieves invoices of a client based on his contact client id in
     * FreshBooks from agent's FreshBooks account
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param clientId
     *            {@link String} client id of the contact
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("freshbooks/invoices/{widget-id}/{client_id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getInvoicesFromFreshBooks(
	    @PathParam("widget-id") Long widgetId,
	    @PathParam("client_id") String clientId)
    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;
	try
	{
	    return FreshBooksUtil.getInvoicesOfClient(widget, clientId);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    /**
     * Retrieves items to which invoices are added for a client from agnet's
     * FreshBooks account
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("freshbooks/items/{widget-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getItemsFromFreshBooks(@PathParam("widget-id") Long widgetId)
    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;
	try
	{
	    return FreshBooksUtil.getItems(widget);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    /**
     * Adds a client to agent's FreshBooks account based on the given parameters
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param firstName
     *            {@link String} first name of the contact
     * @param lastName
     *            {@link String} last name of the contact
     * @param email
     *            {@link String} email of the contact
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("freshbooks/add/client/{widget-id}/{first_name}/{last_name}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String addClientToFreshBooks(@PathParam("widget-id") Long widgetId,
	    @PathParam("first_name") String firstName,
	    @PathParam("last_name") String lastName,
	    @PathParam("email") String email)
    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;
	try
	{
	    return FreshBooksUtil.addClient(widget, firstName, lastName, email);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

    /**
     * Adds invoice to an existing contact in FreshBooks based on item name
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param firstName
     *            {@link String} first name of the contact
     * @param lastName
     *            {@link String} last name of the contact
     * @param email
     *            {@link String} email of the contact
     * @param itemName
     *            {@link String} name of the item
     * @param quantity
     *            {@link String} quantity of items
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("freshbooks/add/invoice/{widget-id}/{first_name}/{last_name}/{email}/{item_name}/{quantity}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String addinvoiceToClient(@PathParam("widget-id") Long widgetId,
	    @PathParam("first_name") String firstName,
	    @PathParam("last_name") String lastName,
	    @PathParam("email") String email,
	    @PathParam("item_name") String itemName,
	    @PathParam("quantity") String quantity)
    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;
	try
	{
	    return FreshBooksUtil.addInvoice(widget, firstName, lastName,
		    email, itemName, quantity);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());

	}

    }

}