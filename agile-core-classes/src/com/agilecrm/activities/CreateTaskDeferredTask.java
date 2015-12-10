package com.agilecrm.activities;

import java.io.IOException;

import com.agilecrm.activities.deferred.ExcecuteTaskDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>CreateTaskDeferredTask</code> is a class ,sets name space and initiates
 * diferred task <code>createTaskReminderDeferredTask</code> is called from
 * TaskReminderServlet and RegisterServlet to instantiate deamon in newly
 * created domain
 * 
 * @author jagadeesh
 *
 */
public class CreateTaskDeferredTask
{
    public static void createTaskReminderDeferredTask(String domain) throws IOException
    {

	ExcecuteTaskDeferredTask task_reminder = new ExcecuteTaskDeferredTask(domain);
	Queue queue = QueueFactory.getQueue("due-task-reminder");
	TaskOptions options = TaskOptions.Builder.withPayload(task_reminder);
	queue.add(options);

    }
}
