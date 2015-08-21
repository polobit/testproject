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

public class ContactsBulkTagRemoveDeferredTask extends BulkActionAdaptor
{

    private String[] tagsArray = null;

    public ContactsBulkTagRemoveDeferredTask(Long domainUserId, String namespace, Set<Key<Contact>> contactKeySet,
	    UserInfo info, String[] tagsArray)
    {
	this.key = new Key<DomainUser>(DomainUser.class, domainUserId);
	this.info = info;
	this.contactKeySet = contactKeySet;
	this.namespace = namespace;
	this.tagsArray = tagsArray;
    }

    @Override
    public boolean isValidTask()
    {
	if (StringUtils.isEmpty(namespace))
	    return false;

	if (info == null)
	    return false;

	return true;
    }

    @Override
    protected void performAction()
    {

	List<Contact> contacts = fetchContacts();

	// ContactUtil.deleteContactsbyListSupressNotification(fetcher.nextSet());
	ContactUtil.removeTagsToContactsBulk(contacts, tagsArray);
    }

}
