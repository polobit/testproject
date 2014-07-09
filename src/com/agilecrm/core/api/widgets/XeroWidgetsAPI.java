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
import com.agilecrm.social.XeroUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>XeroWidgetsAPI</code> class includes REST calls to interact with
 * {@link XeroUtil} class
 * 
 * <p>
 * It is called from client side for retrieving Xero customer details
 * </p>
 * 
 * @author Rajitha
 * @since May 2014
 * 
 */
@Path("/api/widgets/xero")
public class XeroWidgetsAPI
{

	/**
	 * Retrieves clients from agent's Xero account based on contact email
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
	public String getInvoicesFromXero(@PathParam("widget-id") Long widgetId, @PathParam("email") String email)
	{
		System.out.println("xero widgets api");
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);
		if (widget == null)
			return null;

		XeroUtil utilObj = new XeroUtil(Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID, widget.getProperty("token"),
				widget.getProperty("secret"));

		try
		{
			// Calls XeroUtil metod to retrieve invoices
			String res =utilObj.getInvoicesOfClient(widget, email);
			//System.out.println(res);
			return res;
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Adds a client to agent's Xero account based on the given parameters
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
	public String addContactToXero(@PathParam("widget-id") Long widgetId, @PathParam("first_name") String firstName,
			@PathParam("last_name") String lastName, @PathParam("email") String email)
	{
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);
		if (widget == null)
			return null;

		XeroUtil utilObj = new XeroUtil(Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID, widget.getProperty("token"),
				widget.getProperty("secret"));
		try
		{
			// calls XeroUtil method to add Contact to Xero account
			return utilObj.addContact(widget, firstName, lastName, email);
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Retrieve line items for given invoiceId
	 * @param widgetId
	 * @param invoiceId
	 * @return
	 */
	@Path("lineItems/{widget-id}/{invoiceId}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getLineItemsOfInvoice(@PathParam("widget-id") Long widgetId, @PathParam("invoiceId") String invoiceId)
	{
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);
		if (widget == null)
			return null;

		XeroUtil utilObj = new XeroUtil(Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID, widget.getProperty("token"),
				widget.getProperty("secret"));

		try
		{
			// Calls XeroUtil metod to retrieve invoices
			return utilObj.getLineItemsOfInvoice(invoiceId,widget);
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}