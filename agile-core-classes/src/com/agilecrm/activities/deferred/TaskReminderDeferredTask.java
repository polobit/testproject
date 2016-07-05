package com.agilecrm.activities.deferred;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TransientFailureException;
import com.thirdparty.mandrill.Mandrill;

/**
 * <code>TaskReminderDeferredTask</code> implements google appengene's
 * DeferredTask interface and overrides it's run method to send daily reminder
 * (an email) about the pending tasks.
 * 
 * @author Jagadeesh
 * 
 */
@SuppressWarnings("serial")
public class TaskReminderDeferredTask implements DeferredTask
{

    /**
     * Stores name of the domain
     */
    String domain = null;
    Long time = null;
    String timezone = null;
    Long domainuserid = null;
    String user_email = null;

    /**
     * Default constructor, assigns domain name
     * 
     * @param domain
     *            name as string
     */
    public TaskReminderDeferredTask(String domain, Long time, Long domainuserid, String timezone, String email)
    {
	this.domain = domain;
	this.time = time;
	this.domainuserid = domainuserid;
	this.timezone = timezone;
	this.user_email = email;
    }

    /**
     * Fetches all the domain users within the domain and send email to those
     * users having due tasks of that day, if that user activates to receive
     * emails.
     * 
     **/
    public void run()
    {

	try
	{

	    // Gets agileUser with respect to domain-user id to fetch
	    // UserPrefs.
	    AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainuserid);

	    if (agileUser == null)
		return;

	    UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);

	    // if user did not set to receive due tasks email, proceed to
	    // next user.
	    if (!userPrefs.task_reminder)
		return;

	    // Returns the due tasks of that day.

	    List<Task> taskList = TaskUtil.getPendingTasksToRemind(1, domainuserid, timezone);

	    if (taskList.isEmpty())
		return;
	    

	    // Update time with timezone
	    for(Task task : taskList){
	    	if(task.due != null)
	    		task.timeFormatForEmail = DateUtil.getCalendarString(task.due * 1000, "hh:mm a", timezone);
	    	
	    	task.type = StringUtils.capitalize(StringUtils.lowerCase(task.type.toString()));
	        if(task.priority_type != null){
	        	task.priority_type_string = StringUtils.capitalize(StringUtils.lowerCase(task.priority_type.toString()));
	        }
	    }

	    // Task stored as map like
	    // map{"property":"value","property2":"value2",...}
	    List<Map<String, Object>> taskListMap = null;

	    try
	    {
		taskListMap = new ObjectMapper().readValue(new ObjectMapper().writeValueAsString(taskList),
		        new TypeReference<List<HashMap<String, Object>>>()
		        {
		        });
	    }
	    catch (TransientFailureException tfe)
	    {
		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		        "jagadeesh@invox.com", null, null, "transient exception  after taskListMap" + domain, null,
		        "task reminder deferred task ", null, null, null, null);

		TaskReminderDeferredTask taskDeferredTask = new TaskReminderDeferredTask(domain, time, domainuserid,
		        timezone, user_email);
		Queue queue = QueueFactory.getQueue("due-task-reminder");
		TaskOptions options = TaskOptions.Builder.withPayload(taskDeferredTask);
		options.countdownMillis(40000);
		queue.add(options);
		return;
	    }
	    catch (Exception e)
	    {
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("tasks", taskList);
		map.put("tasksCount", taskList.size());
		map.put("domain", domain);

		// Sends mail to the domain user.
		SendMail.sendMail(user_email, SendMail.DUE_TASK_REMINDER_SUBJECT, SendMail.DUE_TASK_REMINDER, map);

		return;
	    }

	    for (int i = 0; i < taskList.size(); ++i)
	    {
		Map<String, Object> currentTask = taskListMap.get(i);
		List<Contact> contactList = taskList.get(i).relatedContacts(); 
		List<Map<String, Object>> contactListMap = new ArrayList<Map<String, Object>>();

		// for each Contact add ContactField in ContactField.name
		// property.So like
		// {'FIRST_NAME':contactField1,'LAST_NAME':contactField2...}
		for (Contact contact : contactList)
		{
		    Map<String, Object> mapContact = new HashMap<String, Object>();

		    for (ContactField contactField : contact.properties)
			mapContact.put(contactField.name, contactField);

		    mapContact.put("id", String.valueOf(contact.id));
		  	mapContact.put("email_image", ContactUtil.getMD5EncodedImage(contact));	
				
		    // save id of this contact for href

		    contactListMap.add(mapContact);
		}

		// each task has related_contacts as
		// [<contact1-map:<contact1.contactField.name:contact1.contactField>,<contact2-map>...]
		currentTask.put("related_contacts", contactListMap);
		
	    }

	    // Due tasks map
	    HashMap<String, Object> map = new HashMap<String, Object>();
	    map.put("tasks", taskListMap);
	    map.put("tasksCount", taskList.size());
	    map.put("domain", domain);

	    // Sends mail to the domain user.
	    SendMail.sendMail(user_email, SendMail.DUE_TASK_REMINDER_SUBJECT, SendMail.DUE_TASK_REMINDER, map);

	}
	catch (TransientFailureException tfe)
	{
	    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		    "jagadeesh@invox.com", null, null, "transient exception at after sending mail" + domain, null,
		    "task reminder deferred task ", null, null, null, null);

	    TaskReminderDeferredTask taskDeferredTask = new TaskReminderDeferredTask(domain, time, domainuserid,
		    timezone, user_email);
	    Queue queue = QueueFactory.getQueue("due-task-reminder");
	    TaskOptions options = TaskOptions.Builder.withPayload(taskDeferredTask);
	    options.countdownMillis(40000);
	    queue.add(options);
	    return;
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    try
	    {
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		String errorString = errors.toString();

		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		        "jagadeesh@invox.com", null, null, "check exception", null, errorString, null, null, null, null);
	    }
	    catch (Exception ex)
	    {
		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		        "jagadeesh@invox.com", null, null, "exception occured while sending mail " + domain, null,
		        "exception occured in send event reminder deferred task", null, null, null, null);

		ex.printStackTrace();
		System.err.println("Exception occured while sending task reminder mail " + e.getMessage());
	    }

	}
    }
}
