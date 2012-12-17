package com.campaignio.tasklets.agile;

import java.util.ArrayList;
import java.util.Calendar;

import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.DBUtil;
import com.agilecrm.util.Util;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>AddTask</code> represents AddTask node to add task related to
 * subscriber.Tasks are like to-dos. Result oriented. User can assign a category
 * such as call,email etc.
 * 
 * @author Manohar
 * 
 */

public class AddTask extends TaskletAdapter
{
    // Fields
    /**
     * Subject of Note
     */
    public static String SUBJECT = "subject";

    /**
     * Category Type
     */
    public static String CATEGORY = "category";
    /**
     * Call
     */
    public static String CALL = "CALL";
    /**
     * Email
     */
    public static String EMAIL = "EMAIL";
    /**
     * Follow
     */
    public static String FOLLOW_UP = "FOLLOW_UP";
    /**
     * Meeting
     */
    public static String MEETING = "MEETING";
    /**
     * Milestone
     */
    public static String MILESTONE = "MILESTONE";
    /**
     * Send
     */
    public static String SEND = "SEND";
    /**
     * Tweet
     */
    public static String TWEET = "TWEET";

    /**
     * Task priority type
     */
    public static String PRIORITY = "priority";
    /**
     * High priority
     */
    public static String HIGH = "HIGH";
    /**
     * Normal priority
     */
    public static String NORMAL = "NORMAL";
    /**
     * Low priority
     */
    public static String LOW = "LOW";

    /**
     * Number of Due days
     */
    public static String DUE_DAYS = "due_days";

    // Add task to Task object related to subscriber

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
	String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);
	String category = getStringValue(nodeJSON, subscriberJSON, data,
		CATEGORY);
	String priority = getStringValue(nodeJSON, subscriberJSON, data,
		PRIORITY);
	String dueDays = getStringValue(nodeJSON, subscriberJSON, data,
		DUE_DAYS);

	/*
	 * // Converting Date String to epoch SimpleDateFormat simpledateformat
	 * = new SimpleDateFormat("yyyy-MM-dd"); Date date =
	 * simpledateformat.parse(dueDays); Long dueDateInEpoch =
	 * (date.getTime()) / 1000;
	 */

	Calendar calendar = Calendar.getInstance();

	// System.out.println(calendar.getTimeInMillis() / 1000);

	// Add duration period to get relative date
	calendar.add(Calendar.DAY_OF_MONTH, Integer.parseInt(dueDays));
	Long dueDateInEpoch = calendar.getTimeInMillis() / 1000;

	System.out.println(Util.getCalendarString(dueDateInEpoch));

	System.out.println("Given Task Name: " + subject + ",category: "
		+ category + ",priority: " + priority + "and Due Date : "
		+ dueDateInEpoch);

	// Get Contact Id and Contact
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	Task task = null;
	AgileUser agileuser = null;

	if (contact != null)
	{

	    try
	    {
		// Get Current AgileUser
		agileuser = AgileUser.getCurrentAgileUser();

		if (agileuser == null)
		    return;

		task = new Task(Type.valueOf(category), dueDateInEpoch,
			agileuser.id);

		// Intialize task contacts with contact id
		task.contacts = new ArrayList<String>();
		task.contacts.add(contactId);

		// Initialize task priority and subject values
		task.priority_type = PriorityType.valueOf(priority);
		task.subject = subject;

		// Save Task
		task.save();

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		System.out.println("Exception occured while creating Task");
	    }

	}

	// Creates log for AddTask
	log(campaignJSON,
		subscriberJSON,
		"Task name : " + task.subject + "Task type : "
			+ task.entity_type + " Due Date : "
			+ Util.getCalendarString(dueDateInEpoch));

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}