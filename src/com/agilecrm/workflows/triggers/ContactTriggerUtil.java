package com.agilecrm.workflows.triggers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.WorkflowManager;

/**
 * <code>ContactTriggerUtil</code> runs trigger when new contact is added.If
 * tags added along with new contact are same as triggers,then trigger tag is
 * executed.
 * <p>
 * ContactTriggerUtil is useful when email should be sent for each new contact
 * created.
 * </p>
 * 
 * 
 * @author Naresh
 * 
 */
public class ContactTriggerUtil
{

    /**
     * Executes trigger when new contact is added and score or tag changes occur
     * within the contact.
     * 
     * @param oldContact
     *            Contact object before changes
     * @param newContact
     *            Contact object after changes
     * 
     */
    public static void executeTriggerToContact(Contact oldContact,
	    Contact newContact)
    {
	// Check if contact is new
	if (oldContact == null)
	{
	    executeTriggerForNewContact(newContact);
	    return;
	}

	ScoreTriggerUtil.checkScoreChange(oldContact, newContact);
	TagsTriggerUtil.checkTagsChange(oldContact, newContact);

    }

    /**
     * Executes trigger when new contact is added and also if tags are added to
     * new contact.
     * 
     * @param contact
     *            Contact that is newly created.
     */
    private static void executeTriggerForNewContact(Contact contact)
    {
	List<Trigger> triggersList = null;

	// Converts contact object to list,to send contact as list parameter to
	// WorkflowManager
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	// Gets triggers with contact added condition
	Map<String, Object> conditionsMap = new HashMap<String, Object>();
	conditionsMap.put("type", Trigger.Type.CONTACT_IS_ADDED);
	triggersList = TriggerUtil.dao.listByProperty(conditionsMap);

	if (triggersList.isEmpty())
	{
	    return;
	}

	try
	{

	    for (Trigger trigger : triggersList)

	    {
		WorkflowManager.subscribeDeferred(contactList,
			trigger.campaign_id);
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	if (!contact.tags.isEmpty())
	    TagsTriggerUtil.executeTriggerForTags(contact, contact.tags);

    }
}
