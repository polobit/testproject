package com.agilecrm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Level;

import com.agilecrm.logger.AgileAPILogger;
import com.agilecrm.queues.PullScheduler;
import com.agilecrm.threads.TaskExcecutorThreadPool;
import com.auth.Authorization;
import com.google.api.services.taskqueue.Taskqueue;
import com.google.api.services.taskqueue.Taskqueue.Tasks.Lease;
import com.google.api.services.taskqueue.model.Task;
import com.google.api.services.taskqueue.model.TaskQueue;
import com.google.api.services.taskqueue.model.TaskQueue.Stats;
import com.google.appengine.tools.remoteapi.RemoteApiInstaller;
import com.google.appengine.tools.remoteapi.RemoteApiOptions;

public class TaskQueueStatsDaemon extends Thread
{

    // By default wait period is 120 seconds
    private int wairPeriodInMilliSeconds = 30000;

    private String TASK_QUEUE_NAME = "dummy-pull-queue";

    private Taskqueue taskQueue = null;

    private TaskExcecutorThreadPool threadPool = null;

    private int numberOfWorkerThreads = 4;

    private boolean isThreadPool = false;

    org.apache.log4j.Logger logger = null;

    TaskQueueStatsDaemon()
    {

    }

    public TaskQueueStatsDaemon(String taskQueueName)
    {
	this.TASK_QUEUE_NAME = taskQueueName;

	logger = AgileAPILogger.getLogger(taskQueueName);

	/*
	 * if (threadPool == null) { threadPool = new
	 * TaskExcecutorThreadPool(20, 40); }
	 */
    }

    public TaskQueueStatsDaemon(String taskQueueName, int numberOfWorkerthreads)
    {
	this.TASK_QUEUE_NAME = taskQueueName;
	this.numberOfWorkerThreads = numberOfWorkerthreads;
	isThreadPool = true;
	if (threadPool == null)
	{
	    threadPool = new TaskExcecutorThreadPool(numberOfWorkerThreads, 1024);
	}

	logger = AgileAPILogger.getLogger(taskQueueName);

    }

    private Taskqueue getTaskqueue()
    {
	if (taskQueue != null)
	{
	    return taskQueue;
	}

	return taskQueue = Authorization.getTaskqeues(TASK_QUEUE_NAME);
    }

    private int getTotalTasks() throws IOException
    {
	Taskqueue.Taskqueues.Get request = getTaskqueue().taskqueues().get(Authorization.PROJECT_NAME, TASK_QUEUE_NAME);
	request.setGetStats(true);
	try
	{
	    TaskQueue queue = request.execute();

	    Stats stats = queue.getStats();

	    Integer totalTasks = stats.getTotalTasks();

	    return totalTasks;
	}
	catch (Exception e)
	{
	    return 0;
	}

    }

    private boolean hasNewTasks() throws IOException
    {
	Taskqueue.Taskqueues.Get request = getTaskqueue().taskqueues().get(Authorization.PROJECT_NAME, TASK_QUEUE_NAME);
	request.setGetStats(true);
	try
	{
	    TaskQueue queue = request.execute();

	    Stats stats = queue.getStats();

	    Integer totalTasks = stats.getTotalTasks();

	    if (totalTasks > 0)
		return true;
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return false;
    }

    @Override
    public void run()
    {
	if (isThreadPool)
	{
	    leaseTasksOld();
	}
	else
	{
	    setRemoteAPI();
	    leaseTasks();
	}

	/*
	 * int total = getTotalTasks(); if (total > 0) { //
	 * threadPool.wakeUpAllThreads(); // }
	 */

    }

    RemoteApiInstaller installer = null;

    private void setRemoteAPI()
    {
	System.out.println("setting remote api in thread " + Thread.currentThread().getName());
	if (installer != null)
	    return;

	RemoteApiOptions options = new RemoteApiOptions().server("agilecrmbeta.appspot.com", 443).credentials(
		"naresh@faxdesk.com", "clickdesk");

	// CachingRemoteApiInstaller installer = new
	// CachingRemoteApiInstaller();

	installer = new RemoteApiInstaller();

	try
	{
	    installer.install(options);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    private List<Task> leaseTasksFromAppengine()
    {
	Lease lease;
	try
	{
	    lease = getTaskqueue().tasks().lease(Authorization.PROJECT_NAME, TASK_QUEUE_NAME,
		    PullScheduler.DEFAULT_COUNT_LIMIT, PullScheduler.DEFAULT_LEASE_PERIOD);

	    com.google.api.services.taskqueue.model.Tasks tasks = lease.execute();

	    if (tasks == null || tasks.size() == 0)
		return new ArrayList<Task>();

	    return tasks.getItems();
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return new ArrayList<Task>();
	}
    }

    private synchronized void leaseTasks()
    {
	try
	{
	    System.out.println("loading");
	    List<Task> tasks = leaseTasksFromAppengine();

	    do
	    {
		List<Task> localTask = null;
		if (tasks == null)
		{
		    long start = System.currentTimeMillis();
		    localTask = leaseTasksFromAppengine();
		    System.out.println("Time " + (System.currentTimeMillis() - start));
		}
		else
		{
		    localTask = tasks;
		    tasks = null;
		}

		if (localTask == null || localTask.size() == 0)
		{
		    break;
		}

		logger.info("fetched Tasks in Thread" + Thread.currentThread().getName() + " , " + " Total fetched : "
			+ localTask.size());

		TaskletThread t = new TaskletThread(localTask, TASK_QUEUE_NAME, taskQueue, logger);

		t.run();

	    } while (true);

	    try
	    {
		System.out.println("waiting");
		wait(wairPeriodInMilliSeconds);
		leaseTasks();
	    }
	    catch (InterruptedException e)
	    {
		logger.log(Level.WARN, e.getMessage() + ", " + Thread.currentThread().getName());
		// TODO Auto-generated catch block
		e.printStackTrace();
		wait(wairPeriodInMilliSeconds);
		leaseTasks();
	    }
	}
	catch (Exception e)
	{
	    logger.log(Level.ERROR, e.getMessage() + ", " + Thread.currentThread().getName());
	    e.printStackTrace();
	    leaseTasks();
	}
    }

    /**
     * Initializes thread pool
     */

    private synchronized void leaseTasksOld()
    {

	try
	{
	    System.out.println("loading");
	    List<Task> tasks = leaseTasksFromAppengine();

	    do
	    {
		List<Task> localTask = null;
		if (tasks == null)
		{
		    long start = System.currentTimeMillis();
		    localTask = leaseTasksFromAppengine();
		    System.out.println("Time " + (System.currentTimeMillis() - start));
		}
		else
		{
		    localTask = tasks;
		    tasks = null;
		}

		if (localTask == null || localTask.size() == 0)
		{
		    break;
		}

		System.out.println("Fetched tasks : " + localTask.size());

		TaskletThread t = new TaskletThread(localTask, TASK_QUEUE_NAME, taskQueue, logger);

		threadPool.enqueue(t);

	    } while (true);

	    try
	    {
		System.out.println("waiting");
		wait(wairPeriodInMilliSeconds);
		leaseTasksOld();
	    }
	    catch (InterruptedException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
		wait(wairPeriodInMilliSeconds);
		leaseTasksOld();
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    logger.info(e.getMessage());
	    leaseTasksOld();
	}
    }

}
