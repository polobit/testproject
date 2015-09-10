package com.campaignio.tasklets.agile;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Condition</code> represents Condition node in a workflow. It checks for
 * a condition in a workflow. It checks for values and strings. For values it
 * compare numbers and for strings, their length is compared. If matches the
 * condition, node following Branch Yes executes, otherwise the other node.
 * 
 * @author Manohar
 * 
 */
public class Condition extends TaskletAdapter
{
	/**
	 * If type - value or string length
	 */
	public static String IF_TYPE = "if_type";

	/**
	 * Value - to compare numbers
	 */
	public static String IF_TYPE_VALUE = "value";

	/**
	 * strlen - to compare strings length
	 */
	public static String IF_TYPE_STRLEN = "strlen";

	/**
	 * Comparator
	 */
	public static String COMPARATOR = "comparator";

	/**
	 * Compares for less than
	 */
	public static String COMPARATOR_LESS_THAN = "less_than";

	/**
	 * Compares for greater than
	 */
	public static String COMPARATOR_GREATER_THAN = "greater_than";

	/**
	 * Compares for less than or equals to
	 */
	public static String COMPARATOR_LESS_THAN_OR_EQUAL_TO = "less_than_or_equals";

	/**
	 * Compares for greater than or equals to
	 */
	public static String COMPARATOR_GREATER_THAN_OR_EQUAL_TO = "greater_than_or_equals";

	/**
	 * Compares for not equals to
	 * 
	 */
	public static String COMPARATOR_NOT_EQUAL_TO = "not_equal_to";

	/**
	 * Compares for equal to
	 */
	public static String COMPARATOR_EQUAL_TO = "equal_to";

	/**
	 * Compares for substring
	 */
	public static String COMPARATOR_CONTAINS = "contains";

	/**
	 * Variable 1
	 */
	public static String VARIABLE_1 = "variable_1";

	/**
	 * Variable 2
	 */
	public static String VARIABLE_2 = "variable_2";

	/**
	 * Branch Yes
	 */
	public static String BRANCH_YES = "Yes";

	/**
	 * Branch No
	 */
	public static String BRANCH_NO = "No";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		// Get Variables
		String variable1 = getStringValue(nodeJSON, subscriberJSON, data, VARIABLE_1);
		String variable2 = getStringValue(nodeJSON, subscriberJSON, data, VARIABLE_2);
		
		String branch = BRANCH_NO;
		
		try
		{

			// Trim the variables-omitting whitespaces
			if (variable1 != null)
				variable1 = variable1.trim();
			if (variable2 != null)
				variable2 = variable2.trim();

			// If Type
			String ifType = getStringValue(nodeJSON, subscriberJSON, data, IF_TYPE);
			if (ifType.equalsIgnoreCase(IF_TYPE_STRLEN))
				variable1 = variable1.length() + "";

			

			String comparator = getStringValue(nodeJSON, subscriberJSON, data, COMPARATOR);

			System.out.println("Variable 1: " + variable1 + " " + variable2 + " " + comparator);

			// Do the required operation. If matches send to yes
			if (comparator.equalsIgnoreCase(COMPARATOR_LESS_THAN))
			{

				if (variable1.contains("/") && variable2.contains("/"))
				{
					if (compareDateValues(variable1, variable2) < 0)
					{
						branch = BRANCH_YES;
					}
				}
				else
				{
					// Convert the string into Integer and check
					if (Long.parseLong(variable1) < Long.parseLong(variable2))
						branch = BRANCH_YES;
				}
			}

			if (comparator.equalsIgnoreCase(COMPARATOR_LESS_THAN_OR_EQUAL_TO))
			{

				if (variable1.contains("/") && variable2.contains("/"))
				{
					if (compareDateValues(variable1, variable2) <= 0)
					{
						branch = BRANCH_YES;
					}
				}
				else
				{
					// Convert the string into Integer and check
					if (Long.parseLong(variable1) <= Long.parseLong(variable2))
						branch = BRANCH_YES;
				}
			}

			if (comparator.equalsIgnoreCase(COMPARATOR_GREATER_THAN))
			{
				if (variable1.contains("/") && variable2.contains("/"))
				{
					if (compareDateValues(variable1, variable2) > 0)
					{
						branch = BRANCH_YES;
					}
				}
				else
				{

					if (Long.parseLong(variable1) > Long.parseLong(variable2))
						branch = BRANCH_YES;
				}
			}

			if (comparator.equalsIgnoreCase(COMPARATOR_GREATER_THAN_OR_EQUAL_TO))
			{
				if (variable1.contains("/") && variable2.contains("/"))
				{
					if (compareDateValues(variable1, variable2) >= 0)
					{
						branch = BRANCH_YES;
					}
				}
				else
				{
					if (Long.parseLong(variable1) >= Long.parseLong(variable2))
						branch = BRANCH_YES;
				}
			}

			if (comparator.equalsIgnoreCase(COMPARATOR_NOT_EQUAL_TO))
			{
				if (!variable1.equalsIgnoreCase(variable2))
					branch = BRANCH_YES;
			}

			if (comparator.equalsIgnoreCase(COMPARATOR_EQUAL_TO))
			{
				if (variable1.equalsIgnoreCase(variable2))
					branch = BRANCH_YES;
			}

			if (comparator.equalsIgnoreCase(COMPARATOR_CONTAINS))
			{
				if (variable1.toLowerCase().contains(variable2.toLowerCase()))
					branch = BRANCH_YES;
			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Exception occured while executing Condition node: " + e.getMessage());
		}
		
		// Go to next tasks
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, branch);
	}

	/**
	 * Compares Date values in fixed format.
	 * 
	 * @param sourceDate
	 *            - Value of existing date like Created Date of contact.
	 * @param targetDate
	 *            - Given date in condition node.
	 * @return Integer
	 */
	public static Integer compareDateValues(String sourceDate, String targetDate)
	{
		try
		{
			SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
			Date sd = sdf.parse(sourceDate);
			Date td = sdf.parse(targetDate);

			return sd.compareTo(td);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
}