package com.socialsuite.cron;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.socialsuite.util.ScheduleUpdateUtil;

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