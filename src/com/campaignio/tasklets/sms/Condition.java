package com.campaignio.tasklets.sms;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class Condition extends TaskletAdapter
{
    // Fields
    public static String IF_TYPE = "if_type";
    public static String IF_TYPE_VALUE = "value";
    public static String IF_TYPE_STRLEN = "strlen";

    // Comparator
    public static String COMPARATOR = "comparator";
    public static String COMPARATOR_LESS_THAN = "less_than";
    public static String COMPARATOR_GREATER_THAN = "greater_than";
    public static String COMPARATOR_LESS_THAN_OR_EQUAL_TO = "less_than_or_equals";
    public static String COMPARATOR_GREATER_THAN_OR_EQUAL_TO = "greater_than_or_equals";
    public static String COMPARATOR_NOT_EQUAL_TO = "not_equal_to";
    public static String COMPARATOR_EQUAL_TO = "equal_to";

    // Variable 1 and 2
    public static String VARIABLE_1 = "variable_1";
    public static String VARIABLE_2 = "variable_2";

    // Branches - Yes/No
    public static String BRANCH_YES = "Yes";
    public static String BRANCH_NO = "No";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Variables
	String variable1 = getStringValue(nodeJSON, subscriberJSON, data,
		VARIABLE_1);
	String variable2 = getStringValue(nodeJSON, subscriberJSON, data,
		VARIABLE_2);

	// Trim the variables
	if (variable1 != null)
	    variable1 = variable1.trim();
	if (variable2 != null)
	    variable2 = variable2.trim();

	// If Type
	String ifType = getStringValue(nodeJSON, subscriberJSON, data, IF_TYPE);
	if (ifType.equalsIgnoreCase(IF_TYPE_STRLEN))
	    variable1 = variable1.length() + "";

	String branch = BRANCH_NO;

	String comparator = getStringValue(nodeJSON, subscriberJSON, data,
		COMPARATOR);

	System.out.println("Variable 1: " + variable1 + " " + variable2 + " "
		+ comparator);

	try
	{
	    // Do the required operation. If matches send to yes
	    if (comparator.equalsIgnoreCase(COMPARATOR_LESS_THAN))
	    {
		// Convert the string into Integer and check
		if (Long.parseLong(variable1) < Long.parseLong(variable2))
		    branch = "yes";
	    }

	    if (comparator.equalsIgnoreCase(COMPARATOR_LESS_THAN_OR_EQUAL_TO))
	    {
		// Convert the string into Integer and check
		if (Long.parseLong(variable1) <= Long.parseLong(variable2))
		    branch = "yes";
	    }

	    if (comparator.equalsIgnoreCase(COMPARATOR_GREATER_THAN))
	    {
		if (Long.parseLong(variable1) > Long.parseLong(variable2))
		    branch = "yes";
	    }

	    if (comparator
		    .equalsIgnoreCase(COMPARATOR_GREATER_THAN_OR_EQUAL_TO))
	    {
		if (Long.parseLong(variable1) >= Long.parseLong(variable2))
		    branch = "yes";
	    }

	    if (comparator.equalsIgnoreCase(COMPARATOR_GREATER_THAN))
	    {
		if (Long.parseLong(variable1) > Long.parseLong(variable2))
		    branch = "yes";
	    }

	    if (comparator
		    .equalsIgnoreCase(COMPARATOR_GREATER_THAN_OR_EQUAL_TO))
	    {
		if (Long.parseLong(variable1) >= Long.parseLong(variable2))
		    branch = "yes";
	    }

	    if (comparator.equalsIgnoreCase(COMPARATOR_NOT_EQUAL_TO))
	    {
		if (!variable1.equalsIgnoreCase(variable2))
		    branch = "yes";
	    }

	    if (comparator.equalsIgnoreCase(COMPARATOR_EQUAL_TO))
	    {
		if (variable1.equalsIgnoreCase(variable2))
		    branch = "yes";
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// Go to next tasks
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, branch);

    }

}
