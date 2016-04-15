package com.agilecrm.contact.deferred.company;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

public abstract class CompanyUpdate implements DeferredTask
{
    protected Long contactId;
    protected String domain;

    protected CompanyUpdate(Long contactKey, String domain)
    {
	this.contactId = contactKey;
	this.domain = domain;
    }

    @Override
    public void run()
    {
	NamespaceManager.set(domain);
	try
	{
	    Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);
	    Map<String, Object> queryMap = new HashMap<String, Object>();
	    queryMap.put("contact_company_key", contactKey);
	    process(queryMap);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    private void process(Map<String, Object> queryMap)
    {
	List<Contact> contacts = fetchContacts(null, queryMap);

	if (contacts.size() == 0)
	    return;

	String cursor = contacts.get(contacts.size() - 1).cursor;

	do
	{
	    processContacts(contacts);

	    // Fetches next set of contacts
	    contacts = fetchContacts(cursor, queryMap);

	    // Break if contacts size is 0.
	    if (contacts.size() == 0)
		break;

	    // Gets new cursor
	    cursor = contacts.get(contacts.size() - 1).cursor;

	} while (cursor != null);

    }

    private List<Contact> fetchContacts(String cursor, Map<String, Object> queryMap)
    {
	return Contact.dao.fetchAll(50, cursor, queryMap, false, false);
    }

    protected abstract void processContacts(List<Contact> contacts);

}
