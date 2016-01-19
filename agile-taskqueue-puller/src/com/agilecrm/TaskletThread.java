package com.agilecrm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.SerializationUtils;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import com.Globals;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.bulkaction.deferred.ContactExportPullTask;
import com.agilecrm.bulkaction.deferred.bulk.BigTask;
import com.agilecrm.contact.imports.CSVImporter;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.threads.ThreadPool;
import com.agilecrm.threads.Work;
import com.google.api.client.googleapis.batch.BatchRequest;
import com.google.api.client.googleapis.batch.json.JsonBatchCallback;
import com.google.api.client.googleapis.json.GoogleJsonError;
import com.google.api.client.http.HttpHeaders;
import com.google.api.services.taskqueue.Taskqueue;
import com.google.api.services.taskqueue.model.Task;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.cache.TriggerFutureHook;

public class TaskletThread implements Work
{
    List<Task> tasks;
    String queueName;
    Taskqueue taskqueue;
    Logger logger;

    public TaskletThread(List<Task> tasks, String queueName, Taskqueue taskqueue, Logger logger)
    {
	this.tasks = tasks;
	this.queueName = queueName;
	this.taskqueue = taskqueue;
	this.logger = logger;
    }

    @Override
    public void run()
    {

	// Check task it self contains finishing future tasks
	boolean isIndependentTask = false;

	try
	{
	    try
	    {
		// Set namespace
		NamespaceManager.set("remote_api");
	    }
	    catch (Exception e)
	    {
		System.out.println("Unable to set remote API");
	    }

	    System.out.println("Running leased tasks");
	    // TriggerFutureHook.install();
	    // System.out.println(Thread.currentThread().getName());
	    //

	    if (tasks.size() > 0 && isMailTask(tasks.get(0)))
	    {
		EmailGatewayUtil.sendMailsMailDeferredTask(convertTaskHandlestoMailDeferredTasks(tasks));
	    }
	    else
	    {
		for (Task task : tasks)
		{
		    DeferredTask deferredTask = convertResponseToDeferredTask(task);

		    System.out.println("Deferred Task : " + deferredTask);
		    System.out.println("instance of CSVImporter : " + (deferredTask instanceof CSVImporter));
		    if (deferredTask instanceof BigTask)
		    {
			isIndependentTask = true;
			ThreadPool.getThreadPoolExecutor("bulk-export-executor", 1, 5).execute(deferredTask);
			continue;
		    }
		    else if (deferredTask instanceof ContactExportPullTask)
		    {
			isIndependentTask = true;
			ThreadPool.getThreadPoolExecutor("export-executor", 2, 15).execute(deferredTask);
			continue;
		    }
		    else if (deferredTask instanceof CSVImporter)
		    {
			isIndependentTask = true;
			ThreadPool.getThreadPoolExecutor("import-executor", 1, 15).execute(deferredTask);
			continue;
		    }

		    if (deferredTask != null)
			deferredTask.run();
		}
	    }

	}
	catch (Exception e)
	{
	    logger.log(Level.ERROR, e.getMessage() + ", " + Thread.currentThread().getName());
	    e.printStackTrace();
	}
	finally
	{
	    try
	    {
		System.out.println("completing remaining reqests");
		if (!isIndependentTask)
		    TriggerFutureHook.completeAllPendingFutures();
		System.out.println("completed remaining requests");
	    }
	    catch (Exception e)
	    {
		logger.log(Level.ERROR, e.getMessage() + ", " + Thread.currentThread().getName());
		e.printStackTrace();
	    }

	    try
	    {
		System.out.println("Started Deleting requests");

		BatchRequest batchRequest = taskqueue.batch();
		for (Task task : tasks)
		{
		    try
		    {
			taskqueue.tasks().delete(Globals.APPLICATION_ID_TO_DELETE_TASKS, queueName, task.getId())
				.queue(batchRequest, getBatchCallback());
		    }

		    catch (Exception e)
		    {
			logger.log(Level.ERROR, e.getMessage() + ", " + Thread.currentThread().getName());
			e.printStackTrace();
			continue;
		    }
		}

		Long startTime = System.currentTimeMillis();
		batchRequest.execute();
		System.out.println("time to delete tasks " + tasks.size() + " t="
			+ (System.currentTimeMillis() - startTime));
	    }
	    catch (Exception e)
	    {
		logger.log(Level.ERROR, e.getMessage() + ", " + Thread.currentThread().getName());
		e.printStackTrace();
	    }

	}

    }

    private DeferredTask convertResponseToDeferredTask(Task task)
    {
	try
	{
	    System.out.println(task.getQueueName());
	    return (DeferredTask) SerializationUtils.deserialize(Base64
		    .decodeBase64(task.getPayloadBase64().getBytes()));
	}
	catch (Exception e)
	{
	    logger.error(e);
	    return null;
	}

    }

    private boolean isMailTask(Task handle)
    {
	DeferredTask task = convertResponseToDeferredTask(handle);
	if (task == null)
	    return false;

	return (task instanceof MailDeferredTask);
    }

    private JsonBatchCallback<Void> getBatchCallback()
    {
	return new JsonBatchCallback<Void>()
	{

	    @Override
	    public void onSuccess(Void arg0, HttpHeaders arg1) throws IOException
	    {
		// TODO Auto-generated method stub

	    }

	    @Override
	    public void onFailure(GoogleJsonError arg0, HttpHeaders arg1) throws IOException
	    {
		// TODO Auto-generated method stub

	    }

	};
    }

    private List<MailDeferredTask> convertTaskHandlestoMailDeferredTasks(List<Task> tasks)
    {
	List<MailDeferredTask> mailDeferredTasks = new ArrayList<MailDeferredTask>();
	for (Task handle : tasks)
	{
	    try
	    {
		MailDeferredTask mailDeferredTask = (MailDeferredTask) SerializationUtils.deserialize(Base64
			.decodeBase64(handle.getPayloadBase64().getBytes()));
		logger.info(mailDeferredTask.fromEmail + " Thread : " + Thread.currentThread().getName());

		mailDeferredTasks.add(mailDeferredTask);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	return mailDeferredTasks;
    }
}
