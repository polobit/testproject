package com.agilecrm.bulkaction.deferred;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.bulkaction.BulkActionAdaptor;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class ContactsBulkDeleteDeferredTask extends BulkActionAdaptor
{

    private ContactsBulkDeleteDeferredTask()
    {

    }

    public ContactsBulkDeleteDeferredTask(Long domainUserId, String namespace, Set<Key<Contact>> contactKeySet)
    {
	this.key = new Key<DomainUser>(DomainUser.class, domainUserId);
	this.namespace = namespace;
	this.contactKeySet = contactKeySet;
    }

    @Override
    public boolean isValidTask()
    {

	System.out.println("checking delete operation.");
	if (StringUtils.isEmpty(namespace))
	    return false;

	return true;
    }

    @Override
    protected void performAction()
    {
	System.out.println("performing operation");
	List<Contact> contacts = fetchContacts();

	ContactUtil.deleteContacts(contacts);

	if (contacts.get(0).type == Contact.Type.COMPANY)
	{
	    ContactUtil.removeCompanyReferenceFromBulk(contacts);
	}

	ContactUtil.eraseContactsCountCache();
    }

}
