package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.ticket.deferred.ChangeAssigneeDeferredTask;
import com.agilecrm.ticket.deferred.CloseTicketsDeferredTask;
import com.agilecrm.ticket.deferred.DeleteTicketsDeferredTask;
import com.agilecrm.ticket.deferred.ExecuteWorkflowDeferredTask;
import com.agilecrm.ticket.deferred.ManageLabelsDeferredTask;
import com.agilecrm.ticket.deferred.MarkTicketsAsFavoriteDeferredTask;
import com.agilecrm.ticket.deferred.MarkTicketsAsSpamDeferredTask;
import com.agilecrm.ticket.entitys.TicketActivity;
import com.agilecrm.ticket.entitys.TicketActivity.TicketActivityType;
import com.agilecrm.ticket.entitys.TicketBulkActionAttributes;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.utils.CSVTicketIdsFetcher;
import com.agilecrm.ticket.utils.FilterTicketIdsFetcher;
import com.agilecrm.ticket.utils.ITicketIdsFetcher;
import com.agilecrm.ticket.utils.TicketBulkActionUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi on 30-Sep-2015
 * 
 */
@Path("/api/bulk-actions/tickets")
public class TicketBulkActionsBackendsRest
{
	@POST
	@Path("/manage-labels/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void manageTags(@PathParam("domain_user_id") Long domainUserID, TicketBulkActionAttributes attributes)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			JSONObject dataJSON = new JSONObject(attributes.dataString);
			System.out.println("dataJSON: " + dataJSON);

			JSONArray labelsIDs = dataJSON.getJSONArray("labels");
			// String[] labelsArray = dataJSON.getString("labels").split(",");

			List<Key<TicketLabels>> labels = new ArrayList<Key<TicketLabels>>();

			for (int i = 0; i < labelsIDs.length(); i++)
				labels.add(new Key<TicketLabels>(TicketLabels.class, labelsIDs.getLong(i)));

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION_MANAGE_LABELS, null, null, "", labelsIDs.toString(),
					"labels").save();

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
				idsFetcher = new FilterTicketIdsFetcher(null);
			else if (attributes.ticketIDs != null)
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);

			ManageLabelsDeferredTask task = new ManageLabelsDeferredTask(labels, dataJSON.getString("command"),
					NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Bulk manage labels task started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
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

			Long assigneeID = dataJSON.getLong("assignee_id");
			Long groupID = dataJSON.getLong("group_id");

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION_CHANGE_ASSIGNEE, null, null, "", assigneeID + " "
					+ groupID, "assignee_id").save();

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
			else if (attributes.ticketIDs != null)
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);

			ChangeAssigneeDeferredTask task = new ChangeAssigneeDeferredTask(NamespaceManager.get(), domainUserID,
					assigneeID, groupID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Bulk change assignee started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
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

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION_EXECUTE_WORKFLOW, null, null, "", workflowID + "", "")
					.save();

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
			else if (attributes.ticketIDs != null)
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);

			ExecuteWorkflowDeferredTask task = new ExecuteWorkflowDeferredTask(NamespaceManager.get(), domainUserID,
					workflowID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Executing workflows on tickets");
		}
		catch (Exception e)
		{
			e.printStackTrace();
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

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION_CLOSE_TICKETS, null, null, "", "", "").save();

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
			else if (attributes.ticketIDs != null)
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);

			CloseTicketsDeferredTask task = new CloseTicketsDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Closing ticket bulk action started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
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

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION_DELETE_TICKETS, null, null, "", "", "").save();

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
			else if (attributes.ticketIDs != null)
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);

			DeleteTicketsDeferredTask task = new DeleteTicketsDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Tickets bulk deletion started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
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

			BulkActionUtil.setSessionManager(domainUserID);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
			else if (attributes.ticketIDs != null)
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);

			MarkTicketsAsSpamDeferredTask task = new MarkTicketsAsSpamDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Tickets bulk deletion started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
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

			BulkActionUtil.setSessionManager(domainUserID);

			ITicketIdsFetcher idsFetcher = null;

			if (attributes.conditions != null && attributes.conditions.size() > 0)
				idsFetcher = new FilterTicketIdsFetcher(attributes.conditions);
			else if (attributes.ticketIDs != null)
				idsFetcher = new CSVTicketIdsFetcher(attributes.ticketIDs);

			MarkTicketsAsFavoriteDeferredTask task = new MarkTicketsAsFavoriteDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Tickets bulk deletion started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}