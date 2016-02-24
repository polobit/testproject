/**
 * 
 */
package com.agilecrm.core.api.widgets;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.workflows.triggers.util.CallTriggerUtil;

/**
 * @author Prakash
 * @date 01/11/2015
 *
 */

@Path("/api/widgets/skype")
public class SkypeWidgetAPI
{

	/**
	 * Saving call info and history.
	 * 
	 * @author Prakash
	 * @created 01/11/2015
	 * @return String
	 */
	@Path("savecallactivity")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivity(@FormParam("direction") String direction,@FormParam("phone") String phone,@FormParam("status") String status,@FormParam("duration") String duration) {		
	    
	    	if (!(StringUtils.isBlank(phone))){
	    		Contact contact = ContactUtil.searchContactByPhoneNumber(phone);

	    		if (direction.equalsIgnoreCase("Outgoing") ||  direction.equalsIgnoreCase("outbound-dial"))
	    		{
	    		    ActivityUtil.createLogForCalls("Skype", phone, Call.OUTBOUND, status.toLowerCase(), duration);

	    		    // Trigger for outbound
	    		    CallTriggerUtil.executeTriggerForCall(contact, "Skype", Call.OUTBOUND, status.toLowerCase(), duration);
	    		}

	    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("inbound"))
	    		{
	    		    ActivityUtil.createLogForCalls("Skype", phone, Call.INBOUND, status.toLowerCase(), duration);

	    		    // Trigger for inbound
	    		    CallTriggerUtil.executeTriggerForCall(contact,  "Skype", Call.INBOUND, status.toLowerCase(), duration);
	    		}
	    	}
		return "";
	}
	
	/**
	 * Saving call info and history on the basis of id.
	 * 
	 * @author Prakash
	 * @created 10-Jan-2015
	 * @return String
	 */
	@Path("savecallactivityById")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivityById(@FormParam("id") Long id,@FormParam("direction") String direction,@FormParam("phone") String phone,@FormParam("status") String status,@FormParam("duration") String duration) {		
	    
	    	if (null != id && !(StringUtils.isBlank(phone))){
	    		Contact contact = ContactUtil.getContact(id);
	    		if(null == contact){
	    			return "";
	    		}
	    		if (direction.equalsIgnoreCase("Outgoing") || direction.equalsIgnoreCase("outbound-dial"))
	    		{
	    		    ActivityUtil.createLogForCalls("Skype", phone, Call.OUTBOUND, status.toLowerCase(), duration, contact);

	    		    // Trigger for outbound
	    		    CallTriggerUtil.executeTriggerForCall(contact, "Skype", Call.OUTBOUND, status.toLowerCase(), duration);
	    		}

	    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("inbound"))
	    		{
	    			ActivityUtil.createLogForCalls("Skype", phone, Call.INBOUND, status.toLowerCase(), duration, contact);

	    		    // Trigger for inbound
	    			CallTriggerUtil.executeTriggerForCall(contact,  "Skype", Call.INBOUND, status.toLowerCase(), duration);
	    		}
	    	}
		return "";
	}
	
}
