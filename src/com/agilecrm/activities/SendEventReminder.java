package com.agilecrm.activities;

import java.io.IOException;

import com.agilecrm.activities.deferred.SendEventReminderDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class SendEventReminder
{

    public static void sendEventReminders(String domain, String useremail, String username, String eventname,
	    String priority, Long starttime, Long endtime) throws IOException
    {

	System.out.println(starttime);
	System.out.println("start time of event----------------- " + ((starttime - 600) * 1000));
	// Get Namespaces / domains

	SendEventReminderDeferredTask sendEventReminder = new SendEventReminderDeferredTask(domain, useremail,
	        username, eventname, priority, starttime, endtime);
	Queue queue = QueueFactory.getQueue("event-reminder");
	TaskOptions options = TaskOptions.Builder.withPayload(sendEventReminder);
	options.etaMillis((starttime - 600) * 1000);
	queue.add(options);

    }
}
