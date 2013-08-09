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

import com.agilecrm.social.ClickDeskUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

@Path("/api/widgets/clickdesk")
public class ClickDeskWidgetsAPI
{

    /**
     * Retrieves chats from ClickDesk server for the given email
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email for which chats re retrieved
     * @param offset
     *            Number of chats to be retrieved
     * @return {@link String} form of {@link JSONArray}
     */
    @Path("chats/{widget-id}/{email}/{offset}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public JSONArray getClickdeskChats(@PathParam("widget-id") Long widgetId,
	    @PathParam("email") String email, @PathParam("offset") String offset)
    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;

	try
	{
	    return ClickDeskUtil.getChats(widget, email, offset);
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
    }

    /**
     * Retrieves tickets from ClickDesk server for the given email
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email for which chats re retrieved
     * @param offset
     *            Number of chats to be retrieved
     * @return {@link String} form of {@link JSONArray}
     */
    @Path("tickets/{widget-id}/{email}/{offset}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public JSONArray getClickdeskTickets(@PathParam("widget-id") Long widgetId,
	    @PathParam("email") String email, @PathParam("offset") String offset)
    {
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	    return null;

	try
	{
	    return ClickDeskUtil.getTickets(widget, email, offset);
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
    }
}
