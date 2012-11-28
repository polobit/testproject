package com.agilecrm.search;

import java.net.URLDecoder;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.time.DateUtils;

import com.agilecrm.reports.Reports;
import com.agilecrm.search.SearchRule.RuleType;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.ScoredDocument;

/**
 * The <code>QueryDocument</code> class contains methods the build query based
 * on rules JSON and process queries, Query string for document search are built
 * in these methods
 * 
 * @author Yaswanth
 * @since November 2012
 * 
 */
public class QueryDocument
{
    /**
     * This method queries documents based on rules given and type of the
     * document(Contact, Opportunity..etc) and return respective results
     * 
     * @param rules
     *            {@link String} array contains JSON strings
     * @param type
     *            {@link Reports.ReportType}
     * 
     * @return {@link Collection} query results of type
     *         {@link Reports.ReportType}
     */
    @SuppressWarnings("rawtypes")
    public static Collection queryDocuments(List<SearchRule> rules)
    {

	String query = "";

	// Set to contact by default
	SearchRule.RuleType ruleType = RuleType.Contact;

	for (SearchRule rule : rules)
	{
	    // Set type of rule(search on what?)
	    ruleType = rule.ruleType;

	    /*
	     * Get condition parameters LHS(field_name in document) ,
	     * condition(condition or query AND or NOT), RHS(field_value)
	     */
	    String LHS = rule.LHS;
	    String condition = rule.condition;
	    String RHS = rule.RHS;

	    /*
	     * Build equals and not equals queries conditions except time based
	     * conditions
	     */
	    if (!LHS.contains("time"))
	    {
		/*
		 * Create new query with LHS and RHS conditions to be processed
		 * further for necessary queries
		 */
		String newQuery = LHS + ":" + SearchUtil.normalizeString(RHS);

		// For equals condition
		if (condition.equalsIgnoreCase("EQUALS"))
		{
		    /*
		     * Build query by passing condition old query and new query
		     */
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
		/*
		 * Truncate date Document search date is without time component
		 */
		Date truncatedDate = DateUtils.truncate(new Date(Long.parseLong(RHS)),
			Calendar.DATE);

		// Format date(formated as stored in document)
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
		    long from_date = new DateUtil().removeDays(Integer.parseInt(RHS)).getTime()
			    .getTime() / 1000;

		    query = buildQuery("AND", query, LHS + " > " + date);

		    query = query + LHS + " < " + date;
		}

		// Created Between given dates
		else if (condition.equalsIgnoreCase("BETWEEN"))
		{
		    String RHS_NEW = rule.RHS_NEW;
		    if (RHS_NEW != null)
		    {
			String to_date = formatter.format(new Date(Long.parseLong(RHS_NEW)));

			query = buildQuery("AND", query, LHS + " >=" + date);
			query = buildQuery("AND", query, LHS + " <= " + to_date);
		    }
		}
	    }
	}

	System.out.println(ruleType);

	// return query results
	return processQuery(query, ruleType);
    }

    /**
     * Build ,process query and return contacts collection
     * 
     * @param query
     *            {@link String}
     * @param type
     *            {@link Reports.ReportType}
     * @return
     */
    public static Collection<Object> processQuery(String query, RuleType type)
    {

	/*
	 * Set query options only to get id of document (enough to get get
	 * respective contacts)
	 */
	QueryOptions options = QueryOptions.newBuilder().setFieldsToReturn("id").build();

	// Build query on query options
	com.google.appengine.api.search.Query query_string = com.google.appengine.api.search.Query
		.newBuilder().setOptions(options).build(query);

	// Get results on query
	Index index = null;
	try
	{
	    // Get index of document based on type of query
	    index = (Index) Class.forName("com.agilecrm.search." + type + "Document")
		    .getDeclaredField("index").get(null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// If index is null return without querying
	if (index == null)
	    return null;

	// Get sorted documents
	Collection<ScoredDocument> contact_documents = index.search(query_string).getResults();

	List<Long> entity_ids = new ArrayList<Long>();

	// Iterate through contact_documents and add document ids(contact ids)
	// to list
	for (ScoredDocument doc : contact_documents)
	{
	    entity_ids.add(Long.parseLong(doc.getId()));
	}

	try
	{
	    return (Collection) Class.forName("com.agilecrm.search." + type + "Document")
		    .getMethod("getRelatedEntities", List.class).invoke(null, entity_ids);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

    }

    // Build query based on condition AND, NOT..
    private static String buildQuery(String condition, String query, String newQuery)
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

	return QueryDocument.processQuery(query, RuleType.Contact);
    }

}
