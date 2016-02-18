package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
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
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketFilters;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.TicketWorkflow;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.CreatedBy;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.agilecrm.ticket.utils.TicketFiltersUtil;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
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
	 * @return
	 */
	@GET
	@Path("/count")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getTicketsCount()
	{
		try
		{
			return new JSONObject().put("count", Tickets.ticketsDao.count()).toString();
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
	public List<Tickets> getFilteredTickets(@QueryParam("filter_id") Long filterID,
			@QueryParam("custom_filters") String customFiltersString, @QueryParam("cursor") String cursor,
			@QueryParam("page_size") Integer pageSize, @QueryParam("global_sort_key") String sortField)
	{
		try
		{
			if (filterID == null)
				throw new Exception("Required paramaters missing.");

			TicketFilters filter = TicketFiltersUtil.getFilterById(filterID);

			List<SearchRule> customFilters = new ObjectMapper().readValue(customFiltersString,
					TypeFactory.collectionType(List.class, SearchRule.class));

			String queryString = (customFilters == null || customFilters.size() == 0) ? TicketFiltersUtil
					.getQueryFromConditions(filter.conditions) : TicketFiltersUtil
					.getQueryFromConditions(customFilters);

			if (StringUtils.isBlank(sortField))
				sortField = "-last_updated_time";

			if (pageSize == null)
				pageSize = 25;

			JSONObject resultJSON = new TicketsDocument().searchDocuments(queryString.trim(), cursor, sortField,
					pageSize);

			System.out.println("query: " + queryString);

			JSONArray keysArray = resultJSON.getJSONArray("keys");

			List<Key<Tickets>> keys = new ArrayList<Key<Tickets>>();

			for (int i = 0; i < keysArray.length(); i++)
				keys.add((Key<Tickets>) keysArray.get(i));

			System.out.println("keys: " + keys);

			List<Tickets> tickets = Tickets.ticketsDao.fetchAllByKeys(keys);

			if (tickets.size() > 0)
			{
				tickets = TicketsUtil.inclGroupDetails(tickets);
				tickets = TicketsUtil.inclDomainUsers(tickets);
			}

			if (resultJSON.has("count"))
			{
				int count = resultJSON.getInt("count");

				if (count > 20 && tickets.size() == 20)
				{
					Tickets ticket = tickets.get(19);

					ticket.count = count;
					ticket.cursor = resultJSON.getString("cursor");
				}
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
	@Path("/fitered-tickets-count")
	@Produces(MediaType.APPLICATION_JSON)
	public String getFilteredTicketsCount(@QueryParam("filter_id") Long filterID)
	{
		try
		{
			TicketFilters filter = TicketFiltersUtil.getFilterById(filterID);

			String queryString = TicketFiltersUtil.getQueryFromConditions(filter.conditions);

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
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Activity> listTicketActivitys(@QueryParam("id") Long ticketID)
	{
		try
		{
			List<Activity> activitys = ActivityUtil.getActivitiesByEntityId(EntityType.TICKET.toString(), ticketID,
					200, null);

			activitys = TicketsUtil.includeData(activitys);

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
	 * @return list of worklows
	 */
	@GET
	@Path("/execute-workflow")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Workflow> listWorkflows()
	{
		return WorkflowUtil.getAllWorkflows();
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
			html_text = html_text.replaceAll("(\r\n|\n\r|\r|\n)", "<br/>");

			CreatedBy createdBy = ticket.created_by;

			if (StringUtils.isBlank(html_text))
				throw new Exception("Please provide message body.");

			Long groupID = ticket.groupID, assigneeID = ticket.assigneeID;

			// Converting html text to plain with jsoup
			// Document doc = Jsoup.parse(html_text, "UTF-8");
			String plain_text = TicketNotesUtil.br2nl(html_text);

			boolean attachmentExists = false;

			List<TicketDocuments> attachmentsList = ticket.attachments_list;

			if (attachmentsList != null && attachmentsList.size() > 0)
				attachmentExists = true;

			List<Key<TicketLabels>> labels_keys_list = new ArrayList<Key<TicketLabels>>();

			if (ticket.labels != null)
				for (Long labelID : ticket.labels)
					labels_keys_list.add(new Key<TicketLabels>(TicketLabels.class, labelID));

			// Creating new Ticket in Ticket table
			ticket = TicketsUtil.createTicket(groupID, assigneeID, ticket.requester_name, ticket.requester_email,
					ticket.subject, ticket.cc_emails, plain_text, ticket.status, ticket.type, ticket.priority,
					ticket.source, ticket.created_by, attachmentExists, "", labels_keys_list);

			// Creating new Notes in TicketNotes table
			TicketNotesUtil.createTicketNotes(ticket.id, groupID, assigneeID, CREATED_BY.REQUESTER,
					ticket.requester_name, ticket.requester_email, plain_text, html_text, NOTE_TYPE.PUBLIC,
					attachmentsList, "");

			ticket.groupID = ticket.group_id.getId();

			// Execute triggers
			TicketTriggerUtil.executeTriggerForNewTicket(ticket);

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
	 * Executes selected workflow on currently viewing ticket
	 * 
	 * @param ticket
	 * @return newly created ticket
	 * @throws JSONException
	 */
	@POST
	@Path("/execute-workflow")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String executeWorkflow(TicketWorkflow ticketWorkflow) throws JSONException
	{
		try
		{
			Long ticketID = ticketWorkflow.getTicket_id();
			Long workflowID = ticketWorkflow.getWorkflow_id();

			if (ticketID == null || workflowID == null)
				throw new Exception("ticketID or workflowID is missing.");

			// Fetching ticket
			Tickets ticket = TicketsUtil.getTicketByID(ticketID);

			// Fetching contact
			Contact contact = ticket.getContact();

			// Throwing exception if contact is null
			if (contact == null)
				throw new Exception("No contact found for this customer.");

			// Executing workflow on given ticket id
			TicketTriggerUtil.executeCampaign(contact, workflowID, ticket);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return new JSONObject().put("status", "success").toString();
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

			Tickets ticket = TicketsUtil.changeStatus(ticketID, status);

			// Execute closed ticket trigger. Do not execute trigger if updated
			// status and current status is same.
			if (Status.CLOSED == status && ticket.status != status)
				TicketTriggerUtil.executeTriggerForClosedTicket(ticket);

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
	 * Assigns Ticket to given domain user and ticket group
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return returns updated ticket object
	 */
	@GET
	@Path("/assign-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets assignTicket(@QueryParam("ticket_id") Long ticketID, @QueryParam("assignee_id") Long assigneeID,
			@QueryParam("group_id") Long groupID)
	{
		try
		{
			if (ticketID == null || groupID == null)
				throw new Exception("Required parameters missing.");

			// Fetching ticket object by its id
			Tickets oldTicket = TicketsUtil.getTicketByID(ticketID);

			Tickets updatedTicket = TicketsUtil.changeGroupAndAssignee(ticketID, groupID, assigneeID);

			if (updatedTicket.assigneeID != null)
				updatedTicket.assignee = DomainUserUtil.getDomainUser(assigneeID);

			if (updatedTicket.groupID != null)
				updatedTicket.group = TicketGroups.ticketGroupsDao.get(groupID);

			if (oldTicket.assigneeID != updatedTicket.assigneeID || (oldTicket.groupID != updatedTicket.groupID))
				TicketTriggerUtil.executeTriggerForAssigneeChanged(updatedTicket);

			return updatedTicket;
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
	 * @param priority
	 * @return
	 */
	@PUT
	@Path("/change-due-date")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets changeDueDate(@QueryParam("id") Long ticketID, @QueryParam("due_time") Long dueDate)
	{
		try
		{
			if (ticketID == null || dueDate == null)
				throw new Exception("Required parameters missing.");

			return TicketsUtil.changeDueDate(ticketID, dueDate);
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

			ticket = TicketsUtil.closeTicket(ticket.id);

			// Execute closed ticket trigger. Do not execute trigger if updated
			// status and current status is same.
			TicketTriggerUtil.executeTriggerForClosedTicket(ticket);

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
	 * 
	 * @param ticket_id
	 * @return
	 */
	@PUT
	@Path("/update-labels")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets updateLabels(@QueryParam("command") String command, @QueryParam("label") Long labelID,
			@QueryParam("id") Long ticketID)
	{
		try
		{
			if (ticketID == null)
				throw new Exception("Required parameter missing.");

			Tickets ticket = TicketsUtil.updateLabels(ticketID, new Key<TicketLabels>(TicketLabels.class, labelID),
					command);

			if ("add".equalsIgnoreCase(command))
				TicketTriggerUtil.executeTriggerForLabelAddedToTicket(ticket);
			else
				TicketTriggerUtil.executeTriggerForLabelDeletedToTicket(ticket);

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
	 * To update cc emails
	 * 
	 * @param ticket_id
	 * @return
	 */
	@PUT
	@Path("/update-cc-emails")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets updateCCEmails(@QueryParam("command") String command, @QueryParam("email") String email,
			@QueryParam("id") Long ticketID)
	{
		try
		{
			if (ticketID == null || email == null || command == null)
				throw new Exception("Required parameter missing.");

			return TicketsUtil.updateCCEmails(ticketID, email, command);
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
	 * changes ticket favorite
	 * 
	 * @param ticketID
	 * @return returns success json
	 */
	@PUT
	@Path("/toggle-favorite")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets toggleFavorite(@QueryParam("id") Long ticketID)
	{
		try
		{
			if (ticketID == null)
				throw new Exception("Required parameters missing.");

			Tickets ticket = TicketsUtil.getTicketByID(ticketID);

			boolean isFavorite = (ticket.is_favorite != null && ticket.is_favorite) ? false : true;

			return TicketsUtil.markFavorite(ticketID, isFavorite);

		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * changes ticket spam
	 * 
	 * @param ticketID
	 * @return returns success json
	 */
	@PUT
	@Path("/toggle-spam")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets toggleSpam(@QueryParam("id") Long ticketID)
	{
		try
		{
			if (ticketID == null)
				throw new Exception("Required parameters missing.");

			Tickets ticket = TicketsUtil.getTicketByID(ticketID);

			boolean isSpam = (ticket.is_spam != null && ticket.is_spam) ? false : true;

			return TicketsUtil.markSpam(ticketID, isSpam);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Forward ticket
	 * 
	 * @param notes
	 * @return
	 */
	@POST
	@Path("/forward-ticket")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets forwardTicket(@FormParam("ticket_id") Long ticketId, @FormParam("email") String email,
			@FormParam("html_text") String HTMLcontent)
	{
		try
		{
			if (ticketId == null || email == null || HTMLcontent == null)
				throw new Exception("Required parameters missing.");

			// Converting html text to plain with jsoup
			// Document doc = Jsoup.parse(HTMLcontent, "UTF-8");
			// String plain_text = new HtmlToPlainText().getPlainText(doc);
			HTMLcontent = HTMLcontent.replaceAll("(\r\n|\n)", "<br />");

			String plain_text = HTMLcontent;

			return TicketsUtil.forwardTicket(ticketId, plain_text, email);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@GET
	@Path("/email")
	public List<Tickets> getTicketsByEmail(@QueryParam("email") String email)
	{
		try
		{
			return TicketsUtil.getTicketsByEmail(email);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@GET
	@Path("/ticket-count")
	public int getTicketCountByEmail(@QueryParam("email") String email)
	{
		try
		{
			return TicketsUtil.getTicketCountByEmail(email);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	@GET
	@Path("/delete/text-document")
	public void deleteTextDocument(@QueryParam("id") String ticketID)
	{
		try
		{
			new TicketsDocument().delete(ticketID);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	/**
	 * Forward ticket
	 * 
	 * @param notes
	 * @return
	 */
	@GET
	@Path("/import/zendesk")
	public void importZendeskTickets()
	{
		try
		{
			Queue queue = QueueFactory.getQueue(AgileQueues.TICKET_BULK_ACTIONS_QUEUE);

			String bulk_action_tracker = String.valueOf(BulkActionUtil.randInt(1, 10000));

			Widget zendesk = WidgetUtil.getWidgetByNameAndType("Zendesk", null);
			JSONObject json = new JSONObject(zendesk.prefs);

			TaskOptions taskOptions = TaskOptions.Builder.withUrl("/core/api/bulk-actions/tickets/imports/zendesk")
					.param("data", json.toString()).param("domain_user_id", SessionManager.get().getClaimedId())
					.param("tracker", bulk_action_tracker).header("Content-Type", "application/x-www-form-urlencoded")
					.method(Method.POST);

			queue.addAsync(taskOptions);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Forward ticket
	 * 
	 * @param notes
	 * @return
	 */
	@GET
	@Path("/remove-all-tickets")
	public void removeAllTickets()
	{
		try
		{
			List<Key<Tickets>> keys = Tickets.ticketsDao.listAllKeys();

			for (Key<Tickets> key : keys)
				TicketsUtil.deleteTicket(key.getId());
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Forward ticket
	 * 
	 * @param notes
	 * @return
	 */
	@GET
	@Path("/add-tickets-to-text-search")
	public void addTicketsToTextSearch()
	{
		try
		{
			List<Key<Tickets>> keys = Tickets.ticketsDao.listAllKeys();

			for (Key<Tickets> key : keys)
			{
				new TicketsDocument().add(Tickets.ticketsDao.get(key));
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Forward ticket
	 * 
	 * @param notes
	 * @return
	 */
	@GET
	@Path("/remove-all-text-documents")
	public void removeAllTextDocuments()
	{
		try
		{
			new TicketsDocument().removeAllDocuments();
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
	@GET
	@Path("/create-default-ticket")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void createDefaultTicket() throws JSONException
	{
		try
		{
			TicketsUtil.createDefaultTicket();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	/**
	 * 
	 * @return
	 * @throws JSONException
	 */
	@GET
	@Path("/create-test-ticket")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String createTestTickets() throws JSONException
	{
		try
		{
			for (int i = 0; i < 100; i++)
			{
				TicketGroups group = TicketGroupUtil.getDefaultTicketGroup();

				String message = "Hi!..\r\n\r\nThis is test message. Please ignore.\r\n\r\nThank you\r\nSasi Krishna";

				Tickets ticket = TicketsUtil.createTicket(group.id, null, "Sasi", "sasi@clickdesk.com",
						"Test ticket created from rest method", new ArrayList<String>(), message, Status.NEW,
						Type.PROBLEM, Priority.LOW, Source.EMAIL, CreatedBy.CUSTOMER, true, "[142.152.23.23]",
						new ArrayList<Key<TicketLabels>>());

				// Creating new Notes in TicketNotes table
				TicketNotes ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, group.id, ticket.assigneeID,
						CREATED_BY.REQUESTER, "Sasi", "sasi@clickdesk.com", message, message, NOTE_TYPE.PUBLIC,
						new ArrayList<TicketDocuments>(), "");
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return new JSONObject().put("status", "success").toString();
	}
	/**
	 * changes ticket due date
	 * @param ticket_id
	 * @return returns success json
	 */
	@PUT
	@Path("/remove-due-date")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets removeDueate(@QueryParam("id") Long ticketID)
	{
		try
		{
			if (ticketID == null)
				throw new Exception("Required parameters missing.");

			return TicketsUtil.removeDuedate(ticketID);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
		
	}
}
