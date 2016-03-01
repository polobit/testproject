package com.agilecrm.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.notification.NotificationPrefs;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
import com.agilecrm.user.util.SocialPrefsUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.analytics.util.AnalyticsSQLUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.CampaignLogsSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.GetRequest;
import com.google.appengine.api.search.GetResponse;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.SearchServiceFactory;
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
public class AccountDeleteUtil
{
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

		NamespaceDeleteDeferredTask namespaceDeleteDeferredTask = new NamespaceDeleteDeferredTask(namespace);
		Queue queue = QueueFactory.getDefaultQueue();
		queue.addAsync(TaskOptions.Builder.withPayload(namespaceDeleteDeferredTask));
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
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

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

			// Check if name space is set, otherwise all the records will be
			// delete. Close the shop :)
			if (StringUtils.isEmpty(oldNameSpace))
				return;

			try
			{
				// Cancel subscription before starting delete
				Subscription.deleteSubscriptionOfParticularDomain(namespace);

				// Gets all entities of the given name-space
				List<String> kinds = getKinds(namespace);

				// Deletes each kind
				for (String kind : kinds)
					deleteKind(kind);

				// Deletes crons
				CronUtil.deleteCronsByNamespace(namespace);

				// Deletes domain users
				deleteDomainUsers(namespace);

				// Deletes campaign logs from sql.
				CampaignLogsSQLUtil.deleteLogsBasedOnDomain(namespace);

				// Deletes page stats from sql.
				AnalyticsSQLUtil.deleteStatsBasedOnNamespace(namespace);

				deleteTextSearchData(namespace, 0L);
			}
			catch (Exception e)
			{
				System.err.println("Exception occured in Cron " + e.getMessage());
				e.printStackTrace();
			}

			NamespaceManager.set(oldNameSpace);
			System.out.println("Deleted namespace " + namespace);
		}
	}

	/**
	 * Deletes all domain users in a domain
	 * 
	 * @param namespace
	 *            name of the domain
	 */
	public static void deleteDomainUsers(String namespace)
	{
		if (StringUtils.isEmpty(namespace))
			return;

		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		// Get keys of domain users in respective domain
		List<com.googlecode.objectify.Key<DomainUser>> domainUserKeys = DomainUserUtil.dao.listKeysByProperty("domain",
				namespace);

		// Delete domain users in domain
		DomainUserUtil.dao.deleteKeys(domainUserKeys);

		NamespaceManager.set(oldNamespace);
	}

	/**
	 * Deletes All the entities(AgileUser, Userprefs, Imap prefs, notification
	 * prefs) before deleting domain users
	 */
	public static void deleteRelatedEntities(Long id)
	{
		AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(id);

		if (agileUser != null)
		{
			// Delete UserPrefs
			UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
			if (userPrefs != null)
				userPrefs.delete();

			// Delete Social Prefs
			List<SocialPrefs> socialPrefsList = SocialPrefsUtil.getPrefs(agileUser);
			for (SocialPrefs socialPrefs : socialPrefsList)
			{
				socialPrefs.delete();
			}

			// Delete IMAP PRefs
			List<IMAPEmailPrefs> imapPrefsList = IMAPEmailPrefsUtil.getIMAPPrefsList(agileUser);
			for(IMAPEmailPrefs imapPrefs : imapPrefsList){
    			if (imapPrefs != null)
    				imapPrefs.delete();
			}

			// Delete Notification Prefs
			NotificationPrefs notificationPrefs = NotificationPrefsUtil.getNotificationPrefs(agileUser);

			if (notificationPrefs != null)
				notificationPrefs.delete();

			// Get and Delete AgileUser
			agileUser.delete();
		}
	}

	/**
	 * Deletes all the text search data available in namespace defined
	 * 
	 * @param namespace
	 */
	public static void deleteTextSearchData(String namespace, Long offset)
	{
		// Returns if namespace is empty
		if (StringUtils.isEmpty(namespace))
			return;

		String oldNamespace = NamespaceManager.get();
		try
		{
			System.out.println("started delete");
			NamespaceManager.set(namespace);

			List<String> docIds = new ArrayList<String>();

			// Gets index of 'contacts' document
			Index index = SearchServiceFactory.getSearchService().getIndex(IndexSpec.newBuilder().setName("contacts"));

			System.out.println(index.getNamespace());

			boolean stop = false;
			int count = 0;

			String startId = "";

			while (!stop)
			{
				if (count >= 10000)
				{
					System.out.println("breaking count");
					break;
				}

				System.out.println("count" + count + " start id" + startId);

				GetRequest request = null;

				// Return a set of document IDs.
				if (!StringUtils.isEmpty(startId))
					request = GetRequest.newBuilder().setReturningIdsOnly(true).setStartId(startId)
							.setIncludeStart(false).setLimit(900).build();
				else
					request = GetRequest.newBuilder().setReturningIdsOnly(true).setLimit(900).build();

				GetResponse<Document> response = index.getRange(request);

				List<Document> documentList = response.getResults();

				System.out.println(documentList);
				System.out.println("response" + documentList.size());

				if (documentList.size() == 0)
				{
					stop = true;
					System.out.println("breaking sie is zero");
					break;
				}

				Iterator<Document> iterator = response.iterator();
				int available = documentList.size();
				System.out.println("available documents :" + available);
				int i = 0;
				while (iterator.hasNext())
				{
					Document doc = iterator.next();
					startId = doc.getId();
					docIds.add(startId);
					++i;
					++count;
					if (i >= 199 || available <= 199)
					{
						// System.out.println(docIds);
						// Deletes all documents
						try
						{
							index.deleteAsync(docIds);
						}
						catch (Exception e)
						{
							System.out.println("exception raised");
							e.printStackTrace();

						}
						i = 0;
						docIds.clear();
					}

				}

			}
		}
		catch (Exception e)
		{
			System.out.println("exception raised");
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
}