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

import com.agilecrm.social.StripePluginUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>StripeWidgetsAPI</code> class includes REST calls to interact with
 * {@link StripePluginUtil} class
 * 
 * <p>
 * It is called from client side for retrieving Stripe customer details
 * </p>
 * 
 * @author Tejaswi
 * @since August 2013
 * 
 */
@Path("/api/widgets/stripe")
public class StripeWidgetsAPI
{

    /**
     * Connects to Stripe and fetches the data based on customer id.
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param customerId
     *            {@link String} id of the stripe customer
     * @return {@link String}
     */
    @Path("{widget-id}/{customerId}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getStripeCustomerDetails(@PathParam("widget-id") Long widgetId, @PathParam("customerId") String customerId)
    {
	try
	{
	    // Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    /*
	     * Calls StripePluginUtil method to retrieve customer details
	     */
	    return StripePluginUtil.getCustomerDetails(widget, customerId).toString();
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
