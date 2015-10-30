package com.agilecrm.ticket.utils;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.ticket.entitys.TicketFilters;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.gdata.data.contacts.Subject;
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

	/**
	 * Fetches Filter obj for given filter id
	 * 
	 * @param id
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static TicketFilters getFilterById(Long id) throws EntityNotFoundException
	{
		return TicketFilters.dao.get(id);
	}

	/**
	 * Prepares and returns query string for the given filter conditions
	 * 
	 * @param conditions
	 * @return
	 */
	public static String getQueryFromConditions(List<SearchRule> conditions)
	{
		StringBuffer query = new StringBuffer();
		Map<String, String> fieldsMap = new HashMap<String, String>()
		{
			{
				put("hrs_since_created", "created_time");
				put("hrs_since_opened", "first_replied_time");
				put("hrs_since_closed", "last_updated_time");
				put("hrs_since_assigned", "assigned_time");
				put("hrs_since_requester_update", "last_customer_replied_time");
				put("hrs_since_assignee_update", "last_agent_replied_time");
				put("hrs_since_due_date", "due_date");
				put("hrs_untill_due_date", "due_date");
			}
		};

		for (SearchRule condition : conditions)
		{
			String LHS = condition.LHS.toString(), operator = String.valueOf(condition.CONDITION).toLowerCase(), 
					RHS = (condition.RHS == null ? "" : condition.RHS)
					.toString();

			switch (LHS)
			{
				case "status":
				case "type":
				case "priority":
				case "source":
				case "tags":
				case "assignee_id":
				case "group_id":
				{
					if (operator != null && operator.contains("not"))
						query.append("NOT " + LHS + " = " + RHS);
					else
						query.append(LHS + " = " + RHS);
	
					break;
				}
				case "ticket_last_updated_by":
				{
					query.append("last_updated_by = " + (operator.equalsIgnoreCase("LAST_UPDATED_BY_AGENT") ? "AGENT" : "REQUESTER"));
					break;
				}
				case "subject":
				case "notes":
				{
					if (operator != null && operator.contains("not"))
						query.append("NOT " + condition.LHS + " = (" + condition.RHS + ")");
					else
						query.append(LHS + " = " + RHS);
	
					break;
				}
				case "hrs_since_created":
				case "hrs_since_opened":
				case "hrs_since_closed":
				case "hrs_since_assigned":
				case "hrs_since_requester_update":
				case "hrs_since_assignee_update":
				case "hrs_since_due_date":
				case "hrs_untill_due_date":
				{
					Long currentEpoch = Calendar.getInstance().getTimeInMillis();
	
					Long millis = Long.parseLong(RHS) * 60 * 60 * 1000;
					Long rhsEpoch = (currentEpoch - millis) / 1000;
	
					if (operator != null && operator.equalsIgnoreCase("IS_GREATER_THAN"))
						query.append(fieldsMap.get(LHS) + " <= " + rhsEpoch);
					else
						query.append(fieldsMap.get(LHS) + " >= " + rhsEpoch + " AND " + fieldsMap.get(LHS) + " <= " + currentEpoch);
	
					break;
				}
			}
			
			query.append(" AND ");
		}

		return query.toString();
	}
}
