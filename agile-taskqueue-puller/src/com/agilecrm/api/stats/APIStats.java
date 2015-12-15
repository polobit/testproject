package com.agilecrm.api.stats;

import com.agilecrm.logger.AgileAPILogger;
import com.agilecrm.threads.ThreadPool;
import com.thirdparty.Mailgun;

public class APIStats
{
    public static final Integer TASK_QUEUE_API_LIMIT = 50000;

    private static int counter = 0;
    private static boolean isInterrupted = false;
    private static final int MAX_LIMIT = 10000;
    private static final int MAX_NUMBER_OF_HOURS = 1;
    private static final Long START_TIME = System.currentTimeMillis();

    private static boolean isThreadPoolRunning = false;

    public static synchronized void incrementCounter()
    {
	System.out.println(System.currentTimeMillis());
	System.out.print("counter :" + counter);
	if (counter >= TASK_QUEUE_API_LIMIT)
	{
	    System.err.print("counter :" + counter);
	    return;
	}

	++counter;

	if (counter > 1000)
	{
	    System.out.println("counter :" + counter);
	}

    }

    public static void interruptThread(Thread thread)
    {
	try
	{
	    thread.interrupt();
	    isInterrupted = true;
	}
	catch (Exception e)
	{
	    System.err.println("Unable to interrupt thread : " + thread.getName());
	    Mailgun.sendMail("campaigns@agile.com", "Email Observer", "yaswanth@agilecrm.com",
		    "naresh@agilecrm.com,raja@agilecrm.com", null, "EC2 Error while interrupting thread", null,
		    "Hi Yaswanth " + "EC2 Error while interrupting thread", null);
	}

	try
	{
	    AgileAPILogger.getLogger().info(
		    "Restarting Current thread : " + thread.getName() + " , " + thread.getId() + " at time : "
			    + System.currentTimeMillis());

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    private static boolean isInterrupted()
    {
	return isInterrupted;
    }

    private static int runningSinceDays()
    {
	return (int) (System.currentTimeMillis() - START_TIME) / 3600000;
    }

    public static boolean shouldContinue()
    {
	if (canInterruptThreadPool()
		&& (isInterrupted() || counter >= MAX_LIMIT || runningSinceDays() >= MAX_NUMBER_OF_HOURS))
	{
	    return false;
	}

	return true;
    }

    private static boolean canInterruptThreadPool()
    {
	if (!isThreadPoolRunning)
	    return true;

	return ThreadPool.isRunning();
    }

    public static void setThreadPoolFlag(boolean flag)
    {
	isThreadPoolRunning = flag;
    }
}
