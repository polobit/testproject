package com.agilecrm.mandrill.servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.mandrill.util.MandrillUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.QueueStatistics;

/**
 * <code>EmailPullCron</code> is the cron class to pull tasks from
 * email-pull-queue and process them for every minute. Based on the tasks in the
 * queue, execution is proceeded in backend or frontend. If tasks remained in
 * queue are more than the limit, then the tasks are executed in backend.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class EmailPullCron extends HttpServlet
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
	Queue q = QueueFactory.getQueue("email-pull-queue");

	// Get statistics
	QueueStatistics qs = q.fetchStatistics();
	int tasksCount = qs.getNumTasks();

	System.out.println("Number of tasks are " + tasksCount);

	// Process tasks
	if (tasksCount > FETCH_LIMIT)
	{
	    System.out.println("Running pull queue tasks in backend...");

	    MandrillUtil.processTasksInBackend();
	}
	else
	    MandrillUtil.processAllTasks();

    }

}
