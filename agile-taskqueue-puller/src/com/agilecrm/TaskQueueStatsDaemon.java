package com.agilecrm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Level;

import com.Globals;
import com.agilecrm.api.stats.APIStats;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.logger.AgileAPILogger;
import com.agilecrm.queues.PullScheduler;
import com.agilecrm.threads.TaskExcecutorThreadPool;
import com.auth.Authorization;
import com.google.api.services.taskqueue.Taskqueue;
import com.google.api.services.taskqueue.Taskqueue.Tasks.Lease;
import com.google.api.services.taskqueue.model.Task;
import com.google.api.services.taskqueue.model.TaskQueue;
import com.google.api.services.taskqueue.model.TaskQueue.Stats;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.tools.remoteapi.RemoteApiInstaller;
import com.google.appengine.tools.remoteapi.RemoteApiOptions;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;
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

	taskQueue = Authorization.getTaskqeues(TASK_QUEUE_NAME);

	return taskQueue;
    }

    private int getTotalTasks() throws IOException
    {
	Taskqueue.Taskqueues.Get request = getTaskqueue().taskqueues().get(Globals.PROJECT_NAME, TASK_QUEUE_NAME);
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
	Taskqueue.Taskqueues.Get request = getTaskqueue().taskqueues().get(Globals.PROJECT_NAME, TASK_QUEUE_NAME);
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

	try
	{
	    closeResources();
	}
	catch (Exception e)
	{
	    logger.error("Error while uninstalling");
	}
	finally
	{
	    logger.info("Interupting thread : " + Thread.currentThread().getName());
	    // Interrupts the current tread
	    APIStats.interruptThread(Thread.currentThread());
	    logger.info("Exiting thread : " + Thread.currentThread().getName());
	}

	/*
	 * int total = getTotalTasks(); if (total > 0) { //
	 * threadPool.wakeUpAllThreads(); // }
	 */

    }

    RemoteApiInstaller installer = null;
    Delegate<Environment> threadLocalDelegate = null;

    private void uninstall()
    {
	if (threadLocalDelegate == null)
	    return;

	ApiProxy.setDelegate(threadLocalDelegate);
	// Uninstalls prefs
	installer.uninstall();
    }

    /**
     * Gets connector to access datastore remotely
     * 
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

	    try
	    {
		uninstall();
	    }
	    catch (Exception e)
	    {
		sendErrorEmail(e.getMessage());
		return;
	    }

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

	RemoteApiOptions options = new RemoteApiOptions().server(Globals.APPLICATION_ID + ".appspot.com", 443)
		.useApplicationDefaultCredential();
	installer.install(options);

	threadLocalDelegate = ApiProxy.getDelegate();

	remoteAPIInstalledTime = System.currentTimeMillis();

	logger.info("Installing prefs : " + remoteAPIInstalledTime + " In thread : " + Thread.currentThread().getName());

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

	if (Globals.MAX_REMOTE_API_VALIDITY_IN_HOURS > hours)
	    return false;

	return true;
    }

    private List<Task> leaseTasksFromAppengine()
    {
	Lease lease;
	try
	{
	    lease = getTaskqueue()
		    .tasks()
		    .lease(Globals.PROJECT_NAME, TASK_QUEUE_NAME, PullScheduler.DEFAULT_COUNT_LIMIT,
			    PullScheduler.DEFAULT_LEASE_PERIOD).set(Globals.GROUP_BY_TAG_PARAM, true);

	    APIStats.incrementCounter();
	    logger.info(lease.buildHttpRequestUrl().toString());
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
		    try
		    {
			System.out.println("waiting");
			wait(wairPeriodInMilliSeconds);
		    }
		    catch (InterruptedException e)
		    {
			logger.log(Level.WARN, e.getMessage() + ", " + Thread.currentThread().getName());
			// TODO Auto-generated catch block
			e.printStackTrace();
			wait(wairPeriodInMilliSeconds);
		    }
		    continue;
		}

		logger.info("fetched Tasks in Thread" + Thread.currentThread().getName() + " , " + " Total fetched : "
			+ localTask.size());

		TaskletThread t = new TaskletThread(localTask, TASK_QUEUE_NAME, taskQueue, logger);

		t.run();

	    } while (true && APIStats.shouldContinue());
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

    private synchronized boolean leaseTasksOld()
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
		return leaseTasksOld();
	    }
	    catch (InterruptedException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
		wait(wairPeriodInMilliSeconds);
		return leaseTasksOld();
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    logger.info(e.getMessage());
	    return leaseTasksOld();
	}
    }

    private void closeResources() throws Exception
    {
	uninstall();
    }

    public static void main(String[] args) throws IOException
    {
	TaskQueueStatsDaemon tqsd = new TaskQueueStatsDaemon("dummy");

	tqsd.setRemoteAPI();

	NamespaceManager.set("local");
	List<Contact> contacts = ContactUtil.getAll(10, null);
	for (int i = 0; i < contacts.size(); i++)
	{
	    Contact contact = contacts.get(i);
	    Long start = System.currentTimeMillis();
	    contact.save(true);
	    System.out.println("**********************################");
	    System.out.println("time : " + (System.currentTimeMillis() - start));
	}

    }
}
