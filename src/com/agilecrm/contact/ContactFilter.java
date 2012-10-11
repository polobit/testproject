package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.xml.bind.annotation.XmlRootElement;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.DateUtil;
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
    public enum Type
    {
	DAILY, WEEKLY, MONTHLY
    };

    @NotSaved(IfDefault.class)
    public String name = null;

    @Indexed
    @NotSaved(IfDefault.class)
    public boolean is_reports_enabled = false;

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
    public List<Contact> queryContacts()
    {
	List<Contact> contacts = new ArrayList<Contact>();

	// Remaining rules after appegine valid queries completed
	JSONArray remaining_rules = new JSONArray();

	Objectify ofy = ObjectifyService.begin();
	Query<Contact> contact_query = ofy.query(Contact.class);

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
		if (condition.equalsIgnoreCase("EQUALS")
			&& !LHS.contains("time"))
		{
		    // Check whether to query in properties
		    if (LHS.contains("properties"))
		    {
			contact_query.filter("properties.value", RHS);
		    }
		    else if (!LHS.contains("time"))
		    {
			contact_query.filter(LHS, RHS);
		    }
		}

		// Queries on created or updated times
		else if (LHS.contains("time"))
		{
		    Date date = new Date(Long.parseLong(RHS));
		    DateUtil start_time = new DateUtil(date);

		    long start_date = start_time.getTime().getTime() / 1000;

		    long end_date = start_time.addDays(1).getTime().getTime() / 1000;

		    if (condition.equalsIgnoreCase("EQUALS"))
		    {
			contact_query.filter(LHS + " >=", start_date).filter(
				LHS + " <=", end_date);
		    }
		    else if (condition.equalsIgnoreCase("AFTER"))
		    {
			contact_query.filter(LHS + " >", start_date);
		    }
		    else if (condition.equalsIgnoreCase("BEFORE"))
		    {
			contact_query.filter(LHS + " <", start_date);
		    }
		    else if (condition.equalsIgnoreCase("LAST"))
		    {

			long from_date = new DateUtil()
				.removeDays(Integer.parseInt(RHS)).getTime()
				.getTime() / 1000;

			contact_query.filter(LHS + " >=", from_date);
		    }
		    else if (condition.equalsIgnoreCase("BETWEEN"))
		    {
			String RHS_NEW = each_rule.getString("RHS_NEW");
			if (RHS_NEW != null)
			{
			    Date to_date = new Date(Long.parseLong(RHS_NEW));
			    long to_date_seconds = new DateUtil(to_date)
				    .getTime().getTime() / 1000;

			    contact_query.filter(LHS + " >=", start_date)
				    .filter(LHS + " <=", to_date_seconds);
			}
		    }
		}

		// If Not equal queries add to remaining rules for further
		// processing
		else
		{
		    remaining_rules.put(each_rule);
		}
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}

	// Run the query and get list of contacts
	contacts = contact_query.list();

	// If remaing_rules are not null process rules
	if (remaining_rules != null)
	{
	    for (int i = 0; i < remaining_rules.length(); i++)
	    {
		try
		{
		    JSONObject each_rule = new JSONObject(
			    remaining_rules.getString(i));

		    String LHS = each_rule.getString("LHS");
		    String RHS = each_rule.getString("RHS");
		    String condition = each_rule.getString("condition");

		    // Run not equal
		    if (condition.equalsIgnoreCase("NOTEQUALS"))
		    {
			@SuppressWarnings("unchecked")
			List<Contact> contacts_clone = (List<Contact>) ((ArrayList<Contact>) contacts)
				.clone();

			for (Contact contact : contacts_clone)
			{

			    // Check whether rule is based on properties list of
			    // contacts
			    if (LHS.contains("properties"))
			    {
				for (ContactField contactField : contact.properties)
				{
				    if ((contactField.value)
					    .equalsIgnoreCase(RHS))
				    {
					contacts.remove(contact);
				    }
				}
			    }
			    else if (LHS.equalsIgnoreCase("tags"))
			    {
				if (contact.tags.contains(RHS))
				{
				    contacts.remove(contact);
				}
			    }
			}
		    }
		}
		catch (JSONException e)
		{
		    e.printStackTrace();
		}
	    }
	}
	return contacts;
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
}