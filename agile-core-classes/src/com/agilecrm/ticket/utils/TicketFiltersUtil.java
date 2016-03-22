package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.ticket.entitys.TicketFilters;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
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
		searchMap.put("is_default_filter", true);

		List<TicketFilters>  filters = TicketFilters.dao.listByProperty(searchMap);

		if (filters.size() == 0)
			saveDefaultFilters();

		searchMap.remove("is_default_filter");

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
		return getQueryFromConditionsMap(getGroupedConditions(conditions));
	}

	/**
	 * 
	 * @param conditionsMap
	 * @return
	 */
	public static String getQueryFromConditionsMap(Map<String, List<SearchRule>> conditionsMap)
	{
		StringBuffer query = new StringBuffer();

		// Mapping conditions to table field names
		Map<String, String> fieldsMap = new HashMap<String, String>()
		{
			private static final long serialVersionUID = 1L;

			{
				put("hrs_since_created", "created_time");
				put("hrs_since_opened", "first_replied_time");
				put("hrs_since_closed", "closed_time");
				put("hrs_since_assigned", "assigned_time");
				put("hrs_since_requester_update", "last_customer_replied_time");
				put("hrs_since_assignee_update", "last_agent_replied_time");
				put("hrs_since_due_date", "due_date");
				put("hrs_untill_due_date", "due_date");
			}
		};

		for (Map.Entry<String, List<SearchRule>> entry : conditionsMap.entrySet())
		{
			List<SearchRule> groupedConditions = entry.getValue();

			query.append("(");
			for (SearchRule condition : groupedConditions)
			{
				String LHS = condition.LHS.toString(), operator = String.valueOf(condition.CONDITION).toLowerCase(), RHS = (condition.RHS == null ? ""
						: condition.RHS).toString();

				switch (LHS)
				{
				case "status":
				case "ticket_type":
				case "priority":
				case "source":
				case "labels":
				case "assignee_id":
				case "group_id":
				{
					if (operator != null && operator.contains("not"))
						query.append("NOT " + LHS + "=" + RHS);
					else
						query.append(LHS + "=" + RHS);

					break;
				}
				case "ticket_spam":
				{
					query.append("is_spam="
							+ (operator.equalsIgnoreCase("TICKET_IS") ? true : false));
					break;
				}					
				case "ticket_favorite":
				{
					query.append("is_favorite="
							+ (operator.equalsIgnoreCase("TICKET_IS") ? true : false));
					break;
				}
				case "ticket_last_updated_by":
				{
					query.append("last_updated_by="
							+ (operator.equalsIgnoreCase("LAST_UPDATED_BY_AGENT") ? "AGENT" : "REQUESTER"));
					break;
				}
				case "subject":
				case "notes":
				{
					if (operator != null && operator.contains("not"))
						query.append("NOT " + condition.LHS + "=(" + condition.RHS + ")");
					else
						query.append(LHS + "=" + RHS);

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
					Calendar calendar = Calendar.getInstance();
					calendar.set(Calendar.MINUTE, 0);
					calendar.set(Calendar.SECOND, 0);
					calendar.add(Calendar.HOUR, 1);

					Long currentEpoch = calendar.getTimeInMillis();

					Long millis = Long.parseLong(RHS) * 60 * 60 * 1000;
					Long rhsEpoch = (currentEpoch - millis) / 1000;

					if (operator != null && operator.equalsIgnoreCase("IS_GREATER_THAN"))
						query.append(fieldsMap.get(LHS) + "<=" + rhsEpoch);
					else
						query.append(fieldsMap.get(LHS) + ">=" + rhsEpoch + " AND " + fieldsMap.get(LHS) + "<="
								+ currentEpoch / 1000);

					break;
				}
				case "created_between":
					query.append("created_time >=" + Long.parseLong(RHS) + " AND " + "created_time <="
							+ Long.parseLong(condition.RHS_NEW));
					break;
				case "due_date":
					query.append("due_date <=" + Long.parseLong(RHS) + " AND " + "due_date > 0");
					break;
				}
				
				query.append(" OR ");
			}

			query = new StringBuffer(query.substring(0, query.lastIndexOf("OR")).trim());
			query.append(") AND ");
		}

		return query.substring(0, query.lastIndexOf("AND"));
	}

	/**
	 * Grouping same operations to query them with OR operator
	 * 
	 * @param conditions
	 * @return
	 */
	public static Map<String, List<SearchRule>> getGroupedConditions(List<SearchRule> conditions)
	{

		Map<String, List<SearchRule>> conditionsMap = new HashMap<String, List<SearchRule>>();

		for (SearchRule condition : conditions)
		{
			String LHS = condition.LHS.toString();

			List<SearchRule> groupedConditions = new ArrayList<SearchRule>();

			if (conditionsMap.containsKey(LHS))
				groupedConditions = conditionsMap.get(LHS);

			groupedConditions.add(condition);

			conditionsMap.put(LHS, groupedConditions);
		}

		return conditionsMap;
	}

	/**
	 * Default filters
	 */
	public static void saveDefaultFilters()
	{
		TicketFilters newTickets = new TicketFilters();

		List<SearchRule> conditions = new ArrayList<SearchRule>();

		SearchRule searchRule = new SearchRule();

		searchRule.LHS = "status";
		searchRule.CONDITION = RuleCondition.TICKET_STATUS_IS;
		searchRule.RHS = String.valueOf(Status.NEW);
		conditions.add(searchRule);

		newTickets.name = "New Tickets";
		newTickets.is_default_filter = true;
		newTickets.conditions = conditions;
		newTickets.setOwner_key(DomainUserUtil.getCurentUserKey());

		TicketFilters.dao.put(newTickets);

		TicketFilters allTickets = new TicketFilters();

		conditions = new ArrayList<SearchRule>();
		searchRule = new SearchRule();
		searchRule.LHS = "status";
		searchRule.CONDITION = RuleCondition.TICKET_STATUS_IS;
		searchRule.RHS = String.valueOf(Status.NEW);
		conditions.add(searchRule);

		searchRule = new SearchRule();
		searchRule.LHS = "status";
		searchRule.LHS = "status";
		searchRule.CONDITION = RuleCondition.TICKET_STATUS_IS;
		searchRule.RHS = String.valueOf(Status.OPEN);
		conditions.add(searchRule);

		searchRule = new SearchRule();
		searchRule.LHS = "status";
		searchRule.LHS = "status";
		searchRule.CONDITION = RuleCondition.TICKET_STATUS_IS;
		searchRule.RHS = String.valueOf(Status.PENDING);
		conditions.add(searchRule);

		searchRule = new SearchRule();
		searchRule.LHS = "status";
		searchRule.LHS = "status";
		searchRule.CONDITION = RuleCondition.TICKET_STATUS_IS;
		searchRule.RHS = String.valueOf(Status.CLOSED);
		conditions.add(searchRule);

		allTickets.name = "All Tickets";
		allTickets.is_default_filter = true;
		allTickets.conditions = conditions;
		allTickets.setOwner_key(DomainUserUtil.getCurentUserKey());

		TicketFilters.dao.put(allTickets);
	}
}
