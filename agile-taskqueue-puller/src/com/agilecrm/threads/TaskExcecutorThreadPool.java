package com.agilecrm.threads;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

import com.Globals;
import com.google.appengine.tools.remoteapi.RemoteApiInstaller;
import com.google.appengine.tools.remoteapi.RemoteApiOptions;

public class TaskExcecutorThreadPool
{
    private BlockingQueue<Work> taskQueue = null;
    private List<TaskExecutorThread> threads = new ArrayList<TaskExecutorThread>();
    private boolean isStopped = false;
    private int taskRunnableRate;

    public boolean canAddMore()
    {
	if (threads.isEmpty())
	    return true;

	if (threads.size() < this.taskRunnableRate)
	    return true;

	return false;
    }

    public TaskExcecutorThreadPool(int numberOfThreads, int taskRunnableRate)
    {
	this.taskRunnableRate = taskRunnableRate;
	taskQueue = new ArrayBlockingQueue<Work>(taskRunnableRate);

	for (int i = 0; i < numberOfThreads; i++)
	{
	    TaskExecutorThread t = new TaskExecutorThread(taskQueue);
	    threads.add(t);
	}

	for (TaskExecutorThread thread : threads)
	{
	    thread.start();
	}
    }

    public void wakeUpAllThreads()
    {
	for (TaskExecutorThread thread : threads)
	{
	    if (thread.isInterrupted())
		continue;

	    threads.add(new TaskExecutorThread(taskQueue));
	}
    }

    public synchronized void enqueue(Work work)
    {
	taskQueue.add(work);
    }

    public int getPendingTasksCount()
    {
	return taskQueue.size();
    }

}

class TaskExecutorThread extends Thread
{
    static RemoteApiInstaller installer = null;
    private BlockingQueue<Work> taskQueue;

    private boolean isStopped = false;

    TaskExecutorThread(BlockingQueue<Work> taskQueue)
    {
	this.taskQueue = taskQueue;
    }

    public boolean shouldContinue()
    {
	return !isStopped;
    }

    int attempt = 0;

    public boolean shouldInterrupt()
    {
	return attempt > 5;
    }

    private void reset()
    {
	isStopped = false;
	attempt = 0;
    }

    @Override
    public void run()
    {

	RemoteApiOptions options = new RemoteApiOptions().server(Globals.APPLICATION_ID + ".appspot.com", 443)
		.credentials(Globals.USER_ID, Globals.PASSWORD);

	// CachingRemoteApiInstaller installer = new
	// CachingRemoteApiInstaller();

	RemoteApiInstaller installer = new RemoteApiInstaller();

	try
	{
	    installer.install(options);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	reset();

	// NamespaceManager.set("remote_api");
	// ObjectifyGenericDao<Contact> contactDao = new
	// ObjectifyGenericDao<Contact>(Contact.class);

	// System.out.println(NamespaceManager.get());

	// System.out.println(ApiProxy.getCurrentEnvironment());
	while (true)
	{
	    Work work = taskQueue.poll();
	    if (work == null)
	    {
		try
		{
		    work = taskQueue.poll(60, TimeUnit.SECONDS);
		    ++attempt;
		}
		catch (InterruptedException e)
		{
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		    // isStopped = false;
		}
	    }
	    else
	    {
		attempt = 0;

	    }
	    if (work != null)
		work.run();
	}

	// doStop();
    }

    public synchronized void doStop()
    {
	isStopped = true;
	this.interrupt(); // break pool thread out of dequeue() call.
    }

}
