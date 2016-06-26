package com.agilecrm.threads;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import com.Globals;
import com.agilecrm.api.stats.APIStats;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.threads.pool.RemoteAPIThreadPoolExecutor;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.tools.remoteapi.RemoteApiInstaller;
import com.google.appengine.tools.remoteapi.RemoteApiOptions;
import com.google.apphosting.api.ApiProxy;

/**
 * 
 * @author yaswanth
 *
 */
public class ThreadPool
{
    private boolean isRemoteAPIInstalled = false;

    // private static ThreadPoolExecutor poolExecutor = null;
    private String poolName = null;

    private static Map<String, ThreadPoolExecutor> threadPoolMap = new HashMap<String, ThreadPoolExecutor>();

    public static ThreadPoolExecutor getThreadPoolExecutor(String poolName, int minPoolSize, int maxPoolSize)
    {
	// Setting thread pool flag to stop thread interruption scheduled.
	APIStats.setThreadPoolFlag(true);

	if (threadPoolMap.containsKey(poolName))
	    return threadPoolMap.get(poolName);

	new ThreadPool(poolName, minPoolSize, maxPoolSize);

	return threadPoolMap.get(poolName);
    }

    private ThreadPool(String poolName, int minPoolSize, int maxPoolSize)
    {

	ScalingAgileQueue<Runnable> blockingQueue = new ScalingAgileQueue<Runnable>(100);

	// Executor poolExecutor = Executors.newFixedThreadPool(maxPoolSize);
	RemoteAPIThreadPoolExecutor poolExecutor = new RemoteAPIThreadPoolExecutor(maxPoolSize, maxPoolSize, 10,
		TimeUnit.MINUTES, blockingQueue);

	blockingQueue.setThreadPool(poolExecutor);

	poolExecutor.setRejectedExecutionHandler(new RejectionHandler());

	this.poolName = poolName;

	threadPoolMap.put(poolName, poolExecutor);

	System.out.println(threadPoolMap);

	// setUpThreadPool(poolName, poolExecutor);

	poolExecutor.allowCoreThreadTimeOut(true);

	if (!isRemoteAPIInstalled)
	{
	    // SystemProperty.environment.set(SystemProperty.Environment.Value.Production);
	    setUpRemoteAPIOnAllThreads();

	    isRemoteAPIInstalled = true;
	}

    }

    private static void setUpRemoteAPIOnAllThreads()
    {
	RemoteApiOptions options = new RemoteApiOptions().server(Globals.APPLICATION_ID + ".appspot.com", 443)
		.useApplicationDefaultCredential();

	RemoteApiInstaller installer = new RemoteApiInstaller();

	try
	{

	    installer.installOnAllThreads(options);

	    /**
	     * This is a work around to make new version of remote api to work
	     * with old version of Objectify (3.1). We wrap the class to its
	     * parrent class to trick objectify to work as it is working on
	     * independent thread
	     */
	    com.agilecrm.remote.api.hook.TriggerFutureHook hook = new com.agilecrm.remote.api.hook.TriggerFutureHook(
		    ApiProxy.getDelegate());

	    ApiProxy.setDelegate(hook);
	    com.agilecrm.remote.api.hook.TriggerFutureHook.install();
	    System.out.println("Proxy : " + ApiProxy.getDelegate());
	    // TriggerFutureHook hook = new
	    // TriggerFutureHook(ApiProxy.getDelegate());

	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    private void setUpThreadPool(String threadPool, ThreadPoolExecutor executor)
    {

	ThreadPoolExecutor poolExecutorTemp = new ThreadPoolExecutor(1, 1, 5, TimeUnit.DAYS,
		new ScalingAgileQueue<Runnable>(10));
	ThreadTester t = new ThreadTester(executor, threadPool);
	t.setName(threadPool);
	poolExecutorTemp.execute(t);
    }

    public static int totalTasksPool()
    {
	int totalcount = 0;
	for (ThreadPoolExecutor executor : threadPoolMap.values())
	{
	    totalcount += executor.getQueue().size();
	}

	return totalcount;
    }

    public static boolean isRunning()
    {

	for (Entry<String, ThreadPoolExecutor> entry : threadPoolMap.entrySet())
	{
	    BlockingQueue<Runnable> queue = entry.getValue().getQueue();
	    if (queue.size() > 0)
	    {
		System.out.println("tasks size greater that zero");
		return true;
	    }

	    if (entry.getValue().getActiveCount() > 0)
	    {
		System.out.println("Active cores greater that zero");
		return true;
	    }

	}

	return false;
    }

    public synchronized static void main(String[] args)
    {

	new ThreadExample().run();

    }
}

class ThreadTester extends Thread
{
    ThreadPoolExecutor pool = null;
    String testerThreadName = null;
    Map<String, ThreadPoolExecutor> threadPoolMap = null;

    RemoteApiInstaller installer = null;

    public ThreadTester(Map<String, ThreadPoolExecutor> threadPoolMap)
    {
	this.threadPoolMap = threadPoolMap;
    }

    public ThreadTester(ThreadPoolExecutor pool, String testerThreadName)
    {
	this.pool = pool;
	this.testerThreadName = testerThreadName;

	// this.installer = installer;
	// TODO Auto-generated constructor stub
    }

    boolean uninstalled = false;

    public void checkThreads()
    {
	while (true)
	    try
	    {
		System.out.println("getting environment : " + ApiProxy.getCurrentEnvironment());
		remainingThreads();
	    }
	    catch (InterruptedException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
    }

    public void run()
    {
	checkThreads();
    }

    private synchronized void remainingThreads() throws InterruptedException
    {
	System.out.println("*********************************************************************" + " Thread name : "
		+ testerThreadName);

	System.out.println("----------------- active threads : " + pool.getActiveCount());

	// Prints status every 10 minutes
	wait(600);

	System.out.println("*********************************************************************" + " Thread name : "
		+ testerThreadName);
	System.out.println("----------------- active threads : " + pool.getActiveCount());
	System.out.println("is terminating : " + pool.isTerminating());
	System.out.println(pool.isShutdown());
	System.out.println(pool.getTaskCount());
	System.out.println(pool.getCompletedTaskCount());
	System.out.println(pool.getPoolSize());
	System.out.println("########################################################################");
	// System.out.println(pool.get);
    }
}

class ThreadExample implements Runnable
{
    public String s;

    private synchronized void test()
    {
	ThreadPoolExecutor pool = ThreadPool.getThreadPoolExecutor("bulk-exporter-queue", 1, 2);
	for (int i = 1; i < 30; i++)
	{

	    Future future = pool.submit(new Runnable()
	    {

		@Override
		public synchronized void run()
		{
		    try
		    {
			System.out.println("waiting in thread :" + Thread.currentThread().getName());
			NamespaceManager.set("local");
			List<Contact> contacts = ContactUtil.getAll(5, null);
			// wait(1800000);
			// wait(10000);
			System.out.println("waiting completed in thread :" + Thread.currentThread().getName());
			// contacts.get(0).save(false);

		    }
		    catch (Exception e)
		    {
			// TODO Auto-generated catch block
			e.printStackTrace();
		    }
		    // TODO Auto-generated method stub

		}
	    });

	    /*
	     * try { future. } catch (InterruptedException e) { // TODO
	     * Auto-generated catch block e.printStackTrace(); } catch
	     * (ExecutionException e) { // TODO Auto-generated catch block
	     * e.printStackTrace(); }
	     */
	    /*
	     * System.out.println("Task completed " + i); try {
	     * System.out.println("waiting"); System.gc(); if (i / 2 == 0)
	     * wait(2 * 1000); System.gc();
	     * System.out.println("wait completed"); } catch
	     * (InterruptedException e) { // TODO Auto-generated catch block
	     * e.printStackTrace(); }
	     */
	    /*
	     * ThreadExample t = new ThreadExample(); if (i % 2 == 0)
	     * ThreadPool.getThreadPoolExecutor("bulk-exporter-queue", 1,
	     * 15).execute(t); else
	     * ThreadPool.getThreadPoolExecutor("exporter-queue", 1,
	     * 30).execute(t);
	     */
	}
    }

    @Override
    public void run()
    {
	test();
    }

}