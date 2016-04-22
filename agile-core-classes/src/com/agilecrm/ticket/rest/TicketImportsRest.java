package com.agilecrm.ticket.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.deferred.CreateTestTickets;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

@Path("/api/ticket-module/backend/imports")
public class TicketImportsRest
{
	@POST
	@Path("/zendesk")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void importZendeskTickets(@FormParam("data") String data)
	{
		try
		{
			System.out.println("data: " + data);
			// ZendeskImport.fetchTickets(new JSONObject(data));
			CreateTestTickets ticket = new CreateTestTickets();

			Queue queue = QueueFactory.getQueue("ticket-bulk-actions");
			queue.add(TaskOptions.Builder.withPayload(ticket));
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}
