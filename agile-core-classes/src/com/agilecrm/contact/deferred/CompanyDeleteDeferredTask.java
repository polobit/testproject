package com.agilecrm.contact.deferred;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

/**
 * Deferred Task to delete company keys from all related contacts
 * 
 * @author yaswanth
 *
 */
public class CompanyDeleteDeferredTask implements DeferredTask
{

    private Long contactId;
    private String domain;
    private static final long serialVersionUID = 1L;

    public CompanyDeleteDeferredTask(String companyName, Long contactKey, String domain)
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

    private void processContacts(List<Contact> contacts)
    {
	for (Contact contact : contacts)
	{
	    // Force search
	    contact.forceSearch = true;
	    contact.save(false);
	}
    }

    private List<Contact> fetchContacts(String cursor, Map<String, Object> queryMap)
    {
	return Contact.dao.fetchAll(50, cursor, queryMap, false, false);
    }
}
