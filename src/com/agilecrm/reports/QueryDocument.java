package com.agilecrm.reports;

import java.net.URLDecoder;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.time.DateUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.document.ContactDocument;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.ScoredDocument;

public class QueryDocument
{

    // Perform queries to fetch contacts
    @SuppressWarnings("rawtypes")
    public static Collection queryDocuments(String[] rules,
	    Reports.ReportType type)
    {
	JSONArray rules_json_array = null;
	try
	{
	    rules_json_array = new JSONArray(rules);
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
	return processQuery(query, type);
    }

    // Build ,process query and return contacts collection
    public static Collection<Object> processQuery(String query,
	    Reports.ReportType type)
    {

	// Set query options only to get id of document (enough to get get
	// respective contacts)
	QueryOptions options = QueryOptions.newBuilder()
		.setFieldsToReturn("id").build();

	// Build query on query options
	com.google.appengine.api.search.Query query_string = com.google.appengine.api.search.Query
		.newBuilder().setOptions(options).build(query);

	// Get results on query
	Index index = null;
	try
	{
	    index = (Index) Class
		    .forName("com.agilecrm.document." + type + "Document")
		    .getDeclaredField("index").get(null);

	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (index == null)
	    return null;

	Collection<ScoredDocument> contact_documents = index.search(
		query_string).getResults();

	List<Long> entity_ids = new ArrayList<Long>();

	// Iterate through contact_documents and add document ids(contact ids)
	// to list
	for (ScoredDocument doc : contact_documents)
	{
	    entity_ids.add(Long.parseLong(doc.getId()));
	}

	try
	{
	    return (Collection) Class
		    .forName("com.agilecrm.document." + type + "Document")
		    .getMethod("getRelatedEntities", List.class)
		    .invoke(null, entity_ids);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}

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

    // Keyword contact search
    public static Collection<Object> searchContacts(String keyword)
    {
	// Decode the search keyword and remove spaces
	keyword = URLDecoder.decode(keyword).replaceAll(" ", "");

	String query = "search_tokens : " + keyword;

	return QueryDocument.processQuery(query, Reports.ReportType.Contact);
    }

}
