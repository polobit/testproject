package com.agilecrm.triggers;

import java.util.List;
import java.util.Set;

import com.agilecrm.contact.Contact;
import com.agilecrm.triggers.Trigger.Type;
import com.agilecrm.triggers.deferred.ScoreDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class ContactTriggerUtil
{
    /**
     * Executes trigger when score or tag changes occurs or new contact is added
     * 
     * @param contact
     *            Contact on which changes occur
     * 
     */
    public static void executeTriggerToContact(Contact contact)
    {
	// Check if contact is new
	if (contact.id == null)
	{
	    executeTriggerForNewContact(contact);

	    if (!contact.tags.isEmpty())
		TagsTriggerUtil.executeTriggerForTags(contact, contact.tags);
	    return;

	}

	Contact oldContact = Contact.getContact(contact.id);
	checkScoreChange(oldContact, contact);
	checkTagsChange(oldContact, contact);

    }

    /**
     * Checks for score changes, like adding score or subtracting score.Executes
     * deferredtask if change occurs.
     * 
     * @param updatedContact
     *            Contact object with updated score
     * @param oldContact
     *            Contact object before changes occur
     */
    public static void checkScoreChange(Contact oldContact,
	    Contact updatedContact)
    {
	System.out.println("Score of updated contact"
		+ updatedContact.lead_score + "Score of old"
		+ oldContact.lead_score);
	if (updatedContact.lead_score == oldContact.lead_score)
	{
	    return;
	}

	String contactJSON = TriggerUtil
		.getJSONStringFromEntity(updatedContact);

	ScoreDeferredTask scoredeferredtask = new ScoreDeferredTask(
		contactJSON, oldContact.lead_score, updatedContact.lead_score);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(scoredeferredtask));

    }

    /**
     * Checks for tag changes like adding tag or deleting tag.Executes trigger
     * for tag adding or tag deleting respectively.
     * 
     * @param updatedContact
     *            Contact object after updating
     * @param oldContact
     *            Contact object before updating
     */
    public static void checkTagsChange(Contact oldContact,
	    Contact updatedContact)
    {
	Set<String> updatedTags = updatedContact.tags;
	Set<String> oldTags = oldContact.tags;

	// When tag is added,updated tags size is greater than old tags
	if (updatedTags.size() > oldTags.size())
	{

	    // Gets tag which is added
	    updatedTags.removeAll(oldTags);

	    // Executes trigger with added tags
	    TagsTriggerUtil.executeTriggerForTags(updatedContact, updatedTags,
		    Trigger.Type.TAG_IS_ADDED);

	}
	else if (updatedTags.size() < oldTags.size())
	{

	    // Gets tag which is deleted
	    oldTags.removeAll(updatedTags);

	    // Executes trigger with deleted tags
	    TagsTriggerUtil.executeTriggerForTags(updatedContact, oldTags,
		    Trigger.Type.TAG_IS_DELETED);

	}

    }

    public static void executeTriggerForNewContact(Contact contact)
    {
	List<Trigger> triggersList = null;

	try
	{
	    triggersList = TriggerUtil
		    .getTriggersByCondition(Trigger.Type.CONTACT_IS_ADDED);

	    if (triggersList != null)
	    {
		for (Trigger trigger : triggersList)

		{
		    TriggerUtil.executeTrigger(contact,
			    Long.parseLong(trigger.campaign_id));
		}

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }
}
