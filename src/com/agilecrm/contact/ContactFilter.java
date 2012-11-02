package com.agilecrm.contact;

import java.net.URLDecoder;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.time.DateUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.ScoredDocument;
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
	LEAD, RECENT
    };

    @NotSaved(IfDefault.class)
    public String name = null;

    @Indexed
    @NotSaved(IfDefault.class)
    public boolean is_reports_enabled = false;

    // Category of report generation - daily, weekly, monthly.
    public enum Type
    {
	DAILY, WEEKLY, MONTHLY
    };

    @Indexed
    @NotSaved(IfDefault.class)
    public Type duration;

    @NotSaved(IfDefault.class)
    public String rules[] = null;

    @NotSaved
    private JSONArray rules_json_array = null;

    public static ObjectifyGenericDao<ContactFilter> dao = new ObjectifyGenericDao<ContactFilter>(
	    ContactFilter.class);

    public ContactFilter()
    {

    }

    public ContactFilter(Type duration, String name,
	    boolean is_reports_enabled, String rules[])
    {
	this.name = name;
	this.is_reports_enabled = is_reports_enabled;
	this.duration = duration;
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
    public Collection<Contact> queryContacts()
    {
	List<Contact> contacts = new ArrayList<Contact>();

	String query = "";

	for (int i = 0; i < rules_json_array.length(); i++)
	{
	    System.out.println("filter contacts");

	    try
	    {
		// Get each rule from set of rules
		JSONObject each_rule = new JSONObject(
			rules_json_array.getString(i));

		String LHS = each_rule.getString("LHS");
		String condition = each_rule.getString("condition");
		String RHS = each_rule.getString("RHS");

		// Build Equal queries
		if (!LHS.contains("time"))
		{
		    // For equals condition
		    if (condition.equalsIgnoreCase("EQUALS"))
		    {
			// If query is not empty should add AND condition
			if (!query.isEmpty())
			{
			    System.out.println("in if : " + query);
			    query = query + " AND " + LHS + ":"
				    + ContactDocument.normalizeString(RHS);
			}
			else
			{
			    System.out.println("in else : " + query);
			    query = query + LHS + ":"
				    + ContactDocument.normalizeString(RHS);
			}
		    }
		    // For not queries
		    else
		    {
			if (!query.isEmpty())
			{
			    System.out.println("in if : " + query);
			    query = query + " NOT " + LHS + ":"
				    + ContactDocument.normalizeString(RHS);
			}
			else
			{

			    query = "NOT " + LHS + ":"
				    + ContactDocument.normalizeString(RHS);
			    System.out.println("in else : " + query);
			}
		    }
		}

		// Queries on created or updated times
		else if (LHS.contains("time"))
		{
		    Date truncatedDate = DateUtils.truncate(
			    new Date(Long.parseLong(RHS)), Calendar.DATE);

		    Format formatter = new SimpleDateFormat("yyyy-MM-dd");

		    // Formated to build query
		    String date = formatter.format(truncatedDate);

		    System.out.println("date string is  : " + date);

		    if (condition.equalsIgnoreCase("EQUALS"))
		    {
			if (!query.isEmpty())
			    query = query + " AND " + LHS + "=" + date;
			else
			    query = LHS + "=" + date;
		    }
		    else if (condition.equalsIgnoreCase("AFTER"))
		    {
			if (!query.isEmpty())
			    query = query + " AND " + LHS + " > " + date;
			else
			    query = query + LHS + " >" + date;

		    }
		    else if (condition.equalsIgnoreCase("BEFORE"))
		    {
			if (!query.isEmpty())
			    query = query + " AND " + LHS + " < " + date;
			else
			    query = query + LHS + " < " + date;
		    }
		    else if (condition.equalsIgnoreCase("LAST"))
		    {

			long from_date = new DateUtil()
				.removeDays(Integer.parseInt(RHS)).getTime()
				.getTime() / 1000;

			query = query + LHS + " < " + date;
		    }
		    else if (condition.equalsIgnoreCase("BETWEEN"))
		    {
			String RHS_NEW = each_rule.getString("RHS_NEW");
			if (RHS_NEW != null)
			{
			    String to_date = formatter.format(new Date(Long
				    .parseLong(RHS_NEW)));

			    if (!query.isEmpty())
				query = query + " AND " + LHS + " >=" + date
					+ " AND " + LHS + " <= " + to_date;
			    else
				query = query + LHS + " >=" + date + " AND "
					+ LHS + " <= " + to_date;
			}
		    }
		}
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}
	return processQuery(query);
    }

    // Create JSONArray from string array on load from DB
    @PostLoad
    private void setRulesJson()
    {
	try
	{
	    rules_json_array = new JSONArray(this.rules);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}
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

    public static Collection<Contact> searchContacts(String keyword)
    {
	keyword = URLDecoder.decode(keyword).replaceAll(" ", "");

	String query = "search_tokens : " + keyword;

	return processQuery(query);
    }

    private static Collection<Contact> processQuery(String query)
    {

	// Set query options only to get id of document (enough to get get
	// respective contacts)
	QueryOptions options = QueryOptions.newBuilder()
		.setFieldsToReturn("id").build();

	// Build query on query options
	com.google.appengine.api.search.Query query_string = com.google.appengine.api.search.Query
		.newBuilder().setOptions(options).build(query);

	// Get results on query
	Collection<ScoredDocument> contact_documents = ContactDocument.index
		.search(query_string).getResults();

	List<Long> contact_ids = new ArrayList<Long>();

	// Iterate through contact_documents and add document ids(contact ids)
	// to list
	for (ScoredDocument doc : contact_documents)
	{
	    contact_ids.add(Long.parseLong(doc.getId()));
	}

	Objectify ofy = ObjectifyService.begin();

	// Return result contacts
	return ofy.get(Contact.class, contact_ids).values();

    }
}