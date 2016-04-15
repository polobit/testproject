package com.agilecrm.webhooks.triggers.util;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

@SuppressWarnings("serial")
public class TaskletWebhooksDeferredTask implements DeferredTask
{

    private String eventObject;
    private String uRL;

    public TaskletWebhooksDeferredTask(String eventObject, String uRL)
    {
	super();
	this.eventObject = eventObject;
	this.uRL = uRL;
    }

    @Override
    public void run()
    {
	try
	{
	    System.out.println("URL received at webhook deferred = " + uRL);
	    HTTPUtil.accessURLUsingPostForWebCalendar(uRL, eventObject);
	}
	catch (Exception e)
	{
	    System.err.println(ExceptionUtils.getFullStackTrace(e));
	    e.printStackTrace();
	}

    }

}
