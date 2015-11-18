package com.agilecrm.api.stats;

import com.thirdparty.Mailgun;

public class APIStats
{
    public static final Integer TASK_QUEUE_API_LIMIT = 50000;

    private static int counter = 0;
    private static boolean isInterrupted = false;
    private static final int MAX_LIMIT = 20;

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

	}

	try
	{
	    Mailgun.sendMail("campaigns@agile.com", "Email Observer", "yaswanth@agilecrm.com",
		    "naresh@agilecrm.com,raja@agilecrm.com", null, "EC2 Error while interrupting thread", null,
		    "Hi Yaswanth " + "EC2 Error while interrupting thread", null);
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

    public static boolean shouldContinue()
    {
	if (isInterrupted() || counter >= MAX_LIMIT)
	{
	    return false;
	}

	return true;
    }

}
