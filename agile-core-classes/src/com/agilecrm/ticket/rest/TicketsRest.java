package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.entitys.TicketActivityAttributes;
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
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
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
			return TicketsUtil.getTicketByID(ticketID);
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

			final int DEFAULT_PAGE_SIZE = 25;

			TicketFilters filter = TicketFiltersUtil.getFilterById(filterID);

			List<SearchRule> customFilters = new ObjectMapper().readValue(customFiltersString,
					TypeFactory.collectionType(List.class, SearchRule.class));

			String queryString = (customFilters == null || customFilters.size() == 0) ? TicketFiltersUtil
					.getQueryFromConditions(filter.conditions) : TicketFiltersUtil
					.getQueryFromConditions(customFilters);

			if (StringUtils.isBlank(sortField))
				sortField = "-last_updated_time";

			if (pageSize == null)
				pageSize = DEFAULT_PAGE_SIZE;

			JSONObject resultJSON = new TicketsDocument().searchDocuments(queryString.trim(), cursor, sortField,
					pageSize);

			System.out.println("query: " + queryString);

			JSONArray keysArray = resultJSON.getJSONArray("keys");

			List<Key<Tickets>> keys = new ArrayList<Key<Tickets>>();

			for (int i = 0; i < keysArray.length(); i++)
				keys.add((Key<Tickets>) keysArray.get(i));

			System.out.println("keys: " + keys);

			List<Tickets> tickets = Tickets.ticketsDao.fetchAllByKeys(keys);

			if (resultJSON.has("count"))
			{
				int count = resultJSON.getInt("count");

				if (count > pageSize && tickets.size() == pageSize)
				{
					Tickets ticket = tickets.get(pageSize - 1);

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
			if (filterID == null)
				throw new Exception("Filter not exits");

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

			List<DomainUserPartial> domainUsers = DomainUserUtil.getPartialDomainUsers(NamespaceManager.get());

			for (TicketGroups group : groups)
			{
				List<DomainUserPartial> groupUsers = new ArrayList<DomainUserPartial>();

				for (DomainUserPartial domainUser : domainUsers)
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
	public List<Activity> getActivitys(@QueryParam("id") Long ticketID)
	{
		try
		{
			// List<Activity> activitys =
			// ActivityUtil.getActivitiesByEntityId(EntityType.TICKET.toString(),
			// ticketID,
			// 200, null);

			// activitys = TicketsUtil.includeData(activitys);

			return ActivityUtil.getActivitiesByEntityId(EntityType.TICKET.toString(), ticketID, 200, null);
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
			if (StringUtils.isBlank(ticket.requester_email))
				throw new Exception("Please provide email address.");

			String fromName = ticket.requester_email.substring(0, ticket.requester_email.lastIndexOf("@"));

			if (StringUtils.isBlank(ticket.requester_name))
				ticket.requester_name = fromName;

			String html_text = ticket.html_text, plain_text = html_text;
			html_text = html_text.replaceAll("(\r\n|\n\r|\r|\n)", "<br/>");

			CreatedBy createdBy = ticket.created_by;

			if (StringUtils.isBlank(html_text))
				throw new Exception("Please provide message body.");

			Long groupID = ticket.groupID, assigneeID = ticket.assigneeID;

			// String plain_text = TicketNotesUtil.br2nl(html_text);

			boolean attachmentExists = false;

			List<TicketDocuments> attachmentsList = ticket.attachments_list;

			if (attachmentsList != null && attachmentsList.size() > 0)
				attachmentExists = true;

			List<Key<TicketLabels>> labels_keys_list = new ArrayList<Key<TicketLabels>>();

			if (ticket.labels != null)
				for (Long labelID : ticket.labels)
					labels_keys_list.add(new Key<TicketLabels>(TicketLabels.class, labelID));

			// Creating new Ticket in Ticket table
			ticket = new Tickets(groupID, assigneeID, ticket.requester_name, ticket.requester_email, ticket.subject,
					ticket.cc_emails, plain_text, ticket.status, ticket.type, ticket.priority, ticket.source,
					ticket.created_by, attachmentExists, "", labels_keys_list);

			// Creating new Notes in TicketNotes table
			TicketNotes notes = new TicketNotes(ticket.id, groupID, assigneeID, CREATED_BY.REQUESTER,
					ticket.requester_name, ticket.requester_email, plain_text, html_text, NOTE_TYPE.PUBLIC,
					attachmentsList, "");
			notes.save();

			ticket.groupID = ticket.group_id.getId();

			// Execute triggers
			// TicketTriggerUtil.executeTriggerForNewTicket(ticket);

			BulkActionNotifications.publishNotification("Ticket#" + ticket.id + " has been created.");

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
	 * @param tickeID
	 * @param activity
	 * @return
	 */
	@PUT
	@Path("/{ticket_id}/activity/{activity}")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets doActivity(@PathParam("ticket_id") Long ticketID, @PathParam("activity") String activity,
			TicketActivityAttributes activityAttributes)
	{
		try
		{
			Tickets ticket = null;

			switch (activity)
			{
			// case "mark-solved":
			// {
			// ticket = TicketsUtil.closeTicket(ticketID);
			//
			// // Execute closed ticket trigger. Do not execute trigger if
			// // updated
			// // status and current status is same.
			// TicketTriggerUtil.executeTriggerForClosedTicket(ticket);
			//
			// break;
			// }
				case "change-due-date":
				{
					ticket = TicketsUtil.changeDueDate(ticketID, activityAttributes.getDue_time());
					break;
				}
				case "change-priority":
				{
					ticket = TicketsUtil.changePriority(ticketID, activityAttributes.getPriority());
					break;
				}
				case "change-ticket-type":
				{
					ticket = TicketsUtil.changeTicketType(ticketID, activityAttributes.getType());
					break;
				}
				case "change-status":
				{
					ticket = TicketsUtil.changeStatus(ticketID, activityAttributes.getStatus());

					break;
				}
				case "remove-due-date":
				{
					ticket = TicketsUtil.removeDuedate(ticketID);
					break;
				}
				case "toggle-spam":
				{
					ticket = TicketsUtil.getTicketByID(ticketID);
					boolean isSpam = (ticket.is_spam != null && ticket.is_spam) ? false : true;
					ticket = TicketsUtil.markSpam(ticketID, isSpam);

					break;
				}
				case "toggle-favorite":
				{
					ticket = TicketsUtil.getTicketByID(ticketID);
					boolean isFavorite = (ticket.is_favorite != null && ticket.is_favorite) ? false : true;
					ticket = TicketsUtil.markFavorite(ticketID, isFavorite);

					break;
				}
				case "update-cc-emails":
				{
					ticket = TicketsUtil.updateCCEmails(ticketID, activityAttributes.getEmail(),
							activityAttributes.getCommand());
					break;
				}
				case "update-labels":
				{
					ticket = TicketsUtil.updateLabels(ticketID, new Key<TicketLabels>(TicketLabels.class,
							activityAttributes.getLabelID()), activityAttributes.getCommand());

					break;
				}
			}

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
			Contact contact = ContactUtil.getContact(ticket.contact_key.getId());

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
	 * Assigns Ticket to given domain user and ticket group
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return returns updated ticket object
	 */
	@PUT
	@Path("/{ticket_id}/assign-ticket/{group_id}/{assignee_id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Tickets assignTicket(@PathParam("ticket_id") Long ticketID, @PathParam("assignee_id") Long assigneeID,
			@PathParam("group_id") Long groupID)
	{
		try
		{
			if (ticketID == null || groupID == null)
				throw new Exception("Required parameters missing");

			// From client side sending value 0 when ticket is assigned to group
			if (assigneeID == 0)
				assigneeID = null;

			// Fetching ticket object by its id
			Tickets oldTicket = TicketsUtil.getTicketByID(ticketID);

			Tickets updatedTicket = TicketsUtil.changeGroupAndAssignee(ticketID, groupID, assigneeID);

			if (updatedTicket.assigneeID != null)
				updatedTicket.assignee = DomainUserUtil.getPartialDomainUser(assigneeID);

			if (updatedTicket.groupID != null)
				updatedTicket.group = TicketGroupUtil.getPartialGroupByID(groupID);

			if ((oldTicket.assigneeID != updatedTicket.assigneeID) || (oldTicket.groupID != updatedTicket.groupID))
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
	 * @return
	 */
	@DELETE
	@Path("/{ticket_id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteTicket(@PathParam("ticket_id") Long ticketID)
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
	@Path("/email/{email}")
	public List<Tickets> getTicketsByEmail(@PathParam("email") String email)
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
	@Path("/{email}/count")
	public int getTicketCountByEmail(@PathParam("email") String email)
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

			Widget zendesk = WidgetUtil.getWidgetByNameAndType("Zendesk", null);
			final JSONObject json = new JSONObject(zendesk.prefs);

			// ZendeskImport.fetchTickets(json);

			String bulk_action_tracker = String.valueOf(BulkActionUtil.randInt(1, 10000));

			TaskOptions taskOptions = TaskOptions.Builder.withUrl("/core/api/ticket-module/backend/imports/zendesk")
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
				new TicketsDocument().add(Tickets.ticketsDao.get(key));
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
	@Path("/add-pic/{email}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void addPic(@PathParam("email") String email) throws JSONException
	{
		try
		{
			DomainUser user = DomainUserUtil.getDomainUserFromEmail(email);
			user.pic = "https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/64.png";

			user.save();
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
	@Path("/due-date-tickets")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void getDueDateTickets() throws JSONException
	{
		try
		{
			System.out.println(TicketsUtil.getOverdueTickets());
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

				Tickets ticket = new Tickets(group.id, null, "Sasi", "sasi@clickdesk.com",
						"Test ticket created from rest method", new ArrayList<String>(), message, Status.NEW,
						Type.PROBLEM, Priority.LOW, Source.EMAIL, CreatedBy.CUSTOMER, true, "[142.152.23.23]",
						new ArrayList<Key<TicketLabels>>());

				// Creating new Notes in TicketNotes table
				TicketNotes notes = new TicketNotes(ticket.id, group.id, ticket.assigneeID, CREATED_BY.REQUESTER,
						"Sasi", "sasi@clickdesk.com", message, message, NOTE_TYPE.PUBLIC,
						new ArrayList<TicketDocuments>(), "");
				notes.save();
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
}
