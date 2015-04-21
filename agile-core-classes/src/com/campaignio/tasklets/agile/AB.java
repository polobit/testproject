package com.campaignio.tasklets.agile;

import java.util.Random;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>AB</code> represents A/B node in a workflow. It can be used to test the
 * customers behaviour. Separate subscribers randomly based on frequency. It
 * uses random object and compare the value with the frequency. Based on
 * comparison it separates next tasklet execution using branches. Under
 * exception it proceeds with branch A.
 * 
 * @author Manohar
 * 
 */
public class AB extends TaskletAdapter
{
    /**
     * Frequency value
     */
    public static String FREQUENCY = "frequency";

    /**
     * Represents Branch A of A/B node
     */
    public static String BRANCH_A = "A";

    /**
     * Represents Branch B of A/B node
     */
    public static String BRANCH_B = "B";

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Gets frequency value using TaskletAdapter's getStringValue method
	String frequency = getStringValue(nodeJSON, subscriberJSON, data, FREQUENCY);

	try
	{
	    // Generate Random Number
	    Random random = new Random(System.nanoTime());
	    double r = random.nextDouble();

	    // Go with A or B
	    if (r < Double.parseDouble(frequency))
	    {
		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_A);
	    }
	    else
	    {
		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_B);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_A);
	}

	return;
    }
}