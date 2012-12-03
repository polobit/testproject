package com.agilecrm.search;

import java.util.Collection;
import java.util.List;

import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.ui.serialize.SearchRule;

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
	    builder = (BuilderInterface) Class.forName(
		    "com.agilecrm.search.document." + type + "Document").newInstance();

	    query = new QueryDocument();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    public void add(T entity)
    {
	builder.add(entity);
    }

    public void edit(T entity)
    {
	builder.edit(entity);
    }

    public void delete(String id)
    {
	builder.delete(id);
    }

    @SuppressWarnings("rawtypes")
    public static Collection getAdvacnedSearchResults(List<SearchRule> rules)
    {
	return new QueryDocument().advancedSearch(rules);
    }

    @SuppressWarnings("rawtypes")
    public static Collection getSimpleSearchResults(String keyword)
    {
	return new QueryDocument().simpleSearch(keyword);
    }

}
