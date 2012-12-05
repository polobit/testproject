package com.agilecrm.triggers;

import java.util.List;
import java.util.Set;

import com.agilecrm.contact.Contact;
import com.agilecrm.triggers.Trigger.Type;

public class TagsTriggerUtil
{
    /**
     * Executes trigger when tags specified in trigger are added for a contact
     * 
     * @param contactId
     *            Contact Id for which tags are added
     * @param contactTags
     *            Contact tags
     * @param tagCondition
     *            Trigger condition for tags either Tag is added or Tag is
     *            deleted
     */

    public static void executeTriggerForTags(Contact contact,
	    Set<String> changedTags, Type tagCondition)
    {

	List<Trigger> triggersList = null;
	try
	{

	    triggersList = TriggerUtil.getTriggersByConditionAndTags(
		    tagCondition, changedTags);

	    if (triggersList != null)
	    {
		for (Trigger trigger : triggersList)
		{

		    if (trigger.custom_tags != null)
		    {

			// Execute trigger when tags are same as custom tags
			// added to a contact
			if (changedTags.containsAll(trigger.custom_tags))
			    TriggerUtil.executeTrigger(contact,
				    Long.parseLong(trigger.campaign_id));

		    }
		}

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    public static void executeTriggerForTags(Contact contact,
	    Set<String> changedTags)
    {
	executeTriggerForTags(contact, changedTags, Trigger.Type.TAG_IS_ADDED);
    }

}
