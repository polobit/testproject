package com.agilecrm.queues;

import java.util.List;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;

import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.mandrill.util.deferred.MandrillDeferredTask;
import com.agilecrm.queues.util.PullQueueUtil;
import com.google.appengine.api.LifecycleManager;
import com.google.appengine.api.taskqueue.DeferredTask;
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
    public static int DEFAULT_LEASE_PERIOD = 500;
    public static int DEFAULT_COUNT_LIMIT = 500;

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
	countLimit = getCountLimit(queueName);

	startTime = System.currentTimeMillis();
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
	if (StringUtils.equals(queueName, "campaign-pull-queue"))
	    return 3600;

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
	if (StringUtils.equals(queueName, "campaign-pull-queue"))
	    return 100;

	return DEFAULT_COUNT_LIMIT;
    }

    /**
     * Process leased tasks from pull queue and delete them.
     * 
     * @throws Exception
     *             when failed to lease tasks
     */
    public void run() throws Exception
    {
	while (shouldContinue())
	{
	    List<TaskHandle> tasks = PullQueueUtil.leaseTasksFromQueue(queueName, leasePeriod, countLimit);

	    processTasks(tasks);

	    PullQueueUtil.deleteTasks(queueName, tasks);
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
	// Verify request deadline - 10mins
	if (isCron)
	{
	    if ((System.currentTimeMillis() - startTime) <= (8 * 60 * 1000))
		return true;
	}
	else
	{
	    // Verify backend instance shut down
	    if (!LifecycleManager.getInstance().isShuttingDown())
		return true;
	}

	System.err.println("Some deadline occured. Not continuing " + isCron);

	return false;
    }

    /**
     * Process leased tasks
     * 
     * @param tasks
     *            leased tasks
     */
    public void processTasks(List<TaskHandle> tasks)
    {

	if (tasks == null || tasks.isEmpty())
	    return;

	for (TaskHandle taskHandle : tasks)
	{
	    DeferredTask deferredTask = (DeferredTask) SerializationUtils.deserialize(taskHandle.getPayload());

	    if (deferredTask instanceof MandrillDeferredTask)
	    {
		System.out.println("Executing mandrill mail tasks...");

		MandrillUtil.sendMandrillMails(tasks);
		break;
	    }
	    else
		deferredTask.run();
	}

    }
}
