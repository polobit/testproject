package com.agilecrm.workflows.triggers;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class TriggerCronDeferredTask implements DeferredTask
{
    
    /**
     * 
     */
    private static final long serialVersionUID = -3950287640251696886L;
    /**
     * Period of trigger
     */
    private String	    period;
    
    public TriggerCronDeferredTask(String period)
    {
	this.period = period;
    }
    
    @Override
    public void run()
    {
	// If period is null return, since query is done based on the duration
	if (period == null)
	    return;
	
	System.out.println("Period : " + period);
	try
	{
	    long startTime = System.currentTimeMillis();
	    for (String namespace : NamespaceUtil.getAllNamespaces())
	    {
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set(namespace);
		int triggersSize = TriggerUtil.getTriggerCountByPeriod(period);
		System.out.println(period + " " + "Trigger count for namespace" + " " + namespace + "is "
			+ triggersSize);
		NamespaceManager.set(oldNamespace);
		if (triggersSize > 0)
		{
		    // Created a deferred task for automations
		    TriggerDeferredTask triggerDeferredTask = new TriggerDeferredTask(namespace, period);
		    // Add to queue
		    Queue queue = QueueFactory.getQueue("periodic-triggers-queue");
		    queue.add(TaskOptions.Builder.withPayload(triggerDeferredTask));
		    System.out.println("task added to queue");
		}
	    }
	    System.out.println("Time taken to execute periodic-triggers:" + (System.currentTimeMillis() - startTime)
		    + " milliseconds");
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in TriggerServlet...");
	    System.out.println(ExceptionUtils.getFullStackTrace(e));
	}
	
    }
}
