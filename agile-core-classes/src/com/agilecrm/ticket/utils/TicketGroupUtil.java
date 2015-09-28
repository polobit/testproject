package com.agilecrm.ticket.utils;

import java.util.Calendar;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.user.util.DomainUserUtil;
import com.campaignio.urlshortener.util.Base62;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;

/**
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
	 * @param domain
	 * @return created group object
	 */
	public static TicketGroups createDefaultGroup(String namespace)
	{
		String oldNamespace = NamespaceManager.get();
		TicketGroups supportGroup = new TicketGroups();

		try
		{
			NamespaceManager.set(namespace);

			supportGroup.group_name = "Support";
			supportGroup.updated_time = Calendar.getInstance().getTimeInMillis();
			supportGroup.agentsKeyList = DomainUserUtil.getDomainUserKeys(namespace);

			TicketGroups.ticketGroupsDao.put(supportGroup);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}

		return supportGroup;
	}

	/**
	 * 
	 * @param groupID
	 * @return
	 * @throws Exception
	 */
	public static TicketGroups getTicketGroupById(Long groupID) throws Exception
	{
		return TicketGroups.ticketGroupsDao.get(groupID);
	}
	
	/**
	 * 
	 * @param namespace
	 * @param groupID
	 * @return
	 */
	public static TicketGroups getTicketGroupById(String namespace, Long groupID)
	{
		String oldNamespace = NamespaceManager.get();

		try
		{
			NamespaceManager.set(namespace);
			
			return getTicketGroupById(groupID);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}

		return null;
	}

	public static void main(String[] args)
	{
		System.out.println(Base62.fromDecimalToOtherBase(62, 48146463));
		System.out.println(Base62.fromOtherBaseToDecimal(62, "3G15r"));
	}
}