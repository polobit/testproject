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
import com.agilecrm.ticket.entitys.TicketGroups;
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
	@GET
	@Path("/change-assignee")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TicketGroups> getGroups()
	{
		return new TicketGroupRest().getGroups();
	}

	@POST
	@Path("/add-tags")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void addTags(@FormParam("action_type") TicketBulkActionType action_type, @FormParam("tags") List<Tag> tags,
			@FormParam("filter_id") Long filterID, @FormParam("ticket_ids") String ticketIDs)
	{
		try
		{
			if (action_type == null || tags == null || (filterID == null && ticketIDs == null))
				throw new Exception("Required parameters missing.");

			String tagsString = "";
			for (Tag tag : tags)
				tagsString += tag.tag;

			TicketBulkActionUtil.postDataToBulkActionBackend(action_type, ticketIDs, Method.POST, filterID,
					MediaType.APPLICATION_FORM_URLENCODED, new JSONObject().put("tags", tagsString));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@POST
	@Path("/remove-tags")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void removeTags(@FormParam("action_type") TicketBulkActionType action_type,
			@FormParam("tags") List<Tag> tags, @FormParam("filter_id") Long filterID,
			@FormParam("ticket_ids") String ticketIDs) throws Exception
	{
		System.out.println("Request reached to frontend...");
		System.out.println("filterID.." + filterID);
		System.out.println("action_type.." + action_type);
		System.out.println("ticket_ids.." + ticketIDs);
		System.out.println("tags.." + tags);

		TicketBulkActionUtil.postDataToBulkActionBackend(action_type, ticketIDs, Method.POST, filterID,
				MediaType.APPLICATION_FORM_URLENCODED, new JSONObject().put("data", tags));
	}
}
