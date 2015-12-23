package com.agilecrm.ticket.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.agilecrm.ticket.imports.ZendeskImport;

@Path("/api/bulk-actions/tickets/imports")
public class TicketImportsRest
{
	@POST
	@Path("/zendesk")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public void importZendeskTickets(@FormParam("data") String data)
	{
		try
		{
			ZendeskImport.fetchTickets(new JSONObject(data));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}
