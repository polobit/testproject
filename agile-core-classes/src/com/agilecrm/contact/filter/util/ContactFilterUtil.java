package com.agilecrm.contact.filter.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.datastore.QueryResultIterable;
import com.google.gson.Gson;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;

public class ContactFilterUtil
{

    public static List<Contact> getContacts(String id, Integer count, String cursor, String orderBy)
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

		ContactFilter.DefaultFilter filter = ContactFilter.DefaultFilter.valueOf(id);
		if (filter != null)
		    return ContactFilterUtil.getContacts(filter, count, cursor, orderBy);

		// If requested id contains "system" in it, but it doesn't match
		// with RECENT/LEAD/CONTACTS then return null
		return null;
	    }

	    // If Request is not on default filters, then fetch Filter based on
	    // id
	    ContactFilter filter = ContactFilter.getContactFilter(Long.parseLong(id));

	    System.out.println(filter);
	    System.out.println(filter.rules);

	    SearchRule rule = new SearchRule();
	    rule.LHS = "type";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = filter.contact_type.toString();
	    filter.rules.add(rule);

	    // Sets ACL condition
	    UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(
		    UserAccessControl.AccessControlClasses.Contact.toString(), filter.rules, null);

	    /*
	     * if(filter.rules != null) { // Search rule to specify type is
	     * person SearchRule rule = new SearchRule(); rule.RHS = "PERSON";
	     * rule.CONDITION = RuleCondition.EQUALS; rule.LHS = "type";
	     * 
	     * filter.rules.add(rule); }
	     */

	    // Queries based on list of search rules in the filter object
	    return new ArrayList<Contact>(filter.queryContacts(count, cursor, orderBy));
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
    public static List<Contact> getContacts(ContactFilter.DefaultFilter type, Integer max, String cursor, String orderBy)
    {
	Objectify ofy = ObjectifyService.begin();
	Query<Contact> contact_query = ofy.query(Contact.class);

	// Checks the type of default filter and returns results based on the
	// filter
	if (type == ContactFilter.DefaultFilter.RECENT)
	{
	    Map<String, Object> searchMap = getDefaultContactSearchMap(type);
	    if (StringUtils.isBlank(orderBy))
	    {
		orderBy = "-created_time";
	    }
	    return Contact.dao.fetchAllByOrder(max, cursor, searchMap, true, true, orderBy);
	}

	Map<String, Object> searchMap = getDefaultContactSearchMap(type);

	return Contact.dao.fetchAllByOrder(max, cursor, searchMap, false, true, orderBy);
    }

    public static QueryResultIterable<Key<Contact>> getContactKeys(ContactFilter.DefaultFilter type)
    {
	Map<String, Object> searchMap = null;
	// Checks the type of default filter and returns results based on the
	// filter
	if (type == ContactFilter.DefaultFilter.RECENT)
	{
	    searchMap = getDefaultContactSearchMap(type);
	}

	searchMap = getDefaultContactSearchMap(type);

	return getContactKeysFromSearchMap(searchMap);
    }

    public static QueryResultIterable<Key<Contact>> getContactKeysFromSearchMap(Map<String, Object> searchMap)
    {
	Objectify ofy = ObjectifyService.begin();
	Query<Contact> contact_query = ofy.query(Contact.class);

	for (Entry<String, Object> entry : searchMap.entrySet())
	{
	    contact_query.filter(entry.getKey(), entry.getValue());
	}

	return contact_query.fetchKeys();
    }

    public static Map<String, Object> getDefaultContactSearchMap(ContactFilter.DefaultFilter type)
    {
	Map<String, Object> queryMap = new HashMap<String, Object>();
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
	    queryMap.put("created_time < ", current_time);
	    return queryMap;
	}
	else if (type == ContactFilter.DefaultFilter.CONTACTS)
	{
	    System.out.println(SessionManager.get());

	    // Creates a DomainUser key based on current domain user id
	    Key<DomainUser> userKey = null;

	    // Creates a DomainUser key based on current domain user id

	    userKey = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());

	    // Queries contacts whose owner_key is equal to current domain user
	    // key
	    queryMap.put("owner_key", userKey);
	    queryMap.put("type", Contact.Type.PERSON);
	}
	else if (type == ContactFilter.DefaultFilter.LEADS)
	{
	    queryMap.put("tagsWithTime.tag", "lead");
	}

	return queryMap;
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

	    ContactFilter.DefaultFilter filter = ContactFilter.DefaultFilter.valueOf(id);
	    if (filter != null)
		return getContactsKeys(filter, null);

	    // If requested id contains "system" in it, but it doesn't match
	    // with RECENT/LEAD/CONTACTS then return null
	    return null;
	}

	// If Request is not on default filters, then fetch Filter based on
	// id
	ContactFilter filter = ContactFilter.getContactFilter(Long.parseLong(id));

	List<Key<Contact>> contactKeys = new ArrayList<Key<Contact>>();
	for (Long contactId : new QueryDocument<Contact>(new ContactDocument().getIndex(), Contact.class)
		.getDocumentIds(filter.rules, null, null))
	{
	    contactKeys.add(new Key<Contact>(Contact.class, contactId));
	}
	// Queries based on list of search rules in the filter object
	return contactKeys;
    }

    public static List<Key<Contact>> getContactsKeys(ContactFilter.DefaultFilter type, Long domainUserId)
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

	    return Contact.dao.ofy().query(Contact.class).order("-created_time").limit(20).listKeys();

	}
	else if (type == ContactFilter.DefaultFilter.CONTACTS)
	{
	    System.out.println(SessionManager.get());

	    Key<DomainUser> userKey = null;
	    // Creates a DomainUser key based on current domain user id
	    if (SessionManager.get() != null)
		userKey = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());
	    else if (domainUserId != null)
		userKey = new Key<DomainUser>(DomainUser.class, domainUserId);

	    // Queries contacts whose owner_key is equal to current domain user
	    // key
	    Map<String, Object> queryMap = new HashMap<String, Object>();
	    queryMap.put("owner_key", userKey);
	    // Get only contacts of type person.
	    queryMap.put("type", Contact.Type.PERSON);

	    return Contact.dao.listKeysByProperty(queryMap);
	}
	else if (type == ContactFilter.DefaultFilter.LEADS)
	{
	    return Contact.dao.listKeysByProperty("tagsWithTime.tag", "lead");
	}

	return new ArrayList<Key<Contact>>();
    }

    public static ContactFilter getFilterFromJSONString(String filter)
    {
	Gson gson = new Gson();
	ContactFilter contact_filter = gson.fromJson(filter, ContactFilter.class);
	SearchRule rule = new SearchRule();
	rule.LHS = "type";
	rule.CONDITION = RuleCondition.EQUALS;
	rule.RHS = contact_filter.contact_type.toString();
	contact_filter.rules.add(rule);
	return contact_filter;
    }

    /**
     * This is to check if field label is of custom field type when send from
     * frontend to sort or query
     * 
     * @param field
     * @return
     */
    public static boolean isCustomField(String field)
    {
	return StringUtils.containsIgnoreCase(field, "_AGILE_CUSTOM_");
    }
}