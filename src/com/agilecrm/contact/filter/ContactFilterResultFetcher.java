package com.agilecrm.contact.filter;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.filter.ContactFilter.DefaultFilter;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.ui.serialize.SearchRule;

/**
 * Fetches filter results for backend operations. It has similar methods as
 * iterator class.
 * 
 * @author Yaswanth
 * 
 */
public class ContactFilterResultFetcher
{
    private String cursor = null;
    private int fetched_count = 0;
    private int current_index = 0;
    private int max_fetch_size;
    private ContactFilter filter;
    private DefaultFilter systemFilter = null;
    private List<Contact> contacts;
    private boolean init_fetch = false;
    private String contact_ids = null;

    private Integer number_of_contacts;
    private Integer number_of_companies;

    /**
     * Search map
     */
    private Map<String, Object> searchMap;

    ContactFilterResultFetcher()
    {

    }

    public ContactFilterResultFetcher(long filter_id)
    {
	this.filter = ContactFilter.getContactFilter(filter_id);
    }

    public ContactFilterResultFetcher(long filter_id, int max_fetch_size)
    {
	this.filter = ContactFilter.getContactFilter(filter_id);
	this.max_fetch_size = max_fetch_size;
    }

    public ContactFilterResultFetcher(ContactFilter filter, int max_fetch_size)
    {
	this.filter = filter;
	this.max_fetch_size = max_fetch_size;
    }

    public ContactFilterResultFetcher(String filter_id, int max_fetch_size, String contact_ids, Long currentDomainUserId)
    {
	this.max_fetch_size = max_fetch_size;
	this.contact_ids = contact_ids;
	try
	{
	    Long filterId = Long.parseLong(filter_id);
	    this.filter = ContactFilter.getContactFilter(filterId);
	}
	catch (NumberFormatException e)
	{
	    if (filter_id != null)
		this.systemFilter = getSystemFilter(filter_id);
	}

	setAvailableCount();

    }

    private void setAvailableCount()
    {
	if (filter != null)
	{
	    SearchRule rule = new SearchRule();

	    // Set number of companies
	    rule.LHS = "type";
	    rule.CONDITION = SearchRule.RuleCondition.EQUALS;
	    rule.RHS = Contact.Type.COMPANY.toString();
	    filter.rules.add(rule);

	    // Set number of contacts
	    number_of_companies = filter.queryContactsCount();

	    rule.RHS = Contact.Type.PERSON.toString();
	    filter.rules.add(rule);

	    // Set number of contacts
	    number_of_contacts = filter.queryContactsCount();
	    filter.rules.remove(filter.rules.size() - 1);

	    filter.rules.remove(filter.rules.size() - 1);
	    filter.rules.add(rule);
	}
	else if (searchMap != null)
	{
	    if (searchMap.containsKey("type")
		    && Contact.Type.COMPANY.toString().equals(searchMap.get("type").toString()))
	    {
		number_of_companies = Contact.dao.getCountByProperty(searchMap);
		return;
	    }

	    number_of_contacts = Contact.dao.getCountByProperty(searchMap);
	    number_of_companies = 0;
	}

	else if (contact_ids != null)
	{
	    if (contacts.size() == 0)
	    {
		return;
	    }
	    Contact contact = contacts.get(0);
	    if (contact.type == Contact.Type.PERSON)
		number_of_contacts = contacts.size();
	    else
		number_of_companies = contacts.size();
	}

	System.out.println("total available contacts : " + number_of_contacts + " , total available companies : "
		+ number_of_companies);
    }

    public Integer getAvailableContacts()
    {
	return number_of_contacts == null ? 0 : number_of_contacts;
    }

    public int getAvailableCompanies()
    {
	return number_of_companies == null ? 0 : number_of_companies;
    }

    public int getTotalFetchedCount()
    {
	return fetched_count;
    }

    /**
     * Checks if filter is system filter
     * 
     * @param id
     * @return
     */
    private DefaultFilter getSystemFilter(String id)
    {
	searchMap = new HashMap<String, Object>();

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

	    // If requested id contains "system" in it, but it doesn't match
	    // with RECENT/LEAD/CONTACTS then return null
	    searchMap = ContactFilterUtil.getDefaultContactSearchMap(filter);
	    return filter;
	}
	// If criteria starts with '#tags/' then it splits after '#tags/' and
	// gets tag and returns contact keys
	if (id.startsWith("#tags/"))
	{
	    String[] tagCondition = id.split("/");
	    String tag = tagCondition.length > 0 ? tagCondition[1] : "";

	    try
	    {

		searchMap.put("tagsWithTime.tag", URLDecoder.decode(tag, "UTF-8"));
	    }
	    catch (UnsupportedEncodingException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    return null;
	}
	// If criteria is '#contacts' then keys of all available contacts are
	// returned
	if (id.equals("#contacts"))
	{
	    searchMap.put("type", Type.PERSON);
	    return null;
	}

	if ("Companies".equals(id))
	{
	    searchMap.put("type", Type.COMPANY);
	    return null;
	}

	if (id.equals("#companies"))
	{
	    searchMap.put("type", Type.COMPANY);
	    return null;
	}

	return null;

    }

    /**
     * Fetches next set of result based on cursor from previous set of results
     * 
     * @return
     */
    private List<Contact> fetchNextSet()
    {
	// Flag to set that fetch is done atleast once
	init_fetch = true;

	// Resets current index to 0
	current_index = 0;

	if (systemFilter != null)
	{
	    contacts = ContactFilterUtil.getContacts(systemFilter, max_fetch_size, cursor);
	    fetched_count += size();
	    setCursor();
	    return contacts;
	}
	else if (searchMap != null)
	{
	    contacts = Contact.dao.fetchAll(max_fetch_size, cursor, searchMap);
	    fetched_count += size();
	    setCursor();
	    return contacts;
	}

	else if (contact_ids != null)
	{
	    try
	    {
		contacts = ContactUtil.getContactsBulk(new JSONArray(contact_ids));

	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    return contacts;
	}

	// Fetches first 200 contacts
	Collection<Contact> contactCollection = new QueryDocument<Contact>(new ContactDocument().getIndex(),
		Contact.class).advancedSearch(filter.rules, max_fetch_size, cursor);

	if (contactCollection == null)
	{
	    cursor = null;
	    return new ArrayList<Contact>();
	}

	// Sets new cursor and returns contacts
	contacts = new ArrayList<Contact>(contactCollection);
	setCursor();
	fetched_count += size();

	return contacts;
    }

    private void setCursor()
    {
	if (size() > 0)
	    cursor = contacts.get(contacts.size() - 1).cursor;
    }

    private int size()
    {
	if (contacts == null)
	    return 0;

	return contacts.size();
    }

    private String getNewCursor()
    {
	if (size() == 0)
	{
	    cursor = null;
	    return cursor;
	}

	return contacts.get(size() - 1).cursor;

    }

    public boolean hasNextSet()
    {
	if (!init_fetch || (size() >= max_fetch_size && cursor != null))
	{
	    int size = size();
	    if (size == 0 && init_fetch)
		return false;

	    if (cursor == null)
		return true;

	    if (cursor != null && init_fetch)
		return true;

	    contacts = null;
	}

	return false;
    }

    public List<Contact> nextSet()
    {
	return fetchNextSet();
    }

    public boolean hasNext()
    {
	// If current index is less than available contacts in list, it returns
	// true so next contact will be returned from next contact
	if (current_index <= size() - 1)
	    return true;

	if (!init_fetch)
	{
	    fetchNextSet();
	    if (size() > 0)
		return true;
	    return false;
	}

	// If index reaches max available size and then it checks if there are
	// more contacts to be fetched
	if (current_index > size() - 1 && cursor != null)
	{
	    fetchNextSet();
	    if (size() > 0)
		return true;
	}

	return false;
    }

    public Contact next()
    {
	Contact contact = null;
	if (current_index < size())
	{

	    contact = contacts.get(current_index);
	    ++current_index;
	}
	return contact;
    }
}
