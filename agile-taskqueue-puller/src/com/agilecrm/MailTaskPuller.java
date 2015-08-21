package com.agilecrm;

import java.io.IOException;
import java.util.List;

import com.google.api.services.taskqueue.model.Task;

public class MailTaskPuller implements Runnable
{

    @Override
    public void run()
    {
	// TODO Auto-generated method stub
	try
	{
	    getTasks();
	}
	catch (Exception e)
	{

	}

    }

    private List<Task> getTasks() throws IOException
    {

	return TaskUtil.leaseTasks("bulk-email-pull-queue", 300, 60 * 60);
    }
}
