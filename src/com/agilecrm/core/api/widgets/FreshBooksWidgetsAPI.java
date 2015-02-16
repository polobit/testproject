package com.agilecrm.core.api.widgets;

import java.io.IOException;
import java.net.SocketTimeoutException;

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

import org.json.JSONObject;

import com.agilecrm.social.FreshBooksUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>FreshBooksWidgetsAPI</code> class includes REST calls to interact with
 * {@link FreshBooksUtil} class
 * 
 * <p>
 * It is called from client side to retrieve clients, invoices and client from
 * FreshBooks account
 * </p>
 * 
 * @author Tejaswi
 * @since August 2013
 * 
 */
@Path("/api/widgets/freshbooks")
public class FreshBooksWidgetsAPI
{

    /**
     * Retrieves clients from agent's FreshBooks account based on contact email
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email of the contact
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("clients/{widget-id}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getClientsFromFreshBooks(@PathParam("widget-id") Long widgetId, @PathParam("email") String email)
    {
	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);

	if (widget == null)
	    return null;

	try
	{
	    // Calls FreshBooksUtil method to retrieve clients
	    return FreshBooksUtil.getClients(widget, email);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
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
    @Path("invoices/{widget-id}/{client_id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getInvoicesFromFreshBooks(@PathParam("widget-id") Long widgetId, @PathParam("client_id") String clientId)
    {
	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);

	if (widget == null)
	    return null;

	try
	{
	    // Calls FreshBooksUtil method to retrieve invoices of client
	    return FreshBooksUtil.getInvoicesOfClient(widget, clientId);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
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
    @Path("items/{widget-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getItemsFromFreshBooks(@PathParam("widget-id") Long widgetId)
    {
	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);

	if (widget == null)
	    return null;

	try
	{
	    /*
	     * Calls FreshBooksUtil method to retrieve items in FreshBooks
	     * account
	     */
	    return FreshBooksUtil.getItems(widget);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Request timed out. Refresh and try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}
    }

    /**
     * Retrieves taxes to which invoices are charged for a client from agnet's
     * FreshBooks account
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("taxes/{widget-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getTaxesFromFreshBooks(@PathParam("widget-id") Long widgetId)
    {
	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);

	if (widget == null)
	    return null;

	try
	{
	    /*
	     * Calls FreshBooksUtil method to retrieve taxes in FreshBooks
	     * account
	     */
	    return FreshBooksUtil.getTaxes(widget);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
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
    @Path("add/client/{widget-id}/{first_name}/{last_name}/{email}/{organisation}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String addClientToFreshBooks(@PathParam("widget-id") Long widgetId, @PathParam("first_name") String firstName,
	    @PathParam("last_name") String lastName, @PathParam("email") String email, @PathParam("organisation") String organisation)
    {
	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);

	if (widget == null)
	    return null;

	try
	{
	    if(organisation.equals("undefined"))
		organisation = "";
	    /*
	     * Calls FreshBooksUtil method to add client items in FreshBooks
	     * account
	     */
	    return FreshBooksUtil.addClient(widget, firstName, lastName, email, organisation);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
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
    @Path("add/invoice/{widget-id}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public String addInvoiceToClientInFreshBooks(@PathParam("widget-id") Long widgetId, @FormParam("first_name") String firstName,
	    @FormParam("last_name") String lastName, @FormParam("email") String email, @FormParam("lines_info") String linesInfo)
    {
	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);

	if (widget == null)
	    return null;

	try
	{
	    /*
	     * Calls FreshBooksUtil method to add invoice in FreshBooks account
	     */
	    return FreshBooksUtil.addInvoice(widget, firstName, lastName, email, linesInfo);
	}
	catch (SocketTimeoutException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (IOException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity("An error occurred. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
	}
    }
}
