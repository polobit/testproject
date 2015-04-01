package com.socialsuite.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.socialsuite.Stream;
import com.socialsuite.cron.ScheduledUpdate;

public class ScheduleUpdateUtil
{
	/**
	 * Dao for TwitterQueue class
	 */
	private static ObjectifyGenericDao<ScheduledUpdate> dao = new ObjectifyGenericDao<ScheduledUpdate>(
			ScheduledUpdate.class);

	public static void postUpdates()
	{
		List<ScheduledUpdate> updates = getScheduledUpdatesToPost();

		if (updates == null)
			return;

		while (updates.size() > 0)
		{
			String result = null;
			ScheduledUpdate update = updates.get(0);

			// Sets namespace for log.
			NamespaceManager.set(update.namespace);

			// Create temp stream.
			Stream stream = new Stream();
			stream.domain_user_id = update.domain_user_id;
			stream.client_channel = null;
			stream.screen_name = update.screen_name;
			stream.network_type = null;
			stream.stream_type = null;
			stream.keyword = null;
			stream.token = update.token;
			stream.secret = update.secret;
			stream.column_index = 0;

			try
			{
				if (update.headline.equalsIgnoreCase("Tweet"))
				{
					result = SocialSuiteTwitterUtil.tweetInTwitter(stream, update.message);
				}
				else if (update.headline.equalsIgnoreCase("Reply"))
				{
					result = SocialSuiteTwitterUtil.replyTweetInTwitter(stream, update.message,
							Long.parseLong(update.tweetId), update.tweetOwner);
				}
				else if (update.headline.equalsIgnoreCase("Direct"))
				{
					result = SocialSuiteTwitterUtil.directMessageInTwitter(stream, update.message, update.tweetOwner);
				}
				else if (update.headline.equalsIgnoreCase("Retweet"))
				{
					result = SocialSuiteTwitterUtil.tweetInTwitter(stream, update.message);
				}

				if (result.equalsIgnoreCase("Successful"))
					update.delete();
			}
			catch (Exception e)
			{
				if (e.getMessage() != null)
				{
					if (e.getMessage().contains("Status is a duplicate"))
						update.delete();
				}
				else
					e.printStackTrace();
			}
			updates.remove(0);
		}
	}

	/**
	 * Gets value of a ScheduledUpdate objects, related with the current date
	 * and time.
	 * 
	 * @return list of value of the matched entity.
	 */
	public static List<ScheduledUpdate> getScheduledUpdatesToPost()
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		List<ScheduledUpdate> updates = null;

		try
		{
			System.out.println("In get getScheduledUpdatesToPost.");

			long epoch = System.currentTimeMillis() / 1000;
			updates = dao.listByProperty("schedule <=", epoch);
		}
		catch (Exception e)
		{
			// ScheduledUpdates not found
			e.printStackTrace();
		}

		NamespaceManager.set(oldNamespace);
		return updates;
	}// getScheduledUpdatesToPost end

	/**
	 * Gets value of a ScheduledUpdate object, matched with the given Id.
	 * 
	 * @param id
	 *            ScheduledUpdate id of the object to get its value.
	 * @return value of the matched entity.
	 */
	public static ScheduledUpdate getScheduledUpdate(Long id)
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		// search ScheduledUpdate on id.
		ScheduledUpdate update = null;
		try
		{
			update = dao.get(id);
		}
		catch (EntityNotFoundException e)
		{
			e.printStackTrace();
		}
		NamespaceManager.set(oldNamespace);
		return update;
	}// getScheduledUpdate end

	/**
	 * Gets value of a ScheduledUpdate object, matched with the given
	 * screen_name.
	 * 
	 * @param screen_name
	 *            - screen_name of account holder.
	 * @return value of the matched entity.
	 */
	public static List<ScheduledUpdate> getScheduledUpdates(String screen_name)
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		// search ScheduledUpdate on screen_name.
		List<ScheduledUpdate> updates = dao.listByProperty("screen_name", screen_name);

		NamespaceManager.set(oldNamespace);
		return updates;
	}// getScheduledUpdate end

	/**
	 * Gets value of a ScheduledUpdate objects, related with the current
	 * domainUser.
	 * 
	 * @return list of value of the matched entity.
	 */
	public static List<ScheduledUpdate> getScheduledUpdates()
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

		System.out.println("In get ScheduledUpdates.");
		List<ScheduledUpdate> updates = dao.listByProperty("domain_user_id", domainUser.id);

		NamespaceManager.set(oldNamespace);

		return updates;

	}// getScheduledUpdates end

	/**
	 * Gets count of a ScheduledUpdate objects, related with the current
	 * domainUser.
	 * 
	 * @return count of the matched entity.
	 */
	public static int getScheduledUpdatesCount()
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

		int count = dao.ofy().query(ScheduledUpdate.class).filter("domain_user_id = ", domainUser.id).count();

		System.out.println("In get ScheduledUpdates." + domainUser.id + " and " + count);

		NamespaceManager.set(oldNamespace);

		return count;

	}// getScheduledUpdates end
}
