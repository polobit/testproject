package com.agilecrm.threads;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

public class RejectionHandler implements RejectedExecutionHandler
{

    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor)
    {
	try
	{
	    System.out.println("setting in rejection handle" + executor.getCompletedTaskCount() + " total : "
		    + executor.getTaskCount());
	    /*
	     * This does the actual put into the queue. Once the max threads
	     * have been reached, the tasks will then queue up.
	     */
	    executor.getQueue().put(r);
	}
	catch (InterruptedException e)
	{
	    e.printStackTrace();
	    Thread.currentThread().interrupt();
	    return;
	}
    }

}
