package com.agilecrm.threads;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import com.Globals;
import com.agilecrm.api.stats.APIStats;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.google.appengine.tools.remoteapi.RemoteApiInstaller;
import com.google.appengine.tools.remoteapi.RemoteApiOptions;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;
import com.googlecode.objectify.cache.TriggerFutureHook;

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

    private ThreadFactoryImpl timpl = new ThreadFactoryImpl();

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

	ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(minPoolSize, maxPoolSize, 5, TimeUnit.MILLISECONDS,
		blockingQueue, timpl);

	blockingQueue.setThreadPool(poolExecutor);

	poolExecutor.setRejectedExecutionHandler(new RejectionHandler());

	this.poolName = poolName;

	threadPoolMap.put(poolName, poolExecutor);

	System.out.println(threadPoolMap);

	setUpThreadPool(poolName, poolExecutor);

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
	ThreadPoolExecutor poolExecutorTemp = new ThreadPoolExecutor(1, 1, 5, TimeUnit.MINUTES,
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

	    ThreadPool.getThreadPoolExecutor("bulk-exporter-queue", 1, 1).execute(new Runnable()
	    {

		@Override
		public synchronized void run()
		{
		    try
		    {
			System.out.println("waiting in thread :" + Thread.currentThread().getName());
			NamespaceManager.set("local");
			wait(10000);
			List<Contact> contacts = ContactUtil.getAll(5, null);
			contacts.get(0).save(false);

		    }
		    catch (InterruptedException e)
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
	wait(600000);
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

class ThreadFactoryImpl implements ThreadFactory
{

    @Override
    public Thread newThread(Runnable r)
    {
	// TODO Auto-generated method stub
	return new RemoteAPISetupThread(r);
    }
}

class RemoteAPISetupThread extends Thread
{
    Runnable r;
    Delegate<ApiProxy.Environment> threadLocalDelegate = null;
    RemoteApiInstaller installer = null;

    RemoteAPISetupThread(Runnable r)
    {
	this.r = r;
    }

    private void uninstall()
    {
	System.out.println("uninstalling ----------threadLocalDelegate" + "-----" + Thread.currentThread().getName());

	// System.out.println(threadLocalDelegate.getClass());

	System.out.println(environment);

	// ApiProxy.setEnvironmentForCurrentThread(environment);
	ApiProxy.setDelegate(threadLocalDelegate);
	System.out.println("****** Environment ******");
	System.out.println(environment.getClass());
	System.out.println(environment.getAppId());
	System.out.println(environment.getEmail());
	System.out.println(environment.getModuleId());
	System.out.println(environment.isAdmin());
	System.out.println(environment.isLoggedIn());
	System.out.println(environment.getAttributes());
	// Uninstalls prefs
	TriggerFutureHook.completeAllPendingFutures();
	try
	{
	    // installer.serializeCredentials();

	    // installer.uninstall();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(installer.getRpcCount());
	}

    }

    Environment environment = null;

    public void setupremoteapi()
    {
	// System.out.println("((((((((((((((((((((____))))))))))))))))))) installing");
	RemoteApiOptions options = new RemoteApiOptions().server(Globals.APPLICATION_ID + ".appspot.com", 443)
		.useApplicationDefaultCredential();
	try
	{
	    System.out.println(SystemProperty.environment.value());
	    ClassLoader.getSystemClassLoader().loadClass(TriggerFutureHook.class.getName());

	}
	catch (ClassNotFoundException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	installer = new RemoteApiInstaller();
	installer.logMethodCalls();

	try
	{

	    installer.install(options);

	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	try
	{
	    // Install delegate with objectify
	    TriggerFutureHook.install();
	    System.out.println(ApiProxy.getDelegate());
	    System.out.println(ApiProxy.getDelegate() instanceof TriggerFutureHook);

	    environment = ApiProxy.getCurrentEnvironment();
	    threadLocalDelegate = (ApiProxy.Delegate<ApiProxy.Environment>) ApiProxy.getDelegate();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	// threadLocalDelegate = ApiProxy.getDelegate();
    }

    public void run()
    {
	System.out.println("Remote api setting up in thread thread pool: " + Thread.currentThread().getName());
	setupremoteapi();

	r.run();
	System.out.println("uninstalling remote api in thread : " + Thread.currentThread().getName());
	// System.out.println("Total operations : " + installer.getRpcCount());
	// System.out.println("after uninstalling 1: " +
	// ApiProxy.getDelegate());
	uninstall();
	// System.out.println(ApiProxy.getCurrentEnvironment());
	// threadLocalDelegate = ApiProxy.getDelegate();

	// System.out.println("after uninstalling 2: " +
	// ApiProxy.getDelegate());

	// uninstall();

	// System.out.println("after uninstalling 3: " +
	// ApiProxy.getDelegate());
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