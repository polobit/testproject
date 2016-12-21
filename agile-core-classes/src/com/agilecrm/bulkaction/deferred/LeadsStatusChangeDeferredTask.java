package com.agilecrm.bulkaction.deferred;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Category;
import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.bulkaction.BulkActionAdaptor;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.VersioningUtil;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class LeadsStatusChangeDeferredTask extends BulkActionAdaptor
{

    String new_status = null;

    public LeadsStatusChangeDeferredTask(Long domainUserId, String namespace, Set<Key<Contact>> contactKeySet,
	    UserInfo info, String new_status)
    {
	this.key = new Key<DomainUser>(DomainUser.class, domainUserId);
	this.info = info;
	this.contactKeySet = contactKeySet;
	this.namespace = namespace;
	this.new_status = new_status;
    }

    @Override
    public boolean isValidTask()
    {
	if (!VersioningUtil.isDevelopmentEnv() && StringUtils.isEmpty(namespace))
	    return false;

	if (new_status == null)
	    return false;

	return true;
    }

    @Override
    protected void performAction()
    {
    //To get lead conversion status
    CategoriesUtil categoriesUtil =new CategoriesUtil();
    Category status = categoriesUtil.getCategory(Long.valueOf(new_status));
    boolean is_conversion_status = false;
    if(status != null)
    {
    	is_conversion_status = status.getIs_conversion_flag();
    }
	ContactUtil.changeStatusToLeadsBulk(fetchContacts(), new_status, is_conversion_status);
    }

}