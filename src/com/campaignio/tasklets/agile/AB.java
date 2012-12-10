package com.campaignio.tasklets.agile;

import java.util.Calendar;
import java.util.Random;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>AB</code> represents A/B node in a workflow.It can be used to test the
 * customers behaviour.Separate subscribers randomly based on frequency.It uses
 * random object and compare the value with the frequency.Based on comparison it
 * separates next tasklet execution using branches.Under exception it proceeds
 * with bracnch A.
 * 
 * @author Manohar
 * 
 */
public class AB extends TaskletAdapter
{
    // Fields of A/B node
    /**
     * Frequency value
     */
    public static String FREQUENCY = "frequency";

    // Branches - Yes/No
    /**
     * Represents Branch A of A/B node
     */
    public static String BRANCH_A = "A";

    /**
     * Represents Branch B of A/B node
     */
    public static String BRANCH_B = "B";

    // Run method to execute tasklets
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Gets frequency value using TaskletAdapter's getStringValue method
	String frequency = getStringValue(nodeJSON, subscriberJSON, data,
		FREQUENCY);

	try
	{
	    // Generate Random Number
	    Random random = new Random(Calendar.getInstance().getTimeInMillis());
	    double r = random.nextDouble();


	    // Creates log for A/B node
	    log(campaignJSON, subscriberJSON, "Random Number " + random
		    + " Requested:" + frequency);

	    // Go with A or B
	    if (r > Double.parseDouble(frequency))
	    {
		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON,
			data, nodeJSON, BRANCH_A);

	    }
	    else
	    {
		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON,
			data, nodeJSON, BRANCH_B);

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_A);
	}

	return;

    }
}
