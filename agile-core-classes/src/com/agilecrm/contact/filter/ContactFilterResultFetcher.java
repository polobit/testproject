package com.agilecrm.contact.filter;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.filter.ContactFilter.DefaultFilter;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.gson.JsonSyntaxException;
import com.googlecode.objectify.Key;

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
    private int max_fetch_set_size = 200;

    private int max_fetch_size;

    private ContactFilter filter;
    private DefaultFilter systemFilter = null;
    private List<Contact> contacts;
    private boolean init_fetch = false;
    private String contact_ids = null;
    private String orderBy = null;

    private Integer number_of_contacts;
    private Integer number_of_companies;

    private Long domainUserId = null;

    UserAccessControl access = null;

    private DomainUser user = null;

    private HashSet<UserAccessScopes> scopes = null;

    public void setLimits()
    {
	Subscription subscription = SubscriptionUtil.getSubscription();

	if (subscription.isFreePlan())
	{
	    max_fetch_size = 25;
	    max_fetch_set_size = 25;
	}
	else
	{
	    max_fetch_size = Integer.MAX_VALUE;
	}

    }

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

    public ContactFilterResultFetcher(long filter_id, int max_fetch_set_size)
    {
	this.filter = ContactFilter.getContactFilter(filter_id);
	this.max_fetch_set_size = max_fetch_set_size;
    }

    public ContactFilterResultFetcher(ContactFilter filter, int max_fetch_set_size)
    {
	this.filter = filter;
	this.max_fetch_set_size = max_fetch_set_size;
    }

    public ContactFilterResultFetcher(String filter_id, String dynamic_filter, int max_fetch_set_size,
	    String contact_ids, Long currentDomainUserId)
    {

	max_fetch_size = Integer.MAX_VALUE;

	this.max_fetch_set_size = max_fetch_set_size;

	this.contact_ids = contact_ids;
	domainUserId = currentDomainUserId;

	System.out.println("initializing scopes " + getDomainUser().email);
	access = UserAccessControl.getAccessControl(UserAccessControl.AccessControlClasses.Contact, null,
		getDomainUser());

	System.out.println(access.getCurrentUserScopes());

	try
	{
	    System.out.println("filter : " + filter_id);
	    Long filterId = Long.parseLong(filter_id);
	    this.filter = ContactFilter.getContactFilter(filterId);
	    if (this.filter != null)
		modifyFilterCondition();
	}
	catch (NumberFormatException e)
	{
	    if (filter_id != null)
		this.systemFilter = getSystemFilter(filter_id);
	}
	try
	{
	    if (StringUtils.isNotEmpty(dynamic_filter))
	    {
		ContactFilter contact_filter = ContactFilterUtil.getFilterFromJSONString(dynamic_filter);
		this.filter = contact_filter;
		if (this.filter != null)
		    modifyFilterCondition();
	    }
	}
	catch (JsonSyntaxException e)
	{
	    System.out.println("Exception while parsing dynamic filters for bulk operations : " + e);
	}

	BulkActionUtil.setSessionManager(domainUserId);

	setAvailableCount();

    }

    public ContactFilterResultFetcher(Map<String, Object> searchMap, String orderBy, Integer max_fetch_set_size,
	    Integer max_limit)
    {
	this.searchMap = searchMap;
	this.orderBy = orderBy;
	this.max_fetch_set_size = max_fetch_set_size;
	this.max_fetch_size = max_limit;
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

	modifyDAOCondition();

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
	System.out.println("**fetching next set***");
	// Flag to set that fetch is done atleast once
	init_fetch = true;

	// Resets current index to 0
	current_index = 0;

	if (systemFilter != null)
	{
	    contacts = ContactFilterUtil.getContacts(systemFilter, max_fetch_set_size, cursor, null);
	    fetched_count += size();
	    setCursor();
	    return contacts;
	}
	else if (searchMap != null)
	{
	    if (orderBy != null)
		contacts = Contact.dao.fetchAllByOrder(max_fetch_set_size, cursor, searchMap, true, false, orderBy);
	    else
		contacts = Contact.dao.fetchAll(max_fetch_set_size, cursor, searchMap);
	    fetched_count += size();
	    setCursor();
	    return contacts;
	}

	else if (contact_ids != null)
	{
	    System.out.println("fetching contacts");
	    try
	    {
		contacts = ContactUtil.getContactsBulk(new JSONArray(contact_ids));
		if (contacts.size() == 0)
		{
		    return contacts;
		}

		System.out.println("scopes : " + access.getCurrentUserScopes());
		System.out.println("info" + SessionManager.get());
		if (access != null
			&& !(access.hasScope(UserAccessScopes.VIEW_CONTACTS) && (access
				.hasScope(UserAccessScopes.DELETE_CONTACTS) || access
				.hasScope(UserAccessScopes.UPDATE_CONTACT))))
		{

		    Iterator<Contact> iterator = contacts.iterator();
		    while (iterator.hasNext())
		    {
			Contact contact = iterator.next();
			access.setObject(contact);
			if (!access.canDelete())
			{
			    System.out.println("Excluding contact " + contact.id);
			    iterator.remove();
			}
		    }
		}

		if (contacts.size() == 0)
		{
		    return contacts;
		}

		Contact contact = contacts.get(0);

		if (contact.type == Contact.Type.PERSON)
		    number_of_contacts = contacts.size();
		else
		    number_of_companies = contacts.size();
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    return contacts;
	}

	QueryDocument<Contact> queryInstace = new QueryDocument<Contact>(new ContactDocument().getIndex(),
		Contact.class);
	queryInstace.isBackendOperations = true;

	// Fetches first 200 contacts
	Collection<Contact> contactCollection = queryInstace.advancedSearch(filter, max_fetch_set_size, cursor, null);

	if (contactCollection == null || contactCollection.size() == 0)
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

	if ((fetched_count >= max_fetch_size))
	{
	    return false;
	}
	if (!init_fetch || cursor != null)
	// if (max_fetch_size <= fetched_count && (!init_fetch || (size() >=
	// max_fetch_set_size && cursor != null)))
	{
	    int size = size();
	    if (size == 0 && init_fetch)
		return false;

	    // For first time fetch
	    if (cursor == null)
		return true;

	    // If size is less than max fetch size, it is safe to assume that
	    // this is last set of results available in DB
	    if (size < max_fetch_set_size)
		return false;

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

    private DomainUser getDomainUser()
    {
	System.out.println("getting domain user : " + user);
	if (user != null)
	{
	    System.out.println(user.email);
	    return user;
	}

	if (domainUserId != null)
	{
	    user = DomainUserUtil.getDomainUser(domainUserId);
	    return user;
	}

	UserInfo info = SessionManager.get();
	if (info == null)
	    return (DomainUser) user;

	domainUserId = info.getDomainId();

	if (domainUserId == null)
	    return (DomainUser) user;

	return getDomainUser();
    }

    private HashSet<UserAccessScopes> getScopes()
    {
	if (scopes != null)
	    return scopes;

	getDomainUser();

	if (user == null)
	{
	    scopes = new HashSet<UserAccessScopes>(UserAccessScopes.customValues());
	    return scopes;
	}

	scopes = user.scopes;

	return scopes;
    }

    private boolean hasScope(UserAccessScopes scope)
    {
	return getScopes().contains(scope);
    }

    private void modifyDAOCondition()
    {
	if (!hasScope(UserAccessScopes.UPDATE_CONTACT) && !hasScope(UserAccessScopes.DELETE_CONTACTS))
	{
	    if (domainUserId == null)
		return;

	    Key<DomainUser> key = new Key<DomainUser>(DomainUser.class, domainUserId);
	    searchMap.put("owner_key", key);
	}
    }

    private void modifyFilterCondition()
    {
	if (hasScope(UserAccessScopes.VIEW_CONTACTS)
		&& !(hasScope(UserAccessScopes.UPDATE_CONTACT) || hasScope(UserAccessScopes.DELETE_CONTACTS)))
	{
	    if (domainUserId == null)
		return;

	    SearchRule rule = new SearchRule();
	    rule.RHS = String.valueOf(domainUserId);
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.LHS = "owner_id";

	    filter.rules.add(rule);
	}
    }
}
