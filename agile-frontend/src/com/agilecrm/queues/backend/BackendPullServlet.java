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
	System.out.println("Backend pull servlet running in backends : " + ModuleUtil.getCurrentModuleName());
	doPost(req, res);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {

	// Pull queue name
	String queueName = req.getParameter("queue_name");
	
	System.out.println("Request forwarded to post request. Start time of backend request : " + System.currentTimeMillis() + " queue name : " + queueName);
	

	if (StringUtils.isBlank(queueName))
	    return;

	try
	{
	    // Process pull queue tasks
	    PullScheduler pullScheduler = new PullScheduler(queueName, false);
	    pullScheduler.run();

	    // Runs background threads
	    // runBackgroudnThread(queueName);
	    // runBackgroudnThread(queueName);
	    // runBackgroudnThread(queueName);
	    //
	    // runBackgroudnThread(queueName);
	    // runBackgroudnThread(queueName);
	    // runBackgroudnThread(queueName);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in BackendPullServlet PullScheduler " + e.getMessage());
	}

    }

    /**
     * Runs background thread which can outlive the request
     * 
     * @param queueName
     */
    public void runBackgroudnThread(final String queueName)
    {
	// To run again in same request as separate thread
	Thread thread = ThreadManager.createBackgroundThread(new Runnable()
	{
	    public void run()
	    {
		System.out.println("Calling again run method from thread...");

		PullScheduler pullScheduler = new PullScheduler(queueName, false);
		pullScheduler.run();
	    }
	});
	thread.start();
    }

}
