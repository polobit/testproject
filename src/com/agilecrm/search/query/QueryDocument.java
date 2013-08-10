package com.agilecrm.search.query;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.reports.Reports;
import com.agilecrm.search.QueryInterface;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.util.SearchUtil;
import com.google.appengine.api.search.Cursor;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.Query;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.ScoredDocument;
import com.googlecode.objectify.Key;
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
public class QueryDocument<T> implements QueryInterface
{

	private Index index;
	public Class<T> clazz;

	public QueryDocument(Index index, Class<T> clazz)
	{
		this.index = index;
		this.clazz = clazz;
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
		// Normalizes the string. Removes spaces from the string as space are
		// excluded while saving in documents
		SearchUtil.normalizeString(keyword);

		/*
		 * Builds the query, search on field search_tokens(since contact
		 * properties are split in to fragments, and saved in document with
		 * filed name search_tokens)
		 */
		String query = "search_tokens : " + keyword;

		return processQuery(query, count, cursor);
	}

	/**
	 * Simple search based on key words with type as extra parameter, which is
	 * used to fetch a particular set of either Contact or list of companies.
	 * 
	 * @param keyword
	 * @param count
	 * @param cursor
	 * @param type
	 * @return
	 */
	public Collection<T> simpleSearchWithType(String keyword, Integer count, String cursor, String type)
	{
		SearchUtil.normalizeString(keyword);
		return processQuery("search_tokens:" + keyword + " AND type:" + type, count, cursor);
	}

	/**
	 * Queries document based on {@link SearchRule}, Executes the query and
	 * returns collection of entities. This search is without cursor, it is used
	 * to generate reports as all available entities should be sent
	 * 
	 * @param rules
	 *            {@link List} of {@link SearchRule}
	 * 
	 * @return {@link Collection} query results of type {@link T}
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public Collection<T> advancedSearch(List<SearchRule> rules)
	{

		// Construct query string based on SearchRule object
		String query = QueryDocumentUtil.constructQuery(rules);

		// If query is empty (It may happen if client side validation failed, or
		// any de-serialization issue)
		if (StringUtils.isEmpty(query))
			return new ArrayList<T>();

		// Return query results
		return processQuery(query);
	}

	/**
	 * Advanced search used with cursor, used to show filter results.
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public Collection advancedSearch(List<SearchRule> rules, Integer count, String cursor)
	{

		// Construct query based on rules
		String query = QueryDocumentUtil.constructQuery(rules);

		System.out.println("query build is : " + query);

		if (StringUtils.isEmpty(query))
			return new ArrayList();

		// return query results
		return processQuery(query, count, cursor);
	}

	/**
	 * Builds query options and process queries based on the options builds with
	 * cursor and limit.
	 * 
	 * @param query
	 * @param page
	 * @param cursor
	 * @return
	 */
	private Collection<T> processQuery(String query, Integer page, String cursor)
	{
		// If page size is not specified, returns results with out any limit
		// (Returns are entities )
		if (page == null)
			return processQuery(query);

		// Builds options based on the query string, page size (limit) and sets
		// cursor.
		QueryOptions options = buildOptions(query, page, cursor);

		// Calls process the query with the options built. It returns results in
		// a map with available entities count and document ids limited to count
		// sent
		Map<String, Object> results = processQueryWithOptions(options, query);

		// Fetches entities from datastore based on the document ids returned.
		// The type of the it entities are fetched dynamically, based on the
		// class template
		return getDatastoreEntities(results, page, cursor);
	}

	/**
	 * Builds options based on cursor and page size. Number found accuracy
	 * should be set to get correct number of results available in according to
	 * text search documentation
	 * 
	 * @param query
	 * @param page
	 * @param cursor
	 * @return
	 */
	private QueryOptions buildOptions(String query, Integer page, String cursor)
	{

		QueryOptions options;

		/*
		 * If page size is not null, cursor is set and options are built
		 * accordingly
		 */
		if (page != null)
		{
			/*
			 * Set query options only to get id of document (enough to get get
			 * respective contacts). Number found accuracy should be set to get
			 * accurate total number of available documents.
			 */
			if (cursor == null)

				options = QueryOptions.newBuilder().setReturningIdsOnly(true).setLimit(page)
						.setCursor(Cursor.newBuilder().setPerResult(true).build()).setNumberFoundAccuracy(10000)
						.build();
			else
			{
				options = QueryOptions.newBuilder().setReturningIdsOnly(true).setLimit(page)
						.setCursor(Cursor.newBuilder().setPerResult(true).build(cursor)).setNumberFoundAccuracy(10000)
						.build();

			}

			return options;
		}

		// If index is null return without querying
		if (index == null)
			return null;

		return QueryOptions.newBuilder().setReturningIdsOnly(true)
				.setLimit(Long.valueOf(index.search(query).getNumberFound()).intValue()).build();
	}

	/**
	 * processes query and return collection of contacts. It returns all the the
	 * entities (entities from datastore related to document ids returned in
	 * search)
	 * 
	 * @param query
	 *            {@link String}
	 * @param type
	 *            {@link Reports.ReportType}
	 * @return
	 */
	private Collection<T> processQuery(String query)
	{
		// If index is null return without querying
		if (index == null)
			return null;

		/*
		 * Sets query options only to get id of document (enough to get get
		 * respective contacts). Default query returns without page limit it max
		 * 1000 entities. To all matching results, documents should be fetch in
		 * sets of 1000 documents at time
		 */
		QueryOptions options = QueryOptions.newBuilder().setLimit(1000)
				.setCursor(Cursor.newBuilder().setPerResult(true).build()).setReturningIdsOnly(true)
				.setNumberFoundAccuracy(10000).build();

		// Builds query on query options
		Query query_string = Query.newBuilder().setOptions(options).build(query);

		// Gets sorted documents
		List<ScoredDocument> contact_documents = new ArrayList<ScoredDocument>(index.search(query_string).getResults());

		/*
		 * As text search returns only 1000 in a query, we fetch remaining
		 * documents.
		 */
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

			// Fetches next 1000 documents and them to list
			contact_documents.addAll(new ArrayList<ScoredDocument>(index.search(query_string).getResults()));
		}

		// Return datastore entities based on documents.
		return getDatastoreEntities(contact_documents);
	}

	/**
	 * Processes the query string further with the query options build.
	 * 
	 * @param options
	 * @param query
	 * @return
	 */
	private Map<String, Object> processQueryWithOptions(QueryOptions options, String query)
	{
		// Build query on query options
		Query query_string = Query.newBuilder().setOptions(options).build(query);

		// If index is null return without querying
		if (index == null)
			return null;

		// Fetches documents based on query options
		Collection<ScoredDocument> searchResults = index.search(query_string).getResults();

		// Results fetched and total number of available contacts are set in map
		Map<String, Object> documents = new HashMap<String, Object>();

		// If cursor is not set, considering it is first set of results, total
		// number of availabe contacts is set
		if (options.getCursor().toWebSafeString() == null)
		{
			// If search results size is less than limit set, the returned doc
			// ids are considered as total local available documents.
			if (options.getLimit() > searchResults.size())
				documents.put("availableDocuments", Long.valueOf(searchResults.size()));
			else
				documents.put("availableDocuments", index.search(query_string).getNumberFound());
		}

		System.out.println("number found : " + documents.get("availableDocuments"));

		documents.put("fetchedDocuments", searchResults);

		// Gets sorted documents
		return documents;
	}

	/**
	 * Returns documents ids list that are fetched in the query
	 * 
	 * @param rules
	 * @param count
	 * @param cursor
	 * @return
	 */
	public List<Long> getDocumentIds(List<SearchRule> rules, Integer count, String cursor)
	{

		String query = QueryDocumentUtil.constructQuery(rules);

		if (StringUtils.isEmpty(query))
			return new ArrayList();

		// return query results
		Collection<ScoredDocument> contact_documents = getDocuments(query, count, cursor);

		List<Long> entity_ids = new ArrayList<Long>();

		for (Document document : contact_documents)
		{
			entity_ids.add(Long.parseLong(document.getId()));
		}

		return entity_ids;
	}

	/**
	 * Returns documents after processing given query
	 * 
	 * @param query
	 * @param page
	 * @param cursor
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Collection<ScoredDocument> getDocuments(String query, Integer page, String cursor)
	{

		QueryOptions options = buildOptions(query, page, cursor);

		return (Collection<ScoredDocument>) processQueryWithOptions(options, query).get("fetchedDocuments");
	}

	/**
	 * Returns data store entities. fetches all the entities and sets total
	 * number of entities available on first entity and cursor on last entity
	 * 
	 * @param results
	 * @param page
	 * @param cursor
	 * @return
	 */
	public Collection<T> getDatastoreEntities(Map<String, Object> results, Integer page, String cursor)
	{
		Collection<ScoredDocument> documents = (Collection<ScoredDocument>) results.get("fetchedDocuments");

		Long availableResults = (Long) results.get("availableDocuments");

		// Converts collection of documents in to a list, it enable easy
		// retrieval of documents based on index
		List<ScoredDocument> DocumentList = new ArrayList<ScoredDocument>(documents);

		System.out.println(DocumentList);

		// Fetches Entites. It fetches based on the template type on the class
		// in datastore and returns a list
		List<T> entities = getDatastoreEntities(documents);

		// If list is empty return
		if (entities.size() == 0)
			return entities;

		// If cursor is null then total numer of available entities is set in
		// first entity Cursor object
		if (cursor == null && page > 0)
		{
			T entity = entities.get(0);
			com.agilecrm.cursor.Cursor agileCursor = (com.agilecrm.cursor.Cursor) entity;
			agileCursor.count = availableResults.intValue();
		}

		return entities;
	}

	/**
	 * Iterates though contact documents in and fetch respective entities from
	 * datastore based on document ids. It also sets cursor on the last entity
	 * if class supports {@link com.agilecrm.cursor.Cursor}
	 * 
	 * @param DocumentList
	 * @return
	 */
	public List<T> getDatastoreEntities(Collection<ScoredDocument> DocumentList)
	{
		List<Long> entity_ids = new ArrayList<Long>();

		List<Key<T>> keys = new ArrayList<Key<T>>();

		String newCursor = null;

		// Iterate through contact_documents and add document ids(contact ids)
		// to list
		for (ScoredDocument doc : DocumentList)
		{
			entity_ids.add(Long.parseLong(doc.getId()));
			newCursor = doc.getCursor().toWebSafeString();
		}

		// Add keys
		for (Long id : entity_ids)
		{
			try
			{
				// Adds to keys list
				keys.add(new Key<T>(clazz, id));
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}

		Objectify ofy = ObjectifyService.begin();

		// Fetches entites based on the template type of current class
		List<T> entities = new ArrayList<T>(ofy.get(clazz, entity_ids).values());

		if (entities.size() == 0)
			return entities;

		if ((entities instanceof com.agilecrm.cursor.Cursor))
		{
			// Gets last entity to set cursor on it
			T entity = entities.get(entities.size() - 1);

			com.agilecrm.cursor.Cursor agileCursor = null;
			if (newCursor != null)
			{
				agileCursor = (com.agilecrm.cursor.Cursor) entity;
				agileCursor.cursor = newCursor;
			}
		}

		return entities;
	}

}
