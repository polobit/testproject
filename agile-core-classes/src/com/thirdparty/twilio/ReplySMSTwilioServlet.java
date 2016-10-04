package com.thirdparty.twilio;

import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
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
	    
	    Contact contact = null;
	    String contactNumber = request.getParameter("From");
	    String replyNumber = request.getParameter("To");
	    System.out.println("contactNumber:"+contactNumber);
	    System.out.println("replyNumber:"+replyNumber);
	    String replyMsg = request.getParameter("Body");
	    if (!StringUtils.isBlank(replyMsg))
	    {
        	    if (!StringUtils.isBlank(contactNumber))
        	    {
        		contact = ContactUtil.searchContactByPhoneNumber(contactNumber);
        	    }
        	    List<Trigger> triggers = TriggerUtil.getTriggersByCondition(Trigger.Type.REPLY_SMS);
        	    for (Trigger trigger : triggers)
        	    {
        		if (trigger.sms_keyword.equalsIgnoreCase(replyMsg) && trigger.sms_reply.equalsIgnoreCase(replyNumber))
			{
			    System.out.println("Assigning campaign to contact ...");
			    WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
				    new JSONObject().put("replysms", trigger));
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
