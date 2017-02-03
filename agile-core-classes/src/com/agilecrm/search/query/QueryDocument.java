package com.agilecrm.search.query;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.SearchFilter;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.exception.SearchQueryException;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
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
import com.google.appengine.api.search.QueryOptions.Builder;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchException;
import com.google.appengine.api.search.SortExpression;
import com.google.appengine.api.search.SortExpression.SortDirection;
import com.google.appengine.api.search.SortOptions;
import com.googlecode.objectify.Key;

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

    public boolean isBackendOperations = false;

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
    @Override
    public Collection<T> simpleSearch(String keyword, Integer count, String cursor)
    {
	// Normalizes the string. Removes spaces from the string as space are
	// excluded while saving in documents
	keyword = SearchUtil.normalizeString(keyword).replace(":", "\\:");
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
    @Override
    public Collection<T> simpleSearchWithType(String keyword, Integer count, String cursor, String type){
    	return getSimpleSearchResultsWithType(keyword, count, cursor, type, true);
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

	System.out.println(rules);

	// Construct query string based on SearchRule object
	String query = QueryDocumentUtil.constructQuery(rules, "AND");

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
    public Collection<T> advancedSearch(List<SearchRule> rules, Integer count, String cursor, String orderBy)
    {

	// Construct query based on rules
	String query = QueryDocumentUtil.constructQuery(rules, "AND");

	System.out.println("query build is : " + query);

	if (StringUtils.isEmpty(query))
	    return new ArrayList<T>();

	// return query results
	return processQuery(query, count, cursor, orderBy);
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
    public Collection<T> advancedSearch(SearchFilter filter)
    {
	// Construct query string based on SearchRule object
	String query = QueryDocumentUtil.constructFilterQuery(filter);
	System.out.println("query build is : " + query);

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
    public Collection<T> advancedSearch(SearchFilter filter, Integer count, String cursor, String orderBy)
    {
	String query = QueryDocumentUtil.constructFilterQuery(filter);
	System.out.println("query build is : " + query);

	if (StringUtils.isEmpty(query))
	    return new ArrayList<T>();

	// return query results
	return processQuery(query, count, cursor, orderBy);
    }
    
    /**
     * Advanced search used with cursor, used to show filter results.
     */
    @Override
    @SuppressWarnings("rawtypes")
    public Collection<T> advancedSearch(SearchFilter filter, Integer count, String cursor, String orderBy, 
    		boolean isNumberFoundAccuracyRequired)
    {
	String query = QueryDocumentUtil.constructFilterQuery(filter);
	System.out.println("query build is : " + query);

	if (StringUtils.isEmpty(query))
	    return new ArrayList<T>();

	// return query results
	return processQuery(query, count, cursor, orderBy, isNumberFoundAccuracyRequired);
    }
    
    /**
     * Advanced search used with cursor, used to show filter results.
     */
    @Override
    @SuppressWarnings("rawtypes")
    public int advancedSearchCount(SearchFilter filter)
    {
	String queryString = QueryDocumentUtil.constructFilterQuery(filter);
	System.out.println("query build is : " + queryString);

	if (StringUtils.isEmpty(queryString))
	    return 0;

	// return query results count
	QueryOptions options = QueryOptions.newBuilder().setNumberFoundAccuracy(10000).build();

	Query query = Query.newBuilder().setOptions(options).build(queryString);

	return (int) index.search(query).getNumberFound();
    }

    /**
     * Advanced search used with cursor, used to show filter results.
     */
    @Override
    @SuppressWarnings("rawtypes")
    public List<ScoredDocument> advancedSearchOnlyIds(SearchFilter filter, Integer count, String cursor, String orderBy)
    {
	String query = QueryDocumentUtil.constructFilterQuery(filter);
	System.out.println("query build is : " + query);

	if (StringUtils.isEmpty(query))
	    return new ArrayList<ScoredDocument>();

	// return query results
	return processQueryReturnIds(query, count, cursor, orderBy);
    }

    /**
     * Advanced search used with cursor, used to show filter results.
     */
    @Override
    public int advancedSearchCount(List<SearchRule> rules)
    {
	// If index is null return without querying
	if (index == null)
	    return 0;

	// Construct query based on rules
	String queryString = QueryDocumentUtil.constructQuery(rules, "AND");
	System.out.println("query build is : " + queryString);

	if (StringUtils.isEmpty(queryString))
	    return 0;

	/*
	 * If page size is not null, cursor is set and options are built
	 * accordingly
	 */

	QueryOptions options = QueryOptions.newBuilder().setNumberFoundAccuracy(10000).build();

	Query query = Query.newBuilder().setOptions(options).build(queryString);

	return (int) index.search(query).getNumberFound();
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
    public Collection<T> processQuery(String query, Integer page, String cursor)
    {
	// If page size is not specified, returns results with out any limit
	// (Returns are entities )
	if (page == null)
	    return processQuery(query);

	// Builds options based on the query string, page size (limit) and sets
	// cursor.
	QueryOptions options = buildOptions(query, page, cursor, true);

	// Calls process the query with the options built. It returns results in
	// a map with available entities count and document ids limited to count
	// sent
	Map<String, Object> results = processQueryWithOptions(options, query);

	// Fetches entities from datastore based on the document ids returned.
	// The type of the it entities are fetched dynamically, based on the
	// class template
	return getDatastoreEntities(results, page, cursor);
    }

    public List<ScoredDocument> processQueryReturnIds(String query, Integer page, String cursor, String orderBy)
    {
	// Builds options based on the query string, page size (limit) and sets
	// cursor.
	QueryOptions options = buildOptions(query, page, cursor, true);

	Map<String, Object> results = processQueryWithOptions(options, query);

	Collection<ScoredDocument> resultSetDocuments = (Collection<ScoredDocument>) results.get("fetchedDocuments");

	if (resultSetDocuments == null)
	    return new ArrayList<ScoredDocument>();

	return new ArrayList<ScoredDocument>(resultSetDocuments);
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
    // Use this only if operation is backend operation
    List<T> entities = new ArrayList<T>();
    int requests = 0;

    public Collection<T> processQuery(String query, Integer page, String cursor, String orderBy)
    {
    	return processTextsearchQuery(query, page, cursor, orderBy, true, false);
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
    private QueryOptions buildOptions(String query, Integer page, String cursor, boolean isNumberFoundAccuracyRequired)
    {

	QueryOptions options;

	/*
	 * If page size is not null, cursor is set and options are built
	 * accordingly
	 */
	if (page != null)
	{
		Builder optionsBuilder = null;
	    /*
	     * Set query options only to get id of document (enough to get get
	     * respective contacts). Number found accuracy should be set to get
	     * accurate total number of available documents.
	     */
	    if (cursor == null)
	    {
	    	optionsBuilder = QueryOptions.newBuilder().setFieldsToReturn("type").setLimit(page)
	    			.setCursor(Cursor.newBuilder().setPerResult(true).build());
	    }
	    else
	    {
	    	optionsBuilder = QueryOptions.newBuilder().setFieldsToReturn("type").setLimit(page)
	    			.setCursor(Cursor.newBuilder().setPerResult(true).build(cursor));
	    }
	    
	    if(optionsBuilder != null)
	    {
	    	if(isNumberFoundAccuracyRequired)
	    	{
	    		optionsBuilder.setNumberFoundAccuracy(10000);
	    	}
	    	else
	    	{
	    		optionsBuilder.setNumberFoundAccuracy(page);
	    	}
	    	options = optionsBuilder.build();
	    	return options;
	    }
	}

	// If index is null return without querying
	if (index == null)
	{
	    System.out.println("index is null");
	    return null;
	}

	return QueryOptions.newBuilder().setReturningIdsOnly(true)
		.setLimit(Long.valueOf(index.search(query).getNumberFound()).intValue()).build();
    }

    /**
     * processes query and return the actual QueryDocuments of contacts. Added
     * by Manohar
     * 
     * @param query
     *            {@link String}
     * @param type
     *            {@link Reports.ReportType}
     * @return
     */
    private List<ScoredDocument> getDocuments(String query)
    {
	return getDocuments(query, null);
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

	// Get Documents for this query
	List<ScoredDocument> contact_documents = getDocuments(query);

	// Return datastore entities based on documents.
	return getDatastoreEntities(contact_documents, Long.valueOf(contact_documents.size()));
    }

    /**
     * processes query and return the actual QueryDocuments of contacts.
     * 
     * @param query
     * @param orderBy
     * @return
     */
    public List<ScoredDocument> getDocuments(String query, String orderBy)
    {
	SortOptions sortOptions = null;
	if (StringUtils.isNotBlank(orderBy))
	{
	    SortExpression sortExpression = null;
	    if (orderBy.startsWith("-"))
	    {
		sortExpression = SortExpression.newBuilder().setExpression(orderBy.substring(1))
			.setDirection(SortDirection.DESCENDING).build();
	    }
	    else
	    {
		sortExpression = SortExpression.newBuilder().setExpression(orderBy.substring(1))
			.setDirection(SortDirection.ASCENDING).build();
	    }
	    sortOptions = SortOptions.newBuilder().addSortExpression(sortExpression).build();
	}

	/*
	 * Sets query options only to get id of document (enough to get get
	 * respective contacts). Default query returns without page limit it max
	 * 1000 entities. To all matching results, documents should be fetch in
	 * sets of 1000 documents at time
	 */
	QueryOptions options = QueryOptions.newBuilder().setLimit(1000).setSortOptions(sortOptions)
		.setCursor(Cursor.newBuilder().setPerResult(true).build()).setFieldsToReturn("type")
		.setNumberFoundAccuracy(10000).build();

	// Builds query on query options
	Query query_string = Query.newBuilder().setOptions(options).build(query);

	// Gets sorted documents
	List<ScoredDocument> contact_documents = new ArrayList<ScoredDocument>(index.search(query_string).getResults());

	if (contact_documents.size() == 0)
	    return new ArrayList();

	String cursorString = contact_documents.get(contact_documents.size() - 1).getCursor().toWebSafeString();
	/*
	 * As text search returns only 1000 in a query, we fetch remaining
	 * documents.
	 */

	if (contact_documents.size() >= 1000 && contact_documents.get(contact_documents.size() - 1).getCursor() != null)
	    do
	    {
		cursorString = contact_documents.get(contact_documents.size() - 1).getCursor().toWebSafeString();

		System.out.println("while" + contact_documents.get(contact_documents.size() - 1).getCursor());
		options = QueryOptions
			.newBuilder()
			.setLimit(1000)
			.setCursor(
				Cursor.newBuilder()
					.setPerResult(true)
					.build(contact_documents.get(contact_documents.size() - 1).getCursor()
						.toWebSafeString())).setFieldsToReturn("type").build();

		// Build query on query options
		query_string = Query.newBuilder().setOptions(options).build(query);

		// Fetches next 1000 documents and them to list
		contact_documents.addAll(new ArrayList<ScoredDocument>(index.search(query_string).getResults()));
		System.out.println("results fetched : " + contact_documents.size());
	    } while (contact_documents.get(contact_documents.size() - 1).getCursor() != null
		    && !StringUtils.equals(cursorString, contact_documents.get(contact_documents.size() - 1)
			    .getCursor().toWebSafeString()));

	System.out.println("total count  : " + contact_documents.size());

	return contact_documents;
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
    	return processTextsearchQueryWithOptions(options, query, true);
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
	String query = QueryDocumentUtil.constructQuery(rules, "AND");

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

	QueryOptions options = buildOptions(query, page, cursor, true);

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
    public Collection getDatastoreEntities(Map<String, Object> results, Integer page, String cursor)
    {
    Long time = System.currentTimeMillis();
	Collection<ScoredDocument> documents = (Collection<ScoredDocument>) results.get("fetchedDocuments");

	Long availableResults = (Long) results.get("availableDocuments");

	// Converts collection ochf documents in to a list, it enable easy
	// retrieval of documents based on index
	List<ScoredDocument> DocumentList = new ArrayList<ScoredDocument>(documents);

	// Fetches Entites. It fetches based on the template type on the class
	// in datastore and returns a list
	List entities = getDatastoreEntities(documents, availableResults);

	// If list is empty return
	if (entities.size() == 0)
	    return entities;

	// If cursor is null then total numer of available entities is set in
	// first entity Cursor object
	if (cursor == null && page > 0)
	{
	    Object entity = entities.get(0);
	    com.agilecrm.cursor.Cursor agileCursor = (com.agilecrm.cursor.Cursor) entity;
	    if(availableResults != null)
	    {
	    	agileCursor.count = availableResults.intValue();
	    }
	}
	System.out.println("Time to get only datastore entities ---------- "+(System.currentTimeMillis() - time)+" milli seconds");
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
    public List getDatastoreEntities(Collection<ScoredDocument> DocumentList, Long count)
    {
	String newCursor = null;

	if (clazz != null)
	    return getGenericEntites(DocumentList, count);

	Map<Type, List<Long>> typeKeyMap = new HashMap<Type, List<Long>>();

	// Iterate through contact_documents and add document ids(contact ids)
	// to list
	for (ScoredDocument doc : DocumentList)
	{
	    String type = Type.CONTACT.toString();

	    if (doc.getFieldCount("type") > 0 && doc.getFieldCount("type") <= 1)
		type = doc.getOnlyField("type").getText();
	    
	    //If fields are more than 1 with name "type", iterate them and set object type (quick search fix for "mtxcomputer" domain)
	    if(doc.getFieldCount("type") > 1)
	    {
	    	Iterable<com.google.appengine.api.search.Field> typeFields = doc.getFields("type");
	    	for(com.google.appengine.api.search.Field fld : typeFields)
	    	{
	    		if(fld != null)
	    		{
	    			String fldName = fld.getText();
	    			if(fldName != null && (fldName.equals(Type.PERSON.toString()) || fldName.equals(Type.COMPANY.toString()) 
	    					|| fldName.equals(Type.CONTACT.toString()) || fldName.equals(Type.OPPORTUNITY) || fldName.equals(Type.CASES)
	    					|| fldName.equals(Type.DOCUMENT) || fldName.equals(Type.TICKETS)))
	    			{
	    				type = fldName;
	    				break;
	    			}
	    		}
	    	}
	    }

	    Class entityClazz = QueryInterface.Type.valueOf(type).getClass();

	    if (typeKeyMap.containsKey(Type.valueOf(type)))
	    {
		typeKeyMap.get(Type.valueOf(type)).add(Long.parseLong(doc.getId()));
	    }
	    else
	    {
		List<Long> keys = new ArrayList<Long>();
		keys.add(Long.parseLong(doc.getId()));
		typeKeyMap.put(Type.valueOf(type), keys);
	    }

	    newCursor = doc.getCursor().toWebSafeString();
	}

	List entities = new ArrayList();

	for (Type key : typeKeyMap.keySet())
	{
	    List<Long> ids = typeKeyMap.get(key);
	    entities.addAll(QueryDocumentUtil.getEntities(key, ids));
	}

	if (entities.isEmpty())
	    return entities;

	// Gets last entity to set cursor on it
	Object entity = entities.get(entities.size() - 1);

	if ((entity instanceof com.agilecrm.cursor.Cursor))
	{

	    com.agilecrm.cursor.Cursor agileCursor = null;
	    if (newCursor != null)
	    {
		agileCursor = (com.agilecrm.cursor.Cursor) entity;
		agileCursor.cursor = newCursor;
	    }
	}

	return entities;
    }

    /**
     * Fetches entities based on generic type set on current class.
     * 
     * @param documentList
     * @return
     */
    public List<T> getGenericEntites(Collection<ScoredDocument> documentList, Long count)
    {
	List<Key<T>> entityKeys = new ArrayList<Key<T>>();

	String cursor = "";
	// Creates keys out of document ids
	for (ScoredDocument doc : documentList)
	{
	    Key<T> key = new Key<T>(clazz, Long.parseLong(doc.getId()));
	    entityKeys.add(key);
	    cursor = doc.getCursor().toWebSafeString();
	}

	// System.out.println(entityKeys);

	try
	{
	    // Fetches dao field based on class using reflection API
	    Field o = clazz.getDeclaredField("dao");
	    ObjectifyGenericDao<T> dao = (ObjectifyGenericDao<T>) o.get(null);
	    return (List<T>) setCursors(dao.fetchAllByKeys(entityKeys), cursor, count);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return new ArrayList<T>();

    }

    public static List<com.agilecrm.cursor.Cursor> setCursors(List entities, String cursor, Long numberOfContacts)
    {
	if (entities.size() == 0)
	    return entities;

	Object lastEntity = entities.get(entities.size() - 1);
	Object firstEntity = entities.get(0);

	if (lastEntity instanceof com.agilecrm.cursor.Cursor)
	{
	    com.agilecrm.cursor.Cursor agileCursor = null;
	    if (cursor != null && entities.size() != 0)
	    {
		agileCursor = (com.agilecrm.cursor.Cursor) lastEntity;
		agileCursor.cursor = cursor;
	    }
	}

	if (firstEntity instanceof com.agilecrm.cursor.Cursor)
	{
	    com.agilecrm.cursor.Cursor agileCursor = null;
	    if (cursor != null && numberOfContacts != null && entities.size() != 0)
	    {
		agileCursor = (com.agilecrm.cursor.Cursor) lastEntity;
		agileCursor.count = numberOfContacts.intValue();
	    }
	}

	return entities;
    }

    private Long getCount(String query)
    {
	if (index == null)
	    return 0l;

	return index.search(query).getNumberFound();
    }

    public Long getCount(List<SearchRule> rules)
    {
	String query = QueryDocumentUtil.constructQuery(rules, "AND");
	System.out.println("Query is : " + query);
	return getCount(query);
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
    @Override
    public Collection<T> simpleSearchWithTypeAndQuery(String query, Integer count, String cursor, String type)
    {
	query = SearchUtil.normalizeString(query);
	return processQuery(query + " AND type:" + type, count, cursor);
    }
    
    /**
     * Queries for contacts based on keywords(Simple search). Trims spaces in
     * the keyword and calls processQueryReturnDocs to execute the condition
     * 
     * @param keyword
     *            {@link String}
     * @return {@link Collection}
     */
    @Override
    public List<ScoredDocument> simpleSearchWithoutDatastoreEntities(String keyword, Integer count, String cursor)
    {
	// Normalizes the string. Removes spaces from the string as space are
	// excluded while saving in documents
	keyword = SearchUtil.normalizeString(keyword).replace(":", "\\:");
	/*
	 * Builds the query, search on field search_tokens(since contact
	 * properties are split in to fragments, and saved in document with
	 * filed name search_tokens)
	 */
	String query = "search_tokens : " + keyword;
	
	return processQueryReturnDocs(query, count, cursor);
    }
    
    public List<ScoredDocument> processQueryReturnDocs(String query, Integer page, String cursor)
    {
	// Builds options based on the query string, page size (limit) and sets
	// cursor.
	QueryOptions options = buildOptionsForQuickSearch(query, page, cursor);

	Map<String, Object> results = processQueryWithOptions(options, query);

	Collection<ScoredDocument> resultSetDocuments = (Collection<ScoredDocument>) results.get("fetchedDocuments");

	if (resultSetDocuments == null)
	    return new ArrayList<ScoredDocument>();

	return new ArrayList<ScoredDocument>(resultSetDocuments);
    }
    
    private QueryOptions buildOptionsForQuickSearch(String query, Integer page, String cursor)
    {

	QueryOptions options;

	/*
	 * If page size is not null, cursor is set and options are built
	 * accordingly
	 */
	if (page != null)
	{
		String[] fieldsToReturn = {"type", "first_name", "last_name", "email", "name", "url", "expected_value", "probability"};
	    
		/*
	     * Set query options only to get id of document (enough to get get
	     * respective contacts). Number found accuracy should be set to get
	     * accurate total number of available documents.
	     */
	    if (cursor == null)
	    {
	    	options = QueryOptions.newBuilder().setFieldsToReturn(fieldsToReturn).setLimit(page)
	    			.setCursor(Cursor.newBuilder().setPerResult(true).build()).setNumberFoundAccuracy(10000).build();
	    }
	    else
	    {
	    	options = QueryOptions.newBuilder().setFieldsToReturn(fieldsToReturn).setLimit(page)
	    			.setCursor(Cursor.newBuilder().setPerResult(true).build(cursor)).setNumberFoundAccuracy(10000).build();
	    }

	    return options;
	}

	// If index is null return without querying
	if (index == null)
	{
	    System.out.println("index is null");
	    return null;
	}

	return QueryOptions.newBuilder().setReturningIdsOnly(true)
		.setLimit(Long.valueOf(index.search(query).getNumberFound()).intValue()).build();
    }
    
    @Override
    public List<ScoredDocument> simpleSearchWithTypeWithoutDatastoreEntities(String keyword, Integer count, String cursor, String type){
    	return processSearchResults(keyword, count, cursor, type);
    }
    
    @Override
    public List processSearchResults(String keyword, Integer count, String cursor, String type){
		keyword = SearchUtil.normalizeString(keyword);
		String typeFields = "";
		String typeField = null;
		if(type != null){
			String[] typeStrings = type.split(",");
			for (int i = 0; i < typeStrings.length; i++) {
				if(StringUtils.isBlank(typeStrings[i]))
					continue;
				
				typeField  = typeStrings[i].toUpperCase();
				typeFields += (i == 0 ? "" : " OR ") + "type : " + typeField;
			}
		}
		
		List entities =  null ;
		try
		{
			entities = processQueryReturnDocs("search_tokens:" + keyword + " AND " + typeFields, count, cursor);
		}
		catch(Exception e){
			throw new SearchQueryException("Search input is not supported. Please try again.");
		}
		try{			
			if(typeField != null && entities != null){
				String localKeyword = keyword.toLowerCase();			
				
				ArrayList<Object> mainList = new ArrayList<Object>();
				ArrayList<Object> secondarList = new ArrayList<Object>();
				
				Iterator<?> itr = entities.iterator();
				List<ScoredDocument> scoredDocuments = new ArrayList<ScoredDocument>();
			    //iterate through the ArrayList values using Iterator's hasNext and next methods
			    while(itr.hasNext()){
			    	Object object = itr.next();
			    	String objType = null;
			    	ScoredDocument sc = (ScoredDocument)object;
		    		Iterator<com.google.appengine.api.search.Field> scItr = sc.getFields("type").iterator();
		    		while(scItr.hasNext())
		    		{
		    			com.google.appengine.api.search.Field f = scItr.next();
		    			objType = f.getText();
		    		}
			    	if("PERSON".equals(objType) || "LEAD".equals(objType)){
			    		Contact contact = convertDocToContact(object);
			    		
			    		ContactField firstNameField = contact.getContactField(Contact.FIRST_NAME);
			    		ContactField lastNameField = contact.getContactField(Contact.LAST_NAME);
			    		String firstName = null;
			    		String lastName = null;		
			    		
			    		if(firstNameField != null){
			    			firstName = firstNameField.value.toLowerCase();
			    		}
			    		if(lastNameField != null){
			    			lastName = lastNameField.value.toLowerCase();
			    		}
			    		
				    	if(firstName != null && firstName.indexOf(localKeyword) >= 0){
				    		mainList.add(contact);
				    	}else if(lastName != null && lastName.indexOf(localKeyword) >= 0){
				    		mainList.add(contact);
				    	}else {
				    		secondarList.add(contact);
				    	}
				    }else {
				    	scoredDocuments.add(sc);
				    }
			    }
			    
			    List l = getDatastoreEntities(scoredDocuments, 10L);
			    
			    itr = l.iterator();		 	
			    //iterate through the ArrayList values using Iterator's hasNext and next methods
			    while(itr.hasNext()){
			    	Object object = itr.next();
			    	if(object instanceof Contact)
			    	{
			    		Contact contact = (Contact) object;
			    		com.agilecrm.contact.Contact.Type contactType = contact.type;
			    		if(contactType.equals(com.agilecrm.contact.Contact.Type.COMPANY))
			    		{
			    			ContactField nameField = contact.getContactField(Contact.NAME);
				    		if(nameField != null){
					    		String name = nameField.value.toLowerCase();
						    	if(name != null && name.indexOf(localKeyword) >= 0){
						    		mainList.add(contact);
						    	}else {
						    		secondarList.add(contact);
						    	}
				    		}
			    		}
			    	}else if(object instanceof Opportunity){
				    	Opportunity deal = (Opportunity) object;
				    	String name = deal.name;
			    		if(name != null){
				    		name = name.toLowerCase();
					    	if(name != null && name.indexOf(localKeyword) >= 0){
					    		mainList.add(deal);
					    	}else {
					    		secondarList.add(deal);
					    	}
			    		}				    	
				    }else if(object instanceof com.agilecrm.document.Document){
				    	com.agilecrm.document.Document document  = (com.agilecrm.document.Document) object;
				    	String name = document.name;
			    		if(name != null){
				    		name = name.toLowerCase();
					    	if(name != null && name.indexOf(localKeyword) >= 0){
					    		mainList.add(document);
					    	}else {
					    		secondarList.add(document);
					    	}
			    		}
				    }else {
				    	secondarList.add(object);
				    }
			    }
			    
			    mainList.addAll(secondarList);			   
			    entities = (List)mainList;			    
			}
		}catch (Exception e){
			System.out.println("Exception occured while sorting search results : "+e.getMessage());			
		}
		
		return entities;
    }
    
    private Contact convertDocToContact(Object object)
    {
    	ScoredDocument sc = (ScoredDocument)object;
    	List<ContactField> properties = new ArrayList<ContactField>();
    	String objType = null;
    	
    	Iterator<com.google.appengine.api.search.Field> typeItr = sc.getFields("type").iterator();
		while(typeItr.hasNext())
		{
			com.google.appengine.api.search.Field f = typeItr.next();
			objType = f.getText();
		}
		
		if(sc.getFields("first_name") != null)
		{
			Iterator<com.google.appengine.api.search.Field> firstNameItr = sc.getFields("first_name").iterator();
			while(firstNameItr.hasNext())
			{
				com.google.appengine.api.search.Field f = firstNameItr.next();
				ContactField cf = new ContactField(Contact.FIRST_NAME, StringUtils.capitalize(f.getText()), null);
				properties.add(cf);
			}
		}
		
		if(sc.getFields("last_name") != null)
		{
			Iterator<com.google.appengine.api.search.Field> lastNameItr = sc.getFields("last_name").iterator();
			while(lastNameItr.hasNext())
			{
				com.google.appengine.api.search.Field f = lastNameItr.next();
				ContactField cf = new ContactField(Contact.LAST_NAME, StringUtils.capitalize(f.getText()), null);
				properties.add(cf);
			}
		}
		
		if(sc.getFields("name") != null)
		{
			Iterator<com.google.appengine.api.search.Field> nameItr = sc.getFields("name").iterator();
			while(nameItr.hasNext())
			{
				com.google.appengine.api.search.Field f = nameItr.next();
				ContactField cf = new ContactField(Contact.NAME, f.getText(), null);
				properties.add(cf);
			}
		}
    	
		if(sc.getFields("email") != null)
		{
			Iterator<com.google.appengine.api.search.Field> emailItr = sc.getFields("email").iterator();
			while(emailItr.hasNext())
			{
				com.google.appengine.api.search.Field f = emailItr.next();
				ContactField cf = new ContactField(Contact.EMAIL, f.getText(), null);
				properties.add(cf);
			}
		}
		
		if(sc.getFields("url") != null)
		{
			Iterator<com.google.appengine.api.search.Field> urlItr = sc.getFields("url").iterator();
			while(urlItr.hasNext())
			{
				com.google.appengine.api.search.Field f = urlItr.next();
				ContactField cf = new ContactField(Contact.URL, f.getText(), null);
				properties.add(cf);
			}
		}
		
		Contact contact = new Contact(Contact.Type.valueOf(objType), null, properties);
		if("PERSON".equals(objType))
		{
			contact.entity_type = "contact_entity";
		}
		else if("COMPANY".equals(objType))
		{
			contact.entity_type = "company_entity";
		}
		else if("LEAD".equals(objType))
		{
			contact.entity_type = "lead_entity";
		}
		
		if(sc.getId() != null)
		{
			contact.id = Long.valueOf(sc.getId());
		}
		
		return contact;
		
    }
    
    
    public Collection<T> processQuery(String query, Integer page, String cursor, String orderBy, 
    		boolean isNumberFoundAccuracyRequired)
    {
    	return processTextsearchQuery(query, page, cursor, orderBy, isNumberFoundAccuracyRequired, false);
    }
    
    public Collection<T> processTextsearchQuery(String query, Integer page, String cursor, String orderBy, 
    		boolean isNumberFoundAccuracyRequired, boolean isSortOptionsLimitRequired)
    {
    	// If page size is not specified, returns results with out any limit
    	// (Returns are entities )
    	if (page == null && orderBy == null)
    	    return processQuery(query);

    	// Builds options based on the query string, page size (limit) and sets
    	// cursor.
    	QueryOptions options = buildOptions(query, page, cursor, isNumberFoundAccuracyRequired);
    	
    	SortOptions sortOptions = null;
    	if (StringUtils.isNotBlank(orderBy))
    	{
    	    SortExpression.Builder sortExpressionBuilder = SortExpression.newBuilder();

    	    if (orderBy.startsWith("-"))
    	    {
    		orderBy = orderBy.substring(1);
    		sortExpressionBuilder = sortExpressionBuilder.setDirection(SortDirection.DESCENDING);
    	    }
    	    else
    	    {
    		sortExpressionBuilder = sortExpressionBuilder.setDirection(SortDirection.ASCENDING);
    	    }
    	    sortExpressionBuilder.setExpression(orderBy);

    	    if (ContactFilterUtil.isCustomField(orderBy))
    	    {
    		String[] fragments = orderBy.split("_AGILE_CUSTOM_");

    		if (fragments.length > 1)
    		{
    		    String type = fragments[1];
    		    com.agilecrm.contact.CustomFieldDef.Type field_type = null;
    		    try
    		    {
    			field_type = com.agilecrm.contact.CustomFieldDef.Type.valueOf(type);
    		    }
    		    catch (Exception e)
    		    {

    		    }
    		    orderBy = fragments[0];
    		    if (field_type == null)
    		    {
    			sortExpressionBuilder.setDefaultValueNumeric(0.0);
    		    }
    		    else if (field_type == com.agilecrm.contact.CustomFieldDef.Type.TEXT
    			    || field_type == com.agilecrm.contact.CustomFieldDef.Type.LIST
    			    || field_type == com.agilecrm.contact.CustomFieldDef.Type.TEXTAREA)
    		    {
    			sortExpressionBuilder.setDefaultValue("");
    		    }
    		    else if (field_type == com.agilecrm.contact.CustomFieldDef.Type.DATE
    			    || field_type == com.agilecrm.contact.CustomFieldDef.Type.NUMBER)
    		    {
    			sortExpressionBuilder.setDefaultValueNumeric(0.0);
    		    }

    		    sortExpressionBuilder.setExpression(orderBy);
    		}
    	    }
    	    else if (orderBy.contains("time") || orderBy.contains("last_contacted"))
    	    {
    		sortExpressionBuilder.setExpression(orderBy + "_epoch").setDefaultValueNumeric(0.0);
    	    }
    	    else if (orderBy.contains("name"))
    	    {
    		sortExpressionBuilder.setDefaultValue("");
    	    }
    	    else
    	    {
    		sortExpressionBuilder.setDefaultValueNumeric(0.0);
    	    }
    	    SortOptions.Builder sortOptionsBuilder = SortOptions.newBuilder().addSortExpression(sortExpressionBuilder.build());
    	    if(isSortOptionsLimitRequired)
    	    {
    	    	sortOptionsBuilder.setLimit(page);
    	    }
    	    sortOptions = sortOptionsBuilder.build();
    	    options = QueryOptions.newBuilder(options).setSortOptions(sortOptions).build();
    	}

    	// Calls process the query with the options built. It returns results in
    	// a map with available entities count and document ids limited to count
    	// sent
    	Map<String, Object> results = processTextsearchQueryWithOptions(options, query, isNumberFoundAccuracyRequired);

    	Collection<ScoredDocument> resultSetDocuments = (Collection<ScoredDocument>) results.get("fetchedDocuments");
    	
    	Collection<T> entites = getDatastoreEntities(results, page, cursor);
    	entities.addAll(entites);

    	if (isBackendOperations && resultSetDocuments != null && entities.size() < resultSetDocuments.size()
    		&& requests < 10)
    	{
    	    System.out.println("iterating again");

    	    List<ScoredDocument> tempDocuments = new ArrayList<ScoredDocument>(resultSetDocuments);
    	    String newCursor = tempDocuments.get(tempDocuments.size() - 1).getCursor().toWebSafeString();
    	    if (StringUtils.equals(cursor, newCursor) || newCursor == null)
    		return entities;

    	    page = resultSetDocuments.size() - entities.size();
    	    System.out.println("remaianing items = " + page + " cursor" + newCursor + "requests" + requests);
    	    requests++;
    	    cursor = newCursor;
    	    processQuery(query, page, newCursor, orderBy);
    	}
    	if (entities.size() > 0)
    	    return entities;

    	return entites;
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
    public Collection<T> processQuickSearchQuery(String query, Integer page, String cursor)
    {
	// If page size is not specified, returns results with out any limit
	// (Returns are entities )
	if (page == null)
	    return processQuery(query);

	// Builds options based on the query string, page size (limit) and sets
	// cursor.
	QueryOptions options = buildOptions(query, page, cursor, false);

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
     * Simple search based on key words with type as extra parameter, which is
     * used to fetch a particular set of either Contact or list of companies.
     * 
     * @param keyword
     * @param count
     * @param cursor
     * @param type
     * @return
     */
    @Override
    public Collection<T> simpleSearchWithType(String keyword, Integer count, String cursor, String type, boolean isNumberFoundAccuracyRequired){
    	return getSimpleSearchResultsWithType(keyword, count, cursor, type, isNumberFoundAccuracyRequired);
    }
    
    public Collection<T> getSimpleSearchResultsWithType(String keyword, Integer count, String cursor, String type, boolean isNumberFoundAccuracyRequired)
    {
    	keyword = SearchUtil.normalizeString(keyword);
		String typeFields = "";
		String typeField = null;
		if(type != null){
			String[] typeStrings = type.split(",");
			for (int i = 0; i < typeStrings.length; i++) {
				if(StringUtils.isBlank(typeStrings[i]))
					continue;
				
				typeField  = typeStrings[i].toUpperCase();
				typeFields += (i == 0 ? "" : " OR ") + "type : " + typeField;
			}
		}
		
		Collection<T> entities =  null ;
		try
		{
			Long time = System.currentTimeMillis();
			entities = processQuickSearchQuery("search_tokens:" + keyword + " AND " + typeFields, count, cursor);
			System.out.println("Time to process query and get entities -------- "+(System.currentTimeMillis() - time)+" milli seconds");
		}
		catch(Exception e){
			throw new SearchQueryException("Search input is not supported. Please try again.");
		}
		try{
			Long time = System.currentTimeMillis();
			if(typeField != null && entities != null){
				String localKeyword = keyword.toLowerCase();			
				
				ArrayList<Object> mainList = new ArrayList<Object>();
				ArrayList<Object> secondarList = new ArrayList<Object>();
				
				Iterator<T> itr = entities.iterator();		 	
			    //iterate through the ArrayList values using Iterator's hasNext and next methods
			    while(itr.hasNext()){
			    	Object object = itr.next();
			    	if(object instanceof Contact){
			    		Contact contact = (Contact) object;
			    		com.agilecrm.contact.Contact.Type contactType = contact.type;
			    		if(contactType.equals(com.agilecrm.contact.Contact.Type.PERSON) || contactType.equals(com.agilecrm.contact.Contact.Type.LEAD)){
				    		ContactField firstNameField = contact.getContactField(Contact.FIRST_NAME);
				    		ContactField lastNameField = contact.getContactField(Contact.LAST_NAME);
				    		String firstName = null;
				    		String lastName = null;		
				    		
				    		if(firstNameField != null){
				    			firstName = firstNameField.value.toLowerCase();
				    		}
				    		if(lastNameField != null){
				    			lastName = lastNameField.value.toLowerCase();
				    		}
				    		
					    	if(firstName != null && firstName.indexOf(localKeyword) >= 0){
					    		mainList.add(contact);
					    	}else if(lastName != null && lastName.indexOf(localKeyword) >= 0){
					    		mainList.add(contact);
					    	}else {
					    		secondarList.add(contact);
					    	}
					    }else if(contactType.equals(com.agilecrm.contact.Contact.Type.COMPANY)){
				    		ContactField nameField = contact.getContactField(Contact.NAME);
				    		if(nameField != null){
					    		String name = nameField.value.toLowerCase();
						    	if(name != null && name.indexOf(localKeyword) >= 0){
						    		mainList.add(contact);
						    	}else {
						    		secondarList.add(contact);
						    	}
				    		}
					    }
				    }else if(object instanceof Opportunity){
				    	Opportunity deal = (Opportunity) object;
				    	String name = deal.name;
			    		if(name != null){
				    		name = name.toLowerCase();
					    	if(name != null && name.indexOf(localKeyword) >= 0){
					    		mainList.add(deal);
					    	}else {
					    		secondarList.add(deal);
					    	}
			    		}				    	
				    }else if(object instanceof com.agilecrm.document.Document){
				    	com.agilecrm.document.Document document  = (com.agilecrm.document.Document) object;
				    	String name = document.name;
			    		if(name != null){
				    		name = name.toLowerCase();
					    	if(name != null && name.indexOf(localKeyword) >= 0){
					    		mainList.add(document);
					    	}else {
					    		secondarList.add(document);
					    	}
			    		}
				    }else {
				    	secondarList.add(object);
				    }
			    }
			    
			    mainList.addAll(secondarList);			   
			    entities = (Collection<T>) mainList;
			    
			    System.out.println("Time to manipulate search results -------- "+(System.currentTimeMillis() - time)+" milli seconds");
			}
		}catch (Exception e){
			System.out.println("Exception occured while sorting search results : "+e.getMessage());			
		}
		
		return entities;
    }
    
    /**
     * Processes the query string further with the query options build.
     * 
     * @param options
     * @param query
     * @return
     */
    private Map<String, Object> processTextsearchQueryWithOptions(QueryOptions options, String query, boolean isNumberFoundAccuracyRequired)
    {
	// Build query on query options
	Query query_string = Query.newBuilder().setOptions(options).build(query);

	// If index is null return without querying
	if (index == null)
	{
	    System.out.println("index is null in query processing");
	    return null;
	}

	System.out.println("query string : " + query_string);
	// Fetches documents based on query options
	Long time = System.currentTimeMillis();
	Collection<ScoredDocument> searchResults = null;
	try 
	{
		searchResults = index.search(query_string).getResults();
	} 
	catch (SearchException e) 
	{
		System.out.println("Exception occured while getting search results. Reason for exception:"+e.getMessage());
		//Added retry logic
		searchResults = index.search(query_string).getResults();
	}
	System.out.println("Query processed time is ----- "+(System.currentTimeMillis() - time)+" milli seconds");

	// Results fetched and total number of available contacts are set in map
	Map<String, Object> documents = new HashMap<String, Object>();

	// If cursor is not set, considering it is first set of results, total
	// number of availabe contacts is set
	if (options.getCursor().toWebSafeString() == null)
	{
	    // If search results size is less than limit set, the returned doc
	    // ids are considered as total local available documents.
	    if ((options.getLimit() > searchResults.size() || options.getLimit() == 10))
		documents.put("availableDocuments", Long.valueOf(searchResults.size()));
	    else if(isNumberFoundAccuracyRequired)
		documents.put("availableDocuments", index.search(query_string).getNumberFound());
	}

	documents.put("fetchedDocuments", searchResults);
	
	System.out.println("Returning docs after query processed time is ----- "+(System.currentTimeMillis() - time)+" milli seconds");
	// Gets sorted documents
	return documents;
    }
}