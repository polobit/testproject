package com.agilecrm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.Globals;
import com.auth.Authorization;
import com.google.api.services.taskqueue.Taskqueue;
import com.google.api.services.taskqueue.Taskqueue.Tasks;
import com.google.api.services.taskqueue.Taskqueue.Tasks.Lease;
import com.google.api.services.taskqueue.model.Task;

public class TaskUtil
{
    public static List<Task> leaseTasks(String taskName, int numberOfTasks, int leaseTime) throws IOException
    {
	Taskqueue queue = Authorization.getTaskqeues(taskName);

	// TaskQueue taskQueue = getQueue(queue);

	Tasks tasksCollection = queue.tasks();

	Lease lease = tasksCollection.lease(Globals.PROJECT_NAME, taskName, numberOfTasks, leaseTime);

	com.google.api.services.taskqueue.model.Tasks tasks = lease.execute();

	if (tasks == null || tasks.size() == 0)
	{
	    return new ArrayList<Task>();
	}

	return tasks.getItems();
    }

    public static List<Task> processLease(Lease lease)
    {
	if (lease == null)
	{
	    return new ArrayList<Task>();
	}

	try
	{
	    com.google.api.services.taskqueue.model.Tasks tasks = lease.execute();

	    if (tasks == null || tasks.size() == 0)
	    {
		return new ArrayList<Task>();
	    }

	    tasks.getItems();
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block

	}

	return new ArrayList<Task>();
    }
}
