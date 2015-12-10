package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

/**
 * <code>TagsTriggerUtil</code> runs trigger for tag added or tag deleted.
 * Whenever tag added to contact is same as trigger tags then trigger runs for
 * tag added condition. Moreover, if deleted tag of a contact is same as trigger
 * tag, then trigger runs for tag deletion condition. TagsTriggerUtil runs
 * respective campaign for the contact when trigger fires.
 * 
 * @author Naresh
 * 
 */
/**
 * @author naresh
 *
 */
public class TagsTriggerUtil
{
    /**
     * Checks for tag changes like adding tag or deleting tag. Executes trigger
     * for tag adding or tag deleting respectively.
     * 
     * @param oldContact
     *            Contact object before updating.
     * @param updatedContact
     *            Contact object after updating.
     */
    public static void checkTagsChange(Contact oldContact, Contact updatedContact)
    {
	Set<String> oldTags = new HashSet<String>(oldContact.getContactTags());
	Set<String> updatedTags = new HashSet<String>(updatedContact.getContactTags());

	// Tags that are added newly
	Set<String> addedTags = new HashSet<String>(updatedTags);
	addedTags.removeAll(oldTags);

	if (!addedTags.isEmpty())
	{
	    // Executes trigger with added tags
	    executeTriggerForTags(updatedContact, addedTags, Trigger.Type.TAG_IS_ADDED);
	}

	// Tags that are deleted
	Set<String> deletedTags = new HashSet<String>(oldTags);
	deletedTags.removeAll(updatedTags);

	// Executes trigger with deleted tags
	if (!deletedTags.isEmpty())
	    executeTriggerForTags(updatedContact, deletedTags, Trigger.Type.TAG_IS_DELETED);
    }

    /**
     * Executes trigger when tags specified in trigger are added or deleted for
     * a contact.
     * 
     * @param contact
     *            Contact for which tags are added.
     * @param changedTags
     *            Contact tags that are added or deleted.
     * @param tagCondition
     *            Trigger condition for tags either Tag is added or Tag is
     *            deleted.
     */

    public static void executeTriggerForTags(Contact contact, Set<String> changedTags, Type tagCondition)
    {
	List<Trigger> triggersList = null;

	/*
	 * Converts contact object to list,to send contact as list parameter to
	 * WorkflowUtil so that executeCampaign is called in TaskletManager
	 * having deferredTask.
	 */
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	Set<String> tagSet = new HashSet<String>();

	// Temporary map is taken to avoid duplicate triggers
	Map<Long, Trigger> triggerMap = new HashMap<Long, Trigger>();

	for (String tag : changedTags)
	{
	    /*
	     * Adds tag to temporary set to avoid exception,as query doen't
	     * allow String object for Collection comparison
	     */
	    tagSet.add(tag);

	    // Gets triggers list based on condition and trigger tags
	    Map<String, Object> conditionsMap = new HashMap<String, Object>();
	    conditionsMap.put("type", tagCondition);
	    conditionsMap.put("custom_tags IN", tagSet);

	    triggersList = TriggerUtil.dao.listByProperty(conditionsMap);

	    for (Trigger trigger : triggersList)
		triggerMap.put(trigger.id, trigger);

	    // Removes tag from temporary set
	    tagSet.remove(tag);

	    if (triggersList.isEmpty())
		continue;
	}

	try
	{
	    for (Trigger trigger : triggerMap.values())
	    {
		WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
		        new JSONObject().put("tag", getTriggeredTagJSON(changedTags)));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * 
     * @param changedTags
     * @return
     */
    private static JSONObject getTriggeredTagJSON(Set<String> changedTags)
    {

	JSONObject json = new JSONObject();

	if (changedTags.size() == 0)
	    return json;

	try
	{
	    String tags = "";

	    for (String tag : changedTags)
		tags += (tags == "" ? "" : ',') + tag;

	    json.put("name", tags);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return json;

    }

    /**
     * Executes trigger when tags are added for a contact.
     * 
     * @param contact
     *            Contact object for which tags are added.
     * @param changedTags
     *            Tags that are added or deleted.
     */
    public static void executeTriggerForTags(Contact contact, Set<String> changedTags)
    {
	executeTriggerForTags(contact, changedTags, Trigger.Type.TAG_IS_ADDED);
    }

}