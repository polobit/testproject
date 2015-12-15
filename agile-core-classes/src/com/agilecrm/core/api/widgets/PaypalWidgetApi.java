package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

@Path("/api/widgets/paypal")
public class PaypalWidgetApi {

	@Path("{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getStripeCustomerDetails(@PathParam("widget-id") Long widgetId) {
		Widget widget = null;
		try {
			// Retrieves widget based on its id
			widget = WidgetUtil.getWidget(widgetId);

			if (widget == null)
				return null;
		} catch (Exception e) {

		}
		return "{}";
	}
}
