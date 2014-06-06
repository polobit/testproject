package com.agilecrm.core.api.widgets;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.social.FacebookUtil;
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
@Path("/api/widgets/facebook")
public class FacebookWidgetsApi
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
    @Path("contacts/{widget-id}/{firstname}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getStripeCustomerDetails(@PathParam("widget-id") Long widgetId, @PathParam("firstname") String firstname)
    {
	    System.out.println("am in FacebookWidgetsApi");
    	// Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    /*
	     * Calls StripePluginUtil method to retrieve customer details
	     */
	    try
	    {
	    FacebookUtil facebookUtil = new FacebookUtil();
	    String res =  facebookUtil.getContactsByEmail(widget, firstname).toString();
	    System.out.println(res);
	    return res;
	    }
	    catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	
}
    
    /**
     * Connects to Stripe and fetches the data based on customer id.
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param customerId
     *            {@link String} id of the stripe customer
     * @return {@link String}
     */
    @Path("userProfile/{widget-id}/{id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getFacebookUserById(@PathParam("widget-id") Long widgetId, @PathParam("id") String id)
    {
	    System.out.println("am in getFacebookUserById");
    	// Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    /*
	     * Calls StripePluginUtil method to retrieve customer details
	     */
	    try
	    {
	    FacebookUtil facebookUtil = new FacebookUtil();
	    String res =  facebookUtil.getFacebookProfileById(widget, id).toString();
	    System.out.println(res);
	    return res;
	    }
	    catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	
}
    
    /**
     * Connects to Stripe and fetches the data based on customer id.
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param customerId
     *            {@link String} id of the stripe customer
     * @return {@link String}
     */
    @Path("postonwall/{widget-id}/{id}/{message}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String postOnWall(@PathParam("widget-id") Long widgetId, @PathParam("id") String id,@PathParam("message") String message) 
    {
	    System.out.println("am in postOnWall");
    	// Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    /*
	     * Calls StripePluginUtil method to retrieve customer details
	     */
	    try
	    {
	    FacebookUtil facebookUtil = new FacebookUtil();
	    String res =  facebookUtil.postOnWall(widget, id,message).toString();
	    System.out.println(res);
	    return res;
	    }
	    catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	
}
    
    
   
}

