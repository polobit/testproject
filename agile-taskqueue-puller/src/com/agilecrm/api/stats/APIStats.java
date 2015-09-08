package com.agilecrm.api.stats;

public class APIStats
{
    public static final Integer TASK_QUEUE_API_LIMIT = 50000;

    private static int counter = 0;

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
}
