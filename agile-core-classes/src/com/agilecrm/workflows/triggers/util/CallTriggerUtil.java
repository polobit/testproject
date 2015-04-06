package com.agilecrm.workflows.triggers.util;

import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

public class CallTriggerUtil
{

    /**
     * Executes trigger for Inbound and Outbound calls
     * 
     * @param contact
     *            - Call Contact
     * @param serviceType
     *            - Twilio or sip etc
     * @param callType
     *            - INBOUND or OUTBOUND
     * @param callStatus
     *            - Twilio statuses like completed, busy etc
     */
    public static void executeTriggerForCall(Contact contact, String serviceType, String callType, String callStatus,
	    String duration)
    {

	try
	{
	    // Status according to Activity
	    callStatus = ActivityUtil.getEnumValueOfTwilioStatus(callStatus);
	    
	    System.out.println("Service type: " + serviceType + ", call type: " + callType + " and call status: "
		    + callStatus + " duration: " + duration);

	    // If not Twilio, return
	    if (!serviceType.equalsIgnoreCase(Call.SERVICE_TWILIO))
	    {
		System.out.println("Service type is not twilio..." + serviceType);
		return;
	    }

	    if (contact == null)
	    {
		System.out.println("Contact obtained in trigger call is null...");
		return;
	    }

	    // Default
	    Type type = Trigger.Type.INBOUND_CALL;

	    if (callType.equalsIgnoreCase(Call.OUTBOUND))
		type = Trigger.Type.OUTBOUND_CALL;

	    // Get call triggers
	    List<Trigger> triggers = TriggerUtil.getTriggersByCondition(type);

	    if (triggers == null || triggers.size() == 0)
		return;

	    for (Trigger trigger : triggers)
		executeCampaign(trigger, contact, callStatus, duration);

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while triggering call..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Executes campaign
     * 
     * @param trigger
     *            - Trigger set
     * @param contact
     *            - Call Contact
     * @param callStatus
     *            - Twilio status
     * @throws JSONException
     */
    public static void executeCampaign(Trigger trigger, Contact contact, String callStatus, String duration) throws JSONException
    {
	if (trigger == null)
	    return;

	System.out.println("Obtained call status is " + callStatus + " and trigger call disposition is "
	        + trigger.call_disposition);

	// Execute campaign only if call status equals
	if (trigger.call_disposition.equalsIgnoreCase("all")
	        || (callStatus != null && callStatus.equalsIgnoreCase(trigger.call_disposition)))
	{
	    WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
		    new JSONObject().put("call", getCallJSON(callStatus, duration)));
	}
    }

    private static JSONObject getCallJSON(String callStatus, String duration)
    {
	JSONObject callJSON = new JSONObject();
	try
	{
	    callJSON.put("disposition", callStatus);
	    callJSON.put("duration", duration);

	    DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
	    
	    if (domainUser != null)
		callJSON.put("agent", new JSONObject().put("name", domainUser.name).put("email", domainUser.email));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while adding call json..." + e.getMessage());

	}

	return callJSON;
    }

}
