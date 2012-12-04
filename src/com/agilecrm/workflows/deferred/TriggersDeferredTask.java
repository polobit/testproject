package com.agilecrm.workflows.deferred;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.TriggerUtil;
import com.agilecrm.workflows.WorkflowManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * Implements DeferredTask interface for triggers.Execute campaign with respect
 * to trigger condition and contact.
 * 
 */
@SuppressWarnings("serial")
public class TriggersDeferredTask implements DeferredTask
{

    String contactJSON;

    Long campaignId;

    /**
     * Constructs new {@link TriggersDeferredTask} with contact id and trigger
     * condition.
     * 
     * @param contactId
     *            Contact id
     * @param campaignId
     *            CampaignId of a campaign which runs with a trigger.
     */
    public TriggersDeferredTask(String contactJSON, Long campaignId)
    {

	this.contactJSON = contactJSON;
	this.campaignId = campaignId;
    }

    public void run()
    {

	Contact contact = (Contact) TriggerUtil.getEntityfromJSONString(
		contactJSON, Contact.class);

	// Check if contact is not null and campaign id is not null
	if (contact != null && campaignId != null)
	    WorkflowManager.subscribe(contact, campaignId);

    }
}
