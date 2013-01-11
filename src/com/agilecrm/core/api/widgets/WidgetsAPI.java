package com.agilecrm.core.api.widgets;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.LinkedInUtil;
import com.agilecrm.social.SocialSearchResult;
import com.agilecrm.social.SocialUpdateStream;
import com.agilecrm.social.TwitterUtil;
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
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
	return null;
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
    @Path("/add/{widget-id}/{social-id}/{subject}/{message}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String sendAddRequest(@PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId,
	    @PathParam("subject") String subject,
	    @PathParam("message") String message)
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
    @Path("/message/{widget-id}/{social-id}/{subject}/{message}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String sendMessage(@PathParam("widget-id") Long widgetId,
	    @PathParam("social-id") String socialId,
	    @PathParam("subject") String subject,
	    @PathParam("message") String message)
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
}