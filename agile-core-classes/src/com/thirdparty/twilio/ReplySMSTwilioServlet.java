package com.thirdparty.twilio;

import java.io.IOException;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.widgets.util.ExceptionUtil;
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
	   
	  Contact contact=null;
	  System.out.println(request.getParameter("To"));
	  System.out.println(request.getParameter("From"));
   
	  String phoneNumber=request.getParameter("To");
	  String replyMsg=request.getParameter("Body");
	  if(!StringUtils.isBlank(phoneNumber)){
		contact = ContactUtil.searchContactByPhoneNumber(phoneNumber);
	  }
	 
	    List<Trigger> triggers = TriggerUtil.getAllTriggers();
	    for (Trigger trigger : triggers)
	    {
		if (StringUtils.equals(trigger.type.toString(), "REPLY_SMS"))
		{
		    System.out.println("trigger condition, event match ...");
		    if(!StringUtils.isBlank(replyMsg)){
			
			if (StringUtils.equals(trigger.call_disposition,replyMsg)){
			    System.out.println("Assigning campaign to contact ...");
			    WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
					new JSONObject().put("replysms", trigger));
			}
		    }    
		}
	    }		 
	   
	}
    catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(ExceptionUtils.getFullStackTrace(e));
	    return;
	}
    }
}
