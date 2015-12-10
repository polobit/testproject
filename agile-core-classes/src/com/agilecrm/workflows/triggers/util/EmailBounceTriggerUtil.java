package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

/**
 * <code>EmailBounceTriggerUtil</code> is the utility class for email bounce
 * triggers. Executes triggers for email bounces.
 * 
 * @author naresh
 * 
 */
public class EmailBounceTriggerUtil
{

    /**
     * Executes trigger when any email bounce like soft or hard occured
     * 
     * @param contact
     *            - Contact object
     * @param triggerType
     *            -
     */
    public static void executeTriggerForBounce(Contact contact, Trigger.Type triggerType)
    {
	List<Trigger> triggersList = TriggerUtil.getTriggersByCondition(triggerType);

	/*
	 * Converts contact object to list,to send contact as list parameter to
	 * WorkflowUtil so that executeCampaign is called in TaskletManager
	 * having deferredTask.
	 */
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	if (triggersList == null)
	    return;

	try
	{
	    for (Trigger trigger : triggersList)
		WorkflowSubscribeUtil.subscribeDeferred(contactList, trigger.campaign_id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while executing bounce triggers..." + e.getMessage());
	}
    }
}
