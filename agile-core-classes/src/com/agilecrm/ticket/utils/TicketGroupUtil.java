package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.campaignio.urlshortener.util.Base62;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * <code>TicketGroupUtil</code> is a utility class for {@link TicketGroups} to
 * provide CRUD operations.
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
public class TicketGroupUtil
{
	/**
	 * Creates default Ticket Group with name Support & assigns all domain users
	 * to that Group.
	 * 
	 * @return {@link TicketGroups} object
	 */
	public static TicketGroups createDefaultGroup()
	{
		TicketGroups supportGroup = new TicketGroups();

		supportGroup.group_name = "Support";
		supportGroup.is_default = true;
		supportGroup.updated_time = Calendar.getInstance().getTimeInMillis();
		supportGroup.setAgents_key_list(DomainUserUtil.getDomainUserKeys(NamespaceManager.get()));

		Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, DomainUserUtil.getDomainOwner(NamespaceManager
				.get()).id);
		supportGroup.setOwner_key(ownerKey);

		TicketGroups.ticketGroupsDao.put(supportGroup);

		return supportGroup;
	}

	/**
	 * GetAllGroups method fetches all Ticket Groups from specified namespace.
	 * If user have no groups then default group will be created and it will be
	 * returned.
	 * 
	 * @return List of Ticket Groups
	 */
	public static List<TicketGroups> getAllGroups()
	{
		List<TicketGroups> ticketGroups = TicketGroups.ticketGroupsDao.fetchAll();

		if (ticketGroups == null || ticketGroups.size() == 0)
		{
			TicketGroups supportGroup = createDefaultGroup();

			ticketGroups = new ArrayList<TicketGroups>();
			ticketGroups.add(supportGroup);
		}

		return inclDomainUsers(ticketGroups);
	}

	public TicketGroups createGroup(String groupName, List<Long> domainUserIDs) throws Exception
	{
		TicketGroups ticketGroup = getTicketGroupByName(groupName);

		if (ticketGroup != null)
			throw new Exception("Ticket Group with name" + groupName
					+ " already exists. Please choose a different Group name");

		List<Key<DomainUser>> agents_key_list = new ArrayList<Key<DomainUser>>();

		for (Long domainUserID : domainUserIDs)
			agents_key_list.add(new Key<DomainUser>(DomainUser.class, domainUserID));

		ticketGroup = new TicketGroups();
		ticketGroup.group_name = groupName;
		ticketGroup.updated_time = Calendar.getInstance().getTimeInMillis();

		ticketGroup.setAgents_key_list(agents_key_list);
		ticketGroup.setOwner_key(DomainUserUtil.getCurentUserKey());

		TicketGroups.ticketGroupsDao.put(ticketGroup);

		return ticketGroup;
	}

	public TicketGroups updateGroup(String groupName, List<Long> domainUserIDs) throws Exception
	{
		TicketGroups ticketGroup = getTicketGroupByName(groupName);

		if (ticketGroup == null)
			throw new Exception("Group name already exists. Please choose a different Group name");

		List<Key<DomainUser>> agents_key_list = new ArrayList<Key<DomainUser>>();

		for (Long domainUserID : domainUserIDs)
		{
			agents_key_list.add(new Key<DomainUser>(DomainUser.class, domainUserID));
		}

		ticketGroup.setAgents_key_list(agents_key_list);
		ticketGroup.updated_time = Calendar.getInstance().getTimeInMillis();

		TicketGroups.ticketGroupsDao.put(ticketGroup);

		return ticketGroup;
	}

	public void deleteGroup(Long groupID)
	{

	}

	/**
	 * 
	 * @param namespace
	 * @param groupID
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static TicketGroups getTicketGroupById(Long groupID) throws EntityNotFoundException
	{
		try
		{
			return TicketGroups.ticketGroupsDao.get(groupID);
		}	
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		
		return null;
	}

	/**
	 * 
	 * @param namespace
	 * @param groupID
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static TicketGroups getDefaultTicketGroup() throws EntityNotFoundException
	{
		TicketGroups ticketGroup = null;

		ticketGroup = TicketGroups.ticketGroupsDao.getByProperty("is_default", true);

		if (ticketGroup == null)
			ticketGroup = createDefaultGroup();

		return ticketGroup;
	}

	public static List<TicketGroups> inclDomainUsers(List<TicketGroups> ticketGroups)
	{
		String oldnamespace = NamespaceManager.get();

		try
		{
			NamespaceManager.set("");

			for (TicketGroups group : ticketGroups)
			{
				List<Long> users_keys = group.agents_keys;
				List<Key<DomainUser>> domainUserKeys = new ArrayList<Key<DomainUser>>();

				for (Long userKey : users_keys)
					domainUserKeys.add(new Key<DomainUser>(DomainUser.class, userKey));

				group.group_users = DomainUserUtil.dao.fetchAllByKeys(domainUserKeys);
			}

			NamespaceManager.set(oldnamespace);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldnamespace);
		}

		return ticketGroups;
	}

	/**
	 * 
	 * @param namespace
	 * @param groupID
	 * @return
	 */
	public static TicketGroups getTicketGroupByName(String groupName)
	{
		return TicketGroups.ticketGroupsDao.getByProperty("group_name", groupName);
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	public static String getShortGroupID(Long id)
	{
		return Base62.fromDecimalToOtherBase(62, id) + "";
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	public static Long getLongGroupID(String id)
	{
		return Base62.fromOtherBaseToDecimal(62, id);
	}
}