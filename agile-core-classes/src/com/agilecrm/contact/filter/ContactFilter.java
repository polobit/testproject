package com.agilecrm.contact.filter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.SearchFilter;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.googlecode.objectify.Key;
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
public class ContactFilter extends SearchFilter implements Serializable, Comparable<ContactFilter>
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
     * Type fo conatct filter.
     */
    @NotSaved(IfDefault.class)
    public Type contact_type = Type.PERSON;

    /******************************** New Field ********************/
    /**
     * DomainUser Id who created Filter.
     */
    @NotSaved
    public String owner_id = null;

    /**
     * Key object of DomainUser.
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> owner = null;

    /**
     * Created time of filter
     */
    public Long created_time = 0L;
    /***************************************************************/

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

    public ContactFilter(String name, List<SearchRule> rules, List<SearchRule> or_rules)
    {
	this.name = name;
	this.rules = rules;
	this.or_rules = or_rules;
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
	// Fetches all the Views
	List<ContactFilter> cotactFilters = dao.fetchAll();
	if (cotactFilters == null || cotactFilters.isEmpty())
	{
	    return cotactFilters;
	}
	Collections.sort(cotactFilters);
	return cotactFilters;
    }

    /**
     * Fetches list of contact filters
     * 
     * @return {@link List} of {@link ContactFilter}
     */
    public static List<ContactFilter> getAllContactFiltersByType(String type)
    {
	List<ContactFilter> cotactFilters = dao.fetchAll();

	List<ContactFilter> result = new ArrayList<ContactFilter>();

	for (ContactFilter filter : cotactFilters)
	{
	    if (("PERSON").equalsIgnoreCase(type) && filter.contact_type == Type.PERSON)
		result.add(filter);
	    else if (("COMPANY").equalsIgnoreCase(type) && filter.contact_type == Type.COMPANY)
		result.add(filter);
	}

	Collections.sort(result);

	return result;
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
    public Collection queryContacts(Integer count, String cursor, String orderBy)
    {

	return new AppengineSearch<Contact>(Contact.class).getAdvacnedSearchResultsForFilter(this, count, cursor,
		orderBy);
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

    @Override
    public int compareTo(ContactFilter contactFilter)
    {
	if (this.name == null && contactFilter.name != null)
	{
	    return -1;
	}
	else if (this.name != null && contactFilter.name == null)
	{
	    return 1;
	}
	else if (this.name == null && contactFilter.name == null)
	{
	    return 0;
	}
	return this.name.compareToIgnoreCase(contactFilter.name);
    }

    /******************************** New Field related method ********************/
    @JsonIgnore
    public void setOwner(Key<DomainUser> user)
    {
	owner = user;
    }

    /**
     * Gets picture of owner who created filter. Owner picture is retrieved from
     * user prefs of domain user who created filter and is used to display owner
     * picture in filters list.
     * 
     * @return picture of owner.
     * @throws Exception
     *             when agileuser doesn't exist with respect to owner key.
     */
    @XmlElement(name = "ownerPic")
    public String getOwnerPic() throws Exception
    {
	AgileUser agileuser = null;
	UserPrefs userprefs = null;

	try
	{
	    // Get owner pic through agileuser prefs
	    if (owner != null)
		agileuser = AgileUser.getCurrentAgileUserFromDomainUser(owner.getId());

	    if (agileuser != null)
		userprefs = UserPrefsUtil.getUserPrefs(agileuser);

	    if (userprefs != null)
		return userprefs.pic;
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	}

	return "";
    }

    /**
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id.
     */
    @XmlElement(name = "filterOwner")
    public DomainUser getFilterOwner() throws Exception
    {
	if (owner != null)
	{
	    try
	    {
		// Gets Domain User Object
		return DomainUserUtil.getDomainUser(owner.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * Assigns created time for the new one, creates filter with owner key.
     */
    @PrePersist
    private void PrePersist()
    {
	System.out.println("created_time:" + this.created_time);
	System.out.println("id:" + id);

	if (id != null)
	{
	    ContactFilter cf = getContactFilter(id);
	    created_time = cf.created_time;
	    owner_id = cf.owner_id;
	    owner = cf.owner;
	    return;
	}

	// Store Created Time
	if (created_time == 0L)
	{
	    created_time = System.currentTimeMillis() / 1000;

	    System.out.println("Owner_id : " + this.owner_id);

	    DomainUser du = DomainUserUtil.getCurrentDomainUser();
	    owner_id = du.id.toString();

	    // Saves domain user key
	    if (owner_id != null)
		owner = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));

	    System.out.println("Owner : " + this.owner);
	}
    }
    /******************************************************************************/
}