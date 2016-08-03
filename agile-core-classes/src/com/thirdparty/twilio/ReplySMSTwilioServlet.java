package com.thirdparty.twilio;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

@SuppressWarnings("serial")
public class ReplySMSTwilioServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	
    try
	{
	  System.out.println("this is smsurl for only replying to twilio number");
	  Contact contact  = null;	
	  System.out.println(request.getParameter("To"));
	  System.out.println(request.getParameter("From"));
	    /*List<Trigger> triggers = TriggerUtil.getAllTriggers();
	    for (Trigger trigger : triggers)
	    {
		if (StringUtils.equals(trigger.type.toString(), "REPLY_SMS"))
		{
		    System.out.println("trigger condition, event match ...");
		    if (StringUtils.equals(trigger.trigger_form_event, form.id.toString()))
		    {
			System.out.println("Assigning campaign to contact ...");
			if(!StringUtils.isBlank(phone)){
				contact = ContactUtil.searchContactByPhoneNumber(phone);
			}
			WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
				new JSONObject().put("form", formFields));
		    }
		}
	    }*/
	   
	}
    catch (Exception e)
	{
	    e.printStackTrace();
	    return;
	}
    }
}
