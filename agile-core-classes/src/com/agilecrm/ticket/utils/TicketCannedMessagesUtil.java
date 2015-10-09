package com.agilecrm.ticket.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.ticket.entitys.TicketCannedMessages;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * <code>TicketCannedMessagesUtil</code> is a utility class for
 * {@link TicketCannedMessages} to provide CRUD operations.
 * 
 * @author Sasi on 09-Oct-2015
 * 
 */
public class TicketCannedMessagesUtil
{
	/**
	 * 
	 * @param domainUserKey
	 * @return List of {@link TicketCannedMessages}
	 */
	public static List<TicketCannedMessages> getCannedMessages(Key<DomainUser> domainUserKey)
	{
		return TicketCannedMessages.dao.listByProperty("owner_key", domainUserKey);
	}
	
	/**
	 * 
	 * @param id
	 * @return List of {@link TicketCannedMessages}
	 * @throws EntityNotFoundException 
	 */
	public static TicketCannedMessages getCannedMessageById(Long id) throws EntityNotFoundException
	{
		return TicketCannedMessages.dao.get(id);
	}
	
	/**
	 * 
	 * @param id
	 * @return List of {@link TicketCannedMessages}
	 * @throws EntityNotFoundException 
	 */
	public static TicketCannedMessages getCannedMessageByName(String title, Key<DomainUser> userKey) throws EntityNotFoundException
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("title", title);
		searchMap.put("owner_key", userKey);
		
		return TicketCannedMessages.dao.getByProperty(searchMap);
	}
}
