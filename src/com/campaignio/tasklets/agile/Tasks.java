package com.campaignio.tasklets.agile;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Tasks</code> represents Tasks node in the workflow.Tasks class get the
 * tasks with respect to due days.
 * 
 * @author Naresh
 * 
 */
public class Tasks extends TaskletAdapter
{
    // Fields of Tasks node

    /**
     * Due Days
     */
    public static String DUE_DAYS = "due_days";

    // Branches - Yes/No
    /**
     * Branch Yes
     */
    public static String BRANCH_YES = "Yes";
    /**
     * Branch No
     */
    public static String BRANCH_NO = "No";

    // Run
    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Task Values

	String dueDays = getStringValue(nodeJSON, subscriberJSON, data,
		DUE_DAYS);

	System.out.println("Number of Due Days" + dueDays);

	// Get Contact Id and Contact
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

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
		    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON,
			    data, nodeJSON, BRANCH_YES);
		if (dueTasks == null)
		    // Execute Next One in Loop
		    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON,
			    data, nodeJSON, BRANCH_NO);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}

    }
}
