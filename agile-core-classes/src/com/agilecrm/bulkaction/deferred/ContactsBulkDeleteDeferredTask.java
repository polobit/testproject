package com.agilecrm.bulkaction.deferred;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.bulkaction.BulkActionAdaptor;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class ContactsBulkDeleteDeferredTask extends BulkActionAdaptor
{

    private ContactsBulkDeleteDeferredTask()
    {

    }

    public ContactsBulkDeleteDeferredTask(Long domainUserId, String namespace, Set<Key<Contact>> contactKeySet,
	    UserInfo info)
    {
	this.key = new Key<DomainUser>(DomainUser.class, domainUserId);
	this.contactKeySet = contactKeySet;
	this.info = info;
    }

    @Override
    public boolean isValidTask()
    {
	if (StringUtils.isEmpty(namespace))
	    return false;

	return true;
    }

    @Override
    protected void performAction()
    {
	List<Contact> contacts = fetchContacts();

	ContactUtil.deleteContacts(contacts);
    }

}
