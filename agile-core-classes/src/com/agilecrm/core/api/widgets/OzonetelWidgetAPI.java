package com.agilecrm.core.api.widgets;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.social.TwilioUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.triggers.util.CallTriggerUtil;
import com.agilecrm.social.OzonetelUtil;;

@Path("/api/widgets/ozonetel")
public class OzonetelWidgetAPI {
	
	@Path("connect")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String connectOzonetel(@QueryParam("user_phone") String user_phone){
		System.out.println(user_phone);
		try{
			Widget widget = WidgetUtil.getWidget("Ozonetel");
			
			OzonetelUtil util = new OzonetelUtil(widget.getProperty("ozontel_auth_key"),widget.getProperty("agent_no"), widget.getProperty("caller_id"));
			util.connectToNumber(user_phone);
		}catch(Exception e){
			System.out.println("Exception form OzonetelWidgetAPI connectOzonetel method");
			e.printStackTrace();
		}
		return "String";
	}
}
