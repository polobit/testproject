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
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.LinkedInUtil;
import com.agilecrm.social.SocialSearchResult;
import com.agilecrm.social.TwitterUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.google.appengine.api.datastore.Email;
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
     * Saves an widget, can also save custom widget by specifying script url lo
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
     * Updates an widget
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
     * Returns user LinkedIn/Twitter profile, Connects to LinkedinUtil or
     * TwitterUtil based on plugin type and fetches results based on widget id
     * to get prefs and profile id
     * 
     * @param type
     *            {@link String}
     * @param socialId
     *            {@link String}
     * @param id
     *            {@link Long}
     * @return {@link SocialSearchResult}
     */
    @Path("contact/{type}/{plugin-id}/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public SocialSearchResult getSocialProfile(@PathParam("type") String type,
	    @PathParam("plugin-id") String socialId, @PathParam("id") Long id)
    {

	// Gets widget based on id
	Widget widget = WidgetUtil.getWidget(id);
	if (widget == null)
	{
	    return null;
	}

	// If name of the widget is Linkedin then gets profile from the
	// LinkedinUtil
	if (widget.name.equalsIgnoreCase("LINKEDIN"))
	{
	    SocialSearchResult results = LinkedInUtil.getLinkedinProfileById(
		    widget, socialId);
	    return results;

	}

	// If name of the widget is Twitter then gets profile from the
	// TwitterUtil
	else if (widget.name.equalsIgnoreCase("TWITTER"))
	{
	    SocialSearchResult results = TwitterUtil.getTwitterProfileById(
		    widget, socialId);
	    return results;

	}
	return null;
    }

    // Get matching profiles for linkedin and Twitter
    /**
     * Gets matching profiles for linkedin and twitter, based on the type
     * parameter differentiates the type of request is for linkedin or twitter
     * profiles
     * 
     * @param type
     *            {@link String} type of widget linkedin/tiwtter
     * @param contactId
     *            {@link Long} cutomer id
     * @param pluginId
     *            {@link Long} plugin-id/widget id
     * @return
     */
    @Path("{type}/{id}/{plugin-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialSearchResult> getSocialResults(
	    @PathParam("type") String type, @PathParam("id") Long contactId,
	    @PathParam("plugin-id") Long pluginId)
    {
	try
	{

	    // Gets contact based on contact id, to search based on first and
	    // last name of the contact
	    Contact contact = ContactUtil.getContact(contactId);

	    // Gets Widget based on id
	    Widget widget = WidgetUtil.getWidget(pluginId);

	    // Returns null if widget doesnt exist with given plugin id
	    if (widget == null)
		return null;

	    // Gets name of the widget and checks the type of the widget
	    // (LinkedIn/twitter). Based on the name of the widget twitter or
	    // linkedin profiles are searched based on first and last name of
	    // the contact
	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
	    {
		// Returns LinkedIn profile results
		return LinkedInUtil.searchLinkedInProfiles(widget, contact);
	    }
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
	    {
		// Returns Twitter profile results
		return TwitterUtil.searchTwitterProfiles(widget, contact);
	    }
	    return null;

	}
	catch (Exception e)
	{

	    e.printStackTrace();
	}
	return null;
    }

    /**
     * Connects to Raplead and fetches information based on the email
     * 
     * @param apikey
     *            {@link String} API key given by user (from rapleaf)
     * @param email
     *            {@link Email} {@link String} email of the contact
     * @return
     */
    @Path("rapleaf/{apikey}/{email}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getRapleafDetails(@PathParam("apikey") String apikey,
	    @PathParam("email") String email)
    {
	// Return rapartive results
	return Rapleaf.getRapportiveValue(email, apikey).toString();
    }
}