package com.agilecrm.queues.util;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.google.appengine.api.NamespaceManager;
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
	TaskOptions taskOptions = TaskOptions.Builder.withMethod(TaskOptions.Method.PULL).payload(deferredTask);

	// To group by tag
	if (StringUtils.isNotBlank(tag))
	    taskOptions = taskOptions.tag(tag);

	String namespace = NamespaceManager.get();
	if (StringUtils.equals(namespace, "local"))
	{
	    Queue queueDummy = QueueFactory.getQueue("dummy-pull-queue");
	    TaskOptions taskOptionsDummy = TaskOptions.Builder.withMethod(TaskOptions.Method.PULL)
		    .payload(deferredTask);
	    queueDummy.addAsync(taskOptionsDummy);
	}

	queue.addAsync(taskOptions);
    }

    /**
     * Leases limit number of tasks from pull-queue for given lease period
     * 
     * @return List<TaskHandle>
     */
    public static List<TaskHandle> leaseTasksFromQueue(String queueName, int leasePeriod, int countLimit)
    {
	try
	{
	    System.out.println("leasing tasks info : " + queueName + " : " + leasePeriod + " : " + countLimit);

	    // Get tasks
	    Queue q = QueueFactory.getQueue(queueName);

	    List<TaskHandle> taskHandles = q.leaseTasks(LeaseOptions.Builder
		    .withLeasePeriod(leasePeriod, TimeUnit.SECONDS).countLimit(countLimit).groupByTag());

	    System.out.println("task handles leased: " + taskHandles == null ? null : taskHandles.size());
	    return taskHandles;

	}
	catch (TransientFailureException e)
	{
	    e.printStackTrace();
	    System.err.println("TransientFailureException occured when leasing tasks from " + queueName
		    + " and exception message is " + e.getMessage());
	}
	catch (ApiDeadlineExceededException e)
	{
	    e.printStackTrace();
	    System.err.println("ApiDeadlineExceededException occured when leasing tasks from " + queueName
		    + " and exception message is " + e.getMessage());
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
	System.out.println("Sending request to backend with URL " + backendUrl + " with queue name : " + queueName
		+ ", Starts at :" + System.currentTimeMillis());

	try
	{
	    // Create Task and push it into Task Queue
	    String currentQueueName = getCampaignQueueName(queueName);
	    Queue queue = QueueFactory.getQueue(currentQueueName);
	    TaskOptions taskOptions = TaskOptions.Builder.withUrl(backendUrl).param("queue_name", queueName)
		    .method(Method.POST);
	    queue.addAsync(taskOptions);
	}
	catch (Exception e)
	{
	    System.out.println("exception in sending request to backend ");
	    e.printStackTrace();
	}

    }

    /**
     * Returns campaign backend instance
     * 
     * @param queueName
     * @return
     */
    public static String getCampaignQueueName(String queueName)
    {
	// Runs BULK_PULL_QUEUE tasks in bulk backend
	if (StringUtils.equals(queueName, AgileQueues.BULK_CAMPAIGN_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.BULK_EMAIL_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.BULK_SMS_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.BULK_PERSONAL_EMAIL_PULL_QUEUE))
	    return AgileQueues.BULK_CAMPAIGN_QUEUE;

	// Runs NORMAL_PULL_QUEUE tasks in normal backend
	if (StringUtils.equals(queueName, AgileQueues.NORMAL_CAMPAIGN_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.NORMAL_EMAIL_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.NORMAL_SMS_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.NORMAL_PERSONAL_EMAIL_PULL_QUEUE))
	    return AgileQueues.NORMAL_CAMPAIGN_QUEUE;

	return AgileQueues.CAMPAIGN_QUEUE;

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
