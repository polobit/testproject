package com.agilecrm.contact;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>ContactFilter</code> provides advanced search (Search based on a
 * criteria). It uses Document search to get the matching results based on the
 * {@link SearchRule} which includes the fields
 * 
 * <pre>
 * 	rhs	  : Field to be queried on.
 * 	condition : Condition to be applied on the field
 * 	lhs	  : value used with condition on the field
 * </pre>
 * <p>
 * <code>ContactFilter</code> provides default filters MY_LEAD (fetches
 * contacts, with current user key as owner key), RECENT (fetches last 20
 * contacts created).
 * </p>
 * <p>
 * It provides methods to fetch all filters (to show saved filter either in
 * dropdown or in filters list), Fetch filter by id (When filter is selected),
 * Fetch contacts based on default filters, Query contacts based on the search
 * condition Search
 * </p>
 * 
 * @author Yaswanth
 */
@XmlRootElement
public class ContactFilter implements Serializable
{
    // Key
    @Id
    public Long id;

    /**
     * Default filters
     */
    public enum DefaultFilter
    {
	LEADS, RECENT, CONTACTS;
    };

    /**
     * Name of the filter/Advanced search criteria
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Represents list of {@link SearchRule}, query is built on these list of
     * conditions
     */
    @NotSaved(IfDefault.class)
    @Embedded
    public List<SearchRule> rules = new ArrayList<SearchRule>();

    public static ObjectifyGenericDao<ContactFilter> dao = new ObjectifyGenericDao<ContactFilter>(
	    ContactFilter.class);

    public ContactFilter()
    {

    }

    public ContactFilter(List<SearchRule> rules)
    {
	this.rules = rules;
    }

    public ContactFilter(String name, List<SearchRule> rules)
    {
	this.name = name;
	this.rules = rules;
    }

    /**
     * Fetches {@link ContactFilter} based on the id
     * 
     * @param id
     *            {@link Long}
     * @return {@link ContactFilter}
     */
    public static ContactFilter getContactFilter(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetches list of contact filters
     * 
     * @return {@link List} of {@link ContactFilter}
     */
    public static List<ContactFilter> getAllContactFilters()
    {
	return dao.fetchAll();
    }

    /**
     * Saves {@link ContactFilter} entity
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Queries contacts based on {@link List} of {@link SearchRule} specified,
     * applying 'AND' condition on after each {@link SearchRule}. Builds a query
     * and returns search results using {@link AppengineSearch}.
     * 
     * @return {@link Collection}
     */
    @SuppressWarnings("rawtypes")
    public Collection queryContacts(Integer count, String cursor)
    {

	return AppengineSearch.getAdvacnedSearchResults(rules, count, cursor);
    }

    // Get Contacts based on system filters
    /**
     * Queries contacts based on the {@link DefaultFilter} type.
     * 
     * @param type
     *            {@link DefaultFilter}
     * @return {@link List} of {@link Contact}s
     */
    public static List<Contact> getContacts(DefaultFilter type, Integer max,
	    String cursor)
    {
	Objectify ofy = ObjectifyService.begin();
	Query<Contact> contact_query = ofy.query(Contact.class);

	// Checks the type of default filter and returns results based on the
	// filter
	if (type == DefaultFilter.RECENT)
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
	else if (type == DefaultFilter.CONTACTS)
	{
	    // Creates a DomainUser key based on current domain user id
	    Key<DomainUser> userKey = new Key<DomainUser>(DomainUser.class,
		    SessionManager.get().getDomainId());

	    // Queries contacts whose owner_key is equal to current domain user
	    // key
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("owner_key", userKey);
	    
	    if (max != null)
		return Contact.dao.fetchAll(max, cursor, searchMap);

	    return Contact.dao.listByProperty(searchMap);
	}
	else if (type == DefaultFilter.LEADS)
	{
	    return ContactUtil.getContactsForTag("lead", max, cursor);

	}

	return null;
    }
}