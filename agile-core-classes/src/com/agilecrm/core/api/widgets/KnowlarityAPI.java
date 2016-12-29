package com.agilecrm.core.api.widgets;

import java.util.List;

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
import org.json.JSONObject;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.KnowlarityUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.triggers.util.CallTriggerUtil;

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

	@Path("getLogs/{customer_number}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getLogsBasedOnNumber(
			@PathParam("customer_number") String customerNumber)
			throws Exception {
		String result = null;
		Widget widget = WidgetUtil.getWidget("Knowlarity");
		if (widget != null) {
			
		}
		return result;
	}

	/**
	 * Saving call info and history.
	 * 
	 * @author Premnath
	 * @created 28/11/2016
	 * @return String
	 */
	@Path("savecallactivity")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivity(@FormParam("direction") String direction,@FormParam("phone") String phone,
			@FormParam("status") String status,@FormParam("duration") String duration, @FormParam("uuid") String uuid, @QueryParam("note_id") Long note_id) {		
	    
	    	if (!(StringUtils.isBlank(phone))){
	    		Contact contact = ContactUtil.searchContactByPhoneNumber(phone);

	    		if (direction.equalsIgnoreCase("Outgoing") || direction.equalsIgnoreCase("outbound-dial")){
	    		    ActivityUtil.createLogForCalls("Knowlarity", phone, Call.OUTBOUND, status.toLowerCase(), duration,note_id);

	    		    // Trigger for outbound
	    		    CallTriggerUtil.executeTriggerForCall(contact, "Knowlarity", Call.OUTBOUND, status.toLowerCase(), duration);
	    		}

	    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("Missed") || direction.equalsIgnoreCase("inbound")){
	    			if(uuid != null){
		    			List<Activity> activityList = ActivityUtil.getActivityBasedOnUuid(uuid);
		    			if(activityList.size() == 0){
		    				ActivityUtil.createCallsLog("Knowlarity", phone, Call.INBOUND, status.toLowerCase(), duration,note_id, uuid);
	
		    		    	//Trigger for inbound
		    		    	CallTriggerUtil.executeTriggerForCall(contact,  "Knowlarity", Call.INBOUND, status.toLowerCase(), duration);
		    			}
	    			}
	    		}
	    	}
		return "";
	}
	
	/**
	 * Saving call info and history on the basis of id.
	 * 
	 * @author Premnath
	 * @created 28/11/2016
	 * @return String
	 */
	@Path("savecallactivityById")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivityById(@FormParam("id") Long id,@FormParam("direction") String direction,@FormParam("phone") String phone,
			@FormParam("status") String status,@FormParam("duration") String duration,@FormParam("uuid")String uuid, @QueryParam("note_id") Long note_id) {		
	    
	    	if (null != id && !(StringUtils.isBlank(phone))){
	    		Contact contact = ContactUtil.getContact(id);
	    		if(null == contact){
	    			return "";
	    		}
	    		if (direction.equalsIgnoreCase("Outgoing") || direction.equalsIgnoreCase("outbound-dial")){		    			
	    				ActivityUtil.createLogForCalls("Knowlarity", phone, Call.OUTBOUND, status.toLowerCase(), duration, contact,note_id);	    		   
	    		    	//Trigger for outbound
	    		    	CallTriggerUtil.executeTriggerForCall(contact, "Knowlarity", Call.OUTBOUND, status.toLowerCase(), duration);
	    		}

	    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("inbound")){
	    			if(uuid != null){
	    				List<Activity> activityList = ActivityUtil.getActivityBasedOnUuid(uuid);
	    				if(activityList.size() == 0){
	    					ActivityUtil.createCallsLogWithUuid("Knowlarity", phone, Call.INBOUND, status.toLowerCase(), duration, contact,note_id, uuid);
	    					//Trigger for inbound
	    					CallTriggerUtil.executeTriggerForCall(contact,  "Knowlarity", Call.INBOUND, status.toLowerCase(), duration);
	    				}
	    			}
	    		}
	    	}
		return "";
	}
}