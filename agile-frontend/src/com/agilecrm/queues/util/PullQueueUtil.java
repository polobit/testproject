package com.agilecrm.queues.util;

import java.util.List;
import java.util.concurrent.TimeUnit;

import com.agilecrm.AgileQueues;
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
    public static List<TaskHandle> leaseTasksFromQueue(String queueName, int leasePeriod, int countLimit)
    {
	try
	{
	    System.out.println("leasing tasks info : " + queueName + " : " + leasePeriod + " : " + countLimit);
	    
	    // Get tasks
	    Queue q = QueueFactory.getQueue(queueName);

	  List<TaskHandle> taskHandles =  q.leaseTasks(LeaseOptions.Builder.withLeasePeriod(leasePeriod, TimeUnit.SECONDS)
		    .countLimit(countLimit).groupByTag());
	  
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
	System.out.println("Sending request to backend with URL " + backendUrl + " with queue name : " + queueName + ", Starts at :" + System.currentTimeMillis());
	
	try
	{
	    // Create Task and push it into Task Queue
		Queue queue = QueueFactory.getQueue(AgileQueues.CAMPAIGN_QUEUE);
		TaskOptions taskOptions = TaskOptions.Builder.withUrl(backendUrl).param("queue_name", queueName)
		        .method(Method.POST);
		queue.addAsync(taskOptions);   
	}
	catch(Exception e)
	{
	    System.out.println("exception in sending request to backend ");
	    e.printStackTrace();
	}
	
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
