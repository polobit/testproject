package com.campaignio.tasklets.agile;

import java.util.ArrayList;
import java.util.Date;

import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Status;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.contact.util.ContactUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>AddTask</code> represents AddTask node to add task related to
 * subscriber. Tasks are like to-dos. Result oriented. User can assign a
 * category such as call, email etc.
 * 
 * @author Naresh
 * 
 */
public class AddTask extends TaskletAdapter
{
    /**
     * Subject of Task
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
     * Other
     */
    public static String OTHER = "OTHER";

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

    /**
     * Selected DomainUser Id.
     */
    public static String OWNER_ID = "owner_id";

    public static String PROGRESS = "progress";

    public static String DESCRIPTION = "description";

    public static String STATUS = "status";

    public static String YET_TO_START = "YET_TO_START";

    public static String IN_PROGRESS = "IN_PROGRESS";

    public static String COMPLETED = "COMPLETED";

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	// Get Task Values
	String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);
	String category = getStringValue(nodeJSON, subscriberJSON, data, CATEGORY);
	String priority = getStringValue(nodeJSON, subscriberJSON, data, PRIORITY);
	String dueDays = getStringValue(nodeJSON, subscriberJSON, data, DUE_DAYS);
	String givenOwnerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

	int progress = Integer.parseInt(getStringValue(nodeJSON, subscriberJSON, data, PROGRESS));
	String description = getStringValue(nodeJSON, subscriberJSON, data, DESCRIPTION);
	String status = getStringValue(nodeJSON, subscriberJSON, data, STATUS);

	// Gets due date in epoch from dueDays
	Long epochTime = AgileTaskletUtil.getDateInEpoch(dueDays);

	// Contact Id
	String contactId = AgileTaskletUtil.getId(subscriberJSON);

	try
	{
	    // Contact ownerId.
	    Long contactOwnerId = ContactUtil.getContactOwnerId(Long.parseLong(contactId));

	    if (contactOwnerId == null)
	    {
		System.out.println("No owner");

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		return;
	    }

	    // Adds task
	    addTask(subject, category, priority, epochTime, contactId, givenOwnerId, contactOwnerId.toString(),
		    progress, description, status);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while creating Task.");
	}

	// Creates log for AddTask
	LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Task: "
		+ subject + "<br/> Category: " + category + "<br/> Type: " + priority + " <br/> Date: "
		+ new Date(epochTime * 1000), LogType.ADD_TASK.toString());

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }

    /**
     * Adds task to subscribed contact.
     * 
     * @param subject
     *            - Name of the Task.
     * @param category
     *            - Call, Email, Meeting etc.
     * @param priority
     *            - High, Low and Medium.
     * @param dueDateInEpoch
     *            - Epoch time of given due duration.
     * @param contactId
     *            - Contact Id.
     * @param givenOwnerId
     *            - Selected owner-id.
     * @param contactOwnerId
     *            - Contact owner-id.
     */
    private void addTask(String subject, String category, String priority, Long dueDateInEpoch, String contactId,
	    String givenOwnerId, String contactOwnerId, int progress, String description, String status)
    {
	Task task = new Task(Type.valueOf(category), dueDateInEpoch, progress, description, Status.valueOf(status));

	// Intialize task contacts with contact id
	task.contacts = new ArrayList<String>();
	task.contacts.add(contactId);

	// Initialize task priority and subject values
	task.priority_type = PriorityType.valueOf(priority);
	task.subject = subject;

	// If contact_owner, then owner is contact owner
	if (givenOwnerId.equals("contact_owner"))
	    task.owner_id = contactOwnerId;
	else
	    task.owner_id = givenOwnerId;

	// Save Task
	task.save();
    }
}