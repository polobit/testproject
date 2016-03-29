package com.agilecrm.search;

import java.util.Collection;
import java.util.List;

import com.agilecrm.SearchFilter;
import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.document.Document;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.ticket.entitys.Tickets;
import com.google.appengine.api.search.ScoredDocument;

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
	public static enum Type
	{
		CONTACT(Contact.class), PERSON(Contact.class), COMPANY(Contact.class), OPPORTUNITY(Opportunity.class), CASES(
				Case.class), DOCUMENT(Document.class), TICKETS(Tickets.class);;

		private Class clazz;

		Type(Class clazz)
		{
			this.clazz = clazz;
		}

		public Class getClazz()
		{
			return clazz;
		}
	}

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
	Collection<?> advancedSearch(List<SearchRule> rules, Integer count, String cursor, String orderBy);

	/**
	 * Returns the number of results for the advanced search based on the list
	 * of search rules
	 * 
	 * @param rule
	 * @param count
	 * @param cursor
	 * @return
	 */
	int advancedSearchCount(List<SearchRule> rules);

	public Long getCount(List<SearchRule> rules);

	public Collection<?> processQuery(String query, Integer page, String cursor);

	Collection<?> advancedSearch(SearchFilter filter);

	Collection<?> advancedSearch(SearchFilter filter, Integer count, String cursor, String orderBy);

	List<ScoredDocument> advancedSearchOnlyIds(SearchFilter filter, Integer count, String cursor, String orderBy);

}
