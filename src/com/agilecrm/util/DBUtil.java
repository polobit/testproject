package com.agilecrm.util;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.json.JSONObject;

import com.agilecrm.core.DomainUser;
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

public class DBUtil
{

    // JSON - Google App Engine DB Key
    public final static String DATASTORE_KEY_IN_JSON = "id";

    // Get ID from JSONObject - gets id and thn $oid
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

    static List<String> getKinds(String namespace)
    {

	String old = NamespaceManager.get();
	List<String> results = new ArrayList<String>();
	try
	{

	    NamespaceManager.set(namespace);

	    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();

	    // this works in dev and prod, but doesn't provide an entity
	    // count
	    Query q = new Query(Query.KIND_METADATA_KIND);
	    for (Entity e : ds.prepare(q).asIterable())
	    {

		String name = e.getKey().getName();
		if (!name.startsWith("__Stat_"))
		{

		    // find out how many entities this kind has
		    // int count = ds.prepare(new
		    // Query(name)).countEntities(FetchOptions.Builder.withDefaults());

		    // results.add(new Kind(name));

		    results.add(name);
		}
	    }
	}
	finally
	{
	    NamespaceManager.set(old);
	}

	// don't show/include/delete these, it messes up mapreduce
	results.remove("MapReduceState");
	results.remove("ShardState");

	return results;
    }

    public static void deleteNamespace(String namespace)
    {
	// If namespace is null or is empty return with out deleting
	// entities
	if (namespace == null || namespace.isEmpty())
	    return;

	NamespaceDeleteDeferredTask namespaceDeleteDeferredTask = new NamespaceDeleteDeferredTask(
		namespace);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(namespaceDeleteDeferredTask));
    }

    static void deleteKind(String kind)
    {

	try
	{
	    // Get All Entity Keys in the Kind
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

	    System.out.println("Bulk delete ...  " + kind);

	    try
	    {
		datastore.delete(keys);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	    System.out.println("Deleted sKind " + kind);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Error deleting");
	}
    }

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

		// Get all entities
		List<String> kinds = getKinds(namespace);

		// Delete each kind
		for (String kind : kinds)
		    deleteKind(kind);

		CronUtil.deleteCronsByNamespace(namespace);

		DomainUser.deleteDomainUsers(namespace);

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