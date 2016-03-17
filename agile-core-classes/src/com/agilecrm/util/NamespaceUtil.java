package com.agilecrm.util;

import java.net.URL;
import java.util.HashSet;
import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entities;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;

/**
 * <code>NamespaceUtil</code> is a utility class which gives all the information
 * about "namespaces" in datastore.
 * <P>
 * This utility class includes methods need to return all the namespaces (domain
 * names), namespace count and statistics.
 * </p>
 * 
 * @author
 * 
 */
public class NamespaceUtil
{
	/**
	 * Gets all namespaces by iterating domain users
	 * 
	 * @return set of domains as namespaces
	 */
	public static Set<String> getAllNamespacesNew()
	{
		Set<String> namespaces = new HashSet<String>();
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();

		FetchOptions options = FetchOptions.Builder.withChunkSize(1000);

		Query q = new Query(Entities.NAMESPACE_METADATA_KIND);

		for (Entity e : ds.prepare(q).asIterable(options))
		{
			// A nonzero numeric id denotes the default namespace;
			// see Namespace Queries, below
			if (e.getKey().getId() != 0)
			{
				continue;
			}
			else
			{
				namespaces.add(e.getKey().getName());
			}
		}

		System.out.println("Total domains : " + namespaces.size());
		return namespaces;
	}
	
	
	/**
	 * Gets all namespaces by iterating domain users
	 * 
	 * @return set of domains as namespaces
	 */
	public static Set<Long> getAllNamespaceIdsNew()
	{
		Set<Long> namespaces = new HashSet<Long>();
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();

		FetchOptions options = FetchOptions.Builder.withChunkSize(1000);

		Query q = new Query(Entities.NAMESPACE_METADATA_KIND);
		q.setKeysOnly();

		for (Entity e : ds.prepare(q).asIterable(options))
		{
			// A nonzero numeric id denotes the default namespace;
			// see Namespace Queries, below
			if (e.getKey().getId() != 0)
			{
				continue;
			}
			else
			{
				namespaces.add(e.getKey().getId());
			}
		}

		System.out.println("Total domains : " + namespaces.size());
		return namespaces;
	}
	
	/**
	 * Gets all namespaces by iterating domain users
	 * 
	 * @return set of domains as namespaces
	 */
	public static String getNamespaceNameFromId(Long id)
	{
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		FetchOptions options = FetchOptions.Builder.withChunkSize(1000);
				
		Query query = new Query(Entities.NAMESPACE_METADATA_KIND, KeyFactory.createKey(Entities.NAMESPACE_METADATA_KIND, id));
		Entity entity = ds.prepare(query).asSingleEntity();
		
		return entity.getKey().getName();

	}

	/**
	 * Gets all namespaces by iterating domain users
	 * 
	 * @return set of domains as namespaces
	 */
	public static Set<String> getAllNamespaces()
	{
		return getAllNamespacesNew();

		// Get All Users
		/*
		 * List<DomainUser> domainList = DomainUserUtil.getAllDomainOwners();
		 * 
		 * Set<String> domains = new HashSet<String>(); for (DomainUser
		 * domainUser : domainList) { domains.add(domainUser.domain); }
		 * 
		 * return domains;
		 */
	}

	public static Set<String> getAllNamespacesUsingIterator()
	{
		return getAllNamespacesNew();

	}

	/**
	 * Gets namespace count (total number of entities stored and the total
	 * number of bytes they take up).
	 * 
	 * @return JSONObject with bytes and entities count
	 */
	public static JSONObject getNamespaceCount()
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

		/*
		 * "__Stat_Total__" only has a single instance in the datastore that
		 * contains the total number of entities stored and the total number of
		 * bytes they take up.
		 */
		Entity globalStat = datastore.prepare(new Query("__Stat_Total__")).asSingleEntity();
		Long totalBytes = (Long) globalStat.getProperty("bytes");
		Long totalEntities = (Long) globalStat.getProperty("count");

		JSONObject statsJSON = new JSONObject();

		try
		{
			statsJSON.put("bytes", totalBytes);
			statsJSON.put("entities", totalEntities);
		}
		catch (Exception e)
		{

		}
		return statsJSON;
	}

	/**
	 * Gets namespace statistics (represents stats for each specific namespace)
	 * 
	 * @return JSONObject with bytes and entities
	 */
	public static JSONObject getNamespaceStats()
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

		/*
		 * "__Stat_Ns_Total__" may be found in each specific namespace and
		 * represent stats for that particular namespace
		 */
		Entity globalStat = datastore.prepare(new Query("__Stat_Ns_Total__")).asSingleEntity();

		Long totalBytes = 0L;
		Long totalEntities = 0l;

		if (globalStat != null)
		{
			if (globalStat.hasProperty("bytes"))
				totalBytes = (Long) globalStat.getProperty("bytes");

			if (globalStat.hasProperty("count"))
				totalEntities = (Long) globalStat.getProperty("count");

		}

		JSONObject statsJSON = new JSONObject();

		try
		{
			statsJSON.put("bytes", totalBytes);
			statsJSON.put("entities", totalEntities);
		}
		catch (Exception e)
		{

		}
		return statsJSON;
	}

	/**
	 * Gets domain user's domain from url.
	 * 
	 * @param url
	 *            - Requested Url.
	 * @return domain name.
	 */
	public static String getNamespaceFromURL(URL url)
	{
		String host = url.getHost().toString();

		// Eg., return 'admin' from 'admin.agilecrm.com'
		return host.contains("-dot-") ? host.split("\\-dot-")[0] : host.split("\\.")[0];
	}

	public static String getNamespaceFromURL(String host)
	{
		System.out.println(host.contains("-dot-"));
		// Eg., return 'admin' from 'admin.agilecrm.com'
		return host.contains("-dot-") ? host.split("\\-dot-")[0] : host.split("\\.")[0];
	}

	/**
	 * Returns the JSON object having the count of contacts, deals, campaigns
	 * etc of the current domain.
	 * 
	 * @return JSON object.
	 */
	public static String getDomainStats()
	{
		JSONObject json = new JSONObject();

		int webrulecount = WebRuleUtil.getCount();
		int contactcount = ContactUtil.getCount();
		int dealscount = OpportunityUtil.getCount();
		// int docs = DocumentUtil.getCount();
		int compaigncount = WorkflowUtil.getCount();
		int triggerscount = TriggerUtil.getCount();
		// int webstats =
		// AnalyticsSQLUtil.getPageViewsCountForGivenDomain(NamespaceManager.get());

		try
		{
			json.put("webrule_count", webrulecount);
			json.put("contact_count", contactcount);
			json.put("deals_count", dealscount);
			// json.put("docs_count", docs);
			json.put("compaign_count", compaigncount);
			json.put("triggers_count", triggerscount);
			// json.put("webstats_count", webstats);

		}
		catch (JSONException e)
		{
			e.printStackTrace();
		}
		System.out.println("status account " + json);

		return json.toString();
	}

}