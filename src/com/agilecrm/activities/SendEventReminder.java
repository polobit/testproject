package com.agilecrm.activities;

import java.io.IOException;

import com.agilecrm.activities.deferred.SendEventReminderDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class SendEventReminder
{

    public static void sendEventReminders(String domain, Long starttime, boolean nosamplevent) throws IOException
    {

	System.out.println(starttime);
	System.out.println("start time of event----------------- " + ((starttime - 600) * 1000));
	// Get Namespaces / domains

	SendEventReminderDeferredTask sendEventReminder = new SendEventReminderDeferredTask(domain, starttime,
	        nosamplevent);
	Queue queue = QueueFactory.getQueue("event-reminder-queue");
	TaskOptions options = TaskOptions.Builder.withPayload(sendEventReminder);
	options.etaMillis(System.currentTimeMillis() + 1000);
	queue.add(options);

    }
}
