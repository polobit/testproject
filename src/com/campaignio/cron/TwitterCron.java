package com.campaignio.cron;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.campaignio.TwitterQueue;

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

		System.out.println("Twitter Cron");

		// Get Rate
		String rateLimit = req.getParameter("rate");
		if (rateLimit == null)
		{
			System.err.println("Rate Missing");
			return;
		}

		System.out.println("Rate Limit " + rateLimit);
		TwitterQueue.runTwitterQueues(rateLimit);

	}

}
