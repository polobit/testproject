package com.agilecrm.queues.cron;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.queues.PullScheduler;
import com.agilecrm.queues.util.PullQueueUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.QueueStatistics;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>CronPullServlet</code> is the cron servlet to lease and process
 * pull-queue tasks. If the pull-queue tasks in the queue are above fetch limit,
 * these tasks are processed in backend.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class CronPullServlet extends HttpServlet
{

    /**
     * Tasks limit
     */
    public static final int FETCH_LIMIT = 100;

    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	doPost(req, res);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {

	// Get queue name
	String queueName = req.getParameter("q");
	String isSandbox = req.getParameter("is_sb");

	if (StringUtils.isBlank(queueName))
	    return;

	Queue queue = QueueFactory.getQueue(queueName);

	// Get statistics
	QueueStatistics qs = queue.fetchStatistics();
	int tasksCount = qs.getNumTasks();

	if (tasksCount == 0)
	{
	    System.out.println("Tasks count is zero...");
	    return;
	}

	// Process tasks in backend
	if (tasksCount > FETCH_LIMIT)
	{
	    System.out.println("Running " + queueName + " tasks in backend...");

	    PullQueueUtil.processTasksInBackend("/backend-pull", queueName);
	}
	else
	{

	    // If from cron
	    if (StringUtils.isBlank(isSandbox))
	    {
		// Process tasks in frontend
		PullScheduler pullScheduler = new PullScheduler(queueName, true);
		pullScheduler.run();
	    }
	    else
	    {
		// Test purpose in SB
		try
		{
		    // Created a deferred task for report generation
		    CronPullDeferredTask cronpullDeferredTask = new CronPullDeferredTask(queueName);

		    // Add to queue
		    Queue q = QueueFactory.getQueue("campaign-queue");
		    q.add(TaskOptions.Builder.withPayload(cronpullDeferredTask));

		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    System.err.println("Exception occured in CronPullServlet PullScheduler " + e.getMessage());
		}
	    }
	}
    }
}

@SuppressWarnings("serial")
class CronPullDeferredTask implements DeferredTask
{
    String queueName;

    public CronPullDeferredTask(String queueName)
    {
	this.queueName = queueName;
    }

    public void run()
    {
	// Process tasks in frontend
	PullScheduler pullScheduler = new PullScheduler(queueName, true);
	pullScheduler.run();
    }

}
