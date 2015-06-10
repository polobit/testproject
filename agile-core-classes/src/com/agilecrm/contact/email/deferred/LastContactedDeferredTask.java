package com.agilecrm.contact.email.deferred;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class LastContactedDeferredTask implements DeferredTask
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public Long contactId = 0L;
	public Long lastCampaignEmailed = 0L;
	
	public LastContactedDeferredTask(Long contactId, Long lastCampaignEmailed)
	{
		this.contactId = contactId;
		this.lastCampaignEmailed = lastCampaignEmailed;
	}
	
	public void run()
	{
		Contact contact = ContactUtil.getContact(contactId);
		
		if(contact == null)
			return;
		
		contact.setLastCampaignEmailed(lastCampaignEmailed);
		contact.update();
	}
}
