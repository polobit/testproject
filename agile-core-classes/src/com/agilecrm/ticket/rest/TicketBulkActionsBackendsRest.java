package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.ticket.deferred.ChangeAssigneeDeferredTask;
import com.agilecrm.ticket.deferred.CloseTicketsDeferredTask;
import com.agilecrm.ticket.deferred.DeleteTicketsDeferredTask;
import com.agilecrm.ticket.deferred.ExecuteWorkflowDeferredTask;
import com.agilecrm.ticket.deferred.ManageLabelsDeferredTask;
import com.agilecrm.ticket.deferred.MarkTicketsAsFavoriteDeferredTask;
import com.agilecrm.ticket.deferred.MarkTicketsAsSpamDeferredTask;
import com.agilecrm.ticket.entitys.TicketBulkActionAttributes;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.utils.CSVTicketIdsFetcher;
import com.agilecrm.ticket.utils.FilterTicketIdsFetcher;
import com.agilecrm.ticket.utils.ITicketIdsFetcher;
import com.agilecrm.ticket.utils.TicketBulkActionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.thirdparty.PubNub;

/**
 * 
 * @author Sasi on 30-Sep-2015
 * 
 */
@Path("/api/ticket-module/backend")
public class TicketBulkActionsBackendsRest
{
	public static final String TICKET_BULK_ACTIONS = "TICKET_OPEARTIONS";

	@POST
	@Path("/manage-labels/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void manageLabels(@PathParam("domain_user_id") Long domainUserID, TicketBulkActionAttributes attributes)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			JSONObject dataJSON = new JSONObject(attributes.dataString);
			String command = dataJSON.getString("command");
			System.out.println("dataJSON: " + dataJSON);

			if (StringUtils.isBlank(command))
				return;

			JSONArray labelsIDs = dataJSON.getJSONArray("labels");
			// String[] labelsArray = dataJSON.getString("labels").split(",");

			List<Key<TicketLabels>> labelsKeys = new ArrayList<Key<TicketLabels>>();

			for (int i = 0; i < labelsIDs.length(); i++)
				labelsKeys.add(new Key<TicketLabels>(TicketLabels.class, labelsIDs.getLong(i)));

			DomainUser user = DomainUserUtil.getDomainUser(domainUserID);
			BulkActionUtil.setSessionManager(user);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
			{
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
				System.out.println(attributes.conditions);
			}
			else if (attributes.ticketIDs != null)
			{
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);
				System.out.println("attributes.ticketIDs: " + attributes.ticketIDs);
			}

			ManageLabelsDeferredTask task = new ManageLabelsDeferredTask(labelsKeys, command, NamespaceManager.get(),
					domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			List<TicketLabels> labels = TicketLabels.dao.fetchAllByKeys(labelsKeys);

			StringBuilder labelsCSVSB = new StringBuilder();
			for (TicketLabels label : labels)
				labelsCSVSB.append(label.label).append(", ");

			String labelsCSV = labelsCSVSB.toString();
			labelsCSV = labelsCSV.substring(0, labelsCSV.lastIndexOf(","));

			// Logging bulk action activity
			// ActivityUtil.createTicketActivity(ActivityType.BULK_ACTION_MANAGE_LABELS,
			// null, null, "",
			// labelsCSV.toString(), idsFetcher.getCount() + "");

			int selectedTicketsCount = idsFetcher.getCount();

			String message = "Labels " + labelsCSV + " have been added to " + selectedTicketsCount
					+ ((selectedTicketsCount == 1) ? " ticket" : " tickets");

			if (command.equalsIgnoreCase("remove"))
				message = "Labels " + labelsCSV + " have been removed from " + selectedTicketsCount
						+ ((selectedTicketsCount == 1) ? " ticket" : " tickets");

			publishNotification(message);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	@POST
	@Path("/change-assignee/{domain_user_id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void changeAssignee(@PathParam("domain_user_id") Long domainUserID, TicketBulkActionAttributes attributes)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			JSONObject dataJSON = new JSONObject(attributes.dataString);
			System.out.println("dataJSON: " + dataJSON);

			Long assigneeID = null;

			if (dataJSON.has("assignee_id"))
				assigneeID = dataJSON.getLong("assignee_id");

			Long groupID = dataJSON.getLong("group_id");

			// Cannot set DomainUserPartial to SessionManager so fetching
			// domainUserObject
			DomainUser user = DomainUserUtil.getDomainUser(domainUserID);
			BulkActionUtil.setSessionManager(user);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
			{
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
				System.out.println(attributes.conditions);
			}
			else if (attributes.ticketIDs != null)
			{
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);
				System.out.println("attributes.ticketIDs: " + attributes.ticketIDs);
			}

			ChangeAssigneeDeferredTask task = new ChangeAssigneeDeferredTask(NamespaceManager.get(), domainUserID,
					assigneeID, groupID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			int selectedTicketsCount = idsFetcher.getCount();

			String message = (selectedTicketsCount + ((selectedTicketsCount == 1) ? " ticket" : " tickets"))
					+ " group have been changed.";

			if (assigneeID != null)
				message = (selectedTicketsCount + ((selectedTicketsCount == 1) ? " ticket" : " tickets"))
						+ " assignee have been changed.";

			publishNotification(message);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	@POST
	@Path("/execute-workflow/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void executeWorkflow(@PathParam("domain_user_id") Long domainUserID, TicketBulkActionAttributes attributes)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			JSONObject dataJSON = new JSONObject(attributes.dataString);
			System.out.println("dataJSON: " + dataJSON);

			Long workflowID = dataJSON.getLong("workflow_id");

			DomainUser user = DomainUserUtil.getDomainUser(domainUserID);
			BulkActionUtil.setSessionManager(user);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
			{
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
				System.out.println(attributes.conditions);
			}
			else if (attributes.ticketIDs != null)
			{
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);
				System.out.println("attributes.ticketIDs: " + attributes.ticketIDs);
			}

			ExecuteWorkflowDeferredTask task = new ExecuteWorkflowDeferredTask(NamespaceManager.get(), domainUserID,
					workflowID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			// Workflow workflow = WorkflowUtil.getWorkflow(workflowID);

			// Logging bulk action activity
			// ActivityUtil.createTicketActivity(ActivityType.BULK_ACTION_EXECUTE_WORKFLOW,
			// null, null, workflow.name,
			// workflowID + "", idsFetcher.getCount() + "");

			int selectedTicketsCount = idsFetcher.getCount();

			publishNotification("Workflow have been executed on " + selectedTicketsCount
					+ ((idsFetcher.getCount() == 1) ? " ticket" : " tickets"));
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	@POST
	@Path("/close-tickets/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void closeTickets(@PathParam("domain_user_id") Long domainUserID, TicketBulkActionAttributes attributes)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			DomainUser user = DomainUserUtil.getDomainUser(domainUserID);
			BulkActionUtil.setSessionManager(user);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
			{
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
				System.out.println(attributes.conditions);
			}
			else if (attributes.ticketIDs != null)
			{
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);
				System.out.println("attributes.ticketIDs: " + attributes.ticketIDs);
			}

			CloseTicketsDeferredTask task = new CloseTicketsDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			// Logging bulk action activity
			// ActivityUtil.createTicketActivity(ActivityType.BULK_ACTION_CLOSE_TICKETS,
			// null, null, "", "",
			// idsFetcher.getCount() + "");

			int selectedTicketsCount = idsFetcher.getCount();

			publishNotification(selectedTicketsCount + ((idsFetcher.getCount() == 1) ? " ticket" : " tickets")
					+ " have been closed.");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	@POST
	@Path("/delete-tickets/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void deleteTickets(@PathParam("domain_user_id") Long domainUserID, TicketBulkActionAttributes attributes)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			DomainUser user = DomainUserUtil.getDomainUser(domainUserID);
			BulkActionUtil.setSessionManager(user);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
			{
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
				System.out.println(attributes.conditions);
			}
			else if (attributes.ticketIDs != null)
			{
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);
				System.out.println("attributes.ticketIDs: " + attributes.ticketIDs);
			}

			DeleteTicketsDeferredTask task = new DeleteTicketsDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			// Logging bulk action activity
			// ActivityUtil.createTicketActivity(ActivityType.BULK_ACTION_DELETE_TICKETS,
			// null, null, "", "",
			// idsFetcher.getCount() + "");

			int selectedTicketsCount = idsFetcher.getCount();

			publishNotification(selectedTicketsCount + ((idsFetcher.getCount() == 1) ? " ticket" : " tickets")
					+ " have been deleted.");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	@POST
	@Path("/spam-tickets/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void spamTickets(@PathParam("domain_user_id") Long domainUserID, TicketBulkActionAttributes attributes)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			DomainUser user = DomainUserUtil.getDomainUser(domainUserID);
			BulkActionUtil.setSessionManager(user);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
			{
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
				System.out.println(attributes.conditions);
			}
			else if (attributes.ticketIDs != null)
			{
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);
				System.out.println("attributes.ticketIDs: " + attributes.ticketIDs);
			}

			MarkTicketsAsSpamDeferredTask task = new MarkTicketsAsSpamDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			// Logging bulk action activity
			// ActivityUtil.createTicketActivity(ActivityType.BULK_ACTION_SPAM_TICKETS,
			// null, null, "", "",
			// idsFetcher.getCount() + "");

			int selectedTicketsCount = idsFetcher.getCount();

			publishNotification(selectedTicketsCount + ((idsFetcher.getCount() == 1) ? " ticket" : " tickets")
					+ " have been marked as spam.");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	@POST
	@Path("/favorite-tickets/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void favoriteTickets(@PathParam("domain_user_id") Long domainUserID, TicketBulkActionAttributes attributes)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			DomainUser user = DomainUserUtil.getDomainUser(domainUserID);

			BulkActionUtil.setSessionManager(user);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
			{
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
				System.out.println(attributes.conditions);
			}
			else if (attributes.ticketIDs != null)
			{
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);
				System.out.println("attributes.ticketIDs: " + attributes.ticketIDs);
			}

			MarkTicketsAsFavoriteDeferredTask task = new MarkTicketsAsFavoriteDeferredTask(NamespaceManager.get(),
					domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			// Logging bulk action activity
			// Activity activity =
			// ActivityUtil.createTicketActivity(ActivityType.BULK_ACTION_FAVORITE_TICKETS,
			// null,
			// null, "", "", idsFetcher.getCount() + "");

			int selectedTicketsCount = idsFetcher.getCount();

			publishNotification(selectedTicketsCount + ((idsFetcher.getCount() == 1) ? " ticket" : " tickets")
					+ " have been added to favourites.");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	public static void publishNotification(String message)
	{

		JSONObject messageJSON = new JSONObject();
		try
		{
			System.out.println("message to send in notification " + message);

			messageJSON.put("message", message);
			messageJSON.put("type", BulkAction.TICKET_BULK_ACTIONS);
			messageJSON.put("sub_type", BulkAction.TICKET_BULK_ACTIONS);

			PubNub.pubNubPush(NamespaceManager.get(), messageJSON);
		}
		catch (JSONException e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}