package com.agilecrm.queues;

import java.io.UnsupportedEncodingException;
import java.util.List;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.queues.util.PullQueueUtil;
import com.google.appengine.api.LifecycleManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.InternalFailureException;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskHandle;

/**
 * <code>PullScheduler</code> leases pull tasks from pull-queue for certain
 * period and process them before deleting.
 * 
 * @author Naresh
 * 
 */
public class PullScheduler
{
    /**
     * Pull queue name
     */
    public String queueName = null;

    /**
     * Boolean flag to run tasks in backend or frontend
     */
    public boolean isCron = false;

    /**
     * Pull Queue attributes
     */
    public static int DEFAULT_LEASE_PERIOD = 900;
    public static int DEFAULT_COUNT_LIMIT = 200;

    /**
     * Period to lease tasks from pull queue
     */
    public int leasePeriod = 0;

    /**
     * Tasks count to lease at once
     */
    public int countLimit = 0;

    /**
     * Started time
     */
    public long startTime = 0L;

    /**
     * Constructs a new {@link PullScheduler}
     * 
     * @param queueName
     *            - pull queue name
     * @param isCron
     *            - flag to run tasks in frontend or backend
     */
    public PullScheduler(String queueName, boolean isCron)
    {
	this.queueName = queueName;
	this.isCron = isCron;

	leasePeriod = getLeasePeriod(queueName);
	countLimit = isCron ? 50 : getCountLimit(queueName);

	startTime = System.currentTimeMillis();

	System.out.print("queueName" + queueName + ", isCron" + isCron + " lease" + getLeasePeriod(queueName)
		+ " count" + getCountLimit(queueName));
    }

    /**
     * Returns lease period based on queue
     * 
     * @param queueName
     *            - pull queue
     * @return int
     */
    public int getLeasePeriod(String queueName)
    {
	// Campaigns need more lease period (in secs)
	if (StringUtils.equals(queueName, AgileQueues.BULK_CAMPAIGN_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.NORMAL_CAMPAIGN_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.NORMAL_SMS_PULL_QUEUE)
		|| StringUtils.equals(queueName, AgileQueues.BULK_SMS_PULL_QUEUE))
	    return 900;

	return DEFAULT_LEASE_PERIOD;
    }

    /**
     * Returns count limit based on queue
     * 
     * @param queueName
     *            - pull queue
     * @return int
     */
    public int getCountLimit(String queueName)
    {
	return DEFAULT_COUNT_LIMIT;
    }

    /**
     * Process leased tasks from pull queue and delete them.
     * 
     * @throws Exception
     *             when failed to lease tasks
     */
    public void run()
    {
	System.out.println("Executing in pull scheduler run method...");

	try
	{
	    System.out.println("Infinite loop started at : " + System.currentTimeMillis());
	    int i = 0;
	    while (shouldContinue())
	    {
		System.out.println("while loop started at :" + System.currentTimeMillis() + "iteration : " + i);
		List<TaskHandle> tasks = PullQueueUtil.leaseTasksFromQueue(queueName, leasePeriod, countLimit);

		if (tasks == null || tasks.isEmpty())
		{
		    System.out.println("Tasked fetched are null. Time they are null : " + System.currentTimeMillis());
		    break;
		}

		System.out.println("tasks fetched " + tasks.size());

		processTasks(queueName, tasks);

		System.out.println("while loop ended at :" + System.currentTimeMillis() + "iteration : " + i);
		i++;
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in PullScheduler run method..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Returns boolean value based on condition. Verifies time limit 10mins when
     * tasks are processing in frontend. Verifies backend instance shutting down
     * status while processing tasks in backend.
     * 
     * @return boolean value
     */
    public boolean shouldContinue()
    {
	System.out.println("isCron" + isCron);
	// Verify request deadline - 10mins
	if (isCron)
	{
	    Long time = System.currentTimeMillis() - startTime;

	    System.out.println("Time left in cron : " + time);

	    if ((System.currentTimeMillis() - startTime) <= (8 * 60 * 1000))
		return true;
	    else
	    {
		System.err.println("Deadline time exceeds for Cron...");
		return false;
	    }
	}
	else
	{
	    Boolean backendStatus = LifecycleManager.getInstance().isShuttingDown();

	    System.out.println("Backend status is" + backendStatus);
	    // Verify backend instance shut down
	    if (backendStatus)
	    {
		System.err.println("Backend instance is shutting down...");
		return false;
	    }
	    else
		return true;
	}

    }

    /**
     * Process leased tasks
     * 
     * @param tasks
     *            leased tasks
     */
    public void processTasks(String queueName, List<TaskHandle> tasks)
    {

	if (tasks == null || tasks.isEmpty())
	    return;

	// To delete completed tasks
	// List<TaskHandle> completedTasks = new ArrayList<TaskHandle>();

	// Get queue to delete tasks
	Queue queue = QueueFactory.getQueue(queueName);

	try
	{
	    System.out.println("Get tag from first tag" + tasks.get(0).getTag());
	}
	catch (UnsupportedEncodingException e1)
	{
	    System.out.println("unsported tag operation");
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	}

	for (TaskHandle taskHandle : tasks)
	{
	    // Verifies backend shutdown or cron limit before processing each
	    // one
	    if (shouldContinue())
	    {
		DeferredTask deferredTask = (DeferredTask) SerializationUtils.deserialize(taskHandle.getPayload());

		Boolean isMailDeferredTask = deferredTask instanceof MailDeferredTask;
		System.out.println("is instance of mail deferred task" + isMailDeferredTask);
		if (isMailDeferredTask)
		{
		    try
		    {
			// System.out.println("Executing mandrill mail tasks...");
			EmailGatewayUtil.sendMails(tasks);
		    }
		    catch (Exception e)
		    {
			e.printStackTrace();
			System.err.println("Exception occured while runnning mail deferred tasks..." + e.getMessage());
		    }

		    PullQueueUtil.deleteTasks(queueName, tasks);
		    return;
		}
		else
		{
		    
			boolean deleted = false;
			
			try
		    {
			deferredTask.run();

			// Delete task from Queue
			deleted = queue.deleteTask(taskHandle);
		    }
		    catch(InternalFailureException fe)
		    {
		    	// Retries once again
		    	if(!deleted)
		    		queue.deleteTask(taskHandle);
		    }
		    catch (Exception e)
		    {
			e.printStackTrace();
			System.err.println("Exception occured while running deferred task..." + e.getMessage());
		    }
		}

		// System.out.println("Adding completed tasks");
		// Add to completed list
		// completedTasks.add(taskHandle);
	    }
	    else
		break;
	}

	// System.out.println("deleted tasks");
	// Delete completed tasks
	// PullQueueUtil.deleteTasks(queueName, completedTasks);

	// System.out.println("deleting tasks " + completedTasks.size());

    }

}
