package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.social.BrainTreeUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

@Path("/api/widgets/btree")
public class BrainTreeWidgetAPI {

	@Path("get/{widget-id}/{email}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getTicketsFromZendesk(@PathParam("widget-id") Long widgetId,
			@PathParam("email") String email) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);

			if (widget != null) {
				// Calls ZendeskUtil to retrieve tickets for contacts email
				JSONObject prefsObj = new JSONObject(widget.prefs);
				String merchantId = prefsObj.getString("merchant_id");
				String publicKey = prefsObj.getString("public_key");
				String privateKey = prefsObj.getString("private_key");

				BrainTreeUtil bUtil = new BrainTreeUtil(merchantId, publicKey,
						privateKey);
				JSONObject resultObj = bUtil.getTransactions(email);
				return resultObj.toString();
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}
}
