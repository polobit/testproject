/**
 * 
 */
package com.agilecrm.core.api.widgets;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.ShopifyPluginUtil;
import com.agilecrm.social.StripePluginUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * @author jitendra
 *
 */
@Path("/api/widgets/shopify")
public class ShopifyWidgetAPI
{

    /**
     * Connects to Shopify and fetches the data based on customer id.
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param customerId
     *            {@link String} id of the stripe customer
     * @return {@link String}
     * @throws Exception
     * @throws IOException
     * @throws SocketTimeoutException
     */
    @Path("{widget-id}/{email}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getCustomerOrderDetails(@PathParam("widget-id") Long widgetId, @PathParam("email") String email)
	    throws SocketTimeoutException, IOException, Exception
    {

	// Retrieves widget based on its id
	Widget widget = WidgetUtil.getWidget(widgetId);

	if (widget == null)
	    return null;
	JSONArray customerOrders = new JSONArray();
	boolean customer = ShopifyPluginUtil.isCustomerExist(widget, email);
	if (customer)
	{
	    List<LinkedHashMap<String, Object>> orders;
	    orders = ShopifyPluginUtil.getCustomerOrderDetails(widget, email);
	    if (orders != null && orders.size() > 0)
	    {
		Iterator<LinkedHashMap<String, Object>> it = orders.iterator();
		while (it.hasNext())
		{

		    customerOrders.put(it.next());
		}
	    }
	}
	else
	{
	    throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND).entity("No Customer found")
		    .build());
	}

	if (customerOrders.length() > 0)
	{

	    return customerOrders.toString();
	}
	else
	{

	    throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND).entity("No Order found")
		    .build());
	}

    }

    /**
     * add new customer in shopify
     */

    @Path("add/contact/{widget-id}/{email}")
    @GET
    public void addCustomer(@PathParam("widget-id") Long widgetId, @PathParam("email") String email)
    {
	Contact contact = ContactUtil.searchContactByEmail(email);
	Widget widget = WidgetUtil.getWidget(widgetId);
	if (contact != null)
	{
	    ShopifyPluginUtil.addCustomer(widget, contact);
	}
    }

    @Path("/items/{widget-id}/{order-id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getLineItem(@PathParam("widget-id") Long widgetId, @PathParam("order-id") Long orderId)
    {

	Widget widget = WidgetUtil.getWidget(widgetId);
	LinkedHashMap<String, Object> order = ShopifyPluginUtil.getOrder(widget, orderId);
	JSONArray itemArray = new JSONArray();
	if (order != null && order.containsKey("line_items"))
	{

	    ArrayList<LinkedHashMap<String, Object>> lineItems = (ArrayList<LinkedHashMap<String, Object>>) order
		    .get("line_items");

	    Object currency = order.get("currency");

	    Iterator<LinkedHashMap<String, Object>> it = lineItems.iterator();
	    while (it.hasNext())
	    {
		LinkedHashMap<String, Object> item = it.next();
		item.put("currency", currency);
		itemArray.put(item);
	    }

	}

	return itemArray.toString();

    }

    /**
     * Retrieves customer informations
     * 
     * @param widgetId
     * @param customerId
     * @return
     */
    /*
     * @Path("/customer/{widget-id}/{customerId}")
     * 
     * @GET
     * 
     * @Produces(MediaType.TEXT_PLAIN) public String
     * getCustomerDetails(@PathParam("widget-id") Long widgetId,
     * 
     * @PathParam("customerId") String customerId) { try { // Retrieves widget
     * based on its id Widget widget = WidgetUtil.getWidget(widgetId);
     * 
     * if (widget == null) return null;
     * 
     * // return ShopifyPluginUtil.getCustomer(widget, customerId).toString();
     * 
     * }
     * 
     * catch (Exception e) { throw new
     * WebApplicationException(Response.status(Response
     * .Status.BAD_REQUEST).entity(e.getMessage()) .build()); }
     * 
     * }
     */

    /**
     * delete shopify widget
     */

    @DELETE
    public void delete()
    {
	Widget widget = WidgetUtil.getWidget("Shopify");
	if (widget != null)
	{
	    widget.delete();
	}
    }

}
