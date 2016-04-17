package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

@Path("/api/widgets/uservoice")
public class UservoiceWidgetAPI {

	@Path("profile/{widget-id}/{email}")
	@GET
	@Produces(MediaType.APPLICATION_JSON+ ";charset=utf-8")
	public String getPaypalProfileAndInvoices(
			@PathParam("widget-id") Long widgetId,
			@PathParam("email") String email) {
		try {

			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Retrieves user information from zendesk.
				JSONObject prefsObj = new JSONObject(widget.prefs);

				String apiKey = prefsObj.getString("uv_api_key");
				String apiSecret = prefsObj.getString("uv_secert_key");
				String domain = prefsObj.getString("uv_domain_name");

				UservoiceAPI uv = new UservoiceAPI(domain, apiKey, apiSecret);
				JSONObject resultObject = new JSONObject();
				JSONObject userInfo = uv.getUserInfo(email);
				String userId = null;
				try {
					userId = userInfo.getString("id");
				} catch (Exception e) {
				}

				JSONObject comments = new JSONObject("{}");
				if (userId != null) {
					comments = uv.getuserComments(userId);
				}
				resultObject.put("userInfo", userInfo);
				resultObject.put("comments", comments);
				resultObject.put("suggestions", uv.suggestionsObject);
				return resultObject.toString();
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}
}
