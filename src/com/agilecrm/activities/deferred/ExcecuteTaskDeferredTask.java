package com.agilecrm.activities.deferred;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.agilecrm.activities.TaskReminder;
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
    Long time = null;
    boolean isFromServlet = true;

    /**
     * 
     * @param domain
     * @param starttime
     *            fetches the evnets based on start time
     */
    public ExcecuteTaskDeferredTask(String domain, Long starttime, boolean isFromServlet)
    {
	this.domain = domain;
	this.time = starttime;
	this.isFromServlet = isFromServlet;
    }

    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(domain);
	try
	{
	    TaskReminder.sendDailyTaskReminders(domain, time, isFromServlet);

	}

	catch (TransientFailureException tfe)
	{
	    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "task-reminder-failure",
		    "jagadeesh@invox.com", null, null, "transient exception " + domain, null,
		    "send event reminder deferred task", null, null, null);
	    ExcecuteTaskDeferredTask task_deferred = new ExcecuteTaskDeferredTask(domain, time, isFromServlet);
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

		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		        "jagadeesh@invox.com", null, null, "exception at taskreminder deferred task " + domain, null,
		        errorString, null, null, null);
	    }
	    catch (Exception ex)
	    {
		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		        "jagadeesh@invox.com", null, null, "exception occured while sending mail " + domain, null,
		        "exception occured task reminder deferred task", null, null, null);
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