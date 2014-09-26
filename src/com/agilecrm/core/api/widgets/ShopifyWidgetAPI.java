/**
 * 
 */
package com.agilecrm.core.api.widgets;

import java.io.IOException;
import java.net.SocketTimeoutException;
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
     */
    @Path("{widget-id}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public JSONArray getCustomerOrderDetails(@PathParam("widget-id") Long widgetId, @PathParam("email") String email)
    {
	try
	{
	    // Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);
	    String shopName = widget.getProperty("shop");

	    if (widget == null)
		return null;
	    JSONArray customerOrders = new JSONArray();

	    List<LinkedHashMap<String, Object>> orders = ShopifyPluginUtil.getCustomerOrderDetails(widget, email);

	    Iterator<LinkedHashMap<String, Object>> it = orders.iterator();
	    while (it.hasNext())
	    {
		LinkedHashMap<String, Object> order = it.next();
		order.put("shop", shopName);
		customerOrders.put(order);
	    }

	    return customerOrders;

	}

	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND).entity(e.getMessage())
		    .build());
	}

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
