package com.agilecrm.ticket.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.exception.ExceptionUtils;
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
			System.out.println(e.getMessage());
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}
}
