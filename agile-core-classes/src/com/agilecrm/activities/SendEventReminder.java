package com.agilecrm.activities;

import java.io.IOException;

import com.agilecrm.activities.deferred.SendEventReminderDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class SendEventReminder
{

	public static void sendEventReminders(String domain, Long starttime, boolean nosamplevent) throws Exception
	{

		// Get Namespaces / domains
		
		System.out.println("executed sendEventReminder "+domain+" starttime  "+starttime+" sample event  "+nosamplevent);

		SendEventReminderDeferredTask sendEventReminder = new SendEventReminderDeferredTask(domain, starttime,
				nosamplevent);
		Queue queue = QueueFactory.getQueue("event-notifier");
		TaskOptions options = TaskOptions.Builder.withPayload(sendEventReminder);
		options.etaMillis((starttime - 600) * 1000);
		queue.add(options);

	}
}
