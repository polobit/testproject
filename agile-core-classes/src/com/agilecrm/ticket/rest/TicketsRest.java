package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.examples.HtmlToPlainText;
import org.jsoup.nodes.Document;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.TicketActivity;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketFilters;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketActivity.TicketActivityType;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.agilecrm.ticket.utils.TicketFiltersUtil;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi 30-Sep-2015
 * 
 */
@Path("/api/tickets")
public class TicketsRest
{
	/**
	 * 
	 * @param groupID
	 * @param cursor
	 * @param pageSize
	 * @param status
	 * @return list of tickets
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Tickets> getTicketsByGroup(@QueryParam("group_id") String groupID, @QueryParam("cursor") String cursor,
			@QueryParam("page_size") String pageSize, @QueryParam("status") String status)
	{
		try
		{
			if (StringUtils.isBlank(status))
				throw new Exception("Required paramaters missing.");

			// Set default group id if Group ID is null
			if (StringUtils.isBlank(groupID))
				groupID = TicketGroupUtil.getDefaultTicketGroup().id + "";

			List<Tickets> tickets = new ArrayList<Tickets>();

			if (StringUtils.equalsIgnoreCase(status, "starred"))
			{
				tickets = TicketsUtil.getFavoriteTickets(Long.parseLong(groupID), cursor, pageSize);
			}
			else
			{
				tickets = TicketsUtil.getTicketsByGroupID(Long.parseLong(groupID),
						Status.valueOf(status.toUpperCase()), cursor, pageSize, "-last_updated_time");
			}

			// Include Ticket Group Object
			tickets = TicketsUtil.inclGroupDetails(tickets);
			tickets = TicketsUtil.inclDomainUsers(tickets);

			return tickets;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param groupID
	 * @param cursor
	 * @param pageSize
	 * @param status
	 * @return list of tickets
	 */
	@GET
	@Path("/{id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Tickets getTicketByID(@PathParam("id") Long ticketID)
	{
		String oldnamespace = NamespaceManager.get();

		try
		{
			Tickets ticket = TicketsUtil.getTicketByID(ticketID);

			// Include Ticket Group Object
			ticket.group = TicketGroups.ticketGroupsDao.get(ticket.groupID);

			if (ticket.assignee_id != null)
			{
				NamespaceManager.set("");

				Key<DomainUser> userKey = new Key<DomainUser>(DomainUser.class, ticket.assigneeID);
				ticket.assignee = DomainUserUtil.dao.get(userKey);
			}

			return ticket;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
		finally
		{
			NamespaceManager.set(oldnamespace);
		}
	}

	/**
	 * Fetches tickets based on provided filter
	 * 
	 * @param cursor
	 * @param pageSize
	 * @return list of tickets
	 */
	@GET
	@Path("/filter")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Tickets> getTicketsByFilter(@QueryParam("filter_id") Long filterID,
			@QueryParam("cursor") String cursor, @QueryParam("page_size") String pageSize)
	{
		try
		{
			if (filterID == null)
				throw new Exception("Required paramaters missing.");

			TicketFilters filter = TicketFiltersUtil.getFilterById(filterID);

			String queryString = TicketFiltersUtil.getQueryFromConditions(filter.conditions);
			queryString = queryString.substring(0, queryString.lastIndexOf("AND"));

			JSONObject resultJSON = new TicketsDocument().searchDocuments(queryString.trim(), cursor);

			System.out.println("query: " + queryString);

			JSONArray keysArray = resultJSON.getJSONArray("keys");

			List<Key<Tickets>> keys = new ArrayList<Key<Tickets>>();

			for (int i = 0; i < keysArray.length(); i++)
				keys.add((Key<Tickets>) keysArray.get(i));

			List<Tickets> tickets = Tickets.ticketsDao.fetchAllByKeys(keys);

			if (tickets.size() > 0)
			{
				tickets = TicketsUtil.inclGroupDetails(tickets);
				tickets = TicketsUtil.inclDomainUsers(tickets);
			}

			return tickets;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param groupID
	 * @param cursor
	 * @param pageSize
	 * @param status
	 * @return list of tickets
	 */
	@GET
	@Path("/count")
	@Produces(MediaType.APPLICATION_JSON)
	public String getTicketsCountByType(@QueryParam("group_id") String groupID, @QueryParam("status") String status)
	{
		try
		{
			// Set default group id if Group ID is null
			if (groupID == null)
			{
				groupID = TicketGroupUtil.getDefaultTicketGroup().id + "";
			}

			int count = StringUtils.equalsIgnoreCase(status, "starred") ? TicketsUtil.getFavoriteTicketsCount(Long
					.parseLong(groupID)) : TicketsUtil.getTicketsCountByType(Long.parseLong(groupID),
					Status.valueOf(status));

			return new JSONObject().put("count", count).toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param groupID
	 * @param cursor
	 * @param pageSize
	 * @param status
	 * @return list of tickets
	 */
	@GET
	@Path("/fitered-tickets-count")
	@Produces(MediaType.APPLICATION_JSON)
	public String getFilteredTicketsCount(@QueryParam("filter_id") Long filterID)
	{
		try
		{
			TicketFilters filter = TicketFiltersUtil.getFilterById(filterID);

			String queryString = TicketFiltersUtil.getQueryFromConditions(filter.conditions);
			queryString = queryString.substring(0, queryString.lastIndexOf("AND"));

			System.out.println("queryString: " + queryString);

			return new JSONObject().put("count", new TicketsDocument().getTicketsCount(queryString)).toString();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @return JSONArray of Groups and Assignee to show in modal for selection.
	 */
	@GET
	@Path("/new-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TicketGroups> listGroupsForNewTicket()
	{
		try
		{
			List<TicketGroups> groups = TicketGroupUtil.getAllGroups();

			List<DomainUser> domainUsers = DomainUserUtil.getAllAdminUsers(NamespaceManager.get());

			for (TicketGroups group : groups)
			{
				List<DomainUser> groupUsers = new ArrayList<DomainUser>();

				for (DomainUser domainUser : domainUsers)
				{
					if (group.agents_keys.contains(domainUser.id))
						groupUsers.add(domainUser);
				}

				group.group_users = groupUsers;
			}

			return groups;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * @return list of ticket activitys
	 */
	@GET
	@Path("/activity")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TicketActivity> listTicketActivitys(@QueryParam("id") Long ticketID)
	{
		try
		{
			List<TicketActivity> activitys = new TicketActivity().getActivityByTicketId(ticketID);

			if (activitys == null || activitys.size() == 0)
				return new ArrayList<TicketActivity>();

			Tickets ticket = TicketsUtil.getTicketByID(ticketID);

			Map<Long, TicketGroups> groupsList = new HashMap<Long, TicketGroups>();
			Map<Long, DomainUser> assigneeList = new HashMap<Long, DomainUser>();

			for (TicketActivity activity : activitys)
			{
				switch (activity.ticket_activity_type)
				{
				case TICKET_ASSIGNED:
				{
					Long assigneeID = Long.parseLong(activity.new_data);

					if (!assigneeList.containsKey(assigneeID))
					{

						DomainUser temp = DomainUserUtil.getDomainUser(assigneeID);

						if (temp != null)
							assigneeList.put(assigneeID, temp);
					}

					activity.new_assignee = assigneeList.get(assigneeID);
					break;
				}
				case TICKET_ASSIGNEE_CHANGED:
				{
					Long newAssigneeID = Long.parseLong(activity.new_data);
					Long oldAssigneeID = Long.parseLong(activity.old_data);

					if (!assigneeList.containsKey(newAssigneeID))
					{

						DomainUser temp = DomainUserUtil.getDomainUser(newAssigneeID);

						if (temp != null)
							assigneeList.put(newAssigneeID, temp);
					}

					if (!assigneeList.containsKey(oldAssigneeID))
					{

						DomainUser temp = DomainUserUtil.getDomainUser(oldAssigneeID);

						if (temp != null)
							assigneeList.put(oldAssigneeID, temp);
					}

					activity.new_assignee = assigneeList.get(newAssigneeID);
					activity.old_assignee = assigneeList.get(oldAssigneeID);
					break;
				}
				case TICKET_GROUP_CHANGED:

					Long newGroupID = Long.parseLong(activity.new_data);
					Long oldGroupID = Long.parseLong(activity.old_data);
					
					if(activity.old_data != null)
					if (!groupsList.containsKey(newGroupID))
					{

						TicketGroups group = TicketGroupUtil.getTicketGroupById(newGroupID);

						if (group != null)
							groupsList.put(newGroupID, group);
					}

					if (!groupsList.containsKey(oldGroupID))
					{

						TicketGroups group = TicketGroupUtil.getTicketGroupById(oldGroupID);

						if (group != null)
							groupsList.put(oldGroupID, group);
					}

					activity.new_group = groupsList.get(newGroupID);
					activity.old_group = groupsList.get(oldGroupID);
					break;
				}
			}

			// Including contact in each activity
			if (ticket.contactID != null)
			{
				Contact contact = ContactUtil.getContact(ticket.contactID);

				for (TicketActivity activity : activitys)
					activity.contact = contact;
			}

			return activitys;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Creates new ticket from dashboard
	 * 
	 * @param ticket
	 * @return newly created ticket
	 */
	@POST
	@Path("/new-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets createTicket(Tickets ticket)
	{
		try
		{
			String html_text = ticket.html_text;

			if (StringUtils.isBlank(html_text))
				throw new Exception("Please provide message body.");

			Long groupID = ticket.groupID, assigneeID = ticket.assigneeID;

			// Converting html text to plain with jsoup
			Document doc = Jsoup.parse(html_text, "UTF-8");
			String plain_text = new HtmlToPlainText().getPlainText(doc);

			// Creating new Ticket in Ticket table
			ticket = TicketsUtil.createTicket(groupID, assigneeID, ticket.requester_name, ticket.requester_email,
					ticket.subject, ticket.cc_emails, plain_text, ticket.status, ticket.type, ticket.priority,
					ticket.source, ticket.attachments_exists, "", ticket.tags);

			// Creating new Notes in TicketNotes table
			TicketNotesUtil.createTicketNotes(ticket.id, groupID, assigneeID, CREATED_BY.REQUESTER,
					ticket.requester_name, ticket.requester_email, plain_text, html_text, NOTE_TYPE.PUBLIC,
					new ArrayList<TicketDocuments>());

			ticket.groupID = ticket.group_id.getId();

			return ticket;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * changes ticket status
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return returns success json
	 */
	@PUT
	@Path("/change-status")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets changeStatus(@QueryParam("id") Long ticketID, @QueryParam("status") Status status)
	{
		try
		{
			if (ticketID == null && status == null)
				throw new Exception("Required parameters missing.");

			return TicketsUtil.changeStatus(ticketID, status);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * @param group_id
	 * @param assignee_id
	 * @return returns updated ticket object
	 */
	@PUT
	@Path("/change-group")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets changeGroup(@QueryParam("id") Long ticketID, @QueryParam("group_id") Long groupID)
	{
		try
		{
			if (ticketID == null && groupID == null)
				throw new Exception("Required parameters missing.");

			return TicketsUtil.changeGroup(ticketID, groupID);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Assigns Ticket to given domain user and ticket group
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return returns updated ticket object
	 */
	@PUT
	@Path("/assign-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets assignTicket(@QueryParam("ticket_id") Long ticketID, @QueryParam("assignee_id") Long assigneeID,
			@QueryParam("group_id") Long groupID)
	{
		try
		{
			if (ticketID == null || assigneeID == null || groupID == null)
				throw new Exception("Required parameters missing.");

			return TicketsUtil.changeGroupAndAssignee(ticketID, groupID, assigneeID);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param ticket_id
	 * @param priority
	 * @return
	 */
	@PUT
	@Path("/change-ticket-type")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets changeTicketType(@QueryParam("id") Long id, @QueryParam("type") Type ticketType)
	{
		try
		{
			if (ticketType == null)
				throw new Exception("Required parameters missing.");

			return TicketsUtil.changeTicketType(id, ticketType);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param ticket_id
	 * @param priority
	 * @return
	 */
	@PUT
	@Path("/change-priority")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets changePriority(@QueryParam("id") Long id, @QueryParam("priority") Priority priority)
	{
		try
		{
			if (id == null || priority == null)
				throw new Exception("Required parameters missing.");

			return TicketsUtil.changePriority(id, priority);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param ticket_id
	 * @param is_starred
	 * @return
	 */
	@PUT
	@Path("/make-favorite")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets makeFavorite(Tickets ticket)
	{
		try
		{
			if (ticket == null || ticket.is_favorite == null)
				throw new Exception("Required parameters missing.");

			return TicketsUtil.markFavorite(ticket.id, ticket.is_favorite);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param ticket_id
	 * @return
	 */
	@PUT
	@Path("/mark-solved")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets closeTicket(Tickets ticket)
	{
		try
		{
			if (ticket == null || ticket.id == null)
				throw new Exception("Required parameter missing.");

			return TicketsUtil.closeTicket(ticket.id);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param ticket_id
	 * @return
	 */
	@PUT
	@Path("/update-tags")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets updateTags(@QueryParam("command") String command, @QueryParam("tag") Tag tag,
			@QueryParam("id") Long ticketID)
	{
		try
		{
			if (ticketID == null)
				throw new Exception("Required parameter missing.");

			return TicketsUtil.updateTags(ticketID, tag, command);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param ticket_id
	 * @return
	 */
	@PUT
	@Path("/delete-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteTicket(@QueryParam("id") Long ticketID)
	{
		try
		{
			if (ticketID == null)
				throw new Exception("Required parameter missing.");

			TicketsUtil.deleteTicket(ticketID);

			return new JSONObject().put("status", "success").toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @return
	 * @throws JSONException
	 */
	// @GET
	// @Path("/create-test-ticket")
	// @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	// public String createTicket() throws JSONException
	// {
	// try
	// {
	// TicketGroups group = TicketGroupUtil.getDefaultTicketGroup();
	//
	// String message =
	// "Hi!..\r\n\r\nThis is test message. Please ignore.\r\n\r\nThank you\r\nSasi Krishna";
	//
	// // Creating new Ticket in Ticket table
	// Tickets ticket = TicketsUtil.createTicket(group.id, true, "Sasi",
	// "sasi@clickdesk.com",
	// "Test ticket created from rest method", "", message, Source.EMAIL, true,
	// "[142.152.23.23]");
	//
	// // Creating new Notes in TicketNotes table
	// TicketNotesUtil.createTicketNotes(ticket.id, group.id, ticket.assigneeID,
	// CREATED_BY.REQUESTER, "Sasi",
	// "sasi@clickdesk.com", message, message, NOTE_TYPE.PUBLIC, new
	// ArrayList<String>());
	// }
	// catch (Exception e)
	// {
	// System.out.println(ExceptionUtils.getFullStackTrace(e));
	// throw new
	// WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
	// .build());
	// }
	//
	// return new JSONObject().put("status", "success").toString();
	// }
}