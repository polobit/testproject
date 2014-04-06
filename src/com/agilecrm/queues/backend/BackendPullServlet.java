package com.agilecrm.queues.backend;

import java.util.HashSet;
import java.util.Set;

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
    public static Set<String> processedQueue = new HashSet<String>();

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

	System.out.println("ProcessedQueue set size is " + processedQueue.size());

	if (processedQueue.contains(queueName))
	{
	    System.err.println("Queue - " + queueName + " already exists in Set");
	    return;
	}

	processedQueue.add(queueName);

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

	processedQueue.remove(queueName);

    }
}
