package com.campaignio.tasklets.agile;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.util.DBUtil;
import com.agilecrm.util.TaskUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

/**
 * Tasks are to-do items.Result oriented.One can assign category like call,email
 * etc to tasks.
 * 
 * @author Naresh
 * 
 */
public class Tasks extends TaskletAdapter
{
    // Fields of Tasks node

    public static String DUE_DAYS = "due_days";

    // Branches - Yes/No
    public static String BRANCH_YES = "Yes";
    public static String BRANCH_NO = "No";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Task Values

	String dueDays = getStringValue(nodeJSON, subscriberJSON, data,
		DUE_DAYS);

	System.out.println("Number of Due Days" + dueDays);

	// Get Contact Id and Contact
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = Contact.getContact(Long.parseLong(contactId));

	if (contact != null)
	{
	    try
	    {
		List<Task> dueTasks = TaskUtil.getPendingTasks(Integer
			.parseInt(dueDays));

		log(campaignJSON, subscriberJSON, "Due Tasks : " + dueTasks
			+ " with Due Days : " + dueDays);

		if (dueTasks != null)
		    // Execute Next One in Loop
		    TaskletManager.executeTasklet(campaignJSON, subscriberJSON,
			    data, nodeJSON, BRANCH_YES);
		if (dueTasks == null)
		    // Execute Next One in Loop
		    TaskletManager.executeTasklet(campaignJSON, subscriberJSON,
			    data, nodeJSON, BRANCH_NO);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}

    }
}
