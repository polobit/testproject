package com.agilecrm.imports;

import java.io.IOException;

import com.Globals;
import com.agilecrm.contact.upload.blob.status.specifications.StatusProcessor;
import com.agilecrm.threads.ThreadPool;
import com.auth.Authorization;
import com.google.api.services.taskqueue.Taskqueue;
import com.google.api.services.taskqueue.model.TaskQueue;
import com.google.api.services.taskqueue.model.TaskQueue.Stats;

/**
 * Import processor to build status
 * 
 * @author yaswanth
 *
 * @param <T>
 */
public class ImportStatusProcessor<T> implements StatusProcessor<T>
{
    private String TASK_QUEUE_NAME = getTaskQueueName() == null ? "dummy-pull-queue" : getTaskQueueName();
    private Taskqueue taskQueue = null;
    private int totalCount = 0;

    @Override
    public T getStatus()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public void setCount(int i)
    {
	// TODO Auto-generated method stub
	totalCount = i;
    }

    public boolean shouldSendDelayMessage()
    {
	System.out.println("in should continue " + totalCount);
	if (totalCount > 10)
	{
	    return true;
	}
	else if (ThreadPool.totalTasksPool() > 50)
	{
	    return true;
	}
	else
	{
	    try
	    {
		if (getTotalTasks() > 100)
		    return true;
	    }
	    catch (IOException e)
	    {
		e.printStackTrace();
		return false;
	    }
	}

	return false;
    }

    private Taskqueue getTaskqueue()
    {

	if (taskQueue != null)
	    return taskQueue;

	taskQueue = Authorization.getTaskqeues("contact-import-queue");

	return taskQueue;
    }

    private int getTotalTasks() throws IOException
    {

	try
	{
	    Taskqueue.Taskqueues.Get request = getTaskqueue().taskqueues().get(Globals.PROJECT_NAME,
		    "contact-import-queue");
	    request.setGetStats(true);

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

    @Override
    public void setTaskQueue(String taskName)
    {
	// TODO Auto-generated method stub
	this.TASK_QUEUE_NAME = taskName;

    }

    @Override
    public String getTaskQueueName()
    {
	// TODO Auto-generated method stub
	return TASK_QUEUE_NAME;
    }
}
