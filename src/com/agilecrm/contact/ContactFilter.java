package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class ContactFilter
{
    // Key
    @Id
    public Long id;

    // Category of report generation - daily, weekly, monthly.
    public enum SystemFilter
    {
	MY_LEAD, RECENT
    };

    @NotSaved(IfDefault.class)
    public String name = null;

    @Indexed
    @NotSaved(IfDefault.class)
    public boolean is_reports_enabled = false;

    @NotSaved(IfDefault.class)
    @Embedded
    public List<SearchRule> rules = new ArrayList<SearchRule>();

    @NotSaved(IfDefault.class)
    public String domain = null;

    public static ObjectifyGenericDao<ContactFilter> dao = new ObjectifyGenericDao<ContactFilter>(
	    ContactFilter.class);

    public ContactFilter()
    {

    }

    public ContactFilter(String name, boolean is_reports_enabled,
	    List<SearchRule> rules)
    {
	this.name = name;
	this.is_reports_enabled = is_reports_enabled;
	this.rules = rules;
    }

    // Get Contact Filter by id
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

    // Fetch list of Contact Filters
    public static List<ContactFilter> getAllContactFilters()
    {
	return dao.fetchAll();
    }

    public void save()
    {
	dao.put(this);
    }

    // Perform queries to fetch contacts
    @SuppressWarnings("rawtypes")
    public Collection queryContacts()
    {
	return AppengineSearch.getAdvacnedSearchResults(rules);
    }

    // Get Contacts based on system filters
    public static List<Contact> getContacts(SystemFilter type)
    {
	Objectify ofy = ObjectifyService.begin();
	Query<Contact> contact_query = ofy.query(Contact.class);

	if (type == SystemFilter.RECENT)
	{
	    DateUtil current_date = new DateUtil(new Date());

	    long current_time = current_date.getTime().getTime() / 1000;

	    DateUtil from_Date = current_date.removeDays(1);

	    long from_time = from_Date.getTime().getTime() / 1000;

	    // Get last 20 recently created
	    return contact_query.filter("created_time < ", current_time)
		    .order("-created_time").limit(20).list();
	}

	if (type == SystemFilter.MY_LEAD)
	{
	    Key<DomainUser> userKey = new Key<DomainUser>(DomainUser.class,
		    DomainUserUtil.getDomainCurrentUser().id);

	    return ofy.query(Contact.class).filter("owner_key", userKey).list();
	}

	return null;
    }
}