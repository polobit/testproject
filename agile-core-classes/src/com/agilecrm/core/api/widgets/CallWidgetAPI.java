/**
 * 
 */
package com.agilecrm.core.api.widgets;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.triggers.util.CallTriggerUtil;

/**
 * @author Prakash
 * @date 13/03/2016
 *
 */

@Path("/api/call/widgets")
public class CallWidgetAPI
{

	/**
	 * Saving call info and history.
	 * call widget = twilio, Bria, Skype, Asterisk
	 * parameters : id, direction, phone, status, duration, callWidget
	 * @author Prakash
	 * @created 13/03/2016
	 * @return String
	 */
	@Path("savecallactivity")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivity(@FormParam("id") Long id,@FormParam("direction") String direction,@FormParam("phone") String phone,@FormParam("status") String status,@FormParam("duration") String duration,@FormParam("callWidget") String callWidget,@QueryParam("note_id") Long note_id) {		
	    
		Contact contact;
    	if (null != id && !(StringUtils.isBlank(phone)) && !(StringUtils.isBlank(id.toString()))){
    		contact = ContactUtil.getContact(id);
    		
    		if (direction.equalsIgnoreCase("Outgoing") || direction.equalsIgnoreCase("outbound-dial"))
    		{
    		    ActivityUtil.createLogForCalls(callWidget, phone, Call.OUTBOUND, status.toLowerCase(), duration, contact,note_id);

    		    // Trigger for outbound
    		    CallTriggerUtil.executeTriggerForCall(contact, callWidget, Call.OUTBOUND, status.toLowerCase(), duration);
    		}

    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("inbound"))
    		{
    			ActivityUtil.createLogForCalls(callWidget, phone, Call.INBOUND, status.toLowerCase(), duration, contact,note_id);

    		    // Trigger for inbound
    			 CallTriggerUtil.executeTriggerForCall(contact, callWidget, Call.INBOUND, status.toLowerCase(), duration);
    		}
    		
    	}else if(!(StringUtils.isBlank(phone))){
    		contact = ContactUtil.searchContactByPhoneNumber(phone);
    		
    		if (direction.equalsIgnoreCase("Outgoing") || direction.equalsIgnoreCase("outbound-dial"))
    		{
    			ActivityUtil.createLogForCalls(callWidget, phone, Call.OUTBOUND, status.toLowerCase(), duration, note_id);

    		    // Trigger for outbound
    			 CallTriggerUtil.executeTriggerForCall(contact, callWidget, Call.OUTBOUND, status.toLowerCase(), duration);
    		}

    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("inbound"))
    		{
    			 ActivityUtil.createLogForCalls(callWidget, phone, Call.INBOUND, status.toLowerCase(), duration, note_id);
    			 

    		    // Trigger for inbound
    		    CallTriggerUtil.executeTriggerForCall(contact, callWidget, Call.INBOUND, status.toLowerCase(), duration);
    		}
    		
    	}

		return "";
	}
	
}
