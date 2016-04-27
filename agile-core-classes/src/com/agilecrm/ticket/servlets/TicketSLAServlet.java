package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.ticket.deferred.CheckTicketSLADeferred;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

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
				String oldNamespace = NamespaceManager.get();

				try
				{
					if (StringUtils.isBlank(namespace))
						continue;

					NamespaceManager.set(namespace);

					System.out.println("Namespace: " + namespace);

					// Execute ticket SLA only for pro plan users
					Subscription subscription = SubscriptionUtil.getSubscription();

					System.out.println("Pro plan: " + subscription.planLimits.checkTicketSLA());

					if (!subscription.planLimits.checkTicketSLA())
						continue;

					Set<Key<Tickets>> keys = TicketsUtil.getOverdueTickets();

					System.out.println("Ticket keys size: " + keys.size());

					if (keys == null || keys.size() == 0)
						continue;

					CheckTicketSLADeferred SLADeferred = new CheckTicketSLADeferred(namespace);

					// Add to queue
					Queue queue = QueueFactory.getQueue("ticket-bulk-actions");
					queue.add(TaskOptions.Builder.withPayload(SLADeferred));
				}
				catch (Exception e)
				{
					System.out.println(ExceptionUtils.getFullStackTrace(e));
				}
				finally
				{
					NamespaceManager.set(oldNamespace);
				}
			}

			System.out.println("Successfully tasks initiated for all domains.");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}
