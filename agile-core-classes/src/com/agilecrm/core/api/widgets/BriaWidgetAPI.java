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
 * @date 16/10/2015
 *
 */

@Path("/api/widgets/bria")
public class BriaWidgetAPI
{

	/**
	 * Saving call info and history.
	 * 
	 * @author Prakash
	 * @created 16/10/2015
	 * @return String
	 */
	@Path("savecallactivity")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivity(@FormParam("direction") String direction,@FormParam("phone") String phone,@FormParam("status") String status,@FormParam("duration") String duration) {		
	    
	    	if (!(StringUtils.isBlank(phone))){
	    		Contact contact = ContactUtil.searchContactByPhoneNumber(phone);

	    		if (direction.equalsIgnoreCase("Outgoing"))
	    		{
	    		    ActivityUtil.createLogForCalls("Bria", phone, Call.OUTBOUND, status.toLowerCase(), duration);

	    		    // Trigger for outbound
	    		    CallTriggerUtil.executeTriggerForCall(contact, "Bria", Call.OUTBOUND, status.toLowerCase(), duration);
	    		}

	    		if (direction.equalsIgnoreCase("Incoming") || direction.equalsIgnoreCase("Missed"))
	    		{
	    		    ActivityUtil.createLogForCalls("Bria", phone, Call.INBOUND, status.toLowerCase(), duration);

	    		    // Trigger for inbound
	    		    CallTriggerUtil.executeTriggerForCall(contact,  "Bria", Call.INBOUND, status.toLowerCase(), duration);
	    		}
	    	}
		return "";
	}
	
}
