package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.tasks.TicketsDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>TicketWebhook</code> is the root class for handling inbound events from
 * Mandrill. Mandrill posts the inbound event data to this servlet. Inbound data
 * format can be found below.
 * 
 * @author Sasi on 28-Sep-2015
 * @see {@link TicketsDeferredTask}
 * @see <a
 *      href="https://mandrill.zendesk.com/hc/en-us/articles/205583197-Inbound-Email-Processing-Overview#inbound-events-format">Mandrill Inbound data format</a>
 * 
 */
public class TicketWebhook extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter pw = response.getWriter();
		pw.write("Get");
		System.out.println("Get method called..");
		// doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			String mandrillResponse = request.getParameter("mandrill_events");

			System.out.println("MandrillResponse: " + mandrillResponse);

			if (StringUtils.isBlank(mandrillResponse))
				return;

			TicketsDeferredTask task = new TicketsDeferredTask(mandrillResponse);
			task.run();
			
//			// Initialize task here
//			Queue queue = QueueFactory.getQueue("tickets-queue");
//
//			// Create Task and push it into Task Queue
//			TaskOptions taskOptions = TaskOptions.Builder.withPayload(task);
//
//			queue.add(taskOptions);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}
}
