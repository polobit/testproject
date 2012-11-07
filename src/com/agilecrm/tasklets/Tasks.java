package com.agilecrm.tasklets;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.PriorityType;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.contact.Contact;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class Tasks extends TaskletAdapter
	{
	    // Fields
	    public static String TASK_NAME = "task_name";
	    
	    public static String CATEGORY = "category";
	    public static String CALL = "CALL";
	    public static String EMAIL = "EMAIL";
	    public static String FOLLOW_UP = "FOLLOW_UP";
	    public static String MEETING = "MEETING";
	    public static String MILESTONE = "MILESTONE";
	    public static String SEND = "SEND";
	    public static String TWEET = "TWEET";
	    
	    public static String PRIORITY = "priority";
	    public static String HIGH = "HIGH";
	    public static String NORMAL = "NORMAL";
	    public static String LOW = "LOW";
	    
	    public static String DUE_DATE = "due_date";

	    // Run
	    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
		    JSONObject data, JSONObject nodeJSON) throws Exception
	    {

		// Get  Task Values 
		String taskName = getStringValue(nodeJSON, subscriberJSON, data, TASK_NAME);
		String category = getStringValue(nodeJSON, subscriberJSON, data,
			CATEGORY);
		String priority = getStringValue(nodeJSON, subscriberJSON, data,
				PRIORITY);
		String dueDate = getStringValue(nodeJSON, subscriberJSON, data,
				DUE_DATE);
		
		System.out.println("Date before converting" + dueDate);
		
		// Converting Date String to epoch
		SimpleDateFormat simpledateformat  = new SimpleDateFormat("yyyy-MM-dd");
		Date date = simpledateformat.parse(dueDate);
		Long dueDateInEpoch = (date.getTime())/1000; 

		System.out
			.println("Given Task Name " + taskName + ",category: " + category + ",priority:" + priority +
					 "and Due Date" + dueDateInEpoch);

		// Get Contact Id and Contact
		String contactId = DBUtil.getId(subscriberJSON);
		Contact contact = Contact.getContact(Long.parseLong(contactId));
     
		if (contact != null)
		{
		    Task task = null;
		    AgileUser agileuser = null;
		    try
		    {
		    // Get Current AgileUser
		    agileuser = agileuser.getCurrentAgileUser();
		    task = new Task(Type.valueOf(category),dueDateInEpoch,agileuser.id);
		    
		   //  Intialize task contacts with contact id
		   task.contacts = new ArrayList<String>();
		   task.contacts.add(contactId);
		   
		   // Initialize task priority and subject values
		   task.priority_type = PriorityType.valueOf(priority);
		   task.subject = taskName;
		   
		   // Save Task
		   task.save();
		}
		    catch(Exception e)
		    {
		    	e.printStackTrace();
		    }
		    
		}
		// Execute Next One in Loop
		TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
			nodeJSON, null);
	    }
	}


