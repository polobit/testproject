package com.agilecrm.forms;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.forms.util.FormUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;


public class FormSubmitServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	try
	{
	    response.addHeader("Access-Control-Allow-Origin", "*");
	    String formName=request.getParameter("formname");
	    String contactId=request.getParameter("contactid");
	    String formData=request.getParameter("formdata");
	    Boolean newContact=Boolean.parseBoolean(request.getParameter("new"));
	    String idCheck=request.getParameter("checkId");	    
	    
	    Form form=null;
	    JSONObject formFields = new JSONObject(formData);
	    if(idCheck.equalsIgnoreCase("true"))
		form=FormUtil.getFormById(Long.parseLong(formFields.get("_agile_form_id").toString()));
	    else
		form = FormUtil.getFormByName(formName);
	    
	    if (contactId == null || form == null)
		return;

	    Contact contact = ContactUtil.getContact(Long.parseLong(contactId));
	    contact.formId = form.id;
	    contact.save();
	    /*@Priyanka
	     * Send a mail to owner when new contact created and when it clicked 
	     * on submit button
	     * 
	     * */
	    if(form.emailNotification && newContact)
	       FormUtil.sendMailToContactOwner(contact,formName);
	    
	    List<Trigger> triggers = TriggerUtil.getAllTriggers();
	    for (Trigger trigger : triggers)
	    {
		if (StringUtils.equals(trigger.type.toString(), "FORM_SUBMIT")
			&& (newContact || !TriggerUtil.getTriggerRunStatus(trigger)))
		{
		    System.out.println("trigger condition, event match ...");
		    if (StringUtils.equals(trigger.trigger_form_event, form.id.toString()))
		    {
			System.out.println("Assigning campaign to contact ...");
			WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
				new JSONObject().put("form", formFields));
		    }
		}
	    }
	}
	catch (Exception e)
	{
	    System.out.println("Error is " + e.getMessage());
	    return;
	}
    
    }
}
