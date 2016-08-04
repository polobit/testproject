package com.agilecrm;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.CreateTaskDeferredTask;
import com.agilecrm.activities.TaskReminder;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.util.VersioningUtil;

/**
 * <code>TaskReminderServlet</code> is the servlet for handling cron requests of
 * Tasks Reminder. It calls {@link TaskReminder} to send task reminder emails to
 * the respective users.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
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
			if(VersioningUtil.isDevelopmentEnv()){
				CreateTaskDeferredTask.createTaskReminderDeferredTask("");
				return;
			}
			
			
			Set<String> domains = new HashSet<String>();
			String domainName = req.getParameter("domain");
			if(StringUtils.isNotBlank(domainName)){
				domains.add(domainName);
			}
			else {
				domains = NamespaceUtil.getAllNamespaces();
			}
			
			// Start a task queue for each domain
			for (String domain : domains)
			{
				CreateTaskDeferredTask.createTaskReminderDeferredTask(domain);
			}
			
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
	}
}
