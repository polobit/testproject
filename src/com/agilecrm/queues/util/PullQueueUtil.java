package com.agilecrm.queues.util;

import java.util.List;
import java.util.concurrent.TimeUnit;

import com.agilecrm.Globals;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.LeaseOptions;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
import com.google.appengine.api.taskqueue.TransientFailureException;
import com.google.apphosting.api.ApiProxy.ApiDeadlineExceededException;

/**
 * <code>PullQueueUtil</code> is the utility class for appengine pull queue
 * functionality.
 * 
 * @author Naresh
 * 
 */
public class PullQueueUtil
{

    /**
     * Adds deffered tasks to pull queue based on tag
     * 
     * @param queueName
     *            - pull queue name
     * @param deferredTask
     *            - deffered task
     * @param tag
     *            - tag to group deferred tasks while leasing
     */
    public static void addToPullQueue(String queueName, DeferredTask deferredTask, String tag)
    {
	Queue queue = QueueFactory.getQueue(queueName);
	queue.addAsync(TaskOptions.Builder.withMethod(TaskOptions.Method.PULL).payload(deferredTask).tag(tag));
    }

    /**
     * Leases limit number of tasks from pull-queue for given lease period
     * 
     * @return List<TaskHandle>
     */
    public static List<TaskHandle> leaseTasksFromQueue(String queueName, int leasePeriod, int countLimit) throws Exception
    {
	try
	{
	    // Get tasks
	    Queue q = QueueFactory.getQueue(queueName);

	    return q.leaseTasks(LeaseOptions.Builder.withLeasePeriod(leasePeriod, TimeUnit.SECONDS).countLimit(countLimit).groupByTag());
	}
	catch (TransientFailureException e)
	{
	    e.printStackTrace();
	    System.err.println("TransientFailureException occured " + e.getMessage());
	}
	catch (ApiDeadlineExceededException e)
	{
	    e.printStackTrace();
	    System.err.println("ApiDeadlineExceededException occured " + e.getMessage());
	}

	return null;

    }

    /**
     * Process tasks of pull queue in backend instance
     * 
     * @param backendUrl
     *            - backend pull servlet url
     * @param queueName
     *            - pull queue
     */
    public static void processTasksInBackend(String backendUrl, String queueName)
    {
	String url = BackendServiceFactory.getBackendService().getBackendAddress(Globals.BULK_ACTION_BACKENDS_URL);

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue("bulk-actions-queue");
	TaskOptions taskOptions = TaskOptions.Builder.withUrl(backendUrl).param("queue_name", queueName).header("Host", url).method(Method.POST);
	queue.addAsync(taskOptions);
    }

    /**
     * Delete tasks of a queue
     * 
     * @param queue
     *            - queue name
     * @param tasks
     *            - tasks to delete
     */
    public static void deleteTasks(String queue, List<TaskHandle> tasks)
    {
	if (tasks == null || tasks.isEmpty())
	    return;

	// Delete Tasks
	Queue q = QueueFactory.getQueue(queue);
	q.deleteTask(tasks);
    }

}
