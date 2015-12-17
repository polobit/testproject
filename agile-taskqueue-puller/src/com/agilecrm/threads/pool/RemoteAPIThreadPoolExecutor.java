package com.agilecrm.threads.pool;

import java.io.IOException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import com.Globals;
import com.google.appengine.repackaged.com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.appengine.tools.remoteapi.RemoteApiInstaller;
import com.google.appengine.tools.remoteapi.RemoteApiOptions;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;
import com.googlecode.objectify.cache.TriggerFutureHook;

public class RemoteAPIThreadPoolExecutor extends ThreadPoolExecutor
{

    public RemoteAPIThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit,
	    BlockingQueue<Runnable> workQueue)
    {
	super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue);
	// TODO Auto-generated constructor stub
    }

    @Override
    protected void beforeExecute(Thread t, Runnable r)
    {
	setup(t);
	// TODO Auto-generated method stub
	super.beforeExecute(t, r);
    }

    protected void afterExecute(Runnable r, Throwable t)
    {
	super.afterExecute(r, t);
    };

    private void completePendingRequests()
    {
	// ApiProxy.setDelegate(threadLocalDelegate);
	System.out.println("Doing nothing as of now");
    }

    Runnable r;
    Delegate threadLocalDelegate = null;

    private static ThreadLocal<InstallerState> installerState = new ThreadLocal<InstallerState>();
    private RemoteApiOptions options = null;

    private RemoteApiOptions getRemoteAPIOptions()
    {
	if (options != null)
	{
	    return options;
	}

	options = new RemoteApiOptions().server(Globals.APPLICATION_ID + ".appspot.com", 443)
		.useApplicationDefaultCredential();

	return options;
    }

    private void setup(Thread t)
    {
	InstallerState state = null;
	synchronized (getClass())
	{

	    state = installerState.get();

	    if (state != null)
	    {
		return;
	    }

	    RemoteApiInstaller installer = new RemoteApiInstaller();
	    installer.logMethodCalls();
	    // installer.resetRpcCount();
	    try
	    {

		System.out.println("Thread : " + t.getName());
		System.out.println("api" + getRemoteAPIOptions());

		installer.install(getRemoteAPIOptions());
	    }
	    catch (IOException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	    try
	    {
		System.out.println(ApiProxy.getDelegate());

		// Install delegate with objectify
		TriggerFutureHook.install();
		System.out.println(ApiProxy.getDelegate() instanceof TriggerFutureHook);

		threadLocalDelegate = ApiProxy.getDelegate();

		state = new InstallerState(ApiProxy.getCurrentEnvironment(), installer, threadLocalDelegate,
			getRemoteAPIOptions());
		installerState.set(state);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

    }

    private static class InstallerState
    {
	private final Environment installedEnv;
	private final RemoteApiInstaller remoteApiInstaller;
	private final RemoteApiOptions options;
	private Long installedTime;
	private final Delegate remoteApiDelegate;

	private InstallerState(Environment installedEnv, RemoteApiInstaller remoteApiInstaller,
		Delegate remoteApiDelegate, RemoteApiOptions options)
	{
	    this.remoteApiDelegate = remoteApiDelegate;
	    this.remoteApiInstaller = remoteApiInstaller;
	    this.installedEnv = installedEnv;
	    this.installedTime = System.currentTimeMillis();
	    this.options = options;
	}

	boolean isInstalled()
	{
	    if (remoteApiInstaller != null)
		return true;

	    return false;
	}
    }

    public static void main(String[] args)
    {
	GoogleCredential credential;
	try
	{
	    for (int i = 0; i < 10; i++)
	    {
		System.out.println(new RemoteApiOptions().server(Globals.APPLICATION_ID + ".appspot.com", 443)
			.useApplicationDefaultCredential());
	    }
	    // ThreadPool.getThreadPoolExecutor(poolName, minPoolSize,
	    // maxPoolSize)
	    credential = GoogleCredential.getApplicationDefault();
	    System.out.println(credential.getExpirationTimeMilliseconds());
	    System.out.println(credential);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }
}
