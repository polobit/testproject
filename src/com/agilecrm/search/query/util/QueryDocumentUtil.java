package com.agilecrm.search.query.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.time.DateUtils;

import com.agilecrm.core.api.search.SearchAPI;
import com.agilecrm.search.BuilderInterface;
import com.agilecrm.search.QueryInterface.Type;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.util.DateUtil;

/**
 * Utility class used to construct query according to {@link SearchAPI}
 * specification on Date, Text, Number fields. It builds query based on
 * {@link SearchRule}
 * 
 * @author bobby
 * 
 */
public class QueryDocumentUtil
{

    /**
     * Builds Query based on Conditions AND, NOT
     * 
     * @param condition
     *            {@link String}
     * @param query
     *            {@link String}
     * @param newQuery
     *            {@link String}
     * @return Returns query string built based on conditions {@link String}
     */
    public static String buildNestedCondition(String condition, String query, String newQuery)
    {

	// If query string is empty return simple not query
	if (query.isEmpty() && condition.equals("NOT"))
	{
	    query = "NOT " + newQuery;
	    return query;
	}

	// If query String is not empty then create And condition with old query
	// and add not query
	if (!query.isEmpty() && condition.equals("NOT"))
	{
	    query = "(" + query + ")" + " AND " + "(NOT " + newQuery + ")";
	    return query;
	}

	// If query is not empty should add AND condition
	if (!query.isEmpty())
	{
	    query = query + " " + condition + " " + newQuery;
	    return query;
	}

	// If query is empty and not "NOT" query return same new query
	return newQuery;
    }

    /**
     * Constructs query based on list of search rules, generates Advanced search
     * query string.
     * 
     * @param rules
     *            {@link List} of {@link SearchRule}
     * @return
     */
    public static String constructQuery(List<SearchRule> rules)
    {
	String query = "";

	// Iterates though each rule object, and constructs query based on type
	// (Date, Number, Text fields) and conditions (Equals, OR, AND, ON)
	for (SearchRule rule : rules)
	{
	    // Checks Rules is built properly, as validations are not preset at
	    // client side. Improper query raises exceptions.
	    if (rule.LHS == null || rule.RHS == null || rule.CONDITION == null)
		continue;

	    // If nested condition is not null and nested value is not
	    // available, condition is excluded. It might occur if client side
	    // validation fails
	    if (rule.nested_condition != null && rule.nested_lhs == null)
		continue;

	    /*
	     * Get condition parameters LHS(field_name in document) ,
	     * condition(condition or query AND or NOT), RHS(field_value)
	     */
	    String lhs = rule.LHS;
	    SearchRule.RuleCondition condition = rule.CONDITION;
	    String rhs = rule.RHS;
	    String rhs_new = rule.RHS_NEW;
	    SearchRule.RuleCondition nestedCondition = rule.nested_condition;
	    String nestedLhs = rule.nested_lhs;
	    String nestedRhs = rule.nested_rhs;

	    /*
	     * Build equals and not equals queries conditions except time based
	     * conditions
	     */
	    if (!lhs.contains("time"))
	    {
		/*
		 * Create new query with LHS and RHS conditions to be processed
		 * further for necessary queries
		 */
		lhs = lhs.replaceAll("[^a-zA-Z0-9_]", "_");
		String newQuery = lhs + ":" + SearchUtil.normalizeString(rhs);

		// For equals condition
		if (condition.equals(SearchRule.RuleCondition.EQUALS) || condition.equals(SearchRule.RuleCondition.ON))
		{
		    /*
		     * Build query by passing condition old query and new query
		     */
		    query = buildNestedCondition("AND", query, newQuery);
		}

		else if (condition.equals(SearchRule.RuleCondition.NOTEQUALS))
		{
		    // For not queries
		    query = buildNestedCondition("NOT", query, newQuery);
		}

		// For equals condition
		else if (condition.equals(SearchRule.RuleCondition.IS_GREATER_THAN))
		{
		    newQuery = lhs + ">" + SearchUtil.normalizeString(rhs);

		    /*
		     * Build query by passing condition old query and new query
		     */
		    query = buildNestedCondition("AND", query, newQuery);
		}

		else if (condition.equals(SearchRule.RuleCondition.IS_LESS_THAN))
		{
		    newQuery = lhs + "<" + SearchUtil.normalizeString(rhs);

		    /*
		     * Build query by passing condition old query and new query
		     */
		    query = buildNestedCondition("AND", query, newQuery);
		}

	    }

	    // Queries on created or updated times
	    if (lhs.contains("time") && !lhs.contains("tags"))
	    {
		query = createTimeQueryEpoch(query, lhs, condition, rhs, rhs_new);
	    }

	    if (lhs.contains("time") && lhs.contains("tags"))
	    {
		query = createTimeQueryEpoch(query, SearchUtil.normalizeString(rhs) + "_time", nestedCondition,
			nestedLhs, nestedRhs);
	    }
	}
	return query;
    }

    public static String createTimeQuery(String query, String lhs, SearchRule.RuleCondition condition, String rhs,
	    String rhs_new)
    {
	// Formated to build query
	String date = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(rhs));

	// Created on date condition
	if (condition.equals(SearchRule.RuleCondition.ON) || condition.equals(SearchRule.RuleCondition.EQUALS))
	{
	    query = buildNestedCondition("AND", query, lhs + "=" + date);
	}

	// Created after given date
	else if (condition.equals(SearchRule.RuleCondition.AFTER))
	{
	    query = buildNestedCondition("AND", query, lhs + " >" + date);
	}

	// Created before particular date
	else if (condition.equals(SearchRule.RuleCondition.BEFORE))
	{
	    query = buildNestedCondition("AND", query, lhs + " < " + date);
	}

	// Created Between given dates
	else if (condition.equals(SearchRule.RuleCondition.BETWEEN))
	{
	    if (rhs_new != null)
	    {
		String to_date = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(rhs_new));

		query = buildNestedCondition("AND", query, lhs + " >= " + date);
		query = buildNestedCondition("AND", query, lhs + " <= " + to_date);
	    }
	}

	// Created in last number of days
	else if (condition.equals(SearchRule.RuleCondition.LAST))
	{
	    long fromDateInSecs = new DateUtil().removeDays(Integer.parseInt(rhs) - 1).getTime().getTime();

	    Date truncatedDate = DateUtils.truncate(new Date(fromDateInSecs), Calendar.DATE);
	    System.out.println("tryncated date : " + truncatedDate);

	    System.out.println(new DateUtil(new Date(fromDateInSecs)).getTime().toGMTString());

	    String fromDate = SearchUtil.getDateWithoutTimeComponent(fromDateInSecs);

	    System.out.println("from date = " + fromDate + " lhs = " + lhs);

	    query = buildNestedCondition("AND", query, lhs + " >= " + fromDate);
	}
	else if (condition.equals(SearchRule.RuleCondition.NEXT))
	{
	    long limitTime = new DateUtil().addDays(Integer.parseInt(rhs) - 1).getTime().getTime();
	    String formatedLimitDate = SearchUtil.getDateWithoutTimeComponent(limitTime);

	    long currentTime = new Date().getTime();

	    String formatedCurrentDate = SearchUtil.getDateWithoutTimeComponent(currentTime);

	    query = buildNestedCondition("AND", query, lhs + " >=" + formatedCurrentDate);
	    query = buildNestedCondition("AND", query, lhs + " <= " + formatedLimitDate);

	}

	return query;

    }

    /**
     * Creates query on Date/Time fields. As equals query is not working on date
     * queries, this function queries using a hack; queries on the epoch time
     * fields (stored as number format fields in document to overcome time
     * equals query).
     * 
     * If there is equal/ on date query or between query, given date should be
     * included to query it and epoch time is used on it.
     * 
     * This is a temporary method, once google appengine rolls out a fix on
     * equals query we can use date fields instead of using epoch time.
     * 
     * @param query
     * @param lhs
     * @param condition
     * @param rhs
     * @param rhs_new
     * @return
     */
    public static String createTimeQuery1(String query, String lhs, SearchRule.RuleCondition condition, String rhs,
	    String rhs_new)
    {

	// Gets date from rhs (selected value)
	Date startDate = new DateUtil(new Date(Long.parseLong(rhs))).toMidnight().getTime();

	/*
	 * End date i.e., to the end time of start date, it counts complete one
	 * day. Querying between start and end epoch times returns date equals
	 * query query
	 */
	Date endDate = new DateUtil(startDate).addDays(1).toMidnight().getTime();

	// Day start and end epoch times are calculated.
	String dayStartEpochTime = String.valueOf(startDate.getTime() / 1000);
	String dayEndEpochTime = String.valueOf(endDate.getTime() / 1000);

	// Formated to build query
	String date = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(rhs));

	lhs = SearchUtil.normalizeString(lhs);

	// Created on date condition
	if (condition.equals(SearchRule.RuleCondition.ON) || condition.equals(SearchRule.RuleCondition.EQUALS))
	{
	    String epochQuery = "";

	    // First create query based on epoch time, take it in to temp string
	    // as it should be combined with a OR query on date fields to
	    // support old data
	    epochQuery = lhs + "_epoch" + ">=" + dayStartEpochTime;

	    epochQuery = buildNestedCondition("AND", epochQuery, lhs + "_epoch" + "<=" + dayEndEpochTime);

	    String dateQuery = lhs + ":" + date;

	    String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

	    query = buildNestedCondition("AND", query, timeQuery);

	}

	// Created after given date.
	else if (condition.equals(SearchRule.RuleCondition.AFTER))
	{
	    String epochQuery = lhs + "_epoch >= " + dayEndEpochTime;

	    String dateQuery = lhs + " > " + date;

	    String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

	    query = buildNestedCondition("AND", query, timeQuery);
	}

	// Created before particular date
	else if (condition.equals(SearchRule.RuleCondition.BEFORE))
	{
	    String epochQuery = lhs + "_epoch < " + dayEndEpochTime;

	    String dateQuery = lhs + " < " + date;

	    String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

	    query = buildNestedCondition("AND", query, timeQuery);
	}

	// Created Between given dates
	else if (condition.equals(SearchRule.RuleCondition.BETWEEN))
	{
	    if (rhs_new != null)
	    {

		Date toDate = new DateUtil(new Date(Long.parseLong(rhs_new))).addDays(1).toMidnight().getTime();

		String toDateEpoch = String.valueOf(toDate.getTime() / 1000);

		String epochQuery = lhs + "_epoch >= " + dayStartEpochTime;

		epochQuery = buildNestedCondition("AND", epochQuery, lhs + "_epoch <= " + toDateEpoch);

		String to_date = SearchUtil.getDateWithoutTimeComponent(Long.parseLong(rhs_new));

		String dateQuery = lhs + " >= " + date;

		dateQuery = buildNestedCondition("AND", dateQuery, lhs + " <= " + to_date);

		String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

		query = buildNestedCondition("AND", query, timeQuery);
	    }
	}

	// Created in last number of days
	else if (condition.equals(SearchRule.RuleCondition.LAST))
	{
	    // Get epoch time of starting date i.e., before x days, current date
	    // - x days
	    long fromDateInSecs = new DateUtil().removeDays(Integer.parseInt(rhs)).toMidnight().getTime().getTime() / 1000;

	    // Current epoch time to get current time.
	    long currentEpochTime = new DateUtil().getTime().getTime() / 1000;

	    String epochQuery = lhs + "_epoch >= " + String.valueOf(fromDateInSecs);

	    epochQuery = buildNestedCondition("AND", epochQuery, lhs + "_epoch <= " + String.valueOf(currentEpochTime));

	    // Gets date without time component to query on date fields as well
	    String fromDate = SearchUtil.getDateWithoutTimeComponent(fromDateInSecs * 1000);

	    String toDate = SearchUtil.getDateWithoutTimeComponent(currentEpochTime * 1000);

	    String dateQuery = lhs + " >= " + fromDate;

	    dateQuery = buildNestedCondition("AND", dateQuery, lhs + " <= " + toDate);

	    // Constructs OR query on both epoch query and date query, as ON
	    // date condition is not working we have an extra fields which save
	    // epoch time
	    String timeQuery = "((" + epochQuery + ") OR (" + dateQuery + "))";

	    query = buildNestedCondition("AND", query, timeQuery);

	}
	else if (condition.equals(SearchRule.RuleCondition.NEXT))
	{
	    long limitTime = new DateUtil().addDays(Integer.parseInt(rhs) - 1).getTime().getTime();

	    String formatedLimitDate = SearchUtil.getDateWithoutTimeComponent(limitTime);

	    long currentTime = new Date().getTime();

	    String formatedCurrentDate = SearchUtil.getDateWithoutTimeComponent(currentTime);

	    query = buildNestedCondition("AND", query, lhs + " >=" + formatedCurrentDate);
	    query = buildNestedCondition("AND", query, lhs + " <= " + formatedLimitDate);

	}

	return query;

    }

    public static String createTimeQueryEpoch(String query, String lhs, SearchRule.RuleCondition condition, String rhs,
	    String rhs_new)
    {

	// Gets date from rhs (selected value)

	Long startTimeEpoch = Long.parseLong(rhs);
	Long endTimeEpoch = startTimeEpoch + 24 * 60 * 60 * 1000;

	/*
	 * End date i.e., to the end time of start date, it counts complete one
	 * day. Querying between start and end epoch times returns date equals
	 * query query
	 */

	lhs = SearchUtil.normalizeString(lhs);
	// Day start and end epoch times are calculated.
	String dayStartEpochTime = String.valueOf(startTimeEpoch / 1000);
	String dayEndEpochTime = String.valueOf(endTimeEpoch / 1000);

	// Created on date condition
	if (condition.equals(SearchRule.RuleCondition.ON) || condition.equals(SearchRule.RuleCondition.EQUALS))
	{
	    String epochQuery = "";

	    // First create query based on epoch time, take it in to temp string
	    // as it should be combined with a OR query on date fields to
	    // support old data
	    epochQuery = lhs + "_epoch" + ">=" + dayStartEpochTime;

	    query = buildNestedCondition("AND", epochQuery, lhs + "_epoch" + "<=" + dayEndEpochTime);

	}

	// Created after given date.
	else if (condition.equals(SearchRule.RuleCondition.AFTER))
	{
	    String epochQuery = lhs + "_epoch >= " + dayStartEpochTime;

	    query = buildNestedCondition("AND", query, epochQuery);
	}

	// Created before particular date
	else if (condition.equals(SearchRule.RuleCondition.BEFORE))
	{
	    String epochQuery = lhs + "_epoch < " + dayStartEpochTime;

	    query = buildNestedCondition("AND", query, epochQuery);
	}

	// Created Between given dates
	else if (condition.equals(SearchRule.RuleCondition.BETWEEN))
	{
	    if (rhs_new != null)
	    {

		Date toDate = new DateUtil(new Date(Long.parseLong(rhs_new))).getTime();

		String toDateEpoch = String.valueOf(Long.parseLong(rhs_new) / 1000);

		String epochQuery = lhs + "_epoch >= " + dayStartEpochTime;

		epochQuery = buildNestedCondition("AND", epochQuery, lhs + "_epoch <= " + toDateEpoch);

		query = buildNestedCondition("AND", query, epochQuery);
	    }
	}

	// Created in last number of days
	else if (condition.equals(SearchRule.RuleCondition.LAST))
	{
	    // Get epoch time of starting date i.e., before x days, current date
	    // - x days

	    int days = Integer.parseInt(rhs);

	    Calendar cal = Calendar.getInstance();

	    // Minutes and seconds are removed and time is set one hour extra so
	    // few contacts will not be missed out
	    cal.set(Calendar.HOUR_OF_DAY, cal.get(Calendar.HOUR_OF_DAY) + 1);
	    cal.set(Calendar.MINUTE, 0);
	    cal.set(Calendar.SECOND, 0);
	    cal.set(Calendar.MILLISECOND, 0);

	    // Current epoch time to get current time.
	    long currentEpochTime = cal.getTimeInMillis() / 1000;

	    long fromDateInSecs = currentEpochTime - days * 24 * 3600;

	    String epochQuery = lhs + "_epoch >= " + String.valueOf(fromDateInSecs);

	    epochQuery = buildNestedCondition("AND", epochQuery, lhs + "_epoch <= " + String.valueOf(currentEpochTime));

	    // Constructs OR query on both epoch query and date query, as ON
	    // date condition is not working we have an extra fields which save
	    // epoch time
	    query = buildNestedCondition("AND", query, epochQuery);

	}
	else if (condition.equals(SearchRule.RuleCondition.NEXT))
	{
	    long currentTime = new Date().getTime();

	    long limitTime = currentTime + (Integer.parseInt(rhs) - 1) * 24 * 3600;

	    query = buildNestedCondition("AND", query, lhs + " >=" + currentTime);
	    query = buildNestedCondition("AND", query, lhs + " <=" + limitTime);
	}

	return query;

    }

    /**
     * Based on the type of the class, entities are fetched
     * 
     * @param type
     * @param entity_ids
     * @return
     */
    public static List getEntities(Type type, List<Long> entity_ids)
    {

	// Gets class name, which is used to get respective document class
	System.out.println(type.getClazz().getSimpleName());
	try
	{
	    // Gets Document object and gets entities
	    BuilderInterface builder = (BuilderInterface) Class.forName(
		    "com.agilecrm.search.document." + type.getClazz().getSimpleName() + "Document").newInstance();
	    return builder.getResults(entity_ids);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    // TODO: handle exception
	}
	return new ArrayList();

    }
}