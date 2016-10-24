package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.ticket.entitys.TicketCannedMessages;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
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
	public static List<TicketCannedMessages> createDefault()
	{
		TicketCannedMessages cannedMessageOne = new TicketCannedMessages();
		cannedMessageOne.title = "Header Greeting";
		cannedMessageOne.message = "Dear {{requester_name}},\r\nThanks for reaching out.\r\n";
		cannedMessageOne.setOwner_key(DomainUserUtil.getCurentUserKey());

		TicketCannedMessages cannedMessageTwo = new TicketCannedMessages();
		cannedMessageTwo.title = "Footer Greeting";
		cannedMessageTwo.message = "I'm hoping that I was able to answer your queries, {{requester_name}}. Please feel free to get back to us if you still have any questions.";
		cannedMessageTwo.setOwner_key(DomainUserUtil.getCurentUserKey());

		TicketCannedMessages.dao.put(cannedMessageOne);
		TicketCannedMessages.dao.put(cannedMessageTwo);

		List<TicketCannedMessages> defaultList = new ArrayList<TicketCannedMessages>();
		defaultList.add(cannedMessageOne);
		defaultList.add(cannedMessageTwo);

		return defaultList;
	}

	/**
	 * 
	 * @param domainUserKey
	 * @return List of {@link TicketCannedMessages}
	 */
	public static List<TicketCannedMessages> getPublicCannedMessages(Key<DomainUser> domainUserKey)
	{
		List<TicketCannedMessages> publicCannedMessagesList = TicketCannedMessages.dao.listByProperty("owner_key",
				domainUserKey);

		publicCannedMessagesList.addAll(TicketCannedMessages.dao.listByProperty("is_public", true));

		return publicCannedMessagesList;
	}

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
	public static TicketCannedMessages getCannedMessageByName(String title, Key<DomainUser> userKey)
			throws EntityNotFoundException
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("title", title);
		searchMap.put("owner_key", userKey);

		return TicketCannedMessages.dao.getByProperty(searchMap);
	}
}
