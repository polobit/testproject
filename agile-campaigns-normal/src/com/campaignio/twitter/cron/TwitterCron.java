package com.campaignio.twitter.cron;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.campaignio.twitter.util.TwitterJobQueueUtil;

/**
 * <code>TwitterCron</code> is the servlet that is used to run TwitterQueue with
 * respect to rate limit.
 * 
 * @author Manohar
 * 
 */
@SuppressWarnings("serial")
public class TwitterCron extends HttpServlet
{

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	doGet(request, response);
    }

    // Get Request
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	// Get Rate
	String rateLimit = req.getParameter("rate");
	if (rateLimit == null)
	{
	    System.err.println("Rate Missing");
	    return;
	}

	System.out.println("Running Twitter Crons for Rate Limit " + rateLimit);
	TwitterJobQueueUtil.runTwitterQueues(rateLimit);
    }
}