package com.agilecrm.ticket.utils;

import java.util.Set;

import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.deferred.TicketBulkActionAdaptor;
import com.agilecrm.ticket.entitys.Tickets;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi on 17-Nov-2015
 * 
 */
public class TicketBulkActionUtil
{
	public static enum TicketBulkActionType
	{
		ADD_TAGS("/core/api/bulk-actions/tickets/manage-labels", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), REMOVE_TAGS(
				"/core/api/bulk-actions/tickets/manage-labels", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), CHANGE_ASSIGNEE(
				"/core/api/bulk-actions/tickets/change-assignee", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), EXECUTE_WORKFLOW(
				"/core/api/bulk-actions/tickets/execute-workflow", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), CLOSE_TICKET(
				"/core/api/bulk-actions/tickets/close-tickets", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), DELETE(
				"/core/api/bulk-actions/tickets/delete-tickets", AgileQueues.TICKET_BULK_ACTIONS_QUEUE);

		private String queue, url;

		TicketBulkActionType(String url, String queue)
		{
			this.url = url;
			this.queue = queue;
		}

		public String getUrl()
		{
			return url + "/" + SessionManager.get().getDomainId();
		}

		public String getQueue()
		{
			return queue;
		}
	}

	public static void postDataToBulkActionBackend(TicketBulkActionType actionType, String ticketIDs, Method type,
			Long filterID, String contentType, JSONObject dataJSON)
	{
		Queue queue = QueueFactory.getQueue(actionType.getQueue());

		String bulk_action_tracker = String.valueOf(BulkActionUtil.randInt(1, 10000));

		TaskOptions taskOptions = null;

		if (filterID != null)
			taskOptions = TaskOptions.Builder.withUrl(actionType.getUrl()).param("filter_id", filterID + "")
					.param("action_type", actionType.toString()).param("data", dataJSON.toString())
					.param("domain_user_id", SessionManager.get().getClaimedId()).param("tracker", bulk_action_tracker)
					.header("Content-Type", contentType).method(type);
		else
			taskOptions = TaskOptions.Builder.withUrl(actionType.getUrl()).param("ticket_ids", ticketIDs)
					.param("action_type", actionType.toString()).param("data", dataJSON.toString())
					.param("domain_user_id", SessionManager.get().getClaimedId()).param("tracker", bulk_action_tracker)
					.header("Content-Type", contentType).method(type);

		queue.addAsync(taskOptions);
	}

	public static void executeBulkAction(ITicketIdsFetcher idsFetcher, TicketBulkActionAdaptor task)
	{
		while (idsFetcher.hasNext())
		{
			Set<Key<Tickets>> ticketsSet = idsFetcher.next();

			System.out.println("ticketsSet found: " + ticketsSet.size());

			task.setTicketKeys(ticketsSet);
			
			Queue queue = QueueFactory.getQueue(AgileQueues.TICKET_BULK_ACTIONS_QUEUE);
			queue.add(TaskOptions.Builder.withPayload(task));
		}
	}
}
