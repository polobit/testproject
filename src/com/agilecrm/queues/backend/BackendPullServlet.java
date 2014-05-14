package com.agilecrm.queues.backend;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.queues.PullScheduler;
import com.google.appengine.api.ThreadManager;

/**
 * <code>BackendPullServlet</code> is the backend servlet to process pull queue
 * tasks in backend instance
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class BackendPullServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	doPost(req, res);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {

	// Pull queue name
	final String queueName = req.getParameter("queue_name");

	if (StringUtils.isBlank(queueName))
	    return;

	try
	{
	    // Process pull queue tasks
	    PullScheduler pullScheduler = new PullScheduler(queueName, false);
	    pullScheduler.run();

	    // To run again in same request as separate thread
	    Thread thread = ThreadManager.createBackgroundThread(new Runnable()
	    {
		public void run()
		{
		    PullScheduler pullScheduler = new PullScheduler(queueName, false);
		    pullScheduler.run();
		}
	    });
	    thread.start();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in BackendPullServlet PullScheduler " + e.getMessage());
	}

    }
}
