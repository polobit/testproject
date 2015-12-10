package com.agilecrm.search.util;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import java.util.TimeZone;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.DateUtil;

/**
 * <code> TagSearchUtil </code> contains utility methods to search for tags with
 * a given time frame using Google Full Text Search
 * 
 */
public class TagSearchUtil
{
    /**
     * Utility function to provide the SearchRule to be used to create
     * ContactFilters
     * 
     * @param tag
     *            - tag to search for
     * @param startTime
     *            - start time of the range
     * @param end
     *            - end time of the range
     * 
     * @return SearchRule
     */
    private static SearchRule getSearchRule(String tag, String startTime, String endTime)
    {
	// Create Search Rule

	// [tags_time EQUALS Activist null BETWEEN 1383320887015 1384102087075]
	// return LHS + " " + CONDITION + " " + RHS + " " + RHS_NEW + " " +
	// nested_condition + " " + nested_lhs + " " + nested_rhs;

	SearchRule searchRule = new SearchRule();
	searchRule.LHS = "tags_time";
	searchRule.CONDITION = SearchRule.RuleCondition.EQUALS;
	searchRule.RHS = tag;

	searchRule.RHS_NEW = null;
	searchRule.nested_condition = SearchRule.RuleCondition.BETWEEN;
	searchRule.nested_lhs = startTime;
	searchRule.nested_rhs = endTime;

	return searchRule;
    }

    /**
     * Returns the tag count for a given filter from start to end time
     * 
     * @param ContactFilter
     *            - the filter to be used. If null, it uses all contacts
     * @param tag
     *            - tag to search for
     * @param startTime
     *            - start time of the range
     * @param end
     *            - end time of the range
     * 
     * @return {@link Map}
     */
    public static int getTagCount(ContactFilter contactFilter, String tag, String startTime, String endTime)
    {

	// Create Contact Filter if not present
	if (contactFilter == null)
	{
	    contactFilter = new ContactFilter();
	}
	else
	{
		SearchRule contact_searchRule = new SearchRule();
		contact_searchRule.LHS = "type";
		contact_searchRule.CONDITION = RuleCondition.EQUALS;
		contact_searchRule.RHS = contactFilter.contact_type.toString();
		contactFilter.rules.add(contact_searchRule);
	}
	SearchRule searchRule = new SearchRule();
	searchRule.LHS = "tags";
	searchRule.CONDITION = SearchRule.RuleCondition.EQUALS;
	searchRule.RHS = tag;
	
	contactFilter.rules.add(searchRule);
	
	// Add the tag find rule
	contactFilter.rules.add(getSearchRule(tag, startTime, endTime));

	// Get Count
	try
	{
	    int count = contactFilter.queryContactsCount();
	    return count;
	}
	catch (Exception e)
	{
	}
	finally
	{
	    contactFilter.rules.remove(contactFilter.rules.size() - 1);
	    System.out.println(contactFilter);
	}
	return 0;
    }

    /**
     * Returns the tag count daily for a given filter from start to end time
     * 
     * @param ContactFilter
     *            - the filter to be used. If null, it uses all contacts
     * @param tag
     *            - tag to search for
     * @param startTime
     *            - start time of the range
     * @param end
     *            - end time of the range
     * 
     * @return an object in the format required by highcharts
     */
    public static JSONObject getTagCount(ContactFilter contactFilter, String tags[], String startTime, String endTime, int type) throws Exception
    {
	JSONObject tagsCountJSONObject = new JSONObject();
	UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
	String timezone = "UTC";
	if (userPrefs != null && userPrefs.timezone != null)
	{
		timezone = userPrefs.timezone;
	}

	// Sets calendar with start time.
	Calendar startCalendar = Calendar.getInstance(TimeZone.getTimeZone(timezone));
	startCalendar.setTimeInMillis(Long.parseLong(startTime));
	long startTimeMilli = startCalendar.getTimeInMillis();

	// Sets calendar with end time.
	Calendar endCalendar = Calendar.getInstance(TimeZone.getTimeZone(timezone));
	endCalendar.setTimeInMillis(Long.parseLong(endTime));
	long endTimeMilli = endCalendar.getTimeInMillis();
	
	String current_timezone = DateUtil.getCurrentUserTimezoneOffset();
	long timezoneOffsetInMilliSecs = 0L;
	if (current_timezone != null)
	{
		timezoneOffsetInMilliSecs = Long.valueOf(current_timezone)*60*1000;
	}

	if (endTimeMilli < startTimeMilli)
	    return null;

	int i = 0;
	do
	{
	    // Get End Time by adding a day, week or month
		if(i == 0 && type == Calendar.MONTH)
		{
		//Get first month end date and set mid night time i.e 23:59:59
		startCalendar.set(Calendar.DAY_OF_MONTH, startCalendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		startCalendar.set(Calendar.HOUR_OF_DAY, startCalendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		startCalendar.set(Calendar.MINUTE, startCalendar.getActualMaximum(Calendar.MINUTE));
		startCalendar.set(Calendar.SECOND, startCalendar.getActualMaximum(Calendar.SECOND));
		startCalendar.setTimeInMillis(startCalendar.getTimeInMillis());
		}
		else if(type == Calendar.MONTH)
		{
		//Get month end date and set mid night time i.e 23:59:59
		startCalendar.set(Calendar.DAY_OF_MONTH, startCalendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		startCalendar.set(Calendar.HOUR_OF_DAY, startCalendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		startCalendar.set(Calendar.MINUTE, startCalendar.getActualMaximum(Calendar.MINUTE));
		startCalendar.set(Calendar.SECOND, startCalendar.getActualMaximum(Calendar.SECOND));
		startCalendar.setTimeInMillis(startCalendar.getTimeInMillis());
		}
		else
		{
		// Get End Time by adding a day or week and set mid night time i.e 23:59:59
		startCalendar.add(type, 1);
		/*startCalendar.setTimeInMillis(startCalendar.getTimeInMillis()-(24*60*60*1000));
		startCalendar.set(Calendar.HOUR_OF_DAY, startCalendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		startCalendar.set(Calendar.MINUTE, startCalendar.getActualMaximum(Calendar.MINUTE));
		startCalendar.set(Calendar.SECOND, startCalendar.getActualMaximum(Calendar.SECOND));
		startCalendar.setTimeInMillis(startCalendar.getTimeInMillis()+timezoneOffsetMilliSecs);*/
		startCalendar.setTimeInMillis(startCalendar.getTimeInMillis()-1000);
		}
		
		if(endTimeMilli < startCalendar.getTimeInMillis())
		{
		startCalendar.set(Calendar.DAY_OF_MONTH, endCalendar.get(Calendar.DAY_OF_MONTH));
		startCalendar.set(Calendar.HOUR_OF_DAY, endCalendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		startCalendar.set(Calendar.MINUTE, endCalendar.getActualMaximum(Calendar.MINUTE));
		startCalendar.set(Calendar.SECOND, endCalendar.getActualMaximum(Calendar.SECOND));
		startCalendar.setTimeInMillis(endCalendar.getTimeInMillis());
		}

	    // Get Tag Count for each tag
	    JSONObject tagsCount = new JSONObject();
	    for (String tag : tags)
	    {
		int count = getTagCount(contactFilter, tag, startTimeMilli + "", startCalendar.getTimeInMillis() + "");
		tagsCount.put(tag, count);
	    }

	    // Put time and tags array
	    tagsCountJSONObject.put((startTimeMilli + timezoneOffsetInMilliSecs) / 1000 + "", tagsCount);

	    startTimeMilli = startCalendar.getTimeInMillis()+1000;
	    startCalendar.setTimeInMillis(startCalendar.getTimeInMillis()+1000);
	    
	    i++;
	}
	while (startTimeMilli <= endTimeMilli);

	return tagsCountJSONObject;
    }

    /**
     * Returns the ratio of two tags count daily for a given filter from start
     * to end time
     * 
     * @param ContactFilter
     *            - the filter to be used. If null, it uses all contacts
     * @param tag1
     *            - tag1 to search for
     * @param tag2
     *            - tag2 to search for
     * 
     * @param startTime
     *            - start time of the range
     * @param end
     *            - end time of the range
     * 
     * @return an object in the format required by highcharts
     */
    public static JSONObject getRatioTagCount(ContactFilter contactFilter, String tag1, String tag2, String startTime, String endTime, int type)
	    throws Exception
    {
	JSONObject tagsCountJSONObject = new JSONObject();

	UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
	String timezone = "UTC";
	if (userPrefs != null && userPrefs.timezone != null)
	{
		timezone = userPrefs.timezone;
	}

	// Sets calendar with start time.
	Calendar startCalendar = Calendar.getInstance(TimeZone.getTimeZone(timezone));
	startCalendar.setTimeInMillis(Long.parseLong(startTime));
	long startTimeMilli = startCalendar.getTimeInMillis();

	// Sets calendar with end time.
	Calendar endCalendar = Calendar.getInstance(TimeZone.getTimeZone(timezone));
	endCalendar.setTimeInMillis(Long.parseLong(endTime));
	long endTimeMilli = endCalendar.getTimeInMillis();
	
	String current_timezone = DateUtil.getCurrentUserTimezoneOffset();
	long timezoneOffsetInMilliSecs = 0L;
	if (current_timezone != null)
	{
		timezoneOffsetInMilliSecs = Long.valueOf(current_timezone)*60*1000;
	}

	if (endTimeMilli < startTimeMilli)
	    return null;

	int i = 0;
	do
	{
	    // Get End Time by adding a day, week or month
		if(i == 0 && type == Calendar.MONTH)
		{
		//Get first month end date and set mid night time i.e 23:59:59
		startCalendar.set(Calendar.DAY_OF_MONTH, startCalendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		startCalendar.set(Calendar.HOUR_OF_DAY, startCalendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		startCalendar.set(Calendar.MINUTE, startCalendar.getActualMaximum(Calendar.MINUTE));
		startCalendar.set(Calendar.SECOND, startCalendar.getActualMaximum(Calendar.SECOND));
		startCalendar.setTimeInMillis(startCalendar.getTimeInMillis());
		}
		else if(type == Calendar.MONTH)
		{
		//Get month end date and set mid night time i.e 23:59:59
		startCalendar.set(Calendar.DAY_OF_MONTH, startCalendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		startCalendar.set(Calendar.HOUR_OF_DAY, startCalendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		startCalendar.set(Calendar.MINUTE, startCalendar.getActualMaximum(Calendar.MINUTE));
		startCalendar.set(Calendar.SECOND, startCalendar.getActualMaximum(Calendar.SECOND));
		startCalendar.setTimeInMillis(startCalendar.getTimeInMillis());
		}
		else
		{
		// Get End Time by adding a day or week and set mid night time i.e 23:59:59
		startCalendar.add(type, 1);
		startCalendar.setTimeInMillis(startCalendar.getTimeInMillis()-1000);
		}
		
		if(endTimeMilli < startCalendar.getTimeInMillis())
		{
		startCalendar.set(Calendar.DAY_OF_MONTH, endCalendar.get(Calendar.DAY_OF_MONTH));
		startCalendar.set(Calendar.HOUR_OF_DAY, endCalendar.getActualMaximum(Calendar.HOUR_OF_DAY));
		startCalendar.set(Calendar.MINUTE, endCalendar.getActualMaximum(Calendar.MINUTE));
		startCalendar.set(Calendar.SECOND, endCalendar.getActualMaximum(Calendar.SECOND));
		startCalendar.setTimeInMillis(endCalendar.getTimeInMillis());
		}

	    // Get Tag Count for each tag
	    JSONObject tagsCount = new JSONObject();

	    int tag1Count = getTagCount(contactFilter, tag1, startTimeMilli + "", startCalendar.getTimeInMillis() + "");
	    int tag2Count = getNextTagCount(contactFilter, tag1, startTimeMilli + "", startCalendar.getTimeInMillis() + "", tag2);


	    // Get Tag Ratio
	    float tagRatio = 0;
	    if (tag2Count != 0 && tag1Count != 0)
		tagRatio = ((float) tag2Count / tag1Count) * 100f;

	    Float tagRatio1 = round(tagRatio, 2);

	    tagsCount.put("Conversion", tagRatio1);
	    // Put time and tags array
	    tagsCountJSONObject.put((startTimeMilli + timezoneOffsetInMilliSecs) / 1000 + "", tagsCount);

	    startTimeMilli = startCalendar.getTimeInMillis()+1000;
	    startCalendar.setTimeInMillis(startCalendar.getTimeInMillis()+1000);
	    
	    i++;
	}
	while (startTimeMilli <= endTimeMilli);

	return tagsCountJSONObject;
    }

    /**
     * Returns the Cohorts data comparing tag1 and tag2 over the span of time
     * 
     * @param tag1
     *            - tag1 to search for
     * @param tag2
     *            - tag2 to be searched
     * 
     * @param startTime
     *            - start time of the range
     * @param end
     *            - end time of the range
     * 
     * @return {@link JSONObject}
     */
    public static JSONObject getCohortsMonthly(String tag1, String tag2, String startTime, String endTime) throws Exception
    {
	// Get the number of months
	int numMonths = (int) DateUtil.monthsBetween(endTime, startTime);

	System.out.println("Num months " + numMonths);

	// Get Cohorts Tag
	JSONObject cohortsJSONObject = new JSONObject();
	cohortsJSONObject.put("categories", new JSONArray());
	cohortsJSONObject.put("series", new JSONArray());

	// Get numMonths & numMonths Matrix
	for (int i = 0; i <= numMonths; i++)
	{
	    // Get the Start Calendar
	    Calendar startCalendar = Calendar.getInstance();
	    startCalendar.setTimeInMillis(Long.parseLong(startTime));

	    // Add i months to start off with
	    startCalendar.add(Calendar.MONTH, i);

	    // Get tag1 created Count for this month
	    Calendar endCalendar = (Calendar) startCalendar.clone();
	    endCalendar.add(Calendar.MONTH, 1);
	    int tag1Count = getTagCount(null, tag1, startCalendar.getTimeInMillis() + "", endCalendar.getTimeInMillis() + "");

	    cohortsJSONObject.getJSONArray("categories").put("Month " + i);

	    // Create a filter for users who have been created for the tag1 so
	    // that we can use in cohorts
	    ContactFilter contactFilter = new ContactFilter();
	    contactFilter.rules.add(getSearchRule(tag1, startCalendar.getTimeInMillis() + "", endCalendar.getTimeInMillis() + ""));

	    JSONObject monthCohortJSONObject = new JSONObject();
	    monthCohortJSONObject.put("name", new SimpleDateFormat("MMM ''yy").format(startCalendar.getTime()));
	    monthCohortJSONObject.put("data", new JSONArray());
	    monthCohortJSONObject.put("org", new JSONArray());

	    // Get for each month
	    for (int j = 0; j < numMonths; j++)
	    {
		// Get the total tag2 count created with this month for that
		// filter
		endCalendar = (Calendar) startCalendar.clone();
		endCalendar.add(Calendar.MONTH, (j + 1));

		System.out.println("Counting " + tag1 + " for " + new SimpleDateFormat("MMM ''yy").format(startCalendar.getTime()) + " vs "
			+ new SimpleDateFormat("MMM ''yy").format(endCalendar.getTime()));

		double numDifference = DateUtil.monthsBetween(endCalendar.getTimeInMillis() + "", Calendar.getInstance().getTimeInMillis() + "");

		// If the date is in future, we do not do anything
		if (numDifference > 1)
		{
		    System.out.println("Skipping");
		    break;
		}

		// Get Total Counts within start time to this endtime
		int tag2Count = getTagCount(contactFilter, tag2, startCalendar.getTimeInMillis() + "", endCalendar.getTimeInMillis() + "");

		monthCohortJSONObject.getJSONArray("data").put(percentage(tag1Count, tag2Count));
		monthCohortJSONObject.getJSONArray("org").put(tag1Count - tag2Count);

		// Add this to cohort chart
		// cohortsJSONObject = addToMonthlyCohort(cohortsJSONObject, (j
		// + 1), startCalendar, tag2Count);
	    }

	    cohortsJSONObject.getJSONArray("series").put(monthCohortJSONObject);
	}

	return cohortsJSONObject;
    }

    /**
     * Utility Function to Calculate Percentage
     * 
     * @param tag1
     *            - tag1 to search for
     * @param tag2
     *            - tag2 to be searched
     * */

    private static int percentage(int count1, int count2)
    {
	return (int) percentageF(count1, count2, 2);
    }

    /**
     * Round to certain number of decimals
     * 
     * @param d
     * @param decimalPlace
     * @return
     */
    private static float round(float d, int decimalPlace)
    {
	BigDecimal bd = new BigDecimal(Float.toString(d));
	bd = bd.setScale(decimalPlace, BigDecimal.ROUND_HALF_UP);
	return bd.floatValue();
    }

    /**
     * Find the percentage rounded to certain decimals
     * 
     * @param d
     * @param decimalPlace
     * @return
     */
    private static float percentageF(int count1, int count2, int decimalPlace)
    {
	if (count1 == 0 || count2 == 0)
	    return 0;

	float percentage = ((count1 - count2) * 100f / count1);
	return round(percentage, decimalPlace);
    }
    
    /**
     * Returns the next tag count for a given filter from main tag start to end time
     * 
     * @param ContactFilter
     *            - the filter to be used. If null, it uses all contacts
     * @param tag
     *            - main tag to search for
     * @param startTime
     *            - start time of the range
     * @param end
     *            - end time of the range
     * @param nextTag
     *            - next tag to search for
     *            
     * @return {@link Map}
     */
    public static int getNextTagCount(ContactFilter contactFilter, String tag, String startTime, String endTime, String nextTag)
    {

	// Create Contact Filter if not present
	if (contactFilter == null)
	{
	    contactFilter = new ContactFilter();
	}
	
	SearchRule searchRule1 = new SearchRule();
	searchRule1.LHS = "tags";
	searchRule1.CONDITION = SearchRule.RuleCondition.EQUALS;
	searchRule1.RHS = tag;
	
	contactFilter.rules.add(searchRule1);
	
	// Add the tag find rule
	contactFilter.rules.add(getSearchRule(tag, startTime, endTime));
	
	SearchRule searchRule = new SearchRule();
	searchRule.LHS = "tags_time";
	searchRule.CONDITION = SearchRule.RuleCondition.EQUALS;
	searchRule.RHS = nextTag;
	
	searchRule.RHS_NEW = null;
	searchRule.nested_condition = SearchRule.RuleCondition.AFTER;
	searchRule.nested_lhs = "1";
	searchRule.nested_rhs = "1";
	
	contactFilter.rules.add(searchRule);

	// Get Count
	try
	{
	    int count = contactFilter.queryContactsCount();
	    return count;
	}
	catch (Exception e)
	{
	}
	finally
	{
	    //contactFilter.rules.remove(contactFilter.rules.size() - 1);
	    System.out.println(contactFilter);
	}
	return 0;
    }
}