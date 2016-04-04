package com.agilecrm.ticket.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.agilecrm.ticket.entitys.TicketBulkActionAttributes;
import com.agilecrm.ticket.utils.TicketBulkActionUtil;
import com.agilecrm.ticket.utils.TicketBulkActionUtil.TicketBulkActionType;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

/**
 * 
 * @author Sasi 30-Sep-2015
 * 
 */
@Path("/api/tickets/bulk-actions")
public class TicketBulkActionsRest
{
	/**
	 * 
	 * @param fields
	 */
	@POST
	@Path("/{action_type}")
	@Consumes(MediaType.APPLICATION_JSON)
	public void sendRequestToBackend(@PathParam("action_type") String actionType, TicketBulkActionAttributes fields)
	{
		try
		{
			System.out.println("...Request reached to frontend rest...");
			System.out.println("actionType: " + actionType);
			System.out.println("TicketBulkActionAttributes: " + fields);

			switch (actionType)
			{
				case "manage-labels":
					TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.MANAGE_LABELS,
							fields.ticketIDs, Method.POST, fields.conditions,
							new JSONObject().put("labels", fields.labels).put("command", fields.manage_lables));
					break;
				case "change-assignee":
					TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.CHANGE_ASSIGNEE,
							fields.ticketIDs, Method.POST, fields.conditions,
							new JSONObject().put("assignee_id", fields.assigneeID).put("group_id", fields.groupID));
					break;
				case "execute-workflow":
					TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.EXECUTE_WORKFLOW,
							fields.ticketIDs, Method.POST, fields.conditions,
							new JSONObject().put("workflow_id", fields.workflowID));
					break;
				case "close-tickets":
					TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.CLOSE_TICKET,
							fields.ticketIDs, Method.POST, fields.conditions, new JSONObject());
					break;
				case "delete-tickets":
					TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.DELETE, fields.ticketIDs,
							Method.POST, fields.conditions, new JSONObject());
					break;
				case "spam-tickets":
					TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.SPAM, fields.ticketIDs,
							Method.POST, fields.conditions, new JSONObject());
					break;
				case "favorite-tickets":
					TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.FAVORITE, fields.ticketIDs,
							Method.POST, fields.conditions, new JSONObject());
					break;
			}
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}