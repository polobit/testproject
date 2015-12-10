package com.agilecrm.account.util;

import com.agilecrm.AgileQueues;
import com.agilecrm.account.AccountPrefs;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.campaignio.workflows.deferred.UpdateWorkflows;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>AccountPrefsUtil</code> is the utility class for {@link AccountPrefs}.
 * It fetches AccountPrefs if exists, otherwise returns default AccountPrefs
 * setting company name 'My company'.
 * 
 * @author Manohar
 * 
 */
public class AccountPrefsUtil
{
	/**
	 * AccountPrefs Dao.
	 */
	private static ObjectifyGenericDao<AccountPrefs> dao = new ObjectifyGenericDao<AccountPrefs>(AccountPrefs.class);

	/**
	 * Returns AccountPrefs if exists, otherwise returns default accountprefs.
	 * 
	 * @return AccountPrefs.
	 */
	public static AccountPrefs getAccountPrefs()
	{
		Objectify ofy = ObjectifyService.begin();
		AccountPrefs prefs = ofy.query(AccountPrefs.class).get();

		if (prefs == null)
		{
			return getDefaultPrefs();
		}

		return prefs;
	}

	/**
	 * Returns Default AccountPrefs.
	 * 
	 * @return Default AccountPrefs.
	 */
	private static AccountPrefs getDefaultPrefs()
	{
		AccountPrefs prefs = new AccountPrefs("My company");

		dao.put(prefs);
		return prefs;
	}

	/**
	 * Returns account prefs timezone.
	 * 
	 * @return String
	 */
	public static String getTimeZone()
	{
		AccountPrefs prefs = getAccountPrefs();

		if (prefs == null || prefs.timezone == null)
			return "UTC";

		return prefs.timezone;
	}

	public static AccountPrefs setNewTagACL(Boolean isEnable)
	{
		AccountPrefs prefs = getAccountPrefs();
		if (isEnable != null)
		{
			prefs.tagsPermission = isEnable;
			prefs.save();
		}
		return prefs;
	}

	/**
	 * Updates account preferences
	 * 
	 * @param account_prefs
	 * @return
	 */
	public static AccountPrefs update_account_prefs(AccountPrefs account_prefs)
	{
		dao.put(account_prefs);

		return account_prefs;
	}

	/**
	 * Adds a task to "update-workflows-queue" which inturn runs and updates all
	 * the workflows with is_disabled property.
	 * 
	 * @param accountPrefs
	 *            - account preferences
	 * @param domainUser
	 *            - domain user
	 */
	public static void postDataToUpdateWorkflows(AccountPrefs accountPrefs, DomainUser domainUser)
	{

		UpdateWorkflows task = new UpdateWorkflows(domainUser, accountPrefs);
		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.UPDATE_WORKFLOWS_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(task));
	}
}
