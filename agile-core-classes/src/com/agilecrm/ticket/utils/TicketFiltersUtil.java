package com.agilecrm.ticket.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.ticket.entitys.TicketFilters;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * <code>TicketFiltersUtil</code> is a utility class for {@link TicketFilters}
 * to provide CRUD operations.
 * 
 * @author Sasi on 15-Oct-2015
 * 
 */
public class TicketFiltersUtil
{
	/**
	 * 
	 * @param currentDomainUserId
	 * @return List of filters created by current domain user
	 */
	public static List<TicketFilters> getAllFilters(Key<DomainUser> domainUserKey)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("owner_key", domainUserKey);

		return TicketFilters.dao.listByProperty(searchMap);
	}

	public static TicketFilters getFilterById(Long id) throws EntityNotFoundException
	{
		return TicketFilters.dao.get(id);
	}
}
