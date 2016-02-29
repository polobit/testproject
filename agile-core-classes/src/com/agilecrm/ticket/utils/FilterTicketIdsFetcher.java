package com.agilecrm.ticket.utils;

import java.net.URLDecoder;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.contact.filter.ContactFilterIdsResultFetcher;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.ticket.entitys.Tickets;
import com.google.appengine.api.search.Cursor;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Query;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchServiceFactory;
import com.googlecode.objectify.Key;

/**
 * {@link ContactFilterIdsResultFetcher}
 * 
 * @author Sasi on 18-Nov-2015
 * 
 */
public class FilterTicketIdsFetcher extends ITicketIdsFetcher
{
	private static final long serialVersionUID = 1L;

	Integer fetchedCount = 0;
	String cursor = null;
	Long totalCount = null;
	List<SearchRule> conditions;

	String queryString = null;

	public FilterTicketIdsFetcher(List<SearchRule> conditions)
	{
		super();

		try
		{
			queryString = TicketFiltersUtil.getQueryFromConditions(conditions);
			count = new  TicketsDocument().getTicketsCount(queryString);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	@Override
	public boolean hasNext()
	{
		if (StringUtils.isBlank(queryString))
			return false;

		/*
		 * if (fetchedCount >= totalCount) return false;
		 */

		if (StringUtils.isEmpty(cursor))
			return false;

		return true;
	}

	@Override
	public Set<Key<Tickets>> next()
	{
		Set<Key<Tickets>> resultArticleIds = new HashSet<Key<Tickets>>();

		Cursor cursor = Cursor.newBuilder().build();

		// Set cursor if you already have
		if (StringUtils.isNotBlank(this.cursor))
			cursor = com.google.appengine.api.search.Cursor.newBuilder().build(URLDecoder.decode(this.cursor));

		QueryOptions options = null;
		Query query = null;

		try
		{
			options = QueryOptions.newBuilder().setCursor(cursor).setLimit(this.maxFetch).build();
			query = com.google.appengine.api.search.Query.newBuilder().setOptions(options).build(queryString);

			Results<ScoredDocument> results = getIndex().search(query);

			if (this.totalCount == null)
			{
				this.totalCount = results.getNumberFound();
				System.out.println("this.totalCount: " + this.totalCount);
			}

			this.cursor = results.getCursor().toWebSafeString();

			// Setting fetched record count
			fetchedCount = (fetchedCount == null) ? results.getNumberReturned() : (fetchedCount + results
					.getNumberReturned());

			for (ScoredDocument document : results)
				resultArticleIds.add(new Key<Tickets>(Tickets.class, Long.parseLong(document.getId())));
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return resultArticleIds;
	}

	public Index getIndex()
	{
		IndexSpec indexSpec = IndexSpec.newBuilder().setName("tickets").build();
		return SearchServiceFactory.getSearchService().getIndex(indexSpec);
	}

	@Override
	public Integer getCount()
	{
		return count;
	}
}
