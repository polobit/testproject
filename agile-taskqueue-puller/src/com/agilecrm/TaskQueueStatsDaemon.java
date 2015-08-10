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
import com.thirdparty.Mailgun;

public class TaskQueueStatsDaemon extends Thread
{

    // By default wait period is 120 seconds
    private int wairPeriodInMilliSeconds = 30000;

    private String TASK_QUEUE_NAME = "dummy-pull-queue";

    private Taskqueue taskQueue = null;

    private TaskExcecutorThreadPool threadPool = null;

    private int numberOfWorkerThreads = 4;

    private boolean isThreadPool = false;

    private Long remoteAPIInstalledTime = null;

    private static int MAX_REMOTE_API_VALIDITY_IN_HOURS = 1;

    public static final RemoteApiOptions options = new RemoteApiOptions().server("agilecrmbeta.appspot.com", 443)
	    .credentials("naresh@faxdesk.com", "clickdesk");

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
	    wairPeriodInMilliSeconds = 15000;
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
	    leaseTasks();
	}

	/*
	 * int total = getTotalTasks(); if (total > 0) { //
	 * threadPool.wakeUpAllThreads(); // }
	 */

    }

    RemoteApiInstaller installer = null;

    /**
     * Gets connector to access datastore remotely
     * 
     * @throws IOException
     */
    private void setRemoteAPI() throws IOException
    {
	System.out.println("setting remote api in thread " + Thread.currentThread().getName());

	/**
	 * If installer is already installed, this condition block checks for
	 * expiry and resets config is expired
	 */
	if (installer != null)
	{
	    if (!isRemoteAPIExpired())
		return;

	    logger.info("Uninstalling current Prefs : " + System.currentTimeMillis() + " In thread : "
		    + Thread.currentThread().getName());

	    // Uninstalls prefs
	    installer.uninstall();

	    logger.info("Re-Installing prefs : " + System.currentTimeMillis() + " In thread : "
		    + Thread.currentThread().getName());
	}
	else
	{
	    // Installs remote API for first time
	    installer = new RemoteApiInstaller();
	}

	installRemoteAPI();
    }

    private void installRemoteAPI() throws IOException
    {

	installer.install(options);
	remoteAPIInstalledTime = System.currentTimeMillis();

	logger.info("Installing prefs : " + System.currentTimeMillis() + " In thread : "
		+ Thread.currentThread().getName());

    }

    /**
     * Checks for remote api config expiry.
     * 
     * @return
     */
    private boolean isRemoteAPIExpired()
    {
	if (remoteAPIInstalledTime == null)
	    return false;

	Long currentTime = System.currentTimeMillis();

	Long timeDifference = currentTime - remoteAPIInstalledTime;

	int hours = (int) (timeDifference / (1000 * 60 * 60));

	if (MAX_REMOTE_API_VALIDITY_IN_HOURS > hours)
	    return false;

	return true;
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

    private void sendErrorEmail(String message)
    {
	try
	{
	    Mailgun.sendMail("campaigns@agile.com", "Email Observer", "yaswanth@agilecrm.com",
		    "naresh@agilecrm.com,raja@agilecrm.com", null, "EC2 Error", null, "Hi Yaswanth " + message, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    logger.error("Exception occured while sending error initiated mail " + e.getMessage());
	}

    }

    private synchronized void leaseTasks()
    {
	try
	{
	    // Checks and sets remote api when required
	    setRemoteAPI();
	}
	catch (IOException e)
	{
	    logger.error(e.getMessage());
	    sendErrorEmail("IO Exception raised in thread : " + Thread.currentThread().getName());
	    return;
	}
	catch (Exception e)
	{
	    logger.error(e.getMessage());
	    sendErrorEmail("Exception raised in thread : " + Thread.currentThread().getName());

	    return;
	}

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

	    while (threadPool.canAddMore())
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
	    }

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
