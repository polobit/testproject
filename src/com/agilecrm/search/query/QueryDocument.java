package com.agilecrm.search.query;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.reports.Reports;
import com.agilecrm.search.QueryInterface;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleType;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.search.Cursor;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.Query;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.ScoredDocument;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * The <code>QueryDocument</code> builds and process queries based on
 * {@link SearchRule} condition, basic and complex queries with combinations can
 * be built using AND, NOT , OR queries and Numeric operations on numeric
 * fields.
 * <p>
 * Used to process advanced search or simple search for contacts
 * </p>
 * 
 * Following example explains to execute a query({@link SearchRule})
 * 
 * <pre>
 * 	QueryDocument.queryDocuments({@link List} of {@link SearchRule})
 * </pre>
 * 
 * <p>
 * It contains methods queryDocuments, processQuery, buildQuery, searchContacts
 * </p>
 * 
 * @author Yaswanth
 * @since November 2012
 */
public class QueryDocument implements QueryInterface
{
    /**
     * Queries document based on {@link SearchRule} given and type of the
     * document(Contact, Opportunity..etc) , Executes the query and returns
     * collection of entities
     * 
     * @param rules
     *            {@link List} of {@link SearchRule}
     * 
     * @return {@link Collection} query results of type
     *         {@link Reports.ReportType}
     */
    @SuppressWarnings("rawtypes")
    public Collection advancedSearch(List<SearchRule> rules)
    {

	String query = constructQuery(rules);

	// return query results
	return processQuery(query, RuleType.Contact);
    }

    @SuppressWarnings("rawtypes")
    public Collection advancedSearch(List<SearchRule> rules, Integer count,
	    String cursor)
    {

	String query = constructQuery(rules);

	System.out.println("query constructed : " + query);

	// return query results
	return processQuery(query, RuleType.Contact, count, cursor);
    }

    /**
     * Queries for contacts based on keywords(Simple search). Trims spaces in
     * the keyword and calls processQuery to execute the condition
     * 
     * @param keyword
     *            {@link String}
     * @return {@link Collection}
     */
    public Collection simpleSearch(String keyword, Integer count, String cursor)
    {
	// Normalizes the string
	SearchUtil.normalizeString(keyword);

	// Builds the query, search on field search_tokens(since contact
	// properties are split in to fragments, and saved in document with
	// filed
	// name search_tokens)
	String query = "search_tokens : " + keyword;
	// if (cursor != null)
	return processQuery(query, RuleType.Contact, count, cursor);

	// return processQuery(query, RuleType.Contact);
    }

    // Build query based on condition AND, NOT..
    /**
     * Builds Query based on Conditions AND, NOT
     * 
     * @param condition
     *            {@link String}
     * @param query
     *            {@link String}
     * @param newQuery
     *            {@link String}
     * @return Returns query string built based on conditions {@link String}
     */
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

    private static String createTimeQuery(String query, String lhs,
	    SearchRule.RuleCondition condition, String rhs, String rhs_new)
    {
	// Formated to build query
	String date = SearchUtil.getDateWithoutTimeComponent(Long
		.parseLong(rhs));

	// Created on date condition
	if (condition.equals(SearchRule.RuleCondition.EQUALS))
	{
	    query = buildQuery("AND", query, lhs + "=" + date);
	}

	// Created after given date
	else if (condition.equals(SearchRule.RuleCondition.AFTER))
	{
	    query = buildQuery("AND", query, lhs + " >" + date);
	}

	// Created before particular date
	else if (condition.equals(SearchRule.RuleCondition.BEFORE))
	{
	    query = buildQuery("AND", query, lhs + " < " + date);
	}

	// Created Between given dates
	else if (condition.equals(SearchRule.RuleCondition.BETWEEN))
	{
	    if (rhs_new != null)
	    {
		String to_date = SearchUtil.getDateWithoutTimeComponent(Long
			.parseLong(rhs_new));

		query = buildQuery("AND", query, lhs + " >=" + date);
		query = buildQuery("AND", query, lhs + " <= " + to_date);
	    }
	}

	// Created in last number of days
	else if (condition.equals(SearchRule.RuleCondition.LAST))
	{
	    System.out.println(new DateUtil().getTime().toGMTString());

	    long fromDateInSecs = new DateUtil()
		    .removeDays(Integer.parseInt(rhs) - 1).getTime().getTime();

	    System.out.println(new DateUtil(new Date(fromDateInSecs)).getTime()
		    .toGMTString());

	    String fromDate = SearchUtil
		    .getDateWithoutTimeComponent(fromDateInSecs);

	    System.out.println("from date = " + fromDate + " lhs = " + lhs);

	    query = buildQuery("AND", query, lhs + " >= " + fromDate);
	}
	else if (condition.equals(SearchRule.RuleCondition.NEXT))
	{
	    long limitTime = new DateUtil().addDays(Integer.parseInt(rhs) - 1)
		    .getTime().getTime();
	    String formatedLimitDate = SearchUtil
		    .getDateWithoutTimeComponent(limitTime);

	    long currentTime = new Date().getTime();

	    String formatedCurrentDate = SearchUtil
		    .getDateWithoutTimeComponent(currentTime);

	    query = buildQuery("AND", query, lhs + " >=" + formatedCurrentDate);
	    query = buildQuery("AND", query, lhs + " <= " + formatedLimitDate);

	}

	return query;

    }

    /**
     * processes query and return collection of contacts
     * 
     * @param query
     *            {@link String}
     * @param type
     *            {@link Reports.ReportType}
     * @return
     */
    private static Collection processQuery(String query, RuleType type)
    {
	/*
	 * Set query options only to get id of document (enough to get get
	 * respective contacts)
	 */
	QueryOptions options = QueryOptions.newBuilder()
		.setFieldsToReturn("id").build();

	// Build query on query options
	Query query_string = Query.newBuilder().setOptions(options)
		.build(query);

	// Get results on query
	Index index = null;
	try
	{
	    // Get index of document based on type of query
	    index = (Index) Class
		    .forName(
			    "com.agilecrm.search.document." + type + "Document")
		    .getDeclaredField("index").get(null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// If index is null return without querying
	if (index == null)
	    return null;

	// Gets sorted documents
	Collection<ScoredDocument> contact_documents = index.search(
		query_string).getResults();

	System.out.println("contact results without cursor : "
		+ contact_documents);

	List<Long> entity_ids = new ArrayList<Long>();

	// Iterate through contact_documents and add document ids(contact ids)
	// to list
	for (ScoredDocument doc : contact_documents)
	{
	    entity_ids.add(Long.parseLong(doc.getId()));
	}

	Objectify ofy = ObjectifyService.begin();

	// Returns contact related to doc_ids
	return ofy.get(Contact.class, entity_ids).values();
    }

    private static Collection processQuery(String query, RuleType type,
	    int page, String cursor)
    {

	QueryOptions options;
	/*
	 * Set query options only to get id of document (enough to get get
	 * respective contacts)
	 */
	if (cursor == null)

	    options = QueryOptions.newBuilder().setFieldsToReturn("id")
		    .setLimit(page)
		    .setCursor(Cursor.newBuilder().setPerResult(true).build())
		    .build();
	else
	{
	    options = QueryOptions
		    .newBuilder()
		    .setFieldsToReturn("id")
		    .setLimit(page)
		    .setCursor(
			    Cursor.newBuilder().setPerResult(true)
				    .build(cursor)).build();

	}

	// Build query on query options
	com.google.appengine.api.search.Query query_string = com.google.appengine.api.search.Query
		.newBuilder().setOptions(options).build(query);

	// Get results on query
	Index index = null;
	try
	{
	    // Get index of document based on type of query
	    index = (Index) Class
		    .forName(
			    "com.agilecrm.search.document." + type + "Document")
		    .getDeclaredField("index").get(null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// If index is null return without querying
	if (index == null)
	    return null;

	// Gets sorted documents
	Collection<ScoredDocument> contact_documents = index.search(
		query_string).getResults();

	System.out.println("contact results : " + contact_documents);

	List<Long> entity_ids = new ArrayList<Long>();

	// Iterate through contact_documents and add document ids(contact ids)
	// to list
	for (ScoredDocument doc : contact_documents)
	{

	    entity_ids.add(Long.parseLong(doc.getId()));
	    cursor = doc.getCursor().toWebSafeString();
	}

	Objectify ofy = ObjectifyService.begin();

	// Returns contact related to doc_ids
	Collection<Contact> contactResults = ofy.get(Contact.class, entity_ids)
		.values();
	int max = contactResults.size();

	int countOfContacts = 0;
	for (Contact contact : contactResults)
	{
	    if (++countOfContacts == max)
	    {
		contact.cursor = cursor;
		// contact.count = max;
	    }
	}

	return contactResults;

    }

    public static String constructQuery(List<SearchRule> rules)
    {
	String query = "";

	// Sets to contact by default
	SearchRule.RuleType ruleType = RuleType.Contact;

	for (SearchRule rule : rules)
	{
	    // Set type of rule(search on what?)
	    ruleType = rule.ruleType;

	    /*
	     * Get condition parameters LHS(field_name in document) ,
	     * condition(condition or query AND or NOT), RHS(field_value)
	     */
	    String lhs = rule.LHS;
	    SearchRule.RuleCondition condition = rule.CONDITION;
	    String rhs = rule.RHS;
	    String rhs_new = rule.RHS_NEW;
	    SearchRule.RuleCondition nestedCondition = rule.nested_condition;
	    String nestedLhs = rule.nested_lhs;
	    String nestedRhs = rule.nested_rhs;

	    /*
	     * Build equals and not equals queries conditions except time based
	     * conditions
	     */
	    if (!lhs.contains("time"))
	    {
		System.out.println("LHS : " + lhs + "Rhs : " + rhs);
		/*
		 * Create new query with LHS and RHS conditions to be processed
		 * further for necessary queries
		 */
		String newQuery = lhs + ":" + SearchUtil.normalizeString(rhs);

		// For equals condition
		if (condition.equals(SearchRule.RuleCondition.EQUALS))
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
	    if (lhs.contains("time") && !lhs.contains("tags"))
	    {
		query = createTimeQuery(query, lhs, condition, rhs, rhs_new);

	    }

	    if (lhs.contains("time") && lhs.contains("tags"))
	    {
		query = createTimeQuery(query, rhs + "_time", nestedCondition,
			nestedLhs, nestedRhs);
	    }
	}
	return query;
    }
}
