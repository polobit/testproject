package com.agilecrm.search.document;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.util.ArticleUtil;
import com.agilecrm.search.BuilderInterface;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.GetRequest;
import com.google.appengine.api.search.GetResponse;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Query;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchServiceFactory;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi on 29-sep-2015
 * 
 */
public class HelpcenterArticleDocument implements BuilderInterface
{
	String indexName = "articles";

	/**
	 * Adds the  entity to text search DB.
	 * 
	 */
	@Override
	public void add(Object entity)
	{
		try
		{
			System.out.println("Starting documenting article...");

			Article article = (Article) entity;

			Document.Builder document = Document.newBuilder();

			// Set ticket id as doc id
			document.setId(article.id + "");

			// Setting search tokens
			document.addField(Field.newBuilder().setName("search_tokens")
					.setText(article.title + " " + article.plain_content));

			System.out.println(getIndex().put(document));
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
		}
	}

	/**
	 * Updates existing document.
	 */
	@Override
	public void edit(Object entity)
	{
		try
		{
			add((Article) entity);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}

	/**
	 * 
	 */
	@Override
	public void delete(String id)
	{
		getIndex().delete(id);
	}

	@Override
	public Index getIndex()
	{
		IndexSpec indexSpec = IndexSpec.newBuilder().setName(indexName).build();
		return SearchServiceFactory.getSearchService().getIndex(indexSpec);
	}

	/**
	 * 
	 * @param queryString
	 * @param cursorString
	 * @param sortField
	 * @param limit
	 * @return
	 * @throws Exception
	 */
	public JSONObject searchDocuments(String queryString) throws Exception
	{
		List<Key<Article>> resultArticleIds = new ArrayList<Key<Article>>();

		System.out.println("searching Documents");

		QueryOptions options = QueryOptions.newBuilder().setReturningIdsOnly(true).setNumberFoundAccuracy(10000)
				.build();
		Query query = Query.newBuilder().setOptions(options).build(queryString);

		Results<ScoredDocument> results = getIndex().search(query);

		String newCursor = "";
		Long totalResults = 0l;

		try
		{
			totalResults = results.getNumberFound();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		for (ScoredDocument document : results)
		{
			resultArticleIds.add(new Key<Article>(Article.class, Long.parseLong(document.getId())));

			try
			{
				newCursor = document.getCursor().toWebSafeString();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}

		System.out.println("Cursor: " + newCursor);

		return new JSONObject().put("cursor", newCursor).put("keys", resultArticleIds).put("count", totalResults);
	}

	/**
	 * 
	 * @param queryString
	 * @return
	 */
	public int countRows(String queryString)
	{
		QueryOptions options = QueryOptions.newBuilder().setReturningIdsOnly(true).setLimit(1000)
				.setNumberFoundAccuracy(10000).build();

		Query query = Query.newBuilder().setOptions(options).build(queryString);

		return getIndex().search(query).getResults().size();
	}

	/**
	 * 
	 * @param queryString
	 * @param fields
	 * @return text documents with provided field names
	 */
	public Collection<ScoredDocument> executeQuery(String queryString, String... fields)
	{
		QueryOptions options = QueryOptions.newBuilder().setFieldsToReturn(fields).setLimit(1000).build();

		Query query = Query.newBuilder().setOptions(options).build(queryString);

		return getIndex().search(query).getResults();
	}

	public int getarticleCount(String queryString)
	{
		QueryOptions options = QueryOptions.newBuilder().setNumberFoundAccuracy(10000).setLimit(1).build();

		Query query = Query.newBuilder().setOptions(options).build(queryString);

		return (int) getIndex().search(query).getNumberFound();
	}

	/**
	 * Gets contact collection related to given document ids
	 * 
	 * Since querying on ContactDocumet returns document ids, this method
	 * returns related contacts to document ids
	 * 
	 * @param doc_ids
	 *            {@link List}
	 * @return {@link Collection}
	 */
	@SuppressWarnings("rawtypes")
	public List getResults(List<Long> doc_ids)
	{
		try
		{
			return ArticleUtil.getArticlesByIDsList(doc_ids);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return new ArrayList<Article>();
	}

	public void removeAllDocuments()
	{
		try
		{
			// looping because getRange by default returns up to 100 documents
			// at a time
			while (true)
			{
				List<String> docIds = new ArrayList<String>();

				// Return a set of doc_ids.
				GetRequest request = GetRequest.newBuilder().setReturningIdsOnly(true).build();
				GetResponse<Document> response = getIndex().getRange(request);

				if (response.getResults().isEmpty())
				{
					break;
				}

				for (Document doc : response)
				{
					docIds.add(doc.getId());
				}

				getIndex().delete(docIds);
			}
		}
		catch (RuntimeException e)
		{
			ExceptionUtils.getFullStackTrace(e);
		}
	}

	@Override
	public void addAsync(Object entity)
	{
		// TODO Auto-generated method stub

	}
}