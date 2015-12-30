package com.agilecrm.ticket.utils;

import java.util.List;
import java.util.Set;

import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.deferred.TicketBulkActionAdaptor;
import com.agilecrm.ticket.entitys.TicketBulkActionAttributes;
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
		MANAGE_LABELS("/core/api/bulk-actions/tickets/manage-labels", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), CHANGE_ASSIGNEE(
				"/core/api/bulk-actions/tickets/change-assignee", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), EXECUTE_WORKFLOW(
				"/core/api/bulk-actions/tickets/execute-workflow", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), CLOSE_TICKET(
				"/core/api/bulk-actions/tickets/close-tickets", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), DELETE(
				"/core/api/bulk-actions/tickets/delete-tickets", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), SPAM(
				"/core/api/bulk-actions/tickets/spam-tickets", AgileQueues.TICKET_BULK_ACTIONS_QUEUE), FAVORITE(
				"/core/api/bulk-actions/tickets/favorite-tickets", AgileQueues.TICKET_BULK_ACTIONS_QUEUE);

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
			List<SearchRule> conditions, JSONObject dataJSON)
	{
		Queue queue = QueueFactory.getQueue(actionType.getQueue());

		// String bulk_action_tracker = String.valueOf(BulkActionUtil.randInt(1,
		// 10000));

		TicketBulkActionAttributes attributes = new TicketBulkActionAttributes(null, null, null, ticketIDs,
				dataJSON.toString(), conditions, actionType);

		TaskOptions taskOptions = TaskOptions.Builder.withUrl(actionType.getUrl())
				.payload(attributes.toString().getBytes(), "application/json;charset=utf-8")
				.header("Content-Type", "application/json;charset=utf-8").method(type);

		queue.addAsync(taskOptions);

		/*
		 * if (conditions != null) {
		 */
		/*
		 * taskOptions = TaskOptions.Builder.withUrl(actionType.getUrl()).param
		 * ("conditions", conditions.toString()).param("action_type",
		 * actionType.toString()).param("data", dataJSON.toString())
		 * .param("domain_user_id",
		 * SessionManager.get().getClaimedId()).param("tracker",
		 * bulk_action_tracker) .header("Content-Type",
		 * contentType).method(type);
		 */
		/*
		 * } else taskOptions =
		 * TaskOptions.Builder.withUrl(actionType.getUrl()).param("ticket_ids",
		 * ticketIDs) .param("action_type", actionType.toString()).param("data",
		 * dataJSON.toString()) .param("domain_user_id",
		 * SessionManager.get().getClaimedId()).param("tracker",
		 * bulk_action_tracker) .header("Content-Type",
		 * contentType).method(type);
		 */
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
