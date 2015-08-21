package com.agilecrm.contact.filter;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.google.appengine.api.search.ScoredDocument;
import com.googlecode.objectify.Key;

public class ContactFilterIdsResultFetcher
{
    private String cursor = null;
    private int fetched_count = 0;
    private int max_fetch_set_size = 200;
    boolean init_fetch = false;

    private int max_fetch_size;

    // Filters
    private ContactFilter filter;
    private JSONArray contact_ids_json;
    private Map<String, Object> searchMap;
    private DefaultFilter systemFilter = null;

    private QueryResultIterator<Key<Contact>> iterator;

    private Long domainUserId;

    HashSet<UserAccessScopes> scopes;

    DomainUser user;

    private ContactFilterIdsResultFetcher()
    {
	super();
    }

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

    public ContactFilterIdsResultFetcher(String filter_id, String dynamic_filter, String contact_ids,
	    Map<String, Object> searchMap, int max_fetch_set_size, Long currentDomainUserId)
    {
	max_fetch_size = Integer.MAX_VALUE;

	this.searchMap = searchMap;

	this.max_fetch_set_size = max_fetch_set_size;

	domainUserId = currentDomainUserId;

	if (searchMap != null)
	{
	    iterator = getSystemFilter("_dummy");
	}

	else if (filter_id != null)
	{
	    try
	    {
		this.filter = ContactFilter.getContactFilter(Long.parseLong(filter_id));
	    }
	    catch (NumberFormatException e)
	    {
		iterator = getSystemFilter(filter_id);
		e.printStackTrace();
	    }
	}
	else if (contact_ids != null)
	{
	    try
	    {
		this.contact_ids_json = new JSONArray(contact_ids);
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	else if (StringUtils.isNotEmpty(dynamic_filter))
	{
	    try
	    {
		this.filter = ContactFilterUtil.getFilterFromJSONString(dynamic_filter);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}

	if (this.filter != null)
	{
	    modifyFilterCondition();
	    SearchRule rule = new SearchRule();
	    rule.LHS = "type";
	    rule.CONDITION = RuleCondition.EQUALS;
	    rule.RHS = filter.contact_type.toString();
	    isContacts = Type.PERSON == filter.contact_type ? true : false;
	    if (!isContacts)
		isCompany = true;

	    filter.rules.add(rule);
	}

	if (domainUserId != null)
	    BulkActionUtil.setSessionManager(domainUserId);

    }

    private DomainUser getDomainUser()
    {
	if (user == null)
	    user = DomainUserUtil.getDomainUser(domainUserId);

	return user;
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

    private void modifyFilterCondition()
    {
	UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(
		UserAccessControl.AccessControlClasses.Contact.toString(), filter.rules, getDomainUser());

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

    private Set<Key<Contact>> fetchFromDefaultfilter()
    {
	Set<Key<Contact>> contactKeys = new HashSet<Key<Contact>>();
	if (iterator != null)
	{

	    for (int i = 0; i < max_fetch_set_size && iterator.hasNext(); i++)
	    {
		contactKeys.add(iterator.next());
	    }

	    setCursor(null);

	}
	fetched_count += contactKeys.size();
	return contactKeys;
    }

    private Set<Key<Contact>> getContactIds()
    {
	Set<Key<Contact>> contactSet = new HashSet<Key<Contact>>();
	for (int i = 0; i < contact_ids_json.length(); i++)
	{
	    try
	    {
		contactSet.add(new Key<Contact>(Contact.class, contact_ids_json.getLong(i)));
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	contact_ids_json = null;
	cursor = null;
	return contactSet;
    }

    public int getTotalCount()
    {
	return fetched_count;
    }

    public int getContactCount()
    {
	if (isContact())
	    return getTotalCount();

	return 0;
    }

    public int getCompanyCount()
    {
	if (isCompany())
	    return getTotalCount();

	return 0;
    }

    private Boolean isContacts;
    private Boolean isCompany;

    private boolean isContact()
    {
	if (isContacts != null)
	    return isContacts;

	Type type = getTypeFromResults();

	if (type == Type.PERSON)
	    return (isContacts = true);

	return false;
    }

    private boolean isCompany()
    {
	if (isCompany != null)
	    return isCompany;

	Type type = getTypeFromResults();

	if (type == Type.COMPANY)
	    return (isCompany = true);

	return false;

    }

    private Type getTypeFromResults()
    {
	if (contactsSet.size() == 0)
	    return Type.PERSON;

	Iterator<Key<Contact>> iterator = contactsSet.iterator();

	while (iterator.hasNext())
	{
	    Key<Contact> contactKey = iterator.next();

	    Contact contact = ContactUtil.getContact(contactKey.getId());
	    if (contact != null)
		return contact.type;
	}

	return Type.PERSON;

    }

    QueryDocument<Contact> queryInstace = new QueryDocument<Contact>(new ContactDocument().getIndex(), Contact.class);

    /**
     * Fetches next set of result based on cursor from previous set of results
     * 
     * @return
     */
    Set<Key<Contact>> contactsSet = new HashSet<Key<Contact>>();

    private Set<Key<Contact>> fetchNextSet()
    {
	System.out.println("**fetching next set***");
	// Flag to set that fetch is done atleast once
	init_fetch = true;

	if (contact_ids_json != null)
	{
	    contactsSet = getContactIds();

	    fetched_count += contactsSet.size();
	    return contactsSet;
	}

	if (iterator != null)
	{
	    contactsSet = fetchFromDefaultfilter();
	    return contactsSet;
	}

	// Fetches first 200 contacts
	List<ScoredDocument> scoredDocuments = queryInstace.advancedSearchOnlyIds(filter, max_fetch_set_size, cursor,
		null);

	if (scoredDocuments == null || scoredDocuments.size() == 0)
	{
	    cursor = null;
	    return new HashSet<Key<Contact>>();
	}

	contactsSet = new HashSet<Key<Contact>>();

	for (ScoredDocument doc : scoredDocuments)
	{
	    try
	    {
		contactsSet.add(new Key<Contact>(Contact.class, Long.parseLong(doc.getId())));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	fetched_count += contactsSet.size();

	setCursor(scoredDocuments);

	return contactsSet;

    }

    /**
     * Checks if filter is system filter
     * 
     * @param id
     * @return
     */
    private QueryResultIterator<Key<Contact>> getSystemFilter(String id)
    {
	if (searchMap == null)
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
	}
	// If criteria starts with '#tags/' then it splits after '#tags/' and
	// gets tag and returns contact keys
	else if (id.startsWith("#tags/"))
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
	}
	// If criteria is '#contacts' then keys of all available contacts are
	// returned
	else if (id.equals("#contacts"))
	{
	    searchMap.put("type", Type.PERSON);
	}

	else if ("Companies".equals(id))
	{
	    searchMap.put("type", Type.COMPANY);
	}

	else if (id.equals("#companies"))
	{
	    searchMap.put("type", Type.COMPANY);
	}

	if (searchMap.isEmpty())
	    return null;

	modifyDAOCondition();

	return ContactFilterUtil.getContactKeysFromSearchMap(searchMap).iterator();
    }

    private void setCursor(List<ScoredDocument> scoredDocuments)
    {
	if (scoredDocuments == null)
	{
	    if (iterator != null)
		cursor = iterator.hasNext() ? "true" : null;
	}
	else if (scoredDocuments.size() > 0)
	{
	    ScoredDocument doc = scoredDocuments.get(scoredDocuments.size() - 1);
	    cursor = doc.getCursor().toWebSafeString();
	}
    }

    public boolean hasNext()
    {
	if (fetched_count > max_fetch_size)
	    return false;

	if (iterator == null && filter == null && contact_ids_json == null)
	{
	    return false;
	}

	if (contact_ids_json != null)
	    return true;

	if (!init_fetch)
	    return true;

	if (StringUtils.isEmpty(cursor))
	    return false;

	return true;
    }

    public Set<Key<Contact>> next()
    {

	if (hasNext())
	    return fetchNextSet();

	return new HashSet<Key<Contact>>();
    }

}
