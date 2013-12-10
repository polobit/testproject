package com.socialsuite;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class ScheduledUpdateCron extends HttpServlet
{

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		doGet(request, response);
	}

	// Get Request
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
	{
		ScheduleUpdateUtil.postUpdates();
	}
}