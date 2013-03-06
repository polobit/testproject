package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.activities.TaskReminder;

/**
 * <code>TaskReminderServlet</code> is the servlet for handling cron requests of
 * Tasks Reminder. It calls {@link TaskReminder} to send task reminder emails to
 * the respective users.
 * 
 * @author Naresh
 * 
 */
public class TaskReminderServlet extends HttpServlet
{
    public void doPost(HttpServletRequest request, HttpServletResponse response)
    {
	doGet(request, response);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	try
	{
	    TaskReminder.dailyTaskReminder();
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}
    }
}
