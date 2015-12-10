package com.agilecrm.activities.deferred;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.activities.TaskReminder;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TransientFailureException;
import com.thirdparty.mandrill.Mandrill;

/**
 * <code>ExcecuteTaskDeferredTask</code> is sets name space and initiates task
 * and set ETA to execute the task
 * 
 * <domain>
 * 
 * @author jagadeesh
 *
 */
public class ExcecuteTaskDeferredTask implements DeferredTask
{
    /**
     * Stores name of the domain
     */
    String domain = null;

    /**
     * 
     * @param domain
     * @param starttime
     *            fetches the evnets based on start time
     */
    public ExcecuteTaskDeferredTask(String domain)
    {
	this.domain = domain;
    }

    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(domain);
	List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);

	if (domainUsers == null)
	    return;
	try
	{

	    // Iterates over domain users to fetch due tasks of each user.
	    for (DomainUser domainUser : domainUsers)
	    {
		Long time = null;
		int sec_per_day = 86400;
		String timezone = UserPrefsUtil.getUserTimezoneFromUserPrefs(domainUser.id);
		String user_email = domainUser.email;
		if (StringUtils.isEmpty(timezone))
		{
		    timezone = domainUser.timezone;
		    if (StringUtils.isEmpty(timezone))
		    {
			AccountPrefs acprefs = AccountPrefsUtil.getAccountPrefs();
			timezone = acprefs.timezone;
			if (StringUtils.isEmpty(timezone))
			{
			    timezone = "UTC";
			}
		    }
		}
		DateUtil dt = new DateUtil().toTZ(timezone);

		Calendar calendar = com.agilecrm.util.DateUtil.getCalendar(
		        new SimpleDateFormat("MM/dd/yyyy").format(dt.getTime()), timezone, "07:00");
		time = (calendar.getTimeInMillis() / 1000);

		if (time < dt.getCalendar().getTimeInMillis() / 1000)
		{
		    time += sec_per_day;
		}

		TaskReminder.sendDailyTaskReminders(domain, time, domainUser.id, timezone, user_email);
	    }

	}

	catch (TransientFailureException tfe)
	{
	    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		    "jagadeesh@invox.com", null, null, "transient exception " + domain, null, "execute task reminder",
		    null, null, null, null);
	    ExcecuteTaskDeferredTask task_deferred = new ExcecuteTaskDeferredTask(domain);
	    Queue queue = QueueFactory.getQueue("due-task-reminder");
	    TaskOptions options = TaskOptions.Builder.withPayload(task_deferred);
	    options.countdownMillis(40000);
	    queue.add(options);
	    return;

	}

	catch (Exception e)
	{
	    try
	    {
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		String errorString = errors.toString();

		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		        "jagadeesh@invox.com", null, null, "exception at taskreminder deferred task " + domain, null,
		        errorString, null, null, null, null);
	    }
	    catch (Exception ex)
	    {
		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		        "jagadeesh@invox.com", null, null, "exception occured while sending mail " + domain, null,
		        "exception occured task reminder deferred task", null, null, null, null);
		ex.printStackTrace();
		System.err.println("Exception occured while sending task notification status mail " + e.getMessage());
	    }

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }
}