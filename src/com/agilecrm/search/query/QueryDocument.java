package com.agilecrm.search.query;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.reports.Reports;
import com.agilecrm.search.QueryInterface;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleType;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.search.Cursor;
import com.google.appengine.api.search.Document;
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
	@Override
	@SuppressWarnings("rawtypes")
	public Collection advancedSearch(List<SearchRule> rules)
	{

		String query = constructQuery(rules);

		if (StringUtils.isEmpty(query))
			return new ArrayList();

		// return query results
		return processQuery(query, RuleType.Contact);

	}

	@Override
	@SuppressWarnings("rawtypes")
	public Collection advancedSearch(List<SearchRule> rules, Integer count, String cursor)
	{

		String query = constructQuery(rules);

		System.out.println("query build is : " + query);

		if (StringUtils.isEmpty(query))
			return new ArrayList();

		// return query results
		return processQuery(query, RuleType.Contact, count, cursor);
	}

	public static List<Long> getContactIds(List<SearchRule> rules, Integer count, String cursor)
	{

		String query = constructQuery(rules);

		if (StringUtils.isEmpty(query))
			return new ArrayList();

		// return query results
		Collection<ScoredDocument> contact_documents = getContactDocuments(query, RuleType.Contact, count, cursor);

		List<Long> entity_ids = new ArrayList<Long>();

		for (Document document : contact_documents)
		{
			entity_ids.add(Long.parseLong(document.getId()));
		}

		return entity_ids;
	}

	/**
	 * Queries for contacts based on keywords(Simple search). Trims spaces in
	 * the keyword and calls processQuery to execute the condition
	 * 
	 * @param keyword
	 *            {@link String}
	 * @return {@link Collection}
	 */
	@Override
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

	public static String createTimeQuery1(String query, String lhs, SearchRule.RuleCondition condition, String rhs,
			String rhs_new)
	{
		// Formated to build query
		String date = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(rhs));

		// Created on date condition
		if (condition.equals(SearchRule.RuleCondition.ON) || condition.equals(SearchRule.RuleCondition.EQUALS))
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
				String to_date = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(rhs_new));

				query = buildQuery("AND", query, lhs + " >= " + date);
				query = buildQuery("AND", query, lhs + " <= " + to_date);
			}
		}

		// Created in last number of days
		else if (condition.equals(SearchRule.RuleCondition.LAST))
		{
			long fromDateInSecs = new DateUtil().removeDays(Integer.parseInt(rhs) - 1).getTime().getTime();

			String fromDate = SearchUtil.getDateWithoutTimeComponent(fromDateInSecs);

			query = buildQuery("AND", query, lhs + " >= " + fromDate);
		}
		else if (condition.equals(SearchRule.RuleCondition.NEXT))
		{
			long limitTime = new DateUtil().addDays(Integer.parseInt(rhs) - 1).getTime().getTime();
			String formatedLimitDate = SearchUtil.getDateWithoutTimeComponent(limitTime);

			long currentTime = new Date().getTime();

			String formatedCurrentDate = SearchUtil.getDateWithoutTimeComponent(currentTime);

			query = buildQuery("AND", query, lhs + " >=" + formatedCurrentDate);
			query = buildQuery("AND", query, lhs + " <= " + formatedLimitDate);

		}

		return query;

	}

	private static String createTimeQuery(String query, String lhs, SearchRule.RuleCondition condition, String rhs,
			String rhs_new)
	{

		Date startDate = new DateUtil(new Date(Long.parseLong(rhs))).toMidnight().getTime();

		String startDateEpoch = String.valueOf(startDate.getTime() / 1000);

		Date endDate = new DateUtil(startDate).addDays(1).toMidnight().getTime();

		String endDateEpoch = String.valueOf(endDate.getTime() / 1000);

		// Formated to build query
		String date = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(rhs));

		// Created on date condition
		if (condition.equals(SearchRule.RuleCondition.ON) || condition.equals(SearchRule.RuleCondition.EQUALS))
		{
			/*
			 * Date endDate = new Date(
			 * com.google.appengine.api.search.DateUtil.getEpochPlusDays(days,
			 * milliseconds)P 1, 0));
			 */

			String epochQuery = "";

			// First create query based on epoch time, take it in to temp string
			// as it should be combined with a OR query on date fields to
			// support old data
			epochQuery = lhs + "_epoch" + ">=" + startDateEpoch;

			epochQuery = buildQuery("AND", epochQuery, lhs + "_epoch" + "<=" + endDateEpoch);

			String dateQuery = lhs + ":" + date;

			String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

			query = buildQuery("AND", query, timeQuery);

		}

		// Created after given date
		else if (condition.equals(SearchRule.RuleCondition.AFTER))
		{
			String epochQuery = lhs + "_epoch >= " + endDateEpoch;

			String dateQuery = lhs + " > " + date;

			String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

			query = buildQuery("AND", query, timeQuery);
		}

		// Created before particular date
		else if (condition.equals(SearchRule.RuleCondition.BEFORE))
		{
			String epochQuery = lhs + "_epoch < " + endDateEpoch;

			String dateQuery = lhs + " < " + date;

			String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

			query = buildQuery("AND", query, timeQuery);
		}

		// Created Between given dates
		else if (condition.equals(SearchRule.RuleCondition.BETWEEN))
		{
			if (rhs_new != null)
			{

				Date toDate = new DateUtil(new Date(Long.parseLong(rhs_new))).addDays(1).toMidnight().getTime();

				String toDateEpoch = String.valueOf(toDate.getTime() / 1000);

				String epochQuery = lhs + "_epoch >= " + startDateEpoch;

				epochQuery = buildQuery("AND", epochQuery, lhs + "_epoch <= " + toDateEpoch);

				String to_date = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(rhs_new));

				String dateQuery = lhs + " >= " + date;

				dateQuery = buildQuery("AND", dateQuery, lhs + " <= " + to_date);

				String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

				query = buildQuery("AND", query, timeQuery);
			}
		}

		// Created in last number of days
		else if (condition.equals(SearchRule.RuleCondition.LAST))
		{
			long fromDateInSecs = new DateUtil().removeDays(Integer.parseInt(rhs)).toMidnight().getTime().getTime() / 1000;

			long currentEpochTime = new DateUtil().getTime().getTime() / 1000;

			String epochQuery = lhs + "_epoch >= " + String.valueOf(fromDateInSecs);

			epochQuery = buildQuery("AND", epochQuery, lhs + "_epoch <= " + String.valueOf(currentEpochTime));

			String fromDate = SearchUtil.getDateWithoutTimeComponent(fromDateInSecs * 1000);

			String toDate = SearchUtil.getDateWithoutTimeComponent(currentEpochTime * 1000);

			String dateQuery = lhs + " >= " + fromDate;

			dateQuery = buildQuery("AND", dateQuery, lhs + " <= " + toDate);

			String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

			query = buildQuery("AND", query, timeQuery);

		}
		else if (condition.equals(SearchRule.RuleCondition.NEXT))
		{
			long limitTime = new DateUtil().addDays(Integer.parseInt(rhs) - 1).getTime().getTime();

			String formatedLimitDate = SearchUtil.getDateWithoutTimeComponent(limitTime);

			long currentTime = new Date().getTime();

			String formatedCurrentDate = SearchUtil.getDateWithoutTimeComponent(currentTime);

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
		 * List<ScoredDocument> contact_documents1 = new
		 * ArrayList<ScoredDocument>( getContactDocuments(query, type, 50,
		 * null));
		 * 
		 * List<Long> entity_ids = new ArrayList<Long>();
		 * 
		 * for (ScoredDocument doc : contact_documents1) {
		 * entity_ids.add(Long.parseLong(doc.getId()));
		 * System.out.println(doc.getCursor()); }
		 */
		// Get results on query
		Index index = null;
		try
		{
			// Get index of document based on type of query
			index = new ContactDocument().getIndex();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		// If index is null return without querying
		if (index == null)
			return null;

		List<Long> entity_ids = new ArrayList<Long>();

		/*
		 * Set query options only to get id of document (enough to get get
		 * respective contacts)
		 */
		QueryOptions options = QueryOptions.newBuilder().setLimit(1000)
				.setCursor(Cursor.newBuilder().setPerResult(true).build()).setReturningIdsOnly(true).build();

		// Build query on query options
		Query query_string = Query.newBuilder().setOptions(options).build(query);

		// Gets sorted documents
		List<ScoredDocument> contact_documents = new ArrayList<ScoredDocument>(index.search(query_string).getResults());

		// List<Long> entity_ids = new ArrayList<Long>();

		if (contact_documents.size() == 1000 && contact_documents.get(999).getCursor() != null)
		{
			options = QueryOptions
					.newBuilder()
					.setLimit(1000)
					.setCursor(
							Cursor.newBuilder().setPerResult(true)
									.build(contact_documents.get(999).getCursor().toWebSafeString()))
					.setReturningIdsOnly(true).build();

			// Build query on query options
			query_string = Query.newBuilder().setOptions(options).build(query);

			contact_documents.addAll(new ArrayList<ScoredDocument>(index.search(query_string).getResults()));
		}

		for (ScoredDocument doc : contact_documents)
		{
			entity_ids.add(Long.parseLong(doc.getId()));
		}

		Objectify ofy = ObjectifyService.begin();

		return ofy.get(Contact.class, entity_ids).values();
		// Returns contact related to doc_ids
	}

	@SuppressWarnings("unchecked")
	public static Collection<ScoredDocument> getContactDocuments(String query, RuleType type, Integer page,
			String cursor)
	{

		QueryOptions options = buildOptions(query, type, page, cursor);

		return (Collection<ScoredDocument>) performQueryWithOptions(options, query).get("fetchedDocuments");
	}

	private static Map<String, Object> performQueryWithOptions(QueryOptions options, String query)
	{
		// Build query on query options
		com.google.appengine.api.search.Query query_string = null;

		query_string = com.google.appengine.api.search.Query.newBuilder().setOptions(options).build(query);

		// Get results on query
		Index index = null;
		try
		{
			// Get index of document based on type of query
			// Get index of document based on type of query
			index = new ContactDocument().getIndex();
			System.out.println("namespace to search : " + index.getNamespace());
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		// If index is null return without querying
		if (index == null)
			return null;

		Collection<ScoredDocument> searchResults = index.search(query_string).getResults();

		Map<String, Object> documents = new HashMap<String, Object>();

		if (searchResults.size() == options.getLimit())
			documents.put("availableDocuments", index.search(query_string).getNumberFound());
		else
			documents.put("availableDocuments", Long.valueOf(searchResults.size()));

		System.out.println("number found : " + documents.get("availableDocuments"));

		documents.put("fetchedDocuments", searchResults);

		// Gets sorted documents
		return documents;
	}

	private static QueryOptions buildOptions(String query, RuleType type, Integer page, String cursor)
	{

		QueryOptions options;

		if (page != null)
		{
			/*
			 * Set query options only to get id of document (enough to get get
			 * respective contacts)
			 */
			if (cursor == null)

				options = QueryOptions.newBuilder().setReturningIdsOnly(true).setLimit(page)
						.setCursor(Cursor.newBuilder().setPerResult(true).build()).build();
			else
			{
				options = QueryOptions.newBuilder().setReturningIdsOnly(true).setLimit(page)
						.setCursor(Cursor.newBuilder().setPerResult(true).build(cursor)).build();

			}

			return options;
		}

		// Get results on query
		Index index = null;
		try
		{
			// Get index of document based on type of query
			// Get index of document based on type of query
			index = new ContactDocument().getIndex();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		// If index is null return without querying
		if (index == null)
			return null;

		return QueryOptions.newBuilder().setReturningIdsOnly(true)
				.setLimit(Long.valueOf(index.search(query).getNumberFound()).intValue()).build();

	}

	private static Collection processQuery(String query, RuleType type, Integer page, String cursor)
	{
		if (page == null)
			return processQuery(query, type);

		QueryOptions options = buildOptions(query, type, page, cursor);

		Map<String, Object> results = performQueryWithOptions(options, query);

		Collection<ScoredDocument> documents = (Collection<ScoredDocument>) results.get("fetchedDocuments");

		Long availableResults = (Long) results.get("availableDocuments");

		List<ScoredDocument> DocumentList = new ArrayList<ScoredDocument>(documents);

		List<Long> entity_ids = new ArrayList<Long>();

		// Iterate through contact_documents and add document ids(contact ids)
		// to list
		for (ScoredDocument doc : DocumentList)
		{
			entity_ids.add(Long.parseLong(doc.getId()));
			cursor = doc.getCursor().toWebSafeString();
		}

		// Returns contact related to doc_ids
		List<Contact> contactResults = ContactUtil.getContactsBulk(entity_ids);

		if (contactResults.isEmpty())
			return contactResults;

		contactResults.get(0).count = availableResults.intValue();
		contactResults.get(contactResults.size() - 1).cursor = cursor;

		return contactResults;
	}

	public static String constructQuery(List<SearchRule> rules)
	{
		String query = "";

		// Sets to contact by default
		SearchRule.RuleType ruleType = RuleType.Contact;

		for (SearchRule rule : rules)
		{
			// Checks Rules is built properly, as validations are not preset at
			// client side. Improper query raises exceptions.
			if (rule.LHS == null || rule.RHS == null || rule.CONDITION == null)
				continue;

			if (rule.nested_condition != null && rule.nested_lhs == null)
				continue;

			// Set type of rule (search on what?)
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
				/*
				 * Create new query with LHS and RHS conditions to be processed
				 * further for necessary queries
				 */
				String newQuery = lhs + ":" + SearchUtil.normalizeString(rhs);

				// For equals condition
				if (condition.equals(SearchRule.RuleCondition.EQUALS) || condition.equals(SearchRule.RuleCondition.ON))
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
				query = createTimeQuery(query, SearchUtil.normalizeString(rhs) + "_time", nestedCondition, nestedLhs,
						nestedRhs);
			}
		}
		return query;
	}
}
