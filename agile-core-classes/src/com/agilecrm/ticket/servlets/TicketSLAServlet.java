package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.rest.CheckTicketSLADeferred;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * 
 * @author Mantra
 * 
 */
public class TicketSLAServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void service(HttpServletRequest request, HttpServletResponse res) throws IOException
	{
		try
		{
			Set<String> domains = NamespaceUtil.getAllNamespaces();
			
			System.out.println("Domains found: " + domains.size());
			
			for (String namespace : domains)
			{
				CheckTicketSLADeferred SLADeferred = new CheckTicketSLADeferred(namespace);
				
				// Add to queue
				Queue queue = QueueFactory.getQueue("ticket-bulk-actions");
				queue.add(TaskOptions.Builder.withPayload(SLADeferred));
			}
			
			System.out.println("Successfully tasks initiated for all domains.");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}
