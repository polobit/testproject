package com.agilecrm.ticket.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.agilecrm.contact.Tag;
import com.agilecrm.ticket.entitys.TicketBulkActionAttributes;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.utils.TicketBulkActionUtil;
import com.agilecrm.ticket.utils.TicketBulkActionUtil.TicketBulkActionType;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

/**
 * 
 * @author Sasi 30-Sep-2015
 * 
 */
@Path("/api/tickets/bulk-actions")
public class TicketBulkActionsRest
{
	@GET
	@Path("/change-assignee")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TicketGroups> getGroups()
	{
		return new TicketGroupRest().getGroups(false);
	}

	@GET
	@Path("/execute-workflow")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Workflow> getWorkflows()
	{
		return WorkflowUtil.getAllWorkflows();
	}

	@POST
	@Path("/manage-tags")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void addTags(@FormParam("action_type") TicketBulkActionType action_type, @FormParam("tags") List<Tag> tags,
			@FormParam("filter_id") Long filterID, @FormParam("ticket_ids") String ticketIDs,
			@FormParam("command") String command)
	{
		try
		{
			if (action_type == null || tags == null || (filterID == null && ticketIDs == null))
				throw new Exception("Required parameters missing.");

			String tagsString = "";
			for (Tag tag : tags)
				tagsString += tag.tag;

			TicketBulkActionUtil.postDataToBulkActionBackend(action_type, ticketIDs, Method.POST, filterID,
					MediaType.APPLICATION_FORM_URLENCODED,
					new JSONObject().put("tags", tagsString).put("command", command));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param assigneeID
	 * @param groupID
	 * @param filterID
	 * @param ticketIDs
	 * @throws Exception
	 */
	@POST
	@Path("/change-assignee")
	@Consumes(MediaType.APPLICATION_JSON)
	public void changeAssignee(TicketBulkActionAttributes fields) throws Exception
	{
		System.out.println("Request reached to frontend...");
		System.out.println("filterID.." + fields.filterID);
		System.out.println("ticket_ids.." + fields.ticketIDs);
		System.out.println("assignee_id.." + fields.assigneeID);
		System.out.println("groupID.." + fields.groupID);

		TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.CHANGE_ASSIGNEE, fields.ticketIDs,
				Method.POST, fields.filterID, MediaType.APPLICATION_FORM_URLENCODED,
				new JSONObject().put("assignee_id", fields.assigneeID).put("group_id", fields.groupID));
	}

	/**
	 * 
	 * @param assigneeID
	 * @param groupID
	 * @param filterID
	 * @param ticketIDs
	 * @throws Exception
	 */
	@POST
	@Path("/execute-workflow")
	@Consumes(MediaType.APPLICATION_JSON)
	public void executeWorkflow(TicketBulkActionAttributes fields) throws Exception
	{
		System.out.println("Request reached to frontend...");
		System.out.println("filterID.." + fields.filterID);
		System.out.println("ticket_ids.." + fields.ticketIDs);
		System.out.println("workflow_id.." + fields.workflowID);

		TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.EXECUTE_WORKFLOW, fields.ticketIDs,
				Method.POST, fields.filterID, MediaType.APPLICATION_FORM_URLENCODED,
				new JSONObject().put("workflow_id", fields.workflowID));
	}

	/**
	 * 
	 * @param filterID
	 * @param ticketIDs
	 * @throws Exception
	 */
	@POST
	@Path("/close-tickets")
	@Consumes(MediaType.APPLICATION_JSON)
	public void closeTickets(TicketBulkActionAttributes fields)
			throws Exception
	{
		System.out.println("Request reached to frontend...");
		System.out.println("filterID.." + fields.filterID);
		System.out.println("ticket_ids.." + fields.ticketIDs);

		TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.CLOSE_TICKET, fields.ticketIDs, Method.POST,
				fields.filterID, MediaType.APPLICATION_FORM_URLENCODED, new JSONObject());
	}

	/**
	 * 
	 * @param filterID
	 * @param ticketIDs
	 * @throws Exception
	 */
	@POST
	@Path("/delete-tickets")
	@Consumes(MediaType.APPLICATION_JSON)
	public void deleteTickets(TicketBulkActionAttributes fields)
			throws Exception
	{
		System.out.println("Request reached to frontend...");
		System.out.println("filterID.." + fields.filterID);
		System.out.println("ticket_ids.." + fields.ticketIDs);

		TicketBulkActionUtil.postDataToBulkActionBackend(TicketBulkActionType.DELETE, fields.ticketIDs, Method.POST, fields.filterID,
				MediaType.APPLICATION_FORM_URLENCODED, new JSONObject());
	}
}