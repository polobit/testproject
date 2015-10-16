package com.agilecrm.search.ui.serialize;

import java.io.Serializable;
import java.util.EnumSet;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact.Type;

/**
 * <code>SearchRule</code> includes details about the search condition built,
 * used in contact filters and reports. Variable lhs, rhs, condition represents
 * the field to be queried on, value of the field to be compared and comparing
 * condition respectively
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class SearchRule implements Serializable
{
	/**
	 * Represents the field name
	 */
	public String LHS = null;

	public enum RuleCondition
	{
		EQUALS, NOTEQUALS, ON, AFTER, BEFORE, BETWEEN_NUMBER, BETWEEN, LAST, NEXT, MATCHES, IS_GREATER_THAN, IS_LESS_THAN, FIRST_TIME, REPEAT, NOT_CONTAINS, ONCE_PER_SESSION, ONLY_ONCE, EVERYTIME,

		IS, IS_NOT, IS_EMPTY, KNOWN, UNKNOWN, IS_NOT_EMPTY, DEFINED, NOT_DEFINED, CONTAINS, ONCE_EVERY, MAX_OF, COUNTRY_IS, COUNTRY_IS_NOT, UA_IS, UA_IS_NOT, UA_CONTAINS, UA_NOT_CONTAINS,

		ACTIVE, DONE, REMOVED, UNSUBSCRIBED, HARDBOUNCED, SOFTBOUNCED, SPAM, NOT_ADDED, TICKET_STATUS_IS, TICKET_STATUS_IS_NOT, TICKET_TYPE_IS, TICKET_TYPE_IS_NOT, TICKET_PRIORITY_IS, TICKET_PRIORITY_IS_NOT, STARTS_WITH, ENDS_WITH;

		public static EnumSet<RuleCondition> campaignConditions = EnumSet.of(ACTIVE, DONE, REMOVED, UNSUBSCRIBED,
				HARDBOUNCED, SOFTBOUNCED, SPAM, NOT_ADDED);

	}

	/**
	 * Condition to be applied on the lhs and rhs fields
	 */
	public RuleCondition CONDITION = null;

	/**
	 * Represents the field value, used to compare with condition specified on
	 * lhs
	 */
	public String RHS = null;

	/**
	 * Represents a possible extra condition, used for conditions such as
	 * "between" condition
	 */
	public String RHS_NEW = null;

	public RuleCondition nested_condition = null;

	public String nested_lhs = null;

	public String nested_rhs = null;

	/**
	 * Enum to specify Types of search rule, can be contact, opportunity
	 */
	public static enum RuleType
	{
		Contact, Opportunity
	}

	/**
	 * Specifies the type of search rule i.e., query to be done on contact
	 * entity or on opportunity entity
	 */
	public RuleType ruleType = null;

	// To String
	public String toString()
	{
		return LHS + " " + CONDITION + " " + RHS + " " + RHS_NEW + " " + nested_condition + " " + nested_lhs + " "
				+ nested_rhs;
	}

	public static void addContactTypeRule(List<SearchRule> rules, Type type)
	{
		SearchRule rule = new SearchRule();
		rule.LHS = "type";
		rule.CONDITION = RuleCondition.EQUALS;
		rule.RHS = String.valueOf(type);

		rules.add(rule);
	}
}