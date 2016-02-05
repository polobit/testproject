package com.campaignio.tasklets.agile;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;

import org.apache.commons.lang.StringEscapeUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Condition</code> represents Condition node in a workflow. It checks for
 * a condition in a workflow. It checks for values and strings. For values it
 * compare numbers and for strings, their length is compared. If matches the
 * condition, node following Branch Yes executes, otherwise the other node.
 * 
 * @author Dharmateja
 * 
 */
public class NewCondition extends TaskletAdapter
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
	
	/**
     * Parameters given in and grid as key-value pairs
     */
    public static String AND_PARAMETERS = "and_key_grid";
    
    /**
     * Parameters given in or grid as key-value pairs
     */
    public static String OR_PARAMETERS = "or_key_grid";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		
		String andHttpParams = "";
		boolean flag1 = true;
		boolean flag2 = false;

		try
		{
			// Parameters
			String andParamsJSONArrayString = getStringValue(nodeJSON, subscriberJSON, data, AND_PARAMETERS);

			JSONArray andParamsJSONArray = new JSONArray(andParamsJSONArrayString);
			
		    // Iterate through json array having key-value pairs
		    for (int i = 0; i < andParamsJSONArray.length(); i++)
		    {
			JSONObject andParamJSON = andParamsJSONArray.getJSONObject(i);

			String ifType = andParamJSON.getString("and_if_type");
			//String conditionMerge = andParamJSON.getString("and_condition_merge");
			String variable1 = andParamJSON.getString("and_variable_1");
			String comparator = andParamJSON.getString("and_comparator");
			String variable2 = andParamJSON.getString("and_variable_2");
			flag1 = flag1 & evaluateExpression(variable1, variable2, ifType,comparator);
		    }
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    data.put("error", e.getMessage());

		    
		}
		
				String orHttpParams = "";
				try
				{
					// Parameters
					String orParamsJSONArrayString = getStringValue(nodeJSON, subscriberJSON, data, OR_PARAMETERS);

					JSONArray orParamsJSONArray = new JSONArray(orParamsJSONArrayString);
					
					if (orParamsJSONArray.length() == 0){
						flag2 = true;
					}
					
				    // Iterate through json array having key-value pairs
				    for (int i = 0; i < orParamsJSONArray.length(); i++)
				    {
					JSONObject orParamJSON = orParamsJSONArray.getJSONObject(i);

					String ifType = orParamJSON.getString("or_if_type");
					//String conditionMerge = orParamJSON.getString("or_condition_merge");
					String variable1 = orParamJSON.getString("or_variable_1");
					String comparator = orParamJSON.getString("or_comparator");
					String variable2 = orParamJSON.getString("or_variable_2");
					flag2 = flag2 | evaluateExpression(variable1, variable2, ifType,comparator);
				    }
				}
				catch (Exception e)
				{
				    e.printStackTrace();
				    data.put("error", e.getMessage());

				    
				}
				String branch = "";
				if(flag1 && flag2 ){
					branch = BRANCH_YES;
				}else{
					branch = BRANCH_NO;
				}
	
		// Go to next tasks
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, branch);
	}
	
	public boolean evaluateExpression(String variable1, String variable2, String ifType,String comparator){
		// Get Variables
				
				boolean branch = false;
				
				try
				{

					// Trim the variables-omitting whitespaces
					if (variable1 != null)
						variable1 = variable1.trim();
					if (variable2 != null)
						variable2 = variable2.trim();

					if (ifType.equalsIgnoreCase(IF_TYPE_STRLEN))
						variable1 = variable1.length() + "";

					System.out.println("Variable 1: " + variable1 + " " + variable2 + " " + comparator);

					// Do the required operation. If matches send to yes
					if (comparator.equalsIgnoreCase(COMPARATOR_LESS_THAN))
					{

						if (variable1.contains("/") && variable2.contains("/"))
						{
							if (compareDateValues(variable1, variable2) < 0)
							{
								branch = true;
							}
						}
						else
						{
							// Convert the string into Integer and check
							if (Long.parseLong(variable1) < Long.parseLong(variable2))
								branch = true;
						}
					}

					if (comparator.equalsIgnoreCase(COMPARATOR_LESS_THAN_OR_EQUAL_TO))
					{

						if (variable1.contains("/") && variable2.contains("/"))
						{
							if (compareDateValues(variable1, variable2) <= 0)
							{
								branch = true;
							}
						}
						else
						{
							// Convert the string into Integer and check
							if (Long.parseLong(variable1) <= Long.parseLong(variable2))
								branch = true;
						}
					}

					if (comparator.equalsIgnoreCase(COMPARATOR_GREATER_THAN))
					{
						if (variable1.contains("/") && variable2.contains("/"))
						{
							if (compareDateValues(variable1, variable2) > 0)
							{
								branch = true;
							}
						}
						else
						{

							if (Long.parseLong(variable1) > Long.parseLong(variable2))
								branch = true;
						}
					}

					if (comparator.equalsIgnoreCase(COMPARATOR_GREATER_THAN_OR_EQUAL_TO))
					{
						if (variable1.contains("/") && variable2.contains("/"))
						{
							if (compareDateValues(variable1, variable2) >= 0)
							{
								branch = true;
							}
						}
						else
						{
							if (Long.parseLong(variable1) >= Long.parseLong(variable2))
								branch = true;
						}
					}

					if (comparator.equalsIgnoreCase(COMPARATOR_NOT_EQUAL_TO))
					{
						if (!variable1.equalsIgnoreCase(variable2))
							branch = true;
					}

					if (comparator.equalsIgnoreCase(COMPARATOR_EQUAL_TO))
					{
						if (variable1.equalsIgnoreCase(variable2))
							branch = true;
					}

					if (comparator.equalsIgnoreCase(COMPARATOR_CONTAINS))
					{
						if (variable1.toLowerCase().contains(variable2.toLowerCase()))
							branch = true;
					}

				}
				catch (Exception e)
				{
					e.printStackTrace();
					System.out.println("Exception occured while executing Condition node: " + e.getMessage());
				}
				
				return branch;
				
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