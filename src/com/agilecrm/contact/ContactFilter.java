package com.agilecrm.contact;

import java.io.Serializable;
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
import com.google.appengine.api.NamespaceManager;
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

    // Category of report generation - daily, weekly, monthly.
    public static enum Duration
    {
	DAILY, WEEKLY, MONTHLY
    };

    @Indexed
    @NotSaved(IfDefault.class)
    public Duration duration;

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

    public ContactFilter(Duration duration, String name,
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
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    // Fetch list of Contact Filters
    public static List<ContactFilter> getAllContactFilters()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.fetchAll();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    // Get the list of contact filter replated to current namespace
    public static List<ContactFilter> getCurrentNamespaceFilters()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.ofy().query(ContactFilter.class)
		    .filter("domain", oldNamespace).list();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public void save()
    {
	this.domain = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    dao.put(this);
	}
	finally
	{
	    NamespaceManager.set(this.domain);
	}
    }

    // Perform queries to fetch contacts
    public Collection<Contact> queryContacts()
    {
	List<Contact> contacts = new ArrayList<Contact>();
	try
	{
	    rules_json_array = new JSONArray(this.rules);
	}
	catch (JSONException e1)
	{
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	}

	String query = "";

	for (int i = 0; i < rules_json_array.length(); i++)
	{
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
		    // Create new query with lhs and rhs conditions to be added
		    // further
		    String newQuery = LHS + ":"
			    + ContactDocument.normalizeString(RHS);

		    // For equals condition
		    if (condition.equalsIgnoreCase("EQUALS"))
		    {
			// Build query by passing condition old query and new
			// query
			query = buildQuery("AND", query, newQuery);
		    }
		    // For not queries
		    else
		    {
			query = buildQuery("NOT", query, newQuery);
		    }
		}

		// Queries on created or updated times
		else if (LHS.contains("time"))
		{
		    // Truncate date Document search date is without time
		    // component
		    Date truncatedDate = DateUtils.truncate(
			    new Date(Long.parseLong(RHS)), Calendar.DATE);

		    // Format date
		    Format formatter = new SimpleDateFormat("yyyy-MM-dd");

		    // Formated to build query
		    String date = formatter.format(truncatedDate);

		    System.out.println("date string is  : " + date);

		    // Created on date condition
		    if (condition.equalsIgnoreCase("EQUALS"))
		    {
			query = buildQuery("AND", query, LHS + "=" + date);
		    }

		    // Created after given date
		    else if (condition.equalsIgnoreCase("AFTER"))
		    {
			query = buildQuery("AND", query, LHS + " >" + date);
		    }

		    // Created before particular date
		    else if (condition.equalsIgnoreCase("BEFORE"))
		    {
			query = buildQuery("AND", query, LHS + " < " + date);
		    }

		    // Created in last number of days
		    else if (condition.equalsIgnoreCase("LAST"))
		    {

			long from_date = new DateUtil()
				.removeDays(Integer.parseInt(RHS)).getTime()
				.getTime() / 1000;

			query = buildQuery("AND", query, LHS + " > " + date);

			query = query + LHS + " < " + date;
		    }

		    // Created Between given dates
		    else if (condition.equalsIgnoreCase("BETWEEN"))
		    {
			String RHS_NEW = each_rule.getString("RHS_NEW");
			if (RHS_NEW != null)
			{
			    String to_date = formatter.format(new Date(Long
				    .parseLong(RHS_NEW)));

			    query = buildQuery("AND", query, LHS + " >=" + date);
			    query = buildQuery("AND", query, LHS + " <= "
				    + to_date);
			}
		    }
		}
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}

	System.out.println("query : " + query);

	// return query results
	return processQuery(query);
    }

    // Create JSONArray from string array on load from DB
    @PostLoad
    private void setRulesJson()
    {
	// try
	{
	    // rules_json_array = new JSONArray(this.rules);
	}
	// catch (JSONException e)
	{
	    // e.printStackTrace();
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

    // Keyword contact search
    public static Collection<Contact> searchContacts(String keyword)
    {
	// Decode the search keyword and remove spaces
	keyword = URLDecoder.decode(keyword).replaceAll(" ", "");

	String query = "search_tokens : " + keyword;

	return processQuery(query);
    }

    // Build query based on condition AND, NOT..
    private static String buildQuery(String condition, String query,
	    String newQuery)
    {

	// If query string is empty return simple not query
	if (query.isEmpty() && condition.equals("NOT"))
	{
	    query = "NOT " + newQuery;
	    return query;
	}

	// If query String is not empty then create And condition with old query
	// and add not query
	if (!query.isEmpty() && condition.equals("NOT"))
	{
	    query = "(" + query + ")" + " AND " + "(NOT " + newQuery + ")";
	    return query;
	}

	// If query is not empty should add AND condition
	if (!query.isEmpty())
	{
	    query = query + " " + condition + " " + newQuery;
	    return query;
	}

	// If query is empty and not "NOT" query return same new query
	return newQuery;
    }

    // Build ,process query and return contacts collection
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

    // Fetch all the filters in App with particular report duration which are
    // reports enabled
    public static List<ContactFilter> getAllFiltersByDuration(Duration duration)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.ofy().query(ContactFilter.class)
		    .filter("is_reports_enabled", true)
		    .filter("duration", duration).list();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}