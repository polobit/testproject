package com.agilecrm.initializer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.agilecrm.TaskQueueStatsDaemon;
import com.agilecrm.ThreadPoolQueueStatsDaemon;
import com.auth.Authorization;
import com.google.api.services.taskqueue.Taskqueue;

public class TaskDaemonInitializer
{
    public static HashMap<String, TaskQueueStatsDaemon> daemonMap = new HashMap<String, TaskQueueStatsDaemon>();

    private static final List<String> pooledQueues = new ArrayList<String>();
    static
    {
	pooledQueues.add("export-pull-queue");
	pooledQueues.add("bulk-export-pull-queue");
	pooledQueues.add("contact-import-queue");
    };

    public static void runMultiplethreads(String queue, int numberOfThreadsInt)
    {
	Taskqueue taskqueue = Authorization.getTaskqeues(queue);

	if (taskqueue == null)
	{
	    System.out.println(queue + "Is not avaliable of unauthorized to run");
	    return;
	}

	System.out.println("number of instances" + numberOfThreadsInt);
	for (int i = 0; i < numberOfThreadsInt; i++)
	{
	    TaskQueueStatsDaemon t = null;
	    if (pooledQueues.contains(queue))
	    {
		t = new ThreadPoolQueueStatsDaemon(queue);
	    }
	    else
		t = new TaskQueueStatsDaemon(queue);

	    t.setName(queue + "-" + i);
	    t.start();
	}
    }

    public static void runThreadPool(String queue, int numberOfThreadsInt)
    {
	System.out.println("number of instances" + numberOfThreadsInt);

	TaskQueueStatsDaemon t = new TaskQueueStatsDaemon(queue, numberOfThreadsInt);
	t.start();
    }

    public static void main(String[] args)
    {

	System.out.println(Runtime.getRuntime().availableProcessors());
	if (args == null || args.length < 1)
	{
	    System.out.println("Arguments Required");
	    return;
	}

	String queue = args[0].trim().toLowerCase();

	String numberOfThreads = null;
	if (args.length > 1)
	{
	    numberOfThreads = args[1].trim().toLowerCase();
	}

	int numberOfThreadsInt = 4;
	if (numberOfThreads != null)
	{
	    try
	    {
		numberOfThreadsInt = Integer.parseInt(numberOfThreads);
	    }
	    catch (NumberFormatException e)
	    {

	    }
	}

	boolean runThreadPool = false;
	if (args.length > 2)
	{
	    String threadPool = args[2];

	    if ("thread-pool".equals(threadPool))
		runThreadPool = true;
	}

	if (!runThreadPool)
	{
	    runMultiplethreads(queue, numberOfThreadsInt);
	}
	else if (runThreadPool)
	{
	    runThreadPool(queue, numberOfThreadsInt);
	}

    }
}
