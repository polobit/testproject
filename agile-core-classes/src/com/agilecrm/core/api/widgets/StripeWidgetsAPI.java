package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.social.StripePluginUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
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
public class StripeWidgetsAPI {

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
	public String getStripeCustomerDetails(
			@PathParam("widget-id") Long widgetId,
			@PathParam("customerId") String customerId) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);

			if (widget == null)
				return null;

			/*
			 * Calls StripePluginUtil method to retrieve customer details
			 */
			return StripePluginUtil.getCustomerDetails(widget, customerId)
					.toString();
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
	}

	@Path("credit/{widget-id}/{customerId}/{amount}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public boolean addCredits(@PathParam("widget-id") Long widgetId,
			@PathParam("customerId") String customerId,
			@PathParam("amount") int amount) {
		boolean status = false;
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			StripePluginUtil.addCredit(widget, customerId, amount);
			status = true;
		} catch (Exception e) {
			status = false;
			throw ExceptionUtil.catchWebException(e);
		}
		return status;
	}

}