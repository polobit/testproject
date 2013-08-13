package com.agilecrm.search;

import java.util.Collection;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.google.appengine.api.search.Index;

/**
 * The <Code>AppengineSearch</code> class is used to call build and search on
 * entities using the interfaces {@link BuilderInterface} and
 * {@link QueryInterface}
 * 
 * @author Yaswanth
 * 
 */
public class AppengineSearch<T>
{
    public QueryInterface query;
    public BuilderInterface builder;
    public Index index;
    public Class<T> clazz;

    /**
     * Constructor gets the respective builder object based on type of class.
     * 
     * @param clazz
     */
    public AppengineSearch(Class<T> clazz)
    {
	String type = clazz.getSimpleName();

	try
	{
	    builder = (BuilderInterface) Class.forName("com.agilecrm.search.document." + type + "Document")
		    .newInstance();

	    index = builder.getIndex();
	    query = new QueryDocument<T>(index, clazz);
	    this.clazz = clazz;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Calls add method in respective document class; ContactDocument,
     * DealsDocument (if added in future).
     * 
     * @param entity
     */
    public void add(T entity)
    {
	builder.add(entity);
    }

    /**
     * Calls edit method in respective Document Builder class. As of now there
     * no support for editing few fields in documents, we update the entire
     * document
     * 
     * @param entity
     */
    public void edit(T entity)
    {
	builder.edit(entity);
    }

    /**
     * Calls delete method in respective builder document
     * 
     * @param id
     */
    public void delete(String id)
    {
	builder.delete(id);
    }

    /**
     * Initializes search on keword, send count an cursor to limit results
     * according to count
     * 
     * @param keyword
     * @param count
     * @param cursor
     * @return
     */
    @SuppressWarnings("rawtypes")
    public Collection getSimpleSearchResults(String keyword, Integer count, String cursor)
    {
	System.out.println("simple search");
	return query.simpleSearch(keyword, count, cursor);
    }

    /**
     * It is similar to simple search, but it takes an extra parameter 'type'.
     * Type indicates type of the contact either PERSON or COMPANY
     * 
     * @param keyword
     * @param count
     * @param cursor
     * @param type
     * @return
     */
    @SuppressWarnings("rawtypes")
    public Collection getSimpleSearchResults(String keyword, Integer count, String cursor, String type)
    {
	System.out.println("simple search with company");
	if (StringUtils.isEmpty(type))
	    return query.simpleSearch(keyword, count, cursor);
	return query.simpleSearchWithType(keyword, count, cursor, type);
    }

    /**
     * Calls advanced search method in query document. It queries based on set
     * of rules. It has not oage size limit, it is used when we need to fetch
     * all the results available
     * 
     * @param rules
     * @return
     */
    @SuppressWarnings("rawtypes")
    public Collection getAdvacnedSearchResults(List<SearchRule> rules)
    {
	return query.advancedSearch(rules);
    }

    /**
     * Similar to advanced search method. It takes count and cursor, used to
     * fetch results in limited sets
     * 
     * @param rules
     * @param count
     * @param cursor
     * @return
     */
    @SuppressWarnings("rawtypes")
    public Collection getAdvacnedSearchResults(List<SearchRule> rules, Integer count, String cursor)
    {
	return query.advancedSearch(rules, count, cursor);
    }

}
