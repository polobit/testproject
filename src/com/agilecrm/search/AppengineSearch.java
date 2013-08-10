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
	public Collection getAdvacnedSearchResults(List<SearchRule> rules)
	{
		return query.advancedSearch(rules);
	}

	@SuppressWarnings("rawtypes")
	public Collection getAdvacnedSearchResults(List<SearchRule> rules, Integer count, String cursor)
	{
		return query.advancedSearch(rules, count, cursor);
	}

	@SuppressWarnings("rawtypes")
	public Collection getSimpleSearchResults(String keyword, Integer count, String cursor)
	{
		System.out.println("simple search");
		return query.simpleSearch(keyword, count, cursor);
	}

	@SuppressWarnings("rawtypes")
	public Collection getSimpleSearchResults(String keyword, Integer count, String cursor, String type)
	{
		System.out.println("simple search with company");
		if (StringUtils.isEmpty(type))
			return query.simpleSearch(keyword, count, cursor);
		return query.simpleSearchWithType(keyword, count, cursor, type);
	}

}
