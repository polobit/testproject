package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.social.KnowlarityUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

@Path("/api/widgets/knowlarity")
public class KnowlarityAPI {

	@Path("getPrefs")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String makeACall() throws Exception {
		Widget widget = WidgetUtil.getWidget("Knowlarity");
		if (widget != null) {
			JSONObject object = new JSONObject(widget.prefs);
			object.put("app_code", KnowlarityUtil.APP_ACCESS_KEY);
			return object.toString();
		}
		return null;
	}

}
