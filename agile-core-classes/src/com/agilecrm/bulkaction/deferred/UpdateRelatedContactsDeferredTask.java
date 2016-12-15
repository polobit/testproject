package com.agilecrm.bulkaction.deferred;

import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.bulkaction.BulkActionAdaptor;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.VersioningUtil;
import com.googlecode.objectify.Key;

public class UpdateRelatedContactsDeferredTask extends BulkActionAdaptor
{

    public UpdateRelatedContactsDeferredTask(Long domainUserId, String namespace, Set<Key<Contact>> contactKeySet, UserInfo info)
    {
	this.key = new Key<DomainUser>(DomainUser.class, domainUserId);
	this.info = info;
	this.contactKeySet = contactKeySet;
	this.namespace = namespace;
    }

    @Override
    public boolean isValidTask()
    {
	if (!VersioningUtil.isDevelopmentEnv() && StringUtils.isEmpty(namespace))
	    return false;

	return true;
    }

    @Override
    protected void performAction()
    {
	ContactUtil.updateContactsBulk(fetchContacts());
    }

}
