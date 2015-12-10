package com.agilecrm.bulkaction.deferred;

import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.bulkaction.BulkActionAdaptor;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

public class ContactsOwnerChangeDeferredTask extends BulkActionAdaptor
{

    String new_owner = null;

    public ContactsOwnerChangeDeferredTask(Long domainUserId, String namespace, Set<Key<Contact>> contactKeySet,
	    UserInfo info, String new_owner)
    {
	this.key = new Key<DomainUser>(DomainUser.class, domainUserId);
	this.info = info;
	this.contactKeySet = contactKeySet;
	this.namespace = namespace;
	this.new_owner = new_owner;
    }

    @Override
    public boolean isValidTask()
    {
	if (StringUtils.isEmpty(namespace))
	    return false;

	if (new_owner == null)
	    return false;

	return true;
    }

    @Override
    protected void performAction()
    {
	// TODO Auto-generated method stub
	ContactUtil.changeOwnerToContactsBulk(fetchContacts(), new_owner);
    }

}
