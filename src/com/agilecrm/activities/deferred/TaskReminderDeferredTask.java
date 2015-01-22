package com.agilecrm.activities.deferred;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.TaskReminder;
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

/**
 * <code>TaskReminderDeferredTask</code> implements google appengene's
 * DeferredTask interface and overrides it's run method to send daily reminder
 * (an email) about the pending tasks.
 * 
 * @author Rammohan
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
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(domain);

	try
	{
	    // Get all domain users of that domain.
	    List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);

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
		catch (Exception e)
		{
		    HashMap<String, Object> map = new HashMap<String, Object>();
		    map.put("tasks", taskList);

		    // Sends mail to the domain user.
		    SendMail.sendMail(domainUser.email, SendMail.DUE_TASK_REMINDER_SUBJECT, SendMail.DUE_TASK_REMINDER,
			    map);
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
		SendMail.sendMail(domainUser.email, SendMail.DUE_TASK_REMINDER_SUBJECT, SendMail.DUE_TASK_REMINDER, map);
	    }

	    TaskReminder.sendDailyTaskReminders(domain, time, false);

	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
