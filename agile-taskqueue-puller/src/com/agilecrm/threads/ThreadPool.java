package com.agilecrm.threads;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import com.Globals;
import com.agilecrm.api.stats.APIStats;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.threads.pool.RemoteAPIThreadPoolExecutor;
import com.agilecrm.workflows.util.WorkflowUtil;
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
    // private static ThreadPoolExecutor poolExecutor = null;
    private String poolName = null;

    private static Map<String, ThreadPoolExecutor> threadPoolMap = new HashMap<String, ThreadPoolExecutor>();

    public static ThreadPoolExecutor getThreadPoolExecutor(String poolName, int minPoolSize, int maxPoolSize)
    {
	// Setting thread pool flag to stop thread interruption scheduled.
	APIStats.setThreadPoolFlag(true);

	if (threadPoolMap.containsKey(poolName))
	    return threadPoolMap.get(poolName);

	ThreadPool pool = new ThreadPool(poolName, minPoolSize, maxPoolSize);

	return threadPoolMap.get(poolName);
    }

    private ThreadPool(String poolName, int minPoolSize, int maxPoolSize)
    {

	ScalingAgileQueue<Runnable> blockingQueue = new ScalingAgileQueue<Runnable>(100);

	RemoteAPIThreadPoolExecutor poolExecutor = new RemoteAPIThreadPoolExecutor(minPoolSize, maxPoolSize, 5,
		TimeUnit.MILLISECONDS, blockingQueue);

	blockingQueue.setThreadPool(poolExecutor);

	poolExecutor.setRejectedExecutionHandler(new RejectionHandler());

	this.poolName = poolName;

	threadPoolMap.put(poolName, poolExecutor);

	System.out.println(threadPoolMap);

	// setUpThreadPool(poolName, poolExecutor);

	// poolExecutor.allowCoreThreadTimeOut(true);
    }

    private void setUpRemoteAPIOnAllThreads()
    {

	RemoteApiOptions options = new RemoteApiOptions().server(Globals.APPLICATION_ID + ".appspot.com", 443)
		.useApplicationDefaultCredential();

	RemoteApiInstaller installer = new RemoteApiInstaller();

	try
	{
	    installer.installOnAllThreads(options);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    private void setUpThreadPool(String threadPool, ThreadPoolExecutor executor)
    {
	ThreadPoolExecutor poolExecutorTemp = new ThreadPoolExecutor(1, 1, 10, TimeUnit.MINUTES,
		new ScalingAgileQueue<Runnable>(10));
	ThreadTester t = new ThreadTester(executor, threadPool);
	t.setName(threadPool);
	poolExecutorTemp.execute(t);
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
	for (int i = 1; i < 10; i++)
	{

	    ThreadPool.getThreadPoolExecutor("bulk-exporter-queue", 1, 5).execute(new Runnable()
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
			wait(10000);
			System.out.println("waiting completed in thread :" + Thread.currentThread().getName());
			contacts.get(0).save(false);

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
	     * ThreadExample t = new ThreadExample(); if (i % 2 == 0)
	     * ThreadPool.getThreadPoolExecutor("bulk-exporter-queue", 1,
	     * 15).execute(t); else
	     * ThreadPool.getThreadPoolExecutor("exporter-queue", 1,
	     * 30).execute(t);
	     */
	}

	/*
	 * new ThreadPool("tester", 1, 1).setUpThreadPool("tester",
	 * ThreadPool.getThreadPoolExecutor("bulk-exporter-queue", 1, 5));
	 */

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

    @Override
    public void run()
    {
	// System.out.println("test " + Thread.currentThread().getName() +
	// " time " + System.currentTimeMillis());
	System.out.println(Thread.currentThread());
	System.out.println("namespace from thread : " + NamespaceManager.get());
	// System.out.println(s);
	NamespaceManager.set("local");
	System.out.println(ContactUtil.getAllCompanies(2, null));
	List<Contact> contacts = ContactUtil.getAllContacts(1, null);
	contacts.get(0).save(true);

	System.out.println(ContactUtil.getAllCompanies(2, null));
	System.out.println(ContactUtil.getAllCompanies(2, null));
	System.out.println(WorkflowUtil.getAllWorkflows(1, null));
	NamespaceManager.set(null);
    }

}