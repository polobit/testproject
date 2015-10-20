package com.agilecrm.ticket.utils;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

		for (SearchRule condition : conditions)
		{
			String conditionString = String.valueOf(condition.CONDITION).toLowerCase(), operator = "";

			/**
			 * Preparing not equals condition like - NOT manufacturer=steinway
			 */
			if (conditionString.equals("notequals") || conditionString.equals("ticket_status_is_not")
					|| conditionString.equals("ticket_type_is_not") || conditionString.equals("ticket_priority_is_not")
					|| conditionString.equals("ticket_source_is_not") || conditionString.equals("is_not"))
			{
				if (condition.LHS.equals("subject") || condition.LHS.equals("notes"))
				{
					query.append("NOT " + condition.LHS + " = (" + condition.RHS + ") AND ");
				}
				else
				{
					query.append("NOT " + condition.LHS + " = " + condition.RHS + " AND ");
				}

				continue;
			}

			switch (conditionString)
			{
			case "is":
			case "equals":
			case "ticket_status_is":
			case "ticket_type_is":
			case "ticket_priority_is":
			case "ticket_source_is":
				operator = " = ";
				break;
			case "is_greater_than":
				operator = " > ";
				break;
			case "is_less_than":
				operator = " < ";
				break;
			}

			String lhs = condition.LHS, rhs = condition.RHS;

			/**
			 * Checking if condition related to time
			 */
			if (lhs.startsWith("hrs"))
			{
				/**
				 * Converting hours in RHS value to milli seconds
				 */
				Long millis = Long.parseLong(rhs) * 60 * 60 * 1000;
				rhs = (Calendar.getInstance().getTimeInMillis() - millis)/1000 + "";

				switch (lhs)
				{
				case "hrs_since_created":
				{
					lhs = "created_time";
					break;
				}
				case "hrs_since_opened":
				{
					lhs = "first_replied_time";
					break;
				}
				case "hrs_since_closed":
				{
					lhs = "closed_time";
					break;
				}
				case "hrs_since_assigned":
				{
					lhs = "assigned_time";
					break;
				}
				case "hrs_since_requester_update":
				{
					lhs = "last_customer_replied_time";
					break;
				}
				case "hrs_since_assignee_update":
				{
					lhs = "last_agent_replied_time";
					break;
				}

				case "hrs_since_due_date":
				{
					break;
				}
				case "hrs_untill_due_date":
				{
					break;
				}
				}
			}

			if (condition.LHS.equals("subject") || condition.LHS.equals("notes"))
			{
				query.append(condition.LHS + " = (" + condition.RHS + ") AND ");
			}
			else
			{
				query.append(lhs + operator + rhs + " AND ");
			}
			
		}

		return query.toString();
	}
}
