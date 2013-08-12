package com.agilecrm.search;

import java.util.Collection;
import java.util.List;

import com.agilecrm.search.ui.serialize.SearchRule;

/**
 * <code>QueryInterface</code> is root interface for building search queries on
 * any entities. It declares two methods simpleSearch (to search based on
 * keywords) and an advancedSearch functionality (search based on complex
 * queries)
 * 
 * @author Yaswanth
 * 
 * @since November 2012
 * 
 */
public interface QueryInterface
{
	/**
	 * Declaration of simple search method, takes keyword as an argument and
	 * searches based on keyword and returns entities
	 * 
	 * @param keyword
	 *            {@link String} searches based in th keyword
	 * @return {@link Collection} of entities returned after querying
	 */
	public Collection<?> simpleSearch(String keyword, Integer count, String cursor);

	/**
	 * 
	 * @param keyword
	 * @param count
	 * @param cursor
	 * @param type
	 * @return
	 */
	public Collection<?> simpleSearchWithType(String keyword, Integer count, String cursor, String type);

	/**
	 * It declares advancedSearch based on the list of search Rules, should
	 * build queries base on searchRule which includes condition of the query
	 * 
	 * @param rule
	 *            {@link List} of {@link SearchRule}
	 * @return {@link Collection} of entities
	 */
	public Collection<?> advancedSearch(List<SearchRule> rule);

	/**
	 * It is similar to advanced search but queries based on page limit and
	 * cursor the cursor sent
	 * 
	 * @param rule
	 * @param count
	 * @param cursor
	 * @return
	 */
	Collection<?> advancedSearch(List<SearchRule> rules, Integer count, String cursor);
}
