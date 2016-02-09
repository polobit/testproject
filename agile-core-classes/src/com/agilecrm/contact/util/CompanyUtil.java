package com.agilecrm.contact.util;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.deferred.company.CompanyUpdate;
import com.agilecrm.contact.deferred.tags.CompanyRenameDeferredTask;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

public class CompanyUtil
{
    public static void checkAndUpdateCompanyName(Contact oldCompany, Contact newContact)
    {
	if (StringUtils.equalsIgnoreCase(oldCompany.name, newContact.name))
	    return;

	Map<String, Object> query = new HashMap<String, Object>();

	query.put("contact_company_key", new Key<Contact>(Contact.class, oldCompany.id));

	// If there are not related contacts, deferred task in not created
	int count = Contact.dao.getCountByProperty(query);
	if (count == 0)
	    return;

	CompanyUpdate updateTask = new CompanyRenameDeferredTask(oldCompany.id, NamespaceManager.get());
	Queue queue = QueueFactory.getQueue("company-update-queue");
	queue.add(TaskOptions.Builder.withPayload(updateTask));

    }
}
