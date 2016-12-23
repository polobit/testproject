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
	public String connectOzonetel(@QueryParam("user_phone") String user_phone,@QueryParam("domain_user") String domain_user){
		String status = "";
		try{
			Widget widget = WidgetUtil.getWidget("Ozonetel");
			String url = "http://kookoo.in/outbound/outbound.php";
			OzonetelUtil util = new OzonetelUtil(widget.getProperty("ozontel_auth_key"),widget.getProperty("agent_no"), widget.getProperty("caller_id"));
			status = util.connectToNumber(user_phone,url,domain_user);
			if(StringUtils.equals("failed", status)){
				url = "http://1.kookoo.in/outbound/outbound.php";
				status = util.connectToNumber(user_phone,url,domain_user);
			}
		}catch(Exception e){
			System.out.println("Exception form OzonetelWidgetAPI connectOzonetel method");
			e.printStackTrace();
			status = "failed";
		}
		return status;
	}
	
	/**
	 * Saving call info and history.
	 * 
	 * @author Rajesh
	 * @created 14/11/2016
	 * @return String
	 */
	@Path("savecallactivity")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivity(@FormParam("direction") String direction,@FormParam("phone") String phone,
			@FormParam("status") String status,@FormParam("duration") String duration,@QueryParam("note_id") Long note_id) {		
	    
	    	if (!(StringUtils.isBlank(phone))){
	    		Contact contact = ContactUtil.searchContactByPhoneNumber(phone);

	    		if (direction.equalsIgnoreCase("Outgoing") || direction.equalsIgnoreCase("outbound-dial"))
	    		{
	    		    ActivityUtil.createLogForCalls("Ozonetel", phone, Call.OUTBOUND, status.toLowerCase(), duration,note_id);

	    		    // Trigger for outbound
	    		    CallTriggerUtil.executeTriggerForCall(contact, "Ozonetel", Call.OUTBOUND, status.toLowerCase(), duration);
	    		}

	    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("Missed") || direction.equalsIgnoreCase("inbound"))
	    		{
	    		    ActivityUtil.createLogForCalls("Ozonetel", phone, Call.INBOUND, status.toLowerCase(), duration,note_id);

	    		    // Trigger for inbound
	    		    CallTriggerUtil.executeTriggerForCall(contact,  "Ozonetel", Call.INBOUND, status.toLowerCase(), duration);
	    		}
	    	}
		return "";
	}
	
	/**
	 * Saving call info and history on the basis of id.
	 * 
	 * @author Rajesh
	 * @created 14/11/2016
	 * @return String
	 */
	@Path("savecallactivityById")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivityById(@FormParam("id") Long id,@FormParam("direction") String direction,@FormParam("phone") String phone,
			@FormParam("status") String status,@FormParam("duration") String duration,@QueryParam("note_id") Long note_id) {		
	    
	    	if (null != id && !(StringUtils.isBlank(phone))){
	    		Contact contact = ContactUtil.getContact(id);
	    		if(null == contact){
	    			return "";
	    		}
	    		if (direction.equalsIgnoreCase("Outgoing") || direction.equalsIgnoreCase("outbound-dial"))
	    		{
	    		    ActivityUtil.createLogForCalls("Ozonetel", phone, Call.OUTBOUND, status.toLowerCase(), duration, contact,note_id);

	    		    // Trigger for outbound
	    		    CallTriggerUtil.executeTriggerForCall(contact, "Ozonetel", Call.OUTBOUND, status.toLowerCase(), duration);
	    		}

	    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("inbound"))
	    		{
	    			ActivityUtil.createLogForCalls("Ozonetel", phone, Call.INBOUND, status.toLowerCase(), duration, contact,note_id);

	    		    // Trigger for inbound
	    			 CallTriggerUtil.executeTriggerForCall(contact,  "Ozonetel", Call.INBOUND, status.toLowerCase(), duration);
	    		}
	    	}
		return "";
	}
}
