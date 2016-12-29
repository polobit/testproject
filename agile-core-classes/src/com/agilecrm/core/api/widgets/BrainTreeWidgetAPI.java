package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.social.BrainTreeUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

@Path("/api/widgets/btree")
public class BrainTreeWidgetAPI {

	@Path("get/{widget-id}/{keyID}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getBainTreeDetails(@PathParam("widget-id") Long widgetId,
			@PathParam("keyID") String keyID) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);

			if (widget != null) {
				JSONObject prefsObj = new JSONObject(widget.prefs);
				String merchantId = prefsObj.getString("merchant_id");
				String publicKey = prefsObj.getString("public_key");
				String privateKey = prefsObj.getString("private_key");
				String key = prefsObj.getString("braintree_custom_field");

				BrainTreeUtil bUtil = new BrainTreeUtil(merchantId, publicKey,
						privateKey);
				JSONArray resultObj = null;
				if (key == null || key.equals("email")) {
					resultObj = bUtil.getTransactions(keyID);
				} else {
					resultObj = bUtil.getTransactionByID(keyID);
				}
				return resultObj.toString();
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}
}
