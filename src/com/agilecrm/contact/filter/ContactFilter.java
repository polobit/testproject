package com.agilecrm.contact.filter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.googlecode.objectify.annotation.Cached;
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
@Cached
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

    public static ObjectifyGenericDao<ContactFilter> dao = new ObjectifyGenericDao<ContactFilter>(ContactFilter.class);

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

	return new AppengineSearch<Contact>(Contact.class).getAdvacnedSearchResults(rules, count, cursor);
    }

    /**
     * Queries contacts based on {@link List} of {@link SearchRule} specified,
     * applying 'AND' condition on after each {@link SearchRule}. Builds a query
     * and returns the count as opposed to actual results using
     * {@link AppengineSearch}. Very useful while running query reports
     * 
     * @return {@link Collection}
     */
    public int queryContactsCount()
    {
	return new AppengineSearch<Contact>(Contact.class).getAdvancedSearchResultsCount(rules);
    }
}