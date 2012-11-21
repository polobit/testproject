package com.agilecrm.contact;

import java.io.Serializable;
import java.net.URLDecoder;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.json.JSONArray;

import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.reports.QueryDocument;
import com.agilecrm.reports.Reports;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class ContactFilter implements Serializable
{

    // Key
    @Id
    public Long id;

    // Category of report generation - daily, weekly, monthly.
    public enum SystemFilter
    {
	LEAD, RECENT
    };

    @NotSaved(IfDefault.class)
    public String name = null;

    @Indexed
    @NotSaved(IfDefault.class)
    public boolean is_reports_enabled = false;

    @NotSaved(IfDefault.class)
    public String rules[] = null;

    @NotSaved
    private JSONArray rules_json_array = null;

    @NotSaved(IfDefault.class)
    public String domain = null;

    public static ObjectifyGenericDao<ContactFilter> dao = new ObjectifyGenericDao<ContactFilter>(
	    ContactFilter.class);

    public ContactFilter()
    {

    }

    public ContactFilter(String name, boolean is_reports_enabled,
	    String rules[])
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
    public Collection<Object> queryContacts()
    {
	return QueryDocument.queryDocuments(rules, Reports.ReportType.Contact);
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

	if (type == SystemFilter.LEAD)
	{
	    Key<DomainUser> userKey = new Key<DomainUser>(DomainUser.class,
		    DomainUser.getDomainCurrentUser().id);

	    return ofy.query(Contact.class).filter("owner_key", userKey).list();
	}

	return null;
    }

    // Keyword contact search
    public static Collection<Object> searchContacts(String keyword)
    {
	// Decode the search keyword and remove spaces
	keyword = URLDecoder.decode(keyword).replaceAll(" ", "");

	String query = "search_tokens : " + keyword;

	return QueryDocument.processQuery(query, Reports.ReportType.Contact);
    }
}