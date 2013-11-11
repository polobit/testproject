package com.agilecrm.search.util;

import java.util.Map;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.search.ui.serialize.SearchRule;

/**
 * <code> TagSearchUtil </code> contains utility methods to search for tags with
 * a given time frame using Google Full Text Search
 * 
 */
public class TagSearchUtil
{
    /**
     * Normalizes all the contact properties and added to a map with key
     * normalized field name.
     * 
     * @param ContactFilter
     *            - if it has to be applied on a filter or it uses all contacts
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
	// Create Search Rule

	// [tags_time EQUALS Activist null BETWEEN 1383320887015 1384102087075]
	// return LHS + " " + CONDITION + " " + RHS + " " + RHS_NEW + " " +
	// nested_condition + " " + nested_lhs + " " + nested_rhs;

	SearchRule searchRule = new SearchRule();
	searchRule.LHS = "tags_time";
	searchRule.CONDITION = searchRule.CONDITION.EQUALS;
	searchRule.RHS = tag;

	searchRule.RHS_NEW = null;
	searchRule.nested_condition = searchRule.CONDITION.BETWEEN;
	searchRule.nested_lhs = startTime;
	searchRule.nested_rhs = endTime;

	// Create Contact Filter if not present
	if (contactFilter == null)
	{
	    contactFilter = new ContactFilter();
	}

	// Add the tag find rule
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
	return 0;
    }
}