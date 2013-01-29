package com.campaignio.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.campaignio.cron.util.CronUtil;

/**
 * <code>TaskQueueServlet</code> is the servlet to wakeup the cron jobs for
 * links clicked. Tracking Id is given as one of the custom values. The cron
 * that matches the tracking Id is get to wake up and interrupted method of
 * Clicked node is called inside Cron class.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class TaskQueueServlet extends HttpServlet
{
    public static final String TASK_QUEUE_COMMAND_INTERRUPT_TASKLET_CUSTOM1 = "custom1";
    public static final String TASK_QUEUE_COMMAND_INTERRUPT_TASKLET_CUSTOM2 = "custom2";
    public static final String TASK_QUEUE_COMMAND_INTERRUPT_TASKLET_CUSTOM3 = "custom3";
    public static final String TASK_QUEUE_COMMAND_INTERRUPT_TASKLET_CUSTOM4 = "custom4";
    public static final String TASK_QUEUE_COMMAND_INTERRUPT_TASKLET_CUSTOM5 = "custom5";
    public static final String TASK_QUEUE_COMMAND_INTERRUPT_TASKLET_DATA = "data_cache_key";

    public void doPost(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {
	doGet(request, response);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {
	resp.setContentType("text/plain");

	try
	{
	    String trackerId = req
		    .getParameter(TASK_QUEUE_COMMAND_INTERRUPT_TASKLET_CUSTOM1);
	    // String subscriberId = req
	    // .getParameter(TASK_QUEUE_COMMAND_INTERRUPT_TASKLET_CUSTOM2);
	    CronUtil.interrupt(trackerId, null, null, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return;
    }
}
