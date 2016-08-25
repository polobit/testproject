package com.agilecrm.namespace;

import java.util.ArrayList;
import java.util.List;

import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entities;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.QueryResultList;

public class AgileNamespaces
{

	private String cursor = null;
	private List<String> namespaces = new ArrayList<String>();

	public List<String> getAllNamespaces()
	{
		fetchNamespaces();
		return namespaces;
	}

	private void fetchNamespaces()
	{
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		FetchOptions options = FetchOptions.Builder.withLimit(300);

		if (cursor != null)
			options.startCursor(Cursor.fromWebSafeString(cursor));
		
		Query q = new Query(Entities.NAMESPACE_METADATA_KIND);
		PreparedQuery pq = ds.prepare(q);

		QueryResultList<Entity> results;

		try
		{
			results = pq.asQueryResultList(options);
			
			if(results == null || results.size() == 0)
				return;
			
			try
			{
				cursor = results.getCursor().toWebSafeString();
			}
			catch (Exception e)
			{
				System.out.println("Exception occured while getting cursor..." + e.getMessage());
				cursor = null;
			}
			
			addToSet(results);

		}
		catch (IllegalArgumentException e)
		{
			
		}
	}

	private void addToSet(QueryResultList<Entity> results)
	{

		for (Entity result : results)
		{
			// A nonzero numeric id denotes the default namespace;
			// see Namespace Queries, below
			if (result.getKey().getId() != 0)
			{
				continue;
			}
			else
			{
				namespaces.add(result.getKey().getName());
			}
		}
		
		if(cursor != null)
			fetchNamespaces();
	}
}
