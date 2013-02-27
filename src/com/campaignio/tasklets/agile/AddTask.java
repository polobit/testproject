package com.campaignio.tasklets.agile;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>AddTask</code> represents AddTask node to add task related to
 * subscriber. Tasks are like to-dos. Result oriented. User can assign a
 * category such as call, email etc.
 * 
 * @author Manohar
 * 
 */
public class AddTask extends TaskletAdapter
{
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

	Calendar calendar = Calendar.getInstance();

	// Add duration period to get relative date
	calendar.add(Calendar.DAY_OF_MONTH, Integer.parseInt(dueDays));
	Long dueDateInEpoch = calendar.getTimeInMillis() / 1000;

	System.out.println("Given Task Name: " + subject + ",category: "
		+ category + ",priority: " + priority + " and Due Date : "
		+ dueDateInEpoch);

	// Get Contact Id and Contact
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	Task task = null;
	DomainUser domainOwner = null;

	if (contact != null)
	{
	    try
	    {
		String domain = NamespaceManager.get();

		// Get DomainUser who is account owner with respect to
		// domain
		domainOwner = DomainUserUtil.getDomainOwner(domain);

		if (domainOwner == null)
		{
		    // Execute Next One in Loop
		    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON,
			    data, nodeJSON, null);
		    return;
		}

		AgileUser agileuser = AgileUser
			.getCurrentAgileUserFromDomainUser(domainOwner.id);
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
	log(campaignJSON, subscriberJSON, "Task name : " + task.subject
		+ " Task type : " + task.entity_type + " Due Date : "
		+ new Date(dueDateInEpoch * 1000));

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}