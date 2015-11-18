package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.ticket.deferred.AddLabelsDeferredTask;
import com.agilecrm.ticket.entitys.TicketActivity;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketActivity.TicketActivityType;
import com.agilecrm.ticket.utils.TicketBulkActionUtil.TicketBulkActionType;
import com.agilecrm.ticket.utils.TicketIdsFetcher;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

import edu.emory.mathcs.backport.java.util.Arrays;

/**
 * 
 * @author Sasi 30-Sep-2015
 * 
 */
@Path("/api/bulk-actions/tickets")
public class TicketBulkActionsBackendsRest
{
	@POST
	@Path("/add-tags/{domain_user_id}")
	@Produces(MediaType.APPLICATION_FORM_URLENCODED)
	public void manageTags(@PathParam("domain_user_id") Long domainUserID,
			@FormParam("action_type") TicketBulkActionType action_type, @FormParam("ticket_ids") String ticketIDs,
			@FormParam("filter_id") Long filterID, @FormParam("data") String dataString,
			@FormParam("tracker") String tracker)
	{
		try
		{
			System.out.println("*********Request reached to backend*********");
			System.out.println("filterID.." + filterID);
			System.out.println("action_type.." + action_type);
			System.out.println("ticket_ids.." + ticketIDs);
			System.out.println("domain_user_id.." + domainUserID);
			System.out.println("NamespaceManager.." + NamespaceManager.get());

			JSONObject dataJSON = new JSONObject(dataString);
			System.out.println("dataJSON: " + dataJSON);

			String[] tagsArray = dataJSON.getString("tags").split(",");

			List<Tag> tags = new ArrayList<Tag>();

			for (String tagString : tagsArray)
				tags.add(new Tag(tagString));

			BulkActionUtil.setSessionManager(domainUserID);

			// Logging bulk action activity
			new TicketActivity(TicketActivityType.BULK_ACTION, null, null, "", tags.toString(), "tags").save();

			if (filterID != null)
			{
				TicketIdsFetcher idsFetcher = new TicketIdsFetcher(filterID);

				while (idsFetcher.hasNext())
				{
					Set<Key<Tickets>> ticketsSet = idsFetcher.next();

					System.out.println("ticketsSet found: " + ticketsSet.size());

					AddLabelsDeferredTask task = new AddLabelsDeferredTask(tags, NamespaceManager.get(), domainUserID,
							ticketsSet);

					Queue queue = QueueFactory.getQueue(AgileQueues.TICKET_BULK_ACTIONS_QUEUE);
					queue.add(TaskOptions.Builder.withPayload(task));
				}
			}
			else
			{
				List<String> ticketsList = Arrays.asList(ticketIDs.split(","));
				int maxFetch = 200, fetchedCount = 0, fromIndex = 0, toIndex = maxFetch, totalTicketsSelected = ticketsList
						.size();

				do
				{
					List<String> subList = null;

					try
					{
						subList = ticketsList.subList(fromIndex, toIndex);
					}
					catch (Exception e)
					{
						subList = ticketsList.subList(fromIndex, totalTicketsSelected);
					}

					if (subList == null || subList.size() == 0)
						break;

					fromIndex += maxFetch;
					toIndex += maxFetch;
					fetchedCount += subList.size();

					Set<Key<Tickets>> ticketIDList = new HashSet<Key<Tickets>>();

					for (String key : subList)
					{
						ticketIDList.add(new Key<Tickets>(Tickets.class, Long.parseLong(key)));
					}

					AddLabelsDeferredTask task = new AddLabelsDeferredTask(tags, NamespaceManager.get(), domainUserID,
							ticketIDList);

					Queue queue = QueueFactory.getQueue(AgileQueues.TICKET_BULK_ACTIONS_QUEUE);
					queue.add(TaskOptions.Builder.withPayload(task));

				} while (fetchedCount < totalTicketsSelected);
			}

			BulkActionNotifications.publishNotification("Bulk label adding started");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}