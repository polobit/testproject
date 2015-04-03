package com.agilecrm.queues.cron;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.queues.PullScheduler;
import com.agilecrm.queues.util.PullQueueUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.QueueStatistics;

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

	if (StringUtils.isBlank(queueName))
	    return;

	Queue queue = QueueFactory.getQueue(queueName);

	System.out.println("campaign queue | Queue name :" + queueName);

	// Get statistics
	QueueStatistics qs = queue.fetchStatistics();

	int tasksCount = qs.getNumTasks();

	System.out.println("Statistics in queue : " + queue.getQueueName() + ", task count : " + tasksCount
		+ "Fetch limit : " + FETCH_LIMIT);

	if (tasksCount == 0)
	{
	    System.out.println("Tasks count is zero...");
	    return;
	}

	// Process tasks in backend
	if (tasksCount > FETCH_LIMIT)
	{
	    System.out.println("Running " + queueName + " tasks in backend...");
	    
	    try
	    {
		PullQueueUtil.processTasksInBackend("/backend-pull", queueName);
	    }
	    catch (Exception e)
	    {
		System.out.println("exception raised to process task");
		e.printStackTrace();
	    }
	    
	}
	else
	{
	    // If from cron Process tasks in frontend
	    PullScheduler pullScheduler = new PullScheduler(queueName, true);
	    pullScheduler.run();
	}
    }
}
