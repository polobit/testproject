package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.webhooks.triggers.util.WebhookTriggerUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

/**
 * <code>ContactTriggerUtil</code> runs trigger when new contact is added. If
 * tags added along with new contact are same as triggers, then trigger tag is
 * executed.
 * <p>
 * ContactTriggerUtil is useful when email should be sent for each new contact
 * created.
 * </p>
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
    public static void executeTriggerToContact(Contact oldContact, Contact newContact)
    {
	// Check if contact is new
	if (oldContact == null)
	{
	    executeTriggerForNewContact(newContact);
	    return;
	}

	Boolean updated = newContact.isDocumentUpdateRequired(oldContact);
	if (updated)
	{
	    try
	    {
		WebhookTriggerUtil.triggerWebhook(newContact, "Contact", updated);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
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

	/*
	 * Converts contact object to list,to send contact as list parameter to
	 * WorkflowUtil so that executeCampaign is called in TaskletManager
	 * having deferredTask.
	 */
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	// Gets triggers with contact added condition
	triggersList = TriggerUtil.getTriggersByCondition(Trigger.Type.CONTACT_IS_ADDED);

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

	// Executes Trigger for tags added along with new Contact
	if (!contact.getContactTags().isEmpty())
	    TagsTriggerUtil.executeTriggerForTags(contact, contact.getContactTags());
    }
}