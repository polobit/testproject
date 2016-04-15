package com.agilecrm.contact.email.deferred;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
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
	
	public String toEmail = null;

	public LastContactedDeferredTask(Long contactId, Long lastCampaignEmailed)
	{
		this.contactId = contactId;
		this.lastCampaignEmailed = lastCampaignEmailed;
	}
	
	public LastContactedDeferredTask(Long contactId, Long lastCampaignEmailed, String toEmail)
	{
		this.contactId = contactId;
		this.lastCampaignEmailed = lastCampaignEmailed;
		this.toEmail = toEmail;
	}

	public void run()
	{
		try
		{
			
			// To avoid campaign status completed bug
			// Thread.sleep(5000);
			
			Contact contact = ContactUtil.getContact(contactId);

			if (contact == null)
				return;

			if(!canUpdate(contact))
				return;
			
			contact.setLastCampaignEmailed(lastCampaignEmailed);
			contact.update();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured in LastContactDeferredTask..." + e.getMessage());
		}
	}

	private boolean canUpdate(Contact contact)
	{
		if(StringUtils.isBlank(toEmail))
			return false;

		List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);
			
		for(ContactField field : emails)
		{
			if(field == null)
				continue;
				
			// Update only if to email contains Contact email
			if(StringUtils.equalsIgnoreCase(Contact.EMAIL, field.name))
			{
				if(StringUtils.containsIgnoreCase(toEmail, field.value))
					return true;
			}
		}
		
		return false;
	}
}
