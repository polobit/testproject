package com.campaignio.tasklets.agile;

import java.util.Calendar;
import java.util.Random;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class AB extends TaskletAdapter
{
    // Fields
    public static String FREQUENCY = "frequency";

    // Branches - Yes/No
    public static String BRANCH_A = "A";
    public static String BRANCH_B = "B";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Frequency
	String frequency = getStringValue(nodeJSON, subscriberJSON, data,
		FREQUENCY);

	try
	{
	    // Generate Random Number
	    Random random = new Random(Calendar.getInstance().getTimeInMillis());
	    double r = random.nextDouble();

	    log(campaignJSON, subscriberJSON, "Random Number " + random
		    + " Requested:" + frequency);

	    // Go with A or B
	    if (r > Double.parseDouble(frequency))
	    {
		// Execute Next One in Loop
		TaskletManager.executeTasklet(campaignJSON, subscriberJSON,
			data, nodeJSON, BRANCH_A);

	    }
	    else
	    {
		// Execute Next One in Loop
		TaskletManager.executeTasklet(campaignJSON, subscriberJSON,
			data, nodeJSON, BRANCH_B);

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_A);
	}

	return;

    }
}
