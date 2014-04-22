package com.agilecrm.core.api.widgets;

import java.io.IOException;
import java.net.SocketTimeoutException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;

import com.agilecrm.contact.Contact;
import com.agilecrm.social.HelpScoutUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>HelpScoutWidgetsAPI</code> class includes REST calls to interact with
 * {@link HelpScout} class
 * 
 * <p>
 * It is called from client side for adding, retrieving and updating tickets in
 * HelpScout
 * </p>
 * 
 * @author Saikiran
 * @since April 2014
 * 
 */
@Path("/api/widgets/helpscout")
public class HelpScoutWidgetsAPI
{

    @Path("get/{widget-id}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getCustomerByEmail(@PathParam("widget-id") Long widgetId, @PathParam("email") String email)
    {
	try
	{
	    // Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    // Calls Help Scout to retrieve tickets/Mails for contacts email
	    return HelpScoutUtil.getCustomerByEmail(widget, email);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (RuntimeException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
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
    @Path("get/{widget-id}/customer/{customer-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getConversationsFromHelpScout(@PathParam("widget-id") Long widgetId,
	    @PathParam("customer-id") int customerId)
    {
	try
	{
	    // Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    // Calls Help Scout to retrieve tickets/Mails for contacts email
	    return HelpScoutUtil.getCustomerConversations(widget, customerId);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (RuntimeException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
}
