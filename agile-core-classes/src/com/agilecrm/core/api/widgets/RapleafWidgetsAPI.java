package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;
import com.thirdparty.Rapleaf;

/**
 * <code>RapleafWidgetsAPI</code> class includes REST calls to interact with
 * {@link Rapleaf} class
 * 
 * <p>
 * It is called from client side for retrieving details of a person using
 * Rapleaf server
 * </p>
 * 
 * @author Tejaswi
 * @since August 2013
 * 
 */
@Path("/api/widgets/rapleaf")
public class RapleafWidgetsAPI {
	/**
	 * Connects to Rapleaf and fetches information based on the email
	 * 
	 * @param apikey
	 *            {@link String} API key given by user from Rapleaf account
	 * @param email
	 *            {@link String} email of the contact
	 * @return {@link String}
	 */
	@Path("{widget-id}/{email}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getRapleafDetails(@PathParam("widget-id") Long widgetId,
			@PathParam("email") String email) {
		// Retrieves widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);
		if (widget != null) {
			try {
				// Retrieves details of persons from Rapleaf based on email
				return Rapleaf.getRapportiveValue(widget, email).toString();
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return null;
	}
}