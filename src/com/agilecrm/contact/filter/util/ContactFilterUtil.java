package com.agilecrm.contact.filter.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;

public class ContactFilterUtil
{

    public static List<Contact> getContacts(String id, Integer count,
	    String cursor)
    {
	try
	{
	    System.out.println("cursor : " + cursor + ", count : " + count);

	    // Checks if Filter id contacts "system", which indicates the
	    // request is to load results based on the default filters provided
	    if (id.contains("system-"))
	    {
		// Seperates "system-" from id and checks the type of the filter
		// (RECETN of LEADS or CONTACTS), accordingly contacts are
		// fetched and
		// returned
		id = id.split("-")[1];

		ContactFilter.DefaultFilter filter = ContactFilter.DefaultFilter
			.valueOf(id);
		if (filter != null)
		    return ContactFilterUtil.getContacts(filter, count, cursor);

		// If requested id contains "system" in it, but it doesn't match
		// with RECENT/LEAD/CONTACTS then return null
		return null;
	    }

	    // If Request is not on default filters, then fetch Filter based on
	    // id
	    ContactFilter filter = ContactFilter.getContactFilter(Long
		    .parseLong(id));

	    System.out.println(filter);

	    // Queries based on list of search rules in the filter object
	    return new ArrayList<Contact>(filter.queryContacts(count, cursor));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Queries contacts based on the {@link ContactFilter.DefaultFilter} type.
     * 
     * @param type
     *            {@link ContactFilter.DefaultFilter}
     * @return {@link List} of {@link Contact}s
     */
    public static List<Contact> getContacts(ContactFilter.DefaultFilter type,
            Integer max, String cursor)
    {
        Objectify ofy = ObjectifyService.begin();
        Query<Contact> contact_query = ofy.query(Contact.class);
    
        // Checks the type of default filter and returns results based on the
        // filter
        if (type == ContactFilter.DefaultFilter.RECENT)
        {
            // Gets current date
            DateUtil current_date = new DateUtil(new Date());
    
            // Gets the current time, to query on contact which are created with
            // in last 24 hrs
            long current_time = current_date.getTime().getTime() / 1000;
    
            // Gets last 20 recently created. Queries for last 20 contacts
            // created prior to current time and returns list sorted based on
            // current_time
            return contact_query.filter("created_time < ", current_time)
        	    .order("-created_time").limit(20).list();
        }
        else if (type == ContactFilter.DefaultFilter.CONTACTS)
        {
            System.out.println(SessionManager.get());
    
            // Creates a DomainUser key based on current domain user id
            Key<DomainUser> userKey = null;
    
            // Creates a DomainUser key based on current domain user id

        	userKey = new Key<DomainUser>(DomainUser.class, SessionManager
        		.get().getDomainId());
    
            // Queries contacts whose owner_key is equal to current domain user
            // key
            Map<String, Object> searchMap = new HashMap<String, Object>();
            searchMap.put("owner_key", userKey);
    
            if (max != null)
        	return Contact.dao.fetchAll(max, cursor, searchMap);
    
            return Contact.dao.listByProperty(searchMap);
        }
        else if (type == ContactFilter.DefaultFilter.LEADS)
        {
            return ContactUtil.getContactsForTag("lead", max, cursor);
    
        }
    
        return null;
    }

    public static List<Key<Contact>> getContactsKeys(String id, Long userId)
    {

	// Checks if Filter id contacts "system", which indicates the
	// request is to load results based on the default filters provided
	if (id.contains("system-"))
	{
	    // Seperates "system-" from id and checks the type of the filter
	    // (RECETN of LEADS or CONTACTS), accordingly contacts are
	    // fetched and
	    // returned
	    id = id.split("-")[1];

	    ContactFilter.DefaultFilter filter = ContactFilter.DefaultFilter
		    .valueOf(id);
	    if (filter != null)
		return getContactsKeys(filter, null);

	    // If requested id contains "system" in it, but it doesn't match
	    // with RECENT/LEAD/CONTACTS then return null
	    return null;
	}

	// If Request is not on default filters, then fetch Filter based on
	// id
	ContactFilter filter = ContactFilter.getContactFilter(Long
		.parseLong(id));

	List<Key<Contact>> contactKeys = new ArrayList<Key<Contact>>();
	for (Long contactId : QueryDocument.getContactIds(filter.rules, null,
		null))
	{
	    contactKeys.add(new Key<Contact>(Contact.class, contactId));
	}
	// Queries based on list of search rules in the filter object
	return contactKeys;
    }

    public static List<Key<Contact>> getContactsKeys(
	    ContactFilter.DefaultFilter type, Long domainUserId)
    {

	// Checks the type of default filter and returns results based on the
	// filter
	if (type == ContactFilter.DefaultFilter.RECENT)
	{
	    // Gets current date
	    DateUtil current_date = new DateUtil(new Date());

	    // Gets the current time, to query on contact which are created with
	    // in last 24 hrs
	    long current_time = current_date.getTime().getTime() / 1000;

	    // Gets last 20 recently created. Queries for last 20 contacts
	    // created prior to current time and returns list sorted based on
	    // current_time

	    return Contact.dao.ofy().query(Contact.class)
		    .order("-created_time").limit(20).listKeys();

	}
	else if (type == ContactFilter.DefaultFilter.CONTACTS)
	{
	    System.out.println(SessionManager.get());

	    Key<DomainUser> userKey = null;
	    // Creates a DomainUser key based on current domain user id
	    if (SessionManager.get() != null)
		userKey = new Key<DomainUser>(DomainUser.class, SessionManager
			.get().getDomainId());
	    else if (domainUserId != null)
		userKey = new Key<DomainUser>(DomainUser.class, domainUserId);

	    // Queries contacts whose owner_key is equal to current domain user
	    // key
	    return Contact.dao.listKeysByProperty("owner_key", userKey);
	}
	else if (type == ContactFilter.DefaultFilter.LEADS)
	{
	    return Contact.dao.listKeysByProperty("tagsWithTime.tag", "lead");
	}

	return new ArrayList<Key<Contact>>();
    }
}
