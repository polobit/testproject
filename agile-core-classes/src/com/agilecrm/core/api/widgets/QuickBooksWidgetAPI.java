package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.social.QuickBooksUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>QuickBooksWidgetAPI</code> class includes REST calls to interact with
 * {@link QuickBooksUtil} class
 * 
 * <p>
 * It is called from client side for retrieving QuickBooks customer details
 * </p>
 * 
 * @author Rajitha
 * @since May 2014
 * 
 */
@Path("/api/widgets/quickbooks")
public class QuickBooksWidgetAPI
{

    /**
     * Retrieves clients from agent's QuickBooks account based on contact email
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email of the contact
     * @return {@link String} form of {@link JSONObject}
     */
    @Path("contacts/{widget-id}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getInvoicesFromQuickBooks(@PathParam("widget-id") Long widgetId, @PathParam("email") String email)
    {
	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	{
	    return null;
	}

	QuickBooksUtil utilObj = new QuickBooksUtil(widget.getProperty("token"), widget.getProperty("secret"),
	        Globals.QUICKBOOKS_CONSUMER_KEY, Globals.QUICKBOOKS_CONSUMER_SECRET, widget.getProperty("company"));

	try
	{
	    // Calls QuickBooksUtil method to retrieve invoices
	    return utilObj.getQuickBooksProfile(email);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * Adds a client to agent's QuickBooks account based on the given parameters
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
    @Path("add/contact/{widget-id}/{first_name}/{last_name}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String addContactToQuickBooks(@PathParam("widget-id") Long widgetId,
	    @PathParam("first_name") String firstName, @PathParam("last_name") String lastName,
	    @PathParam("email") String email)
    {
	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (widget == null)
	{
	    return null;
	}
	try
	{
	    QuickBooksUtil utilObj = new QuickBooksUtil(widget.getProperty("token"), widget.getProperty("secret"),
		    Globals.QUICKBOOKS_CONSUMER_KEY, Globals.QUICKBOOKS_CONSUMER_SECRET, widget.getProperty("company"));

	    // calls XeroUtil method to add Contact to Xero account
	    return utilObj.createCustomer(firstName, lastName, email);
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
}