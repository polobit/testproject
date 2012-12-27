package com.agilecrm.util;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.json.JSONObject;

import com.agilecrm.user.util.DomainUserUtil;
import com.campaignio.cron.util.CronUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>DBUtil</code> class contains the utility methods to delete a name-space
 * and all its related entities from the data store.
 * <p>
 * This class imports {@link DomainUserUtil} class to delete the name-space and
 * runs a deferred task (avoids timeout exception) to delete all the entities of
 * the name-space.
 * </p>
 * 
 * @author sree
 * 
 */
public class DBUtil
{

    // JSON - Google App Engine DB Key
    public final static String DATASTORE_KEY_IN_JSON = "id";

    /**
     * Gets ID from JSONObject - gets id and then $oid
     * 
     * @param json
     *            JSONObject reference
     * @return value of the id attribute of given json object
     */
    public static String getId(JSONObject json)
    {
	try
	{
	    return json.getString(DATASTORE_KEY_IN_JSON);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Gets all the names (Contacts, Deals and etc..) of the entities of
     * particular name-space and stores in a list to return. Avoids the adding
     * of entity names (starts and ends with double underscore
     * ex:"__Stat_Total__"), which denotes statistics of the data-store.
     * 
     * @param namespace
     *            name of a particular name-space
     * @return list of entity names
     */
    static List<String> getKinds(String namespace)
    {
	String old = NamespaceManager.get();
	List<String> results = new ArrayList<String>();
	try
	{
	    NamespaceManager.set(namespace);

	    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();

	    // This works in dev and prod, but doesn't provide an entity count
	    Query q = new Query(Query.KIND_METADATA_KIND);
	    for (Entity e : ds.prepare(q).asIterable())
	    {
		String name = e.getKey().getName();
		if (!name.startsWith("__Stat_"))
		{

		    /*
		     * find out how many entities this kind has int count =
		     * ds.prepare(new
		     * Query(name)).countEntities(FetchOptions.Builder
		     * .withDefaults());
		     * 
		     * results.add(new Kind(name));
		     */

		    results.add(name);
		}
	    }
	}
	finally
	{
	    NamespaceManager.set(old);
	}

	// Don't show/include/delete these, it messes up mapreduce
	results.remove("MapReduceState");
	results.remove("ShardState");

	return results;
    }

    /**
     * Deletes a name space and all its related entities from data-store by
     * creating a deferred task for the name-space.
     * 
     * @param namespace
     */
    public static void deleteNamespace(String namespace)
    {

	/*
	 * If name-space is null or empty return with out deleting entities, if
	 * it happens deletes all the entities of all name-spaces
	 */
	if (namespace == null || namespace.isEmpty())
	    return;

	NamespaceDeleteDeferredTask namespaceDeleteDeferredTask = new NamespaceDeleteDeferredTask(
		namespace);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(namespaceDeleteDeferredTask));
    }

    /**
     * Deletes the entities of a particular kind by creating a list of keys of
     * entities of the kind and deleting the list at once
     * 
     * @param kind
     */
    static void deleteKind(String kind)
    {
	try
	{
	    // Stores all entity Keys of the Kind
	    List<Key> keys = new LinkedList<Key>();

	    // Get a handle on the datastore itself
	    DatastoreService datastore = DatastoreServiceFactory
		    .getDatastoreService();

	    Query q = new Query(kind).setKeysOnly();
	    PreparedQuery pq = datastore.prepare(q);
	    for (Entity entity : pq.asIterable())
	    {
		keys.add(entity.getKey());
	    }

	    try
	    {
		datastore.delete(keys);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Error deleting");
	}
    }

    /**
     * <code>NamespaceDeleteDeferredTask</code> class crates a deferred task,
     * which deletes all the entities of a particular name-space. Also deletes
     * domain users and crons of the name-space.
     * 
     * @author
     * 
     */
    @SuppressWarnings("serial")
    static class NamespaceDeleteDeferredTask implements DeferredTask
    {
	String namespace;

	public NamespaceDeleteDeferredTask(String namespace)
	{
	    this.namespace = namespace;
	}

	@Override
	public void run()
	{

	    String oldNameSpace = NamespaceManager.get();

	    NamespaceManager.set(namespace);
	    System.out.println("Deleting namespace " + namespace);

	    try
	    {

		// Gets all entities of the given name-space
		List<String> kinds = getKinds(namespace);

		// Deletes each kind
		for (String kind : kinds)
		    deleteKind(kind);

		// Deletes crons
		CronUtil.deleteCronsByNamespace(namespace);

		// Deletes domain users
		DomainUserUtil.deleteDomainUsers(namespace);

	    }
	    catch (Exception e)
	    {
		System.err.println("Exception occured in Cron "
			+ e.getMessage());
		e.printStackTrace();
	    }

	    NamespaceManager.set(oldNameSpace);

	    System.out.println("Deleted namespace " + namespace);
	}
    }
}