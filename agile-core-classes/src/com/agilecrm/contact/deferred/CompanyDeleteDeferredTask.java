package com.agilecrm.contact.deferred;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.deferred.company.CompanyUpdate;

/**
 * Deferred Task to delete company keys from all related contacts
 * 
 * @author yaswanth
 *
 */
public class CompanyDeleteDeferredTask extends CompanyUpdate
{
    private static final long serialVersionUID = 1L;

    public CompanyDeleteDeferredTask(Long contactKey, String domain)
    {
	super(contactKey, domain);
    }

    protected void processContacts(List<Contact> contacts)
    {

	if (contacts.size() == 0)
	    return;

	for (Contact contact : contacts)
	{
	    // Force search
	    contact.forceSearch = true;
	    contact.save(false);
	}
    }
}
