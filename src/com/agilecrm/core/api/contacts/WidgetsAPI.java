package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.Contact;
import com.agilecrm.social.LinkedInUtil;
import com.agilecrm.social.SocialSearchResult;
import com.agilecrm.social.TwitterUtil;
import com.agilecrm.widgets.Widget;
import com.thirdparty.Rapleaf;

@Path("/api/widgets")
public class WidgetsAPI
{

    // Widget
    @Path("default")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Widget> getAvailableWidgets()
    {
	return Widget.getAvailableWidgets();
    }

    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Widget> getWidgets()
    {
	return Widget.getWidgetsForCurrentUser();
    }

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Widget createWidget(Widget widget)
    {
	widget.save();
	return widget;
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Widget updateWidget(Widget widget)
    {
	widget.save();
	return widget;
    }

    @Path("positions")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void savePositions(List<Widget> widgets)
    {

	// UI sends only ID and Position
	for (Widget widget : widgets)
	{
	    Widget fullWidget = Widget.getWidget(widget.id);
	    System.out.println(fullWidget);
	    fullWidget.position = widget.position;
	    fullWidget.save();
	}
    }

    // Get widget
    @Path("contact/{type}/{plugin-id}/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public SocialSearchResult getSocialProfile(@PathParam("type") String type,
	    @PathParam("plugin-id") String socialId, @PathParam("id") String id)
    {

	Widget widget = Widget.getWidget(Long.parseLong(id));
	if (widget == null)
	{
	    return null;
	}

	if (widget.name.equalsIgnoreCase("LINKEDIN"))
	{
	    SocialSearchResult results = LinkedInUtil.getLinkedinProfileById(
		    widget, socialId);
	    return results;

	}
	else if (widget.name.equalsIgnoreCase("TWITTER"))
	{
	    SocialSearchResult results = TwitterUtil.getTwitterProfileById(
		    widget, socialId);
	    return results;

	}
	return null;
    }

    // Get matching profiles for linkedin and Twitter
    @Path("{type}/{id}/{plugin-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<SocialSearchResult> getSocialResults(
	    @PathParam("type") String type, @PathParam("id") String contactId,
	    @PathParam("plugin-id") String pluginId)
    {
	try
	{

	    Contact contact = Contact.getContact(Long.parseLong(contactId));
	    System.out.println(contact);

	    Widget widget = Widget.getWidget(Long.parseLong(pluginId));
	    if (widget == null)
	    {
		return null;
	    }
	    System.out.println(widget);

	    if (widget.name.equalsIgnoreCase("LINKEDIN"))
	    {
		return LinkedInUtil.searchLinkedInProfiles(widget, contact);
	    }
	    else if (widget.name.equalsIgnoreCase("TWITTER"))
	    {

		List<SocialSearchResult> results = TwitterUtil
			.searchTwitterProfiles(widget, contact);
		System.out.println(results);
		return results;
	    }
	    return null;

	}
	catch (Exception e)
	{

	    e.printStackTrace();
	}
	return null;
    }

    @Path("rapleaf/{apikey}/{email}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getRapleafDetails(@PathParam("apikey") String apikey,
	    @PathParam("email") String email)
    {
	return Rapleaf.getRapportiveValue(email, apikey).toString();
    }
}