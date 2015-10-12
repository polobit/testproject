package com.agilecrm.threads;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import com.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.tools.remoteapi.RemoteApiInstaller;
import com.google.appengine.tools.remoteapi.RemoteApiOptions;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;
import com.googlecode.objectify.cache.TriggerFutureHook;

public class ThreadPool
{
    // private static ThreadPoolExecutor poolExecutor = null;
    private String poolName = null;

    private static Map<String, ThreadPoolExecutor> threadPoolMap = new HashMap<String, ThreadPoolExecutor>();

    public static ThreadPoolExecutor getThreadPoolExecutor(String poolName)
    {
	if (threadPoolMap.containsKey(poolName))
	    return threadPoolMap.get(poolName);

	ThreadPool pool = new ThreadPool(poolName);

	// pool.setUpRemoteAPIOnAllThreads();

	return threadPoolMap.get(poolName);
    }

    private ThreadPool(String poolName)
    {
	ThreadFactoryImpl timpl = new ThreadFactoryImpl();

	ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(2, 15, 5, TimeUnit.SECONDS,
		new ArrayBlockingQueue<Runnable>(100), timpl);

	this.poolName = poolName;

	threadPoolMap.put(poolName, poolExecutor);
	// poolExecutor.allowCoreThreadTimeOut(true);
    }

    private void setUpRemoteAPIOnAllThreads()
    {
	RemoteApiOptions options = new RemoteApiOptions().server(Globals.APPLICATION_ID + ".appspot.com", 443)
		.credentials(Globals.USER_ID, Globals.PASSWORD);

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

    public synchronized static void main(String[] args)
    {
	ThreadPoolExecutor executor = ThreadPool.getThreadPoolExecutor("export");
	for (int i = 0; i < 25; i++)
	{
	    ThreadExample te = new ThreadExample();
	    executor.execute(te);
	}

	new ThreadTester(executor).start();
    }
}

class ThreadTester extends Thread
{
    ThreadPoolExecutor pool = null;
    RemoteApiInstaller installer = null;

    public ThreadTester(ThreadPoolExecutor pool)
    {
	this.pool = pool;
	// this.installer = installer;
	// TODO Auto-generated constructor stub
    }

    boolean uninstalled = false;

    public void run()
    {
	for (int i = 10; i < 20; i++)
	    try
	    {
		System.out.println("iterating : " + i);
		remainingThreads();
	    }
	    catch (InterruptedException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	System.out.println(pool.shutdownNow());
    }

    private synchronized void remainingThreads() throws InterruptedException
    {

	System.out.println("intial actual count : " + pool.getActiveCount());
	wait(20000);
	System.out.println("----------------- active threads : " + pool.getActiveCount());
	System.out.println("is terminating : " + pool.isTerminating());
	System.out.println(pool.isShutdown());
	System.out.println(pool.getTaskCount());
	System.out.println(pool.getCompletedTaskCount());
	System.out.println(pool.getPoolSize());
	// System.out.println(pool.get);

	if (!uninstalled && pool.getPoolSize() == 0)
	{
	    installer.uninstall();
	    uninstalled = true;
	}

	System.out.println("----------------- active threads final : " + pool.getPoolSize());
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
	    installer.serializeCredentials();

	    installer.uninstall();
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
		.credentials(Globals.USER_ID, Globals.PASSWORD);

	installer = new RemoteApiInstaller();
	installer.logMethodCalls();

	try
	{
	    installer.install(options);

	    // TriggerFutureHook.install();
	    environment = ApiProxy.getCurrentEnvironment();
	    threadLocalDelegate = (ApiProxy.Delegate<ApiProxy.Environment>) ApiProxy.getDelegate();
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
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