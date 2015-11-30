package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.ticket.deferred.ChangeAssigneeDeferredTask;
import com.agilecrm.ticket.deferred.CloseTicketsDeferredTask;
import com.agilecrm.ticket.deferred.DeleteTicketsDeferredTask;
import com.agilecrm.ticket.deferred.ExecuteWorkflowDeferredTask;
import com.agilecrm.ticket.deferred.ManageLabelsDeferredTask;
import com.agilecrm.ticket.entitys.TicketActivity;
import com.agilecrm.ticket.entitys.TicketActivity.TicketActivityType;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.utils.CSVTicketIdsFetcher;
import com.agilecrm.ticket.utils.FilterTicketIdsFetcher;
import com.agilecrm.ticket.utils.ITicketIdsFetcher;
import com.agilecrm.ticket.utils.TicketBulkActionUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

import edu.emory.mathcs.backport.java.util.Arrays;

/**
 * 
 * @author Sasi on 30-Sep-2015
 * 
 */
@Path("/api/bulk-actions/tickets")
public class TicketBulkActionsBackendsRest
{
	@POST
	@Path("/add-tags/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void manageTags(@PathParam("domain_user_id") Long domainUserID, @FormParam("filter_id") Long filterID,
			@FormParam("ticket_ids") String ticketIds, @FormParam("data") String dataString,
			@FormParam("tracker") String tracker)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			JSONObject dataJSON = new JSONObject(dataString);
			System.out.println("dataJSON: " + dataJSON);

			String[] labelsArray = dataJSON.getString("tags").split(",");

			List<Key<TicketLabels>> labels = new ArrayList<Key<TicketLabels>>();

			for (String labelID : labelsArray)
				labels.add(new Key<TicketLabels>(TicketLabels.class, Long.parseLong(labelID)));

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION_MANAGE_LABELS, null, null, "",
					Arrays.toString(labelsArray), "labels").save();

			ITicketIdsFetcher idsFetcher = null;

			if (filterID != null)
				idsFetcher = new FilterTicketIdsFetcher(filterID);
			else if (ticketIds != null)
				idsFetcher = new CSVTicketIdsFetcher(ticketIds);

			ManageLabelsDeferredTask task = new ManageLabelsDeferredTask(labels, dataJSON.getString("command"),
					NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Bulk label adding started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	@POST
	@Path("/change-assignee/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void changeAssignee(@PathParam("domain_user_id") Long domainUserID, @FormParam("filter_id") Long filterID,
			@FormParam("ticket_ids") String ticketIds, @FormParam("data") String dataString,
			@FormParam("tracker") String tracker)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			JSONObject dataJSON = new JSONObject(dataString);
			System.out.println("dataJSON: " + dataJSON);

			Long assigneeID = dataJSON.getLong("assignee_id");
			Long groupID = dataJSON.getLong("group_id");

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION_CHANGE_ASSIGNEE, null, null, "", assigneeID + " "
					+ groupID, "assignee_id").save();

			ITicketIdsFetcher idsFetcher = null;

			if (filterID != null)
				idsFetcher = new FilterTicketIdsFetcher(filterID);
			else if (ticketIds != null)
				idsFetcher = new CSVTicketIdsFetcher(ticketIds);

			ChangeAssigneeDeferredTask task = new ChangeAssigneeDeferredTask(NamespaceManager.get(), domainUserID,
					assigneeID, groupID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Bulk label adding started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	@POST
	@Path("/execute-workflow/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void executeWorkflow(@PathParam("domain_user_id") Long domainUserID, @FormParam("filter_id") Long filterID,
			@FormParam("ticket_ids") String ticketIds, @FormParam("data") String dataString,
			@FormParam("tracker") String tracker)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			JSONObject dataJSON = new JSONObject(dataString);
			System.out.println("dataJSON: " + dataJSON);

			Long workflowID = dataJSON.getLong("workflow_id");

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION_EXECUTE_WORKFLOW, null, null, "", workflowID + "", "")
					.save();

			ITicketIdsFetcher idsFetcher = null;

			if (filterID != null)
				idsFetcher = new FilterTicketIdsFetcher(filterID);
			else if (ticketIds != null)
				idsFetcher = new CSVTicketIdsFetcher(ticketIds);

			ExecuteWorkflowDeferredTask task = new ExecuteWorkflowDeferredTask(NamespaceManager.get(), domainUserID,
					workflowID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Bulk label adding started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	@POST
	@Path("/close-tickets/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void closeTickets(@PathParam("domain_user_id") Long domainUserID, @FormParam("filter_id") Long filterID,
			@FormParam("ticket_ids") String ticketIds, @FormParam("tracker") String tracker)
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

			if (filterID != null)
				idsFetcher = new FilterTicketIdsFetcher(filterID);
			else if (ticketIds != null)
				idsFetcher = new CSVTicketIdsFetcher(ticketIds);

			CloseTicketsDeferredTask task = new CloseTicketsDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Bulk label adding started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	@POST
	@Path("/delete-tickets/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void deleteTickets(@PathParam("domain_user_id") Long domainUserID, @FormParam("filter_id") Long filterID,
			@FormParam("ticket_ids") String ticketIds, @FormParam("tracker") String tracker)
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

			if (filterID != null)
				idsFetcher = new FilterTicketIdsFetcher(filterID);
			else if (ticketIds != null)
				idsFetcher = new CSVTicketIdsFetcher(ticketIds);

			DeleteTicketsDeferredTask task = new DeleteTicketsDeferredTask(NamespaceManager.get(), domainUserID);

			TicketBulkActionUtil.executeBulkAction(idsFetcher, task);

			BulkActionNotifications.publishNotification("Bulk label adding started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}