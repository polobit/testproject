package com.agilecrm.activities.deferred;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.activities.CreateTaskDeferredTask;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
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

    /**
     * Default constructor, assigns domain name
     * 
     * @param domain
     *            name as string
     */
    public TaskReminderDeferredTask(String domain, Long time)
    {
	this.domain = domain;
	this.time = time;
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
	    System.out.println("domain name in task reminder deferred task --------------------- " + domain);
	    // Get all domain users of that domain.
	    List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);

	    System.out.println("namespace in task reminder deferred task --------------------- "
		    + NamespaceManager.get());

	    if (domainUsers == null)
		return;

	    // Iterates over domain users to fetch due tasks of each user.
	    for (DomainUser domainUser : domainUsers)
	    {
		// Gets agileUser with respect to domain-user id to fetch
		// UserPrefs.
		AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);

		if (agileUser == null)
		    continue;

		UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);

		// if user did not set to receive due tasks email, proceed to
		// next user.
		if (!userPrefs.task_reminder)
		    continue;

		// Returns the due tasks of that day.

		List<Task> taskList = TaskUtil.getPendingTasksToRemind(1, domainUser.id);

		if (taskList.isEmpty())
		    continue;

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
			    "task reminder deferred task ", null, null, null);

		    TaskReminderDeferredTask taskDeferredTask = new TaskReminderDeferredTask(domain, time);
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

		    // Sends mail to the domain user.
		    SendMail.sendMail("maildummy800@gmail.com", SendMail.DUE_TASK_REMINDER_SUBJECT + " " + domain
			    + "after taskListMap", SendMail.DUE_TASK_REMINDER, map);

		    CreateTaskDeferredTask.createTaskReminderDeferredTask(domain, time, false);
		    return;
		}

		for (int i = 0; i < taskList.size(); ++i)
		{
		    Map<String, Object> currentTask = taskListMap.get(i);
		    List<Contact> contactList = taskList.get(i).getContacts();
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

		// Sends mail to the domain user.
		SendMail.sendMail("maildummy800@gmail.com", SendMail.DUE_TASK_REMINDER_SUBJECT + " " + domain,
		        SendMail.DUE_TASK_REMINDER, map);
	    }

	    CreateTaskDeferredTask.createTaskReminderDeferredTask(domain, time, false);

	}
	catch (TransientFailureException tfe)
	{
	    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		    "jagadeesh@invox.com", null, null, "transient exception at after sending mail" + domain, null,
		    "task reminder deferred task ", null, null, null);

	    TaskReminderDeferredTask taskDeferredTask = new TaskReminderDeferredTask(domain, time);
	    Queue queue = QueueFactory.getQueue("due-task-reminder");
	    TaskOptions options = TaskOptions.Builder.withPayload(taskDeferredTask);
	    options.countdownMillis(40000);
	    queue.add(options);
	    return;
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    try
	    {
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		String errorString = errors.toString();

		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		        "jagadeesh@invox.com", null, null, "check exception", null, errorString, null, null, null);
	    }
	    catch (Exception ex)
	    {
		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		        "jagadeesh@invox.com", null, null, "exception occured while sending mail " + domain, null,
		        "exception occured in send event reminder deferred task", null, null, null);

		ex.printStackTrace();
		System.err.println("Exception occured while sending campaign status mail " + e.getMessage());
	    }
	    finally
	    {
		try
		{
		    CreateTaskDeferredTask.createTaskReminderDeferredTask(domain, time, false);
		    return;
		}
		catch (IOException e1)
		{
		    // TODO Auto-generated catch block
		    e1.printStackTrace();
		}

	    }

	}
    }
}
