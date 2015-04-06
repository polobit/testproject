package com.agilecrm.test;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.Globals;
import com.agilecrm.queues.backend.ModuleUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

public class NormalIntantiator extends HttpServlet
{

    private static final long serialVersionUID = 3514356575674655015L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
	
	String backends = Globals.NORMAL_BACKENDS;
	
	if(req.getParameter("b") != null)
	    backends = (String)req.getParameter("b");
	// By default, use 'bulk-actions-queue'
	String queueName = "bulk-actions-queue";
	String uri = "/normal-instantiator";

	Queue queue = QueueFactory.getQueue(queueName);
	TaskOptions taskOptions = null;

	/*
	 * If there are more than one argument in data then it is sent in
	 * requests
	 */
	taskOptions = TaskOptions.Builder.withUrl(uri).method(Method.POST);

	queue.addAsync(taskOptions);
	
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
	System.out.println("Posted to backends : " + ModuleUtil.getCurrentModuleName() + ": instance in" );
    }

}
