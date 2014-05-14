package com.agilecrm.queues.backend;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.queues.PullScheduler;

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
	String queueName = req.getParameter("queue_name");

	if (StringUtils.isBlank(queueName))
	    return;

	try
	{
	    // Process pull queue tasks
	    PullScheduler pullScheduler = new PullScheduler(queueName, false);
	    pullScheduler.run();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in BackendPullServlet PullScheduler " + e.getMessage());
	}

    }
}
