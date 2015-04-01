package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

/**
 * <code>ScoreTriggerUtil</code> executes trigger when contact score hits
 * trigger score. When trigger is created for add score condition and custom
 * score is set, this trigger is said to be created. It runs respective campaign
 * set for the trigger.
 * 
 * @author Naresh
 * 
 */
public class ScoreTriggerUtil
{
    /**
     * Checks for score changes, like adding score or subtracting score. If
     * change occur then score is compared with trigger score.
     * 
     * @param oldContact
     *            Contact object before changes occur.
     * @param updatedContact
     *            Contact object with updated score.
     */
    public static void checkScoreChange(Contact oldContact, Contact updatedContact)
    {
	System.out.println("Score of updated contact: " + updatedContact.lead_score + "Score of old: " + oldContact.lead_score);

	if (updatedContact.lead_score == oldContact.lead_score)
	{
	    return;
	}

	executeTriggerForScore(updatedContact, oldContact.lead_score, updatedContact.lead_score);
    }

    /**
     * Executes trigger if score of contact hits trigger custom score. If
     * trigger score is within the range of old score and new score then trigger
     * for this condition fires.
     * 
     * @param contact
     *            Contact object at that instance.
     * @param oldScore
     *            Contact score before changes.
     * @param newScore
     *            Contact score after changes.
     */
    public static void executeTriggerForScore(Contact contact, Integer oldScore, Integer newScore)
    {
	List<Trigger> triggersList = null;

	/*
	 * Converts contact object to list,to send contact as list parameter to
	 * WorkflowUtil so that executeCampaign is called in TaskletManager
	 * having deferredTask.
	 */
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	// Gets triggerslist from dao.
	Map<String, Object> conditionsMap = new HashMap<String, Object>();
	conditionsMap.put("custom_score >", oldScore);
	conditionsMap.put("custom_score <=", newScore);

	triggersList = TriggerUtil.dao.listByProperty(conditionsMap);

	if (triggersList == null)
	    return;

	try
	{
	    for (Trigger trigger : triggersList)
	    {
		WorkflowSubscribeUtil.subscribeDeferred(contactList, trigger.campaign_id);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}